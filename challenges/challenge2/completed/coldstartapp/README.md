# ColdStart Web Application - Challenge 1 Solution

## Personal comment
All code written to solve this challenge can be found in this **\completed** folder. 

The code is written very quickly in a few spare hours, with the goal to learn and experiment with Azure functionality in a kind of quick hackaton/poc way. 
No attention was paid to refactoring, catching errors, or cleaning up code, since 2 weeks later the clean solution will be published by ColdStart-Challenge anyway. 

Vue.js and node.js are not my usual frameworks, so I'm very well aware code could be written much-much more optimal. 

See all the way at the bottom of this readme also for manually run commands for this part of the challenge ("**My solution challenge 2**"). 

The site is published at: https://calm-forest-037926d03.azurestaticapps.net


## Introduction

This is a possible solution for the first coding challenge. The objectives were the following:

1. Build and host a website on Azure Static Websites. 
2. Only authenticated users can pre-order items.
3. The customer pre-order JSON document needs to be stored in Azure Queue Storage.

## Solution

The Static Web Applicaton is based on the started web application and uses Vue.js as the front-end technology and Node.js for the backend Azure Function-based APIs.

### Authentication

To authenticate users in an Azure Static Web App, get started by reading the [general concepts](https://docs.microsoft.com/en-us/azure/static-web-apps/authentication-authorization?ocid=aid3027557). Authentication using a number of existing identity providers is handled automatically by the platform.

In our application, we will not define specific roles but rely on the built-in roles: `anonymous` and `authenticated`. All identity providers are enabled by default. If you want to disable a provider, you can specify this in the `routes.json` file.

```json
{
  "routes": [
    {
      "route": "/.auth/login/facebook",
      "statusCode": "404"
    },
    {
      "route": "/.auth/login/google",
      "statusCode": "404"
    }
  ]
}
```

To retrieve the current user information, you make a request to the `/.auth/me` api endpoint. The starter application already contains a helper function `getUserInfo()`, which will return the user details when logged in, or `undefined` when not authenticated.

```javascript
async function getUserInfo() {
  try {
    console.log('getUserInfo');
    const response = await fetch('/.auth/me');
    const payload = await response.json();
    const { clientPrincipal } = payload;
    console.log(clientPrincipal);
    return clientPrincipal;
  } catch (error) {
    console.error('No profile could be found');
    return undefined;
  }
}
```

You can then use this information in the user interface to selectively enable the pre-order button, depending on the authentication status. For example, in the `catalog-list.vue` we use the `v-if` attribute:

```html
<script>
import getUserInfo from '../../assets/js/userInfo';
...
export default {
  name: 'CatalogList',
  ...
  data() {
    return {
      userInfo: {
        type: Object,
        default() {},
      },
    };
  },
  async created() {
    this.userInfo = await getUserInfo();
  },
};
</script>

<footer class="card-footer">
  <ButtonFooter
    class="edit-item"
    iconClasses="fas fa-shopping-cart"
    @clicked="buyIceCream"
    label="Pre-order"
    :dataIndex="index"
    :dataId="icecream.Id"
    :item="icecream"
    v-if="userInfo"
  />
</footer>
```

In the backend APIs, the user information is available in the `x-ms-client-principal` HTTP request header, as a Base-64 encoded JSON string. The starter application already has a `getUser` helper function defined to retrieve the user information:

```javascript
const getUser = (req) => {
    const header = req.headers["x-ms-client-principal"];
    if (header != undefined) {
        const encoded = Buffer.from(header, "base64");
        const decoded = encoded.toString("ascii");

        return JSON.parse(decoded);
    } else {
        return { userDetails: "John Doe" };
    }
};
```

### Queueing the order

In Azure Functions you have the concept of *Bindings*. Binding to a function is a way of declaratively connecting another resource to the function; bindings may be connected as input bindings, output bindings, or both. Bindings let you avoid hardcoding access to other services. Your function receives data (for example, the content of a queue message) in function parameters. You send data (for example, to create a queue message) by using the return value of the function.

In this challenge, we specify an *output binding* for an [Azure Queue](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-queue?ocid=aid3027557). This is configured in the `function.json` file:

```json
{
  "bindings": [
    {
      "type": "queue",
      "direction": "out",
      "name": "myQueueItem",
      "queueName": "customer-orders",
      "connection": "AZURE_STORAGE_CONNECTIONSTRING"
    }
  ]
}
```

The connection string for the Azure Queue is referred to using an application setting `AZURE_STORAGE_CONNECTIONSTRING`. When running locally, you need to specify this setting in the `local.settings.json` file - when deploying in Azure, you will configure an application setting in the Azure portal.

To actually write a message to the queue in the function logic, we can refer to it through the `context.bindings` object in the function implementation. The name specified in the function configuration (`myQueueItem`), gives us access to the specific queue.

```javascript
context.bindings.myQueueItem = order;
```

## Running the solution locally

### Frontend

```cmd
cd vue-app
npm install
npm run serve
```

### Backend APIs

```cmd
cd api
npm install
npm start
```

## My solution challenge 2: Inserting all IceCreams from catalog.json into Azure SQL (manually executed)

```SQL
DECLARE @Json AS NVARCHAR(MAX) = '{
    "icecreams": [
        {
            "Id": 1,
            "Name": "Color Pop",
            "Description": "Delicious 4-color popsicle, plenty of vitamins.",
            "ImageUrl": "https://coldstartsa.blob.core.windows.net/web/assets/Icecream1.png"
        },
        {
            "Id": 2,
            "Name": "Lemoncella",
            "Description": "Refreshing lemon-flavoured icecream bar.",
            "ImageUrl": "https://coldstartsa.blob.core.windows.net/web/assets/Icecream2.png"
        },
        {
            "Id": 3,
            "Name": "Pink Panther",
            "Description": "Fruity ice cream bar with hints of strawberry and lime.",
            "ImageUrl": "https://coldstartsa.blob.core.windows.net/web/assets/Icecream3.png"
        },
        {
            "Id": 4,
            "Name": "Choco Chique",
            "Description": "Filled with praline and covered with the finest Belgian chocolate.",
            "ImageUrl": "https://coldstartsa.blob.core.windows.net/web/assets/Icecream4.png"
        },
        {
            "Id": 5,
            "Name": "Blue Lagoon",
            "Description": "Blueberry and melon ice cream bar.",
            "ImageUrl": "https://coldstartsa.blob.core.windows.net/web/assets/Icecream5.png"
        },
        {
            "Id": 6,
            "Name": "Purple Rain",
            "Description": "Indulging strawberry and vodka icecream bar.",
            "ImageUrl": "https://coldstartsa.blob.core.windows.net/web/assets/Icecream6.png"
        },
        {
            "Id": 7,
            "Name": "Sorbonne",
            "Description": "Strawberry and raspberry sorbet.",
            "ImageUrl": "https://coldstartsa.blob.core.windows.net/web/assets/Icecream7.png"
        },
        {
            "Id": 8,
            "Name": "Sandstorm",
            "Description": "Chocolate and vanille ice cream cookie (3).",
            "ImageUrl": "https://coldstartsa.blob.core.windows.net/web/assets/Icecream8.png"
        },
        {
            "Id": 9,
            "Name": "Maxi jazz",
            "Description": "Dame Blanche flavoured ice cream cake (6p).",
            "ImageUrl": "https://coldstartsa.blob.core.windows.net/web/assets/Icecream9.png"
        },
        {
            "Id": 10,
            "Name": "Triplets",
            "Description": "Surprise yourself with a random selection of 3 different flavors.",
            "ImageUrl": "https://coldstartsa.blob.core.windows.net/web/assets/Icecream10.png"
        }
    ]
}'

INSERT INTO [dbo].[Icecreams]
	SELECT * 
	FROM OPENJSON(@Json, N'$.icecreams') 
	WITH (       
			[Id] int, 
			[Name] nvarchar(255), 
			[Description] nvarchar(2000), 
			[ImageUrl] nvarchar(2000)
	)
  ```

## My solution challenge 2: Create personalizer resource in Azure: 
1. https://docs.microsoft.com/en-us/azure/cognitive-services/personalizer/how-to-create-resource
2. https://docs.microsoft.com/en-us/azure/cognitive-services/personalizer/how-to-settings

## My solution challenge 2: To run this code, following environment variables need to be set: 
- AZURE_STORAGE_CONNECTIONSTRING
- DBUSER
- DBPASS
- DBSERVER
- DBNAME
- PERSONALIZERSERVICEKEY
- PERSONALIZERBASEURI ("https://" + PERSONALIZERBASEURI + ".cognitiveservices.azure.com")
