import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/map';
import { GlobalVarService } from './global-var';

const request_timeout :number = 10000;

@Injectable()
export class AuthService {
  api_url :string =""; // local
  schdule_data : any[] =[];
  constructor(public http: Http, public globalService : GlobalVarService) {}
      getHeartBeat()
      {
      console.log(this.globalService.wifi_IP+"@!#$@");
        if(this.globalService.wifi_IP)
        {

            this.api_url = this.globalService.wifi_IP;

        }
        console.log(this.api_url+"api url");
          return new Promise((resolve, reject) => {
            let headers = new Headers();
              headers.append("Accept", 'application/json');

              this.http.get(this.api_url+'heartbeat', {headers: headers})
              .timeout(request_timeout)
              .subscribe(res => {
              //console.log(JSON.stringify(res));
                resolve(res.json());
              }, (err) => {
                reject("Host name Not Found..");
              });
          });
      }

      getSignalQuality()
      {
        if(this.globalService.wifi_IP)
        {

            this.api_url = this.globalService.wifi_IP;

        }
        console.log(this.api_url+"api url");
          return new Promise((resolve, reject) => {
            let headers = new Headers();
              headers.append("Accept", 'application/json');

              this.http.get(this.api_url+'signalQuality', {headers: headers})
              .timeout(request_timeout)
              .subscribe(res => {
              //console.log(JSON.stringify(res));
                resolve(res.json());
              }, (err) => {
                reject("Host name Not Found..");
              });
          });
      }

      setDateTime(data)
      {
        if(this.globalService.wifi_IP)
        {

            this.api_url = this.globalService.wifi_IP;

        }
        console.log(this.api_url+"api url");
          return new Promise((resolve, reject) => {
            let headers = new Headers();
              headers.append("Accept", 'application/json');

              this.http.put(this.api_url+'dateTime',JSON.stringify(data), {headers: headers})
              .timeout(request_timeout)
              .subscribe(res => {
              //console.log(JSON.stringify(res));
                resolve(res.json());
              }, (err) => {
                reject("Host name Not Found..");
              });
          });
      }

      set_channel_Apx1(data)
      {
        this.schdule_data = [];
        if(this.globalService.wifi_IP)
        {
          this.api_url = this.globalService.wifi_IP;
        }
        var channal_index='';
        if(data == 0)
        {
          channal_index = this.globalService.Appendix1_0[0].schedule;
        }
        else
        {
          channal_index = this.globalService.Appendix1_1[0].schedule;
        }

        for(var i=this.globalService.start_time; i< this.globalService.end_time;i++)
        {
          this.schdule_data.push(channal_index[i]);
        }

        if(this.globalService.end_time >= 168)
        {
          this.globalService.start_time = -24;
          this.globalService.end_time = 0;
        }

        let data_parm = {
          "channel":data,
          schedule:this.schdule_data,
        }


          return new Promise((resolve, reject) => {
            let headers = new Headers();
              headers.append("Accept", 'application/json');

              this.http.put(this.api_url+'scheduler', data_parm, {headers: headers})
              .timeout(request_timeout)
              .subscribe(res => {
                this.globalService.start_time = this.globalService.start_time +24;
                this.globalService.end_time = this.globalService.end_time +24;

              //console.log(JSON.stringify(res));
                resolve(res.json());
              }, (err) => {
                reject(err);
              });
          });

      }

      set_channel_Apx2(data)
      {
        this.schdule_data = [];
        if(this.globalService.wifi_IP)
        {
          this.api_url = this.globalService.wifi_IP;
        }
        var channal_index='';
        if(data == 0)
        {
          channal_index = this.globalService.Appendix2_0[0].schedule;
        }
        else
        {
          channal_index = this.globalService.Appendix2_1[0].schedule;
        }

        for(var i=this.globalService.start_time; i< this.globalService.end_time;i++)
        {
          this.schdule_data.push(channal_index[i]);
        }

        if(this.globalService.end_time >= 168)
        {
          this.globalService.start_time = -24;
          this.globalService.end_time = 0;
        }

        let data_parm = {
          "channel":data,
          schedule:this.schdule_data,
        }

          return new Promise((resolve, reject) => {
            let headers = new Headers();
              headers.append("Accept", 'application/json');

              this.http.put(this.api_url+'scheduler', data_parm, {headers: headers})
              .timeout(request_timeout)
              .subscribe(res => {
              this.globalService.start_time = this.globalService.start_time +24;
              this.globalService.end_time = this.globalService.end_time +24;
              //console.log(JSON.stringify(res));
                resolve(res.json());
              }, (err) => {
                reject(err);
              });
          });

      }

      set_channel_Apx3(data)
      {
          this.schdule_data = [];
          if(this.globalService.wifi_IP)
          {
            this.api_url = this.globalService.wifi_IP;
          }
          var channal_index='';
          if(data == 0)
          {
            channal_index = this.globalService.Appendix3_0[0].schedule;
          }
          else
          {
            channal_index = this.globalService.Appendix3_1[0].schedule;
          }

          for(var i=this.globalService.start_time; i< this.globalService.end_time;i++)
          {
            this.schdule_data.push(channal_index[i]);
          }

          if(this.globalService.end_time >= 168)
          {
            this.globalService.start_time = -24;
            this.globalService.end_time = 0;
          }

          let data_parm = {
            "channel":data,
            schedule:this.schdule_data,
          }
          return new Promise((resolve, reject) => {
            let headers = new Headers();
              headers.append("Accept", 'application/json');

              this.http.put(this.api_url+'scheduler', data_parm , {headers: headers})
              .timeout(request_timeout)
              .subscribe(res => {
              this.globalService.start_time = this.globalService.start_time +24;
              this.globalService.end_time = this.globalService.end_time +24;
              //console.log(JSON.stringify(res));
                resolve(res.json());
              }, (err) => {
                reject(err);
              });
          });

      }

      getssdp(locaton_xml)
      {
          return new Promise((resolve, reject) => {
            let headers = new Headers();
              headers.append("Accept", 'application/text');

              this.http.get(locaton_xml, {headers: headers})
              .timeout(request_timeout)
              .subscribe(res => {
              //console.log(JSON.stringify(res));
                resolve(res);
              }, (err) => {
                reject("Host name Not Found..");
              });
          });
      }


}
