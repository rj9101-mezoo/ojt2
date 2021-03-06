import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../../service/websocket.service';

@Component({
  selector: 'app-detect',
  templateUrl: './detect.component.html',
  styleUrls: ['./detect.component.css']
})
export class DetectComponent implements OnInit {

  detects: { [key: string]: any[] } = {
    "1": [{ type: undefined, timeStamp: 0 }],
    "2": [{ type: undefined, timeStamp: 0 }],
    "3": [{ type: undefined, timeStamp: 0 }],
    "4": [{ type: undefined, timeStamp: 0 }],
    "5": [{ type: undefined, timeStamp: 0 }],
    "6": [{ type: undefined, timeStamp: 0 }],
    "7": [{ type: undefined, timeStamp: 0 }],
    "8": [{ type: undefined, timeStamp: 0 }],
  }; //type, timestamp
  temp: any[] = [];

  constructor(private wsService: WebsocketService) {
    this.wsService.annotationSubject.subscribe(item => {
      let difference = item[Object.keys(item)[0]]?.filter((x: any) => {
        if (this.detects[Object.keys(item)[0]]?.length > 0) {
          return new Date(this.detects[Object.keys(item)[0]][this.detects[Object.keys(item)[0]]?.length - 1].timeStamp).getTime() < new Date(x.timeStamp).getTime();
        }
        return false;
      })

      this.detects[Object.keys(item)[0]] = item[Object.keys(item)[0]];

      for (let diff of difference) {
        switch (diff.type) {
          case 0:
            diff["annotation"] = "normal"
            diff["color"] = "green"
            break;
          case 1:
            diff["annotation"] = "asystole"
            diff["color"] = "skyblue"
            break;
          case 2:
            diff["annotation"] = "ventricular fibrillation"
            diff["color"] = "red"
            break;
          case 3:
            diff["annotation"] = "premature ventricular contraction"
            diff["color"] = "red"
            break;
          case 4:
            diff["annotation"] = "ventricular tachycardia"
            diff["color"] = "red"
            break;
          case 5:
            diff["annotation"] = "ventricular bigeminy"
            diff["color"] = "red"
            break;
          case 6:
            diff["annotation"] = "ventricular trigemini"
            diff["color"] = "red"
            break;
          case 7:
            diff["annotation"] = "ventricular couplet"
            diff["color"] = "red"
            break;
          case 8:
            diff["annotation"] = "sinus tachycardia"
            diff["color"] = "green"
            break;
          case 9:
            diff["annotation"] = "atrial tachycardia"
            diff["color"] = "green"
            break;
          case 10:
            diff["annotation"] = "supraventricular tachycardia"
            diff["color"] = "green"
            break;
          case 11:
            diff["annotation"] = "paced rhythm"
            diff["color"] = "purple"
            break;
          case 12:
            diff["annotation"] = "atrial fibrillation"
            diff["color"] = "yellow"
            break;
          case 13:
            diff["annotation"] = "atrial flutter"
            diff["color"] = "yellow"
            break;
          case 14:
            diff["annotation"] = "atrial premature contraction"
            diff["color"] = "red"
            break;
          case 15:
            diff["annotation"] = "ventricular Triplet"
            diff["color"] = "red"
            break;
          case 16:
            diff["annotation"] = "sinus tachycardia"
            diff["color"] = "green"
            break;
          case 99:
            diff["annotation"] = "in progress/overange"
            diff["color"] = "gray"
            break;
          default:
            diff["annotation"] = "Unknown"
            diff["color"] = "gray"
            break;
        }
        diff["space"] = Object.keys(item)[0];

        let ts = new Date(diff["timeStamp"]);
        diff["time"] = `
          ${ts.getHours() < 10 ? "0" + ts.getHours() : ts.getHours()}:${ts.getMinutes() < 10 ? "0" + ts.getMinutes() : ts.getMinutes()}:${ts.getSeconds() < 10 ? "0" + ts.getSeconds() : ts.getSeconds()}
        `;
      }

      this.temp.push(...difference);
      if (this.temp.length > 1600) {
        for (let i = 0; i < difference.length; i++) {
          this.temp.shift();
        }
      }

      this.temp.sort((a: any, b: any) => {
        return new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime();
      })
    })
  }

  ngOnInit(): void {
  }
}

class annotation {

}