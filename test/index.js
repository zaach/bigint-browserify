var test = require("tape");

var bigint = require('bigint');
var bigintB = require('../');

var a = 'deadbeefcafe';
var b = 'dead';
var c = 'beef';

function assertSame(name, fn) {
  test(name, function(t) {
    t.plan(1);
    fn(bigint, function(err, expected) {
      fn(bigintB, function(err, actual) {
        t.equal(actual, expected);
        t.end();
      })
    })
  })
}

// basic

test('implicit base', function(t) {
  t.ok(bigintB(0));
  t.end();
});

// operations

['add', 'sub', 'mul', 'mod', 'xor', 'powm', 'shiftLeft', 'shiftRight']
.forEach(function(name) {
  assertSame(name, function(bigint, cb) {
    var ba = bigint(a, 16);
    var bb = bigint(b, 16);
    var bc = bigint(c, 16);
    cb(null, ba[name](bb, bc).toString(16));
  });

  assertSame('bigint.' + name, function(bigint, cb) {
    var ba = bigint(a, 16);
    var bb = bigint(b, 16);
    var bc = bigint(c, 16);
    cb(null, bigint[name](ba, bb, bc).toString(16));
  });
});


// comparisons

assertSame('eq', function(bigint, cb) {
  var ba = bigint(a, 16);
  var bb = bigint(b, 16);
  cb(null, ba.eq(bb) && ba.eq(ba));
});

['cmp', 'gt', 'ge', 'lt', 'le']
.forEach(function(name) {
  assertSame(name, function(bigint, cb) {
    var ba = bigint(a, 16);
    var bb = bigint(b, 16);
    cb(null, ba[name](bb) && bb[name](ba) && ba[name](ba));
  });

  assertSame('bigint.' + name, function(bigint, cb) {
    var ba = bigint(a, 16);
    var bb = bigint(b, 16);
    cb(null, bigint[name](ba, bb) && bigint[name](bb, ba) && bigint[name](ba, ba));
  });
});

// misc

assertSame('bitLength', function(bigint, cb) {
  var ba = bigint(a, 16);
  cb(null, ba.bitLength());
});

assertSame('toBuffer', function(bigint, cb) {
  var ba = bigint(a, 16);
  cb(null, ba.toBuffer().toString('hex'));
});

assertSame('fromBuffer', function(bigint, cb) {
  var ba = bigint(a, 16);
  cb(null, bigint.fromBuffer(ba.toBuffer()).toString(16));
});
