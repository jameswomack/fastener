var _ = require('underscore');
var fs = require('fs');

function BowerStatic(app, options) {
  this.workingDirectory = process.cwd();
  var defaultOptions = {
    containerFolderName: '',
    componentsFolderName: 'bower_components',
    containerURLPath: '/js',
    mapFileName: 'bowerStatic.json',
    overrideMappingsFile: false,
    mapFileContainerFolderPath: this.workingDirectory
  };
  this.options = _.extend(defaultOptions, (options || {}));
  this.attributes = {mappings: {}};

  this.app = app;
  if (this.mapFileAvailable && !this.options.overrideMappingsFile) {
    this.addMappingsFromFile();
  }
}

function extend(propertyName, getterOrOptions) {
  var propertyOptions = {enumerable: true};
  var isGetter = typeof getterOrOptions === 'function';
  if (isGetter) {
    propertyOptions.get = getterOrOptions;
  } else if (getterOrOptions.toString() === '[object Object]') {
    propertyOptions = _.extend(propertyOptions, getterOrOptions);
  } else {
    throw new Error('Cannot extend without arg '.concat(getterOrOptions));
  }
  Object.defineProperty(BowerStatic.prototype, propertyName, propertyOptions);
}

function wrapExtend(key, assignment) {
  extend(key, function() {
    var value = this.attributes[key];
    if (typeof value === 'undefined') {
      value = (this.attributes[key] = assignment.bind(this)());
    }
    return value;
  });
}

extend('containerPath', function(){
  var containerPath = this.attributes.containerPath || (this.attributes.containerPath = this.workingDirectory.concat('/', this.options.containerFolderName));
  return containerPath;
});

extend('componentsPath', function(){
  var componentsFolderName = this.options.componentsFolderName;
  return this.containerPath.concat('/', componentsFolderName);
});

extend('mappings', {
  get: function(){
    var mappings = this.attributes.mappings;
    return mappings;
  },
  set: function(mappings) {
    this.attributes.mappings = mappings;
  }
});

extend('mapFilePath', function() {
  return this.options.mapFileContainerFolderPath.concat('/', this.options.mapFileName);
});

wrapExtend('mapFileAvailable', function() {
  var mapFilePath = this.mapFilePath;
  var exists = fs.existsSync(mapFilePath);
  var isFile = false;
  if (exists) {
    var stat = fs.statSync(mapFilePath);
    isFile = !stat.isDirectory();
  }
  return exists && isFile;
});

wrapExtend('mappingsFromFile', function() {
  return (this.mapFileAvailable) ? require(this.mapFilePath) : null;
});

BowerStatic.prototype.addMappingsFromFile = function() {
  var mappingsFromFile = this.mappingsFromFile;
  if (mappingsFromFile.toString() === '[object Object]') {
    for (var key in mappingsFromFile) {
      this.addMapping(key, mappingsFromFile[key]);
    }
  } else {
    throw new Error('Invalid mappings '
        .concat(mappingsFromFile, 'from file ')
        .concat(this.mapFilePath));
  }
};

// bowerStatic.addMapping('rivets.js', 'rivets/dist/rivets.min.js');
BowerStatic.prototype.addMapping = function(fileNameToUse, pathFromWithinComponentsFolder) {
  this.mappings[fileNameToUse] = pathFromWithinComponentsFolder;
  this.addRouteForMapping.apply(this, arguments);
};

BowerStatic.prototype.addRouteForMapping = function(key, value) {
  var servePath = this.options.containerURLPath.concat('/', key);
  var fsPath = this.componentsPath.concat('/', value);

  this.app.get(servePath, function(req,res) {
    res.sendfile(fsPath);
  });
};

module.exports = BowerStatic;
