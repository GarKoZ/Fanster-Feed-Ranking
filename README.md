# Fanster-Feed-Ranking
Fanster is an artist social network application available in [Andriod](https://play.google.com/store/apps/details?id=th.co.mfec.fanster&hl=en) and [IOS](https://itunes.apple.com/th/app/fanster/id1054879272?mt=8). It provides an artist subscribe feature so that a user could receive any feeds from those subscribed artist. This repo is the demonstration of the Fanster Official feed ranking mechanism using predefined scoring function.

### Material
1. [Problem Formulation & Data Visualization](https://docs.google.com/presentation/d/1zCAxsJyzu1wjjVhvS0w4izHDLrn1CbkhPRsexisvyjA/edit#slide=id.g1fe027b789_0_7)

2. [Modelling](https://docs.google.com/presentation/d/1qhYOCGalQ21DjDm46Pg3KwdZ2aYBiJvMRF2o0e0gV-M/edit?usp=drive_web)


### Prerequisite

docker and node.js

### Installation

A step by step series of examples that tell you have to get a development env running

for docker, from this site https://docs.docker.com/engine/installation/#supported-platforms after finished , check whether it is installed

```
docker version
```

for node.js, from this site https://nodejs.org/en/download/ after finished , check whether it is installed

```
node --version
```

### SETUP Instruction

1. Download [csv_utf8_csv_utf8_application_txn.csv](https://storage.cloud.google.com/hackathon_cafe/csv/utf8/csv_utf8_application_txn.csv?_ga=2.138562608.-2027922919.1503365119) , [csv_utf8_artist.csv](https://storage.cloud.google.com/hackathon_cafe/csv/utf8/artist.csv?_ga=2.218852122.-2027922919.1503365119) and [csv_utf8_feed.csv](https://storage.cloud.google.com/hackathon_cafe/csv/utf8/feed.csv?_ga=2.143289014.-2027922919.1503365119) (need priviledge) to the same path as this `readme.md` file
2. `docker-compose up` to run 2 images React Front-end and ElasticSearch instance
3. if installed successfully try http://localhost:3000/ for React Frontend
4. if installed successfully try http://localhost:9200/ for ElasticSearch instance
5. install all dependancy for Mapping_script by running `npm install`
6. reformat UserInteractionData by running `node parseUserArtistIntact.js` (taking quite long time)
7. create elasticsearch mapping by running `node create-mapping.js` scripts in mapping_script/ 
8. put data into the index by `node push-data.js` scripts in mapping_script/ (this script read jobs.csv and bulk put to elasticsearch) This step should take longer than 5 minuites. 
9. try the ranking from `http://localhost:3000/`



