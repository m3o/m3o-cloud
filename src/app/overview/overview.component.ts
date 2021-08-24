import { Component, OnInit } from '@angular/core';
import { UsageService, Event } from '../usage.service';
import { UserService } from '../user.service';
import { BalanceService } from '../balance.service';

function uniqByKeepFirst(a, key) {
  let seen = new Set();
  return a.filter((item) => {
    let k = key(item);
    return seen.has(k) ? false : seen.add(k);
  });
}

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  apiCalls: Event[] = [];
  apiVisits: Event[] = [];
  allCalls = 0;
  balance = '0';

  constructor(
    private balanceSvc: BalanceService,
    private usageService: UsageService,
    private us: UserService,
  ) {}

  ngOnInit(): void {
    this.usageService.listEvents('apivisit').then((rsp) => {
      if (!rsp.events) {
        return;
      }
      let accum: Event[] = [];
      this.apiVisits = rsp.events.filter((event) => {
        let exists =
          accum.filter((e) => e.record['apiName'] == event.record['apiName'])
            .length > 0;
        if (exists) {
          return false;
        }
        accum.push(event);
        return true;
      });
    });

    this.usageService.listEvents('apicalls').then((rsp) => {
      if (!rsp.events) {
        return;
      }
      this.apiCalls = rsp.events;
    });

    this.usageService.listUsage(this.us.user.id).then((rsp) => {
      Object.keys(rsp).forEach((k) => {
        let v = rsp[k];
        v['records'].forEach((val) => {
          this.allCalls += parseInt(val.requests, 10);
        });
      });
    });

    this.balanceSvc
      .getCurrentBalance()
      .then((bal) => {
        if (!bal) {
          bal = 0;
        }
        // bal is a number representing 1/10000ths of a cent
        this.balance = (bal / 1000000).toFixed(2);
      })
      .catch((e) => {
        console.log(e);
      });
  }
}
