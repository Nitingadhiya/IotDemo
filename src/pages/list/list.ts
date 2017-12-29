import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { GlobalVarService } from '../../providers/global-var';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  loading :any;
  msg :string ="Set channel number 0..";
  Friendly_name: any;
  quality :any;
  signal_unit : any;
  app_channel1 :number = 0;
  app_channel2 :number = 0;
  app_channel3 :number = 0;
  data :any;
  count_api : number =1;
  button1 :string ='';
  button2 :string ='';
  button3 :string ='';

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthService, public loadingCtrl: LoadingController, private toastCtrl: ToastController , public globalService : GlobalVarService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.Friendly_name = navParams.get('name');
    this.signal_unit = navParams.get('unit');
    this.quality = navParams.get('quality');
    //.log(this.Friendly_name);
    //this.globalService.screen='';
  }

  appendix_channel1(num)
  {

    if(num == 0)
    {
      this.msg = "Set channel number 0 : day 1";
      this.app_channel1 = 0;
      if(this.count_api == 1)
      {
        this.showLoader(this.msg);
      }
    }
    this.button1="rgba(72,138,255,0.8)";
    this.button3='';
    this.button2='';
    this.authService.set_channel_Apx1(this.app_channel1).then((result) => {
      this.data = result;
      if(this.data.success == 'true' || this.data.success == true)
      {
            this.count_api = this.count_api + 1;
            if(this.count_api > 7)
            {
              this.app_channel1 = 1;
              var count = this.count_api - 7;
              if(count < 8)
              {
                this.loading.setContent("Set channel number 1 : day "+ count);
              }
            }
            else
            {
              var count_day = this.count_api;
              this.loading.setContent("Set channel number 0 : day "+ count_day);
              this.app_channel1 = 0;
            }
            console.log(this.count_api+"count api");
            if(this.count_api <= 14)
            {
              this.appendix_channel1(this.app_channel1);
            }
            else
            {
              this.count_api=1;
              this.loading.dismiss();
            }
      }
      if(this.data.success == 'false' || this.data.success == false)
      {
        this.loading.dismiss();
      }

      }, (err) => {
        this.button1="rgba(72,138,255,1)";
        this.presentToast(err);
        this.loading.dismiss();
      });
  }

  appendix_channel2(num)
  {
    if(num == 0)
    {
      this.msg = "Set channel number 0 : day 1";
      this.app_channel2 = 0;
      if(this.count_api == 1)
      {
        this.showLoader(this.msg);
      }
    }
    this.button2="rgba(72,138,255,0.8)";
    this.button3='';
    this.button1='';
    this.authService.set_channel_Apx2(this.app_channel2).then((result) => {
      this.data = result;
      if(this.data.success == 'true' || this.data.success == true)
      {
          this.count_api = this.count_api + 1;
          if(this.count_api > 7)
          {
            this.app_channel2 = 1;
            var count = this.count_api - 7;
            if(count < 8)
            {
              this.loading.setContent("Set channel number 1 : day "+ count);
            }
          }
          else
          {
            var count_day = this.count_api;
            this.loading.setContent("Set channel number 0 : day "+ count_day);
            this.app_channel2 = 0;
          }
          console.log(this.count_api+"count api");
          if(this.count_api <= 14)
          {
            this.appendix_channel2(this.app_channel2);
          }
          else
          {
            this.count_api=1;
            this.loading.dismiss();
          }
      }
      if(this.data.success == 'false' || this.data.success == false)
      {
        this.loading.dismiss();
      }

      }, (err) => {
      this.button2="rgba(72,138,255,1)";
        this.presentToast(err);
        this.loading.dismiss();
      });
  }

  appendix_channel3(num)
  {
    if(num == 0)
    {
      this.msg = "Set channel number 0 : day 1";
      this.app_channel3 = 0;
      if(this.count_api == 1)
      {
        this.showLoader(this.msg);
      }
    }
    this.button3="rgba(72,138,255,0.8)";
    this.button2='';
    this.button1='';
    this.authService.set_channel_Apx3(this.app_channel3).then((result) => {
      this.data = result;
      if(this.data.success == 'true' || this.data.success == true)
      {
          this.count_api = this.count_api + 1;
          if(this.count_api > 7)
          {
            this.app_channel3 = 1;
            var count = this.count_api - 7;
            if(count < 8)
            {
              this.loading.setContent("Set channel number 1 : day "+ count);
            }
          }
          else
          {
            var count_day = this.count_api;
            this.loading.setContent("Set channel number 0 : day "+ count_day);
            this.app_channel3 = 0;
          }
          console.log(this.count_api+"count api");
          if(this.count_api <= 14)
          {
            this.appendix_channel3(this.app_channel3);
          }
          else
          {
            this.count_api=1;
            this.loading.dismiss();
          }
      }

      if(this.data.success == 'false' || this.data.success == false)
      {
        this.loading.dismiss();
      }

      }, (err) => {
      this.button3="rgba(72,138,255,1)";
        this.presentToast(err);
        this.loading.dismiss();
      });
  }

  showLoader(msg){
    this.loading = this.loadingCtrl.create({
        content: msg
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


}
