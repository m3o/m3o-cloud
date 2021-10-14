# M3O Cloud

The M3O public cloud UX

## Overview

This repo is for the open source cloud UX built in angular. It's powering the current [m3o.com](https://m3o.com) UI.

## Development

This project is the open source self hostable cloud UX built in angular. It's currently in maintanence mode as we move onto a Next.js version. 

Please feel free to contribute any updates.

## How to run

The source in this project provides an open UX for anyone to run locally or host themselves. The backend is hosted at [api.m3o.com](https://api.m3o.com).

```
npm install && ng serve
```

Or with server side rendering:

```
npm run dev:ssr
```

Navigate to `http://localhost:4200/`.

## Regenerate Sitemap

Go to any sitemap generator (example: https://www.xml-sitemaps.com/) site and commit the output to src/sitemap.xml
