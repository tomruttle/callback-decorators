var assert = require('chai').assert;
var fallbackDecorator = require('../src/fallback-decorator');

describe('fallback-decorator', function () {
  var fallback;
  var log;

  beforeEach(function () {
    log = [];
    var logger = function (type, obj) {
      log.push({type: type, obj: obj});
    };

    fallback = fallbackDecorator(function (err, a, b, c, func) {
      func(undefined, 'giving up');
    }, undefined, logger);
  });

  it('must pass', function (done) {
    var f = fallback(function (a, b, c, next) {
      next(undefined, a + b + c);
    });
    f(1, 2, 3, function (err, dep) {
      assert.equal(dep, 6);
      assert.equal(log.length, 0);
      done();
    });
  });

  it('must fallback', function (done) {
    var f = fallback(function (a, b, c, next) {
      next(new Error('error!'));
    });
    f(1, 2, 3, function (err, dep) {
      assert.equal(dep, 'giving up');
      assert.deepEqual(log[0], {type: 'fallback', obj: {}});
      done();
    });
  });
});
