# ColdStart Web Application - Getting started

## Personal comment
All code written to solve this challenge can be found in this **\completed** folder. 

The code is written very quickly in a few spare hours, with the goal to learn and experiment with Azure functionality in a kind of quick hackaton/poc way. 
No attention was paid to refactoring, catching errors, or cleaning up code, since 2 weeks later the clean solution will be published by ColdStart-Challenge anyway. 

Vue.js and node.js are not my usual frameworks, so I'm very well aware code could be written much-much more optimal. 

See all the way at the bottom of this readme also for manually run commands for this part of the challenge ("**My solution challenge 1**"). 

The site is published at: https://calm-forest-037926d03.azurestaticapps.net

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


 ## My solution challenge 1: Running the application on Azure

 - Create an Azure Static Web App in the portal, as seen here: https://docs.microsoft.com/en-us/azure/static-web-apps/get-started-portal?tabs=vue. 

   Doing this will create the CI/CD file, found in /.github/workflows. Make sure to adapth the source files path to the challenge you wish to deploy. 

- Create a storage account, as seen here: https://docs.microsoft.com/en-us/azure/storage/common/storage-account-create?tabs=azure-portal

  Add the storage connection string in a environment variable on the static web app, called: AZURE_STORAGE_CONNECTION_STRING