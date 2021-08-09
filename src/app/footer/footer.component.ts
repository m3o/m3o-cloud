import { Component, OnInit } from '@angular/core';

type ExternalLink = {
  name: string;
  link: string;
};

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  externalLinks1: ExternalLink[] = [
    {
      name: 'Blog',
      link: 'https://blog.m3o.com',
    },
    {
      name: 'Github',
      link: 'https://github.com/m3o',
    },
    {
      name: 'Partner',
      link: 'https://forms.gle/9SQV6DdLNDzSRQ477',
    },
  ];

  externalLinks2: ExternalLink[] = [
    {
      name: 'Platform',
      link: 'https://m3o.dev',
    },
    {
      name: 'Discord',
      link: 'https://discord.gg/TBR9bRjd6Z',
    },
    {
      name: 'LinkedIn',
      link: 'https://www.linkedin.com/company/micro-services-inc',
    },
    {
      name: 'Slack',
      link: 'https://slack.m3o.com',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  getYear(): number {
    return new Date().getFullYear();
  }
}
