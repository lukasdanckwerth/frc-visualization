# FRC-Visualization

## Getting started

```sh
# clone repository
$ git clone git@github.com:lukasdanckwerth/frc-visualization.git

# pull dev branch
$ git pull --rebase origin dev

# checkout dev branch
$ git checkout dev
```

#### Deploy Stage

```sh
# use makefile merge from dev to stage branch which will start an automatic deployment
make stage
```

#### Deploy Production

```sh

```

### Node.js

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


