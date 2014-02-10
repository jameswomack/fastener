var express = require('express');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var rivetsServer = require('rivets-server');

Object.defineProperty(express.request, 'ext', {
  get: function() {
    return path.extname(this.originalUrl).substring(1);
  }
});

function Fastener(req, res, next) {
  if (req.ext === 'html') {
    var locals = {
      options: {
        fullDoc: true,
        templateDelimiters: ['{{', '}}']
      }
    };

    var rivetsModel = {
      title: 'J.W. Webb, Inc.',
      subTitle: 'Rocking you like a hurrica-ine!'
    };

    var template = fs.readFileSync(process.cwd().concat('/public', req.originalUrl));

    rivetsServer.render(template, _.extend(locals, rivetsModel), function (err, html) {
      res.send(html);
    });
  } else {
    next();
  }
}

module.exports = Fastener;
