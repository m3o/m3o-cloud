import { Component, OnInit } from '@angular/core';
import { UsageService } from '../usage.service';
import { APIUsage } from '../types';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import * as types from '../types';
import { BalanceService } from '../balance.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usage',
  templateUrl: './usage.component.html',
  styleUrls: ['./usage.component.css']
})
export class UsageComponent implements OnInit {

  public usage: Map<string, APIUsage>;

  balance: string;

  multi: any[];
  view: any[] = [900, 500];

  // options
  legend = true;
  showLabels = true;
  animations = false;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  showXAxisLabel = true;
  xAxisLabel = 'Date';
  yAxisLabel = 'Requests';
  timeline = true;
  blank = '';

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor(
    public usageSvc: UsageService,
    public balanceSvc: BalanceService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.listUsage();
  }

  listUsage(): void {
    this.usage = new Map<string, APIUsage>();
    this.usageSvc.listUsage()
      .then((us) => {
        this.usage = us;
        this.multi = [];
        Object.keys(us).forEach((k) => {
          const entry = {name: k, series: []};
          us[k].records.forEach((v, i, arr) => {
            entry.series.push({name: new Date(v.date *1000), value: v.requests});
          });
          this.multi.push(entry);
        });
      }).catch((e) => {
        // TODO
        console.log(e);
    });
  }

}
