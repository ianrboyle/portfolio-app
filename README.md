<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

Question: To have relationship between user/position and industry and sector?
Company Profile:
contains stocks information - sector name, industry name, etc.

Logic flow
Check CompanyProfiles for position_symbol.
if companyProfile exists, we have the sector and industry name.
if not, we get company information
create sector and industry for position_symbol.

Scenario 1:
User would have their own sectors, industries and positions.
Position would belong to one of many user's sectors. Sector would hold multiple user's positions.
Same with industry.
eg:

User: {id: 1, name: user_one},
User_Positions:
[ {id: 1, symbol: AAPL, sector_id: 1, industry_id: 1},
{id: 2, symbol: MSFT, sector_id: 1, industry_id: 2}
] .
User_Sectors:
[
{id:1, sector_name: Technology, industries: [Computer Manufacturing, Software], Positions: [AAPL, MSFT], total_value: (total value of all of user's positions within sector)}
]
User_Industries:
[
{id: 1, industry_name: Computer Manufacturing, sector_id: 1, positions: [AAPL], total_value: (total value of all of user's positions within industry)},
{id: 2, industry_name: Software, sector_id: 1, positions: [MSFT], total_value: (total value of all of user's positions within industry)}
]

User: {id: 2, name: user_two},
User_Positions:
[
{id: 3, symbol: AAPL, sector_id: 2, industry_id: 3},
{id: 4, symbol: MSFT, sector_id: 2, industry_id: 4}
]
User_Sectors:
[
{id:2, sector_name: Technology, industries: [Computer Manufacturing, Software], Positions: [AAPL, MSFT], total_value: (total value of all of user's positions within sector)}
]
User_Industries:
[
{id: 3, industry_name: Computer Manufacturing, sector_id: 1, positions: [AAPL], total_value: (total value of all of user's positions within industry)},
{id: 4, industry_name: Software, sector_id: 1, positions: [MSFT], total_value: (total value of all of user's positions within industry)}
]

Scenario 2:
User only has positions
User's sectors/industries are created via the positions object and created each time the user loads their data.
User sector and industry data are never saved in db.
Calculations for a user's sectors are done via the positions table
userPositions.

A position has a sector, but sectors do not have positions. Or do they?
Or do we just do position has sector_id and set sector_id to the sector we find from its company_profile.
then we get a sector with a bunch of the same positions. idk if that matters
do we just set

Tables for sector and industry exist, but they do not belong to a single user:

Sectors:
[
{id:1, sector_name: Technology, industries: [Computer Manufacturing, Software]}
]
Industries:
[
{id: 1, industry_name: Computer Manufacturing, sector_id:: 1 },
{id: 2, industry_name: Software, sector_id: 2}
]

User One:
[
{id: 1, name: user_one, positions: [AAPL, MSFT]}
],
User_Positions:
[
{id:1, symbol: AAPL, sector_id: 1, industry_id: 1},
{id: 2, symbol: MSFT, sector_id: 1, industry_id: 2}
]

User Two:
[
{id: 1, name: user_two, positions: [AAPL, MSFT]}
],
User_Positions:
[
{id:3, symbol: AAPL, sector_id: 1, industry_id: 1},
{id: 4, symbol: MSFT, sector_id: 1, industry_id: 2}
]
