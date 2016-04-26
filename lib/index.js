"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storeActions = exports.storeActionsMiddleware = undefined;

var _every = require("lodash/every");

var _every2 = _interopRequireDefault(_every);

var _filter = require("lodash/filter");

var _filter2 = _interopRequireDefault(_filter);

var _find = require("lodash/find");

var _find2 = _interopRequireDefault(_find);

var _isEqual = require("lodash/isEqual");

var _isEqual2 = _interopRequireDefault(_isEqual);

var _isObject = require("lodash/isObject");

var _isObject2 = _interopRequireDefault(_isObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _actions = [];

var storeActionsMiddleware = function storeActionsMiddleware(store) {
  return function (next) {
    return function (action) {
      if (typeof action !== "function") {
        _actions.push(action);
      }

      return next(action);
    };
  };
};

var has = function has() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _every2.default)(args, function (arg) {
    var result = void 0;

    if ((0, _isObject2.default)(arg)) {
      var matches = (0, _filter2.default)(_actions, function (action) {
        return action.type == arg.type;
      });

      result = (0, _find2.default)(matches, function (match) {
        return (0, _isEqual2.default)(arg, match);
      });
    } else {
      result = (0, _find2.default)(_actions, function (action) {
        return action.type == arg;
      });
    }

    return !!result;
  });
};

var storeActions = {
  has: has,
  clear: function clear() {
    return _actions = [];
  },
  actions: function actions() {
    return _actions;
  }
};

exports.storeActionsMiddleware = storeActionsMiddleware;
exports.storeActions = storeActions;