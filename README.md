# transbase-admin

A web interface for [Transbase](https://www.transaction.de/en/products/transbase) database administration

## What is Transbase?

Transbase is a relational SQL database system.
It is designed to deliver maximum performance with minimum resources.
Therefore it can be used easily not only on high-end servers,
but particularly on low-end platforms like Raspberry Pi.
By consequently following accepted standards, Transbase secures your software investments.
As a unique selling point, Transbase provides prize-awarded patented technologies
that make your applications unique in functionality and performance.

> [wikipedia.org/wiki/Transbase](https://en.wikipedia.org/wiki/Transbase)

![Transaction Software](https://www.transaction.de/fileadmin/logos/transaction_logo_2x.png)

---

## Development

Clone this repository and run `npm install` to setup all necessary dependencies.

During development use the dev server commands, which watches on any file changes:
`npm run dev` and `npm run dev:server`
and visit http://localhost:3000

For production use
`npm run build` and `npm run start:server` (there is no prepackaged server bundle yet)
and visit http://localhost:3003
