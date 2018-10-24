import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { Observable } from 'rxjs';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import pdfMake from "pdfmake/build/pdfmake";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private from_date: Date;
  private to_date: Date;
  private msgList: any = [];
  private specialElementHandlers = {
    '#editor': function (element, renderer) {
      return true;
    }
  };
  private p: number = 1;
  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.to_date = new Date();
    this.from_date = new Date();
    this.from_date.setDate(this.from_date.getDate() - 7);
    this.filter();
  }
  // fetch all Conversations between from and to date.
  filter(): void {
    this.msgList = [];
    // get days difference between from and to date.
    var diffDays = this.findDiffDays(this.from_date, this.to_date);
    for (let i = 0; i < diffDays; i++) {
      var nextDate = this.nextDate(i, this.from_date);
      var fromFormattedDate = this.formatDate(nextDate);
      this.dashboardService.getLog(fromFormattedDate).subscribe(res => {
        console.log(res);
        this.convertResToObj(res);
      });
    }

  }

  private convertResToObj(res) {
    // const msgList: string[] = res.split('\n\n');
    const dataList: any[] = res.map(text => {
      let del = text["msgText"].includes("\\n\\n");
      let delWithSpace = text["msgText"].includes("\\n \\n");
      if (del) {
        text.msgText = text["msgText"].split('\\n\\n');
      }
      else if (delWithSpace) {
        text.msgText = text["msgText"].split('\\n \\n');
      }
      else {
        text.msgText = [text["msgText"]];
      }
      text["msgText"] = text["msgText"].map(msg => {
        let message = msg.substring(msg.indexOf(':') + 1)
        let userName = msg.substring(0, msg.indexOf(':') + 1)
        msg = { "userName": userName, "message": message };
        return msg;
      })
      var t = text["time"].replace(/[|]/g, '');
      let date = t.substring(0, t.indexOf(',')).trim();
      let time = t.substring(t.indexOf(',') + 1).trim();
      time = time.substring(0, time.indexOf('(')).trim();
      let timeArr = time.split(':');
      let finalDate = new Date(date);
      finalDate.setHours(timeArr[0], timeArr[1], timeArr[2]);
      text["time"] = { "date": finalDate };
      return text;
    });
    this.msgList = this.msgList.concat(dataList);

  }



  private formatDate(date): string {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var dateArray = date.split('-');
    dateArray[1] = months[parseInt(dateArray[1]) - 1];
    var date2 = [];
    date2[0] = dateArray[1];
    date2[1] = dateArray[2];
    date2[2] = dateArray[0];
    //return new Date(p[2], months[p[1].toLowerCase()], p[0]);
    var formattedDate = date2.join("-")
    return formattedDate;
  }

  private findDiffDays(from_date, to_date): Number {
    // covert string into date
    let f_Date = new Date(from_date);
    let t_Date = new Date(to_date);
    // fetch day,month and year
    let f_month = f_Date.getMonth() + 1;
    let f_day = f_Date.getDate();
    let f_year = f_Date.getFullYear();
    let t_month = t_Date.getMonth() + 1;
    let t_day = t_Date.getDate();
    let t_year = t_Date.getFullYear();
    if (f_year > t_year || (f_year == t_year && f_month > t_month) || (f_year == t_year && f_month == t_month && f_day > t_day)) {
      alert("Please enter valid Date.");
      return;
    }
    // hours*minutes*seconds*milliseconds
    let oneDay = 24 * 60 * 60 * 1000;
    let fromDate = new Date(f_year, f_month, f_day);
    let toDate = new Date(t_year, t_month, t_day);
    let diffDays = Math.round(Math.abs((fromDate.getTime() - toDate.getTime()) / (oneDay)));
    if (diffDays > 30) {
      alert("Date should not exceed more than 30 Days.");
      return;
    }
    return diffDays;
  }

  private nextDate(n, from_date): string {
    let date = new Date(from_date);
    date.setDate(date.getDate() + n);
    let month = "0" + (date.getMonth() + 1);
    let days = "0" + date.getDate();
    month = month.slice(-2);
    days = days.slice(-2);
    let finalDate = date.getFullYear() + "-" + month + "-" + days;
    return finalDate;

  }

  private download(): void {
    var node = document.getElementById("content3");
    document.getElementById("parent").appendChild(node);
    var data = document.getElementsByTagName("body")[0];  
    html2canvas(data).then(canvas => {  
      // Few necessary setting options  
      var imgWidth = 208;   
      var pageHeight = 295;    
      var imgHeight = canvas.height * imgWidth / canvas.width;
      //var heightLeft = imgHeight;    
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF(); // A4 size page of PDF  
      var position = 0;  
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight); 
      pdf.save('log.pdf'); // Generated PDF   
    })


    // var doc = new jsPDF({
    //   orientation: 'portrait',
    //   unit: 'cm',
    //   format: [50, 50]
    // }) 
    // var source = document.getElementById("content3");
    // doc.fromHTML(
    //   source,
    //   0,
    //   0,
    //   {
    //     'width': 1000
    //   });

    // doc.save("log");

  }

}
