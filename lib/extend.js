var _ = require('underscore');

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
  Object.defineProperty(this, propertyName, propertyOptions);
}

module.exports = extend;
