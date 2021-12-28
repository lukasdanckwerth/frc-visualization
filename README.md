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
# user makefile merge from dev to stage branch which will start an automatic deployment
make stage
```

#### Deploy Production

```sh

```

### Node.js

### Docker

## Capacitor

```console
# add ios platform (in case it is not already)
npx cap add ios

# syncronize projects (copies the web assets folder in the projects)
npx cap sync

# open the ios project
npx cap open ios

# ... alternativly, open Xcode manually
open ios/App/App.xcworkspace

# run in ios simulator
npx cap run ios
```

### Life Reload with Capacitor

```bash
# install ionic (in case it isn't)
npm install -g @ionic/cli native-run

# start the live reload process
ionic cap run ios -l --external
```

## Heroku

- `development` branch is deployed to Heroku `stage`
- `master` branch is deployed to Heroku `production`

| Environment | URL                                           | Status                                                                                                                                                                                                                       |
| ----------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stage       | https://frc-visualization-stage.herokuapp.com | [![Deploy Stage](https://github.com/lukasdanckwerth/frc-visualization/actions/workflows/deploy-stage.yml/badge.svg)](https://github.com/lukasdanckwerth/frc-visualization/actions/workflows/deploy-stage.yml)                |
| Production  | https://frc-visualization.herokuapp.com       | [![Deploy Production](https://github.com/lukasdanckwerth/frc-visualization/actions/workflows/deploy-production.yml/badge.svg)](https://github.com/lukasdanckwerth/frc-visualization/actions/workflows/deploy-production.yml) |
