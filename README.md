# FRC-Visualization

French rap corpus visualization using [lotivis.js](https://github.com/lotivis/lotivis).

## Contents

- [Getting started](#getting-started)
- [Development](#development)
- [CI / Docker](#ci--docker)

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

## CI / Docker

| Branch | Environment | URL | Docker |
| - | - | - | - |
| [`dev`](https://github.com/lukasdanckwerth/frc-visualization/tree/dev) | Development | https://frc-visualization-dev.onrender.com | [![Test Docker](https://github.com/lukasdanckwerth/frc-visualization/actions/workflows/test-docker.yml/badge.svg?branch=dev)](https://github.com/lukasdanckwerth/frc-visualization/actions/workflows/test-docker.yml) |
| [`stage`](https://github.com/lukasdanckwerth/frc-visualization/tree/stage) | Stage | https://frc-visualization-stage.onrender.com | [![Test Docker](https://github.com/lukasdanckwerth/frc-visualization/actions/workflows/test-docker.yml/badge.svg?branch=stage)](https://github.com/lukasdanckwerth/frc-visualization/actions/workflows/test-docker.yml) |
| [`main`](https://github.com/lukasdanckwerth/frc-visualization/tree/main) | Production | https://frc-visualization.onrender.com | [![Test Docker](https://github.com/lukasdanckwerth/frc-visualization/actions/workflows/test-docker.yml/badge.svg?branch=main)](https://github.com/lukasdanckwerth/frc-visualization/actions/workflows/test-docker.yml) |
