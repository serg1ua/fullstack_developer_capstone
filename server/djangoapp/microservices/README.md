# Sentiment Analyzer Microservice

- Build

`docker build . -t us.icr.io/${SN_ICR_NAMESPACE}/senti_analyzer`

- Push

`docker push us.icr.io/${SN_ICR_NAMESPACE}/senti_analyzer`

- Deploy

`ibmcloud ce application create --name sentianalyzer --image us.icr.io/${SN_ICR_NAMESPACE}/senti_analyzer --registry-secret icr-secret --port 5000`

- Check deployment

`ibmcloud ce application get -n {app_name}`

<!-- https://marxserua-8000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/dealer/21 -->
