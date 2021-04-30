# Crypto-Tracker-Backend

This Crypto-Tracker-Backend API is used respond the requests regards to cryptos.

### The the API-Endpoints are in the postman data:

1. Get All trades

https://{{apiId}}.execute-api.eu-central-1.amazonaws.com/dev/trades

2. Get All trades at specific exchange, e.g.: binnance

https://{{apiId}}.execute-api.eu-central-1.amazonaws.com/dev/trades/exchange/crypto.com

3. Get All trades done with a specific crypto

https://{{apiId}}.execute-api.eu-central-1.amazonaws.com/dev/trades/crypto/one

4. Get All trades at specific date intervall

https://{{apiId}}.execute-api.eu-central-1.amazonaws.com/dev/trades/date/start/2021-04-26/end/2021-04-28

5. Create Trades

https://{{apiId}}.execute-api.eu-central-1.amazonaws.com/dev/trades

6. Update Trades

https://{{apiId}}.execute-api.eu-central-1.amazonaws.com/dev/trades/16692403-5c73-4c0e-9411-c6d31460f45c

7. Delete Trades

https://{{apiId}}.execute-api.eu-central-1.amazonaws.com/dev/trades/513f70d9-ff84-4b9b-b065-14fcff2ade00

8. Upload User Image Profile

https://{{apiId}}.execute-api.eu-central-1.amazonaws.com/dev/trades/bfd12537-7d05-4670-939c-b6bf0c43a361/attachment

## Serverless AWS

- Build using serverless and optimized to AWS
- All the resources in the API are defined in the "serverless.yml" file
- Security: each function has its own set of permissions
- Distributed tracing is enable
- Log using Winston
- Http requests are validate through plugin and schemas
- Data is store using DynamoDB with composite and LSK
- Offline debug
- Optimized function with specific .zip package
- Canary Deployment
- Optimization (reduzed lambda)

## Technologies

We are using:

- Nodejs
- Typescript
- Serverless
- AWS + Many services

And To keep the same standard code between programmers we are using:

> - Prettier: for code auto formatter
> - ESLint: to find and fix problems in the code

## Further improvements

We are still integrating it in the frontend app.
