var browserify = require('browserify-middleware');
var BowerStatic = require('./bowerStatic');

module.exports = function (app) {
  return new BowerStatic(app, {
    mapFileName: 'browserifyStatic.json',
    componentsFolderName: 'node_modules',
    reqRes: browserify
  });
};
