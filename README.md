# read-ssl

A simple node library to read SSL certificate files according to a basic convention.

## Usage

``` js
var readSsl = require('read-ssl');

readSsl({
  root: __dirname,
  key: 'relative/path/to/file.key',
  cert: 'relative/path/to/file.cert',
  ca: 'relative/path/to/ca.pem'
  //
  // `ca` can alternatively be an Array
  //
  ca: [
    'relative/path/to/ca.pem'
    'relative/path/to/intermediate-ca.pem'
  ]
}, function (err, res) {
  assert(Buffer.isBuffer(res.key));
  assert(Buffer.isBuffer(res.cert));
  assert(Buffer.isBuffer(res.ca));
});
```

##### AUTHOR: [Charlie Robbins](https://github.com/indexzero)
##### LICENSE: MIT
