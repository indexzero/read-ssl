/*
 * test.js: Make sure reading with various options works
 *
 * (C) 2015, Charlie Robbins.
 *
 */

var path = require('path'),
    http = require('http'),
    test = require('tape'),
    readSsl = require('./');

test('readSsl key, cert (no ca)', function (t) {
  t.plan(5);

  readSsl({
    root: __dirname,
    key: 'index.js',
    cert: 'LICENSE'
  }, function (err, files) {
    console.dir(err);
    t.error(err);
    t.equals(typeof files, 'object');
    t.ok(Buffer.isBuffer(files.key), 'has a Buffer `key`');
    t.ok(Buffer.isBuffer(files.cert), 'has a Buffer `cert`');
    t.equals(typeof files.ca, 'undefined', 'no `ca` returned');
  });
});

test('readSsl key, cert, ca (single)', function (t) {
  t.plan(5);

  readSsl({
    root: __dirname,
    key: 'index.js',
    cert: 'LICENSE',
    ca: 'README.md'
  }, function (err, files) {
    console.dir(err);
    t.error(err);
    t.equals(typeof files, 'object');
    t.ok(Buffer.isBuffer(files.key), 'has a Buffer `key`');
    t.ok(Buffer.isBuffer(files.cert), 'has a Buffer `cert`');
    t.ok(Buffer.isBuffer(files.ca), 'has a Buffer `ca`');
  });
});

test('readSsl key, cert, ca (array)', function (t) {
  t.plan(7);

  readSsl({
    root: __dirname,
    key: 'index.js',
    cert: 'LICENSE',
    ca: ['README.md', '.gitignore']
  }, function (err, files) {
    console.dir(err);
    t.error(err);
    t.equals(typeof files, 'object');
    t.ok(Buffer.isBuffer(files.key), 'has a Buffer `key`');
    t.ok(Buffer.isBuffer(files.cert), 'has a Buffer `cert`');
    t.ok(Array.isArray(files.ca), 'has an Array `ca`');
    files.ca.forEach(function (ca, i) {
      t.ok(Buffer.isBuffer(ca), 'has a Buffer `ca` ' + i);
    });
  });
});

test('readSsl.createContext key, cert (no ca)', function (t) {
  t.plan(2);

  readSsl.createContext({
    root: path.join(__dirname, 'fixtures'),
    key: 'server.key',
    cert: 'server.crt'
  }, function (err, context) {
    console.dir(err);
    t.error(err);
    t.ok(!!context);
  });
});
