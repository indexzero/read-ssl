'use strict';

var tls = require('tls'),
    crypto = require('crypto'),
    fs = require('fs'),
    path = require('path');

/*
 * function readSsl (options, callback)
 * Reads the SSL certificate information in the
 * specified options:
 *
 * options.root
 * options.cert
 * options.key
 * options.ca
 */
var readSsl = module.exports = function (options, callback) {
  var read = {};

  function readCertFile(key, file, next) {
    fs.readFile(file, function (err, data) {
      if (err) {
        return next(err);
      } else if (read[key]) {
        if (!Array.isArray(read[key])) {
          read[key] = [read[key]];
        }

        read[key].push(data);
        return next();
      }

      read[key] = data;
      next();
    });
  }

  var sources = ['cert', 'key', 'ca']
    .reduce(function (acc, key) {
      if (!options[key]) { return acc; }

      var list = !Array.isArray(options[key])
        ? [options[key]]
        : options[key];

      acc.push.apply(acc, list.map(function (file) {
        return { key: key, file: path.join(options.root, file) };
      }));

      return acc;
    }, []);


  (function readUntilEmpty(err) {
    if (err) {
      return callback(err);
    } else if (!sources.length) {
      return callback(null, read);
    }

    var source = sources.shift();
    readCertFile(source.key, source.file, readUntilEmpty);
  })();
};

/*
 * function createContext (options, callback)
 * Reads the files in the specified `options` and reponds
 * with a fully-formed `crypto` context from those buffers.
 */
readSsl.createContext = function (options, callback) {
  readSsl(options, function (err, buffers) {
    if (err) { return callback(err); }

    var context;
    try {
      context = tls.createSecureContext
        ? tls.createSecureContext(buffers).context
        : crypto.createCredentials(buffers).context;
    } catch (ex) {
      return callback(ex);
    }

    callback(null, context);
  });
};
