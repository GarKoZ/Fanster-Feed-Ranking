var fs = require('fs'); 
var parse = require('csv-parse');

var csvData=[];

var fs = require("fs");
 
var firstRow = true;
var putData = [];
var schema;
var artist = {};
var count = 0
fs.createReadStream("csv_utf8_csv_utf8_application_txn.csv")
.pipe(parse({delimiter: ','}))
.on('data', function(csvrow) {
    if (firstRow){
        firstRow = false;
        console.log(csvrow)
    }
    else{
        //console.log(csvrow)
        userid = csvrow[0]
        artistid = csvrow[6]
        if (artistid != ""){
            console.log(userid)
            console.log(" + ")
            console.log(artistid)
            if (typeof artist[userid] == 'undefined'){
                artist[userid] = {}
            }

            
            if (typeof artist[userid][artistid] == 'undefined'){
                artist[userid][artistid] = 1
            }
            else{
                artist[userid][artistid] += 1
            }
            console.log(artist)
            console.log(Object.keys(artist).length)
            
            console.log(count)
            count += 1
            if (count % 1000 == 0 ){
                pushFeed()
            }
        }
    }
}).on('end', function(){
   pushFeed()
})

function pushFeed(){
    var jsonData = JSON.stringify(artist);

    var fs = require('fs');
    fs.writeFile("artist2.json", jsonData, function(err) {
        if(err) {
            return console.log(err);
        }
    });
}
