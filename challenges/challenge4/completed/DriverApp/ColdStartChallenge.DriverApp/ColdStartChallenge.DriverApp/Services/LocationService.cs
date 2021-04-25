using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xamarin.Essentials;

namespace ColdStartChallenge.DriverApp.Services
{
    public class LocationService
    {
        private CancellationTokenSource _cts;

        public async Task<Location> GetLocation()
        {
            try
            {
                // *** GET THE CURRENT LOCATION ***

                var status = await Permissions.RequestAsync<Permissions.LocationWhenInUse>();
                if (status == PermissionStatus.Granted)
                {
                    var request = new GeolocationRequest(GeolocationAccuracy.Medium, TimeSpan.FromSeconds(10));
                    _cts = new CancellationTokenSource();
                    var location = await Geolocation.GetLocationAsync(request, _cts.Token);

                    if (location != null)
                    {
                        Console.WriteLine($"Latitude: {location.Latitude}, Longitude: {location.Longitude}, Altitude: {location.Altitude}");
                        return location;
                    }
                }
                else
                {
                    Console.WriteLine("User didn't grant access to location");
                    return null;
                }

            }
            catch (Exception ex)
            {
            }
            finally
            {
                if (_cts != null)
                {
                    _cts.Dispose();
                    _cts = null;
                }
            }
            return null;
        }

        public async Task<(Location currentLocation, Placemark place)?> GetLocationDetail()
        {
            try
            {
                // *** GECODE THE CURRENT LOCATION **
                var location = await GetLocation();
                if(location != null)
                {
                    var firstPlacemark = (await Geocoding.GetPlacemarksAsync(location.Latitude, location.Longitude)).FirstOrDefault();
                    return (location, firstPlacemark);
                }
            }
            catch (Exception ex)
            {               
            }
            finally
            {
                if (_cts != null)
                {
                    _cts.Dispose();
                    _cts = null;
                }
            }
            return null;
        }
    }
}
