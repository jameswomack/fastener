var express = require('express');
var request = require('superagent');
var packageReader = require('./lib/packageReader');
var BowerStatic = require('./lib/bowerStatic');
var FastenerViewEngine = require('./lib/fastenerViewEngine');
var app = express();
var port = packageReader.get('port');

// Load npmStatic.json as a sort of
// require config for serving JS
// files from node_modules
require('./lib/npmStatic')(app);

// Load browserifyStatic.json as a sort of
// require config for serving node JS
// files from node_modules
require('./lib/browserifyStatic')(app);

// Load bowerStatic.json as a sort of
// require config for serving JS
// files from bower_components, which is
// within assets
new BowerStatic(app, {
  containerFolderName: 'assets'
});

app.set('views', process.cwd() + '/public');
app.engine('html', FastenerViewEngine.__express);

app.get('/:fileName.html', function(req, res){
  var rivetsModel = {
    serviceOfferings: [{title:'A'},{title:'B'},{title:'C'}],
    title: 'J.W. Webb, Inc.',
    subTitle: 'Rocking you like a hurrica-ine!'
  };
  res.render(req.params.fileName.concat('.html'), rivetsModel);
});

// Setup a static file server from `/public`
require('./lib/servePublic')(app);

app.get('/goog', function(req, res){
  request
    .get('https://www.google.com')
    .pipe(res);
});

app.listen(port);
