import { Component, NgZone } from '@angular/core';
import { NavController, LoadingController, ToastController,NavParams,AlertController, MenuController, Platform} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { GlobalVarService } from '../../providers/global-var';
import { ListPage } from '../list/list';
import { Screen2Page } from '../screen2/screen2';
import { Network } from '@ionic-native/network';
declare const networkinterface;
declare const serviceDiscovery;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  day :number=1;
  month:number =1;
  msg :string ="Please wait...";
  loading :any;
  friendly_name : string ='';
  signal_quality : string = '';
  signal_unit : string = '';
  data :any;
  data_s :any;
  data_d :any;

  ip_relationship : string='https://private-bbe03-rmld001.apiary-mock.com';

  wifiIP: string = "0.0.0.0";
  cellIP: string = "0.0.0.0";
  timer :any;
  ssdp_data : any;
  screen2_timer :any;
  count_fail : number = 0;
  text_box : string='';
  url_input : string='';

    constructor(public navCtrl: NavController, public authService: AuthService, public loadingCtrl: LoadingController, private toastCtrl: ToastController  , public navParams: NavParams , public globalService : GlobalVarService, private alertCtrl: AlertController, public menuCtrl: MenuController, private network: Network , private _ngZone: NgZone, public platform : Platform)  {
      this.menuCtrl.enable(false, 'side_menu');

      // watch network for a disconnect
      let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
        console.log('network was disconnected :-(');
        console.log("check"+disconnectSubscription);
        let alert = this.alertCtrl.create({
          title: 'Alert',
          subTitle: 'Please check your internet connection...',
          buttons: ['Dismiss']
        });
        alert.present();
      });

      // stop disconnect watch
      //disconnectSubscription.unsubscribe();


      // watch network for a connection
      let connectSubscription = this.network.onConnect().subscribe(() => {
        console.log('network connected!'+connectSubscription);
        // We just got a connection but we need to wait briefly
         // before we determine the connection type. Might need to wait.
        // prior to doing any api requests as well.
        setTimeout(() => {
          if (this.network.type === 'wifi') {
            console.log('we got a wifi connection, woohoo!');
          }
        }, 3000);
      });

  }
   ngOnInit() {
    setTimeout(()=>{
      this.refreshIP();
    },500);
    this.timer = setInterval(()=>{
      //this.refreshIP();
    },1000);
    //var serviceType = "ssdp:all";


    this.platform.ready().then(() => {
      console.log("Ready...");

          /*serviceDiscovery.getNetworkServices(serviceType, true, successCallback, failure);

          function successCallback(devices) {
              console.log(devices);
          }

          function failure(err) {
              alert("Error calling Service Discovery Plugin"+err);
          }*/
    });
   }

  refreshIP() {
  		console.log('refreshIP clicked');
      //getIPAddress
  		try {
  			networkinterface.getWiFiIPAddress((ip) => {
  				console.log('getWiFiIPAddress ip', ip);
  				this._ngZone.run(() => {
  					this.wifiIP = ip;
            this.globalService.wifi_IP = ip;
            clearInterval(this.timer);
  				});
  			});

  			networkinterface.getCarrierIPAddress((ip) => {
  				console.log('getCarrierIPAddress ip', ip);
            clearInterval(this.timer);
  				this._ngZone.run(() => {
  					this.cellIP = ip;
  				});
  			});
  		} catch (e) {
  			console.error(e);
  			this.wifiIP = "error , Check log";
        this.globalService.wifi_IP ='';
  		}

  	}

    on_radioChange(value)
    {
      /*console.log(value);
      if(value == "WIFI")
      {
        this.text_box='1';
      }
      else
      {
        this.text_box='';
      }*/
    }

    device_wifi_input()
    {
      //this.globalService.screen='';
        this.globalService.wifi_IP = "http://"+this.url_input+'/';
        this.showLoader();
          this.loading.setContent("Heartbeat Processing..");
        console.log("device wifi");
        this.authService.getHeartBeat().then((result) => {
          this.data = result;
          this.friendly_name = this.data.friendlyName;
          console.log(this.friendly_name);

          this.get_signal_quality();

          }, (err) => {
            this.presentToast(err);
            this.loading.dismiss();
          });
    }

    device_wifi()
    {
      //this.globalService.screen='';
      console.log(this.ip_relationship);
      this.globalService.wifi_IP = this.ip_relationship+'/';
      /*if(this.text_box == '1')
      {
        this.globalService.wifi_IP = "http://"+this.url_input;
      }*/

      this.showLoader();
        this.loading.setContent("Heartbeat Processing..");
      console.log("device wifi");
      this.authService.getHeartBeat().then((result) => {
        this.data = result;
        this.friendly_name = this.data.friendlyName;
        console.log(this.friendly_name);

        this.get_signal_quality();

        }, (err) => {
          this.presentToast(err);
          this.loading.dismiss();
        });


    }

    get_signal_quality()
    {
        this.loading.setContent("Signal quality Processing..");
      this.authService.getSignalQuality().then((result) => {

        this.data_s= result;
        this.signal_quality = this.data_s.signalQuality;
        this.signal_unit = this.data_s.unit;
        this.set_datetime();
        }, (err) => {
          this.presentToast("Something went wrong...");
          this.loading.dismiss();
        });
    }

    set_datetime()
    {
      this.loading.setContent( "Date time Processing..");
        var date = Date();
        console.log(date);
        var split_date = date.split(' ');

      /*  var day = split_date[0];
        if(day == 'Mon'){ this.day = 1;} else if( day == 'Tue'){ this.day =2;} else if(day == 'Wed'){ this.day =3;}
        else if(day == 'Thu'){ this.day =4;}else if(day == 'Fri'){ this.day =5;}else if(day == 'Sat'){this.day =6;}else if(day == 'Sun'){this.day =7;}
        console.log(this.day);
        */

        var fullYear = split_date[3];

        var day = split_date[2];

        var month = split_date[1];

        if(month == 'Jan'){ this.month = 1;} else if( month == 'Feb'){ this.month =2;} else if(month == 'Mar'){ this.month =3;}
        else if(month == 'Apr'){ this.month =4;}else if(month == 'May'){ this.month =5;}else if(month == 'Jun'){this.month =6;}else if(month == 'JUL'){this.month =7;}else if(month == 'Agu'){this.month =8;}else if(month == 'Sep'){this.month =9;}else if(month == 'Oct'){this.month =10;}else if(month == 'Nov'){this.month =11;}else if(month == 'Dec'){this.month =12;}


        var hms = split_date[4];
        var hours_split = hms.split(':');
        var hours = hours_split[0];
        var minute = hours_split[1];
        var second = hours_split[2];


      let user_Data=
      {
            "year": fullYear,
            "month": this.month,
            "day": day,
            "hour": hours,
            "minute": minute,
            "second": second
      }

    this.authService.setDateTime(user_Data).then((result) => {
        console.log(result);
        this.loading.dismiss();
        this.data_d = result;
        console.log(this.data_d.success);
        if(this.data_d.success == 'true' || this.data_d.success == true)
        {
          setTimeout(()=>{
            this.navCtrl.push(ListPage,{'name':this.friendly_name,'quality':this.signal_quality,'unit':this.signal_unit});
          },500);
        }
        }, (err) => {
            this.presentToast("Something went wrong...");
            this.loading.dismiss();
        });
    }

    showLoader(){
      this.loading = this.loadingCtrl.create({
          content: this.msg
      });

      this.loading.present();
    }

    presentToast(msg) {
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'bottom',
        dismissOnPageChange: true
      });

      setTimeout(function(){
        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
        });
      },3000)

      toast.present();
    }


    external_wifi()
    {
      localStorage.clear();
      console.log(this.network.type+"network name");
      this.showLoader();
      var serviceType = "ssdp:all";
      serviceDiscovery.getNetworkServices(serviceType, true, successCallback, failure);

      function successCallback(devices) {
        this.loading.dismiss();
          console.log(devices);
      }

      function failure(err) {
        this.loading.dismiss();
          alert("Error calling Service Discovery Plugin"+err);
      }

      this.screen2_timer = setInterval(()=>{
        this.count_fail = this.count_fail + 1;
        if(this.count_fail == 20)
        {
            this.loading.dismiss();
          clearInterval(this.screen2_timer);
        }
        var data = localStorage.getItem('device_address');
        if(data)
        {
          console.log("data");
          clearInterval(this.screen2_timer);
            this.loading.dismiss();
          this.navCtrl.push(Screen2Page);
        }
        else
        {
          console.log("console");
        }
      },2000);

    }
}
