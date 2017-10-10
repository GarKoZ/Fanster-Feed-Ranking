// const elasticPush = require('../migration-script/elastic-push');
const elasticsearch = require('elasticsearch');
const data = require('./data2.js');
const index = 'pois';
const type = 'poi';
const server = new elasticsearch.Client({
  host: 'http://localhost:9200',
});

const bulk = (data) => {
    const putData = [];
    data.map((d) => {
      console.log(d)
      putData.push({ index: { _index: index, _type: type, _id: d.tn_id } });
      putData.push(d);
    });
    return server.bulk({ body: putData });
  };

module.exports = {
  migrateData: () => {
    /*fs = require('fs')
    fs.readFile('../lm_all_thailand.json', function (err,data) {
      data = JSON.parse(data)
      bulk(data)
      .then(res => console.log(res))
      .catch(error => console.log(error));
    });
    */
      
  }
};

var makeSource = require("stream-json");
var source = makeSource();
var StreamArray = require("stream-json/utils/StreamArray");
var stream = StreamArray.make();

var fs = require("fs");
 
var objectCounter = 0;
var putData = [];
stream.output.on("data", function(object){

  d = object.value;

  d.name_thai_anth = d.name_thai
  d.label_thai_anth = d.label_thai
  d.name_eng_anth = d.name_eng
  d.label_eng_anth = d.label_eng
  d.name_eng_lower = d.name_eng == null ? "" : d.name_eng.toLowerCase()
  d.label_eng_lower = d.label_eng == null ? "" : d.label_eng.toLowerCase()
/*
  d.name_thai_antnth = d.name_thai
  d.label_thai_antnth = d.label_thai
  d.name_eng_antnth = d.name_eng
  d.label_eng_antnth = d.label_eng
*/
  //console.log(object.index, d)
  putData.push({ index: { _index: index, _type: type, _id: d.tn_id } });
  putData.push(d);
  if (putData.length == 10000){
    console.log(10000)
    server.bulk({ body: putData });
    putData = []
  }

});
fs.createReadStream("../lm_all_thailand.json").pipe(stream.input);

module.exports.migrateData();
