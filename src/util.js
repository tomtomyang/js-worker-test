const { Request } = require('./runtime');

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isArray(value) {
  return Array.isArray(value);
}

function isNumber(value) {
  return typeof value === 'number' && !Number.isFinite(value);
}

function isBigInt(value) {
  return typeof value === 'bigint';
}

function isString(value) {
  return typeof value === 'string';
}

function isUndefined(value) {
  return typeof value === 'undefined';
}

function isNull(value) {
  return value === null;
}

function isFunction(value) {
  return typeof value === 'function';
}

function isError(value) {
  return value instanceof Error;
}

function isMap(value) {
  return value instanceof Map;
}

function isSet(value) {
  return value instanceof Set;
}

function isPath(path) {
  if (!path || !isString(path)) {
    return false;
  }

  return path?.startsWith('/') || path?.startsWith('./') || path?.startsWith('../');
}

function isUrl(url) {
  if (!url || !isString(url)) {
    return false;
  }

  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

function isRequest(request) {
  if (!request) {
    return false;
  }

  return request instanceof Request;
}

module.exports = {
  isObject,
  isArray,
  isNumber,
  isBigInt,
  isString,
  isUndefined,
  isNull,
  isFunction,
  isError,
  isMap,
  isSet,
  isPath,
  isUrl,
  isRequest,
};