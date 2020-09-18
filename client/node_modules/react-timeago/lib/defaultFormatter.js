'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = defaultFormatter;

var _react = require('react');

var React = _interopRequireWildcard(_react);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function defaultFormatter(value, unit, suffix) {
  if (value !== 1) {
    unit += 's';
  }
  return value + ' ' + unit + ' ' + suffix;
}