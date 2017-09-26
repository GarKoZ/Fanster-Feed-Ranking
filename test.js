var fs = require('fs'); 
var parse = require('csv-parse');

var csvData=[];

// const elasticPush = require('../migration-script/elastic-push');
const elasticsearch = require('elasticsearch');
const index = 'feeds';
const type = 'feed';
const server = new elasticsearch.Client({
  host: 'http://localhost:9200',
});


var fs = require("fs");
 
var firstRow = true;
var putData = [];
var schema;
var artist = {};
fs.createReadStream("csv_utf8_artist.csv")
.pipe(parse({delimiter: ','}))
.on('data', function(csvrow) {
    if (firstRow){
        firstRow = false;
    }
    else{
        id = csvrow[0]
        name = csvrow[1]
        label = csvrow[2]
        artist[id] = {name, label}
    }
}).on('end', function(){
   pushFeed()
})


function pushFeed(){
    firstRow = true;
    fs.createReadStream("csv_utf8_feed.csv")
    .pipe(parse({delimiter: ','}))
    .on('data', function(csvrow) {
        
        if (firstRow){
            firstRow = false;
            schema = csvrow;
        }else{
            
            csvData.push(csvrow);       
            
            d = {}
            for(i = 0;i<csvrow.length;i++){
                d[schema[i]]= csvrow[i]
            }
            
            d['artist'] = artist[d['artistid']]['name'] + ' , ' + artist[d['artistid']]['label']

            d['isText'] = d['contenttype'] == "TEXT" ? 1 : 0
            d['isLink'] = d['contenttype'] == "LINK" ? 1 : 0
            d['isPhoto'] = d['contenttype'] == "PHOTO" ? 1 : 0
            d['isEvent'] = d['contenttype'] == "EVENT" ? 1 : 0
            d['isShare'] = d['contenttype'] == "SHARE" ? 1 : 0
            d['isVideo'] = d['contenttype'].startsWith("VIDEO") ? 1 : 0

            putData.push({ index: { _index: index, _type: type, _id: d._id } });
            putData.push(d);
            if (putData.length == 10000){
                console.log(10000)
                server.bulk({ body: putData });
                console.log(putData)
                putData = []
            }
        }
    })
    .on('end',function() {
      //do something wiht csvData
      console.log(csvData);
    });
}
