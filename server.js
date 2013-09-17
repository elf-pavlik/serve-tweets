var nconf = require('nconf');
var cradle = require('cradle');
var express = require('express');
var cors = require('cors');

/*
 * get config from file
 */
nconf.file({ file: 'config.json' });

/*
 * setup db connection
 */

var options = {};
if(nconf.get('couchdb').password !== ""){
  options = {auth: {username: nconf.get('couchdb').username, password: nconf.get('couchdb').password}};
}
var db = new(cradle.Connection)(nconf.get('couchdb').ip,
                                nconf.get('couchdb').port,
                                options).database(nconf.get('couchdb').database);


/*
 * serve
 */

var app = express();

// enable CORS

app.use(cors());

// routing
app.get('/hashtag/:hashtag', function(req, res){
  db.view('tweets/byHashtag', { key: req.param('hashtag') }, function(err, data) {
    if(err) console.log(err);
    res.end(JSON.stringify(data));
  });
});

app.get('/screen_name/:screen_name', function(req, res){
  db.view('tweets/byScreenName', { key: req.param('screen_name') }, function(err, data) {
    if(err) console.log(err);
    res.end(JSON.stringify(data));
  });
});

app.listen(5555);
