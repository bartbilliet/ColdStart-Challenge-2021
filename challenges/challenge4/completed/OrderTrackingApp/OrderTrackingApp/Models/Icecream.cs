using System;
using Newtonsoft.Json;

namespace OrderTrackingApp.Models
{
    public partial class Icecream
    {
        [JsonProperty("icecreamId")]
        public int IcecreamId { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("imageUrl")]
        public Uri ImageUrl { get; set; }
    }
}