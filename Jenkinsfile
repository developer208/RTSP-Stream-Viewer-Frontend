// Runs on every push to GitHub: builds the frontend, publishes the build as an
// image on Docker Hub, and copies the build into the folder that nginx serves.
// Jenkins, Docker and nginx all run on the same server.
//
// Jenkins setup this pipeline expects:
//   - Job type "Pipeline" with "Pipeline script from SCM", Script Path: Jenkinsfile
//   - Docker installed on the server, with the jenkins user in the "docker" group
//   - Credential "dockerhub": Username with password (Docker Hub username + access token)
//   - Plugins: Pipeline, Git, GitHub, Credentials Binding
//   - "GitHub hook trigger for GITScm polling" enabled on the job, and a webhook in the
//     GitHub repository pointing at http://<jenkins-address>/github-webhook/
//   - nginx installed on the server with its `root` set to SITE_DIR

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

    environment {
        // Repository name on Docker Hub, without the username.
        IMAGE_NAME = 'rtsp-frontend'
        // Folder that nginx serves. The build is copied into it.
        SITE_DIR = '/var/www/rtsp-stream-viewer'
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

        stage('Publish to nginx') {
            steps {
                // Jenkins runs on the same server as nginx, so no SSH is needed. Running
                // the image once copies the build into the folder nginx serves, then the
                // container exits. nginx needs no restart: it reads the files on each request.
                sh 'docker run --rm -v "$SITE_DIR:/site" "$IMAGE_NAME:$TAG"'
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
