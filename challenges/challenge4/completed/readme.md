# ColdStart Web Application - Challenge 4 Solution

## Personal comment
All code written to solve this challenge can be found in this **\completed** folder. 

The code is written very quickly in a few spare hours, with the goal to learn and experiment with Azure functionality in a kind of quick hackaton/poc way. 
No attention was paid to refactoring, catching errors, or cleaning up code, since 2 weeks later the clean solution will be published by ColdStart-Challenge anyway. 

Vue.js and node.js are not my usual frameworks, so I'm very well aware code could be written much-much more optimal. 

- The webshop is published at: https://calm-forest-037926d03.azurestaticapps.net
  - It is a vue.js front-end, and node.js back-end, hosted on Azure Static Web Apps. 
- The order tracking app is published at: https://lemon-pond-0fddb6c03.azurestaticapps.net
  - It is a Blazor front-end, and node.js back-end, hosted on Azure Static Web apps. 
- The Driver app has been tested on UWP only. 
  - It is a Xamarin front-end, and node.js back-end hosted on an Azure Functions plan. 
- There are a few background processes (queue trigger to accept new orders in the factory, timer trigger to simulate order processing by the factory, cosmosdb trigger to update order tracking via SignalR)
  - Theses background processes are hosted on the same Azure Functions plan than what the Driver App is using. Some repetition of code was unfortunately unavoidable here as Azure Static Web Apps only allow HTTP triggers (no timer, queue, cosmosdb triggers). 

## Manual activities done for this challenge: 
- Make sure your cosmosdb has a /id partition
- Insert 2 drivers in the SQL DB: 
```SQL
    INSERT INTO [dbo].[Drivers] VALUES (1, 'Daisy Driver', 'https://coldstartsa.blob.core.windows.net/web/assets/Driver1.png')
    INSERT INTO [dbo].[Drivers] VALUES (2, 'Donny Driver', 'https://coldstartsa.blob.core.windows.net/web/assets/Driver1.png')
```
- Login to the mobile app with username MADN, password can be anything (not checked).
- When using the UWP app, make sure location services in Windows is turned on, see: https://docs.microsoft.com/en-us/windows/uwp/maps-and-location/get-location#troubleshoot-your-app

