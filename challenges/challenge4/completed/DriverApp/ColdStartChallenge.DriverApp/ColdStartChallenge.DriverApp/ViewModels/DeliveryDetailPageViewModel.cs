using System;
using System.Linq;
using System.Threading.Tasks;
using Acr.UserDialogs;
using ColdStartChallenge.DriverApp.Models;
using ColdStartChallenge.DriverApp.Navigation;
using ColdStartChallenge.DriverApp.Services;
using Xamarin.CommunityToolkit.ObjectModel;
using Xamarin.Forms;

namespace ColdStartChallenge.DriverApp.ViewModels
{
    public class DeliveryDetailPageViewModel : ViewModelBase
    {
        private readonly OrderService _orderService;
        private readonly DriverService _driverService;

        private Guid _orderId;

        // *** ADD THE NEEDED PROPERTIES AND COMMAND FOR MVVM BINDING ***
        public Order Order { get; set; }

        private OrderStatus _orderStatus;
        public OrderStatus Status
        {
            get => _orderStatus;
            set
            {
                if (_orderStatus != value)
                {
                    _orderStatus = value;
                    RaisePropertyChanged();
                }
            }
        }

        private Boolean _isStatusVisible;
        public Boolean IsStatusVisible
        {
            get => _isStatusVisible;
            set
            {
                if (_isStatusVisible != value)
                {
                    _isStatusVisible = value;
                    RaisePropertyChanged();
                }
            }
        }

        public DeliveryDetailPageViewModel(INavigation navgiation, Guid orderId, OrderStatus orderStatus)
            : base(navgiation)
        {
            _orderService = new OrderService();
            _driverService = new DriverService();
            _orderId = orderId;
            _orderStatus = orderStatus;
        }

        protected override async Task OnNavigatedTo(NavigationMode mode)
        {
            if (mode == NavigationMode.New)
            {
                IsBusy = true;

                await LoadOrder(_orderId, _orderStatus);

                IsBusy = false;
            }
        }

        private async Task LoadOrder(Guid orderId, OrderStatus orderStatus)
        {
            // *** GET THE ORDER DETAILS **
            Order = await _orderService.GetOrder(orderId, orderStatus);
            RaisePropertyChanged(nameof(Order));

            if(Order != null)
            {
                //Only allow to make the accept for delivery button visible when the status is 'ready' by the factory
                if (Order.OrderStatus == OrderStatus.Ready)
                {
                    IsStatusVisible = true;
                }
                else
                {
                    IsStatusVisible = false;
                }
            }

        }

        public IAsyncCommand SaveCommand => new AsyncCommand(OnSave);
        private async Task OnSave()
        {
            // *** SAVE THE CURRENT ORDER WITH IT'S NEW STATE
            Order.OrderStatus = OrderStatus.Delivering;

            Console.WriteLine(AppData.Instance.User);
            Order.Driver = AppData.Instance.User;

            await _orderService.UpdateOrder(Order);
        }

    }
    
}