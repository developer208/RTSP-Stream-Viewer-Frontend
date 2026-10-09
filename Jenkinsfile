// Runs on every push to GitHub: builds the frontend, publishes the build as an
// image on Docker Hub and, when an EC2 host is given, copies the build into the
// folder that the server's own nginx serves.
//
// Jenkins setup this pipeline expects:
//   - Job type "Pipeline" with "Pipeline script from SCM", Script Path: Jenkinsfile
//   - Docker installed on the Jenkins machine, usable by the jenkins user
//   - Credential "dockerhub": Username with password (Docker Hub username + access token)
//   - Credential "ec2-ssh":   SSH Username with private key (only needed for the deploy stage)
//   - Plugins: Pipeline, Git, GitHub, Credentials Binding, SSH Credentials
//   - "GitHub hook trigger for GITScm polling" enabled on the job, and a webhook in the
//     GitHub repository pointing at http://<jenkins-address>/github-webhook/
//
// Server setup it expects on EC2: Docker and nginx installed, with nginx's `root`
// set to SITE_DIR and the SSH user allowed to run docker.

pipeline {
    agent any

    triggers {
        // Start a build whenever GitHub reports a push.
        githubPush()
    }

    options {
        disableConcurrentBuilds()
        timeout(time: 20, unit: 'MINUTES')
    }

    parameters {
        string(name: 'IMAGE_NAME', defaultValue: 'skylark-frontend',
               description: 'Repository name on Docker Hub, without the username')
        string(name: 'EC2_HOST', defaultValue: '',
               description: 'Public DNS or IP of the EC2 instance. Leave empty to build and push without deploying.')
        string(name: 'SITE_DIR', defaultValue: '/var/www/rtsp-stream-viewer',
               description: 'Folder on EC2 that nginx serves. The build is copied into it.')
    }

    environment {
        // Each build gets its own tag so a bad release can be rolled back to the previous number.
        TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Build image') {
            steps {
                // The Dockerfile runs `npm ci` and `npm run build`, which type-checks
                // the code, so a TypeScript error fails the pipeline here.
                sh 'docker build -t "$IMAGE_NAME:$TAG" .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub',
                                                  usernameVariable: 'DOCKERHUB_USER',
                                                  passwordVariable: 'DOCKERHUB_TOKEN')]) {
                    sh '''
                        echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USER" --password-stdin
                        docker tag "$IMAGE_NAME:$TAG" "$DOCKERHUB_USER/$IMAGE_NAME:$TAG"
                        docker tag "$IMAGE_NAME:$TAG" "$DOCKERHUB_USER/$IMAGE_NAME:latest"
                        docker push "$DOCKERHUB_USER/$IMAGE_NAME:$TAG"
                        docker push "$DOCKERHUB_USER/$IMAGE_NAME:latest"
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
            when {
                expression { params.EC2_HOST?.trim() }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub',
                                                  usernameVariable: 'DOCKERHUB_USER',
                                                  passwordVariable: 'DOCKERHUB_TOKEN'),
                                 sshUserPrivateKey(credentialsId: 'ec2-ssh',
                                                   keyFileVariable: 'EC2_KEY',
                                                   usernameVariable: 'EC2_USER')]) {
                    // Pull the exact tag just pushed and run it once: the container
                    // copies the build into the folder nginx serves, then exits.
                    // nginx needs no restart, as it reads the files on each request.
                    sh '''
                        ssh -i "$EC2_KEY" -o StrictHostKeyChecking=accept-new "$EC2_USER@$EC2_HOST" "
                            set -e
                            docker pull $DOCKERHUB_USER/$IMAGE_NAME:$TAG
                            docker run --rm -v $SITE_DIR:/site $DOCKERHUB_USER/$IMAGE_NAME:$TAG
                        "
                    '''
                }
            }
        }
    }

    post {
        always {
            // Do not leave the Docker Hub login or old build images on the Jenkins machine.
            sh 'docker logout || true'
            sh 'docker image rm "$IMAGE_NAME:$TAG" || true'
        }
    }
}
