# ColdStart Web Application - Getting started

## Introduction

This is a starter web application for Azure Static Web Apps. It consists of two components:

- Vue.js frontend
- Node.js backend apis, running on Azure Functions


## Running the solution locally

### Frontend

The frontend application is developed using Vue.js. It will communicate directly with the backend APIs included in the starter application.

```cmd
cd vue-app
npm install
npm run serve
```

### Backend APIs

The backend APIs are hosted using Azure Functions and can be run locally using the Azure Functions Core Tools.

```cmd
cd api
npm install
npm start
```

## Prerequisites

- ✅ [Visual Studio Code](https://code.visualstudio.com?ocid=aid3027557)
- ✅ [Aure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?ocid=aid3027557)


 ## Running the application on Azure: 

 - Create an Azure Static Web App in the portal, as seen here: https://docs.microsoft.com/en-us/azure/static-web-apps/get-started-portal?tabs=vue. 

   Doing this will create the CI/CD file, found in /.github/workflows. Make sure to adapth the source files path to the challenge you wish to deploy. 

- Create a storage account, as seen here: https://docs.microsoft.com/en-us/azure/storage/common/storage-account-create?tabs=azure-portal

  Add the storage connection string in a environment variable on the static web app, called: AZURE_STORAGE_CONNECTION_STRING