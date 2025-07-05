#!/bin/bash

# Requies jq to be installed beforehand
# sudo apt install jq     # Debian/Ubuntu
# sudo yum install jq     # RHEL/CentOS
# brew install jq         # macOS/WSL

VERSION=$(jq -r .version package.json)

if [[ -z "$VERSION" ]]; then
  echo "❌ Can't find version in package.json"
  exit 1
fi

IMAGE_NAME="ksjaay/lunalytics"

echo "🚀 Building and pushing Docker image:"
echo "  - $IMAGE_NAME:$VERSION"
echo "  - $IMAGE_NAME:latest"

docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --tag "$IMAGE_NAME:$VERSION" \
  --tag "$IMAGE_NAME:latest" \
  --push .
