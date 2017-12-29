import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { GlobalVarService } from '../../providers/global-var';
import { ListPage } from '../list/list';
import * as xml2js from "xml2js";

@Component({
  selector: 'page-screen2',
  templateUrl: 'screen2.html'
})
export class Screen2Page {
  loading :any;
  msg :string ="Set channel number 0..";
  friendly_name : string ='';
  signal_quality : string = '';
  signal_unit : string = '';
  app_channel1 :number = 0;
  app_channel2 :number = 0;
  app_channel3 :number = 0;
  data :any;
  ssdp_data :any;
  All_ssdp :any;
  url_external :string = '';

  product_data : Array<{}>=[];
  data_not : string ='';
  temop :any;


  day :number=1;
  month:number =1;
  data_s :any;
  data_d :any;
  data_item : any='';

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthService, public loadingCtrl: LoadingController, private toastCtrl: ToastController , public globalService : GlobalVarService,private alertCtrl: AlertController) {

  }
  ionViewDidLoad() {

      this.ssdp_data = localStorage.getItem('device_address');

      this.All_ssdp = JSON.parse(this.ssdp_data);
      console.log(this.All_ssdp.length+"length");
      for(var i=0;i<this.All_ssdp.length;i++)
      {
        //console.log(JSON.stringify(this.All_ssdp[i].xml)+"*******");
        //this.code_store(this.All_ssdp[i].xml);

          let locaton_xml = this.All_ssdp[i].LOCATION;
          //console.log(locaton_xml+"location xML")
          this.xml_reposne(locaton_xml);
      }
  }
  xml_reposne(locaton_data)
  {
    this.authService.getssdp(locaton_data).then((result) => {
      let data_result : any = result;
      this.data_item = data_result._body;
      this.code_store(this.data_item);
    }, (err) => {
    });
  }



  EXT_wifi_click()
  {
    if(this.url_external == '')
    {
      if(this.product_data.length == 0)
      {
        let alert = this.alertCtrl.create({
          title: 'Alert',
          subTitle: 'Do not Found Base URL...',
          buttons: ['Dismiss']
        });
        alert.present();
      }
      else
      {
        let alert_select = this.alertCtrl.create({
          title: 'Alert',
          subTitle: 'Please Select Base URL...',
          buttons: ['Dismiss']
        });
        alert_select.present();
      }
    }
    else
    {
      //this.globalService.screen='2';
      this.device_wifi();
    }
  }


      device_wifi()
      {

        this.globalService.wifi_IP = this.url_external;

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


  code_store(data)
  {
    var data_pass='';
    var URL_base='';
    var UDN='';
    var presentation_URL='';
    //var split_url;
    //console.log(data);
    xml2js.parseString(data, function (err, result) {
      console.log("RESULT"+JSON.stringify(result));
        for (var key in result) {
          console.log("key*************:"+key);
          if(key == 'root')
          {
          //console.log(result[key].device[0].modelName+"check&&&&&&&&&&"+ result[key].URLBase);
            if(typeof (result[key].URLBase) == undefined || typeof (result[key].URLBase) == 'undefined')
            {
              URL_base = ''; //http://192.168.43.80:80/
              //split_url = URL_base.split(":");
              //URL_base = split_url[0]+':'+split_url[1];

            }
            else
            {
              URL_base = result[key].URLBase;

              //split_url = URL_base.split(":",2);
              //URL_base = split_url[0]+":"+ split_url[1];

            }
            //console.log("URL_base###@"+URL_base)

            if(result[key].device[0].modelName == undefined || result[key].device[0].modelName == 'undefined')
            {
              data_pass = '';
            }
            else
            {
              data_pass = result[key].device[0].modelName[0];
            }

            if(result[key].device[0].UDN == undefined || result[key].device[0].UDN == 'undefined')
            {
              UDN = '';
            }
            else
            {
              UDN = result[key].device[0].UDN[0];
            }

                //console.log(result[key].device[0].presentationURL+"%%%%%%%%%%%%%%%%%%%");
            if(result[key].presentationURL == undefined || result[key].presentationURL == 'undefined')
            {
              presentation_URL = '';
            }
            else
            {
              //console.log(result[key].device[0].presentationURL[0]+"***************%%%%%%%%%%%%%"+result[key].device[0].presentationURL)
              presentation_URL = result[key].device[0].presentationURL[0];
            }


          }
        }
    });
    if(URL_base)
    {
      this.product_data.push({'modal_name':data_pass,'url_base':URL_base,'presentation_URL':presentation_URL,'UDN':UDN});
    }
    /*this.temop = Array.from(new Set(this.product_data.map((itemInArray) => itemInArray)));
    console.log(this.temop);
    console.log(JSON.stringify(this.temop));*/

    if(this.product_data.length == 0)
    {
      this.data_not = "No Device Found."
    }
    else
    {
      this.data_not = '';
    }
    //,'presentation_URL':presentation_URL      'url_base':URL_base,'presentation_URL':presentation_URL
    //console.log(this.product_data+"DATATAT");
    //console.log("product_data*****"+JSON.stringify(this.product_data));
  }

  on_radioChange(present_url , base_url)
  {
      console.log(present_url+"==perq"+base_url+"==basde");
      if(base_url)
      {
        this.url_external = base_url;
      }
      else if(!base_url)
      {
        this.url_external = present_url;
      }
      if(present_url == '' && base_url == '')
      {
        console.log("please choose");
      }
  }

}
