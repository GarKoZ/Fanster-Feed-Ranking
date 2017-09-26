import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import Select from 'react-select';
// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css';

//for normalizing
function sigmoid(t) {
  return 1/(1+Math.exp(-t));
}

class App extends Component {

  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleDropdownChange = this.handleDropdownChange.bind(this)
    this.loadResult = this.loadResult.bind(this)
    this.logChange = this.logChange.bind(this)
    this.craftquery = this.craftquery.bind(this)
    this.state = {
      keyword: '',
      selected: '',
      result: [],
      result2: [],
      mode:0,
      m:"",
      score:0,
    }

    this.userArtist = {
      "59564052e4b0d74b13f63394":{
          "1460952715118":1,
          "1498472223284":2
      },"593e4481e4b06f7fcb9eabe4":{
          "1493181892798":1,
          "1461319112985":1,
          "1478769685453":1,
          "1496645864615":4,
          "1494819885787":2,
          "1461141233666":1,
          "1494997862363":1,
          "1495013376966":2,
          "1498471709330":1,
          "1460952715109":1,
          "1496746357030":1,
          "1495186665305":1,
          "1498472223284":2,
          "1492658911689":1,
          "1461142910966":1,
          "1494818639822":2,
          "1460952715105":1,
          "1460952715108":1
        }
    }
    this.options = []
    for(var userid in this.userArtist){
      this.options.push({value : userid, label : userid + ":" + Object.keys(this.userArtist[userid]).length })
    }
  }

  //soon will be read from json file
  
  //change from
  craftquery(userid, Boost = true){
    var userArtist = this.userArtist
    var should_array = []
    var count = 0
    var minval, maxval
    console.log(userArtist)
    console.log(userid)
    console.log(userArtist[userid])
    for (var _artistid in userArtist[userid]){
      console.log(_artistid)
      var val = userArtist[userid][_artistid]
      if (count === 0){
        minval = val
        maxval = val
        count += 1
      }
      maxval = val > maxval ? val : maxval
      minval = val > minval ? minval : val
    }
    for (var __artistid in userArtist[userid]){
        var score = sigmoid(userArtist[userid][__artistid])

        var aterm 
        if (Boost)
          aterm = {
                    term:{
                          artistid:{
                            value:__artistid, 
                            boost:score
                          }
                    }
                }
        else 
          aterm = {
            term:{
                  artistid:{
                    value:__artistid, 
                  }
            }
          }
        should_array.push(aterm)
    }
    return should_array
  }

  handleDropdownChange(e) {
    this.setState({
      selected: e.target.value
    });
  }

  loadResult(userid) {
    var craftquery = this.craftquery
    var a = function(userid){
        return new Promise(function (resolve, reject) {
            axios.post(`http://localhost:9200/feeds/feed/_search`, 
              {
                  query :{
                    function_score : {
                      query : {
                        bool:{
                          should: craftquery(userid)
                        },
                      },

                      exp: {
                        createdtm: {
                          origin: "2017-07-22 00:00:00",
                          scale: "2d",
                        }
                      }
                    }
                  },
                  sort: {
                    _script: {
                      type:"number",
                      script: ` (doc['isLink'].value * LinkWeight + 
                                doc['isText'].value * TextWeight + 
                                doc['isPhoto'].value * PhotoWeight + 
                                doc['isEvent'].value * EventWeight + 
                                doc['isShare'].value * ShareWeight + 
                                doc['isVideo'].value * VideoWeight) *   _score
                              `,
                   
                      //scoring per userid
                      params:{
                        LinkWeight : sigmoid(0.159),
                        TextWeight : sigmoid(0.078),
                        PhotoWeight : sigmoid(0.21),
                        EventWeight : sigmoid(0.30),
                        ShareWeight : sigmoid(0.32),
                        VideoWeight : sigmoid(0.22),
                      },            
                      order:"desc"
                    }
                  },
                  explain:true,
                  size:30,
              }
            )
          .then((res) => {
            const result = res.data.hits.hits;
            const score = res.data.hits.max_score
            resolve({ result , score})
          })
        })
    }

    var b = function(userid){
      return new Promise(function (resolve, reject) {
          axios.post(`http://localhost:9200/feeds/feed/_search`, 
            {
                query :{
                      bool:{
                        should: craftquery(userid, false)
                      },
                },
                sort: { createdtm: { order: "desc" }},
                explain:true,
                size:30,
            }
          )
        .then((res) => {
          const result = res.data.hits.hits;
          const score = res.data.hits.max_score
          resolve({ result , score})
        })
      })
  }


    Promise.all([a(userid), b(userid)]).then(values => {
      
        var result = values[0].result
        var score = values[0].score
        var result2 = values[1].result
        this.setState({result, score, result2})
    });


  }
  handleClick() {
    console.log('click')
  }

  handleChange(e) {
    this.setState({
      keyword: e.target.value
    });
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.handleClick()
    }
  }

  logChange(val) {
    console.log(val.value)
    this.loadResult(val.value)
  }
 
  render() { 
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Fanster Feed Ranking</h2>
        </div>
       <div><h2>Select UserID</h2></div>
         <Select className="selectbox" name="form-field-name" value="one" options={this.options} onChange={this.logChange} />
        
        <div className="block">
          <div className="leftDiv">
              <div >
              <h1>Scoring</h1>
              {
                this.state.result.map((val) => {
                  return <li key={`${val._id}`}> 
                    <li>{`${val._source.contenttype}, ${val._source.artist}`}</li>
                    <li>{`${val._source.createdtm}, ${val.sort[0]}`}</li>
                    <li>{`${val._source.social_channel}, ${val._source.post_by_artist}, `}</li>
                      <hr></hr></li>
                })
              }
              </div>
          </div>
          <div className="rightDiv">
              <div >
              <h1>Newest Date</h1>
              {
                this.state.result2.map((val) => {
                  return <li key={`${val._id}`}> 
                    <li>{`${val._source.contenttype}, ${val._source.artist}`}</li>
                    <li>{`${val._source.createdtm}`}</li>
                    <li>{`${val._source.social_channel}, ${val._source.post_by_artist}, `}</li>
                      <hr></hr></li>
                })
              }
              </div>
          </div>
        </div>

      </div >
    );
  }
}

export default App;