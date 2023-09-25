#!/bin/bash

VERSION=v1

export $(grep -v '^#' ../../.prod.env | xargs)

echo $DOCKER_REGISTRY_PASSWORD | docker login --username $DOCKER_REGISTRY_USERNAME --password-stdin

cd ../../.
docker build -t kallepan/pcr-oe-frontend:${VERSION} -f Dockerfile.prod .
docker push kallepan/pcr-oe-frontend:${VERSION}

cd infrastructure/prod
kubectl --kubeconfig=$KUBECONFIG kustomize . > run.yaml
sed -i "s/IMAGE_TAG/${VERSION}/g" run.yaml
kubectl --kubeconfig=$KUBECONFIG apply -f run.yaml
