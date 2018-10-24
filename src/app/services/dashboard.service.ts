import { Injectable } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() { }

  getLog(fromDate): Observable<any> {
    const dataPromise: Promise<any> = new Promise((resolve, reject) => {
      fetch('assets/ChatBotLogs/logs/log-' + fromDate + '.txt')
        .then(data => {
          const { ok, statusText } = data;
          if (ok) { //checking if file found
            return data.text();
          }
          // reject({ msg: `Failed to fetch file ${statusText}` });
        })
        .then(resText => {
          if (resText) {
            var msgList: string[] = resText.split('\n\n');
            msgList = msgList.filter(msg => msg.length > 1);
            const dataList: any[] = msgList.map(text => {
              const textParts = text.split('|');  
              return {
                time: textParts[0] ? textParts[0].trim() : '',
                msgType: textParts[1] ? textParts[1].trim() : '',
                msgText: textParts[2] ? textParts[2].trim() : '',
              }
            });
            console.log(dataList);
            resolve(dataList);
          }

        })
    })
    return from(dataPromise);
  }
}
