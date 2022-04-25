(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"/home/ahmed/Oivan/Rails7/student_assessment/node_modules/underscore/underscore-umd.js":[function(require,module,exports){
(function (global){(function (){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('underscore', factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (function () {
    var current = global._;
    var exports = global._ = factory();
    exports.noConflict = function () { global._ = current; return exports; };
  }()));
}(this, (function () {
  //     Underscore.js 1.13.2
  //     https://underscorejs.org
  //     (c) 2009-2021 Jeremy Ashkenas, Julian Gonggrijp, and DocumentCloud and Investigative Reporters & Editors
  //     Underscore may be freely distributed under the MIT license.

  // Current version.
  var VERSION = '1.13.2';

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            Function('return this')() ||
            {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

  // Create quick reference variables for speed access to core prototypes.
  var push = ArrayProto.push,
      slice = ArrayProto.slice,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;

  // Modern feature detection.
  var supportsArrayBuffer = typeof ArrayBuffer !== 'undefined',
      supportsDataView = typeof DataView !== 'undefined';

  // All **ECMAScript 5+** native function implementations that we hope to use
  // are declared here.
  var nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeCreate = Object.create,
      nativeIsView = supportsArrayBuffer && ArrayBuffer.isView;

  // Create references to these builtin functions because we override them.
  var _isNaN = isNaN,
      _isFinite = isFinite;

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  // The largest integer that can be represented exactly.
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

  // Some functions take a variable number of arguments, or a few expected
  // arguments at the beginning and then a variable number of values to operate
  // on. This helper accumulates all remaining arguments past the function’s
  // argument length (or an explicit `startIndex`), into an array that becomes
  // the last argument. Similar to ES6’s "rest parameter".
  function restArguments(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
      var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  }

  // Is a given variable an object?
  function isObject(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  }

  // Is a given value equal to null?
  function isNull(obj) {
    return obj === null;
  }

  // Is a given variable undefined?
  function isUndefined(obj) {
    return obj === void 0;
  }

  // Is a given value a boolean?
  function isBoolean(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  }

  // Is a given value a DOM element?
  function isElement(obj) {
    return !!(obj && obj.nodeType === 1);
  }

  // Internal function for creating a `toString`-based type tester.
  function tagTester(name) {
    var tag = '[object ' + name + ']';
    return function(obj) {
      return toString.call(obj) === tag;
    };
  }

  var isString = tagTester('String');

  var isNumber = tagTester('Number');

  var isDate = tagTester('Date');

  var isRegExp = tagTester('RegExp');

  var isError = tagTester('Error');

  var isSymbol = tagTester('Symbol');

  var isArrayBuffer = tagTester('ArrayBuffer');

  var isFunction = tagTester('Function');

  // Optimize `isFunction` if appropriate. Work around some `typeof` bugs in old
  // v8, IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
  var nodelist = root.document && root.document.childNodes;
  if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
    isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  var isFunction$1 = isFunction;

  var hasObjectTag = tagTester('Object');

  // In IE 10 - Edge 13, `DataView` has string tag `'[object Object]'`.
  // In IE 11, the most common among them, this problem also applies to
  // `Map`, `WeakMap` and `Set`.
  var hasStringTagBug = (
        supportsDataView && hasObjectTag(new DataView(new ArrayBuffer(8)))
      ),
      isIE11 = (typeof Map !== 'undefined' && hasObjectTag(new Map));

  var isDataView = tagTester('DataView');

  // In IE 10 - Edge 13, we need a different heuristic
  // to determine whether an object is a `DataView`.
  function ie10IsDataView(obj) {
    return obj != null && isFunction$1(obj.getInt8) && isArrayBuffer(obj.buffer);
  }

  var isDataView$1 = (hasStringTagBug ? ie10IsDataView : isDataView);

  // Is a given value an array?
  // Delegates to ECMA5's native `Array.isArray`.
  var isArray = nativeIsArray || tagTester('Array');

  // Internal function to check whether `key` is an own property name of `obj`.
  function has$1(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  }

  var isArguments = tagTester('Arguments');

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  (function() {
    if (!isArguments(arguments)) {
      isArguments = function(obj) {
        return has$1(obj, 'callee');
      };
    }
  }());

  var isArguments$1 = isArguments;

  // Is a given object a finite number?
  function isFinite$1(obj) {
    return !isSymbol(obj) && _isFinite(obj) && !isNaN(parseFloat(obj));
  }

  // Is the given value `NaN`?
  function isNaN$1(obj) {
    return isNumber(obj) && _isNaN(obj);
  }

  // Predicate-generating function. Often useful outside of Underscore.
  function constant(value) {
    return function() {
      return value;
    };
  }

  // Common internal logic for `isArrayLike` and `isBufferLike`.
  function createSizePropertyCheck(getSizeProperty) {
    return function(collection) {
      var sizeProperty = getSizeProperty(collection);
      return typeof sizeProperty == 'number' && sizeProperty >= 0 && sizeProperty <= MAX_ARRAY_INDEX;
    }
  }

  // Internal helper to generate a function to obtain property `key` from `obj`.
  function shallowProperty(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  }

  // Internal helper to obtain the `byteLength` property of an object.
  var getByteLength = shallowProperty('byteLength');

  // Internal helper to determine whether we should spend extensive checks against
  // `ArrayBuffer` et al.
  var isBufferLike = createSizePropertyCheck(getByteLength);

  // Is a given value a typed array?
  var typedArrayPattern = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;
  function isTypedArray(obj) {
    // `ArrayBuffer.isView` is the most future-proof, so use it when available.
    // Otherwise, fall back on the above regular expression.
    return nativeIsView ? (nativeIsView(obj) && !isDataView$1(obj)) :
                  isBufferLike(obj) && typedArrayPattern.test(toString.call(obj));
  }

  var isTypedArray$1 = supportsArrayBuffer ? isTypedArray : constant(false);

  // Internal helper to obtain the `length` property of an object.
  var getLength = shallowProperty('length');

  // Internal helper to create a simple lookup structure.
  // `collectNonEnumProps` used to depend on `_.contains`, but this led to
  // circular imports. `emulatedSet` is a one-off solution that only works for
  // arrays of strings.
  function emulatedSet(keys) {
    var hash = {};
    for (var l = keys.length, i = 0; i < l; ++i) hash[keys[i]] = true;
    return {
      contains: function(key) { return hash[key] === true; },
      push: function(key) {
        hash[key] = true;
        return keys.push(key);
      }
    };
  }

  // Internal helper. Checks `keys` for the presence of keys in IE < 9 that won't
  // be iterated by `for key in ...` and thus missed. Extends `keys` in place if
  // needed.
  function collectNonEnumProps(obj, keys) {
    keys = emulatedSet(keys);
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = isFunction$1(constructor) && constructor.prototype || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (has$1(obj, prop) && !keys.contains(prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !keys.contains(prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`.
  function keys(obj) {
    if (!isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (has$1(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  }

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  function isEmpty(obj) {
    if (obj == null) return true;
    // Skip the more expensive `toString`-based type checks if `obj` has no
    // `.length`.
    var length = getLength(obj);
    if (typeof length == 'number' && (
      isArray(obj) || isString(obj) || isArguments$1(obj)
    )) return length === 0;
    return getLength(keys(obj)) === 0;
  }

  // Returns whether an object has a given set of `key:value` pairs.
  function isMatch(object, attrs) {
    var _keys = keys(attrs), length = _keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = _keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  }

  // If Underscore is called as a function, it returns a wrapped object that can
  // be used OO-style. This wrapper holds altered versions of all functions added
  // through `_.mixin`. Wrapped objects may be chained.
  function _$1(obj) {
    if (obj instanceof _$1) return obj;
    if (!(this instanceof _$1)) return new _$1(obj);
    this._wrapped = obj;
  }

  _$1.VERSION = VERSION;

  // Extracts the result from a wrapped and chained object.
  _$1.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxies for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _$1.prototype.valueOf = _$1.prototype.toJSON = _$1.prototype.value;

  _$1.prototype.toString = function() {
    return String(this._wrapped);
  };

  // Internal function to wrap or shallow-copy an ArrayBuffer,
  // typed array or DataView to a new view, reusing the buffer.
  function toBufferView(bufferSource) {
    return new Uint8Array(
      bufferSource.buffer || bufferSource,
      bufferSource.byteOffset || 0,
      getByteLength(bufferSource)
    );
  }

  // We use this string twice, so give it a name for minification.
  var tagDataView = '[object DataView]';

  // Internal recursive comparison function for `_.isEqual`.
  function eq(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](https://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepEq(a, b, aStack, bStack);
  }

  // Internal recursive comparison function for `_.isEqual`.
  function deepEq(a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    if (a instanceof _$1) a = a._wrapped;
    if (b instanceof _$1) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    // Work around a bug in IE 10 - Edge 13.
    if (hasStringTagBug && className == '[object Object]' && isDataView$1(a)) {
      if (!isDataView$1(b)) return false;
      className = tagDataView;
    }
    switch (className) {
      // These types are compared by value.
      case '[object RegExp]':
        // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN.
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
      case '[object Symbol]':
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
      case '[object ArrayBuffer]':
      case tagDataView:
        // Coerce to typed array so we can fall through.
        return deepEq(toBufferView(a), toBufferView(b), aStack, bStack);
    }

    var areArrays = className === '[object Array]';
    if (!areArrays && isTypedArray$1(a)) {
        var byteLength = getByteLength(a);
        if (byteLength !== getByteLength(b)) return false;
        if (a.buffer === b.buffer && a.byteOffset === b.byteOffset) return true;
        areArrays = true;
    }
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(isFunction$1(aCtor) && aCtor instanceof aCtor &&
                               isFunction$1(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var _keys = keys(a), key;
      length = _keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = _keys[length];
        if (!(has$1(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  }

  // Perform a deep comparison to check if two objects are equal.
  function isEqual(a, b) {
    return eq(a, b);
  }

  // Retrieve all the enumerable property names of an object.
  function allKeys(obj) {
    if (!isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  }

  // Since the regular `Object.prototype.toString` type tests don't work for
  // some types in IE 11, we use a fingerprinting heuristic instead, based
  // on the methods. It's not great, but it's the best we got.
  // The fingerprint method lists are defined below.
  function ie11fingerprint(methods) {
    var length = getLength(methods);
    return function(obj) {
      if (obj == null) return false;
      // `Map`, `WeakMap` and `Set` have no enumerable keys.
      var keys = allKeys(obj);
      if (getLength(keys)) return false;
      for (var i = 0; i < length; i++) {
        if (!isFunction$1(obj[methods[i]])) return false;
      }
      // If we are testing against `WeakMap`, we need to ensure that
      // `obj` doesn't have a `forEach` method in order to distinguish
      // it from a regular `Map`.
      return methods !== weakMapMethods || !isFunction$1(obj[forEachName]);
    };
  }

  // In the interest of compact minification, we write
  // each string in the fingerprints only once.
  var forEachName = 'forEach',
      hasName = 'has',
      commonInit = ['clear', 'delete'],
      mapTail = ['get', hasName, 'set'];

  // `Map`, `WeakMap` and `Set` each have slightly different
  // combinations of the above sublists.
  var mapMethods = commonInit.concat(forEachName, mapTail),
      weakMapMethods = commonInit.concat(mapTail),
      setMethods = ['add'].concat(commonInit, forEachName, hasName);

  var isMap = isIE11 ? ie11fingerprint(mapMethods) : tagTester('Map');

  var isWeakMap = isIE11 ? ie11fingerprint(weakMapMethods) : tagTester('WeakMap');

  var isSet = isIE11 ? ie11fingerprint(setMethods) : tagTester('Set');

  var isWeakSet = tagTester('WeakSet');

  // Retrieve the values of an object's properties.
  function values(obj) {
    var _keys = keys(obj);
    var length = _keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[_keys[i]];
    }
    return values;
  }

  // Convert an object into a list of `[key, value]` pairs.
  // The opposite of `_.object` with one argument.
  function pairs(obj) {
    var _keys = keys(obj);
    var length = _keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [_keys[i], obj[_keys[i]]];
    }
    return pairs;
  }

  // Invert the keys and values of an object. The values must be serializable.
  function invert(obj) {
    var result = {};
    var _keys = keys(obj);
    for (var i = 0, length = _keys.length; i < length; i++) {
      result[obj[_keys[i]]] = _keys[i];
    }
    return result;
  }

  // Return a sorted list of the function names available on the object.
  function functions(obj) {
    var names = [];
    for (var key in obj) {
      if (isFunction$1(obj[key])) names.push(key);
    }
    return names.sort();
  }

  // An internal function for creating assigner functions.
  function createAssigner(keysFunc, defaults) {
    return function(obj) {
      var length = arguments.length;
      if (defaults) obj = Object(obj);
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  }

  // Extend a given object with all the properties in passed-in object(s).
  var extend = createAssigner(allKeys);

  // Assigns a given object with all the own properties in the passed-in
  // object(s).
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  var extendOwn = createAssigner(keys);

  // Fill in a given object with default properties.
  var defaults = createAssigner(allKeys, true);

  // Create a naked function reference for surrogate-prototype-swapping.
  function ctor() {
    return function(){};
  }

  // An internal function for creating a new object that inherits from another.
  function baseCreate(prototype) {
    if (!isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    var Ctor = ctor();
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  }

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  function create(prototype, props) {
    var result = baseCreate(prototype);
    if (props) extendOwn(result, props);
    return result;
  }

  // Create a (shallow-cloned) duplicate of an object.
  function clone(obj) {
    if (!isObject(obj)) return obj;
    return isArray(obj) ? obj.slice() : extend({}, obj);
  }

  // Invokes `interceptor` with the `obj` and then returns `obj`.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  function tap(obj, interceptor) {
    interceptor(obj);
    return obj;
  }

  // Normalize a (deep) property `path` to array.
  // Like `_.iteratee`, this function can be customized.
  function toPath$1(path) {
    return isArray(path) ? path : [path];
  }
  _$1.toPath = toPath$1;

  // Internal wrapper for `_.toPath` to enable minification.
  // Similar to `cb` for `_.iteratee`.
  function toPath(path) {
    return _$1.toPath(path);
  }

  // Internal function to obtain a nested property in `obj` along `path`.
  function deepGet(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  }

  // Get the value of the (deep) property on `path` from `object`.
  // If any property in `path` does not exist or if the value is
  // `undefined`, return `defaultValue` instead.
  // The `path` is normalized through `_.toPath`.
  function get(object, path, defaultValue) {
    var value = deepGet(object, toPath(path));
    return isUndefined(value) ? defaultValue : value;
  }

  // Shortcut function for checking if an object has a given property directly on
  // itself (in other words, not on a prototype). Unlike the internal `has`
  // function, this public version can also traverse nested properties.
  function has(obj, path) {
    path = toPath(path);
    var length = path.length;
    for (var i = 0; i < length; i++) {
      var key = path[i];
      if (!has$1(obj, key)) return false;
      obj = obj[key];
    }
    return !!length;
  }

  // Keep the identity function around for default iteratees.
  function identity(value) {
    return value;
  }

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  function matcher(attrs) {
    attrs = extendOwn({}, attrs);
    return function(obj) {
      return isMatch(obj, attrs);
    };
  }

  // Creates a function that, when passed an object, will traverse that object’s
  // properties down the given `path`, specified as an array of keys or indices.
  function property(path) {
    path = toPath(path);
    return function(obj) {
      return deepGet(obj, path);
    };
  }

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  function optimizeCb(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      // The 2-argument case is omitted because we’re not using it.
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  }

  // An internal function to generate callbacks that can be applied to each
  // element in a collection, returning the desired result — either `_.identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  function baseIteratee(value, context, argCount) {
    if (value == null) return identity;
    if (isFunction$1(value)) return optimizeCb(value, context, argCount);
    if (isObject(value) && !isArray(value)) return matcher(value);
    return property(value);
  }

  // External wrapper for our callback generator. Users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
  // This abstraction hides the internal-only `argCount` argument.
  function iteratee(value, context) {
    return baseIteratee(value, context, Infinity);
  }
  _$1.iteratee = iteratee;

  // The function we call internally to generate a callback. It invokes
  // `_.iteratee` if overridden, otherwise `baseIteratee`.
  function cb(value, context, argCount) {
    if (_$1.iteratee !== iteratee) return _$1.iteratee(value, context);
    return baseIteratee(value, context, argCount);
  }

  // Returns the results of applying the `iteratee` to each element of `obj`.
  // In contrast to `_.map` it returns an object.
  function mapObject(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var _keys = keys(obj),
        length = _keys.length,
        results = {};
    for (var index = 0; index < length; index++) {
      var currentKey = _keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  }

  // Predicate-generating function. Often useful outside of Underscore.
  function noop(){}

  // Generates a function for a given object that returns a given property.
  function propertyOf(obj) {
    if (obj == null) return noop;
    return function(path) {
      return get(obj, path);
    };
  }

  // Run a function **n** times.
  function times(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  }

  // Return a random integer between `min` and `max` (inclusive).
  function random(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  // A (possibly faster) way to get the current timestamp as an integer.
  var now = Date.now || function() {
    return new Date().getTime();
  };

  // Internal helper to generate functions for escaping and unescaping strings
  // to/from HTML interpolation.
  function createEscaper(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = '(?:' + keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  }

  // Internal list of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };

  // Function for escaping strings to HTML interpolation.
  var _escape = createEscaper(escapeMap);

  // Internal list of HTML entities for unescaping.
  var unescapeMap = invert(escapeMap);

  // Function for unescaping strings from HTML interpolation.
  var _unescape = createEscaper(unescapeMap);

  // By default, Underscore uses ERB-style template delimiters. Change the
  // following template settings to use alternative delimiters.
  var templateSettings = _$1.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `_.templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

  function escapeChar(match) {
    return '\\' + escapes[match];
  }

  // In order to prevent third-party code injection through
  // `_.templateSettings.variable`, we test it against the following regular
  // expression. It is intentionally a bit more liberal than just matching valid
  // identifiers, but still prevents possible loopholes through defaults or
  // destructuring assignment.
  var bareIdentifier = /^\s*(\w|\$)+\s*$/;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  function template(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = defaults({}, settings, _$1.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      return match;
    });
    source += "';\n";

    var argument = settings.variable;
    if (argument) {
      // Insure against third-party code injection. (CVE-2021-23358)
      if (!bareIdentifier.test(argument)) throw new Error(
        'variable is not a bare identifier: ' + argument
      );
    } else {
      // If a variable is not specified, place data values in local scope.
      source = 'with(obj||{}){\n' + source + '}\n';
      argument = 'obj';
    }

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    var render;
    try {
      render = new Function(argument, '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _$1);
    };

    // Provide the compiled source as a convenience for precompilation.
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  }

  // Traverses the children of `obj` along `path`. If a child is a function, it
  // is invoked with its parent as context. Returns the value of the final
  // child, or `fallback` if any child is undefined.
  function result(obj, path, fallback) {
    path = toPath(path);
    var length = path.length;
    if (!length) {
      return isFunction$1(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i = 0; i < length; i++) {
      var prop = obj == null ? void 0 : obj[path[i]];
      if (prop === void 0) {
        prop = fallback;
        i = length; // Ensure we don't continue iterating.
      }
      obj = isFunction$1(prop) ? prop.call(obj) : prop;
    }
    return obj;
  }

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  function uniqueId(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  }

  // Start chaining a wrapped Underscore object.
  function chain(obj) {
    var instance = _$1(obj);
    instance._chain = true;
    return instance;
  }

  // Internal function to execute `sourceFunc` bound to `context` with optional
  // `args`. Determines whether to execute a function as a constructor or as a
  // normal function.
  function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (isObject(result)) return result;
    return self;
  }

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. `_` acts
  // as a placeholder by default, allowing any combination of arguments to be
  // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
  var partial = restArguments(function(func, boundArgs) {
    var placeholder = partial.placeholder;
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  });

  partial.placeholder = _$1;

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally).
  var bind = restArguments(function(func, context, args) {
    if (!isFunction$1(func)) throw new TypeError('Bind must be called on a function');
    var bound = restArguments(function(callArgs) {
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    return bound;
  });

  // Internal helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // Related: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var isArrayLike = createSizePropertyCheck(getLength);

  // Internal implementation of a recursive `flatten` function.
  function flatten$1(input, depth, strict, output) {
    output = output || [];
    if (!depth && depth !== 0) {
      depth = Infinity;
    } else if (depth <= 0) {
      return output.concat(input);
    }
    var idx = output.length;
    for (var i = 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (isArray(value) || isArguments$1(value))) {
        // Flatten current level of array or arguments object.
        if (depth > 1) {
          flatten$1(value, depth - 1, strict, output);
          idx = output.length;
        } else {
          var j = 0, len = value.length;
          while (j < len) output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  }

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  var bindAll = restArguments(function(obj, keys) {
    keys = flatten$1(keys, false, false);
    var index = keys.length;
    if (index < 1) throw new Error('bindAll must be passed function names');
    while (index--) {
      var key = keys[index];
      obj[key] = bind(obj[key], obj);
    }
    return obj;
  });

  // Memoize an expensive function by storing its results.
  function memoize(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!has$1(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  }

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  var delay = restArguments(function(func, wait, args) {
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  });

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  var defer = partial(delay, _$1, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  function throttle(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
      previous = options.leading === false ? 0 : now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function() {
      var _now = now();
      if (!previous && options.leading === false) previous = _now;
      var remaining = wait - (_now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = _now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  }

  // When a sequence of calls of the returned function ends, the argument
  // function is triggered. The end of a sequence is defined by the `wait`
  // parameter. If `immediate` is passed, the argument function will be
  // triggered at the beginning of the sequence instead of at the end.
  function debounce(func, wait, immediate) {
    var timeout, previous, args, result, context;

    var later = function() {
      var passed = now() - previous;
      if (wait > passed) {
        timeout = setTimeout(later, wait - passed);
      } else {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
        // This check is needed because `func` can recursively invoke `debounced`.
        if (!timeout) args = context = null;
      }
    };

    var debounced = restArguments(function(_args) {
      context = this;
      args = _args;
      previous = now();
      if (!timeout) {
        timeout = setTimeout(later, wait);
        if (immediate) result = func.apply(context, args);
      }
      return result;
    });

    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = args = context = null;
    };

    return debounced;
  }

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  function wrap(func, wrapper) {
    return partial(wrapper, func);
  }

  // Returns a negated version of the passed-in predicate.
  function negate(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  }

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  function compose() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  }

  // Returns a function that will only be executed on and after the Nth call.
  function after(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  }

  // Returns a function that will only be executed up to (but not including) the
  // Nth call.
  function before(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  }

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  var once = partial(before, 2);

  // Returns the first key on an object that passes a truth test.
  function findKey(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = keys(obj), key;
    for (var i = 0, length = _keys.length; i < length; i++) {
      key = _keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  }

  // Internal function to generate `_.findIndex` and `_.findLastIndex`.
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a truth test.
  var findIndex = createPredicateIndexFinder(1);

  // Returns the last index on an array-like that passes a truth test.
  var findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  function sortedIndex(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  }

  // Internal function to generate the `_.indexOf` and `_.lastIndexOf` functions.
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), isNaN$1);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  var indexOf = createIndexFinder(1, findIndex, sortedIndex);

  // Return the position of the last occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  var lastIndexOf = createIndexFinder(-1, findLastIndex);

  // Return the first value which passes a truth test.
  function find(obj, predicate, context) {
    var keyFinder = isArrayLike(obj) ? findIndex : findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  }

  // Convenience version of a common use case of `_.find`: getting the first
  // object containing specific `key:value` pairs.
  function findWhere(obj, attrs) {
    return find(obj, matcher(attrs));
  }

  // The cornerstone for collection functions, an `each`
  // implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  function each(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var _keys = keys(obj);
      for (i = 0, length = _keys.length; i < length; i++) {
        iteratee(obj[_keys[i]], _keys[i], obj);
      }
    }
    return obj;
  }

  // Return the results of applying the iteratee to each element.
  function map(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var _keys = !isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  }

  // Internal helper to create a reducing function, iterating left or right.
  function createReduce(dir) {
    // Wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    var reducer = function(obj, iteratee, memo, initial) {
      var _keys = !isArrayLike(obj) && keys(obj),
          length = (_keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      if (!initial) {
        memo = obj[_keys ? _keys[index] : index];
        index += dir;
      }
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = _keys ? _keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };

    return function(obj, iteratee, memo, context) {
      var initial = arguments.length >= 3;
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  var reduce = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  var reduceRight = createReduce(-1);

  // Return all the elements that pass a truth test.
  function filter(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  }

  // Return all the elements for which a truth test fails.
  function reject(obj, predicate, context) {
    return filter(obj, negate(cb(predicate)), context);
  }

  // Determine whether all of the elements pass a truth test.
  function every(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = !isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  }

  // Determine if at least one element in the object passes a truth test.
  function some(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = !isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  }

  // Determine if the array or object contains a given item (using `===`).
  function contains(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return indexOf(obj, item, fromIndex) >= 0;
  }

  // Invoke a method (with arguments) on every item in a collection.
  var invoke = restArguments(function(obj, path, args) {
    var contextPath, func;
    if (isFunction$1(path)) {
      func = path;
    } else {
      path = toPath(path);
      contextPath = path.slice(0, -1);
      path = path[path.length - 1];
    }
    return map(obj, function(context) {
      var method = func;
      if (!method) {
        if (contextPath && contextPath.length) {
          context = deepGet(context, contextPath);
        }
        if (context == null) return void 0;
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });

  // Convenience version of a common use case of `_.map`: fetching a property.
  function pluck(obj, key) {
    return map(obj, property(key));
  }

  // Convenience version of a common use case of `_.filter`: selecting only
  // objects containing specific `key:value` pairs.
  function where(obj, attrs) {
    return filter(obj, matcher(attrs));
  }

  // Return the maximum element (or element-based computation).
  function max(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  }

  // Return the minimum element (or element-based computation).
  function min(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  }

  // Safely create a real, live array from anything iterable.
  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  function toArray(obj) {
    if (!obj) return [];
    if (isArray(obj)) return slice.call(obj);
    if (isString(obj)) {
      // Keep surrogate pair characters together.
      return obj.match(reStrSymbol);
    }
    if (isArrayLike(obj)) return map(obj, identity);
    return values(obj);
  }

  // Sample **n** random values from a collection using the modern version of the
  // [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `_.map`.
  function sample(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = values(obj);
      return obj[random(obj.length - 1)];
    }
    var sample = toArray(obj);
    var length = getLength(sample);
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
  }

  // Shuffle a collection.
  function shuffle(obj) {
    return sample(obj, Infinity);
  }

  // Sort the object's values by a criterion produced by an iteratee.
  function sortBy(obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    return pluck(map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  }

  // An internal function used for aggregate "group by" operations.
  function group(behavior, partition) {
    return function(obj, iteratee, context) {
      var result = partition ? [[], []] : {};
      iteratee = cb(iteratee, context);
      each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  }

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  var groupBy = group(function(result, value, key) {
    if (has$1(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `_.groupBy`, but for
  // when you know that your index values will be unique.
  var indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  var countBy = group(function(result, value, key) {
    if (has$1(result, key)) result[key]++; else result[key] = 1;
  });

  // Split a collection into two arrays: one whose elements all pass the given
  // truth test, and one whose elements all do not pass the truth test.
  var partition = group(function(result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);

  // Return the number of elements in a collection.
  function size(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : keys(obj).length;
  }

  // Internal `_.pick` helper function to determine whether `key` is an enumerable
  // property name of `obj`.
  function keyInObj(value, key, obj) {
    return key in obj;
  }

  // Return a copy of the object only containing the allowed properties.
  var pick = restArguments(function(obj, keys) {
    var result = {}, iteratee = keys[0];
    if (obj == null) return result;
    if (isFunction$1(iteratee)) {
      if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
      keys = allKeys(obj);
    } else {
      iteratee = keyInObj;
      keys = flatten$1(keys, false, false);
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  });

  // Return a copy of the object without the disallowed properties.
  var omit = restArguments(function(obj, keys) {
    var iteratee = keys[0], context;
    if (isFunction$1(iteratee)) {
      iteratee = negate(iteratee);
      if (keys.length > 1) context = keys[1];
    } else {
      keys = map(flatten$1(keys, false, false), String);
      iteratee = function(value, key) {
        return !contains(keys, key);
      };
    }
    return pick(obj, iteratee, context);
  });

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  function initial(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  }

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. The **guard** check allows it to work with `_.map`.
  function first(array, n, guard) {
    if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
    if (n == null || guard) return array[0];
    return initial(array, array.length - n);
  }

  // Returns everything but the first entry of the `array`. Especially useful on
  // the `arguments` object. Passing an **n** will return the rest N values in the
  // `array`.
  function rest(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  }

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  function last(array, n, guard) {
    if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
    if (n == null || guard) return array[array.length - 1];
    return rest(array, Math.max(0, array.length - n));
  }

  // Trim out all falsy values from an array.
  function compact(array) {
    return filter(array, Boolean);
  }

  // Flatten out an array, either recursively (by default), or up to `depth`.
  // Passing `true` or `false` as `depth` means `1` or `Infinity`, respectively.
  function flatten(array, depth) {
    return flatten$1(array, depth, false);
  }

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  var difference = restArguments(function(array, rest) {
    rest = flatten$1(rest, true, true);
    return filter(array, function(value){
      return !contains(rest, value);
    });
  });

  // Return a version of the array that does not contain the specified value(s).
  var without = restArguments(function(array, otherArrays) {
    return difference(array, otherArrays);
  });

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // The faster algorithm will not work with an iteratee if the iteratee
  // is not a one-to-one function, so providing an iteratee will disable
  // the faster algorithm.
  function uniq(array, isSorted, iteratee, context) {
    if (!isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted && !iteratee) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  }

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  var union = restArguments(function(arrays) {
    return uniq(flatten$1(arrays, true, true));
  });

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  function intersection(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (contains(result, item)) continue;
      var j;
      for (j = 1; j < argsLength; j++) {
        if (!contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  }

  // Complement of zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices.
  function unzip(array) {
    var length = array && max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = pluck(array, index);
    }
    return result;
  }

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  var zip = restArguments(unzip);

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values. Passing by pairs is the reverse of `_.pairs`.
  function object(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  }

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](https://docs.python.org/library/functions.html#range).
  function range(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  }

  // Chunk a single array into multiple arrays, each containing `count` or fewer
  // items.
  function chunk(array, count) {
    if (count == null || count < 1) return [];
    var result = [];
    var i = 0, length = array.length;
    while (i < length) {
      result.push(slice.call(array, i, i += count));
    }
    return result;
  }

  // Helper function to continue chaining intermediate results.
  function chainResult(instance, obj) {
    return instance._chain ? _$1(obj).chain() : obj;
  }

  // Add your own custom functions to the Underscore object.
  function mixin(obj) {
    each(functions(obj), function(name) {
      var func = _$1[name] = obj[name];
      _$1.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_$1, args));
      };
    });
    return _$1;
  }

  // Add all mutator `Array` functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _$1.prototype[name] = function() {
      var obj = this._wrapped;
      if (obj != null) {
        method.apply(obj, arguments);
        if ((name === 'shift' || name === 'splice') && obj.length === 0) {
          delete obj[0];
        }
      }
      return chainResult(this, obj);
    };
  });

  // Add all accessor `Array` functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _$1.prototype[name] = function() {
      var obj = this._wrapped;
      if (obj != null) obj = method.apply(obj, arguments);
      return chainResult(this, obj);
    };
  });

  // Named Exports

  var allExports = {
    __proto__: null,
    VERSION: VERSION,
    restArguments: restArguments,
    isObject: isObject,
    isNull: isNull,
    isUndefined: isUndefined,
    isBoolean: isBoolean,
    isElement: isElement,
    isString: isString,
    isNumber: isNumber,
    isDate: isDate,
    isRegExp: isRegExp,
    isError: isError,
    isSymbol: isSymbol,
    isArrayBuffer: isArrayBuffer,
    isDataView: isDataView$1,
    isArray: isArray,
    isFunction: isFunction$1,
    isArguments: isArguments$1,
    isFinite: isFinite$1,
    isNaN: isNaN$1,
    isTypedArray: isTypedArray$1,
    isEmpty: isEmpty,
    isMatch: isMatch,
    isEqual: isEqual,
    isMap: isMap,
    isWeakMap: isWeakMap,
    isSet: isSet,
    isWeakSet: isWeakSet,
    keys: keys,
    allKeys: allKeys,
    values: values,
    pairs: pairs,
    invert: invert,
    functions: functions,
    methods: functions,
    extend: extend,
    extendOwn: extendOwn,
    assign: extendOwn,
    defaults: defaults,
    create: create,
    clone: clone,
    tap: tap,
    get: get,
    has: has,
    mapObject: mapObject,
    identity: identity,
    constant: constant,
    noop: noop,
    toPath: toPath$1,
    property: property,
    propertyOf: propertyOf,
    matcher: matcher,
    matches: matcher,
    times: times,
    random: random,
    now: now,
    escape: _escape,
    unescape: _unescape,
    templateSettings: templateSettings,
    template: template,
    result: result,
    uniqueId: uniqueId,
    chain: chain,
    iteratee: iteratee,
    partial: partial,
    bind: bind,
    bindAll: bindAll,
    memoize: memoize,
    delay: delay,
    defer: defer,
    throttle: throttle,
    debounce: debounce,
    wrap: wrap,
    negate: negate,
    compose: compose,
    after: after,
    before: before,
    once: once,
    findKey: findKey,
    findIndex: findIndex,
    findLastIndex: findLastIndex,
    sortedIndex: sortedIndex,
    indexOf: indexOf,
    lastIndexOf: lastIndexOf,
    find: find,
    detect: find,
    findWhere: findWhere,
    each: each,
    forEach: each,
    map: map,
    collect: map,
    reduce: reduce,
    foldl: reduce,
    inject: reduce,
    reduceRight: reduceRight,
    foldr: reduceRight,
    filter: filter,
    select: filter,
    reject: reject,
    every: every,
    all: every,
    some: some,
    any: some,
    contains: contains,
    includes: contains,
    include: contains,
    invoke: invoke,
    pluck: pluck,
    where: where,
    max: max,
    min: min,
    shuffle: shuffle,
    sample: sample,
    sortBy: sortBy,
    groupBy: groupBy,
    indexBy: indexBy,
    countBy: countBy,
    partition: partition,
    toArray: toArray,
    size: size,
    pick: pick,
    omit: omit,
    first: first,
    head: first,
    take: first,
    initial: initial,
    last: last,
    rest: rest,
    tail: rest,
    drop: rest,
    compact: compact,
    flatten: flatten,
    without: without,
    uniq: uniq,
    unique: uniq,
    union: union,
    intersection: intersection,
    difference: difference,
    unzip: unzip,
    transpose: unzip,
    zip: zip,
    object: object,
    range: range,
    chunk: chunk,
    mixin: mixin,
    'default': _$1
  };

  // Default Export

  // Add all of the Underscore functions to the wrapper object.
  var _ = mixin(allExports);
  // Legacy Node.js API.
  _._ = _;

  return _;

})));


}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/components/DataTable.js":[function(require,module,exports){
var mc = module.exports
mc.Datatable = (function () {
    var ids = 0;


    var dt = {

        controller: function (cols, config) {
            this.cols = cols;
            this.config = config = config || {};

            this.currentSelection = [];


            if (config.url) {
                this.data = m.request({
                    url: config.url,
                    header: config.header, 
                    config: function (xhr) {
                        xhr.setRequestHeader('Authorization', config.authorization);
                    },
                    method: 'GET'
                });
            }
            if (config.data) {
                this.data = (typeof config.data == 'function' ? config.data : m.prop(config.data));
            }



            this.sort = function (target) {
                var key = target.parentNode.getAttribute('data-colkey'),
                    col = this.activeCols[key];
                if (this.lastSorted && this.lastSorted != key) {
                    this.activeCols[this.lastSorted]._sorted = 'none';
                }
                var reverse = (col._sorted == 'asc' ? -1 : 1);
                this.data(this.data().sort(function (a, b) {
                    a = a[key];
                    b = b[key];
                    return (a == b ? 0 : (a < b ? -1 : 1) * reverse);
                }));
                col._sorted = (reverse > 0 ? 'asc' : 'desc');
                this.lastSorted = key;
                m.render(this._tableEl, dt.contentsView(this));
            };

            this.onCellClick = function (target) {
                while (target.nodeName != 'TD' && target.nodeName != 'TABLE') target = target.parentNode;
                if (target.nodeName == 'TABLE') return;

                var colIndex = target.cellIndex,
                    col = this.dataRow[colIndex],
                    recordId = target.parentNode.getAttribute('data-record-id'),
                    idField = config.recordId || 'id',
                    row;

                this.data().some(function (r) {
                    if (r[idField] == recordId) {
                        row = r;
                        return true;
                    }
                });

                m.startComputation();
                var ret = this.config.onCellClick.call(this, row[col.field || col.key], row, col);
                m.endComputation();
                return ret;
            };

            this.onRowSelect = function (e, target) {

                var rs = this.config.rowSelect,
                    multi = rs.multiple,
                    callback = rs.callback,
                    sel = this.currentSelection || [],
                    lastSel = this.lastSelection,
                    inRange = false,
                    idField = config.recordId || 'id';

                if (typeof callback != 'function') return;
                while (target.nodeName != 'TR' && target.nodeName != 'TABLE') target = target.parentNode;
                if (target.nodeName == 'TABLE') return;
                var recordId = target.getAttribute('data-record-id');
                if (parseInt(recordId, 10) == recordId) recordId = parseInt(recordId, 10);


                m.startComputation();
                if (multi && e.ctrlKey) {
                    var i = sel.indexOf(recordId);
                    if (i == -1) {
                        sel.push(recordId);
                    } else {
                        sel.splice(i, 1);
                    }
                } else if (multi && e.shiftKey) {
                    clearSelection();
                    this.data().forEach(function (row) {
                        var id = row[idField];
                        if (inRange) {
                            if (sel.indexOf(id) == -1) sel.push(id);
                            if (id == lastSel || id == recordId) inRange = false;
                        } else {
                            if (id == lastSel || id == recordId) {
                                if (sel.indexOf(id) == -1) sel.push(id);
                                inRange = true;
                            }
                        }
                    });
                } else {
                    sel = (sel.length == 1 && sel[0] == recordId ? [] : [recordId]);
                }
                this.lastSelection = recordId;
                this.currentSelection = sel;
                callback(sel);
                m.endComputation();
            };

            this.onclick = function (e) {
                var target = e.target;
                if (target.nodeName == 'I' && /\bfa\-sort/.test(target.className)) return this.sort(target);
                if (this.config.rowSelect) {
                    this.onRowSelect(e, target);
                }
                if (typeof this.config.onCellClick == 'function') {
                    return this.onCellClick(target);
                }

            }.bind(this);

            this.setWidth = function (attrs, width) {
                if (!width) return;
                if (/^\d+$/.test(width)) width += 'px';
                if (!attrs.style) attrs.style = '';
                if (width) attrs.style += 'width:' + width + ';';
            };
        },
        view: function (ctrl, options) {
            var cols = ctrl.cols;
            ctrl.viewOptions = options;

            if (!ctrl.data()) {
                return m('div', 'Sorry, no data to display');
            }
            options = options || {};
            options.classNames = options.classNames || {};

            var attrs = {
                class: options.classNames.table || 'table table-striped table-bordered table-hover',
                config: function (el, isOld) {
                    if (isOld) return;
                    el.addEventListener('click', ctrl.onclick);
                    ctrl._tableEl = el;
                    m.module(el, {
                        controller: function () {
                            return ctrl;
                        },
                        view: dt.contentsView
                    });
                }

            };

            ctrl.setWidth(attrs, options.width);

            return m(
                'table',
                attrs
            );


        },
        contentsView: function (ctrl) {
            var cols = ctrl.cols,
                options = ctrl.viewOptions;

            return [
                dt.headView(ctrl, cols, options),
                dt.bodyView(ctrl, cols, options, ctrl.data()),
                dt.captionView(ctrl, options)
            ];
        },
        headView: function (ctrl, cols, options) {
            var matrix = [],
                rowNum = 0,
                dataRow = [];
            var calcDepth = function (maxDepth, col) {
                var depth = 0;
                if (!matrix[rowNum]) {
                    matrix[rowNum] = [];
                }
                matrix[rowNum].push(col);
                if (col.children) {
                    col._colspan = col.children.length;
                    rowNum++;
                    depth = col.children.reduce(calcDepth, 0) + 1;
                    rowNum--;
                    depth = Math.max(maxDepth, depth);
                } else {
                    dataRow.push(col);
                }
                col._depth = depth;
                return depth;
            };



            var maxDepth = cols.reduce(calcDepth, 0);
            ctrl.dataRow = dataRow;
            var activeCols = {};
            dataRow.forEach(function (col) {
                activeCols[col.key] = col;
            });
            ctrl.activeCols = activeCols;

            var buildHeaderRow = function (row, rowNum) {
                var buildHeaderCell = function (col) {
                    var attrs = {};
                    if (col._colspan && col._colspan > 1) attrs.colspan = col._colspan;
                    if (col.class) attrs.class = col.class;
                    if (!col._depth) {
                        attrs['data-colKey'] = col.key;
                        ctrl.setWidth(attrs, col.width);
                        if (rowNum < maxDepth) attrs.rowspan = maxDepth - rowNum + 1;
                        if (col._sorted && col._sorted != 'none') attrs.class = options.classNames.sorted || 'sorted';
                    }

                    return m(
                        'th',
                        attrs, [
                            (!col._depth && col.sortable ? m(
                                'i.fa', {
                                    class: {
                                        asc: 'fa-sort-asc',
                                        desc: 'fa-sort-desc',
                                        none: 'fa-sort'
                                    }[col._sorted || 'none']
                                }
                            ) : ''),
                            m.trust(' '),
                            col.label || col.key
                        ]
                    );
                };

                return m(
                    'tr',
                    row.map(buildHeaderCell)
                );
            };
            return m('thead', matrix.map(buildHeaderRow));
        },


        bodyView: function (ctrl, cols, options, data) {
            var idField = ctrl.config.recordId || 'id';
            var buildDataRow = function (row, rowIndex) {
                var buildDataCell = function (col) {
                    var value = row[col.field || col.key],
                        attrs = {};

                    if (typeof col.formatter == 'function') {
                        value = col.formatter.call(ctrl, value, row, col, attrs);
                    }
                    if (!attrs.class) attrs.class = '';
                    if (col._sorted && col._sorted != 'none') attrs.class += ' ' + (options.classNames.sorted || 'sorted');
                    if (col.class) attrs.class += ' ' + col.class;

                    if (!attrs.class) delete attrs.class;
                    return m(
                        'td',
                        attrs,
                        value
                    );
                };
                if (row[idField] === undefined) row[idField] = ids++;
                var recordId = row[idField];

                return m(
                    'tr', {
                        'data-record-id': recordId,
                        class: (rowIndex & 1 ? options.classNames.odd || 'odd' : options.classNames.even || 'even') +
                        (ctrl.currentSelection.indexOf(recordId) != -1 ? options.classNames.selected || ' selected' : '')
                    },
                    ctrl.dataRow.map(buildDataCell)
                );
            };
            return m('tbody', data.map(buildDataRow));
        },
        captionView: function (ctrl, options) {
            if (options.caption) return m('caption', options.caption);
        },
    };
    /* global document:false, window:false */
    function clearSelection() {
        if (document.selection && document.selection.empty) {
            document.selection.empty();
        } else if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    }

    return dt;
})();

},{}],"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/components/Navbar.js":[function(require,module,exports){

var Auth = require('../models/Auth.js');

var Navbar = module.exports = {
  controller: function() {
    var ctrl = this;

    var links = (Auth.token() ?
    [


      ,{label:'Users' ,href: '/users'},
      ,{label:'Tests' ,href: '/tests'},
      {label:'Logout', href:'/logout'}
    ]:[
      {label:'Login', href:'/login'}
 
    ])
    .map(function(l){
      return m("li" + (m.route() === l.href ? '.active': ''), m("a[href='" + l.href + "']", l.normal?{}:{config: m.route}, l.label));
    });

    ctrl.links = m.prop(links);

    ctrl.iconDirection = m.prop('down');

    ctrl.toggle = function(){
      ctrl.iconDirection( ctrl.iconDirection()=='up' ? 'down':'up' );
    };
  },

  view: function(ctrl) {
    return m("nav.navbar.navbar-inverse.navbar-fixed-top", [
      m(".container", [
        m(".navbar-header",
          m('button.navbar-toggle', {onclick: ctrl.toggle}, m('.glyphicon.glyphicon-chevron-' + ctrl.iconDirection())),
          m("a.navbar-brand[href='/']", {config: m.route}, "Assessment System")
        ),
        m(".navbar-collapse." + ctrl.iconDirection(), 
          m("ul.nav.navbar-nav.navbar-right", ctrl.links())
        )
      ])
    ]);
  }
};
},{"../models/Auth.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/models/Auth.js"}],"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/components/QuestionWidget.js":[function(require,module,exports){
// var Question = require('../models/Question.js');

var QuestionsWidget = module.exports = {
    controller: function (question,questionCounterId) {
        this.question = question
        
        // this.save = function (question) {
        //     Question.save(question).then(function (params) {

        //         question.body('')
        //         return params
        //     }).then(update.bind(this))
        // }.bind(this)
        this.setGval=function name(val) {
            gval=val
        }
    },
    view: function (ctrl, question,questionCounterId) {
        return m('div', [
            m.component(QuestionForm, question,questionCounterId),
            m.component(OptionList, question.options,questionCounterId)
            ,
            m("hr[style='border: 1px solid #2b66ff;']")
        ])
    } 
}

var QuestionForm = {
    controller: function (question) {
        this.question = question
    },
    view: function (ctrl, question,questionCounterId) {
       

        return m("dev", [
     

            m('.form-group', [
              
                m("input.form-control[name='question"+questionCounterId+":name'][id='inputname'][placeholder='name '][required][type='text']",{value: question.label}),
              ]), 

                m("textarea.form-control[name='question"+questionCounterId+":description'][id='inputdescription'][placeholder='description '][required][type='text']",{value:question.description}),
               ,
    

                
            //    m("button.btn.btn-danger", "Delete")
         
        ])
       
    }
}

var OptionList = {
    view: function (ctrl, options,questionCounterId) {
        optionCounterId=0;
        return m('div',m("br"),m("table.table.table-condensed.table-bordered",m("tr",[m("th","Title"),m("th","is correct")]),m('tbody', [
            options.map(function (option) {
                optionCounterId+=1;
                return m("tr", [

                    m("td", m("input.form-control[name='question"+questionCounterId+":option"+optionCounterId+":title'][id='inputname'][placeholder='name '][required][type='text']",{value: option.title})), 
                    m("td", m("input[style='width: 100%;height: 30px;'][name='question"+questionCounterId+":option"+optionCounterId+":is_correct'][id='inputname'][type='checkbox']",{checked: option.is_correct,value:option.is_correct})),
                    m("td", m("button.btn.btn-danger", "Delete"))
                ])
            })
        ])))
    }
} 
},{}],"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/components/Questions.js":[function(require,module,exports){
var Questions = module.exports = {
  controller: function() {
    var ctrl = this;
    

  },

  view: function(ctrl,args) {
     return [m("table", [
            args.questions.map(function(question) {
                return m("tr", [
                    m("td", question.body),
                ])
            })
        ]), m("form", [
            m("label", "Body"),
            m("textArea", {oninput: m.withAttr("value", question.body), value: question.body()}),

            m("button[type=button]", {onclick: args.onsave.bind(this, question)}, "Save")
        ])]
  }
};
},{}],"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/main.js":[function(require,module,exports){
// main.js

'use strict';

var _ = require('underscore');
var names = ['blue t-shirt', 'yellow t-shirt', 'green t-shirt'];
 
_.each(names, function(n) {
	console.log(n);
});

//initialize the application



// m.module(document.getElementById("page-app"), {controller: todo.controller, view: todo.view});//




var req = function(args) {
  return m.request(args)
}
m.route(document.body, "/", {
  "/": require('./pages/Users.js'),
  "/login": require('./pages/Login.js'),
  "/logout": require('./pages/Logout.js'),
 
  "/userEdit": require('./pages/UserEdit.js'),
  "/verify/:code": require('./pages/Verify.js'),
  "/user": require('./pages/UserPage.js'),
  "/users": require('./pages/Users.js'),
   
  "/testEdit": require('./pages/TestEdit.js'),
  "/verify/:code": require('./pages/Verify.js'),
  "/test": require('./pages/TestPage.js'),
  "/tests": require('./pages/Tests.js')

});

},{"./pages/Login.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/pages/Login.js","./pages/Logout.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/pages/Logout.js","./pages/TestEdit.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/pages/TestEdit.js","./pages/TestPage.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/pages/TestPage.js","./pages/Tests.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/pages/Tests.js","./pages/UserEdit.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/pages/UserEdit.js","./pages/UserPage.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/pages/UserPage.js","./pages/Users.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/pages/Users.js","./pages/Verify.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/pages/Verify.js","underscore":"/home/ahmed/Oivan/Rails7/student_assessment/node_modules/underscore/underscore-umd.js"}],"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/models/Auth.js":[function(require,module,exports){


var Auth = module.exports = {
  token: m.prop(localStorage.token),
  user_type: m.prop(localStorage.user_type),
  
  // trade credentials for a token
  login: function(email, password){
    return m.request({
      method: 'POST',
      url: '/portal/auth/login',
      data: {email:email, password:password},
      unwrapSuccess: function(res) {
        localStorage.token = res.auth_token;
        localStorage.user_type=res.user_type
        Auth.user_type(res.user_type)
        return res.auth_token;
      }
    })
    .then(this.token);
  },
  // forget token
  logout: function(){
    this.token(false);
    delete localStorage.token;
  },




  // make an authenticated request
  req: function(options){
    if (typeof options == 'string'){
      options = {method:'GET', url:options};
    }
    var oldConfig = options.config || function(){};
    options.config = function(xhr) {
      xhr.setRequestHeader("Authorization",  Auth.token());
      oldConfig(xhr);
    };

    // try request, if auth error, redirect
    // TODO: remember where the user was, originally
    var deferred = m.deferred();
     m.request(options).then(deferred.resolve, function(err){
      if (err.status === 401){
        logout
        m.route('?/users')
      }else{
        throw err
      }
      
    }).then(deferred.resolve,deferred.reject);

     return deferred.promise;
  }
};
},{}],"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/models/Test.js":[function(require,module,exports){
// User model
var Auth = require('./Auth.js');
var User = module.exports = {
 

    send: function (data,id) {
        return Auth.req({
            method: id ? 'PUT' : 'POST',
            url: '/api/v1/tests'+(id?'/'+id : '') 
            , 
            data: data
        });
    },
  
    get: function (id) {
        return Auth.req({
            method: 'get',
            url: '/api/v1/tests/'+id,
           

        });
    },delete: function (id) {
        return Auth.req({
            method: 'delete',
            url: '/api/v1/tests/'+id,
           

        });
    },
};

module.exports = User;
},{"./Auth.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/models/Auth.js"}],"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/models/User.js":[function(require,module,exports){
// User model
var Auth = require('./Auth.js');
var User = module.exports = {
 

    send: function (data,id) {
        return Auth.req({
            method: id ? 'PUT' : 'POST',
            url: '/api/v1/users'+(id?'/'+id : '') 
            , 
            data: data
        });
    },
  
    get: function (id) {
        return Auth.req({
            method: 'get',
            url: '/api/v1/users/'+id,
           

        });
    },delete: function (id) {
        return Auth.req({
            method: 'delete',
            url: '/api/v1/users/'+id,
           

        });
    },
};

module.exports = User;
},{"./Auth.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/models/Auth.js"}],"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/pages/Login.js":[function(require,module,exports){


var Navbar = require('../components/Navbar.js');
var Auth = require('../models/Auth.js');

var Login = module.exports = {
  controller: function(){
    var ctrl = this;
    ctrl.navbar = new Navbar.controller();
    ctrl.error = m.prop('');
    this.login = function(e){
      e.preventDefault();
      Auth.login(e.target.email.value, e.target.password.value)
        .then(function(){
          m.route(Auth.originalRoute || '/', null, true);
        }, function(err){
          ctrl.error(m(".alert.alert-danger.animated.fadeInUp", JSON.stringify(err)));
        });
    };
  },  

  view: function(ctrl){
    return [Navbar.view(ctrl.navbar), m(".container", [
      m("form.text-center.row.form-signin", {onsubmit:ctrl.login.bind(ctrl)},
        m('.col-sm-6.col-sm-offset-3', [
          m("h1", "login"),
          ctrl.error(), 
          m('.form-group', [
            m("label.sr-only[for='inputEmail']", "Email address"),
            m("input.form-control[name='email'][autofocus][id='inputEmail'][placeholder='Email address'][required][type='email']"),
          ]),
          m('.form-group', [
            m("label.sr-only[for='inputPassword']", "Password"),
            m("input.form-control[name='password'][autocomplete='off'][id='inputPassword'][placeholder='Password'][required][type='password']"),
          ]),
          m('.form-group',
            m("button.btn.btn-lg.btn-primary.btn-block[type='submit']", "Sign in")
          )
        ])
      )
    ])];
  }
};
},{"../components/Navbar.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/components/Navbar.js","../models/Auth.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/models/Auth.js"}],"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/pages/Logout.js":[function(require,module,exports){


var Auth = require('../models/Auth.js');

var Logout = module.exports = {
  controller: function(){
    Auth.logout();
    m.route('/login');
  },

  view: function(ctrl){
  }
};
},{"../models/Auth.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/models/Auth.js"}],"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/pages/TestEdit.js":[function(require,module,exports){


var Navbar = require('../components/Navbar.js');
var Auth = require('../models/Auth.js');
var Test = require('../models/Test.js');
var Questions = require('../components/Questions.js');
var QuestionWidget = require('../components/QuestionWidget.js');
var TestEdit = module.exports = {
  controller: function (args) {
    ctrl = this;
    ctrl.test = { name: '', description: '', questions: [] }
    ctrl.navbar = new Navbar.controller();
    ctrl.error = m.prop('');
    ctrl.newQ = m.prop([]);
    ctrl.questionCounterId = 0
    ctrl.delete=function(ctrl){
      Test.delete(m.route.param().id)
        .then(function (test) {
          var message = 'test deleted successfuly';

          ctrl.error(m(".alert.alert-danger.animated.fadeInUp", message));
          m.route('/tests');
          m.route('/tests')
        }, function (err) {
          var message = 'An error occurred.';
          ctrl.error(m(".alert.alert-danger.animated.fadeInUp", message));
        });
    }
    ctrl.saveTest = function (e) {
      e.preventDefault();
      // validation
      testData = { test: { name: e.target.name.value, description: e.target.description.value, questions: {} } }
      for (let i = 0; i < e.target.length; i++) {
        // formData[target.elements[i].getAttribute("name")] = target.elements[i].value;
        ename = e.target[i].name
        console.log(ename)
        if (ename.startsWith('question')) {
          e_arr = ename.split(':')
          if (testData.test.questions[e_arr[0]] == undefined) {
            testData.test.questions[e_arr[0]] = {}
          }
          if (e_arr.length == 2) {
            testData.test.questions[e_arr[0]][e_arr[1]] = e.target[i].value
          } else {
            if (testData.test.questions[e_arr[0]][e_arr[1]] == undefined) {
              testData.test.questions[e_arr[0]][e_arr[1]] = {}
            }
            testData.test.questions[e_arr[0]][e_arr[1]][e_arr[2]] = e.target[i].value
          }
        }


      }
      questions = testData.test.questions
      testData.test.questions_attributes = []
      Object.keys(questions).forEach(function (key) {
        var value = questions[key]
        question = { label: value.name, description: value.description, options_attributes: [] }
        Object.keys(value).forEach(function (qkey) {
          var valueinside = value[qkey]
          if (qkey.startsWith("option")) {
            question.options_attributes.push(valueinside)
          }
        })
        testData.test.questions_attributes.push(question)
      }
      ); 
      delete testData.test.questions

      // insertion
      Test.send(testData, ctrl.test.id)
        .then(function () {
          ctrl.error(m(".alert.alert-success.animated.fadeInUp", 'test have been saved'));
        }, function (err) {


          ctrl.error(m(".alert.alert-danger.animated.fadeInUp", JSON.stringify(err)));
        });
    };
    if (m.route.param().id != undefined)
      Test.get(m.route.param().id)
        .then(function (test) {

          ctrl.test = test
        }, function (err) {
          var message = 'An error occurred.';
          m.route('/tests')
          ctrl.error(m(".alert.alert-danger.animated.fadeInUp", message));
        });

  },

  view: function (ctrl) {

    return [Navbar.view(ctrl.navbar), m(".container", [
      m("form.text-center.row.form-signin", { onsubmit: ctrl.saveTest.bind(ctrl) },
      m('.col-sm-6.col-sm-offset-3', [
        m("h1", "Save Test"),
     
        m('.form-group',
        m("button.btn.btn-primary[type='submit'][style='float:left']", "Save All"),
        m("button.btn.btn-danger[type=button][style='float:right']", { onclick: ctrl.delete.bind(ctrl) }, "delete"),
          ), m('br'), m('br'),
          ctrl.error(),
          m('.form-group', [
            m("label.sr-only[for='inputTest']", "Test description"),
            m("input.form-control[name='name'][autofocus][id='inputname'][placeholder='name '][required][type='text']", { value: ctrl.test.name }),
          ]), m('.form-group', [
            m("label.sr-only[for='inputTest']", "Test description"),
            m("textarea.form-control[name='description'][autofocus][id='inputdescription'][placeholder='description '][required][type='text']", { value: ctrl.test.description }),
          ]),

          , m("hr[style='border: 2px solid #2b66ff;']"),
          m("h1", "Questions"),
          m("button[class='btn btn-primary'][type=button][style='float:left']", {
            onclick: function name(params) {
              ctrl.questionCounterId += 1;
              list = ctrl.newQ()
              list.push(m.component(QuestionWidget, { label: '', description: '', options: [{ title: '', is_correct: true }] }, ctrl.questionCounterId))
              ctrl.newQ(list)
              // ctrl.newQ(ctrl.newQ().push(m.component(QuestionWidget,{options:[]},questionCounterId))) 
            }
          }, "Add new Question "),
          ctrl.newQ(),

          [
            ctrl.test.questions.map(function (question) {
              ctrl.questionCounterId += 1;
              return m.component(QuestionWidget, question, ctrl.questionCounterId)
            })
          ]

        ])
      )
    ])];
  }
};
},{"../components/Navbar.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/components/Navbar.js","../components/QuestionWidget.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/components/QuestionWidget.js","../components/Questions.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/components/Questions.js","../models/Auth.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/models/Auth.js","../models/Test.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/models/Test.js"}],"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/pages/TestPage.js":[function(require,module,exports){
// user page to view user a, comments  and notes if agent
var User = require('../models/User.js');
var Navbar = require('../components/Navbar.js');
var Questions = require('../components/Questions.js');
var QuestionWidget = require('../components/QuestionWidget.js');
var UserPage = module.exports = {
  controller: function (args) {
    var ctrl = this;
    ctrl.error = m.prop('');
 
    ctrl.open = function (status) {
      ctrl.user().user.status = status
      User.send({ status: status }, m.route.param().id)
        .then(function (user) {
          ctrl.user().user = user
        }, function (err) {
          var message = 'An error occurred.';
          ctrl.error(m(".alert.alert-danger.animated.fadeInUp", message));
        });
    } 
    ctrl.delete = function (status) {

      User.delete(m.route.param().id)
        .then(function (user) {
          var message = 'user deleted successfuly';

          ctrl.error(m(".alert.alert-danger.animated.fadeInUp", message));
          m.route('/users');
        }, function (err) {
          var message = 'An error occurred.';
          ctrl.error(m(".alert.alert-danger.animated.fadeInUp", message));
        });
    }
    User.get(m.route.param().id)
      .then(function (user) {
        userWrapper={user: user}
        ctrl.user = m.prop(userWrapper)
      }, function (err) {
        var message = 'An error occurred.';
       m.route('/users')
        ctrl.error(m(".alert.alert-danger.animated.fadeInUp", message));
      });

  },
  view: function (ctrl) { 
    return [Navbar, m('.container', [[
      m("h2", "User"),
      ctrl.error(),
      m("p", ctrl.user().user.name),m("p", ctrl.user().user.email),
      m("table.table.table-condensed.table-bordered", [
        m("thead", [
          m("tr", [
            m("th", "Customer"),
            m("th", "Agent"),
            m("th", "Creation Date"),
            m("th", "Done Date"),
            m("th", "Status"),
            m("th", "type"),
          ])
        ]),
        m("tbody", [
          m("tr", [
            m("td", ctrl.user().user.customer_name),
            m("td", ctrl.user().user.agent_name),
            m("td", ctrl.user().user.created_at),
            m("td", ctrl.user().user.done_date),
            m("td", ctrl.user().user.status),
            m("td", m("span.label", { class: ctrl.user().user.type == "low" ? "label-default" : ctrl.user().user.type == "medium" ? "label-primary" : "label-danger" }, ctrl.user().user.type))
          ]),

        ])
      ]),

      ctrl.user().user.status == 'closed' ? m("button.btn.btn-warning", { onclick: ctrl.open.bind(ctrl, 'opened') }, "Opened") :
        m("button.btn.btn-danger", { onclick: ctrl.open.bind(ctrl, 'closed') }, "Close")



      ,m("button.btn.btn-danger", { onclick: ctrl.delete.bind(ctrl) }, "delete")




    ], m.component(QuestionWidget, {user_id: ctrl.user().user.id})]

    )];

  }

}
},{"../components/Navbar.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/components/Navbar.js","../components/QuestionWidget.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/components/QuestionWidget.js","../components/Questions.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/components/Questions.js","../models/User.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/models/User.js"}],"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/pages/Tests.js":[function(require,module,exports){


var Navbar = require('../components/Navbar.js');
var mc = require('../components/DataTable.js');
var Auth = require('../models/Auth.js');
var Test = require('../models/Test.js');
var TestPage = require('./TestPage.js');
var TestEdit = require('./TestEdit.js');

var Tests = module.exports = {
  controller: function () {
    var ctrl = this;
    ctrl.prioretyFromate=function(value, row, col, attrs){
      if (value == 'high') attrs.class = 'label label-danger';
      return value
    }
    this.datatable = new mc.Datatable.controller(
      // Columns definition:
      [ 

        { key: "name",label: "Name", sortable: true },
        { key: "description",label: "Description", sortable: false },
        { key: "question_count",label: "Questions", sortable: false }


      ],
      // Other configuration:
      {
        // Address of the webserver supplying the data
        url: '/api/v1/tests',
        authorization: Auth.token(),
        // Handler of click event on data cell
        // It receives the relevant information already resolved
        onCellClick: function (content, row, col) {
          console.log(content, row, col);
              // m.route("/test",{id:row.id})
              m.route("/testEdit",{id:row.id})
         
        }
      }
    );
    
  }, 

  view: function (ctrl) {
    return [Navbar, m('.container', [
      m('h1', 'Tests'),
      m("a[href='?/testEdit'][class='btn btn-primary float-right']","New Test"),
      mc.Datatable.view(ctrl.datatable, {
        caption: ''
      })
    ])];
  }
};
},{"../components/DataTable.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/components/DataTable.js","../components/Navbar.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/components/Navbar.js","../models/Auth.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/models/Auth.js","../models/Test.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/models/Test.js","./TestEdit.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/pages/TestEdit.js","./TestPage.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/pages/TestPage.js"}],"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/pages/UserEdit.js":[function(require,module,exports){


var Navbar = require('../components/Navbar.js');
var Auth = require('../models/Auth.js');
var User = require('../models/User.js');

var UserEdit = module.exports = {
  controller: function (args) {
    ctrl = this;
    ctrl.user={name:'',email:'',type:'',password:''}
    ctrl.navbar = new Navbar.controller();
    ctrl.error = m.prop('');
    ctrl.delete=function(ctrl){
      User.delete(m.route.param().id)
        .then(function (user) {
          var message = 'user deleted successfuly';

          ctrl.error(m(".alert.alert-danger.animated.fadeInUp", message));
          m.route('/users');
          m.route('/users')
        }, function (err) {
          var message = 'An error occurred.';
          ctrl.error(m(".alert.alert-danger.animated.fadeInUp", message));
        });
    }
    ctrl.saveUser = function (e) {
      e.preventDefault();
      // validation
      userData={user:{ name: e.target.name.value, email: e.target.email.value,type: e.target.type.value ,password: e.target.password.value}}
     

      // insertion
      User.send(userData,ctrl.user.id)
        .then(function () {
          ctrl.error(m(".alert.alert-success.animated.fadeInUp", 'user have been saved'));
        }, function (err) {
      

          ctrl.error(m(".alert.alert-danger.animated.fadeInUp", JSON.stringify(err)));
        });
    };
    if(m.route.param().id!= undefined)
    User.get(m.route.param().id)
      .then(function (user) {
       
        ctrl.user = user
      }, function (err) {
        var message = 'An error occurred.';
       m.route('/users')
        ctrl.error(m(".alert.alert-danger.animated.fadeInUp", message));
      });

  },

  view: function (ctrl) {
    return [Navbar.view(ctrl.navbar), m(".container", [
      m("form.text-center.row.form-signin", { onsubmit: ctrl.saveUser.bind(ctrl) },
        m('.col-sm-6.col-sm-offset-3', [
          m("h1", "Save User"),
          ctrl.error(),

          m("button.btn.btn-danger[type=button][style='float:right']", { onclick: ctrl.delete.bind(ctrl) }, "delete"),
          
          m("button.btn.btn-primary[type='submit'][style='float:left']", "Save"),
          m('br'),m('br'),
          m('.form-group', [
            m("label.sr-only[for='inputUser']", "User description"),
            m("input.form-control[name='name'][autofocus][id='inputname'][placeholder='name '][required][type='text']",{value: ctrl.user.name}),
          ]), m('.form-group', [
            m("label.sr-only[for='inputUser']", "User description"),
            m("input.form-control[name='email'][autofocus][id='inputemail'][placeholder='email '][required][type='text']",{value: ctrl.user.email}),
          ]),m('.form-group', [
            m("label.sr-only[for='inputUser']", "User description"),
            m("input.form-control[name='password'][autofocus][id='inputpassword'][placeholder='password '][type='text']",{required: ctrl.user.id==undefined}),
          ]), m('.form-group', [
            m("label.sr-only[for='inputtype']", "type"),
            m("select.form-control[name='type'][required]", [m("option[value='Teacher']", "Teacher"), m("option[value='Student']"+(ctrl.user.type=="Student" ? "[selected]":""), 'Student')]),
          ]),

          
        ])
      )
    ])];
  }
};
},{"../components/Navbar.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/components/Navbar.js","../models/Auth.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/models/Auth.js","../models/User.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/models/User.js"}],"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/pages/UserPage.js":[function(require,module,exports){
// user page to view user a, comments  and notes if agent
var User = require('../models/User.js');
var Navbar = require('../components/Navbar.js');
var UserPage = module.exports = {
  controller: function (args) {
    var ctrl = this;
    ctrl.error = m.prop('');
 
    ctrl.open = function (status) {
      ctrl.user().user.status = status
      User.send({ status: status }, m.route.param().id)
        .then(function (user) {
          ctrl.user().user = user
        }, function (err) {
          var message = 'An error occurred.';
          ctrl.error(m(".alert.alert-danger.animated.fadeInUp", message));
        });
    }
    ctrl.delete = function (status) {

      User.delete(m.route.param().id)
        .then(function (user) {
          var message = 'user deleted successfuly';

          ctrl.error(m(".alert.alert-danger.animated.fadeInUp", message));
          m.route('/users');
        }, function (err) {
          var message = 'An error occurred.';
          ctrl.error(m(".alert.alert-danger.animated.fadeInUp", message));
        });
    }
    User.get(m.route.param().id)
      .then(function (user) {
        userWrapper={user: user}
        ctrl.user = m.prop(userWrapper)
      }, function (err) {
        var message = 'An error occurred.';
       m.route('/users')
        ctrl.error(m(".alert.alert-danger.animated.fadeInUp", message));
      });

  },
  view: function (ctrl) { 
    return [Navbar, m('.container', [[
      m("h2", "User"),
      ctrl.error(),
      m("p", ctrl.user().user.name),m("p", ctrl.user().user.email),
      m("table.table.table-condensed.table-bordered", [
        m("thead", [
          m("tr", [
            m("th", "Customer"),
            m("th", "Agent"),
            m("th", "Creation Date"),
            m("th", "Done Date"),
            m("th", "Status"),
            m("th", "type"),
          ])
        ]),
        m("tbody", [
          m("tr", [
            m("td", ctrl.user().user.customer_name),
            m("td", ctrl.user().user.agent_name),
            m("td", ctrl.user().user.created_at),
            m("td", ctrl.user().user.done_date),
            m("td", ctrl.user().user.status),
            m("td", m("span.label", { class: ctrl.user().user.type == "low" ? "label-default" : ctrl.user().user.type == "medium" ? "label-primary" : "label-danger" }, ctrl.user().user.type))
          ]),

        ])
      ]),

      ctrl.user().user.status == 'closed' ? m("button.btn.btn-warning", { onclick: ctrl.open.bind(ctrl, 'opened') }, "Opened") :
        m("button.btn.btn-danger", { onclick: ctrl.open.bind(ctrl, 'closed') }, "Close")



      ,m("button.btn.btn-danger", { onclick: ctrl.delete.bind(ctrl) }, "delete")




    ]]

    )];

  }

}
},{"../components/Navbar.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/components/Navbar.js","../models/User.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/models/User.js"}],"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/pages/Users.js":[function(require,module,exports){


var Navbar = require('../components/Navbar.js');
var mc = require('../components/DataTable.js');
var Auth = require('../models/Auth.js');
var User = require('../models/User.js');
var UserPage = require('../pages/UserPage.js');
var UserEdit = require('./UserEdit.js');

var Users = module.exports = {
  controller: function () {
    var ctrl = this;
    ctrl.prioretyFromate=function(value, row, col, attrs){
      if (value == 'high') attrs.class = 'label label-danger';
      return value
    }
    this.datatable = new mc.Datatable.controller(
      // Columns definition:
      [ 

        { key: "name",label: "Name", sortable: true },
        { key: "email",label: "Email", sortable: true },
        { key: "type",label: "Type", sortable: true }


      ],
      // Other configuration:
      {
        // Address of the webserver supplying the data
        url: '/api/v1/users',
        authorization: Auth.token(),
        // Handler of click event on data cell
        // It receives the relevant information already resolved
        onCellClick: function (content, row, col) {
          console.log(content, row, col);
              // m.route("/user",{id:row.id})
              m.route("/userEdit",{id:row.id})
         
        }
      }
    );
    
  }, 

  view: function (ctrl) {
    return [Navbar, m('.container', [
      m('h1', 'Users'),
      m("a[href='?/userEdit'][class='btn btn-primary float-right']","New User"),
      mc.Datatable.view(ctrl.datatable, {
        caption: 'this is my Users'
      })
    ])];
  }
};
},{"../components/DataTable.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/components/DataTable.js","../components/Navbar.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/components/Navbar.js","../models/Auth.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/models/Auth.js","../models/User.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/models/User.js","../pages/UserPage.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/pages/UserPage.js","./UserEdit.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/pages/UserEdit.js"}],"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/pages/Verify.js":[function(require,module,exports){


var Navbar = require('../components/Navbar.js');
var Auth = require('../models/Auth.js');

var Verify = module.exports = {
  controller: function(){
    var ctrl = this;
    ctrl.navbar = new Navbar.controller();
    ctrl.message = m.prop();
    Auth.verify(m.route.param("code")).then(function(){
      ctrl.message([
        'Sweet. Now, you can ',
        m('a[href="/login"]', {config: m.route}, 'login'),
        '.'
      ]);
    }, function(){
      ctrl.message('Hmm, there was something wrong with that code. Check your email again.');
    });
  },
  
  view: function(ctrl){
    return [Navbar.view(ctrl.navbar), m('.container', [
      m('h1', 'verify'),
      ctrl.message()
    ])];
  }
};
},{"../components/Navbar.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/components/Navbar.js","../models/Auth.js":"/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/models/Auth.js"}]},{},["/home/ahmed/Oivan/Rails7/student_assessment/public/scripts/main.js"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS91bmRlcnNjb3JlLXVtZC5qcyIsInB1YmxpYy9zY3JpcHRzL2NvbXBvbmVudHMvRGF0YVRhYmxlLmpzIiwicHVibGljL3NjcmlwdHMvY29tcG9uZW50cy9OYXZiYXIuanMiLCJwdWJsaWMvc2NyaXB0cy9jb21wb25lbnRzL1F1ZXN0aW9uV2lkZ2V0LmpzIiwicHVibGljL3NjcmlwdHMvY29tcG9uZW50cy9RdWVzdGlvbnMuanMiLCJwdWJsaWMvc2NyaXB0cy9tYWluLmpzIiwicHVibGljL3NjcmlwdHMvbW9kZWxzL0F1dGguanMiLCJwdWJsaWMvc2NyaXB0cy9tb2RlbHMvVGVzdC5qcyIsInB1YmxpYy9zY3JpcHRzL21vZGVscy9Vc2VyLmpzIiwicHVibGljL3NjcmlwdHMvcGFnZXMvTG9naW4uanMiLCJwdWJsaWMvc2NyaXB0cy9wYWdlcy9Mb2dvdXQuanMiLCJwdWJsaWMvc2NyaXB0cy9wYWdlcy9UZXN0RWRpdC5qcyIsInB1YmxpYy9zY3JpcHRzL3BhZ2VzL1Rlc3RQYWdlLmpzIiwicHVibGljL3NjcmlwdHMvcGFnZXMvVGVzdHMuanMiLCJwdWJsaWMvc2NyaXB0cy9wYWdlcy9Vc2VyRWRpdC5qcyIsInB1YmxpYy9zY3JpcHRzL3BhZ2VzL1VzZXJQYWdlLmpzIiwicHVibGljL3NjcmlwdHMvcGFnZXMvVXNlcnMuanMiLCJwdWJsaWMvc2NyaXB0cy9wYWdlcy9WZXJpZnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDMS9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZSgndW5kZXJzY29yZScsIGZhY3RvcnkpIDpcbiAgKGdsb2JhbCA9IHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbFRoaXMgOiBnbG9iYWwgfHwgc2VsZiwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY3VycmVudCA9IGdsb2JhbC5fO1xuICAgIHZhciBleHBvcnRzID0gZ2xvYmFsLl8gPSBmYWN0b3J5KCk7XG4gICAgZXhwb3J0cy5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkgeyBnbG9iYWwuXyA9IGN1cnJlbnQ7IHJldHVybiBleHBvcnRzOyB9O1xuICB9KCkpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHtcbiAgLy8gICAgIFVuZGVyc2NvcmUuanMgMS4xMy4yXG4gIC8vICAgICBodHRwczovL3VuZGVyc2NvcmVqcy5vcmdcbiAgLy8gICAgIChjKSAyMDA5LTIwMjEgSmVyZW15IEFzaGtlbmFzLCBKdWxpYW4gR29uZ2dyaWpwLCBhbmQgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gIC8vICAgICBVbmRlcnNjb3JlIG1heSBiZSBmcmVlbHkgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuXG4gIC8vIEN1cnJlbnQgdmVyc2lvbi5cbiAgdmFyIFZFUlNJT04gPSAnMS4xMy4yJztcblxuICAvLyBFc3RhYmxpc2ggdGhlIHJvb3Qgb2JqZWN0LCBgd2luZG93YCAoYHNlbGZgKSBpbiB0aGUgYnJvd3NlciwgYGdsb2JhbGBcbiAgLy8gb24gdGhlIHNlcnZlciwgb3IgYHRoaXNgIGluIHNvbWUgdmlydHVhbCBtYWNoaW5lcy4gV2UgdXNlIGBzZWxmYFxuICAvLyBpbnN0ZWFkIG9mIGB3aW5kb3dgIGZvciBgV2ViV29ya2VyYCBzdXBwb3J0LlxuICB2YXIgcm9vdCA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYuc2VsZiA9PT0gc2VsZiAmJiBzZWxmIHx8XG4gICAgICAgICAgICB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbC5nbG9iYWwgPT09IGdsb2JhbCAmJiBnbG9iYWwgfHxcbiAgICAgICAgICAgIEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCkgfHxcbiAgICAgICAgICAgIHt9O1xuXG4gIC8vIFNhdmUgYnl0ZXMgaW4gdGhlIG1pbmlmaWVkIChidXQgbm90IGd6aXBwZWQpIHZlcnNpb246XG4gIHZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlLCBPYmpQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG4gIHZhciBTeW1ib2xQcm90byA9IHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnID8gU3ltYm9sLnByb3RvdHlwZSA6IG51bGw7XG5cbiAgLy8gQ3JlYXRlIHF1aWNrIHJlZmVyZW5jZSB2YXJpYWJsZXMgZm9yIHNwZWVkIGFjY2VzcyB0byBjb3JlIHByb3RvdHlwZXMuXG4gIHZhciBwdXNoID0gQXJyYXlQcm90by5wdXNoLFxuICAgICAgc2xpY2UgPSBBcnJheVByb3RvLnNsaWNlLFxuICAgICAgdG9TdHJpbmcgPSBPYmpQcm90by50b1N0cmluZyxcbiAgICAgIGhhc093blByb3BlcnR5ID0gT2JqUHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbiAgLy8gTW9kZXJuIGZlYXR1cmUgZGV0ZWN0aW9uLlxuICB2YXIgc3VwcG9ydHNBcnJheUJ1ZmZlciA9IHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcsXG4gICAgICBzdXBwb3J0c0RhdGFWaWV3ID0gdHlwZW9mIERhdGFWaWV3ICE9PSAndW5kZWZpbmVkJztcblxuICAvLyBBbGwgKipFQ01BU2NyaXB0IDUrKiogbmF0aXZlIGZ1bmN0aW9uIGltcGxlbWVudGF0aW9ucyB0aGF0IHdlIGhvcGUgdG8gdXNlXG4gIC8vIGFyZSBkZWNsYXJlZCBoZXJlLlxuICB2YXIgbmF0aXZlSXNBcnJheSA9IEFycmF5LmlzQXJyYXksXG4gICAgICBuYXRpdmVLZXlzID0gT2JqZWN0LmtleXMsXG4gICAgICBuYXRpdmVDcmVhdGUgPSBPYmplY3QuY3JlYXRlLFxuICAgICAgbmF0aXZlSXNWaWV3ID0gc3VwcG9ydHNBcnJheUJ1ZmZlciAmJiBBcnJheUJ1ZmZlci5pc1ZpZXc7XG5cbiAgLy8gQ3JlYXRlIHJlZmVyZW5jZXMgdG8gdGhlc2UgYnVpbHRpbiBmdW5jdGlvbnMgYmVjYXVzZSB3ZSBvdmVycmlkZSB0aGVtLlxuICB2YXIgX2lzTmFOID0gaXNOYU4sXG4gICAgICBfaXNGaW5pdGUgPSBpc0Zpbml0ZTtcblxuICAvLyBLZXlzIGluIElFIDwgOSB0aGF0IHdvbid0IGJlIGl0ZXJhdGVkIGJ5IGBmb3Iga2V5IGluIC4uLmAgYW5kIHRodXMgbWlzc2VkLlxuICB2YXIgaGFzRW51bUJ1ZyA9ICF7dG9TdHJpbmc6IG51bGx9LnByb3BlcnR5SXNFbnVtZXJhYmxlKCd0b1N0cmluZycpO1xuICB2YXIgbm9uRW51bWVyYWJsZVByb3BzID0gWyd2YWx1ZU9mJywgJ2lzUHJvdG90eXBlT2YnLCAndG9TdHJpbmcnLFxuICAgICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsICdoYXNPd25Qcm9wZXJ0eScsICd0b0xvY2FsZVN0cmluZyddO1xuXG4gIC8vIFRoZSBsYXJnZXN0IGludGVnZXIgdGhhdCBjYW4gYmUgcmVwcmVzZW50ZWQgZXhhY3RseS5cbiAgdmFyIE1BWF9BUlJBWV9JTkRFWCA9IE1hdGgucG93KDIsIDUzKSAtIDE7XG5cbiAgLy8gU29tZSBmdW5jdGlvbnMgdGFrZSBhIHZhcmlhYmxlIG51bWJlciBvZiBhcmd1bWVudHMsIG9yIGEgZmV3IGV4cGVjdGVkXG4gIC8vIGFyZ3VtZW50cyBhdCB0aGUgYmVnaW5uaW5nIGFuZCB0aGVuIGEgdmFyaWFibGUgbnVtYmVyIG9mIHZhbHVlcyB0byBvcGVyYXRlXG4gIC8vIG9uLiBUaGlzIGhlbHBlciBhY2N1bXVsYXRlcyBhbGwgcmVtYWluaW5nIGFyZ3VtZW50cyBwYXN0IHRoZSBmdW5jdGlvbuKAmXNcbiAgLy8gYXJndW1lbnQgbGVuZ3RoIChvciBhbiBleHBsaWNpdCBgc3RhcnRJbmRleGApLCBpbnRvIGFuIGFycmF5IHRoYXQgYmVjb21lc1xuICAvLyB0aGUgbGFzdCBhcmd1bWVudC4gU2ltaWxhciB0byBFUzbigJlzIFwicmVzdCBwYXJhbWV0ZXJcIi5cbiAgZnVuY3Rpb24gcmVzdEFyZ3VtZW50cyhmdW5jLCBzdGFydEluZGV4KSB7XG4gICAgc3RhcnRJbmRleCA9IHN0YXJ0SW5kZXggPT0gbnVsbCA/IGZ1bmMubGVuZ3RoIC0gMSA6ICtzdGFydEluZGV4O1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBsZW5ndGggPSBNYXRoLm1heChhcmd1bWVudHMubGVuZ3RoIC0gc3RhcnRJbmRleCwgMCksXG4gICAgICAgICAgcmVzdCA9IEFycmF5KGxlbmd0aCksXG4gICAgICAgICAgaW5kZXggPSAwO1xuICAgICAgZm9yICg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIHJlc3RbaW5kZXhdID0gYXJndW1lbnRzW2luZGV4ICsgc3RhcnRJbmRleF07XG4gICAgICB9XG4gICAgICBzd2l0Y2ggKHN0YXJ0SW5kZXgpIHtcbiAgICAgICAgY2FzZSAwOiByZXR1cm4gZnVuYy5jYWxsKHRoaXMsIHJlc3QpO1xuICAgICAgICBjYXNlIDE6IHJldHVybiBmdW5jLmNhbGwodGhpcywgYXJndW1lbnRzWzBdLCByZXN0KTtcbiAgICAgICAgY2FzZSAyOiByZXR1cm4gZnVuYy5jYWxsKHRoaXMsIGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdLCByZXN0KTtcbiAgICAgIH1cbiAgICAgIHZhciBhcmdzID0gQXJyYXkoc3RhcnRJbmRleCArIDEpO1xuICAgICAgZm9yIChpbmRleCA9IDA7IGluZGV4IDwgc3RhcnRJbmRleDsgaW5kZXgrKykge1xuICAgICAgICBhcmdzW2luZGV4XSA9IGFyZ3VtZW50c1tpbmRleF07XG4gICAgICB9XG4gICAgICBhcmdzW3N0YXJ0SW5kZXhdID0gcmVzdDtcbiAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH07XG4gIH1cblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIGFuIG9iamVjdD9cbiAgZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2Ygb2JqO1xuICAgIHJldHVybiB0eXBlID09PSAnZnVuY3Rpb24nIHx8IHR5cGUgPT09ICdvYmplY3QnICYmICEhb2JqO1xuICB9XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBlcXVhbCB0byBudWxsP1xuICBmdW5jdGlvbiBpc051bGwob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gbnVsbDtcbiAgfVxuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgdW5kZWZpbmVkP1xuICBmdW5jdGlvbiBpc1VuZGVmaW5lZChvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB2b2lkIDA7XG4gIH1cblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgYm9vbGVhbj9cbiAgZnVuY3Rpb24gaXNCb29sZWFuKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHRydWUgfHwgb2JqID09PSBmYWxzZSB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEJvb2xlYW5dJztcbiAgfVxuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBET00gZWxlbWVudD9cbiAgZnVuY3Rpb24gaXNFbGVtZW50KG9iaikge1xuICAgIHJldHVybiAhIShvYmogJiYgb2JqLm5vZGVUeXBlID09PSAxKTtcbiAgfVxuXG4gIC8vIEludGVybmFsIGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhIGB0b1N0cmluZ2AtYmFzZWQgdHlwZSB0ZXN0ZXIuXG4gIGZ1bmN0aW9uIHRhZ1Rlc3RlcihuYW1lKSB7XG4gICAgdmFyIHRhZyA9ICdbb2JqZWN0ICcgKyBuYW1lICsgJ10nO1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09IHRhZztcbiAgICB9O1xuICB9XG5cbiAgdmFyIGlzU3RyaW5nID0gdGFnVGVzdGVyKCdTdHJpbmcnKTtcblxuICB2YXIgaXNOdW1iZXIgPSB0YWdUZXN0ZXIoJ051bWJlcicpO1xuXG4gIHZhciBpc0RhdGUgPSB0YWdUZXN0ZXIoJ0RhdGUnKTtcblxuICB2YXIgaXNSZWdFeHAgPSB0YWdUZXN0ZXIoJ1JlZ0V4cCcpO1xuXG4gIHZhciBpc0Vycm9yID0gdGFnVGVzdGVyKCdFcnJvcicpO1xuXG4gIHZhciBpc1N5bWJvbCA9IHRhZ1Rlc3RlcignU3ltYm9sJyk7XG5cbiAgdmFyIGlzQXJyYXlCdWZmZXIgPSB0YWdUZXN0ZXIoJ0FycmF5QnVmZmVyJyk7XG5cbiAgdmFyIGlzRnVuY3Rpb24gPSB0YWdUZXN0ZXIoJ0Z1bmN0aW9uJyk7XG5cbiAgLy8gT3B0aW1pemUgYGlzRnVuY3Rpb25gIGlmIGFwcHJvcHJpYXRlLiBXb3JrIGFyb3VuZCBzb21lIGB0eXBlb2ZgIGJ1Z3MgaW4gb2xkXG4gIC8vIHY4LCBJRSAxMSAoIzE2MjEpLCBTYWZhcmkgOCAoIzE5MjkpLCBhbmQgUGhhbnRvbUpTICgjMjIzNikuXG4gIHZhciBub2RlbGlzdCA9IHJvb3QuZG9jdW1lbnQgJiYgcm9vdC5kb2N1bWVudC5jaGlsZE5vZGVzO1xuICBpZiAodHlwZW9mIC8uLyAhPSAnZnVuY3Rpb24nICYmIHR5cGVvZiBJbnQ4QXJyYXkgIT0gJ29iamVjdCcgJiYgdHlwZW9mIG5vZGVsaXN0ICE9ICdmdW5jdGlvbicpIHtcbiAgICBpc0Z1bmN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PSAnZnVuY3Rpb24nIHx8IGZhbHNlO1xuICAgIH07XG4gIH1cblxuICB2YXIgaXNGdW5jdGlvbiQxID0gaXNGdW5jdGlvbjtcblxuICB2YXIgaGFzT2JqZWN0VGFnID0gdGFnVGVzdGVyKCdPYmplY3QnKTtcblxuICAvLyBJbiBJRSAxMCAtIEVkZ2UgMTMsIGBEYXRhVmlld2AgaGFzIHN0cmluZyB0YWcgYCdbb2JqZWN0IE9iamVjdF0nYC5cbiAgLy8gSW4gSUUgMTEsIHRoZSBtb3N0IGNvbW1vbiBhbW9uZyB0aGVtLCB0aGlzIHByb2JsZW0gYWxzbyBhcHBsaWVzIHRvXG4gIC8vIGBNYXBgLCBgV2Vha01hcGAgYW5kIGBTZXRgLlxuICB2YXIgaGFzU3RyaW5nVGFnQnVnID0gKFxuICAgICAgICBzdXBwb3J0c0RhdGFWaWV3ICYmIGhhc09iamVjdFRhZyhuZXcgRGF0YVZpZXcobmV3IEFycmF5QnVmZmVyKDgpKSlcbiAgICAgICksXG4gICAgICBpc0lFMTEgPSAodHlwZW9mIE1hcCAhPT0gJ3VuZGVmaW5lZCcgJiYgaGFzT2JqZWN0VGFnKG5ldyBNYXApKTtcblxuICB2YXIgaXNEYXRhVmlldyA9IHRhZ1Rlc3RlcignRGF0YVZpZXcnKTtcblxuICAvLyBJbiBJRSAxMCAtIEVkZ2UgMTMsIHdlIG5lZWQgYSBkaWZmZXJlbnQgaGV1cmlzdGljXG4gIC8vIHRvIGRldGVybWluZSB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIGBEYXRhVmlld2AuXG4gIGZ1bmN0aW9uIGllMTBJc0RhdGFWaWV3KG9iaikge1xuICAgIHJldHVybiBvYmogIT0gbnVsbCAmJiBpc0Z1bmN0aW9uJDEob2JqLmdldEludDgpICYmIGlzQXJyYXlCdWZmZXIob2JqLmJ1ZmZlcik7XG4gIH1cblxuICB2YXIgaXNEYXRhVmlldyQxID0gKGhhc1N0cmluZ1RhZ0J1ZyA/IGllMTBJc0RhdGFWaWV3IDogaXNEYXRhVmlldyk7XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhbiBhcnJheT9cbiAgLy8gRGVsZWdhdGVzIHRvIEVDTUE1J3MgbmF0aXZlIGBBcnJheS5pc0FycmF5YC5cbiAgdmFyIGlzQXJyYXkgPSBuYXRpdmVJc0FycmF5IHx8IHRhZ1Rlc3RlcignQXJyYXknKTtcblxuICAvLyBJbnRlcm5hbCBmdW5jdGlvbiB0byBjaGVjayB3aGV0aGVyIGBrZXlgIGlzIGFuIG93biBwcm9wZXJ0eSBuYW1lIG9mIGBvYmpgLlxuICBmdW5jdGlvbiBoYXMkMShvYmosIGtleSkge1xuICAgIHJldHVybiBvYmogIT0gbnVsbCAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbiAgfVxuXG4gIHZhciBpc0FyZ3VtZW50cyA9IHRhZ1Rlc3RlcignQXJndW1lbnRzJyk7XG5cbiAgLy8gRGVmaW5lIGEgZmFsbGJhY2sgdmVyc2lvbiBvZiB0aGUgbWV0aG9kIGluIGJyb3dzZXJzIChhaGVtLCBJRSA8IDkpLCB3aGVyZVxuICAvLyB0aGVyZSBpc24ndCBhbnkgaW5zcGVjdGFibGUgXCJBcmd1bWVudHNcIiB0eXBlLlxuICAoZnVuY3Rpb24oKSB7XG4gICAgaWYgKCFpc0FyZ3VtZW50cyhhcmd1bWVudHMpKSB7XG4gICAgICBpc0FyZ3VtZW50cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICByZXR1cm4gaGFzJDEob2JqLCAnY2FsbGVlJyk7XG4gICAgICB9O1xuICAgIH1cbiAgfSgpKTtcblxuICB2YXIgaXNBcmd1bWVudHMkMSA9IGlzQXJndW1lbnRzO1xuXG4gIC8vIElzIGEgZ2l2ZW4gb2JqZWN0IGEgZmluaXRlIG51bWJlcj9cbiAgZnVuY3Rpb24gaXNGaW5pdGUkMShvYmopIHtcbiAgICByZXR1cm4gIWlzU3ltYm9sKG9iaikgJiYgX2lzRmluaXRlKG9iaikgJiYgIWlzTmFOKHBhcnNlRmxvYXQob2JqKSk7XG4gIH1cblxuICAvLyBJcyB0aGUgZ2l2ZW4gdmFsdWUgYE5hTmA/XG4gIGZ1bmN0aW9uIGlzTmFOJDEob2JqKSB7XG4gICAgcmV0dXJuIGlzTnVtYmVyKG9iaikgJiYgX2lzTmFOKG9iaik7XG4gIH1cblxuICAvLyBQcmVkaWNhdGUtZ2VuZXJhdGluZyBmdW5jdGlvbi4gT2Z0ZW4gdXNlZnVsIG91dHNpZGUgb2YgVW5kZXJzY29yZS5cbiAgZnVuY3Rpb24gY29uc3RhbnQodmFsdWUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgfVxuXG4gIC8vIENvbW1vbiBpbnRlcm5hbCBsb2dpYyBmb3IgYGlzQXJyYXlMaWtlYCBhbmQgYGlzQnVmZmVyTGlrZWAuXG4gIGZ1bmN0aW9uIGNyZWF0ZVNpemVQcm9wZXJ0eUNoZWNrKGdldFNpemVQcm9wZXJ0eSkge1xuICAgIHJldHVybiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICB2YXIgc2l6ZVByb3BlcnR5ID0gZ2V0U2l6ZVByb3BlcnR5KGNvbGxlY3Rpb24pO1xuICAgICAgcmV0dXJuIHR5cGVvZiBzaXplUHJvcGVydHkgPT0gJ251bWJlcicgJiYgc2l6ZVByb3BlcnR5ID49IDAgJiYgc2l6ZVByb3BlcnR5IDw9IE1BWF9BUlJBWV9JTkRFWDtcbiAgICB9XG4gIH1cblxuICAvLyBJbnRlcm5hbCBoZWxwZXIgdG8gZ2VuZXJhdGUgYSBmdW5jdGlvbiB0byBvYnRhaW4gcHJvcGVydHkgYGtleWAgZnJvbSBgb2JqYC5cbiAgZnVuY3Rpb24gc2hhbGxvd1Byb3BlcnR5KGtleSkge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogPT0gbnVsbCA/IHZvaWQgMCA6IG9ialtrZXldO1xuICAgIH07XG4gIH1cblxuICAvLyBJbnRlcm5hbCBoZWxwZXIgdG8gb2J0YWluIHRoZSBgYnl0ZUxlbmd0aGAgcHJvcGVydHkgb2YgYW4gb2JqZWN0LlxuICB2YXIgZ2V0Qnl0ZUxlbmd0aCA9IHNoYWxsb3dQcm9wZXJ0eSgnYnl0ZUxlbmd0aCcpO1xuXG4gIC8vIEludGVybmFsIGhlbHBlciB0byBkZXRlcm1pbmUgd2hldGhlciB3ZSBzaG91bGQgc3BlbmQgZXh0ZW5zaXZlIGNoZWNrcyBhZ2FpbnN0XG4gIC8vIGBBcnJheUJ1ZmZlcmAgZXQgYWwuXG4gIHZhciBpc0J1ZmZlckxpa2UgPSBjcmVhdGVTaXplUHJvcGVydHlDaGVjayhnZXRCeXRlTGVuZ3RoKTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgdHlwZWQgYXJyYXk/XG4gIHZhciB0eXBlZEFycmF5UGF0dGVybiA9IC9cXFtvYmplY3QgKChJfFVpKW50KDh8MTZ8MzIpfEZsb2F0KDMyfDY0KXxVaW50OENsYW1wZWR8QmlnKEl8VWkpbnQ2NClBcnJheVxcXS87XG4gIGZ1bmN0aW9uIGlzVHlwZWRBcnJheShvYmopIHtcbiAgICAvLyBgQXJyYXlCdWZmZXIuaXNWaWV3YCBpcyB0aGUgbW9zdCBmdXR1cmUtcHJvb2YsIHNvIHVzZSBpdCB3aGVuIGF2YWlsYWJsZS5cbiAgICAvLyBPdGhlcndpc2UsIGZhbGwgYmFjayBvbiB0aGUgYWJvdmUgcmVndWxhciBleHByZXNzaW9uLlxuICAgIHJldHVybiBuYXRpdmVJc1ZpZXcgPyAobmF0aXZlSXNWaWV3KG9iaikgJiYgIWlzRGF0YVZpZXckMShvYmopKSA6XG4gICAgICAgICAgICAgICAgICBpc0J1ZmZlckxpa2Uob2JqKSAmJiB0eXBlZEFycmF5UGF0dGVybi50ZXN0KHRvU3RyaW5nLmNhbGwob2JqKSk7XG4gIH1cblxuICB2YXIgaXNUeXBlZEFycmF5JDEgPSBzdXBwb3J0c0FycmF5QnVmZmVyID8gaXNUeXBlZEFycmF5IDogY29uc3RhbnQoZmFsc2UpO1xuXG4gIC8vIEludGVybmFsIGhlbHBlciB0byBvYnRhaW4gdGhlIGBsZW5ndGhgIHByb3BlcnR5IG9mIGFuIG9iamVjdC5cbiAgdmFyIGdldExlbmd0aCA9IHNoYWxsb3dQcm9wZXJ0eSgnbGVuZ3RoJyk7XG5cbiAgLy8gSW50ZXJuYWwgaGVscGVyIHRvIGNyZWF0ZSBhIHNpbXBsZSBsb29rdXAgc3RydWN0dXJlLlxuICAvLyBgY29sbGVjdE5vbkVudW1Qcm9wc2AgdXNlZCB0byBkZXBlbmQgb24gYF8uY29udGFpbnNgLCBidXQgdGhpcyBsZWQgdG9cbiAgLy8gY2lyY3VsYXIgaW1wb3J0cy4gYGVtdWxhdGVkU2V0YCBpcyBhIG9uZS1vZmYgc29sdXRpb24gdGhhdCBvbmx5IHdvcmtzIGZvclxuICAvLyBhcnJheXMgb2Ygc3RyaW5ncy5cbiAgZnVuY3Rpb24gZW11bGF0ZWRTZXQoa2V5cykge1xuICAgIHZhciBoYXNoID0ge307XG4gICAgZm9yICh2YXIgbCA9IGtleXMubGVuZ3RoLCBpID0gMDsgaSA8IGw7ICsraSkgaGFzaFtrZXlzW2ldXSA9IHRydWU7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRhaW5zOiBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIGhhc2hba2V5XSA9PT0gdHJ1ZTsgfSxcbiAgICAgIHB1c2g6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBoYXNoW2tleV0gPSB0cnVlO1xuICAgICAgICByZXR1cm4ga2V5cy5wdXNoKGtleSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIEludGVybmFsIGhlbHBlci4gQ2hlY2tzIGBrZXlzYCBmb3IgdGhlIHByZXNlbmNlIG9mIGtleXMgaW4gSUUgPCA5IHRoYXQgd29uJ3RcbiAgLy8gYmUgaXRlcmF0ZWQgYnkgYGZvciBrZXkgaW4gLi4uYCBhbmQgdGh1cyBtaXNzZWQuIEV4dGVuZHMgYGtleXNgIGluIHBsYWNlIGlmXG4gIC8vIG5lZWRlZC5cbiAgZnVuY3Rpb24gY29sbGVjdE5vbkVudW1Qcm9wcyhvYmosIGtleXMpIHtcbiAgICBrZXlzID0gZW11bGF0ZWRTZXQoa2V5cyk7XG4gICAgdmFyIG5vbkVudW1JZHggPSBub25FbnVtZXJhYmxlUHJvcHMubGVuZ3RoO1xuICAgIHZhciBjb25zdHJ1Y3RvciA9IG9iai5jb25zdHJ1Y3RvcjtcbiAgICB2YXIgcHJvdG8gPSBpc0Z1bmN0aW9uJDEoY29uc3RydWN0b3IpICYmIGNvbnN0cnVjdG9yLnByb3RvdHlwZSB8fCBPYmpQcm90bztcblxuICAgIC8vIENvbnN0cnVjdG9yIGlzIGEgc3BlY2lhbCBjYXNlLlxuICAgIHZhciBwcm9wID0gJ2NvbnN0cnVjdG9yJztcbiAgICBpZiAoaGFzJDEob2JqLCBwcm9wKSAmJiAha2V5cy5jb250YWlucyhwcm9wKSkga2V5cy5wdXNoKHByb3ApO1xuXG4gICAgd2hpbGUgKG5vbkVudW1JZHgtLSkge1xuICAgICAgcHJvcCA9IG5vbkVudW1lcmFibGVQcm9wc1tub25FbnVtSWR4XTtcbiAgICAgIGlmIChwcm9wIGluIG9iaiAmJiBvYmpbcHJvcF0gIT09IHByb3RvW3Byb3BdICYmICFrZXlzLmNvbnRhaW5zKHByb3ApKSB7XG4gICAgICAgIGtleXMucHVzaChwcm9wKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBSZXRyaWV2ZSB0aGUgbmFtZXMgb2YgYW4gb2JqZWN0J3Mgb3duIHByb3BlcnRpZXMuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBPYmplY3Qua2V5c2AuXG4gIGZ1bmN0aW9uIGtleXMob2JqKSB7XG4gICAgaWYgKCFpc09iamVjdChvYmopKSByZXR1cm4gW107XG4gICAgaWYgKG5hdGl2ZUtleXMpIHJldHVybiBuYXRpdmVLZXlzKG9iaik7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoaGFzJDEob2JqLCBrZXkpKSBrZXlzLnB1c2goa2V5KTtcbiAgICAvLyBBaGVtLCBJRSA8IDkuXG4gICAgaWYgKGhhc0VudW1CdWcpIGNvbGxlY3ROb25FbnVtUHJvcHMob2JqLCBrZXlzKTtcbiAgICByZXR1cm4ga2V5cztcbiAgfVxuXG4gIC8vIElzIGEgZ2l2ZW4gYXJyYXksIHN0cmluZywgb3Igb2JqZWN0IGVtcHR5P1xuICAvLyBBbiBcImVtcHR5XCIgb2JqZWN0IGhhcyBubyBlbnVtZXJhYmxlIG93bi1wcm9wZXJ0aWVzLlxuICBmdW5jdGlvbiBpc0VtcHR5KG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gICAgLy8gU2tpcCB0aGUgbW9yZSBleHBlbnNpdmUgYHRvU3RyaW5nYC1iYXNlZCB0eXBlIGNoZWNrcyBpZiBgb2JqYCBoYXMgbm9cbiAgICAvLyBgLmxlbmd0aGAuXG4gICAgdmFyIGxlbmd0aCA9IGdldExlbmd0aChvYmopO1xuICAgIGlmICh0eXBlb2YgbGVuZ3RoID09ICdudW1iZXInICYmIChcbiAgICAgIGlzQXJyYXkob2JqKSB8fCBpc1N0cmluZyhvYmopIHx8IGlzQXJndW1lbnRzJDEob2JqKVxuICAgICkpIHJldHVybiBsZW5ndGggPT09IDA7XG4gICAgcmV0dXJuIGdldExlbmd0aChrZXlzKG9iaikpID09PSAwO1xuICB9XG5cbiAgLy8gUmV0dXJucyB3aGV0aGVyIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBzZXQgb2YgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIGZ1bmN0aW9uIGlzTWF0Y2gob2JqZWN0LCBhdHRycykge1xuICAgIHZhciBfa2V5cyA9IGtleXMoYXR0cnMpLCBsZW5ndGggPSBfa2V5cy5sZW5ndGg7XG4gICAgaWYgKG9iamVjdCA9PSBudWxsKSByZXR1cm4gIWxlbmd0aDtcbiAgICB2YXIgb2JqID0gT2JqZWN0KG9iamVjdCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGtleSA9IF9rZXlzW2ldO1xuICAgICAgaWYgKGF0dHJzW2tleV0gIT09IG9ialtrZXldIHx8ICEoa2V5IGluIG9iaikpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBJZiBVbmRlcnNjb3JlIGlzIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLCBpdCByZXR1cm5zIGEgd3JhcHBlZCBvYmplY3QgdGhhdCBjYW5cbiAgLy8gYmUgdXNlZCBPTy1zdHlsZS4gVGhpcyB3cmFwcGVyIGhvbGRzIGFsdGVyZWQgdmVyc2lvbnMgb2YgYWxsIGZ1bmN0aW9ucyBhZGRlZFxuICAvLyB0aHJvdWdoIGBfLm1peGluYC4gV3JhcHBlZCBvYmplY3RzIG1heSBiZSBjaGFpbmVkLlxuICBmdW5jdGlvbiBfJDEob2JqKSB7XG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIF8kMSkgcmV0dXJuIG9iajtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgXyQxKSkgcmV0dXJuIG5ldyBfJDEob2JqKTtcbiAgICB0aGlzLl93cmFwcGVkID0gb2JqO1xuICB9XG5cbiAgXyQxLlZFUlNJT04gPSBWRVJTSU9OO1xuXG4gIC8vIEV4dHJhY3RzIHRoZSByZXN1bHQgZnJvbSBhIHdyYXBwZWQgYW5kIGNoYWluZWQgb2JqZWN0LlxuICBfJDEucHJvdG90eXBlLnZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dyYXBwZWQ7XG4gIH07XG5cbiAgLy8gUHJvdmlkZSB1bndyYXBwaW5nIHByb3hpZXMgZm9yIHNvbWUgbWV0aG9kcyB1c2VkIGluIGVuZ2luZSBvcGVyYXRpb25zXG4gIC8vIHN1Y2ggYXMgYXJpdGhtZXRpYyBhbmQgSlNPTiBzdHJpbmdpZmljYXRpb24uXG4gIF8kMS5wcm90b3R5cGUudmFsdWVPZiA9IF8kMS5wcm90b3R5cGUudG9KU09OID0gXyQxLnByb3RvdHlwZS52YWx1ZTtcblxuICBfJDEucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFN0cmluZyh0aGlzLl93cmFwcGVkKTtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCBmdW5jdGlvbiB0byB3cmFwIG9yIHNoYWxsb3ctY29weSBhbiBBcnJheUJ1ZmZlcixcbiAgLy8gdHlwZWQgYXJyYXkgb3IgRGF0YVZpZXcgdG8gYSBuZXcgdmlldywgcmV1c2luZyB0aGUgYnVmZmVyLlxuICBmdW5jdGlvbiB0b0J1ZmZlclZpZXcoYnVmZmVyU291cmNlKSB7XG4gICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KFxuICAgICAgYnVmZmVyU291cmNlLmJ1ZmZlciB8fCBidWZmZXJTb3VyY2UsXG4gICAgICBidWZmZXJTb3VyY2UuYnl0ZU9mZnNldCB8fCAwLFxuICAgICAgZ2V0Qnl0ZUxlbmd0aChidWZmZXJTb3VyY2UpXG4gICAgKTtcbiAgfVxuXG4gIC8vIFdlIHVzZSB0aGlzIHN0cmluZyB0d2ljZSwgc28gZ2l2ZSBpdCBhIG5hbWUgZm9yIG1pbmlmaWNhdGlvbi5cbiAgdmFyIHRhZ0RhdGFWaWV3ID0gJ1tvYmplY3QgRGF0YVZpZXddJztcblxuICAvLyBJbnRlcm5hbCByZWN1cnNpdmUgY29tcGFyaXNvbiBmdW5jdGlvbiBmb3IgYF8uaXNFcXVhbGAuXG4gIGZ1bmN0aW9uIGVxKGEsIGIsIGFTdGFjaywgYlN0YWNrKSB7XG4gICAgLy8gSWRlbnRpY2FsIG9iamVjdHMgYXJlIGVxdWFsLiBgMCA9PT0gLTBgLCBidXQgdGhleSBhcmVuJ3QgaWRlbnRpY2FsLlxuICAgIC8vIFNlZSB0aGUgW0hhcm1vbnkgYGVnYWxgIHByb3Bvc2FsXShodHRwczovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTplZ2FsKS5cbiAgICBpZiAoYSA9PT0gYikgcmV0dXJuIGEgIT09IDAgfHwgMSAvIGEgPT09IDEgLyBiO1xuICAgIC8vIGBudWxsYCBvciBgdW5kZWZpbmVkYCBvbmx5IGVxdWFsIHRvIGl0c2VsZiAoc3RyaWN0IGNvbXBhcmlzb24pLlxuICAgIGlmIChhID09IG51bGwgfHwgYiA9PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gYE5hTmBzIGFyZSBlcXVpdmFsZW50LCBidXQgbm9uLXJlZmxleGl2ZS5cbiAgICBpZiAoYSAhPT0gYSkgcmV0dXJuIGIgIT09IGI7XG4gICAgLy8gRXhoYXVzdCBwcmltaXRpdmUgY2hlY2tzXG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgYTtcbiAgICBpZiAodHlwZSAhPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlICE9PSAnb2JqZWN0JyAmJiB0eXBlb2YgYiAhPSAnb2JqZWN0JykgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiBkZWVwRXEoYSwgYiwgYVN0YWNrLCBiU3RhY2spO1xuICB9XG5cbiAgLy8gSW50ZXJuYWwgcmVjdXJzaXZlIGNvbXBhcmlzb24gZnVuY3Rpb24gZm9yIGBfLmlzRXF1YWxgLlxuICBmdW5jdGlvbiBkZWVwRXEoYSwgYiwgYVN0YWNrLCBiU3RhY2spIHtcbiAgICAvLyBVbndyYXAgYW55IHdyYXBwZWQgb2JqZWN0cy5cbiAgICBpZiAoYSBpbnN0YW5jZW9mIF8kMSkgYSA9IGEuX3dyYXBwZWQ7XG4gICAgaWYgKGIgaW5zdGFuY2VvZiBfJDEpIGIgPSBiLl93cmFwcGVkO1xuICAgIC8vIENvbXBhcmUgYFtbQ2xhc3NdXWAgbmFtZXMuXG4gICAgdmFyIGNsYXNzTmFtZSA9IHRvU3RyaW5nLmNhbGwoYSk7XG4gICAgaWYgKGNsYXNzTmFtZSAhPT0gdG9TdHJpbmcuY2FsbChiKSkgcmV0dXJuIGZhbHNlO1xuICAgIC8vIFdvcmsgYXJvdW5kIGEgYnVnIGluIElFIDEwIC0gRWRnZSAxMy5cbiAgICBpZiAoaGFzU3RyaW5nVGFnQnVnICYmIGNsYXNzTmFtZSA9PSAnW29iamVjdCBPYmplY3RdJyAmJiBpc0RhdGFWaWV3JDEoYSkpIHtcbiAgICAgIGlmICghaXNEYXRhVmlldyQxKGIpKSByZXR1cm4gZmFsc2U7XG4gICAgICBjbGFzc05hbWUgPSB0YWdEYXRhVmlldztcbiAgICB9XG4gICAgc3dpdGNoIChjbGFzc05hbWUpIHtcbiAgICAgIC8vIFRoZXNlIHR5cGVzIGFyZSBjb21wYXJlZCBieSB2YWx1ZS5cbiAgICAgIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6XG4gICAgICAgIC8vIFJlZ0V4cHMgYXJlIGNvZXJjZWQgdG8gc3RyaW5ncyBmb3IgY29tcGFyaXNvbiAoTm90ZTogJycgKyAvYS9pID09PSAnL2EvaScpXG4gICAgICBjYXNlICdbb2JqZWN0IFN0cmluZ10nOlxuICAgICAgICAvLyBQcmltaXRpdmVzIGFuZCB0aGVpciBjb3JyZXNwb25kaW5nIG9iamVjdCB3cmFwcGVycyBhcmUgZXF1aXZhbGVudDsgdGh1cywgYFwiNVwiYCBpc1xuICAgICAgICAvLyBlcXVpdmFsZW50IHRvIGBuZXcgU3RyaW5nKFwiNVwiKWAuXG4gICAgICAgIHJldHVybiAnJyArIGEgPT09ICcnICsgYjtcbiAgICAgIGNhc2UgJ1tvYmplY3QgTnVtYmVyXSc6XG4gICAgICAgIC8vIGBOYU5gcyBhcmUgZXF1aXZhbGVudCwgYnV0IG5vbi1yZWZsZXhpdmUuXG4gICAgICAgIC8vIE9iamVjdChOYU4pIGlzIGVxdWl2YWxlbnQgdG8gTmFOLlxuICAgICAgICBpZiAoK2EgIT09ICthKSByZXR1cm4gK2IgIT09ICtiO1xuICAgICAgICAvLyBBbiBgZWdhbGAgY29tcGFyaXNvbiBpcyBwZXJmb3JtZWQgZm9yIG90aGVyIG51bWVyaWMgdmFsdWVzLlxuICAgICAgICByZXR1cm4gK2EgPT09IDAgPyAxIC8gK2EgPT09IDEgLyBiIDogK2EgPT09ICtiO1xuICAgICAgY2FzZSAnW29iamVjdCBEYXRlXSc6XG4gICAgICBjYXNlICdbb2JqZWN0IEJvb2xlYW5dJzpcbiAgICAgICAgLy8gQ29lcmNlIGRhdGVzIGFuZCBib29sZWFucyB0byBudW1lcmljIHByaW1pdGl2ZSB2YWx1ZXMuIERhdGVzIGFyZSBjb21wYXJlZCBieSB0aGVpclxuICAgICAgICAvLyBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnMuIE5vdGUgdGhhdCBpbnZhbGlkIGRhdGVzIHdpdGggbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zXG4gICAgICAgIC8vIG9mIGBOYU5gIGFyZSBub3QgZXF1aXZhbGVudC5cbiAgICAgICAgcmV0dXJuICthID09PSArYjtcbiAgICAgIGNhc2UgJ1tvYmplY3QgU3ltYm9sXSc6XG4gICAgICAgIHJldHVybiBTeW1ib2xQcm90by52YWx1ZU9mLmNhbGwoYSkgPT09IFN5bWJvbFByb3RvLnZhbHVlT2YuY2FsbChiKTtcbiAgICAgIGNhc2UgJ1tvYmplY3QgQXJyYXlCdWZmZXJdJzpcbiAgICAgIGNhc2UgdGFnRGF0YVZpZXc6XG4gICAgICAgIC8vIENvZXJjZSB0byB0eXBlZCBhcnJheSBzbyB3ZSBjYW4gZmFsbCB0aHJvdWdoLlxuICAgICAgICByZXR1cm4gZGVlcEVxKHRvQnVmZmVyVmlldyhhKSwgdG9CdWZmZXJWaWV3KGIpLCBhU3RhY2ssIGJTdGFjayk7XG4gICAgfVxuXG4gICAgdmFyIGFyZUFycmF5cyA9IGNsYXNzTmFtZSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICBpZiAoIWFyZUFycmF5cyAmJiBpc1R5cGVkQXJyYXkkMShhKSkge1xuICAgICAgICB2YXIgYnl0ZUxlbmd0aCA9IGdldEJ5dGVMZW5ndGgoYSk7XG4gICAgICAgIGlmIChieXRlTGVuZ3RoICE9PSBnZXRCeXRlTGVuZ3RoKGIpKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmIChhLmJ1ZmZlciA9PT0gYi5idWZmZXIgJiYgYS5ieXRlT2Zmc2V0ID09PSBiLmJ5dGVPZmZzZXQpIHJldHVybiB0cnVlO1xuICAgICAgICBhcmVBcnJheXMgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoIWFyZUFycmF5cykge1xuICAgICAgaWYgKHR5cGVvZiBhICE9ICdvYmplY3QnIHx8IHR5cGVvZiBiICE9ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgIC8vIE9iamVjdHMgd2l0aCBkaWZmZXJlbnQgY29uc3RydWN0b3JzIGFyZSBub3QgZXF1aXZhbGVudCwgYnV0IGBPYmplY3RgcyBvciBgQXJyYXlgc1xuICAgICAgLy8gZnJvbSBkaWZmZXJlbnQgZnJhbWVzIGFyZS5cbiAgICAgIHZhciBhQ3RvciA9IGEuY29uc3RydWN0b3IsIGJDdG9yID0gYi5jb25zdHJ1Y3RvcjtcbiAgICAgIGlmIChhQ3RvciAhPT0gYkN0b3IgJiYgIShpc0Z1bmN0aW9uJDEoYUN0b3IpICYmIGFDdG9yIGluc3RhbmNlb2YgYUN0b3IgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0Z1bmN0aW9uJDEoYkN0b3IpICYmIGJDdG9yIGluc3RhbmNlb2YgYkN0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICYmICgnY29uc3RydWN0b3InIGluIGEgJiYgJ2NvbnN0cnVjdG9yJyBpbiBiKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEFzc3VtZSBlcXVhbGl0eSBmb3IgY3ljbGljIHN0cnVjdHVyZXMuIFRoZSBhbGdvcml0aG0gZm9yIGRldGVjdGluZyBjeWNsaWNcbiAgICAvLyBzdHJ1Y3R1cmVzIGlzIGFkYXB0ZWQgZnJvbSBFUyA1LjEgc2VjdGlvbiAxNS4xMi4zLCBhYnN0cmFjdCBvcGVyYXRpb24gYEpPYC5cblxuICAgIC8vIEluaXRpYWxpemluZyBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICAvLyBJdCdzIGRvbmUgaGVyZSBzaW5jZSB3ZSBvbmx5IG5lZWQgdGhlbSBmb3Igb2JqZWN0cyBhbmQgYXJyYXlzIGNvbXBhcmlzb24uXG4gICAgYVN0YWNrID0gYVN0YWNrIHx8IFtdO1xuICAgIGJTdGFjayA9IGJTdGFjayB8fCBbXTtcbiAgICB2YXIgbGVuZ3RoID0gYVN0YWNrLmxlbmd0aDtcbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIC8vIExpbmVhciBzZWFyY2guIFBlcmZvcm1hbmNlIGlzIGludmVyc2VseSBwcm9wb3J0aW9uYWwgdG8gdGhlIG51bWJlciBvZlxuICAgICAgLy8gdW5pcXVlIG5lc3RlZCBzdHJ1Y3R1cmVzLlxuICAgICAgaWYgKGFTdGFja1tsZW5ndGhdID09PSBhKSByZXR1cm4gYlN0YWNrW2xlbmd0aF0gPT09IGI7XG4gICAgfVxuXG4gICAgLy8gQWRkIHRoZSBmaXJzdCBvYmplY3QgdG8gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wdXNoKGEpO1xuICAgIGJTdGFjay5wdXNoKGIpO1xuXG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIGFuZCBhcnJheXMuXG4gICAgaWYgKGFyZUFycmF5cykge1xuICAgICAgLy8gQ29tcGFyZSBhcnJheSBsZW5ndGhzIHRvIGRldGVybWluZSBpZiBhIGRlZXAgY29tcGFyaXNvbiBpcyBuZWNlc3NhcnkuXG4gICAgICBsZW5ndGggPSBhLmxlbmd0aDtcbiAgICAgIGlmIChsZW5ndGggIT09IGIubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgICAvLyBEZWVwIGNvbXBhcmUgdGhlIGNvbnRlbnRzLCBpZ25vcmluZyBub24tbnVtZXJpYyBwcm9wZXJ0aWVzLlxuICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgIGlmICghZXEoYVtsZW5ndGhdLCBiW2xlbmd0aF0sIGFTdGFjaywgYlN0YWNrKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEZWVwIGNvbXBhcmUgb2JqZWN0cy5cbiAgICAgIHZhciBfa2V5cyA9IGtleXMoYSksIGtleTtcbiAgICAgIGxlbmd0aCA9IF9rZXlzLmxlbmd0aDtcbiAgICAgIC8vIEVuc3VyZSB0aGF0IGJvdGggb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIG51bWJlciBvZiBwcm9wZXJ0aWVzIGJlZm9yZSBjb21wYXJpbmcgZGVlcCBlcXVhbGl0eS5cbiAgICAgIGlmIChrZXlzKGIpLmxlbmd0aCAhPT0gbGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgLy8gRGVlcCBjb21wYXJlIGVhY2ggbWVtYmVyXG4gICAgICAgIGtleSA9IF9rZXlzW2xlbmd0aF07XG4gICAgICAgIGlmICghKGhhcyQxKGIsIGtleSkgJiYgZXEoYVtrZXldLCBiW2tleV0sIGFTdGFjaywgYlN0YWNrKSkpIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gUmVtb3ZlIHRoZSBmaXJzdCBvYmplY3QgZnJvbSB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgYVN0YWNrLnBvcCgpO1xuICAgIGJTdGFjay5wb3AoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIFBlcmZvcm0gYSBkZWVwIGNvbXBhcmlzb24gdG8gY2hlY2sgaWYgdHdvIG9iamVjdHMgYXJlIGVxdWFsLlxuICBmdW5jdGlvbiBpc0VxdWFsKGEsIGIpIHtcbiAgICByZXR1cm4gZXEoYSwgYik7XG4gIH1cblxuICAvLyBSZXRyaWV2ZSBhbGwgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYW4gb2JqZWN0LlxuICBmdW5jdGlvbiBhbGxLZXlzKG9iaikge1xuICAgIGlmICghaXNPYmplY3Qob2JqKSkgcmV0dXJuIFtdO1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikga2V5cy5wdXNoKGtleSk7XG4gICAgLy8gQWhlbSwgSUUgPCA5LlxuICAgIGlmIChoYXNFbnVtQnVnKSBjb2xsZWN0Tm9uRW51bVByb3BzKG9iaiwga2V5cyk7XG4gICAgcmV0dXJuIGtleXM7XG4gIH1cblxuICAvLyBTaW5jZSB0aGUgcmVndWxhciBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AgdHlwZSB0ZXN0cyBkb24ndCB3b3JrIGZvclxuICAvLyBzb21lIHR5cGVzIGluIElFIDExLCB3ZSB1c2UgYSBmaW5nZXJwcmludGluZyBoZXVyaXN0aWMgaW5zdGVhZCwgYmFzZWRcbiAgLy8gb24gdGhlIG1ldGhvZHMuIEl0J3Mgbm90IGdyZWF0LCBidXQgaXQncyB0aGUgYmVzdCB3ZSBnb3QuXG4gIC8vIFRoZSBmaW5nZXJwcmludCBtZXRob2QgbGlzdHMgYXJlIGRlZmluZWQgYmVsb3cuXG4gIGZ1bmN0aW9uIGllMTFmaW5nZXJwcmludChtZXRob2RzKSB7XG4gICAgdmFyIGxlbmd0aCA9IGdldExlbmd0aChtZXRob2RzKTtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICBpZiAob2JqID09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICAgIC8vIGBNYXBgLCBgV2Vha01hcGAgYW5kIGBTZXRgIGhhdmUgbm8gZW51bWVyYWJsZSBrZXlzLlxuICAgICAgdmFyIGtleXMgPSBhbGxLZXlzKG9iaik7XG4gICAgICBpZiAoZ2V0TGVuZ3RoKGtleXMpKSByZXR1cm4gZmFsc2U7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICghaXNGdW5jdGlvbiQxKG9ialttZXRob2RzW2ldXSkpIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8vIElmIHdlIGFyZSB0ZXN0aW5nIGFnYWluc3QgYFdlYWtNYXBgLCB3ZSBuZWVkIHRvIGVuc3VyZSB0aGF0XG4gICAgICAvLyBgb2JqYCBkb2Vzbid0IGhhdmUgYSBgZm9yRWFjaGAgbWV0aG9kIGluIG9yZGVyIHRvIGRpc3Rpbmd1aXNoXG4gICAgICAvLyBpdCBmcm9tIGEgcmVndWxhciBgTWFwYC5cbiAgICAgIHJldHVybiBtZXRob2RzICE9PSB3ZWFrTWFwTWV0aG9kcyB8fCAhaXNGdW5jdGlvbiQxKG9ialtmb3JFYWNoTmFtZV0pO1xuICAgIH07XG4gIH1cblxuICAvLyBJbiB0aGUgaW50ZXJlc3Qgb2YgY29tcGFjdCBtaW5pZmljYXRpb24sIHdlIHdyaXRlXG4gIC8vIGVhY2ggc3RyaW5nIGluIHRoZSBmaW5nZXJwcmludHMgb25seSBvbmNlLlxuICB2YXIgZm9yRWFjaE5hbWUgPSAnZm9yRWFjaCcsXG4gICAgICBoYXNOYW1lID0gJ2hhcycsXG4gICAgICBjb21tb25Jbml0ID0gWydjbGVhcicsICdkZWxldGUnXSxcbiAgICAgIG1hcFRhaWwgPSBbJ2dldCcsIGhhc05hbWUsICdzZXQnXTtcblxuICAvLyBgTWFwYCwgYFdlYWtNYXBgIGFuZCBgU2V0YCBlYWNoIGhhdmUgc2xpZ2h0bHkgZGlmZmVyZW50XG4gIC8vIGNvbWJpbmF0aW9ucyBvZiB0aGUgYWJvdmUgc3VibGlzdHMuXG4gIHZhciBtYXBNZXRob2RzID0gY29tbW9uSW5pdC5jb25jYXQoZm9yRWFjaE5hbWUsIG1hcFRhaWwpLFxuICAgICAgd2Vha01hcE1ldGhvZHMgPSBjb21tb25Jbml0LmNvbmNhdChtYXBUYWlsKSxcbiAgICAgIHNldE1ldGhvZHMgPSBbJ2FkZCddLmNvbmNhdChjb21tb25Jbml0LCBmb3JFYWNoTmFtZSwgaGFzTmFtZSk7XG5cbiAgdmFyIGlzTWFwID0gaXNJRTExID8gaWUxMWZpbmdlcnByaW50KG1hcE1ldGhvZHMpIDogdGFnVGVzdGVyKCdNYXAnKTtcblxuICB2YXIgaXNXZWFrTWFwID0gaXNJRTExID8gaWUxMWZpbmdlcnByaW50KHdlYWtNYXBNZXRob2RzKSA6IHRhZ1Rlc3RlcignV2Vha01hcCcpO1xuXG4gIHZhciBpc1NldCA9IGlzSUUxMSA/IGllMTFmaW5nZXJwcmludChzZXRNZXRob2RzKSA6IHRhZ1Rlc3RlcignU2V0Jyk7XG5cbiAgdmFyIGlzV2Vha1NldCA9IHRhZ1Rlc3RlcignV2Vha1NldCcpO1xuXG4gIC8vIFJldHJpZXZlIHRoZSB2YWx1ZXMgb2YgYW4gb2JqZWN0J3MgcHJvcGVydGllcy5cbiAgZnVuY3Rpb24gdmFsdWVzKG9iaikge1xuICAgIHZhciBfa2V5cyA9IGtleXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0gX2tleXMubGVuZ3RoO1xuICAgIHZhciB2YWx1ZXMgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhbHVlc1tpXSA9IG9ialtfa2V5c1tpXV07XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH1cblxuICAvLyBDb252ZXJ0IGFuIG9iamVjdCBpbnRvIGEgbGlzdCBvZiBgW2tleSwgdmFsdWVdYCBwYWlycy5cbiAgLy8gVGhlIG9wcG9zaXRlIG9mIGBfLm9iamVjdGAgd2l0aCBvbmUgYXJndW1lbnQuXG4gIGZ1bmN0aW9uIHBhaXJzKG9iaikge1xuICAgIHZhciBfa2V5cyA9IGtleXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0gX2tleXMubGVuZ3RoO1xuICAgIHZhciBwYWlycyA9IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcGFpcnNbaV0gPSBbX2tleXNbaV0sIG9ialtfa2V5c1tpXV1dO1xuICAgIH1cbiAgICByZXR1cm4gcGFpcnM7XG4gIH1cblxuICAvLyBJbnZlcnQgdGhlIGtleXMgYW5kIHZhbHVlcyBvZiBhbiBvYmplY3QuIFRoZSB2YWx1ZXMgbXVzdCBiZSBzZXJpYWxpemFibGUuXG4gIGZ1bmN0aW9uIGludmVydChvYmopIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgdmFyIF9rZXlzID0ga2V5cyhvYmopO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBfa2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0W29ialtfa2V5c1tpXV1dID0gX2tleXNbaV07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBSZXR1cm4gYSBzb3J0ZWQgbGlzdCBvZiB0aGUgZnVuY3Rpb24gbmFtZXMgYXZhaWxhYmxlIG9uIHRoZSBvYmplY3QuXG4gIGZ1bmN0aW9uIGZ1bmN0aW9ucyhvYmopIHtcbiAgICB2YXIgbmFtZXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoaXNGdW5jdGlvbiQxKG9ialtrZXldKSkgbmFtZXMucHVzaChrZXkpO1xuICAgIH1cbiAgICByZXR1cm4gbmFtZXMuc29ydCgpO1xuICB9XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGFzc2lnbmVyIGZ1bmN0aW9ucy5cbiAgZnVuY3Rpb24gY3JlYXRlQXNzaWduZXIoa2V5c0Z1bmMsIGRlZmF1bHRzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICBpZiAoZGVmYXVsdHMpIG9iaiA9IE9iamVjdChvYmopO1xuICAgICAgaWYgKGxlbmd0aCA8IDIgfHwgb2JqID09IG51bGwpIHJldHVybiBvYmo7XG4gICAgICBmb3IgKHZhciBpbmRleCA9IDE7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaW5kZXhdLFxuICAgICAgICAgICAga2V5cyA9IGtleXNGdW5jKHNvdXJjZSksXG4gICAgICAgICAgICBsID0ga2V5cy5sZW5ndGg7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICAgICAgaWYgKCFkZWZhdWx0cyB8fCBvYmpba2V5XSA9PT0gdm9pZCAwKSBvYmpba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH07XG4gIH1cblxuICAvLyBFeHRlbmQgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHByb3BlcnRpZXMgaW4gcGFzc2VkLWluIG9iamVjdChzKS5cbiAgdmFyIGV4dGVuZCA9IGNyZWF0ZUFzc2lnbmVyKGFsbEtleXMpO1xuXG4gIC8vIEFzc2lnbnMgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIG93biBwcm9wZXJ0aWVzIGluIHRoZSBwYXNzZWQtaW5cbiAgLy8gb2JqZWN0KHMpLlxuICAvLyAoaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2Fzc2lnbilcbiAgdmFyIGV4dGVuZE93biA9IGNyZWF0ZUFzc2lnbmVyKGtleXMpO1xuXG4gIC8vIEZpbGwgaW4gYSBnaXZlbiBvYmplY3Qgd2l0aCBkZWZhdWx0IHByb3BlcnRpZXMuXG4gIHZhciBkZWZhdWx0cyA9IGNyZWF0ZUFzc2lnbmVyKGFsbEtleXMsIHRydWUpO1xuXG4gIC8vIENyZWF0ZSBhIG5ha2VkIGZ1bmN0aW9uIHJlZmVyZW5jZSBmb3Igc3Vycm9nYXRlLXByb3RvdHlwZS1zd2FwcGluZy5cbiAgZnVuY3Rpb24gY3RvcigpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKXt9O1xuICB9XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGEgbmV3IG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gYW5vdGhlci5cbiAgZnVuY3Rpb24gYmFzZUNyZWF0ZShwcm90b3R5cGUpIHtcbiAgICBpZiAoIWlzT2JqZWN0KHByb3RvdHlwZSkpIHJldHVybiB7fTtcbiAgICBpZiAobmF0aXZlQ3JlYXRlKSByZXR1cm4gbmF0aXZlQ3JlYXRlKHByb3RvdHlwZSk7XG4gICAgdmFyIEN0b3IgPSBjdG9yKCk7XG4gICAgQ3Rvci5wcm90b3R5cGUgPSBwcm90b3R5cGU7XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBDdG9yO1xuICAgIEN0b3IucHJvdG90eXBlID0gbnVsbDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy8gQ3JlYXRlcyBhbiBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIHRoZSBnaXZlbiBwcm90b3R5cGUgb2JqZWN0LlxuICAvLyBJZiBhZGRpdGlvbmFsIHByb3BlcnRpZXMgYXJlIHByb3ZpZGVkIHRoZW4gdGhleSB3aWxsIGJlIGFkZGVkIHRvIHRoZVxuICAvLyBjcmVhdGVkIG9iamVjdC5cbiAgZnVuY3Rpb24gY3JlYXRlKHByb3RvdHlwZSwgcHJvcHMpIHtcbiAgICB2YXIgcmVzdWx0ID0gYmFzZUNyZWF0ZShwcm90b3R5cGUpO1xuICAgIGlmIChwcm9wcykgZXh0ZW5kT3duKHJlc3VsdCwgcHJvcHMpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBDcmVhdGUgYSAoc2hhbGxvdy1jbG9uZWQpIGR1cGxpY2F0ZSBvZiBhbiBvYmplY3QuXG4gIGZ1bmN0aW9uIGNsb25lKG9iaikge1xuICAgIGlmICghaXNPYmplY3Qob2JqKSkgcmV0dXJuIG9iajtcbiAgICByZXR1cm4gaXNBcnJheShvYmopID8gb2JqLnNsaWNlKCkgOiBleHRlbmQoe30sIG9iaik7XG4gIH1cblxuICAvLyBJbnZva2VzIGBpbnRlcmNlcHRvcmAgd2l0aCB0aGUgYG9iamAgYW5kIHRoZW4gcmV0dXJucyBgb2JqYC5cbiAgLy8gVGhlIHByaW1hcnkgcHVycG9zZSBvZiB0aGlzIG1ldGhvZCBpcyB0byBcInRhcCBpbnRvXCIgYSBtZXRob2QgY2hhaW4sIGluXG4gIC8vIG9yZGVyIHRvIHBlcmZvcm0gb3BlcmF0aW9ucyBvbiBpbnRlcm1lZGlhdGUgcmVzdWx0cyB3aXRoaW4gdGhlIGNoYWluLlxuICBmdW5jdGlvbiB0YXAob2JqLCBpbnRlcmNlcHRvcikge1xuICAgIGludGVyY2VwdG9yKG9iaik7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSBhIChkZWVwKSBwcm9wZXJ0eSBgcGF0aGAgdG8gYXJyYXkuXG4gIC8vIExpa2UgYF8uaXRlcmF0ZWVgLCB0aGlzIGZ1bmN0aW9uIGNhbiBiZSBjdXN0b21pemVkLlxuICBmdW5jdGlvbiB0b1BhdGgkMShwYXRoKSB7XG4gICAgcmV0dXJuIGlzQXJyYXkocGF0aCkgPyBwYXRoIDogW3BhdGhdO1xuICB9XG4gIF8kMS50b1BhdGggPSB0b1BhdGgkMTtcblxuICAvLyBJbnRlcm5hbCB3cmFwcGVyIGZvciBgXy50b1BhdGhgIHRvIGVuYWJsZSBtaW5pZmljYXRpb24uXG4gIC8vIFNpbWlsYXIgdG8gYGNiYCBmb3IgYF8uaXRlcmF0ZWVgLlxuICBmdW5jdGlvbiB0b1BhdGgocGF0aCkge1xuICAgIHJldHVybiBfJDEudG9QYXRoKHBhdGgpO1xuICB9XG5cbiAgLy8gSW50ZXJuYWwgZnVuY3Rpb24gdG8gb2J0YWluIGEgbmVzdGVkIHByb3BlcnR5IGluIGBvYmpgIGFsb25nIGBwYXRoYC5cbiAgZnVuY3Rpb24gZGVlcEdldChvYmosIHBhdGgpIHtcbiAgICB2YXIgbGVuZ3RoID0gcGF0aC5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgICAgb2JqID0gb2JqW3BhdGhbaV1dO1xuICAgIH1cbiAgICByZXR1cm4gbGVuZ3RoID8gb2JqIDogdm9pZCAwO1xuICB9XG5cbiAgLy8gR2V0IHRoZSB2YWx1ZSBvZiB0aGUgKGRlZXApIHByb3BlcnR5IG9uIGBwYXRoYCBmcm9tIGBvYmplY3RgLlxuICAvLyBJZiBhbnkgcHJvcGVydHkgaW4gYHBhdGhgIGRvZXMgbm90IGV4aXN0IG9yIGlmIHRoZSB2YWx1ZSBpc1xuICAvLyBgdW5kZWZpbmVkYCwgcmV0dXJuIGBkZWZhdWx0VmFsdWVgIGluc3RlYWQuXG4gIC8vIFRoZSBgcGF0aGAgaXMgbm9ybWFsaXplZCB0aHJvdWdoIGBfLnRvUGF0aGAuXG4gIGZ1bmN0aW9uIGdldChvYmplY3QsIHBhdGgsIGRlZmF1bHRWYWx1ZSkge1xuICAgIHZhciB2YWx1ZSA9IGRlZXBHZXQob2JqZWN0LCB0b1BhdGgocGF0aCkpO1xuICAgIHJldHVybiBpc1VuZGVmaW5lZCh2YWx1ZSkgPyBkZWZhdWx0VmFsdWUgOiB2YWx1ZTtcbiAgfVxuXG4gIC8vIFNob3J0Y3V0IGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gcHJvcGVydHkgZGlyZWN0bHkgb25cbiAgLy8gaXRzZWxmIChpbiBvdGhlciB3b3Jkcywgbm90IG9uIGEgcHJvdG90eXBlKS4gVW5saWtlIHRoZSBpbnRlcm5hbCBgaGFzYFxuICAvLyBmdW5jdGlvbiwgdGhpcyBwdWJsaWMgdmVyc2lvbiBjYW4gYWxzbyB0cmF2ZXJzZSBuZXN0ZWQgcHJvcGVydGllcy5cbiAgZnVuY3Rpb24gaGFzKG9iaiwgcGF0aCkge1xuICAgIHBhdGggPSB0b1BhdGgocGF0aCk7XG4gICAgdmFyIGxlbmd0aCA9IHBhdGgubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBrZXkgPSBwYXRoW2ldO1xuICAgICAgaWYgKCFoYXMkMShvYmosIGtleSkpIHJldHVybiBmYWxzZTtcbiAgICAgIG9iaiA9IG9ialtrZXldO1xuICAgIH1cbiAgICByZXR1cm4gISFsZW5ndGg7XG4gIH1cblxuICAvLyBLZWVwIHRoZSBpZGVudGl0eSBmdW5jdGlvbiBhcm91bmQgZm9yIGRlZmF1bHQgaXRlcmF0ZWVzLlxuICBmdW5jdGlvbiBpZGVudGl0eSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8vIFJldHVybnMgYSBwcmVkaWNhdGUgZm9yIGNoZWNraW5nIHdoZXRoZXIgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHNldCBvZlxuICAvLyBga2V5OnZhbHVlYCBwYWlycy5cbiAgZnVuY3Rpb24gbWF0Y2hlcihhdHRycykge1xuICAgIGF0dHJzID0gZXh0ZW5kT3duKHt9LCBhdHRycyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIGlzTWF0Y2gob2JqLCBhdHRycyk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIHBhc3NlZCBhbiBvYmplY3QsIHdpbGwgdHJhdmVyc2UgdGhhdCBvYmplY3TigJlzXG4gIC8vIHByb3BlcnRpZXMgZG93biB0aGUgZ2l2ZW4gYHBhdGhgLCBzcGVjaWZpZWQgYXMgYW4gYXJyYXkgb2Yga2V5cyBvciBpbmRpY2VzLlxuICBmdW5jdGlvbiBwcm9wZXJ0eShwYXRoKSB7XG4gICAgcGF0aCA9IHRvUGF0aChwYXRoKTtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gZGVlcEdldChvYmosIHBhdGgpO1xuICAgIH07XG4gIH1cblxuICAvLyBJbnRlcm5hbCBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gZWZmaWNpZW50IChmb3IgY3VycmVudCBlbmdpbmVzKSB2ZXJzaW9uXG4gIC8vIG9mIHRoZSBwYXNzZWQtaW4gY2FsbGJhY2ssIHRvIGJlIHJlcGVhdGVkbHkgYXBwbGllZCBpbiBvdGhlciBVbmRlcnNjb3JlXG4gIC8vIGZ1bmN0aW9ucy5cbiAgZnVuY3Rpb24gb3B0aW1pemVDYihmdW5jLCBjb250ZXh0LCBhcmdDb3VudCkge1xuICAgIGlmIChjb250ZXh0ID09PSB2b2lkIDApIHJldHVybiBmdW5jO1xuICAgIHN3aXRjaCAoYXJnQ291bnQgPT0gbnVsbCA/IDMgOiBhcmdDb3VudCkge1xuICAgICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCB2YWx1ZSk7XG4gICAgICB9O1xuICAgICAgLy8gVGhlIDItYXJndW1lbnQgY2FzZSBpcyBvbWl0dGVkIGJlY2F1c2Ugd2XigJlyZSBub3QgdXNpbmcgaXQuXG4gICAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgICAgfTtcbiAgICAgIGNhc2UgNDogcmV0dXJuIGZ1bmN0aW9uKGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCBhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGNhbGxiYWNrcyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGVhY2hcbiAgLy8gZWxlbWVudCBpbiBhIGNvbGxlY3Rpb24sIHJldHVybmluZyB0aGUgZGVzaXJlZCByZXN1bHQg4oCUIGVpdGhlciBgXy5pZGVudGl0eWAsXG4gIC8vIGFuIGFyYml0cmFyeSBjYWxsYmFjaywgYSBwcm9wZXJ0eSBtYXRjaGVyLCBvciBhIHByb3BlcnR5IGFjY2Vzc29yLlxuICBmdW5jdGlvbiBiYXNlSXRlcmF0ZWUodmFsdWUsIGNvbnRleHQsIGFyZ0NvdW50KSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiBpZGVudGl0eTtcbiAgICBpZiAoaXNGdW5jdGlvbiQxKHZhbHVlKSkgcmV0dXJuIG9wdGltaXplQ2IodmFsdWUsIGNvbnRleHQsIGFyZ0NvdW50KTtcbiAgICBpZiAoaXNPYmplY3QodmFsdWUpICYmICFpc0FycmF5KHZhbHVlKSkgcmV0dXJuIG1hdGNoZXIodmFsdWUpO1xuICAgIHJldHVybiBwcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cblxuICAvLyBFeHRlcm5hbCB3cmFwcGVyIGZvciBvdXIgY2FsbGJhY2sgZ2VuZXJhdG9yLiBVc2VycyBtYXkgY3VzdG9taXplXG4gIC8vIGBfLml0ZXJhdGVlYCBpZiB0aGV5IHdhbnQgYWRkaXRpb25hbCBwcmVkaWNhdGUvaXRlcmF0ZWUgc2hvcnRoYW5kIHN0eWxlcy5cbiAgLy8gVGhpcyBhYnN0cmFjdGlvbiBoaWRlcyB0aGUgaW50ZXJuYWwtb25seSBgYXJnQ291bnRgIGFyZ3VtZW50LlxuICBmdW5jdGlvbiBpdGVyYXRlZSh2YWx1ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBiYXNlSXRlcmF0ZWUodmFsdWUsIGNvbnRleHQsIEluZmluaXR5KTtcbiAgfVxuICBfJDEuaXRlcmF0ZWUgPSBpdGVyYXRlZTtcblxuICAvLyBUaGUgZnVuY3Rpb24gd2UgY2FsbCBpbnRlcm5hbGx5IHRvIGdlbmVyYXRlIGEgY2FsbGJhY2suIEl0IGludm9rZXNcbiAgLy8gYF8uaXRlcmF0ZWVgIGlmIG92ZXJyaWRkZW4sIG90aGVyd2lzZSBgYmFzZUl0ZXJhdGVlYC5cbiAgZnVuY3Rpb24gY2IodmFsdWUsIGNvbnRleHQsIGFyZ0NvdW50KSB7XG4gICAgaWYgKF8kMS5pdGVyYXRlZSAhPT0gaXRlcmF0ZWUpIHJldHVybiBfJDEuaXRlcmF0ZWUodmFsdWUsIGNvbnRleHQpO1xuICAgIHJldHVybiBiYXNlSXRlcmF0ZWUodmFsdWUsIGNvbnRleHQsIGFyZ0NvdW50KTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIHJlc3VsdHMgb2YgYXBwbHlpbmcgdGhlIGBpdGVyYXRlZWAgdG8gZWFjaCBlbGVtZW50IG9mIGBvYmpgLlxuICAvLyBJbiBjb250cmFzdCB0byBgXy5tYXBgIGl0IHJldHVybnMgYW4gb2JqZWN0LlxuICBmdW5jdGlvbiBtYXBPYmplY3Qob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciBfa2V5cyA9IGtleXMob2JqKSxcbiAgICAgICAgbGVuZ3RoID0gX2tleXMubGVuZ3RoLFxuICAgICAgICByZXN1bHRzID0ge307XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGN1cnJlbnRLZXkgPSBfa2V5c1tpbmRleF07XG4gICAgICByZXN1bHRzW2N1cnJlbnRLZXldID0gaXRlcmF0ZWUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIC8vIFByZWRpY2F0ZS1nZW5lcmF0aW5nIGZ1bmN0aW9uLiBPZnRlbiB1c2VmdWwgb3V0c2lkZSBvZiBVbmRlcnNjb3JlLlxuICBmdW5jdGlvbiBub29wKCl7fVxuXG4gIC8vIEdlbmVyYXRlcyBhIGZ1bmN0aW9uIGZvciBhIGdpdmVuIG9iamVjdCB0aGF0IHJldHVybnMgYSBnaXZlbiBwcm9wZXJ0eS5cbiAgZnVuY3Rpb24gcHJvcGVydHlPZihvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiBub29wO1xuICAgIHJldHVybiBmdW5jdGlvbihwYXRoKSB7XG4gICAgICByZXR1cm4gZ2V0KG9iaiwgcGF0aCk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFJ1biBhIGZ1bmN0aW9uICoqbioqIHRpbWVzLlxuICBmdW5jdGlvbiB0aW1lcyhuLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciBhY2N1bSA9IEFycmF5KE1hdGgubWF4KDAsIG4pKTtcbiAgICBpdGVyYXRlZSA9IG9wdGltaXplQ2IoaXRlcmF0ZWUsIGNvbnRleHQsIDEpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSBhY2N1bVtpXSA9IGl0ZXJhdGVlKGkpO1xuICAgIHJldHVybiBhY2N1bTtcbiAgfVxuXG4gIC8vIFJldHVybiBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gYG1pbmAgYW5kIGBtYXhgIChpbmNsdXNpdmUpLlxuICBmdW5jdGlvbiByYW5kb20obWluLCBtYXgpIHtcbiAgICBpZiAobWF4ID09IG51bGwpIHtcbiAgICAgIG1heCA9IG1pbjtcbiAgICAgIG1pbiA9IDA7XG4gICAgfVxuICAgIHJldHVybiBtaW4gKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpO1xuICB9XG5cbiAgLy8gQSAocG9zc2libHkgZmFzdGVyKSB3YXkgdG8gZ2V0IHRoZSBjdXJyZW50IHRpbWVzdGFtcCBhcyBhbiBpbnRlZ2VyLlxuICB2YXIgbm93ID0gRGF0ZS5ub3cgfHwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB9O1xuXG4gIC8vIEludGVybmFsIGhlbHBlciB0byBnZW5lcmF0ZSBmdW5jdGlvbnMgZm9yIGVzY2FwaW5nIGFuZCB1bmVzY2FwaW5nIHN0cmluZ3NcbiAgLy8gdG8vZnJvbSBIVE1MIGludGVycG9sYXRpb24uXG4gIGZ1bmN0aW9uIGNyZWF0ZUVzY2FwZXIobWFwKSB7XG4gICAgdmFyIGVzY2FwZXIgPSBmdW5jdGlvbihtYXRjaCkge1xuICAgICAgcmV0dXJuIG1hcFttYXRjaF07XG4gICAgfTtcbiAgICAvLyBSZWdleGVzIGZvciBpZGVudGlmeWluZyBhIGtleSB0aGF0IG5lZWRzIHRvIGJlIGVzY2FwZWQuXG4gICAgdmFyIHNvdXJjZSA9ICcoPzonICsga2V5cyhtYXApLmpvaW4oJ3wnKSArICcpJztcbiAgICB2YXIgdGVzdFJlZ2V4cCA9IFJlZ0V4cChzb3VyY2UpO1xuICAgIHZhciByZXBsYWNlUmVnZXhwID0gUmVnRXhwKHNvdXJjZSwgJ2cnKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICBzdHJpbmcgPSBzdHJpbmcgPT0gbnVsbCA/ICcnIDogJycgKyBzdHJpbmc7XG4gICAgICByZXR1cm4gdGVzdFJlZ2V4cC50ZXN0KHN0cmluZykgPyBzdHJpbmcucmVwbGFjZShyZXBsYWNlUmVnZXhwLCBlc2NhcGVyKSA6IHN0cmluZztcbiAgICB9O1xuICB9XG5cbiAgLy8gSW50ZXJuYWwgbGlzdCBvZiBIVE1MIGVudGl0aWVzIGZvciBlc2NhcGluZy5cbiAgdmFyIGVzY2FwZU1hcCA9IHtcbiAgICAnJic6ICcmYW1wOycsXG4gICAgJzwnOiAnJmx0OycsXG4gICAgJz4nOiAnJmd0OycsXG4gICAgJ1wiJzogJyZxdW90OycsXG4gICAgXCInXCI6ICcmI3gyNzsnLFxuICAgICdgJzogJyYjeDYwOydcbiAgfTtcblxuICAvLyBGdW5jdGlvbiBmb3IgZXNjYXBpbmcgc3RyaW5ncyB0byBIVE1MIGludGVycG9sYXRpb24uXG4gIHZhciBfZXNjYXBlID0gY3JlYXRlRXNjYXBlcihlc2NhcGVNYXApO1xuXG4gIC8vIEludGVybmFsIGxpc3Qgb2YgSFRNTCBlbnRpdGllcyBmb3IgdW5lc2NhcGluZy5cbiAgdmFyIHVuZXNjYXBlTWFwID0gaW52ZXJ0KGVzY2FwZU1hcCk7XG5cbiAgLy8gRnVuY3Rpb24gZm9yIHVuZXNjYXBpbmcgc3RyaW5ncyBmcm9tIEhUTUwgaW50ZXJwb2xhdGlvbi5cbiAgdmFyIF91bmVzY2FwZSA9IGNyZWF0ZUVzY2FwZXIodW5lc2NhcGVNYXApO1xuXG4gIC8vIEJ5IGRlZmF1bHQsIFVuZGVyc2NvcmUgdXNlcyBFUkItc3R5bGUgdGVtcGxhdGUgZGVsaW1pdGVycy4gQ2hhbmdlIHRoZVxuICAvLyBmb2xsb3dpbmcgdGVtcGxhdGUgc2V0dGluZ3MgdG8gdXNlIGFsdGVybmF0aXZlIGRlbGltaXRlcnMuXG4gIHZhciB0ZW1wbGF0ZVNldHRpbmdzID0gXyQxLnRlbXBsYXRlU2V0dGluZ3MgPSB7XG4gICAgZXZhbHVhdGU6IC88JShbXFxzXFxTXSs/KSU+L2csXG4gICAgaW50ZXJwb2xhdGU6IC88JT0oW1xcc1xcU10rPyklPi9nLFxuICAgIGVzY2FwZTogLzwlLShbXFxzXFxTXSs/KSU+L2dcbiAgfTtcblxuICAvLyBXaGVuIGN1c3RvbWl6aW5nIGBfLnRlbXBsYXRlU2V0dGluZ3NgLCBpZiB5b3UgZG9uJ3Qgd2FudCB0byBkZWZpbmUgYW5cbiAgLy8gaW50ZXJwb2xhdGlvbiwgZXZhbHVhdGlvbiBvciBlc2NhcGluZyByZWdleCwgd2UgbmVlZCBvbmUgdGhhdCBpc1xuICAvLyBndWFyYW50ZWVkIG5vdCB0byBtYXRjaC5cbiAgdmFyIG5vTWF0Y2ggPSAvKC4pXi87XG5cbiAgLy8gQ2VydGFpbiBjaGFyYWN0ZXJzIG5lZWQgdG8gYmUgZXNjYXBlZCBzbyB0aGF0IHRoZXkgY2FuIGJlIHB1dCBpbnRvIGFcbiAgLy8gc3RyaW5nIGxpdGVyYWwuXG4gIHZhciBlc2NhcGVzID0ge1xuICAgIFwiJ1wiOiBcIidcIixcbiAgICAnXFxcXCc6ICdcXFxcJyxcbiAgICAnXFxyJzogJ3InLFxuICAgICdcXG4nOiAnbicsXG4gICAgJ1xcdTIwMjgnOiAndTIwMjgnLFxuICAgICdcXHUyMDI5JzogJ3UyMDI5J1xuICB9O1xuXG4gIHZhciBlc2NhcGVSZWdFeHAgPSAvXFxcXHwnfFxccnxcXG58XFx1MjAyOHxcXHUyMDI5L2c7XG5cbiAgZnVuY3Rpb24gZXNjYXBlQ2hhcihtYXRjaCkge1xuICAgIHJldHVybiAnXFxcXCcgKyBlc2NhcGVzW21hdGNoXTtcbiAgfVxuXG4gIC8vIEluIG9yZGVyIHRvIHByZXZlbnQgdGhpcmQtcGFydHkgY29kZSBpbmplY3Rpb24gdGhyb3VnaFxuICAvLyBgXy50ZW1wbGF0ZVNldHRpbmdzLnZhcmlhYmxlYCwgd2UgdGVzdCBpdCBhZ2FpbnN0IHRoZSBmb2xsb3dpbmcgcmVndWxhclxuICAvLyBleHByZXNzaW9uLiBJdCBpcyBpbnRlbnRpb25hbGx5IGEgYml0IG1vcmUgbGliZXJhbCB0aGFuIGp1c3QgbWF0Y2hpbmcgdmFsaWRcbiAgLy8gaWRlbnRpZmllcnMsIGJ1dCBzdGlsbCBwcmV2ZW50cyBwb3NzaWJsZSBsb29waG9sZXMgdGhyb3VnaCBkZWZhdWx0cyBvclxuICAvLyBkZXN0cnVjdHVyaW5nIGFzc2lnbm1lbnQuXG4gIHZhciBiYXJlSWRlbnRpZmllciA9IC9eXFxzKihcXHd8XFwkKStcXHMqJC87XG5cbiAgLy8gSmF2YVNjcmlwdCBtaWNyby10ZW1wbGF0aW5nLCBzaW1pbGFyIHRvIEpvaG4gUmVzaWcncyBpbXBsZW1lbnRhdGlvbi5cbiAgLy8gVW5kZXJzY29yZSB0ZW1wbGF0aW5nIGhhbmRsZXMgYXJiaXRyYXJ5IGRlbGltaXRlcnMsIHByZXNlcnZlcyB3aGl0ZXNwYWNlLFxuICAvLyBhbmQgY29ycmVjdGx5IGVzY2FwZXMgcXVvdGVzIHdpdGhpbiBpbnRlcnBvbGF0ZWQgY29kZS5cbiAgLy8gTkI6IGBvbGRTZXR0aW5nc2Agb25seSBleGlzdHMgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LlxuICBmdW5jdGlvbiB0ZW1wbGF0ZSh0ZXh0LCBzZXR0aW5ncywgb2xkU2V0dGluZ3MpIHtcbiAgICBpZiAoIXNldHRpbmdzICYmIG9sZFNldHRpbmdzKSBzZXR0aW5ncyA9IG9sZFNldHRpbmdzO1xuICAgIHNldHRpbmdzID0gZGVmYXVsdHMoe30sIHNldHRpbmdzLCBfJDEudGVtcGxhdGVTZXR0aW5ncyk7XG5cbiAgICAvLyBDb21iaW5lIGRlbGltaXRlcnMgaW50byBvbmUgcmVndWxhciBleHByZXNzaW9uIHZpYSBhbHRlcm5hdGlvbi5cbiAgICB2YXIgbWF0Y2hlciA9IFJlZ0V4cChbXG4gICAgICAoc2V0dGluZ3MuZXNjYXBlIHx8IG5vTWF0Y2gpLnNvdXJjZSxcbiAgICAgIChzZXR0aW5ncy5pbnRlcnBvbGF0ZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuZXZhbHVhdGUgfHwgbm9NYXRjaCkuc291cmNlXG4gICAgXS5qb2luKCd8JykgKyAnfCQnLCAnZycpO1xuXG4gICAgLy8gQ29tcGlsZSB0aGUgdGVtcGxhdGUgc291cmNlLCBlc2NhcGluZyBzdHJpbmcgbGl0ZXJhbHMgYXBwcm9wcmlhdGVseS5cbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBzb3VyY2UgPSBcIl9fcCs9J1wiO1xuICAgIHRleHQucmVwbGFjZShtYXRjaGVyLCBmdW5jdGlvbihtYXRjaCwgZXNjYXBlLCBpbnRlcnBvbGF0ZSwgZXZhbHVhdGUsIG9mZnNldCkge1xuICAgICAgc291cmNlICs9IHRleHQuc2xpY2UoaW5kZXgsIG9mZnNldCkucmVwbGFjZShlc2NhcGVSZWdFeHAsIGVzY2FwZUNoYXIpO1xuICAgICAgaW5kZXggPSBvZmZzZXQgKyBtYXRjaC5sZW5ndGg7XG5cbiAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBlc2NhcGUgKyBcIikpPT1udWxsPycnOl8uZXNjYXBlKF9fdCkpK1xcbidcIjtcbiAgICAgIH0gZWxzZSBpZiAoaW50ZXJwb2xhdGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBpbnRlcnBvbGF0ZSArIFwiKSk9PW51bGw/Jyc6X190KStcXG4nXCI7XG4gICAgICB9IGVsc2UgaWYgKGV2YWx1YXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIic7XFxuXCIgKyBldmFsdWF0ZSArIFwiXFxuX19wKz0nXCI7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkb2JlIFZNcyBuZWVkIHRoZSBtYXRjaCByZXR1cm5lZCB0byBwcm9kdWNlIHRoZSBjb3JyZWN0IG9mZnNldC5cbiAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9KTtcbiAgICBzb3VyY2UgKz0gXCInO1xcblwiO1xuXG4gICAgdmFyIGFyZ3VtZW50ID0gc2V0dGluZ3MudmFyaWFibGU7XG4gICAgaWYgKGFyZ3VtZW50KSB7XG4gICAgICAvLyBJbnN1cmUgYWdhaW5zdCB0aGlyZC1wYXJ0eSBjb2RlIGluamVjdGlvbi4gKENWRS0yMDIxLTIzMzU4KVxuICAgICAgaWYgKCFiYXJlSWRlbnRpZmllci50ZXN0KGFyZ3VtZW50KSkgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAndmFyaWFibGUgaXMgbm90IGEgYmFyZSBpZGVudGlmaWVyOiAnICsgYXJndW1lbnRcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIGEgdmFyaWFibGUgaXMgbm90IHNwZWNpZmllZCwgcGxhY2UgZGF0YSB2YWx1ZXMgaW4gbG9jYWwgc2NvcGUuXG4gICAgICBzb3VyY2UgPSAnd2l0aChvYmp8fHt9KXtcXG4nICsgc291cmNlICsgJ31cXG4nO1xuICAgICAgYXJndW1lbnQgPSAnb2JqJztcbiAgICB9XG5cbiAgICBzb3VyY2UgPSBcInZhciBfX3QsX19wPScnLF9faj1BcnJheS5wcm90b3R5cGUuam9pbixcIiArXG4gICAgICBcInByaW50PWZ1bmN0aW9uKCl7X19wKz1fX2ouY2FsbChhcmd1bWVudHMsJycpO307XFxuXCIgK1xuICAgICAgc291cmNlICsgJ3JldHVybiBfX3A7XFxuJztcblxuICAgIHZhciByZW5kZXI7XG4gICAgdHJ5IHtcbiAgICAgIHJlbmRlciA9IG5ldyBGdW5jdGlvbihhcmd1bWVudCwgJ18nLCBzb3VyY2UpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGUuc291cmNlID0gc291cmNlO1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG5cbiAgICB2YXIgdGVtcGxhdGUgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gcmVuZGVyLmNhbGwodGhpcywgZGF0YSwgXyQxKTtcbiAgICB9O1xuXG4gICAgLy8gUHJvdmlkZSB0aGUgY29tcGlsZWQgc291cmNlIGFzIGEgY29udmVuaWVuY2UgZm9yIHByZWNvbXBpbGF0aW9uLlxuICAgIHRlbXBsYXRlLnNvdXJjZSA9ICdmdW5jdGlvbignICsgYXJndW1lbnQgKyAnKXtcXG4nICsgc291cmNlICsgJ30nO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9XG5cbiAgLy8gVHJhdmVyc2VzIHRoZSBjaGlsZHJlbiBvZiBgb2JqYCBhbG9uZyBgcGF0aGAuIElmIGEgY2hpbGQgaXMgYSBmdW5jdGlvbiwgaXRcbiAgLy8gaXMgaW52b2tlZCB3aXRoIGl0cyBwYXJlbnQgYXMgY29udGV4dC4gUmV0dXJucyB0aGUgdmFsdWUgb2YgdGhlIGZpbmFsXG4gIC8vIGNoaWxkLCBvciBgZmFsbGJhY2tgIGlmIGFueSBjaGlsZCBpcyB1bmRlZmluZWQuXG4gIGZ1bmN0aW9uIHJlc3VsdChvYmosIHBhdGgsIGZhbGxiYWNrKSB7XG4gICAgcGF0aCA9IHRvUGF0aChwYXRoKTtcbiAgICB2YXIgbGVuZ3RoID0gcGF0aC5sZW5ndGg7XG4gICAgaWYgKCFsZW5ndGgpIHtcbiAgICAgIHJldHVybiBpc0Z1bmN0aW9uJDEoZmFsbGJhY2spID8gZmFsbGJhY2suY2FsbChvYmopIDogZmFsbGJhY2s7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBwcm9wID0gb2JqID09IG51bGwgPyB2b2lkIDAgOiBvYmpbcGF0aFtpXV07XG4gICAgICBpZiAocHJvcCA9PT0gdm9pZCAwKSB7XG4gICAgICAgIHByb3AgPSBmYWxsYmFjaztcbiAgICAgICAgaSA9IGxlbmd0aDsgLy8gRW5zdXJlIHdlIGRvbid0IGNvbnRpbnVlIGl0ZXJhdGluZy5cbiAgICAgIH1cbiAgICAgIG9iaiA9IGlzRnVuY3Rpb24kMShwcm9wKSA/IHByb3AuY2FsbChvYmopIDogcHJvcDtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIC8vIEdlbmVyYXRlIGEgdW5pcXVlIGludGVnZXIgaWQgKHVuaXF1ZSB3aXRoaW4gdGhlIGVudGlyZSBjbGllbnQgc2Vzc2lvbikuXG4gIC8vIFVzZWZ1bCBmb3IgdGVtcG9yYXJ5IERPTSBpZHMuXG4gIHZhciBpZENvdW50ZXIgPSAwO1xuICBmdW5jdGlvbiB1bmlxdWVJZChwcmVmaXgpIHtcbiAgICB2YXIgaWQgPSArK2lkQ291bnRlciArICcnO1xuICAgIHJldHVybiBwcmVmaXggPyBwcmVmaXggKyBpZCA6IGlkO1xuICB9XG5cbiAgLy8gU3RhcnQgY2hhaW5pbmcgYSB3cmFwcGVkIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBmdW5jdGlvbiBjaGFpbihvYmopIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBfJDEob2JqKTtcbiAgICBpbnN0YW5jZS5fY2hhaW4gPSB0cnVlO1xuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfVxuXG4gIC8vIEludGVybmFsIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgYHNvdXJjZUZ1bmNgIGJvdW5kIHRvIGBjb250ZXh0YCB3aXRoIG9wdGlvbmFsXG4gIC8vIGBhcmdzYC4gRGV0ZXJtaW5lcyB3aGV0aGVyIHRvIGV4ZWN1dGUgYSBmdW5jdGlvbiBhcyBhIGNvbnN0cnVjdG9yIG9yIGFzIGFcbiAgLy8gbm9ybWFsIGZ1bmN0aW9uLlxuICBmdW5jdGlvbiBleGVjdXRlQm91bmQoc291cmNlRnVuYywgYm91bmRGdW5jLCBjb250ZXh0LCBjYWxsaW5nQ29udGV4dCwgYXJncykge1xuICAgIGlmICghKGNhbGxpbmdDb250ZXh0IGluc3RhbmNlb2YgYm91bmRGdW5jKSkgcmV0dXJuIHNvdXJjZUZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgdmFyIHNlbGYgPSBiYXNlQ3JlYXRlKHNvdXJjZUZ1bmMucHJvdG90eXBlKTtcbiAgICB2YXIgcmVzdWx0ID0gc291cmNlRnVuYy5hcHBseShzZWxmLCBhcmdzKTtcbiAgICBpZiAoaXNPYmplY3QocmVzdWx0KSkgcmV0dXJuIHJlc3VsdDtcbiAgICByZXR1cm4gc2VsZjtcbiAgfVxuXG4gIC8vIFBhcnRpYWxseSBhcHBseSBhIGZ1bmN0aW9uIGJ5IGNyZWF0aW5nIGEgdmVyc2lvbiB0aGF0IGhhcyBoYWQgc29tZSBvZiBpdHNcbiAgLy8gYXJndW1lbnRzIHByZS1maWxsZWQsIHdpdGhvdXQgY2hhbmdpbmcgaXRzIGR5bmFtaWMgYHRoaXNgIGNvbnRleHQuIGBfYCBhY3RzXG4gIC8vIGFzIGEgcGxhY2Vob2xkZXIgYnkgZGVmYXVsdCwgYWxsb3dpbmcgYW55IGNvbWJpbmF0aW9uIG9mIGFyZ3VtZW50cyB0byBiZVxuICAvLyBwcmUtZmlsbGVkLiBTZXQgYF8ucGFydGlhbC5wbGFjZWhvbGRlcmAgZm9yIGEgY3VzdG9tIHBsYWNlaG9sZGVyIGFyZ3VtZW50LlxuICB2YXIgcGFydGlhbCA9IHJlc3RBcmd1bWVudHMoZnVuY3Rpb24oZnVuYywgYm91bmRBcmdzKSB7XG4gICAgdmFyIHBsYWNlaG9sZGVyID0gcGFydGlhbC5wbGFjZWhvbGRlcjtcbiAgICB2YXIgYm91bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwb3NpdGlvbiA9IDAsIGxlbmd0aCA9IGJvdW5kQXJncy5sZW5ndGg7XG4gICAgICB2YXIgYXJncyA9IEFycmF5KGxlbmd0aCk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFyZ3NbaV0gPSBib3VuZEFyZ3NbaV0gPT09IHBsYWNlaG9sZGVyID8gYXJndW1lbnRzW3Bvc2l0aW9uKytdIDogYm91bmRBcmdzW2ldO1xuICAgICAgfVxuICAgICAgd2hpbGUgKHBvc2l0aW9uIDwgYXJndW1lbnRzLmxlbmd0aCkgYXJncy5wdXNoKGFyZ3VtZW50c1twb3NpdGlvbisrXSk7XG4gICAgICByZXR1cm4gZXhlY3V0ZUJvdW5kKGZ1bmMsIGJvdW5kLCB0aGlzLCB0aGlzLCBhcmdzKTtcbiAgICB9O1xuICAgIHJldHVybiBib3VuZDtcbiAgfSk7XG5cbiAgcGFydGlhbC5wbGFjZWhvbGRlciA9IF8kMTtcblxuICAvLyBDcmVhdGUgYSBmdW5jdGlvbiBib3VuZCB0byBhIGdpdmVuIG9iamVjdCAoYXNzaWduaW5nIGB0aGlzYCwgYW5kIGFyZ3VtZW50cyxcbiAgLy8gb3B0aW9uYWxseSkuXG4gIHZhciBiaW5kID0gcmVzdEFyZ3VtZW50cyhmdW5jdGlvbihmdW5jLCBjb250ZXh0LCBhcmdzKSB7XG4gICAgaWYgKCFpc0Z1bmN0aW9uJDEoZnVuYykpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JpbmQgbXVzdCBiZSBjYWxsZWQgb24gYSBmdW5jdGlvbicpO1xuICAgIHZhciBib3VuZCA9IHJlc3RBcmd1bWVudHMoZnVuY3Rpb24oY2FsbEFyZ3MpIHtcbiAgICAgIHJldHVybiBleGVjdXRlQm91bmQoZnVuYywgYm91bmQsIGNvbnRleHQsIHRoaXMsIGFyZ3MuY29uY2F0KGNhbGxBcmdzKSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGJvdW5kO1xuICB9KTtcblxuICAvLyBJbnRlcm5hbCBoZWxwZXIgZm9yIGNvbGxlY3Rpb24gbWV0aG9kcyB0byBkZXRlcm1pbmUgd2hldGhlciBhIGNvbGxlY3Rpb25cbiAgLy8gc2hvdWxkIGJlIGl0ZXJhdGVkIGFzIGFuIGFycmF5IG9yIGFzIGFuIG9iamVjdC5cbiAgLy8gUmVsYXRlZDogaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvbGVuZ3RoXG4gIC8vIEF2b2lkcyBhIHZlcnkgbmFzdHkgaU9TIDggSklUIGJ1ZyBvbiBBUk0tNjQuICMyMDk0XG4gIHZhciBpc0FycmF5TGlrZSA9IGNyZWF0ZVNpemVQcm9wZXJ0eUNoZWNrKGdldExlbmd0aCk7XG5cbiAgLy8gSW50ZXJuYWwgaW1wbGVtZW50YXRpb24gb2YgYSByZWN1cnNpdmUgYGZsYXR0ZW5gIGZ1bmN0aW9uLlxuICBmdW5jdGlvbiBmbGF0dGVuJDEoaW5wdXQsIGRlcHRoLCBzdHJpY3QsIG91dHB1dCkge1xuICAgIG91dHB1dCA9IG91dHB1dCB8fCBbXTtcbiAgICBpZiAoIWRlcHRoICYmIGRlcHRoICE9PSAwKSB7XG4gICAgICBkZXB0aCA9IEluZmluaXR5O1xuICAgIH0gZWxzZSBpZiAoZGVwdGggPD0gMCkge1xuICAgICAgcmV0dXJuIG91dHB1dC5jb25jYXQoaW5wdXQpO1xuICAgIH1cbiAgICB2YXIgaWR4ID0gb3V0cHV0Lmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGlucHV0KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBpbnB1dFtpXTtcbiAgICAgIGlmIChpc0FycmF5TGlrZSh2YWx1ZSkgJiYgKGlzQXJyYXkodmFsdWUpIHx8IGlzQXJndW1lbnRzJDEodmFsdWUpKSkge1xuICAgICAgICAvLyBGbGF0dGVuIGN1cnJlbnQgbGV2ZWwgb2YgYXJyYXkgb3IgYXJndW1lbnRzIG9iamVjdC5cbiAgICAgICAgaWYgKGRlcHRoID4gMSkge1xuICAgICAgICAgIGZsYXR0ZW4kMSh2YWx1ZSwgZGVwdGggLSAxLCBzdHJpY3QsIG91dHB1dCk7XG4gICAgICAgICAgaWR4ID0gb3V0cHV0Lmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgaiA9IDAsIGxlbiA9IHZhbHVlLmxlbmd0aDtcbiAgICAgICAgICB3aGlsZSAoaiA8IGxlbikgb3V0cHV0W2lkeCsrXSA9IHZhbHVlW2orK107XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIXN0cmljdCkge1xuICAgICAgICBvdXRwdXRbaWR4KytdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICAvLyBCaW5kIGEgbnVtYmVyIG9mIGFuIG9iamVjdCdzIG1ldGhvZHMgdG8gdGhhdCBvYmplY3QuIFJlbWFpbmluZyBhcmd1bWVudHNcbiAgLy8gYXJlIHRoZSBtZXRob2QgbmFtZXMgdG8gYmUgYm91bmQuIFVzZWZ1bCBmb3IgZW5zdXJpbmcgdGhhdCBhbGwgY2FsbGJhY2tzXG4gIC8vIGRlZmluZWQgb24gYW4gb2JqZWN0IGJlbG9uZyB0byBpdC5cbiAgdmFyIGJpbmRBbGwgPSByZXN0QXJndW1lbnRzKGZ1bmN0aW9uKG9iaiwga2V5cykge1xuICAgIGtleXMgPSBmbGF0dGVuJDEoa2V5cywgZmFsc2UsIGZhbHNlKTtcbiAgICB2YXIgaW5kZXggPSBrZXlzLmxlbmd0aDtcbiAgICBpZiAoaW5kZXggPCAxKSB0aHJvdyBuZXcgRXJyb3IoJ2JpbmRBbGwgbXVzdCBiZSBwYXNzZWQgZnVuY3Rpb24gbmFtZXMnKTtcbiAgICB3aGlsZSAoaW5kZXgtLSkge1xuICAgICAgdmFyIGtleSA9IGtleXNbaW5kZXhdO1xuICAgICAgb2JqW2tleV0gPSBiaW5kKG9ialtrZXldLCBvYmopO1xuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9KTtcblxuICAvLyBNZW1vaXplIGFuIGV4cGVuc2l2ZSBmdW5jdGlvbiBieSBzdG9yaW5nIGl0cyByZXN1bHRzLlxuICBmdW5jdGlvbiBtZW1vaXplKGZ1bmMsIGhhc2hlcikge1xuICAgIHZhciBtZW1vaXplID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgY2FjaGUgPSBtZW1vaXplLmNhY2hlO1xuICAgICAgdmFyIGFkZHJlc3MgPSAnJyArIChoYXNoZXIgPyBoYXNoZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSA6IGtleSk7XG4gICAgICBpZiAoIWhhcyQxKGNhY2hlLCBhZGRyZXNzKSkgY2FjaGVbYWRkcmVzc10gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gY2FjaGVbYWRkcmVzc107XG4gICAgfTtcbiAgICBtZW1vaXplLmNhY2hlID0ge307XG4gICAgcmV0dXJuIG1lbW9pemU7XG4gIH1cblxuICAvLyBEZWxheXMgYSBmdW5jdGlvbiBmb3IgdGhlIGdpdmVuIG51bWJlciBvZiBtaWxsaXNlY29uZHMsIGFuZCB0aGVuIGNhbGxzXG4gIC8vIGl0IHdpdGggdGhlIGFyZ3VtZW50cyBzdXBwbGllZC5cbiAgdmFyIGRlbGF5ID0gcmVzdEFyZ3VtZW50cyhmdW5jdGlvbihmdW5jLCB3YWl0LCBhcmdzKSB7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseShudWxsLCBhcmdzKTtcbiAgICB9LCB3YWl0KTtcbiAgfSk7XG5cbiAgLy8gRGVmZXJzIGEgZnVuY3Rpb24sIHNjaGVkdWxpbmcgaXQgdG8gcnVuIGFmdGVyIHRoZSBjdXJyZW50IGNhbGwgc3RhY2sgaGFzXG4gIC8vIGNsZWFyZWQuXG4gIHZhciBkZWZlciA9IHBhcnRpYWwoZGVsYXksIF8kMSwgMSk7XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCB3aGVuIGludm9rZWQsIHdpbGwgb25seSBiZSB0cmlnZ2VyZWQgYXQgbW9zdCBvbmNlXG4gIC8vIGR1cmluZyBhIGdpdmVuIHdpbmRvdyBvZiB0aW1lLiBOb3JtYWxseSwgdGhlIHRocm90dGxlZCBmdW5jdGlvbiB3aWxsIHJ1blxuICAvLyBhcyBtdWNoIGFzIGl0IGNhbiwgd2l0aG91dCBldmVyIGdvaW5nIG1vcmUgdGhhbiBvbmNlIHBlciBgd2FpdGAgZHVyYXRpb247XG4gIC8vIGJ1dCBpZiB5b3UnZCBsaWtlIHRvIGRpc2FibGUgdGhlIGV4ZWN1dGlvbiBvbiB0aGUgbGVhZGluZyBlZGdlLCBwYXNzXG4gIC8vIGB7bGVhZGluZzogZmFsc2V9YC4gVG8gZGlzYWJsZSBleGVjdXRpb24gb24gdGhlIHRyYWlsaW5nIGVkZ2UsIGRpdHRvLlxuICBmdW5jdGlvbiB0aHJvdHRsZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gICAgdmFyIHRpbWVvdXQsIGNvbnRleHQsIGFyZ3MsIHJlc3VsdDtcbiAgICB2YXIgcHJldmlvdXMgPSAwO1xuICAgIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuXG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBwcmV2aW91cyA9IG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UgPyAwIDogbm93KCk7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICB9O1xuXG4gICAgdmFyIHRocm90dGxlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIF9ub3cgPSBub3coKTtcbiAgICAgIGlmICghcHJldmlvdXMgJiYgb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSkgcHJldmlvdXMgPSBfbm93O1xuICAgICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAoX25vdyAtIHByZXZpb3VzKTtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGlmIChyZW1haW5pbmcgPD0gMCB8fCByZW1haW5pbmcgPiB3YWl0KSB7XG4gICAgICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHByZXZpb3VzID0gX25vdztcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICB9IGVsc2UgaWYgKCF0aW1lb3V0ICYmIG9wdGlvbnMudHJhaWxpbmcgIT09IGZhbHNlKSB7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCByZW1haW5pbmcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgdGhyb3R0bGVkLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgcHJldmlvdXMgPSAwO1xuICAgICAgdGltZW91dCA9IGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRocm90dGxlZDtcbiAgfVxuXG4gIC8vIFdoZW4gYSBzZXF1ZW5jZSBvZiBjYWxscyBvZiB0aGUgcmV0dXJuZWQgZnVuY3Rpb24gZW5kcywgdGhlIGFyZ3VtZW50XG4gIC8vIGZ1bmN0aW9uIGlzIHRyaWdnZXJlZC4gVGhlIGVuZCBvZiBhIHNlcXVlbmNlIGlzIGRlZmluZWQgYnkgdGhlIGB3YWl0YFxuICAvLyBwYXJhbWV0ZXIuIElmIGBpbW1lZGlhdGVgIGlzIHBhc3NlZCwgdGhlIGFyZ3VtZW50IGZ1bmN0aW9uIHdpbGwgYmVcbiAgLy8gdHJpZ2dlcmVkIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIHNlcXVlbmNlIGluc3RlYWQgb2YgYXQgdGhlIGVuZC5cbiAgZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgdmFyIHRpbWVvdXQsIHByZXZpb3VzLCBhcmdzLCByZXN1bHQsIGNvbnRleHQ7XG5cbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwYXNzZWQgPSBub3coKSAtIHByZXZpb3VzO1xuICAgICAgaWYgKHdhaXQgPiBwYXNzZWQpIHtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQgLSBwYXNzZWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIGlmICghaW1tZWRpYXRlKSByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAvLyBUaGlzIGNoZWNrIGlzIG5lZWRlZCBiZWNhdXNlIGBmdW5jYCBjYW4gcmVjdXJzaXZlbHkgaW52b2tlIGBkZWJvdW5jZWRgLlxuICAgICAgICBpZiAoIXRpbWVvdXQpIGFyZ3MgPSBjb250ZXh0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGRlYm91bmNlZCA9IHJlc3RBcmd1bWVudHMoZnVuY3Rpb24oX2FyZ3MpIHtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IF9hcmdzO1xuICAgICAgcHJldmlvdXMgPSBub3coKTtcbiAgICAgIGlmICghdGltZW91dCkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgICAgIGlmIChpbW1lZGlhdGUpIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pO1xuXG4gICAgZGVib3VuY2VkLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgdGltZW91dCA9IGFyZ3MgPSBjb250ZXh0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGRlYm91bmNlZDtcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIGZpcnN0IGZ1bmN0aW9uIHBhc3NlZCBhcyBhbiBhcmd1bWVudCB0byB0aGUgc2Vjb25kLFxuICAvLyBhbGxvd2luZyB5b3UgdG8gYWRqdXN0IGFyZ3VtZW50cywgcnVuIGNvZGUgYmVmb3JlIGFuZCBhZnRlciwgYW5kXG4gIC8vIGNvbmRpdGlvbmFsbHkgZXhlY3V0ZSB0aGUgb3JpZ2luYWwgZnVuY3Rpb24uXG4gIGZ1bmN0aW9uIHdyYXAoZnVuYywgd3JhcHBlcikge1xuICAgIHJldHVybiBwYXJ0aWFsKHdyYXBwZXIsIGZ1bmMpO1xuICB9XG5cbiAgLy8gUmV0dXJucyBhIG5lZ2F0ZWQgdmVyc2lvbiBvZiB0aGUgcGFzc2VkLWluIHByZWRpY2F0ZS5cbiAgZnVuY3Rpb24gbmVnYXRlKHByZWRpY2F0ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhcHJlZGljYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGlzIHRoZSBjb21wb3NpdGlvbiBvZiBhIGxpc3Qgb2YgZnVuY3Rpb25zLCBlYWNoXG4gIC8vIGNvbnN1bWluZyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmdW5jdGlvbiB0aGF0IGZvbGxvd3MuXG4gIGZ1bmN0aW9uIGNvbXBvc2UoKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgdmFyIHN0YXJ0ID0gYXJncy5sZW5ndGggLSAxO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpID0gc3RhcnQ7XG4gICAgICB2YXIgcmVzdWx0ID0gYXJnc1tzdGFydF0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHdoaWxlIChpLS0pIHJlc3VsdCA9IGFyZ3NbaV0uY2FsbCh0aGlzLCByZXN1bHQpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIG9uIGFuZCBhZnRlciB0aGUgTnRoIGNhbGwuXG4gIGZ1bmN0aW9uIGFmdGVyKHRpbWVzLCBmdW5jKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKC0tdGltZXMgPCAxKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgb25seSBiZSBleGVjdXRlZCB1cCB0byAoYnV0IG5vdCBpbmNsdWRpbmcpIHRoZVxuICAvLyBOdGggY2FsbC5cbiAgZnVuY3Rpb24gYmVmb3JlKHRpbWVzLCBmdW5jKSB7XG4gICAgdmFyIG1lbW87XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKC0tdGltZXMgPiAwKSB7XG4gICAgICAgIG1lbW8gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICBpZiAodGltZXMgPD0gMSkgZnVuYyA9IG51bGw7XG4gICAgICByZXR1cm4gbWVtbztcbiAgICB9O1xuICB9XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBleGVjdXRlZCBhdCBtb3N0IG9uZSB0aW1lLCBubyBtYXR0ZXIgaG93XG4gIC8vIG9mdGVuIHlvdSBjYWxsIGl0LiBVc2VmdWwgZm9yIGxhenkgaW5pdGlhbGl6YXRpb24uXG4gIHZhciBvbmNlID0gcGFydGlhbChiZWZvcmUsIDIpO1xuXG4gIC8vIFJldHVybnMgdGhlIGZpcnN0IGtleSBvbiBhbiBvYmplY3QgdGhhdCBwYXNzZXMgYSB0cnV0aCB0ZXN0LlxuICBmdW5jdGlvbiBmaW5kS2V5KG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIgX2tleXMgPSBrZXlzKG9iaiksIGtleTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gX2tleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGtleSA9IF9rZXlzW2ldO1xuICAgICAgaWYgKHByZWRpY2F0ZShvYmpba2V5XSwga2V5LCBvYmopKSByZXR1cm4ga2V5O1xuICAgIH1cbiAgfVxuXG4gIC8vIEludGVybmFsIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGBfLmZpbmRJbmRleGAgYW5kIGBfLmZpbmRMYXN0SW5kZXhgLlxuICBmdW5jdGlvbiBjcmVhdGVQcmVkaWNhdGVJbmRleEZpbmRlcihkaXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oYXJyYXksIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICAgIHZhciBsZW5ndGggPSBnZXRMZW5ndGgoYXJyYXkpO1xuICAgICAgdmFyIGluZGV4ID0gZGlyID4gMCA/IDAgOiBsZW5ndGggLSAxO1xuICAgICAgZm9yICg7IGluZGV4ID49IDAgJiYgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IGRpcikge1xuICAgICAgICBpZiAocHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkgcmV0dXJuIGluZGV4O1xuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBpbmRleCBvbiBhbiBhcnJheS1saWtlIHRoYXQgcGFzc2VzIGEgdHJ1dGggdGVzdC5cbiAgdmFyIGZpbmRJbmRleCA9IGNyZWF0ZVByZWRpY2F0ZUluZGV4RmluZGVyKDEpO1xuXG4gIC8vIFJldHVybnMgdGhlIGxhc3QgaW5kZXggb24gYW4gYXJyYXktbGlrZSB0aGF0IHBhc3NlcyBhIHRydXRoIHRlc3QuXG4gIHZhciBmaW5kTGFzdEluZGV4ID0gY3JlYXRlUHJlZGljYXRlSW5kZXhGaW5kZXIoLTEpO1xuXG4gIC8vIFVzZSBhIGNvbXBhcmF0b3IgZnVuY3Rpb24gdG8gZmlndXJlIG91dCB0aGUgc21hbGxlc3QgaW5kZXggYXQgd2hpY2hcbiAgLy8gYW4gb2JqZWN0IHNob3VsZCBiZSBpbnNlcnRlZCBzbyBhcyB0byBtYWludGFpbiBvcmRlci4gVXNlcyBiaW5hcnkgc2VhcmNoLlxuICBmdW5jdGlvbiBzb3J0ZWRJbmRleChhcnJheSwgb2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQsIDEpO1xuICAgIHZhciB2YWx1ZSA9IGl0ZXJhdGVlKG9iaik7XG4gICAgdmFyIGxvdyA9IDAsIGhpZ2ggPSBnZXRMZW5ndGgoYXJyYXkpO1xuICAgIHdoaWxlIChsb3cgPCBoaWdoKSB7XG4gICAgICB2YXIgbWlkID0gTWF0aC5mbG9vcigobG93ICsgaGlnaCkgLyAyKTtcbiAgICAgIGlmIChpdGVyYXRlZShhcnJheVttaWRdKSA8IHZhbHVlKSBsb3cgPSBtaWQgKyAxOyBlbHNlIGhpZ2ggPSBtaWQ7XG4gICAgfVxuICAgIHJldHVybiBsb3c7XG4gIH1cblxuICAvLyBJbnRlcm5hbCBmdW5jdGlvbiB0byBnZW5lcmF0ZSB0aGUgYF8uaW5kZXhPZmAgYW5kIGBfLmxhc3RJbmRleE9mYCBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIGNyZWF0ZUluZGV4RmluZGVyKGRpciwgcHJlZGljYXRlRmluZCwgc29ydGVkSW5kZXgpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oYXJyYXksIGl0ZW0sIGlkeCkge1xuICAgICAgdmFyIGkgPSAwLCBsZW5ndGggPSBnZXRMZW5ndGgoYXJyYXkpO1xuICAgICAgaWYgKHR5cGVvZiBpZHggPT0gJ251bWJlcicpIHtcbiAgICAgICAgaWYgKGRpciA+IDApIHtcbiAgICAgICAgICBpID0gaWR4ID49IDAgPyBpZHggOiBNYXRoLm1heChpZHggKyBsZW5ndGgsIGkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxlbmd0aCA9IGlkeCA+PSAwID8gTWF0aC5taW4oaWR4ICsgMSwgbGVuZ3RoKSA6IGlkeCArIGxlbmd0aCArIDE7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoc29ydGVkSW5kZXggJiYgaWR4ICYmIGxlbmd0aCkge1xuICAgICAgICBpZHggPSBzb3J0ZWRJbmRleChhcnJheSwgaXRlbSk7XG4gICAgICAgIHJldHVybiBhcnJheVtpZHhdID09PSBpdGVtID8gaWR4IDogLTE7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbSAhPT0gaXRlbSkge1xuICAgICAgICBpZHggPSBwcmVkaWNhdGVGaW5kKHNsaWNlLmNhbGwoYXJyYXksIGksIGxlbmd0aCksIGlzTmFOJDEpO1xuICAgICAgICByZXR1cm4gaWR4ID49IDAgPyBpZHggKyBpIDogLTE7XG4gICAgICB9XG4gICAgICBmb3IgKGlkeCA9IGRpciA+IDAgPyBpIDogbGVuZ3RoIC0gMTsgaWR4ID49IDAgJiYgaWR4IDwgbGVuZ3RoOyBpZHggKz0gZGlyKSB7XG4gICAgICAgIGlmIChhcnJheVtpZHhdID09PSBpdGVtKSByZXR1cm4gaWR4O1xuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG4gIH1cblxuICAvLyBSZXR1cm4gdGhlIHBvc2l0aW9uIG9mIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIGFuIGl0ZW0gaW4gYW4gYXJyYXksXG4gIC8vIG9yIC0xIGlmIHRoZSBpdGVtIGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgYXJyYXkuXG4gIC8vIElmIHRoZSBhcnJheSBpcyBsYXJnZSBhbmQgYWxyZWFkeSBpbiBzb3J0IG9yZGVyLCBwYXNzIGB0cnVlYFxuICAvLyBmb3IgKippc1NvcnRlZCoqIHRvIHVzZSBiaW5hcnkgc2VhcmNoLlxuICB2YXIgaW5kZXhPZiA9IGNyZWF0ZUluZGV4RmluZGVyKDEsIGZpbmRJbmRleCwgc29ydGVkSW5kZXgpO1xuXG4gIC8vIFJldHVybiB0aGUgcG9zaXRpb24gb2YgdGhlIGxhc3Qgb2NjdXJyZW5jZSBvZiBhbiBpdGVtIGluIGFuIGFycmF5LFxuICAvLyBvciAtMSBpZiB0aGUgaXRlbSBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIGFycmF5LlxuICB2YXIgbGFzdEluZGV4T2YgPSBjcmVhdGVJbmRleEZpbmRlcigtMSwgZmluZExhc3RJbmRleCk7XG5cbiAgLy8gUmV0dXJuIHRoZSBmaXJzdCB2YWx1ZSB3aGljaCBwYXNzZXMgYSB0cnV0aCB0ZXN0LlxuICBmdW5jdGlvbiBmaW5kKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIGtleUZpbmRlciA9IGlzQXJyYXlMaWtlKG9iaikgPyBmaW5kSW5kZXggOiBmaW5kS2V5O1xuICAgIHZhciBrZXkgPSBrZXlGaW5kZXIob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIGlmIChrZXkgIT09IHZvaWQgMCAmJiBrZXkgIT09IC0xKSByZXR1cm4gb2JqW2tleV07XG4gIH1cblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBfLmZpbmRgOiBnZXR0aW5nIHRoZSBmaXJzdFxuICAvLyBvYmplY3QgY29udGFpbmluZyBzcGVjaWZpYyBga2V5OnZhbHVlYCBwYWlycy5cbiAgZnVuY3Rpb24gZmluZFdoZXJlKG9iaiwgYXR0cnMpIHtcbiAgICByZXR1cm4gZmluZChvYmosIG1hdGNoZXIoYXR0cnMpKTtcbiAgfVxuXG4gIC8vIFRoZSBjb3JuZXJzdG9uZSBmb3IgY29sbGVjdGlvbiBmdW5jdGlvbnMsIGFuIGBlYWNoYFxuICAvLyBpbXBsZW1lbnRhdGlvbiwgYWthIGBmb3JFYWNoYC5cbiAgLy8gSGFuZGxlcyByYXcgb2JqZWN0cyBpbiBhZGRpdGlvbiB0byBhcnJheS1saWtlcy4gVHJlYXRzIGFsbFxuICAvLyBzcGFyc2UgYXJyYXktbGlrZXMgYXMgaWYgdGhleSB3ZXJlIGRlbnNlLlxuICBmdW5jdGlvbiBlYWNoKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IG9wdGltaXplQ2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciBpLCBsZW5ndGg7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iaikpIHtcbiAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVyYXRlZShvYmpbaV0sIGksIG9iaik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBfa2V5cyA9IGtleXMob2JqKTtcbiAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IF9rZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZXJhdGVlKG9ialtfa2V5c1tpXV0sIF9rZXlzW2ldLCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgLy8gUmV0dXJuIHRoZSByZXN1bHRzIG9mIGFwcGx5aW5nIHRoZSBpdGVyYXRlZSB0byBlYWNoIGVsZW1lbnQuXG4gIGZ1bmN0aW9uIG1hcChvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIF9rZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYga2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSAoX2tleXMgfHwgb2JqKS5sZW5ndGgsXG4gICAgICAgIHJlc3VsdHMgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBjdXJyZW50S2V5ID0gX2tleXMgPyBfa2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgIHJlc3VsdHNbaW5kZXhdID0gaXRlcmF0ZWUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIC8vIEludGVybmFsIGhlbHBlciB0byBjcmVhdGUgYSByZWR1Y2luZyBmdW5jdGlvbiwgaXRlcmF0aW5nIGxlZnQgb3IgcmlnaHQuXG4gIGZ1bmN0aW9uIGNyZWF0ZVJlZHVjZShkaXIpIHtcbiAgICAvLyBXcmFwIGNvZGUgdGhhdCByZWFzc2lnbnMgYXJndW1lbnQgdmFyaWFibGVzIGluIGEgc2VwYXJhdGUgZnVuY3Rpb24gdGhhblxuICAgIC8vIHRoZSBvbmUgdGhhdCBhY2Nlc3NlcyBgYXJndW1lbnRzLmxlbmd0aGAgdG8gYXZvaWQgYSBwZXJmIGhpdC4gKCMxOTkxKVxuICAgIHZhciByZWR1Y2VyID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgbWVtbywgaW5pdGlhbCkge1xuICAgICAgdmFyIF9rZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYga2V5cyhvYmopLFxuICAgICAgICAgIGxlbmd0aCA9IChfa2V5cyB8fCBvYmopLmxlbmd0aCxcbiAgICAgICAgICBpbmRleCA9IGRpciA+IDAgPyAwIDogbGVuZ3RoIC0gMTtcbiAgICAgIGlmICghaW5pdGlhbCkge1xuICAgICAgICBtZW1vID0gb2JqW19rZXlzID8gX2tleXNbaW5kZXhdIDogaW5kZXhdO1xuICAgICAgICBpbmRleCArPSBkaXI7XG4gICAgICB9XG4gICAgICBmb3IgKDsgaW5kZXggPj0gMCAmJiBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gZGlyKSB7XG4gICAgICAgIHZhciBjdXJyZW50S2V5ID0gX2tleXMgPyBfa2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgICAgbWVtbyA9IGl0ZXJhdGVlKG1lbW8sIG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH07XG5cbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgbWVtbywgY29udGV4dCkge1xuICAgICAgdmFyIGluaXRpYWwgPSBhcmd1bWVudHMubGVuZ3RoID49IDM7XG4gICAgICByZXR1cm4gcmVkdWNlcihvYmosIG9wdGltaXplQ2IoaXRlcmF0ZWUsIGNvbnRleHQsIDQpLCBtZW1vLCBpbml0aWFsKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gKipSZWR1Y2UqKiBidWlsZHMgdXAgYSBzaW5nbGUgcmVzdWx0IGZyb20gYSBsaXN0IG9mIHZhbHVlcywgYWthIGBpbmplY3RgLFxuICAvLyBvciBgZm9sZGxgLlxuICB2YXIgcmVkdWNlID0gY3JlYXRlUmVkdWNlKDEpO1xuXG4gIC8vIFRoZSByaWdodC1hc3NvY2lhdGl2ZSB2ZXJzaW9uIG9mIHJlZHVjZSwgYWxzbyBrbm93biBhcyBgZm9sZHJgLlxuICB2YXIgcmVkdWNlUmlnaHQgPSBjcmVhdGVSZWR1Y2UoLTEpO1xuXG4gIC8vIFJldHVybiBhbGwgdGhlIGVsZW1lbnRzIHRoYXQgcGFzcyBhIHRydXRoIHRlc3QuXG4gIGZ1bmN0aW9uIGZpbHRlcihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBpbmRleCwgbGlzdCkpIHJlc3VsdHMucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICAvLyBSZXR1cm4gYWxsIHRoZSBlbGVtZW50cyBmb3Igd2hpY2ggYSB0cnV0aCB0ZXN0IGZhaWxzLlxuICBmdW5jdGlvbiByZWplY3Qob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gZmlsdGVyKG9iaiwgbmVnYXRlKGNiKHByZWRpY2F0ZSkpLCBjb250ZXh0KTtcbiAgfVxuXG4gIC8vIERldGVybWluZSB3aGV0aGVyIGFsbCBvZiB0aGUgZWxlbWVudHMgcGFzcyBhIHRydXRoIHRlc3QuXG4gIGZ1bmN0aW9uIGV2ZXJ5KG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIgX2tleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBrZXlzKG9iaiksXG4gICAgICAgIGxlbmd0aCA9IChfa2V5cyB8fCBvYmopLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgY3VycmVudEtleSA9IF9rZXlzID8gX2tleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICBpZiAoIXByZWRpY2F0ZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaikpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBEZXRlcm1pbmUgaWYgYXQgbGVhc3Qgb25lIGVsZW1lbnQgaW4gdGhlIG9iamVjdCBwYXNzZXMgYSB0cnV0aCB0ZXN0LlxuICBmdW5jdGlvbiBzb21lKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIgX2tleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBrZXlzKG9iaiksXG4gICAgICAgIGxlbmd0aCA9IChfa2V5cyB8fCBvYmopLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgY3VycmVudEtleSA9IF9rZXlzID8gX2tleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICBpZiAocHJlZGljYXRlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKSkgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIERldGVybWluZSBpZiB0aGUgYXJyYXkgb3Igb2JqZWN0IGNvbnRhaW5zIGEgZ2l2ZW4gaXRlbSAodXNpbmcgYD09PWApLlxuICBmdW5jdGlvbiBjb250YWlucyhvYmosIGl0ZW0sIGZyb21JbmRleCwgZ3VhcmQpIHtcbiAgICBpZiAoIWlzQXJyYXlMaWtlKG9iaikpIG9iaiA9IHZhbHVlcyhvYmopO1xuICAgIGlmICh0eXBlb2YgZnJvbUluZGV4ICE9ICdudW1iZXInIHx8IGd1YXJkKSBmcm9tSW5kZXggPSAwO1xuICAgIHJldHVybiBpbmRleE9mKG9iaiwgaXRlbSwgZnJvbUluZGV4KSA+PSAwO1xuICB9XG5cbiAgLy8gSW52b2tlIGEgbWV0aG9kICh3aXRoIGFyZ3VtZW50cykgb24gZXZlcnkgaXRlbSBpbiBhIGNvbGxlY3Rpb24uXG4gIHZhciBpbnZva2UgPSByZXN0QXJndW1lbnRzKGZ1bmN0aW9uKG9iaiwgcGF0aCwgYXJncykge1xuICAgIHZhciBjb250ZXh0UGF0aCwgZnVuYztcbiAgICBpZiAoaXNGdW5jdGlvbiQxKHBhdGgpKSB7XG4gICAgICBmdW5jID0gcGF0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgcGF0aCA9IHRvUGF0aChwYXRoKTtcbiAgICAgIGNvbnRleHRQYXRoID0gcGF0aC5zbGljZSgwLCAtMSk7XG4gICAgICBwYXRoID0gcGF0aFtwYXRoLmxlbmd0aCAtIDFdO1xuICAgIH1cbiAgICByZXR1cm4gbWFwKG9iaiwgZnVuY3Rpb24oY29udGV4dCkge1xuICAgICAgdmFyIG1ldGhvZCA9IGZ1bmM7XG4gICAgICBpZiAoIW1ldGhvZCkge1xuICAgICAgICBpZiAoY29udGV4dFBhdGggJiYgY29udGV4dFBhdGgubGVuZ3RoKSB7XG4gICAgICAgICAgY29udGV4dCA9IGRlZXBHZXQoY29udGV4dCwgY29udGV4dFBhdGgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb250ZXh0ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgICAgIG1ldGhvZCA9IGNvbnRleHRbcGF0aF07XG4gICAgICB9XG4gICAgICByZXR1cm4gbWV0aG9kID09IG51bGwgPyBtZXRob2QgOiBtZXRob2QuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYF8ubWFwYDogZmV0Y2hpbmcgYSBwcm9wZXJ0eS5cbiAgZnVuY3Rpb24gcGx1Y2sob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gbWFwKG9iaiwgcHJvcGVydHkoa2V5KSk7XG4gIH1cblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBfLmZpbHRlcmA6IHNlbGVjdGluZyBvbmx5XG4gIC8vIG9iamVjdHMgY29udGFpbmluZyBzcGVjaWZpYyBga2V5OnZhbHVlYCBwYWlycy5cbiAgZnVuY3Rpb24gd2hlcmUob2JqLCBhdHRycykge1xuICAgIHJldHVybiBmaWx0ZXIob2JqLCBtYXRjaGVyKGF0dHJzKSk7XG4gIH1cblxuICAvLyBSZXR1cm4gdGhlIG1heGltdW0gZWxlbWVudCAob3IgZWxlbWVudC1iYXNlZCBjb21wdXRhdGlvbikuXG4gIGZ1bmN0aW9uIG1heChvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IC1JbmZpbml0eSwgbGFzdENvbXB1dGVkID0gLUluZmluaXR5LFxuICAgICAgICB2YWx1ZSwgY29tcHV0ZWQ7XG4gICAgaWYgKGl0ZXJhdGVlID09IG51bGwgfHwgdHlwZW9mIGl0ZXJhdGVlID09ICdudW1iZXInICYmIHR5cGVvZiBvYmpbMF0gIT0gJ29iamVjdCcgJiYgb2JqICE9IG51bGwpIHtcbiAgICAgIG9iaiA9IGlzQXJyYXlMaWtlKG9iaikgPyBvYmogOiB2YWx1ZXMob2JqKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBvYmoubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFsdWUgPSBvYmpbaV07XG4gICAgICAgIGlmICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlID4gcmVzdWx0KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgICBlYWNoKG9iaiwgZnVuY3Rpb24odiwgaW5kZXgsIGxpc3QpIHtcbiAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSh2LCBpbmRleCwgbGlzdCk7XG4gICAgICAgIGlmIChjb21wdXRlZCA+IGxhc3RDb21wdXRlZCB8fCBjb21wdXRlZCA9PT0gLUluZmluaXR5ICYmIHJlc3VsdCA9PT0gLUluZmluaXR5KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdjtcbiAgICAgICAgICBsYXN0Q29tcHV0ZWQgPSBjb21wdXRlZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBSZXR1cm4gdGhlIG1pbmltdW0gZWxlbWVudCAob3IgZWxlbWVudC1iYXNlZCBjb21wdXRhdGlvbikuXG4gIGZ1bmN0aW9uIG1pbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IEluZmluaXR5LCBsYXN0Q29tcHV0ZWQgPSBJbmZpbml0eSxcbiAgICAgICAgdmFsdWUsIGNvbXB1dGVkO1xuICAgIGlmIChpdGVyYXRlZSA9PSBudWxsIHx8IHR5cGVvZiBpdGVyYXRlZSA9PSAnbnVtYmVyJyAmJiB0eXBlb2Ygb2JqWzBdICE9ICdvYmplY3QnICYmIG9iaiAhPSBudWxsKSB7XG4gICAgICBvYmogPSBpc0FycmF5TGlrZShvYmopID8gb2JqIDogdmFsdWVzKG9iaik7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhbHVlID0gb2JqW2ldO1xuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSA8IHJlc3VsdCkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgICAgZWFjaChvYmosIGZ1bmN0aW9uKHYsIGluZGV4LCBsaXN0KSB7XG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUodiwgaW5kZXgsIGxpc3QpO1xuICAgICAgICBpZiAoY29tcHV0ZWQgPCBsYXN0Q29tcHV0ZWQgfHwgY29tcHV0ZWQgPT09IEluZmluaXR5ICYmIHJlc3VsdCA9PT0gSW5maW5pdHkpIHtcbiAgICAgICAgICByZXN1bHQgPSB2O1xuICAgICAgICAgIGxhc3RDb21wdXRlZCA9IGNvbXB1dGVkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vIFNhZmVseSBjcmVhdGUgYSByZWFsLCBsaXZlIGFycmF5IGZyb20gYW55dGhpbmcgaXRlcmFibGUuXG4gIHZhciByZVN0clN5bWJvbCA9IC9bXlxcdWQ4MDAtXFx1ZGZmZl18W1xcdWQ4MDAtXFx1ZGJmZl1bXFx1ZGMwMC1cXHVkZmZmXXxbXFx1ZDgwMC1cXHVkZmZmXS9nO1xuICBmdW5jdGlvbiB0b0FycmF5KG9iaikge1xuICAgIGlmICghb2JqKSByZXR1cm4gW107XG4gICAgaWYgKGlzQXJyYXkob2JqKSkgcmV0dXJuIHNsaWNlLmNhbGwob2JqKTtcbiAgICBpZiAoaXNTdHJpbmcob2JqKSkge1xuICAgICAgLy8gS2VlcCBzdXJyb2dhdGUgcGFpciBjaGFyYWN0ZXJzIHRvZ2V0aGVyLlxuICAgICAgcmV0dXJuIG9iai5tYXRjaChyZVN0clN5bWJvbCk7XG4gICAgfVxuICAgIGlmIChpc0FycmF5TGlrZShvYmopKSByZXR1cm4gbWFwKG9iaiwgaWRlbnRpdHkpO1xuICAgIHJldHVybiB2YWx1ZXMob2JqKTtcbiAgfVxuXG4gIC8vIFNhbXBsZSAqKm4qKiByYW5kb20gdmFsdWVzIGZyb20gYSBjb2xsZWN0aW9uIHVzaW5nIHRoZSBtb2Rlcm4gdmVyc2lvbiBvZiB0aGVcbiAgLy8gW0Zpc2hlci1ZYXRlcyBzaHVmZmxlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9GaXNoZXLigJNZYXRlc19zaHVmZmxlKS5cbiAgLy8gSWYgKipuKiogaXMgbm90IHNwZWNpZmllZCwgcmV0dXJucyBhIHNpbmdsZSByYW5kb20gZWxlbWVudC5cbiAgLy8gVGhlIGludGVybmFsIGBndWFyZGAgYXJndW1lbnQgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgXy5tYXBgLlxuICBmdW5jdGlvbiBzYW1wbGUob2JqLCBuLCBndWFyZCkge1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHtcbiAgICAgIGlmICghaXNBcnJheUxpa2Uob2JqKSkgb2JqID0gdmFsdWVzKG9iaik7XG4gICAgICByZXR1cm4gb2JqW3JhbmRvbShvYmoubGVuZ3RoIC0gMSldO1xuICAgIH1cbiAgICB2YXIgc2FtcGxlID0gdG9BcnJheShvYmopO1xuICAgIHZhciBsZW5ndGggPSBnZXRMZW5ndGgoc2FtcGxlKTtcbiAgICBuID0gTWF0aC5tYXgoTWF0aC5taW4obiwgbGVuZ3RoKSwgMCk7XG4gICAgdmFyIGxhc3QgPSBsZW5ndGggLSAxO1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBuOyBpbmRleCsrKSB7XG4gICAgICB2YXIgcmFuZCA9IHJhbmRvbShpbmRleCwgbGFzdCk7XG4gICAgICB2YXIgdGVtcCA9IHNhbXBsZVtpbmRleF07XG4gICAgICBzYW1wbGVbaW5kZXhdID0gc2FtcGxlW3JhbmRdO1xuICAgICAgc2FtcGxlW3JhbmRdID0gdGVtcDtcbiAgICB9XG4gICAgcmV0dXJuIHNhbXBsZS5zbGljZSgwLCBuKTtcbiAgfVxuXG4gIC8vIFNodWZmbGUgYSBjb2xsZWN0aW9uLlxuICBmdW5jdGlvbiBzaHVmZmxlKG9iaikge1xuICAgIHJldHVybiBzYW1wbGUob2JqLCBJbmZpbml0eSk7XG4gIH1cblxuICAvLyBTb3J0IHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24gcHJvZHVjZWQgYnkgYW4gaXRlcmF0ZWUuXG4gIGZ1bmN0aW9uIHNvcnRCeShvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICByZXR1cm4gcGx1Y2sobWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGtleSwgbGlzdCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBpbmRleDogaW5kZXgrKyxcbiAgICAgICAgY3JpdGVyaWE6IGl0ZXJhdGVlKHZhbHVlLCBrZXksIGxpc3QpXG4gICAgICB9O1xuICAgIH0pLnNvcnQoZnVuY3Rpb24obGVmdCwgcmlnaHQpIHtcbiAgICAgIHZhciBhID0gbGVmdC5jcml0ZXJpYTtcbiAgICAgIHZhciBiID0gcmlnaHQuY3JpdGVyaWE7XG4gICAgICBpZiAoYSAhPT0gYikge1xuICAgICAgICBpZiAoYSA+IGIgfHwgYSA9PT0gdm9pZCAwKSByZXR1cm4gMTtcbiAgICAgICAgaWYgKGEgPCBiIHx8IGIgPT09IHZvaWQgMCkgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxlZnQuaW5kZXggLSByaWdodC5pbmRleDtcbiAgICB9KSwgJ3ZhbHVlJyk7XG4gIH1cblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiB1c2VkIGZvciBhZ2dyZWdhdGUgXCJncm91cCBieVwiIG9wZXJhdGlvbnMuXG4gIGZ1bmN0aW9uIGdyb3VwKGJlaGF2aW9yLCBwYXJ0aXRpb24pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgICAgdmFyIHJlc3VsdCA9IHBhcnRpdGlvbiA/IFtbXSwgW11dIDoge307XG4gICAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgdmFyIGtleSA9IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgb2JqKTtcbiAgICAgICAgYmVoYXZpb3IocmVzdWx0LCB2YWx1ZSwga2V5KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9XG5cbiAgLy8gR3JvdXBzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24uIFBhc3MgZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZVxuICAvLyB0byBncm91cCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGNyaXRlcmlvbi5cbiAgdmFyIGdyb3VwQnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICBpZiAoaGFzJDEocmVzdWx0LCBrZXkpKSByZXN1bHRba2V5XS5wdXNoKHZhbHVlKTsgZWxzZSByZXN1bHRba2V5XSA9IFt2YWx1ZV07XG4gIH0pO1xuXG4gIC8vIEluZGV4ZXMgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiwgc2ltaWxhciB0byBgXy5ncm91cEJ5YCwgYnV0IGZvclxuICAvLyB3aGVuIHlvdSBrbm93IHRoYXQgeW91ciBpbmRleCB2YWx1ZXMgd2lsbCBiZSB1bmlxdWUuXG4gIHZhciBpbmRleEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgfSk7XG5cbiAgLy8gQ291bnRzIGluc3RhbmNlcyBvZiBhbiBvYmplY3QgdGhhdCBncm91cCBieSBhIGNlcnRhaW4gY3JpdGVyaW9uLiBQYXNzXG4gIC8vIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGUgdG8gY291bnQgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZVxuICAvLyBjcml0ZXJpb24uXG4gIHZhciBjb3VudEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgaWYgKGhhcyQxKHJlc3VsdCwga2V5KSkgcmVzdWx0W2tleV0rKzsgZWxzZSByZXN1bHRba2V5XSA9IDE7XG4gIH0pO1xuXG4gIC8vIFNwbGl0IGEgY29sbGVjdGlvbiBpbnRvIHR3byBhcnJheXM6IG9uZSB3aG9zZSBlbGVtZW50cyBhbGwgcGFzcyB0aGUgZ2l2ZW5cbiAgLy8gdHJ1dGggdGVzdCwgYW5kIG9uZSB3aG9zZSBlbGVtZW50cyBhbGwgZG8gbm90IHBhc3MgdGhlIHRydXRoIHRlc3QuXG4gIHZhciBwYXJ0aXRpb24gPSBncm91cChmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBwYXNzKSB7XG4gICAgcmVzdWx0W3Bhc3MgPyAwIDogMV0ucHVzaCh2YWx1ZSk7XG4gIH0sIHRydWUpO1xuXG4gIC8vIFJldHVybiB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIGEgY29sbGVjdGlvbi5cbiAgZnVuY3Rpb24gc2l6ZShvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiAwO1xuICAgIHJldHVybiBpc0FycmF5TGlrZShvYmopID8gb2JqLmxlbmd0aCA6IGtleXMob2JqKS5sZW5ndGg7XG4gIH1cblxuICAvLyBJbnRlcm5hbCBgXy5waWNrYCBoZWxwZXIgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIHdoZXRoZXIgYGtleWAgaXMgYW4gZW51bWVyYWJsZVxuICAvLyBwcm9wZXJ0eSBuYW1lIG9mIGBvYmpgLlxuICBmdW5jdGlvbiBrZXlJbk9iaih2YWx1ZSwga2V5LCBvYmopIHtcbiAgICByZXR1cm4ga2V5IGluIG9iajtcbiAgfVxuXG4gIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCBvbmx5IGNvbnRhaW5pbmcgdGhlIGFsbG93ZWQgcHJvcGVydGllcy5cbiAgdmFyIHBpY2sgPSByZXN0QXJndW1lbnRzKGZ1bmN0aW9uKG9iaiwga2V5cykge1xuICAgIHZhciByZXN1bHQgPSB7fSwgaXRlcmF0ZWUgPSBrZXlzWzBdO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdDtcbiAgICBpZiAoaXNGdW5jdGlvbiQxKGl0ZXJhdGVlKSkge1xuICAgICAgaWYgKGtleXMubGVuZ3RoID4gMSkgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKGl0ZXJhdGVlLCBrZXlzWzFdKTtcbiAgICAgIGtleXMgPSBhbGxLZXlzKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGl0ZXJhdGVlID0ga2V5SW5PYmo7XG4gICAgICBrZXlzID0gZmxhdHRlbiQxKGtleXMsIGZhbHNlLCBmYWxzZSk7XG4gICAgICBvYmogPSBPYmplY3Qob2JqKTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgdmFyIHZhbHVlID0gb2JqW2tleV07XG4gICAgICBpZiAoaXRlcmF0ZWUodmFsdWUsIGtleSwgb2JqKSkgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSk7XG5cbiAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IHdpdGhvdXQgdGhlIGRpc2FsbG93ZWQgcHJvcGVydGllcy5cbiAgdmFyIG9taXQgPSByZXN0QXJndW1lbnRzKGZ1bmN0aW9uKG9iaiwga2V5cykge1xuICAgIHZhciBpdGVyYXRlZSA9IGtleXNbMF0sIGNvbnRleHQ7XG4gICAgaWYgKGlzRnVuY3Rpb24kMShpdGVyYXRlZSkpIHtcbiAgICAgIGl0ZXJhdGVlID0gbmVnYXRlKGl0ZXJhdGVlKTtcbiAgICAgIGlmIChrZXlzLmxlbmd0aCA+IDEpIGNvbnRleHQgPSBrZXlzWzFdO1xuICAgIH0gZWxzZSB7XG4gICAgICBrZXlzID0gbWFwKGZsYXR0ZW4kMShrZXlzLCBmYWxzZSwgZmFsc2UpLCBTdHJpbmcpO1xuICAgICAgaXRlcmF0ZWUgPSBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIHJldHVybiAhY29udGFpbnMoa2V5cywga2V5KTtcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBwaWNrKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpO1xuICB9KTtcblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBsYXN0IGVudHJ5IG9mIHRoZSBhcnJheS4gRXNwZWNpYWxseSB1c2VmdWwgb25cbiAgLy8gdGhlIGFyZ3VtZW50cyBvYmplY3QuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gYWxsIHRoZSB2YWx1ZXMgaW5cbiAgLy8gdGhlIGFycmF5LCBleGNsdWRpbmcgdGhlIGxhc3QgTi5cbiAgZnVuY3Rpb24gaW5pdGlhbChhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgMCwgTWF0aC5tYXgoMCwgYXJyYXkubGVuZ3RoIC0gKG4gPT0gbnVsbCB8fCBndWFyZCA/IDEgOiBuKSkpO1xuICB9XG5cbiAgLy8gR2V0IHRoZSBmaXJzdCBlbGVtZW50IG9mIGFuIGFycmF5LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIHRoZSBmaXJzdCBOXG4gIC8vIHZhbHVlcyBpbiB0aGUgYXJyYXkuIFRoZSAqKmd1YXJkKiogY2hlY2sgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgXy5tYXBgLlxuICBmdW5jdGlvbiBmaXJzdChhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCB8fCBhcnJheS5sZW5ndGggPCAxKSByZXR1cm4gbiA9PSBudWxsIHx8IGd1YXJkID8gdm9pZCAwIDogW107XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkgcmV0dXJuIGFycmF5WzBdO1xuICAgIHJldHVybiBpbml0aWFsKGFycmF5LCBhcnJheS5sZW5ndGggLSBuKTtcbiAgfVxuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGZpcnN0IGVudHJ5IG9mIHRoZSBgYXJyYXlgLiBFc3BlY2lhbGx5IHVzZWZ1bCBvblxuICAvLyB0aGUgYGFyZ3VtZW50c2Agb2JqZWN0LiBQYXNzaW5nIGFuICoqbioqIHdpbGwgcmV0dXJuIHRoZSByZXN0IE4gdmFsdWVzIGluIHRoZVxuICAvLyBgYXJyYXlgLlxuICBmdW5jdGlvbiByZXN0KGFycmF5LCBuLCBndWFyZCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCBuID09IG51bGwgfHwgZ3VhcmQgPyAxIDogbik7XG4gIH1cblxuICAvLyBHZXQgdGhlIGxhc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgbGFzdCBOXG4gIC8vIHZhbHVlcyBpbiB0aGUgYXJyYXkuXG4gIGZ1bmN0aW9uIGxhc3QoYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwgfHwgYXJyYXkubGVuZ3RoIDwgMSkgcmV0dXJuIG4gPT0gbnVsbCB8fCBndWFyZCA/IHZvaWQgMCA6IFtdO1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHJldHVybiBhcnJheVthcnJheS5sZW5ndGggLSAxXTtcbiAgICByZXR1cm4gcmVzdChhcnJheSwgTWF0aC5tYXgoMCwgYXJyYXkubGVuZ3RoIC0gbikpO1xuICB9XG5cbiAgLy8gVHJpbSBvdXQgYWxsIGZhbHN5IHZhbHVlcyBmcm9tIGFuIGFycmF5LlxuICBmdW5jdGlvbiBjb21wYWN0KGFycmF5KSB7XG4gICAgcmV0dXJuIGZpbHRlcihhcnJheSwgQm9vbGVhbik7XG4gIH1cblxuICAvLyBGbGF0dGVuIG91dCBhbiBhcnJheSwgZWl0aGVyIHJlY3Vyc2l2ZWx5IChieSBkZWZhdWx0KSwgb3IgdXAgdG8gYGRlcHRoYC5cbiAgLy8gUGFzc2luZyBgdHJ1ZWAgb3IgYGZhbHNlYCBhcyBgZGVwdGhgIG1lYW5zIGAxYCBvciBgSW5maW5pdHlgLCByZXNwZWN0aXZlbHkuXG4gIGZ1bmN0aW9uIGZsYXR0ZW4oYXJyYXksIGRlcHRoKSB7XG4gICAgcmV0dXJuIGZsYXR0ZW4kMShhcnJheSwgZGVwdGgsIGZhbHNlKTtcbiAgfVxuXG4gIC8vIFRha2UgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiBvbmUgYXJyYXkgYW5kIGEgbnVtYmVyIG9mIG90aGVyIGFycmF5cy5cbiAgLy8gT25seSB0aGUgZWxlbWVudHMgcHJlc2VudCBpbiBqdXN0IHRoZSBmaXJzdCBhcnJheSB3aWxsIHJlbWFpbi5cbiAgdmFyIGRpZmZlcmVuY2UgPSByZXN0QXJndW1lbnRzKGZ1bmN0aW9uKGFycmF5LCByZXN0KSB7XG4gICAgcmVzdCA9IGZsYXR0ZW4kMShyZXN0LCB0cnVlLCB0cnVlKTtcbiAgICByZXR1cm4gZmlsdGVyKGFycmF5LCBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICByZXR1cm4gIWNvbnRhaW5zKHJlc3QsIHZhbHVlKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gUmV0dXJuIGEgdmVyc2lvbiBvZiB0aGUgYXJyYXkgdGhhdCBkb2VzIG5vdCBjb250YWluIHRoZSBzcGVjaWZpZWQgdmFsdWUocykuXG4gIHZhciB3aXRob3V0ID0gcmVzdEFyZ3VtZW50cyhmdW5jdGlvbihhcnJheSwgb3RoZXJBcnJheXMpIHtcbiAgICByZXR1cm4gZGlmZmVyZW5jZShhcnJheSwgb3RoZXJBcnJheXMpO1xuICB9KTtcblxuICAvLyBQcm9kdWNlIGEgZHVwbGljYXRlLWZyZWUgdmVyc2lvbiBvZiB0aGUgYXJyYXkuIElmIHRoZSBhcnJheSBoYXMgYWxyZWFkeVxuICAvLyBiZWVuIHNvcnRlZCwgeW91IGhhdmUgdGhlIG9wdGlvbiBvZiB1c2luZyBhIGZhc3RlciBhbGdvcml0aG0uXG4gIC8vIFRoZSBmYXN0ZXIgYWxnb3JpdGhtIHdpbGwgbm90IHdvcmsgd2l0aCBhbiBpdGVyYXRlZSBpZiB0aGUgaXRlcmF0ZWVcbiAgLy8gaXMgbm90IGEgb25lLXRvLW9uZSBmdW5jdGlvbiwgc28gcHJvdmlkaW5nIGFuIGl0ZXJhdGVlIHdpbGwgZGlzYWJsZVxuICAvLyB0aGUgZmFzdGVyIGFsZ29yaXRobS5cbiAgZnVuY3Rpb24gdW5pcShhcnJheSwgaXNTb3J0ZWQsIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaWYgKCFpc0Jvb2xlYW4oaXNTb3J0ZWQpKSB7XG4gICAgICBjb250ZXh0ID0gaXRlcmF0ZWU7XG4gICAgICBpdGVyYXRlZSA9IGlzU29ydGVkO1xuICAgICAgaXNTb3J0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGl0ZXJhdGVlICE9IG51bGwpIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgc2VlbiA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBnZXRMZW5ndGgoYXJyYXkpOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB2YWx1ZSA9IGFycmF5W2ldLFxuICAgICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUgPyBpdGVyYXRlZSh2YWx1ZSwgaSwgYXJyYXkpIDogdmFsdWU7XG4gICAgICBpZiAoaXNTb3J0ZWQgJiYgIWl0ZXJhdGVlKSB7XG4gICAgICAgIGlmICghaSB8fCBzZWVuICE9PSBjb21wdXRlZCkgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICBzZWVuID0gY29tcHV0ZWQ7XG4gICAgICB9IGVsc2UgaWYgKGl0ZXJhdGVlKSB7XG4gICAgICAgIGlmICghY29udGFpbnMoc2VlbiwgY29tcHV0ZWQpKSB7XG4gICAgICAgICAgc2Vlbi5wdXNoKGNvbXB1dGVkKTtcbiAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIWNvbnRhaW5zKHJlc3VsdCwgdmFsdWUpKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vIFByb2R1Y2UgYW4gYXJyYXkgdGhhdCBjb250YWlucyB0aGUgdW5pb246IGVhY2ggZGlzdGluY3QgZWxlbWVudCBmcm9tIGFsbCBvZlxuICAvLyB0aGUgcGFzc2VkLWluIGFycmF5cy5cbiAgdmFyIHVuaW9uID0gcmVzdEFyZ3VtZW50cyhmdW5jdGlvbihhcnJheXMpIHtcbiAgICByZXR1cm4gdW5pcShmbGF0dGVuJDEoYXJyYXlzLCB0cnVlLCB0cnVlKSk7XG4gIH0pO1xuXG4gIC8vIFByb2R1Y2UgYW4gYXJyYXkgdGhhdCBjb250YWlucyBldmVyeSBpdGVtIHNoYXJlZCBiZXR3ZWVuIGFsbCB0aGVcbiAgLy8gcGFzc2VkLWluIGFycmF5cy5cbiAgZnVuY3Rpb24gaW50ZXJzZWN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBhcmdzTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaXRlbSA9IGFycmF5W2ldO1xuICAgICAgaWYgKGNvbnRhaW5zKHJlc3VsdCwgaXRlbSkpIGNvbnRpbnVlO1xuICAgICAgdmFyIGo7XG4gICAgICBmb3IgKGogPSAxOyBqIDwgYXJnc0xlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmICghY29udGFpbnMoYXJndW1lbnRzW2pdLCBpdGVtKSkgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAoaiA9PT0gYXJnc0xlbmd0aCkgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBDb21wbGVtZW50IG9mIHppcC4gVW56aXAgYWNjZXB0cyBhbiBhcnJheSBvZiBhcnJheXMgYW5kIGdyb3Vwc1xuICAvLyBlYWNoIGFycmF5J3MgZWxlbWVudHMgb24gc2hhcmVkIGluZGljZXMuXG4gIGZ1bmN0aW9uIHVuemlwKGFycmF5KSB7XG4gICAgdmFyIGxlbmd0aCA9IGFycmF5ICYmIG1heChhcnJheSwgZ2V0TGVuZ3RoKS5sZW5ndGggfHwgMDtcbiAgICB2YXIgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHJlc3VsdFtpbmRleF0gPSBwbHVjayhhcnJheSwgaW5kZXgpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy8gWmlwIHRvZ2V0aGVyIG11bHRpcGxlIGxpc3RzIGludG8gYSBzaW5nbGUgYXJyYXkgLS0gZWxlbWVudHMgdGhhdCBzaGFyZVxuICAvLyBhbiBpbmRleCBnbyB0b2dldGhlci5cbiAgdmFyIHppcCA9IHJlc3RBcmd1bWVudHModW56aXApO1xuXG4gIC8vIENvbnZlcnRzIGxpc3RzIGludG8gb2JqZWN0cy4gUGFzcyBlaXRoZXIgYSBzaW5nbGUgYXJyYXkgb2YgYFtrZXksIHZhbHVlXWBcbiAgLy8gcGFpcnMsIG9yIHR3byBwYXJhbGxlbCBhcnJheXMgb2YgdGhlIHNhbWUgbGVuZ3RoIC0tIG9uZSBvZiBrZXlzLCBhbmQgb25lIG9mXG4gIC8vIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlcy4gUGFzc2luZyBieSBwYWlycyBpcyB0aGUgcmV2ZXJzZSBvZiBgXy5wYWlyc2AuXG4gIGZ1bmN0aW9uIG9iamVjdChsaXN0LCB2YWx1ZXMpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGdldExlbmd0aChsaXN0KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldXSA9IHZhbHVlc1tpXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldWzBdXSA9IGxpc3RbaV1bMV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBHZW5lcmF0ZSBhbiBpbnRlZ2VyIEFycmF5IGNvbnRhaW5pbmcgYW4gYXJpdGhtZXRpYyBwcm9ncmVzc2lvbi4gQSBwb3J0IG9mXG4gIC8vIHRoZSBuYXRpdmUgUHl0aG9uIGByYW5nZSgpYCBmdW5jdGlvbi4gU2VlXG4gIC8vIFt0aGUgUHl0aG9uIGRvY3VtZW50YXRpb25dKGh0dHBzOi8vZG9jcy5weXRob24ub3JnL2xpYnJhcnkvZnVuY3Rpb25zLmh0bWwjcmFuZ2UpLlxuICBmdW5jdGlvbiByYW5nZShzdGFydCwgc3RvcCwgc3RlcCkge1xuICAgIGlmIChzdG9wID09IG51bGwpIHtcbiAgICAgIHN0b3AgPSBzdGFydCB8fCAwO1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH1cbiAgICBpZiAoIXN0ZXApIHtcbiAgICAgIHN0ZXAgPSBzdG9wIDwgc3RhcnQgPyAtMSA6IDE7XG4gICAgfVxuXG4gICAgdmFyIGxlbmd0aCA9IE1hdGgubWF4KE1hdGguY2VpbCgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXApLCAwKTtcbiAgICB2YXIgcmFuZ2UgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgbGVuZ3RoOyBpZHgrKywgc3RhcnQgKz0gc3RlcCkge1xuICAgICAgcmFuZ2VbaWR4XSA9IHN0YXJ0O1xuICAgIH1cblxuICAgIHJldHVybiByYW5nZTtcbiAgfVxuXG4gIC8vIENodW5rIGEgc2luZ2xlIGFycmF5IGludG8gbXVsdGlwbGUgYXJyYXlzLCBlYWNoIGNvbnRhaW5pbmcgYGNvdW50YCBvciBmZXdlclxuICAvLyBpdGVtcy5cbiAgZnVuY3Rpb24gY2h1bmsoYXJyYXksIGNvdW50KSB7XG4gICAgaWYgKGNvdW50ID09IG51bGwgfHwgY291bnQgPCAxKSByZXR1cm4gW107XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBpID0gMCwgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICAgIHdoaWxlIChpIDwgbGVuZ3RoKSB7XG4gICAgICByZXN1bHQucHVzaChzbGljZS5jYWxsKGFycmF5LCBpLCBpICs9IGNvdW50KSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gY29udGludWUgY2hhaW5pbmcgaW50ZXJtZWRpYXRlIHJlc3VsdHMuXG4gIGZ1bmN0aW9uIGNoYWluUmVzdWx0KGluc3RhbmNlLCBvYmopIHtcbiAgICByZXR1cm4gaW5zdGFuY2UuX2NoYWluID8gXyQxKG9iaikuY2hhaW4oKSA6IG9iajtcbiAgfVxuXG4gIC8vIEFkZCB5b3VyIG93biBjdXN0b20gZnVuY3Rpb25zIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdC5cbiAgZnVuY3Rpb24gbWl4aW4ob2JqKSB7XG4gICAgZWFjaChmdW5jdGlvbnMob2JqKSwgZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyIGZ1bmMgPSBfJDFbbmFtZV0gPSBvYmpbbmFtZV07XG4gICAgICBfJDEucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gW3RoaXMuX3dyYXBwZWRdO1xuICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiBjaGFpblJlc3VsdCh0aGlzLCBmdW5jLmFwcGx5KF8kMSwgYXJncykpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgICByZXR1cm4gXyQxO1xuICB9XG5cbiAgLy8gQWRkIGFsbCBtdXRhdG9yIGBBcnJheWAgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBlYWNoKFsncG9wJywgJ3B1c2gnLCAncmV2ZXJzZScsICdzaGlmdCcsICdzb3J0JywgJ3NwbGljZScsICd1bnNoaWZ0J10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfJDEucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb2JqID0gdGhpcy5fd3JhcHBlZDtcbiAgICAgIGlmIChvYmogIT0gbnVsbCkge1xuICAgICAgICBtZXRob2QuYXBwbHkob2JqLCBhcmd1bWVudHMpO1xuICAgICAgICBpZiAoKG5hbWUgPT09ICdzaGlmdCcgfHwgbmFtZSA9PT0gJ3NwbGljZScpICYmIG9iai5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBkZWxldGUgb2JqWzBdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gY2hhaW5SZXN1bHQodGhpcywgb2JqKTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBBZGQgYWxsIGFjY2Vzc29yIGBBcnJheWAgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBlYWNoKFsnY29uY2F0JywgJ2pvaW4nLCAnc2xpY2UnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBtZXRob2QgPSBBcnJheVByb3RvW25hbWVdO1xuICAgIF8kMS5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvYmogPSB0aGlzLl93cmFwcGVkO1xuICAgICAgaWYgKG9iaiAhPSBudWxsKSBvYmogPSBtZXRob2QuYXBwbHkob2JqLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIGNoYWluUmVzdWx0KHRoaXMsIG9iaik7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gTmFtZWQgRXhwb3J0c1xuXG4gIHZhciBhbGxFeHBvcnRzID0ge1xuICAgIF9fcHJvdG9fXzogbnVsbCxcbiAgICBWRVJTSU9OOiBWRVJTSU9OLFxuICAgIHJlc3RBcmd1bWVudHM6IHJlc3RBcmd1bWVudHMsXG4gICAgaXNPYmplY3Q6IGlzT2JqZWN0LFxuICAgIGlzTnVsbDogaXNOdWxsLFxuICAgIGlzVW5kZWZpbmVkOiBpc1VuZGVmaW5lZCxcbiAgICBpc0Jvb2xlYW46IGlzQm9vbGVhbixcbiAgICBpc0VsZW1lbnQ6IGlzRWxlbWVudCxcbiAgICBpc1N0cmluZzogaXNTdHJpbmcsXG4gICAgaXNOdW1iZXI6IGlzTnVtYmVyLFxuICAgIGlzRGF0ZTogaXNEYXRlLFxuICAgIGlzUmVnRXhwOiBpc1JlZ0V4cCxcbiAgICBpc0Vycm9yOiBpc0Vycm9yLFxuICAgIGlzU3ltYm9sOiBpc1N5bWJvbCxcbiAgICBpc0FycmF5QnVmZmVyOiBpc0FycmF5QnVmZmVyLFxuICAgIGlzRGF0YVZpZXc6IGlzRGF0YVZpZXckMSxcbiAgICBpc0FycmF5OiBpc0FycmF5LFxuICAgIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24kMSxcbiAgICBpc0FyZ3VtZW50czogaXNBcmd1bWVudHMkMSxcbiAgICBpc0Zpbml0ZTogaXNGaW5pdGUkMSxcbiAgICBpc05hTjogaXNOYU4kMSxcbiAgICBpc1R5cGVkQXJyYXk6IGlzVHlwZWRBcnJheSQxLFxuICAgIGlzRW1wdHk6IGlzRW1wdHksXG4gICAgaXNNYXRjaDogaXNNYXRjaCxcbiAgICBpc0VxdWFsOiBpc0VxdWFsLFxuICAgIGlzTWFwOiBpc01hcCxcbiAgICBpc1dlYWtNYXA6IGlzV2Vha01hcCxcbiAgICBpc1NldDogaXNTZXQsXG4gICAgaXNXZWFrU2V0OiBpc1dlYWtTZXQsXG4gICAga2V5czoga2V5cyxcbiAgICBhbGxLZXlzOiBhbGxLZXlzLFxuICAgIHZhbHVlczogdmFsdWVzLFxuICAgIHBhaXJzOiBwYWlycyxcbiAgICBpbnZlcnQ6IGludmVydCxcbiAgICBmdW5jdGlvbnM6IGZ1bmN0aW9ucyxcbiAgICBtZXRob2RzOiBmdW5jdGlvbnMsXG4gICAgZXh0ZW5kOiBleHRlbmQsXG4gICAgZXh0ZW5kT3duOiBleHRlbmRPd24sXG4gICAgYXNzaWduOiBleHRlbmRPd24sXG4gICAgZGVmYXVsdHM6IGRlZmF1bHRzLFxuICAgIGNyZWF0ZTogY3JlYXRlLFxuICAgIGNsb25lOiBjbG9uZSxcbiAgICB0YXA6IHRhcCxcbiAgICBnZXQ6IGdldCxcbiAgICBoYXM6IGhhcyxcbiAgICBtYXBPYmplY3Q6IG1hcE9iamVjdCxcbiAgICBpZGVudGl0eTogaWRlbnRpdHksXG4gICAgY29uc3RhbnQ6IGNvbnN0YW50LFxuICAgIG5vb3A6IG5vb3AsXG4gICAgdG9QYXRoOiB0b1BhdGgkMSxcbiAgICBwcm9wZXJ0eTogcHJvcGVydHksXG4gICAgcHJvcGVydHlPZjogcHJvcGVydHlPZixcbiAgICBtYXRjaGVyOiBtYXRjaGVyLFxuICAgIG1hdGNoZXM6IG1hdGNoZXIsXG4gICAgdGltZXM6IHRpbWVzLFxuICAgIHJhbmRvbTogcmFuZG9tLFxuICAgIG5vdzogbm93LFxuICAgIGVzY2FwZTogX2VzY2FwZSxcbiAgICB1bmVzY2FwZTogX3VuZXNjYXBlLFxuICAgIHRlbXBsYXRlU2V0dGluZ3M6IHRlbXBsYXRlU2V0dGluZ3MsXG4gICAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICAgIHJlc3VsdDogcmVzdWx0LFxuICAgIHVuaXF1ZUlkOiB1bmlxdWVJZCxcbiAgICBjaGFpbjogY2hhaW4sXG4gICAgaXRlcmF0ZWU6IGl0ZXJhdGVlLFxuICAgIHBhcnRpYWw6IHBhcnRpYWwsXG4gICAgYmluZDogYmluZCxcbiAgICBiaW5kQWxsOiBiaW5kQWxsLFxuICAgIG1lbW9pemU6IG1lbW9pemUsXG4gICAgZGVsYXk6IGRlbGF5LFxuICAgIGRlZmVyOiBkZWZlcixcbiAgICB0aHJvdHRsZTogdGhyb3R0bGUsXG4gICAgZGVib3VuY2U6IGRlYm91bmNlLFxuICAgIHdyYXA6IHdyYXAsXG4gICAgbmVnYXRlOiBuZWdhdGUsXG4gICAgY29tcG9zZTogY29tcG9zZSxcbiAgICBhZnRlcjogYWZ0ZXIsXG4gICAgYmVmb3JlOiBiZWZvcmUsXG4gICAgb25jZTogb25jZSxcbiAgICBmaW5kS2V5OiBmaW5kS2V5LFxuICAgIGZpbmRJbmRleDogZmluZEluZGV4LFxuICAgIGZpbmRMYXN0SW5kZXg6IGZpbmRMYXN0SW5kZXgsXG4gICAgc29ydGVkSW5kZXg6IHNvcnRlZEluZGV4LFxuICAgIGluZGV4T2Y6IGluZGV4T2YsXG4gICAgbGFzdEluZGV4T2Y6IGxhc3RJbmRleE9mLFxuICAgIGZpbmQ6IGZpbmQsXG4gICAgZGV0ZWN0OiBmaW5kLFxuICAgIGZpbmRXaGVyZTogZmluZFdoZXJlLFxuICAgIGVhY2g6IGVhY2gsXG4gICAgZm9yRWFjaDogZWFjaCxcbiAgICBtYXA6IG1hcCxcbiAgICBjb2xsZWN0OiBtYXAsXG4gICAgcmVkdWNlOiByZWR1Y2UsXG4gICAgZm9sZGw6IHJlZHVjZSxcbiAgICBpbmplY3Q6IHJlZHVjZSxcbiAgICByZWR1Y2VSaWdodDogcmVkdWNlUmlnaHQsXG4gICAgZm9sZHI6IHJlZHVjZVJpZ2h0LFxuICAgIGZpbHRlcjogZmlsdGVyLFxuICAgIHNlbGVjdDogZmlsdGVyLFxuICAgIHJlamVjdDogcmVqZWN0LFxuICAgIGV2ZXJ5OiBldmVyeSxcbiAgICBhbGw6IGV2ZXJ5LFxuICAgIHNvbWU6IHNvbWUsXG4gICAgYW55OiBzb21lLFxuICAgIGNvbnRhaW5zOiBjb250YWlucyxcbiAgICBpbmNsdWRlczogY29udGFpbnMsXG4gICAgaW5jbHVkZTogY29udGFpbnMsXG4gICAgaW52b2tlOiBpbnZva2UsXG4gICAgcGx1Y2s6IHBsdWNrLFxuICAgIHdoZXJlOiB3aGVyZSxcbiAgICBtYXg6IG1heCxcbiAgICBtaW46IG1pbixcbiAgICBzaHVmZmxlOiBzaHVmZmxlLFxuICAgIHNhbXBsZTogc2FtcGxlLFxuICAgIHNvcnRCeTogc29ydEJ5LFxuICAgIGdyb3VwQnk6IGdyb3VwQnksXG4gICAgaW5kZXhCeTogaW5kZXhCeSxcbiAgICBjb3VudEJ5OiBjb3VudEJ5LFxuICAgIHBhcnRpdGlvbjogcGFydGl0aW9uLFxuICAgIHRvQXJyYXk6IHRvQXJyYXksXG4gICAgc2l6ZTogc2l6ZSxcbiAgICBwaWNrOiBwaWNrLFxuICAgIG9taXQ6IG9taXQsXG4gICAgZmlyc3Q6IGZpcnN0LFxuICAgIGhlYWQ6IGZpcnN0LFxuICAgIHRha2U6IGZpcnN0LFxuICAgIGluaXRpYWw6IGluaXRpYWwsXG4gICAgbGFzdDogbGFzdCxcbiAgICByZXN0OiByZXN0LFxuICAgIHRhaWw6IHJlc3QsXG4gICAgZHJvcDogcmVzdCxcbiAgICBjb21wYWN0OiBjb21wYWN0LFxuICAgIGZsYXR0ZW46IGZsYXR0ZW4sXG4gICAgd2l0aG91dDogd2l0aG91dCxcbiAgICB1bmlxOiB1bmlxLFxuICAgIHVuaXF1ZTogdW5pcSxcbiAgICB1bmlvbjogdW5pb24sXG4gICAgaW50ZXJzZWN0aW9uOiBpbnRlcnNlY3Rpb24sXG4gICAgZGlmZmVyZW5jZTogZGlmZmVyZW5jZSxcbiAgICB1bnppcDogdW56aXAsXG4gICAgdHJhbnNwb3NlOiB1bnppcCxcbiAgICB6aXA6IHppcCxcbiAgICBvYmplY3Q6IG9iamVjdCxcbiAgICByYW5nZTogcmFuZ2UsXG4gICAgY2h1bms6IGNodW5rLFxuICAgIG1peGluOiBtaXhpbixcbiAgICAnZGVmYXVsdCc6IF8kMVxuICB9O1xuXG4gIC8vIERlZmF1bHQgRXhwb3J0XG5cbiAgLy8gQWRkIGFsbCBvZiB0aGUgVW5kZXJzY29yZSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIgb2JqZWN0LlxuICB2YXIgXyA9IG1peGluKGFsbEV4cG9ydHMpO1xuICAvLyBMZWdhY3kgTm9kZS5qcyBBUEkuXG4gIF8uXyA9IF87XG5cbiAgcmV0dXJuIF87XG5cbn0pKSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD11bmRlcnNjb3JlLXVtZC5qcy5tYXBcbiIsInZhciBtYyA9IG1vZHVsZS5leHBvcnRzXG5tYy5EYXRhdGFibGUgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBpZHMgPSAwO1xuXG5cbiAgICB2YXIgZHQgPSB7XG5cbiAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gKGNvbHMsIGNvbmZpZykge1xuICAgICAgICAgICAgdGhpcy5jb2xzID0gY29scztcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTZWxlY3Rpb24gPSBbXTtcblxuXG4gICAgICAgICAgICBpZiAoY29uZmlnLnVybCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IG0ucmVxdWVzdCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogY29uZmlnLnVybCxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyOiBjb25maWcuaGVhZGVyLCBcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBmdW5jdGlvbiAoeGhyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQXV0aG9yaXphdGlvbicsIGNvbmZpZy5hdXRob3JpemF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvbmZpZy5kYXRhKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gKHR5cGVvZiBjb25maWcuZGF0YSA9PSAnZnVuY3Rpb24nID8gY29uZmlnLmRhdGEgOiBtLnByb3AoY29uZmlnLmRhdGEpKTtcbiAgICAgICAgICAgIH1cblxuXG5cbiAgICAgICAgICAgIHRoaXMuc29ydCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gdGFyZ2V0LnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLWNvbGtleScpLFxuICAgICAgICAgICAgICAgICAgICBjb2wgPSB0aGlzLmFjdGl2ZUNvbHNba2V5XTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sYXN0U29ydGVkICYmIHRoaXMubGFzdFNvcnRlZCAhPSBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVDb2xzW3RoaXMubGFzdFNvcnRlZF0uX3NvcnRlZCA9ICdub25lJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHJldmVyc2UgPSAoY29sLl9zb3J0ZWQgPT0gJ2FzYycgPyAtMSA6IDEpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YSh0aGlzLmRhdGEoKS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgIGEgPSBhW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGIgPSBiW2tleV07XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoYSA9PSBiID8gMCA6IChhIDwgYiA/IC0xIDogMSkgKiByZXZlcnNlKTtcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgY29sLl9zb3J0ZWQgPSAocmV2ZXJzZSA+IDAgPyAnYXNjJyA6ICdkZXNjJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0U29ydGVkID0ga2V5O1xuICAgICAgICAgICAgICAgIG0ucmVuZGVyKHRoaXMuX3RhYmxlRWwsIGR0LmNvbnRlbnRzVmlldyh0aGlzKSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLm9uQ2VsbENsaWNrID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICAgICAgICAgIHdoaWxlICh0YXJnZXQubm9kZU5hbWUgIT0gJ1REJyAmJiB0YXJnZXQubm9kZU5hbWUgIT0gJ1RBQkxFJykgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldC5ub2RlTmFtZSA9PSAnVEFCTEUnKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB2YXIgY29sSW5kZXggPSB0YXJnZXQuY2VsbEluZGV4LFxuICAgICAgICAgICAgICAgICAgICBjb2wgPSB0aGlzLmRhdGFSb3dbY29sSW5kZXhdLFxuICAgICAgICAgICAgICAgICAgICByZWNvcmRJZCA9IHRhcmdldC5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1yZWNvcmQtaWQnKSxcbiAgICAgICAgICAgICAgICAgICAgaWRGaWVsZCA9IGNvbmZpZy5yZWNvcmRJZCB8fCAnaWQnLFxuICAgICAgICAgICAgICAgICAgICByb3c7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEoKS5zb21lKGZ1bmN0aW9uIChyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyW2lkRmllbGRdID09IHJlY29yZElkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3cgPSByO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIG0uc3RhcnRDb21wdXRhdGlvbigpO1xuICAgICAgICAgICAgICAgIHZhciByZXQgPSB0aGlzLmNvbmZpZy5vbkNlbGxDbGljay5jYWxsKHRoaXMsIHJvd1tjb2wuZmllbGQgfHwgY29sLmtleV0sIHJvdywgY29sKTtcbiAgICAgICAgICAgICAgICBtLmVuZENvbXB1dGF0aW9uKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMub25Sb3dTZWxlY3QgPSBmdW5jdGlvbiAoZSwgdGFyZ2V0KSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgcnMgPSB0aGlzLmNvbmZpZy5yb3dTZWxlY3QsXG4gICAgICAgICAgICAgICAgICAgIG11bHRpID0gcnMubXVsdGlwbGUsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gcnMuY2FsbGJhY2ssXG4gICAgICAgICAgICAgICAgICAgIHNlbCA9IHRoaXMuY3VycmVudFNlbGVjdGlvbiB8fCBbXSxcbiAgICAgICAgICAgICAgICAgICAgbGFzdFNlbCA9IHRoaXMubGFzdFNlbGVjdGlvbixcbiAgICAgICAgICAgICAgICAgICAgaW5SYW5nZSA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBpZEZpZWxkID0gY29uZmlnLnJlY29yZElkIHx8ICdpZCc7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9ICdmdW5jdGlvbicpIHJldHVybjtcbiAgICAgICAgICAgICAgICB3aGlsZSAodGFyZ2V0Lm5vZGVOYW1lICE9ICdUUicgJiYgdGFyZ2V0Lm5vZGVOYW1lICE9ICdUQUJMRScpIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQubm9kZU5hbWUgPT0gJ1RBQkxFJykgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHZhciByZWNvcmRJZCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcmVjb3JkLWlkJyk7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlSW50KHJlY29yZElkLCAxMCkgPT0gcmVjb3JkSWQpIHJlY29yZElkID0gcGFyc2VJbnQocmVjb3JkSWQsIDEwKTtcblxuXG4gICAgICAgICAgICAgICAgbS5zdGFydENvbXB1dGF0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKG11bHRpICYmIGUuY3RybEtleSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaSA9IHNlbC5pbmRleE9mKHJlY29yZElkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbC5wdXNoKHJlY29yZElkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG11bHRpICYmIGUuc2hpZnRLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhKCkuZm9yRWFjaChmdW5jdGlvbiAocm93KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSByb3dbaWRGaWVsZF07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5SYW5nZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWwuaW5kZXhPZihpZCkgPT0gLTEpIHNlbC5wdXNoKGlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWQgPT0gbGFzdFNlbCB8fCBpZCA9PSByZWNvcmRJZCkgaW5SYW5nZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWQgPT0gbGFzdFNlbCB8fCBpZCA9PSByZWNvcmRJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsLmluZGV4T2YoaWQpID09IC0xKSBzZWwucHVzaChpZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluUmFuZ2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsID0gKHNlbC5sZW5ndGggPT0gMSAmJiBzZWxbMF0gPT0gcmVjb3JkSWQgPyBbXSA6IFtyZWNvcmRJZF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RTZWxlY3Rpb24gPSByZWNvcmRJZDtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTZWxlY3Rpb24gPSBzZWw7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soc2VsKTtcbiAgICAgICAgICAgICAgICBtLmVuZENvbXB1dGF0aW9uKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLm9uY2xpY2sgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBlLnRhcmdldDtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0Lm5vZGVOYW1lID09ICdJJyAmJiAvXFxiZmFcXC1zb3J0Ly50ZXN0KHRhcmdldC5jbGFzc05hbWUpKSByZXR1cm4gdGhpcy5zb3J0KHRhcmdldCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlnLnJvd1NlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUm93U2VsZWN0KGUsIHRhcmdldCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5jb25maWcub25DZWxsQ2xpY2sgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5vbkNlbGxDbGljayh0YXJnZXQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICAgICAgICB0aGlzLnNldFdpZHRoID0gZnVuY3Rpb24gKGF0dHJzLCB3aWR0aCkge1xuICAgICAgICAgICAgICAgIGlmICghd2lkdGgpIHJldHVybjtcbiAgICAgICAgICAgICAgICBpZiAoL15cXGQrJC8udGVzdCh3aWR0aCkpIHdpZHRoICs9ICdweCc7XG4gICAgICAgICAgICAgICAgaWYgKCFhdHRycy5zdHlsZSkgYXR0cnMuc3R5bGUgPSAnJztcbiAgICAgICAgICAgICAgICBpZiAod2lkdGgpIGF0dHJzLnN0eWxlICs9ICd3aWR0aDonICsgd2lkdGggKyAnOyc7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICB2aWV3OiBmdW5jdGlvbiAoY3RybCwgb3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIGNvbHMgPSBjdHJsLmNvbHM7XG4gICAgICAgICAgICBjdHJsLnZpZXdPcHRpb25zID0gb3B0aW9ucztcblxuICAgICAgICAgICAgaWYgKCFjdHJsLmRhdGEoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtKCdkaXYnLCAnU29ycnksIG5vIGRhdGEgdG8gZGlzcGxheScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICAgICAgICBvcHRpb25zLmNsYXNzTmFtZXMgPSBvcHRpb25zLmNsYXNzTmFtZXMgfHwge307XG5cbiAgICAgICAgICAgIHZhciBhdHRycyA9IHtcbiAgICAgICAgICAgICAgICBjbGFzczogb3B0aW9ucy5jbGFzc05hbWVzLnRhYmxlIHx8ICd0YWJsZSB0YWJsZS1zdHJpcGVkIHRhYmxlLWJvcmRlcmVkIHRhYmxlLWhvdmVyJyxcbiAgICAgICAgICAgICAgICBjb25maWc6IGZ1bmN0aW9uIChlbCwgaXNPbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzT2xkKSByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY3RybC5vbmNsaWNrKTtcbiAgICAgICAgICAgICAgICAgICAgY3RybC5fdGFibGVFbCA9IGVsO1xuICAgICAgICAgICAgICAgICAgICBtLm1vZHVsZShlbCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjdHJsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXc6IGR0LmNvbnRlbnRzVmlld1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGN0cmwuc2V0V2lkdGgoYXR0cnMsIG9wdGlvbnMud2lkdGgpO1xuXG4gICAgICAgICAgICByZXR1cm4gbShcbiAgICAgICAgICAgICAgICAndGFibGUnLFxuICAgICAgICAgICAgICAgIGF0dHJzXG4gICAgICAgICAgICApO1xuXG5cbiAgICAgICAgfSxcbiAgICAgICAgY29udGVudHNWaWV3OiBmdW5jdGlvbiAoY3RybCkge1xuICAgICAgICAgICAgdmFyIGNvbHMgPSBjdHJsLmNvbHMsXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IGN0cmwudmlld09wdGlvbnM7XG5cbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgZHQuaGVhZFZpZXcoY3RybCwgY29scywgb3B0aW9ucyksXG4gICAgICAgICAgICAgICAgZHQuYm9keVZpZXcoY3RybCwgY29scywgb3B0aW9ucywgY3RybC5kYXRhKCkpLFxuICAgICAgICAgICAgICAgIGR0LmNhcHRpb25WaWV3KGN0cmwsIG9wdGlvbnMpXG4gICAgICAgICAgICBdO1xuICAgICAgICB9LFxuICAgICAgICBoZWFkVmlldzogZnVuY3Rpb24gKGN0cmwsIGNvbHMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBtYXRyaXggPSBbXSxcbiAgICAgICAgICAgICAgICByb3dOdW0gPSAwLFxuICAgICAgICAgICAgICAgIGRhdGFSb3cgPSBbXTtcbiAgICAgICAgICAgIHZhciBjYWxjRGVwdGggPSBmdW5jdGlvbiAobWF4RGVwdGgsIGNvbCkge1xuICAgICAgICAgICAgICAgIHZhciBkZXB0aCA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKCFtYXRyaXhbcm93TnVtXSkge1xuICAgICAgICAgICAgICAgICAgICBtYXRyaXhbcm93TnVtXSA9IFtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtYXRyaXhbcm93TnVtXS5wdXNoKGNvbCk7XG4gICAgICAgICAgICAgICAgaWYgKGNvbC5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICBjb2wuX2NvbHNwYW4gPSBjb2wuY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICByb3dOdW0rKztcbiAgICAgICAgICAgICAgICAgICAgZGVwdGggPSBjb2wuY2hpbGRyZW4ucmVkdWNlKGNhbGNEZXB0aCwgMCkgKyAxO1xuICAgICAgICAgICAgICAgICAgICByb3dOdW0tLTtcbiAgICAgICAgICAgICAgICAgICAgZGVwdGggPSBNYXRoLm1heChtYXhEZXB0aCwgZGVwdGgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFSb3cucHVzaChjb2wpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb2wuX2RlcHRoID0gZGVwdGg7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlcHRoO1xuICAgICAgICAgICAgfTtcblxuXG5cbiAgICAgICAgICAgIHZhciBtYXhEZXB0aCA9IGNvbHMucmVkdWNlKGNhbGNEZXB0aCwgMCk7XG4gICAgICAgICAgICBjdHJsLmRhdGFSb3cgPSBkYXRhUm93O1xuICAgICAgICAgICAgdmFyIGFjdGl2ZUNvbHMgPSB7fTtcbiAgICAgICAgICAgIGRhdGFSb3cuZm9yRWFjaChmdW5jdGlvbiAoY29sKSB7XG4gICAgICAgICAgICAgICAgYWN0aXZlQ29sc1tjb2wua2V5XSA9IGNvbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY3RybC5hY3RpdmVDb2xzID0gYWN0aXZlQ29scztcblxuICAgICAgICAgICAgdmFyIGJ1aWxkSGVhZGVyUm93ID0gZnVuY3Rpb24gKHJvdywgcm93TnVtKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJ1aWxkSGVhZGVyQ2VsbCA9IGZ1bmN0aW9uIChjb2wpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0ge307XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2wuX2NvbHNwYW4gJiYgY29sLl9jb2xzcGFuID4gMSkgYXR0cnMuY29sc3BhbiA9IGNvbC5fY29sc3BhbjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbC5jbGFzcykgYXR0cnMuY2xhc3MgPSBjb2wuY2xhc3M7XG4gICAgICAgICAgICAgICAgICAgIGlmICghY29sLl9kZXB0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnNbJ2RhdGEtY29sS2V5J10gPSBjb2wua2V5O1xuICAgICAgICAgICAgICAgICAgICAgICAgY3RybC5zZXRXaWR0aChhdHRycywgY29sLndpZHRoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dOdW0gPCBtYXhEZXB0aCkgYXR0cnMucm93c3BhbiA9IG1heERlcHRoIC0gcm93TnVtICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2wuX3NvcnRlZCAmJiBjb2wuX3NvcnRlZCAhPSAnbm9uZScpIGF0dHJzLmNsYXNzID0gb3B0aW9ucy5jbGFzc05hbWVzLnNvcnRlZCB8fCAnc29ydGVkJztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtKFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3RoJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCFjb2wuX2RlcHRoICYmIGNvbC5zb3J0YWJsZSA/IG0oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdpLmZhJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc2M6ICdmYS1zb3J0LWFzYycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzYzogJ2ZhLXNvcnQtZGVzYycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9uZTogJ2ZhLXNvcnQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9W2NvbC5fc29ydGVkIHx8ICdub25lJ11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgOiAnJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbS50cnVzdCgnICcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbC5sYWJlbCB8fCBjb2wua2V5XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBtKFxuICAgICAgICAgICAgICAgICAgICAndHInLFxuICAgICAgICAgICAgICAgICAgICByb3cubWFwKGJ1aWxkSGVhZGVyQ2VsbClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBtKCd0aGVhZCcsIG1hdHJpeC5tYXAoYnVpbGRIZWFkZXJSb3cpKTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIGJvZHlWaWV3OiBmdW5jdGlvbiAoY3RybCwgY29scywgb3B0aW9ucywgZGF0YSkge1xuICAgICAgICAgICAgdmFyIGlkRmllbGQgPSBjdHJsLmNvbmZpZy5yZWNvcmRJZCB8fCAnaWQnO1xuICAgICAgICAgICAgdmFyIGJ1aWxkRGF0YVJvdyA9IGZ1bmN0aW9uIChyb3csIHJvd0luZGV4KSB7XG4gICAgICAgICAgICAgICAgdmFyIGJ1aWxkRGF0YUNlbGwgPSBmdW5jdGlvbiAoY29sKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHJvd1tjb2wuZmllbGQgfHwgY29sLmtleV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycyA9IHt9O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29sLmZvcm1hdHRlciA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNvbC5mb3JtYXR0ZXIuY2FsbChjdHJsLCB2YWx1ZSwgcm93LCBjb2wsIGF0dHJzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIWF0dHJzLmNsYXNzKSBhdHRycy5jbGFzcyA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29sLl9zb3J0ZWQgJiYgY29sLl9zb3J0ZWQgIT0gJ25vbmUnKSBhdHRycy5jbGFzcyArPSAnICcgKyAob3B0aW9ucy5jbGFzc05hbWVzLnNvcnRlZCB8fCAnc29ydGVkJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2wuY2xhc3MpIGF0dHJzLmNsYXNzICs9ICcgJyArIGNvbC5jbGFzcztcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWF0dHJzLmNsYXNzKSBkZWxldGUgYXR0cnMuY2xhc3M7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtKFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3RkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChyb3dbaWRGaWVsZF0gPT09IHVuZGVmaW5lZCkgcm93W2lkRmllbGRdID0gaWRzKys7XG4gICAgICAgICAgICAgICAgdmFyIHJlY29yZElkID0gcm93W2lkRmllbGRdO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG0oXG4gICAgICAgICAgICAgICAgICAgICd0cicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhLXJlY29yZC1pZCc6IHJlY29yZElkLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6IChyb3dJbmRleCAmIDEgPyBvcHRpb25zLmNsYXNzTmFtZXMub2RkIHx8ICdvZGQnIDogb3B0aW9ucy5jbGFzc05hbWVzLmV2ZW4gfHwgJ2V2ZW4nKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAoY3RybC5jdXJyZW50U2VsZWN0aW9uLmluZGV4T2YocmVjb3JkSWQpICE9IC0xID8gb3B0aW9ucy5jbGFzc05hbWVzLnNlbGVjdGVkIHx8ICcgc2VsZWN0ZWQnIDogJycpXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGN0cmwuZGF0YVJvdy5tYXAoYnVpbGREYXRhQ2VsbClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBtKCd0Ym9keScsIGRhdGEubWFwKGJ1aWxkRGF0YVJvdykpO1xuICAgICAgICB9LFxuICAgICAgICBjYXB0aW9uVmlldzogZnVuY3Rpb24gKGN0cmwsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmNhcHRpb24pIHJldHVybiBtKCdjYXB0aW9uJywgb3B0aW9ucy5jYXB0aW9uKTtcbiAgICAgICAgfSxcbiAgICB9O1xuICAgIC8qIGdsb2JhbCBkb2N1bWVudDpmYWxzZSwgd2luZG93OmZhbHNlICovXG4gICAgZnVuY3Rpb24gY2xlYXJTZWxlY3Rpb24oKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5zZWxlY3Rpb24gJiYgZG9jdW1lbnQuc2VsZWN0aW9uLmVtcHR5KSB7XG4gICAgICAgICAgICBkb2N1bWVudC5zZWxlY3Rpb24uZW1wdHkoKTtcbiAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cuZ2V0U2VsZWN0aW9uKSB7XG4gICAgICAgICAgICB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZHQ7XG59KSgpO1xuIiwiXG52YXIgQXV0aCA9IHJlcXVpcmUoJy4uL21vZGVscy9BdXRoLmpzJyk7XG5cbnZhciBOYXZiYXIgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGN0cmwgPSB0aGlzO1xuXG4gICAgdmFyIGxpbmtzID0gKEF1dGgudG9rZW4oKSA/XG4gICAgW1xuXG5cbiAgICAgICx7bGFiZWw6J1VzZXJzJyAsaHJlZjogJy91c2Vycyd9LFxuICAgICAgLHtsYWJlbDonVGVzdHMnICxocmVmOiAnL3Rlc3RzJ30sXG4gICAgICB7bGFiZWw6J0xvZ291dCcsIGhyZWY6Jy9sb2dvdXQnfVxuICAgIF06W1xuICAgICAge2xhYmVsOidMb2dpbicsIGhyZWY6Jy9sb2dpbid9XG4gXG4gICAgXSlcbiAgICAubWFwKGZ1bmN0aW9uKGwpe1xuICAgICAgcmV0dXJuIG0oXCJsaVwiICsgKG0ucm91dGUoKSA9PT0gbC5ocmVmID8gJy5hY3RpdmUnOiAnJyksIG0oXCJhW2hyZWY9J1wiICsgbC5ocmVmICsgXCInXVwiLCBsLm5vcm1hbD97fTp7Y29uZmlnOiBtLnJvdXRlfSwgbC5sYWJlbCkpO1xuICAgIH0pO1xuXG4gICAgY3RybC5saW5rcyA9IG0ucHJvcChsaW5rcyk7XG5cbiAgICBjdHJsLmljb25EaXJlY3Rpb24gPSBtLnByb3AoJ2Rvd24nKTtcblxuICAgIGN0cmwudG9nZ2xlID0gZnVuY3Rpb24oKXtcbiAgICAgIGN0cmwuaWNvbkRpcmVjdGlvbiggY3RybC5pY29uRGlyZWN0aW9uKCk9PSd1cCcgPyAnZG93bic6J3VwJyApO1xuICAgIH07XG4gIH0sXG5cbiAgdmlldzogZnVuY3Rpb24oY3RybCkge1xuICAgIHJldHVybiBtKFwibmF2Lm5hdmJhci5uYXZiYXItaW52ZXJzZS5uYXZiYXItZml4ZWQtdG9wXCIsIFtcbiAgICAgIG0oXCIuY29udGFpbmVyXCIsIFtcbiAgICAgICAgbShcIi5uYXZiYXItaGVhZGVyXCIsXG4gICAgICAgICAgbSgnYnV0dG9uLm5hdmJhci10b2dnbGUnLCB7b25jbGljazogY3RybC50b2dnbGV9LCBtKCcuZ2x5cGhpY29uLmdseXBoaWNvbi1jaGV2cm9uLScgKyBjdHJsLmljb25EaXJlY3Rpb24oKSkpLFxuICAgICAgICAgIG0oXCJhLm5hdmJhci1icmFuZFtocmVmPScvJ11cIiwge2NvbmZpZzogbS5yb3V0ZX0sIFwiQXNzZXNzbWVudCBTeXN0ZW1cIilcbiAgICAgICAgKSxcbiAgICAgICAgbShcIi5uYXZiYXItY29sbGFwc2UuXCIgKyBjdHJsLmljb25EaXJlY3Rpb24oKSwgXG4gICAgICAgICAgbShcInVsLm5hdi5uYXZiYXItbmF2Lm5hdmJhci1yaWdodFwiLCBjdHJsLmxpbmtzKCkpXG4gICAgICAgIClcbiAgICAgIF0pXG4gICAgXSk7XG4gIH1cbn07IiwiLy8gdmFyIFF1ZXN0aW9uID0gcmVxdWlyZSgnLi4vbW9kZWxzL1F1ZXN0aW9uLmpzJyk7XG5cbnZhciBRdWVzdGlvbnNXaWRnZXQgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBjb250cm9sbGVyOiBmdW5jdGlvbiAocXVlc3Rpb24scXVlc3Rpb25Db3VudGVySWQpIHtcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IHF1ZXN0aW9uXG4gICAgICAgIFxuICAgICAgICAvLyB0aGlzLnNhdmUgPSBmdW5jdGlvbiAocXVlc3Rpb24pIHtcbiAgICAgICAgLy8gICAgIFF1ZXN0aW9uLnNhdmUocXVlc3Rpb24pLnRoZW4oZnVuY3Rpb24gKHBhcmFtcykge1xuXG4gICAgICAgIC8vICAgICAgICAgcXVlc3Rpb24uYm9keSgnJylcbiAgICAgICAgLy8gICAgICAgICByZXR1cm4gcGFyYW1zXG4gICAgICAgIC8vICAgICB9KS50aGVuKHVwZGF0ZS5iaW5kKHRoaXMpKVxuICAgICAgICAvLyB9LmJpbmQodGhpcylcbiAgICAgICAgdGhpcy5zZXRHdmFsPWZ1bmN0aW9uIG5hbWUodmFsKSB7XG4gICAgICAgICAgICBndmFsPXZhbFxuICAgICAgICB9XG4gICAgfSxcbiAgICB2aWV3OiBmdW5jdGlvbiAoY3RybCwgcXVlc3Rpb24scXVlc3Rpb25Db3VudGVySWQpIHtcbiAgICAgICAgcmV0dXJuIG0oJ2RpdicsIFtcbiAgICAgICAgICAgIG0uY29tcG9uZW50KFF1ZXN0aW9uRm9ybSwgcXVlc3Rpb24scXVlc3Rpb25Db3VudGVySWQpLFxuICAgICAgICAgICAgbS5jb21wb25lbnQoT3B0aW9uTGlzdCwgcXVlc3Rpb24ub3B0aW9ucyxxdWVzdGlvbkNvdW50ZXJJZClcbiAgICAgICAgICAgICxcbiAgICAgICAgICAgIG0oXCJocltzdHlsZT0nYm9yZGVyOiAxcHggc29saWQgIzJiNjZmZjsnXVwiKVxuICAgICAgICBdKVxuICAgIH0gXG59XG5cbnZhciBRdWVzdGlvbkZvcm0gPSB7XG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24gKHF1ZXN0aW9uKSB7XG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBxdWVzdGlvblxuICAgIH0sXG4gICAgdmlldzogZnVuY3Rpb24gKGN0cmwsIHF1ZXN0aW9uLHF1ZXN0aW9uQ291bnRlcklkKSB7XG4gICAgICAgXG5cbiAgICAgICAgcmV0dXJuIG0oXCJkZXZcIiwgW1xuICAgICBcblxuICAgICAgICAgICAgbSgnLmZvcm0tZ3JvdXAnLCBbXG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIG0oXCJpbnB1dC5mb3JtLWNvbnRyb2xbbmFtZT0ncXVlc3Rpb25cIitxdWVzdGlvbkNvdW50ZXJJZCtcIjpuYW1lJ11baWQ9J2lucHV0bmFtZSddW3BsYWNlaG9sZGVyPSduYW1lICddW3JlcXVpcmVkXVt0eXBlPSd0ZXh0J11cIix7dmFsdWU6IHF1ZXN0aW9uLmxhYmVsfSksXG4gICAgICAgICAgICAgIF0pLCBcblxuICAgICAgICAgICAgICAgIG0oXCJ0ZXh0YXJlYS5mb3JtLWNvbnRyb2xbbmFtZT0ncXVlc3Rpb25cIitxdWVzdGlvbkNvdW50ZXJJZCtcIjpkZXNjcmlwdGlvbiddW2lkPSdpbnB1dGRlc2NyaXB0aW9uJ11bcGxhY2Vob2xkZXI9J2Rlc2NyaXB0aW9uICddW3JlcXVpcmVkXVt0eXBlPSd0ZXh0J11cIix7dmFsdWU6cXVlc3Rpb24uZGVzY3JpcHRpb259KSxcbiAgICAgICAgICAgICAgICxcbiAgICBcblxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gICAgbShcImJ1dHRvbi5idG4uYnRuLWRhbmdlclwiLCBcIkRlbGV0ZVwiKVxuICAgICAgICAgXG4gICAgICAgIF0pXG4gICAgICAgXG4gICAgfVxufVxuXG52YXIgT3B0aW9uTGlzdCA9IHtcbiAgICB2aWV3OiBmdW5jdGlvbiAoY3RybCwgb3B0aW9ucyxxdWVzdGlvbkNvdW50ZXJJZCkge1xuICAgICAgICBvcHRpb25Db3VudGVySWQ9MDtcbiAgICAgICAgcmV0dXJuIG0oJ2RpdicsbShcImJyXCIpLG0oXCJ0YWJsZS50YWJsZS50YWJsZS1jb25kZW5zZWQudGFibGUtYm9yZGVyZWRcIixtKFwidHJcIixbbShcInRoXCIsXCJUaXRsZVwiKSxtKFwidGhcIixcImlzIGNvcnJlY3RcIildKSxtKCd0Ym9keScsIFtcbiAgICAgICAgICAgIG9wdGlvbnMubWFwKGZ1bmN0aW9uIChvcHRpb24pIHtcbiAgICAgICAgICAgICAgICBvcHRpb25Db3VudGVySWQrPTE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG0oXCJ0clwiLCBbXG5cbiAgICAgICAgICAgICAgICAgICAgbShcInRkXCIsIG0oXCJpbnB1dC5mb3JtLWNvbnRyb2xbbmFtZT0ncXVlc3Rpb25cIitxdWVzdGlvbkNvdW50ZXJJZCtcIjpvcHRpb25cIitvcHRpb25Db3VudGVySWQrXCI6dGl0bGUnXVtpZD0naW5wdXRuYW1lJ11bcGxhY2Vob2xkZXI9J25hbWUgJ11bcmVxdWlyZWRdW3R5cGU9J3RleHQnXVwiLHt2YWx1ZTogb3B0aW9uLnRpdGxlfSkpLCBcbiAgICAgICAgICAgICAgICAgICAgbShcInRkXCIsIG0oXCJpbnB1dFtzdHlsZT0nd2lkdGg6IDEwMCU7aGVpZ2h0OiAzMHB4OyddW25hbWU9J3F1ZXN0aW9uXCIrcXVlc3Rpb25Db3VudGVySWQrXCI6b3B0aW9uXCIrb3B0aW9uQ291bnRlcklkK1wiOmlzX2NvcnJlY3QnXVtpZD0naW5wdXRuYW1lJ11bdHlwZT0nY2hlY2tib3gnXVwiLHtjaGVja2VkOiBvcHRpb24uaXNfY29ycmVjdCx2YWx1ZTpvcHRpb24uaXNfY29ycmVjdH0pKSxcbiAgICAgICAgICAgICAgICAgICAgbShcInRkXCIsIG0oXCJidXR0b24uYnRuLmJ0bi1kYW5nZXJcIiwgXCJEZWxldGVcIikpXG4gICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIF0pKSlcbiAgICB9XG59ICIsInZhciBRdWVzdGlvbnMgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGN0cmwgPSB0aGlzO1xuICAgIFxuXG4gIH0sXG5cbiAgdmlldzogZnVuY3Rpb24oY3RybCxhcmdzKSB7XG4gICAgIHJldHVybiBbbShcInRhYmxlXCIsIFtcbiAgICAgICAgICAgIGFyZ3MucXVlc3Rpb25zLm1hcChmdW5jdGlvbihxdWVzdGlvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBtKFwidHJcIiwgW1xuICAgICAgICAgICAgICAgICAgICBtKFwidGRcIiwgcXVlc3Rpb24uYm9keSksXG4gICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIF0pLCBtKFwiZm9ybVwiLCBbXG4gICAgICAgICAgICBtKFwibGFiZWxcIiwgXCJCb2R5XCIpLFxuICAgICAgICAgICAgbShcInRleHRBcmVhXCIsIHtvbmlucHV0OiBtLndpdGhBdHRyKFwidmFsdWVcIiwgcXVlc3Rpb24uYm9keSksIHZhbHVlOiBxdWVzdGlvbi5ib2R5KCl9KSxcblxuICAgICAgICAgICAgbShcImJ1dHRvblt0eXBlPWJ1dHRvbl1cIiwge29uY2xpY2s6IGFyZ3Mub25zYXZlLmJpbmQodGhpcywgcXVlc3Rpb24pfSwgXCJTYXZlXCIpXG4gICAgICAgIF0pXVxuICB9XG59OyIsIi8vIG1haW4uanNcblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciBuYW1lcyA9IFsnYmx1ZSB0LXNoaXJ0JywgJ3llbGxvdyB0LXNoaXJ0JywgJ2dyZWVuIHQtc2hpcnQnXTtcbiBcbl8uZWFjaChuYW1lcywgZnVuY3Rpb24obikge1xuXHRjb25zb2xlLmxvZyhuKTtcbn0pO1xuXG4vL2luaXRpYWxpemUgdGhlIGFwcGxpY2F0aW9uXG5cblxuXG4vLyBtLm1vZHVsZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhZ2UtYXBwXCIpLCB7Y29udHJvbGxlcjogdG9kby5jb250cm9sbGVyLCB2aWV3OiB0b2RvLnZpZXd9KTsvL1xuXG5cblxuXG52YXIgcmVxID0gZnVuY3Rpb24oYXJncykge1xuICByZXR1cm4gbS5yZXF1ZXN0KGFyZ3MpXG59XG5tLnJvdXRlKGRvY3VtZW50LmJvZHksIFwiL1wiLCB7XG4gIFwiL1wiOiByZXF1aXJlKCcuL3BhZ2VzL1VzZXJzLmpzJyksXG4gIFwiL2xvZ2luXCI6IHJlcXVpcmUoJy4vcGFnZXMvTG9naW4uanMnKSxcbiAgXCIvbG9nb3V0XCI6IHJlcXVpcmUoJy4vcGFnZXMvTG9nb3V0LmpzJyksXG4gXG4gIFwiL3VzZXJFZGl0XCI6IHJlcXVpcmUoJy4vcGFnZXMvVXNlckVkaXQuanMnKSxcbiAgXCIvdmVyaWZ5Lzpjb2RlXCI6IHJlcXVpcmUoJy4vcGFnZXMvVmVyaWZ5LmpzJyksXG4gIFwiL3VzZXJcIjogcmVxdWlyZSgnLi9wYWdlcy9Vc2VyUGFnZS5qcycpLFxuICBcIi91c2Vyc1wiOiByZXF1aXJlKCcuL3BhZ2VzL1VzZXJzLmpzJyksXG4gICBcbiAgXCIvdGVzdEVkaXRcIjogcmVxdWlyZSgnLi9wYWdlcy9UZXN0RWRpdC5qcycpLFxuICBcIi92ZXJpZnkvOmNvZGVcIjogcmVxdWlyZSgnLi9wYWdlcy9WZXJpZnkuanMnKSxcbiAgXCIvdGVzdFwiOiByZXF1aXJlKCcuL3BhZ2VzL1Rlc3RQYWdlLmpzJyksXG4gIFwiL3Rlc3RzXCI6IHJlcXVpcmUoJy4vcGFnZXMvVGVzdHMuanMnKVxuXG59KTtcbiIsIlxuXG52YXIgQXV0aCA9IG1vZHVsZS5leHBvcnRzID0ge1xuICB0b2tlbjogbS5wcm9wKGxvY2FsU3RvcmFnZS50b2tlbiksXG4gIHVzZXJfdHlwZTogbS5wcm9wKGxvY2FsU3RvcmFnZS51c2VyX3R5cGUpLFxuICBcbiAgLy8gdHJhZGUgY3JlZGVudGlhbHMgZm9yIGEgdG9rZW5cbiAgbG9naW46IGZ1bmN0aW9uKGVtYWlsLCBwYXNzd29yZCl7XG4gICAgcmV0dXJuIG0ucmVxdWVzdCh7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIHVybDogJy9wb3J0YWwvYXV0aC9sb2dpbicsXG4gICAgICBkYXRhOiB7ZW1haWw6ZW1haWwsIHBhc3N3b3JkOnBhc3N3b3JkfSxcbiAgICAgIHVud3JhcFN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xuICAgICAgICBsb2NhbFN0b3JhZ2UudG9rZW4gPSByZXMuYXV0aF90b2tlbjtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnVzZXJfdHlwZT1yZXMudXNlcl90eXBlXG4gICAgICAgIEF1dGgudXNlcl90eXBlKHJlcy51c2VyX3R5cGUpXG4gICAgICAgIHJldHVybiByZXMuYXV0aF90b2tlbjtcbiAgICAgIH1cbiAgICB9KVxuICAgIC50aGVuKHRoaXMudG9rZW4pO1xuICB9LFxuICAvLyBmb3JnZXQgdG9rZW5cbiAgbG9nb3V0OiBmdW5jdGlvbigpe1xuICAgIHRoaXMudG9rZW4oZmFsc2UpO1xuICAgIGRlbGV0ZSBsb2NhbFN0b3JhZ2UudG9rZW47XG4gIH0sXG5cblxuXG5cbiAgLy8gbWFrZSBhbiBhdXRoZW50aWNhdGVkIHJlcXVlc3RcbiAgcmVxOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT0gJ3N0cmluZycpe1xuICAgICAgb3B0aW9ucyA9IHttZXRob2Q6J0dFVCcsIHVybDpvcHRpb25zfTtcbiAgICB9XG4gICAgdmFyIG9sZENvbmZpZyA9IG9wdGlvbnMuY29uZmlnIHx8IGZ1bmN0aW9uKCl7fTtcbiAgICBvcHRpb25zLmNvbmZpZyA9IGZ1bmN0aW9uKHhocikge1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJBdXRob3JpemF0aW9uXCIsICBBdXRoLnRva2VuKCkpO1xuICAgICAgb2xkQ29uZmlnKHhocik7XG4gICAgfTtcblxuICAgIC8vIHRyeSByZXF1ZXN0LCBpZiBhdXRoIGVycm9yLCByZWRpcmVjdFxuICAgIC8vIFRPRE86IHJlbWVtYmVyIHdoZXJlIHRoZSB1c2VyIHdhcywgb3JpZ2luYWxseVxuICAgIHZhciBkZWZlcnJlZCA9IG0uZGVmZXJyZWQoKTtcbiAgICAgbS5yZXF1ZXN0KG9wdGlvbnMpLnRoZW4oZGVmZXJyZWQucmVzb2x2ZSwgZnVuY3Rpb24oZXJyKXtcbiAgICAgIGlmIChlcnIuc3RhdHVzID09PSA0MDEpe1xuICAgICAgICBsb2dvdXRcbiAgICAgICAgbS5yb3V0ZSgnPy91c2VycycpXG4gICAgICB9ZWxzZXtcbiAgICAgICAgdGhyb3cgZXJyXG4gICAgICB9XG4gICAgICBcbiAgICB9KS50aGVuKGRlZmVycmVkLnJlc29sdmUsZGVmZXJyZWQucmVqZWN0KTtcblxuICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfVxufTsiLCIvLyBVc2VyIG1vZGVsXG52YXIgQXV0aCA9IHJlcXVpcmUoJy4vQXV0aC5qcycpO1xudmFyIFVzZXIgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiBcblxuICAgIHNlbmQ6IGZ1bmN0aW9uIChkYXRhLGlkKSB7XG4gICAgICAgIHJldHVybiBBdXRoLnJlcSh7XG4gICAgICAgICAgICBtZXRob2Q6IGlkID8gJ1BVVCcgOiAnUE9TVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3Rlc3RzJysoaWQ/Jy8nK2lkIDogJycpIFxuICAgICAgICAgICAgLCBcbiAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgXG4gICAgZ2V0OiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIEF1dGgucmVxKHtcbiAgICAgICAgICAgIG1ldGhvZDogJ2dldCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3Rlc3RzLycraWQsXG4gICAgICAgICAgIFxuXG4gICAgICAgIH0pO1xuICAgIH0sZGVsZXRlOiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIEF1dGgucmVxKHtcbiAgICAgICAgICAgIG1ldGhvZDogJ2RlbGV0ZScsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3Rlc3RzLycraWQsXG4gICAgICAgICAgIFxuXG4gICAgICAgIH0pO1xuICAgIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXI7IiwiLy8gVXNlciBtb2RlbFxudmFyIEF1dGggPSByZXF1aXJlKCcuL0F1dGguanMnKTtcbnZhciBVc2VyID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gXG5cbiAgICBzZW5kOiBmdW5jdGlvbiAoZGF0YSxpZCkge1xuICAgICAgICByZXR1cm4gQXV0aC5yZXEoe1xuICAgICAgICAgICAgbWV0aG9kOiBpZCA/ICdQVVQnIDogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS91c2VycycrKGlkPycvJytpZCA6ICcnKSBcbiAgICAgICAgICAgICwgXG4gICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgIH0pO1xuICAgIH0sXG4gIFxuICAgIGdldDogZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHJldHVybiBBdXRoLnJlcSh7XG4gICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS91c2Vycy8nK2lkLFxuICAgICAgICAgICBcblxuICAgICAgICB9KTtcbiAgICB9LGRlbGV0ZTogZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHJldHVybiBBdXRoLnJlcSh7XG4gICAgICAgICAgICBtZXRob2Q6ICdkZWxldGUnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS91c2Vycy8nK2lkLFxuICAgICAgICAgICBcblxuICAgICAgICB9KTtcbiAgICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBVc2VyOyIsIlxuXG52YXIgTmF2YmFyID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9OYXZiYXIuanMnKTtcbnZhciBBdXRoID0gcmVxdWlyZSgnLi4vbW9kZWxzL0F1dGguanMnKTtcblxudmFyIExvZ2luID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCl7XG4gICAgdmFyIGN0cmwgPSB0aGlzO1xuICAgIGN0cmwubmF2YmFyID0gbmV3IE5hdmJhci5jb250cm9sbGVyKCk7XG4gICAgY3RybC5lcnJvciA9IG0ucHJvcCgnJyk7XG4gICAgdGhpcy5sb2dpbiA9IGZ1bmN0aW9uKGUpe1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgQXV0aC5sb2dpbihlLnRhcmdldC5lbWFpbC52YWx1ZSwgZS50YXJnZXQucGFzc3dvcmQudmFsdWUpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgbS5yb3V0ZShBdXRoLm9yaWdpbmFsUm91dGUgfHwgJy8nLCBudWxsLCB0cnVlKTtcbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICBjdHJsLmVycm9yKG0oXCIuYWxlcnQuYWxlcnQtZGFuZ2VyLmFuaW1hdGVkLmZhZGVJblVwXCIsIEpTT04uc3RyaW5naWZ5KGVycikpKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgfSwgIFxuXG4gIHZpZXc6IGZ1bmN0aW9uKGN0cmwpe1xuICAgIHJldHVybiBbTmF2YmFyLnZpZXcoY3RybC5uYXZiYXIpLCBtKFwiLmNvbnRhaW5lclwiLCBbXG4gICAgICBtKFwiZm9ybS50ZXh0LWNlbnRlci5yb3cuZm9ybS1zaWduaW5cIiwge29uc3VibWl0OmN0cmwubG9naW4uYmluZChjdHJsKX0sXG4gICAgICAgIG0oJy5jb2wtc20tNi5jb2wtc20tb2Zmc2V0LTMnLCBbXG4gICAgICAgICAgbShcImgxXCIsIFwibG9naW5cIiksXG4gICAgICAgICAgY3RybC5lcnJvcigpLCBcbiAgICAgICAgICBtKCcuZm9ybS1ncm91cCcsIFtcbiAgICAgICAgICAgIG0oXCJsYWJlbC5zci1vbmx5W2Zvcj0naW5wdXRFbWFpbCddXCIsIFwiRW1haWwgYWRkcmVzc1wiKSxcbiAgICAgICAgICAgIG0oXCJpbnB1dC5mb3JtLWNvbnRyb2xbbmFtZT0nZW1haWwnXVthdXRvZm9jdXNdW2lkPSdpbnB1dEVtYWlsJ11bcGxhY2Vob2xkZXI9J0VtYWlsIGFkZHJlc3MnXVtyZXF1aXJlZF1bdHlwZT0nZW1haWwnXVwiKSxcbiAgICAgICAgICBdKSxcbiAgICAgICAgICBtKCcuZm9ybS1ncm91cCcsIFtcbiAgICAgICAgICAgIG0oXCJsYWJlbC5zci1vbmx5W2Zvcj0naW5wdXRQYXNzd29yZCddXCIsIFwiUGFzc3dvcmRcIiksXG4gICAgICAgICAgICBtKFwiaW5wdXQuZm9ybS1jb250cm9sW25hbWU9J3Bhc3N3b3JkJ11bYXV0b2NvbXBsZXRlPSdvZmYnXVtpZD0naW5wdXRQYXNzd29yZCddW3BsYWNlaG9sZGVyPSdQYXNzd29yZCddW3JlcXVpcmVkXVt0eXBlPSdwYXNzd29yZCddXCIpLFxuICAgICAgICAgIF0pLFxuICAgICAgICAgIG0oJy5mb3JtLWdyb3VwJyxcbiAgICAgICAgICAgIG0oXCJidXR0b24uYnRuLmJ0bi1sZy5idG4tcHJpbWFyeS5idG4tYmxvY2tbdHlwZT0nc3VibWl0J11cIiwgXCJTaWduIGluXCIpXG4gICAgICAgICAgKVxuICAgICAgICBdKVxuICAgICAgKVxuICAgIF0pXTtcbiAgfVxufTsiLCJcblxudmFyIEF1dGggPSByZXF1aXJlKCcuLi9tb2RlbHMvQXV0aC5qcycpO1xuXG52YXIgTG9nb3V0ID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCl7XG4gICAgQXV0aC5sb2dvdXQoKTtcbiAgICBtLnJvdXRlKCcvbG9naW4nKTtcbiAgfSxcblxuICB2aWV3OiBmdW5jdGlvbihjdHJsKXtcbiAgfVxufTsiLCJcblxudmFyIE5hdmJhciA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvTmF2YmFyLmpzJyk7XG52YXIgQXV0aCA9IHJlcXVpcmUoJy4uL21vZGVscy9BdXRoLmpzJyk7XG52YXIgVGVzdCA9IHJlcXVpcmUoJy4uL21vZGVscy9UZXN0LmpzJyk7XG52YXIgUXVlc3Rpb25zID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9RdWVzdGlvbnMuanMnKTtcbnZhciBRdWVzdGlvbldpZGdldCA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvUXVlc3Rpb25XaWRnZXQuanMnKTtcbnZhciBUZXN0RWRpdCA9IG1vZHVsZS5leHBvcnRzID0ge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbiAoYXJncykge1xuICAgIGN0cmwgPSB0aGlzO1xuICAgIGN0cmwudGVzdCA9IHsgbmFtZTogJycsIGRlc2NyaXB0aW9uOiAnJywgcXVlc3Rpb25zOiBbXSB9XG4gICAgY3RybC5uYXZiYXIgPSBuZXcgTmF2YmFyLmNvbnRyb2xsZXIoKTtcbiAgICBjdHJsLmVycm9yID0gbS5wcm9wKCcnKTtcbiAgICBjdHJsLm5ld1EgPSBtLnByb3AoW10pO1xuICAgIGN0cmwucXVlc3Rpb25Db3VudGVySWQgPSAwXG4gICAgY3RybC5kZWxldGU9ZnVuY3Rpb24oY3RybCl7XG4gICAgICBUZXN0LmRlbGV0ZShtLnJvdXRlLnBhcmFtKCkuaWQpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uICh0ZXN0KSB7XG4gICAgICAgICAgdmFyIG1lc3NhZ2UgPSAndGVzdCBkZWxldGVkIHN1Y2Nlc3NmdWx5JztcblxuICAgICAgICAgIGN0cmwuZXJyb3IobShcIi5hbGVydC5hbGVydC1kYW5nZXIuYW5pbWF0ZWQuZmFkZUluVXBcIiwgbWVzc2FnZSkpO1xuICAgICAgICAgIG0ucm91dGUoJy90ZXN0cycpO1xuICAgICAgICAgIG0ucm91dGUoJy90ZXN0cycpXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICB2YXIgbWVzc2FnZSA9ICdBbiBlcnJvciBvY2N1cnJlZC4nO1xuICAgICAgICAgIGN0cmwuZXJyb3IobShcIi5hbGVydC5hbGVydC1kYW5nZXIuYW5pbWF0ZWQuZmFkZUluVXBcIiwgbWVzc2FnZSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY3RybC5zYXZlVGVzdCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAvLyB2YWxpZGF0aW9uXG4gICAgICB0ZXN0RGF0YSA9IHsgdGVzdDogeyBuYW1lOiBlLnRhcmdldC5uYW1lLnZhbHVlLCBkZXNjcmlwdGlvbjogZS50YXJnZXQuZGVzY3JpcHRpb24udmFsdWUsIHF1ZXN0aW9uczoge30gfSB9XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGUudGFyZ2V0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vIGZvcm1EYXRhW3RhcmdldC5lbGVtZW50c1tpXS5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpXSA9IHRhcmdldC5lbGVtZW50c1tpXS52YWx1ZTtcbiAgICAgICAgZW5hbWUgPSBlLnRhcmdldFtpXS5uYW1lXG4gICAgICAgIGNvbnNvbGUubG9nKGVuYW1lKVxuICAgICAgICBpZiAoZW5hbWUuc3RhcnRzV2l0aCgncXVlc3Rpb24nKSkge1xuICAgICAgICAgIGVfYXJyID0gZW5hbWUuc3BsaXQoJzonKVxuICAgICAgICAgIGlmICh0ZXN0RGF0YS50ZXN0LnF1ZXN0aW9uc1tlX2FyclswXV0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0ZXN0RGF0YS50ZXN0LnF1ZXN0aW9uc1tlX2FyclswXV0gPSB7fVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZV9hcnIubGVuZ3RoID09IDIpIHtcbiAgICAgICAgICAgIHRlc3REYXRhLnRlc3QucXVlc3Rpb25zW2VfYXJyWzBdXVtlX2FyclsxXV0gPSBlLnRhcmdldFtpXS52YWx1ZVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGVzdERhdGEudGVzdC5xdWVzdGlvbnNbZV9hcnJbMF1dW2VfYXJyWzFdXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgdGVzdERhdGEudGVzdC5xdWVzdGlvbnNbZV9hcnJbMF1dW2VfYXJyWzFdXSA9IHt9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0ZXN0RGF0YS50ZXN0LnF1ZXN0aW9uc1tlX2FyclswXV1bZV9hcnJbMV1dW2VfYXJyWzJdXSA9IGUudGFyZ2V0W2ldLnZhbHVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgfVxuICAgICAgcXVlc3Rpb25zID0gdGVzdERhdGEudGVzdC5xdWVzdGlvbnNcbiAgICAgIHRlc3REYXRhLnRlc3QucXVlc3Rpb25zX2F0dHJpYnV0ZXMgPSBbXVxuICAgICAgT2JqZWN0LmtleXMocXVlc3Rpb25zKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gcXVlc3Rpb25zW2tleV1cbiAgICAgICAgcXVlc3Rpb24gPSB7IGxhYmVsOiB2YWx1ZS5uYW1lLCBkZXNjcmlwdGlvbjogdmFsdWUuZGVzY3JpcHRpb24sIG9wdGlvbnNfYXR0cmlidXRlczogW10gfVxuICAgICAgICBPYmplY3Qua2V5cyh2YWx1ZSkuZm9yRWFjaChmdW5jdGlvbiAocWtleSkge1xuICAgICAgICAgIHZhciB2YWx1ZWluc2lkZSA9IHZhbHVlW3FrZXldXG4gICAgICAgICAgaWYgKHFrZXkuc3RhcnRzV2l0aChcIm9wdGlvblwiKSkge1xuICAgICAgICAgICAgcXVlc3Rpb24ub3B0aW9uc19hdHRyaWJ1dGVzLnB1c2godmFsdWVpbnNpZGUpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB0ZXN0RGF0YS50ZXN0LnF1ZXN0aW9uc19hdHRyaWJ1dGVzLnB1c2gocXVlc3Rpb24pXG4gICAgICB9XG4gICAgICApOyBcbiAgICAgIGRlbGV0ZSB0ZXN0RGF0YS50ZXN0LnF1ZXN0aW9uc1xuXG4gICAgICAvLyBpbnNlcnRpb25cbiAgICAgIFRlc3Quc2VuZCh0ZXN0RGF0YSwgY3RybC50ZXN0LmlkKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY3RybC5lcnJvcihtKFwiLmFsZXJ0LmFsZXJ0LXN1Y2Nlc3MuYW5pbWF0ZWQuZmFkZUluVXBcIiwgJ3Rlc3QgaGF2ZSBiZWVuIHNhdmVkJykpO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG5cblxuICAgICAgICAgIGN0cmwuZXJyb3IobShcIi5hbGVydC5hbGVydC1kYW5nZXIuYW5pbWF0ZWQuZmFkZUluVXBcIiwgSlNPTi5zdHJpbmdpZnkoZXJyKSkpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIGlmIChtLnJvdXRlLnBhcmFtKCkuaWQgIT0gdW5kZWZpbmVkKVxuICAgICAgVGVzdC5nZXQobS5yb3V0ZS5wYXJhbSgpLmlkKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAodGVzdCkge1xuXG4gICAgICAgICAgY3RybC50ZXN0ID0gdGVzdFxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgdmFyIG1lc3NhZ2UgPSAnQW4gZXJyb3Igb2NjdXJyZWQuJztcbiAgICAgICAgICBtLnJvdXRlKCcvdGVzdHMnKVxuICAgICAgICAgIGN0cmwuZXJyb3IobShcIi5hbGVydC5hbGVydC1kYW5nZXIuYW5pbWF0ZWQuZmFkZUluVXBcIiwgbWVzc2FnZSkpO1xuICAgICAgICB9KTtcblxuICB9LFxuXG4gIHZpZXc6IGZ1bmN0aW9uIChjdHJsKSB7XG5cbiAgICByZXR1cm4gW05hdmJhci52aWV3KGN0cmwubmF2YmFyKSwgbShcIi5jb250YWluZXJcIiwgW1xuICAgICAgbShcImZvcm0udGV4dC1jZW50ZXIucm93LmZvcm0tc2lnbmluXCIsIHsgb25zdWJtaXQ6IGN0cmwuc2F2ZVRlc3QuYmluZChjdHJsKSB9LFxuICAgICAgbSgnLmNvbC1zbS02LmNvbC1zbS1vZmZzZXQtMycsIFtcbiAgICAgICAgbShcImgxXCIsIFwiU2F2ZSBUZXN0XCIpLFxuICAgICBcbiAgICAgICAgbSgnLmZvcm0tZ3JvdXAnLFxuICAgICAgICBtKFwiYnV0dG9uLmJ0bi5idG4tcHJpbWFyeVt0eXBlPSdzdWJtaXQnXVtzdHlsZT0nZmxvYXQ6bGVmdCddXCIsIFwiU2F2ZSBBbGxcIiksXG4gICAgICAgIG0oXCJidXR0b24uYnRuLmJ0bi1kYW5nZXJbdHlwZT1idXR0b25dW3N0eWxlPSdmbG9hdDpyaWdodCddXCIsIHsgb25jbGljazogY3RybC5kZWxldGUuYmluZChjdHJsKSB9LCBcImRlbGV0ZVwiKSxcbiAgICAgICAgICApLCBtKCdicicpLCBtKCdicicpLFxuICAgICAgICAgIGN0cmwuZXJyb3IoKSxcbiAgICAgICAgICBtKCcuZm9ybS1ncm91cCcsIFtcbiAgICAgICAgICAgIG0oXCJsYWJlbC5zci1vbmx5W2Zvcj0naW5wdXRUZXN0J11cIiwgXCJUZXN0IGRlc2NyaXB0aW9uXCIpLFxuICAgICAgICAgICAgbShcImlucHV0LmZvcm0tY29udHJvbFtuYW1lPSduYW1lJ11bYXV0b2ZvY3VzXVtpZD0naW5wdXRuYW1lJ11bcGxhY2Vob2xkZXI9J25hbWUgJ11bcmVxdWlyZWRdW3R5cGU9J3RleHQnXVwiLCB7IHZhbHVlOiBjdHJsLnRlc3QubmFtZSB9KSxcbiAgICAgICAgICBdKSwgbSgnLmZvcm0tZ3JvdXAnLCBbXG4gICAgICAgICAgICBtKFwibGFiZWwuc3Itb25seVtmb3I9J2lucHV0VGVzdCddXCIsIFwiVGVzdCBkZXNjcmlwdGlvblwiKSxcbiAgICAgICAgICAgIG0oXCJ0ZXh0YXJlYS5mb3JtLWNvbnRyb2xbbmFtZT0nZGVzY3JpcHRpb24nXVthdXRvZm9jdXNdW2lkPSdpbnB1dGRlc2NyaXB0aW9uJ11bcGxhY2Vob2xkZXI9J2Rlc2NyaXB0aW9uICddW3JlcXVpcmVkXVt0eXBlPSd0ZXh0J11cIiwgeyB2YWx1ZTogY3RybC50ZXN0LmRlc2NyaXB0aW9uIH0pLFxuICAgICAgICAgIF0pLFxuXG4gICAgICAgICAgLCBtKFwiaHJbc3R5bGU9J2JvcmRlcjogMnB4IHNvbGlkICMyYjY2ZmY7J11cIiksXG4gICAgICAgICAgbShcImgxXCIsIFwiUXVlc3Rpb25zXCIpLFxuICAgICAgICAgIG0oXCJidXR0b25bY2xhc3M9J2J0biBidG4tcHJpbWFyeSddW3R5cGU9YnV0dG9uXVtzdHlsZT0nZmxvYXQ6bGVmdCddXCIsIHtcbiAgICAgICAgICAgIG9uY2xpY2s6IGZ1bmN0aW9uIG5hbWUocGFyYW1zKSB7XG4gICAgICAgICAgICAgIGN0cmwucXVlc3Rpb25Db3VudGVySWQgKz0gMTtcbiAgICAgICAgICAgICAgbGlzdCA9IGN0cmwubmV3USgpXG4gICAgICAgICAgICAgIGxpc3QucHVzaChtLmNvbXBvbmVudChRdWVzdGlvbldpZGdldCwgeyBsYWJlbDogJycsIGRlc2NyaXB0aW9uOiAnJywgb3B0aW9uczogW3sgdGl0bGU6ICcnLCBpc19jb3JyZWN0OiB0cnVlIH1dIH0sIGN0cmwucXVlc3Rpb25Db3VudGVySWQpKVxuICAgICAgICAgICAgICBjdHJsLm5ld1EobGlzdClcbiAgICAgICAgICAgICAgLy8gY3RybC5uZXdRKGN0cmwubmV3USgpLnB1c2gobS5jb21wb25lbnQoUXVlc3Rpb25XaWRnZXQse29wdGlvbnM6W119LHF1ZXN0aW9uQ291bnRlcklkKSkpIFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIFwiQWRkIG5ldyBRdWVzdGlvbiBcIiksXG4gICAgICAgICAgY3RybC5uZXdRKCksXG5cbiAgICAgICAgICBbXG4gICAgICAgICAgICBjdHJsLnRlc3QucXVlc3Rpb25zLm1hcChmdW5jdGlvbiAocXVlc3Rpb24pIHtcbiAgICAgICAgICAgICAgY3RybC5xdWVzdGlvbkNvdW50ZXJJZCArPSAxO1xuICAgICAgICAgICAgICByZXR1cm4gbS5jb21wb25lbnQoUXVlc3Rpb25XaWRnZXQsIHF1ZXN0aW9uLCBjdHJsLnF1ZXN0aW9uQ291bnRlcklkKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICBdXG5cbiAgICAgICAgXSlcbiAgICAgIClcbiAgICBdKV07XG4gIH1cbn07IiwiLy8gdXNlciBwYWdlIHRvIHZpZXcgdXNlciBhLCBjb21tZW50cyAgYW5kIG5vdGVzIGlmIGFnZW50XG52YXIgVXNlciA9IHJlcXVpcmUoJy4uL21vZGVscy9Vc2VyLmpzJyk7XG52YXIgTmF2YmFyID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9OYXZiYXIuanMnKTtcbnZhciBRdWVzdGlvbnMgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL1F1ZXN0aW9ucy5qcycpO1xudmFyIFF1ZXN0aW9uV2lkZ2V0ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9RdWVzdGlvbldpZGdldC5qcycpO1xudmFyIFVzZXJQYWdlID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgdmFyIGN0cmwgPSB0aGlzO1xuICAgIGN0cmwuZXJyb3IgPSBtLnByb3AoJycpO1xuIFxuICAgIGN0cmwub3BlbiA9IGZ1bmN0aW9uIChzdGF0dXMpIHtcbiAgICAgIGN0cmwudXNlcigpLnVzZXIuc3RhdHVzID0gc3RhdHVzXG4gICAgICBVc2VyLnNlbmQoeyBzdGF0dXM6IHN0YXR1cyB9LCBtLnJvdXRlLnBhcmFtKCkuaWQpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgICAgY3RybC51c2VyKCkudXNlciA9IHVzZXJcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIHZhciBtZXNzYWdlID0gJ0FuIGVycm9yIG9jY3VycmVkLic7XG4gICAgICAgICAgY3RybC5lcnJvcihtKFwiLmFsZXJ0LmFsZXJ0LWRhbmdlci5hbmltYXRlZC5mYWRlSW5VcFwiLCBtZXNzYWdlKSk7XG4gICAgICAgIH0pO1xuICAgIH0gXG4gICAgY3RybC5kZWxldGUgPSBmdW5jdGlvbiAoc3RhdHVzKSB7XG5cbiAgICAgIFVzZXIuZGVsZXRlKG0ucm91dGUucGFyYW0oKS5pZClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgICB2YXIgbWVzc2FnZSA9ICd1c2VyIGRlbGV0ZWQgc3VjY2Vzc2Z1bHknO1xuXG4gICAgICAgICAgY3RybC5lcnJvcihtKFwiLmFsZXJ0LmFsZXJ0LWRhbmdlci5hbmltYXRlZC5mYWRlSW5VcFwiLCBtZXNzYWdlKSk7XG4gICAgICAgICAgbS5yb3V0ZSgnL3VzZXJzJyk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICB2YXIgbWVzc2FnZSA9ICdBbiBlcnJvciBvY2N1cnJlZC4nO1xuICAgICAgICAgIGN0cmwuZXJyb3IobShcIi5hbGVydC5hbGVydC1kYW5nZXIuYW5pbWF0ZWQuZmFkZUluVXBcIiwgbWVzc2FnZSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgVXNlci5nZXQobS5yb3V0ZS5wYXJhbSgpLmlkKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgdXNlcldyYXBwZXI9e3VzZXI6IHVzZXJ9XG4gICAgICAgIGN0cmwudXNlciA9IG0ucHJvcCh1c2VyV3JhcHBlcilcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSAnQW4gZXJyb3Igb2NjdXJyZWQuJztcbiAgICAgICBtLnJvdXRlKCcvdXNlcnMnKVxuICAgICAgICBjdHJsLmVycm9yKG0oXCIuYWxlcnQuYWxlcnQtZGFuZ2VyLmFuaW1hdGVkLmZhZGVJblVwXCIsIG1lc3NhZ2UpKTtcbiAgICAgIH0pO1xuXG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uIChjdHJsKSB7IFxuICAgIHJldHVybiBbTmF2YmFyLCBtKCcuY29udGFpbmVyJywgW1tcbiAgICAgIG0oXCJoMlwiLCBcIlVzZXJcIiksXG4gICAgICBjdHJsLmVycm9yKCksXG4gICAgICBtKFwicFwiLCBjdHJsLnVzZXIoKS51c2VyLm5hbWUpLG0oXCJwXCIsIGN0cmwudXNlcigpLnVzZXIuZW1haWwpLFxuICAgICAgbShcInRhYmxlLnRhYmxlLnRhYmxlLWNvbmRlbnNlZC50YWJsZS1ib3JkZXJlZFwiLCBbXG4gICAgICAgIG0oXCJ0aGVhZFwiLCBbXG4gICAgICAgICAgbShcInRyXCIsIFtcbiAgICAgICAgICAgIG0oXCJ0aFwiLCBcIkN1c3RvbWVyXCIpLFxuICAgICAgICAgICAgbShcInRoXCIsIFwiQWdlbnRcIiksXG4gICAgICAgICAgICBtKFwidGhcIiwgXCJDcmVhdGlvbiBEYXRlXCIpLFxuICAgICAgICAgICAgbShcInRoXCIsIFwiRG9uZSBEYXRlXCIpLFxuICAgICAgICAgICAgbShcInRoXCIsIFwiU3RhdHVzXCIpLFxuICAgICAgICAgICAgbShcInRoXCIsIFwidHlwZVwiKSxcbiAgICAgICAgICBdKVxuICAgICAgICBdKSxcbiAgICAgICAgbShcInRib2R5XCIsIFtcbiAgICAgICAgICBtKFwidHJcIiwgW1xuICAgICAgICAgICAgbShcInRkXCIsIGN0cmwudXNlcigpLnVzZXIuY3VzdG9tZXJfbmFtZSksXG4gICAgICAgICAgICBtKFwidGRcIiwgY3RybC51c2VyKCkudXNlci5hZ2VudF9uYW1lKSxcbiAgICAgICAgICAgIG0oXCJ0ZFwiLCBjdHJsLnVzZXIoKS51c2VyLmNyZWF0ZWRfYXQpLFxuICAgICAgICAgICAgbShcInRkXCIsIGN0cmwudXNlcigpLnVzZXIuZG9uZV9kYXRlKSxcbiAgICAgICAgICAgIG0oXCJ0ZFwiLCBjdHJsLnVzZXIoKS51c2VyLnN0YXR1cyksXG4gICAgICAgICAgICBtKFwidGRcIiwgbShcInNwYW4ubGFiZWxcIiwgeyBjbGFzczogY3RybC51c2VyKCkudXNlci50eXBlID09IFwibG93XCIgPyBcImxhYmVsLWRlZmF1bHRcIiA6IGN0cmwudXNlcigpLnVzZXIudHlwZSA9PSBcIm1lZGl1bVwiID8gXCJsYWJlbC1wcmltYXJ5XCIgOiBcImxhYmVsLWRhbmdlclwiIH0sIGN0cmwudXNlcigpLnVzZXIudHlwZSkpXG4gICAgICAgICAgXSksXG5cbiAgICAgICAgXSlcbiAgICAgIF0pLFxuXG4gICAgICBjdHJsLnVzZXIoKS51c2VyLnN0YXR1cyA9PSAnY2xvc2VkJyA/IG0oXCJidXR0b24uYnRuLmJ0bi13YXJuaW5nXCIsIHsgb25jbGljazogY3RybC5vcGVuLmJpbmQoY3RybCwgJ29wZW5lZCcpIH0sIFwiT3BlbmVkXCIpIDpcbiAgICAgICAgbShcImJ1dHRvbi5idG4uYnRuLWRhbmdlclwiLCB7IG9uY2xpY2s6IGN0cmwub3Blbi5iaW5kKGN0cmwsICdjbG9zZWQnKSB9LCBcIkNsb3NlXCIpXG5cblxuXG4gICAgICAsbShcImJ1dHRvbi5idG4uYnRuLWRhbmdlclwiLCB7IG9uY2xpY2s6IGN0cmwuZGVsZXRlLmJpbmQoY3RybCkgfSwgXCJkZWxldGVcIilcblxuXG5cblxuICAgIF0sIG0uY29tcG9uZW50KFF1ZXN0aW9uV2lkZ2V0LCB7dXNlcl9pZDogY3RybC51c2VyKCkudXNlci5pZH0pXVxuXG4gICAgKV07XG5cbiAgfVxuXG59IiwiXG5cbnZhciBOYXZiYXIgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL05hdmJhci5qcycpO1xudmFyIG1jID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9EYXRhVGFibGUuanMnKTtcbnZhciBBdXRoID0gcmVxdWlyZSgnLi4vbW9kZWxzL0F1dGguanMnKTtcbnZhciBUZXN0ID0gcmVxdWlyZSgnLi4vbW9kZWxzL1Rlc3QuanMnKTtcbnZhciBUZXN0UGFnZSA9IHJlcXVpcmUoJy4vVGVzdFBhZ2UuanMnKTtcbnZhciBUZXN0RWRpdCA9IHJlcXVpcmUoJy4vVGVzdEVkaXQuanMnKTtcblxudmFyIFRlc3RzID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY3RybCA9IHRoaXM7XG4gICAgY3RybC5wcmlvcmV0eUZyb21hdGU9ZnVuY3Rpb24odmFsdWUsIHJvdywgY29sLCBhdHRycyl7XG4gICAgICBpZiAodmFsdWUgPT0gJ2hpZ2gnKSBhdHRycy5jbGFzcyA9ICdsYWJlbCBsYWJlbC1kYW5nZXInO1xuICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfVxuICAgIHRoaXMuZGF0YXRhYmxlID0gbmV3IG1jLkRhdGF0YWJsZS5jb250cm9sbGVyKFxuICAgICAgLy8gQ29sdW1ucyBkZWZpbml0aW9uOlxuICAgICAgWyBcblxuICAgICAgICB7IGtleTogXCJuYW1lXCIsbGFiZWw6IFwiTmFtZVwiLCBzb3J0YWJsZTogdHJ1ZSB9LFxuICAgICAgICB7IGtleTogXCJkZXNjcmlwdGlvblwiLGxhYmVsOiBcIkRlc2NyaXB0aW9uXCIsIHNvcnRhYmxlOiBmYWxzZSB9LFxuICAgICAgICB7IGtleTogXCJxdWVzdGlvbl9jb3VudFwiLGxhYmVsOiBcIlF1ZXN0aW9uc1wiLCBzb3J0YWJsZTogZmFsc2UgfVxuXG5cbiAgICAgIF0sXG4gICAgICAvLyBPdGhlciBjb25maWd1cmF0aW9uOlxuICAgICAge1xuICAgICAgICAvLyBBZGRyZXNzIG9mIHRoZSB3ZWJzZXJ2ZXIgc3VwcGx5aW5nIHRoZSBkYXRhXG4gICAgICAgIHVybDogJy9hcGkvdjEvdGVzdHMnLFxuICAgICAgICBhdXRob3JpemF0aW9uOiBBdXRoLnRva2VuKCksXG4gICAgICAgIC8vIEhhbmRsZXIgb2YgY2xpY2sgZXZlbnQgb24gZGF0YSBjZWxsXG4gICAgICAgIC8vIEl0IHJlY2VpdmVzIHRoZSByZWxldmFudCBpbmZvcm1hdGlvbiBhbHJlYWR5IHJlc29sdmVkXG4gICAgICAgIG9uQ2VsbENsaWNrOiBmdW5jdGlvbiAoY29udGVudCwgcm93LCBjb2wpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhjb250ZW50LCByb3csIGNvbCk7XG4gICAgICAgICAgICAgIC8vIG0ucm91dGUoXCIvdGVzdFwiLHtpZDpyb3cuaWR9KVxuICAgICAgICAgICAgICBtLnJvdXRlKFwiL3Rlc3RFZGl0XCIse2lkOnJvdy5pZH0pXG4gICAgICAgICBcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG4gICAgXG4gIH0sIFxuXG4gIHZpZXc6IGZ1bmN0aW9uIChjdHJsKSB7XG4gICAgcmV0dXJuIFtOYXZiYXIsIG0oJy5jb250YWluZXInLCBbXG4gICAgICBtKCdoMScsICdUZXN0cycpLFxuICAgICAgbShcImFbaHJlZj0nPy90ZXN0RWRpdCddW2NsYXNzPSdidG4gYnRuLXByaW1hcnkgZmxvYXQtcmlnaHQnXVwiLFwiTmV3IFRlc3RcIiksXG4gICAgICBtYy5EYXRhdGFibGUudmlldyhjdHJsLmRhdGF0YWJsZSwge1xuICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgfSlcbiAgICBdKV07XG4gIH1cbn07IiwiXG5cbnZhciBOYXZiYXIgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL05hdmJhci5qcycpO1xudmFyIEF1dGggPSByZXF1aXJlKCcuLi9tb2RlbHMvQXV0aC5qcycpO1xudmFyIFVzZXIgPSByZXF1aXJlKCcuLi9tb2RlbHMvVXNlci5qcycpO1xuXG52YXIgVXNlckVkaXQgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgY29udHJvbGxlcjogZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICBjdHJsID0gdGhpcztcbiAgICBjdHJsLnVzZXI9e25hbWU6JycsZW1haWw6JycsdHlwZTonJyxwYXNzd29yZDonJ31cbiAgICBjdHJsLm5hdmJhciA9IG5ldyBOYXZiYXIuY29udHJvbGxlcigpO1xuICAgIGN0cmwuZXJyb3IgPSBtLnByb3AoJycpO1xuICAgIGN0cmwuZGVsZXRlPWZ1bmN0aW9uKGN0cmwpe1xuICAgICAgVXNlci5kZWxldGUobS5yb3V0ZS5wYXJhbSgpLmlkKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICAgIHZhciBtZXNzYWdlID0gJ3VzZXIgZGVsZXRlZCBzdWNjZXNzZnVseSc7XG5cbiAgICAgICAgICBjdHJsLmVycm9yKG0oXCIuYWxlcnQuYWxlcnQtZGFuZ2VyLmFuaW1hdGVkLmZhZGVJblVwXCIsIG1lc3NhZ2UpKTtcbiAgICAgICAgICBtLnJvdXRlKCcvdXNlcnMnKTtcbiAgICAgICAgICBtLnJvdXRlKCcvdXNlcnMnKVxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgdmFyIG1lc3NhZ2UgPSAnQW4gZXJyb3Igb2NjdXJyZWQuJztcbiAgICAgICAgICBjdHJsLmVycm9yKG0oXCIuYWxlcnQuYWxlcnQtZGFuZ2VyLmFuaW1hdGVkLmZhZGVJblVwXCIsIG1lc3NhZ2UpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGN0cmwuc2F2ZVVzZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgLy8gdmFsaWRhdGlvblxuICAgICAgdXNlckRhdGE9e3VzZXI6eyBuYW1lOiBlLnRhcmdldC5uYW1lLnZhbHVlLCBlbWFpbDogZS50YXJnZXQuZW1haWwudmFsdWUsdHlwZTogZS50YXJnZXQudHlwZS52YWx1ZSAscGFzc3dvcmQ6IGUudGFyZ2V0LnBhc3N3b3JkLnZhbHVlfX1cbiAgICAgXG5cbiAgICAgIC8vIGluc2VydGlvblxuICAgICAgVXNlci5zZW5kKHVzZXJEYXRhLGN0cmwudXNlci5pZClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGN0cmwuZXJyb3IobShcIi5hbGVydC5hbGVydC1zdWNjZXNzLmFuaW1hdGVkLmZhZGVJblVwXCIsICd1c2VyIGhhdmUgYmVlbiBzYXZlZCcpKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgXG5cbiAgICAgICAgICBjdHJsLmVycm9yKG0oXCIuYWxlcnQuYWxlcnQtZGFuZ2VyLmFuaW1hdGVkLmZhZGVJblVwXCIsIEpTT04uc3RyaW5naWZ5KGVycikpKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBpZihtLnJvdXRlLnBhcmFtKCkuaWQhPSB1bmRlZmluZWQpXG4gICAgVXNlci5nZXQobS5yb3V0ZS5wYXJhbSgpLmlkKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICBcbiAgICAgICAgY3RybC51c2VyID0gdXNlclxuICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICB2YXIgbWVzc2FnZSA9ICdBbiBlcnJvciBvY2N1cnJlZC4nO1xuICAgICAgIG0ucm91dGUoJy91c2VycycpXG4gICAgICAgIGN0cmwuZXJyb3IobShcIi5hbGVydC5hbGVydC1kYW5nZXIuYW5pbWF0ZWQuZmFkZUluVXBcIiwgbWVzc2FnZSkpO1xuICAgICAgfSk7XG5cbiAgfSxcblxuICB2aWV3OiBmdW5jdGlvbiAoY3RybCkge1xuICAgIHJldHVybiBbTmF2YmFyLnZpZXcoY3RybC5uYXZiYXIpLCBtKFwiLmNvbnRhaW5lclwiLCBbXG4gICAgICBtKFwiZm9ybS50ZXh0LWNlbnRlci5yb3cuZm9ybS1zaWduaW5cIiwgeyBvbnN1Ym1pdDogY3RybC5zYXZlVXNlci5iaW5kKGN0cmwpIH0sXG4gICAgICAgIG0oJy5jb2wtc20tNi5jb2wtc20tb2Zmc2V0LTMnLCBbXG4gICAgICAgICAgbShcImgxXCIsIFwiU2F2ZSBVc2VyXCIpLFxuICAgICAgICAgIGN0cmwuZXJyb3IoKSxcblxuICAgICAgICAgIG0oXCJidXR0b24uYnRuLmJ0bi1kYW5nZXJbdHlwZT1idXR0b25dW3N0eWxlPSdmbG9hdDpyaWdodCddXCIsIHsgb25jbGljazogY3RybC5kZWxldGUuYmluZChjdHJsKSB9LCBcImRlbGV0ZVwiKSxcbiAgICAgICAgICBcbiAgICAgICAgICBtKFwiYnV0dG9uLmJ0bi5idG4tcHJpbWFyeVt0eXBlPSdzdWJtaXQnXVtzdHlsZT0nZmxvYXQ6bGVmdCddXCIsIFwiU2F2ZVwiKSxcbiAgICAgICAgICBtKCdicicpLG0oJ2JyJyksXG4gICAgICAgICAgbSgnLmZvcm0tZ3JvdXAnLCBbXG4gICAgICAgICAgICBtKFwibGFiZWwuc3Itb25seVtmb3I9J2lucHV0VXNlciddXCIsIFwiVXNlciBkZXNjcmlwdGlvblwiKSxcbiAgICAgICAgICAgIG0oXCJpbnB1dC5mb3JtLWNvbnRyb2xbbmFtZT0nbmFtZSddW2F1dG9mb2N1c11baWQ9J2lucHV0bmFtZSddW3BsYWNlaG9sZGVyPSduYW1lICddW3JlcXVpcmVkXVt0eXBlPSd0ZXh0J11cIix7dmFsdWU6IGN0cmwudXNlci5uYW1lfSksXG4gICAgICAgICAgXSksIG0oJy5mb3JtLWdyb3VwJywgW1xuICAgICAgICAgICAgbShcImxhYmVsLnNyLW9ubHlbZm9yPSdpbnB1dFVzZXInXVwiLCBcIlVzZXIgZGVzY3JpcHRpb25cIiksXG4gICAgICAgICAgICBtKFwiaW5wdXQuZm9ybS1jb250cm9sW25hbWU9J2VtYWlsJ11bYXV0b2ZvY3VzXVtpZD0naW5wdXRlbWFpbCddW3BsYWNlaG9sZGVyPSdlbWFpbCAnXVtyZXF1aXJlZF1bdHlwZT0ndGV4dCddXCIse3ZhbHVlOiBjdHJsLnVzZXIuZW1haWx9KSxcbiAgICAgICAgICBdKSxtKCcuZm9ybS1ncm91cCcsIFtcbiAgICAgICAgICAgIG0oXCJsYWJlbC5zci1vbmx5W2Zvcj0naW5wdXRVc2VyJ11cIiwgXCJVc2VyIGRlc2NyaXB0aW9uXCIpLFxuICAgICAgICAgICAgbShcImlucHV0LmZvcm0tY29udHJvbFtuYW1lPSdwYXNzd29yZCddW2F1dG9mb2N1c11baWQ9J2lucHV0cGFzc3dvcmQnXVtwbGFjZWhvbGRlcj0ncGFzc3dvcmQgJ11bdHlwZT0ndGV4dCddXCIse3JlcXVpcmVkOiBjdHJsLnVzZXIuaWQ9PXVuZGVmaW5lZH0pLFxuICAgICAgICAgIF0pLCBtKCcuZm9ybS1ncm91cCcsIFtcbiAgICAgICAgICAgIG0oXCJsYWJlbC5zci1vbmx5W2Zvcj0naW5wdXR0eXBlJ11cIiwgXCJ0eXBlXCIpLFxuICAgICAgICAgICAgbShcInNlbGVjdC5mb3JtLWNvbnRyb2xbbmFtZT0ndHlwZSddW3JlcXVpcmVkXVwiLCBbbShcIm9wdGlvblt2YWx1ZT0nVGVhY2hlciddXCIsIFwiVGVhY2hlclwiKSwgbShcIm9wdGlvblt2YWx1ZT0nU3R1ZGVudCddXCIrKGN0cmwudXNlci50eXBlPT1cIlN0dWRlbnRcIiA/IFwiW3NlbGVjdGVkXVwiOlwiXCIpLCAnU3R1ZGVudCcpXSksXG4gICAgICAgICAgXSksXG5cbiAgICAgICAgICBcbiAgICAgICAgXSlcbiAgICAgIClcbiAgICBdKV07XG4gIH1cbn07IiwiLy8gdXNlciBwYWdlIHRvIHZpZXcgdXNlciBhLCBjb21tZW50cyAgYW5kIG5vdGVzIGlmIGFnZW50XG52YXIgVXNlciA9IHJlcXVpcmUoJy4uL21vZGVscy9Vc2VyLmpzJyk7XG52YXIgTmF2YmFyID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9OYXZiYXIuanMnKTtcbnZhciBVc2VyUGFnZSA9IG1vZHVsZS5leHBvcnRzID0ge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbiAoYXJncykge1xuICAgIHZhciBjdHJsID0gdGhpcztcbiAgICBjdHJsLmVycm9yID0gbS5wcm9wKCcnKTtcbiBcbiAgICBjdHJsLm9wZW4gPSBmdW5jdGlvbiAoc3RhdHVzKSB7XG4gICAgICBjdHJsLnVzZXIoKS51c2VyLnN0YXR1cyA9IHN0YXR1c1xuICAgICAgVXNlci5zZW5kKHsgc3RhdHVzOiBzdGF0dXMgfSwgbS5yb3V0ZS5wYXJhbSgpLmlkKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICAgIGN0cmwudXNlcigpLnVzZXIgPSB1c2VyXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICB2YXIgbWVzc2FnZSA9ICdBbiBlcnJvciBvY2N1cnJlZC4nO1xuICAgICAgICAgIGN0cmwuZXJyb3IobShcIi5hbGVydC5hbGVydC1kYW5nZXIuYW5pbWF0ZWQuZmFkZUluVXBcIiwgbWVzc2FnZSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY3RybC5kZWxldGUgPSBmdW5jdGlvbiAoc3RhdHVzKSB7XG5cbiAgICAgIFVzZXIuZGVsZXRlKG0ucm91dGUucGFyYW0oKS5pZClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgICB2YXIgbWVzc2FnZSA9ICd1c2VyIGRlbGV0ZWQgc3VjY2Vzc2Z1bHknO1xuXG4gICAgICAgICAgY3RybC5lcnJvcihtKFwiLmFsZXJ0LmFsZXJ0LWRhbmdlci5hbmltYXRlZC5mYWRlSW5VcFwiLCBtZXNzYWdlKSk7XG4gICAgICAgICAgbS5yb3V0ZSgnL3VzZXJzJyk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICB2YXIgbWVzc2FnZSA9ICdBbiBlcnJvciBvY2N1cnJlZC4nO1xuICAgICAgICAgIGN0cmwuZXJyb3IobShcIi5hbGVydC5hbGVydC1kYW5nZXIuYW5pbWF0ZWQuZmFkZUluVXBcIiwgbWVzc2FnZSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgVXNlci5nZXQobS5yb3V0ZS5wYXJhbSgpLmlkKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgdXNlcldyYXBwZXI9e3VzZXI6IHVzZXJ9XG4gICAgICAgIGN0cmwudXNlciA9IG0ucHJvcCh1c2VyV3JhcHBlcilcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSAnQW4gZXJyb3Igb2NjdXJyZWQuJztcbiAgICAgICBtLnJvdXRlKCcvdXNlcnMnKVxuICAgICAgICBjdHJsLmVycm9yKG0oXCIuYWxlcnQuYWxlcnQtZGFuZ2VyLmFuaW1hdGVkLmZhZGVJblVwXCIsIG1lc3NhZ2UpKTtcbiAgICAgIH0pO1xuXG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uIChjdHJsKSB7IFxuICAgIHJldHVybiBbTmF2YmFyLCBtKCcuY29udGFpbmVyJywgW1tcbiAgICAgIG0oXCJoMlwiLCBcIlVzZXJcIiksXG4gICAgICBjdHJsLmVycm9yKCksXG4gICAgICBtKFwicFwiLCBjdHJsLnVzZXIoKS51c2VyLm5hbWUpLG0oXCJwXCIsIGN0cmwudXNlcigpLnVzZXIuZW1haWwpLFxuICAgICAgbShcInRhYmxlLnRhYmxlLnRhYmxlLWNvbmRlbnNlZC50YWJsZS1ib3JkZXJlZFwiLCBbXG4gICAgICAgIG0oXCJ0aGVhZFwiLCBbXG4gICAgICAgICAgbShcInRyXCIsIFtcbiAgICAgICAgICAgIG0oXCJ0aFwiLCBcIkN1c3RvbWVyXCIpLFxuICAgICAgICAgICAgbShcInRoXCIsIFwiQWdlbnRcIiksXG4gICAgICAgICAgICBtKFwidGhcIiwgXCJDcmVhdGlvbiBEYXRlXCIpLFxuICAgICAgICAgICAgbShcInRoXCIsIFwiRG9uZSBEYXRlXCIpLFxuICAgICAgICAgICAgbShcInRoXCIsIFwiU3RhdHVzXCIpLFxuICAgICAgICAgICAgbShcInRoXCIsIFwidHlwZVwiKSxcbiAgICAgICAgICBdKVxuICAgICAgICBdKSxcbiAgICAgICAgbShcInRib2R5XCIsIFtcbiAgICAgICAgICBtKFwidHJcIiwgW1xuICAgICAgICAgICAgbShcInRkXCIsIGN0cmwudXNlcigpLnVzZXIuY3VzdG9tZXJfbmFtZSksXG4gICAgICAgICAgICBtKFwidGRcIiwgY3RybC51c2VyKCkudXNlci5hZ2VudF9uYW1lKSxcbiAgICAgICAgICAgIG0oXCJ0ZFwiLCBjdHJsLnVzZXIoKS51c2VyLmNyZWF0ZWRfYXQpLFxuICAgICAgICAgICAgbShcInRkXCIsIGN0cmwudXNlcigpLnVzZXIuZG9uZV9kYXRlKSxcbiAgICAgICAgICAgIG0oXCJ0ZFwiLCBjdHJsLnVzZXIoKS51c2VyLnN0YXR1cyksXG4gICAgICAgICAgICBtKFwidGRcIiwgbShcInNwYW4ubGFiZWxcIiwgeyBjbGFzczogY3RybC51c2VyKCkudXNlci50eXBlID09IFwibG93XCIgPyBcImxhYmVsLWRlZmF1bHRcIiA6IGN0cmwudXNlcigpLnVzZXIudHlwZSA9PSBcIm1lZGl1bVwiID8gXCJsYWJlbC1wcmltYXJ5XCIgOiBcImxhYmVsLWRhbmdlclwiIH0sIGN0cmwudXNlcigpLnVzZXIudHlwZSkpXG4gICAgICAgICAgXSksXG5cbiAgICAgICAgXSlcbiAgICAgIF0pLFxuXG4gICAgICBjdHJsLnVzZXIoKS51c2VyLnN0YXR1cyA9PSAnY2xvc2VkJyA/IG0oXCJidXR0b24uYnRuLmJ0bi13YXJuaW5nXCIsIHsgb25jbGljazogY3RybC5vcGVuLmJpbmQoY3RybCwgJ29wZW5lZCcpIH0sIFwiT3BlbmVkXCIpIDpcbiAgICAgICAgbShcImJ1dHRvbi5idG4uYnRuLWRhbmdlclwiLCB7IG9uY2xpY2s6IGN0cmwub3Blbi5iaW5kKGN0cmwsICdjbG9zZWQnKSB9LCBcIkNsb3NlXCIpXG5cblxuXG4gICAgICAsbShcImJ1dHRvbi5idG4uYnRuLWRhbmdlclwiLCB7IG9uY2xpY2s6IGN0cmwuZGVsZXRlLmJpbmQoY3RybCkgfSwgXCJkZWxldGVcIilcblxuXG5cblxuICAgIF1dXG5cbiAgICApXTtcblxuICB9XG5cbn0iLCJcblxudmFyIE5hdmJhciA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvTmF2YmFyLmpzJyk7XG52YXIgbWMgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL0RhdGFUYWJsZS5qcycpO1xudmFyIEF1dGggPSByZXF1aXJlKCcuLi9tb2RlbHMvQXV0aC5qcycpO1xudmFyIFVzZXIgPSByZXF1aXJlKCcuLi9tb2RlbHMvVXNlci5qcycpO1xudmFyIFVzZXJQYWdlID0gcmVxdWlyZSgnLi4vcGFnZXMvVXNlclBhZ2UuanMnKTtcbnZhciBVc2VyRWRpdCA9IHJlcXVpcmUoJy4vVXNlckVkaXQuanMnKTtcblxudmFyIFVzZXJzID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY3RybCA9IHRoaXM7XG4gICAgY3RybC5wcmlvcmV0eUZyb21hdGU9ZnVuY3Rpb24odmFsdWUsIHJvdywgY29sLCBhdHRycyl7XG4gICAgICBpZiAodmFsdWUgPT0gJ2hpZ2gnKSBhdHRycy5jbGFzcyA9ICdsYWJlbCBsYWJlbC1kYW5nZXInO1xuICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfVxuICAgIHRoaXMuZGF0YXRhYmxlID0gbmV3IG1jLkRhdGF0YWJsZS5jb250cm9sbGVyKFxuICAgICAgLy8gQ29sdW1ucyBkZWZpbml0aW9uOlxuICAgICAgWyBcblxuICAgICAgICB7IGtleTogXCJuYW1lXCIsbGFiZWw6IFwiTmFtZVwiLCBzb3J0YWJsZTogdHJ1ZSB9LFxuICAgICAgICB7IGtleTogXCJlbWFpbFwiLGxhYmVsOiBcIkVtYWlsXCIsIHNvcnRhYmxlOiB0cnVlIH0sXG4gICAgICAgIHsga2V5OiBcInR5cGVcIixsYWJlbDogXCJUeXBlXCIsIHNvcnRhYmxlOiB0cnVlIH1cblxuXG4gICAgICBdLFxuICAgICAgLy8gT3RoZXIgY29uZmlndXJhdGlvbjpcbiAgICAgIHtcbiAgICAgICAgLy8gQWRkcmVzcyBvZiB0aGUgd2Vic2VydmVyIHN1cHBseWluZyB0aGUgZGF0YVxuICAgICAgICB1cmw6ICcvYXBpL3YxL3VzZXJzJyxcbiAgICAgICAgYXV0aG9yaXphdGlvbjogQXV0aC50b2tlbigpLFxuICAgICAgICAvLyBIYW5kbGVyIG9mIGNsaWNrIGV2ZW50IG9uIGRhdGEgY2VsbFxuICAgICAgICAvLyBJdCByZWNlaXZlcyB0aGUgcmVsZXZhbnQgaW5mb3JtYXRpb24gYWxyZWFkeSByZXNvbHZlZFxuICAgICAgICBvbkNlbGxDbGljazogZnVuY3Rpb24gKGNvbnRlbnQsIHJvdywgY29sKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coY29udGVudCwgcm93LCBjb2wpO1xuICAgICAgICAgICAgICAvLyBtLnJvdXRlKFwiL3VzZXJcIix7aWQ6cm93LmlkfSlcbiAgICAgICAgICAgICAgbS5yb3V0ZShcIi91c2VyRWRpdFwiLHtpZDpyb3cuaWR9KVxuICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICAgIFxuICB9LCBcblxuICB2aWV3OiBmdW5jdGlvbiAoY3RybCkge1xuICAgIHJldHVybiBbTmF2YmFyLCBtKCcuY29udGFpbmVyJywgW1xuICAgICAgbSgnaDEnLCAnVXNlcnMnKSxcbiAgICAgIG0oXCJhW2hyZWY9Jz8vdXNlckVkaXQnXVtjbGFzcz0nYnRuIGJ0bi1wcmltYXJ5IGZsb2F0LXJpZ2h0J11cIixcIk5ldyBVc2VyXCIpLFxuICAgICAgbWMuRGF0YXRhYmxlLnZpZXcoY3RybC5kYXRhdGFibGUsIHtcbiAgICAgICAgY2FwdGlvbjogJ3RoaXMgaXMgbXkgVXNlcnMnXG4gICAgICB9KVxuICAgIF0pXTtcbiAgfVxufTsiLCJcblxudmFyIE5hdmJhciA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvTmF2YmFyLmpzJyk7XG52YXIgQXV0aCA9IHJlcXVpcmUoJy4uL21vZGVscy9BdXRoLmpzJyk7XG5cbnZhciBWZXJpZnkgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKXtcbiAgICB2YXIgY3RybCA9IHRoaXM7XG4gICAgY3RybC5uYXZiYXIgPSBuZXcgTmF2YmFyLmNvbnRyb2xsZXIoKTtcbiAgICBjdHJsLm1lc3NhZ2UgPSBtLnByb3AoKTtcbiAgICBBdXRoLnZlcmlmeShtLnJvdXRlLnBhcmFtKFwiY29kZVwiKSkudGhlbihmdW5jdGlvbigpe1xuICAgICAgY3RybC5tZXNzYWdlKFtcbiAgICAgICAgJ1N3ZWV0LiBOb3csIHlvdSBjYW4gJyxcbiAgICAgICAgbSgnYVtocmVmPVwiL2xvZ2luXCJdJywge2NvbmZpZzogbS5yb3V0ZX0sICdsb2dpbicpLFxuICAgICAgICAnLidcbiAgICAgIF0pO1xuICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICBjdHJsLm1lc3NhZ2UoJ0htbSwgdGhlcmUgd2FzIHNvbWV0aGluZyB3cm9uZyB3aXRoIHRoYXQgY29kZS4gQ2hlY2sgeW91ciBlbWFpbCBhZ2Fpbi4nKTtcbiAgICB9KTtcbiAgfSxcbiAgXG4gIHZpZXc6IGZ1bmN0aW9uKGN0cmwpe1xuICAgIHJldHVybiBbTmF2YmFyLnZpZXcoY3RybC5uYXZiYXIpLCBtKCcuY29udGFpbmVyJywgW1xuICAgICAgbSgnaDEnLCAndmVyaWZ5JyksXG4gICAgICBjdHJsLm1lc3NhZ2UoKVxuICAgIF0pXTtcbiAgfVxufTsiXX0=
