# Micro Cloud

A public API platform

## Overview

Micro Cloud is a public API platform which streamlines the developer experience. Consume public APIs as simpler programmable building blocks for lightning fast development of products and services. Micro Cloud is powered by the original [Micro](https://github.com/micro/micro) project and programmable real world [Micro Services](https://github.com/micro/services).

<a href="https://m3o.com"><img src="https://raw.githubusercontent.com/micro/cloud/main/web.png" /></a>

## Features

- **One Account** - Use one Micro account to fulfill all your API needs. Access multiple APIs with a single token and Micro account.
- **Fast Access** - Using a new API is simple - no need to learn yet another documentation, it's all the same Micro UX.
- **Free to start** - It's a simple pay as you go model and everything is priced per request. Top up your account and start making calls.
- **Anti AWS Billing** - Don't get lost in a sea of infinite cloud billing. We show you exactly what you use and don't hide any of the costs.

## Getting Started

- Head to [m3o.com](https://m3o.com) and signup for a free account. 
- Generate an API key on the [Settings page](https://m3o.com/settings/keys).
- Browse the APIs on the [Explore page](https://m3o.com/explore).
- Call any API using your token in the `Authorization: Bearer [Token]` header and `https://api.m3o.com/v1/[service]/[endpoint]` url.

## Learn More

- Read the [Announcement](https://blog.m3o.com/2021/06/24/micro-apis-for-everyday-use.html) blog post
- Join the [Slack](https://slack.m3o.com) community
- Join the [Discord](https://discord.gg/TBR9bRjd6Z) channel

## Development

This project was generated with [Angular CLI](https://github.com/angular/angular-cli).

## How to run

```
npm install && ng serve
```

Or with server side rendering:

```
npm run dev:ssr
```

Navigate to `http://localhost:4200/`.

## How to regenerate the sitemap?

Go to any sitemap generator (example: https://www.xml-sitemaps.com/) site and commit the output to src/sitemap.xml
