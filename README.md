# FRC-Visualization



## Getting started

```bash
# clone repository
$ git clone git@github.com:lukasdanckwerth/frc-visualization.git

# pull dev branch
$ git pull --rebase origin dev

# checkout dev branch
$ git checkout dev
```

#### Deploy Stage

```bash
# user makefile merge from dev to stage branch which will start an automatic deployment
make stage
```

#### Deploy Production

```bash
```



### Node.js


### Docker



## Heroku

* ```development``` branch is deployed to Heroku ```stage```
* ```master``` branch is deployed to Heroku ```production```

| Environment | URL                                           | Status |
| ----------- | --------------------------------------------- | ------ |
| Stage       | https://frc-visualization-stage.herokuapp.com | [![Deploy Stage](https://github.com/lukasdanckwerth/frc-visualization/actions/workflows/deploy-stage.yml/badge.svg)](https://github.com/lukasdanckwerth/frc-visualization/actions/workflows/deploy-stage.yml) |
| Production  | https://frc-visualization.herokuapp.com       | [![Deploy Production](https://github.com/lukasdanckwerth/frc-visualization/actions/workflows/deploy-production.yml/badge.svg)](https://github.com/lukasdanckwerth/frc-visualization/actions/workflows/deploy-production.yml) |

