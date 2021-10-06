# Micro Cloud

[M3O](https://m3o.com) is an open source public cloud platform. We are building a new AWS alternative for the next generation of developers.

## Overview

AWS has becoming the monstrous behemoth public cloud provider we all love to hate. It's massive complexity and confusing pricing has made it an incredibly 
difficult choice for developers to adopt. But what's the alternative? M3O is a new open source public cloud platform for the next generation of developers. Consume public APIs as simpler programmable building blocks for lightning fast development of products and services. M3O is powered by the open source [Micro](https://github.com/micro/micro) project and programmable real world [Micro Services](https://github.com/micro/services).

<a href="https://m3o.com"><img src="https://cdn.m3ocontent.com/micro/images/micro/3db66283-55b5-4e6e-9c83-de9e53959db0/800cad11-91b0-4664-bcac-aa91b2ce92f4.png" /></a>

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
- Email [Support](mailto:support@m3o.com) for help

## How it Works

M3O is built on existing public cloud infrastructure with managed kubernetes along with our own infrastructure automation 
and abstraction layer. We use the open source [Micro](https://github.com/micro/micro) as the base Cloud OS and use it to 
power all the [Services](https://github.com/micro/services), which are also open source.

We then have our own custom dev UX on top for which the source exists in this repo.

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
