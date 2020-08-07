# Account Management Server

Account Management Server is an small microservice developed to allow in a simple way register/login users and authenticate request on external services to solve the JobSity Challenge. 

The idea behind this microservice is the OAuth2 standard, but this isn't OAuth2 implementation. The service handle three type of users, and for each type of user handle a virtual role to allow external services restrict access by user type. In this implementation the generated access token don't have expiration time and its only relationed with the account.

## Installation of the service

- Clone the repository
```
git clone https://gitlab.com/jobsity1/challenge/accounts-server.git
```
- Install dependencies
```
cd accounts-server
npm install
```
- Build the project
```
npm run build
```
- Setup initial database (see next section for environment variables)
```
npm run setup
```
Initial database configuration generate by defaul five users:

* [User: jdoe@challenge.com; Password: challenge*2020] (Administrator)
* [User: janedoe@challenge.com; Password: challenge*2020]
* [User: chat@challenge.com; Password: challenge*2020]
* [User: web@challenge.com; Password: challenge*2020]
* [User: bot@challenge.com; Password: challenge*2020]

## Running the service

The service can be runned directly from the command line with:
```bash
npm start
```
or it can be build and runned watching for file changes
```
npm run dev
```

To run the service there are some environment variables that can be used to configure it:

* `LOG`: Set the vebose level of the service debugger, allowed values are: error, warn, info, http, verbose, debug, silly (Default: debug)
* `PORT`: Set the running port for the HTTP server (Default: 3000)
* `INTERFACE`: Set the HTTP server listening interface (Default: 127.0.0.1)
* `ENV`: Set the service running mode, allowd values are: dev, production (Default: dev)
* `INSTANCES`: Set the number o workers runing into the cluster (Default: 1)
* `MONGODB_URI`: Set the MongoDB database connection URI (Default: mongodb://127.0.0.1:27017/accounts_srv)


## Documentation

The project its distributed with a `docs` folder. This folder contains the Postman Collection with examples for each request and the API Documentation generated with `apidoc`. To regenerate the documentation run the following command:

```bash
npm run apidoc
```
