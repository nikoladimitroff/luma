/*
  Copyright (C) 2013

  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.

  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:

  1. The origin of this software must not be misrepresented; you must not
     claim that you wrote the original software. If you use this software
     in a product, an acknowledgment in the product documentation would be
     appreciated but is not required.
  2. Altered source versions must be plainly marked as such, and must not be
     misrepresented as being the original software.
  3. This notice may not be removed or altered from any source distribution.
*/

// SIMD module.
var SIMD = {};

// private stuff.
var _PRIVATE = {}

_PRIVATE._f32x4 = new Float32Array(4);
_PRIVATE._f64x2 = new Float64Array(_PRIVATE._f32x4.buffer);
_PRIVATE._i32x4 = new Int32Array(_PRIVATE._f32x4.buffer);
_PRIVATE._i16x8 = new Int16Array(_PRIVATE._f32x4.buffer);
_PRIVATE._i8x16 = new Int8Array(_PRIVATE._f32x4.buffer);

_PRIVATE._f32x8 = new Float32Array(8);
_PRIVATE._f64x4 = new Float64Array(4);
_PRIVATE._i32x8 = new Int32Array(8);
_PRIVATE._i16x16 = new Int16Array(16);
_PRIVATE._i8x32 = new Int8Array(32);

if (typeof Math.fround != 'undefined') {
  _PRIVATE.truncatef32 = Math.fround;
} else {
  _PRIVATE._f32 = new Float32Array(1);

  _PRIVATE.truncatef32 = function(x) {
    _PRIVATE._f32[0] = x;
    return _PRIVATE._f32[0];
  }
}

_PRIVATE.minNum = function(x, y) {
    return x != x ? y :
           y != y ? x :
           Math.min(x, y);
}

_PRIVATE.maxNum = function(x, y) {
    return x != x ? y :
           y != y ? x :
           Math.max(x, y);
}

_PRIVATE.tobool = function(x) {
  return x < 0;
}

_PRIVATE.frombool = function(x) {
  return !x - 1;
}

function checkFloat32x4(t) {
  if (!(t instanceof SIMD.float32x4)) {
    throw new TypeError("argument is not a float32x4.");
  }
}

function checkFloat64x2(t) {
  if (!(t instanceof SIMD.float64x2)) {
    throw new TypeError("argument is not a float64x2.");
  }
}

function checkInt32x4(t) {
  if (!(t instanceof SIMD.int32x4)) {
    throw new TypeError("argument is not a int32x4.");
  }
}

function checkInt16x8(t) {
  if (!(t instanceof SIMD.int16x8)) {
    throw new TypeError("argument is not a int16x8.");
  }
}

function checkInt8x16(t) {
  if (!(t instanceof SIMD.int8x16)) {
    throw new TypeError("argument is not a int8x16.");
  }
}

// Save/Restore utilities for implementing bitwise conversions.

_PRIVATE.saveFloat64x2 = function(x) {
  checkFloat64x2(x);
  _PRIVATE._f64x2[0] = x.x_;
  _PRIVATE._f64x2[1] = x.y_;
}

_PRIVATE.saveFloat32x4 = function(x) {
  checkFloat32x4(x);
  _PRIVATE._f32x4[0] = x.x_;
  _PRIVATE._f32x4[1] = x.y_;
  _PRIVATE._f32x4[2] = x.z_;
  _PRIVATE._f32x4[3] = x.w_;
}

_PRIVATE.saveInt32x4 = function(x) {
  checkInt32x4(x);
  _PRIVATE._i32x4[0] = x.x_;
  _PRIVATE._i32x4[1] = x.y_;
  _PRIVATE._i32x4[2] = x.z_;
  _PRIVATE._i32x4[3] = x.w_;
}

_PRIVATE.saveInt16x8 = function(x) {
  checkInt16x8(x);
  _PRIVATE._i16x8[0] = x.s0_;
  _PRIVATE._i16x8[1] = x.s1_;
  _PRIVATE._i16x8[2] = x.s2_;
  _PRIVATE._i16x8[3] = x.s3_;
  _PRIVATE._i16x8[4] = x.s4_;
  _PRIVATE._i16x8[5] = x.s5_;
  _PRIVATE._i16x8[6] = x.s6_;
  _PRIVATE._i16x8[7] = x.s7_;
}

_PRIVATE.saveInt8x16 = function(x) {
  checkInt8x16(x);
  _PRIVATE._i8x16[0] = x.s0_;
  _PRIVATE._i8x16[1] = x.s1_;
  _PRIVATE._i8x16[2] = x.s2_;
  _PRIVATE._i8x16[3] = x.s3_;
  _PRIVATE._i8x16[4] = x.s4_;
  _PRIVATE._i8x16[5] = x.s5_;
  _PRIVATE._i8x16[6] = x.s6_;
  _PRIVATE._i8x16[7] = x.s7_;
  _PRIVATE._i8x16[8] = x.s8_;
  _PRIVATE._i8x16[9] = x.s9_;
  _PRIVATE._i8x16[10] = x.s10_;
  _PRIVATE._i8x16[11] = x.s11_;
  _PRIVATE._i8x16[12] = x.s12_;
  _PRIVATE._i8x16[13] = x.s13_;
  _PRIVATE._i8x16[14] = x.s14_;
  _PRIVATE._i8x16[15] = x.s15_;
}

_PRIVATE.restoreFloat64x2 = function() {
  var alias = _PRIVATE._f64x2;
  return SIMD.float64x2(alias[0], alias[1]);
}

_PRIVATE.restoreFloat32x4 = function() {
  var alias = _PRIVATE._f32x4;
  return SIMD.float32x4(alias[0], alias[1], alias[2], alias[3]);
}

_PRIVATE.restoreInt32x4 = function() {
  var alias = _PRIVATE._i32x4;
  return SIMD.int32x4(alias[0], alias[1], alias[2], alias[3]);
}

_PRIVATE.restoreInt16x8 = function() {
  var alias = _PRIVATE._i16x8;
  return SIMD.int16x8(alias[0], alias[1], alias[2], alias[3],
                      alias[4], alias[5], alias[6], alias[7]);
}

_PRIVATE.restoreInt8x16 = function() {
  var alias = _PRIVATE._i8x16;
  return SIMD.int8x16(alias[0], alias[1], alias[2], alias[3],
                      alias[4], alias[5], alias[6], alias[7],
                      alias[8], alias[9], alias[10], alias[11],
                      alias[12], alias[13], alias[14], alias[15]);
}

/**
  * Construct a new instance of float32x4 number.
  * @param {double} value used for x lane.
  * @param {double} value used for y lane.
  * @param {double} value used for z lane.
  * @param {double} value used for w lane.
  * @constructor
  */
SIMD.float32x4 = function(x, y, z, w) {
  if (arguments.length == 1) {
    checkFloat32x4(x);
    return x;
  }

  if (!(this instanceof SIMD.float32x4)) {
    return new SIMD.float32x4(x, y, z, w);
  }

  this.x_ = _PRIVATE.truncatef32(x);
  this.y_ = _PRIVATE.truncatef32(y);
  this.z_ = _PRIVATE.truncatef32(z);
  this.w_ = _PRIVATE.truncatef32(w);
}

/**
  * Construct a new instance of float32x4 number with the same value
  * in all lanes.
  * @param {double} value used for all lanes.
  * @constructor
  */
SIMD.float32x4.splat = function(s) {
  return SIMD.float32x4(s, s, s, s);
}

/**
  * @param {float64x2} t An instance of float64x2.
  * @return {float32x4} A float32x4 with .x and .y from t
  */
SIMD.float32x4.fromFloat64x2 = function(t) {
  checkFloat64x2(t);
  return SIMD.float32x4(t.x_, t.y_, 0, 0);
}

/**
  * @param {int32x4} t An instance of int32x4.
  * @return {float32x4} A float to integer conversion copy of t.
  */
SIMD.float32x4.fromInt32x4 = function(t) {
  checkInt32x4(t);
  return SIMD.float32x4(t.x_, t.y_, t.z_, t.w_);
}

/**
 * @param {float64x2} t An instance of float64x2.
 * @return {float32x4} a bit-wise copy of t as a float32x4.
 */
SIMD.float32x4.fromFloat64x2Bits = function(t) {
  _PRIVATE.saveFloat64x2(t);
  return _PRIVATE.restoreFloat32x4();
}

/**
 * @param {int32x4} t An instance of int32x4.
 * @return {float32x4} a bit-wise copy of t as a float32x4.
 */
SIMD.float32x4.fromInt32x4Bits = function(t) {
  _PRIVATE.saveInt32x4(t);
  return _PRIVATE.restoreFloat32x4();
}

/**
 * @param {int16x8} t An instance of int16x8.
 * @return {float32x4} a bit-wise copy of t as a float32x4.
 */
SIMD.float32x4.fromInt16x8Bits = function(t) {
  _PRIVATE.saveInt16x8(t);
  return _PRIVATE.restoreFloat32x4();
}

/**
 * @param {int8x16} t An instance of int8x16.
 * @return {float32x4} a bit-wise copy of t as a float32x4.
 */
SIMD.float32x4.fromInt8x16Bits = function(t) {
  _PRIVATE.saveInt8x16(t);
  return _PRIVATE.restoreFloat32x4();
}

/**
  * Construct a new instance of float64x2 number.
  * @param {double} value used for x lane.
  * @param {double} value used for y lane.
  * @constructor
  */
SIMD.float64x2 = function(x, y) {
  if (arguments.length == 1) {
    checkFloat64x2(x);
    return x;
  }

  if (!(this instanceof SIMD.float64x2)) {
    return new SIMD.float64x2(x, y);
  }

  // Use unary + to force coercion to Number.
  this.x_ = +x;
  this.y_ = +y;
}

/**
  * Construct a new instance of float64x2 number with the same value
  * in all lanes.
  * @param {double} value used for all lanes.
  * @constructor
  */
SIMD.float64x2.splat = function(s) {
  return SIMD.float64x2(s, s);
}

/**
  * @param {float32x4} t An instance of float32x4.
  * @return {float64x2} A float64x2 with .x and .y from t
  */
SIMD.float64x2.fromFloat32x4 = function(t) {
  checkFloat32x4(t);
  return SIMD.float64x2(t.x_, t.y_);
}

/**
  * @param {int32x4} t An instance of int32x4.
  * @return {float64x2} A float64x2 with .x and .y from t
  */
SIMD.float64x2.fromInt32x4 = function(t) {
  checkInt32x4(t);
  return SIMD.float64x2(t.x_, t.y_);
}

/**
 * @param {float32x4} t An instance of float32x4.
 * @return {float64x2} a bit-wise copy of t as a float64x2.
 */
SIMD.float64x2.fromFloat32x4Bits = function(t) {
  _PRIVATE.saveFloat32x4(t);
  return _PRIVATE.restoreFloat64x2();
}

/**
 * @param {int32x4} t An instance of int32x4.
 * @return {float64x2} a bit-wise copy of t as a float64x2.
 */
SIMD.float64x2.fromInt32x4Bits = function(t) {
  _PRIVATE.saveInt32x4(t);
  return _PRIVATE.restoreFloat64x2();
}

/**
 * @param {int16x8} t An instance of int16x8.
 * @return {float64x2} a bit-wise copy of t as a float64x2.
 */
SIMD.float64x2.fromInt16x8Bits = function(t) {
  _PRIVATE.saveInt16x8(t);
  return _PRIVATE.restoreFloat64x2();
}

/**
 * @param {int8x16} t An instance of int8x16.
 * @return {float64x2} a bit-wise copy of t as a float64x2.
 */
SIMD.float64x2.fromInt8x16Bits = function(t) {
  _PRIVATE.saveInt8x16(t);
  return _PRIVATE.restoreFloat64x2();
}

/**
  * Construct a new instance of int32x4 number.
  * @param {integer} 32-bit value used for x lane.
  * @param {integer} 32-bit value used for y lane.
  * @param {integer} 32-bit value used for z lane.
  * @param {integer} 32-bit value used for w lane.
  * @constructor
  */
SIMD.int32x4 = function(x, y, z, w) {
  if (arguments.length == 1) {
    checkInt32x4(x);
    return x;
  }

  if (!(this instanceof SIMD.int32x4)) {
    return new SIMD.int32x4(x, y, z, w);
  }

  this.x_ = x|0;
  this.y_ = y|0;
  this.z_ = z|0;
  this.w_ = w|0;
}

/**
  * Construct a new instance of int32x4 number with either true or false in each
  * lane, depending on the truth values in x, y, z, and w.
  * @param {boolean} flag used for x lane.
  * @param {boolean} flag used for y lane.
  * @param {boolean} flag used for z lane.
  * @param {boolean} flag used for w lane.
  * @constructor
  */
SIMD.int32x4.bool = function(x, y, z, w) {
  return SIMD.int32x4(_PRIVATE.frombool(x),
                      _PRIVATE.frombool(y),
                      _PRIVATE.frombool(z),
                      _PRIVATE.frombool(w));
}

/**
  * Construct a new instance of int32x4 number with the same value
  * in all lanes.
  * @param {integer} value used for all lanes.
  * @constructor
  */
SIMD.int32x4.splat = function(s) {
  return SIMD.int32x4(s, s, s, s);
}

/**
  * @param {float32x4} t An instance of float32x4.
  * @return {int32x4} with a integer to float conversion of t.
  */
SIMD.int32x4.fromFloat32x4 = function(t) {
  checkFloat32x4(t);
  return SIMD.int32x4(t.x_, t.y_, t.z_, t.w_);
}

/**
  * @param {float64x2} t An instance of float64x2.
  * @return {int32x4}  An int32x4 with .x and .y from t
  */
SIMD.int32x4.fromFloat64x2 = function(t) {
  checkFloat64x2(t);
  return SIMD.int32x4(t.x_, t.y_, 0, 0);
}

/**
  * @param {float32x4} t An instance of float32x4.
  * @return {int32x4} a bit-wise copy of t as a int32x4.
  */
SIMD.int32x4.fromFloat32x4Bits = function(t) {
  _PRIVATE.saveFloat32x4(t);
  return _PRIVATE.restoreInt32x4();
}

/**
 * @param {float64x2} t An instance of float64x2.
 * @return {int32x4} a bit-wise copy of t as an int32x4.
 */
SIMD.int32x4.fromFloat64x2Bits = function(t) {
  _PRIVATE.saveFloat64x2(t);
  return _PRIVATE.restoreInt32x4();
}

/**
  * @param {int16x8} t An instance of int16x8.
  * @return {int32x4} a bit-wise copy of t as a int32x4.
  */
SIMD.int32x4.fromInt16x8Bits = function(t) {
  _PRIVATE.saveInt16x8(t);
  return _PRIVATE.restoreInt32x4();
}

/**
  * @param {int8x16} t An instance of int8x16.
  * @return {int32x4} a bit-wise copy of t as a int32x4.
  */
SIMD.int32x4.fromInt8x16Bits = function(t) {
  _PRIVATE.saveInt8x16(t);
  return _PRIVATE.restoreInt32x4();
}

/**
  * Construct a new instance of int16x8 number.
  * @param {integer} 16-bit value used for s0 lane.
  * @param {integer} 16-bit value used for s1 lane.
  * @param {integer} 16-bit value used for s2 lane.
  * @param {integer} 16-bit value used for s3 lane.
  * @param {integer} 16-bit value used for s4 lane.
  * @param {integer} 16-bit value used for s5 lane.
  * @param {integer} 16-bit value used for s6 lane.
  * @param {integer} 16-bit value used for s7 lane.
  * @constructor
  */
SIMD.int16x8 = function(s0, s1, s2, s3, s4, s5, s6, s7) {
  if (arguments.length == 1) {
    checkInt16x8(s0);
    return s0;
  }

  if (!(this instanceof SIMD.int16x8)) {
    return new SIMD.int16x8(s0, s1, s2, s3, s4, s5, s6, s7);
  }

  this.s0_ = s0 << 16 >> 16;
  this.s1_ = s1 << 16 >> 16;
  this.s2_ = s2 << 16 >> 16;
  this.s3_ = s3 << 16 >> 16;
  this.s4_ = s4 << 16 >> 16;
  this.s5_ = s5 << 16 >> 16;
  this.s6_ = s6 << 16 >> 16;
  this.s7_ = s7 << 16 >> 16;
}

/**
  * Construct a new instance of int16x8 number with 0xFFFF or 0x0 in each
  * lane, depending on the truth value in s0, s1, s2, s3, s4, s5, s6, and s7.
  * @param {boolean} flag used for s0 lane.
  * @param {boolean} flag used for s1 lane.
  * @param {boolean} flag used for s2 lane.
  * @param {boolean} flag used for s3 lane.
  * @param {boolean} flag used for s4 lane.
  * @param {boolean} flag used for s5 lane.
  * @param {boolean} flag used for s6 lane.
  * @param {boolean} flag used for s7 lane.
  * @constructor
  */
SIMD.int16x8.bool = function(s0, s1, s2, s3, s4, s5, s6, s7) {
  return SIMD.int16x8(s0 ? -1 : 0x0,
                      s1 ? -1 : 0x0,
                      s2 ? -1 : 0x0,
                      s3 ? -1 : 0x0,
                      s4 ? -1 : 0x0,
                      s5 ? -1 : 0x0,
                      s6 ? -1 : 0x0,
                      s7 ? -1 : 0x0);
}

/**
  * Construct a new instance of int16x8 number with the same value
  * in all lanes.
  * @param {integer} value used for all lanes.
  * @constructor
  */
SIMD.int16x8.splat = function(s) {
  return SIMD.int16x8(s, s, s, s, s, s, s, s);
}

/**
  * @param {float32x4} t An instance of float32x4.
  * @return {int16x8} a bit-wise copy of t as a int16x8.
  */
SIMD.int16x8.fromFloat32x4Bits = function(t) {
  _PRIVATE.saveFloat32x4(t);
  return _PRIVATE.restoreInt16x8();
}

/**
 * @param {float64x2} t An instance of float64x2.
 * @return {int16x8} a bit-wise copy of t as an int16x8.
 */
SIMD.int16x8.fromFloat64x2Bits = function(t) {
  _PRIVATE.saveFloat64x2(t);
  return _PRIVATE.restoreInt16x8();
}

/**
  * @param {int32x4} t An instance of int32x4.
  * @return {int16x8} a bit-wise copy of t as a int16x8.
  */
SIMD.int16x8.fromInt32x4Bits = function(t) {
  _PRIVATE.saveInt32x4(t);
  return _PRIVATE.restoreInt16x8();
}

/**
  * @param {int8x16} t An instance of int8x16.
  * @return {int16x8} a bit-wise copy of t as a int16x8.
  */
SIMD.int16x8.fromInt8x16Bits = function(t) {
  _PRIVATE.saveInt8x16(t);
  return _PRIVATE.restoreInt16x8();
}

/**
  * Construct a new instance of int8x16 number.
  * @param {integer} 8-bit value used for s0 lane.
  * @param {integer} 8-bit value used for s1 lane.
  * @param {integer} 8-bit value used for s2 lane.
  * @param {integer} 8-bit value used for s3 lane.
  * @param {integer} 8-bit value used for s4 lane.
  * @param {integer} 8-bit value used for s5 lane.
  * @param {integer} 8-bit value used for s6 lane.
  * @param {integer} 8-bit value used for s7 lane.
  * @param {integer} 8-bit value used for s8 lane.
  * @param {integer} 8-bit value used for s9 lane.
  * @param {integer} 8-bit value used for s10 lane.
  * @param {integer} 8-bit value used for s11 lane.
  * @param {integer} 8-bit value used for s12 lane.
  * @param {integer} 8-bit value used for s13 lane.
  * @param {integer} 8-bit value used for s14 lane.
  * @param {integer} 8-bit value used for s15 lane.
  * @constructor
  */
SIMD.int8x16 = function(s0, s1, s2, s3, s4, s5, s6, s7,
                        s8, s9, s10, s11, s12, s13, s14, s15) {
  if (arguments.length == 1) {
    checkInt8x16(s0);
    return s0;
  }

  if (!(this instanceof SIMD.int8x16)) {
    return new SIMD.int8x16(s0, s1, s2, s3, s4, s5, s6, s7,
                            s8, s9, s10, s11, s12, s13, s14, s15);
  }

  this.s0_ = s0 << 24 >> 24;
  this.s1_ = s1 << 24 >> 24;
  this.s2_ = s2 << 24 >> 24;
  this.s3_ = s3 << 24 >> 24;
  this.s4_ = s4 << 24 >> 24;
  this.s5_ = s5 << 24 >> 24;
  this.s6_ = s6 << 24 >> 24;
  this.s7_ = s7 << 24 >> 24;
  this.s8_ = s8 << 24 >> 24;
  this.s9_ = s9 << 24 >> 24;
  this.s10_ = s10 << 24 >> 24;
  this.s11_ = s11 << 24 >> 24;
  this.s12_ = s12 << 24 >> 24;
  this.s13_ = s13 << 24 >> 24;
  this.s14_ = s14 << 24 >> 24;
  this.s15_ = s15 << 24 >> 24;
}

/**
  * Construct a new instance of int8x16 number with 0xFF or 0x0 in each
  * lane, depending on the truth value in s0, s1, s2, s3, s4, s5, s6, s7,
  * s8, s9, s10, s11, s12, s13, s14, and s15.
  * @param {boolean} flag used for s0 lane.
  * @param {boolean} flag used for s1 lane.
  * @param {boolean} flag used for s2 lane.
  * @param {boolean} flag used for s3 lane.
  * @param {boolean} flag used for s4 lane.
  * @param {boolean} flag used for s5 lane.
  * @param {boolean} flag used for s6 lane.
  * @param {boolean} flag used for s7 lane.
  * @param {boolean} flag used for s8 lane.
  * @param {boolean} flag used for s9 lane.
  * @param {boolean} flag used for s10 lane.
  * @param {boolean} flag used for s11 lane.
  * @param {boolean} flag used for s12 lane.
  * @param {boolean} flag used for s13 lane.
  * @param {boolean} flag used for s14 lane.
  * @param {boolean} flag used for s15 lane.
  * @constructor
  */
SIMD.int8x16.bool = function(s0, s1, s2, s3, s4, s5, s6, s7,
                             s8, s9, s10, s11, s12, s13, s14, s15) {
  return SIMD.int8x16(s0 ? -1 : 0x0,
                      s1 ? -1 : 0x0,
                      s2 ? -1 : 0x0,
                      s3 ? -1 : 0x0,
                      s4 ? -1 : 0x0,
                      s5 ? -1 : 0x0,
                      s6 ? -1 : 0x0,
                      s7 ? -1 : 0x0,
                      s8 ? -1 : 0x0,
                      s9 ? -1 : 0x0,
                      s10 ? -1 : 0x0,
                      s11 ? -1 : 0x0,
                      s12 ? -1 : 0x0,
                      s13 ? -1 : 0x0,
                      s14 ? -1 : 0x0,
                      s15 ? -1 : 0x0);
}

/**
  * Construct a new instance of int8x16 number with the same value
  * in all lanes.
  * @param {integer} value used for all lanes.
  * @constructor
  */
SIMD.int8x16.splat = function(s) {
  return SIMD.int8x16(s, s, s, s, s, s, s, s,
                      s, s, s, s, s, s, s, s);
}

/**
  * @param {float32x4} t An instance of float32x4.
  * @return {int8x16} a bit-wise copy of t as a int8x16.
  */
SIMD.int8x16.fromFloat32x4Bits = function(t) {
  _PRIVATE.saveFloat32x4(t);
  return _PRIVATE.restoreInt8x16();
}

/**
 * @param {float64x2} t An instance of float64x2.
 * @return {int8x16} a bit-wise copy of t as an int8x16.
 */
SIMD.int8x16.fromFloat64x2Bits = function(t) {
  _PRIVATE.saveFloat64x2(t);
  return _PRIVATE.restoreInt8x16();
}

/**
  * @param {int32x4} t An instance of int32x4.
  * @return {int8x16} a bit-wise copy of t as a int8x16.
  */
SIMD.int8x16.fromInt32x4Bits = function(t) {
  _PRIVATE.saveInt32x4(t);
  return _PRIVATE.restoreInt8x16();
}

/**
  * @param {int16x8} t An instance of int16x8.
  * @return {int8x16} a bit-wise copy of t as a int8x16.
  */
SIMD.int8x16.fromInt16x8Bits = function(t) {
  _PRIVATE.saveInt16x8(t);
  return _PRIVATE.restoreInt8x16();
}

/**
  * @param {float32x4} t An instance of float32x4.
  * @return {float32x4} New instance of float32x4 with absolute values of
  * t.
  */
SIMD.float32x4.abs = function(t) {
  checkFloat32x4(t);
  return SIMD.float32x4(Math.abs(t.x), Math.abs(t.y), Math.abs(t.z),
                        Math.abs(t.w));
}

/**
  * @param {float32x4} t An instance of float32x4.
  * @return {float32x4} New instance of float32x4 with negated values of
  * t.
  */
SIMD.float32x4.neg = function(t) {
  checkFloat32x4(t);
  return SIMD.float32x4(-t.x, -t.y, -t.z, -t.w);
}

/**
  * @param {float32x4} a An instance of float32x4.
  * @param {float32x4} b An instance of float32x4.
  * @return {float32x4} New instance of float32x4 with a + b.
  */
SIMD.float32x4.add = function(a, b) {
  checkFloat32x4(a);
  checkFloat32x4(b);
  return SIMD.float32x4(a.x + b.x, a.y + b.y, a.z + b.z, a.w + b.w);
}

/**
  * @param {float32x4} a An instance of float32x4.
  * @param {float32x4} b An instance of float32x4.
  * @return {float32x4} New instance of float32x4 with a - b.
  */
SIMD.float32x4.sub = function(a, b) {
  checkFloat32x4(a);
  checkFloat32x4(b);
  return SIMD.float32x4(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w);
}

/**
  * @param {float32x4} a An instance of float32x4.
  * @param {float32x4} b An instance of float32x4.
  * @return {float32x4} New instance of float32x4 with a * b.
  */
SIMD.float32x4.mul = function(a, b) {
  checkFloat32x4(a);
  checkFloat32x4(b);
  return SIMD.float32x4(a.x * b.x, a.y * b.y, a.z * b.z, a.w * b.w);
}

/**
  * @param {float32x4} a An instance of float32x4.
  * @param {float32x4} b An instance of float32x4.
  * @return {float32x4} New instance of float32x4 with a / b.
  */
SIMD.float32x4.div = function(a, b) {
  checkFloat32x4(a);
  checkFloat32x4(b);
  return SIMD.float32x4(a.x / b.x, a.y / b.y, a.z / b.z, a.w / b.w);
}

/**
  * @param {float32x4} t An instance of float32x4.
  * @param {float32x4} lowerLimit An instance of float32x4.
  * @param {float32x4} upperLimit An instance of float32x4.
  * @return {float32x4} New instance of float32x4 with t's values clamped
  * between lowerLimit and upperLimit.
  */
SIMD.float32x4.clamp = function(t, lowerLimit, upperLimit) {
  checkFloat32x4(t);
  checkFloat32x4(lowerLimit);
  checkFloat32x4(upperLimit);
  var cx = t.x < lowerLimit.x ? lowerLimit.x : t.x;
  var cy = t.y < lowerLimit.y ? lowerLimit.y : t.y;
  var cz = t.z < lowerLimit.z ? lowerLimit.z : t.z;
  var cw = t.w < lowerLimit.w ? lowerLimit.w : t.w;
  cx = cx > upperLimit.x ? upperLimit.x : cx;
  cy = cy > upperLimit.y ? upperLimit.y : cy;
  cz = cz > upperLimit.z ? upperLimit.z : cz;
  cw = cw > upperLimit.w ? upperLimit.w : cw;
  return SIMD.float32x4(cx, cy, cz, cw);
}

/**
  * @param {float32x4} t An instance of float32x4.
  * @param {float32x4} other An instance of float32x4.
  * @return {float32x4} New instance of float32x4 with the minimum value of
  * t and other.
  */
SIMD.float32x4.min = function(t, other) {
  checkFloat32x4(t);
  checkFloat32x4(other);
  var cx = Math.min(t.x, other.x);
  var cy = Math.min(t.y, other.y);
  var cz = Math.min(t.z, other.z);
  var cw = Math.min(t.w, other.w);
  return SIMD.float32x4(cx, cy, cz, cw);
}

/**
  * @param {float32x4} t An instance of float32x4.
  * @param {float32x4} other An instance of float32x4.
  * @return {float32x4} New instance of float32x4 with the maximum value of
  * t and other.
  */
SIMD.float32x4.max = function(t, other) {
  checkFloat32x4(t);
  checkFloat32x4(other);
  var cx = Math.max(t.x, other.x);
  var cy = Math.max(t.y, other.y);
  var cz = Math.max(t.z, other.z);
  var cw = Math.max(t.w, other.w);
  return SIMD.float32x4(cx, cy, cz, cw);
}

/**
  * @param {float32x4} t An instance of float32x4.
  * @param {float32x4} other An instance of float32x4.
  * @return {float32x4} New instance of float32x4 with the minimum value of
  * t and other, preferring numbers over NaNs.
  */
SIMD.float32x4.minNum = function(t, other) {
  checkFloat32x4(t);
  checkFloat32x4(other);
  var cx = _PRIVATE.minNum(t.x, other.x);
  var cy = _PRIVATE.minNum(t.y, other.y);
  var cz = _PRIVATE.minNum(t.z, other.z);
  var cw = _PRIVATE.minNum(t.w, other.w);
  return SIMD.float32x4(cx, cy, cz, cw);
}

/**
  * @param {float32x4} t An instance of float32x4.
  * @param {float32x4} other An instance of float32x4.
  * @return {float32x4} New instance of float32x4 with the maximum value of
  * t and other, preferring numbers over NaNs.
  */
SIMD.float32x4.maxNum = function(t, other) {
  checkFloat32x4(t);
  checkFloat32x4(other);
  var cx = _PRIVATE.maxNum(t.x, other.x);
  var cy = _PRIVATE.maxNum(t.y, other.y);
  var cz = _PRIVATE.maxNum(t.z, other.z);
  var cw = _PRIVATE.maxNum(t.w, other.w);
  return SIMD.float32x4(cx, cy, cz, cw);
}

/**
  * @param {float32x4} t An instance of float32x4.
  * @return {float32x4} New instance of float32x4 with reciprocal value of
  * t.
  */
SIMD.float32x4.reciprocal = function(t) {
  checkFloat32x4(t);
  return SIMD.float32x4(1.0 / t.x, 1.0 / t.y, 1.0 / t.z, 1.0 / t.w);
}

/**
  * @param {float32x4} t An instance of float32x4.
  * @return {float32x4} New instance of float32x4 with square root of the
  * reciprocal value of t.
  */
SIMD.float32x4.reciprocalSqrt = function(t) {
  checkFloat32x4(t);
  return SIMD.float32x4(Math.sqrt(1.0 / t.x), Math.sqrt(1.0 / t.y),
                        Math.sqrt(1.0 / t.z), Math.sqrt(1.0 / t.w));
}

/**
  * @param {float32x4} t An instance of float32x4.
  * @return {float32x4} New instance of float32x4 with square root of
  * values of t.
  */
SIMD.float32x4.sqrt = function(t) {
  checkFloat32x4(t);
  return SIMD.float32x4(Math.sqrt(t.x), Math.sqrt(t.y),
                        Math.sqrt(t.z), Math.sqrt(t.w));
}

/**
  * @param {float32x4} t An instance of float32x4 to be swizzled.
  * @param {integer} x - Index in t for lane x
  * @param {integer} y - Index in t for lane y
  * @param {integer} z - Index in t for lane z
  * @param {integer} w - Index in t for lane w
  * @return {float32x4} New instance of float32x4 with lanes swizzled.
  */
SIMD.float32x4.swizzle = function(t, x, y, z, w) {
  checkFloat32x4(t);
  _PRIVATE._f32x4[0] = t.x_;
  _PRIVATE._f32x4[1] = t.y_;
  _PRIVATE._f32x4[2] = t.z_;
  _PRIVATE._f32x4[3] = t.w_;
  var storage = _PRIVATE._f32x4;
  return SIMD.float32x4(storage[x], storage[y], storage[z], storage[w]);
}

/**
  * @param {float32x4} t1 An instance of float32x4 to be shuffled.
  * @param {float32x4} t2 An instance of float32x4 to be shuffled.
  * @param {integer} x - Index in concatenation of t1 and t2 for lane x
  * @param {integer} y - Index in concatenation of t1 and t2 for lane y
  * @param {integer} z - Index in concatenation of t1 and t2 for lane z
  * @param {integer} w - Index in concatenation of t1 and t2 for lane w
  * @return {float32x4} New instance of float32x4 with lanes shuffled.
  */
SIMD.float32x4.shuffle = function(t1, t2, x, y, z, w) {
  checkFloat32x4(t1);
  checkFloat32x4(t2);
  var storage = _PRIVATE._f32x8;
  storage[0] = t1.x_;
  storage[1] = t1.y_;
  storage[2] = t1.z_;
  storage[3] = t1.w_;
  storage[4] = t2.x_;
  storage[5] = t2.y_;
  storage[6] = t2.z_;
  storage[7] = t2.w_;
  return SIMD.float32x4(storage[x], storage[y], storage[z], storage[w]);
}

/**
  * @param {float32x4} t An instance of float32x4.
  * @param {double} value used for x lane.
  * @return {float32x4} New instance of float32x4 with the values in t and
  * x replaced with {x}.
  */
SIMD.float32x4.withX = function(t, x) {
  checkFloat32x4(t);
  return SIMD.float32x4(x, t.y, t.z, t.w);
}

/**
  * @param {float32x4} t An instance of float32x4.
  * @param {double} value used for y lane.
  * @return {float32x4} New instance of float32x4 with the values in t and
  * y replaced with {y}.
  */
SIMD.float32x4.withY = function(t, y) {
  checkFloat32x4(t);
  return SIMD.float32x4(t.x, y, t.z, t.w);
}

/**
  * @param {float32x4} t An instance of float32x4.
  * @param {double} value used for z lane.
  * @return {float32x4} New instance of float32x4 with the values in t and
  * z replaced with {z}.
  */
SIMD.float32x4.withZ = function(t, z) {
  checkFloat32x4(t);
  return SIMD.float32x4(t.x, t.y, z, t.w);
}

/**
  * @param {float32x4} t An instance of float32x4.
  * @param {double} value used for w lane.
  * @return {float32x4} New instance of float32x4 with the values in t and
  * w replaced with {w}.
  */
SIMD.float32x4.withW = function(t, w) {
  checkFloat32x4(t);
  return SIMD.float32x4(t.x, t.y, t.z, w);
}

/**
  * @param {float32x4} t An instance of float32x4.
  * @param {float32x4} other An instance of float32x4.
  * @return {int32x4} true or false in each lane depending on
  * the result of t < other.
  */
SIMD.float32x4.lessThan = function(t, other) {
  checkFloat32x4(t);
  checkFloat32x4(other);
  var cx = t.x < other.x;
  var cy = t.y < other.y;
  var cz = t.z < other.z;
  var cw = t.w < other.w;
  return SIMD.int32x4.bool(cx, cy, cz, cw);
}

/**
  * @param {float32x4} t An instance of float32x4.
  * @param {float32x4} other An instance of float32x4.
  * @return {int32x4} true or false in each lane depending on
  * the result of t <= other.
  */
SIMD.float32x4.lessThanOrEqual = function(t, other) {
  checkFloat32x4(t);
  checkFloat32x4(other);
  var cx = t.x <= other.x;
  var cy = t.y <= other.y;
  var cz = t.z <= other.z;
  var cw = t.w <= other.w;
  return SIMD.int32x4.bool(cx, cy, cz, cw);
}

/**
  * @param {float32x4} t An instance of float32x4.
  * @param {float32x4} other An instance of float32x4.
  * @return {int32x4} true or false in each lane depending on
  * the result of t == other.
  */
SIMD.float32x4.equal = function(t, other) {
  checkFloat32x4(t);
  checkFloat32x4(other);
  var cx = t.x == other.x;
  var cy = t.y == other.y;
  var cz = t.z == other.z;
  var cw = t.w == other.w;
  return SIMD.int32x4.bool(cx, cy, cz, cw);
}

/**
  * @param {float32x4} t An instance of float32x4.
  * @param {float32x4} other An instance of float32x4.
  * @return {int32x4} true or false in each lane depending on
  * the result of t != other.
  */
SIMD.float32x4.notEqual = function(t, other) {
  checkFloat32x4(t);
  checkFloat32x4(other);
  var cx = t.x != other.x;
  var cy = t.y != other.y;
  var cz = t.z != other.z;
  var cw = t.w != other.w;
  return SIMD.int32x4.bool(cx, cy, cz, cw);
}

/**
  * @param {float32x4} t An instance of float32x4.
  * @param {float32x4} other An instance of float32x4.
  * @return {int32x4} true or false in each lane depending on
  * the result of t >= other.
  */
SIMD.float32x4.greaterThanOrEqual = function(t, other) {
  checkFloat32x4(t);
  checkFloat32x4(other);
  var cx = t.x >= other.x;
  var cy = t.y >= other.y;
  var cz = t.z >= other.z;
  var cw = t.w >= other.w;
  return SIMD.int32x4.bool(cx, cy, cz, cw);
}

/**
  * @param {float32x4} t An instance of float32x4.
  * @param {float32x4} other An instance of float32x4.
  * @return {int32x4} true or false in each lane depending on
  * the result of t > other.
  */
SIMD.float32x4.greaterThan = function(t, other) {
  checkFloat32x4(t);
  checkFloat32x4(other);
  var cx = t.x > other.x;
  var cy = t.y > other.y;
  var cz = t.z > other.z;
  var cw = t.w > other.w;
  return SIMD.int32x4.bool(cx, cy, cz, cw);
}

/**
  * @param {int32x4} t Selector mask. An instance of int32x4
  * @param {float32x4} trueValue Pick lane from here if corresponding
  * selector lane is true
  * @param {float32x4} falseValue Pick lane from here if corresponding
  * selector lane is false
  * @return {float32x4} Mix of lanes from trueValue or falseValue as
  * indicated
  */
SIMD.float32x4.select = function(t, trueValue, falseValue) {
  checkInt32x4(t);
  checkFloat32x4(trueValue);
  checkFloat32x4(falseValue);
  return SIMD.float32x4(_PRIVATE.tobool(t.x) ? trueValue.x : falseValue.x,
                        _PRIVATE.tobool(t.y) ? trueValue.y : falseValue.y,
                        _PRIVATE.tobool(t.z) ? trueValue.z : falseValue.z,
                        _PRIVATE.tobool(t.w) ? trueValue.w : falseValue.w);
}

/**
  * @param {int32x4} t Selector mask. An instance of int32x4
  * @param {float32x4} trueValue Pick bit from here if corresponding
  * selector bit is 1
  * @param {float32x4} falseValue Pick bit from here if corresponding
  * selector bit is 0
  * @return {float32x4} Mix of bits from trueValue or falseValue as
  * indicated
  */
SIMD.float32x4.bitselect = function(t, trueValue, falseValue) {
  checkInt32x4(t);
  checkFloat32x4(trueValue);
  checkFloat32x4(falseValue);
  var tv = SIMD.int32x4.fromFloat32x4Bits(trueValue);
  var fv = SIMD.int32x4.fromFloat32x4Bits(falseValue);
  var tr = SIMD.int32x4.and(t, tv);
  var fr = SIMD.int32x4.and(SIMD.int32x4.not(t), fv);
  return SIMD.float32x4.fromInt32x4Bits(SIMD.int32x4.or(tr, fr));
}

/**
  * @param {float32x4} a An instance of float32x4.
  * @param {float32x4} b An instance of float32x4.
  * @return {float32x4} New instance of float32x4 with values of a & b.
  */
SIMD.float32x4.and = function(a, b) {
  checkFloat32x4(a);
  checkFloat32x4(b);
  var aInt = SIMD.int32x4.fromFloat32x4Bits(a);
  var bInt = SIMD.int32x4.fromFloat32x4Bits(b);
  return SIMD.float32x4.fromInt32x4Bits(SIMD.int32x4.and(aInt, bInt));
}

/**
  * @param {float32x4} a An instance of float32x4.
  * @param {float32x4} b An instance of float32x4.
  * @return {float32x4} New instance of float32x4 with values of a | b.
  */
SIMD.float32x4.or = function(a, b) {
  checkFloat32x4(a);
  checkFloat32x4(b);
  var aInt = SIMD.int32x4.fromFloat32x4Bits(a);
  var bInt = SIMD.int32x4.fromFloat32x4Bits(b);
  return SIMD.float32x4.fromInt32x4Bits(SIMD.int32x4.or(aInt, bInt));
}

/**
  * @param {float32x4} a An instance of float32x4.
  * @param {float32x4} b An instance of float32x4.
  * @return {float32x4} New instance of float32x4 with values of a ^ b.
  */
SIMD.float32x4.xor = function(a, b) {
  checkFloat32x4(a);
  checkFloat32x4(b);
  var aInt = SIMD.int32x4.fromFloat32x4Bits(a);
  var bInt = SIMD.int32x4.fromFloat32x4Bits(b);
  return SIMD.float32x4.fromInt32x4Bits(SIMD.int32x4.xor(aInt, bInt));
}

/**
  * @param {float32x4} a An instance of float32x4.
  * @return {float32x4} New instance of float32x4 with values of ~a.
  */
SIMD.float32x4.not = function(a) {
  checkFloat32x4(a);
  var aInt = SIMD.int32x4.fromFloat32x4Bits(a);
  return SIMD.float32x4.fromInt32x4Bits(SIMD.int32x4.not(aInt));
}

/**
  * @param {Typed array} tarray An instance of a typed array.
  * @param {Number} index An instance of Number.
  * @return {float32x4} New instance of float32x4.
  */
SIMD.float32x4.load = function(tarray, index) {
  if (!isTypedArray(tarray))
    throw new TypeError("The 1st argument must be a typed array.");
  if (!isNumber(index))
    throw new TypeError("The 2nd argument must be a Number.");
  var bpe = tarray.BYTES_PER_ELEMENT;
  if (index < 0 || (index * bpe + 16) > tarray.byteLength)
    throw new RangeError("The value of index is invalid.");
  var array = bpe == 1 ? _PRIVATE._i8x16 :
              bpe == 2 ? _PRIVATE._i16x8 :
              bpe == 4 ? (tarray instanceof Float32Array ? _PRIVATE._f32x4 : _PRIVATE._i32x4) :
              _PRIVATE._f64x2;
  var n = 16 / bpe;
  for (var i = 0; i < n; ++i)
    array[i] = tarray[index + i];
  var f32temp = _PRIVATE._f32x4;
  return new SIMD.float32x4(f32temp[0], f32temp[1], f32temp[2], f32temp[3]);
}

/**
  * @param {Typed array} tarray An instance of a typed array.
  * @param {Number} index An instance of Number.
  * @return {float32x4} New instance of float32x4.
  */
SIMD.float32x4.loadX = function(tarray, index) {
  if (!isTypedArray(tarray))
    throw new TypeError("The 1st argument must be a typed array.");
  if (!isNumber(index))
    throw new TypeError("The 2nd argument must be a Number.");
  var bpe = tarray.BYTES_PER_ELEMENT;
  if (index < 0 || (index * bpe + 4) > tarray.byteLength)
    throw new RangeError("The value of index is invalid.");
  var array = bpe == 1 ? _PRIVATE._i8x16 :
              bpe == 2 ? _PRIVATE._i16x8 :
              bpe == 4 ? (tarray instanceof Float32Array ? _PRIVATE._f32x4 : _PRIVATE._i32x4) :
              _PRIVATE._f64x2;
  var n = 4 / bpe;
  for (var i = 0; i < n; ++i)
    array[i] = tarray[index + i];
  var f32temp = _PRIVATE._f32x4;
  return new SIMD.float32x4(f32temp[0], 0.0, 0.0, 0.0);
}

/**
  * @param {Typed array} tarray An instance of a typed array.
  * @param {Number} index An instance of Number.
  * @return {float32x4} New instance of float32x4.
  */
SIMD.float32x4.loadXY = function(tarray, index) {
  if (!isTypedArray(tarray))
    throw new TypeError("The 1st argument must be a typed array.");
  if (!isNumber(index))
    throw new TypeError("The 2nd argument must be a Number.");
  var bpe = tarray.BYTES_PER_ELEMENT;
  if (index < 0 || (index * bpe + 8) > tarray.byteLength)
    throw new RangeError("The value of index is invalid.");
  var array = bpe == 1 ? _PRIVATE._i8x16 :
              bpe == 2 ? _PRIVATE._i16x8 :
              bpe == 4 ? (tarray instanceof Float32Array ? _PRIVATE._f32x4 : _PRIVATE._i32x4) :
              _PRIVATE._f64x2;
  var n = 8 / bpe;
  for (var i = 0; i < n; ++i)
    array[i] = tarray[index + i];
  var f32temp = _PRIVATE._f32x4;
  return new SIMD.float32x4(f32temp[0], f32temp[1], 0.0, 0.0);
}

/**
  * @param {Typed array} tarray An instance of a typed array.
  * @param {Number} index An instance of Number.
  * @return {float32x4} New instance of float32x4.
  */
SIMD.float32x4.loadXYZ = function(tarray, index) {
  if (!isTypedArray(tarray))
    throw new TypeError("The 1st argument must be a typed array.");
  if (!isNumber(index))
    throw new TypeError("The 2nd argument must be a Number.");
  var bpe = tarray.BYTES_PER_ELEMENT;
  if (index < 0 || (index * bpe + 12) > tarray.byteLength)
    throw new RangeError("The value of index is invalid.");
  var array = bpe == 1 ? _PRIVATE._i8x16 :
              bpe == 2 ? _PRIVATE._i16x8 :
              bpe == 4 ? (tarray instanceof Float32Array ? _PRIVATE._f32x4 : _PRIVATE._i32x4) :
              _PRIVATE._f64x2;
  var n = 12 / bpe;
  for (var i = 0; i < n; ++i)
    array[i] = tarray[index + i];
  var f32temp = _PRIVATE._f32x4;
  return new SIMD.float32x4(f32temp[0], f32temp[1], f32temp[2], 0.0);
}

/**
  * @param {Typed array} tarray An instance of a typed array.
  * @param {Number} index An instance of Number.
  * @param {float32x4} value An instance of float32x4.
  * @return {void}
  */
SIMD.float32x4.store = function(tarray, index, value) {
  if (!isTypedArray(tarray))
    throw new TypeError("The 1st argument must be a typed array.");
  if (!isNumber(index))
    throw new TypeError("The 2nd argument must be a Number.");
  var bpe = tarray.BYTES_PER_ELEMENT;
  if (index < 0 || (index * bpe + 16) > tarray.byteLength)
    throw new RangeError("The value of index is invalid.");
  checkFloat32x4(value);
  _PRIVATE._f32x4[0] = value.x;
  _PRIVATE._f32x4[1] = value.y;
  _PRIVATE._f32x4[2] = value.z;
  _PRIVATE._f32x4[3] = value.w;
  var array = bpe == 1 ? _PRIVATE._i8x16 :
              bpe == 2 ? _PRIVATE._i16x8 :
              bpe == 4 ? (tarray instanceof Float32Array ? _PRIVATE._f32x4 : _PRIVATE._i32x4) :
              _PRIVATE._f64x2;
  var n = 16 / bpe;
  for (var i = 0; i < n; ++i)
    tarray[index + i] = array[i];
}

/**
  * @param {Typed array} tarray An instance of a typed array.
  * @param {Number} index An instance of Number.
  * @param {float32x4} value An instance of float32x4.
  * @return {void}
  */
SIMD.float32x4.storeX = function(tarray, index, value) {
  if (!isTypedArray(tarray))
    throw new TypeError("The 1st argument must be a typed array.");
  if (!isNumber(index))
    throw new TypeError("The 2nd argument must be a Number.");
  var bpe = tarray.BYTES_PER_ELEMENT;
  if (index < 0 || (index * bpe + 4) > tarray.byteLength)
    throw new RangeError("The value of index is invalid.");
  checkFloat32x4(value);
  if (bpe == 8) {
    // tarray's elements are too wide. Just create a new view; this is rare.
    var view = new Float32Array(tarray.buffer, tarray.byteOffset + index * 8, 1);
    view[0] = value.x;
  } else {
    _PRIVATE._f32x4[0] = value.x;
    var array = bpe == 1 ? _PRIVATE._i8x16 :
                bpe == 2 ? _PRIVATE._i16x8 :
                (tarray instanceof Float32Array ? _PRIVATE._f32x4 : _PRIVATE._i32x4);
    var n = 4 / bpe;
    for (var i = 0; i < n; ++i)
      tarray[index + i] = array[i];
  }
}

/**
  * @param {Typed array} tarray An instance of a typed array.
  * @param {Number} index An instance of Number.
  * @param {float32x4} value An instance of float32x4.
  * @return {void}
  */
SIMD.float32x4.storeXY = function(tarray, index, value) {
  if (!isTypedArray(tarray))
    throw new TypeError("The 1st argument must be a typed array.");
  if (!isNumber(index))
    throw new TypeError("The 2nd argument must be a Number.");
  var bpe = tarray.BYTES_PER_ELEMENT;
  if (index < 0 || (index * bpe + 8) > tarray.byteLength)
    throw new RangeError("The value of index is invalid.");
  checkFloat32x4(value);
  _PRIVATE._f32x4[0] = value.x;
  _PRIVATE._f32x4[1] = value.y;
  var array = bpe == 1 ? _PRIVATE._i8x16 :
              bpe == 2 ? _PRIVATE._i16x8 :
              bpe == 4 ? (tarray instanceof Float32Array ? _PRIVATE._f32x4 : _PRIVATE._i32x4) :
              _PRIVATE._f64x2;
  var n = 8 / bpe;
  for (var i = 0; i < n; ++i)
    tarray[index + i] = array[i];
}

/**
  * @param {Typed array} tarray An instance of a typed array.
  * @param {Number} index An instance of Number.
  * @param {float32x4} value An instance of float32x4.
  * @return {void}
  */
SIMD.float32x4.storeXYZ = function(tarray, index, value) {
  if (!isTypedArray(tarray))
    throw new TypeError("The 1st argument must be a typed array.");
  if (!isNumber(index))
    throw new TypeError("The 2nd argument must be a Number.");
  var bpe = tarray.BYTES_PER_ELEMENT;
  if (index < 0 || (index * bpe + 12) > tarray.byteLength)
    throw new RangeError("The value of index is invalid.");
  checkFloat32x4(value);
  if (bpe == 8) {
    // tarray's elements are too wide. Just create a new view; this is rare.
    var view = new Float32Array(tarray.buffer, tarray.byteOffset + index * 8, 3);
    view[0] = value.x;
    view[1] = value.y;
    view[2] = value.z;
  } else {
    _PRIVATE._f32x4[0] = value.x;
    _PRIVATE._f32x4[1] = value.y;
    _PRIVATE._f32x4[2] = value.z;
    var array = bpe == 1 ? _PRIVATE._i8x16 :
                bpe == 2 ? _PRIVATE._i16x8 :
                (tarray instanceof Float32Array ? _PRIVATE._f32x4 : _PRIVATE._i32x4);
    var n = 12 / bpe;
    for (var i = 0; i < n; ++i)
      tarray[index + i] = array[i];
  }
}

/**
  * @param {float64x2} t An instance of float64x2.
  * @return {float64x2} New instance of float64x2 with absolute values of
  * t.
  */
SIMD.float64x2.abs = function(t) {
  checkFloat64x2(t);
  return SIMD.float64x2(Math.abs(t.x), Math.abs(t.y));
}

/**
  * @param {float64x2} t An instance of float64x2.
  * @return {float64x2} New instance of float64x2 with negated values of
  * t.
  */
SIMD.float64x2.neg = function(t) {
  checkFloat64x2(t);
  return SIMD.float64x2(-t.x, -t.y);
}

/**
  * @param {float64x2} a An instance of float64x2.
  * @param {float64x2} b An instance of float64x2.
  * @return {float64x2} New instance of float64x2 with a + b.
  */
SIMD.float64x2.add = function(a, b) {
  checkFloat64x2(a);
  checkFloat64x2(b);
  return SIMD.float64x2(a.x + b.x, a.y + b.y);
}

/**
  * @param {float64x2} a An instance of float64x2.
  * @param {float64x2} b An instance of float64x2.
  * @return {float64x2} New instance of float64x2 with a - b.
  */
SIMD.float64x2.sub = function(a, b) {
  checkFloat64x2(a);
  checkFloat64x2(b);
  return SIMD.float64x2(a.x - b.x, a.y - b.y);
}

/**
  * @param {float64x2} a An instance of float64x2.
  * @param {float64x2} b An instance of float64x2.
  * @return {float64x2} New instance of float64x2 with a * b.
  */
SIMD.float64x2.mul = function(a, b) {
  checkFloat64x2(a);
  checkFloat64x2(b);
  return SIMD.float64x2(a.x * b.x, a.y * b.y);
}

/**
  * @param {float64x2} a An instance of float64x2.
  * @param {float64x2} b An instance of float64x2.
  * @return {float64x2} New instance of float64x2 with a / b.
  */
SIMD.float64x2.div = function(a, b) {
  checkFloat64x2(a);
  checkFloat64x2(b);
  return SIMD.float64x2(a.x / b.x, a.y / b.y);
}

/**
  * @param {float64x2} t An instance of float64x2.
  * @param {float64x2} lowerLimit An instance of float64x2.
  * @param {float64x2} upperLimit An instance of float64x2.
  * @return {float64x2} New instance of float64x2 with t's values clamped
  * between lowerLimit and upperLimit.
  */
SIMD.float64x2.clamp = function(t, lowerLimit, upperLimit) {
  checkFloat64x2(t);
  checkFloat64x2(lowerLimit);
  checkFloat64x2(upperLimit);
  var cx = t.x < lowerLimit.x ? lowerLimit.x : t.x;
  var cy = t.y < lowerLimit.y ? lowerLimit.y : t.y;
  cx = cx > upperLimit.x ? upperLimit.x : cx;
  cy = cy > upperLimit.y ? upperLimit.y : cy;
  return SIMD.float64x2(cx, cy);
}

/**
  * @param {float64x2} t An instance of float64x2.
  * @param {float64x2} other An instance of float64x2.
  * @return {float64x2} New instance of float64x2 with the minimum value of
  * t and other.
  */
SIMD.float64x2.min = function(t, other) {
  checkFloat64x2(t);
  checkFloat64x2(other);
  var cx = Math.min(t.x, other.x);
  var cy = Math.min(t.y, other.y);
  return SIMD.float64x2(cx, cy);
}

/**
  * @param {float64x2} t An instance of float64x2.
  * @param {float64x2} other An instance of float64x2.
  * @return {float64x2} New instance of float64x2 with the maximum value of
  * t and other.
  */
SIMD.float64x2.max = function(t, other) {
  checkFloat64x2(t);
  checkFloat64x2(other);
  var cx = Math.max(t.x, other.x);
  var cy = Math.max(t.y, other.y);
  return SIMD.float64x2(cx, cy);
}

/**
  * @param {float64x2} t An instance of float64x2.
  * @param {float64x2} other An instance of float64x2.
  * @return {float64x2} New instance of float64x2 with the minimum value of
  * t and other, preferring numbers over NaNs.
  */
SIMD.float64x2.minNum = function(t, other) {
  checkFloat64x2(t);
  checkFloat64x2(other);
  var cx = _PRIVATE.minNum(t.x, other.x);
  var cy = _PRIVATE.minNum(t.y, other.y);
  return SIMD.float64x2(cx, cy);
}

/**
  * @param {float64x2} t An instance of float64x2.
  * @param {float64x2} other An instance of float64x2.
  * @return {float64x2} New instance of float64x2 with the maximum value of
  * t and other, preferring numbers over NaNs.
  */
SIMD.float64x2.maxNum = function(t, other) {
  checkFloat64x2(t);
  checkFloat64x2(other);
  var cx = _PRIVATE.maxNum(t.x, other.x);
  var cy = _PRIVATE.maxNum(t.y, other.y);
  return SIMD.float64x2(cx, cy);
}

/**
  * @param {float64x2} t An instance of float64x2.
  * @return {float64x2} New instance of float64x2 with reciprocal value of
  * t.
  */
SIMD.float64x2.reciprocal = function(t) {
  checkFloat64x2(t);
  return SIMD.float64x2(1.0 / t.x, 1.0 / t.y);
}

/**
  * @param {float64x2} t An instance of float64x2.
  * @return {float64x2} New instance of float64x2 with square root of the
  * reciprocal value of t.
  */
SIMD.float64x2.reciprocalSqrt = function(t) {
  checkFloat64x2(t);
  return SIMD.float64x2(Math.sqrt(1.0 / t.x), Math.sqrt(1.0 / t.y));
}

/**
  * @param {float64x2} t An instance of float64x2.
  * @return {float64x2} New instance of float32x4 with square root of
  * values of t.
  */
SIMD.float64x2.sqrt = function(t) {
  checkFloat64x2(t);
  return SIMD.float64x2(Math.sqrt(t.x), Math.sqrt(t.y));
}

/**
  * @param {float64x2} t An instance of float64x2 to be swizzled.
  * @param {integer} x - Index in t for lane x
  * @param {integer} y - Index in t for lane y
  * @return {float64x2} New instance of float64x2 with lanes swizzled.
  */
SIMD.float64x2.swizzle = function(t, x, y) {
  checkFloat64x2(t);
  var storage = _PRIVATE._f64x2;
  storage[0] = t.x_;
  storage[1] = t.y_;
  return SIMD.float64x2(storage[x], storage[y]);
}

/**
  * @param {float64x2} t1 An instance of float64x2 to be shuffled.
  * @param {float64x2} t2 An instance of float64x2 to be shuffled.
  * @param {integer} x - Index in concatenation of t1 and t2 for lane x
  * @param {integer} y - Index in concatenation of t1 and t2 for lane y
  * @return {float64x2} New instance of float64x2 with lanes shuffled.
  */
SIMD.float64x2.shuffle = function(t1, t2, x, y) {
  checkFloat64x2(t1);
  checkFloat64x2(t2);
  var storage = _PRIVATE._f64x4;
  storage[0] = t1.x_;
  storage[1] = t1.y_;
  storage[2] = t2.x_;
  storage[3] = t2.y_;
  return SIMD.float64x2(storage[x], storage[y]);
}

/**
  * @param {float64x2} t An instance of float64x2.
  * @param {double} value used for x lane.
  * @return {float64x2} New instance of float64x2 with the values in t and
  * x replaced with {x}.
  */
SIMD.float64x2.withX = function(t, x) {
  checkFloat64x2(t);
  return SIMD.float64x2(x, t.y);
}

/**
  * @param {float64x2} t An instance of float64x2.
  * @param {double} value used for y lane.
  * @return {float64x2} New instance of float64x2 with the values in t and
  * y replaced with {y}.
  */
SIMD.float64x2.withY = function(t, y) {
  checkFloat64x2(t);
  return SIMD.float64x2(t.x, y);
}

/**
  * @param {float64x2} t An instance of float64x2.
  * @param {float64x2} other An instance of float64x2.
  * @return {int32x4} true or false in each lane depending on
  * the result of t < other.
  */
SIMD.float64x2.lessThan = function(t, other) {
  checkFloat64x2(t);
  checkFloat64x2(other);
  var cx = t.x < other.x;
  var cy = t.y < other.y;
  return SIMD.int32x4.bool(cx, cx, cy, cy);
}

/**
  * @param {float64x2} t An instance of float64x2.
  * @param {float64x2} other An instance of float64x2.
  * @return {int32x4} true or false in each lane depending on
  * the result of t <= other.
  */
SIMD.float64x2.lessThanOrEqual = function(t, other) {
  checkFloat64x2(t);
  checkFloat64x2(other);
  var cx = t.x <= other.x;
  var cy = t.y <= other.y;
  return SIMD.int32x4.bool(cx, cx, cy, cy);
}

/**
  * @param {float64x2} t An instance of float64x2.
  * @param {float64x2} other An instance of float64x2.
  * @return {int32x4} true or false in each lane depending on
  * the result of t == other.
  */
SIMD.float64x2.equal = function(t, other) {
  checkFloat64x2(t);
  checkFloat64x2(other);
  var cx = t.x == other.x;
  var cy = t.y == other.y;
  return SIMD.int32x4.bool(cx, cx, cy, cy);
}

/**
  * @param {float64x2} t An instance of float64x2.
  * @param {float64x2} other An instance of float64x2.
  * @return {int32x4} true or false in each lane depending on
  * the result of t != other.
  */
SIMD.float64x2.notEqual = function(t, other) {
  checkFloat64x2(t);
  checkFloat64x2(other);
  var cx = t.x != other.x;
  var cy = t.y != other.y;
  return SIMD.int32x4.bool(cx, cx, cy, cy);
}

/**
  * @param {float64x2} t An instance of float64x2.
  * @param {float64x2} other An instance of float64x2.
  * @return {int32x4} true or false in each lane depending on
  * the result of t >= other.
  */
SIMD.float64x2.greaterThanOrEqual = function(t, other) {
  checkFloat64x2(t);
  checkFloat64x2(other);
  var cx = t.x >= other.x;
  var cy = t.y >= other.y;
  return SIMD.int32x4.bool(cx, cx, cy, cy);
}

/**
  * @param {float64x2} t An instance of float64x2.
  * @param {float64x2} other An instance of float64x2.
  * @return {int32x4} true or false in each lane depending on
  * the result of t > other.
  */
SIMD.float64x2.greaterThan = function(t, other) {
  checkFloat64x2(t);
  checkFloat64x2(other);
  var cx = t.x > other.x;
  var cy = t.y > other.y;
  return SIMD.int32x4.bool(cx, cx, cy, cy);
}

/**
  * @param {int32x4} t Selector mask. An instance of int32x4
  * @param {float64x2} trueValue Pick lane from here if corresponding
  * selector lane is true
  * @param {float64x2} falseValue Pick lane from here if corresponding
  * selector lane is false
  * @return {float64x2} Mix of lanes from trueValue or falseValue as
  * indicated
  */
SIMD.float64x2.select = function(t, trueValue, falseValue) {
  checkInt32x4(t);
  checkFloat64x2(trueValue);
  checkFloat64x2(falseValue);
  return SIMD.float32x4(_PRIVATE.tobool(t.x) ? trueValue.x : falseValue.x,
                        _PRIVATE.tobool(t.y) ? trueValue.y : falseValue.y);
}

/**
  * @param {int32x4} t Selector mask. An instance of int32x4
  * @param {float64x2} trueValue Pick bit from here if corresponding
  * selector bit is 1
  * @param {float64x2} falseValue Pick bit from here if corresponding
  * selector bit is 0
  * @return {float64x2} Mix of bits from trueValue or falseValue as
  * indicated
  */
SIMD.float64x2.bitselect = function(t, trueValue, falseValue) {
  checkInt32x4(t);
  checkFloat64x2(trueValue);
  checkFloat64x2(falseValue);
  var tv = SIMD.int32x4.fromFloat64x2Bits(trueValue);
  var fv = SIMD.int32x4.fromFloat64x2Bits(falseValue);
  var tr = SIMD.int32x4.and(t, tv);
  var fr = SIMD.int32x4.and(SIMD.int32x4.not(t), fv);
  return SIMD.float64x2.fromInt32x4Bits(SIMD.int32x4.or(tr, fr));
}

/**
  * @param {Typed array} tarray An instance of a typed array.
  * @param {Number} index An instance of Number.
  * @return {float64x2} New instance of float64x2.
  */
SIMD.float64x2.load = function(tarray, index) {
  if (!isTypedArray(tarray))
    throw new TypeError("The 1st argument must be a typed array.");
  if (!isNumber(index))
    throw new TypeError("The 2nd argument must be a Number.");
  var bpe = tarray.BYTES_PER_ELEMENT;
  if (index < 0 || (index * bpe + 16) > tarray.byteLength)
    throw new RangeError("The value of index is invalid.");
  var f64temp = _PRIVATE._f64x2;
  var array = bpe == 1 ? _PRIVATE._i8x16 :
              bpe == 2 ? _PRIVATE._i16x8 :
              bpe == 4 ? (tarray instanceof Float32Array ? _PRIVATE._f32x4 : _PRIVATE._i32x4) :
              f64temp;
  var n = 16 / bpe;
  for (var i = 0; i < n; ++i)
    array[i] = tarray[index + i];
  return new SIMD.float64x2(f64temp[0], f64temp[1]);
}

/**
  * @param {Typed array} tarray An instance of a typed array.
  * @param {Number} index An instance of Number.
  * @return {float64x2} New instance of float64x2.
  */
SIMD.float64x2.loadX = function(tarray, index) {
  if (!isTypedArray(tarray))
    throw new TypeError("The 1st argument must be a typed array.");
  if (!isNumber(index))
    throw new TypeError("The 2nd argument must be a Number.");
  var bpe = tarray.BYTES_PER_ELEMENT;
  if (index < 0 || (index * bpe + 8) > tarray.byteLength)
    throw new RangeError("The value of index is invalid.");
  var f64temp = _PRIVATE._f64x2;
  var array = bpe == 1 ? _PRIVATE._i8x16 :
              bpe == 2 ? _PRIVATE._i16x8 :
              bpe == 4 ? (tarray instanceof Float32Array ? _PRIVATE._f32x4 : _PRIVATE._i32x4) :
              f64temp;
  var n = 8 / bpe;
  for (var i = 0; i < n; ++i)
    array[i] = tarray[index + i];
  return new SIMD.float64x2(f64temp[0], 0.0);
}

/**
  * @param {Typed array} tarray An instance of a typed array.
  * @param {Number} index An instance of Number.
  * @param {float64x2} value An instance of float64x2.
  * @return {void}
  */
SIMD.float64x2.store = function(tarray, index, value) {
  if (!isTypedArray(tarray))
    throw new TypeError("The 1st argument must be a typed array.");
  if (!isNumber(index))
    throw new TypeError("The 2nd argument must be a Number.");
  var bpe = tarray.BYTES_PER_ELEMENT;
  if (index < 0 || (index * bpe + 16) > tarray.byteLength)
    throw new RangeError("The value of index is invalid.");
  checkFloat64x2(value);
  _PRIVATE._f64x2[0] = value.x;
  _PRIVATE._f64x2[1] = value.y;
  var array = bpe == 1 ? _PRIVATE._i8x16 :
              bpe == 2 ? _PRIVATE._i16x8 :
              bpe == 4 ? (tarray instanceof Float32Array ? _PRIVATE._f32x4 : _PRIVATE._i32x4) :
              _PRIVATE._f64x2;
  var n = 16 / bpe;
  for (var i = 0; i < n; ++i)
    tarray[index + i] = array[i];
}

/**
  * @param {Typed array} tarray An instance of a typed array.
  * @param {Number} index An instance of Number.
  * @param {float64x2} value An instance of float64x2.
  * @return {void}
  */
SIMD.float64x2.storeX = function(tarray, index, value) {
  if (!isTypedArray(tarray))
    throw new TypeError("The 1st argument must be a typed array.");
  if (!isNumber(index))
    throw new TypeError("The 2nd argument must be a Number.");
  var bpe = tarray.BYTES_PER_ELEMENT;
  if (index < 0 || (index * bpe + 8) > tarray.byteLength)
    throw new RangeError("The value of index is invalid.");
  checkFloat64x2(value);
  _PRIVATE._f64x2[0] = value.x;
  var array = bpe == 1 ? _PRIVATE._i8x16 :
              bpe == 2 ? _PRIVATE._i16x8 :
              bpe == 4 ? (tarray instanceof Float32Array ? _PRIVATE._f32x4 : _PRIVATE._i32x4) :
              _PRIVATE._f64x2;
  var n = 8 / bpe;
  for (var i = 0; i < n; ++i)
    tarray[index + i] = array[i];
}

/**
  * @param {int32x4} a An instance of int32x4.
  * @param {int32x4} b An instance of int32x4.
  * @return {int32x4} New instance of int32x4 with values of a & b.
  */
SIMD.int32x4.and = function(a, b) {
  checkInt32x4(a);
  checkInt32x4(b);
  return SIMD.int32x4(a.x & b.x, a.y & b.y, a.z & b.z, a.w & b.w);
}

/**
  * @param {int32x4} a An instance of int32x4.
  * @param {int32x4} b An instance of int32x4.
  * @return {int32x4} New instance of int32x4 with values of a | b.
  */
SIMD.int32x4.or = function(a, b) {
  checkInt32x4(a);
  checkInt32x4(b);
  return SIMD.int32x4(a.x | b.x, a.y | b.y, a.z | b.z, a.w | b.w);
}

/**
  * @param {int32x4} a An instance of int32x4.
  * @param {int32x4} b An instance of int32x4.
  * @return {int32x4} New instance of int32x4 with values of a ^ b.
  */
SIMD.int32x4.xor = function(a, b) {
  checkInt32x4(a);
  checkInt32x4(b);
  return SIMD.int32x4(a.x ^ b.x, a.y ^ b.y, a.z ^ b.z, a.w ^ b.w);
}

/**
  * @param {int32x4} t An instance of int32x4.
  * @return {int32x4} New instance of int32x4 with values of ~t
  */
SIMD.int32x4.not = function(t) {
  checkInt32x4(t);
  return SIMD.int32x4(~t.x, ~t.y, ~t.z, ~t.w);
}

/**
  * @param {int32x4} t An instance of int32x4.
  * @return {int32x4} New instance of int32x4 with values of -t
  */
SIMD.int32x4.neg = function(t) {
  checkInt32x4(t);
  return SIMD.int32x4(-t.x, -t.y, -t.z, -t.w);
}

/**
  * @param {int32x4} a An instance of int32x4.
  * @param {int32x4} b An instance of int32x4.
  * @return {int32x4} New instance of int32x4 with values of a + b.
  */
SIMD.int32x4.add = function(a, b) {
  checkInt32x4(a);
  checkInt32x4(b);
  return SIMD.int32x4(a.x + b.x, a.y + b.y, a.z + b.z, a.w + b.w);
}

/**
  * @param {int32x4} a An instance of int32x4.
  * @param {int32x4} b An instance of int32x4.
  * @return {int32x4} New instance of int32x4 with values of a - b.
  */
SIMD.int32x4.sub = function(a, b) {
  checkInt32x4(a);
  checkInt32x4(b);
  return SIMD.int32x4(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w);
}

/**
  * @param {int32x4} a An instance of int32x4.
  * @param {int32x4} b An instance of int32x4.
  * @return {int32x4} New instance of int32x4 with values of a * b.
  */
SIMD.int32x4.mul = function(a, b) {
  checkInt32x4(a);
  checkInt32x4(b);
  return SIMD.int32x4(Math.imul(a.x, b.x), Math.imul(a.y, b.y),
                      Math.imul(a.z, b.z), Math.imul(a.w, b.w));
}

/**
  * @param {int32x4} t An instance of float32x4 to be swizzled.
  * @param {integer} x - Index in t for lane x
  * @param {integer} y - Index in t for lane y
  * @param {integer} z - Index in t for lane z
  * @param {integer} w - Index in t for lane w
  * @return {int32x4} New instance of float32x4 with lanes swizzled.
  */
SIMD.int32x4.swizzle = function(t, x, y, z, w) {
  checkInt32x4(t);
  var storage = _PRIVATE._i32x4;
  storage[0] = t.x_;
  storage[1] = t.y_;
  storage[2] = t.z_;
  storage[3] = t.w_;
  return SIMD.int32x4(storage[x], storage[y], storage[z], storage[w]);
}

/**
  * @param {int32x4} t1 An instance of float32x4 to be shuffled.
  * @param {int32x4} t2 An instance of float32x4 to be shuffled.
  * @param {integer} x - Index in concatenation of t1 and t2 for lane x
  * @param {integer} y - Index in concatenation of t1 and t2 for lane y
  * @param {integer} z - Index in concatenation of t1 and t2 for lane z
  * @param {integer} w - Index in concatenation of t1 and t2 for lane w
  * @return {int32x4} New instance of float32x4 with lanes shuffled.
  */
SIMD.int32x4.shuffle = function(t1, t2, x, y, z, w) {
  checkInt32x4(t1);
  checkInt32x4(t2);
  var storage = _PRIVATE._i32x8;
  storage[0] = t1.x_;
  storage[1] = t1.y_;
  storage[2] = t1.z_;
  storage[3] = t1.w_;
  storage[4] = t2.x_;
  storage[5] = t2.y_;
  storage[6] = t2.z_;
  storage[7] = t2.w_;
  return SIMD.float32x4(storage[x], storage[y], storage[z], storage[w]);
}

/**
  * @param {int32x4} t Selector mask. An instance of int32x4
  * @param {int32x4} trueValue Pick lane from here if corresponding
  * selector lane is true
  * @param {int32x4} falseValue Pick lane from here if corresponding
  * selector lane is false
  * @return {int32x4} Mix of lanes from trueValue or falseValue as
  * indicated
  */
SIMD.int32x4.select = function(t, trueValue, falseValue) {
  checkInt32x4(t);
  checkInt32x4(trueValue);
  checkInt32x4(falseValue);
  return SIMD.int32x4(_PRIVATE.tobool(t.x) ? trueValue.x : falseValue.x,
                      _PRIVATE.tobool(t.y) ? trueValue.y : falseValue.y,
                      _PRIVATE.tobool(t.z) ? trueValue.z : falseValue.z,
                      _PRIVATE.tobool(t.w) ? trueValue.w : falseValue.w);
}

/**
  * @param {int32x4} t Selector mask. An instance of int32x4
  * @param {int32x4} trueValue Pick bit from here if corresponding
  * selector bit is 1
  * @param {int32x4} falseValue Pick bit from here if corresponding
  * selector bit is 0
  * @return {int32x4} Mix of bits from trueValue or falseValue as
  * indicated
  */
SIMD.int32x4.bitselect = function(t, trueValue, falseValue) {
  checkInt32x4(t);
  checkInt32x4(trueValue);
  checkInt32x4(falseValue);
  var tr = SIMD.int32x4.and(t, trueValue);
  var fr = SIMD.int32x4.and(SIMD.int32x4.not(t), falseValue);
  return SIMD.int32x4.or(tr, fr);
}

/**
  * @param {int32x4} t An instance of int32x4.
  * @param {integer} 32-bit value used for x lane.
  * @return {int32x4} New instance of int32x4 with the values in t and
  * x lane replaced with {x}.
  */
SIMD.int32x4.withX = function(t, x) {
  checkInt32x4(t);
  return SIMD.int32x4(x, t.y, t.z, t.w);
}

/**
  * @param {int32x4} t An instance of int32x4.
  * @param {integer} 32-bit value used for y lane.
  * @return {int32x4} New instance of int32x4 with the values in t and
  * y lane replaced with {y}.
  */
SIMD.int32x4.withY = function(t, y) {
  checkInt32x4(t);
  return SIMD.int32x4(t.x, y, t.z, t.w);
}

/**
  * @param {int32x4} t An instance of int32x4.
  * @param {integer} 32-bit value used for z lane.
  * @return {int32x4} New instance of int32x4 with the values in t and
  * z lane replaced with {z}.
  */
SIMD.int32x4.withZ = function(t, z) {
  checkInt32x4(t);
  return SIMD.int32x4(t.x, t.y, z, t.w);
}

/**
  * @param {int32x4} t An instance of int32x4.
  * @param {integer} 32-bit value used for w lane.
  * @return {int32x4} New instance of int32x4 with the values in t and
  * w lane replaced with {w}.
  */
SIMD.int32x4.withW = function(t, w) {
  checkInt32x4(t);
  return SIMD.int32x4(t.x, t.y, t.z, w);
}

/**
  * @param {int32x4} t An instance of int32x4.
  * @param {int32x4} other An instance of int32x4.
  * @return {int32x4} true or false in each lane depending on
  * the result of t == other.
  */
SIMD.int32x4.equal = function(t, other) {
  checkInt32x4(t);
  checkInt32x4(other);
  var cx = t.x == other.x;
  var cy = t.y == other.y;
  var cz = t.z == other.z;
  var cw = t.w == other.w;
  return SIMD.int32x4.bool(cx, cy, cz, cw);
}

/**
  * @param {int32x4} t An instance of int32x4.
  * @param {int32x4} other An instance of int32x4.
  * @return {int32x4} true or false in each lane depending on
  * the result of t != other.
  */
SIMD.int32x4.notEqual = function(t, other) {
  checkInt32x4(t);
  checkInt32x4(other);
  var cx = t.x != other.x;
  var cy = t.y != other.y;
  var cz = t.z != other.z;
  var cw = t.w != other.w;
  return SIMD.int32x4.bool(cx, cy, cz, cw);
}

/**
  * @param {int32x4} t An instance of int32x4.
  * @param {int32x4} other An instance of int32x4.
  * @return {int32x4} true or false in each lane depending on
  * the result of t > other.
  */
SIMD.int32x4.greaterThan = function(t, other) {
  checkInt32x4(t);
  checkInt32x4(other);
  var cx = t.x > other.x;
  var cy = t.y > other.y;
  var cz = t.z > other.z;
  var cw = t.w > other.w;
  return SIMD.int32x4.bool(cx, cy, cz, cw);
}

/**
  * @param {int32x4} t An instance of int32x4.
  * @param {int32x4} other An instance of int32x4.
  * @return {int32x4} true or false in each lane depending on
  * the result of t >= other.
  */
SIMD.int32x4.greaterThanOrEqual = function(t, other) {
  checkInt32x4(t);
  checkInt32x4(other);
  var cx = t.x >= other.x;
  var cy = t.y >= other.y;
  var cz = t.z >= other.z;
  var cw = t.w >= other.w;
  return SIMD.int32x4.bool(cx, cy, cz, cw);
}

/**
  * @param {int32x4} t An instance of int32x4.
  * @param {int32x4} other An instance of int32x4.
  * @return {int32x4} true or false in each lane depending on
  * the result of t < other.
  */
SIMD.int32x4.lessThan = function(t, other) {
  checkInt32x4(t);
  checkInt32x4(other);
  var cx = t.x < other.x;
  var cy = t.y < other.y;
  var cz = t.z < other.z;
  var cw = t.w < other.w;
  return SIMD.int32x4.bool(cx, cy, cz, cw);
}

/**
  * @param {int32x4} t An instance of int32x4.
  * @param {int32x4} other An instance of int32x4.
  * @return {int32x4} true or false in each lane depending on
  * the result of t <= other.
  */
SIMD.int32x4.lessThanOrEqual = function(t, other) {
  checkInt32x4(t);
  checkInt32x4(other);
  var cx = t.x <= other.x;
  var cy = t.y <= other.y;
  var cz = t.z <= other.z;
  var cw = t.w <= other.w;
  return SIMD.int32x4.bool(cx, cy, cz, cw);
}

/**
  * @param {int32x4} a An instance of int32x4.
  * @param {integer} bits Bit count to shift by.
  * @return {int32x4} lanes in a shifted by bits.
  */
SIMD.int32x4.shiftLeftByScalar = function(a, bits) {
  checkInt32x4(a);
  var x = a.x << bits;
  var y = a.y << bits;
  var z = a.z << bits;
  var w = a.w << bits;
  return SIMD.int32x4(x, y, z, w);
}

/**
  * @param {int32x4} a An instance of int32x4.
  * @param {integer} bits Bit count to shift by.
  * @return {int32x4} lanes in a shifted by bits.
  */
SIMD.int32x4.shiftRightLogicalByScalar = function(a, bits) {
  checkInt32x4(a);
  var x = a.x >>> bits;
  var y = a.y >>> bits;
  var z = a.z >>> bits;
  var w = a.w >>> bits;
  return SIMD.int32x4(x, y, z, w);
}

/**
  * @param {int32x4} a An instance of int32x4.
  * @param {integer} bits Bit count to shift by.
  * @return {int32x4} lanes in a shifted by bits.
  */
SIMD.int32x4.shiftRightArithmeticByScalar = function(a, bits) {
  checkInt32x4(a);
  var x = a.x >> bits;
  var y = a.y >> bits;
  var z = a.z >> bits;
  var w = a.w >> bits;
  return SIMD.int32x4(x, y, z, w);
}

/**
  * @param {Typed array} tarray An instance of a typed array.
  * @param {Number} index An instance of Number.
  * @return {int32x4} New instance of int32x4.
  */
SIMD.int32x4.load = function(tarray, index) {
  if (!isTypedArray(tarray))
    throw new TypeError("The 1st argument must be a typed array.");
  if (!isNumber(index))
    throw new TypeError("The 2nd argument must be a Number.");
  var bpe = tarray.BYTES_PER_ELEMENT;
  if (index < 0 || (index * bpe + 16) > tarray.byteLength)
    throw new RangeError("The value of index is invalid.");
  var array = bpe == 1 ? _PRIVATE._i8x16 :
              bpe == 2 ? _PRIVATE._i16x8 :
              bpe == 4 ? (tarray instanceof Float32Array ? _PRIVATE._f32x4 : _PRIVATE._i32x4) :
              _PRIVATE._f64x2;
  var n = 16 / bpe;
  for (var i = 0; i < n; ++i)
    array[i] = tarray[index + i];
  var i32temp = _PRIVATE._i32x4;
  return new SIMD.int32x4(i32temp[0], i32temp[1], i32temp[2], i32temp[3]);
}

/**
  * @param {Typed array} tarray An instance of a typed array.
  * @param {Number} index An instance of Number.
  * @return {int32x4} New instance of int32x4.
  */
SIMD.int32x4.loadX = function(tarray, index) {
  if (!isTypedArray(tarray))
    throw new TypeError("The 1st argument must be a typed array.");
  if (!isNumber(index))
    throw new TypeError("The 2nd argument must be a Number.");
  var bpe = tarray.BYTES_PER_ELEMENT;
  if (index < 0 || (index * bpe + 4) > tarray.byteLength)
    throw new RangeError("The value of index is invalid.");
  var array = bpe == 1 ? _PRIVATE._i8x16 :
              bpe == 2 ? _PRIVATE._i16x8 :
              bpe == 4 ? (tarray instanceof Float32Array ? _PRIVATE._f32x4 : _PRIVATE._i32x4) :
              _PRIVATE._f64x2;
  var n = 4 / bpe;
  for (var i = 0; i < n; ++i)
    array[i] = tarray[index + i];
  var i32temp = _PRIVATE._i32x4;
  return new SIMD.int32x4(i32temp[0], 0, 0, 0);
}

/**
  * @param {Typed array} tarray An instance of a typed array.
  * @param {Number} index An instance of Number.
  * @return {int32x4} New instance of int32x4.
  */
SIMD.int32x4.loadXY = function(tarray, index) {
  if (!isTypedArray(tarray))
    throw new TypeError("The 1st argument must be a typed array.");
  if (!isNumber(index))
    throw new TypeError("The 2nd argument must be a Number.");
  var bpe = tarray.BYTES_PER_ELEMENT;
  if (index < 0 || (index * bpe + 8) > tarray.byteLength)
    throw new RangeError("The value of index is invalid.");
  var array = bpe == 1 ? _PRIVATE._i8x16 :
              bpe == 2 ? _PRIVATE._i16x8 :
              bpe == 4 ? (tarray instanceof Float32Array ? _PRIVATE._f32x4 : _PRIVATE._i32x4) :
              _PRIVATE._f64x2;
  var n = 8 / bpe;
  for (var i = 0; i < n; ++i)
    array[i] = tarray[index + i];
  var i32temp = _PRIVATE._i32x4;
  return new SIMD.int32x4(i32temp[0], i32temp[1], 0, 0);
}

/**
  * @param {Typed array} tarray An instance of a typed array.
  * @param {Number} index An instance of Number.
  * @return {int32x4} New instance of int32x4.
  */
SIMD.int32x4.loadXYZ = function(tarray, index) {
  if (!isTypedArray(tarray))
    throw new TypeError("The 1st argument must be a typed array.");
  if (!isNumber(index))
    throw new TypeError("The 2nd argument must be a Number.");
  var bpe = tarray.BYTES_PER_ELEMENT;
  if (index < 0 || (index * bpe + 12) > tarray.byteLength)
    throw new RangeError("The value of index is invalid.");
  var array = bpe == 1 ? _PRIVATE._i8x16 :
              bpe == 2 ? _PRIVATE._i16x8 :
              bpe == 4 ? (tarray instanceof Float32Array ? _PRIVATE._f32x4 : _PRIVATE._i32x4) :
              _PRIVATE._f64x2;
  var n = 12 / bpe;
  for (var i = 0; i < n; ++i)
    array[i] = tarray[index + i];
  var i32temp = _PRIVATE._i32x4;
  return new SIMD.int32x4(i32temp[0], i32temp[1], i32temp[2], 0);
}

/**
  * @param {Typed array} tarray An instance of a typed array.
  * @param {Number} index An instance of Number.
  * @param {int32x4} value An instance of int32x4.
  * @return {void}
  */
SIMD.int32x4.store = function(tarray, index, value) {
  if (!isTypedArray(tarray))
    throw new TypeError("The 1st argument must be a typed array.");
  if (!isNumber(index))
    throw new TypeError("The 2nd argument must be a Number.");
  var bpe = tarray.BYTES_PER_ELEMENT;
  if (index < 0 || (index * bpe + 16) > tarray.byteLength)
    throw new RangeError("The value of index is invalid.");
  checkInt32x4(value);
  _PRIVATE._i32x4[0] = value.x;
  _PRIVATE._i32x4[1] = value.y;
  _PRIVATE._i32x4[2] = value.z;
  _PRIVATE._i32x4[3] = value.w;
  var array = bpe == 1 ? _PRIVATE._i8x16 :
              bpe == 2 ? _PRIVATE._i16x8 :
              bpe == 4 ? (tarray instanceof Float32Array ? _PRIVATE._f32x4 : _PRIVATE._i32x4) :
              _PRIVATE._f64x2;
  var n = 16 / bpe;
  for (var i = 0; i < n; ++i)
    tarray[index + i] = array[i];
}

/**
  * @param {Typed array} tarray An instance of a typed array.
  * @param {Number} index An instance of Number.
  * @param {int32x4} value An instance of int32x4.
  * @return {void}
  */
SIMD.int32x4.storeX = function(tarray, index, value) {
  if (!isTypedArray(tarray))
    throw new TypeError("The 1st argument must be a typed array.");
  if (!isNumber(index))
    throw new TypeError("The 2nd argument must be a Number.");
  var bpe = tarray.BYTES_PER_ELEMENT;
  if (index < 0 || (index * bpe + 4) > tarray.byteLength)
    throw new RangeError("The value of index is invalid.");
  checkInt32x4(value);
  if (bpe == 8) {
    // tarray's elements are too wide. Just create a new view; this is rare.
    var view = new Int32Array(tarray.buffer, tarray.byteOffset + index * 8, 1);
    view[0] = value.x;
  } else {
    _PRIVATE._i32x4[0] = value.x;
    var array = bpe == 1 ? _PRIVATE._i8x16 :
                bpe == 2 ? _PRIVATE._i16x8 :
                (tarray instanceof Float32Array ? _PRIVATE._f32x4 : _PRIVATE._i32x4);
    var n = 4 / bpe;
    for (var i = 0; i < n; ++i)
      tarray[index + i] = array[i];
  }
}

/**
  * @param {Typed array} tarray An instance of a typed array.
  * @param {Number} index An instance of Number.
  * @param {int32x4} value An instance of int32x4.
  * @return {void}
  */
SIMD.int32x4.storeXY = function(tarray, index, value) {
  if (!isTypedArray(tarray))
    throw new TypeError("The 1st argument must be a typed array.");
  if (!isNumber(index))
    throw new TypeError("The 2nd argument must be a Number.");
  var bpe = tarray.BYTES_PER_ELEMENT;
  if (index < 0 || (index * bpe + 8) > tarray.byteLength)
    throw new RangeError("The value of index is invalid.");
  checkInt32x4(value);
  _PRIVATE._i32x4[0] = value.x;
  _PRIVATE._i32x4[1] = value.y;
  var array = bpe == 1 ? _PRIVATE._i8x16 :
              bpe == 2 ? _PRIVATE._i16x8 :
              bpe == 4 ? (tarray instanceof Float32Array ? _PRIVATE._f32x4 : _PRIVATE._i32x4) :
              _PRIVATE._f64x2;
  var n = 8 / bpe;
  for (var i = 0; i < n; ++i)
    tarray[index + i] = array[i];
}

/**
  * @param {Typed array} tarray An instance of a typed array.
  * @param {Number} index An instance of Number.
  * @param {int32x4} value An instance of int32x4.
  * @return {void}
  */
SIMD.int32x4.storeXYZ = function(tarray, index, value) {
  if (!isTypedArray(tarray))
    throw new TypeError("The 1st argument must be a typed array.");
  if (!isNumber(index))
    throw new TypeError("The 2nd argument must be a Number.");
  var bpe = tarray.BYTES_PER_ELEMENT;
  if (index < 0 || (index * bpe + 12) > tarray.byteLength)
    throw new RangeError("The value of index is invalid.");
  checkInt32x4(value);
  if (bpe == 8) {
    // tarray's elements are too wide. Just create a new view; this is rare.
    var view = new Int32Array(tarray.buffer, tarray.byteOffset + index * 8, 3);
    view[0] = value.x;
    view[1] = value.y;
    view[2] = value.z;
  } else {
    _PRIVATE._i32x4[0] = value.x;
    _PRIVATE._i32x4[1] = value.y;
    _PRIVATE._i32x4[2] = value.z;
    var array = bpe == 1 ? _PRIVATE._i8x16 :
                bpe == 2 ? _PRIVATE._i16x8 :
                (tarray instanceof Float32Array ? _PRIVATE._f32x4 : _PRIVATE._i32x4);
    var n = 12 / bpe;
    for (var i = 0; i < n; ++i)
      tarray[index + i] = array[i];
  }
}

/**
  * @param {int16x8} a An instance of int16x8.
  * @param {int16x8} b An instance of int16x8.
  * @return {int16x8} New instance of int16x8 with values of a & b.
  */
SIMD.int16x8.and = function(a, b) {
  checkInt16x8(a);
  checkInt16x8(b);
  return SIMD.int16x8(a.s0 & b.s0, a.s1 & b.s1, a.s2 & b.s2, a.s3 & b.s3,
                      a.s4 & b.s4, a.s5 & b.s5, a.s6 & b.s6, a.s7 & b.s7);
}

/**
  * @param {int16x8} a An instance of int16x8.
  * @param {int16x8} b An instance of int16x8.
  * @return {int16x8} New instance of int16x8 with values of a | b.
  */
SIMD.int16x8.or = function(a, b) {
  checkInt16x8(a);
  checkInt16x8(b);
  return SIMD.int16x8(a.s0 | b.s0, a.s1 | b.s1, a.s2 | b.s2, a.s3 | b.s3,
                      a.s4 | b.s4, a.s5 | b.s5, a.s6 | b.s6, a.s7 | b.s7);
}

/**
  * @param {int16x8} a An instance of int16x8.
  * @param {int16x8} b An instance of int16x8.
  * @return {int16x8} New instance of int16x8 with values of a ^ b.
  */
SIMD.int16x8.xor = function(a, b) {
  checkInt16x8(a);
  checkInt16x8(b);
  return SIMD.int16x8(a.s0 ^ b.s0, a.s1 ^ b.s1, a.s2 ^ b.s2, a.s3 ^ b.s3,
                      a.s4 ^ b.s4, a.s5 ^ b.s5, a.s6 ^ b.s6, a.s7 ^ b.s7);
}

/**
  * @param {int16x8} t An instance of int16x8.
  * @return {int16x8} New instance of int16x8 with values of ~t
  */
SIMD.int16x8.not = function(t) {
  checkInt16x8(t);
  return SIMD.int16x8(~t.s0, ~t.s1, ~t.s2, ~t.s3,
                      ~t.s4, ~t.s5, ~t.s6, ~t.s7);
}

/**
  * @param {int16x8} t An instance of int16x8.
  * @return {int16x8} New instance of int16x8 with values of -t
  */
SIMD.int16x8.neg = function(t) {
  checkInt16x8(t);
  return SIMD.int16x8(-t.s0, -t.s1, -t.s2, -t.s3,
                      -t.s4, -t.s5, -t.s6, -t.s7);
}

/**
  * @param {int16x8} a An instance of int16x8.
  * @param {int16x8} b An instance of int16x8.
  * @return {int16x8} New instance of int16x8 with values of a + b.
  */
SIMD.int16x8.add = function(a, b) {
  checkInt16x8(a);
  checkInt16x8(b);
  return SIMD.int16x8(a.s0 + b.s0, a.s1 + b.s1, a.s2 + b.s2, a.s3 + b.s3,
                      a.s4 + b.s4, a.s5 + b.s5, a.s6 + b.s6, a.s7 + b.s7);
}

/**
  * @param {int16x8} a An instance of int16x8.
  * @param {int16x8} b An instance of int16x8.
  * @return {int16x8} New instance of int16x8 with values of a - b.
  */
SIMD.int16x8.sub = function(a, b) {
  checkInt16x8(a);
  checkInt16x8(b);
  return SIMD.int16x8(a.s0 - b.s0, a.s1 - b.s1, a.s2 - b.s2, a.s3 - b.s3,
                      a.s4 - b.s4, a.s5 - b.s5, a.s6 - b.s6, a.s7 - b.s7);
}

/**
  * @param {int16x8} a An instance of int16x8.
  * @param {int16x8} b An instance of int16x8.
  * @return {int16x8} New instance of int16x8 with values of a * b.
  */
SIMD.int16x8.mul = function(a, b) {
  checkInt16x8(a);
  checkInt16x8(b);
  return SIMD.int16x8(Math.imul(a.s0, b.s0), Math.imul(a.s1, b.s1),
                      Math.imul(a.s2, b.s2), Math.imul(a.s3, b.s3),
                      Math.imul(a.s4, b.s4), Math.imul(a.s5, b.s5),
                      Math.imul(a.s6, b.s6), Math.imul(a.s7, b.s7));
}

/**
  * @param {int16x8} t Selector mask. An instance of int16x8
  * @param {int16x8} trueValue Pick lane from here if corresponding
  * selector lane is 0xFFFF
  * @param {int16x8} falseValue Pick lane from here if corresponding
  * selector lane is 0x0
  * @return {int16x8} Mix of lanes from trueValue or falseValue as
  * indicated
  */
SIMD.int16x8.select = function(t, trueValue, falseValue) {
  checkInt16x8(t);
  checkInt16x8(trueValue);
  checkInt16x8(falseValue);
  var tr = SIMD.int16x8.and(t, trueValue);
  var fr = SIMD.int16x8.and(SIMD.int16x8.not(t), falseValue);
  return SIMD.int16x8.or(tr, fr);
}

/**
  * @param {int16x8} t An instance of int16x8.
  * @param {int16x8} other An instance of int16x8.
  * @return {int16x8} 0xFFFF or 0x0 in each lane depending on
  * the result of t == other.
  */
SIMD.int16x8.equal = function(t, other) {
  checkInt16x8(t);
  checkInt16x8(other);
  var cs0 = t.s0 == other.s0;
  var cs1 = t.s1 == other.s1;
  var cs2 = t.s2 == other.s2;
  var cs3 = t.s3 == other.s3;
  var cs4 = t.s4 == other.s4;
  var cs5 = t.s5 == other.s5;
  var cs6 = t.s6 == other.s6;
  var cs7 = t.s7 == other.s7;
  return SIMD.int16x8.bool(cs0, cs1, cs2, cs3, cs4, cs5, cs6, cs7);
}

/**
  * @param {int16x8} t An instance of int16x8.
  * @param {int16x8} other An instance of int16x8.
  * @return {int16x8} 0xFFFF or 0x0 in each lane depending on
  * the result of t > other.
  */
SIMD.int16x8.greaterThan = function(t, other) {
  checkInt16x8(t);
  checkInt16x8(other);
  var cs0 = t.s0 > other.s0;
  var cs1 = t.s1 > other.s1;
  var cs2 = t.s2 > other.s2;
  var cs3 = t.s3 > other.s3;
  var cs4 = t.s4 > other.s4;
  var cs5 = t.s5 > other.s5;
  var cs6 = t.s6 > other.s6;
  var cs7 = t.s7 > other.s7;
  return SIMD.int16x8.bool(cs0, cs1, cs2, cs3, cs4, cs5, cs6, cs7);
}

/**
  * @param {int16x8} t An instance of int16x8.
  * @param {int16x8} other An instance of int16x8.
  * @return {int16x8} 0xFFFF or 0x0 in each lane depending on
  * the result of t < other.
  */
SIMD.int16x8.lessThan = function(t, other) {
  checkInt16x8(t);
  checkInt16x8(other);
  var cs0 = t.s0 < other.s0;
  var cs1 = t.s1 < other.s1;
  var cs2 = t.s2 < other.s2;
  var cs3 = t.s3 < other.s3;
  var cs4 = t.s4 < other.s4;
  var cs5 = t.s5 < other.s5;
  var cs6 = t.s6 < other.s6;
  var cs7 = t.s7 < other.s7;
  return SIMD.int16x8.bool(cs0, cs1, cs2, cs3, cs4, cs5, cs6, cs7);
}

/**
  * @param {int16x8} a An instance of int16x8.
  * @param {integer} bits Bit count to shift by.
  * @return {int16x8} lanes in a shifted by bits.
  */
SIMD.int16x8.shiftLeftByScalar = function(a, bits) {
  checkInt16x8(a);
  var s0 = a.s0 << bits;
  var s1 = a.s1 << bits;
  var s2 = a.s2 << bits;
  var s3 = a.s3 << bits;
  var s4 = a.s4 << bits;
  var s5 = a.s5 << bits;
  var s6 = a.s6 << bits;
  var s7 = a.s7 << bits;
  return SIMD.int16x8(s0, s1, s2, s3, s4, s5, s6, s7);
}

/**
  * @param {int16x8} a An instance of int16x8.
  * @param {integer} bits Bit count to shift by.
  * @return {int16x8} lanes in a shifted by bits.
  */
SIMD.int16x8.shiftRightLogicalByScalar = function(a, bits) {
  checkInt16x8(a);
  var s0 = (a.s0 & 0xffff) >>> bits;
  var s1 = (a.s1 & 0xffff) >>> bits;
  var s2 = (a.s2 & 0xffff) >>> bits;
  var s3 = (a.s3 & 0xffff) >>> bits;
  var s4 = (a.s4 & 0xffff) >>> bits;
  var s5 = (a.s5 & 0xffff) >>> bits;
  var s6 = (a.s6 & 0xffff) >>> bits;
  var s7 = (a.s7 & 0xffff) >>> bits;
  return SIMD.int16x8(s0, s1, s2, s3, s4, s5, s6, s7);
}

/**
  * @param {int16x8} a An instance of int16x8.
  * @param {integer} bits Bit count to shift by.
  * @return {int16x8} lanes in a shifted by bits.
  */
SIMD.int16x8.shiftRightArithmeticByScalar = function(a, bits) {
  checkInt16x8(a);
  var s0 = a.s0 >> bits;
  var s1 = a.s1 >> bits;
  var s2 = a.s2 >> bits;
  var s3 = a.s3 >> bits;
  var s4 = a.s4 >> bits;
  var s5 = a.s5 >> bits;
  var s6 = a.s6 >> bits;
  var s7 = a.s7 >> bits;
  return SIMD.int16x8(s0, s1, s2, s3, s4, s5, s6, s7);
}

/**
  * @param {Typed array} tarray An instance of a typed array.
  * @param {Number} index An instance of Number.
  * @return {int16x8} New instance of int16x8.
  */
SIMD.int16x8.load = function(tarray, index) {
  if (!isTypedArray(tarray))
    throw new TypeError("The 1st argument must be a typed array.");
  if (!_PRIVATE.isNumber(index))
    throw new TypeError("The 2nd argument must be a Number.");
  var bpe = tarray.BYTES_PER_ELEMENT;
  if (index < 0 || (index * bpe + 16) > tarray.byteLength)
    throw new RangeError("The value of index is invalid.");
  var i16temp = _PRIVATE._i16x8;
  var array = bpe == 1 ? _PRIVATE._i8x16 :
              bpe == 2 ? i16temp :
              bpe == 4 ? (tarray instanceof Float32Array ? _PRIVATE._f32x4 : _PRIVATE._i32x4) :
              _PRIVATE._f64x2;
  var n = 16 / bpe;
  for (var i = 0; i < n; ++i)
    array[i] = tarray[index + i];
  return new SIMD.int16x8(i16temp[0], i16temp[1], i16temp[2], i16temp[3],
                          i16temp[4], i16temp[5], i16temp[6], i16temp[7]);
}

/**
  * @param {Typed array} tarray An instance of a typed array.
  * @param {Number} index An instance of Number.
  * @param {int16x8} value An instance of int16x8.
  * @return {void}
  */
SIMD.int16x8.store = function(tarray, index, value) {
  if (!isTypedArray(tarray))
    throw new TypeError("The 1st argument must be a typed array.");
  if (!isNumber(index))
    throw new TypeError("The 2nd argument must be a Number.");
  var bpe = tarray.BYTES_PER_ELEMENT;
  if (index < 0 || (index * bpe + 16) > tarray.byteLength)
    throw new RangeError("The value of index is invalid.");
  value = SIMD.int16x8(value);
  _PRIVATE._i16x8[0] = value.s0;
  _PRIVATE._i16x8[1] = value.s1;
  _PRIVATE._i16x8[2] = value.s2;
  _PRIVATE._i16x8[3] = value.s3;
  _PRIVATE._i16x8[4] = value.s4;
  _PRIVATE._i16x8[5] = value.s5;
  _PRIVATE._i16x8[6] = value.s6;
  _PRIVATE._i16x8[7] = value.s7;
  var array = bpe == 1 ? _PRIVATE._i8x16 :
              bpe == 2 ? _PRIVATE._i16x8 :
              bpe == 4 ? (tarray instanceof Float32Array ? _PRIVATE._f32x4 : _PRIVATE._i32x4) :
              _PRIVATE._f64x2;
  var n = 16 / bpe;
  for (var i = 0; i < n; ++i)
    tarray[index + i] = array[i];
}

/**
  * @param {int8x16} a An instance of int8x16.
  * @param {int8x16} b An instance of int8x16.
  * @return {int8x16} New instance of int8x16 with values of a & b.
  */
SIMD.int8x16.and = function(a, b) {
  checkInt8x16(a);
  checkInt8x16(b);
  return SIMD.int8x16(a.s0 & b.s0, a.s1 & b.s1, a.s2 & b.s2, a.s3 & b.s3,
                      a.s4 & b.s4, a.s5 & b.s5, a.s6 & b.s6, a.s7 & b.s7,
                      a.s8 & b.s8, a.s9 & b.s9, a.s10 & b.s10, a.s11 & b.s11,
                      a.s12 & b.s12, a.s13 & b.s13, a.s14 & b.s14, a.s15 & b.s15);
}

/**
  * @param {int8x16} a An instance of int8x16.
  * @param {int8x16} b An instance of int8x16.
  * @return {int8x16} New instance of int8x16 with values of a | b.
  */
SIMD.int8x16.or = function(a, b) {
  checkInt8x16(a);
  checkInt8x16(b);
  return SIMD.int8x16(a.s0 | b.s0, a.s1 | b.s1, a.s2 | b.s2, a.s3 | b.s3,
                      a.s4 | b.s4, a.s5 | b.s5, a.s6 | b.s6, a.s7 | b.s7,
                      a.s8 | b.s8, a.s9 | b.s9, a.s10 | b.s10, a.s11 | b.s11,
                      a.s12 | b.s12, a.s13 | b.s13, a.s14 | b.s14, a.s15 | b.s15);
}

/**
  * @param {int8x16} a An instance of int8x16.
  * @param {int8x16} b An instance of int8x16.
  * @return {int8x16} New instance of int8x16 with values of a ^ b.
  */
SIMD.int8x16.xor = function(a, b) {
  checkInt8x16(a);
  checkInt8x16(b);
  return SIMD.int8x16(a.s0 ^ b.s0, a.s1 ^ b.s1, a.s2 ^ b.s2, a.s3 ^ b.s3,
                      a.s4 ^ b.s4, a.s5 ^ b.s5, a.s6 ^ b.s6, a.s7 ^ b.s7,
                      a.s8 ^ b.s8, a.s9 ^ b.s9, a.s10 ^ b.s10, a.s11 ^ b.s11,
                      a.s12 ^ b.s12, a.s13 ^ b.s13, a.s14 ^ b.s14, a.s15 ^ b.s15);
}

/**
  * @param {int8x16} t An instance of int8x16.
  * @return {int8x16} New instance of int8x16 with values of ~t
  */
SIMD.int8x16.not = function(t) {
  checkInt8x16(t);
  return SIMD.int8x16(~t.s0, ~t.s1, ~t.s2, ~t.s3,
                      ~t.s4, ~t.s5, ~t.s6, ~t.s7,
                      ~t.s8, ~t.s9, ~t.s10, ~t.s11,
                      ~t.s12, ~t.s13, ~t.s14, ~t.s15);
}

/**
  * @param {int8x16} t An instance of int8x16.
  * @return {int8x16} New instance of int8x16 with values of -t
  */
SIMD.int8x16.neg = function(t) {
  checkInt8x16(t);
  return SIMD.int8x16(-t.s0, -t.s1, -t.s2, -t.s3,
                      -t.s4, -t.s5, -t.s6, -t.s7,
                      -t.s8, -t.s9, -t.s10, -t.s11,
                      -t.s12, -t.s13, -t.s14, -t.s15);
}

/**
  * @param {int8x16} a An instance of int8x16.
  * @param {int8x16} b An instance of int8x16.
  * @return {int8x16} New instance of int8x16 with values of a + b.
  */
SIMD.int8x16.add = function(a, b) {
  checkInt8x16(a);
  checkInt8x16(b);
  return SIMD.int8x16(a.s0 + b.s0, a.s1 + b.s1, a.s2 + b.s2, a.s3 + b.s3,
                      a.s4 + b.s4, a.s5 + b.s5, a.s6 + b.s6, a.s7 + b.s7,
                      a.s8 + b.s8, a.s9 + b.s9, a.s10 + b.s10, a.s11 + b.s11,
                      a.s12 + b.s12, a.s13 + b.s13, a.s14 + b.s14, a.s15 + b.s15);
}

/**
  * @param {int8x16} a An instance of int8x16.
  * @param {int8x16} b An instance of int8x16.
  * @return {int8x16} New instance of int8x16 with values of a - b.
  */
SIMD.int8x16.sub = function(a, b) {
  checkInt8x16(a);
  checkInt8x16(b);
  return SIMD.int8x16(a.s0 - b.s0, a.s1 - b.s1, a.s2 - b.s2, a.s3 - b.s3,
                      a.s4 - b.s4, a.s5 - b.s5, a.s6 - b.s6, a.s7 - b.s7,
                      a.s8 - b.s8, a.s9 - b.s9, a.s10 - b.s10, a.s11 - b.s11,
                      a.s12 - b.s12, a.s13 - b.s13, a.s14 - b.s14, a.s15 - b.s15);
}

/**
  * @param {int8x16} a An instance of int8x16.
  * @param {int8x16} b An instance of int8x16.
  * @return {int8x16} New instance of int8x16 with values of a * b.
  */
SIMD.int8x16.mul = function(a, b) {
  checkInt8x16(a);
  checkInt8x16(b);
  return SIMD.int8x16(Math.imul(a.s0, b.s0), Math.imul(a.s1, b.s1),
                      Math.imul(a.s2, b.s2), Math.imul(a.s3, b.s3),
                      Math.imul(a.s4, b.s4), Math.imul(a.s5, b.s5),
                      Math.imul(a.s6, b.s6), Math.imul(a.s7, b.s7),
                      Math.imul(a.s8, b.s8), Math.imul(a.s9, b.s9),
                      Math.imul(a.s10, b.s10), Math.imul(a.s11, b.s11),
                      Math.imul(a.s12, b.s12), Math.imul(a.s13, b.s13),
                      Math.imul(a.s14, b.s14), Math.imul(a.s15, b.s15));
}

/**
  * @param {int8x16} t Selector mask. An instance of int8x16
  * @param {int8x16} trueValue Pick lane from here if corresponding
  * selector lane is 0xFF
  * @param {int8x16} falseValue Pick lane from here if corresponding
  * selector lane is 0x0
  * @return {int8x16} Mix of lanes from trueValue or falseValue as
  * indicated
  */
SIMD.int8x16.select = function(t, trueValue, falseValue) {
  checkInt8x16(t);
  checkInt8x16(trueValue);
  checkInt8x16(falseValue);
  var tr = SIMD.int8x16.and(t, trueValue);
  var fr = SIMD.int8x16.and(SIMD.int8x16.not(t), falseValue);
  return SIMD.int8x16.or(tr, fr);
}

/**
  * @param {int8x16} t An instance of int8x16.
  * @param {int8x16} other An instance of int8x16.
  * @return {int8x16} 0xFF or 0x0 in each lane depending on
  * the result of t == other.
  */
SIMD.int8x16.equal = function(t, other) {
  checkInt8x16(t);
  checkInt8x16(other);
  var cs0 = t.s0 == other.s0;
  var cs1 = t.s1 == other.s1;
  var cs2 = t.s2 == other.s2;
  var cs3 = t.s3 == other.s3;
  var cs4 = t.s4 == other.s4;
  var cs5 = t.s5 == other.s5;
  var cs6 = t.s6 == other.s6;
  var cs7 = t.s7 == other.s7;
  var cs8 = t.s8 == other.s8;
  var cs9 = t.s9 == other.s9;
  var cs10 = t.s10 == other.s10;
  var cs11 = t.s11 == other.s11;
  var cs12 = t.s12 == other.s12;
  var cs13 = t.s13 == other.s13;
  var cs14 = t.s14 == other.s14;
  var cs15 = t.s15 == other.s15;
  return SIMD.int8x16.bool(cs0, cs1, cs2, cs3, cs4, cs5, cs6, cs7,
                           cs8, cs9, cs10, cs11, cs12, cs13, cs14, cs15);
}

/**
  * @param {int8x16} t An instance of int8x16.
  * @param {int8x16} other An instance of int8x16.
  * @return {int8x16} 0xFF or 0x0 in each lane depending on
  * the result of t > other.
  */
SIMD.int8x16.greaterThan = function(t, other) {
  checkInt8x16(t);
  checkInt8x16(other);
  var cs0 = t.s0 > other.s0;
  var cs1 = t.s1 > other.s1;
  var cs2 = t.s2 > other.s2;
  var cs3 = t.s3 > other.s3;
  var cs4 = t.s4 > other.s4;
  var cs5 = t.s5 > other.s5;
  var cs6 = t.s6 > other.s6;
  var cs7 = t.s7 > other.s7;
  var cs8 = t.s8 > other.s8;
  var cs9 = t.s9 > other.s9;
  var cs10 = t.s10 > other.s10;
  var cs11 = t.s11 > other.s11;
  var cs12 = t.s12 > other.s12;
  var cs13 = t.s13 > other.s13;
  var cs14 = t.s14 > other.s14;
  var cs15 = t.s15 > other.s15;
  return SIMD.int8x16.bool(cs0, cs1, cs2, cs3, cs4, cs5, cs6, cs7,
                           cs8, cs9, cs10, cs11, cs12, cs13, cs14, cs15);
}

/**
  * @param {int8x16} t An instance of int8x16.
  * @param {int8x16} other An instance of int8x16.
  * @return {int8x16} 0xFF or 0x0 in each lane depending on
  * the result of t < other.
  */
SIMD.int8x16.lessThan = function(t, other) {
  checkInt8x16(t);
  checkInt8x16(other);
  var cs0 = t.s0 < other.s0;
  var cs1 = t.s1 < other.s1;
  var cs2 = t.s2 < other.s2;
  var cs3 = t.s3 < other.s3;
  var cs4 = t.s4 < other.s4;
  var cs5 = t.s5 < other.s5;
  var cs6 = t.s6 < other.s6;
  var cs7 = t.s7 < other.s7;
  var cs8 = t.s8 < other.s8;
  var cs9 = t.s9 < other.s9;
  var cs10 = t.s10 < other.s10;
  var cs11 = t.s11 < other.s11;
  var cs12 = t.s12 < other.s12;
  var cs13 = t.s13 < other.s13;
  var cs14 = t.s14 < other.s14;
  var cs15 = t.s15 < other.s15;
  return SIMD.int8x16.bool(cs0, cs1, cs2, cs3, cs4, cs5, cs6, cs7,
                           cs8, cs9, cs10, cs11, cs12, cs13, cs14, cs15);
}

/**
  * @param {int8x16} a An instance of int8x16.
  * @param {integer} bits Bit count to shift by.
  * @return {int8x16} lanes in a shifted by bits.
  */
SIMD.int8x16.shiftLeftByScalar = function(a, bits) {
  checkInt8x16(a);
  var s0 = a.s0 << bits;
  var s1 = a.s1 << bits;
  var s2 = a.s2 << bits;
  var s3 = a.s3 << bits;
  var s4 = a.s4 << bits;
  var s5 = a.s5 << bits;
  var s6 = a.s6 << bits;
  var s7 = a.s7 << bits;
  var s8 = a.s8 << bits;
  var s9 = a.s9 << bits;
  var s10 = a.s10 << bits;
  var s11 = a.s11 << bits;
  var s12 = a.s12 << bits;
  var s13 = a.s13 << bits;
  var s14 = a.s14 << bits;
  var s15 = a.s15 << bits;
  return SIMD.int8x16(s0, s1, s2, s3, s4, s5, s6, s7,
                      s8, s9, s10, s11, s12, s13, s14, s15);
}

/**
  * @param {int8x16} a An instance of int8x16.
  * @param {integer} bits Bit count to shift by.
  * @return {int8x16} lanes in a shifted by bits.
  */
SIMD.int8x16.shiftRightLogicalByScalar = function(a, bits) {
  checkInt8x16(a);
  var s0 = (a.s0 & 0xff) >>> bits;
  var s1 = (a.s1 & 0xff) >>> bits;
  var s2 = (a.s2 & 0xff) >>> bits;
  var s3 = (a.s3 & 0xff) >>> bits;
  var s4 = (a.s4 & 0xff) >>> bits;
  var s5 = (a.s5 & 0xff) >>> bits;
  var s6 = (a.s6 & 0xff) >>> bits;
  var s7 = (a.s7 & 0xff) >>> bits;
  var s8 = (a.s8 & 0xff) >>> bits;
  var s9 = (a.s9 & 0xff) >>> bits;
  var s10 = (a.s10 & 0xff) >>> bits;
  var s11 = (a.s11 & 0xff) >>> bits;
  var s12 = (a.s12 & 0xff) >>> bits;
  var s13 = (a.s13 & 0xff) >>> bits;
  var s14 = (a.s14 & 0xff) >>> bits;
  var s15 = (a.s15 & 0xff) >>> bits;
  return SIMD.int8x16(s0, s1, s2, s3, s4, s5, s6, s7,
                      s8, s9, s10, s11, s12, s13, s14, s15);
}

/**
  * @param {int8x16} a An instance of int8x16.
  * @param {integer} bits Bit count to shift by.
  * @return {int8x16} lanes in a shifted by bits.
  */
SIMD.int8x16.shiftRightArithmeticByScalar = function(a, bits) {
  checkInt8x16(a);
  var s0 = a.s0 >> bits;
  var s1 = a.s1 >> bits;
  var s2 = a.s2 >> bits;
  var s3 = a.s3 >> bits;
  var s4 = a.s4 >> bits;
  var s5 = a.s5 >> bits;
  var s6 = a.s6 >> bits;
  var s7 = a.s7 >> bits;
  var s8 = a.s8 >> bits;
  var s9 = a.s9 >> bits;
  var s10 = a.s10 >> bits;
  var s11 = a.s11 >> bits;
  var s12 = a.s12 >> bits;
  var s13 = a.s13 >> bits;
  var s14 = a.s14 >> bits;
  var s15 = a.s15 >> bits;
  return SIMD.int8x16(s0, s1, s2, s3, s4, s5, s6, s7,
                      s8, s9, s10, s11, s12, s13, s14, s15);
}

/**
  * @param {Typed array} buffer An instance of a typed array.
  * @param {Number} index An instance of Number.
  * @return {int8x16} New instance of int8x16.
  */
SIMD.int8x16.load = function(tarray, index) {
  if (!isTypedArray(tarray))
    throw new TypeError("The 1st argument must be a typed array.");
  if (!_PRIVATE.isNumber(index))
    throw new TypeError("The 2nd argument must be a Number.");
  var bpe = tarray.BYTES_PER_ELEMENT;
  if (index < 0 || (index * bpe + 16) > tarray.byteLength)
    throw new RangeError("The value of index is invalid.");
  var i8temp = _PRIVATE._i16x8;
  var array = bpe == 1 ? i8temp :
              bpe == 2 ? _PRIVATE._i16x8 :
              bpe == 4 ? (tarray instanceof Float32Array ? _PRIVATE._f32x4 : _PRIVATE._i32x4) :
              _PRIVATE._f64x2;
  var n = 16 / bpe;
  for (var i = 0; i < n; ++i)
    array[i] = tarray[index + i];
  return new SIMD.int8x16(i8temp[0], i8temp[1], i8temp[2], i8temp[3],
                          i8temp[4], i8temp[5], i8temp[6], i8temp[7],
                          i8temp[8], i8temp[9], i8temp[10], i8temp[11],
                          i8temp[12], i8temp[13], i8temp[14], i8temp[15]);
}

/**
  * @param {Typed array} tarray An instance of a typed array.
  * @param {Number} index An instance of Number.
  * @param {int8x16} value An instance of int8x16.
  * @return {void}
  */
SIMD.int8x16.store = function(tarray, index, value) {
  if (!isTypedArray(tarray))
    throw new TypeError("The 1st argument must be a typed array.");
  if (!isNumber(index))
    throw new TypeError("The 2nd argument must be a Number.");
  var bpe = tarray.BYTES_PER_ELEMENT;
  if (index < 0 || (index * bpe + 16) > tarray.byteLength)
    throw new RangeError("The value of index is invalid.");
  value = SIMD.int8x16(value);
  _PRIVATE._i8x16[0] = value.s0;
  _PRIVATE._i8x16[1] = value.s1;
  _PRIVATE._i8x16[2] = value.s2;
  _PRIVATE._i8x16[3] = value.s3;
  _PRIVATE._i8x16[4] = value.s4;
  _PRIVATE._i8x16[5] = value.s5;
  _PRIVATE._i8x16[6] = value.s6;
  _PRIVATE._i8x16[7] = value.s7;
  _PRIVATE._i8x16[8] = value.s8;
  _PRIVATE._i8x16[9] = value.s9;
  _PRIVATE._i8x16[10] = value.s10;
  _PRIVATE._i8x16[11] = value.s11;
  _PRIVATE._i8x16[12] = value.s12;
  _PRIVATE._i8x16[13] = value.s13;
  _PRIVATE._i8x16[14] = value.s14;
  _PRIVATE._i8x16[15] = value.s15;
  var array = bpe == 1 ? _PRIVATE._i8x16 :
              bpe == 2 ? _PRIVATE._i16x8 :
              bpe == 4 ? (tarray instanceof Float32Array ? _PRIVATE._f32x4 : _PRIVATE._i32x4) :
              _PRIVATE._f64x2;
  var n = 16 / bpe;
  for (var i = 0; i < n; ++i)
    tarray[index + i] = array[i];
}

Object.defineProperty(SIMD.float32x4.prototype, 'x', {
  get: function() { return this.x_; }
});

Object.defineProperty(SIMD.float32x4.prototype, 'y', {
  get: function() { return this.y_; }
});

Object.defineProperty(SIMD.float32x4.prototype, 'z', {
  get: function() { return this.z_; }
});

Object.defineProperty(SIMD.float32x4.prototype, 'w', {
  get: function() { return this.w_; }
});

/**
  * Extract the sign bit from each lane return them in the first 4 bits.
  */
Object.defineProperty(SIMD.float32x4.prototype, 'signMask', {
  get: function() {
    var mx = (this.x < 0.0 || 1/this.x === -Infinity);
    var my = (this.y < 0.0 || 1/this.y === -Infinity);
    var mz = (this.z < 0.0 || 1/this.z === -Infinity);
    var mw = (this.w < 0.0 || 1/this.w === -Infinity);
    return mx | my << 1 | mz << 2 | mw << 3;
  }
});

Object.defineProperty(SIMD.float64x2.prototype, 'x', {
  get: function() { return this.x_; }
});

Object.defineProperty(SIMD.float64x2.prototype, 'y', {
  get: function() { return this.y_; }
});

/**
  * Extract the sign bit from each lane return them in the first 2 bits.
  */
Object.defineProperty(SIMD.float64x2.prototype, 'signMask', {
  get: function() {
    var mx = (this.x < 0.0 || 1/this.x === -Infinity);
    var my = (this.y < 0.0 || 1/this.y === -Infinity);
    return mx | my << 1;
  }
});

Object.defineProperty(SIMD.int32x4.prototype, 'x', {
  get: function() { return this.x_; }
});

Object.defineProperty(SIMD.int32x4.prototype, 'y', {
  get: function() { return this.y_; }
});

Object.defineProperty(SIMD.int32x4.prototype, 'z', {
  get: function() { return this.z_; }
});

Object.defineProperty(SIMD.int32x4.prototype, 'w', {
  get: function() { return this.w_; }
});

Object.defineProperty(SIMD.int32x4.prototype, 'flagX', {
  get: function() { return _PRIVATE.tobool(this.x_); }
});

Object.defineProperty(SIMD.int32x4.prototype, 'flagY', {
  get: function() { return _PRIVATE.tobool(this.y_); }
});

Object.defineProperty(SIMD.int32x4.prototype, 'flagZ', {
  get: function() { return _PRIVATE.tobool(this.z_); }
});

Object.defineProperty(SIMD.int32x4.prototype, 'flagW', {
  get: function() { return _PRIVATE.tobool(this.w_); }
});

/**
  * Extract the sign bit from each lane return them in the first 4 bits.
  */
Object.defineProperty(SIMD.int32x4.prototype, 'signMask', {
  get: function() {
    var mx = _PRIVATE.tobool(this.x_);
    var my = _PRIVATE.tobool(this.y_);
    var mz = _PRIVATE.tobool(this.z_);
    var mw = _PRIVATE.tobool(this.w_);
    return mx | my << 1 | mz << 2 | mw << 3;
  }
});

Object.defineProperty(SIMD.int16x8.prototype, 's0', {
  get: function() { return this.s0_; }
});

Object.defineProperty(SIMD.int16x8.prototype, 's1', {
  get: function() { return this.s1_; }
});

Object.defineProperty(SIMD.int16x8.prototype, 's2', {
  get: function() { return this.s2_; }
});

Object.defineProperty(SIMD.int16x8.prototype, 's3', {
  get: function() { return this.s3_; }
});

Object.defineProperty(SIMD.int16x8.prototype, 's4', {
  get: function() { return this.s4_; }
});

Object.defineProperty(SIMD.int16x8.prototype, 's5', {
  get: function() { return this.s5_; }
});

Object.defineProperty(SIMD.int16x8.prototype, 's6', {
  get: function() { return this.s6_; }
});

Object.defineProperty(SIMD.int16x8.prototype, 's7', {
  get: function() { return this.s7_; }
});

/**
  * Extract the sign bit from each lane return them in the first 8 bits.
  */
Object.defineProperty(SIMD.int16x8.prototype, 'signMask', {
  get: function() {
    var ms0 = (this.s0_ & 0x8000) >>> 15;
    var ms1 = (this.s1_ & 0x8000) >>> 15;
    var ms2 = (this.s2_ & 0x8000) >>> 15;
    var ms3 = (this.s3_ & 0x8000) >>> 15;
    var ms4 = (this.s4_ & 0x8000) >>> 15;
    var ms5 = (this.s5_ & 0x8000) >>> 15;
    var ms6 = (this.s6_ & 0x8000) >>> 15;
    var ms7 = (this.s7_ & 0x8000) >>> 15;
    return ms0 | ms1 << 1 | ms2 << 2 | ms3 << 3 |
           ms4 << 4 | ms5 << 5 | ms6 << 6 | ms7 << 7;
  }
});

Object.defineProperty(SIMD.int8x16.prototype, 's0', {
  get: function() { return this.s0_; }
});

Object.defineProperty(SIMD.int8x16.prototype, 's1', {
  get: function() { return this.s1_; }
});

Object.defineProperty(SIMD.int8x16.prototype, 's2', {
  get: function() { return this.s2_; }
});

Object.defineProperty(SIMD.int8x16.prototype, 's3', {
  get: function() { return this.s3_; }
});

Object.defineProperty(SIMD.int8x16.prototype, 's4', {
  get: function() { return this.s4_; }
});

Object.defineProperty(SIMD.int8x16.prototype, 's5', {
  get: function() { return this.s5_; }
});

Object.defineProperty(SIMD.int8x16.prototype, 's6', {
  get: function() { return this.s6_; }
});

Object.defineProperty(SIMD.int8x16.prototype, 's7', {
  get: function() { return this.s7_; }
});

Object.defineProperty(SIMD.int8x16.prototype, 's8', {
  get: function() { return this.s8_; }
});

Object.defineProperty(SIMD.int8x16.prototype, 's9', {
  get: function() { return this.s9_; }
});

Object.defineProperty(SIMD.int8x16.prototype, 's10', {
  get: function() { return this.s10_; }
});

Object.defineProperty(SIMD.int8x16.prototype, 's11', {
  get: function() { return this.s11_; }
});

Object.defineProperty(SIMD.int8x16.prototype, 's12', {
  get: function() { return this.s12_; }
});

Object.defineProperty(SIMD.int8x16.prototype, 's13', {
  get: function() { return this.s13_; }
});

Object.defineProperty(SIMD.int8x16.prototype, 's14', {
  get: function() { return this.s14_; }
});

Object.defineProperty(SIMD.int8x16.prototype, 's15', {
  get: function() { return this.s15_; }
});

/**
  * Extract the sign bit from each lane return them in the first 16 bits.
  */
Object.defineProperty(SIMD.int8x16.prototype, 'signMask', {
  get: function() {
    var ms0 = (this.s0_ & 0x80) >>> 7;
    var ms1 = (this.s1_ & 0x80) >>> 7;
    var ms2 = (this.s2_ & 0x80) >>> 7;
    var ms3 = (this.s3_ & 0x80) >>> 7;
    var ms4 = (this.s4_ & 0x80) >>> 7;
    var ms5 = (this.s5_ & 0x80) >>> 7;
    var ms6 = (this.s6_ & 0x80) >>> 7;
    var ms7 = (this.s7_ & 0x80) >>> 7;
    var ms8 = (this.s8_ & 0x80) >>> 7;
    var ms9 = (this.s9_ & 0x80) >>> 7;
    var ms10 = (this.s10_ & 0x80) >>> 7;
    var ms11 = (this.s11_ & 0x80) >>> 7;
    var ms12 = (this.s12_ & 0x80) >>> 7;
    var ms13 = (this.s13_ & 0x80) >>> 7;
    var ms14 = (this.s14_ & 0x80) >>> 7;
    var ms15 = (this.s15_ & 0x80) >>> 7;
    return ms0 | ms1 << 1 | ms2 << 2 | ms3 << 3 |
           ms4 << 4 | ms5 << 5 | ms6 << 6 | ms7 << 7 |
           ms8 << 8 | ms9 << 9 | ms10 << 10 | ms11 << 11 |
           ms12 << 12 | ms13 << 13 | ms14 << 14 | ms15 << 15;
  }
});

function isNumber(o) {
    return typeof o == "number" || (typeof o == "object" && o.constructor === Number);
}

function isTypedArray(o) {
  return (o instanceof Int8Array) ||
         (o instanceof Uint8Array) ||
         (o instanceof Uint8ClampedArray) ||
         (o instanceof Int16Array) ||
         (o instanceof Uint16Array) ||
         (o instanceof Int32Array) ||
         (o instanceof Uint32Array) ||
         (o instanceof Float32Array) ||
         (o instanceof Float64Array) ||
         (o instanceof Int32x4Array) ||
         (o instanceof Float32x4Array);
}

function isArrayBuffer(o) {
  return (o instanceof ArrayBuffer);
}

function Float32x4Array(a, b, c) {
  if (isNumber(a)) {
    this.storage_ = new Float32Array(a*4);
    this.length_ = a;
    this.byteOffset_ = 0;
    return;
  } else if (isTypedArray(a)) {
    if (!(a instanceof Float32x4Array)) {
      throw "Copying typed array of non-Float32x4Array is unimplemented.";
    }
    this.storage_ = new Float32Array(a.length * 4);
    this.length_ = a.length;
    this.byteOffset_ = 0;
    // Copy floats.
    for (var i = 0; i < a.length*4; i++) {
      this.storage_[i] = a.storage_[i];
    }
  } else if (isArrayBuffer(a)) {
    if ((b != undefined) && (b % Float32x4Array.BYTES_PER_ELEMENT) != 0) {
      throw "byteOffset must be a multiple of 16.";
    }
    if (c != undefined) {
      c *= 4;
      this.storage_ = new Float32Array(a, b, c);
    }
    else {
      // Note: new Float32Array(a, b) is NOT equivalent to new Float32Array(a, b, undefined)
      this.storage_ = new Float32Array(a, b);
    }
    this.length_ = this.storage_.length / 4;
    this.byteOffset_ = b != undefined ? b : 0;
  } else {
    throw "Unknown type of first argument.";
  }
}

Object.defineProperty(Float32x4Array.prototype, 'length', {
  get: function() { return this.length_; }
});

Object.defineProperty(Float32x4Array.prototype, 'byteLength', {
  get: function() { return this.length_ * Float32x4Array.BYTES_PER_ELEMENT; }
});

Object.defineProperty(Float32x4Array, 'BYTES_PER_ELEMENT', {
  get: function() { return 16; }
});

Object.defineProperty(Float32x4Array.prototype, 'BYTES_PER_ELEMENT', {
  get: function() { return 16; }
});

Object.defineProperty(Float32x4Array.prototype, 'byteOffset', {
  get: function() { return this.byteOffset_; }
});

Object.defineProperty(Float32x4Array.prototype, 'buffer', {
  get: function() { return this.storage_.buffer; }
});

Float32x4Array.prototype.getAt = function(i) {
  if (i < 0) {
    throw "Index must be >= 0.";
  }
  if (i >= this.length) {
    throw "Index out of bounds.";
  }
  var x = this.storage_[i*4+0];
  var y = this.storage_[i*4+1];
  var z = this.storage_[i*4+2];
  var w = this.storage_[i*4+3];
  return SIMD.float32x4(x, y, z, w);
}

Float32x4Array.prototype.setAt = function(i, v) {
  if (i < 0) {
    throw "Index must be >= 0.";
  }
  if (i >= this.length) {
    throw "Index out of bounds.";
  }
  if (!(v instanceof SIMD.float32x4)) {
    throw "Value is not a float32x4.";
  }
  this.storage_[i*4+0] = v.x;
  this.storage_[i*4+1] = v.y;
  this.storage_[i*4+2] = v.z;
  this.storage_[i*4+3] = v.w;
}


function Int32x4Array(a, b, c) {

  function isNumber(o) {
      return typeof o == "number" || (typeof o == "object" && o.constructor === Number);
  }

  function isTypedArray(o) {
    return (o instanceof Int8Array) ||
           (o instanceof Uint8Array) ||
           (o instanceof Uint8ClampedArray) ||
           (o instanceof Int16Array) ||
           (o instanceof Uint16Array) ||
           (o instanceof Int32Array) ||
           (o instanceof Uint32Array) ||
           (o instanceof Float32Array) ||
           (o instanceof Float64Array) ||
           (o instanceof Int32x4Array) ||
           (o instanceof Float32x4Array);
  }

  function isArrayBuffer(o) {
    return (o instanceof ArrayBuffer);
  }

  if (isNumber(a)) {
    this.storage_ = new Int32Array(a*4);
    this.length_ = a;
    this.byteOffset_ = 0;
    return;
  } else if (isTypedArray(a)) {
    if (!(a instanceof Int32x4Array)) {
      throw "Copying typed array of non-Int32x4Array is unimplemented.";
    }
    this.storage_ = new Int32Array(a.length * 4);
    this.length_ = a.length;
    this.byteOffset_ = 0;
    // Copy ints.
    for (var i = 0; i < a.length*4; i++) {
      this.storage_[i] = a.storage_[i];
    }
  } else if (isArrayBuffer(a)) {
    if ((b != undefined) && (b % Int32x4Array.BYTES_PER_ELEMENT) != 0) {
      throw "byteOffset must be a multiple of 16.";
    }
    if (c != undefined) {
      c *= 4;
      this.storage_ = new Int32Array(a, b, c);
    }
    else {
      // Note: new Int32Array(a, b) is NOT equivalent to new Int32Array(a, b, undefined)
      this.storage_ = new Int32Array(a, b);
    }
    this.length_ = this.storage_.length / 4;
    this.byteOffset_ = b != undefined ? b : 0;
  } else {
    throw "Unknown type of first argument.";
  }
}

Object.defineProperty(Int32x4Array.prototype, 'length', {
  get: function() { return this.length_; }
});

Object.defineProperty(Int32x4Array.prototype, 'byteLength', {
  get: function() { return this.length_ * Int32x4Array.BYTES_PER_ELEMENT; }
});

Object.defineProperty(Int32x4Array, 'BYTES_PER_ELEMENT', {
  get: function() { return 16; }
});

Object.defineProperty(Int32x4Array.prototype, 'BYTES_PER_ELEMENT', {
  get: function() { return 16; }
});

Object.defineProperty(Int32x4Array.prototype, 'byteOffset', {
  get: function() { return this.byteOffset_; }
});

Object.defineProperty(Int32x4Array.prototype, 'buffer', {
  get: function() { return this.storage_.buffer; }
});

Int32x4Array.prototype.getAt = function(i) {
  if (i < 0) {
    throw "Index must be >= 0.";
  }
  if (i >= this.length) {
    throw "Index out of bounds.";
  }
  var x = this.storage_[i*4+0];
  var y = this.storage_[i*4+1];
  var z = this.storage_[i*4+2];
  var w = this.storage_[i*4+3];
  return SIMD.int32x4(x, y, z, w);
}

Int32x4Array.prototype.setAt = function(i, v) {
  if (i < 0) {
    throw "Index must be >= 0.";
  }
  if (i >= this.length) {
    throw "Index out of bounds.";
  }
  if (!(v instanceof SIMD.int32x4)) {
    throw "Value is not a int32x4.";
  }
  this.storage_[i*4+0] = v.x;
  this.storage_[i*4+1] = v.y;
  this.storage_[i*4+2] = v.z;
  this.storage_[i*4+3] = v.w;
}

function isDataView(v) {
  return v instanceof DataView;
}

DataView.prototype.getFloat32x4 = function(byteOffset, littleEndian) {
  if (!isDataView(this))
    throw new TypeError("This is not a DataView.");
  if (byteOffset < 0 || (byteOffset + 16) > this.buffer.byteLength)
    throw new RangeError("The value of byteOffset is invalid.");
  if (typeof littleEndian == 'undefined')
    littleEndian = false;
  return SIMD.float32x4(this.getFloat32(byteOffset, littleEndian),
                        this.getFloat32(byteOffset + 4, littleEndian),
                        this.getFloat32(byteOffset + 8, littleEndian),
                        this.getFloat32(byteOffset + 12, littleEndian));
}

DataView.prototype.getFloat64x2 = function(byteOffset, littleEndian) {
  if (!isDataView(this))
    throw new TypeError("This is not a DataView.");
  if (byteOffset < 0 || (byteOffset + 16) > this.buffer.byteLength)
    throw new RangeError("The value of byteOffset is invalid.");
  if (typeof littleEndian == 'undefined')
    littleEndian = false;
  return SIMD.float64x2(this.getFloat64(byteOffset, littleEndian),
                        this.getFloat64(byteOffset + 8, littleEndian));
}

DataView.prototype.getInt32x4 = function(byteOffset, littleEndian) {
  if (!isDataView(this))
    throw new TypeError("This is not a DataView.");
  if (byteOffset < 0 || (byteOffset + 16) > this.buffer.byteLength)
    throw new RangeError("The value of byteOffset is invalid.");
  if (typeof littleEndian == 'undefined')
    littleEndian = false;
  return SIMD.int32x4(this.getInt32(byteOffset, littleEndian),
                      this.getInt32(byteOffset + 4, littleEndian),
                      this.getInt32(byteOffset + 8, littleEndian),
                      this.getInt32(byteOffset + 12, littleEndian));
}

DataView.prototype.getInt16x8 = function(byteOffset, littleEndian) {
  if (!isDataView(this))
    throw new TypeError("This is not a DataView.");
  if (byteOffset < 0 || (byteOffset + 16) > this.buffer.byteLength)
    throw new RangeError("The value of byteOffset is invalid.");
  if (typeof littleEndian == 'undefined')
    littleEndian = false;
  return SIMD.int16x8(this.getInt16(byteOffset, littleEndian),
                      this.getInt16(byteOffset + 2, littleEndian),
                      this.getInt16(byteOffset + 4, littleEndian),
                      this.getInt16(byteOffset + 6, littleEndian),
                      this.getInt16(byteOffset + 8, littleEndian),
                      this.getInt16(byteOffset + 10, littleEndian),
                      this.getInt16(byteOffset + 12, littleEndian),
                      this.getInt16(byteOffset + 14, littleEndian));
}

DataView.prototype.getInt8x16 = function(byteOffset, littleEndian) {
  if (!isDataView(this))
    throw new TypeError("This is not a DataView.");
  if (byteOffset < 0 || (byteOffset + 16) > this.buffer.byteLength)
    throw new RangeError("The value of byteOffset is invalid.");
  if (typeof littleEndian == 'undefined')
    littleEndian = false;
  return SIMD.int8x16(this.getInt8(byteOffset, littleEndian),
                      this.getInt8(byteOffset + 1, littleEndian),
                      this.getInt8(byteOffset + 2, littleEndian),
                      this.getInt8(byteOffset + 3, littleEndian),
                      this.getInt8(byteOffset + 4, littleEndian),
                      this.getInt8(byteOffset + 5, littleEndian),
                      this.getInt8(byteOffset + 6, littleEndian),
                      this.getInt8(byteOffset + 7, littleEndian),
                      this.getInt8(byteOffset + 8, littleEndian),
                      this.getInt8(byteOffset + 9, littleEndian),
                      this.getInt8(byteOffset + 10, littleEndian),
                      this.getInt8(byteOffset + 11, littleEndian),
                      this.getInt8(byteOffset + 12, littleEndian),
                      this.getInt8(byteOffset + 13, littleEndian),
                      this.getInt8(byteOffset + 14, littleEndian),
                      this.getInt8(byteOffset + 15, littleEndian));
}

DataView.prototype.setFloat32x4 = function(byteOffset, value, littleEndian) {
  if (!isDataView(this))
    throw new TypeError("This is not a DataView.");
  if (byteOffset < 0 || (byteOffset + 16) > this.buffer.byteLength)
    throw new RangeError("The value of byteOffset is invalid.");
  checkFloat32x4(value);
  if (typeof littleEndian == 'undefined')
    littleEndian = false;
  this.setFloat32(byteOffset, value.x, littleEndian);
  this.setFloat32(byteOffset + 4, value.y, littleEndian);
  this.setFloat32(byteOffset + 8, value.z, littleEndian);
  this.setFloat32(byteOffset + 12, value.w, littleEndian);
}

DataView.prototype.setFloat64x2 = function(byteOffset, value, littleEndian) {
  if (!isDataView(this))
    throw new TypeError("This is not a DataView.");
  if (byteOffset < 0 || (byteOffset + 16) > this.buffer.byteLength)
    throw new RangeError("The value of byteOffset is invalid.");
  checkFloat64x2(value);
  if (typeof littleEndian == 'undefined')
    littleEndian = false;
  this.setFloat64(byteOffset, value.x, littleEndian);
  this.setFloat64(byteOffset + 8, value.y, littleEndian);
}

DataView.prototype.setInt32x4 = function(byteOffset, value, littleEndian) {
  if (!isDataView(this))
    throw new TypeError("This is not a DataView.");
  if (byteOffset < 0 || (byteOffset + 16) > this.buffer.byteLength)
    throw new RangeError("The value of byteOffset is invalid.");
  checkInt32x4(value);
  if (typeof littleEndian == 'undefined')
    littleEndian = false;
  this.setInt32(byteOffset, value.x, littleEndian);
  this.setInt32(byteOffset + 4, value.y, littleEndian);
  this.setInt32(byteOffset + 8, value.z, littleEndian);
  this.setInt32(byteOffset + 12, value.w, littleEndian);
}

DataView.prototype.setInt16x8 = function(byteOffset, value, littleEndian) {
  if (!isDataView(this))
    throw new TypeError("This is not a DataView.");
  if (byteOffset < 0 || (byteOffset + 16) > this.buffer.byteLength)
    throw new RangeError("The value of byteOffset is invalid.");
  checkInt16x8(value);
  if (typeof littleEndian == 'undefined')
    littleEndian = false;
  this.setInt16(byteOffset, value.s0, littleEndian);
  this.setInt16(byteOffset + 2, value.s1, littleEndian);
  this.setInt16(byteOffset + 4, value.s2, littleEndian);
  this.setInt16(byteOffset + 6, value.s3, littleEndian);
  this.setInt16(byteOffset + 8, value.s4, littleEndian);
  this.setInt16(byteOffset + 10, value.s5, littleEndian);
  this.setInt16(byteOffset + 12, value.s6, littleEndian);
  this.setInt16(byteOffset + 14, value.s7, littleEndian);
}

DataView.prototype.setInt8x16 = function(byteOffset, value, littleEndian) {
  if (!isDataView(this))
    throw new TypeError("This is not a DataView.");
  if (byteOffset < 0 || (byteOffset + 16) > this.buffer.byteLength)
    throw new RangeError("The value of byteOffset is invalid.");
  checkInt8x16(value);
  if (typeof littleEndian == 'undefined')
    littleEndian = false;
  this.setInt8(byteOffset, value.s0, littleEndian);
  this.setInt8(byteOffset + 1, value.s1, littleEndian);
  this.setInt8(byteOffset + 2, value.s2, littleEndian);
  this.setInt8(byteOffset + 3, value.s3, littleEndian);
  this.setInt8(byteOffset + 4, value.s4, littleEndian);
  this.setInt8(byteOffset + 5, value.s5, littleEndian);
  this.setInt8(byteOffset + 6, value.s6, littleEndian);
  this.setInt8(byteOffset + 7, value.s7, littleEndian);
  this.setInt8(byteOffset + 8, value.s8, littleEndian);
  this.setInt8(byteOffset + 9, value.s9, littleEndian);
  this.setInt8(byteOffset + 10, value.s10, littleEndian);
  this.setInt8(byteOffset + 11, value.s11, littleEndian);
  this.setInt8(byteOffset + 12, value.s12, littleEndian);
  this.setInt8(byteOffset + 13, value.s13, littleEndian);
  this.setInt8(byteOffset + 14, value.s14, littleEndian);
  this.setInt8(byteOffset + 15, value.s15, littleEndian);
}
