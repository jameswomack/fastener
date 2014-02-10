var BowerStatic = require('./bowerStatic');

module.exports = function (app) {
  return new BowerStatic(app, {
    mapFileName: 'npmStatic.json',
    componentsFolderName: 'node_modules'
  });
};
