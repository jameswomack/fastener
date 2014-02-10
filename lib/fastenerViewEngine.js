var fs = require('fs');
var _ = require('underscore');
var rivetsServer = require('rivets-server');

function Fastener(path, options, callback) {
  var locals = {
    options: {
      fullDoc: true,
      binders: {},
      templateDelimiters: ['{{', '}}']
    }
  };

  var template = fs.readFileSync(path);
  var regexp = /\[\[[a-z/]+\]\]/g;
  var replaceRegexp = /[\[\]]/g;
  var match = template.toString().match(regexp);
  if (match) {
    var mmatch = match[0].replace(replaceRegexp, '');
    var partialPath = process.cwd() + '/public/' + mmatch + '.html';
    var subTemplate = fs.readFileSync(partialPath);
    template = template.toString().replace(match[0], subTemplate);
  }

  rivetsServer.render(template, _.extend(locals, options), function (err, html) {
    callback(null, html);
  });
}

module.exports = {__express: Fastener};
