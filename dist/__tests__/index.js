"use strict";

var _path = _interopRequireDefault(require("path"));

var _ava = _interopRequireDefault(require("ava"));

var _postcss = _interopRequireDefault(require("postcss"));

var _ = _interopRequireDefault(require(".."));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function testFixture(t, fixture) {
  var expected = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  if (expected === null) expected = fixture;
  return (0, _postcss.default)((0, _.default)(opts)).process(fixture, {
    from: undefined
  }).then(function (out) {
    t.deepEqual(out.css, expected);
  });
}

(0, _ava.default)('should invoke a recognized function', testFixture, 'a{foo:bar()}', 'a{foo:baz}', {
  functions: {
    'bar': function bar() {
      return 'baz';
    }
  }
});
(0, _ava.default)('should accept deferred functions', testFixture, 'a{foo:bar()}', 'a{foo:baz}', {
  functions: {
    'bar': function bar() {
      return Promise.resolve('baz');
    }
  }
});
(0, _ava.default)('should invoke multiple functions', testFixture, 'a{foo:bar() baz()}', 'a{foo:bat qux}', {
  functions: {
    'bar': function bar() {
      return 'bat';
    },
    'baz': function baz() {
      return 'qux';
    }
  }
});
(0, _ava.default)('should ignore unrecognized functions', testFixture, 'a{foo:bar()}');
(0, _ava.default)('should be able to pass arguments to functions', testFixture, 'a{foo:bar(qux, norf)}', 'a{foo:qux-norf}', {
  functions: {
    'bar': function bar(baz, bat) {
      return baz + '-' + bat;
    }
  }
});
(0, _ava.default)('should be able to pass arguments with spaces to functions', testFixture, 'a{foo:bar(hello world)}', 'a{foo:hello-world}', {
  functions: {
    'bar': function bar(baz) {
      return baz.replace(' ', '-');
    }
  }
});
(0, _ava.default)('should invoke an auto-detected function from a globbed directory', testFixture, 'a{foo:bar()}', 'a{foo:baz}', {
  glob: _path.default.join(__dirname, 'fixtures', '*.js')
});
(0, _ava.default)('should invoke a function in an at-rule', testFixture, '@foo bar(){bat:qux}', '@foo baz{bat:qux}', {
  functions: {
    'bar': function bar() {
      return 'baz';
    }
  }
});
(0, _ava.default)('should invoke a function in a rule', testFixture, 'foo:nth-child(bar()){}', 'foo:nth-child(baz){}', {
  functions: {
    'bar': function bar() {
      return 'baz';
    }
  }
});
(0, _ava.default)('should invoke nested functions', testFixture, 'a{foo:bar(baz())}', 'a{foo:batqux}', {
  functions: {
    'bar': function bar(arg) {
      return 'bat' + arg;
    },
    'baz': function baz() {
      return Promise.resolve('qux');
    }
  }
});
(0, _ava.default)('should not pass empty arguments', function (t) {
  return (0, _postcss.default)((0, _.default)({
    functions: {
      'bar': function bar() {
        t.deepEqual(arguments.length, 0);
      }
    }
  })).process('a{foo:bar()}', {
    from: undefined
  });
});