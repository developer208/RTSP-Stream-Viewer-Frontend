# syntax=docker/dockerfile:1

# ---- Build stage: compile the React app to static files ----
FROM node:24-alpine AS build
WORKDIR /app

# Install dependencies first so this layer is cached until package files change.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Vite bakes VITE_* values into the JavaScript at build time. Left empty, the app
# calls the API on the same address it was loaded from; the server's nginx then
# forwards /api and /ws to the backend. Set it only if the API is on another domain.
ARG VITE_API_URL=""
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# ---- Delivery stage: a tiny image that only carries the build output ----
# There is no web server in here. nginx is installed on the server itself and
# serves a folder; running this image copies the build into that folder:
#
#   docker run --rm -v /var/www/rtsp-stream-viewer:/site <image>
FROM busybox:1.37
COPY --from=build /app/dist /dist
# Replace the folder's contents with this build, then exit.
CMD ["sh", "-c", "rm -rf /site/* && cp -r /dist/. /site/ && echo \"Published $(find /site -type f | wc -l) files to the site folder\""]
