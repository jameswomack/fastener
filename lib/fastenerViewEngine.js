var fs = require('fs');
var _ = require('underscore');
var rivetsServer = require('rivets-server');

function Fastener(path, options, callback) {
  var locals = {
    options: {
      fullDoc: true,
      templateDelimiters: ['{{', '}}']
    }
  };

  var template = fs.readFileSync(path);

  rivetsServer.render(template, _.extend(locals, options), function (err, html) {
    callback(null, html);
  });
}

module.exports = {__express: Fastener};
