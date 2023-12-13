#!/bin/bash
#
# Production deployment script
#

export $(grep -v '^#' .prod.env | xargs)

# create docker secret
kubectl delete secret regcred -n $NAMESPACE --kubeconfig=$KUBECONFIG
kubectl create secret docker-registry -n $NAMESPACE \
    regcred \
    --docker-server=$DOCKER_REGISTRY_SERVER \
    --docker-username=$DOCKER_REGISTRY_USERNAME \
    --docker-password=$DOCKER_REGISTRY_PASSWORD \
    --kubeconfig=$KUBECONFIG

# build and push images
docker build -t $DOCKER_REGISTRY_USERNAME/$DOCKER_REGISTRY_REPOSITORY:${VERSION} -f Dockerfile.prod .
docker push $DOCKER_REGISTRY_USERNAME/$DOCKER_REGISTRY_REPOSITORY:${VERSION}

# Deploy new version
cd infrastructure/prod
kubectl kustomize . > run.yaml
sed -i "s/IMAGE_TAG/${VERSION}/g" run.yaml
kubectl apply -f run.yaml --kubeconfig=$KUBECONFIG