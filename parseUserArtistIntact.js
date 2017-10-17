var fs = require('fs'); 
var parse = require('csv-parse');

var csvData=[];

var fs = require("fs");
 
var firstRow = true;
var putData = [];
var schema;
var artist = {};
var count = 0
var MongoClient = require('mongodb').MongoClient;
const util = require('util')


MongoClient.connect("mongodb://localhost:27017/UserArtistIntact", function(err, db) {
    if(!err) {
      console.log("We are connected");
    }
    db.createCollection("userArtistIntact");

    fs.createReadStream("a01_userid_artistid_from_txn_7_8.csv")
    .pipe(parse({delimiter: ','}))
    .on('data', function(csvrow) {
        if (firstRow){
            firstRow = false;
            console.log(csvrow)
        }
        else{
            //console.log(csvrow)
            userid = csvrow[0]
            artistid = csvrow[1]
            console.log(count + " : " + userid + " , " + artistid)
            count += 1
            
            var collection = db.collection('userArtistIntact');
            collection.find({userid}).toArray(function(err, items) {
                if (err)
                    console.log(err)
                if (artistid != ""){    
                    if(items.length > 0){
                        item = items[0]
                        //console.log(item['artistidList'])
                            var found = false;
                            item['artistidList'].forEach(function(element) {
                                if(element["artistid"] == artistid){
                                    element["interact"] += 1
                                    found = true;
                                    console.log("found")
                                }
                            }, this);

                            if (!found){
                                //console.log("not found")
                                item['artistidList'].push({artistid:artistid, interact:1})
                            }
                                
                            /*if (artistid in item['artistidList']){
                                item['artistidList'][artistid] += 1
                                console.log("here")
                            }
                            else 
                                item['artistidList'][artistid] = 1
                                */
                        //console.log(item['artistidList'])
                            collection.update({userid}, {$set:{artistidList:item['artistidList']}})
                    }
                    else{
                        //console.log("insert")
                        collection.insertOne({userid, artistidList : [{artistid:artistid, interact : 1}]})
                    }
                }
            })
        }
    }).on('end', function(){
    console.log("end already")
    })
});

function pushFeed(){
    var jsonData = JSON.stringify(artist);

    var fs = require('fs');
    fs.writeFile("artist2.json", jsonData, function(err) {
        if(err) {
            return console.log(err);
        }
    });
}
