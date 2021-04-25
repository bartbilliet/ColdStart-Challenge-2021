using OrderTrackingApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace OrderTrackingApp.Pages
{
    partial class Index
    {
        private Order[] orders;

        protected override async Task OnInitializedAsync()
        {
            //TODO: replace with my-orders after auth implementation
            orders = await Http.GetFromJsonAsync<Order[]>("https://bbdevcoldstartchallenge.azurewebsites.net/api/orders");
        }
    }
}
