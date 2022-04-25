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
      url: '/auth/login',
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

  // signup on the server for new login credentials
  register: function(email, password,name,type){
    return m.request({
      method: 'POST',
      url: '/users',
      data: {user:{email:email, password:password,type:type,name: name}}
    });
  },

  // ensure verify token is correct
  verify: function(token){
    return m.request({
      method: 'POST',
      url: '/auth/verify',
      data: {token: token}
    });
  },

  // get current user object
  user: function(){
    return Auth.req('/users/me');
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
          ctrl.error(m(".alert.alert-danger.animated.fadeInUp", err.message));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS91bmRlcnNjb3JlLXVtZC5qcyIsInB1YmxpYy9zY3JpcHRzL2NvbXBvbmVudHMvRGF0YVRhYmxlLmpzIiwicHVibGljL3NjcmlwdHMvY29tcG9uZW50cy9OYXZiYXIuanMiLCJwdWJsaWMvc2NyaXB0cy9jb21wb25lbnRzL1F1ZXN0aW9uV2lkZ2V0LmpzIiwicHVibGljL3NjcmlwdHMvY29tcG9uZW50cy9RdWVzdGlvbnMuanMiLCJwdWJsaWMvc2NyaXB0cy9tYWluLmpzIiwicHVibGljL3NjcmlwdHMvbW9kZWxzL0F1dGguanMiLCJwdWJsaWMvc2NyaXB0cy9tb2RlbHMvVGVzdC5qcyIsInB1YmxpYy9zY3JpcHRzL21vZGVscy9Vc2VyLmpzIiwicHVibGljL3NjcmlwdHMvcGFnZXMvTG9naW4uanMiLCJwdWJsaWMvc2NyaXB0cy9wYWdlcy9Mb2dvdXQuanMiLCJwdWJsaWMvc2NyaXB0cy9wYWdlcy9UZXN0RWRpdC5qcyIsInB1YmxpYy9zY3JpcHRzL3BhZ2VzL1Rlc3RQYWdlLmpzIiwicHVibGljL3NjcmlwdHMvcGFnZXMvVGVzdHMuanMiLCJwdWJsaWMvc2NyaXB0cy9wYWdlcy9Vc2VyRWRpdC5qcyIsInB1YmxpYy9zY3JpcHRzL3BhZ2VzL1VzZXJQYWdlLmpzIiwicHVibGljL3NjcmlwdHMvcGFnZXMvVXNlcnMuanMiLCJwdWJsaWMvc2NyaXB0cy9wYWdlcy9WZXJpZnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDMS9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoJ3VuZGVyc2NvcmUnLCBmYWN0b3J5KSA6XG4gIChnbG9iYWwgPSB0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWxUaGlzIDogZ2xvYmFsIHx8IHNlbGYsIChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGN1cnJlbnQgPSBnbG9iYWwuXztcbiAgICB2YXIgZXhwb3J0cyA9IGdsb2JhbC5fID0gZmFjdG9yeSgpO1xuICAgIGV4cG9ydHMubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHsgZ2xvYmFsLl8gPSBjdXJyZW50OyByZXR1cm4gZXhwb3J0czsgfTtcbiAgfSgpKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7XG4gIC8vICAgICBVbmRlcnNjb3JlLmpzIDEuMTMuMlxuICAvLyAgICAgaHR0cHM6Ly91bmRlcnNjb3JlanMub3JnXG4gIC8vICAgICAoYykgMjAwOS0yMDIxIEplcmVteSBBc2hrZW5hcywgSnVsaWFuIEdvbmdncmlqcCwgYW5kIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICAvLyAgICAgVW5kZXJzY29yZSBtYXkgYmUgZnJlZWx5IGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cblxuICAvLyBDdXJyZW50IHZlcnNpb24uXG4gIHZhciBWRVJTSU9OID0gJzEuMTMuMic7XG5cbiAgLy8gRXN0YWJsaXNoIHRoZSByb290IG9iamVjdCwgYHdpbmRvd2AgKGBzZWxmYCkgaW4gdGhlIGJyb3dzZXIsIGBnbG9iYWxgXG4gIC8vIG9uIHRoZSBzZXJ2ZXIsIG9yIGB0aGlzYCBpbiBzb21lIHZpcnR1YWwgbWFjaGluZXMuIFdlIHVzZSBgc2VsZmBcbiAgLy8gaW5zdGVhZCBvZiBgd2luZG93YCBmb3IgYFdlYldvcmtlcmAgc3VwcG9ydC5cbiAgdmFyIHJvb3QgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmLnNlbGYgPT09IHNlbGYgJiYgc2VsZiB8fFxuICAgICAgICAgICAgdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwuZ2xvYmFsID09PSBnbG9iYWwgJiYgZ2xvYmFsIHx8XG4gICAgICAgICAgICBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpIHx8XG4gICAgICAgICAgICB7fTtcblxuICAvLyBTYXZlIGJ5dGVzIGluIHRoZSBtaW5pZmllZCAoYnV0IG5vdCBnemlwcGVkKSB2ZXJzaW9uOlxuICB2YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZSwgT2JqUHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgU3ltYm9sUHJvdG8gPSB0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyA/IFN5bWJvbC5wcm90b3R5cGUgOiBudWxsO1xuXG4gIC8vIENyZWF0ZSBxdWljayByZWZlcmVuY2UgdmFyaWFibGVzIGZvciBzcGVlZCBhY2Nlc3MgdG8gY29yZSBwcm90b3R5cGVzLlxuICB2YXIgcHVzaCA9IEFycmF5UHJvdG8ucHVzaCxcbiAgICAgIHNsaWNlID0gQXJyYXlQcm90by5zbGljZSxcbiAgICAgIHRvU3RyaW5nID0gT2JqUHJvdG8udG9TdHJpbmcsXG4gICAgICBoYXNPd25Qcm9wZXJ0eSA9IE9ialByb3RvLmhhc093blByb3BlcnR5O1xuXG4gIC8vIE1vZGVybiBmZWF0dXJlIGRldGVjdGlvbi5cbiAgdmFyIHN1cHBvcnRzQXJyYXlCdWZmZXIgPSB0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnLFxuICAgICAgc3VwcG9ydHNEYXRhVmlldyA9IHR5cGVvZiBEYXRhVmlldyAhPT0gJ3VuZGVmaW5lZCc7XG5cbiAgLy8gQWxsICoqRUNNQVNjcmlwdCA1KyoqIG5hdGl2ZSBmdW5jdGlvbiBpbXBsZW1lbnRhdGlvbnMgdGhhdCB3ZSBob3BlIHRvIHVzZVxuICAvLyBhcmUgZGVjbGFyZWQgaGVyZS5cbiAgdmFyIG5hdGl2ZUlzQXJyYXkgPSBBcnJheS5pc0FycmF5LFxuICAgICAgbmF0aXZlS2V5cyA9IE9iamVjdC5rZXlzLFxuICAgICAgbmF0aXZlQ3JlYXRlID0gT2JqZWN0LmNyZWF0ZSxcbiAgICAgIG5hdGl2ZUlzVmlldyA9IHN1cHBvcnRzQXJyYXlCdWZmZXIgJiYgQXJyYXlCdWZmZXIuaXNWaWV3O1xuXG4gIC8vIENyZWF0ZSByZWZlcmVuY2VzIHRvIHRoZXNlIGJ1aWx0aW4gZnVuY3Rpb25zIGJlY2F1c2Ugd2Ugb3ZlcnJpZGUgdGhlbS5cbiAgdmFyIF9pc05hTiA9IGlzTmFOLFxuICAgICAgX2lzRmluaXRlID0gaXNGaW5pdGU7XG5cbiAgLy8gS2V5cyBpbiBJRSA8IDkgdGhhdCB3b24ndCBiZSBpdGVyYXRlZCBieSBgZm9yIGtleSBpbiAuLi5gIGFuZCB0aHVzIG1pc3NlZC5cbiAgdmFyIGhhc0VudW1CdWcgPSAhe3RvU3RyaW5nOiBudWxsfS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgndG9TdHJpbmcnKTtcbiAgdmFyIG5vbkVudW1lcmFibGVQcm9wcyA9IFsndmFsdWVPZicsICdpc1Byb3RvdHlwZU9mJywgJ3RvU3RyaW5nJyxcbiAgICAncHJvcGVydHlJc0VudW1lcmFibGUnLCAnaGFzT3duUHJvcGVydHknLCAndG9Mb2NhbGVTdHJpbmcnXTtcblxuICAvLyBUaGUgbGFyZ2VzdCBpbnRlZ2VyIHRoYXQgY2FuIGJlIHJlcHJlc2VudGVkIGV4YWN0bHkuXG4gIHZhciBNQVhfQVJSQVlfSU5ERVggPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuXG4gIC8vIFNvbWUgZnVuY3Rpb25zIHRha2UgYSB2YXJpYWJsZSBudW1iZXIgb2YgYXJndW1lbnRzLCBvciBhIGZldyBleHBlY3RlZFxuICAvLyBhcmd1bWVudHMgYXQgdGhlIGJlZ2lubmluZyBhbmQgdGhlbiBhIHZhcmlhYmxlIG51bWJlciBvZiB2YWx1ZXMgdG8gb3BlcmF0ZVxuICAvLyBvbi4gVGhpcyBoZWxwZXIgYWNjdW11bGF0ZXMgYWxsIHJlbWFpbmluZyBhcmd1bWVudHMgcGFzdCB0aGUgZnVuY3Rpb27igJlzXG4gIC8vIGFyZ3VtZW50IGxlbmd0aCAob3IgYW4gZXhwbGljaXQgYHN0YXJ0SW5kZXhgKSwgaW50byBhbiBhcnJheSB0aGF0IGJlY29tZXNcbiAgLy8gdGhlIGxhc3QgYXJndW1lbnQuIFNpbWlsYXIgdG8gRVM24oCZcyBcInJlc3QgcGFyYW1ldGVyXCIuXG4gIGZ1bmN0aW9uIHJlc3RBcmd1bWVudHMoZnVuYywgc3RhcnRJbmRleCkge1xuICAgIHN0YXJ0SW5kZXggPSBzdGFydEluZGV4ID09IG51bGwgPyBmdW5jLmxlbmd0aCAtIDEgOiArc3RhcnRJbmRleDtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbGVuZ3RoID0gTWF0aC5tYXgoYXJndW1lbnRzLmxlbmd0aCAtIHN0YXJ0SW5kZXgsIDApLFxuICAgICAgICAgIHJlc3QgPSBBcnJheShsZW5ndGgpLFxuICAgICAgICAgIGluZGV4ID0gMDtcbiAgICAgIGZvciAoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICByZXN0W2luZGV4XSA9IGFyZ3VtZW50c1tpbmRleCArIHN0YXJ0SW5kZXhdO1xuICAgICAgfVxuICAgICAgc3dpdGNoIChzdGFydEluZGV4KSB7XG4gICAgICAgIGNhc2UgMDogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLCByZXN0KTtcbiAgICAgICAgY2FzZSAxOiByZXR1cm4gZnVuYy5jYWxsKHRoaXMsIGFyZ3VtZW50c1swXSwgcmVzdCk7XG4gICAgICAgIGNhc2UgMjogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLCBhcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSwgcmVzdCk7XG4gICAgICB9XG4gICAgICB2YXIgYXJncyA9IEFycmF5KHN0YXJ0SW5kZXggKyAxKTtcbiAgICAgIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IHN0YXJ0SW5kZXg7IGluZGV4KyspIHtcbiAgICAgICAgYXJnc1tpbmRleF0gPSBhcmd1bWVudHNbaW5kZXhdO1xuICAgICAgfVxuICAgICAgYXJnc1tzdGFydEluZGV4XSA9IHJlc3Q7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gSXMgYSBnaXZlbiB2YXJpYWJsZSBhbiBvYmplY3Q/XG4gIGZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuICAgIHZhciB0eXBlID0gdHlwZW9mIG9iajtcbiAgICByZXR1cm4gdHlwZSA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlID09PSAnb2JqZWN0JyAmJiAhIW9iajtcbiAgfVxuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgZXF1YWwgdG8gbnVsbD9cbiAgZnVuY3Rpb24gaXNOdWxsKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IG51bGw7XG4gIH1cblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIHVuZGVmaW5lZD9cbiAgZnVuY3Rpb24gaXNVbmRlZmluZWQob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdm9pZCAwO1xuICB9XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIGJvb2xlYW4/XG4gIGZ1bmN0aW9uIGlzQm9vbGVhbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB0cnVlIHx8IG9iaiA9PT0gZmFsc2UgfHwgdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBCb29sZWFuXSc7XG4gIH1cblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgRE9NIGVsZW1lbnQ/XG4gIGZ1bmN0aW9uIGlzRWxlbWVudChvYmopIHtcbiAgICByZXR1cm4gISEob2JqICYmIG9iai5ub2RlVHlwZSA9PT0gMSk7XG4gIH1cblxuICAvLyBJbnRlcm5hbCBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgYSBgdG9TdHJpbmdgLWJhc2VkIHR5cGUgdGVzdGVyLlxuICBmdW5jdGlvbiB0YWdUZXN0ZXIobmFtZSkge1xuICAgIHZhciB0YWcgPSAnW29iamVjdCAnICsgbmFtZSArICddJztcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSB0YWc7XG4gICAgfTtcbiAgfVxuXG4gIHZhciBpc1N0cmluZyA9IHRhZ1Rlc3RlcignU3RyaW5nJyk7XG5cbiAgdmFyIGlzTnVtYmVyID0gdGFnVGVzdGVyKCdOdW1iZXInKTtcblxuICB2YXIgaXNEYXRlID0gdGFnVGVzdGVyKCdEYXRlJyk7XG5cbiAgdmFyIGlzUmVnRXhwID0gdGFnVGVzdGVyKCdSZWdFeHAnKTtcblxuICB2YXIgaXNFcnJvciA9IHRhZ1Rlc3RlcignRXJyb3InKTtcblxuICB2YXIgaXNTeW1ib2wgPSB0YWdUZXN0ZXIoJ1N5bWJvbCcpO1xuXG4gIHZhciBpc0FycmF5QnVmZmVyID0gdGFnVGVzdGVyKCdBcnJheUJ1ZmZlcicpO1xuXG4gIHZhciBpc0Z1bmN0aW9uID0gdGFnVGVzdGVyKCdGdW5jdGlvbicpO1xuXG4gIC8vIE9wdGltaXplIGBpc0Z1bmN0aW9uYCBpZiBhcHByb3ByaWF0ZS4gV29yayBhcm91bmQgc29tZSBgdHlwZW9mYCBidWdzIGluIG9sZFxuICAvLyB2OCwgSUUgMTEgKCMxNjIxKSwgU2FmYXJpIDggKCMxOTI5KSwgYW5kIFBoYW50b21KUyAoIzIyMzYpLlxuICB2YXIgbm9kZWxpc3QgPSByb290LmRvY3VtZW50ICYmIHJvb3QuZG9jdW1lbnQuY2hpbGROb2RlcztcbiAgaWYgKHR5cGVvZiAvLi8gIT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgSW50OEFycmF5ICE9ICdvYmplY3QnICYmIHR5cGVvZiBub2RlbGlzdCAhPSAnZnVuY3Rpb24nKSB7XG4gICAgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT0gJ2Z1bmN0aW9uJyB8fCBmYWxzZTtcbiAgICB9O1xuICB9XG5cbiAgdmFyIGlzRnVuY3Rpb24kMSA9IGlzRnVuY3Rpb247XG5cbiAgdmFyIGhhc09iamVjdFRhZyA9IHRhZ1Rlc3RlcignT2JqZWN0Jyk7XG5cbiAgLy8gSW4gSUUgMTAgLSBFZGdlIDEzLCBgRGF0YVZpZXdgIGhhcyBzdHJpbmcgdGFnIGAnW29iamVjdCBPYmplY3RdJ2AuXG4gIC8vIEluIElFIDExLCB0aGUgbW9zdCBjb21tb24gYW1vbmcgdGhlbSwgdGhpcyBwcm9ibGVtIGFsc28gYXBwbGllcyB0b1xuICAvLyBgTWFwYCwgYFdlYWtNYXBgIGFuZCBgU2V0YC5cbiAgdmFyIGhhc1N0cmluZ1RhZ0J1ZyA9IChcbiAgICAgICAgc3VwcG9ydHNEYXRhVmlldyAmJiBoYXNPYmplY3RUYWcobmV3IERhdGFWaWV3KG5ldyBBcnJheUJ1ZmZlcig4KSkpXG4gICAgICApLFxuICAgICAgaXNJRTExID0gKHR5cGVvZiBNYXAgIT09ICd1bmRlZmluZWQnICYmIGhhc09iamVjdFRhZyhuZXcgTWFwKSk7XG5cbiAgdmFyIGlzRGF0YVZpZXcgPSB0YWdUZXN0ZXIoJ0RhdGFWaWV3Jyk7XG5cbiAgLy8gSW4gSUUgMTAgLSBFZGdlIDEzLCB3ZSBuZWVkIGEgZGlmZmVyZW50IGhldXJpc3RpY1xuICAvLyB0byBkZXRlcm1pbmUgd2hldGhlciBhbiBvYmplY3QgaXMgYSBgRGF0YVZpZXdgLlxuICBmdW5jdGlvbiBpZTEwSXNEYXRhVmlldyhvYmopIHtcbiAgICByZXR1cm4gb2JqICE9IG51bGwgJiYgaXNGdW5jdGlvbiQxKG9iai5nZXRJbnQ4KSAmJiBpc0FycmF5QnVmZmVyKG9iai5idWZmZXIpO1xuICB9XG5cbiAgdmFyIGlzRGF0YVZpZXckMSA9IChoYXNTdHJpbmdUYWdCdWcgPyBpZTEwSXNEYXRhVmlldyA6IGlzRGF0YVZpZXcpO1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYW4gYXJyYXk/XG4gIC8vIERlbGVnYXRlcyB0byBFQ01BNSdzIG5hdGl2ZSBgQXJyYXkuaXNBcnJheWAuXG4gIHZhciBpc0FycmF5ID0gbmF0aXZlSXNBcnJheSB8fCB0YWdUZXN0ZXIoJ0FycmF5Jyk7XG5cbiAgLy8gSW50ZXJuYWwgZnVuY3Rpb24gdG8gY2hlY2sgd2hldGhlciBga2V5YCBpcyBhbiBvd24gcHJvcGVydHkgbmFtZSBvZiBgb2JqYC5cbiAgZnVuY3Rpb24gaGFzJDEob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gb2JqICE9IG51bGwgJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSk7XG4gIH1cblxuICB2YXIgaXNBcmd1bWVudHMgPSB0YWdUZXN0ZXIoJ0FyZ3VtZW50cycpO1xuXG4gIC8vIERlZmluZSBhIGZhbGxiYWNrIHZlcnNpb24gb2YgdGhlIG1ldGhvZCBpbiBicm93c2VycyAoYWhlbSwgSUUgPCA5KSwgd2hlcmVcbiAgLy8gdGhlcmUgaXNuJ3QgYW55IGluc3BlY3RhYmxlIFwiQXJndW1lbnRzXCIgdHlwZS5cbiAgKGZ1bmN0aW9uKCkge1xuICAgIGlmICghaXNBcmd1bWVudHMoYXJndW1lbnRzKSkge1xuICAgICAgaXNBcmd1bWVudHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgcmV0dXJuIGhhcyQxKG9iaiwgJ2NhbGxlZScpO1xuICAgICAgfTtcbiAgICB9XG4gIH0oKSk7XG5cbiAgdmFyIGlzQXJndW1lbnRzJDEgPSBpc0FyZ3VtZW50cztcblxuICAvLyBJcyBhIGdpdmVuIG9iamVjdCBhIGZpbml0ZSBudW1iZXI/XG4gIGZ1bmN0aW9uIGlzRmluaXRlJDEob2JqKSB7XG4gICAgcmV0dXJuICFpc1N5bWJvbChvYmopICYmIF9pc0Zpbml0ZShvYmopICYmICFpc05hTihwYXJzZUZsb2F0KG9iaikpO1xuICB9XG5cbiAgLy8gSXMgdGhlIGdpdmVuIHZhbHVlIGBOYU5gP1xuICBmdW5jdGlvbiBpc05hTiQxKG9iaikge1xuICAgIHJldHVybiBpc051bWJlcihvYmopICYmIF9pc05hTihvYmopO1xuICB9XG5cbiAgLy8gUHJlZGljYXRlLWdlbmVyYXRpbmcgZnVuY3Rpb24uIE9mdGVuIHVzZWZ1bCBvdXRzaWRlIG9mIFVuZGVyc2NvcmUuXG4gIGZ1bmN0aW9uIGNvbnN0YW50KHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG4gIH1cblxuICAvLyBDb21tb24gaW50ZXJuYWwgbG9naWMgZm9yIGBpc0FycmF5TGlrZWAgYW5kIGBpc0J1ZmZlckxpa2VgLlxuICBmdW5jdGlvbiBjcmVhdGVTaXplUHJvcGVydHlDaGVjayhnZXRTaXplUHJvcGVydHkpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgdmFyIHNpemVQcm9wZXJ0eSA9IGdldFNpemVQcm9wZXJ0eShjb2xsZWN0aW9uKTtcbiAgICAgIHJldHVybiB0eXBlb2Ygc2l6ZVByb3BlcnR5ID09ICdudW1iZXInICYmIHNpemVQcm9wZXJ0eSA+PSAwICYmIHNpemVQcm9wZXJ0eSA8PSBNQVhfQVJSQVlfSU5ERVg7XG4gICAgfVxuICB9XG5cbiAgLy8gSW50ZXJuYWwgaGVscGVyIHRvIGdlbmVyYXRlIGEgZnVuY3Rpb24gdG8gb2J0YWluIHByb3BlcnR5IGBrZXlgIGZyb20gYG9iamAuXG4gIGZ1bmN0aW9uIHNoYWxsb3dQcm9wZXJ0eShrZXkpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqID09IG51bGwgPyB2b2lkIDAgOiBvYmpba2V5XTtcbiAgICB9O1xuICB9XG5cbiAgLy8gSW50ZXJuYWwgaGVscGVyIHRvIG9idGFpbiB0aGUgYGJ5dGVMZW5ndGhgIHByb3BlcnR5IG9mIGFuIG9iamVjdC5cbiAgdmFyIGdldEJ5dGVMZW5ndGggPSBzaGFsbG93UHJvcGVydHkoJ2J5dGVMZW5ndGgnKTtcblxuICAvLyBJbnRlcm5hbCBoZWxwZXIgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgd2Ugc2hvdWxkIHNwZW5kIGV4dGVuc2l2ZSBjaGVja3MgYWdhaW5zdFxuICAvLyBgQXJyYXlCdWZmZXJgIGV0IGFsLlxuICB2YXIgaXNCdWZmZXJMaWtlID0gY3JlYXRlU2l6ZVByb3BlcnR5Q2hlY2soZ2V0Qnl0ZUxlbmd0aCk7XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIHR5cGVkIGFycmF5P1xuICB2YXIgdHlwZWRBcnJheVBhdHRlcm4gPSAvXFxbb2JqZWN0ICgoSXxVaSludCg4fDE2fDMyKXxGbG9hdCgzMnw2NCl8VWludDhDbGFtcGVkfEJpZyhJfFVpKW50NjQpQXJyYXlcXF0vO1xuICBmdW5jdGlvbiBpc1R5cGVkQXJyYXkob2JqKSB7XG4gICAgLy8gYEFycmF5QnVmZmVyLmlzVmlld2AgaXMgdGhlIG1vc3QgZnV0dXJlLXByb29mLCBzbyB1c2UgaXQgd2hlbiBhdmFpbGFibGUuXG4gICAgLy8gT3RoZXJ3aXNlLCBmYWxsIGJhY2sgb24gdGhlIGFib3ZlIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAgICByZXR1cm4gbmF0aXZlSXNWaWV3ID8gKG5hdGl2ZUlzVmlldyhvYmopICYmICFpc0RhdGFWaWV3JDEob2JqKSkgOlxuICAgICAgICAgICAgICAgICAgaXNCdWZmZXJMaWtlKG9iaikgJiYgdHlwZWRBcnJheVBhdHRlcm4udGVzdCh0b1N0cmluZy5jYWxsKG9iaikpO1xuICB9XG5cbiAgdmFyIGlzVHlwZWRBcnJheSQxID0gc3VwcG9ydHNBcnJheUJ1ZmZlciA/IGlzVHlwZWRBcnJheSA6IGNvbnN0YW50KGZhbHNlKTtcblxuICAvLyBJbnRlcm5hbCBoZWxwZXIgdG8gb2J0YWluIHRoZSBgbGVuZ3RoYCBwcm9wZXJ0eSBvZiBhbiBvYmplY3QuXG4gIHZhciBnZXRMZW5ndGggPSBzaGFsbG93UHJvcGVydHkoJ2xlbmd0aCcpO1xuXG4gIC8vIEludGVybmFsIGhlbHBlciB0byBjcmVhdGUgYSBzaW1wbGUgbG9va3VwIHN0cnVjdHVyZS5cbiAgLy8gYGNvbGxlY3ROb25FbnVtUHJvcHNgIHVzZWQgdG8gZGVwZW5kIG9uIGBfLmNvbnRhaW5zYCwgYnV0IHRoaXMgbGVkIHRvXG4gIC8vIGNpcmN1bGFyIGltcG9ydHMuIGBlbXVsYXRlZFNldGAgaXMgYSBvbmUtb2ZmIHNvbHV0aW9uIHRoYXQgb25seSB3b3JrcyBmb3JcbiAgLy8gYXJyYXlzIG9mIHN0cmluZ3MuXG4gIGZ1bmN0aW9uIGVtdWxhdGVkU2V0KGtleXMpIHtcbiAgICB2YXIgaGFzaCA9IHt9O1xuICAgIGZvciAodmFyIGwgPSBrZXlzLmxlbmd0aCwgaSA9IDA7IGkgPCBsOyArK2kpIGhhc2hba2V5c1tpXV0gPSB0cnVlO1xuICAgIHJldHVybiB7XG4gICAgICBjb250YWluczogZnVuY3Rpb24oa2V5KSB7IHJldHVybiBoYXNoW2tleV0gPT09IHRydWU7IH0sXG4gICAgICBwdXNoOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgaGFzaFtrZXldID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGtleXMucHVzaChrZXkpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBJbnRlcm5hbCBoZWxwZXIuIENoZWNrcyBga2V5c2AgZm9yIHRoZSBwcmVzZW5jZSBvZiBrZXlzIGluIElFIDwgOSB0aGF0IHdvbid0XG4gIC8vIGJlIGl0ZXJhdGVkIGJ5IGBmb3Iga2V5IGluIC4uLmAgYW5kIHRodXMgbWlzc2VkLiBFeHRlbmRzIGBrZXlzYCBpbiBwbGFjZSBpZlxuICAvLyBuZWVkZWQuXG4gIGZ1bmN0aW9uIGNvbGxlY3ROb25FbnVtUHJvcHMob2JqLCBrZXlzKSB7XG4gICAga2V5cyA9IGVtdWxhdGVkU2V0KGtleXMpO1xuICAgIHZhciBub25FbnVtSWR4ID0gbm9uRW51bWVyYWJsZVByb3BzLmxlbmd0aDtcbiAgICB2YXIgY29uc3RydWN0b3IgPSBvYmouY29uc3RydWN0b3I7XG4gICAgdmFyIHByb3RvID0gaXNGdW5jdGlvbiQxKGNvbnN0cnVjdG9yKSAmJiBjb25zdHJ1Y3Rvci5wcm90b3R5cGUgfHwgT2JqUHJvdG87XG5cbiAgICAvLyBDb25zdHJ1Y3RvciBpcyBhIHNwZWNpYWwgY2FzZS5cbiAgICB2YXIgcHJvcCA9ICdjb25zdHJ1Y3Rvcic7XG4gICAgaWYgKGhhcyQxKG9iaiwgcHJvcCkgJiYgIWtleXMuY29udGFpbnMocHJvcCkpIGtleXMucHVzaChwcm9wKTtcblxuICAgIHdoaWxlIChub25FbnVtSWR4LS0pIHtcbiAgICAgIHByb3AgPSBub25FbnVtZXJhYmxlUHJvcHNbbm9uRW51bUlkeF07XG4gICAgICBpZiAocHJvcCBpbiBvYmogJiYgb2JqW3Byb3BdICE9PSBwcm90b1twcm9wXSAmJiAha2V5cy5jb250YWlucyhwcm9wKSkge1xuICAgICAgICBrZXlzLnB1c2gocHJvcCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gUmV0cmlldmUgdGhlIG5hbWVzIG9mIGFuIG9iamVjdCdzIG93biBwcm9wZXJ0aWVzLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgT2JqZWN0LmtleXNgLlxuICBmdW5jdGlvbiBrZXlzKG9iaikge1xuICAgIGlmICghaXNPYmplY3Qob2JqKSkgcmV0dXJuIFtdO1xuICAgIGlmIChuYXRpdmVLZXlzKSByZXR1cm4gbmF0aXZlS2V5cyhvYmopO1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKGhhcyQxKG9iaiwga2V5KSkga2V5cy5wdXNoKGtleSk7XG4gICAgLy8gQWhlbSwgSUUgPCA5LlxuICAgIGlmIChoYXNFbnVtQnVnKSBjb2xsZWN0Tm9uRW51bVByb3BzKG9iaiwga2V5cyk7XG4gICAgcmV0dXJuIGtleXM7XG4gIH1cblxuICAvLyBJcyBhIGdpdmVuIGFycmF5LCBzdHJpbmcsIG9yIG9iamVjdCBlbXB0eT9cbiAgLy8gQW4gXCJlbXB0eVwiIG9iamVjdCBoYXMgbm8gZW51bWVyYWJsZSBvd24tcHJvcGVydGllcy5cbiAgZnVuY3Rpb24gaXNFbXB0eShvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiB0cnVlO1xuICAgIC8vIFNraXAgdGhlIG1vcmUgZXhwZW5zaXZlIGB0b1N0cmluZ2AtYmFzZWQgdHlwZSBjaGVja3MgaWYgYG9iamAgaGFzIG5vXG4gICAgLy8gYC5sZW5ndGhgLlxuICAgIHZhciBsZW5ndGggPSBnZXRMZW5ndGgob2JqKTtcbiAgICBpZiAodHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJyAmJiAoXG4gICAgICBpc0FycmF5KG9iaikgfHwgaXNTdHJpbmcob2JqKSB8fCBpc0FyZ3VtZW50cyQxKG9iailcbiAgICApKSByZXR1cm4gbGVuZ3RoID09PSAwO1xuICAgIHJldHVybiBnZXRMZW5ndGgoa2V5cyhvYmopKSA9PT0gMDtcbiAgfVxuXG4gIC8vIFJldHVybnMgd2hldGhlciBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gc2V0IG9mIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBmdW5jdGlvbiBpc01hdGNoKG9iamVjdCwgYXR0cnMpIHtcbiAgICB2YXIgX2tleXMgPSBrZXlzKGF0dHJzKSwgbGVuZ3RoID0gX2tleXMubGVuZ3RoO1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCkgcmV0dXJuICFsZW5ndGg7XG4gICAgdmFyIG9iaiA9IE9iamVjdChvYmplY3QpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBrZXkgPSBfa2V5c1tpXTtcbiAgICAgIGlmIChhdHRyc1trZXldICE9PSBvYmpba2V5XSB8fCAhKGtleSBpbiBvYmopKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gSWYgVW5kZXJzY29yZSBpcyBjYWxsZWQgYXMgYSBmdW5jdGlvbiwgaXQgcmV0dXJucyBhIHdyYXBwZWQgb2JqZWN0IHRoYXQgY2FuXG4gIC8vIGJlIHVzZWQgT08tc3R5bGUuIFRoaXMgd3JhcHBlciBob2xkcyBhbHRlcmVkIHZlcnNpb25zIG9mIGFsbCBmdW5jdGlvbnMgYWRkZWRcbiAgLy8gdGhyb3VnaCBgXy5taXhpbmAuIFdyYXBwZWQgb2JqZWN0cyBtYXkgYmUgY2hhaW5lZC5cbiAgZnVuY3Rpb24gXyQxKG9iaikge1xuICAgIGlmIChvYmogaW5zdGFuY2VvZiBfJDEpIHJldHVybiBvYmo7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIF8kMSkpIHJldHVybiBuZXcgXyQxKG9iaik7XG4gICAgdGhpcy5fd3JhcHBlZCA9IG9iajtcbiAgfVxuXG4gIF8kMS5WRVJTSU9OID0gVkVSU0lPTjtcblxuICAvLyBFeHRyYWN0cyB0aGUgcmVzdWx0IGZyb20gYSB3cmFwcGVkIGFuZCBjaGFpbmVkIG9iamVjdC5cbiAgXyQxLnByb3RvdHlwZS52YWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl93cmFwcGVkO1xuICB9O1xuXG4gIC8vIFByb3ZpZGUgdW53cmFwcGluZyBwcm94aWVzIGZvciBzb21lIG1ldGhvZHMgdXNlZCBpbiBlbmdpbmUgb3BlcmF0aW9uc1xuICAvLyBzdWNoIGFzIGFyaXRobWV0aWMgYW5kIEpTT04gc3RyaW5naWZpY2F0aW9uLlxuICBfJDEucHJvdG90eXBlLnZhbHVlT2YgPSBfJDEucHJvdG90eXBlLnRvSlNPTiA9IF8kMS5wcm90b3R5cGUudmFsdWU7XG5cbiAgXyQxLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBTdHJpbmcodGhpcy5fd3JhcHBlZCk7XG4gIH07XG5cbiAgLy8gSW50ZXJuYWwgZnVuY3Rpb24gdG8gd3JhcCBvciBzaGFsbG93LWNvcHkgYW4gQXJyYXlCdWZmZXIsXG4gIC8vIHR5cGVkIGFycmF5IG9yIERhdGFWaWV3IHRvIGEgbmV3IHZpZXcsIHJldXNpbmcgdGhlIGJ1ZmZlci5cbiAgZnVuY3Rpb24gdG9CdWZmZXJWaWV3KGJ1ZmZlclNvdXJjZSkge1xuICAgIHJldHVybiBuZXcgVWludDhBcnJheShcbiAgICAgIGJ1ZmZlclNvdXJjZS5idWZmZXIgfHwgYnVmZmVyU291cmNlLFxuICAgICAgYnVmZmVyU291cmNlLmJ5dGVPZmZzZXQgfHwgMCxcbiAgICAgIGdldEJ5dGVMZW5ndGgoYnVmZmVyU291cmNlKVxuICAgICk7XG4gIH1cblxuICAvLyBXZSB1c2UgdGhpcyBzdHJpbmcgdHdpY2UsIHNvIGdpdmUgaXQgYSBuYW1lIGZvciBtaW5pZmljYXRpb24uXG4gIHZhciB0YWdEYXRhVmlldyA9ICdbb2JqZWN0IERhdGFWaWV3XSc7XG5cbiAgLy8gSW50ZXJuYWwgcmVjdXJzaXZlIGNvbXBhcmlzb24gZnVuY3Rpb24gZm9yIGBfLmlzRXF1YWxgLlxuICBmdW5jdGlvbiBlcShhLCBiLCBhU3RhY2ssIGJTdGFjaykge1xuICAgIC8vIElkZW50aWNhbCBvYmplY3RzIGFyZSBlcXVhbC4gYDAgPT09IC0wYCwgYnV0IHRoZXkgYXJlbid0IGlkZW50aWNhbC5cbiAgICAvLyBTZWUgdGhlIFtIYXJtb255IGBlZ2FsYCBwcm9wb3NhbF0oaHR0cHM6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPWhhcm1vbnk6ZWdhbCkuXG4gICAgaWYgKGEgPT09IGIpIHJldHVybiBhICE9PSAwIHx8IDEgLyBhID09PSAxIC8gYjtcbiAgICAvLyBgbnVsbGAgb3IgYHVuZGVmaW5lZGAgb25seSBlcXVhbCB0byBpdHNlbGYgKHN0cmljdCBjb21wYXJpc29uKS5cbiAgICBpZiAoYSA9PSBudWxsIHx8IGIgPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgIC8vIGBOYU5gcyBhcmUgZXF1aXZhbGVudCwgYnV0IG5vbi1yZWZsZXhpdmUuXG4gICAgaWYgKGEgIT09IGEpIHJldHVybiBiICE9PSBiO1xuICAgIC8vIEV4aGF1c3QgcHJpbWl0aXZlIGNoZWNrc1xuICAgIHZhciB0eXBlID0gdHlwZW9mIGE7XG4gICAgaWYgKHR5cGUgIT09ICdmdW5jdGlvbicgJiYgdHlwZSAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIGIgIT0gJ29iamVjdCcpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gZGVlcEVxKGEsIGIsIGFTdGFjaywgYlN0YWNrKTtcbiAgfVxuXG4gIC8vIEludGVybmFsIHJlY3Vyc2l2ZSBjb21wYXJpc29uIGZ1bmN0aW9uIGZvciBgXy5pc0VxdWFsYC5cbiAgZnVuY3Rpb24gZGVlcEVxKGEsIGIsIGFTdGFjaywgYlN0YWNrKSB7XG4gICAgLy8gVW53cmFwIGFueSB3cmFwcGVkIG9iamVjdHMuXG4gICAgaWYgKGEgaW5zdGFuY2VvZiBfJDEpIGEgPSBhLl93cmFwcGVkO1xuICAgIGlmIChiIGluc3RhbmNlb2YgXyQxKSBiID0gYi5fd3JhcHBlZDtcbiAgICAvLyBDb21wYXJlIGBbW0NsYXNzXV1gIG5hbWVzLlxuICAgIHZhciBjbGFzc05hbWUgPSB0b1N0cmluZy5jYWxsKGEpO1xuICAgIGlmIChjbGFzc05hbWUgIT09IHRvU3RyaW5nLmNhbGwoYikpIHJldHVybiBmYWxzZTtcbiAgICAvLyBXb3JrIGFyb3VuZCBhIGJ1ZyBpbiBJRSAxMCAtIEVkZ2UgMTMuXG4gICAgaWYgKGhhc1N0cmluZ1RhZ0J1ZyAmJiBjbGFzc05hbWUgPT0gJ1tvYmplY3QgT2JqZWN0XScgJiYgaXNEYXRhVmlldyQxKGEpKSB7XG4gICAgICBpZiAoIWlzRGF0YVZpZXckMShiKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgY2xhc3NOYW1lID0gdGFnRGF0YVZpZXc7XG4gICAgfVxuICAgIHN3aXRjaCAoY2xhc3NOYW1lKSB7XG4gICAgICAvLyBUaGVzZSB0eXBlcyBhcmUgY29tcGFyZWQgYnkgdmFsdWUuXG4gICAgICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOlxuICAgICAgICAvLyBSZWdFeHBzIGFyZSBjb2VyY2VkIHRvIHN0cmluZ3MgZm9yIGNvbXBhcmlzb24gKE5vdGU6ICcnICsgL2EvaSA9PT0gJy9hL2knKVxuICAgICAgY2FzZSAnW29iamVjdCBTdHJpbmddJzpcbiAgICAgICAgLy8gUHJpbWl0aXZlcyBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBvYmplY3Qgd3JhcHBlcnMgYXJlIGVxdWl2YWxlbnQ7IHRodXMsIGBcIjVcImAgaXNcbiAgICAgICAgLy8gZXF1aXZhbGVudCB0byBgbmV3IFN0cmluZyhcIjVcIilgLlxuICAgICAgICByZXR1cm4gJycgKyBhID09PSAnJyArIGI7XG4gICAgICBjYXNlICdbb2JqZWN0IE51bWJlcl0nOlxuICAgICAgICAvLyBgTmFOYHMgYXJlIGVxdWl2YWxlbnQsIGJ1dCBub24tcmVmbGV4aXZlLlxuICAgICAgICAvLyBPYmplY3QoTmFOKSBpcyBlcXVpdmFsZW50IHRvIE5hTi5cbiAgICAgICAgaWYgKCthICE9PSArYSkgcmV0dXJuICtiICE9PSArYjtcbiAgICAgICAgLy8gQW4gYGVnYWxgIGNvbXBhcmlzb24gaXMgcGVyZm9ybWVkIGZvciBvdGhlciBudW1lcmljIHZhbHVlcy5cbiAgICAgICAgcmV0dXJuICthID09PSAwID8gMSAvICthID09PSAxIC8gYiA6ICthID09PSArYjtcbiAgICAgIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOlxuICAgICAgY2FzZSAnW29iamVjdCBCb29sZWFuXSc6XG4gICAgICAgIC8vIENvZXJjZSBkYXRlcyBhbmQgYm9vbGVhbnMgdG8gbnVtZXJpYyBwcmltaXRpdmUgdmFsdWVzLiBEYXRlcyBhcmUgY29tcGFyZWQgYnkgdGhlaXJcbiAgICAgICAgLy8gbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zLiBOb3RlIHRoYXQgaW52YWxpZCBkYXRlcyB3aXRoIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9uc1xuICAgICAgICAvLyBvZiBgTmFOYCBhcmUgbm90IGVxdWl2YWxlbnQuXG4gICAgICAgIHJldHVybiArYSA9PT0gK2I7XG4gICAgICBjYXNlICdbb2JqZWN0IFN5bWJvbF0nOlxuICAgICAgICByZXR1cm4gU3ltYm9sUHJvdG8udmFsdWVPZi5jYWxsKGEpID09PSBTeW1ib2xQcm90by52YWx1ZU9mLmNhbGwoYik7XG4gICAgICBjYXNlICdbb2JqZWN0IEFycmF5QnVmZmVyXSc6XG4gICAgICBjYXNlIHRhZ0RhdGFWaWV3OlxuICAgICAgICAvLyBDb2VyY2UgdG8gdHlwZWQgYXJyYXkgc28gd2UgY2FuIGZhbGwgdGhyb3VnaC5cbiAgICAgICAgcmV0dXJuIGRlZXBFcSh0b0J1ZmZlclZpZXcoYSksIHRvQnVmZmVyVmlldyhiKSwgYVN0YWNrLCBiU3RhY2spO1xuICAgIH1cblxuICAgIHZhciBhcmVBcnJheXMgPSBjbGFzc05hbWUgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgaWYgKCFhcmVBcnJheXMgJiYgaXNUeXBlZEFycmF5JDEoYSkpIHtcbiAgICAgICAgdmFyIGJ5dGVMZW5ndGggPSBnZXRCeXRlTGVuZ3RoKGEpO1xuICAgICAgICBpZiAoYnl0ZUxlbmd0aCAhPT0gZ2V0Qnl0ZUxlbmd0aChiKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAoYS5idWZmZXIgPT09IGIuYnVmZmVyICYmIGEuYnl0ZU9mZnNldCA9PT0gYi5ieXRlT2Zmc2V0KSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgYXJlQXJyYXlzID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKCFhcmVBcnJheXMpIHtcbiAgICAgIGlmICh0eXBlb2YgYSAhPSAnb2JqZWN0JyB8fCB0eXBlb2YgYiAhPSAnb2JqZWN0JykgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAvLyBPYmplY3RzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWl2YWxlbnQsIGJ1dCBgT2JqZWN0YHMgb3IgYEFycmF5YHNcbiAgICAgIC8vIGZyb20gZGlmZmVyZW50IGZyYW1lcyBhcmUuXG4gICAgICB2YXIgYUN0b3IgPSBhLmNvbnN0cnVjdG9yLCBiQ3RvciA9IGIuY29uc3RydWN0b3I7XG4gICAgICBpZiAoYUN0b3IgIT09IGJDdG9yICYmICEoaXNGdW5jdGlvbiQxKGFDdG9yKSAmJiBhQ3RvciBpbnN0YW5jZW9mIGFDdG9yICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNGdW5jdGlvbiQxKGJDdG9yKSAmJiBiQ3RvciBpbnN0YW5jZW9mIGJDdG9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAoJ2NvbnN0cnVjdG9yJyBpbiBhICYmICdjb25zdHJ1Y3RvcicgaW4gYikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBBc3N1bWUgZXF1YWxpdHkgZm9yIGN5Y2xpYyBzdHJ1Y3R1cmVzLiBUaGUgYWxnb3JpdGhtIGZvciBkZXRlY3RpbmcgY3ljbGljXG4gICAgLy8gc3RydWN0dXJlcyBpcyBhZGFwdGVkIGZyb20gRVMgNS4xIHNlY3Rpb24gMTUuMTIuMywgYWJzdHJhY3Qgb3BlcmF0aW9uIGBKT2AuXG5cbiAgICAvLyBJbml0aWFsaXppbmcgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgLy8gSXQncyBkb25lIGhlcmUgc2luY2Ugd2Ugb25seSBuZWVkIHRoZW0gZm9yIG9iamVjdHMgYW5kIGFycmF5cyBjb21wYXJpc29uLlxuICAgIGFTdGFjayA9IGFTdGFjayB8fCBbXTtcbiAgICBiU3RhY2sgPSBiU3RhY2sgfHwgW107XG4gICAgdmFyIGxlbmd0aCA9IGFTdGFjay5sZW5ndGg7XG4gICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAvLyBMaW5lYXIgc2VhcmNoLiBQZXJmb3JtYW5jZSBpcyBpbnZlcnNlbHkgcHJvcG9ydGlvbmFsIHRvIHRoZSBudW1iZXIgb2ZcbiAgICAgIC8vIHVuaXF1ZSBuZXN0ZWQgc3RydWN0dXJlcy5cbiAgICAgIGlmIChhU3RhY2tbbGVuZ3RoXSA9PT0gYSkgcmV0dXJuIGJTdGFja1tsZW5ndGhdID09PSBiO1xuICAgIH1cblxuICAgIC8vIEFkZCB0aGUgZmlyc3Qgb2JqZWN0IHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucHVzaChhKTtcbiAgICBiU3RhY2sucHVzaChiKTtcblxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyBhbmQgYXJyYXlzLlxuICAgIGlmIChhcmVBcnJheXMpIHtcbiAgICAgIC8vIENvbXBhcmUgYXJyYXkgbGVuZ3RocyB0byBkZXRlcm1pbmUgaWYgYSBkZWVwIGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5LlxuICAgICAgbGVuZ3RoID0gYS5sZW5ndGg7XG4gICAgICBpZiAobGVuZ3RoICE9PSBiLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgICAgLy8gRGVlcCBjb21wYXJlIHRoZSBjb250ZW50cywgaWdub3Jpbmcgbm9uLW51bWVyaWMgcHJvcGVydGllcy5cbiAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICBpZiAoIWVxKGFbbGVuZ3RoXSwgYltsZW5ndGhdLCBhU3RhY2ssIGJTdGFjaykpIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRGVlcCBjb21wYXJlIG9iamVjdHMuXG4gICAgICB2YXIgX2tleXMgPSBrZXlzKGEpLCBrZXk7XG4gICAgICBsZW5ndGggPSBfa2V5cy5sZW5ndGg7XG4gICAgICAvLyBFbnN1cmUgdGhhdCBib3RoIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBudW1iZXIgb2YgcHJvcGVydGllcyBiZWZvcmUgY29tcGFyaW5nIGRlZXAgZXF1YWxpdHkuXG4gICAgICBpZiAoa2V5cyhiKS5sZW5ndGggIT09IGxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgIC8vIERlZXAgY29tcGFyZSBlYWNoIG1lbWJlclxuICAgICAgICBrZXkgPSBfa2V5c1tsZW5ndGhdO1xuICAgICAgICBpZiAoIShoYXMkMShiLCBrZXkpICYmIGVxKGFba2V5XSwgYltrZXldLCBhU3RhY2ssIGJTdGFjaykpKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFJlbW92ZSB0aGUgZmlyc3Qgb2JqZWN0IGZyb20gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wb3AoKTtcbiAgICBiU3RhY2sucG9wKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBQZXJmb3JtIGEgZGVlcCBjb21wYXJpc29uIHRvIGNoZWNrIGlmIHR3byBvYmplY3RzIGFyZSBlcXVhbC5cbiAgZnVuY3Rpb24gaXNFcXVhbChhLCBiKSB7XG4gICAgcmV0dXJuIGVxKGEsIGIpO1xuICB9XG5cbiAgLy8gUmV0cmlldmUgYWxsIHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGFuIG9iamVjdC5cbiAgZnVuY3Rpb24gYWxsS2V5cyhvYmopIHtcbiAgICBpZiAoIWlzT2JqZWN0KG9iaikpIHJldHVybiBbXTtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGtleXMucHVzaChrZXkpO1xuICAgIC8vIEFoZW0sIElFIDwgOS5cbiAgICBpZiAoaGFzRW51bUJ1ZykgY29sbGVjdE5vbkVudW1Qcm9wcyhvYmosIGtleXMpO1xuICAgIHJldHVybiBrZXlzO1xuICB9XG5cbiAgLy8gU2luY2UgdGhlIHJlZ3VsYXIgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgIHR5cGUgdGVzdHMgZG9uJ3Qgd29yayBmb3JcbiAgLy8gc29tZSB0eXBlcyBpbiBJRSAxMSwgd2UgdXNlIGEgZmluZ2VycHJpbnRpbmcgaGV1cmlzdGljIGluc3RlYWQsIGJhc2VkXG4gIC8vIG9uIHRoZSBtZXRob2RzLiBJdCdzIG5vdCBncmVhdCwgYnV0IGl0J3MgdGhlIGJlc3Qgd2UgZ290LlxuICAvLyBUaGUgZmluZ2VycHJpbnQgbWV0aG9kIGxpc3RzIGFyZSBkZWZpbmVkIGJlbG93LlxuICBmdW5jdGlvbiBpZTExZmluZ2VycHJpbnQobWV0aG9kcykge1xuICAgIHZhciBsZW5ndGggPSBnZXRMZW5ndGgobWV0aG9kcyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgICAvLyBgTWFwYCwgYFdlYWtNYXBgIGFuZCBgU2V0YCBoYXZlIG5vIGVudW1lcmFibGUga2V5cy5cbiAgICAgIHZhciBrZXlzID0gYWxsS2V5cyhvYmopO1xuICAgICAgaWYgKGdldExlbmd0aChrZXlzKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoIWlzRnVuY3Rpb24kMShvYmpbbWV0aG9kc1tpXV0pKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyBJZiB3ZSBhcmUgdGVzdGluZyBhZ2FpbnN0IGBXZWFrTWFwYCwgd2UgbmVlZCB0byBlbnN1cmUgdGhhdFxuICAgICAgLy8gYG9iamAgZG9lc24ndCBoYXZlIGEgYGZvckVhY2hgIG1ldGhvZCBpbiBvcmRlciB0byBkaXN0aW5ndWlzaFxuICAgICAgLy8gaXQgZnJvbSBhIHJlZ3VsYXIgYE1hcGAuXG4gICAgICByZXR1cm4gbWV0aG9kcyAhPT0gd2Vha01hcE1ldGhvZHMgfHwgIWlzRnVuY3Rpb24kMShvYmpbZm9yRWFjaE5hbWVdKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gSW4gdGhlIGludGVyZXN0IG9mIGNvbXBhY3QgbWluaWZpY2F0aW9uLCB3ZSB3cml0ZVxuICAvLyBlYWNoIHN0cmluZyBpbiB0aGUgZmluZ2VycHJpbnRzIG9ubHkgb25jZS5cbiAgdmFyIGZvckVhY2hOYW1lID0gJ2ZvckVhY2gnLFxuICAgICAgaGFzTmFtZSA9ICdoYXMnLFxuICAgICAgY29tbW9uSW5pdCA9IFsnY2xlYXInLCAnZGVsZXRlJ10sXG4gICAgICBtYXBUYWlsID0gWydnZXQnLCBoYXNOYW1lLCAnc2V0J107XG5cbiAgLy8gYE1hcGAsIGBXZWFrTWFwYCBhbmQgYFNldGAgZWFjaCBoYXZlIHNsaWdodGx5IGRpZmZlcmVudFxuICAvLyBjb21iaW5hdGlvbnMgb2YgdGhlIGFib3ZlIHN1Ymxpc3RzLlxuICB2YXIgbWFwTWV0aG9kcyA9IGNvbW1vbkluaXQuY29uY2F0KGZvckVhY2hOYW1lLCBtYXBUYWlsKSxcbiAgICAgIHdlYWtNYXBNZXRob2RzID0gY29tbW9uSW5pdC5jb25jYXQobWFwVGFpbCksXG4gICAgICBzZXRNZXRob2RzID0gWydhZGQnXS5jb25jYXQoY29tbW9uSW5pdCwgZm9yRWFjaE5hbWUsIGhhc05hbWUpO1xuXG4gIHZhciBpc01hcCA9IGlzSUUxMSA/IGllMTFmaW5nZXJwcmludChtYXBNZXRob2RzKSA6IHRhZ1Rlc3RlcignTWFwJyk7XG5cbiAgdmFyIGlzV2Vha01hcCA9IGlzSUUxMSA/IGllMTFmaW5nZXJwcmludCh3ZWFrTWFwTWV0aG9kcykgOiB0YWdUZXN0ZXIoJ1dlYWtNYXAnKTtcblxuICB2YXIgaXNTZXQgPSBpc0lFMTEgPyBpZTExZmluZ2VycHJpbnQoc2V0TWV0aG9kcykgOiB0YWdUZXN0ZXIoJ1NldCcpO1xuXG4gIHZhciBpc1dlYWtTZXQgPSB0YWdUZXN0ZXIoJ1dlYWtTZXQnKTtcblxuICAvLyBSZXRyaWV2ZSB0aGUgdmFsdWVzIG9mIGFuIG9iamVjdCdzIHByb3BlcnRpZXMuXG4gIGZ1bmN0aW9uIHZhbHVlcyhvYmopIHtcbiAgICB2YXIgX2tleXMgPSBrZXlzKG9iaik7XG4gICAgdmFyIGxlbmd0aCA9IF9rZXlzLmxlbmd0aDtcbiAgICB2YXIgdmFsdWVzID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YWx1ZXNbaV0gPSBvYmpbX2tleXNbaV1dO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9XG5cbiAgLy8gQ29udmVydCBhbiBvYmplY3QgaW50byBhIGxpc3Qgb2YgYFtrZXksIHZhbHVlXWAgcGFpcnMuXG4gIC8vIFRoZSBvcHBvc2l0ZSBvZiBgXy5vYmplY3RgIHdpdGggb25lIGFyZ3VtZW50LlxuICBmdW5jdGlvbiBwYWlycyhvYmopIHtcbiAgICB2YXIgX2tleXMgPSBrZXlzKG9iaik7XG4gICAgdmFyIGxlbmd0aCA9IF9rZXlzLmxlbmd0aDtcbiAgICB2YXIgcGFpcnMgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHBhaXJzW2ldID0gW19rZXlzW2ldLCBvYmpbX2tleXNbaV1dXTtcbiAgICB9XG4gICAgcmV0dXJuIHBhaXJzO1xuICB9XG5cbiAgLy8gSW52ZXJ0IHRoZSBrZXlzIGFuZCB2YWx1ZXMgb2YgYW4gb2JqZWN0LiBUaGUgdmFsdWVzIG11c3QgYmUgc2VyaWFsaXphYmxlLlxuICBmdW5jdGlvbiBpbnZlcnQob2JqKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHZhciBfa2V5cyA9IGtleXMob2JqKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gX2tleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdFtvYmpbX2tleXNbaV1dXSA9IF9rZXlzW2ldO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy8gUmV0dXJuIGEgc29ydGVkIGxpc3Qgb2YgdGhlIGZ1bmN0aW9uIG5hbWVzIGF2YWlsYWJsZSBvbiB0aGUgb2JqZWN0LlxuICBmdW5jdGlvbiBmdW5jdGlvbnMob2JqKSB7XG4gICAgdmFyIG5hbWVzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKGlzRnVuY3Rpb24kMShvYmpba2V5XSkpIG5hbWVzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIG5hbWVzLnNvcnQoKTtcbiAgfVxuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhc3NpZ25lciBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIGNyZWF0ZUFzc2lnbmVyKGtleXNGdW5jLCBkZWZhdWx0cykge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgaWYgKGRlZmF1bHRzKSBvYmogPSBPYmplY3Qob2JqKTtcbiAgICAgIGlmIChsZW5ndGggPCAyIHx8IG9iaiA9PSBudWxsKSByZXR1cm4gb2JqO1xuICAgICAgZm9yICh2YXIgaW5kZXggPSAxOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2luZGV4XSxcbiAgICAgICAgICAgIGtleXMgPSBrZXlzRnVuYyhzb3VyY2UpLFxuICAgICAgICAgICAgbCA9IGtleXMubGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgIGlmICghZGVmYXVsdHMgfHwgb2JqW2tleV0gPT09IHZvaWQgMCkgb2JqW2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG9iajtcbiAgICB9O1xuICB9XG5cbiAgLy8gRXh0ZW5kIGEgZ2l2ZW4gb2JqZWN0IHdpdGggYWxsIHRoZSBwcm9wZXJ0aWVzIGluIHBhc3NlZC1pbiBvYmplY3QocykuXG4gIHZhciBleHRlbmQgPSBjcmVhdGVBc3NpZ25lcihhbGxLZXlzKTtcblxuICAvLyBBc3NpZ25zIGEgZ2l2ZW4gb2JqZWN0IHdpdGggYWxsIHRoZSBvd24gcHJvcGVydGllcyBpbiB0aGUgcGFzc2VkLWluXG4gIC8vIG9iamVjdChzKS5cbiAgLy8gKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9hc3NpZ24pXG4gIHZhciBleHRlbmRPd24gPSBjcmVhdGVBc3NpZ25lcihrZXlzKTtcblxuICAvLyBGaWxsIGluIGEgZ2l2ZW4gb2JqZWN0IHdpdGggZGVmYXVsdCBwcm9wZXJ0aWVzLlxuICB2YXIgZGVmYXVsdHMgPSBjcmVhdGVBc3NpZ25lcihhbGxLZXlzLCB0cnVlKTtcblxuICAvLyBDcmVhdGUgYSBuYWtlZCBmdW5jdGlvbiByZWZlcmVuY2UgZm9yIHN1cnJvZ2F0ZS1wcm90b3R5cGUtc3dhcHBpbmcuXG4gIGZ1bmN0aW9uIGN0b3IoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCl7fTtcbiAgfVxuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhIG5ldyBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIGFub3RoZXIuXG4gIGZ1bmN0aW9uIGJhc2VDcmVhdGUocHJvdG90eXBlKSB7XG4gICAgaWYgKCFpc09iamVjdChwcm90b3R5cGUpKSByZXR1cm4ge307XG4gICAgaWYgKG5hdGl2ZUNyZWF0ZSkgcmV0dXJuIG5hdGl2ZUNyZWF0ZShwcm90b3R5cGUpO1xuICAgIHZhciBDdG9yID0gY3RvcigpO1xuICAgIEN0b3IucHJvdG90eXBlID0gcHJvdG90eXBlO1xuICAgIHZhciByZXN1bHQgPSBuZXcgQ3RvcjtcbiAgICBDdG9yLnByb3RvdHlwZSA9IG51bGw7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vIENyZWF0ZXMgYW4gb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSB0aGUgZ2l2ZW4gcHJvdG90eXBlIG9iamVjdC5cbiAgLy8gSWYgYWRkaXRpb25hbCBwcm9wZXJ0aWVzIGFyZSBwcm92aWRlZCB0aGVuIHRoZXkgd2lsbCBiZSBhZGRlZCB0byB0aGVcbiAgLy8gY3JlYXRlZCBvYmplY3QuXG4gIGZ1bmN0aW9uIGNyZWF0ZShwcm90b3R5cGUsIHByb3BzKSB7XG4gICAgdmFyIHJlc3VsdCA9IGJhc2VDcmVhdGUocHJvdG90eXBlKTtcbiAgICBpZiAocHJvcHMpIGV4dGVuZE93bihyZXN1bHQsIHByb3BzKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy8gQ3JlYXRlIGEgKHNoYWxsb3ctY2xvbmVkKSBkdXBsaWNhdGUgb2YgYW4gb2JqZWN0LlxuICBmdW5jdGlvbiBjbG9uZShvYmopIHtcbiAgICBpZiAoIWlzT2JqZWN0KG9iaikpIHJldHVybiBvYmo7XG4gICAgcmV0dXJuIGlzQXJyYXkob2JqKSA/IG9iai5zbGljZSgpIDogZXh0ZW5kKHt9LCBvYmopO1xuICB9XG5cbiAgLy8gSW52b2tlcyBgaW50ZXJjZXB0b3JgIHdpdGggdGhlIGBvYmpgIGFuZCB0aGVuIHJldHVybnMgYG9iamAuXG4gIC8vIFRoZSBwcmltYXJ5IHB1cnBvc2Ugb2YgdGhpcyBtZXRob2QgaXMgdG8gXCJ0YXAgaW50b1wiIGEgbWV0aG9kIGNoYWluLCBpblxuICAvLyBvcmRlciB0byBwZXJmb3JtIG9wZXJhdGlvbnMgb24gaW50ZXJtZWRpYXRlIHJlc3VsdHMgd2l0aGluIHRoZSBjaGFpbi5cbiAgZnVuY3Rpb24gdGFwKG9iaiwgaW50ZXJjZXB0b3IpIHtcbiAgICBpbnRlcmNlcHRvcihvYmopO1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICAvLyBOb3JtYWxpemUgYSAoZGVlcCkgcHJvcGVydHkgYHBhdGhgIHRvIGFycmF5LlxuICAvLyBMaWtlIGBfLml0ZXJhdGVlYCwgdGhpcyBmdW5jdGlvbiBjYW4gYmUgY3VzdG9taXplZC5cbiAgZnVuY3Rpb24gdG9QYXRoJDEocGF0aCkge1xuICAgIHJldHVybiBpc0FycmF5KHBhdGgpID8gcGF0aCA6IFtwYXRoXTtcbiAgfVxuICBfJDEudG9QYXRoID0gdG9QYXRoJDE7XG5cbiAgLy8gSW50ZXJuYWwgd3JhcHBlciBmb3IgYF8udG9QYXRoYCB0byBlbmFibGUgbWluaWZpY2F0aW9uLlxuICAvLyBTaW1pbGFyIHRvIGBjYmAgZm9yIGBfLml0ZXJhdGVlYC5cbiAgZnVuY3Rpb24gdG9QYXRoKHBhdGgpIHtcbiAgICByZXR1cm4gXyQxLnRvUGF0aChwYXRoKTtcbiAgfVxuXG4gIC8vIEludGVybmFsIGZ1bmN0aW9uIHRvIG9idGFpbiBhIG5lc3RlZCBwcm9wZXJ0eSBpbiBgb2JqYCBhbG9uZyBgcGF0aGAuXG4gIGZ1bmN0aW9uIGRlZXBHZXQob2JqLCBwYXRoKSB7XG4gICAgdmFyIGxlbmd0aCA9IHBhdGgubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICAgIG9iaiA9IG9ialtwYXRoW2ldXTtcbiAgICB9XG4gICAgcmV0dXJuIGxlbmd0aCA/IG9iaiA6IHZvaWQgMDtcbiAgfVxuXG4gIC8vIEdldCB0aGUgdmFsdWUgb2YgdGhlIChkZWVwKSBwcm9wZXJ0eSBvbiBgcGF0aGAgZnJvbSBgb2JqZWN0YC5cbiAgLy8gSWYgYW55IHByb3BlcnR5IGluIGBwYXRoYCBkb2VzIG5vdCBleGlzdCBvciBpZiB0aGUgdmFsdWUgaXNcbiAgLy8gYHVuZGVmaW5lZGAsIHJldHVybiBgZGVmYXVsdFZhbHVlYCBpbnN0ZWFkLlxuICAvLyBUaGUgYHBhdGhgIGlzIG5vcm1hbGl6ZWQgdGhyb3VnaCBgXy50b1BhdGhgLlxuICBmdW5jdGlvbiBnZXQob2JqZWN0LCBwYXRoLCBkZWZhdWx0VmFsdWUpIHtcbiAgICB2YXIgdmFsdWUgPSBkZWVwR2V0KG9iamVjdCwgdG9QYXRoKHBhdGgpKTtcbiAgICByZXR1cm4gaXNVbmRlZmluZWQodmFsdWUpID8gZGVmYXVsdFZhbHVlIDogdmFsdWU7XG4gIH1cblxuICAvLyBTaG9ydGN1dCBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHByb3BlcnR5IGRpcmVjdGx5IG9uXG4gIC8vIGl0c2VsZiAoaW4gb3RoZXIgd29yZHMsIG5vdCBvbiBhIHByb3RvdHlwZSkuIFVubGlrZSB0aGUgaW50ZXJuYWwgYGhhc2BcbiAgLy8gZnVuY3Rpb24sIHRoaXMgcHVibGljIHZlcnNpb24gY2FuIGFsc28gdHJhdmVyc2UgbmVzdGVkIHByb3BlcnRpZXMuXG4gIGZ1bmN0aW9uIGhhcyhvYmosIHBhdGgpIHtcbiAgICBwYXRoID0gdG9QYXRoKHBhdGgpO1xuICAgIHZhciBsZW5ndGggPSBwYXRoLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0gcGF0aFtpXTtcbiAgICAgIGlmICghaGFzJDEob2JqLCBrZXkpKSByZXR1cm4gZmFsc2U7XG4gICAgICBvYmogPSBvYmpba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuICEhbGVuZ3RoO1xuICB9XG5cbiAgLy8gS2VlcCB0aGUgaWRlbnRpdHkgZnVuY3Rpb24gYXJvdW5kIGZvciBkZWZhdWx0IGl0ZXJhdGVlcy5cbiAgZnVuY3Rpb24gaWRlbnRpdHkodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvLyBSZXR1cm5zIGEgcHJlZGljYXRlIGZvciBjaGVja2luZyB3aGV0aGVyIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBzZXQgb2ZcbiAgLy8gYGtleTp2YWx1ZWAgcGFpcnMuXG4gIGZ1bmN0aW9uIG1hdGNoZXIoYXR0cnMpIHtcbiAgICBhdHRycyA9IGV4dGVuZE93bih7fSwgYXR0cnMpO1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBpc01hdGNoKG9iaiwgYXR0cnMpO1xuICAgIH07XG4gIH1cblxuICAvLyBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBwYXNzZWQgYW4gb2JqZWN0LCB3aWxsIHRyYXZlcnNlIHRoYXQgb2JqZWN04oCZc1xuICAvLyBwcm9wZXJ0aWVzIGRvd24gdGhlIGdpdmVuIGBwYXRoYCwgc3BlY2lmaWVkIGFzIGFuIGFycmF5IG9mIGtleXMgb3IgaW5kaWNlcy5cbiAgZnVuY3Rpb24gcHJvcGVydHkocGF0aCkge1xuICAgIHBhdGggPSB0b1BhdGgocGF0aCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIGRlZXBHZXQob2JqLCBwYXRoKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gSW50ZXJuYWwgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGVmZmljaWVudCAoZm9yIGN1cnJlbnQgZW5naW5lcykgdmVyc2lvblxuICAvLyBvZiB0aGUgcGFzc2VkLWluIGNhbGxiYWNrLCB0byBiZSByZXBlYXRlZGx5IGFwcGxpZWQgaW4gb3RoZXIgVW5kZXJzY29yZVxuICAvLyBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIG9wdGltaXplQ2IoZnVuYywgY29udGV4dCwgYXJnQ291bnQpIHtcbiAgICBpZiAoY29udGV4dCA9PT0gdm9pZCAwKSByZXR1cm4gZnVuYztcbiAgICBzd2l0Y2ggKGFyZ0NvdW50ID09IG51bGwgPyAzIDogYXJnQ291bnQpIHtcbiAgICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgdmFsdWUpO1xuICAgICAgfTtcbiAgICAgIC8vIFRoZSAyLWFyZ3VtZW50IGNhc2UgaXMgb21pdHRlZCBiZWNhdXNlIHdl4oCZcmUgbm90IHVzaW5nIGl0LlxuICAgICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgIH07XG4gICAgICBjYXNlIDQ6IHJldHVybiBmdW5jdGlvbihhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiB0byBnZW5lcmF0ZSBjYWxsYmFja3MgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBlYWNoXG4gIC8vIGVsZW1lbnQgaW4gYSBjb2xsZWN0aW9uLCByZXR1cm5pbmcgdGhlIGRlc2lyZWQgcmVzdWx0IOKAlCBlaXRoZXIgYF8uaWRlbnRpdHlgLFxuICAvLyBhbiBhcmJpdHJhcnkgY2FsbGJhY2ssIGEgcHJvcGVydHkgbWF0Y2hlciwgb3IgYSBwcm9wZXJ0eSBhY2Nlc3Nvci5cbiAgZnVuY3Rpb24gYmFzZUl0ZXJhdGVlKHZhbHVlLCBjb250ZXh0LCBhcmdDb3VudCkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gaWRlbnRpdHk7XG4gICAgaWYgKGlzRnVuY3Rpb24kMSh2YWx1ZSkpIHJldHVybiBvcHRpbWl6ZUNiKHZhbHVlLCBjb250ZXh0LCBhcmdDb3VudCk7XG4gICAgaWYgKGlzT2JqZWN0KHZhbHVlKSAmJiAhaXNBcnJheSh2YWx1ZSkpIHJldHVybiBtYXRjaGVyKHZhbHVlKTtcbiAgICByZXR1cm4gcHJvcGVydHkodmFsdWUpO1xuICB9XG5cbiAgLy8gRXh0ZXJuYWwgd3JhcHBlciBmb3Igb3VyIGNhbGxiYWNrIGdlbmVyYXRvci4gVXNlcnMgbWF5IGN1c3RvbWl6ZVxuICAvLyBgXy5pdGVyYXRlZWAgaWYgdGhleSB3YW50IGFkZGl0aW9uYWwgcHJlZGljYXRlL2l0ZXJhdGVlIHNob3J0aGFuZCBzdHlsZXMuXG4gIC8vIFRoaXMgYWJzdHJhY3Rpb24gaGlkZXMgdGhlIGludGVybmFsLW9ubHkgYGFyZ0NvdW50YCBhcmd1bWVudC5cbiAgZnVuY3Rpb24gaXRlcmF0ZWUodmFsdWUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gYmFzZUl0ZXJhdGVlKHZhbHVlLCBjb250ZXh0LCBJbmZpbml0eSk7XG4gIH1cbiAgXyQxLml0ZXJhdGVlID0gaXRlcmF0ZWU7XG5cbiAgLy8gVGhlIGZ1bmN0aW9uIHdlIGNhbGwgaW50ZXJuYWxseSB0byBnZW5lcmF0ZSBhIGNhbGxiYWNrLiBJdCBpbnZva2VzXG4gIC8vIGBfLml0ZXJhdGVlYCBpZiBvdmVycmlkZGVuLCBvdGhlcndpc2UgYGJhc2VJdGVyYXRlZWAuXG4gIGZ1bmN0aW9uIGNiKHZhbHVlLCBjb250ZXh0LCBhcmdDb3VudCkge1xuICAgIGlmIChfJDEuaXRlcmF0ZWUgIT09IGl0ZXJhdGVlKSByZXR1cm4gXyQxLml0ZXJhdGVlKHZhbHVlLCBjb250ZXh0KTtcbiAgICByZXR1cm4gYmFzZUl0ZXJhdGVlKHZhbHVlLCBjb250ZXh0LCBhcmdDb3VudCk7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSByZXN1bHRzIG9mIGFwcGx5aW5nIHRoZSBgaXRlcmF0ZWVgIHRvIGVhY2ggZWxlbWVudCBvZiBgb2JqYC5cbiAgLy8gSW4gY29udHJhc3QgdG8gYF8ubWFwYCBpdCByZXR1cm5zIGFuIG9iamVjdC5cbiAgZnVuY3Rpb24gbWFwT2JqZWN0KG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIgX2tleXMgPSBrZXlzKG9iaiksXG4gICAgICAgIGxlbmd0aCA9IF9rZXlzLmxlbmd0aCxcbiAgICAgICAgcmVzdWx0cyA9IHt9O1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBjdXJyZW50S2V5ID0gX2tleXNbaW5kZXhdO1xuICAgICAgcmVzdWx0c1tjdXJyZW50S2V5XSA9IGl0ZXJhdGVlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICAvLyBQcmVkaWNhdGUtZ2VuZXJhdGluZyBmdW5jdGlvbi4gT2Z0ZW4gdXNlZnVsIG91dHNpZGUgb2YgVW5kZXJzY29yZS5cbiAgZnVuY3Rpb24gbm9vcCgpe31cblxuICAvLyBHZW5lcmF0ZXMgYSBmdW5jdGlvbiBmb3IgYSBnaXZlbiBvYmplY3QgdGhhdCByZXR1cm5zIGEgZ2l2ZW4gcHJvcGVydHkuXG4gIGZ1bmN0aW9uIHByb3BlcnR5T2Yob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gbm9vcDtcbiAgICByZXR1cm4gZnVuY3Rpb24ocGF0aCkge1xuICAgICAgcmV0dXJuIGdldChvYmosIHBhdGgpO1xuICAgIH07XG4gIH1cblxuICAvLyBSdW4gYSBmdW5jdGlvbiAqKm4qKiB0aW1lcy5cbiAgZnVuY3Rpb24gdGltZXMobiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgYWNjdW0gPSBBcnJheShNYXRoLm1heCgwLCBuKSk7XG4gICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKGl0ZXJhdGVlLCBjb250ZXh0LCAxKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykgYWNjdW1baV0gPSBpdGVyYXRlZShpKTtcbiAgICByZXR1cm4gYWNjdW07XG4gIH1cblxuICAvLyBSZXR1cm4gYSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIGBtaW5gIGFuZCBgbWF4YCAoaW5jbHVzaXZlKS5cbiAgZnVuY3Rpb24gcmFuZG9tKG1pbiwgbWF4KSB7XG4gICAgaWYgKG1heCA9PSBudWxsKSB7XG4gICAgICBtYXggPSBtaW47XG4gICAgICBtaW4gPSAwO1xuICAgIH1cbiAgICByZXR1cm4gbWluICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKTtcbiAgfVxuXG4gIC8vIEEgKHBvc3NpYmx5IGZhc3Rlcikgd2F5IHRvIGdldCB0aGUgY3VycmVudCB0aW1lc3RhbXAgYXMgYW4gaW50ZWdlci5cbiAgdmFyIG5vdyA9IERhdGUubm93IHx8IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCBoZWxwZXIgdG8gZ2VuZXJhdGUgZnVuY3Rpb25zIGZvciBlc2NhcGluZyBhbmQgdW5lc2NhcGluZyBzdHJpbmdzXG4gIC8vIHRvL2Zyb20gSFRNTCBpbnRlcnBvbGF0aW9uLlxuICBmdW5jdGlvbiBjcmVhdGVFc2NhcGVyKG1hcCkge1xuICAgIHZhciBlc2NhcGVyID0gZnVuY3Rpb24obWF0Y2gpIHtcbiAgICAgIHJldHVybiBtYXBbbWF0Y2hdO1xuICAgIH07XG4gICAgLy8gUmVnZXhlcyBmb3IgaWRlbnRpZnlpbmcgYSBrZXkgdGhhdCBuZWVkcyB0byBiZSBlc2NhcGVkLlxuICAgIHZhciBzb3VyY2UgPSAnKD86JyArIGtleXMobWFwKS5qb2luKCd8JykgKyAnKSc7XG4gICAgdmFyIHRlc3RSZWdleHAgPSBSZWdFeHAoc291cmNlKTtcbiAgICB2YXIgcmVwbGFjZVJlZ2V4cCA9IFJlZ0V4cChzb3VyY2UsICdnJyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgc3RyaW5nID0gc3RyaW5nID09IG51bGwgPyAnJyA6ICcnICsgc3RyaW5nO1xuICAgICAgcmV0dXJuIHRlc3RSZWdleHAudGVzdChzdHJpbmcpID8gc3RyaW5nLnJlcGxhY2UocmVwbGFjZVJlZ2V4cCwgZXNjYXBlcikgOiBzdHJpbmc7XG4gICAgfTtcbiAgfVxuXG4gIC8vIEludGVybmFsIGxpc3Qgb2YgSFRNTCBlbnRpdGllcyBmb3IgZXNjYXBpbmcuXG4gIHZhciBlc2NhcGVNYXAgPSB7XG4gICAgJyYnOiAnJmFtcDsnLFxuICAgICc8JzogJyZsdDsnLFxuICAgICc+JzogJyZndDsnLFxuICAgICdcIic6ICcmcXVvdDsnLFxuICAgIFwiJ1wiOiAnJiN4Mjc7JyxcbiAgICAnYCc6ICcmI3g2MDsnXG4gIH07XG5cbiAgLy8gRnVuY3Rpb24gZm9yIGVzY2FwaW5nIHN0cmluZ3MgdG8gSFRNTCBpbnRlcnBvbGF0aW9uLlxuICB2YXIgX2VzY2FwZSA9IGNyZWF0ZUVzY2FwZXIoZXNjYXBlTWFwKTtcblxuICAvLyBJbnRlcm5hbCBsaXN0IG9mIEhUTUwgZW50aXRpZXMgZm9yIHVuZXNjYXBpbmcuXG4gIHZhciB1bmVzY2FwZU1hcCA9IGludmVydChlc2NhcGVNYXApO1xuXG4gIC8vIEZ1bmN0aW9uIGZvciB1bmVzY2FwaW5nIHN0cmluZ3MgZnJvbSBIVE1MIGludGVycG9sYXRpb24uXG4gIHZhciBfdW5lc2NhcGUgPSBjcmVhdGVFc2NhcGVyKHVuZXNjYXBlTWFwKTtcblxuICAvLyBCeSBkZWZhdWx0LCBVbmRlcnNjb3JlIHVzZXMgRVJCLXN0eWxlIHRlbXBsYXRlIGRlbGltaXRlcnMuIENoYW5nZSB0aGVcbiAgLy8gZm9sbG93aW5nIHRlbXBsYXRlIHNldHRpbmdzIHRvIHVzZSBhbHRlcm5hdGl2ZSBkZWxpbWl0ZXJzLlxuICB2YXIgdGVtcGxhdGVTZXR0aW5ncyA9IF8kMS50ZW1wbGF0ZVNldHRpbmdzID0ge1xuICAgIGV2YWx1YXRlOiAvPCUoW1xcc1xcU10rPyklPi9nLFxuICAgIGludGVycG9sYXRlOiAvPCU9KFtcXHNcXFNdKz8pJT4vZyxcbiAgICBlc2NhcGU6IC88JS0oW1xcc1xcU10rPyklPi9nXG4gIH07XG5cbiAgLy8gV2hlbiBjdXN0b21pemluZyBgXy50ZW1wbGF0ZVNldHRpbmdzYCwgaWYgeW91IGRvbid0IHdhbnQgdG8gZGVmaW5lIGFuXG4gIC8vIGludGVycG9sYXRpb24sIGV2YWx1YXRpb24gb3IgZXNjYXBpbmcgcmVnZXgsIHdlIG5lZWQgb25lIHRoYXQgaXNcbiAgLy8gZ3VhcmFudGVlZCBub3QgdG8gbWF0Y2guXG4gIHZhciBub01hdGNoID0gLyguKV4vO1xuXG4gIC8vIENlcnRhaW4gY2hhcmFjdGVycyBuZWVkIHRvIGJlIGVzY2FwZWQgc28gdGhhdCB0aGV5IGNhbiBiZSBwdXQgaW50byBhXG4gIC8vIHN0cmluZyBsaXRlcmFsLlxuICB2YXIgZXNjYXBlcyA9IHtcbiAgICBcIidcIjogXCInXCIsXG4gICAgJ1xcXFwnOiAnXFxcXCcsXG4gICAgJ1xccic6ICdyJyxcbiAgICAnXFxuJzogJ24nLFxuICAgICdcXHUyMDI4JzogJ3UyMDI4JyxcbiAgICAnXFx1MjAyOSc6ICd1MjAyOSdcbiAgfTtcblxuICB2YXIgZXNjYXBlUmVnRXhwID0gL1xcXFx8J3xcXHJ8XFxufFxcdTIwMjh8XFx1MjAyOS9nO1xuXG4gIGZ1bmN0aW9uIGVzY2FwZUNoYXIobWF0Y2gpIHtcbiAgICByZXR1cm4gJ1xcXFwnICsgZXNjYXBlc1ttYXRjaF07XG4gIH1cblxuICAvLyBJbiBvcmRlciB0byBwcmV2ZW50IHRoaXJkLXBhcnR5IGNvZGUgaW5qZWN0aW9uIHRocm91Z2hcbiAgLy8gYF8udGVtcGxhdGVTZXR0aW5ncy52YXJpYWJsZWAsIHdlIHRlc3QgaXQgYWdhaW5zdCB0aGUgZm9sbG93aW5nIHJlZ3VsYXJcbiAgLy8gZXhwcmVzc2lvbi4gSXQgaXMgaW50ZW50aW9uYWxseSBhIGJpdCBtb3JlIGxpYmVyYWwgdGhhbiBqdXN0IG1hdGNoaW5nIHZhbGlkXG4gIC8vIGlkZW50aWZpZXJzLCBidXQgc3RpbGwgcHJldmVudHMgcG9zc2libGUgbG9vcGhvbGVzIHRocm91Z2ggZGVmYXVsdHMgb3JcbiAgLy8gZGVzdHJ1Y3R1cmluZyBhc3NpZ25tZW50LlxuICB2YXIgYmFyZUlkZW50aWZpZXIgPSAvXlxccyooXFx3fFxcJCkrXFxzKiQvO1xuXG4gIC8vIEphdmFTY3JpcHQgbWljcm8tdGVtcGxhdGluZywgc2ltaWxhciB0byBKb2huIFJlc2lnJ3MgaW1wbGVtZW50YXRpb24uXG4gIC8vIFVuZGVyc2NvcmUgdGVtcGxhdGluZyBoYW5kbGVzIGFyYml0cmFyeSBkZWxpbWl0ZXJzLCBwcmVzZXJ2ZXMgd2hpdGVzcGFjZSxcbiAgLy8gYW5kIGNvcnJlY3RseSBlc2NhcGVzIHF1b3RlcyB3aXRoaW4gaW50ZXJwb2xhdGVkIGNvZGUuXG4gIC8vIE5COiBgb2xkU2V0dGluZ3NgIG9ubHkgZXhpc3RzIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS5cbiAgZnVuY3Rpb24gdGVtcGxhdGUodGV4dCwgc2V0dGluZ3MsIG9sZFNldHRpbmdzKSB7XG4gICAgaWYgKCFzZXR0aW5ncyAmJiBvbGRTZXR0aW5ncykgc2V0dGluZ3MgPSBvbGRTZXR0aW5ncztcbiAgICBzZXR0aW5ncyA9IGRlZmF1bHRzKHt9LCBzZXR0aW5ncywgXyQxLnRlbXBsYXRlU2V0dGluZ3MpO1xuXG4gICAgLy8gQ29tYmluZSBkZWxpbWl0ZXJzIGludG8gb25lIHJlZ3VsYXIgZXhwcmVzc2lvbiB2aWEgYWx0ZXJuYXRpb24uXG4gICAgdmFyIG1hdGNoZXIgPSBSZWdFeHAoW1xuICAgICAgKHNldHRpbmdzLmVzY2FwZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuaW50ZXJwb2xhdGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmV2YWx1YXRlIHx8IG5vTWF0Y2gpLnNvdXJjZVxuICAgIF0uam9pbignfCcpICsgJ3wkJywgJ2cnKTtcblxuICAgIC8vIENvbXBpbGUgdGhlIHRlbXBsYXRlIHNvdXJjZSwgZXNjYXBpbmcgc3RyaW5nIGxpdGVyYWxzIGFwcHJvcHJpYXRlbHkuXG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgc291cmNlID0gXCJfX3ArPSdcIjtcbiAgICB0ZXh0LnJlcGxhY2UobWF0Y2hlciwgZnVuY3Rpb24obWF0Y2gsIGVzY2FwZSwgaW50ZXJwb2xhdGUsIGV2YWx1YXRlLCBvZmZzZXQpIHtcbiAgICAgIHNvdXJjZSArPSB0ZXh0LnNsaWNlKGluZGV4LCBvZmZzZXQpLnJlcGxhY2UoZXNjYXBlUmVnRXhwLCBlc2NhcGVDaGFyKTtcbiAgICAgIGluZGV4ID0gb2Zmc2V0ICsgbWF0Y2gubGVuZ3RoO1xuXG4gICAgICBpZiAoZXNjYXBlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIicrXFxuKChfX3Q9KFwiICsgZXNjYXBlICsgXCIpKT09bnVsbD8nJzpfLmVzY2FwZShfX3QpKStcXG4nXCI7XG4gICAgICB9IGVsc2UgaWYgKGludGVycG9sYXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIicrXFxuKChfX3Q9KFwiICsgaW50ZXJwb2xhdGUgKyBcIikpPT1udWxsPycnOl9fdCkrXFxuJ1wiO1xuICAgICAgfSBlbHNlIGlmIChldmFsdWF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInO1xcblwiICsgZXZhbHVhdGUgKyBcIlxcbl9fcCs9J1wiO1xuICAgICAgfVxuXG4gICAgICAvLyBBZG9iZSBWTXMgbmVlZCB0aGUgbWF0Y2ggcmV0dXJuZWQgdG8gcHJvZHVjZSB0aGUgY29ycmVjdCBvZmZzZXQuXG4gICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfSk7XG4gICAgc291cmNlICs9IFwiJztcXG5cIjtcblxuICAgIHZhciBhcmd1bWVudCA9IHNldHRpbmdzLnZhcmlhYmxlO1xuICAgIGlmIChhcmd1bWVudCkge1xuICAgICAgLy8gSW5zdXJlIGFnYWluc3QgdGhpcmQtcGFydHkgY29kZSBpbmplY3Rpb24uIChDVkUtMjAyMS0yMzM1OClcbiAgICAgIGlmICghYmFyZUlkZW50aWZpZXIudGVzdChhcmd1bWVudCkpIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ3ZhcmlhYmxlIGlzIG5vdCBhIGJhcmUgaWRlbnRpZmllcjogJyArIGFyZ3VtZW50XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiBhIHZhcmlhYmxlIGlzIG5vdCBzcGVjaWZpZWQsIHBsYWNlIGRhdGEgdmFsdWVzIGluIGxvY2FsIHNjb3BlLlxuICAgICAgc291cmNlID0gJ3dpdGgob2JqfHx7fSl7XFxuJyArIHNvdXJjZSArICd9XFxuJztcbiAgICAgIGFyZ3VtZW50ID0gJ29iaic7XG4gICAgfVxuXG4gICAgc291cmNlID0gXCJ2YXIgX190LF9fcD0nJyxfX2o9QXJyYXkucHJvdG90eXBlLmpvaW4sXCIgK1xuICAgICAgXCJwcmludD1mdW5jdGlvbigpe19fcCs9X19qLmNhbGwoYXJndW1lbnRzLCcnKTt9O1xcblwiICtcbiAgICAgIHNvdXJjZSArICdyZXR1cm4gX19wO1xcbic7XG5cbiAgICB2YXIgcmVuZGVyO1xuICAgIHRyeSB7XG4gICAgICByZW5kZXIgPSBuZXcgRnVuY3Rpb24oYXJndW1lbnQsICdfJywgc291cmNlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgdmFyIHRlbXBsYXRlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuIHJlbmRlci5jYWxsKHRoaXMsIGRhdGEsIF8kMSk7XG4gICAgfTtcblxuICAgIC8vIFByb3ZpZGUgdGhlIGNvbXBpbGVkIHNvdXJjZSBhcyBhIGNvbnZlbmllbmNlIGZvciBwcmVjb21waWxhdGlvbi5cbiAgICB0ZW1wbGF0ZS5zb3VyY2UgPSAnZnVuY3Rpb24oJyArIGFyZ3VtZW50ICsgJyl7XFxuJyArIHNvdXJjZSArICd9JztcblxuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfVxuXG4gIC8vIFRyYXZlcnNlcyB0aGUgY2hpbGRyZW4gb2YgYG9iamAgYWxvbmcgYHBhdGhgLiBJZiBhIGNoaWxkIGlzIGEgZnVuY3Rpb24sIGl0XG4gIC8vIGlzIGludm9rZWQgd2l0aCBpdHMgcGFyZW50IGFzIGNvbnRleHQuIFJldHVybnMgdGhlIHZhbHVlIG9mIHRoZSBmaW5hbFxuICAvLyBjaGlsZCwgb3IgYGZhbGxiYWNrYCBpZiBhbnkgY2hpbGQgaXMgdW5kZWZpbmVkLlxuICBmdW5jdGlvbiByZXN1bHQob2JqLCBwYXRoLCBmYWxsYmFjaykge1xuICAgIHBhdGggPSB0b1BhdGgocGF0aCk7XG4gICAgdmFyIGxlbmd0aCA9IHBhdGgubGVuZ3RoO1xuICAgIGlmICghbGVuZ3RoKSB7XG4gICAgICByZXR1cm4gaXNGdW5jdGlvbiQxKGZhbGxiYWNrKSA/IGZhbGxiYWNrLmNhbGwob2JqKSA6IGZhbGxiYWNrO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcHJvcCA9IG9iaiA9PSBudWxsID8gdm9pZCAwIDogb2JqW3BhdGhbaV1dO1xuICAgICAgaWYgKHByb3AgPT09IHZvaWQgMCkge1xuICAgICAgICBwcm9wID0gZmFsbGJhY2s7XG4gICAgICAgIGkgPSBsZW5ndGg7IC8vIEVuc3VyZSB3ZSBkb24ndCBjb250aW51ZSBpdGVyYXRpbmcuXG4gICAgICB9XG4gICAgICBvYmogPSBpc0Z1bmN0aW9uJDEocHJvcCkgPyBwcm9wLmNhbGwob2JqKSA6IHByb3A7XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICAvLyBHZW5lcmF0ZSBhIHVuaXF1ZSBpbnRlZ2VyIGlkICh1bmlxdWUgd2l0aGluIHRoZSBlbnRpcmUgY2xpZW50IHNlc3Npb24pLlxuICAvLyBVc2VmdWwgZm9yIHRlbXBvcmFyeSBET00gaWRzLlxuICB2YXIgaWRDb3VudGVyID0gMDtcbiAgZnVuY3Rpb24gdW5pcXVlSWQocHJlZml4KSB7XG4gICAgdmFyIGlkID0gKytpZENvdW50ZXIgKyAnJztcbiAgICByZXR1cm4gcHJlZml4ID8gcHJlZml4ICsgaWQgOiBpZDtcbiAgfVxuXG4gIC8vIFN0YXJ0IGNoYWluaW5nIGEgd3JhcHBlZCBVbmRlcnNjb3JlIG9iamVjdC5cbiAgZnVuY3Rpb24gY2hhaW4ob2JqKSB7XG4gICAgdmFyIGluc3RhbmNlID0gXyQxKG9iaik7XG4gICAgaW5zdGFuY2UuX2NoYWluID0gdHJ1ZTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH1cblxuICAvLyBJbnRlcm5hbCBmdW5jdGlvbiB0byBleGVjdXRlIGBzb3VyY2VGdW5jYCBib3VuZCB0byBgY29udGV4dGAgd2l0aCBvcHRpb25hbFxuICAvLyBgYXJnc2AuIERldGVybWluZXMgd2hldGhlciB0byBleGVjdXRlIGEgZnVuY3Rpb24gYXMgYSBjb25zdHJ1Y3RvciBvciBhcyBhXG4gIC8vIG5vcm1hbCBmdW5jdGlvbi5cbiAgZnVuY3Rpb24gZXhlY3V0ZUJvdW5kKHNvdXJjZUZ1bmMsIGJvdW5kRnVuYywgY29udGV4dCwgY2FsbGluZ0NvbnRleHQsIGFyZ3MpIHtcbiAgICBpZiAoIShjYWxsaW5nQ29udGV4dCBpbnN0YW5jZW9mIGJvdW5kRnVuYykpIHJldHVybiBzb3VyY2VGdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIHZhciBzZWxmID0gYmFzZUNyZWF0ZShzb3VyY2VGdW5jLnByb3RvdHlwZSk7XG4gICAgdmFyIHJlc3VsdCA9IHNvdXJjZUZ1bmMuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgaWYgKGlzT2JqZWN0KHJlc3VsdCkpIHJldHVybiByZXN1bHQ7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH1cblxuICAvLyBQYXJ0aWFsbHkgYXBwbHkgYSBmdW5jdGlvbiBieSBjcmVhdGluZyBhIHZlcnNpb24gdGhhdCBoYXMgaGFkIHNvbWUgb2YgaXRzXG4gIC8vIGFyZ3VtZW50cyBwcmUtZmlsbGVkLCB3aXRob3V0IGNoYW5naW5nIGl0cyBkeW5hbWljIGB0aGlzYCBjb250ZXh0LiBgX2AgYWN0c1xuICAvLyBhcyBhIHBsYWNlaG9sZGVyIGJ5IGRlZmF1bHQsIGFsbG93aW5nIGFueSBjb21iaW5hdGlvbiBvZiBhcmd1bWVudHMgdG8gYmVcbiAgLy8gcHJlLWZpbGxlZC4gU2V0IGBfLnBhcnRpYWwucGxhY2Vob2xkZXJgIGZvciBhIGN1c3RvbSBwbGFjZWhvbGRlciBhcmd1bWVudC5cbiAgdmFyIHBhcnRpYWwgPSByZXN0QXJndW1lbnRzKGZ1bmN0aW9uKGZ1bmMsIGJvdW5kQXJncykge1xuICAgIHZhciBwbGFjZWhvbGRlciA9IHBhcnRpYWwucGxhY2Vob2xkZXI7XG4gICAgdmFyIGJvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcG9zaXRpb24gPSAwLCBsZW5ndGggPSBib3VuZEFyZ3MubGVuZ3RoO1xuICAgICAgdmFyIGFyZ3MgPSBBcnJheShsZW5ndGgpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBhcmdzW2ldID0gYm91bmRBcmdzW2ldID09PSBwbGFjZWhvbGRlciA/IGFyZ3VtZW50c1twb3NpdGlvbisrXSA6IGJvdW5kQXJnc1tpXTtcbiAgICAgIH1cbiAgICAgIHdoaWxlIChwb3NpdGlvbiA8IGFyZ3VtZW50cy5sZW5ndGgpIGFyZ3MucHVzaChhcmd1bWVudHNbcG9zaXRpb24rK10pO1xuICAgICAgcmV0dXJuIGV4ZWN1dGVCb3VuZChmdW5jLCBib3VuZCwgdGhpcywgdGhpcywgYXJncyk7XG4gICAgfTtcbiAgICByZXR1cm4gYm91bmQ7XG4gIH0pO1xuXG4gIHBhcnRpYWwucGxhY2Vob2xkZXIgPSBfJDE7XG5cbiAgLy8gQ3JlYXRlIGEgZnVuY3Rpb24gYm91bmQgdG8gYSBnaXZlbiBvYmplY3QgKGFzc2lnbmluZyBgdGhpc2AsIGFuZCBhcmd1bWVudHMsXG4gIC8vIG9wdGlvbmFsbHkpLlxuICB2YXIgYmluZCA9IHJlc3RBcmd1bWVudHMoZnVuY3Rpb24oZnVuYywgY29udGV4dCwgYXJncykge1xuICAgIGlmICghaXNGdW5jdGlvbiQxKGZ1bmMpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdCaW5kIG11c3QgYmUgY2FsbGVkIG9uIGEgZnVuY3Rpb24nKTtcbiAgICB2YXIgYm91bmQgPSByZXN0QXJndW1lbnRzKGZ1bmN0aW9uKGNhbGxBcmdzKSB7XG4gICAgICByZXR1cm4gZXhlY3V0ZUJvdW5kKGZ1bmMsIGJvdW5kLCBjb250ZXh0LCB0aGlzLCBhcmdzLmNvbmNhdChjYWxsQXJncykpO1xuICAgIH0pO1xuICAgIHJldHVybiBib3VuZDtcbiAgfSk7XG5cbiAgLy8gSW50ZXJuYWwgaGVscGVyIGZvciBjb2xsZWN0aW9uIG1ldGhvZHMgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgYSBjb2xsZWN0aW9uXG4gIC8vIHNob3VsZCBiZSBpdGVyYXRlZCBhcyBhbiBhcnJheSBvciBhcyBhbiBvYmplY3QuXG4gIC8vIFJlbGF0ZWQ6IGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy10b2xlbmd0aFxuICAvLyBBdm9pZHMgYSB2ZXJ5IG5hc3R5IGlPUyA4IEpJVCBidWcgb24gQVJNLTY0LiAjMjA5NFxuICB2YXIgaXNBcnJheUxpa2UgPSBjcmVhdGVTaXplUHJvcGVydHlDaGVjayhnZXRMZW5ndGgpO1xuXG4gIC8vIEludGVybmFsIGltcGxlbWVudGF0aW9uIG9mIGEgcmVjdXJzaXZlIGBmbGF0dGVuYCBmdW5jdGlvbi5cbiAgZnVuY3Rpb24gZmxhdHRlbiQxKGlucHV0LCBkZXB0aCwgc3RyaWN0LCBvdXRwdXQpIHtcbiAgICBvdXRwdXQgPSBvdXRwdXQgfHwgW107XG4gICAgaWYgKCFkZXB0aCAmJiBkZXB0aCAhPT0gMCkge1xuICAgICAgZGVwdGggPSBJbmZpbml0eTtcbiAgICB9IGVsc2UgaWYgKGRlcHRoIDw9IDApIHtcbiAgICAgIHJldHVybiBvdXRwdXQuY29uY2F0KGlucHV0KTtcbiAgICB9XG4gICAgdmFyIGlkeCA9IG91dHB1dC5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGdldExlbmd0aChpbnB1dCk7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHZhbHVlID0gaW5wdXRbaV07XG4gICAgICBpZiAoaXNBcnJheUxpa2UodmFsdWUpICYmIChpc0FycmF5KHZhbHVlKSB8fCBpc0FyZ3VtZW50cyQxKHZhbHVlKSkpIHtcbiAgICAgICAgLy8gRmxhdHRlbiBjdXJyZW50IGxldmVsIG9mIGFycmF5IG9yIGFyZ3VtZW50cyBvYmplY3QuXG4gICAgICAgIGlmIChkZXB0aCA+IDEpIHtcbiAgICAgICAgICBmbGF0dGVuJDEodmFsdWUsIGRlcHRoIC0gMSwgc3RyaWN0LCBvdXRwdXQpO1xuICAgICAgICAgIGlkeCA9IG91dHB1dC5sZW5ndGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGogPSAwLCBsZW4gPSB2YWx1ZS5sZW5ndGg7XG4gICAgICAgICAgd2hpbGUgKGogPCBsZW4pIG91dHB1dFtpZHgrK10gPSB2YWx1ZVtqKytdO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFzdHJpY3QpIHtcbiAgICAgICAgb3V0cHV0W2lkeCsrXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9XG5cbiAgLy8gQmluZCBhIG51bWJlciBvZiBhbiBvYmplY3QncyBtZXRob2RzIHRvIHRoYXQgb2JqZWN0LiBSZW1haW5pbmcgYXJndW1lbnRzXG4gIC8vIGFyZSB0aGUgbWV0aG9kIG5hbWVzIHRvIGJlIGJvdW5kLiBVc2VmdWwgZm9yIGVuc3VyaW5nIHRoYXQgYWxsIGNhbGxiYWNrc1xuICAvLyBkZWZpbmVkIG9uIGFuIG9iamVjdCBiZWxvbmcgdG8gaXQuXG4gIHZhciBiaW5kQWxsID0gcmVzdEFyZ3VtZW50cyhmdW5jdGlvbihvYmosIGtleXMpIHtcbiAgICBrZXlzID0gZmxhdHRlbiQxKGtleXMsIGZhbHNlLCBmYWxzZSk7XG4gICAgdmFyIGluZGV4ID0ga2V5cy5sZW5ndGg7XG4gICAgaWYgKGluZGV4IDwgMSkgdGhyb3cgbmV3IEVycm9yKCdiaW5kQWxsIG11c3QgYmUgcGFzc2VkIGZ1bmN0aW9uIG5hbWVzJyk7XG4gICAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2luZGV4XTtcbiAgICAgIG9ialtrZXldID0gYmluZChvYmpba2V5XSwgb2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfSk7XG5cbiAgLy8gTWVtb2l6ZSBhbiBleHBlbnNpdmUgZnVuY3Rpb24gYnkgc3RvcmluZyBpdHMgcmVzdWx0cy5cbiAgZnVuY3Rpb24gbWVtb2l6ZShmdW5jLCBoYXNoZXIpIHtcbiAgICB2YXIgbWVtb2l6ZSA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIGNhY2hlID0gbWVtb2l6ZS5jYWNoZTtcbiAgICAgIHZhciBhZGRyZXNzID0gJycgKyAoaGFzaGVyID8gaGFzaGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOiBrZXkpO1xuICAgICAgaWYgKCFoYXMkMShjYWNoZSwgYWRkcmVzcykpIGNhY2hlW2FkZHJlc3NdID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIGNhY2hlW2FkZHJlc3NdO1xuICAgIH07XG4gICAgbWVtb2l6ZS5jYWNoZSA9IHt9O1xuICAgIHJldHVybiBtZW1vaXplO1xuICB9XG5cbiAgLy8gRGVsYXlzIGEgZnVuY3Rpb24gZm9yIHRoZSBnaXZlbiBudW1iZXIgb2YgbWlsbGlzZWNvbmRzLCBhbmQgdGhlbiBjYWxsc1xuICAvLyBpdCB3aXRoIHRoZSBhcmd1bWVudHMgc3VwcGxpZWQuXG4gIHZhciBkZWxheSA9IHJlc3RBcmd1bWVudHMoZnVuY3Rpb24oZnVuYywgd2FpdCwgYXJncykge1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgfSwgd2FpdCk7XG4gIH0pO1xuXG4gIC8vIERlZmVycyBhIGZ1bmN0aW9uLCBzY2hlZHVsaW5nIGl0IHRvIHJ1biBhZnRlciB0aGUgY3VycmVudCBjYWxsIHN0YWNrIGhhc1xuICAvLyBjbGVhcmVkLlxuICB2YXIgZGVmZXIgPSBwYXJ0aWFsKGRlbGF5LCBfJDEsIDEpO1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgd2hlbiBpbnZva2VkLCB3aWxsIG9ubHkgYmUgdHJpZ2dlcmVkIGF0IG1vc3Qgb25jZVxuICAvLyBkdXJpbmcgYSBnaXZlbiB3aW5kb3cgb2YgdGltZS4gTm9ybWFsbHksIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gd2lsbCBydW5cbiAgLy8gYXMgbXVjaCBhcyBpdCBjYW4sIHdpdGhvdXQgZXZlciBnb2luZyBtb3JlIHRoYW4gb25jZSBwZXIgYHdhaXRgIGR1cmF0aW9uO1xuICAvLyBidXQgaWYgeW91J2QgbGlrZSB0byBkaXNhYmxlIHRoZSBleGVjdXRpb24gb24gdGhlIGxlYWRpbmcgZWRnZSwgcGFzc1xuICAvLyBge2xlYWRpbmc6IGZhbHNlfWAuIFRvIGRpc2FibGUgZXhlY3V0aW9uIG9uIHRoZSB0cmFpbGluZyBlZGdlLCBkaXR0by5cbiAgZnVuY3Rpb24gdGhyb3R0bGUoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICAgIHZhciB0aW1lb3V0LCBjb250ZXh0LCBhcmdzLCByZXN1bHQ7XG4gICAgdmFyIHByZXZpb3VzID0gMDtcbiAgICBpZiAoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fTtcblxuICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcHJldmlvdXMgPSBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlID8gMCA6IG5vdygpO1xuICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgfTtcblxuICAgIHZhciB0aHJvdHRsZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBfbm93ID0gbm93KCk7XG4gICAgICBpZiAoIXByZXZpb3VzICYmIG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UpIHByZXZpb3VzID0gX25vdztcbiAgICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKF9ub3cgLSBwcmV2aW91cyk7XG4gICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBpZiAocmVtYWluaW5nIDw9IDAgfHwgcmVtYWluaW5nID4gd2FpdCkge1xuICAgICAgICBpZiAodGltZW91dCkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBwcmV2aW91cyA9IF9ub3c7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgfSBlbHNlIGlmICghdGltZW91dCAmJiBvcHRpb25zLnRyYWlsaW5nICE9PSBmYWxzZSkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHRocm90dGxlZC5jYW5jZWwgPSBmdW5jdGlvbigpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIHByZXZpb3VzID0gMDtcbiAgICAgIHRpbWVvdXQgPSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgfTtcblxuICAgIHJldHVybiB0aHJvdHRsZWQ7XG4gIH1cblxuICAvLyBXaGVuIGEgc2VxdWVuY2Ugb2YgY2FsbHMgb2YgdGhlIHJldHVybmVkIGZ1bmN0aW9uIGVuZHMsIHRoZSBhcmd1bWVudFxuICAvLyBmdW5jdGlvbiBpcyB0cmlnZ2VyZWQuIFRoZSBlbmQgb2YgYSBzZXF1ZW5jZSBpcyBkZWZpbmVkIGJ5IHRoZSBgd2FpdGBcbiAgLy8gcGFyYW1ldGVyLiBJZiBgaW1tZWRpYXRlYCBpcyBwYXNzZWQsIHRoZSBhcmd1bWVudCBmdW5jdGlvbiB3aWxsIGJlXG4gIC8vIHRyaWdnZXJlZCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBzZXF1ZW5jZSBpbnN0ZWFkIG9mIGF0IHRoZSBlbmQuXG4gIGZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICAgIHZhciB0aW1lb3V0LCBwcmV2aW91cywgYXJncywgcmVzdWx0LCBjb250ZXh0O1xuXG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcGFzc2VkID0gbm93KCkgLSBwcmV2aW91cztcbiAgICAgIGlmICh3YWl0ID4gcGFzc2VkKSB7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0IC0gcGFzc2VkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBpZiAoIWltbWVkaWF0ZSkgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgLy8gVGhpcyBjaGVjayBpcyBuZWVkZWQgYmVjYXVzZSBgZnVuY2AgY2FuIHJlY3Vyc2l2ZWx5IGludm9rZSBgZGVib3VuY2VkYC5cbiAgICAgICAgaWYgKCF0aW1lb3V0KSBhcmdzID0gY29udGV4dCA9IG51bGw7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBkZWJvdW5jZWQgPSByZXN0QXJndW1lbnRzKGZ1bmN0aW9uKF9hcmdzKSB7XG4gICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgIGFyZ3MgPSBfYXJncztcbiAgICAgIHByZXZpb3VzID0gbm93KCk7XG4gICAgICBpZiAoIXRpbWVvdXQpIHtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgICBpZiAoaW1tZWRpYXRlKSByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9KTtcblxuICAgIGRlYm91bmNlZC5jYW5jZWwgPSBmdW5jdGlvbigpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIHRpbWVvdXQgPSBhcmdzID0gY29udGV4dCA9IG51bGw7XG4gICAgfTtcblxuICAgIHJldHVybiBkZWJvdW5jZWQ7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBmdW5jdGlvbiBwYXNzZWQgYXMgYW4gYXJndW1lbnQgdG8gdGhlIHNlY29uZCxcbiAgLy8gYWxsb3dpbmcgeW91IHRvIGFkanVzdCBhcmd1bWVudHMsIHJ1biBjb2RlIGJlZm9yZSBhbmQgYWZ0ZXIsIGFuZFxuICAvLyBjb25kaXRpb25hbGx5IGV4ZWN1dGUgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uLlxuICBmdW5jdGlvbiB3cmFwKGZ1bmMsIHdyYXBwZXIpIHtcbiAgICByZXR1cm4gcGFydGlhbCh3cmFwcGVyLCBmdW5jKTtcbiAgfVxuXG4gIC8vIFJldHVybnMgYSBuZWdhdGVkIHZlcnNpb24gb2YgdGhlIHBhc3NlZC1pbiBwcmVkaWNhdGUuXG4gIGZ1bmN0aW9uIG5lZ2F0ZShwcmVkaWNhdGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gIXByZWRpY2F0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBpcyB0aGUgY29tcG9zaXRpb24gb2YgYSBsaXN0IG9mIGZ1bmN0aW9ucywgZWFjaFxuICAvLyBjb25zdW1pbmcgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZnVuY3Rpb24gdGhhdCBmb2xsb3dzLlxuICBmdW5jdGlvbiBjb21wb3NlKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgIHZhciBzdGFydCA9IGFyZ3MubGVuZ3RoIC0gMTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaSA9IHN0YXJ0O1xuICAgICAgdmFyIHJlc3VsdCA9IGFyZ3Nbc3RhcnRdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB3aGlsZSAoaS0tKSByZXN1bHQgPSBhcmdzW2ldLmNhbGwodGhpcywgcmVzdWx0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgb25seSBiZSBleGVjdXRlZCBvbiBhbmQgYWZ0ZXIgdGhlIE50aCBjYWxsLlxuICBmdW5jdGlvbiBhZnRlcih0aW1lcywgZnVuYykge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLXRpbWVzIDwgMSkge1xuICAgICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgdXAgdG8gKGJ1dCBub3QgaW5jbHVkaW5nKSB0aGVcbiAgLy8gTnRoIGNhbGwuXG4gIGZ1bmN0aW9uIGJlZm9yZSh0aW1lcywgZnVuYykge1xuICAgIHZhciBtZW1vO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLXRpbWVzID4gMCkge1xuICAgICAgICBtZW1vID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgICAgaWYgKHRpbWVzIDw9IDEpIGZ1bmMgPSBudWxsO1xuICAgICAgcmV0dXJuIG1lbW87XG4gICAgfTtcbiAgfVxuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgYXQgbW9zdCBvbmUgdGltZSwgbm8gbWF0dGVyIGhvd1xuICAvLyBvZnRlbiB5b3UgY2FsbCBpdC4gVXNlZnVsIGZvciBsYXp5IGluaXRpYWxpemF0aW9uLlxuICB2YXIgb25jZSA9IHBhcnRpYWwoYmVmb3JlLCAyKTtcblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBrZXkgb24gYW4gb2JqZWN0IHRoYXQgcGFzc2VzIGEgdHJ1dGggdGVzdC5cbiAgZnVuY3Rpb24gZmluZEtleShvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIF9rZXlzID0ga2V5cyhvYmopLCBrZXk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IF9rZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBrZXkgPSBfa2V5c1tpXTtcbiAgICAgIGlmIChwcmVkaWNhdGUob2JqW2tleV0sIGtleSwgb2JqKSkgcmV0dXJuIGtleTtcbiAgICB9XG4gIH1cblxuICAvLyBJbnRlcm5hbCBmdW5jdGlvbiB0byBnZW5lcmF0ZSBgXy5maW5kSW5kZXhgIGFuZCBgXy5maW5kTGFzdEluZGV4YC5cbiAgZnVuY3Rpb24gY3JlYXRlUHJlZGljYXRlSW5kZXhGaW5kZXIoZGlyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGFycmF5LCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgICB2YXIgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTtcbiAgICAgIHZhciBpbmRleCA9IGRpciA+IDAgPyAwIDogbGVuZ3RoIC0gMTtcbiAgICAgIGZvciAoOyBpbmRleCA+PSAwICYmIGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSBkaXIpIHtcbiAgICAgICAgaWYgKHByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHJldHVybiBpbmRleDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgICB9O1xuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgZmlyc3QgaW5kZXggb24gYW4gYXJyYXktbGlrZSB0aGF0IHBhc3NlcyBhIHRydXRoIHRlc3QuXG4gIHZhciBmaW5kSW5kZXggPSBjcmVhdGVQcmVkaWNhdGVJbmRleEZpbmRlcigxKTtcblxuICAvLyBSZXR1cm5zIHRoZSBsYXN0IGluZGV4IG9uIGFuIGFycmF5LWxpa2UgdGhhdCBwYXNzZXMgYSB0cnV0aCB0ZXN0LlxuICB2YXIgZmluZExhc3RJbmRleCA9IGNyZWF0ZVByZWRpY2F0ZUluZGV4RmluZGVyKC0xKTtcblxuICAvLyBVc2UgYSBjb21wYXJhdG9yIGZ1bmN0aW9uIHRvIGZpZ3VyZSBvdXQgdGhlIHNtYWxsZXN0IGluZGV4IGF0IHdoaWNoXG4gIC8vIGFuIG9iamVjdCBzaG91bGQgYmUgaW5zZXJ0ZWQgc28gYXMgdG8gbWFpbnRhaW4gb3JkZXIuIFVzZXMgYmluYXJ5IHNlYXJjaC5cbiAgZnVuY3Rpb24gc29ydGVkSW5kZXgoYXJyYXksIG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0LCAxKTtcbiAgICB2YXIgdmFsdWUgPSBpdGVyYXRlZShvYmopO1xuICAgIHZhciBsb3cgPSAwLCBoaWdoID0gZ2V0TGVuZ3RoKGFycmF5KTtcbiAgICB3aGlsZSAobG93IDwgaGlnaCkge1xuICAgICAgdmFyIG1pZCA9IE1hdGguZmxvb3IoKGxvdyArIGhpZ2gpIC8gMik7XG4gICAgICBpZiAoaXRlcmF0ZWUoYXJyYXlbbWlkXSkgPCB2YWx1ZSkgbG93ID0gbWlkICsgMTsgZWxzZSBoaWdoID0gbWlkO1xuICAgIH1cbiAgICByZXR1cm4gbG93O1xuICB9XG5cbiAgLy8gSW50ZXJuYWwgZnVuY3Rpb24gdG8gZ2VuZXJhdGUgdGhlIGBfLmluZGV4T2ZgIGFuZCBgXy5sYXN0SW5kZXhPZmAgZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBjcmVhdGVJbmRleEZpbmRlcihkaXIsIHByZWRpY2F0ZUZpbmQsIHNvcnRlZEluZGV4KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGFycmF5LCBpdGVtLCBpZHgpIHtcbiAgICAgIHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTtcbiAgICAgIGlmICh0eXBlb2YgaWR4ID09ICdudW1iZXInKSB7XG4gICAgICAgIGlmIChkaXIgPiAwKSB7XG4gICAgICAgICAgaSA9IGlkeCA+PSAwID8gaWR4IDogTWF0aC5tYXgoaWR4ICsgbGVuZ3RoLCBpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsZW5ndGggPSBpZHggPj0gMCA/IE1hdGgubWluKGlkeCArIDEsIGxlbmd0aCkgOiBpZHggKyBsZW5ndGggKyAxO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHNvcnRlZEluZGV4ICYmIGlkeCAmJiBsZW5ndGgpIHtcbiAgICAgICAgaWR4ID0gc29ydGVkSW5kZXgoYXJyYXksIGl0ZW0pO1xuICAgICAgICByZXR1cm4gYXJyYXlbaWR4XSA9PT0gaXRlbSA/IGlkeCA6IC0xO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0gIT09IGl0ZW0pIHtcbiAgICAgICAgaWR4ID0gcHJlZGljYXRlRmluZChzbGljZS5jYWxsKGFycmF5LCBpLCBsZW5ndGgpLCBpc05hTiQxKTtcbiAgICAgICAgcmV0dXJuIGlkeCA+PSAwID8gaWR4ICsgaSA6IC0xO1xuICAgICAgfVxuICAgICAgZm9yIChpZHggPSBkaXIgPiAwID8gaSA6IGxlbmd0aCAtIDE7IGlkeCA+PSAwICYmIGlkeCA8IGxlbmd0aDsgaWR4ICs9IGRpcikge1xuICAgICAgICBpZiAoYXJyYXlbaWR4XSA9PT0gaXRlbSkgcmV0dXJuIGlkeDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgICB9O1xuICB9XG5cbiAgLy8gUmV0dXJuIHRoZSBwb3NpdGlvbiBvZiB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiBhbiBpdGVtIGluIGFuIGFycmF5LFxuICAvLyBvciAtMSBpZiB0aGUgaXRlbSBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIGFycmF5LlxuICAvLyBJZiB0aGUgYXJyYXkgaXMgbGFyZ2UgYW5kIGFscmVhZHkgaW4gc29ydCBvcmRlciwgcGFzcyBgdHJ1ZWBcbiAgLy8gZm9yICoqaXNTb3J0ZWQqKiB0byB1c2UgYmluYXJ5IHNlYXJjaC5cbiAgdmFyIGluZGV4T2YgPSBjcmVhdGVJbmRleEZpbmRlcigxLCBmaW5kSW5kZXgsIHNvcnRlZEluZGV4KTtcblxuICAvLyBSZXR1cm4gdGhlIHBvc2l0aW9uIG9mIHRoZSBsYXN0IG9jY3VycmVuY2Ugb2YgYW4gaXRlbSBpbiBhbiBhcnJheSxcbiAgLy8gb3IgLTEgaWYgdGhlIGl0ZW0gaXMgbm90IGluY2x1ZGVkIGluIHRoZSBhcnJheS5cbiAgdmFyIGxhc3RJbmRleE9mID0gY3JlYXRlSW5kZXhGaW5kZXIoLTEsIGZpbmRMYXN0SW5kZXgpO1xuXG4gIC8vIFJldHVybiB0aGUgZmlyc3QgdmFsdWUgd2hpY2ggcGFzc2VzIGEgdHJ1dGggdGVzdC5cbiAgZnVuY3Rpb24gZmluZChvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBrZXlGaW5kZXIgPSBpc0FycmF5TGlrZShvYmopID8gZmluZEluZGV4IDogZmluZEtleTtcbiAgICB2YXIga2V5ID0ga2V5RmluZGVyKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICBpZiAoa2V5ICE9PSB2b2lkIDAgJiYga2V5ICE9PSAtMSkgcmV0dXJuIG9ialtrZXldO1xuICB9XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgXy5maW5kYDogZ2V0dGluZyB0aGUgZmlyc3RcbiAgLy8gb2JqZWN0IGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIGZ1bmN0aW9uIGZpbmRXaGVyZShvYmosIGF0dHJzKSB7XG4gICAgcmV0dXJuIGZpbmQob2JqLCBtYXRjaGVyKGF0dHJzKSk7XG4gIH1cblxuICAvLyBUaGUgY29ybmVyc3RvbmUgZm9yIGNvbGxlY3Rpb24gZnVuY3Rpb25zLCBhbiBgZWFjaGBcbiAgLy8gaW1wbGVtZW50YXRpb24sIGFrYSBgZm9yRWFjaGAuXG4gIC8vIEhhbmRsZXMgcmF3IG9iamVjdHMgaW4gYWRkaXRpb24gdG8gYXJyYXktbGlrZXMuIFRyZWF0cyBhbGxcbiAgLy8gc3BhcnNlIGFycmF5LWxpa2VzIGFzIGlmIHRoZXkgd2VyZSBkZW5zZS5cbiAgZnVuY3Rpb24gZWFjaChvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIgaSwgbGVuZ3RoO1xuICAgIGlmIChpc0FycmF5TGlrZShvYmopKSB7XG4gICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBvYmoubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlcmF0ZWUob2JqW2ldLCBpLCBvYmopO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgX2tleXMgPSBrZXlzKG9iaik7XG4gICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBfa2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVyYXRlZShvYmpbX2tleXNbaV1dLCBfa2V5c1tpXSwgb2JqKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIC8vIFJldHVybiB0aGUgcmVzdWx0cyBvZiBhcHBseWluZyB0aGUgaXRlcmF0ZWUgdG8gZWFjaCBlbGVtZW50LlxuICBmdW5jdGlvbiBtYXAob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciBfa2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIGtleXMob2JqKSxcbiAgICAgICAgbGVuZ3RoID0gKF9rZXlzIHx8IG9iaikubGVuZ3RoLFxuICAgICAgICByZXN1bHRzID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgY3VycmVudEtleSA9IF9rZXlzID8gX2tleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICByZXN1bHRzW2luZGV4XSA9IGl0ZXJhdGVlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICAvLyBJbnRlcm5hbCBoZWxwZXIgdG8gY3JlYXRlIGEgcmVkdWNpbmcgZnVuY3Rpb24sIGl0ZXJhdGluZyBsZWZ0IG9yIHJpZ2h0LlxuICBmdW5jdGlvbiBjcmVhdGVSZWR1Y2UoZGlyKSB7XG4gICAgLy8gV3JhcCBjb2RlIHRoYXQgcmVhc3NpZ25zIGFyZ3VtZW50IHZhcmlhYmxlcyBpbiBhIHNlcGFyYXRlIGZ1bmN0aW9uIHRoYW5cbiAgICAvLyB0aGUgb25lIHRoYXQgYWNjZXNzZXMgYGFyZ3VtZW50cy5sZW5ndGhgIHRvIGF2b2lkIGEgcGVyZiBoaXQuICgjMTk5MSlcbiAgICB2YXIgcmVkdWNlciA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIG1lbW8sIGluaXRpYWwpIHtcbiAgICAgIHZhciBfa2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIGtleXMob2JqKSxcbiAgICAgICAgICBsZW5ndGggPSAoX2tleXMgfHwgb2JqKS5sZW5ndGgsXG4gICAgICAgICAgaW5kZXggPSBkaXIgPiAwID8gMCA6IGxlbmd0aCAtIDE7XG4gICAgICBpZiAoIWluaXRpYWwpIHtcbiAgICAgICAgbWVtbyA9IG9ialtfa2V5cyA/IF9rZXlzW2luZGV4XSA6IGluZGV4XTtcbiAgICAgICAgaW5kZXggKz0gZGlyO1xuICAgICAgfVxuICAgICAgZm9yICg7IGluZGV4ID49IDAgJiYgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IGRpcikge1xuICAgICAgICB2YXIgY3VycmVudEtleSA9IF9rZXlzID8gX2tleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICAgIG1lbW8gPSBpdGVyYXRlZShtZW1vLCBvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaik7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWVtbztcbiAgICB9O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIG1lbW8sIGNvbnRleHQpIHtcbiAgICAgIHZhciBpbml0aWFsID0gYXJndW1lbnRzLmxlbmd0aCA+PSAzO1xuICAgICAgcmV0dXJuIHJlZHVjZXIob2JqLCBvcHRpbWl6ZUNiKGl0ZXJhdGVlLCBjb250ZXh0LCA0KSwgbWVtbywgaW5pdGlhbCk7XG4gICAgfTtcbiAgfVxuXG4gIC8vICoqUmVkdWNlKiogYnVpbGRzIHVwIGEgc2luZ2xlIHJlc3VsdCBmcm9tIGEgbGlzdCBvZiB2YWx1ZXMsIGFrYSBgaW5qZWN0YCxcbiAgLy8gb3IgYGZvbGRsYC5cbiAgdmFyIHJlZHVjZSA9IGNyZWF0ZVJlZHVjZSgxKTtcblxuICAvLyBUaGUgcmlnaHQtYXNzb2NpYXRpdmUgdmVyc2lvbiBvZiByZWR1Y2UsIGFsc28ga25vd24gYXMgYGZvbGRyYC5cbiAgdmFyIHJlZHVjZVJpZ2h0ID0gY3JlYXRlUmVkdWNlKC0xKTtcblxuICAvLyBSZXR1cm4gYWxsIHRoZSBlbGVtZW50cyB0aGF0IHBhc3MgYSB0cnV0aCB0ZXN0LlxuICBmdW5jdGlvbiBmaWx0ZXIob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSwgaW5kZXgsIGxpc3QpKSByZXN1bHRzLnB1c2godmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgZm9yIHdoaWNoIGEgdHJ1dGggdGVzdCBmYWlscy5cbiAgZnVuY3Rpb24gcmVqZWN0KG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIGZpbHRlcihvYmosIG5lZ2F0ZShjYihwcmVkaWNhdGUpKSwgY29udGV4dCk7XG4gIH1cblxuICAvLyBEZXRlcm1pbmUgd2hldGhlciBhbGwgb2YgdGhlIGVsZW1lbnRzIHBhc3MgYSB0cnV0aCB0ZXN0LlxuICBmdW5jdGlvbiBldmVyeShvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIF9rZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYga2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSAoX2tleXMgfHwgb2JqKS5sZW5ndGg7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGN1cnJlbnRLZXkgPSBfa2V5cyA/IF9rZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgaWYgKCFwcmVkaWNhdGUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIGF0IGxlYXN0IG9uZSBlbGVtZW50IGluIHRoZSBvYmplY3QgcGFzc2VzIGEgdHJ1dGggdGVzdC5cbiAgZnVuY3Rpb24gc29tZShvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIF9rZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYga2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSAoX2tleXMgfHwgb2JqKS5sZW5ndGg7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGN1cnJlbnRLZXkgPSBfa2V5cyA/IF9rZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgaWYgKHByZWRpY2F0ZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaikpIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBEZXRlcm1pbmUgaWYgdGhlIGFycmF5IG9yIG9iamVjdCBjb250YWlucyBhIGdpdmVuIGl0ZW0gKHVzaW5nIGA9PT1gKS5cbiAgZnVuY3Rpb24gY29udGFpbnMob2JqLCBpdGVtLCBmcm9tSW5kZXgsIGd1YXJkKSB7XG4gICAgaWYgKCFpc0FycmF5TGlrZShvYmopKSBvYmogPSB2YWx1ZXMob2JqKTtcbiAgICBpZiAodHlwZW9mIGZyb21JbmRleCAhPSAnbnVtYmVyJyB8fCBndWFyZCkgZnJvbUluZGV4ID0gMDtcbiAgICByZXR1cm4gaW5kZXhPZihvYmosIGl0ZW0sIGZyb21JbmRleCkgPj0gMDtcbiAgfVxuXG4gIC8vIEludm9rZSBhIG1ldGhvZCAod2l0aCBhcmd1bWVudHMpIG9uIGV2ZXJ5IGl0ZW0gaW4gYSBjb2xsZWN0aW9uLlxuICB2YXIgaW52b2tlID0gcmVzdEFyZ3VtZW50cyhmdW5jdGlvbihvYmosIHBhdGgsIGFyZ3MpIHtcbiAgICB2YXIgY29udGV4dFBhdGgsIGZ1bmM7XG4gICAgaWYgKGlzRnVuY3Rpb24kMShwYXRoKSkge1xuICAgICAgZnVuYyA9IHBhdGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhdGggPSB0b1BhdGgocGF0aCk7XG4gICAgICBjb250ZXh0UGF0aCA9IHBhdGguc2xpY2UoMCwgLTEpO1xuICAgICAgcGF0aCA9IHBhdGhbcGF0aC5sZW5ndGggLSAxXTtcbiAgICB9XG4gICAgcmV0dXJuIG1hcChvYmosIGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgICAgIHZhciBtZXRob2QgPSBmdW5jO1xuICAgICAgaWYgKCFtZXRob2QpIHtcbiAgICAgICAgaWYgKGNvbnRleHRQYXRoICYmIGNvbnRleHRQYXRoLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnRleHQgPSBkZWVwR2V0KGNvbnRleHQsIGNvbnRleHRQYXRoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29udGV4dCA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgICAgICBtZXRob2QgPSBjb250ZXh0W3BhdGhdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1ldGhvZCA9PSBudWxsID8gbWV0aG9kIDogbWV0aG9kLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIH0pO1xuICB9KTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBfLm1hcGA6IGZldGNoaW5nIGEgcHJvcGVydHkuXG4gIGZ1bmN0aW9uIHBsdWNrKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIG1hcChvYmosIHByb3BlcnR5KGtleSkpO1xuICB9XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgXy5maWx0ZXJgOiBzZWxlY3Rpbmcgb25seVxuICAvLyBvYmplY3RzIGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIGZ1bmN0aW9uIHdoZXJlKG9iaiwgYXR0cnMpIHtcbiAgICByZXR1cm4gZmlsdGVyKG9iaiwgbWF0Y2hlcihhdHRycykpO1xuICB9XG5cbiAgLy8gUmV0dXJuIHRoZSBtYXhpbXVtIGVsZW1lbnQgKG9yIGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBmdW5jdGlvbiBtYXgob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSAtSW5maW5pdHksIGxhc3RDb21wdXRlZCA9IC1JbmZpbml0eSxcbiAgICAgICAgdmFsdWUsIGNvbXB1dGVkO1xuICAgIGlmIChpdGVyYXRlZSA9PSBudWxsIHx8IHR5cGVvZiBpdGVyYXRlZSA9PSAnbnVtYmVyJyAmJiB0eXBlb2Ygb2JqWzBdICE9ICdvYmplY3QnICYmIG9iaiAhPSBudWxsKSB7XG4gICAgICBvYmogPSBpc0FycmF5TGlrZShvYmopID8gb2JqIDogdmFsdWVzKG9iaik7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhbHVlID0gb2JqW2ldO1xuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSA+IHJlc3VsdCkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgICAgZWFjaChvYmosIGZ1bmN0aW9uKHYsIGluZGV4LCBsaXN0KSB7XG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUodiwgaW5kZXgsIGxpc3QpO1xuICAgICAgICBpZiAoY29tcHV0ZWQgPiBsYXN0Q29tcHV0ZWQgfHwgY29tcHV0ZWQgPT09IC1JbmZpbml0eSAmJiByZXN1bHQgPT09IC1JbmZpbml0eSkge1xuICAgICAgICAgIHJlc3VsdCA9IHY7XG4gICAgICAgICAgbGFzdENvbXB1dGVkID0gY29tcHV0ZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy8gUmV0dXJuIHRoZSBtaW5pbXVtIGVsZW1lbnQgKG9yIGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBmdW5jdGlvbiBtaW4ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSBJbmZpbml0eSwgbGFzdENvbXB1dGVkID0gSW5maW5pdHksXG4gICAgICAgIHZhbHVlLCBjb21wdXRlZDtcbiAgICBpZiAoaXRlcmF0ZWUgPT0gbnVsbCB8fCB0eXBlb2YgaXRlcmF0ZWUgPT0gJ251bWJlcicgJiYgdHlwZW9mIG9ialswXSAhPSAnb2JqZWN0JyAmJiBvYmogIT0gbnVsbCkge1xuICAgICAgb2JqID0gaXNBcnJheUxpa2Uob2JqKSA/IG9iaiA6IHZhbHVlcyhvYmopO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB2YWx1ZSA9IG9ialtpXTtcbiAgICAgICAgaWYgKHZhbHVlICE9IG51bGwgJiYgdmFsdWUgPCByZXN1bHQpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICAgIGVhY2gob2JqLCBmdW5jdGlvbih2LCBpbmRleCwgbGlzdCkge1xuICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlKHYsIGluZGV4LCBsaXN0KTtcbiAgICAgICAgaWYgKGNvbXB1dGVkIDwgbGFzdENvbXB1dGVkIHx8IGNvbXB1dGVkID09PSBJbmZpbml0eSAmJiByZXN1bHQgPT09IEluZmluaXR5KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdjtcbiAgICAgICAgICBsYXN0Q29tcHV0ZWQgPSBjb21wdXRlZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBTYWZlbHkgY3JlYXRlIGEgcmVhbCwgbGl2ZSBhcnJheSBmcm9tIGFueXRoaW5nIGl0ZXJhYmxlLlxuICB2YXIgcmVTdHJTeW1ib2wgPSAvW15cXHVkODAwLVxcdWRmZmZdfFtcXHVkODAwLVxcdWRiZmZdW1xcdWRjMDAtXFx1ZGZmZl18W1xcdWQ4MDAtXFx1ZGZmZl0vZztcbiAgZnVuY3Rpb24gdG9BcnJheShvYmopIHtcbiAgICBpZiAoIW9iaikgcmV0dXJuIFtdO1xuICAgIGlmIChpc0FycmF5KG9iaikpIHJldHVybiBzbGljZS5jYWxsKG9iaik7XG4gICAgaWYgKGlzU3RyaW5nKG9iaikpIHtcbiAgICAgIC8vIEtlZXAgc3Vycm9nYXRlIHBhaXIgY2hhcmFjdGVycyB0b2dldGhlci5cbiAgICAgIHJldHVybiBvYmoubWF0Y2gocmVTdHJTeW1ib2wpO1xuICAgIH1cbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSkgcmV0dXJuIG1hcChvYmosIGlkZW50aXR5KTtcbiAgICByZXR1cm4gdmFsdWVzKG9iaik7XG4gIH1cblxuICAvLyBTYW1wbGUgKipuKiogcmFuZG9tIHZhbHVlcyBmcm9tIGEgY29sbGVjdGlvbiB1c2luZyB0aGUgbW9kZXJuIHZlcnNpb24gb2YgdGhlXG4gIC8vIFtGaXNoZXItWWF0ZXMgc2h1ZmZsZV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRmlzaGVy4oCTWWF0ZXNfc2h1ZmZsZSkuXG4gIC8vIElmICoqbioqIGlzIG5vdCBzcGVjaWZpZWQsIHJldHVybnMgYSBzaW5nbGUgcmFuZG9tIGVsZW1lbnQuXG4gIC8vIFRoZSBpbnRlcm5hbCBgZ3VhcmRgIGFyZ3VtZW50IGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgZnVuY3Rpb24gc2FtcGxlKG9iaiwgbiwgZ3VhcmQpIHtcbiAgICBpZiAobiA9PSBudWxsIHx8IGd1YXJkKSB7XG4gICAgICBpZiAoIWlzQXJyYXlMaWtlKG9iaikpIG9iaiA9IHZhbHVlcyhvYmopO1xuICAgICAgcmV0dXJuIG9ialtyYW5kb20ob2JqLmxlbmd0aCAtIDEpXTtcbiAgICB9XG4gICAgdmFyIHNhbXBsZSA9IHRvQXJyYXkob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0gZ2V0TGVuZ3RoKHNhbXBsZSk7XG4gICAgbiA9IE1hdGgubWF4KE1hdGgubWluKG4sIGxlbmd0aCksIDApO1xuICAgIHZhciBsYXN0ID0gbGVuZ3RoIC0gMTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbjsgaW5kZXgrKykge1xuICAgICAgdmFyIHJhbmQgPSByYW5kb20oaW5kZXgsIGxhc3QpO1xuICAgICAgdmFyIHRlbXAgPSBzYW1wbGVbaW5kZXhdO1xuICAgICAgc2FtcGxlW2luZGV4XSA9IHNhbXBsZVtyYW5kXTtcbiAgICAgIHNhbXBsZVtyYW5kXSA9IHRlbXA7XG4gICAgfVxuICAgIHJldHVybiBzYW1wbGUuc2xpY2UoMCwgbik7XG4gIH1cblxuICAvLyBTaHVmZmxlIGEgY29sbGVjdGlvbi5cbiAgZnVuY3Rpb24gc2h1ZmZsZShvYmopIHtcbiAgICByZXR1cm4gc2FtcGxlKG9iaiwgSW5maW5pdHkpO1xuICB9XG5cbiAgLy8gU29ydCB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uIHByb2R1Y2VkIGJ5IGFuIGl0ZXJhdGVlLlxuICBmdW5jdGlvbiBzb3J0Qnkob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgcmV0dXJuIHBsdWNrKG1hcChvYmosIGZ1bmN0aW9uKHZhbHVlLCBrZXksIGxpc3QpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgaW5kZXg6IGluZGV4KyssXG4gICAgICAgIGNyaXRlcmlhOiBpdGVyYXRlZSh2YWx1ZSwga2V5LCBsaXN0KVxuICAgICAgfTtcbiAgICB9KS5zb3J0KGZ1bmN0aW9uKGxlZnQsIHJpZ2h0KSB7XG4gICAgICB2YXIgYSA9IGxlZnQuY3JpdGVyaWE7XG4gICAgICB2YXIgYiA9IHJpZ2h0LmNyaXRlcmlhO1xuICAgICAgaWYgKGEgIT09IGIpIHtcbiAgICAgICAgaWYgKGEgPiBiIHx8IGEgPT09IHZvaWQgMCkgcmV0dXJuIDE7XG4gICAgICAgIGlmIChhIDwgYiB8fCBiID09PSB2b2lkIDApIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsZWZ0LmluZGV4IC0gcmlnaHQuaW5kZXg7XG4gICAgfSksICd2YWx1ZScpO1xuICB9XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gdXNlZCBmb3IgYWdncmVnYXRlIFwiZ3JvdXAgYnlcIiBvcGVyYXRpb25zLlxuICBmdW5jdGlvbiBncm91cChiZWhhdmlvciwgcGFydGl0aW9uKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICAgIHZhciByZXN1bHQgPSBwYXJ0aXRpb24gPyBbW10sIFtdXSA6IHt9O1xuICAgICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICAgIHZhciBrZXkgPSBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIG9iaik7XG4gICAgICAgIGJlaGF2aW9yKHJlc3VsdCwgdmFsdWUsIGtleSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfVxuXG4gIC8vIEdyb3VwcyB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uLiBQYXNzIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGVcbiAgLy8gdG8gZ3JvdXAgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBjcml0ZXJpb24uXG4gIHZhciBncm91cEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgaWYgKGhhcyQxKHJlc3VsdCwga2V5KSkgcmVzdWx0W2tleV0ucHVzaCh2YWx1ZSk7IGVsc2UgcmVzdWx0W2tleV0gPSBbdmFsdWVdO1xuICB9KTtcblxuICAvLyBJbmRleGVzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24sIHNpbWlsYXIgdG8gYF8uZ3JvdXBCeWAsIGJ1dCBmb3JcbiAgLy8gd2hlbiB5b3Uga25vdyB0aGF0IHlvdXIgaW5kZXggdmFsdWVzIHdpbGwgYmUgdW5pcXVlLlxuICB2YXIgaW5kZXhCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gIH0pO1xuXG4gIC8vIENvdW50cyBpbnN0YW5jZXMgb2YgYW4gb2JqZWN0IHRoYXQgZ3JvdXAgYnkgYSBjZXJ0YWluIGNyaXRlcmlvbi4gUGFzc1xuICAvLyBlaXRoZXIgYSBzdHJpbmcgYXR0cmlidXRlIHRvIGNvdW50IGJ5LCBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGVcbiAgLy8gY3JpdGVyaW9uLlxuICB2YXIgY291bnRCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICAgIGlmIChoYXMkMShyZXN1bHQsIGtleSkpIHJlc3VsdFtrZXldKys7IGVsc2UgcmVzdWx0W2tleV0gPSAxO1xuICB9KTtcblxuICAvLyBTcGxpdCBhIGNvbGxlY3Rpb24gaW50byB0d28gYXJyYXlzOiBvbmUgd2hvc2UgZWxlbWVudHMgYWxsIHBhc3MgdGhlIGdpdmVuXG4gIC8vIHRydXRoIHRlc3QsIGFuZCBvbmUgd2hvc2UgZWxlbWVudHMgYWxsIGRvIG5vdCBwYXNzIHRoZSB0cnV0aCB0ZXN0LlxuICB2YXIgcGFydGl0aW9uID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwgcGFzcykge1xuICAgIHJlc3VsdFtwYXNzID8gMCA6IDFdLnB1c2godmFsdWUpO1xuICB9LCB0cnVlKTtcblxuICAvLyBSZXR1cm4gdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiBhIGNvbGxlY3Rpb24uXG4gIGZ1bmN0aW9uIHNpemUob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gMDtcbiAgICByZXR1cm4gaXNBcnJheUxpa2Uob2JqKSA/IG9iai5sZW5ndGggOiBrZXlzKG9iaikubGVuZ3RoO1xuICB9XG5cbiAgLy8gSW50ZXJuYWwgYF8ucGlja2AgaGVscGVyIGZ1bmN0aW9uIHRvIGRldGVybWluZSB3aGV0aGVyIGBrZXlgIGlzIGFuIGVudW1lcmFibGVcbiAgLy8gcHJvcGVydHkgbmFtZSBvZiBgb2JqYC5cbiAgZnVuY3Rpb24ga2V5SW5PYmoodmFsdWUsIGtleSwgb2JqKSB7XG4gICAgcmV0dXJuIGtleSBpbiBvYmo7XG4gIH1cblxuICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgb25seSBjb250YWluaW5nIHRoZSBhbGxvd2VkIHByb3BlcnRpZXMuXG4gIHZhciBwaWNrID0gcmVzdEFyZ3VtZW50cyhmdW5jdGlvbihvYmosIGtleXMpIHtcbiAgICB2YXIgcmVzdWx0ID0ge30sIGl0ZXJhdGVlID0ga2V5c1swXTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHQ7XG4gICAgaWYgKGlzRnVuY3Rpb24kMShpdGVyYXRlZSkpIHtcbiAgICAgIGlmIChrZXlzLmxlbmd0aCA+IDEpIGl0ZXJhdGVlID0gb3B0aW1pemVDYihpdGVyYXRlZSwga2V5c1sxXSk7XG4gICAgICBrZXlzID0gYWxsS2V5cyhvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBpdGVyYXRlZSA9IGtleUluT2JqO1xuICAgICAga2V5cyA9IGZsYXR0ZW4kMShrZXlzLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgb2JqID0gT2JqZWN0KG9iaik7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgIHZhciB2YWx1ZSA9IG9ialtrZXldO1xuICAgICAgaWYgKGl0ZXJhdGVlKHZhbHVlLCBrZXksIG9iaikpIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0pO1xuXG4gIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCB3aXRob3V0IHRoZSBkaXNhbGxvd2VkIHByb3BlcnRpZXMuXG4gIHZhciBvbWl0ID0gcmVzdEFyZ3VtZW50cyhmdW5jdGlvbihvYmosIGtleXMpIHtcbiAgICB2YXIgaXRlcmF0ZWUgPSBrZXlzWzBdLCBjb250ZXh0O1xuICAgIGlmIChpc0Z1bmN0aW9uJDEoaXRlcmF0ZWUpKSB7XG4gICAgICBpdGVyYXRlZSA9IG5lZ2F0ZShpdGVyYXRlZSk7XG4gICAgICBpZiAoa2V5cy5sZW5ndGggPiAxKSBjb250ZXh0ID0ga2V5c1sxXTtcbiAgICB9IGVsc2Uge1xuICAgICAga2V5cyA9IG1hcChmbGF0dGVuJDEoa2V5cywgZmFsc2UsIGZhbHNlKSwgU3RyaW5nKTtcbiAgICAgIGl0ZXJhdGVlID0gZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICByZXR1cm4gIWNvbnRhaW5zKGtleXMsIGtleSk7XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gcGljayhvYmosIGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgfSk7XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgbGFzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEVzcGVjaWFsbHkgdXNlZnVsIG9uXG4gIC8vIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIGFsbCB0aGUgdmFsdWVzIGluXG4gIC8vIHRoZSBhcnJheSwgZXhjbHVkaW5nIHRoZSBsYXN0IE4uXG4gIGZ1bmN0aW9uIGluaXRpYWwoYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIDAsIE1hdGgubWF4KDAsIGFycmF5Lmxlbmd0aCAtIChuID09IG51bGwgfHwgZ3VhcmQgPyAxIDogbikpKTtcbiAgfVxuXG4gIC8vIEdldCB0aGUgZmlyc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgZmlyc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LiBUaGUgKipndWFyZCoqIGNoZWNrIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgZnVuY3Rpb24gZmlyc3QoYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwgfHwgYXJyYXkubGVuZ3RoIDwgMSkgcmV0dXJuIG4gPT0gbnVsbCB8fCBndWFyZCA/IHZvaWQgMCA6IFtdO1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHJldHVybiBhcnJheVswXTtcbiAgICByZXR1cm4gaW5pdGlhbChhcnJheSwgYXJyYXkubGVuZ3RoIC0gbik7XG4gIH1cblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBmaXJzdCBlbnRyeSBvZiB0aGUgYGFycmF5YC4gRXNwZWNpYWxseSB1c2VmdWwgb25cbiAgLy8gdGhlIGBhcmd1bWVudHNgIG9iamVjdC4gUGFzc2luZyBhbiAqKm4qKiB3aWxsIHJldHVybiB0aGUgcmVzdCBOIHZhbHVlcyBpbiB0aGVcbiAgLy8gYGFycmF5YC5cbiAgZnVuY3Rpb24gcmVzdChhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgbiA9PSBudWxsIHx8IGd1YXJkID8gMSA6IG4pO1xuICB9XG5cbiAgLy8gR2V0IHRoZSBsYXN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGxhc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LlxuICBmdW5jdGlvbiBsYXN0KGFycmF5LCBuLCBndWFyZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsIHx8IGFycmF5Lmxlbmd0aCA8IDEpIHJldHVybiBuID09IG51bGwgfHwgZ3VhcmQgPyB2b2lkIDAgOiBbXTtcbiAgICBpZiAobiA9PSBudWxsIHx8IGd1YXJkKSByZXR1cm4gYXJyYXlbYXJyYXkubGVuZ3RoIC0gMV07XG4gICAgcmV0dXJuIHJlc3QoYXJyYXksIE1hdGgubWF4KDAsIGFycmF5Lmxlbmd0aCAtIG4pKTtcbiAgfVxuXG4gIC8vIFRyaW0gb3V0IGFsbCBmYWxzeSB2YWx1ZXMgZnJvbSBhbiBhcnJheS5cbiAgZnVuY3Rpb24gY29tcGFjdChhcnJheSkge1xuICAgIHJldHVybiBmaWx0ZXIoYXJyYXksIEJvb2xlYW4pO1xuICB9XG5cbiAgLy8gRmxhdHRlbiBvdXQgYW4gYXJyYXksIGVpdGhlciByZWN1cnNpdmVseSAoYnkgZGVmYXVsdCksIG9yIHVwIHRvIGBkZXB0aGAuXG4gIC8vIFBhc3NpbmcgYHRydWVgIG9yIGBmYWxzZWAgYXMgYGRlcHRoYCBtZWFucyBgMWAgb3IgYEluZmluaXR5YCwgcmVzcGVjdGl2ZWx5LlxuICBmdW5jdGlvbiBmbGF0dGVuKGFycmF5LCBkZXB0aCkge1xuICAgIHJldHVybiBmbGF0dGVuJDEoYXJyYXksIGRlcHRoLCBmYWxzZSk7XG4gIH1cblxuICAvLyBUYWtlIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gb25lIGFycmF5IGFuZCBhIG51bWJlciBvZiBvdGhlciBhcnJheXMuXG4gIC8vIE9ubHkgdGhlIGVsZW1lbnRzIHByZXNlbnQgaW4ganVzdCB0aGUgZmlyc3QgYXJyYXkgd2lsbCByZW1haW4uXG4gIHZhciBkaWZmZXJlbmNlID0gcmVzdEFyZ3VtZW50cyhmdW5jdGlvbihhcnJheSwgcmVzdCkge1xuICAgIHJlc3QgPSBmbGF0dGVuJDEocmVzdCwgdHJ1ZSwgdHJ1ZSk7XG4gICAgcmV0dXJuIGZpbHRlcihhcnJheSwgZnVuY3Rpb24odmFsdWUpe1xuICAgICAgcmV0dXJuICFjb250YWlucyhyZXN0LCB2YWx1ZSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIFJldHVybiBhIHZlcnNpb24gb2YgdGhlIGFycmF5IHRoYXQgZG9lcyBub3QgY29udGFpbiB0aGUgc3BlY2lmaWVkIHZhbHVlKHMpLlxuICB2YXIgd2l0aG91dCA9IHJlc3RBcmd1bWVudHMoZnVuY3Rpb24oYXJyYXksIG90aGVyQXJyYXlzKSB7XG4gICAgcmV0dXJuIGRpZmZlcmVuY2UoYXJyYXksIG90aGVyQXJyYXlzKTtcbiAgfSk7XG5cbiAgLy8gUHJvZHVjZSBhIGR1cGxpY2F0ZS1mcmVlIHZlcnNpb24gb2YgdGhlIGFycmF5LiBJZiB0aGUgYXJyYXkgaGFzIGFscmVhZHlcbiAgLy8gYmVlbiBzb3J0ZWQsIHlvdSBoYXZlIHRoZSBvcHRpb24gb2YgdXNpbmcgYSBmYXN0ZXIgYWxnb3JpdGhtLlxuICAvLyBUaGUgZmFzdGVyIGFsZ29yaXRobSB3aWxsIG5vdCB3b3JrIHdpdGggYW4gaXRlcmF0ZWUgaWYgdGhlIGl0ZXJhdGVlXG4gIC8vIGlzIG5vdCBhIG9uZS10by1vbmUgZnVuY3Rpb24sIHNvIHByb3ZpZGluZyBhbiBpdGVyYXRlZSB3aWxsIGRpc2FibGVcbiAgLy8gdGhlIGZhc3RlciBhbGdvcml0aG0uXG4gIGZ1bmN0aW9uIHVuaXEoYXJyYXksIGlzU29ydGVkLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGlmICghaXNCb29sZWFuKGlzU29ydGVkKSkge1xuICAgICAgY29udGV4dCA9IGl0ZXJhdGVlO1xuICAgICAgaXRlcmF0ZWUgPSBpc1NvcnRlZDtcbiAgICAgIGlzU29ydGVkID0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChpdGVyYXRlZSAhPSBudWxsKSBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgdmFyIHNlZW4gPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBhcnJheVtpXSxcbiAgICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlID8gaXRlcmF0ZWUodmFsdWUsIGksIGFycmF5KSA6IHZhbHVlO1xuICAgICAgaWYgKGlzU29ydGVkICYmICFpdGVyYXRlZSkge1xuICAgICAgICBpZiAoIWkgfHwgc2VlbiAhPT0gY29tcHV0ZWQpIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgc2VlbiA9IGNvbXB1dGVkO1xuICAgICAgfSBlbHNlIGlmIChpdGVyYXRlZSkge1xuICAgICAgICBpZiAoIWNvbnRhaW5zKHNlZW4sIGNvbXB1dGVkKSkge1xuICAgICAgICAgIHNlZW4ucHVzaChjb21wdXRlZCk7XG4gICAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFjb250YWlucyhyZXN1bHQsIHZhbHVlKSkge1xuICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgdGhlIHVuaW9uOiBlYWNoIGRpc3RpbmN0IGVsZW1lbnQgZnJvbSBhbGwgb2ZcbiAgLy8gdGhlIHBhc3NlZC1pbiBhcnJheXMuXG4gIHZhciB1bmlvbiA9IHJlc3RBcmd1bWVudHMoZnVuY3Rpb24oYXJyYXlzKSB7XG4gICAgcmV0dXJuIHVuaXEoZmxhdHRlbiQxKGFycmF5cywgdHJ1ZSwgdHJ1ZSkpO1xuICB9KTtcblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgZXZlcnkgaXRlbSBzaGFyZWQgYmV0d2VlbiBhbGwgdGhlXG4gIC8vIHBhc3NlZC1pbiBhcnJheXMuXG4gIGZ1bmN0aW9uIGludGVyc2VjdGlvbihhcnJheSkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgYXJnc0xlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGdldExlbmd0aChhcnJheSk7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGl0ZW0gPSBhcnJheVtpXTtcbiAgICAgIGlmIChjb250YWlucyhyZXN1bHQsIGl0ZW0pKSBjb250aW51ZTtcbiAgICAgIHZhciBqO1xuICAgICAgZm9yIChqID0gMTsgaiA8IGFyZ3NMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAoIWNvbnRhaW5zKGFyZ3VtZW50c1tqXSwgaXRlbSkpIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKGogPT09IGFyZ3NMZW5ndGgpIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy8gQ29tcGxlbWVudCBvZiB6aXAuIFVuemlwIGFjY2VwdHMgYW4gYXJyYXkgb2YgYXJyYXlzIGFuZCBncm91cHNcbiAgLy8gZWFjaCBhcnJheSdzIGVsZW1lbnRzIG9uIHNoYXJlZCBpbmRpY2VzLlxuICBmdW5jdGlvbiB1bnppcChhcnJheSkge1xuICAgIHZhciBsZW5ndGggPSBhcnJheSAmJiBtYXgoYXJyYXksIGdldExlbmd0aCkubGVuZ3RoIHx8IDA7XG4gICAgdmFyIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICByZXN1bHRbaW5kZXhdID0gcGx1Y2soYXJyYXksIGluZGV4KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vIFppcCB0b2dldGhlciBtdWx0aXBsZSBsaXN0cyBpbnRvIGEgc2luZ2xlIGFycmF5IC0tIGVsZW1lbnRzIHRoYXQgc2hhcmVcbiAgLy8gYW4gaW5kZXggZ28gdG9nZXRoZXIuXG4gIHZhciB6aXAgPSByZXN0QXJndW1lbnRzKHVuemlwKTtcblxuICAvLyBDb252ZXJ0cyBsaXN0cyBpbnRvIG9iamVjdHMuIFBhc3MgZWl0aGVyIGEgc2luZ2xlIGFycmF5IG9mIGBba2V5LCB2YWx1ZV1gXG4gIC8vIHBhaXJzLCBvciB0d28gcGFyYWxsZWwgYXJyYXlzIG9mIHRoZSBzYW1lIGxlbmd0aCAtLSBvbmUgb2Yga2V5cywgYW5kIG9uZSBvZlxuICAvLyB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZXMuIFBhc3NpbmcgYnkgcGFpcnMgaXMgdGhlIHJldmVyc2Ugb2YgYF8ucGFpcnNgLlxuICBmdW5jdGlvbiBvYmplY3QobGlzdCwgdmFsdWVzKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBnZXRMZW5ndGgobGlzdCk7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHZhbHVlcykge1xuICAgICAgICByZXN1bHRbbGlzdFtpXV0gPSB2YWx1ZXNbaV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRbbGlzdFtpXVswXV0gPSBsaXN0W2ldWzFdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy8gR2VuZXJhdGUgYW4gaW50ZWdlciBBcnJheSBjb250YWluaW5nIGFuIGFyaXRobWV0aWMgcHJvZ3Jlc3Npb24uIEEgcG9ydCBvZlxuICAvLyB0aGUgbmF0aXZlIFB5dGhvbiBgcmFuZ2UoKWAgZnVuY3Rpb24uIFNlZVxuICAvLyBbdGhlIFB5dGhvbiBkb2N1bWVudGF0aW9uXShodHRwczovL2RvY3MucHl0aG9uLm9yZy9saWJyYXJ5L2Z1bmN0aW9ucy5odG1sI3JhbmdlKS5cbiAgZnVuY3Rpb24gcmFuZ2Uoc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgICBpZiAoc3RvcCA9PSBudWxsKSB7XG4gICAgICBzdG9wID0gc3RhcnQgfHwgMDtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gICAgaWYgKCFzdGVwKSB7XG4gICAgICBzdGVwID0gc3RvcCA8IHN0YXJ0ID8gLTEgOiAxO1xuICAgIH1cblxuICAgIHZhciBsZW5ndGggPSBNYXRoLm1heChNYXRoLmNlaWwoKHN0b3AgLSBzdGFydCkgLyBzdGVwKSwgMCk7XG4gICAgdmFyIHJhbmdlID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGxlbmd0aDsgaWR4KyssIHN0YXJ0ICs9IHN0ZXApIHtcbiAgICAgIHJhbmdlW2lkeF0gPSBzdGFydDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmFuZ2U7XG4gIH1cblxuICAvLyBDaHVuayBhIHNpbmdsZSBhcnJheSBpbnRvIG11bHRpcGxlIGFycmF5cywgZWFjaCBjb250YWluaW5nIGBjb3VudGAgb3IgZmV3ZXJcbiAgLy8gaXRlbXMuXG4gIGZ1bmN0aW9uIGNodW5rKGFycmF5LCBjb3VudCkge1xuICAgIGlmIChjb3VudCA9PSBudWxsIHx8IGNvdW50IDwgMSkgcmV0dXJuIFtdO1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgaSA9IDAsIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgICB3aGlsZSAoaSA8IGxlbmd0aCkge1xuICAgICAgcmVzdWx0LnB1c2goc2xpY2UuY2FsbChhcnJheSwgaSwgaSArPSBjb3VudCkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNvbnRpbnVlIGNoYWluaW5nIGludGVybWVkaWF0ZSByZXN1bHRzLlxuICBmdW5jdGlvbiBjaGFpblJlc3VsdChpbnN0YW5jZSwgb2JqKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLl9jaGFpbiA/IF8kMShvYmopLmNoYWluKCkgOiBvYmo7XG4gIH1cblxuICAvLyBBZGQgeW91ciBvd24gY3VzdG9tIGZ1bmN0aW9ucyB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIGZ1bmN0aW9uIG1peGluKG9iaikge1xuICAgIGVhY2goZnVuY3Rpb25zKG9iaiksIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciBmdW5jID0gXyQxW25hbWVdID0gb2JqW25hbWVdO1xuICAgICAgXyQxLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncyA9IFt0aGlzLl93cmFwcGVkXTtcbiAgICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gY2hhaW5SZXN1bHQodGhpcywgZnVuYy5hcHBseShfJDEsIGFyZ3MpKTtcbiAgICAgIH07XG4gICAgfSk7XG4gICAgcmV0dXJuIF8kMTtcbiAgfVxuXG4gIC8vIEFkZCBhbGwgbXV0YXRvciBgQXJyYXlgIGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgZWFjaChbJ3BvcCcsICdwdXNoJywgJ3JldmVyc2UnLCAnc2hpZnQnLCAnc29ydCcsICdzcGxpY2UnLCAndW5zaGlmdCddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG4gICAgXyQxLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9iaiA9IHRoaXMuX3dyYXBwZWQ7XG4gICAgICBpZiAob2JqICE9IG51bGwpIHtcbiAgICAgICAgbWV0aG9kLmFwcGx5KG9iaiwgYXJndW1lbnRzKTtcbiAgICAgICAgaWYgKChuYW1lID09PSAnc2hpZnQnIHx8IG5hbWUgPT09ICdzcGxpY2UnKSAmJiBvYmoubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgZGVsZXRlIG9ialswXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGNoYWluUmVzdWx0KHRoaXMsIG9iaik7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gQWRkIGFsbCBhY2Nlc3NvciBgQXJyYXlgIGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgZWFjaChbJ2NvbmNhdCcsICdqb2luJywgJ3NsaWNlJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfJDEucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb2JqID0gdGhpcy5fd3JhcHBlZDtcbiAgICAgIGlmIChvYmogIT0gbnVsbCkgb2JqID0gbWV0aG9kLmFwcGx5KG9iaiwgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiBjaGFpblJlc3VsdCh0aGlzLCBvYmopO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIE5hbWVkIEV4cG9ydHNcblxuICB2YXIgYWxsRXhwb3J0cyA9IHtcbiAgICBfX3Byb3RvX186IG51bGwsXG4gICAgVkVSU0lPTjogVkVSU0lPTixcbiAgICByZXN0QXJndW1lbnRzOiByZXN0QXJndW1lbnRzLFxuICAgIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgICBpc051bGw6IGlzTnVsbCxcbiAgICBpc1VuZGVmaW5lZDogaXNVbmRlZmluZWQsXG4gICAgaXNCb29sZWFuOiBpc0Jvb2xlYW4sXG4gICAgaXNFbGVtZW50OiBpc0VsZW1lbnQsXG4gICAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICAgIGlzTnVtYmVyOiBpc051bWJlcixcbiAgICBpc0RhdGU6IGlzRGF0ZSxcbiAgICBpc1JlZ0V4cDogaXNSZWdFeHAsXG4gICAgaXNFcnJvcjogaXNFcnJvcixcbiAgICBpc1N5bWJvbDogaXNTeW1ib2wsXG4gICAgaXNBcnJheUJ1ZmZlcjogaXNBcnJheUJ1ZmZlcixcbiAgICBpc0RhdGFWaWV3OiBpc0RhdGFWaWV3JDEsXG4gICAgaXNBcnJheTogaXNBcnJheSxcbiAgICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uJDEsXG4gICAgaXNBcmd1bWVudHM6IGlzQXJndW1lbnRzJDEsXG4gICAgaXNGaW5pdGU6IGlzRmluaXRlJDEsXG4gICAgaXNOYU46IGlzTmFOJDEsXG4gICAgaXNUeXBlZEFycmF5OiBpc1R5cGVkQXJyYXkkMSxcbiAgICBpc0VtcHR5OiBpc0VtcHR5LFxuICAgIGlzTWF0Y2g6IGlzTWF0Y2gsXG4gICAgaXNFcXVhbDogaXNFcXVhbCxcbiAgICBpc01hcDogaXNNYXAsXG4gICAgaXNXZWFrTWFwOiBpc1dlYWtNYXAsXG4gICAgaXNTZXQ6IGlzU2V0LFxuICAgIGlzV2Vha1NldDogaXNXZWFrU2V0LFxuICAgIGtleXM6IGtleXMsXG4gICAgYWxsS2V5czogYWxsS2V5cyxcbiAgICB2YWx1ZXM6IHZhbHVlcyxcbiAgICBwYWlyczogcGFpcnMsXG4gICAgaW52ZXJ0OiBpbnZlcnQsXG4gICAgZnVuY3Rpb25zOiBmdW5jdGlvbnMsXG4gICAgbWV0aG9kczogZnVuY3Rpb25zLFxuICAgIGV4dGVuZDogZXh0ZW5kLFxuICAgIGV4dGVuZE93bjogZXh0ZW5kT3duLFxuICAgIGFzc2lnbjogZXh0ZW5kT3duLFxuICAgIGRlZmF1bHRzOiBkZWZhdWx0cyxcbiAgICBjcmVhdGU6IGNyZWF0ZSxcbiAgICBjbG9uZTogY2xvbmUsXG4gICAgdGFwOiB0YXAsXG4gICAgZ2V0OiBnZXQsXG4gICAgaGFzOiBoYXMsXG4gICAgbWFwT2JqZWN0OiBtYXBPYmplY3QsXG4gICAgaWRlbnRpdHk6IGlkZW50aXR5LFxuICAgIGNvbnN0YW50OiBjb25zdGFudCxcbiAgICBub29wOiBub29wLFxuICAgIHRvUGF0aDogdG9QYXRoJDEsXG4gICAgcHJvcGVydHk6IHByb3BlcnR5LFxuICAgIHByb3BlcnR5T2Y6IHByb3BlcnR5T2YsXG4gICAgbWF0Y2hlcjogbWF0Y2hlcixcbiAgICBtYXRjaGVzOiBtYXRjaGVyLFxuICAgIHRpbWVzOiB0aW1lcyxcbiAgICByYW5kb206IHJhbmRvbSxcbiAgICBub3c6IG5vdyxcbiAgICBlc2NhcGU6IF9lc2NhcGUsXG4gICAgdW5lc2NhcGU6IF91bmVzY2FwZSxcbiAgICB0ZW1wbGF0ZVNldHRpbmdzOiB0ZW1wbGF0ZVNldHRpbmdzLFxuICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICB1bmlxdWVJZDogdW5pcXVlSWQsXG4gICAgY2hhaW46IGNoYWluLFxuICAgIGl0ZXJhdGVlOiBpdGVyYXRlZSxcbiAgICBwYXJ0aWFsOiBwYXJ0aWFsLFxuICAgIGJpbmQ6IGJpbmQsXG4gICAgYmluZEFsbDogYmluZEFsbCxcbiAgICBtZW1vaXplOiBtZW1vaXplLFxuICAgIGRlbGF5OiBkZWxheSxcbiAgICBkZWZlcjogZGVmZXIsXG4gICAgdGhyb3R0bGU6IHRocm90dGxlLFxuICAgIGRlYm91bmNlOiBkZWJvdW5jZSxcbiAgICB3cmFwOiB3cmFwLFxuICAgIG5lZ2F0ZTogbmVnYXRlLFxuICAgIGNvbXBvc2U6IGNvbXBvc2UsXG4gICAgYWZ0ZXI6IGFmdGVyLFxuICAgIGJlZm9yZTogYmVmb3JlLFxuICAgIG9uY2U6IG9uY2UsXG4gICAgZmluZEtleTogZmluZEtleSxcbiAgICBmaW5kSW5kZXg6IGZpbmRJbmRleCxcbiAgICBmaW5kTGFzdEluZGV4OiBmaW5kTGFzdEluZGV4LFxuICAgIHNvcnRlZEluZGV4OiBzb3J0ZWRJbmRleCxcbiAgICBpbmRleE9mOiBpbmRleE9mLFxuICAgIGxhc3RJbmRleE9mOiBsYXN0SW5kZXhPZixcbiAgICBmaW5kOiBmaW5kLFxuICAgIGRldGVjdDogZmluZCxcbiAgICBmaW5kV2hlcmU6IGZpbmRXaGVyZSxcbiAgICBlYWNoOiBlYWNoLFxuICAgIGZvckVhY2g6IGVhY2gsXG4gICAgbWFwOiBtYXAsXG4gICAgY29sbGVjdDogbWFwLFxuICAgIHJlZHVjZTogcmVkdWNlLFxuICAgIGZvbGRsOiByZWR1Y2UsXG4gICAgaW5qZWN0OiByZWR1Y2UsXG4gICAgcmVkdWNlUmlnaHQ6IHJlZHVjZVJpZ2h0LFxuICAgIGZvbGRyOiByZWR1Y2VSaWdodCxcbiAgICBmaWx0ZXI6IGZpbHRlcixcbiAgICBzZWxlY3Q6IGZpbHRlcixcbiAgICByZWplY3Q6IHJlamVjdCxcbiAgICBldmVyeTogZXZlcnksXG4gICAgYWxsOiBldmVyeSxcbiAgICBzb21lOiBzb21lLFxuICAgIGFueTogc29tZSxcbiAgICBjb250YWluczogY29udGFpbnMsXG4gICAgaW5jbHVkZXM6IGNvbnRhaW5zLFxuICAgIGluY2x1ZGU6IGNvbnRhaW5zLFxuICAgIGludm9rZTogaW52b2tlLFxuICAgIHBsdWNrOiBwbHVjayxcbiAgICB3aGVyZTogd2hlcmUsXG4gICAgbWF4OiBtYXgsXG4gICAgbWluOiBtaW4sXG4gICAgc2h1ZmZsZTogc2h1ZmZsZSxcbiAgICBzYW1wbGU6IHNhbXBsZSxcbiAgICBzb3J0Qnk6IHNvcnRCeSxcbiAgICBncm91cEJ5OiBncm91cEJ5LFxuICAgIGluZGV4Qnk6IGluZGV4QnksXG4gICAgY291bnRCeTogY291bnRCeSxcbiAgICBwYXJ0aXRpb246IHBhcnRpdGlvbixcbiAgICB0b0FycmF5OiB0b0FycmF5LFxuICAgIHNpemU6IHNpemUsXG4gICAgcGljazogcGljayxcbiAgICBvbWl0OiBvbWl0LFxuICAgIGZpcnN0OiBmaXJzdCxcbiAgICBoZWFkOiBmaXJzdCxcbiAgICB0YWtlOiBmaXJzdCxcbiAgICBpbml0aWFsOiBpbml0aWFsLFxuICAgIGxhc3Q6IGxhc3QsXG4gICAgcmVzdDogcmVzdCxcbiAgICB0YWlsOiByZXN0LFxuICAgIGRyb3A6IHJlc3QsXG4gICAgY29tcGFjdDogY29tcGFjdCxcbiAgICBmbGF0dGVuOiBmbGF0dGVuLFxuICAgIHdpdGhvdXQ6IHdpdGhvdXQsXG4gICAgdW5pcTogdW5pcSxcbiAgICB1bmlxdWU6IHVuaXEsXG4gICAgdW5pb246IHVuaW9uLFxuICAgIGludGVyc2VjdGlvbjogaW50ZXJzZWN0aW9uLFxuICAgIGRpZmZlcmVuY2U6IGRpZmZlcmVuY2UsXG4gICAgdW56aXA6IHVuemlwLFxuICAgIHRyYW5zcG9zZTogdW56aXAsXG4gICAgemlwOiB6aXAsXG4gICAgb2JqZWN0OiBvYmplY3QsXG4gICAgcmFuZ2U6IHJhbmdlLFxuICAgIGNodW5rOiBjaHVuayxcbiAgICBtaXhpbjogbWl4aW4sXG4gICAgJ2RlZmF1bHQnOiBfJDFcbiAgfTtcblxuICAvLyBEZWZhdWx0IEV4cG9ydFxuXG4gIC8vIEFkZCBhbGwgb2YgdGhlIFVuZGVyc2NvcmUgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyIG9iamVjdC5cbiAgdmFyIF8gPSBtaXhpbihhbGxFeHBvcnRzKTtcbiAgLy8gTGVnYWN5IE5vZGUuanMgQVBJLlxuICBfLl8gPSBfO1xuXG4gIHJldHVybiBfO1xuXG59KSkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dW5kZXJzY29yZS11bWQuanMubWFwXG4iLCJ2YXIgbWMgPSBtb2R1bGUuZXhwb3J0c1xubWMuRGF0YXRhYmxlID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaWRzID0gMDtcblxuXG4gICAgdmFyIGR0ID0ge1xuXG4gICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uIChjb2xzLCBjb25maWcpIHtcbiAgICAgICAgICAgIHRoaXMuY29scyA9IGNvbHM7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U2VsZWN0aW9uID0gW107XG5cblxuICAgICAgICAgICAgaWYgKGNvbmZpZy51cmwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEgPSBtLnJlcXVlc3Qoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IGNvbmZpZy51cmwsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcjogY29uZmlnLmhlYWRlciwgXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZzogZnVuY3Rpb24gKHhocikge1xuICAgICAgICAgICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0F1dGhvcml6YXRpb24nLCBjb25maWcuYXV0aG9yaXphdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb25maWcuZGF0YSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9ICh0eXBlb2YgY29uZmlnLmRhdGEgPT0gJ2Z1bmN0aW9uJyA/IGNvbmZpZy5kYXRhIDogbS5wcm9wKGNvbmZpZy5kYXRhKSk7XG4gICAgICAgICAgICB9XG5cblxuXG4gICAgICAgICAgICB0aGlzLnNvcnQgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IHRhcmdldC5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1jb2xrZXknKSxcbiAgICAgICAgICAgICAgICAgICAgY29sID0gdGhpcy5hY3RpdmVDb2xzW2tleV07XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGFzdFNvcnRlZCAmJiB0aGlzLmxhc3RTb3J0ZWQgIT0ga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlQ29sc1t0aGlzLmxhc3RTb3J0ZWRdLl9zb3J0ZWQgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciByZXZlcnNlID0gKGNvbC5fc29ydGVkID09ICdhc2MnID8gLTEgOiAxKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEodGhpcy5kYXRhKCkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgICAgICBhID0gYVtrZXldO1xuICAgICAgICAgICAgICAgICAgICBiID0gYltrZXldO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGEgPT0gYiA/IDAgOiAoYSA8IGIgPyAtMSA6IDEpICogcmV2ZXJzZSk7XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIGNvbC5fc29ydGVkID0gKHJldmVyc2UgPiAwID8gJ2FzYycgOiAnZGVzYycpO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdFNvcnRlZCA9IGtleTtcbiAgICAgICAgICAgICAgICBtLnJlbmRlcih0aGlzLl90YWJsZUVsLCBkdC5jb250ZW50c1ZpZXcodGhpcykpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5vbkNlbGxDbGljayA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAodGFyZ2V0Lm5vZGVOYW1lICE9ICdURCcgJiYgdGFyZ2V0Lm5vZGVOYW1lICE9ICdUQUJMRScpIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQubm9kZU5hbWUgPT0gJ1RBQkxFJykgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgdmFyIGNvbEluZGV4ID0gdGFyZ2V0LmNlbGxJbmRleCxcbiAgICAgICAgICAgICAgICAgICAgY29sID0gdGhpcy5kYXRhUm93W2NvbEluZGV4XSxcbiAgICAgICAgICAgICAgICAgICAgcmVjb3JkSWQgPSB0YXJnZXQucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcmVjb3JkLWlkJyksXG4gICAgICAgICAgICAgICAgICAgIGlkRmllbGQgPSBjb25maWcucmVjb3JkSWQgfHwgJ2lkJyxcbiAgICAgICAgICAgICAgICAgICAgcm93O1xuXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhKCkuc29tZShmdW5jdGlvbiAocikge1xuICAgICAgICAgICAgICAgICAgICBpZiAocltpZEZpZWxkXSA9PSByZWNvcmRJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93ID0gcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBtLnN0YXJ0Q29tcHV0YXRpb24oKTtcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gdGhpcy5jb25maWcub25DZWxsQ2xpY2suY2FsbCh0aGlzLCByb3dbY29sLmZpZWxkIHx8IGNvbC5rZXldLCByb3csIGNvbCk7XG4gICAgICAgICAgICAgICAgbS5lbmRDb21wdXRhdGlvbigpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLm9uUm93U2VsZWN0ID0gZnVuY3Rpb24gKGUsIHRhcmdldCkge1xuXG4gICAgICAgICAgICAgICAgdmFyIHJzID0gdGhpcy5jb25maWcucm93U2VsZWN0LFxuICAgICAgICAgICAgICAgICAgICBtdWx0aSA9IHJzLm11bHRpcGxlLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayA9IHJzLmNhbGxiYWNrLFxuICAgICAgICAgICAgICAgICAgICBzZWwgPSB0aGlzLmN1cnJlbnRTZWxlY3Rpb24gfHwgW10sXG4gICAgICAgICAgICAgICAgICAgIGxhc3RTZWwgPSB0aGlzLmxhc3RTZWxlY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgIGluUmFuZ2UgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgaWRGaWVsZCA9IGNvbmZpZy5yZWNvcmRJZCB8fCAnaWQnO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPSAnZnVuY3Rpb24nKSByZXR1cm47XG4gICAgICAgICAgICAgICAgd2hpbGUgKHRhcmdldC5ub2RlTmFtZSAhPSAnVFInICYmIHRhcmdldC5ub2RlTmFtZSAhPSAnVEFCTEUnKSB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0Lm5vZGVOYW1lID09ICdUQUJMRScpIHJldHVybjtcbiAgICAgICAgICAgICAgICB2YXIgcmVjb3JkSWQgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXJlY29yZC1pZCcpO1xuICAgICAgICAgICAgICAgIGlmIChwYXJzZUludChyZWNvcmRJZCwgMTApID09IHJlY29yZElkKSByZWNvcmRJZCA9IHBhcnNlSW50KHJlY29yZElkLCAxMCk7XG5cblxuICAgICAgICAgICAgICAgIG0uc3RhcnRDb21wdXRhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChtdWx0aSAmJiBlLmN0cmxLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGkgPSBzZWwuaW5kZXhPZihyZWNvcmRJZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWwucHVzaChyZWNvcmRJZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWwuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtdWx0aSAmJiBlLnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyU2VsZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YSgpLmZvckVhY2goZnVuY3Rpb24gKHJvdykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gcm93W2lkRmllbGRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluUmFuZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsLmluZGV4T2YoaWQpID09IC0xKSBzZWwucHVzaChpZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlkID09IGxhc3RTZWwgfHwgaWQgPT0gcmVjb3JkSWQpIGluUmFuZ2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlkID09IGxhc3RTZWwgfHwgaWQgPT0gcmVjb3JkSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbC5pbmRleE9mKGlkKSA9PSAtMSkgc2VsLnB1c2goaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpblJhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbCA9IChzZWwubGVuZ3RoID09IDEgJiYgc2VsWzBdID09IHJlY29yZElkID8gW10gOiBbcmVjb3JkSWRdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0U2VsZWN0aW9uID0gcmVjb3JkSWQ7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U2VsZWN0aW9uID0gc2VsO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHNlbCk7XG4gICAgICAgICAgICAgICAgbS5lbmRDb21wdXRhdGlvbigpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5vbmNsaWNrID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZS50YXJnZXQ7XG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldC5ub2RlTmFtZSA9PSAnSScgJiYgL1xcYmZhXFwtc29ydC8udGVzdCh0YXJnZXQuY2xhc3NOYW1lKSkgcmV0dXJuIHRoaXMuc29ydCh0YXJnZXQpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZy5yb3dTZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vblJvd1NlbGVjdChlLCB0YXJnZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuY29uZmlnLm9uQ2VsbENsaWNrID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMub25DZWxsQ2xpY2sodGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0uYmluZCh0aGlzKTtcblxuICAgICAgICAgICAgdGhpcy5zZXRXaWR0aCA9IGZ1bmN0aW9uIChhdHRycywgd2lkdGgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXdpZHRoKSByZXR1cm47XG4gICAgICAgICAgICAgICAgaWYgKC9eXFxkKyQvLnRlc3Qod2lkdGgpKSB3aWR0aCArPSAncHgnO1xuICAgICAgICAgICAgICAgIGlmICghYXR0cnMuc3R5bGUpIGF0dHJzLnN0eWxlID0gJyc7XG4gICAgICAgICAgICAgICAgaWYgKHdpZHRoKSBhdHRycy5zdHlsZSArPSAnd2lkdGg6JyArIHdpZHRoICsgJzsnO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgdmlldzogZnVuY3Rpb24gKGN0cmwsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBjb2xzID0gY3RybC5jb2xzO1xuICAgICAgICAgICAgY3RybC52aWV3T3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICAgICAgICAgIGlmICghY3RybC5kYXRhKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbSgnZGl2JywgJ1NvcnJ5LCBubyBkYXRhIHRvIGRpc3BsYXknKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICAgICAgb3B0aW9ucy5jbGFzc05hbWVzID0gb3B0aW9ucy5jbGFzc05hbWVzIHx8IHt9O1xuXG4gICAgICAgICAgICB2YXIgYXR0cnMgPSB7XG4gICAgICAgICAgICAgICAgY2xhc3M6IG9wdGlvbnMuY2xhc3NOYW1lcy50YWJsZSB8fCAndGFibGUgdGFibGUtc3RyaXBlZCB0YWJsZS1ib3JkZXJlZCB0YWJsZS1ob3ZlcicsXG4gICAgICAgICAgICAgICAgY29uZmlnOiBmdW5jdGlvbiAoZWwsIGlzT2xkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc09sZCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGN0cmwub25jbGljayk7XG4gICAgICAgICAgICAgICAgICAgIGN0cmwuX3RhYmxlRWwgPSBlbDtcbiAgICAgICAgICAgICAgICAgICAgbS5tb2R1bGUoZWwsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3RybDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3OiBkdC5jb250ZW50c1ZpZXdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjdHJsLnNldFdpZHRoKGF0dHJzLCBvcHRpb25zLndpZHRoKTtcblxuICAgICAgICAgICAgcmV0dXJuIG0oXG4gICAgICAgICAgICAgICAgJ3RhYmxlJyxcbiAgICAgICAgICAgICAgICBhdHRyc1xuICAgICAgICAgICAgKTtcblxuXG4gICAgICAgIH0sXG4gICAgICAgIGNvbnRlbnRzVmlldzogZnVuY3Rpb24gKGN0cmwpIHtcbiAgICAgICAgICAgIHZhciBjb2xzID0gY3RybC5jb2xzLFxuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBjdHJsLnZpZXdPcHRpb25zO1xuXG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIGR0LmhlYWRWaWV3KGN0cmwsIGNvbHMsIG9wdGlvbnMpLFxuICAgICAgICAgICAgICAgIGR0LmJvZHlWaWV3KGN0cmwsIGNvbHMsIG9wdGlvbnMsIGN0cmwuZGF0YSgpKSxcbiAgICAgICAgICAgICAgICBkdC5jYXB0aW9uVmlldyhjdHJsLCBvcHRpb25zKVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfSxcbiAgICAgICAgaGVhZFZpZXc6IGZ1bmN0aW9uIChjdHJsLCBjb2xzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgbWF0cml4ID0gW10sXG4gICAgICAgICAgICAgICAgcm93TnVtID0gMCxcbiAgICAgICAgICAgICAgICBkYXRhUm93ID0gW107XG4gICAgICAgICAgICB2YXIgY2FsY0RlcHRoID0gZnVuY3Rpb24gKG1heERlcHRoLCBjb2wpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVwdGggPSAwO1xuICAgICAgICAgICAgICAgIGlmICghbWF0cml4W3Jvd051bV0pIHtcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4W3Jvd051bV0gPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbWF0cml4W3Jvd051bV0ucHVzaChjb2wpO1xuICAgICAgICAgICAgICAgIGlmIChjb2wuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgY29sLl9jb2xzcGFuID0gY29sLmNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgcm93TnVtKys7XG4gICAgICAgICAgICAgICAgICAgIGRlcHRoID0gY29sLmNoaWxkcmVuLnJlZHVjZShjYWxjRGVwdGgsIDApICsgMTtcbiAgICAgICAgICAgICAgICAgICAgcm93TnVtLS07XG4gICAgICAgICAgICAgICAgICAgIGRlcHRoID0gTWF0aC5tYXgobWF4RGVwdGgsIGRlcHRoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkYXRhUm93LnB1c2goY29sKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29sLl9kZXB0aCA9IGRlcHRoO1xuICAgICAgICAgICAgICAgIHJldHVybiBkZXB0aDtcbiAgICAgICAgICAgIH07XG5cblxuXG4gICAgICAgICAgICB2YXIgbWF4RGVwdGggPSBjb2xzLnJlZHVjZShjYWxjRGVwdGgsIDApO1xuICAgICAgICAgICAgY3RybC5kYXRhUm93ID0gZGF0YVJvdztcbiAgICAgICAgICAgIHZhciBhY3RpdmVDb2xzID0ge307XG4gICAgICAgICAgICBkYXRhUm93LmZvckVhY2goZnVuY3Rpb24gKGNvbCkge1xuICAgICAgICAgICAgICAgIGFjdGl2ZUNvbHNbY29sLmtleV0gPSBjb2w7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGN0cmwuYWN0aXZlQ29scyA9IGFjdGl2ZUNvbHM7XG5cbiAgICAgICAgICAgIHZhciBidWlsZEhlYWRlclJvdyA9IGZ1bmN0aW9uIChyb3csIHJvd051bSkge1xuICAgICAgICAgICAgICAgIHZhciBidWlsZEhlYWRlckNlbGwgPSBmdW5jdGlvbiAoY29sKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29sLl9jb2xzcGFuICYmIGNvbC5fY29sc3BhbiA+IDEpIGF0dHJzLmNvbHNwYW4gPSBjb2wuX2NvbHNwYW47XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2wuY2xhc3MpIGF0dHJzLmNsYXNzID0gY29sLmNsYXNzO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbC5fZGVwdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzWydkYXRhLWNvbEtleSddID0gY29sLmtleTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0cmwuc2V0V2lkdGgoYXR0cnMsIGNvbC53aWR0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93TnVtIDwgbWF4RGVwdGgpIGF0dHJzLnJvd3NwYW4gPSBtYXhEZXB0aCAtIHJvd051bSArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29sLl9zb3J0ZWQgJiYgY29sLl9zb3J0ZWQgIT0gJ25vbmUnKSBhdHRycy5jbGFzcyA9IG9wdGlvbnMuY2xhc3NOYW1lcy5zb3J0ZWQgfHwgJ3NvcnRlZCc7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbShcbiAgICAgICAgICAgICAgICAgICAgICAgICd0aCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycywgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICghY29sLl9kZXB0aCAmJiBjb2wuc29ydGFibGUgPyBtKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaS5mYScsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNjOiAnZmEtc29ydC1hc2MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2M6ICdmYS1zb3J0LWRlc2MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vbmU6ICdmYS1zb3J0J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVtjb2wuX3NvcnRlZCB8fCAnbm9uZSddXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIDogJycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0udHJ1c3QoJyAnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2wubGFiZWwgfHwgY29sLmtleVxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbShcbiAgICAgICAgICAgICAgICAgICAgJ3RyJyxcbiAgICAgICAgICAgICAgICAgICAgcm93Lm1hcChidWlsZEhlYWRlckNlbGwpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gbSgndGhlYWQnLCBtYXRyaXgubWFwKGJ1aWxkSGVhZGVyUm93KSk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICBib2R5VmlldzogZnVuY3Rpb24gKGN0cmwsIGNvbHMsIG9wdGlvbnMsIGRhdGEpIHtcbiAgICAgICAgICAgIHZhciBpZEZpZWxkID0gY3RybC5jb25maWcucmVjb3JkSWQgfHwgJ2lkJztcbiAgICAgICAgICAgIHZhciBidWlsZERhdGFSb3cgPSBmdW5jdGlvbiAocm93LCByb3dJbmRleCkge1xuICAgICAgICAgICAgICAgIHZhciBidWlsZERhdGFDZWxsID0gZnVuY3Rpb24gKGNvbCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSByb3dbY29sLmZpZWxkIHx8IGNvbC5rZXldLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMgPSB7fTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbC5mb3JtYXR0ZXIgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjb2wuZm9ybWF0dGVyLmNhbGwoY3RybCwgdmFsdWUsIHJvdywgY29sLCBhdHRycyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhdHRycy5jbGFzcykgYXR0cnMuY2xhc3MgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbC5fc29ydGVkICYmIGNvbC5fc29ydGVkICE9ICdub25lJykgYXR0cnMuY2xhc3MgKz0gJyAnICsgKG9wdGlvbnMuY2xhc3NOYW1lcy5zb3J0ZWQgfHwgJ3NvcnRlZCcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29sLmNsYXNzKSBhdHRycy5jbGFzcyArPSAnICcgKyBjb2wuY2xhc3M7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhdHRycy5jbGFzcykgZGVsZXRlIGF0dHJzLmNsYXNzO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbShcbiAgICAgICAgICAgICAgICAgICAgICAgICd0ZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAocm93W2lkRmllbGRdID09PSB1bmRlZmluZWQpIHJvd1tpZEZpZWxkXSA9IGlkcysrO1xuICAgICAgICAgICAgICAgIHZhciByZWNvcmRJZCA9IHJvd1tpZEZpZWxkXTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBtKFxuICAgICAgICAgICAgICAgICAgICAndHInLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnZGF0YS1yZWNvcmQtaWQnOiByZWNvcmRJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiAocm93SW5kZXggJiAxID8gb3B0aW9ucy5jbGFzc05hbWVzLm9kZCB8fCAnb2RkJyA6IG9wdGlvbnMuY2xhc3NOYW1lcy5ldmVuIHx8ICdldmVuJykgK1xuICAgICAgICAgICAgICAgICAgICAgICAgKGN0cmwuY3VycmVudFNlbGVjdGlvbi5pbmRleE9mKHJlY29yZElkKSAhPSAtMSA/IG9wdGlvbnMuY2xhc3NOYW1lcy5zZWxlY3RlZCB8fCAnIHNlbGVjdGVkJyA6ICcnKVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjdHJsLmRhdGFSb3cubWFwKGJ1aWxkRGF0YUNlbGwpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gbSgndGJvZHknLCBkYXRhLm1hcChidWlsZERhdGFSb3cpKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2FwdGlvblZpZXc6IGZ1bmN0aW9uIChjdHJsLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5jYXB0aW9uKSByZXR1cm4gbSgnY2FwdGlvbicsIG9wdGlvbnMuY2FwdGlvbik7XG4gICAgICAgIH0sXG4gICAgfTtcbiAgICAvKiBnbG9iYWwgZG9jdW1lbnQ6ZmFsc2UsIHdpbmRvdzpmYWxzZSAqL1xuICAgIGZ1bmN0aW9uIGNsZWFyU2VsZWN0aW9uKCkge1xuICAgICAgICBpZiAoZG9jdW1lbnQuc2VsZWN0aW9uICYmIGRvY3VtZW50LnNlbGVjdGlvbi5lbXB0eSkge1xuICAgICAgICAgICAgZG9jdW1lbnQuc2VsZWN0aW9uLmVtcHR5KCk7XG4gICAgICAgIH0gZWxzZSBpZiAod2luZG93LmdldFNlbGVjdGlvbikge1xuICAgICAgICAgICAgd2luZG93LmdldFNlbGVjdGlvbigpLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGR0O1xufSkoKTtcbiIsIlxudmFyIEF1dGggPSByZXF1aXJlKCcuLi9tb2RlbHMvQXV0aC5qcycpO1xuXG52YXIgTmF2YmFyID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdHJsID0gdGhpcztcblxuICAgIHZhciBsaW5rcyA9IChBdXRoLnRva2VuKCkgP1xuICAgIFtcblxuXG4gICAgICAse2xhYmVsOidVc2VycycgLGhyZWY6ICcvdXNlcnMnfSxcbiAgICAgICx7bGFiZWw6J1Rlc3RzJyAsaHJlZjogJy90ZXN0cyd9LFxuICAgICAge2xhYmVsOidMb2dvdXQnLCBocmVmOicvbG9nb3V0J31cbiAgICBdOltcbiAgICAgIHtsYWJlbDonTG9naW4nLCBocmVmOicvbG9naW4nfVxuIFxuICAgIF0pXG4gICAgLm1hcChmdW5jdGlvbihsKXtcbiAgICAgIHJldHVybiBtKFwibGlcIiArIChtLnJvdXRlKCkgPT09IGwuaHJlZiA/ICcuYWN0aXZlJzogJycpLCBtKFwiYVtocmVmPSdcIiArIGwuaHJlZiArIFwiJ11cIiwgbC5ub3JtYWw/e306e2NvbmZpZzogbS5yb3V0ZX0sIGwubGFiZWwpKTtcbiAgICB9KTtcblxuICAgIGN0cmwubGlua3MgPSBtLnByb3AobGlua3MpO1xuXG4gICAgY3RybC5pY29uRGlyZWN0aW9uID0gbS5wcm9wKCdkb3duJyk7XG5cbiAgICBjdHJsLnRvZ2dsZSA9IGZ1bmN0aW9uKCl7XG4gICAgICBjdHJsLmljb25EaXJlY3Rpb24oIGN0cmwuaWNvbkRpcmVjdGlvbigpPT0ndXAnID8gJ2Rvd24nOid1cCcgKTtcbiAgICB9O1xuICB9LFxuXG4gIHZpZXc6IGZ1bmN0aW9uKGN0cmwpIHtcbiAgICByZXR1cm4gbShcIm5hdi5uYXZiYXIubmF2YmFyLWludmVyc2UubmF2YmFyLWZpeGVkLXRvcFwiLCBbXG4gICAgICBtKFwiLmNvbnRhaW5lclwiLCBbXG4gICAgICAgIG0oXCIubmF2YmFyLWhlYWRlclwiLFxuICAgICAgICAgIG0oJ2J1dHRvbi5uYXZiYXItdG9nZ2xlJywge29uY2xpY2s6IGN0cmwudG9nZ2xlfSwgbSgnLmdseXBoaWNvbi5nbHlwaGljb24tY2hldnJvbi0nICsgY3RybC5pY29uRGlyZWN0aW9uKCkpKSxcbiAgICAgICAgICBtKFwiYS5uYXZiYXItYnJhbmRbaHJlZj0nLyddXCIsIHtjb25maWc6IG0ucm91dGV9LCBcIkFzc2Vzc21lbnQgU3lzdGVtXCIpXG4gICAgICAgICksXG4gICAgICAgIG0oXCIubmF2YmFyLWNvbGxhcHNlLlwiICsgY3RybC5pY29uRGlyZWN0aW9uKCksIFxuICAgICAgICAgIG0oXCJ1bC5uYXYubmF2YmFyLW5hdi5uYXZiYXItcmlnaHRcIiwgY3RybC5saW5rcygpKVxuICAgICAgICApXG4gICAgICBdKVxuICAgIF0pO1xuICB9XG59OyIsIi8vIHZhciBRdWVzdGlvbiA9IHJlcXVpcmUoJy4uL21vZGVscy9RdWVzdGlvbi5qcycpO1xuXG52YXIgUXVlc3Rpb25zV2lkZ2V0ID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24gKHF1ZXN0aW9uLHF1ZXN0aW9uQ291bnRlcklkKSB7XG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBxdWVzdGlvblxuICAgICAgICBcbiAgICAgICAgLy8gdGhpcy5zYXZlID0gZnVuY3Rpb24gKHF1ZXN0aW9uKSB7XG4gICAgICAgIC8vICAgICBRdWVzdGlvbi5zYXZlKHF1ZXN0aW9uKS50aGVuKGZ1bmN0aW9uIChwYXJhbXMpIHtcblxuICAgICAgICAvLyAgICAgICAgIHF1ZXN0aW9uLmJvZHkoJycpXG4gICAgICAgIC8vICAgICAgICAgcmV0dXJuIHBhcmFtc1xuICAgICAgICAvLyAgICAgfSkudGhlbih1cGRhdGUuYmluZCh0aGlzKSlcbiAgICAgICAgLy8gfS5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXMuc2V0R3ZhbD1mdW5jdGlvbiBuYW1lKHZhbCkge1xuICAgICAgICAgICAgZ3ZhbD12YWxcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdmlldzogZnVuY3Rpb24gKGN0cmwsIHF1ZXN0aW9uLHF1ZXN0aW9uQ291bnRlcklkKSB7XG4gICAgICAgIHJldHVybiBtKCdkaXYnLCBbXG4gICAgICAgICAgICBtLmNvbXBvbmVudChRdWVzdGlvbkZvcm0sIHF1ZXN0aW9uLHF1ZXN0aW9uQ291bnRlcklkKSxcbiAgICAgICAgICAgIG0uY29tcG9uZW50KE9wdGlvbkxpc3QsIHF1ZXN0aW9uLm9wdGlvbnMscXVlc3Rpb25Db3VudGVySWQpXG4gICAgICAgICAgICAsXG4gICAgICAgICAgICBtKFwiaHJbc3R5bGU9J2JvcmRlcjogMXB4IHNvbGlkICMyYjY2ZmY7J11cIilcbiAgICAgICAgXSlcbiAgICB9IFxufVxuXG52YXIgUXVlc3Rpb25Gb3JtID0ge1xuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uIChxdWVzdGlvbikge1xuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gcXVlc3Rpb25cbiAgICB9LFxuICAgIHZpZXc6IGZ1bmN0aW9uIChjdHJsLCBxdWVzdGlvbixxdWVzdGlvbkNvdW50ZXJJZCkge1xuICAgICAgIFxuXG4gICAgICAgIHJldHVybiBtKFwiZGV2XCIsIFtcbiAgICAgXG5cbiAgICAgICAgICAgIG0oJy5mb3JtLWdyb3VwJywgW1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBtKFwiaW5wdXQuZm9ybS1jb250cm9sW25hbWU9J3F1ZXN0aW9uXCIrcXVlc3Rpb25Db3VudGVySWQrXCI6bmFtZSddW2lkPSdpbnB1dG5hbWUnXVtwbGFjZWhvbGRlcj0nbmFtZSAnXVtyZXF1aXJlZF1bdHlwZT0ndGV4dCddXCIse3ZhbHVlOiBxdWVzdGlvbi5sYWJlbH0pLFxuICAgICAgICAgICAgICBdKSwgXG5cbiAgICAgICAgICAgICAgICBtKFwidGV4dGFyZWEuZm9ybS1jb250cm9sW25hbWU9J3F1ZXN0aW9uXCIrcXVlc3Rpb25Db3VudGVySWQrXCI6ZGVzY3JpcHRpb24nXVtpZD0naW5wdXRkZXNjcmlwdGlvbiddW3BsYWNlaG9sZGVyPSdkZXNjcmlwdGlvbiAnXVtyZXF1aXJlZF1bdHlwZT0ndGV4dCddXCIse3ZhbHVlOnF1ZXN0aW9uLmRlc2NyaXB0aW9ufSksXG4gICAgICAgICAgICAgICAsXG4gICAgXG5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIC8vICAgIG0oXCJidXR0b24uYnRuLmJ0bi1kYW5nZXJcIiwgXCJEZWxldGVcIilcbiAgICAgICAgIFxuICAgICAgICBdKVxuICAgICAgIFxuICAgIH1cbn1cblxudmFyIE9wdGlvbkxpc3QgPSB7XG4gICAgdmlldzogZnVuY3Rpb24gKGN0cmwsIG9wdGlvbnMscXVlc3Rpb25Db3VudGVySWQpIHtcbiAgICAgICAgb3B0aW9uQ291bnRlcklkPTA7XG4gICAgICAgIHJldHVybiBtKCdkaXYnLG0oXCJiclwiKSxtKFwidGFibGUudGFibGUudGFibGUtY29uZGVuc2VkLnRhYmxlLWJvcmRlcmVkXCIsbShcInRyXCIsW20oXCJ0aFwiLFwiVGl0bGVcIiksbShcInRoXCIsXCJpcyBjb3JyZWN0XCIpXSksbSgndGJvZHknLCBbXG4gICAgICAgICAgICBvcHRpb25zLm1hcChmdW5jdGlvbiAob3B0aW9uKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9uQ291bnRlcklkKz0xO1xuICAgICAgICAgICAgICAgIHJldHVybiBtKFwidHJcIiwgW1xuXG4gICAgICAgICAgICAgICAgICAgIG0oXCJ0ZFwiLCBtKFwiaW5wdXQuZm9ybS1jb250cm9sW25hbWU9J3F1ZXN0aW9uXCIrcXVlc3Rpb25Db3VudGVySWQrXCI6b3B0aW9uXCIrb3B0aW9uQ291bnRlcklkK1wiOnRpdGxlJ11baWQ9J2lucHV0bmFtZSddW3BsYWNlaG9sZGVyPSduYW1lICddW3JlcXVpcmVkXVt0eXBlPSd0ZXh0J11cIix7dmFsdWU6IG9wdGlvbi50aXRsZX0pKSwgXG4gICAgICAgICAgICAgICAgICAgIG0oXCJ0ZFwiLCBtKFwiaW5wdXRbc3R5bGU9J3dpZHRoOiAxMDAlO2hlaWdodDogMzBweDsnXVtuYW1lPSdxdWVzdGlvblwiK3F1ZXN0aW9uQ291bnRlcklkK1wiOm9wdGlvblwiK29wdGlvbkNvdW50ZXJJZCtcIjppc19jb3JyZWN0J11baWQ9J2lucHV0bmFtZSddW3R5cGU9J2NoZWNrYm94J11cIix7Y2hlY2tlZDogb3B0aW9uLmlzX2NvcnJlY3QsdmFsdWU6b3B0aW9uLmlzX2NvcnJlY3R9KSksXG4gICAgICAgICAgICAgICAgICAgIG0oXCJ0ZFwiLCBtKFwiYnV0dG9uLmJ0bi5idG4tZGFuZ2VyXCIsIFwiRGVsZXRlXCIpKVxuICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICB9KVxuICAgICAgICBdKSkpXG4gICAgfVxufSAiLCJ2YXIgUXVlc3Rpb25zID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdHJsID0gdGhpcztcbiAgICBcblxuICB9LFxuXG4gIHZpZXc6IGZ1bmN0aW9uKGN0cmwsYXJncykge1xuICAgICByZXR1cm4gW20oXCJ0YWJsZVwiLCBbXG4gICAgICAgICAgICBhcmdzLnF1ZXN0aW9ucy5tYXAoZnVuY3Rpb24ocXVlc3Rpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbShcInRyXCIsIFtcbiAgICAgICAgICAgICAgICAgICAgbShcInRkXCIsIHF1ZXN0aW9uLmJvZHkpLFxuICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICB9KVxuICAgICAgICBdKSwgbShcImZvcm1cIiwgW1xuICAgICAgICAgICAgbShcImxhYmVsXCIsIFwiQm9keVwiKSxcbiAgICAgICAgICAgIG0oXCJ0ZXh0QXJlYVwiLCB7b25pbnB1dDogbS53aXRoQXR0cihcInZhbHVlXCIsIHF1ZXN0aW9uLmJvZHkpLCB2YWx1ZTogcXVlc3Rpb24uYm9keSgpfSksXG5cbiAgICAgICAgICAgIG0oXCJidXR0b25bdHlwZT1idXR0b25dXCIsIHtvbmNsaWNrOiBhcmdzLm9uc2F2ZS5iaW5kKHRoaXMsIHF1ZXN0aW9uKX0sIFwiU2F2ZVwiKVxuICAgICAgICBdKV1cbiAgfVxufTsiLCIvLyBtYWluLmpzXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG52YXIgbmFtZXMgPSBbJ2JsdWUgdC1zaGlydCcsICd5ZWxsb3cgdC1zaGlydCcsICdncmVlbiB0LXNoaXJ0J107XG4gXG5fLmVhY2gobmFtZXMsIGZ1bmN0aW9uKG4pIHtcblx0Y29uc29sZS5sb2cobik7XG59KTtcblxuLy9pbml0aWFsaXplIHRoZSBhcHBsaWNhdGlvblxuXG5cblxuLy8gbS5tb2R1bGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYWdlLWFwcFwiKSwge2NvbnRyb2xsZXI6IHRvZG8uY29udHJvbGxlciwgdmlldzogdG9kby52aWV3fSk7Ly9cblxuXG5cblxudmFyIHJlcSA9IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgcmV0dXJuIG0ucmVxdWVzdChhcmdzKVxufVxubS5yb3V0ZShkb2N1bWVudC5ib2R5LCBcIi9cIiwge1xuICBcIi9cIjogcmVxdWlyZSgnLi9wYWdlcy9Vc2Vycy5qcycpLFxuICBcIi9sb2dpblwiOiByZXF1aXJlKCcuL3BhZ2VzL0xvZ2luLmpzJyksXG4gIFwiL2xvZ291dFwiOiByZXF1aXJlKCcuL3BhZ2VzL0xvZ291dC5qcycpLFxuIFxuICBcIi91c2VyRWRpdFwiOiByZXF1aXJlKCcuL3BhZ2VzL1VzZXJFZGl0LmpzJyksXG4gIFwiL3ZlcmlmeS86Y29kZVwiOiByZXF1aXJlKCcuL3BhZ2VzL1ZlcmlmeS5qcycpLFxuICBcIi91c2VyXCI6IHJlcXVpcmUoJy4vcGFnZXMvVXNlclBhZ2UuanMnKSxcbiAgXCIvdXNlcnNcIjogcmVxdWlyZSgnLi9wYWdlcy9Vc2Vycy5qcycpLFxuICAgXG4gIFwiL3Rlc3RFZGl0XCI6IHJlcXVpcmUoJy4vcGFnZXMvVGVzdEVkaXQuanMnKSxcbiAgXCIvdmVyaWZ5Lzpjb2RlXCI6IHJlcXVpcmUoJy4vcGFnZXMvVmVyaWZ5LmpzJyksXG4gIFwiL3Rlc3RcIjogcmVxdWlyZSgnLi9wYWdlcy9UZXN0UGFnZS5qcycpLFxuICBcIi90ZXN0c1wiOiByZXF1aXJlKCcuL3BhZ2VzL1Rlc3RzLmpzJylcblxufSk7XG4iLCJcblxudmFyIEF1dGggPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgdG9rZW46IG0ucHJvcChsb2NhbFN0b3JhZ2UudG9rZW4pLFxuICB1c2VyX3R5cGU6IG0ucHJvcChsb2NhbFN0b3JhZ2UudXNlcl90eXBlKSxcbiAgXG4gIC8vIHRyYWRlIGNyZWRlbnRpYWxzIGZvciBhIHRva2VuXG4gIGxvZ2luOiBmdW5jdGlvbihlbWFpbCwgcGFzc3dvcmQpe1xuICAgIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICB1cmw6ICcvYXV0aC9sb2dpbicsXG4gICAgICBkYXRhOiB7ZW1haWw6ZW1haWwsIHBhc3N3b3JkOnBhc3N3b3JkfSxcbiAgICAgIHVud3JhcFN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xuICAgICAgICBsb2NhbFN0b3JhZ2UudG9rZW4gPSByZXMuYXV0aF90b2tlbjtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnVzZXJfdHlwZT1yZXMudXNlcl90eXBlXG4gICAgICAgIEF1dGgudXNlcl90eXBlKHJlcy51c2VyX3R5cGUpXG4gICAgICAgIHJldHVybiByZXMuYXV0aF90b2tlbjtcbiAgICAgIH1cbiAgICB9KVxuICAgIC50aGVuKHRoaXMudG9rZW4pO1xuICB9LFxuICAvLyBmb3JnZXQgdG9rZW5cbiAgbG9nb3V0OiBmdW5jdGlvbigpe1xuICAgIHRoaXMudG9rZW4oZmFsc2UpO1xuICAgIGRlbGV0ZSBsb2NhbFN0b3JhZ2UudG9rZW47XG4gIH0sXG5cbiAgLy8gc2lnbnVwIG9uIHRoZSBzZXJ2ZXIgZm9yIG5ldyBsb2dpbiBjcmVkZW50aWFsc1xuICByZWdpc3RlcjogZnVuY3Rpb24oZW1haWwsIHBhc3N3b3JkLG5hbWUsdHlwZSl7XG4gICAgcmV0dXJuIG0ucmVxdWVzdCh7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIHVybDogJy91c2VycycsXG4gICAgICBkYXRhOiB7dXNlcjp7ZW1haWw6ZW1haWwsIHBhc3N3b3JkOnBhc3N3b3JkLHR5cGU6dHlwZSxuYW1lOiBuYW1lfX1cbiAgICB9KTtcbiAgfSxcblxuICAvLyBlbnN1cmUgdmVyaWZ5IHRva2VuIGlzIGNvcnJlY3RcbiAgdmVyaWZ5OiBmdW5jdGlvbih0b2tlbil7XG4gICAgcmV0dXJuIG0ucmVxdWVzdCh7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIHVybDogJy9hdXRoL3ZlcmlmeScsXG4gICAgICBkYXRhOiB7dG9rZW46IHRva2VufVxuICAgIH0pO1xuICB9LFxuXG4gIC8vIGdldCBjdXJyZW50IHVzZXIgb2JqZWN0XG4gIHVzZXI6IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIEF1dGgucmVxKCcvdXNlcnMvbWUnKTtcbiAgfSxcblxuICAvLyBtYWtlIGFuIGF1dGhlbnRpY2F0ZWQgcmVxdWVzdFxuICByZXE6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PSAnc3RyaW5nJyl7XG4gICAgICBvcHRpb25zID0ge21ldGhvZDonR0VUJywgdXJsOm9wdGlvbnN9O1xuICAgIH1cbiAgICB2YXIgb2xkQ29uZmlnID0gb3B0aW9ucy5jb25maWcgfHwgZnVuY3Rpb24oKXt9O1xuICAgIG9wdGlvbnMuY29uZmlnID0gZnVuY3Rpb24oeGhyKSB7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkF1dGhvcml6YXRpb25cIiwgIEF1dGgudG9rZW4oKSk7XG4gICAgICBvbGRDb25maWcoeGhyKTtcbiAgICB9O1xuXG4gICAgLy8gdHJ5IHJlcXVlc3QsIGlmIGF1dGggZXJyb3IsIHJlZGlyZWN0XG4gICAgLy8gVE9ETzogcmVtZW1iZXIgd2hlcmUgdGhlIHVzZXIgd2FzLCBvcmlnaW5hbGx5XG4gICAgdmFyIGRlZmVycmVkID0gbS5kZWZlcnJlZCgpO1xuICAgICBtLnJlcXVlc3Qob3B0aW9ucykudGhlbihkZWZlcnJlZC5yZXNvbHZlLCBmdW5jdGlvbihlcnIpe1xuICAgICAgaWYgKGVyci5zdGF0dXMgPT09IDQwMSl7XG4gICAgICAgIGxvZ291dFxuICAgICAgICBtLnJvdXRlKCc/L3VzZXJzJylcbiAgICAgIH1lbHNle1xuICAgICAgICB0aHJvdyBlcnJcbiAgICAgIH1cbiAgICAgIFxuICAgIH0pLnRoZW4oZGVmZXJyZWQucmVzb2x2ZSxkZWZlcnJlZC5yZWplY3QpO1xuXG4gICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9XG59OyIsIi8vIFVzZXIgbW9kZWxcbnZhciBBdXRoID0gcmVxdWlyZSgnLi9BdXRoLmpzJyk7XG52YXIgVXNlciA9IG1vZHVsZS5leHBvcnRzID0ge1xuIFxuXG4gICAgc2VuZDogZnVuY3Rpb24gKGRhdGEsaWQpIHtcbiAgICAgICAgcmV0dXJuIEF1dGgucmVxKHtcbiAgICAgICAgICAgIG1ldGhvZDogaWQgPyAnUFVUJyA6ICdQT1NUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvdGVzdHMnKyhpZD8nLycraWQgOiAnJykgXG4gICAgICAgICAgICAsIFxuICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICB9KTtcbiAgICB9LFxuICBcbiAgICBnZXQ6IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gQXV0aC5yZXEoe1xuICAgICAgICAgICAgbWV0aG9kOiAnZ2V0JyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvdGVzdHMvJytpZCxcbiAgICAgICAgICAgXG5cbiAgICAgICAgfSk7XG4gICAgfSxkZWxldGU6IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gQXV0aC5yZXEoe1xuICAgICAgICAgICAgbWV0aG9kOiAnZGVsZXRlJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvdGVzdHMvJytpZCxcbiAgICAgICAgICAgXG5cbiAgICAgICAgfSk7XG4gICAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVXNlcjsiLCIvLyBVc2VyIG1vZGVsXG52YXIgQXV0aCA9IHJlcXVpcmUoJy4vQXV0aC5qcycpO1xudmFyIFVzZXIgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiBcblxuICAgIHNlbmQ6IGZ1bmN0aW9uIChkYXRhLGlkKSB7XG4gICAgICAgIHJldHVybiBBdXRoLnJlcSh7XG4gICAgICAgICAgICBtZXRob2Q6IGlkID8gJ1BVVCcgOiAnUE9TVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3VzZXJzJysoaWQ/Jy8nK2lkIDogJycpIFxuICAgICAgICAgICAgLCBcbiAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgXG4gICAgZ2V0OiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIEF1dGgucmVxKHtcbiAgICAgICAgICAgIG1ldGhvZDogJ2dldCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3VzZXJzLycraWQsXG4gICAgICAgICAgIFxuXG4gICAgICAgIH0pO1xuICAgIH0sZGVsZXRlOiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIEF1dGgucmVxKHtcbiAgICAgICAgICAgIG1ldGhvZDogJ2RlbGV0ZScsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3VzZXJzLycraWQsXG4gICAgICAgICAgIFxuXG4gICAgICAgIH0pO1xuICAgIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXI7IiwiXG5cbnZhciBOYXZiYXIgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL05hdmJhci5qcycpO1xudmFyIEF1dGggPSByZXF1aXJlKCcuLi9tb2RlbHMvQXV0aC5qcycpO1xuXG52YXIgTG9naW4gPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKXtcbiAgICB2YXIgY3RybCA9IHRoaXM7XG4gICAgY3RybC5uYXZiYXIgPSBuZXcgTmF2YmFyLmNvbnRyb2xsZXIoKTtcbiAgICBjdHJsLmVycm9yID0gbS5wcm9wKCcnKTtcbiAgICB0aGlzLmxvZ2luID0gZnVuY3Rpb24oZSl7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBBdXRoLmxvZ2luKGUudGFyZ2V0LmVtYWlsLnZhbHVlLCBlLnRhcmdldC5wYXNzd29yZC52YWx1ZSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICBtLnJvdXRlKEF1dGgub3JpZ2luYWxSb3V0ZSB8fCAnLycsIG51bGwsIHRydWUpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnIpe1xuICAgICAgICAgIGN0cmwuZXJyb3IobShcIi5hbGVydC5hbGVydC1kYW5nZXIuYW5pbWF0ZWQuZmFkZUluVXBcIiwgZXJyLm1lc3NhZ2UpKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgfSwgIFxuXG4gIHZpZXc6IGZ1bmN0aW9uKGN0cmwpe1xuICAgIHJldHVybiBbTmF2YmFyLnZpZXcoY3RybC5uYXZiYXIpLCBtKFwiLmNvbnRhaW5lclwiLCBbXG4gICAgICBtKFwiZm9ybS50ZXh0LWNlbnRlci5yb3cuZm9ybS1zaWduaW5cIiwge29uc3VibWl0OmN0cmwubG9naW4uYmluZChjdHJsKX0sXG4gICAgICAgIG0oJy5jb2wtc20tNi5jb2wtc20tb2Zmc2V0LTMnLCBbXG4gICAgICAgICAgbShcImgxXCIsIFwibG9naW5cIiksXG4gICAgICAgICAgY3RybC5lcnJvcigpLCBcbiAgICAgICAgICBtKCcuZm9ybS1ncm91cCcsIFtcbiAgICAgICAgICAgIG0oXCJsYWJlbC5zci1vbmx5W2Zvcj0naW5wdXRFbWFpbCddXCIsIFwiRW1haWwgYWRkcmVzc1wiKSxcbiAgICAgICAgICAgIG0oXCJpbnB1dC5mb3JtLWNvbnRyb2xbbmFtZT0nZW1haWwnXVthdXRvZm9jdXNdW2lkPSdpbnB1dEVtYWlsJ11bcGxhY2Vob2xkZXI9J0VtYWlsIGFkZHJlc3MnXVtyZXF1aXJlZF1bdHlwZT0nZW1haWwnXVwiKSxcbiAgICAgICAgICBdKSxcbiAgICAgICAgICBtKCcuZm9ybS1ncm91cCcsIFtcbiAgICAgICAgICAgIG0oXCJsYWJlbC5zci1vbmx5W2Zvcj0naW5wdXRQYXNzd29yZCddXCIsIFwiUGFzc3dvcmRcIiksXG4gICAgICAgICAgICBtKFwiaW5wdXQuZm9ybS1jb250cm9sW25hbWU9J3Bhc3N3b3JkJ11bYXV0b2NvbXBsZXRlPSdvZmYnXVtpZD0naW5wdXRQYXNzd29yZCddW3BsYWNlaG9sZGVyPSdQYXNzd29yZCddW3JlcXVpcmVkXVt0eXBlPSdwYXNzd29yZCddXCIpLFxuICAgICAgICAgIF0pLFxuICAgICAgICAgIG0oJy5mb3JtLWdyb3VwJyxcbiAgICAgICAgICAgIG0oXCJidXR0b24uYnRuLmJ0bi1sZy5idG4tcHJpbWFyeS5idG4tYmxvY2tbdHlwZT0nc3VibWl0J11cIiwgXCJTaWduIGluXCIpXG4gICAgICAgICAgKVxuICAgICAgICBdKVxuICAgICAgKVxuICAgIF0pXTtcbiAgfVxufTsiLCJcblxudmFyIEF1dGggPSByZXF1aXJlKCcuLi9tb2RlbHMvQXV0aC5qcycpO1xuXG52YXIgTG9nb3V0ID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCl7XG4gICAgQXV0aC5sb2dvdXQoKTtcbiAgICBtLnJvdXRlKCcvbG9naW4nKTtcbiAgfSxcblxuICB2aWV3OiBmdW5jdGlvbihjdHJsKXtcbiAgfVxufTsiLCJcblxudmFyIE5hdmJhciA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvTmF2YmFyLmpzJyk7XG52YXIgQXV0aCA9IHJlcXVpcmUoJy4uL21vZGVscy9BdXRoLmpzJyk7XG52YXIgVGVzdCA9IHJlcXVpcmUoJy4uL21vZGVscy9UZXN0LmpzJyk7XG52YXIgUXVlc3Rpb25zID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9RdWVzdGlvbnMuanMnKTtcbnZhciBRdWVzdGlvbldpZGdldCA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvUXVlc3Rpb25XaWRnZXQuanMnKTtcbnZhciBUZXN0RWRpdCA9IG1vZHVsZS5leHBvcnRzID0ge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbiAoYXJncykge1xuICAgIGN0cmwgPSB0aGlzO1xuICAgIGN0cmwudGVzdCA9IHsgbmFtZTogJycsIGRlc2NyaXB0aW9uOiAnJywgcXVlc3Rpb25zOiBbXSB9XG4gICAgY3RybC5uYXZiYXIgPSBuZXcgTmF2YmFyLmNvbnRyb2xsZXIoKTtcbiAgICBjdHJsLmVycm9yID0gbS5wcm9wKCcnKTtcbiAgICBjdHJsLm5ld1EgPSBtLnByb3AoW10pO1xuICAgIGN0cmwucXVlc3Rpb25Db3VudGVySWQgPSAwXG4gICAgY3RybC5kZWxldGU9ZnVuY3Rpb24oY3RybCl7XG4gICAgICBUZXN0LmRlbGV0ZShtLnJvdXRlLnBhcmFtKCkuaWQpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uICh0ZXN0KSB7XG4gICAgICAgICAgdmFyIG1lc3NhZ2UgPSAndGVzdCBkZWxldGVkIHN1Y2Nlc3NmdWx5JztcblxuICAgICAgICAgIGN0cmwuZXJyb3IobShcIi5hbGVydC5hbGVydC1kYW5nZXIuYW5pbWF0ZWQuZmFkZUluVXBcIiwgbWVzc2FnZSkpO1xuICAgICAgICAgIG0ucm91dGUoJy90ZXN0cycpO1xuICAgICAgICAgIG0ucm91dGUoJy90ZXN0cycpXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICB2YXIgbWVzc2FnZSA9ICdBbiBlcnJvciBvY2N1cnJlZC4nO1xuICAgICAgICAgIGN0cmwuZXJyb3IobShcIi5hbGVydC5hbGVydC1kYW5nZXIuYW5pbWF0ZWQuZmFkZUluVXBcIiwgbWVzc2FnZSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY3RybC5zYXZlVGVzdCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAvLyB2YWxpZGF0aW9uXG4gICAgICB0ZXN0RGF0YSA9IHsgdGVzdDogeyBuYW1lOiBlLnRhcmdldC5uYW1lLnZhbHVlLCBkZXNjcmlwdGlvbjogZS50YXJnZXQuZGVzY3JpcHRpb24udmFsdWUsIHF1ZXN0aW9uczoge30gfSB9XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGUudGFyZ2V0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vIGZvcm1EYXRhW3RhcmdldC5lbGVtZW50c1tpXS5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpXSA9IHRhcmdldC5lbGVtZW50c1tpXS52YWx1ZTtcbiAgICAgICAgZW5hbWUgPSBlLnRhcmdldFtpXS5uYW1lXG4gICAgICAgIGNvbnNvbGUubG9nKGVuYW1lKVxuICAgICAgICBpZiAoZW5hbWUuc3RhcnRzV2l0aCgncXVlc3Rpb24nKSkge1xuICAgICAgICAgIGVfYXJyID0gZW5hbWUuc3BsaXQoJzonKVxuICAgICAgICAgIGlmICh0ZXN0RGF0YS50ZXN0LnF1ZXN0aW9uc1tlX2FyclswXV0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0ZXN0RGF0YS50ZXN0LnF1ZXN0aW9uc1tlX2FyclswXV0gPSB7fVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZV9hcnIubGVuZ3RoID09IDIpIHtcbiAgICAgICAgICAgIHRlc3REYXRhLnRlc3QucXVlc3Rpb25zW2VfYXJyWzBdXVtlX2FyclsxXV0gPSBlLnRhcmdldFtpXS52YWx1ZVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGVzdERhdGEudGVzdC5xdWVzdGlvbnNbZV9hcnJbMF1dW2VfYXJyWzFdXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgdGVzdERhdGEudGVzdC5xdWVzdGlvbnNbZV9hcnJbMF1dW2VfYXJyWzFdXSA9IHt9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0ZXN0RGF0YS50ZXN0LnF1ZXN0aW9uc1tlX2FyclswXV1bZV9hcnJbMV1dW2VfYXJyWzJdXSA9IGUudGFyZ2V0W2ldLnZhbHVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgfVxuICAgICAgcXVlc3Rpb25zID0gdGVzdERhdGEudGVzdC5xdWVzdGlvbnNcbiAgICAgIHRlc3REYXRhLnRlc3QucXVlc3Rpb25zX2F0dHJpYnV0ZXMgPSBbXVxuICAgICAgT2JqZWN0LmtleXMocXVlc3Rpb25zKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gcXVlc3Rpb25zW2tleV1cbiAgICAgICAgcXVlc3Rpb24gPSB7IGxhYmVsOiB2YWx1ZS5uYW1lLCBkZXNjcmlwdGlvbjogdmFsdWUuZGVzY3JpcHRpb24sIG9wdGlvbnNfYXR0cmlidXRlczogW10gfVxuICAgICAgICBPYmplY3Qua2V5cyh2YWx1ZSkuZm9yRWFjaChmdW5jdGlvbiAocWtleSkge1xuICAgICAgICAgIHZhciB2YWx1ZWluc2lkZSA9IHZhbHVlW3FrZXldXG4gICAgICAgICAgaWYgKHFrZXkuc3RhcnRzV2l0aChcIm9wdGlvblwiKSkge1xuICAgICAgICAgICAgcXVlc3Rpb24ub3B0aW9uc19hdHRyaWJ1dGVzLnB1c2godmFsdWVpbnNpZGUpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB0ZXN0RGF0YS50ZXN0LnF1ZXN0aW9uc19hdHRyaWJ1dGVzLnB1c2gocXVlc3Rpb24pXG4gICAgICB9XG4gICAgICApOyBcbiAgICAgIGRlbGV0ZSB0ZXN0RGF0YS50ZXN0LnF1ZXN0aW9uc1xuXG4gICAgICAvLyBpbnNlcnRpb25cbiAgICAgIFRlc3Quc2VuZCh0ZXN0RGF0YSwgY3RybC50ZXN0LmlkKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY3RybC5lcnJvcihtKFwiLmFsZXJ0LmFsZXJ0LXN1Y2Nlc3MuYW5pbWF0ZWQuZmFkZUluVXBcIiwgJ3Rlc3QgaGF2ZSBiZWVuIHNhdmVkJykpO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG5cblxuICAgICAgICAgIGN0cmwuZXJyb3IobShcIi5hbGVydC5hbGVydC1kYW5nZXIuYW5pbWF0ZWQuZmFkZUluVXBcIiwgSlNPTi5zdHJpbmdpZnkoZXJyKSkpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIGlmIChtLnJvdXRlLnBhcmFtKCkuaWQgIT0gdW5kZWZpbmVkKVxuICAgICAgVGVzdC5nZXQobS5yb3V0ZS5wYXJhbSgpLmlkKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAodGVzdCkge1xuXG4gICAgICAgICAgY3RybC50ZXN0ID0gdGVzdFxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgdmFyIG1lc3NhZ2UgPSAnQW4gZXJyb3Igb2NjdXJyZWQuJztcbiAgICAgICAgICBtLnJvdXRlKCcvdGVzdHMnKVxuICAgICAgICAgIGN0cmwuZXJyb3IobShcIi5hbGVydC5hbGVydC1kYW5nZXIuYW5pbWF0ZWQuZmFkZUluVXBcIiwgbWVzc2FnZSkpO1xuICAgICAgICB9KTtcblxuICB9LFxuXG4gIHZpZXc6IGZ1bmN0aW9uIChjdHJsKSB7XG5cbiAgICByZXR1cm4gW05hdmJhci52aWV3KGN0cmwubmF2YmFyKSwgbShcIi5jb250YWluZXJcIiwgW1xuICAgICAgbShcImZvcm0udGV4dC1jZW50ZXIucm93LmZvcm0tc2lnbmluXCIsIHsgb25zdWJtaXQ6IGN0cmwuc2F2ZVRlc3QuYmluZChjdHJsKSB9LFxuICAgICAgbSgnLmNvbC1zbS02LmNvbC1zbS1vZmZzZXQtMycsIFtcbiAgICAgICAgbShcImgxXCIsIFwiU2F2ZSBUZXN0XCIpLFxuICAgICBcbiAgICAgICAgbSgnLmZvcm0tZ3JvdXAnLFxuICAgICAgICBtKFwiYnV0dG9uLmJ0bi5idG4tcHJpbWFyeVt0eXBlPSdzdWJtaXQnXVtzdHlsZT0nZmxvYXQ6bGVmdCddXCIsIFwiU2F2ZSBBbGxcIiksXG4gICAgICAgIG0oXCJidXR0b24uYnRuLmJ0bi1kYW5nZXJbdHlwZT1idXR0b25dW3N0eWxlPSdmbG9hdDpyaWdodCddXCIsIHsgb25jbGljazogY3RybC5kZWxldGUuYmluZChjdHJsKSB9LCBcImRlbGV0ZVwiKSxcbiAgICAgICAgICApLCBtKCdicicpLCBtKCdicicpLFxuICAgICAgICAgIGN0cmwuZXJyb3IoKSxcbiAgICAgICAgICBtKCcuZm9ybS1ncm91cCcsIFtcbiAgICAgICAgICAgIG0oXCJsYWJlbC5zci1vbmx5W2Zvcj0naW5wdXRUZXN0J11cIiwgXCJUZXN0IGRlc2NyaXB0aW9uXCIpLFxuICAgICAgICAgICAgbShcImlucHV0LmZvcm0tY29udHJvbFtuYW1lPSduYW1lJ11bYXV0b2ZvY3VzXVtpZD0naW5wdXRuYW1lJ11bcGxhY2Vob2xkZXI9J25hbWUgJ11bcmVxdWlyZWRdW3R5cGU9J3RleHQnXVwiLCB7IHZhbHVlOiBjdHJsLnRlc3QubmFtZSB9KSxcbiAgICAgICAgICBdKSwgbSgnLmZvcm0tZ3JvdXAnLCBbXG4gICAgICAgICAgICBtKFwibGFiZWwuc3Itb25seVtmb3I9J2lucHV0VGVzdCddXCIsIFwiVGVzdCBkZXNjcmlwdGlvblwiKSxcbiAgICAgICAgICAgIG0oXCJ0ZXh0YXJlYS5mb3JtLWNvbnRyb2xbbmFtZT0nZGVzY3JpcHRpb24nXVthdXRvZm9jdXNdW2lkPSdpbnB1dGRlc2NyaXB0aW9uJ11bcGxhY2Vob2xkZXI9J2Rlc2NyaXB0aW9uICddW3JlcXVpcmVkXVt0eXBlPSd0ZXh0J11cIiwgeyB2YWx1ZTogY3RybC50ZXN0LmRlc2NyaXB0aW9uIH0pLFxuICAgICAgICAgIF0pLFxuXG4gICAgICAgICAgLCBtKFwiaHJbc3R5bGU9J2JvcmRlcjogMnB4IHNvbGlkICMyYjY2ZmY7J11cIiksXG4gICAgICAgICAgbShcImgxXCIsIFwiUXVlc3Rpb25zXCIpLFxuICAgICAgICAgIG0oXCJidXR0b25bY2xhc3M9J2J0biBidG4tcHJpbWFyeSddW3R5cGU9YnV0dG9uXVtzdHlsZT0nZmxvYXQ6bGVmdCddXCIsIHtcbiAgICAgICAgICAgIG9uY2xpY2s6IGZ1bmN0aW9uIG5hbWUocGFyYW1zKSB7XG4gICAgICAgICAgICAgIGN0cmwucXVlc3Rpb25Db3VudGVySWQgKz0gMTtcbiAgICAgICAgICAgICAgbGlzdCA9IGN0cmwubmV3USgpXG4gICAgICAgICAgICAgIGxpc3QucHVzaChtLmNvbXBvbmVudChRdWVzdGlvbldpZGdldCwgeyBsYWJlbDogJycsIGRlc2NyaXB0aW9uOiAnJywgb3B0aW9uczogW3sgdGl0bGU6ICcnLCBpc19jb3JyZWN0OiB0cnVlIH1dIH0sIGN0cmwucXVlc3Rpb25Db3VudGVySWQpKVxuICAgICAgICAgICAgICBjdHJsLm5ld1EobGlzdClcbiAgICAgICAgICAgICAgLy8gY3RybC5uZXdRKGN0cmwubmV3USgpLnB1c2gobS5jb21wb25lbnQoUXVlc3Rpb25XaWRnZXQse29wdGlvbnM6W119LHF1ZXN0aW9uQ291bnRlcklkKSkpIFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIFwiQWRkIG5ldyBRdWVzdGlvbiBcIiksXG4gICAgICAgICAgY3RybC5uZXdRKCksXG5cbiAgICAgICAgICBbXG4gICAgICAgICAgICBjdHJsLnRlc3QucXVlc3Rpb25zLm1hcChmdW5jdGlvbiAocXVlc3Rpb24pIHtcbiAgICAgICAgICAgICAgY3RybC5xdWVzdGlvbkNvdW50ZXJJZCArPSAxO1xuICAgICAgICAgICAgICByZXR1cm4gbS5jb21wb25lbnQoUXVlc3Rpb25XaWRnZXQsIHF1ZXN0aW9uLCBjdHJsLnF1ZXN0aW9uQ291bnRlcklkKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICBdXG5cbiAgICAgICAgXSlcbiAgICAgIClcbiAgICBdKV07XG4gIH1cbn07IiwiLy8gdXNlciBwYWdlIHRvIHZpZXcgdXNlciBhLCBjb21tZW50cyAgYW5kIG5vdGVzIGlmIGFnZW50XG52YXIgVXNlciA9IHJlcXVpcmUoJy4uL21vZGVscy9Vc2VyLmpzJyk7XG52YXIgTmF2YmFyID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9OYXZiYXIuanMnKTtcbnZhciBRdWVzdGlvbnMgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL1F1ZXN0aW9ucy5qcycpO1xudmFyIFF1ZXN0aW9uV2lkZ2V0ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9RdWVzdGlvbldpZGdldC5qcycpO1xudmFyIFVzZXJQYWdlID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgdmFyIGN0cmwgPSB0aGlzO1xuICAgIGN0cmwuZXJyb3IgPSBtLnByb3AoJycpO1xuIFxuICAgIGN0cmwub3BlbiA9IGZ1bmN0aW9uIChzdGF0dXMpIHtcbiAgICAgIGN0cmwudXNlcigpLnVzZXIuc3RhdHVzID0gc3RhdHVzXG4gICAgICBVc2VyLnNlbmQoeyBzdGF0dXM6IHN0YXR1cyB9LCBtLnJvdXRlLnBhcmFtKCkuaWQpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgICAgY3RybC51c2VyKCkudXNlciA9IHVzZXJcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIHZhciBtZXNzYWdlID0gJ0FuIGVycm9yIG9jY3VycmVkLic7XG4gICAgICAgICAgY3RybC5lcnJvcihtKFwiLmFsZXJ0LmFsZXJ0LWRhbmdlci5hbmltYXRlZC5mYWRlSW5VcFwiLCBtZXNzYWdlKSk7XG4gICAgICAgIH0pO1xuICAgIH0gXG4gICAgY3RybC5kZWxldGUgPSBmdW5jdGlvbiAoc3RhdHVzKSB7XG5cbiAgICAgIFVzZXIuZGVsZXRlKG0ucm91dGUucGFyYW0oKS5pZClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgICB2YXIgbWVzc2FnZSA9ICd1c2VyIGRlbGV0ZWQgc3VjY2Vzc2Z1bHknO1xuXG4gICAgICAgICAgY3RybC5lcnJvcihtKFwiLmFsZXJ0LmFsZXJ0LWRhbmdlci5hbmltYXRlZC5mYWRlSW5VcFwiLCBtZXNzYWdlKSk7XG4gICAgICAgICAgbS5yb3V0ZSgnL3VzZXJzJyk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICB2YXIgbWVzc2FnZSA9ICdBbiBlcnJvciBvY2N1cnJlZC4nO1xuICAgICAgICAgIGN0cmwuZXJyb3IobShcIi5hbGVydC5hbGVydC1kYW5nZXIuYW5pbWF0ZWQuZmFkZUluVXBcIiwgbWVzc2FnZSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgVXNlci5nZXQobS5yb3V0ZS5wYXJhbSgpLmlkKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgdXNlcldyYXBwZXI9e3VzZXI6IHVzZXJ9XG4gICAgICAgIGN0cmwudXNlciA9IG0ucHJvcCh1c2VyV3JhcHBlcilcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSAnQW4gZXJyb3Igb2NjdXJyZWQuJztcbiAgICAgICBtLnJvdXRlKCcvdXNlcnMnKVxuICAgICAgICBjdHJsLmVycm9yKG0oXCIuYWxlcnQuYWxlcnQtZGFuZ2VyLmFuaW1hdGVkLmZhZGVJblVwXCIsIG1lc3NhZ2UpKTtcbiAgICAgIH0pO1xuXG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uIChjdHJsKSB7IFxuICAgIHJldHVybiBbTmF2YmFyLCBtKCcuY29udGFpbmVyJywgW1tcbiAgICAgIG0oXCJoMlwiLCBcIlVzZXJcIiksXG4gICAgICBjdHJsLmVycm9yKCksXG4gICAgICBtKFwicFwiLCBjdHJsLnVzZXIoKS51c2VyLm5hbWUpLG0oXCJwXCIsIGN0cmwudXNlcigpLnVzZXIuZW1haWwpLFxuICAgICAgbShcInRhYmxlLnRhYmxlLnRhYmxlLWNvbmRlbnNlZC50YWJsZS1ib3JkZXJlZFwiLCBbXG4gICAgICAgIG0oXCJ0aGVhZFwiLCBbXG4gICAgICAgICAgbShcInRyXCIsIFtcbiAgICAgICAgICAgIG0oXCJ0aFwiLCBcIkN1c3RvbWVyXCIpLFxuICAgICAgICAgICAgbShcInRoXCIsIFwiQWdlbnRcIiksXG4gICAgICAgICAgICBtKFwidGhcIiwgXCJDcmVhdGlvbiBEYXRlXCIpLFxuICAgICAgICAgICAgbShcInRoXCIsIFwiRG9uZSBEYXRlXCIpLFxuICAgICAgICAgICAgbShcInRoXCIsIFwiU3RhdHVzXCIpLFxuICAgICAgICAgICAgbShcInRoXCIsIFwidHlwZVwiKSxcbiAgICAgICAgICBdKVxuICAgICAgICBdKSxcbiAgICAgICAgbShcInRib2R5XCIsIFtcbiAgICAgICAgICBtKFwidHJcIiwgW1xuICAgICAgICAgICAgbShcInRkXCIsIGN0cmwudXNlcigpLnVzZXIuY3VzdG9tZXJfbmFtZSksXG4gICAgICAgICAgICBtKFwidGRcIiwgY3RybC51c2VyKCkudXNlci5hZ2VudF9uYW1lKSxcbiAgICAgICAgICAgIG0oXCJ0ZFwiLCBjdHJsLnVzZXIoKS51c2VyLmNyZWF0ZWRfYXQpLFxuICAgICAgICAgICAgbShcInRkXCIsIGN0cmwudXNlcigpLnVzZXIuZG9uZV9kYXRlKSxcbiAgICAgICAgICAgIG0oXCJ0ZFwiLCBjdHJsLnVzZXIoKS51c2VyLnN0YXR1cyksXG4gICAgICAgICAgICBtKFwidGRcIiwgbShcInNwYW4ubGFiZWxcIiwgeyBjbGFzczogY3RybC51c2VyKCkudXNlci50eXBlID09IFwibG93XCIgPyBcImxhYmVsLWRlZmF1bHRcIiA6IGN0cmwudXNlcigpLnVzZXIudHlwZSA9PSBcIm1lZGl1bVwiID8gXCJsYWJlbC1wcmltYXJ5XCIgOiBcImxhYmVsLWRhbmdlclwiIH0sIGN0cmwudXNlcigpLnVzZXIudHlwZSkpXG4gICAgICAgICAgXSksXG5cbiAgICAgICAgXSlcbiAgICAgIF0pLFxuXG4gICAgICBjdHJsLnVzZXIoKS51c2VyLnN0YXR1cyA9PSAnY2xvc2VkJyA/IG0oXCJidXR0b24uYnRuLmJ0bi13YXJuaW5nXCIsIHsgb25jbGljazogY3RybC5vcGVuLmJpbmQoY3RybCwgJ29wZW5lZCcpIH0sIFwiT3BlbmVkXCIpIDpcbiAgICAgICAgbShcImJ1dHRvbi5idG4uYnRuLWRhbmdlclwiLCB7IG9uY2xpY2s6IGN0cmwub3Blbi5iaW5kKGN0cmwsICdjbG9zZWQnKSB9LCBcIkNsb3NlXCIpXG5cblxuXG4gICAgICAsbShcImJ1dHRvbi5idG4uYnRuLWRhbmdlclwiLCB7IG9uY2xpY2s6IGN0cmwuZGVsZXRlLmJpbmQoY3RybCkgfSwgXCJkZWxldGVcIilcblxuXG5cblxuICAgIF0sIG0uY29tcG9uZW50KFF1ZXN0aW9uV2lkZ2V0LCB7dXNlcl9pZDogY3RybC51c2VyKCkudXNlci5pZH0pXVxuXG4gICAgKV07XG5cbiAgfVxuXG59IiwiXG5cbnZhciBOYXZiYXIgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL05hdmJhci5qcycpO1xudmFyIG1jID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9EYXRhVGFibGUuanMnKTtcbnZhciBBdXRoID0gcmVxdWlyZSgnLi4vbW9kZWxzL0F1dGguanMnKTtcbnZhciBUZXN0ID0gcmVxdWlyZSgnLi4vbW9kZWxzL1Rlc3QuanMnKTtcbnZhciBUZXN0UGFnZSA9IHJlcXVpcmUoJy4vVGVzdFBhZ2UuanMnKTtcbnZhciBUZXN0RWRpdCA9IHJlcXVpcmUoJy4vVGVzdEVkaXQuanMnKTtcblxudmFyIFRlc3RzID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY3RybCA9IHRoaXM7XG4gICAgY3RybC5wcmlvcmV0eUZyb21hdGU9ZnVuY3Rpb24odmFsdWUsIHJvdywgY29sLCBhdHRycyl7XG4gICAgICBpZiAodmFsdWUgPT0gJ2hpZ2gnKSBhdHRycy5jbGFzcyA9ICdsYWJlbCBsYWJlbC1kYW5nZXInO1xuICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfVxuICAgIHRoaXMuZGF0YXRhYmxlID0gbmV3IG1jLkRhdGF0YWJsZS5jb250cm9sbGVyKFxuICAgICAgLy8gQ29sdW1ucyBkZWZpbml0aW9uOlxuICAgICAgWyBcblxuICAgICAgICB7IGtleTogXCJuYW1lXCIsbGFiZWw6IFwiTmFtZVwiLCBzb3J0YWJsZTogdHJ1ZSB9LFxuICAgICAgICB7IGtleTogXCJkZXNjcmlwdGlvblwiLGxhYmVsOiBcIkRlc2NyaXB0aW9uXCIsIHNvcnRhYmxlOiBmYWxzZSB9LFxuICAgICAgICB7IGtleTogXCJxdWVzdGlvbl9jb3VudFwiLGxhYmVsOiBcIlF1ZXN0aW9uc1wiLCBzb3J0YWJsZTogZmFsc2UgfVxuXG5cbiAgICAgIF0sXG4gICAgICAvLyBPdGhlciBjb25maWd1cmF0aW9uOlxuICAgICAge1xuICAgICAgICAvLyBBZGRyZXNzIG9mIHRoZSB3ZWJzZXJ2ZXIgc3VwcGx5aW5nIHRoZSBkYXRhXG4gICAgICAgIHVybDogJy9hcGkvdjEvdGVzdHMnLFxuICAgICAgICBhdXRob3JpemF0aW9uOiBBdXRoLnRva2VuKCksXG4gICAgICAgIC8vIEhhbmRsZXIgb2YgY2xpY2sgZXZlbnQgb24gZGF0YSBjZWxsXG4gICAgICAgIC8vIEl0IHJlY2VpdmVzIHRoZSByZWxldmFudCBpbmZvcm1hdGlvbiBhbHJlYWR5IHJlc29sdmVkXG4gICAgICAgIG9uQ2VsbENsaWNrOiBmdW5jdGlvbiAoY29udGVudCwgcm93LCBjb2wpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhjb250ZW50LCByb3csIGNvbCk7XG4gICAgICAgICAgICAgIC8vIG0ucm91dGUoXCIvdGVzdFwiLHtpZDpyb3cuaWR9KVxuICAgICAgICAgICAgICBtLnJvdXRlKFwiL3Rlc3RFZGl0XCIse2lkOnJvdy5pZH0pXG4gICAgICAgICBcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG4gICAgXG4gIH0sIFxuXG4gIHZpZXc6IGZ1bmN0aW9uIChjdHJsKSB7XG4gICAgcmV0dXJuIFtOYXZiYXIsIG0oJy5jb250YWluZXInLCBbXG4gICAgICBtKCdoMScsICdUZXN0cycpLFxuICAgICAgbShcImFbaHJlZj0nPy90ZXN0RWRpdCddW2NsYXNzPSdidG4gYnRuLXByaW1hcnkgZmxvYXQtcmlnaHQnXVwiLFwiTmV3IFRlc3RcIiksXG4gICAgICBtYy5EYXRhdGFibGUudmlldyhjdHJsLmRhdGF0YWJsZSwge1xuICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgfSlcbiAgICBdKV07XG4gIH1cbn07IiwiXG5cbnZhciBOYXZiYXIgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL05hdmJhci5qcycpO1xudmFyIEF1dGggPSByZXF1aXJlKCcuLi9tb2RlbHMvQXV0aC5qcycpO1xudmFyIFVzZXIgPSByZXF1aXJlKCcuLi9tb2RlbHMvVXNlci5qcycpO1xuXG52YXIgVXNlckVkaXQgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgY29udHJvbGxlcjogZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICBjdHJsID0gdGhpcztcbiAgICBjdHJsLnVzZXI9e25hbWU6JycsZW1haWw6JycsdHlwZTonJyxwYXNzd29yZDonJ31cbiAgICBjdHJsLm5hdmJhciA9IG5ldyBOYXZiYXIuY29udHJvbGxlcigpO1xuICAgIGN0cmwuZXJyb3IgPSBtLnByb3AoJycpO1xuICAgIGN0cmwuZGVsZXRlPWZ1bmN0aW9uKGN0cmwpe1xuICAgICAgVXNlci5kZWxldGUobS5yb3V0ZS5wYXJhbSgpLmlkKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICAgIHZhciBtZXNzYWdlID0gJ3VzZXIgZGVsZXRlZCBzdWNjZXNzZnVseSc7XG5cbiAgICAgICAgICBjdHJsLmVycm9yKG0oXCIuYWxlcnQuYWxlcnQtZGFuZ2VyLmFuaW1hdGVkLmZhZGVJblVwXCIsIG1lc3NhZ2UpKTtcbiAgICAgICAgICBtLnJvdXRlKCcvdXNlcnMnKTtcbiAgICAgICAgICBtLnJvdXRlKCcvdXNlcnMnKVxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgdmFyIG1lc3NhZ2UgPSAnQW4gZXJyb3Igb2NjdXJyZWQuJztcbiAgICAgICAgICBjdHJsLmVycm9yKG0oXCIuYWxlcnQuYWxlcnQtZGFuZ2VyLmFuaW1hdGVkLmZhZGVJblVwXCIsIG1lc3NhZ2UpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGN0cmwuc2F2ZVVzZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgLy8gdmFsaWRhdGlvblxuICAgICAgdXNlckRhdGE9e3VzZXI6eyBuYW1lOiBlLnRhcmdldC5uYW1lLnZhbHVlLCBlbWFpbDogZS50YXJnZXQuZW1haWwudmFsdWUsdHlwZTogZS50YXJnZXQudHlwZS52YWx1ZSAscGFzc3dvcmQ6IGUudGFyZ2V0LnBhc3N3b3JkLnZhbHVlfX1cbiAgICAgXG5cbiAgICAgIC8vIGluc2VydGlvblxuICAgICAgVXNlci5zZW5kKHVzZXJEYXRhLGN0cmwudXNlci5pZClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGN0cmwuZXJyb3IobShcIi5hbGVydC5hbGVydC1zdWNjZXNzLmFuaW1hdGVkLmZhZGVJblVwXCIsICd1c2VyIGhhdmUgYmVlbiBzYXZlZCcpKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgXG5cbiAgICAgICAgICBjdHJsLmVycm9yKG0oXCIuYWxlcnQuYWxlcnQtZGFuZ2VyLmFuaW1hdGVkLmZhZGVJblVwXCIsIEpTT04uc3RyaW5naWZ5KGVycikpKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBpZihtLnJvdXRlLnBhcmFtKCkuaWQhPSB1bmRlZmluZWQpXG4gICAgVXNlci5nZXQobS5yb3V0ZS5wYXJhbSgpLmlkKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICBcbiAgICAgICAgY3RybC51c2VyID0gdXNlclxuICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICB2YXIgbWVzc2FnZSA9ICdBbiBlcnJvciBvY2N1cnJlZC4nO1xuICAgICAgIG0ucm91dGUoJy91c2VycycpXG4gICAgICAgIGN0cmwuZXJyb3IobShcIi5hbGVydC5hbGVydC1kYW5nZXIuYW5pbWF0ZWQuZmFkZUluVXBcIiwgbWVzc2FnZSkpO1xuICAgICAgfSk7XG5cbiAgfSxcblxuICB2aWV3OiBmdW5jdGlvbiAoY3RybCkge1xuICAgIHJldHVybiBbTmF2YmFyLnZpZXcoY3RybC5uYXZiYXIpLCBtKFwiLmNvbnRhaW5lclwiLCBbXG4gICAgICBtKFwiZm9ybS50ZXh0LWNlbnRlci5yb3cuZm9ybS1zaWduaW5cIiwgeyBvbnN1Ym1pdDogY3RybC5zYXZlVXNlci5iaW5kKGN0cmwpIH0sXG4gICAgICAgIG0oJy5jb2wtc20tNi5jb2wtc20tb2Zmc2V0LTMnLCBbXG4gICAgICAgICAgbShcImgxXCIsIFwiU2F2ZSBVc2VyXCIpLFxuICAgICAgICAgIGN0cmwuZXJyb3IoKSxcblxuICAgICAgICAgIG0oXCJidXR0b24uYnRuLmJ0bi1kYW5nZXJbdHlwZT1idXR0b25dW3N0eWxlPSdmbG9hdDpyaWdodCddXCIsIHsgb25jbGljazogY3RybC5kZWxldGUuYmluZChjdHJsKSB9LCBcImRlbGV0ZVwiKSxcbiAgICAgICAgICBcbiAgICAgICAgICBtKFwiYnV0dG9uLmJ0bi5idG4tcHJpbWFyeVt0eXBlPSdzdWJtaXQnXVtzdHlsZT0nZmxvYXQ6bGVmdCddXCIsIFwiU2F2ZVwiKSxcbiAgICAgICAgICBtKCdicicpLG0oJ2JyJyksXG4gICAgICAgICAgbSgnLmZvcm0tZ3JvdXAnLCBbXG4gICAgICAgICAgICBtKFwibGFiZWwuc3Itb25seVtmb3I9J2lucHV0VXNlciddXCIsIFwiVXNlciBkZXNjcmlwdGlvblwiKSxcbiAgICAgICAgICAgIG0oXCJpbnB1dC5mb3JtLWNvbnRyb2xbbmFtZT0nbmFtZSddW2F1dG9mb2N1c11baWQ9J2lucHV0bmFtZSddW3BsYWNlaG9sZGVyPSduYW1lICddW3JlcXVpcmVkXVt0eXBlPSd0ZXh0J11cIix7dmFsdWU6IGN0cmwudXNlci5uYW1lfSksXG4gICAgICAgICAgXSksIG0oJy5mb3JtLWdyb3VwJywgW1xuICAgICAgICAgICAgbShcImxhYmVsLnNyLW9ubHlbZm9yPSdpbnB1dFVzZXInXVwiLCBcIlVzZXIgZGVzY3JpcHRpb25cIiksXG4gICAgICAgICAgICBtKFwiaW5wdXQuZm9ybS1jb250cm9sW25hbWU9J2VtYWlsJ11bYXV0b2ZvY3VzXVtpZD0naW5wdXRlbWFpbCddW3BsYWNlaG9sZGVyPSdlbWFpbCAnXVtyZXF1aXJlZF1bdHlwZT0ndGV4dCddXCIse3ZhbHVlOiBjdHJsLnVzZXIuZW1haWx9KSxcbiAgICAgICAgICBdKSxtKCcuZm9ybS1ncm91cCcsIFtcbiAgICAgICAgICAgIG0oXCJsYWJlbC5zci1vbmx5W2Zvcj0naW5wdXRVc2VyJ11cIiwgXCJVc2VyIGRlc2NyaXB0aW9uXCIpLFxuICAgICAgICAgICAgbShcImlucHV0LmZvcm0tY29udHJvbFtuYW1lPSdwYXNzd29yZCddW2F1dG9mb2N1c11baWQ9J2lucHV0cGFzc3dvcmQnXVtwbGFjZWhvbGRlcj0ncGFzc3dvcmQgJ11bdHlwZT0ndGV4dCddXCIse3JlcXVpcmVkOiBjdHJsLnVzZXIuaWQ9PXVuZGVmaW5lZH0pLFxuICAgICAgICAgIF0pLCBtKCcuZm9ybS1ncm91cCcsIFtcbiAgICAgICAgICAgIG0oXCJsYWJlbC5zci1vbmx5W2Zvcj0naW5wdXR0eXBlJ11cIiwgXCJ0eXBlXCIpLFxuICAgICAgICAgICAgbShcInNlbGVjdC5mb3JtLWNvbnRyb2xbbmFtZT0ndHlwZSddW3JlcXVpcmVkXVwiLCBbbShcIm9wdGlvblt2YWx1ZT0nVGVhY2hlciddXCIsIFwiVGVhY2hlclwiKSwgbShcIm9wdGlvblt2YWx1ZT0nU3R1ZGVudCddXCIrKGN0cmwudXNlci50eXBlPT1cIlN0dWRlbnRcIiA/IFwiW3NlbGVjdGVkXVwiOlwiXCIpLCAnU3R1ZGVudCcpXSksXG4gICAgICAgICAgXSksXG5cbiAgICAgICAgICBcbiAgICAgICAgXSlcbiAgICAgIClcbiAgICBdKV07XG4gIH1cbn07IiwiLy8gdXNlciBwYWdlIHRvIHZpZXcgdXNlciBhLCBjb21tZW50cyAgYW5kIG5vdGVzIGlmIGFnZW50XG52YXIgVXNlciA9IHJlcXVpcmUoJy4uL21vZGVscy9Vc2VyLmpzJyk7XG52YXIgTmF2YmFyID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9OYXZiYXIuanMnKTtcbnZhciBVc2VyUGFnZSA9IG1vZHVsZS5leHBvcnRzID0ge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbiAoYXJncykge1xuICAgIHZhciBjdHJsID0gdGhpcztcbiAgICBjdHJsLmVycm9yID0gbS5wcm9wKCcnKTtcbiBcbiAgICBjdHJsLm9wZW4gPSBmdW5jdGlvbiAoc3RhdHVzKSB7XG4gICAgICBjdHJsLnVzZXIoKS51c2VyLnN0YXR1cyA9IHN0YXR1c1xuICAgICAgVXNlci5zZW5kKHsgc3RhdHVzOiBzdGF0dXMgfSwgbS5yb3V0ZS5wYXJhbSgpLmlkKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICAgIGN0cmwudXNlcigpLnVzZXIgPSB1c2VyXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICB2YXIgbWVzc2FnZSA9ICdBbiBlcnJvciBvY2N1cnJlZC4nO1xuICAgICAgICAgIGN0cmwuZXJyb3IobShcIi5hbGVydC5hbGVydC1kYW5nZXIuYW5pbWF0ZWQuZmFkZUluVXBcIiwgbWVzc2FnZSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY3RybC5kZWxldGUgPSBmdW5jdGlvbiAoc3RhdHVzKSB7XG5cbiAgICAgIFVzZXIuZGVsZXRlKG0ucm91dGUucGFyYW0oKS5pZClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgICB2YXIgbWVzc2FnZSA9ICd1c2VyIGRlbGV0ZWQgc3VjY2Vzc2Z1bHknO1xuXG4gICAgICAgICAgY3RybC5lcnJvcihtKFwiLmFsZXJ0LmFsZXJ0LWRhbmdlci5hbmltYXRlZC5mYWRlSW5VcFwiLCBtZXNzYWdlKSk7XG4gICAgICAgICAgbS5yb3V0ZSgnL3VzZXJzJyk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICB2YXIgbWVzc2FnZSA9ICdBbiBlcnJvciBvY2N1cnJlZC4nO1xuICAgICAgICAgIGN0cmwuZXJyb3IobShcIi5hbGVydC5hbGVydC1kYW5nZXIuYW5pbWF0ZWQuZmFkZUluVXBcIiwgbWVzc2FnZSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgVXNlci5nZXQobS5yb3V0ZS5wYXJhbSgpLmlkKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgdXNlcldyYXBwZXI9e3VzZXI6IHVzZXJ9XG4gICAgICAgIGN0cmwudXNlciA9IG0ucHJvcCh1c2VyV3JhcHBlcilcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSAnQW4gZXJyb3Igb2NjdXJyZWQuJztcbiAgICAgICBtLnJvdXRlKCcvdXNlcnMnKVxuICAgICAgICBjdHJsLmVycm9yKG0oXCIuYWxlcnQuYWxlcnQtZGFuZ2VyLmFuaW1hdGVkLmZhZGVJblVwXCIsIG1lc3NhZ2UpKTtcbiAgICAgIH0pO1xuXG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uIChjdHJsKSB7IFxuICAgIHJldHVybiBbTmF2YmFyLCBtKCcuY29udGFpbmVyJywgW1tcbiAgICAgIG0oXCJoMlwiLCBcIlVzZXJcIiksXG4gICAgICBjdHJsLmVycm9yKCksXG4gICAgICBtKFwicFwiLCBjdHJsLnVzZXIoKS51c2VyLm5hbWUpLG0oXCJwXCIsIGN0cmwudXNlcigpLnVzZXIuZW1haWwpLFxuICAgICAgbShcInRhYmxlLnRhYmxlLnRhYmxlLWNvbmRlbnNlZC50YWJsZS1ib3JkZXJlZFwiLCBbXG4gICAgICAgIG0oXCJ0aGVhZFwiLCBbXG4gICAgICAgICAgbShcInRyXCIsIFtcbiAgICAgICAgICAgIG0oXCJ0aFwiLCBcIkN1c3RvbWVyXCIpLFxuICAgICAgICAgICAgbShcInRoXCIsIFwiQWdlbnRcIiksXG4gICAgICAgICAgICBtKFwidGhcIiwgXCJDcmVhdGlvbiBEYXRlXCIpLFxuICAgICAgICAgICAgbShcInRoXCIsIFwiRG9uZSBEYXRlXCIpLFxuICAgICAgICAgICAgbShcInRoXCIsIFwiU3RhdHVzXCIpLFxuICAgICAgICAgICAgbShcInRoXCIsIFwidHlwZVwiKSxcbiAgICAgICAgICBdKVxuICAgICAgICBdKSxcbiAgICAgICAgbShcInRib2R5XCIsIFtcbiAgICAgICAgICBtKFwidHJcIiwgW1xuICAgICAgICAgICAgbShcInRkXCIsIGN0cmwudXNlcigpLnVzZXIuY3VzdG9tZXJfbmFtZSksXG4gICAgICAgICAgICBtKFwidGRcIiwgY3RybC51c2VyKCkudXNlci5hZ2VudF9uYW1lKSxcbiAgICAgICAgICAgIG0oXCJ0ZFwiLCBjdHJsLnVzZXIoKS51c2VyLmNyZWF0ZWRfYXQpLFxuICAgICAgICAgICAgbShcInRkXCIsIGN0cmwudXNlcigpLnVzZXIuZG9uZV9kYXRlKSxcbiAgICAgICAgICAgIG0oXCJ0ZFwiLCBjdHJsLnVzZXIoKS51c2VyLnN0YXR1cyksXG4gICAgICAgICAgICBtKFwidGRcIiwgbShcInNwYW4ubGFiZWxcIiwgeyBjbGFzczogY3RybC51c2VyKCkudXNlci50eXBlID09IFwibG93XCIgPyBcImxhYmVsLWRlZmF1bHRcIiA6IGN0cmwudXNlcigpLnVzZXIudHlwZSA9PSBcIm1lZGl1bVwiID8gXCJsYWJlbC1wcmltYXJ5XCIgOiBcImxhYmVsLWRhbmdlclwiIH0sIGN0cmwudXNlcigpLnVzZXIudHlwZSkpXG4gICAgICAgICAgXSksXG5cbiAgICAgICAgXSlcbiAgICAgIF0pLFxuXG4gICAgICBjdHJsLnVzZXIoKS51c2VyLnN0YXR1cyA9PSAnY2xvc2VkJyA/IG0oXCJidXR0b24uYnRuLmJ0bi13YXJuaW5nXCIsIHsgb25jbGljazogY3RybC5vcGVuLmJpbmQoY3RybCwgJ29wZW5lZCcpIH0sIFwiT3BlbmVkXCIpIDpcbiAgICAgICAgbShcImJ1dHRvbi5idG4uYnRuLWRhbmdlclwiLCB7IG9uY2xpY2s6IGN0cmwub3Blbi5iaW5kKGN0cmwsICdjbG9zZWQnKSB9LCBcIkNsb3NlXCIpXG5cblxuXG4gICAgICAsbShcImJ1dHRvbi5idG4uYnRuLWRhbmdlclwiLCB7IG9uY2xpY2s6IGN0cmwuZGVsZXRlLmJpbmQoY3RybCkgfSwgXCJkZWxldGVcIilcblxuXG5cblxuICAgIF1dXG5cbiAgICApXTtcblxuICB9XG5cbn0iLCJcblxudmFyIE5hdmJhciA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvTmF2YmFyLmpzJyk7XG52YXIgbWMgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL0RhdGFUYWJsZS5qcycpO1xudmFyIEF1dGggPSByZXF1aXJlKCcuLi9tb2RlbHMvQXV0aC5qcycpO1xudmFyIFVzZXIgPSByZXF1aXJlKCcuLi9tb2RlbHMvVXNlci5qcycpO1xudmFyIFVzZXJQYWdlID0gcmVxdWlyZSgnLi4vcGFnZXMvVXNlclBhZ2UuanMnKTtcbnZhciBVc2VyRWRpdCA9IHJlcXVpcmUoJy4vVXNlckVkaXQuanMnKTtcblxudmFyIFVzZXJzID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY3RybCA9IHRoaXM7XG4gICAgY3RybC5wcmlvcmV0eUZyb21hdGU9ZnVuY3Rpb24odmFsdWUsIHJvdywgY29sLCBhdHRycyl7XG4gICAgICBpZiAodmFsdWUgPT0gJ2hpZ2gnKSBhdHRycy5jbGFzcyA9ICdsYWJlbCBsYWJlbC1kYW5nZXInO1xuICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfVxuICAgIHRoaXMuZGF0YXRhYmxlID0gbmV3IG1jLkRhdGF0YWJsZS5jb250cm9sbGVyKFxuICAgICAgLy8gQ29sdW1ucyBkZWZpbml0aW9uOlxuICAgICAgWyBcblxuICAgICAgICB7IGtleTogXCJuYW1lXCIsbGFiZWw6IFwiTmFtZVwiLCBzb3J0YWJsZTogdHJ1ZSB9LFxuICAgICAgICB7IGtleTogXCJlbWFpbFwiLGxhYmVsOiBcIkVtYWlsXCIsIHNvcnRhYmxlOiB0cnVlIH0sXG4gICAgICAgIHsga2V5OiBcInR5cGVcIixsYWJlbDogXCJUeXBlXCIsIHNvcnRhYmxlOiB0cnVlIH1cblxuXG4gICAgICBdLFxuICAgICAgLy8gT3RoZXIgY29uZmlndXJhdGlvbjpcbiAgICAgIHtcbiAgICAgICAgLy8gQWRkcmVzcyBvZiB0aGUgd2Vic2VydmVyIHN1cHBseWluZyB0aGUgZGF0YVxuICAgICAgICB1cmw6ICcvYXBpL3YxL3VzZXJzJyxcbiAgICAgICAgYXV0aG9yaXphdGlvbjogQXV0aC50b2tlbigpLFxuICAgICAgICAvLyBIYW5kbGVyIG9mIGNsaWNrIGV2ZW50IG9uIGRhdGEgY2VsbFxuICAgICAgICAvLyBJdCByZWNlaXZlcyB0aGUgcmVsZXZhbnQgaW5mb3JtYXRpb24gYWxyZWFkeSByZXNvbHZlZFxuICAgICAgICBvbkNlbGxDbGljazogZnVuY3Rpb24gKGNvbnRlbnQsIHJvdywgY29sKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coY29udGVudCwgcm93LCBjb2wpO1xuICAgICAgICAgICAgICAvLyBtLnJvdXRlKFwiL3VzZXJcIix7aWQ6cm93LmlkfSlcbiAgICAgICAgICAgICAgbS5yb3V0ZShcIi91c2VyRWRpdFwiLHtpZDpyb3cuaWR9KVxuICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICAgIFxuICB9LCBcblxuICB2aWV3OiBmdW5jdGlvbiAoY3RybCkge1xuICAgIHJldHVybiBbTmF2YmFyLCBtKCcuY29udGFpbmVyJywgW1xuICAgICAgbSgnaDEnLCAnVXNlcnMnKSxcbiAgICAgIG0oXCJhW2hyZWY9Jz8vdXNlckVkaXQnXVtjbGFzcz0nYnRuIGJ0bi1wcmltYXJ5IGZsb2F0LXJpZ2h0J11cIixcIk5ldyBVc2VyXCIpLFxuICAgICAgbWMuRGF0YXRhYmxlLnZpZXcoY3RybC5kYXRhdGFibGUsIHtcbiAgICAgICAgY2FwdGlvbjogJ3RoaXMgaXMgbXkgVXNlcnMnXG4gICAgICB9KVxuICAgIF0pXTtcbiAgfVxufTsiLCJcblxudmFyIE5hdmJhciA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvTmF2YmFyLmpzJyk7XG52YXIgQXV0aCA9IHJlcXVpcmUoJy4uL21vZGVscy9BdXRoLmpzJyk7XG5cbnZhciBWZXJpZnkgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKXtcbiAgICB2YXIgY3RybCA9IHRoaXM7XG4gICAgY3RybC5uYXZiYXIgPSBuZXcgTmF2YmFyLmNvbnRyb2xsZXIoKTtcbiAgICBjdHJsLm1lc3NhZ2UgPSBtLnByb3AoKTtcbiAgICBBdXRoLnZlcmlmeShtLnJvdXRlLnBhcmFtKFwiY29kZVwiKSkudGhlbihmdW5jdGlvbigpe1xuICAgICAgY3RybC5tZXNzYWdlKFtcbiAgICAgICAgJ1N3ZWV0LiBOb3csIHlvdSBjYW4gJyxcbiAgICAgICAgbSgnYVtocmVmPVwiL2xvZ2luXCJdJywge2NvbmZpZzogbS5yb3V0ZX0sICdsb2dpbicpLFxuICAgICAgICAnLidcbiAgICAgIF0pO1xuICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICBjdHJsLm1lc3NhZ2UoJ0htbSwgdGhlcmUgd2FzIHNvbWV0aGluZyB3cm9uZyB3aXRoIHRoYXQgY29kZS4gQ2hlY2sgeW91ciBlbWFpbCBhZ2Fpbi4nKTtcbiAgICB9KTtcbiAgfSxcbiAgXG4gIHZpZXc6IGZ1bmN0aW9uKGN0cmwpe1xuICAgIHJldHVybiBbTmF2YmFyLnZpZXcoY3RybC5uYXZiYXIpLCBtKCcuY29udGFpbmVyJywgW1xuICAgICAgbSgnaDEnLCAndmVyaWZ5JyksXG4gICAgICBjdHJsLm1lc3NhZ2UoKVxuICAgIF0pXTtcbiAgfVxufTsiXX0=
