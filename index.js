var jsbn = require('jsbn');
var Buffer = require('buffer').Buffer;

var bigint = module.exports = function(int, base) {
  return new BigInt(int, base);
};

function BigInt(str, base) {
  this._jsbn = new jsbn(str, base || 10);
}

function fromJsbn(n) {
  var bi = new BigInt();
  bi._jsbn = n;
  return bi;
}

BigInt.prototype = {
  powm: function(a, b) {
    if (!a._jsbn) a = new BigInt(a);
    if (!b._jsbn) b = new BigInt(b);
    return fromJsbn(this._jsbn.modPow(a._jsbn, b._jsbn));
  },
  eq: function(a) {
    if (!a._jsbn) a = new BigInt(a);
    return this._jsbn.equals(a._jsbn);
  },
  cmp: function(a) {
    if (!a._jsbn) a = new BigInt(a);
    return this._jsbn.compareTo(a._jsbn);
  },
  gt: function(a) {
    return this.cmp(a) > 0;
  },
  ge: function(a) {
    return this.cmp(a) >= 0;
  },
  lt: function(a) {
    return this.cmp(a) < 0;
  },
  le: function(a) {
    return this.cmp(a) <= 0;
  },
  bitLength: function() {
    return this._jsbn.bitLength();
  },
  toBuffer: function() {
    var hex = this._jsbn.toString(16);
    if (hex.length % 2) hex = '0' + hex;
    return new Buffer(hex, 'hex');
  },
  toString: function(base) {
    return this._jsbn.toString(base);
  }
};

var binOps = {
  add: 'add',
  sub: 'subtract',
  mul: 'multiply',
  mod: 'mod',
  xor: 'xor'
};

Object.keys(binOps).forEach(function(op) {
  BigInt.prototype[op] = function (a) {
    if (!a._jsbn) a = new BigInt(a);
    return fromJsbn(this._jsbn[binOps[op]](a._jsbn));
  };
});

bigint.fromBuffer = function(buffer) {
  return new BigInt(buffer.toString('hex'), 16);
};

Object.keys(BigInt.prototype).forEach(function (name) {
    if (name === 'inspect' || name === 'toString') return;

    bigint[name] = function (num) {
        var args = [].slice.call(arguments, 1);

        if (num._jsbn) {
            return num[name].apply(num, args);
        }
        else {
            var bigi = new BigInt(num);
            return bigi[name].apply(bigi, args);
        }
    };
});
