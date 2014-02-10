var express = require('express');
var request = require('superagent');
var packageReader = require('./lib/packageReader');
var BowerStatic = require('./lib/bowerStatic');
var FastenerViewEngine = require('./lib/fastenerViewEngine');
var app = express();
var port = packageReader.get('port');

// Initialize a BowerStatic instance, passing
// `assets` as a the folder within which to
// look for bower_components (or whatever is
// passed as `componentsFolderName` via `options`
//new BowerStatic(app, {
  //containerFolderName: 'assets'
//});

var nodeModulesOptions = {
  componentsFolderName: 'node_modules',
  containerURLPath: '/js',
  overrideMappingsFile: true
};

var nodeStatic = new BowerStatic(app, nodeModulesOptions);
nodeStatic.addMapping('rivets.js', 'rivets/dist/rivets.min.js');

app.set('views', process.cwd() + '/public');
app.engine('html', FastenerViewEngine.__express);
//app.use(Fastener);

app.get('/:fileName.html', function(req, res){
  var rivetsModel = {
    title: 'J.W. Webb, Inc.',
    subTitle: 'Rocking you like a hurrica-ine!'
  };
  console.log(req.params);
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
