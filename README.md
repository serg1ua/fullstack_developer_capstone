# Fullstack Developer Capstone

## Deploy IBM cloud

### Delete existent deployments

`kubectl get deployments`

`kubectl delete deployment dealership`

`ibmcloud cr images`

`ibmcloud cr image-rm us.icr.io/<your sn labs namespace>/dealership:latest && docker rmi us.icr.io/<your sn labs namespace>/dealership:latest`

`ibmcloud ce application get -n {app_name}`

### Build image

`MY_NAMESPACE=$(ibmcloud cr namespaces | grep sn-labs-)`
`echo $MY_NAMESPACE`

`docker build -t us.icr.io/$MY_NAMESPACE/dealership .`

`docker push us.icr.io/$MY_NAMESPACE/dealership`
