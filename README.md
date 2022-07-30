# FRC-Visualization

French rap corpus visualization using [lotivis.js](https://github.com/lotivis/lotivis).

## Contents

- [Getting started](#getting-started)
- [Getting started](#getting-started)

## Getting started

1) Clone project locally.

```bash
git clone https://github.com/lukasdanckwerth/frc-visualization.git
```

2) Build `frc.js` library.

```bash
yarn install && yarn run build
```

3) Start `http-server`.

```bash
yarn run serve
```

## Development

```sh
# ... or build with watching files for development
yarn build:watch

yarn build:watch:serve
```

### Docker

Stati of [test container workdflow](./.github/workflows/test-docker.yml):

| Branch | Status |
| - | - |
| `main` | [![Test Docker](https://github.com/lukasdanckwerth/frc-visualization/actions/workflows/test-docker.yml/badge.svg?branch=main)](https://github.com/lukasdanckwerth/frc-visualization/actions/workflows/test-docker.yml) |
| `stage` | [![Test Docker](https://github.com/lukasdanckwerth/frc-visualization/actions/workflows/test-docker.yml/badge.svg?branch=stage)](https://github.com/lukasdanckwerth/frc-visualization/actions/workflows/test-docker.yml) |
| `dev` | [![Test Docker](https://github.com/lukasdanckwerth/frc-visualization/actions/workflows/test-docker.yml/badge.svg?branch=dev)](https://github.com/lukasdanckwerth/frc-visualization/actions/workflows/test-docker.yml) |

## Heroku

- `development` branch is deployed to Heroku `stage`
- `master` branch is deployed to Heroku `production`

| Environment | URL                                           | Status                                                                                                                                                                                                                       |
| ----------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stage       | https://frc-visualization-stage.herokuapp.com | [![Deploy Stage](https://github.com/lukasdanckwerth/frc-visualization/actions/workflows/deploy-stage.yml/badge.svg)](https://github.com/lukasdanckwerth/frc-visualization/actions/workflows/deploy-stage.yml)                |
| Production  | https://frc-visualization.herokuapp.com       | [![Deploy Production](https://github.com/lukasdanckwerth/frc-visualization/actions/workflows/deploy-production.yml/badge.svg)](https://github.com/lukasdanckwerth/frc-visualization/actions/workflows/deploy-production.yml) |


