const elasticsearch = require('elasticsearch');

const server = new elasticsearch.Client({
  host: 'http://localhost:9200',
});

FeedMapping = {
  mappings: {
    feed: {
      properties: {
        _id: {
          type: 'string'
        },
        artistid: {
          type: 'string'
        },
        artist: {
          type: 'string'
        },
        contenttype: {
          type: 'string'
        },
        isText: {
          type: 'integer'
        },
        isPhoto: {
          type: 'integer'
        },
        isLink: {
          type: 'integer'
        },
        isShare: {
          type: 'integer'
        },
        isVideo: {
          type: 'integer'
        },
        isEvent: {
          type: 'integer'
        },
        social_channel: {
          type: 'string'
        },
        content: {
          type: 'string'
        },
        post_by_artist: {
          type: 'string'
        },
        createdtm: {
          type: 'date',
          format: 'yyyy-MM-dd HH:mm:ss'
        },
      }
    }
  }
}
server.indices.exists({index: 'feeds'}, (err, isExisted) => { 
  if (isExisted){
    server.indices.delete({
      index: 'feeds'  
    }).then((res) => {
      server.indices.create({
        index: 'feeds',
        body: FeedMapping
      })
    })
  }
  else{
    console.log("index not found")
    server.indices.create({
      index: 'feeds',
      body: FeedMapping
    })
  }
})