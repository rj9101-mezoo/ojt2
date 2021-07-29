import { ThisReceiver } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { WebsocketService } from '../../../../service/websocket.service';
import { IData } from '../display.component';

@Component({
  selector: 'app-wave-form',
  templateUrl: './wave-form.component.html',
  styleUrls: ['./wave-form.component.css']
})
export class WaveFormComponent implements OnInit {

  @Input() title: string = '';
  @Input() index: number = 0;
  @Input() deviceInfos: any = {};

  ecgData: IData[] = [];
  resData: IData[] = [];
  ecgIndex: number = 0;
  resIndex: number = 0;

  constructor(private wsService: WebsocketService) {
  }

  ngOnInit(): void {
    for (let i = 0; i < 500; i++) {
      this.ecgData[i] = { val: undefined, ts: i * 8 };
      this.resData[i] = { val: undefined, ts: i * 40 };
    }

    this.wsService.subject.subscribe(observer => {
      if (observer.dv === this.deviceInfos.deviceAddress) {
        switch (this.title) {
          case "ecg":
            for (let i = 0; i < 5; i++) {
              this.ecgData[5 * this.ecgIndex + i] = {
                ts: 40 * this.ecgIndex + 8 * i,
                val: observer.dp.ecg[i]
              };
            }

            switch (this.ecgIndex) {
              case 99:
                this.ecgIndex = -1;
                break;
              case 98:
                for (let i = 0; i < 5; i++) {
                  this.ecgData[5 * this.ecgIndex + 5 + i] = { ts: 40 * this.ecgIndex + (40 + 8 * i), val: undefined };
                }
                break;
              case 97:
                for (let i = 0; i < 10; i++) {
                  this.ecgData[5 * this.ecgIndex + 5 + i] = { ts: 40 * this.ecgIndex + (40 + 8 * i), val: undefined };
                }
                break;
              default:
                for (let i = 0; i < 15; i++) {
                  this.ecgData[5 * this.ecgIndex + 5 + i] = { ts: 40 * this.ecgIndex + (40 + 8 * i), val: undefined };
                }
                break;
            }
            this.ecgIndex++;
            this.drawChart(this.ecgData, this.index);
            break;
          case "res":
            this.resData[this.resIndex] = { val: observer.dp.F1, ts: this.resIndex * 40 };
            switch (this.resIndex) {
              case 499: this.resIndex = -1; break;
              case 498:
                this.resData[this.resIndex + 1] = { val: undefined, ts: this.resIndex * 40 };
                break;
              case 497:
                for (let i = 1; i < 3; i++) {
                  this.resData[this.resIndex + i] = { val: undefined, ts: (this.resIndex + i) * 40 };
                }
                break;
              case 496:
                for (let i = 1; i < 4; i++) {
                  this.resData[this.resIndex + i] = { val: undefined, ts: (this.resIndex + i) * 40 };
                }
                break;
              case 495:
                for (let i = 1; i < 5; i++) {
                  this.resData[this.resIndex + i] = { val: undefined, ts: (this.resIndex + i) * 40 };
                }
                break;
              case 494:
                for (let i = 1; i < 6; i++) {
                  this.resData[this.resIndex + i] = { val: undefined, ts: (this.resIndex + i) * 40 };
                }
                break;
              case 493:
                for (let i = 1; i < 7; i++) {
                  this.resData[this.resIndex + i] = { val: undefined, ts: (this.resIndex + i) * 40 };
                }
                break;
              case 492:
                for (let i = 1; i < 8; i++) {
                  this.resData[this.resIndex + i] = { val: undefined, ts: (this.resIndex + i) * 40 };
                }
                break;
              case 491:
                for (let i = 1; i < 9; i++) {
                  this.resData[this.resIndex + i] = { val: undefined, ts: (this.resIndex + i) * 40 };
                }
                break;
              default:
                for (let i = 1; i < 9; i++) {
                  this.resData[this.resIndex + i] = { val: undefined, ts: (this.resIndex + i) * 40 };
                }
                break;
            }
            this.resIndex++;
            this.drawChart(this.resData, this.index);
            break;
          default:
            break;
        }
      }
    })
  }

  drawChart(data: IData[], index: number) {
    const div = document.getElementById(`${this.title}_${index}`)!;

    const width = div.getBoundingClientRect().width;
    const height = div.getBoundingClientRect().height;
    const margin = { top: 10, bottom: 10 };

    d3.select(`#${this.title}_${index} svg`).remove();

    const svg: any = d3.select(`#${this.title}_${index} div.chart`)
      .append("svg")
      .attr("class", "prd")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", width).attr("height", height);

    const g: any = svg.append("g");

    const xScale: any = d3.scaleTime().range([0, width]);
    const yScale: any = d3.scaleLinear().range([height - margin.top, margin.bottom]);

    xScale.domain(d3.extent(data, d => d.ts)).nice();
    yScale.domain(d3.extent(data, d => d.val)).nice();

    const line: any = d3.line()
      .defined((d: any) => !isNaN(d.val))
      .x((d: any) => xScale(d.ts))
      .y((d: any) => yScale(d.val))
      .curve(d3.curveBumpX);

    const chart = g.append("g")
      .attr("class", "chart")
      .attr("width", width);

    chart.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", this.title === "ecg" ? "blue" : "white")
      .attr("width", width)
      .attr("stroke-width", "2px")
      .attr("d", line);
  }

}