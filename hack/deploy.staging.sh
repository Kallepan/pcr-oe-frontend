#!/bin/bash

export $(grep -v '^#' .staging.env | xargs)

# create docker secret
kubectl delete secret regcred -n $NAMESPACE --kubeconfig=$KUBECONFIG
kubectl create secret docker-registry -n $NAMESPACE \
    regcred \
    --docker-server=$DOCKER_REGISTRY_SERVER \
    --docker-username=$DOCKER_REGISTRY_USERNAME \
    --docker-password=$DOCKER_REGISTRY_PASSWORD \
    --kubeconfig=$KUBECONFIG

# Delete old deployments
kubectl delete deployment $DOCKER_REGISTRY_REPOSITORY -n $NAMESPACE --kubeconfig=$KUBECONFIG

# build and push images
docker build -t $DOCKER_REGISTRY_USERNAME/$DOCKER_REGISTRY_REPOSITORY:${VERSION} .
docker push $DOCKER_REGISTRY_USERNAME/$DOCKER_REGISTRY_REPOSITORY:${VERSION}

# Deploy new version
cd infrastructure/staging
kubectl kustomize . > run.yaml
sed -i "s/IMAGE_TAG/${VERSION}/g" run.yaml
kubectl apply -f run.yaml --kubeconfig=$KUBECONFIG