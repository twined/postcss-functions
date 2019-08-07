"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _glob = _interopRequireDefault(require("glob"));

var _postcss = require("postcss");

var _transformer = _interopRequireDefault(require("./lib/transformer"));

var _helpers = require("./lib/helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _postcss.plugin)('postcss-functions', function () {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var functions = opts.functions || {};
  var globs = opts.glob || [];
  if (!Array.isArray(globs)) globs = [globs];
  globs.forEach(function (pattern) {
    _glob.default.sync(pattern).forEach(function (file) {
      var name = _path.default.basename(file, _path.default.extname(file));

      functions[name] = require(file);
    });
  });
  var transform = (0, _transformer.default)(functions);
  return function (css) {
    var promises = [];
    css.walk(function (node) {
      promises.push(transform(node));
    });
    if ((0, _helpers.hasPromises)(promises)) return Promise.all(promises);
  };
});

exports.default = _default;
module.exports = exports.default;