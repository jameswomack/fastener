var fs = require('fs'),
    read = fs.readFileSync;

function PackageReader(options) {
  this.options = options || {fileName: 'package.json', rootPath: process.cwd()};
}

function extendPR(propertyName, getter) {
  Object.defineProperty(PackageReader.prototype, propertyName, {get: getter});
}

extendPR('path', function(){
  var packagePath = this.options.rootPath.concat('/', this.options.fileName);
  return packagePath;
});

extendPR('string', function(){
  var packageContents = read(this.path);
  return packageContents;
});

extendPR('contents', function(){
  var packageObject = JSON.parse(this.string);
  return packageObject;
});

var cache = {};
extendPR('cache', function(){
  return cache;
});

function resolve(object, keyPath){
  var components = keyPath.split('.');
  if (keyPath) {
    return resolve(object[components.shift()], components.join('.'));
  }
  return object;
}

PackageReader.prototype.get = function(keyPath){
  var value = cache[keyPath] || (value = resolve(this.contents, keyPath));
  return value;
};

module.exports = new PackageReader();
