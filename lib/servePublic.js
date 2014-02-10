function ServePublic(app, options) {
  this.options = options || (options = {path: '/public'});
  this.app = app;
  this.static = require('express').static;
  this.setupFolder = function() {
    this.app.use(this.static(this.path));
  };
  this.setupFolder.bind(this)();
}

function createPathProperty(key) {
  Object.defineProperty(ServePublic.prototype, key, {
    get: function() {
      var currentWorkingDirectory = process.cwd();
      return currentWorkingDirectory.concat(this.options[key]);
    }
  });
}
createPathProperty('path');

module.exports = function(app, options) {
  return new ServePublic(app, options);
};
