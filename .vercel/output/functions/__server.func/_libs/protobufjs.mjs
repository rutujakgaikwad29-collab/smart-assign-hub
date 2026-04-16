import { c as commonjsGlobal } from "./react.mjs";
import { r as requireAspromise } from "./protobufjs__aspromise.mjs";
import { r as requireBase64 } from "./protobufjs__base64.mjs";
import { r as requireEventemitter } from "./protobufjs__eventemitter.mjs";
import { r as requireFloat } from "./protobufjs__float.mjs";
import { r as requireInquire } from "./protobufjs__inquire.mjs";
import { r as requireUtf8 } from "./protobufjs__utf8.mjs";
import { r as requirePool } from "./protobufjs__pool.mjs";
import { r as requireCodegen } from "./protobufjs__codegen.mjs";
import { r as requireFetch } from "./protobufjs__fetch.mjs";
import { r as requirePath } from "./protobufjs__path.mjs";
var src = { exports: {} };
var indexLight = { exports: {} };
var indexMinimal = {};
var minimal = {};
var longbits;
var hasRequiredLongbits;
function requireLongbits() {
  if (hasRequiredLongbits) return longbits;
  hasRequiredLongbits = 1;
  longbits = LongBits;
  var util2 = requireMinimal();
  function LongBits(lo, hi) {
    this.lo = lo >>> 0;
    this.hi = hi >>> 0;
  }
  var zero = LongBits.zero = new LongBits(0, 0);
  zero.toNumber = function() {
    return 0;
  };
  zero.zzEncode = zero.zzDecode = function() {
    return this;
  };
  zero.length = function() {
    return 1;
  };
  var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";
  LongBits.fromNumber = function fromNumber(value) {
    if (value === 0)
      return zero;
    var sign = value < 0;
    if (sign)
      value = -value;
    var lo = value >>> 0, hi = (value - lo) / 4294967296 >>> 0;
    if (sign) {
      hi = ~hi >>> 0;
      lo = ~lo >>> 0;
      if (++lo > 4294967295) {
        lo = 0;
        if (++hi > 4294967295)
          hi = 0;
      }
    }
    return new LongBits(lo, hi);
  };
  LongBits.from = function from(value) {
    if (typeof value === "number")
      return LongBits.fromNumber(value);
    if (util2.isString(value)) {
      if (util2.Long)
        value = util2.Long.fromString(value);
      else
        return LongBits.fromNumber(parseInt(value, 10));
    }
    return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
  };
  LongBits.prototype.toNumber = function toNumber(unsigned) {
    if (!unsigned && this.hi >>> 31) {
      var lo = ~this.lo + 1 >>> 0, hi = ~this.hi >>> 0;
      if (!lo)
        hi = hi + 1 >>> 0;
      return -(lo + hi * 4294967296);
    }
    return this.lo + this.hi * 4294967296;
  };
  LongBits.prototype.toLong = function toLong(unsigned) {
    return util2.Long ? new util2.Long(this.lo | 0, this.hi | 0, Boolean(unsigned)) : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
  };
  var charCodeAt = String.prototype.charCodeAt;
  LongBits.fromHash = function fromHash(hash) {
    if (hash === zeroHash)
      return zero;
    return new LongBits(
      (charCodeAt.call(hash, 0) | charCodeAt.call(hash, 1) << 8 | charCodeAt.call(hash, 2) << 16 | charCodeAt.call(hash, 3) << 24) >>> 0,
      (charCodeAt.call(hash, 4) | charCodeAt.call(hash, 5) << 8 | charCodeAt.call(hash, 6) << 16 | charCodeAt.call(hash, 7) << 24) >>> 0
    );
  };
  LongBits.prototype.toHash = function toHash() {
    return String.fromCharCode(
      this.lo & 255,
      this.lo >>> 8 & 255,
      this.lo >>> 16 & 255,
      this.lo >>> 24,
      this.hi & 255,
      this.hi >>> 8 & 255,
      this.hi >>> 16 & 255,
      this.hi >>> 24
    );
  };
  LongBits.prototype.zzEncode = function zzEncode() {
    var mask = this.hi >> 31;
    this.hi = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
    this.lo = (this.lo << 1 ^ mask) >>> 0;
    return this;
  };
  LongBits.prototype.zzDecode = function zzDecode() {
    var mask = -(this.lo & 1);
    this.lo = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
    this.hi = (this.hi >>> 1 ^ mask) >>> 0;
    return this;
  };
  LongBits.prototype.length = function length() {
    var part0 = this.lo, part1 = (this.lo >>> 28 | this.hi << 4) >>> 0, part2 = this.hi >>> 24;
    return part2 === 0 ? part1 === 0 ? part0 < 16384 ? part0 < 128 ? 1 : 2 : part0 < 2097152 ? 3 : 4 : part1 < 16384 ? part1 < 128 ? 5 : 6 : part1 < 2097152 ? 7 : 8 : part2 < 128 ? 9 : 10;
  };
  return longbits;
}
var hasRequiredMinimal;
function requireMinimal() {
  if (hasRequiredMinimal) return minimal;
  hasRequiredMinimal = 1;
  (function(exports$1) {
    var util2 = exports$1;
    util2.asPromise = requireAspromise();
    util2.base64 = requireBase64();
    util2.EventEmitter = requireEventemitter();
    util2.float = requireFloat();
    util2.inquire = requireInquire();
    util2.utf8 = requireUtf8();
    util2.pool = requirePool();
    util2.LongBits = requireLongbits();
    util2.isNode = Boolean(typeof commonjsGlobal !== "undefined" && commonjsGlobal && commonjsGlobal.process && commonjsGlobal.process.versions && commonjsGlobal.process.versions.node);
    util2.global = util2.isNode && commonjsGlobal || typeof window !== "undefined" && window || typeof self !== "undefined" && self || minimal;
    util2.emptyArray = Object.freeze ? Object.freeze([]) : (
      /* istanbul ignore next */
      []
    );
    util2.emptyObject = Object.freeze ? Object.freeze({}) : (
      /* istanbul ignore next */
      {}
    );
    util2.isInteger = Number.isInteger || /* istanbul ignore next */
    function isInteger(value) {
      return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
    };
    util2.isString = function isString(value) {
      return typeof value === "string" || value instanceof String;
    };
    util2.isObject = function isObject(value) {
      return value && typeof value === "object";
    };
    util2.isset = /**
     * Checks if a property on a message is considered to be present.
     * @param {Object} obj Plain object or message instance
     * @param {string} prop Property name
     * @returns {boolean} `true` if considered to be present, otherwise `false`
     */
    util2.isSet = function isSet(obj, prop) {
      var value = obj[prop];
      if (value != null && obj.hasOwnProperty(prop))
        return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
      return false;
    };
    util2.Buffer = (function() {
      try {
        var Buffer = util2.inquire("buffer").Buffer;
        return Buffer.prototype.utf8Write ? Buffer : (
          /* istanbul ignore next */
          null
        );
      } catch (e) {
        return null;
      }
    })();
    util2._Buffer_from = null;
    util2._Buffer_allocUnsafe = null;
    util2.newBuffer = function newBuffer(sizeOrArray) {
      return typeof sizeOrArray === "number" ? util2.Buffer ? util2._Buffer_allocUnsafe(sizeOrArray) : new util2.Array(sizeOrArray) : util2.Buffer ? util2._Buffer_from(sizeOrArray) : typeof Uint8Array === "undefined" ? sizeOrArray : new Uint8Array(sizeOrArray);
    };
    util2.Array = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    util2.Long = /* istanbul ignore next */
    util2.global.dcodeIO && /* istanbul ignore next */
    util2.global.dcodeIO.Long || /* istanbul ignore next */
    util2.global.Long || util2.inquire("long");
    util2.key2Re = /^true|false|0|1$/;
    util2.key32Re = /^-?(?:0|[1-9][0-9]*)$/;
    util2.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;
    util2.longToHash = function longToHash(value) {
      return value ? util2.LongBits.from(value).toHash() : util2.LongBits.zeroHash;
    };
    util2.longFromHash = function longFromHash(hash, unsigned) {
      var bits = util2.LongBits.fromHash(hash);
      if (util2.Long)
        return util2.Long.fromBits(bits.lo, bits.hi, unsigned);
      return bits.toNumber(Boolean(unsigned));
    };
    function merge(dst, src2, ifNotSet) {
      for (var keys = Object.keys(src2), i = 0; i < keys.length; ++i)
        if (dst[keys[i]] === void 0 || !ifNotSet)
          dst[keys[i]] = src2[keys[i]];
      return dst;
    }
    util2.merge = merge;
    util2.lcFirst = function lcFirst(str) {
      return str.charAt(0).toLowerCase() + str.substring(1);
    };
    function newError(name) {
      function CustomError(message2, properties) {
        if (!(this instanceof CustomError))
          return new CustomError(message2, properties);
        Object.defineProperty(this, "message", { get: function() {
          return message2;
        } });
        if (Error.captureStackTrace)
          Error.captureStackTrace(this, CustomError);
        else
          Object.defineProperty(this, "stack", { value: new Error().stack || "" });
        if (properties)
          merge(this, properties);
      }
      CustomError.prototype = Object.create(Error.prototype, {
        constructor: {
          value: CustomError,
          writable: true,
          enumerable: false,
          configurable: true
        },
        name: {
          get: function get() {
            return name;
          },
          set: void 0,
          enumerable: false,
          // configurable: false would accurately preserve the behavior of
          // the original, but I'm guessing that was not intentional.
          // For an actual error subclass, this property would
          // be configurable.
          configurable: true
        },
        toString: {
          value: function value() {
            return this.name + ": " + this.message;
          },
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      return CustomError;
    }
    util2.newError = newError;
    util2.ProtocolError = newError("ProtocolError");
    util2.oneOfGetter = function getOneOf(fieldNames) {
      var fieldMap = {};
      for (var i = 0; i < fieldNames.length; ++i)
        fieldMap[fieldNames[i]] = 1;
      return function() {
        for (var keys = Object.keys(this), i2 = keys.length - 1; i2 > -1; --i2)
          if (fieldMap[keys[i2]] === 1 && this[keys[i2]] !== void 0 && this[keys[i2]] !== null)
            return keys[i2];
      };
    };
    util2.oneOfSetter = function setOneOf(fieldNames) {
      return function(name) {
        for (var i = 0; i < fieldNames.length; ++i)
          if (fieldNames[i] !== name)
            delete this[fieldNames[i]];
      };
    };
    util2.toJSONOptions = {
      longs: String,
      enums: String,
      bytes: String,
      json: true
    };
    util2._configure = function() {
      var Buffer = util2.Buffer;
      if (!Buffer) {
        util2._Buffer_from = util2._Buffer_allocUnsafe = null;
        return;
      }
      util2._Buffer_from = Buffer.from !== Uint8Array.from && Buffer.from || /* istanbul ignore next */
      function Buffer_from(value, encoding) {
        return new Buffer(value, encoding);
      };
      util2._Buffer_allocUnsafe = Buffer.allocUnsafe || /* istanbul ignore next */
      function Buffer_allocUnsafe(size) {
        return new Buffer(size);
      };
    };
  })(minimal);
  return minimal;
}
var writer;
var hasRequiredWriter;
function requireWriter() {
  if (hasRequiredWriter) return writer;
  hasRequiredWriter = 1;
  writer = Writer;
  var util2 = requireMinimal();
  var BufferWriter;
  var LongBits = util2.LongBits, base64 = util2.base64, utf8 = util2.utf8;
  function Op(fn, len, val) {
    this.fn = fn;
    this.len = len;
    this.next = void 0;
    this.val = val;
  }
  function noop() {
  }
  function State(writer2) {
    this.head = writer2.head;
    this.tail = writer2.tail;
    this.len = writer2.len;
    this.next = writer2.states;
  }
  function Writer() {
    this.len = 0;
    this.head = new Op(noop, 0, 0);
    this.tail = this.head;
    this.states = null;
  }
  var create = function create2() {
    return util2.Buffer ? function create_buffer_setup() {
      return (Writer.create = function create_buffer() {
        return new BufferWriter();
      })();
    } : function create_array() {
      return new Writer();
    };
  };
  Writer.create = create();
  Writer.alloc = function alloc(size) {
    return new util2.Array(size);
  };
  if (util2.Array !== Array)
    Writer.alloc = util2.pool(Writer.alloc, util2.Array.prototype.subarray);
  Writer.prototype._push = function push(fn, len, val) {
    this.tail = this.tail.next = new Op(fn, len, val);
    this.len += len;
    return this;
  };
  function writeByte(val, buf, pos) {
    buf[pos] = val & 255;
  }
  function writeVarint32(val, buf, pos) {
    while (val > 127) {
      buf[pos++] = val & 127 | 128;
      val >>>= 7;
    }
    buf[pos] = val;
  }
  function VarintOp(len, val) {
    this.len = len;
    this.next = void 0;
    this.val = val;
  }
  VarintOp.prototype = Object.create(Op.prototype);
  VarintOp.prototype.fn = writeVarint32;
  Writer.prototype.uint32 = function write_uint32(value) {
    this.len += (this.tail = this.tail.next = new VarintOp(
      (value = value >>> 0) < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5,
      value
    )).len;
    return this;
  };
  Writer.prototype.int32 = function write_int32(value) {
    return value < 0 ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) : this.uint32(value);
  };
  Writer.prototype.sint32 = function write_sint32(value) {
    return this.uint32((value << 1 ^ value >> 31) >>> 0);
  };
  function writeVarint64(val, buf, pos) {
    while (val.hi) {
      buf[pos++] = val.lo & 127 | 128;
      val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
      val.hi >>>= 7;
    }
    while (val.lo > 127) {
      buf[pos++] = val.lo & 127 | 128;
      val.lo = val.lo >>> 7;
    }
    buf[pos++] = val.lo;
  }
  Writer.prototype.uint64 = function write_uint64(value) {
    var bits = LongBits.from(value);
    return this._push(writeVarint64, bits.length(), bits);
  };
  Writer.prototype.int64 = Writer.prototype.uint64;
  Writer.prototype.sint64 = function write_sint64(value) {
    var bits = LongBits.from(value).zzEncode();
    return this._push(writeVarint64, bits.length(), bits);
  };
  Writer.prototype.bool = function write_bool(value) {
    return this._push(writeByte, 1, value ? 1 : 0);
  };
  function writeFixed32(val, buf, pos) {
    buf[pos] = val & 255;
    buf[pos + 1] = val >>> 8 & 255;
    buf[pos + 2] = val >>> 16 & 255;
    buf[pos + 3] = val >>> 24;
  }
  Writer.prototype.fixed32 = function write_fixed32(value) {
    return this._push(writeFixed32, 4, value >>> 0);
  };
  Writer.prototype.sfixed32 = Writer.prototype.fixed32;
  Writer.prototype.fixed64 = function write_fixed64(value) {
    var bits = LongBits.from(value);
    return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
  };
  Writer.prototype.sfixed64 = Writer.prototype.fixed64;
  Writer.prototype.float = function write_float(value) {
    return this._push(util2.float.writeFloatLE, 4, value);
  };
  Writer.prototype.double = function write_double(value) {
    return this._push(util2.float.writeDoubleLE, 8, value);
  };
  var writeBytes = util2.Array.prototype.set ? function writeBytes_set(val, buf, pos) {
    buf.set(val, pos);
  } : function writeBytes_for(val, buf, pos) {
    for (var i = 0; i < val.length; ++i)
      buf[pos + i] = val[i];
  };
  Writer.prototype.bytes = function write_bytes(value) {
    var len = value.length >>> 0;
    if (!len)
      return this._push(writeByte, 1, 0);
    if (util2.isString(value)) {
      var buf = Writer.alloc(len = base64.length(value));
      base64.decode(value, buf, 0);
      value = buf;
    }
    return this.uint32(len)._push(writeBytes, len, value);
  };
  Writer.prototype.string = function write_string(value) {
    var len = utf8.length(value);
    return len ? this.uint32(len)._push(utf8.write, len, value) : this._push(writeByte, 1, 0);
  };
  Writer.prototype.fork = function fork() {
    this.states = new State(this);
    this.head = this.tail = new Op(noop, 0, 0);
    this.len = 0;
    return this;
  };
  Writer.prototype.reset = function reset() {
    if (this.states) {
      this.head = this.states.head;
      this.tail = this.states.tail;
      this.len = this.states.len;
      this.states = this.states.next;
    } else {
      this.head = this.tail = new Op(noop, 0, 0);
      this.len = 0;
    }
    return this;
  };
  Writer.prototype.ldelim = function ldelim() {
    var head = this.head, tail = this.tail, len = this.len;
    this.reset().uint32(len);
    if (len) {
      this.tail.next = head.next;
      this.tail = tail;
      this.len += len;
    }
    return this;
  };
  Writer.prototype.finish = function finish() {
    var head = this.head.next, buf = this.constructor.alloc(this.len), pos = 0;
    while (head) {
      head.fn(head.val, buf, pos);
      pos += head.len;
      head = head.next;
    }
    return buf;
  };
  Writer._configure = function(BufferWriter_) {
    BufferWriter = BufferWriter_;
    Writer.create = create();
    BufferWriter._configure();
  };
  return writer;
}
var writer_buffer;
var hasRequiredWriter_buffer;
function requireWriter_buffer() {
  if (hasRequiredWriter_buffer) return writer_buffer;
  hasRequiredWriter_buffer = 1;
  writer_buffer = BufferWriter;
  var Writer = requireWriter();
  (BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;
  var util2 = requireMinimal();
  function BufferWriter() {
    Writer.call(this);
  }
  BufferWriter._configure = function() {
    BufferWriter.alloc = util2._Buffer_allocUnsafe;
    BufferWriter.writeBytesBuffer = util2.Buffer && util2.Buffer.prototype instanceof Uint8Array && util2.Buffer.prototype.set.name === "set" ? function writeBytesBuffer_set(val, buf, pos) {
      buf.set(val, pos);
    } : function writeBytesBuffer_copy(val, buf, pos) {
      if (val.copy)
        val.copy(buf, pos, 0, val.length);
      else for (var i = 0; i < val.length; )
        buf[pos++] = val[i++];
    };
  };
  BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
    if (util2.isString(value))
      value = util2._Buffer_from(value, "base64");
    var len = value.length >>> 0;
    this.uint32(len);
    if (len)
      this._push(BufferWriter.writeBytesBuffer, len, value);
    return this;
  };
  function writeStringBuffer(val, buf, pos) {
    if (val.length < 40)
      util2.utf8.write(val, buf, pos);
    else if (buf.utf8Write)
      buf.utf8Write(val, pos);
    else
      buf.write(val, pos);
  }
  BufferWriter.prototype.string = function write_string_buffer(value) {
    var len = util2.Buffer.byteLength(value);
    this.uint32(len);
    if (len)
      this._push(writeStringBuffer, len, value);
    return this;
  };
  BufferWriter._configure();
  return writer_buffer;
}
var reader;
var hasRequiredReader;
function requireReader() {
  if (hasRequiredReader) return reader;
  hasRequiredReader = 1;
  reader = Reader;
  var util2 = requireMinimal();
  var BufferReader;
  var LongBits = util2.LongBits, utf8 = util2.utf8;
  function indexOutOfRange(reader2, writeLength) {
    return RangeError("index out of range: " + reader2.pos + " + " + (writeLength || 1) + " > " + reader2.len);
  }
  function Reader(buffer) {
    this.buf = buffer;
    this.pos = 0;
    this.len = buffer.length;
  }
  var create_array = typeof Uint8Array !== "undefined" ? function create_typed_array(buffer) {
    if (buffer instanceof Uint8Array || Array.isArray(buffer))
      return new Reader(buffer);
    throw Error("illegal buffer");
  } : function create_array2(buffer) {
    if (Array.isArray(buffer))
      return new Reader(buffer);
    throw Error("illegal buffer");
  };
  var create = function create2() {
    return util2.Buffer ? function create_buffer_setup(buffer) {
      return (Reader.create = function create_buffer(buffer2) {
        return util2.Buffer.isBuffer(buffer2) ? new BufferReader(buffer2) : create_array(buffer2);
      })(buffer);
    } : create_array;
  };
  Reader.create = create();
  Reader.prototype._slice = util2.Array.prototype.subarray || /* istanbul ignore next */
  util2.Array.prototype.slice;
  Reader.prototype.uint32 = /* @__PURE__ */ (function read_uint32_setup() {
    var value = 4294967295;
    return function read_uint32() {
      value = (this.buf[this.pos] & 127) >>> 0;
      if (this.buf[this.pos++] < 128) return value;
      value = (value | (this.buf[this.pos] & 127) << 7) >>> 0;
      if (this.buf[this.pos++] < 128) return value;
      value = (value | (this.buf[this.pos] & 127) << 14) >>> 0;
      if (this.buf[this.pos++] < 128) return value;
      value = (value | (this.buf[this.pos] & 127) << 21) >>> 0;
      if (this.buf[this.pos++] < 128) return value;
      value = (value | (this.buf[this.pos] & 15) << 28) >>> 0;
      if (this.buf[this.pos++] < 128) return value;
      if ((this.pos += 5) > this.len) {
        this.pos = this.len;
        throw indexOutOfRange(this, 10);
      }
      return value;
    };
  })();
  Reader.prototype.int32 = function read_int32() {
    return this.uint32() | 0;
  };
  Reader.prototype.sint32 = function read_sint32() {
    var value = this.uint32();
    return value >>> 1 ^ -(value & 1) | 0;
  };
  function readLongVarint() {
    var bits = new LongBits(0, 0);
    var i = 0;
    if (this.len - this.pos > 4) {
      for (; i < 4; ++i) {
        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
        if (this.buf[this.pos++] < 128)
          return bits;
      }
      bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
      bits.hi = (bits.hi | (this.buf[this.pos] & 127) >> 4) >>> 0;
      if (this.buf[this.pos++] < 128)
        return bits;
      i = 0;
    } else {
      for (; i < 3; ++i) {
        if (this.pos >= this.len)
          throw indexOutOfRange(this);
        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
        if (this.buf[this.pos++] < 128)
          return bits;
      }
      bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
      return bits;
    }
    if (this.len - this.pos > 4) {
      for (; i < 5; ++i) {
        bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
        if (this.buf[this.pos++] < 128)
          return bits;
      }
    } else {
      for (; i < 5; ++i) {
        if (this.pos >= this.len)
          throw indexOutOfRange(this);
        bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
        if (this.buf[this.pos++] < 128)
          return bits;
      }
    }
    throw Error("invalid varint encoding");
  }
  Reader.prototype.bool = function read_bool() {
    return this.uint32() !== 0;
  };
  function readFixed32_end(buf, end) {
    return (buf[end - 4] | buf[end - 3] << 8 | buf[end - 2] << 16 | buf[end - 1] << 24) >>> 0;
  }
  Reader.prototype.fixed32 = function read_fixed32() {
    if (this.pos + 4 > this.len)
      throw indexOutOfRange(this, 4);
    return readFixed32_end(this.buf, this.pos += 4);
  };
  Reader.prototype.sfixed32 = function read_sfixed32() {
    if (this.pos + 4 > this.len)
      throw indexOutOfRange(this, 4);
    return readFixed32_end(this.buf, this.pos += 4) | 0;
  };
  function readFixed64() {
    if (this.pos + 8 > this.len)
      throw indexOutOfRange(this, 8);
    return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
  }
  Reader.prototype.float = function read_float() {
    if (this.pos + 4 > this.len)
      throw indexOutOfRange(this, 4);
    var value = util2.float.readFloatLE(this.buf, this.pos);
    this.pos += 4;
    return value;
  };
  Reader.prototype.double = function read_double() {
    if (this.pos + 8 > this.len)
      throw indexOutOfRange(this, 4);
    var value = util2.float.readDoubleLE(this.buf, this.pos);
    this.pos += 8;
    return value;
  };
  Reader.prototype.bytes = function read_bytes() {
    var length = this.uint32(), start = this.pos, end = this.pos + length;
    if (end > this.len)
      throw indexOutOfRange(this, length);
    this.pos += length;
    if (Array.isArray(this.buf))
      return this.buf.slice(start, end);
    if (start === end) {
      var nativeBuffer = util2.Buffer;
      return nativeBuffer ? nativeBuffer.alloc(0) : new this.buf.constructor(0);
    }
    return this._slice.call(this.buf, start, end);
  };
  Reader.prototype.string = function read_string() {
    var bytes = this.bytes();
    return utf8.read(bytes, 0, bytes.length);
  };
  Reader.prototype.skip = function skip(length) {
    if (typeof length === "number") {
      if (this.pos + length > this.len)
        throw indexOutOfRange(this, length);
      this.pos += length;
    } else {
      do {
        if (this.pos >= this.len)
          throw indexOutOfRange(this);
      } while (this.buf[this.pos++] & 128);
    }
    return this;
  };
  Reader.prototype.skipType = function(wireType) {
    switch (wireType) {
      case 0:
        this.skip();
        break;
      case 1:
        this.skip(8);
        break;
      case 2:
        this.skip(this.uint32());
        break;
      case 3:
        while ((wireType = this.uint32() & 7) !== 4) {
          this.skipType(wireType);
        }
        break;
      case 5:
        this.skip(4);
        break;
      /* istanbul ignore next */
      default:
        throw Error("invalid wire type " + wireType + " at offset " + this.pos);
    }
    return this;
  };
  Reader._configure = function(BufferReader_) {
    BufferReader = BufferReader_;
    Reader.create = create();
    BufferReader._configure();
    var fn = util2.Long ? "toLong" : (
      /* istanbul ignore next */
      "toNumber"
    );
    util2.merge(Reader.prototype, {
      int64: function read_int64() {
        return readLongVarint.call(this)[fn](false);
      },
      uint64: function read_uint64() {
        return readLongVarint.call(this)[fn](true);
      },
      sint64: function read_sint64() {
        return readLongVarint.call(this).zzDecode()[fn](false);
      },
      fixed64: function read_fixed64() {
        return readFixed64.call(this)[fn](true);
      },
      sfixed64: function read_sfixed64() {
        return readFixed64.call(this)[fn](false);
      }
    });
  };
  return reader;
}
var reader_buffer;
var hasRequiredReader_buffer;
function requireReader_buffer() {
  if (hasRequiredReader_buffer) return reader_buffer;
  hasRequiredReader_buffer = 1;
  reader_buffer = BufferReader;
  var Reader = requireReader();
  (BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;
  var util2 = requireMinimal();
  function BufferReader(buffer) {
    Reader.call(this, buffer);
  }
  BufferReader._configure = function() {
    if (util2.Buffer)
      BufferReader.prototype._slice = util2.Buffer.prototype.slice;
  };
  BufferReader.prototype.string = function read_string_buffer() {
    var len = this.uint32();
    return this.buf.utf8Slice ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len)) : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + len, this.len));
  };
  BufferReader._configure();
  return reader_buffer;
}
var rpc = {};
var service$1;
var hasRequiredService$1;
function requireService$1() {
  if (hasRequiredService$1) return service$1;
  hasRequiredService$1 = 1;
  service$1 = Service;
  var util2 = requireMinimal();
  (Service.prototype = Object.create(util2.EventEmitter.prototype)).constructor = Service;
  function Service(rpcImpl, requestDelimited, responseDelimited) {
    if (typeof rpcImpl !== "function")
      throw TypeError("rpcImpl must be a function");
    util2.EventEmitter.call(this);
    this.rpcImpl = rpcImpl;
    this.requestDelimited = Boolean(requestDelimited);
    this.responseDelimited = Boolean(responseDelimited);
  }
  Service.prototype.rpcCall = function rpcCall(method2, requestCtor, responseCtor, request, callback) {
    if (!request)
      throw TypeError("request must be specified");
    var self2 = this;
    if (!callback)
      return util2.asPromise(rpcCall, self2, method2, requestCtor, responseCtor, request);
    if (!self2.rpcImpl) {
      setTimeout(function() {
        callback(Error("already ended"));
      }, 0);
      return void 0;
    }
    try {
      return self2.rpcImpl(
        method2,
        requestCtor[self2.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
        function rpcCallback(err, response) {
          if (err) {
            self2.emit("error", err, method2);
            return callback(err);
          }
          if (response === null) {
            self2.end(
              /* endedByRPC */
              true
            );
            return void 0;
          }
          if (!(response instanceof responseCtor)) {
            try {
              response = responseCtor[self2.responseDelimited ? "decodeDelimited" : "decode"](response);
            } catch (err2) {
              self2.emit("error", err2, method2);
              return callback(err2);
            }
          }
          self2.emit("data", response, method2);
          return callback(null, response);
        }
      );
    } catch (err) {
      self2.emit("error", err, method2);
      setTimeout(function() {
        callback(err);
      }, 0);
      return void 0;
    }
  };
  Service.prototype.end = function end(endedByRPC) {
    if (this.rpcImpl) {
      if (!endedByRPC)
        this.rpcImpl(null, null, null);
      this.rpcImpl = null;
      this.emit("end").off();
    }
    return this;
  };
  return service$1;
}
var hasRequiredRpc;
function requireRpc() {
  if (hasRequiredRpc) return rpc;
  hasRequiredRpc = 1;
  (function(exports$1) {
    var rpc2 = exports$1;
    rpc2.Service = requireService$1();
  })(rpc);
  return rpc;
}
var roots;
var hasRequiredRoots;
function requireRoots() {
  if (hasRequiredRoots) return roots;
  hasRequiredRoots = 1;
  roots = {};
  return roots;
}
var hasRequiredIndexMinimal;
function requireIndexMinimal() {
  if (hasRequiredIndexMinimal) return indexMinimal;
  hasRequiredIndexMinimal = 1;
  (function(exports$1) {
    var protobuf = exports$1;
    protobuf.build = "minimal";
    protobuf.Writer = requireWriter();
    protobuf.BufferWriter = requireWriter_buffer();
    protobuf.Reader = requireReader();
    protobuf.BufferReader = requireReader_buffer();
    protobuf.util = requireMinimal();
    protobuf.rpc = requireRpc();
    protobuf.roots = requireRoots();
    protobuf.configure = configure;
    function configure() {
      protobuf.util._configure();
      protobuf.Writer._configure(protobuf.BufferWriter);
      protobuf.Reader._configure(protobuf.BufferReader);
    }
    configure();
  })(indexMinimal);
  return indexMinimal;
}
var types = {};
var util = { exports: {} };
var namespace;
var hasRequiredNamespace;
function requireNamespace() {
  if (hasRequiredNamespace) return namespace;
  hasRequiredNamespace = 1;
  namespace = Namespace;
  var ReflectionObject = requireObject();
  ((Namespace.prototype = Object.create(ReflectionObject.prototype)).constructor = Namespace).className = "Namespace";
  var Field = requireField(), util2 = requireUtil(), OneOf = requireOneof();
  var Type, Service, Enum;
  Namespace.fromJSON = function fromJSON(name, json) {
    return new Namespace(name, json.options).addJSON(json.nested);
  };
  function arrayToJSON(array, toJSONOptions) {
    if (!(array && array.length))
      return void 0;
    var obj = {};
    for (var i = 0; i < array.length; ++i)
      obj[array[i].name] = array[i].toJSON(toJSONOptions);
    return obj;
  }
  Namespace.arrayToJSON = arrayToJSON;
  Namespace.isReservedId = function isReservedId(reserved, id) {
    if (reserved) {
      for (var i = 0; i < reserved.length; ++i)
        if (typeof reserved[i] !== "string" && reserved[i][0] <= id && reserved[i][1] > id)
          return true;
    }
    return false;
  };
  Namespace.isReservedName = function isReservedName(reserved, name) {
    if (reserved) {
      for (var i = 0; i < reserved.length; ++i)
        if (reserved[i] === name)
          return true;
    }
    return false;
  };
  function Namespace(name, options) {
    ReflectionObject.call(this, name, options);
    this.nested = void 0;
    this._nestedArray = null;
    this._lookupCache = {};
    this._needsRecursiveFeatureResolution = true;
    this._needsRecursiveResolve = true;
  }
  function clearCache(namespace2) {
    namespace2._nestedArray = null;
    namespace2._lookupCache = {};
    var parent = namespace2;
    while (parent = parent.parent) {
      parent._lookupCache = {};
    }
    return namespace2;
  }
  Object.defineProperty(Namespace.prototype, "nestedArray", {
    get: function() {
      return this._nestedArray || (this._nestedArray = util2.toArray(this.nested));
    }
  });
  Namespace.prototype.toJSON = function toJSON(toJSONOptions) {
    return util2.toObject([
      "options",
      this.options,
      "nested",
      arrayToJSON(this.nestedArray, toJSONOptions)
    ]);
  };
  Namespace.prototype.addJSON = function addJSON(nestedJson) {
    var ns = this;
    if (nestedJson) {
      for (var names = Object.keys(nestedJson), i = 0, nested2; i < names.length; ++i) {
        nested2 = nestedJson[names[i]];
        ns.add(
          // most to least likely
          (nested2.fields !== void 0 ? Type.fromJSON : nested2.values !== void 0 ? Enum.fromJSON : nested2.methods !== void 0 ? Service.fromJSON : nested2.id !== void 0 ? Field.fromJSON : Namespace.fromJSON)(names[i], nested2)
        );
      }
    }
    return this;
  };
  Namespace.prototype.get = function get(name) {
    return this.nested && this.nested[name] || null;
  };
  Namespace.prototype.getEnum = function getEnum(name) {
    if (this.nested && this.nested[name] instanceof Enum)
      return this.nested[name].values;
    throw Error("no such enum: " + name);
  };
  Namespace.prototype.add = function add(object2) {
    if (!(object2 instanceof Field && object2.extend !== void 0 || object2 instanceof Type || object2 instanceof OneOf || object2 instanceof Enum || object2 instanceof Service || object2 instanceof Namespace))
      throw TypeError("object must be a valid nested object");
    if (!this.nested)
      this.nested = {};
    else {
      var prev = this.get(object2.name);
      if (prev) {
        if (prev instanceof Namespace && object2 instanceof Namespace && !(prev instanceof Type || prev instanceof Service)) {
          var nested2 = prev.nestedArray;
          for (var i = 0; i < nested2.length; ++i)
            object2.add(nested2[i]);
          this.remove(prev);
          if (!this.nested)
            this.nested = {};
          object2.setOptions(prev.options, true);
        } else
          throw Error("duplicate name '" + object2.name + "' in " + this);
      }
    }
    this.nested[object2.name] = object2;
    if (!(this instanceof Type || this instanceof Service || this instanceof Enum || this instanceof Field)) {
      if (!object2._edition) {
        object2._edition = object2._defaultEdition;
      }
    }
    this._needsRecursiveFeatureResolution = true;
    this._needsRecursiveResolve = true;
    var parent = this;
    while (parent = parent.parent) {
      parent._needsRecursiveFeatureResolution = true;
      parent._needsRecursiveResolve = true;
    }
    object2.onAdd(this);
    return clearCache(this);
  };
  Namespace.prototype.remove = function remove(object2) {
    if (!(object2 instanceof ReflectionObject))
      throw TypeError("object must be a ReflectionObject");
    if (object2.parent !== this)
      throw Error(object2 + " is not a member of " + this);
    delete this.nested[object2.name];
    if (!Object.keys(this.nested).length)
      this.nested = void 0;
    object2.onRemove(this);
    return clearCache(this);
  };
  Namespace.prototype.define = function define(path, json) {
    if (util2.isString(path))
      path = path.split(".");
    else if (!Array.isArray(path))
      throw TypeError("illegal path");
    if (path && path.length && path[0] === "")
      throw Error("path must be relative");
    var ptr = this;
    while (path.length > 0) {
      var part = path.shift();
      if (ptr.nested && ptr.nested[part]) {
        ptr = ptr.nested[part];
        if (!(ptr instanceof Namespace))
          throw Error("path conflicts with non-namespace objects");
      } else
        ptr.add(ptr = new Namespace(part));
    }
    if (json)
      ptr.addJSON(json);
    return ptr;
  };
  Namespace.prototype.resolveAll = function resolveAll() {
    if (!this._needsRecursiveResolve) return this;
    this._resolveFeaturesRecursive(this._edition);
    var nested2 = this.nestedArray, i = 0;
    this.resolve();
    while (i < nested2.length)
      if (nested2[i] instanceof Namespace)
        nested2[i++].resolveAll();
      else
        nested2[i++].resolve();
    this._needsRecursiveResolve = false;
    return this;
  };
  Namespace.prototype._resolveFeaturesRecursive = function _resolveFeaturesRecursive(edition) {
    if (!this._needsRecursiveFeatureResolution) return this;
    this._needsRecursiveFeatureResolution = false;
    edition = this._edition || edition;
    ReflectionObject.prototype._resolveFeaturesRecursive.call(this, edition);
    this.nestedArray.forEach((nested2) => {
      nested2._resolveFeaturesRecursive(edition);
    });
    return this;
  };
  Namespace.prototype.lookup = function lookup(path, filterTypes, parentAlreadyChecked) {
    if (typeof filterTypes === "boolean") {
      parentAlreadyChecked = filterTypes;
      filterTypes = void 0;
    } else if (filterTypes && !Array.isArray(filterTypes))
      filterTypes = [filterTypes];
    if (util2.isString(path) && path.length) {
      if (path === ".")
        return this.root;
      path = path.split(".");
    } else if (!path.length)
      return this;
    var flatPath = path.join(".");
    if (path[0] === "")
      return this.root.lookup(path.slice(1), filterTypes);
    var found = this.root._fullyQualifiedObjects && this.root._fullyQualifiedObjects["." + flatPath];
    if (found && (!filterTypes || filterTypes.indexOf(found.constructor) > -1)) {
      return found;
    }
    found = this._lookupImpl(path, flatPath);
    if (found && (!filterTypes || filterTypes.indexOf(found.constructor) > -1)) {
      return found;
    }
    if (parentAlreadyChecked)
      return null;
    var current = this;
    while (current.parent) {
      found = current.parent._lookupImpl(path, flatPath);
      if (found && (!filterTypes || filterTypes.indexOf(found.constructor) > -1)) {
        return found;
      }
      current = current.parent;
    }
    return null;
  };
  Namespace.prototype._lookupImpl = function lookup(path, flatPath) {
    if (Object.prototype.hasOwnProperty.call(this._lookupCache, flatPath)) {
      return this._lookupCache[flatPath];
    }
    var found = this.get(path[0]);
    var exact = null;
    if (found) {
      if (path.length === 1) {
        exact = found;
      } else if (found instanceof Namespace) {
        path = path.slice(1);
        exact = found._lookupImpl(path, path.join("."));
      }
    } else {
      for (var i = 0; i < this.nestedArray.length; ++i)
        if (this._nestedArray[i] instanceof Namespace && (found = this._nestedArray[i]._lookupImpl(path, flatPath)))
          exact = found;
    }
    this._lookupCache[flatPath] = exact;
    return exact;
  };
  Namespace.prototype.lookupType = function lookupType(path) {
    var found = this.lookup(path, [Type]);
    if (!found)
      throw Error("no such type: " + path);
    return found;
  };
  Namespace.prototype.lookupEnum = function lookupEnum(path) {
    var found = this.lookup(path, [Enum]);
    if (!found)
      throw Error("no such Enum '" + path + "' in " + this);
    return found;
  };
  Namespace.prototype.lookupTypeOrEnum = function lookupTypeOrEnum(path) {
    var found = this.lookup(path, [Type, Enum]);
    if (!found)
      throw Error("no such Type or Enum '" + path + "' in " + this);
    return found;
  };
  Namespace.prototype.lookupService = function lookupService(path) {
    var found = this.lookup(path, [Service]);
    if (!found)
      throw Error("no such Service '" + path + "' in " + this);
    return found;
  };
  Namespace._configure = function(Type_, Service_, Enum_) {
    Type = Type_;
    Service = Service_;
    Enum = Enum_;
  };
  return namespace;
}
var mapfield;
var hasRequiredMapfield;
function requireMapfield() {
  if (hasRequiredMapfield) return mapfield;
  hasRequiredMapfield = 1;
  mapfield = MapField;
  var Field = requireField();
  ((MapField.prototype = Object.create(Field.prototype)).constructor = MapField).className = "MapField";
  var types2 = requireTypes(), util2 = requireUtil();
  function MapField(name, id, keyType, type2, options, comment) {
    Field.call(this, name, id, type2, void 0, void 0, options, comment);
    if (!util2.isString(keyType))
      throw TypeError("keyType must be a string");
    this.keyType = keyType;
    this.resolvedKeyType = null;
    this.map = true;
  }
  MapField.fromJSON = function fromJSON(name, json) {
    return new MapField(name, json.id, json.keyType, json.type, json.options, json.comment);
  };
  MapField.prototype.toJSON = function toJSON(toJSONOptions) {
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util2.toObject([
      "keyType",
      this.keyType,
      "type",
      this.type,
      "id",
      this.id,
      "extend",
      this.extend,
      "options",
      this.options,
      "comment",
      keepComments ? this.comment : void 0
    ]);
  };
  MapField.prototype.resolve = function resolve() {
    if (this.resolved)
      return this;
    if (types2.mapKey[this.keyType] === void 0)
      throw Error("invalid key type: " + this.keyType);
    return Field.prototype.resolve.call(this);
  };
  MapField.d = function decorateMapField(fieldId, fieldKeyType, fieldValueType) {
    if (typeof fieldValueType === "function")
      fieldValueType = util2.decorateType(fieldValueType).name;
    else if (fieldValueType && typeof fieldValueType === "object")
      fieldValueType = util2.decorateEnum(fieldValueType).name;
    return function mapFieldDecorator(prototype, fieldName) {
      util2.decorateType(prototype.constructor).add(new MapField(fieldName, fieldId, fieldKeyType, fieldValueType));
    };
  };
  return mapfield;
}
var method;
var hasRequiredMethod;
function requireMethod() {
  if (hasRequiredMethod) return method;
  hasRequiredMethod = 1;
  method = Method;
  var ReflectionObject = requireObject();
  ((Method.prototype = Object.create(ReflectionObject.prototype)).constructor = Method).className = "Method";
  var util2 = requireUtil();
  function Method(name, type2, requestType, responseType, requestStream, responseStream, options, comment, parsedOptions) {
    if (util2.isObject(requestStream)) {
      options = requestStream;
      requestStream = responseStream = void 0;
    } else if (util2.isObject(responseStream)) {
      options = responseStream;
      responseStream = void 0;
    }
    if (!(type2 === void 0 || util2.isString(type2)))
      throw TypeError("type must be a string");
    if (!util2.isString(requestType))
      throw TypeError("requestType must be a string");
    if (!util2.isString(responseType))
      throw TypeError("responseType must be a string");
    ReflectionObject.call(this, name, options);
    this.type = type2 || "rpc";
    this.requestType = requestType;
    this.requestStream = requestStream ? true : void 0;
    this.responseType = responseType;
    this.responseStream = responseStream ? true : void 0;
    this.resolvedRequestType = null;
    this.resolvedResponseType = null;
    this.comment = comment;
    this.parsedOptions = parsedOptions;
  }
  Method.fromJSON = function fromJSON(name, json) {
    return new Method(name, json.type, json.requestType, json.responseType, json.requestStream, json.responseStream, json.options, json.comment, json.parsedOptions);
  };
  Method.prototype.toJSON = function toJSON(toJSONOptions) {
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util2.toObject([
      "type",
      this.type !== "rpc" && /* istanbul ignore next */
      this.type || void 0,
      "requestType",
      this.requestType,
      "requestStream",
      this.requestStream,
      "responseType",
      this.responseType,
      "responseStream",
      this.responseStream,
      "options",
      this.options,
      "comment",
      keepComments ? this.comment : void 0,
      "parsedOptions",
      this.parsedOptions
    ]);
  };
  Method.prototype.resolve = function resolve() {
    if (this.resolved)
      return this;
    this.resolvedRequestType = this.parent.lookupType(this.requestType);
    this.resolvedResponseType = this.parent.lookupType(this.responseType);
    return ReflectionObject.prototype.resolve.call(this);
  };
  return method;
}
var service;
var hasRequiredService;
function requireService() {
  if (hasRequiredService) return service;
  hasRequiredService = 1;
  service = Service;
  var Namespace = requireNamespace();
  ((Service.prototype = Object.create(Namespace.prototype)).constructor = Service).className = "Service";
  var Method = requireMethod(), util2 = requireUtil(), rpc2 = requireRpc();
  function Service(name, options) {
    Namespace.call(this, name, options);
    this.methods = {};
    this._methodsArray = null;
  }
  Service.fromJSON = function fromJSON(name, json) {
    var service2 = new Service(name, json.options);
    if (json.methods)
      for (var names = Object.keys(json.methods), i = 0; i < names.length; ++i)
        service2.add(Method.fromJSON(names[i], json.methods[names[i]]));
    if (json.nested)
      service2.addJSON(json.nested);
    if (json.edition)
      service2._edition = json.edition;
    service2.comment = json.comment;
    service2._defaultEdition = "proto3";
    return service2;
  };
  Service.prototype.toJSON = function toJSON(toJSONOptions) {
    var inherited = Namespace.prototype.toJSON.call(this, toJSONOptions);
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util2.toObject([
      "edition",
      this._editionToJSON(),
      "options",
      inherited && inherited.options || void 0,
      "methods",
      Namespace.arrayToJSON(this.methodsArray, toJSONOptions) || /* istanbul ignore next */
      {},
      "nested",
      inherited && inherited.nested || void 0,
      "comment",
      keepComments ? this.comment : void 0
    ]);
  };
  Object.defineProperty(Service.prototype, "methodsArray", {
    get: function() {
      return this._methodsArray || (this._methodsArray = util2.toArray(this.methods));
    }
  });
  function clearCache(service2) {
    service2._methodsArray = null;
    return service2;
  }
  Service.prototype.get = function get(name) {
    return this.methods[name] || Namespace.prototype.get.call(this, name);
  };
  Service.prototype.resolveAll = function resolveAll() {
    if (!this._needsRecursiveResolve) return this;
    Namespace.prototype.resolve.call(this);
    var methods = this.methodsArray;
    for (var i = 0; i < methods.length; ++i)
      methods[i].resolve();
    return this;
  };
  Service.prototype._resolveFeaturesRecursive = function _resolveFeaturesRecursive(edition) {
    if (!this._needsRecursiveFeatureResolution) return this;
    edition = this._edition || edition;
    Namespace.prototype._resolveFeaturesRecursive.call(this, edition);
    this.methodsArray.forEach((method2) => {
      method2._resolveFeaturesRecursive(edition);
    });
    return this;
  };
  Service.prototype.add = function add(object2) {
    if (this.get(object2.name))
      throw Error("duplicate name '" + object2.name + "' in " + this);
    if (object2 instanceof Method) {
      this.methods[object2.name] = object2;
      object2.parent = this;
      return clearCache(this);
    }
    return Namespace.prototype.add.call(this, object2);
  };
  Service.prototype.remove = function remove(object2) {
    if (object2 instanceof Method) {
      if (this.methods[object2.name] !== object2)
        throw Error(object2 + " is not a member of " + this);
      delete this.methods[object2.name];
      object2.parent = null;
      return clearCache(this);
    }
    return Namespace.prototype.remove.call(this, object2);
  };
  Service.prototype.create = function create(rpcImpl, requestDelimited, responseDelimited) {
    var rpcService = new rpc2.Service(rpcImpl, requestDelimited, responseDelimited);
    for (var i = 0, method2; i < /* initializes */
    this.methodsArray.length; ++i) {
      var methodName = util2.lcFirst((method2 = this._methodsArray[i]).resolve().name).replace(/[^$\w_]/g, "");
      rpcService[methodName] = util2.codegen(["r", "c"], util2.isReserved(methodName) ? methodName + "_" : methodName)("return this.rpcCall(m,q,s,r,c)")({
        m: method2,
        q: method2.resolvedRequestType.ctor,
        s: method2.resolvedResponseType.ctor
      });
    }
    return rpcService;
  };
  return service;
}
var message;
var hasRequiredMessage;
function requireMessage() {
  if (hasRequiredMessage) return message;
  hasRequiredMessage = 1;
  message = Message;
  var util2 = requireMinimal();
  function Message(properties) {
    if (properties)
      for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        this[keys[i]] = properties[keys[i]];
  }
  Message.create = function create(properties) {
    return this.$type.create(properties);
  };
  Message.encode = function encode(message2, writer2) {
    return this.$type.encode(message2, writer2);
  };
  Message.encodeDelimited = function encodeDelimited(message2, writer2) {
    return this.$type.encodeDelimited(message2, writer2);
  };
  Message.decode = function decode(reader2) {
    return this.$type.decode(reader2);
  };
  Message.decodeDelimited = function decodeDelimited(reader2) {
    return this.$type.decodeDelimited(reader2);
  };
  Message.verify = function verify(message2) {
    return this.$type.verify(message2);
  };
  Message.fromObject = function fromObject(object2) {
    return this.$type.fromObject(object2);
  };
  Message.toObject = function toObject(message2, options) {
    return this.$type.toObject(message2, options);
  };
  Message.prototype.toJSON = function toJSON() {
    return this.$type.toObject(this, util2.toJSONOptions);
  };
  return message;
}
var decoder_1;
var hasRequiredDecoder;
function requireDecoder() {
  if (hasRequiredDecoder) return decoder_1;
  hasRequiredDecoder = 1;
  decoder_1 = decoder;
  var Enum = require_enum(), types2 = requireTypes(), util2 = requireUtil();
  function missing(field2) {
    return "missing required '" + field2.name + "'";
  }
  function decoder(mtype) {
    var gen = util2.codegen(["r", "l", "e"], mtype.name + "$decode")("if(!(r instanceof Reader))")("r=Reader.create(r)")("var c=l===undefined?r.len:r.pos+l,m=new this.ctor" + (mtype.fieldsArray.filter(function(field3) {
      return field3.map;
    }).length ? ",k,value" : ""))("while(r.pos<c){")("var t=r.uint32()")("if(t===e)")("break")("switch(t>>>3){");
    var i = 0;
    for (; i < /* initializes */
    mtype.fieldsArray.length; ++i) {
      var field2 = mtype._fieldsArray[i].resolve(), type2 = field2.resolvedType instanceof Enum ? "int32" : field2.type, ref = "m" + util2.safeProp(field2.name);
      gen("case %i: {", field2.id);
      if (field2.map) {
        gen("if(%s===util.emptyObject)", ref)("%s={}", ref)("var c2 = r.uint32()+r.pos");
        if (types2.defaults[field2.keyType] !== void 0) gen("k=%j", types2.defaults[field2.keyType]);
        else gen("k=null");
        if (types2.defaults[type2] !== void 0) gen("value=%j", types2.defaults[type2]);
        else gen("value=null");
        gen("while(r.pos<c2){")("var tag2=r.uint32()")("switch(tag2>>>3){")("case 1: k=r.%s(); break", field2.keyType)("case 2:");
        if (types2.basic[type2] === void 0) gen("value=types[%i].decode(r,r.uint32())", i);
        else gen("value=r.%s()", type2);
        gen("break")("default:")("r.skipType(tag2&7)")("break")("}")("}");
        if (types2.long[field2.keyType] !== void 0) gen('%s[typeof k==="object"?util.longToHash(k):k]=value', ref);
        else gen("%s[k]=value", ref);
      } else if (field2.repeated) {
        gen("if(!(%s&&%s.length))", ref, ref)("%s=[]", ref);
        if (types2.packed[type2] !== void 0) gen("if((t&7)===2){")("var c2=r.uint32()+r.pos")("while(r.pos<c2)")("%s.push(r.%s())", ref, type2)("}else");
        if (types2.basic[type2] === void 0) gen(field2.delimited ? "%s.push(types[%i].decode(r,undefined,((t&~7)|4)))" : "%s.push(types[%i].decode(r,r.uint32()))", ref, i);
        else gen("%s.push(r.%s())", ref, type2);
      } else if (types2.basic[type2] === void 0) gen(field2.delimited ? "%s=types[%i].decode(r,undefined,((t&~7)|4))" : "%s=types[%i].decode(r,r.uint32())", ref, i);
      else gen("%s=r.%s()", ref, type2);
      gen("break")("}");
    }
    gen("default:")("r.skipType(t&7)")("break")("}")("}");
    for (i = 0; i < mtype._fieldsArray.length; ++i) {
      var rfield = mtype._fieldsArray[i];
      if (rfield.required) gen("if(!m.hasOwnProperty(%j))", rfield.name)("throw util.ProtocolError(%j,{instance:m})", missing(rfield));
    }
    return gen("return m");
  }
  return decoder_1;
}
var verifier_1;
var hasRequiredVerifier;
function requireVerifier() {
  if (hasRequiredVerifier) return verifier_1;
  hasRequiredVerifier = 1;
  verifier_1 = verifier;
  var Enum = require_enum(), util2 = requireUtil();
  function invalid(field2, expected) {
    return field2.name + ": " + expected + (field2.repeated && expected !== "array" ? "[]" : field2.map && expected !== "object" ? "{k:" + field2.keyType + "}" : "") + " expected";
  }
  function genVerifyValue(gen, field2, fieldIndex, ref) {
    if (field2.resolvedType) {
      if (field2.resolvedType instanceof Enum) {
        gen("switch(%s){", ref)("default:")("return%j", invalid(field2, "enum value"));
        for (var keys = Object.keys(field2.resolvedType.values), j = 0; j < keys.length; ++j) gen("case %i:", field2.resolvedType.values[keys[j]]);
        gen("break")("}");
      } else {
        gen("{")("var e=types[%i].verify(%s);", fieldIndex, ref)("if(e)")("return%j+e", field2.name + ".")("}");
      }
    } else {
      switch (field2.type) {
        case "int32":
        case "uint32":
        case "sint32":
        case "fixed32":
        case "sfixed32":
          gen("if(!util.isInteger(%s))", ref)("return%j", invalid(field2, "integer"));
          break;
        case "int64":
        case "uint64":
        case "sint64":
        case "fixed64":
        case "sfixed64":
          gen("if(!util.isInteger(%s)&&!(%s&&util.isInteger(%s.low)&&util.isInteger(%s.high)))", ref, ref, ref, ref)("return%j", invalid(field2, "integer|Long"));
          break;
        case "float":
        case "double":
          gen('if(typeof %s!=="number")', ref)("return%j", invalid(field2, "number"));
          break;
        case "bool":
          gen('if(typeof %s!=="boolean")', ref)("return%j", invalid(field2, "boolean"));
          break;
        case "string":
          gen("if(!util.isString(%s))", ref)("return%j", invalid(field2, "string"));
          break;
        case "bytes":
          gen('if(!(%s&&typeof %s.length==="number"||util.isString(%s)))', ref, ref, ref)("return%j", invalid(field2, "buffer"));
          break;
      }
    }
    return gen;
  }
  function genVerifyKey(gen, field2, ref) {
    switch (field2.keyType) {
      case "int32":
      case "uint32":
      case "sint32":
      case "fixed32":
      case "sfixed32":
        gen("if(!util.key32Re.test(%s))", ref)("return%j", invalid(field2, "integer key"));
        break;
      case "int64":
      case "uint64":
      case "sint64":
      case "fixed64":
      case "sfixed64":
        gen("if(!util.key64Re.test(%s))", ref)("return%j", invalid(field2, "integer|Long key"));
        break;
      case "bool":
        gen("if(!util.key2Re.test(%s))", ref)("return%j", invalid(field2, "boolean key"));
        break;
    }
    return gen;
  }
  function verifier(mtype) {
    var gen = util2.codegen(["m"], mtype.name + "$verify")('if(typeof m!=="object"||m===null)')("return%j", "object expected");
    var oneofs = mtype.oneofsArray, seenFirstField = {};
    if (oneofs.length) gen("var p={}");
    for (var i = 0; i < /* initializes */
    mtype.fieldsArray.length; ++i) {
      var field2 = mtype._fieldsArray[i].resolve(), ref = "m" + util2.safeProp(field2.name);
      if (field2.optional) gen("if(%s!=null&&m.hasOwnProperty(%j)){", ref, field2.name);
      if (field2.map) {
        gen("if(!util.isObject(%s))", ref)("return%j", invalid(field2, "object"))("var k=Object.keys(%s)", ref)("for(var i=0;i<k.length;++i){");
        genVerifyKey(gen, field2, "k[i]");
        genVerifyValue(gen, field2, i, ref + "[k[i]]")("}");
      } else if (field2.repeated) {
        gen("if(!Array.isArray(%s))", ref)("return%j", invalid(field2, "array"))("for(var i=0;i<%s.length;++i){", ref);
        genVerifyValue(gen, field2, i, ref + "[i]")("}");
      } else {
        if (field2.partOf) {
          var oneofProp = util2.safeProp(field2.partOf.name);
          if (seenFirstField[field2.partOf.name] === 1) gen("if(p%s===1)", oneofProp)("return%j", field2.partOf.name + ": multiple values");
          seenFirstField[field2.partOf.name] = 1;
          gen("p%s=1", oneofProp);
        }
        genVerifyValue(gen, field2, i, ref);
      }
      if (field2.optional) gen("}");
    }
    return gen("return null");
  }
  return verifier_1;
}
var converter = {};
var hasRequiredConverter;
function requireConverter() {
  if (hasRequiredConverter) return converter;
  hasRequiredConverter = 1;
  (function(exports$1) {
    var converter2 = exports$1;
    var Enum = require_enum(), util2 = requireUtil();
    function genValuePartial_fromObject(gen, field2, fieldIndex, prop) {
      var defaultAlreadyEmitted = false;
      if (field2.resolvedType) {
        if (field2.resolvedType instanceof Enum) {
          gen("switch(d%s){", prop);
          for (var values = field2.resolvedType.values, keys = Object.keys(values), i = 0; i < keys.length; ++i) {
            if (values[keys[i]] === field2.typeDefault && !defaultAlreadyEmitted) {
              gen("default:")('if(typeof(d%s)==="number"){m%s=d%s;break}', prop, prop, prop);
              if (!field2.repeated) gen("break");
              defaultAlreadyEmitted = true;
            }
            gen("case%j:", keys[i])("case %i:", values[keys[i]])("m%s=%j", prop, values[keys[i]])("break");
          }
          gen("}");
        } else gen('if(typeof d%s!=="object")', prop)("throw TypeError(%j)", field2.fullName + ": object expected")("m%s=types[%i].fromObject(d%s)", prop, fieldIndex, prop);
      } else {
        var isUnsigned = false;
        switch (field2.type) {
          case "double":
          case "float":
            gen("m%s=Number(d%s)", prop, prop);
            break;
          case "uint32":
          case "fixed32":
            gen("m%s=d%s>>>0", prop, prop);
            break;
          case "int32":
          case "sint32":
          case "sfixed32":
            gen("m%s=d%s|0", prop, prop);
            break;
          case "uint64":
            isUnsigned = true;
          // eslint-disable-next-line no-fallthrough
          case "int64":
          case "sint64":
          case "fixed64":
          case "sfixed64":
            gen("if(util.Long)")("(m%s=util.Long.fromValue(d%s)).unsigned=%j", prop, prop, isUnsigned)('else if(typeof d%s==="string")', prop)("m%s=parseInt(d%s,10)", prop, prop)('else if(typeof d%s==="number")', prop)("m%s=d%s", prop, prop)('else if(typeof d%s==="object")', prop)("m%s=new util.LongBits(d%s.low>>>0,d%s.high>>>0).toNumber(%s)", prop, prop, prop, isUnsigned ? "true" : "");
            break;
          case "bytes":
            gen('if(typeof d%s==="string")', prop)("util.base64.decode(d%s,m%s=util.newBuffer(util.base64.length(d%s)),0)", prop, prop, prop)("else if(d%s.length >= 0)", prop)("m%s=d%s", prop, prop);
            break;
          case "string":
            gen("m%s=String(d%s)", prop, prop);
            break;
          case "bool":
            gen("m%s=Boolean(d%s)", prop, prop);
            break;
        }
      }
      return gen;
    }
    converter2.fromObject = function fromObject(mtype) {
      var fields = mtype.fieldsArray;
      var gen = util2.codegen(["d"], mtype.name + "$fromObject")("if(d instanceof this.ctor)")("return d");
      if (!fields.length) return gen("return new this.ctor");
      gen("var m=new this.ctor");
      for (var i = 0; i < fields.length; ++i) {
        var field2 = fields[i].resolve(), prop = util2.safeProp(field2.name);
        if (field2.map) {
          gen("if(d%s){", prop)('if(typeof d%s!=="object")', prop)("throw TypeError(%j)", field2.fullName + ": object expected")("m%s={}", prop)("for(var ks=Object.keys(d%s),i=0;i<ks.length;++i){", prop);
          genValuePartial_fromObject(
            gen,
            field2,
            /* not sorted */
            i,
            prop + "[ks[i]]"
          )("}")("}");
        } else if (field2.repeated) {
          gen("if(d%s){", prop)("if(!Array.isArray(d%s))", prop)("throw TypeError(%j)", field2.fullName + ": array expected")("m%s=[]", prop)("for(var i=0;i<d%s.length;++i){", prop);
          genValuePartial_fromObject(
            gen,
            field2,
            /* not sorted */
            i,
            prop + "[i]"
          )("}")("}");
        } else {
          if (!(field2.resolvedType instanceof Enum)) gen("if(d%s!=null){", prop);
          genValuePartial_fromObject(
            gen,
            field2,
            /* not sorted */
            i,
            prop
          );
          if (!(field2.resolvedType instanceof Enum)) gen("}");
        }
      }
      return gen("return m");
    };
    function genValuePartial_toObject(gen, field2, fieldIndex, prop) {
      if (field2.resolvedType) {
        if (field2.resolvedType instanceof Enum) gen("d%s=o.enums===String?(types[%i].values[m%s]===undefined?m%s:types[%i].values[m%s]):m%s", prop, fieldIndex, prop, prop, fieldIndex, prop, prop);
        else gen("d%s=types[%i].toObject(m%s,o)", prop, fieldIndex, prop);
      } else {
        var isUnsigned = false;
        switch (field2.type) {
          case "double":
          case "float":
            gen("d%s=o.json&&!isFinite(m%s)?String(m%s):m%s", prop, prop, prop, prop);
            break;
          case "uint64":
            isUnsigned = true;
          // eslint-disable-next-line no-fallthrough
          case "int64":
          case "sint64":
          case "fixed64":
          case "sfixed64":
            gen('if(typeof m%s==="number")', prop)("d%s=o.longs===String?String(m%s):m%s", prop, prop, prop)("else")("d%s=o.longs===String?util.Long.prototype.toString.call(m%s):o.longs===Number?new util.LongBits(m%s.low>>>0,m%s.high>>>0).toNumber(%s):m%s", prop, prop, prop, prop, isUnsigned ? "true" : "", prop);
            break;
          case "bytes":
            gen("d%s=o.bytes===String?util.base64.encode(m%s,0,m%s.length):o.bytes===Array?Array.prototype.slice.call(m%s):m%s", prop, prop, prop, prop, prop);
            break;
          default:
            gen("d%s=m%s", prop, prop);
            break;
        }
      }
      return gen;
    }
    converter2.toObject = function toObject(mtype) {
      var fields = mtype.fieldsArray.slice().sort(util2.compareFieldsById);
      if (!fields.length)
        return util2.codegen()("return {}");
      var gen = util2.codegen(["m", "o"], mtype.name + "$toObject")("if(!o)")("o={}")("var d={}");
      var repeatedFields = [], mapFields = [], normalFields = [], i = 0;
      for (; i < fields.length; ++i)
        if (!fields[i].partOf)
          (fields[i].resolve().repeated ? repeatedFields : fields[i].map ? mapFields : normalFields).push(fields[i]);
      if (repeatedFields.length) {
        gen("if(o.arrays||o.defaults){");
        for (i = 0; i < repeatedFields.length; ++i) gen("d%s=[]", util2.safeProp(repeatedFields[i].name));
        gen("}");
      }
      if (mapFields.length) {
        gen("if(o.objects||o.defaults){");
        for (i = 0; i < mapFields.length; ++i) gen("d%s={}", util2.safeProp(mapFields[i].name));
        gen("}");
      }
      if (normalFields.length) {
        gen("if(o.defaults){");
        for (i = 0; i < normalFields.length; ++i) {
          var field2 = normalFields[i], prop = util2.safeProp(field2.name);
          if (field2.resolvedType instanceof Enum) gen("d%s=o.enums===String?%j:%j", prop, field2.resolvedType.valuesById[field2.typeDefault], field2.typeDefault);
          else if (field2.long) gen("if(util.Long){")("var n=new util.Long(%i,%i,%j)", field2.typeDefault.low, field2.typeDefault.high, field2.typeDefault.unsigned)("d%s=o.longs===String?n.toString():o.longs===Number?n.toNumber():n", prop)("}else")("d%s=o.longs===String?%j:%i", prop, field2.typeDefault.toString(), field2.typeDefault.toNumber());
          else if (field2.bytes) {
            var arrayDefault = "[" + Array.prototype.slice.call(field2.typeDefault).join(",") + "]";
            gen("if(o.bytes===String)d%s=%j", prop, String.fromCharCode.apply(String, field2.typeDefault))("else{")("d%s=%s", prop, arrayDefault)("if(o.bytes!==Array)d%s=util.newBuffer(d%s)", prop, prop)("}");
          } else gen("d%s=%j", prop, field2.typeDefault);
        }
        gen("}");
      }
      var hasKs2 = false;
      for (i = 0; i < fields.length; ++i) {
        var field2 = fields[i], index = mtype._fieldsArray.indexOf(field2), prop = util2.safeProp(field2.name);
        if (field2.map) {
          if (!hasKs2) {
            hasKs2 = true;
            gen("var ks2");
          }
          gen("if(m%s&&(ks2=Object.keys(m%s)).length){", prop, prop)("d%s={}", prop)("for(var j=0;j<ks2.length;++j){");
          genValuePartial_toObject(
            gen,
            field2,
            /* sorted */
            index,
            prop + "[ks2[j]]"
          )("}");
        } else if (field2.repeated) {
          gen("if(m%s&&m%s.length){", prop, prop)("d%s=[]", prop)("for(var j=0;j<m%s.length;++j){", prop);
          genValuePartial_toObject(
            gen,
            field2,
            /* sorted */
            index,
            prop + "[j]"
          )("}");
        } else {
          gen("if(m%s!=null&&m.hasOwnProperty(%j)){", prop, field2.name);
          genValuePartial_toObject(
            gen,
            field2,
            /* sorted */
            index,
            prop
          );
          if (field2.partOf) gen("if(o.oneofs)")("d%s=%j", util2.safeProp(field2.partOf.name), field2.name);
        }
        gen("}");
      }
      return gen("return d");
    };
  })(converter);
  return converter;
}
var wrappers = {};
var hasRequiredWrappers;
function requireWrappers() {
  if (hasRequiredWrappers) return wrappers;
  hasRequiredWrappers = 1;
  (function(exports$1) {
    var wrappers2 = exports$1;
    var Message = requireMessage();
    wrappers2[".google.protobuf.Any"] = {
      fromObject: function(object2) {
        if (object2 && object2["@type"]) {
          var name = object2["@type"].substring(object2["@type"].lastIndexOf("/") + 1);
          var type2 = this.lookup(name);
          if (type2) {
            var type_url = object2["@type"].charAt(0) === "." ? object2["@type"].slice(1) : object2["@type"];
            if (type_url.indexOf("/") === -1) {
              type_url = "/" + type_url;
            }
            return this.create({
              type_url,
              value: type2.encode(type2.fromObject(object2)).finish()
            });
          }
        }
        return this.fromObject(object2);
      },
      toObject: function(message2, options) {
        var googleApi = "type.googleapis.com/";
        var prefix = "";
        var name = "";
        if (options && options.json && message2.type_url && message2.value) {
          name = message2.type_url.substring(message2.type_url.lastIndexOf("/") + 1);
          prefix = message2.type_url.substring(0, message2.type_url.lastIndexOf("/") + 1);
          var type2 = this.lookup(name);
          if (type2)
            message2 = type2.decode(message2.value);
        }
        if (!(message2 instanceof this.ctor) && message2 instanceof Message) {
          var object2 = message2.$type.toObject(message2, options);
          var messageName = message2.$type.fullName[0] === "." ? message2.$type.fullName.slice(1) : message2.$type.fullName;
          if (prefix === "") {
            prefix = googleApi;
          }
          name = prefix + messageName;
          object2["@type"] = name;
          return object2;
        }
        return this.toObject(message2, options);
      }
    };
  })(wrappers);
  return wrappers;
}
var type;
var hasRequiredType;
function requireType() {
  if (hasRequiredType) return type;
  hasRequiredType = 1;
  type = Type;
  var Namespace = requireNamespace();
  ((Type.prototype = Object.create(Namespace.prototype)).constructor = Type).className = "Type";
  var Enum = require_enum(), OneOf = requireOneof(), Field = requireField(), MapField = requireMapfield(), Service = requireService(), Message = requireMessage(), Reader = requireReader(), Writer = requireWriter(), util2 = requireUtil(), encoder = requireEncoder(), decoder = requireDecoder(), verifier = requireVerifier(), converter2 = requireConverter(), wrappers2 = requireWrappers();
  function Type(name, options) {
    Namespace.call(this, name, options);
    this.fields = {};
    this.oneofs = void 0;
    this.extensions = void 0;
    this.reserved = void 0;
    this.group = void 0;
    this._fieldsById = null;
    this._fieldsArray = null;
    this._oneofsArray = null;
    this._ctor = null;
  }
  Object.defineProperties(Type.prototype, {
    /**
     * Message fields by id.
     * @name Type#fieldsById
     * @type {Object.<number,Field>}
     * @readonly
     */
    fieldsById: {
      get: function() {
        if (this._fieldsById)
          return this._fieldsById;
        this._fieldsById = {};
        for (var names = Object.keys(this.fields), i = 0; i < names.length; ++i) {
          var field2 = this.fields[names[i]], id = field2.id;
          if (this._fieldsById[id])
            throw Error("duplicate id " + id + " in " + this);
          this._fieldsById[id] = field2;
        }
        return this._fieldsById;
      }
    },
    /**
     * Fields of this message as an array for iteration.
     * @name Type#fieldsArray
     * @type {Field[]}
     * @readonly
     */
    fieldsArray: {
      get: function() {
        return this._fieldsArray || (this._fieldsArray = util2.toArray(this.fields));
      }
    },
    /**
     * Oneofs of this message as an array for iteration.
     * @name Type#oneofsArray
     * @type {OneOf[]}
     * @readonly
     */
    oneofsArray: {
      get: function() {
        return this._oneofsArray || (this._oneofsArray = util2.toArray(this.oneofs));
      }
    },
    /**
     * The registered constructor, if any registered, otherwise a generic constructor.
     * Assigning a function replaces the internal constructor. If the function does not extend {@link Message} yet, its prototype will be setup accordingly and static methods will be populated. If it already extends {@link Message}, it will just replace the internal constructor.
     * @name Type#ctor
     * @type {Constructor<{}>}
     */
    ctor: {
      get: function() {
        return this._ctor || (this.ctor = Type.generateConstructor(this)());
      },
      set: function(ctor) {
        var prototype = ctor.prototype;
        if (!(prototype instanceof Message)) {
          (ctor.prototype = new Message()).constructor = ctor;
          util2.merge(ctor.prototype, prototype);
        }
        ctor.$type = ctor.prototype.$type = this;
        util2.merge(ctor, Message, true);
        this._ctor = ctor;
        var i = 0;
        for (; i < /* initializes */
        this.fieldsArray.length; ++i)
          this._fieldsArray[i].resolve();
        var ctorProperties = {};
        for (i = 0; i < /* initializes */
        this.oneofsArray.length; ++i)
          ctorProperties[this._oneofsArray[i].resolve().name] = {
            get: util2.oneOfGetter(this._oneofsArray[i].oneof),
            set: util2.oneOfSetter(this._oneofsArray[i].oneof)
          };
        if (i)
          Object.defineProperties(ctor.prototype, ctorProperties);
      }
    }
  });
  Type.generateConstructor = function generateConstructor(mtype) {
    var gen = util2.codegen(["p"], mtype.name);
    for (var i = 0, field2; i < mtype.fieldsArray.length; ++i)
      if ((field2 = mtype._fieldsArray[i]).map) gen("this%s={}", util2.safeProp(field2.name));
      else if (field2.repeated) gen("this%s=[]", util2.safeProp(field2.name));
    return gen("if(p)for(var ks=Object.keys(p),i=0;i<ks.length;++i)if(p[ks[i]]!=null)")("this[ks[i]]=p[ks[i]]");
  };
  function clearCache(type2) {
    type2._fieldsById = type2._fieldsArray = type2._oneofsArray = null;
    delete type2.encode;
    delete type2.decode;
    delete type2.verify;
    return type2;
  }
  Type.fromJSON = function fromJSON(name, json) {
    var type2 = new Type(name, json.options);
    type2.extensions = json.extensions;
    type2.reserved = json.reserved;
    var names = Object.keys(json.fields), i = 0;
    for (; i < names.length; ++i)
      type2.add(
        (typeof json.fields[names[i]].keyType !== "undefined" ? MapField.fromJSON : Field.fromJSON)(names[i], json.fields[names[i]])
      );
    if (json.oneofs)
      for (names = Object.keys(json.oneofs), i = 0; i < names.length; ++i)
        type2.add(OneOf.fromJSON(names[i], json.oneofs[names[i]]));
    if (json.nested)
      for (names = Object.keys(json.nested), i = 0; i < names.length; ++i) {
        var nested2 = json.nested[names[i]];
        type2.add(
          // most to least likely
          (nested2.id !== void 0 ? Field.fromJSON : nested2.fields !== void 0 ? Type.fromJSON : nested2.values !== void 0 ? Enum.fromJSON : nested2.methods !== void 0 ? Service.fromJSON : Namespace.fromJSON)(names[i], nested2)
        );
      }
    if (json.extensions && json.extensions.length)
      type2.extensions = json.extensions;
    if (json.reserved && json.reserved.length)
      type2.reserved = json.reserved;
    if (json.group)
      type2.group = true;
    if (json.comment)
      type2.comment = json.comment;
    if (json.edition)
      type2._edition = json.edition;
    type2._defaultEdition = "proto3";
    return type2;
  };
  Type.prototype.toJSON = function toJSON(toJSONOptions) {
    var inherited = Namespace.prototype.toJSON.call(this, toJSONOptions);
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util2.toObject([
      "edition",
      this._editionToJSON(),
      "options",
      inherited && inherited.options || void 0,
      "oneofs",
      Namespace.arrayToJSON(this.oneofsArray, toJSONOptions),
      "fields",
      Namespace.arrayToJSON(this.fieldsArray.filter(function(obj) {
        return !obj.declaringField;
      }), toJSONOptions) || {},
      "extensions",
      this.extensions && this.extensions.length ? this.extensions : void 0,
      "reserved",
      this.reserved && this.reserved.length ? this.reserved : void 0,
      "group",
      this.group || void 0,
      "nested",
      inherited && inherited.nested || void 0,
      "comment",
      keepComments ? this.comment : void 0
    ]);
  };
  Type.prototype.resolveAll = function resolveAll() {
    if (!this._needsRecursiveResolve) return this;
    Namespace.prototype.resolveAll.call(this);
    var oneofs = this.oneofsArray;
    i = 0;
    while (i < oneofs.length)
      oneofs[i++].resolve();
    var fields = this.fieldsArray, i = 0;
    while (i < fields.length)
      fields[i++].resolve();
    return this;
  };
  Type.prototype._resolveFeaturesRecursive = function _resolveFeaturesRecursive(edition) {
    if (!this._needsRecursiveFeatureResolution) return this;
    edition = this._edition || edition;
    Namespace.prototype._resolveFeaturesRecursive.call(this, edition);
    this.oneofsArray.forEach((oneof2) => {
      oneof2._resolveFeatures(edition);
    });
    this.fieldsArray.forEach((field2) => {
      field2._resolveFeatures(edition);
    });
    return this;
  };
  Type.prototype.get = function get(name) {
    return this.fields[name] || this.oneofs && this.oneofs[name] || this.nested && this.nested[name] || null;
  };
  Type.prototype.add = function add(object2) {
    if (this.get(object2.name))
      throw Error("duplicate name '" + object2.name + "' in " + this);
    if (object2 instanceof Field && object2.extend === void 0) {
      if (this._fieldsById ? (
        /* istanbul ignore next */
        this._fieldsById[object2.id]
      ) : this.fieldsById[object2.id])
        throw Error("duplicate id " + object2.id + " in " + this);
      if (this.isReservedId(object2.id))
        throw Error("id " + object2.id + " is reserved in " + this);
      if (this.isReservedName(object2.name))
        throw Error("name '" + object2.name + "' is reserved in " + this);
      if (object2.parent)
        object2.parent.remove(object2);
      this.fields[object2.name] = object2;
      object2.message = this;
      object2.onAdd(this);
      return clearCache(this);
    }
    if (object2 instanceof OneOf) {
      if (!this.oneofs)
        this.oneofs = {};
      this.oneofs[object2.name] = object2;
      object2.onAdd(this);
      return clearCache(this);
    }
    return Namespace.prototype.add.call(this, object2);
  };
  Type.prototype.remove = function remove(object2) {
    if (object2 instanceof Field && object2.extend === void 0) {
      if (!this.fields || this.fields[object2.name] !== object2)
        throw Error(object2 + " is not a member of " + this);
      delete this.fields[object2.name];
      object2.parent = null;
      object2.onRemove(this);
      return clearCache(this);
    }
    if (object2 instanceof OneOf) {
      if (!this.oneofs || this.oneofs[object2.name] !== object2)
        throw Error(object2 + " is not a member of " + this);
      delete this.oneofs[object2.name];
      object2.parent = null;
      object2.onRemove(this);
      return clearCache(this);
    }
    return Namespace.prototype.remove.call(this, object2);
  };
  Type.prototype.isReservedId = function isReservedId(id) {
    return Namespace.isReservedId(this.reserved, id);
  };
  Type.prototype.isReservedName = function isReservedName(name) {
    return Namespace.isReservedName(this.reserved, name);
  };
  Type.prototype.create = function create(properties) {
    return new this.ctor(properties);
  };
  Type.prototype.setup = function setup() {
    var fullName = this.fullName, types2 = [];
    for (var i = 0; i < /* initializes */
    this.fieldsArray.length; ++i)
      types2.push(this._fieldsArray[i].resolve().resolvedType);
    this.encode = encoder(this)({
      Writer,
      types: types2,
      util: util2
    });
    this.decode = decoder(this)({
      Reader,
      types: types2,
      util: util2
    });
    this.verify = verifier(this)({
      types: types2,
      util: util2
    });
    this.fromObject = converter2.fromObject(this)({
      types: types2,
      util: util2
    });
    this.toObject = converter2.toObject(this)({
      types: types2,
      util: util2
    });
    var wrapper = wrappers2[fullName];
    if (wrapper) {
      var originalThis = Object.create(this);
      originalThis.fromObject = this.fromObject;
      this.fromObject = wrapper.fromObject.bind(originalThis);
      originalThis.toObject = this.toObject;
      this.toObject = wrapper.toObject.bind(originalThis);
    }
    return this;
  };
  Type.prototype.encode = function encode_setup(message2, writer2) {
    return this.setup().encode(message2, writer2);
  };
  Type.prototype.encodeDelimited = function encodeDelimited(message2, writer2) {
    return this.encode(message2, writer2 && writer2.len ? writer2.fork() : writer2).ldelim();
  };
  Type.prototype.decode = function decode_setup(reader2, length) {
    return this.setup().decode(reader2, length);
  };
  Type.prototype.decodeDelimited = function decodeDelimited(reader2) {
    if (!(reader2 instanceof Reader))
      reader2 = Reader.create(reader2);
    return this.decode(reader2, reader2.uint32());
  };
  Type.prototype.verify = function verify_setup(message2) {
    return this.setup().verify(message2);
  };
  Type.prototype.fromObject = function fromObject(object2) {
    return this.setup().fromObject(object2);
  };
  Type.prototype.toObject = function toObject(message2, options) {
    return this.setup().toObject(message2, options);
  };
  Type.d = function decorateType(typeName) {
    return function typeDecorator(target) {
      util2.decorateType(target, typeName);
    };
  };
  return type;
}
var root;
var hasRequiredRoot;
function requireRoot() {
  if (hasRequiredRoot) return root;
  hasRequiredRoot = 1;
  root = Root;
  var Namespace = requireNamespace();
  ((Root.prototype = Object.create(Namespace.prototype)).constructor = Root).className = "Root";
  var Field = requireField(), Enum = require_enum(), OneOf = requireOneof(), util2 = requireUtil();
  var Type, parse, common;
  function Root(options) {
    Namespace.call(this, "", options);
    this.deferred = [];
    this.files = [];
    this._edition = "proto2";
    this._fullyQualifiedObjects = {};
  }
  Root.fromJSON = function fromJSON(json, root2) {
    if (!root2)
      root2 = new Root();
    if (json.options)
      root2.setOptions(json.options);
    return root2.addJSON(json.nested).resolveAll();
  };
  Root.prototype.resolvePath = util2.path.resolve;
  Root.prototype.fetch = util2.fetch;
  function SYNC() {
  }
  Root.prototype.load = function load(filename, options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = void 0;
    }
    var self2 = this;
    if (!callback) {
      return util2.asPromise(load, self2, filename, options);
    }
    var sync = callback === SYNC;
    function finish(err, root2) {
      if (!callback) {
        return;
      }
      if (sync) {
        throw err;
      }
      if (root2) {
        root2.resolveAll();
      }
      var cb = callback;
      callback = null;
      cb(err, root2);
    }
    function getBundledFileName(filename2) {
      var idx = filename2.lastIndexOf("google/protobuf/");
      if (idx > -1) {
        var altname = filename2.substring(idx);
        if (altname in common) return altname;
      }
      return null;
    }
    function process(filename2, source) {
      try {
        if (util2.isString(source) && source.charAt(0) === "{")
          source = JSON.parse(source);
        if (!util2.isString(source))
          self2.setOptions(source.options).addJSON(source.nested);
        else {
          parse.filename = filename2;
          var parsed = parse(source, self2, options), resolved2, i2 = 0;
          if (parsed.imports) {
            for (; i2 < parsed.imports.length; ++i2)
              if (resolved2 = getBundledFileName(parsed.imports[i2]) || self2.resolvePath(filename2, parsed.imports[i2]))
                fetch(resolved2);
          }
          if (parsed.weakImports) {
            for (i2 = 0; i2 < parsed.weakImports.length; ++i2)
              if (resolved2 = getBundledFileName(parsed.weakImports[i2]) || self2.resolvePath(filename2, parsed.weakImports[i2]))
                fetch(resolved2, true);
          }
        }
      } catch (err) {
        finish(err);
      }
      if (!sync && !queued) {
        finish(null, self2);
      }
    }
    function fetch(filename2, weak) {
      filename2 = getBundledFileName(filename2) || filename2;
      if (self2.files.indexOf(filename2) > -1) {
        return;
      }
      self2.files.push(filename2);
      if (filename2 in common) {
        if (sync) {
          process(filename2, common[filename2]);
        } else {
          ++queued;
          setTimeout(function() {
            --queued;
            process(filename2, common[filename2]);
          });
        }
        return;
      }
      if (sync) {
        var source;
        try {
          source = util2.fs.readFileSync(filename2).toString("utf8");
        } catch (err) {
          if (!weak)
            finish(err);
          return;
        }
        process(filename2, source);
      } else {
        ++queued;
        self2.fetch(filename2, function(err, source2) {
          --queued;
          if (!callback) {
            return;
          }
          if (err) {
            if (!weak)
              finish(err);
            else if (!queued)
              finish(null, self2);
            return;
          }
          process(filename2, source2);
        });
      }
    }
    var queued = 0;
    if (util2.isString(filename)) {
      filename = [filename];
    }
    for (var i = 0, resolved; i < filename.length; ++i)
      if (resolved = self2.resolvePath("", filename[i]))
        fetch(resolved);
    if (sync) {
      self2.resolveAll();
      return self2;
    }
    if (!queued) {
      finish(null, self2);
    }
    return self2;
  };
  Root.prototype.loadSync = function loadSync(filename, options) {
    if (!util2.isNode)
      throw Error("not supported");
    return this.load(filename, options, SYNC);
  };
  Root.prototype.resolveAll = function resolveAll() {
    if (!this._needsRecursiveResolve) return this;
    if (this.deferred.length)
      throw Error("unresolvable extensions: " + this.deferred.map(function(field2) {
        return "'extend " + field2.extend + "' in " + field2.parent.fullName;
      }).join(", "));
    return Namespace.prototype.resolveAll.call(this);
  };
  var exposeRe = /^[A-Z]/;
  function tryHandleExtension(root2, field2) {
    var extendedType = field2.parent.lookup(field2.extend);
    if (extendedType) {
      var sisterField = new Field(field2.fullName, field2.id, field2.type, field2.rule, void 0, field2.options);
      if (extendedType.get(sisterField.name)) {
        return true;
      }
      sisterField.declaringField = field2;
      field2.extensionField = sisterField;
      extendedType.add(sisterField);
      return true;
    }
    return false;
  }
  Root.prototype._handleAdd = function _handleAdd(object2) {
    if (object2 instanceof Field) {
      if (
        /* an extension field (implies not part of a oneof) */
        object2.extend !== void 0 && /* not already handled */
        !object2.extensionField
      ) {
        if (!tryHandleExtension(this, object2))
          this.deferred.push(object2);
      }
    } else if (object2 instanceof Enum) {
      if (exposeRe.test(object2.name))
        object2.parent[object2.name] = object2.values;
    } else if (!(object2 instanceof OneOf)) {
      if (object2 instanceof Type)
        for (var i = 0; i < this.deferred.length; )
          if (tryHandleExtension(this, this.deferred[i]))
            this.deferred.splice(i, 1);
          else
            ++i;
      for (var j = 0; j < /* initializes */
      object2.nestedArray.length; ++j)
        this._handleAdd(object2._nestedArray[j]);
      if (exposeRe.test(object2.name))
        object2.parent[object2.name] = object2;
    }
    if (object2 instanceof Type || object2 instanceof Enum || object2 instanceof Field) {
      this._fullyQualifiedObjects[object2.fullName] = object2;
    }
  };
  Root.prototype._handleRemove = function _handleRemove(object2) {
    if (object2 instanceof Field) {
      if (
        /* an extension field */
        object2.extend !== void 0
      ) {
        if (
          /* already handled */
          object2.extensionField
        ) {
          object2.extensionField.parent.remove(object2.extensionField);
          object2.extensionField = null;
        } else {
          var index = this.deferred.indexOf(object2);
          if (index > -1)
            this.deferred.splice(index, 1);
        }
      }
    } else if (object2 instanceof Enum) {
      if (exposeRe.test(object2.name))
        delete object2.parent[object2.name];
    } else if (object2 instanceof Namespace) {
      for (var i = 0; i < /* initializes */
      object2.nestedArray.length; ++i)
        this._handleRemove(object2._nestedArray[i]);
      if (exposeRe.test(object2.name))
        delete object2.parent[object2.name];
    }
    delete this._fullyQualifiedObjects[object2.fullName];
  };
  Root._configure = function(Type_, parse_, common_) {
    Type = Type_;
    parse = parse_;
    common = common_;
  };
  return root;
}
var hasRequiredUtil;
function requireUtil() {
  if (hasRequiredUtil) return util.exports;
  hasRequiredUtil = 1;
  var util$1 = util.exports = requireMinimal();
  var roots2 = requireRoots();
  var Type, Enum;
  util$1.codegen = requireCodegen();
  util$1.fetch = requireFetch();
  util$1.path = requirePath();
  util$1.fs = util$1.inquire("fs");
  util$1.toArray = function toArray(object2) {
    if (object2) {
      var keys = Object.keys(object2), array = new Array(keys.length), index = 0;
      while (index < keys.length)
        array[index] = object2[keys[index++]];
      return array;
    }
    return [];
  };
  util$1.toObject = function toObject(array) {
    var object2 = {}, index = 0;
    while (index < array.length) {
      var key = array[index++], val = array[index++];
      if (val !== void 0)
        object2[key] = val;
    }
    return object2;
  };
  var safePropBackslashRe = /\\/g, safePropQuoteRe = /"/g;
  util$1.isReserved = function isReserved(name) {
    return /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/.test(name);
  };
  util$1.safeProp = function safeProp(prop) {
    if (!/^[$\w_]+$/.test(prop) || util$1.isReserved(prop))
      return '["' + prop.replace(safePropBackslashRe, "\\\\").replace(safePropQuoteRe, '\\"') + '"]';
    return "." + prop;
  };
  util$1.ucFirst = function ucFirst(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
  };
  var camelCaseRe = /_([a-z])/g;
  util$1.camelCase = function camelCase(str) {
    return str.substring(0, 1) + str.substring(1).replace(camelCaseRe, function($0, $1) {
      return $1.toUpperCase();
    });
  };
  util$1.compareFieldsById = function compareFieldsById(a, b) {
    return a.id - b.id;
  };
  util$1.decorateType = function decorateType(ctor, typeName) {
    if (ctor.$type) {
      if (typeName && ctor.$type.name !== typeName) {
        util$1.decorateRoot.remove(ctor.$type);
        ctor.$type.name = typeName;
        util$1.decorateRoot.add(ctor.$type);
      }
      return ctor.$type;
    }
    if (!Type)
      Type = requireType();
    var type2 = new Type(typeName || ctor.name);
    util$1.decorateRoot.add(type2);
    type2.ctor = ctor;
    Object.defineProperty(ctor, "$type", { value: type2, enumerable: false });
    Object.defineProperty(ctor.prototype, "$type", { value: type2, enumerable: false });
    return type2;
  };
  var decorateEnumIndex = 0;
  util$1.decorateEnum = function decorateEnum(object2) {
    if (object2.$type)
      return object2.$type;
    if (!Enum)
      Enum = require_enum();
    var enm = new Enum("Enum" + decorateEnumIndex++, object2);
    util$1.decorateRoot.add(enm);
    Object.defineProperty(object2, "$type", { value: enm, enumerable: false });
    return enm;
  };
  util$1.setProperty = function setProperty(dst, path, value, ifNotSet) {
    function setProp(dst2, path2, value2) {
      var part = path2.shift();
      if (part === "__proto__" || part === "prototype") {
        return dst2;
      }
      if (path2.length > 0) {
        dst2[part] = setProp(dst2[part] || {}, path2, value2);
      } else {
        var prevValue = dst2[part];
        if (prevValue && ifNotSet)
          return dst2;
        if (prevValue)
          value2 = [].concat(prevValue).concat(value2);
        dst2[part] = value2;
      }
      return dst2;
    }
    if (typeof dst !== "object")
      throw TypeError("dst must be an object");
    if (!path)
      throw TypeError("path must be specified");
    path = path.split(".");
    return setProp(dst, path, value);
  };
  Object.defineProperty(util$1, "decorateRoot", {
    get: function() {
      return roots2["decorated"] || (roots2["decorated"] = new (requireRoot())());
    }
  });
  return util.exports;
}
var hasRequiredTypes;
function requireTypes() {
  if (hasRequiredTypes) return types;
  hasRequiredTypes = 1;
  (function(exports$1) {
    var types2 = exports$1;
    var util2 = requireUtil();
    var s = [
      "double",
      // 0
      "float",
      // 1
      "int32",
      // 2
      "uint32",
      // 3
      "sint32",
      // 4
      "fixed32",
      // 5
      "sfixed32",
      // 6
      "int64",
      // 7
      "uint64",
      // 8
      "sint64",
      // 9
      "fixed64",
      // 10
      "sfixed64",
      // 11
      "bool",
      // 12
      "string",
      // 13
      "bytes"
      // 14
    ];
    function bake(values, offset) {
      var i = 0, o = {};
      offset |= 0;
      while (i < values.length) o[s[i + offset]] = values[i++];
      return o;
    }
    types2.basic = bake([
      /* double   */
      1,
      /* float    */
      5,
      /* int32    */
      0,
      /* uint32   */
      0,
      /* sint32   */
      0,
      /* fixed32  */
      5,
      /* sfixed32 */
      5,
      /* int64    */
      0,
      /* uint64   */
      0,
      /* sint64   */
      0,
      /* fixed64  */
      1,
      /* sfixed64 */
      1,
      /* bool     */
      0,
      /* string   */
      2,
      /* bytes    */
      2
    ]);
    types2.defaults = bake([
      /* double   */
      0,
      /* float    */
      0,
      /* int32    */
      0,
      /* uint32   */
      0,
      /* sint32   */
      0,
      /* fixed32  */
      0,
      /* sfixed32 */
      0,
      /* int64    */
      0,
      /* uint64   */
      0,
      /* sint64   */
      0,
      /* fixed64  */
      0,
      /* sfixed64 */
      0,
      /* bool     */
      false,
      /* string   */
      "",
      /* bytes    */
      util2.emptyArray,
      /* message  */
      null
    ]);
    types2.long = bake([
      /* int64    */
      0,
      /* uint64   */
      0,
      /* sint64   */
      0,
      /* fixed64  */
      1,
      /* sfixed64 */
      1
    ], 7);
    types2.mapKey = bake([
      /* int32    */
      0,
      /* uint32   */
      0,
      /* sint32   */
      0,
      /* fixed32  */
      5,
      /* sfixed32 */
      5,
      /* int64    */
      0,
      /* uint64   */
      0,
      /* sint64   */
      0,
      /* fixed64  */
      1,
      /* sfixed64 */
      1,
      /* bool     */
      0,
      /* string   */
      2
    ], 2);
    types2.packed = bake([
      /* double   */
      1,
      /* float    */
      5,
      /* int32    */
      0,
      /* uint32   */
      0,
      /* sint32   */
      0,
      /* fixed32  */
      5,
      /* sfixed32 */
      5,
      /* int64    */
      0,
      /* uint64   */
      0,
      /* sint64   */
      0,
      /* fixed64  */
      1,
      /* sfixed64 */
      1,
      /* bool     */
      0
    ]);
  })(types);
  return types;
}
var field;
var hasRequiredField;
function requireField() {
  if (hasRequiredField) return field;
  hasRequiredField = 1;
  field = Field;
  var ReflectionObject = requireObject();
  ((Field.prototype = Object.create(ReflectionObject.prototype)).constructor = Field).className = "Field";
  var Enum = require_enum(), types2 = requireTypes(), util2 = requireUtil();
  var Type;
  var ruleRe = /^required|optional|repeated$/;
  Field.fromJSON = function fromJSON(name, json) {
    var field2 = new Field(name, json.id, json.type, json.rule, json.extend, json.options, json.comment);
    if (json.edition)
      field2._edition = json.edition;
    field2._defaultEdition = "proto3";
    return field2;
  };
  function Field(name, id, type2, rule, extend, options, comment) {
    if (util2.isObject(rule)) {
      comment = extend;
      options = rule;
      rule = extend = void 0;
    } else if (util2.isObject(extend)) {
      comment = options;
      options = extend;
      extend = void 0;
    }
    ReflectionObject.call(this, name, options);
    if (!util2.isInteger(id) || id < 0)
      throw TypeError("id must be a non-negative integer");
    if (!util2.isString(type2))
      throw TypeError("type must be a string");
    if (rule !== void 0 && !ruleRe.test(rule = rule.toString().toLowerCase()))
      throw TypeError("rule must be a string rule");
    if (extend !== void 0 && !util2.isString(extend))
      throw TypeError("extend must be a string");
    if (rule === "proto3_optional") {
      rule = "optional";
    }
    this.rule = rule && rule !== "optional" ? rule : void 0;
    this.type = type2;
    this.id = id;
    this.extend = extend || void 0;
    this.repeated = rule === "repeated";
    this.map = false;
    this.message = null;
    this.partOf = null;
    this.typeDefault = null;
    this.defaultValue = null;
    this.long = util2.Long ? types2.long[type2] !== void 0 : (
      /* istanbul ignore next */
      false
    );
    this.bytes = type2 === "bytes";
    this.resolvedType = null;
    this.extensionField = null;
    this.declaringField = null;
    this.comment = comment;
  }
  Object.defineProperty(Field.prototype, "required", {
    get: function() {
      return this._features.field_presence === "LEGACY_REQUIRED";
    }
  });
  Object.defineProperty(Field.prototype, "optional", {
    get: function() {
      return !this.required;
    }
  });
  Object.defineProperty(Field.prototype, "delimited", {
    get: function() {
      return this.resolvedType instanceof Type && this._features.message_encoding === "DELIMITED";
    }
  });
  Object.defineProperty(Field.prototype, "packed", {
    get: function() {
      return this._features.repeated_field_encoding === "PACKED";
    }
  });
  Object.defineProperty(Field.prototype, "hasPresence", {
    get: function() {
      if (this.repeated || this.map) {
        return false;
      }
      return this.partOf || // oneofs
      this.declaringField || this.extensionField || // extensions
      this._features.field_presence !== "IMPLICIT";
    }
  });
  Field.prototype.setOption = function setOption(name, value, ifNotSet) {
    return ReflectionObject.prototype.setOption.call(this, name, value, ifNotSet);
  };
  Field.prototype.toJSON = function toJSON(toJSONOptions) {
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util2.toObject([
      "edition",
      this._editionToJSON(),
      "rule",
      this.rule !== "optional" && this.rule || void 0,
      "type",
      this.type,
      "id",
      this.id,
      "extend",
      this.extend,
      "options",
      this.options,
      "comment",
      keepComments ? this.comment : void 0
    ]);
  };
  Field.prototype.resolve = function resolve() {
    if (this.resolved)
      return this;
    if ((this.typeDefault = types2.defaults[this.type]) === void 0) {
      this.resolvedType = (this.declaringField ? this.declaringField.parent : this.parent).lookupTypeOrEnum(this.type);
      if (this.resolvedType instanceof Type)
        this.typeDefault = null;
      else
        this.typeDefault = this.resolvedType.values[Object.keys(this.resolvedType.values)[0]];
    } else if (this.options && this.options.proto3_optional) {
      this.typeDefault = null;
    }
    if (this.options && this.options["default"] != null) {
      this.typeDefault = this.options["default"];
      if (this.resolvedType instanceof Enum && typeof this.typeDefault === "string")
        this.typeDefault = this.resolvedType.values[this.typeDefault];
    }
    if (this.options) {
      if (this.options.packed !== void 0 && this.resolvedType && !(this.resolvedType instanceof Enum))
        delete this.options.packed;
      if (!Object.keys(this.options).length)
        this.options = void 0;
    }
    if (this.long) {
      this.typeDefault = util2.Long.fromNumber(this.typeDefault, this.type.charAt(0) === "u");
      if (Object.freeze)
        Object.freeze(this.typeDefault);
    } else if (this.bytes && typeof this.typeDefault === "string") {
      var buf;
      if (util2.base64.test(this.typeDefault))
        util2.base64.decode(this.typeDefault, buf = util2.newBuffer(util2.base64.length(this.typeDefault)), 0);
      else
        util2.utf8.write(this.typeDefault, buf = util2.newBuffer(util2.utf8.length(this.typeDefault)), 0);
      this.typeDefault = buf;
    }
    if (this.map)
      this.defaultValue = util2.emptyObject;
    else if (this.repeated)
      this.defaultValue = util2.emptyArray;
    else
      this.defaultValue = this.typeDefault;
    if (this.parent instanceof Type)
      this.parent.ctor.prototype[this.name] = this.defaultValue;
    return ReflectionObject.prototype.resolve.call(this);
  };
  Field.prototype._inferLegacyProtoFeatures = function _inferLegacyProtoFeatures(edition) {
    if (edition !== "proto2" && edition !== "proto3") {
      return {};
    }
    var features = {};
    if (this.rule === "required") {
      features.field_presence = "LEGACY_REQUIRED";
    }
    if (this.parent && types2.defaults[this.type] === void 0) {
      var type2 = this.parent.get(this.type.split(".").pop());
      if (type2 && type2 instanceof Type && type2.group) {
        features.message_encoding = "DELIMITED";
      }
    }
    if (this.getOption("packed") === true) {
      features.repeated_field_encoding = "PACKED";
    } else if (this.getOption("packed") === false) {
      features.repeated_field_encoding = "EXPANDED";
    }
    return features;
  };
  Field.prototype._resolveFeatures = function _resolveFeatures(edition) {
    return ReflectionObject.prototype._resolveFeatures.call(this, this._edition || edition);
  };
  Field.d = function decorateField(fieldId, fieldType, fieldRule, defaultValue) {
    if (typeof fieldType === "function")
      fieldType = util2.decorateType(fieldType).name;
    else if (fieldType && typeof fieldType === "object")
      fieldType = util2.decorateEnum(fieldType).name;
    return function fieldDecorator(prototype, fieldName) {
      util2.decorateType(prototype.constructor).add(new Field(fieldName, fieldId, fieldType, fieldRule, { "default": defaultValue }));
    };
  };
  Field._configure = function configure(Type_) {
    Type = Type_;
  };
  return field;
}
var oneof;
var hasRequiredOneof;
function requireOneof() {
  if (hasRequiredOneof) return oneof;
  hasRequiredOneof = 1;
  oneof = OneOf;
  var ReflectionObject = requireObject();
  ((OneOf.prototype = Object.create(ReflectionObject.prototype)).constructor = OneOf).className = "OneOf";
  var Field = requireField(), util2 = requireUtil();
  function OneOf(name, fieldNames, options, comment) {
    if (!Array.isArray(fieldNames)) {
      options = fieldNames;
      fieldNames = void 0;
    }
    ReflectionObject.call(this, name, options);
    if (!(fieldNames === void 0 || Array.isArray(fieldNames)))
      throw TypeError("fieldNames must be an Array");
    this.oneof = fieldNames || [];
    this.fieldsArray = [];
    this.comment = comment;
  }
  OneOf.fromJSON = function fromJSON(name, json) {
    return new OneOf(name, json.oneof, json.options, json.comment);
  };
  OneOf.prototype.toJSON = function toJSON(toJSONOptions) {
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util2.toObject([
      "options",
      this.options,
      "oneof",
      this.oneof,
      "comment",
      keepComments ? this.comment : void 0
    ]);
  };
  function addFieldsToParent(oneof2) {
    if (oneof2.parent) {
      for (var i = 0; i < oneof2.fieldsArray.length; ++i)
        if (!oneof2.fieldsArray[i].parent)
          oneof2.parent.add(oneof2.fieldsArray[i]);
    }
  }
  OneOf.prototype.add = function add(field2) {
    if (!(field2 instanceof Field))
      throw TypeError("field must be a Field");
    if (field2.parent && field2.parent !== this.parent)
      field2.parent.remove(field2);
    this.oneof.push(field2.name);
    this.fieldsArray.push(field2);
    field2.partOf = this;
    addFieldsToParent(this);
    return this;
  };
  OneOf.prototype.remove = function remove(field2) {
    if (!(field2 instanceof Field))
      throw TypeError("field must be a Field");
    var index = this.fieldsArray.indexOf(field2);
    if (index < 0)
      throw Error(field2 + " is not a member of " + this);
    this.fieldsArray.splice(index, 1);
    index = this.oneof.indexOf(field2.name);
    if (index > -1)
      this.oneof.splice(index, 1);
    field2.partOf = null;
    return this;
  };
  OneOf.prototype.onAdd = function onAdd(parent) {
    ReflectionObject.prototype.onAdd.call(this, parent);
    var self2 = this;
    for (var i = 0; i < this.oneof.length; ++i) {
      var field2 = parent.get(this.oneof[i]);
      if (field2 && !field2.partOf) {
        field2.partOf = self2;
        self2.fieldsArray.push(field2);
      }
    }
    addFieldsToParent(this);
  };
  OneOf.prototype.onRemove = function onRemove(parent) {
    for (var i = 0, field2; i < this.fieldsArray.length; ++i)
      if ((field2 = this.fieldsArray[i]).parent)
        field2.parent.remove(field2);
    ReflectionObject.prototype.onRemove.call(this, parent);
  };
  Object.defineProperty(OneOf.prototype, "isProto3Optional", {
    get: function() {
      if (this.fieldsArray == null || this.fieldsArray.length !== 1) {
        return false;
      }
      var field2 = this.fieldsArray[0];
      return field2.options != null && field2.options["proto3_optional"] === true;
    }
  });
  OneOf.d = function decorateOneOf() {
    var fieldNames = new Array(arguments.length), index = 0;
    while (index < arguments.length)
      fieldNames[index] = arguments[index++];
    return function oneOfDecorator(prototype, oneofName) {
      util2.decorateType(prototype.constructor).add(new OneOf(oneofName, fieldNames));
      Object.defineProperty(prototype, oneofName, {
        get: util2.oneOfGetter(fieldNames),
        set: util2.oneOfSetter(fieldNames)
      });
    };
  };
  return oneof;
}
var object;
var hasRequiredObject;
function requireObject() {
  if (hasRequiredObject) return object;
  hasRequiredObject = 1;
  object = ReflectionObject;
  ReflectionObject.className = "ReflectionObject";
  const OneOf = requireOneof();
  var util2 = requireUtil();
  var Root;
  var editions2023Defaults = { enum_type: "OPEN", field_presence: "EXPLICIT", json_format: "ALLOW", message_encoding: "LENGTH_PREFIXED", repeated_field_encoding: "PACKED", utf8_validation: "VERIFY" };
  var proto2Defaults = { enum_type: "CLOSED", field_presence: "EXPLICIT", json_format: "LEGACY_BEST_EFFORT", message_encoding: "LENGTH_PREFIXED", repeated_field_encoding: "EXPANDED", utf8_validation: "NONE" };
  var proto3Defaults = { enum_type: "OPEN", field_presence: "IMPLICIT", json_format: "ALLOW", message_encoding: "LENGTH_PREFIXED", repeated_field_encoding: "PACKED", utf8_validation: "VERIFY" };
  function ReflectionObject(name, options) {
    if (!util2.isString(name))
      throw TypeError("name must be a string");
    if (options && !util2.isObject(options))
      throw TypeError("options must be an object");
    this.options = options;
    this.parsedOptions = null;
    this.name = name;
    this._edition = null;
    this._defaultEdition = "proto2";
    this._features = {};
    this._featuresResolved = false;
    this.parent = null;
    this.resolved = false;
    this.comment = null;
    this.filename = null;
  }
  Object.defineProperties(ReflectionObject.prototype, {
    /**
     * Reference to the root namespace.
     * @name ReflectionObject#root
     * @type {Root}
     * @readonly
     */
    root: {
      get: function() {
        var ptr = this;
        while (ptr.parent !== null)
          ptr = ptr.parent;
        return ptr;
      }
    },
    /**
     * Full name including leading dot.
     * @name ReflectionObject#fullName
     * @type {string}
     * @readonly
     */
    fullName: {
      get: function() {
        var path = [this.name], ptr = this.parent;
        while (ptr) {
          path.unshift(ptr.name);
          ptr = ptr.parent;
        }
        return path.join(".");
      }
    }
  });
  ReflectionObject.prototype.toJSON = /* istanbul ignore next */
  function toJSON() {
    throw Error();
  };
  ReflectionObject.prototype.onAdd = function onAdd(parent) {
    if (this.parent && this.parent !== parent)
      this.parent.remove(this);
    this.parent = parent;
    this.resolved = false;
    var root2 = parent.root;
    if (root2 instanceof Root)
      root2._handleAdd(this);
  };
  ReflectionObject.prototype.onRemove = function onRemove(parent) {
    var root2 = parent.root;
    if (root2 instanceof Root)
      root2._handleRemove(this);
    this.parent = null;
    this.resolved = false;
  };
  ReflectionObject.prototype.resolve = function resolve() {
    if (this.resolved)
      return this;
    if (this.root instanceof Root)
      this.resolved = true;
    return this;
  };
  ReflectionObject.prototype._resolveFeaturesRecursive = function _resolveFeaturesRecursive(edition) {
    return this._resolveFeatures(this._edition || edition);
  };
  ReflectionObject.prototype._resolveFeatures = function _resolveFeatures(edition) {
    if (this._featuresResolved) {
      return;
    }
    var defaults = {};
    if (!edition) {
      throw new Error("Unknown edition for " + this.fullName);
    }
    var protoFeatures = Object.assign(
      this.options ? Object.assign({}, this.options.features) : {},
      this._inferLegacyProtoFeatures(edition)
    );
    if (this._edition) {
      if (edition === "proto2") {
        defaults = Object.assign({}, proto2Defaults);
      } else if (edition === "proto3") {
        defaults = Object.assign({}, proto3Defaults);
      } else if (edition === "2023") {
        defaults = Object.assign({}, editions2023Defaults);
      } else {
        throw new Error("Unknown edition: " + edition);
      }
      this._features = Object.assign(defaults, protoFeatures || {});
      this._featuresResolved = true;
      return;
    }
    if (this.partOf instanceof OneOf) {
      var lexicalParentFeaturesCopy = Object.assign({}, this.partOf._features);
      this._features = Object.assign(lexicalParentFeaturesCopy, protoFeatures || {});
    } else if (this.declaringField) ;
    else if (this.parent) {
      var parentFeaturesCopy = Object.assign({}, this.parent._features);
      this._features = Object.assign(parentFeaturesCopy, protoFeatures || {});
    } else {
      throw new Error("Unable to find a parent for " + this.fullName);
    }
    if (this.extensionField) {
      this.extensionField._features = this._features;
    }
    this._featuresResolved = true;
  };
  ReflectionObject.prototype._inferLegacyProtoFeatures = function _inferLegacyProtoFeatures() {
    return {};
  };
  ReflectionObject.prototype.getOption = function getOption(name) {
    if (this.options)
      return this.options[name];
    return void 0;
  };
  ReflectionObject.prototype.setOption = function setOption(name, value, ifNotSet) {
    if (!this.options)
      this.options = {};
    if (/^features\./.test(name)) {
      util2.setProperty(this.options, name, value, ifNotSet);
    } else if (!ifNotSet || this.options[name] === void 0) {
      if (this.getOption(name) !== value) this.resolved = false;
      this.options[name] = value;
    }
    return this;
  };
  ReflectionObject.prototype.setParsedOption = function setParsedOption(name, value, propName) {
    if (!this.parsedOptions) {
      this.parsedOptions = [];
    }
    var parsedOptions = this.parsedOptions;
    if (propName) {
      var opt = parsedOptions.find(function(opt2) {
        return Object.prototype.hasOwnProperty.call(opt2, name);
      });
      if (opt) {
        var newValue = opt[name];
        util2.setProperty(newValue, propName, value);
      } else {
        opt = {};
        opt[name] = util2.setProperty({}, propName, value);
        parsedOptions.push(opt);
      }
    } else {
      var newOpt = {};
      newOpt[name] = value;
      parsedOptions.push(newOpt);
    }
    return this;
  };
  ReflectionObject.prototype.setOptions = function setOptions(options, ifNotSet) {
    if (options)
      for (var keys = Object.keys(options), i = 0; i < keys.length; ++i)
        this.setOption(keys[i], options[keys[i]], ifNotSet);
    return this;
  };
  ReflectionObject.prototype.toString = function toString() {
    var className = this.constructor.className, fullName = this.fullName;
    if (fullName.length)
      return className + " " + fullName;
    return className;
  };
  ReflectionObject.prototype._editionToJSON = function _editionToJSON() {
    if (!this._edition || this._edition === "proto3") {
      return void 0;
    }
    return this._edition;
  };
  ReflectionObject._configure = function(Root_) {
    Root = Root_;
  };
  return object;
}
var _enum;
var hasRequired_enum;
function require_enum() {
  if (hasRequired_enum) return _enum;
  hasRequired_enum = 1;
  _enum = Enum;
  var ReflectionObject = requireObject();
  ((Enum.prototype = Object.create(ReflectionObject.prototype)).constructor = Enum).className = "Enum";
  var Namespace = requireNamespace(), util2 = requireUtil();
  function Enum(name, values, options, comment, comments, valuesOptions) {
    ReflectionObject.call(this, name, options);
    if (values && typeof values !== "object")
      throw TypeError("values must be an object");
    this.valuesById = {};
    this.values = Object.create(this.valuesById);
    this.comment = comment;
    this.comments = comments || {};
    this.valuesOptions = valuesOptions;
    this._valuesFeatures = {};
    this.reserved = void 0;
    if (values) {
      for (var keys = Object.keys(values), i = 0; i < keys.length; ++i)
        if (typeof values[keys[i]] === "number")
          this.valuesById[this.values[keys[i]] = values[keys[i]]] = keys[i];
    }
  }
  Enum.prototype._resolveFeatures = function _resolveFeatures(edition) {
    edition = this._edition || edition;
    ReflectionObject.prototype._resolveFeatures.call(this, edition);
    Object.keys(this.values).forEach((key) => {
      var parentFeaturesCopy = Object.assign({}, this._features);
      this._valuesFeatures[key] = Object.assign(parentFeaturesCopy, this.valuesOptions && this.valuesOptions[key] && this.valuesOptions[key].features);
    });
    return this;
  };
  Enum.fromJSON = function fromJSON(name, json) {
    var enm = new Enum(name, json.values, json.options, json.comment, json.comments);
    enm.reserved = json.reserved;
    if (json.edition)
      enm._edition = json.edition;
    enm._defaultEdition = "proto3";
    return enm;
  };
  Enum.prototype.toJSON = function toJSON(toJSONOptions) {
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util2.toObject([
      "edition",
      this._editionToJSON(),
      "options",
      this.options,
      "valuesOptions",
      this.valuesOptions,
      "values",
      this.values,
      "reserved",
      this.reserved && this.reserved.length ? this.reserved : void 0,
      "comment",
      keepComments ? this.comment : void 0,
      "comments",
      keepComments ? this.comments : void 0
    ]);
  };
  Enum.prototype.add = function add(name, id, comment, options) {
    if (!util2.isString(name))
      throw TypeError("name must be a string");
    if (!util2.isInteger(id))
      throw TypeError("id must be an integer");
    if (this.values[name] !== void 0)
      throw Error("duplicate name '" + name + "' in " + this);
    if (this.isReservedId(id))
      throw Error("id " + id + " is reserved in " + this);
    if (this.isReservedName(name))
      throw Error("name '" + name + "' is reserved in " + this);
    if (this.valuesById[id] !== void 0) {
      if (!(this.options && this.options.allow_alias))
        throw Error("duplicate id " + id + " in " + this);
      this.values[name] = id;
    } else
      this.valuesById[this.values[name] = id] = name;
    if (options) {
      if (this.valuesOptions === void 0)
        this.valuesOptions = {};
      this.valuesOptions[name] = options || null;
    }
    this.comments[name] = comment || null;
    return this;
  };
  Enum.prototype.remove = function remove(name) {
    if (!util2.isString(name))
      throw TypeError("name must be a string");
    var val = this.values[name];
    if (val == null)
      throw Error("name '" + name + "' does not exist in " + this);
    delete this.valuesById[val];
    delete this.values[name];
    delete this.comments[name];
    if (this.valuesOptions)
      delete this.valuesOptions[name];
    return this;
  };
  Enum.prototype.isReservedId = function isReservedId(id) {
    return Namespace.isReservedId(this.reserved, id);
  };
  Enum.prototype.isReservedName = function isReservedName(name) {
    return Namespace.isReservedName(this.reserved, name);
  };
  return _enum;
}
var encoder_1;
var hasRequiredEncoder;
function requireEncoder() {
  if (hasRequiredEncoder) return encoder_1;
  hasRequiredEncoder = 1;
  encoder_1 = encoder;
  var Enum = require_enum(), types2 = requireTypes(), util2 = requireUtil();
  function genTypePartial(gen, field2, fieldIndex, ref) {
    return field2.delimited ? gen("types[%i].encode(%s,w.uint32(%i)).uint32(%i)", fieldIndex, ref, (field2.id << 3 | 3) >>> 0, (field2.id << 3 | 4) >>> 0) : gen("types[%i].encode(%s,w.uint32(%i).fork()).ldelim()", fieldIndex, ref, (field2.id << 3 | 2) >>> 0);
  }
  function encoder(mtype) {
    var gen = util2.codegen(["m", "w"], mtype.name + "$encode")("if(!w)")("w=Writer.create()");
    var i, ref;
    var fields = (
      /* initializes */
      mtype.fieldsArray.slice().sort(util2.compareFieldsById)
    );
    for (var i = 0; i < fields.length; ++i) {
      var field2 = fields[i].resolve(), index = mtype._fieldsArray.indexOf(field2), type2 = field2.resolvedType instanceof Enum ? "int32" : field2.type, wireType = types2.basic[type2];
      ref = "m" + util2.safeProp(field2.name);
      if (field2.map) {
        gen("if(%s!=null&&Object.hasOwnProperty.call(m,%j)){", ref, field2.name)("for(var ks=Object.keys(%s),i=0;i<ks.length;++i){", ref)("w.uint32(%i).fork().uint32(%i).%s(ks[i])", (field2.id << 3 | 2) >>> 0, 8 | types2.mapKey[field2.keyType], field2.keyType);
        if (wireType === void 0) gen("types[%i].encode(%s[ks[i]],w.uint32(18).fork()).ldelim().ldelim()", index, ref);
        else gen(".uint32(%i).%s(%s[ks[i]]).ldelim()", 16 | wireType, type2, ref);
        gen("}")("}");
      } else if (field2.repeated) {
        gen("if(%s!=null&&%s.length){", ref, ref);
        if (field2.packed && types2.packed[type2] !== void 0) {
          gen("w.uint32(%i).fork()", (field2.id << 3 | 2) >>> 0)("for(var i=0;i<%s.length;++i)", ref)("w.%s(%s[i])", type2, ref)("w.ldelim()");
        } else {
          gen("for(var i=0;i<%s.length;++i)", ref);
          if (wireType === void 0)
            genTypePartial(gen, field2, index, ref + "[i]");
          else gen("w.uint32(%i).%s(%s[i])", (field2.id << 3 | wireType) >>> 0, type2, ref);
        }
        gen("}");
      } else {
        if (field2.optional) gen("if(%s!=null&&Object.hasOwnProperty.call(m,%j))", ref, field2.name);
        if (wireType === void 0)
          genTypePartial(gen, field2, index, ref);
        else gen("w.uint32(%i).%s(%s)", (field2.id << 3 | wireType) >>> 0, type2, ref);
      }
    }
    return gen("return w");
  }
  return encoder_1;
}
var hasRequiredIndexLight;
function requireIndexLight() {
  if (hasRequiredIndexLight) return indexLight.exports;
  hasRequiredIndexLight = 1;
  var protobuf = indexLight.exports = requireIndexMinimal();
  protobuf.build = "light";
  function load(filename, root2, callback) {
    if (typeof root2 === "function") {
      callback = root2;
      root2 = new protobuf.Root();
    } else if (!root2)
      root2 = new protobuf.Root();
    return root2.load(filename, callback);
  }
  protobuf.load = load;
  function loadSync(filename, root2) {
    if (!root2)
      root2 = new protobuf.Root();
    return root2.loadSync(filename);
  }
  protobuf.loadSync = loadSync;
  protobuf.encoder = requireEncoder();
  protobuf.decoder = requireDecoder();
  protobuf.verifier = requireVerifier();
  protobuf.converter = requireConverter();
  protobuf.ReflectionObject = requireObject();
  protobuf.Namespace = requireNamespace();
  protobuf.Root = requireRoot();
  protobuf.Enum = require_enum();
  protobuf.Type = requireType();
  protobuf.Field = requireField();
  protobuf.OneOf = requireOneof();
  protobuf.MapField = requireMapfield();
  protobuf.Service = requireService();
  protobuf.Method = requireMethod();
  protobuf.Message = requireMessage();
  protobuf.wrappers = requireWrappers();
  protobuf.types = requireTypes();
  protobuf.util = requireUtil();
  protobuf.ReflectionObject._configure(protobuf.Root);
  protobuf.Namespace._configure(protobuf.Type, protobuf.Service, protobuf.Enum);
  protobuf.Root._configure(protobuf.Type);
  protobuf.Field._configure(protobuf.Type);
  return indexLight.exports;
}
var tokenize_1;
var hasRequiredTokenize;
function requireTokenize() {
  if (hasRequiredTokenize) return tokenize_1;
  hasRequiredTokenize = 1;
  tokenize_1 = tokenize;
  var delimRe = /[\s{}=;:[\],'"()<>]/g, stringDoubleRe = /(?:"([^"\\]*(?:\\.[^"\\]*)*)")/g, stringSingleRe = /(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g;
  var setCommentRe = /^ *[*/]+ */, setCommentAltRe = /^\s*\*?\/*/, setCommentSplitRe = /\n/g, whitespaceRe = /\s/, unescapeRe = /\\(.?)/g;
  var unescapeMap = {
    "0": "\0",
    "r": "\r",
    "n": "\n",
    "t": "	"
  };
  function unescape(str) {
    return str.replace(unescapeRe, function($0, $1) {
      switch ($1) {
        case "\\":
        case "":
          return $1;
        default:
          return unescapeMap[$1] || "";
      }
    });
  }
  tokenize.unescape = unescape;
  function tokenize(source, alternateCommentMode) {
    source = source.toString();
    var offset = 0, length = source.length, line = 1, lastCommentLine = 0, comments = {};
    var stack = [];
    var stringDelim = null;
    function illegal(subject) {
      return Error("illegal " + subject + " (line " + line + ")");
    }
    function readString() {
      var re = stringDelim === "'" ? stringSingleRe : stringDoubleRe;
      re.lastIndex = offset - 1;
      var match = re.exec(source);
      if (!match)
        throw illegal("string");
      offset = re.lastIndex;
      push(stringDelim);
      stringDelim = null;
      return unescape(match[1]);
    }
    function charAt(pos) {
      return source.charAt(pos);
    }
    function setComment(start, end, isLeading) {
      var comment = {
        type: source.charAt(start++),
        lineEmpty: false,
        leading: isLeading
      };
      var lookback;
      if (alternateCommentMode) {
        lookback = 2;
      } else {
        lookback = 3;
      }
      var commentOffset = start - lookback, c;
      do {
        if (--commentOffset < 0 || (c = source.charAt(commentOffset)) === "\n") {
          comment.lineEmpty = true;
          break;
        }
      } while (c === " " || c === "	");
      var lines = source.substring(start, end).split(setCommentSplitRe);
      for (var i = 0; i < lines.length; ++i)
        lines[i] = lines[i].replace(alternateCommentMode ? setCommentAltRe : setCommentRe, "").trim();
      comment.text = lines.join("\n").trim();
      comments[line] = comment;
      lastCommentLine = line;
    }
    function isDoubleSlashCommentLine(startOffset) {
      var endOffset = findEndOfLine(startOffset);
      var lineText = source.substring(startOffset, endOffset);
      var isComment = /^\s*\/\//.test(lineText);
      return isComment;
    }
    function findEndOfLine(cursor) {
      var endOffset = cursor;
      while (endOffset < length && charAt(endOffset) !== "\n") {
        endOffset++;
      }
      return endOffset;
    }
    function next() {
      if (stack.length > 0)
        return stack.shift();
      if (stringDelim)
        return readString();
      var repeat, prev, curr, start, isDoc, isLeadingComment = offset === 0;
      do {
        if (offset === length)
          return null;
        repeat = false;
        while (whitespaceRe.test(curr = charAt(offset))) {
          if (curr === "\n") {
            isLeadingComment = true;
            ++line;
          }
          if (++offset === length)
            return null;
        }
        if (charAt(offset) === "/") {
          if (++offset === length) {
            throw illegal("comment");
          }
          if (charAt(offset) === "/") {
            if (!alternateCommentMode) {
              isDoc = charAt(start = offset + 1) === "/";
              while (charAt(++offset) !== "\n") {
                if (offset === length) {
                  return null;
                }
              }
              ++offset;
              if (isDoc) {
                setComment(start, offset - 1, isLeadingComment);
                isLeadingComment = true;
              }
              ++line;
              repeat = true;
            } else {
              start = offset;
              isDoc = false;
              if (isDoubleSlashCommentLine(offset - 1)) {
                isDoc = true;
                do {
                  offset = findEndOfLine(offset);
                  if (offset === length) {
                    break;
                  }
                  offset++;
                  if (!isLeadingComment) {
                    break;
                  }
                } while (isDoubleSlashCommentLine(offset));
              } else {
                offset = Math.min(length, findEndOfLine(offset) + 1);
              }
              if (isDoc) {
                setComment(start, offset, isLeadingComment);
                isLeadingComment = true;
              }
              line++;
              repeat = true;
            }
          } else if ((curr = charAt(offset)) === "*") {
            start = offset + 1;
            isDoc = alternateCommentMode || charAt(start) === "*";
            do {
              if (curr === "\n") {
                ++line;
              }
              if (++offset === length) {
                throw illegal("comment");
              }
              prev = curr;
              curr = charAt(offset);
            } while (prev !== "*" || curr !== "/");
            ++offset;
            if (isDoc) {
              setComment(start, offset - 2, isLeadingComment);
              isLeadingComment = true;
            }
            repeat = true;
          } else {
            return "/";
          }
        }
      } while (repeat);
      var end = offset;
      delimRe.lastIndex = 0;
      var delim = delimRe.test(charAt(end++));
      if (!delim)
        while (end < length && !delimRe.test(charAt(end)))
          ++end;
      var token = source.substring(offset, offset = end);
      if (token === '"' || token === "'")
        stringDelim = token;
      return token;
    }
    function push(token) {
      stack.push(token);
    }
    function peek() {
      if (!stack.length) {
        var token = next();
        if (token === null)
          return null;
        push(token);
      }
      return stack[0];
    }
    function skip(expected, optional) {
      var actual = peek(), equals = actual === expected;
      if (equals) {
        next();
        return true;
      }
      if (!optional)
        throw illegal("token '" + actual + "', '" + expected + "' expected");
      return false;
    }
    function cmnt(trailingLine) {
      var ret = null;
      var comment;
      if (trailingLine === void 0) {
        comment = comments[line - 1];
        delete comments[line - 1];
        if (comment && (alternateCommentMode || comment.type === "*" || comment.lineEmpty)) {
          ret = comment.leading ? comment.text : null;
        }
      } else {
        if (lastCommentLine < trailingLine) {
          peek();
        }
        comment = comments[trailingLine];
        delete comments[trailingLine];
        if (comment && !comment.lineEmpty && (alternateCommentMode || comment.type === "/")) {
          ret = comment.leading ? null : comment.text;
        }
      }
      return ret;
    }
    return Object.defineProperty({
      next,
      peek,
      push,
      skip,
      cmnt
    }, "line", {
      get: function() {
        return line;
      }
    });
  }
  return tokenize_1;
}
var parse_1;
var hasRequiredParse;
function requireParse() {
  if (hasRequiredParse) return parse_1;
  hasRequiredParse = 1;
  parse_1 = parse;
  parse.filename = null;
  parse.defaults = { keepCase: false };
  var tokenize = requireTokenize(), Root = requireRoot(), Type = requireType(), Field = requireField(), MapField = requireMapfield(), OneOf = requireOneof(), Enum = require_enum(), Service = requireService(), Method = requireMethod(), ReflectionObject = requireObject(), types2 = requireTypes(), util2 = requireUtil();
  var base10Re = /^[1-9][0-9]*$/, base10NegRe = /^-?[1-9][0-9]*$/, base16Re = /^0[x][0-9a-fA-F]+$/, base16NegRe = /^-?0[x][0-9a-fA-F]+$/, base8Re = /^0[0-7]+$/, base8NegRe = /^-?0[0-7]+$/, numberRe = /^(?![eE])[0-9]*(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?$/, nameRe = /^[a-zA-Z_][a-zA-Z_0-9]*$/, typeRefRe = /^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)(?:\.[a-zA-Z_][a-zA-Z_0-9]*)*$/;
  function parse(source, root2, options) {
    if (!(root2 instanceof Root)) {
      options = root2;
      root2 = new Root();
    }
    if (!options)
      options = parse.defaults;
    var preferTrailingComment = options.preferTrailingComment || false;
    var tn = tokenize(source, options.alternateCommentMode || false), next = tn.next, push = tn.push, peek = tn.peek, skip = tn.skip, cmnt = tn.cmnt;
    var head = true, pkg, imports, weakImports, edition = "proto2";
    var ptr = root2;
    var topLevelObjects = [];
    var topLevelOptions = {};
    var applyCase = options.keepCase ? function(name) {
      return name;
    } : util2.camelCase;
    function resolveFileFeatures() {
      topLevelObjects.forEach((obj) => {
        obj._edition = edition;
        Object.keys(topLevelOptions).forEach((opt) => {
          if (obj.getOption(opt) !== void 0) return;
          obj.setOption(opt, topLevelOptions[opt], true);
        });
      });
    }
    function illegal(token2, name, insideTryCatch) {
      var filename = parse.filename;
      if (!insideTryCatch)
        parse.filename = null;
      return Error("illegal " + (name || "token") + " '" + token2 + "' (" + (filename ? filename + ", " : "") + "line " + tn.line + ")");
    }
    function readString() {
      var values = [], token2;
      do {
        if ((token2 = next()) !== '"' && token2 !== "'")
          throw illegal(token2);
        values.push(next());
        skip(token2);
        token2 = peek();
      } while (token2 === '"' || token2 === "'");
      return values.join("");
    }
    function readValue(acceptTypeRef) {
      var token2 = next();
      switch (token2) {
        case "'":
        case '"':
          push(token2);
          return readString();
        case "true":
        case "TRUE":
          return true;
        case "false":
        case "FALSE":
          return false;
      }
      try {
        return parseNumber(
          token2,
          /* insideTryCatch */
          true
        );
      } catch (e) {
        if (typeRefRe.test(token2))
          return token2;
        throw illegal(token2, "value");
      }
    }
    function readRanges(target, acceptStrings) {
      var token2, start;
      do {
        if (acceptStrings && ((token2 = peek()) === '"' || token2 === "'")) {
          var str = readString();
          target.push(str);
          if (edition >= 2023) {
            throw illegal(str, "id");
          }
        } else {
          try {
            target.push([start = parseId(next()), skip("to", true) ? parseId(next()) : start]);
          } catch (err) {
            if (acceptStrings && typeRefRe.test(token2) && edition >= 2023) {
              target.push(token2);
            } else {
              throw err;
            }
          }
        }
      } while (skip(",", true));
      var dummy = { options: void 0 };
      dummy.setOption = function(name, value) {
        if (this.options === void 0) this.options = {};
        this.options[name] = value;
      };
      ifBlock(
        dummy,
        function parseRange_block(token3) {
          if (token3 === "option") {
            parseOption(dummy, token3);
            skip(";");
          } else
            throw illegal(token3);
        },
        function parseRange_line() {
          parseInlineOptions(dummy);
        }
      );
    }
    function parseNumber(token2, insideTryCatch) {
      var sign = 1;
      if (token2.charAt(0) === "-") {
        sign = -1;
        token2 = token2.substring(1);
      }
      switch (token2) {
        case "inf":
        case "INF":
        case "Inf":
          return sign * Infinity;
        case "nan":
        case "NAN":
        case "Nan":
        case "NaN":
          return NaN;
        case "0":
          return 0;
      }
      if (base10Re.test(token2))
        return sign * parseInt(token2, 10);
      if (base16Re.test(token2))
        return sign * parseInt(token2, 16);
      if (base8Re.test(token2))
        return sign * parseInt(token2, 8);
      if (numberRe.test(token2))
        return sign * parseFloat(token2);
      throw illegal(token2, "number", insideTryCatch);
    }
    function parseId(token2, acceptNegative) {
      switch (token2) {
        case "max":
        case "MAX":
        case "Max":
          return 536870911;
        case "0":
          return 0;
      }
      if (!acceptNegative && token2.charAt(0) === "-")
        throw illegal(token2, "id");
      if (base10NegRe.test(token2))
        return parseInt(token2, 10);
      if (base16NegRe.test(token2))
        return parseInt(token2, 16);
      if (base8NegRe.test(token2))
        return parseInt(token2, 8);
      throw illegal(token2, "id");
    }
    function parsePackage() {
      if (pkg !== void 0)
        throw illegal("package");
      pkg = next();
      if (!typeRefRe.test(pkg))
        throw illegal(pkg, "name");
      ptr = ptr.define(pkg);
      skip(";");
    }
    function parseImport() {
      var token2 = peek();
      var whichImports;
      switch (token2) {
        case "weak":
          whichImports = weakImports || (weakImports = []);
          next();
          break;
        case "public":
          next();
        // eslint-disable-next-line no-fallthrough
        default:
          whichImports = imports || (imports = []);
          break;
      }
      token2 = readString();
      skip(";");
      whichImports.push(token2);
    }
    function parseSyntax() {
      skip("=");
      edition = readString();
      if (edition < 2023)
        throw illegal(edition, "syntax");
      skip(";");
    }
    function parseEdition() {
      skip("=");
      edition = readString();
      const supportedEditions = ["2023"];
      if (!supportedEditions.includes(edition))
        throw illegal(edition, "edition");
      skip(";");
    }
    function parseCommon(parent, token2) {
      switch (token2) {
        case "option":
          parseOption(parent, token2);
          skip(";");
          return true;
        case "message":
          parseType(parent, token2);
          return true;
        case "enum":
          parseEnum(parent, token2);
          return true;
        case "service":
          parseService(parent, token2);
          return true;
        case "extend":
          parseExtension(parent, token2);
          return true;
      }
      return false;
    }
    function ifBlock(obj, fnIf, fnElse) {
      var trailingLine = tn.line;
      if (obj) {
        if (typeof obj.comment !== "string") {
          obj.comment = cmnt();
        }
        obj.filename = parse.filename;
      }
      if (skip("{", true)) {
        var token2;
        while ((token2 = next()) !== "}")
          fnIf(token2);
        skip(";", true);
      } else {
        if (fnElse)
          fnElse();
        skip(";");
        if (obj && (typeof obj.comment !== "string" || preferTrailingComment))
          obj.comment = cmnt(trailingLine) || obj.comment;
      }
    }
    function parseType(parent, token2) {
      if (!nameRe.test(token2 = next()))
        throw illegal(token2, "type name");
      var type2 = new Type(token2);
      ifBlock(type2, function parseType_block(token3) {
        if (parseCommon(type2, token3))
          return;
        switch (token3) {
          case "map":
            parseMapField(type2);
            break;
          case "required":
            if (edition !== "proto2")
              throw illegal(token3);
          /* eslint-disable no-fallthrough */
          case "repeated":
            parseField(type2, token3);
            break;
          case "optional":
            if (edition === "proto3") {
              parseField(type2, "proto3_optional");
            } else if (edition !== "proto2") {
              throw illegal(token3);
            } else {
              parseField(type2, "optional");
            }
            break;
          case "oneof":
            parseOneOf(type2, token3);
            break;
          case "extensions":
            readRanges(type2.extensions || (type2.extensions = []));
            break;
          case "reserved":
            readRanges(type2.reserved || (type2.reserved = []), true);
            break;
          default:
            if (edition === "proto2" || !typeRefRe.test(token3)) {
              throw illegal(token3);
            }
            push(token3);
            parseField(type2, "optional");
            break;
        }
      });
      parent.add(type2);
      if (parent === ptr) {
        topLevelObjects.push(type2);
      }
    }
    function parseField(parent, rule, extend) {
      var type2 = next();
      if (type2 === "group") {
        parseGroup(parent, rule);
        return;
      }
      while (type2.endsWith(".") || peek().startsWith(".")) {
        type2 += next();
      }
      if (!typeRefRe.test(type2))
        throw illegal(type2, "type");
      var name = next();
      if (!nameRe.test(name))
        throw illegal(name, "name");
      name = applyCase(name);
      skip("=");
      var field2 = new Field(name, parseId(next()), type2, rule, extend);
      ifBlock(field2, function parseField_block(token2) {
        if (token2 === "option") {
          parseOption(field2, token2);
          skip(";");
        } else
          throw illegal(token2);
      }, function parseField_line() {
        parseInlineOptions(field2);
      });
      if (rule === "proto3_optional") {
        var oneof2 = new OneOf("_" + name);
        field2.setOption("proto3_optional", true);
        oneof2.add(field2);
        parent.add(oneof2);
      } else {
        parent.add(field2);
      }
      if (parent === ptr) {
        topLevelObjects.push(field2);
      }
    }
    function parseGroup(parent, rule) {
      if (edition >= 2023) {
        throw illegal("group");
      }
      var name = next();
      if (!nameRe.test(name))
        throw illegal(name, "name");
      var fieldName = util2.lcFirst(name);
      if (name === fieldName)
        name = util2.ucFirst(name);
      skip("=");
      var id = parseId(next());
      var type2 = new Type(name);
      type2.group = true;
      var field2 = new Field(fieldName, id, name, rule);
      field2.filename = parse.filename;
      ifBlock(type2, function parseGroup_block(token2) {
        switch (token2) {
          case "option":
            parseOption(type2, token2);
            skip(";");
            break;
          case "required":
          case "repeated":
            parseField(type2, token2);
            break;
          case "optional":
            if (edition === "proto3") {
              parseField(type2, "proto3_optional");
            } else {
              parseField(type2, "optional");
            }
            break;
          case "message":
            parseType(type2, token2);
            break;
          case "enum":
            parseEnum(type2, token2);
            break;
          case "reserved":
            readRanges(type2.reserved || (type2.reserved = []), true);
            break;
          /* istanbul ignore next */
          default:
            throw illegal(token2);
        }
      });
      parent.add(type2).add(field2);
    }
    function parseMapField(parent) {
      skip("<");
      var keyType = next();
      if (types2.mapKey[keyType] === void 0)
        throw illegal(keyType, "type");
      skip(",");
      var valueType = next();
      if (!typeRefRe.test(valueType))
        throw illegal(valueType, "type");
      skip(">");
      var name = next();
      if (!nameRe.test(name))
        throw illegal(name, "name");
      skip("=");
      var field2 = new MapField(applyCase(name), parseId(next()), keyType, valueType);
      ifBlock(field2, function parseMapField_block(token2) {
        if (token2 === "option") {
          parseOption(field2, token2);
          skip(";");
        } else
          throw illegal(token2);
      }, function parseMapField_line() {
        parseInlineOptions(field2);
      });
      parent.add(field2);
    }
    function parseOneOf(parent, token2) {
      if (!nameRe.test(token2 = next()))
        throw illegal(token2, "name");
      var oneof2 = new OneOf(applyCase(token2));
      ifBlock(oneof2, function parseOneOf_block(token3) {
        if (token3 === "option") {
          parseOption(oneof2, token3);
          skip(";");
        } else {
          push(token3);
          parseField(oneof2, "optional");
        }
      });
      parent.add(oneof2);
    }
    function parseEnum(parent, token2) {
      if (!nameRe.test(token2 = next()))
        throw illegal(token2, "name");
      var enm = new Enum(token2);
      ifBlock(enm, function parseEnum_block(token3) {
        switch (token3) {
          case "option":
            parseOption(enm, token3);
            skip(";");
            break;
          case "reserved":
            readRanges(enm.reserved || (enm.reserved = []), true);
            if (enm.reserved === void 0) enm.reserved = [];
            break;
          default:
            parseEnumValue(enm, token3);
        }
      });
      parent.add(enm);
      if (parent === ptr) {
        topLevelObjects.push(enm);
      }
    }
    function parseEnumValue(parent, token2) {
      if (!nameRe.test(token2))
        throw illegal(token2, "name");
      skip("=");
      var value = parseId(next(), true), dummy = {
        options: void 0
      };
      dummy.getOption = function(name) {
        return this.options[name];
      };
      dummy.setOption = function(name, value2) {
        ReflectionObject.prototype.setOption.call(dummy, name, value2);
      };
      dummy.setParsedOption = function() {
        return void 0;
      };
      ifBlock(dummy, function parseEnumValue_block(token3) {
        if (token3 === "option") {
          parseOption(dummy, token3);
          skip(";");
        } else
          throw illegal(token3);
      }, function parseEnumValue_line() {
        parseInlineOptions(dummy);
      });
      parent.add(token2, value, dummy.comment, dummy.parsedOptions || dummy.options);
    }
    function parseOption(parent, token2) {
      var option;
      var propName;
      var isOption = true;
      if (token2 === "option") {
        token2 = next();
      }
      while (token2 !== "=") {
        if (token2 === "(") {
          var parensValue = next();
          skip(")");
          token2 = "(" + parensValue + ")";
        }
        if (isOption) {
          isOption = false;
          if (token2.includes(".") && !token2.includes("(")) {
            var tokens = token2.split(".");
            option = tokens[0] + ".";
            token2 = tokens[1];
            continue;
          }
          option = token2;
        } else {
          propName = propName ? propName += token2 : token2;
        }
        token2 = next();
      }
      var name = propName ? option.concat(propName) : option;
      var optionValue = parseOptionValue(parent, name);
      propName = propName && propName[0] === "." ? propName.slice(1) : propName;
      option = option && option[option.length - 1] === "." ? option.slice(0, -1) : option;
      setParsedOption(parent, option, optionValue, propName);
    }
    function parseOptionValue(parent, name) {
      if (skip("{", true)) {
        var objectResult = {};
        while (!skip("}", true)) {
          if (!nameRe.test(token = next())) {
            throw illegal(token, "name");
          }
          if (token === null) {
            throw illegal(token, "end of input");
          }
          var value;
          var propName = token;
          skip(":", true);
          if (peek() === "{") {
            value = parseOptionValue(parent, name + "." + token);
          } else if (peek() === "[") {
            value = [];
            var lastValue;
            if (skip("[", true)) {
              do {
                lastValue = readValue();
                value.push(lastValue);
              } while (skip(",", true));
              skip("]");
              if (typeof lastValue !== "undefined") {
                setOption(parent, name + "." + token, lastValue);
              }
            }
          } else {
            value = readValue();
            setOption(parent, name + "." + token, value);
          }
          var prevValue = objectResult[propName];
          if (prevValue)
            value = [].concat(prevValue).concat(value);
          objectResult[propName] = value;
          skip(",", true);
          skip(";", true);
        }
        return objectResult;
      }
      var simpleValue = readValue();
      setOption(parent, name, simpleValue);
      return simpleValue;
    }
    function setOption(parent, name, value) {
      if (ptr === parent && /^features\./.test(name)) {
        topLevelOptions[name] = value;
        return;
      }
      if (parent.setOption)
        parent.setOption(name, value);
    }
    function setParsedOption(parent, name, value, propName) {
      if (parent.setParsedOption)
        parent.setParsedOption(name, value, propName);
    }
    function parseInlineOptions(parent) {
      if (skip("[", true)) {
        do {
          parseOption(parent, "option");
        } while (skip(",", true));
        skip("]");
      }
      return parent;
    }
    function parseService(parent, token2) {
      if (!nameRe.test(token2 = next()))
        throw illegal(token2, "service name");
      var service2 = new Service(token2);
      ifBlock(service2, function parseService_block(token3) {
        if (parseCommon(service2, token3)) {
          return;
        }
        if (token3 === "rpc")
          parseMethod(service2, token3);
        else
          throw illegal(token3);
      });
      parent.add(service2);
      if (parent === ptr) {
        topLevelObjects.push(service2);
      }
    }
    function parseMethod(parent, token2) {
      var commentText = cmnt();
      var type2 = token2;
      if (!nameRe.test(token2 = next()))
        throw illegal(token2, "name");
      var name = token2, requestType, requestStream, responseType, responseStream;
      skip("(");
      if (skip("stream", true))
        requestStream = true;
      if (!typeRefRe.test(token2 = next()))
        throw illegal(token2);
      requestType = token2;
      skip(")");
      skip("returns");
      skip("(");
      if (skip("stream", true))
        responseStream = true;
      if (!typeRefRe.test(token2 = next()))
        throw illegal(token2);
      responseType = token2;
      skip(")");
      var method2 = new Method(name, type2, requestType, responseType, requestStream, responseStream);
      method2.comment = commentText;
      ifBlock(method2, function parseMethod_block(token3) {
        if (token3 === "option") {
          parseOption(method2, token3);
          skip(";");
        } else
          throw illegal(token3);
      });
      parent.add(method2);
    }
    function parseExtension(parent, token2) {
      if (!typeRefRe.test(token2 = next()))
        throw illegal(token2, "reference");
      var reference = token2;
      ifBlock(null, function parseExtension_block(token3) {
        switch (token3) {
          case "required":
          case "repeated":
            parseField(parent, token3, reference);
            break;
          case "optional":
            if (edition === "proto3") {
              parseField(parent, "proto3_optional", reference);
            } else {
              parseField(parent, "optional", reference);
            }
            break;
          default:
            if (edition === "proto2" || !typeRefRe.test(token3))
              throw illegal(token3);
            push(token3);
            parseField(parent, "optional", reference);
            break;
        }
      });
    }
    var token;
    while ((token = next()) !== null) {
      switch (token) {
        case "package":
          if (!head)
            throw illegal(token);
          parsePackage();
          break;
        case "import":
          if (!head)
            throw illegal(token);
          parseImport();
          break;
        case "syntax":
          if (!head)
            throw illegal(token);
          parseSyntax();
          break;
        case "edition":
          if (!head)
            throw illegal(token);
          parseEdition();
          break;
        case "option":
          parseOption(ptr, token);
          skip(";", true);
          break;
        default:
          if (parseCommon(ptr, token)) {
            head = false;
            continue;
          }
          throw illegal(token);
      }
    }
    resolveFileFeatures();
    parse.filename = null;
    return {
      "package": pkg,
      "imports": imports,
      weakImports,
      root: root2
    };
  }
  return parse_1;
}
var common_1;
var hasRequiredCommon;
function requireCommon() {
  if (hasRequiredCommon) return common_1;
  hasRequiredCommon = 1;
  common_1 = common;
  var commonRe = /\/|\./;
  function common(name, json) {
    if (!commonRe.test(name)) {
      name = "google/protobuf/" + name + ".proto";
      json = { nested: { google: { nested: { protobuf: { nested: json } } } } };
    }
    common[name] = json;
  }
  common("any", {
    /**
     * Properties of a google.protobuf.Any message.
     * @interface IAny
     * @type {Object}
     * @property {string} [typeUrl]
     * @property {Uint8Array} [bytes]
     * @memberof common
     */
    Any: {
      fields: {
        type_url: {
          type: "string",
          id: 1
        },
        value: {
          type: "bytes",
          id: 2
        }
      }
    }
  });
  var timeType;
  common("duration", {
    /**
     * Properties of a google.protobuf.Duration message.
     * @interface IDuration
     * @type {Object}
     * @property {number|Long} [seconds]
     * @property {number} [nanos]
     * @memberof common
     */
    Duration: timeType = {
      fields: {
        seconds: {
          type: "int64",
          id: 1
        },
        nanos: {
          type: "int32",
          id: 2
        }
      }
    }
  });
  common("timestamp", {
    /**
     * Properties of a google.protobuf.Timestamp message.
     * @interface ITimestamp
     * @type {Object}
     * @property {number|Long} [seconds]
     * @property {number} [nanos]
     * @memberof common
     */
    Timestamp: timeType
  });
  common("empty", {
    /**
     * Properties of a google.protobuf.Empty message.
     * @interface IEmpty
     * @memberof common
     */
    Empty: {
      fields: {}
    }
  });
  common("struct", {
    /**
     * Properties of a google.protobuf.Struct message.
     * @interface IStruct
     * @type {Object}
     * @property {Object.<string,IValue>} [fields]
     * @memberof common
     */
    Struct: {
      fields: {
        fields: {
          keyType: "string",
          type: "Value",
          id: 1
        }
      }
    },
    /**
     * Properties of a google.protobuf.Value message.
     * @interface IValue
     * @type {Object}
     * @property {string} [kind]
     * @property {0} [nullValue]
     * @property {number} [numberValue]
     * @property {string} [stringValue]
     * @property {boolean} [boolValue]
     * @property {IStruct} [structValue]
     * @property {IListValue} [listValue]
     * @memberof common
     */
    Value: {
      oneofs: {
        kind: {
          oneof: [
            "nullValue",
            "numberValue",
            "stringValue",
            "boolValue",
            "structValue",
            "listValue"
          ]
        }
      },
      fields: {
        nullValue: {
          type: "NullValue",
          id: 1
        },
        numberValue: {
          type: "double",
          id: 2
        },
        stringValue: {
          type: "string",
          id: 3
        },
        boolValue: {
          type: "bool",
          id: 4
        },
        structValue: {
          type: "Struct",
          id: 5
        },
        listValue: {
          type: "ListValue",
          id: 6
        }
      }
    },
    NullValue: {
      values: {
        NULL_VALUE: 0
      }
    },
    /**
     * Properties of a google.protobuf.ListValue message.
     * @interface IListValue
     * @type {Object}
     * @property {Array.<IValue>} [values]
     * @memberof common
     */
    ListValue: {
      fields: {
        values: {
          rule: "repeated",
          type: "Value",
          id: 1
        }
      }
    }
  });
  common("wrappers", {
    /**
     * Properties of a google.protobuf.DoubleValue message.
     * @interface IDoubleValue
     * @type {Object}
     * @property {number} [value]
     * @memberof common
     */
    DoubleValue: {
      fields: {
        value: {
          type: "double",
          id: 1
        }
      }
    },
    /**
     * Properties of a google.protobuf.FloatValue message.
     * @interface IFloatValue
     * @type {Object}
     * @property {number} [value]
     * @memberof common
     */
    FloatValue: {
      fields: {
        value: {
          type: "float",
          id: 1
        }
      }
    },
    /**
     * Properties of a google.protobuf.Int64Value message.
     * @interface IInt64Value
     * @type {Object}
     * @property {number|Long} [value]
     * @memberof common
     */
    Int64Value: {
      fields: {
        value: {
          type: "int64",
          id: 1
        }
      }
    },
    /**
     * Properties of a google.protobuf.UInt64Value message.
     * @interface IUInt64Value
     * @type {Object}
     * @property {number|Long} [value]
     * @memberof common
     */
    UInt64Value: {
      fields: {
        value: {
          type: "uint64",
          id: 1
        }
      }
    },
    /**
     * Properties of a google.protobuf.Int32Value message.
     * @interface IInt32Value
     * @type {Object}
     * @property {number} [value]
     * @memberof common
     */
    Int32Value: {
      fields: {
        value: {
          type: "int32",
          id: 1
        }
      }
    },
    /**
     * Properties of a google.protobuf.UInt32Value message.
     * @interface IUInt32Value
     * @type {Object}
     * @property {number} [value]
     * @memberof common
     */
    UInt32Value: {
      fields: {
        value: {
          type: "uint32",
          id: 1
        }
      }
    },
    /**
     * Properties of a google.protobuf.BoolValue message.
     * @interface IBoolValue
     * @type {Object}
     * @property {boolean} [value]
     * @memberof common
     */
    BoolValue: {
      fields: {
        value: {
          type: "bool",
          id: 1
        }
      }
    },
    /**
     * Properties of a google.protobuf.StringValue message.
     * @interface IStringValue
     * @type {Object}
     * @property {string} [value]
     * @memberof common
     */
    StringValue: {
      fields: {
        value: {
          type: "string",
          id: 1
        }
      }
    },
    /**
     * Properties of a google.protobuf.BytesValue message.
     * @interface IBytesValue
     * @type {Object}
     * @property {Uint8Array} [value]
     * @memberof common
     */
    BytesValue: {
      fields: {
        value: {
          type: "bytes",
          id: 1
        }
      }
    }
  });
  common("field_mask", {
    /**
     * Properties of a google.protobuf.FieldMask message.
     * @interface IDoubleValue
     * @type {Object}
     * @property {number} [value]
     * @memberof common
     */
    FieldMask: {
      fields: {
        paths: {
          rule: "repeated",
          type: "string",
          id: 1
        }
      }
    }
  });
  common.get = function get(file) {
    return common[file] || null;
  };
  return common_1;
}
var hasRequiredSrc;
function requireSrc() {
  if (hasRequiredSrc) return src.exports;
  hasRequiredSrc = 1;
  var protobuf = src.exports = requireIndexLight();
  protobuf.build = "full";
  protobuf.tokenize = requireTokenize();
  protobuf.parse = requireParse();
  protobuf.common = requireCommon();
  protobuf.Root._configure(protobuf.Type, protobuf.parse, protobuf.common);
  return src.exports;
}
var protobufjs;
var hasRequiredProtobufjs;
function requireProtobufjs() {
  if (hasRequiredProtobufjs) return protobufjs;
  hasRequiredProtobufjs = 1;
  protobufjs = requireSrc();
  return protobufjs;
}
var descriptor = { exports: {} };
const nested$3 = /* @__PURE__ */ JSON.parse('{"google":{"nested":{"protobuf":{"options":{"go_package":"google.golang.org/protobuf/types/descriptorpb","java_package":"com.google.protobuf","java_outer_classname":"DescriptorProtos","csharp_namespace":"Google.Protobuf.Reflection","objc_class_prefix":"GPB","cc_enable_arenas":true,"optimize_for":"SPEED"},"nested":{"FileDescriptorSet":{"edition":"proto2","fields":{"file":{"rule":"repeated","type":"FileDescriptorProto","id":1}},"extensions":[[536000000,536000000]]},"Edition":{"edition":"proto2","values":{"EDITION_UNKNOWN":0,"EDITION_LEGACY":900,"EDITION_PROTO2":998,"EDITION_PROTO3":999,"EDITION_2023":1000,"EDITION_2024":1001,"EDITION_1_TEST_ONLY":1,"EDITION_2_TEST_ONLY":2,"EDITION_99997_TEST_ONLY":99997,"EDITION_99998_TEST_ONLY":99998,"EDITION_99999_TEST_ONLY":99999,"EDITION_MAX":2147483647}},"FileDescriptorProto":{"edition":"proto2","fields":{"name":{"type":"string","id":1},"package":{"type":"string","id":2},"dependency":{"rule":"repeated","type":"string","id":3},"publicDependency":{"rule":"repeated","type":"int32","id":10},"weakDependency":{"rule":"repeated","type":"int32","id":11},"optionDependency":{"rule":"repeated","type":"string","id":15},"messageType":{"rule":"repeated","type":"DescriptorProto","id":4},"enumType":{"rule":"repeated","type":"EnumDescriptorProto","id":5},"service":{"rule":"repeated","type":"ServiceDescriptorProto","id":6},"extension":{"rule":"repeated","type":"FieldDescriptorProto","id":7},"options":{"type":"FileOptions","id":8},"sourceCodeInfo":{"type":"SourceCodeInfo","id":9},"syntax":{"type":"string","id":12},"edition":{"type":"Edition","id":14}}},"DescriptorProto":{"edition":"proto2","fields":{"name":{"type":"string","id":1},"field":{"rule":"repeated","type":"FieldDescriptorProto","id":2},"extension":{"rule":"repeated","type":"FieldDescriptorProto","id":6},"nestedType":{"rule":"repeated","type":"DescriptorProto","id":3},"enumType":{"rule":"repeated","type":"EnumDescriptorProto","id":4},"extensionRange":{"rule":"repeated","type":"ExtensionRange","id":5},"oneofDecl":{"rule":"repeated","type":"OneofDescriptorProto","id":8},"options":{"type":"MessageOptions","id":7},"reservedRange":{"rule":"repeated","type":"ReservedRange","id":9},"reservedName":{"rule":"repeated","type":"string","id":10},"visibility":{"type":"SymbolVisibility","id":11}},"nested":{"ExtensionRange":{"fields":{"start":{"type":"int32","id":1},"end":{"type":"int32","id":2},"options":{"type":"ExtensionRangeOptions","id":3}}},"ReservedRange":{"fields":{"start":{"type":"int32","id":1},"end":{"type":"int32","id":2}}}}},"ExtensionRangeOptions":{"edition":"proto2","fields":{"uninterpretedOption":{"rule":"repeated","type":"UninterpretedOption","id":999},"declaration":{"rule":"repeated","type":"Declaration","id":2,"options":{"retention":"RETENTION_SOURCE"}},"features":{"type":"FeatureSet","id":50},"verification":{"type":"VerificationState","id":3,"options":{"default":"UNVERIFIED","retention":"RETENTION_SOURCE"}}},"extensions":[[1000,536870911]],"nested":{"Declaration":{"fields":{"number":{"type":"int32","id":1},"fullName":{"type":"string","id":2},"type":{"type":"string","id":3},"reserved":{"type":"bool","id":5},"repeated":{"type":"bool","id":6}},"reserved":[[4,4]]},"VerificationState":{"values":{"DECLARATION":0,"UNVERIFIED":1}}}},"FieldDescriptorProto":{"edition":"proto2","fields":{"name":{"type":"string","id":1},"number":{"type":"int32","id":3},"label":{"type":"Label","id":4},"type":{"type":"Type","id":5},"typeName":{"type":"string","id":6},"extendee":{"type":"string","id":2},"defaultValue":{"type":"string","id":7},"oneofIndex":{"type":"int32","id":9},"jsonName":{"type":"string","id":10},"options":{"type":"FieldOptions","id":8},"proto3Optional":{"type":"bool","id":17}},"nested":{"Type":{"values":{"TYPE_DOUBLE":1,"TYPE_FLOAT":2,"TYPE_INT64":3,"TYPE_UINT64":4,"TYPE_INT32":5,"TYPE_FIXED64":6,"TYPE_FIXED32":7,"TYPE_BOOL":8,"TYPE_STRING":9,"TYPE_GROUP":10,"TYPE_MESSAGE":11,"TYPE_BYTES":12,"TYPE_UINT32":13,"TYPE_ENUM":14,"TYPE_SFIXED32":15,"TYPE_SFIXED64":16,"TYPE_SINT32":17,"TYPE_SINT64":18}},"Label":{"values":{"LABEL_OPTIONAL":1,"LABEL_REPEATED":3,"LABEL_REQUIRED":2}}}},"OneofDescriptorProto":{"edition":"proto2","fields":{"name":{"type":"string","id":1},"options":{"type":"OneofOptions","id":2}}},"EnumDescriptorProto":{"edition":"proto2","fields":{"name":{"type":"string","id":1},"value":{"rule":"repeated","type":"EnumValueDescriptorProto","id":2},"options":{"type":"EnumOptions","id":3},"reservedRange":{"rule":"repeated","type":"EnumReservedRange","id":4},"reservedName":{"rule":"repeated","type":"string","id":5},"visibility":{"type":"SymbolVisibility","id":6}},"nested":{"EnumReservedRange":{"fields":{"start":{"type":"int32","id":1},"end":{"type":"int32","id":2}}}}},"EnumValueDescriptorProto":{"edition":"proto2","fields":{"name":{"type":"string","id":1},"number":{"type":"int32","id":2},"options":{"type":"EnumValueOptions","id":3}}},"ServiceDescriptorProto":{"edition":"proto2","fields":{"name":{"type":"string","id":1},"method":{"rule":"repeated","type":"MethodDescriptorProto","id":2},"options":{"type":"ServiceOptions","id":3}}},"MethodDescriptorProto":{"edition":"proto2","fields":{"name":{"type":"string","id":1},"inputType":{"type":"string","id":2},"outputType":{"type":"string","id":3},"options":{"type":"MethodOptions","id":4},"clientStreaming":{"type":"bool","id":5},"serverStreaming":{"type":"bool","id":6}}},"FileOptions":{"edition":"proto2","fields":{"javaPackage":{"type":"string","id":1},"javaOuterClassname":{"type":"string","id":8},"javaMultipleFiles":{"type":"bool","id":10},"javaGenerateEqualsAndHash":{"type":"bool","id":20,"options":{"deprecated":true}},"javaStringCheckUtf8":{"type":"bool","id":27},"optimizeFor":{"type":"OptimizeMode","id":9,"options":{"default":"SPEED"}},"goPackage":{"type":"string","id":11},"ccGenericServices":{"type":"bool","id":16},"javaGenericServices":{"type":"bool","id":17},"pyGenericServices":{"type":"bool","id":18},"deprecated":{"type":"bool","id":23},"ccEnableArenas":{"type":"bool","id":31,"options":{"default":true}},"objcClassPrefix":{"type":"string","id":36},"csharpNamespace":{"type":"string","id":37},"swiftPrefix":{"type":"string","id":39},"phpClassPrefix":{"type":"string","id":40},"phpNamespace":{"type":"string","id":41},"phpMetadataNamespace":{"type":"string","id":44},"rubyPackage":{"type":"string","id":45},"features":{"type":"FeatureSet","id":50},"uninterpretedOption":{"rule":"repeated","type":"UninterpretedOption","id":999}},"extensions":[[1000,536870911]],"reserved":[[42,42],[38,38],"php_generic_services"],"nested":{"OptimizeMode":{"values":{"SPEED":1,"CODE_SIZE":2,"LITE_RUNTIME":3}}}},"MessageOptions":{"edition":"proto2","fields":{"messageSetWireFormat":{"type":"bool","id":1},"noStandardDescriptorAccessor":{"type":"bool","id":2},"deprecated":{"type":"bool","id":3},"mapEntry":{"type":"bool","id":7},"deprecatedLegacyJsonFieldConflicts":{"type":"bool","id":11,"options":{"deprecated":true}},"features":{"type":"FeatureSet","id":12},"uninterpretedOption":{"rule":"repeated","type":"UninterpretedOption","id":999}},"extensions":[[1000,536870911]],"reserved":[[4,4],[5,5],[6,6],[8,8],[9,9]]},"FieldOptions":{"edition":"proto2","fields":{"ctype":{"type":"CType","id":1,"options":{"default":"STRING"}},"packed":{"type":"bool","id":2},"jstype":{"type":"JSType","id":6,"options":{"default":"JS_NORMAL"}},"lazy":{"type":"bool","id":5},"unverifiedLazy":{"type":"bool","id":15},"deprecated":{"type":"bool","id":3},"weak":{"type":"bool","id":10,"options":{"deprecated":true}},"debugRedact":{"type":"bool","id":16},"retention":{"type":"OptionRetention","id":17},"targets":{"rule":"repeated","type":"OptionTargetType","id":19},"editionDefaults":{"rule":"repeated","type":"EditionDefault","id":20},"features":{"type":"FeatureSet","id":21},"featureSupport":{"type":"FeatureSupport","id":22},"uninterpretedOption":{"rule":"repeated","type":"UninterpretedOption","id":999}},"extensions":[[1000,536870911]],"reserved":[[4,4],[18,18]],"nested":{"CType":{"values":{"STRING":0,"CORD":1,"STRING_PIECE":2}},"JSType":{"values":{"JS_NORMAL":0,"JS_STRING":1,"JS_NUMBER":2}},"OptionRetention":{"values":{"RETENTION_UNKNOWN":0,"RETENTION_RUNTIME":1,"RETENTION_SOURCE":2}},"OptionTargetType":{"values":{"TARGET_TYPE_UNKNOWN":0,"TARGET_TYPE_FILE":1,"TARGET_TYPE_EXTENSION_RANGE":2,"TARGET_TYPE_MESSAGE":3,"TARGET_TYPE_FIELD":4,"TARGET_TYPE_ONEOF":5,"TARGET_TYPE_ENUM":6,"TARGET_TYPE_ENUM_ENTRY":7,"TARGET_TYPE_SERVICE":8,"TARGET_TYPE_METHOD":9}},"EditionDefault":{"fields":{"edition":{"type":"Edition","id":3},"value":{"type":"string","id":2}}},"FeatureSupport":{"fields":{"editionIntroduced":{"type":"Edition","id":1},"editionDeprecated":{"type":"Edition","id":2},"deprecationWarning":{"type":"string","id":3},"editionRemoved":{"type":"Edition","id":4}}}}},"OneofOptions":{"edition":"proto2","fields":{"features":{"type":"FeatureSet","id":1},"uninterpretedOption":{"rule":"repeated","type":"UninterpretedOption","id":999}},"extensions":[[1000,536870911]]},"EnumOptions":{"edition":"proto2","fields":{"allowAlias":{"type":"bool","id":2},"deprecated":{"type":"bool","id":3},"deprecatedLegacyJsonFieldConflicts":{"type":"bool","id":6,"options":{"deprecated":true}},"features":{"type":"FeatureSet","id":7},"uninterpretedOption":{"rule":"repeated","type":"UninterpretedOption","id":999}},"extensions":[[1000,536870911]],"reserved":[[5,5]]},"EnumValueOptions":{"edition":"proto2","fields":{"deprecated":{"type":"bool","id":1},"features":{"type":"FeatureSet","id":2},"debugRedact":{"type":"bool","id":3},"featureSupport":{"type":"FieldOptions.FeatureSupport","id":4},"uninterpretedOption":{"rule":"repeated","type":"UninterpretedOption","id":999}},"extensions":[[1000,536870911]]},"ServiceOptions":{"edition":"proto2","fields":{"features":{"type":"FeatureSet","id":34},"deprecated":{"type":"bool","id":33},"uninterpretedOption":{"rule":"repeated","type":"UninterpretedOption","id":999}},"extensions":[[1000,536870911]]},"MethodOptions":{"edition":"proto2","fields":{"deprecated":{"type":"bool","id":33},"idempotencyLevel":{"type":"IdempotencyLevel","id":34,"options":{"default":"IDEMPOTENCY_UNKNOWN"}},"features":{"type":"FeatureSet","id":35},"uninterpretedOption":{"rule":"repeated","type":"UninterpretedOption","id":999}},"extensions":[[1000,536870911]],"nested":{"IdempotencyLevel":{"values":{"IDEMPOTENCY_UNKNOWN":0,"NO_SIDE_EFFECTS":1,"IDEMPOTENT":2}}}},"UninterpretedOption":{"edition":"proto2","fields":{"name":{"rule":"repeated","type":"NamePart","id":2},"identifierValue":{"type":"string","id":3},"positiveIntValue":{"type":"uint64","id":4},"negativeIntValue":{"type":"int64","id":5},"doubleValue":{"type":"double","id":6},"stringValue":{"type":"bytes","id":7},"aggregateValue":{"type":"string","id":8}},"nested":{"NamePart":{"fields":{"namePart":{"rule":"required","type":"string","id":1},"isExtension":{"rule":"required","type":"bool","id":2}}}}},"FeatureSet":{"edition":"proto2","fields":{"fieldPresence":{"type":"FieldPresence","id":1,"options":{"retention":"RETENTION_RUNTIME","targets":"TARGET_TYPE_FILE","feature_support.edition_introduced":"EDITION_2023","edition_defaults.edition":"EDITION_2023","edition_defaults.value":"EXPLICIT"}},"enumType":{"type":"EnumType","id":2,"options":{"retention":"RETENTION_RUNTIME","targets":"TARGET_TYPE_FILE","feature_support.edition_introduced":"EDITION_2023","edition_defaults.edition":"EDITION_PROTO3","edition_defaults.value":"OPEN"}},"repeatedFieldEncoding":{"type":"RepeatedFieldEncoding","id":3,"options":{"retention":"RETENTION_RUNTIME","targets":"TARGET_TYPE_FILE","feature_support.edition_introduced":"EDITION_2023","edition_defaults.edition":"EDITION_PROTO3","edition_defaults.value":"PACKED"}},"utf8Validation":{"type":"Utf8Validation","id":4,"options":{"retention":"RETENTION_RUNTIME","targets":"TARGET_TYPE_FILE","feature_support.edition_introduced":"EDITION_2023","edition_defaults.edition":"EDITION_PROTO3","edition_defaults.value":"VERIFY"}},"messageEncoding":{"type":"MessageEncoding","id":5,"options":{"retention":"RETENTION_RUNTIME","targets":"TARGET_TYPE_FILE","feature_support.edition_introduced":"EDITION_2023","edition_defaults.edition":"EDITION_LEGACY","edition_defaults.value":"LENGTH_PREFIXED"}},"jsonFormat":{"type":"JsonFormat","id":6,"options":{"retention":"RETENTION_RUNTIME","targets":"TARGET_TYPE_FILE","feature_support.edition_introduced":"EDITION_2023","edition_defaults.edition":"EDITION_PROTO3","edition_defaults.value":"ALLOW"}},"enforceNamingStyle":{"type":"EnforceNamingStyle","id":7,"options":{"retention":"RETENTION_SOURCE","targets":"TARGET_TYPE_METHOD","feature_support.edition_introduced":"EDITION_2024","edition_defaults.edition":"EDITION_2024","edition_defaults.value":"STYLE2024"}},"defaultSymbolVisibility":{"type":"VisibilityFeature.DefaultSymbolVisibility","id":8,"options":{"retention":"RETENTION_SOURCE","targets":"TARGET_TYPE_FILE","feature_support.edition_introduced":"EDITION_2024","edition_defaults.edition":"EDITION_2024","edition_defaults.value":"EXPORT_TOP_LEVEL"}}},"extensions":[[1000,9994],[9995,9999],[10000,10000]],"reserved":[[999,999]],"nested":{"FieldPresence":{"values":{"FIELD_PRESENCE_UNKNOWN":0,"EXPLICIT":1,"IMPLICIT":2,"LEGACY_REQUIRED":3}},"EnumType":{"values":{"ENUM_TYPE_UNKNOWN":0,"OPEN":1,"CLOSED":2}},"RepeatedFieldEncoding":{"values":{"REPEATED_FIELD_ENCODING_UNKNOWN":0,"PACKED":1,"EXPANDED":2}},"Utf8Validation":{"values":{"UTF8_VALIDATION_UNKNOWN":0,"VERIFY":2,"NONE":3}},"MessageEncoding":{"values":{"MESSAGE_ENCODING_UNKNOWN":0,"LENGTH_PREFIXED":1,"DELIMITED":2}},"JsonFormat":{"values":{"JSON_FORMAT_UNKNOWN":0,"ALLOW":1,"LEGACY_BEST_EFFORT":2}},"EnforceNamingStyle":{"values":{"ENFORCE_NAMING_STYLE_UNKNOWN":0,"STYLE2024":1,"STYLE_LEGACY":2}},"VisibilityFeature":{"fields":{},"reserved":[[1,536870911]],"nested":{"DefaultSymbolVisibility":{"values":{"DEFAULT_SYMBOL_VISIBILITY_UNKNOWN":0,"EXPORT_ALL":1,"EXPORT_TOP_LEVEL":2,"LOCAL_ALL":3,"STRICT":4}}}}}},"FeatureSetDefaults":{"edition":"proto2","fields":{"defaults":{"rule":"repeated","type":"FeatureSetEditionDefault","id":1},"minimumEdition":{"type":"Edition","id":4},"maximumEdition":{"type":"Edition","id":5}},"nested":{"FeatureSetEditionDefault":{"fields":{"edition":{"type":"Edition","id":3},"overridableFeatures":{"type":"FeatureSet","id":4},"fixedFeatures":{"type":"FeatureSet","id":5}},"reserved":[[1,1],[2,2],"features"]}}},"SourceCodeInfo":{"edition":"proto2","fields":{"location":{"rule":"repeated","type":"Location","id":1}},"extensions":[[536000000,536000000]],"nested":{"Location":{"fields":{"path":{"rule":"repeated","type":"int32","id":1,"options":{"packed":true}},"span":{"rule":"repeated","type":"int32","id":2,"options":{"packed":true}},"leadingComments":{"type":"string","id":3},"trailingComments":{"type":"string","id":4},"leadingDetachedComments":{"rule":"repeated","type":"string","id":6}}}}},"GeneratedCodeInfo":{"edition":"proto2","fields":{"annotation":{"rule":"repeated","type":"Annotation","id":1}},"nested":{"Annotation":{"fields":{"path":{"rule":"repeated","type":"int32","id":1,"options":{"packed":true}},"sourceFile":{"type":"string","id":2},"begin":{"type":"int32","id":3},"end":{"type":"int32","id":4},"semantic":{"type":"Semantic","id":5}},"nested":{"Semantic":{"values":{"NONE":0,"SET":1,"ALIAS":2}}}}}},"SymbolVisibility":{"edition":"proto2","values":{"VISIBILITY_UNSET":0,"VISIBILITY_LOCAL":1,"VISIBILITY_EXPORT":2}}}}}}}');
const require$$4 = {
  nested: nested$3
};
var hasRequiredDescriptor;
function requireDescriptor() {
  if (hasRequiredDescriptor) return descriptor.exports;
  hasRequiredDescriptor = 1;
  (function(module, exports$1) {
    var $protobuf = requireProtobufjs();
    module.exports = exports$1 = $protobuf.descriptor = $protobuf.Root.fromJSON(require$$4).lookup(".google.protobuf");
    var Namespace = $protobuf.Namespace, Root = $protobuf.Root, Enum = $protobuf.Enum, Type = $protobuf.Type, Field = $protobuf.Field, MapField = $protobuf.MapField, OneOf = $protobuf.OneOf, Service = $protobuf.Service, Method = $protobuf.Method;
    Root.fromDescriptor = function fromDescriptor(descriptor2) {
      if (typeof descriptor2.length === "number")
        descriptor2 = exports$1.FileDescriptorSet.decode(descriptor2);
      var root2 = new Root();
      if (descriptor2.file) {
        var fileDescriptor, filePackage;
        for (var j = 0, i; j < descriptor2.file.length; ++j) {
          filePackage = root2;
          if ((fileDescriptor = descriptor2.file[j])["package"] && fileDescriptor["package"].length)
            filePackage = root2.define(fileDescriptor["package"]);
          var edition = editionFromDescriptor(fileDescriptor);
          if (fileDescriptor.name && fileDescriptor.name.length)
            root2.files.push(filePackage.filename = fileDescriptor.name);
          if (fileDescriptor.messageType)
            for (i = 0; i < fileDescriptor.messageType.length; ++i)
              filePackage.add(Type.fromDescriptor(fileDescriptor.messageType[i], edition));
          if (fileDescriptor.enumType)
            for (i = 0; i < fileDescriptor.enumType.length; ++i)
              filePackage.add(Enum.fromDescriptor(fileDescriptor.enumType[i], edition));
          if (fileDescriptor.extension)
            for (i = 0; i < fileDescriptor.extension.length; ++i)
              filePackage.add(Field.fromDescriptor(fileDescriptor.extension[i], edition));
          if (fileDescriptor.service)
            for (i = 0; i < fileDescriptor.service.length; ++i)
              filePackage.add(Service.fromDescriptor(fileDescriptor.service[i], edition));
          var opts = fromDescriptorOptions(fileDescriptor.options, exports$1.FileOptions);
          if (opts) {
            var ks = Object.keys(opts);
            for (i = 0; i < ks.length; ++i)
              filePackage.setOption(ks[i], opts[ks[i]]);
          }
        }
      }
      return root2.resolveAll();
    };
    Root.prototype.toDescriptor = function toDescriptor(edition) {
      var set = exports$1.FileDescriptorSet.create();
      Root_toDescriptorRecursive(this, set.file, edition);
      return set;
    };
    function Root_toDescriptorRecursive(ns, files, edition) {
      var file = exports$1.FileDescriptorProto.create({ name: ns.filename || (ns.fullName.substring(1).replace(/\./g, "_") || "root") + ".proto" });
      editionToDescriptor(edition, file);
      if (!(ns instanceof Root))
        file["package"] = ns.fullName.substring(1);
      for (var i = 0, nested2; i < ns.nestedArray.length; ++i)
        if ((nested2 = ns._nestedArray[i]) instanceof Type)
          file.messageType.push(nested2.toDescriptor(edition));
        else if (nested2 instanceof Enum)
          file.enumType.push(nested2.toDescriptor());
        else if (nested2 instanceof Field)
          file.extension.push(nested2.toDescriptor(edition));
        else if (nested2 instanceof Service)
          file.service.push(nested2.toDescriptor());
        else if (nested2 instanceof /* plain */
        Namespace)
          Root_toDescriptorRecursive(nested2, files, edition);
      file.options = toDescriptorOptions(ns.options, exports$1.FileOptions);
      if (file.messageType.length + file.enumType.length + file.extension.length + file.service.length)
        files.push(file);
    }
    var unnamedMessageIndex = 0;
    Type.fromDescriptor = function fromDescriptor(descriptor2, edition, nested2) {
      if (typeof descriptor2.length === "number")
        descriptor2 = exports$1.DescriptorProto.decode(descriptor2);
      var type2 = new Type(descriptor2.name.length ? descriptor2.name : "Type" + unnamedMessageIndex++, fromDescriptorOptions(descriptor2.options, exports$1.MessageOptions)), i;
      if (!nested2)
        type2._edition = edition;
      if (descriptor2.oneofDecl)
        for (i = 0; i < descriptor2.oneofDecl.length; ++i)
          type2.add(OneOf.fromDescriptor(descriptor2.oneofDecl[i]));
      if (descriptor2.field)
        for (i = 0; i < descriptor2.field.length; ++i) {
          var field2 = Field.fromDescriptor(descriptor2.field[i], edition, true);
          type2.add(field2);
          if (descriptor2.field[i].hasOwnProperty("oneofIndex"))
            type2.oneofsArray[descriptor2.field[i].oneofIndex].add(field2);
        }
      if (descriptor2.extension)
        for (i = 0; i < descriptor2.extension.length; ++i)
          type2.add(Field.fromDescriptor(descriptor2.extension[i], edition, true));
      if (descriptor2.nestedType)
        for (i = 0; i < descriptor2.nestedType.length; ++i) {
          type2.add(Type.fromDescriptor(descriptor2.nestedType[i], edition, true));
          if (descriptor2.nestedType[i].options && descriptor2.nestedType[i].options.mapEntry)
            type2.setOption("map_entry", true);
        }
      if (descriptor2.enumType)
        for (i = 0; i < descriptor2.enumType.length; ++i)
          type2.add(Enum.fromDescriptor(descriptor2.enumType[i], edition, true));
      if (descriptor2.extensionRange && descriptor2.extensionRange.length) {
        type2.extensions = [];
        for (i = 0; i < descriptor2.extensionRange.length; ++i)
          type2.extensions.push([descriptor2.extensionRange[i].start, descriptor2.extensionRange[i].end]);
      }
      if (descriptor2.reservedRange && descriptor2.reservedRange.length || descriptor2.reservedName && descriptor2.reservedName.length) {
        type2.reserved = [];
        if (descriptor2.reservedRange)
          for (i = 0; i < descriptor2.reservedRange.length; ++i)
            type2.reserved.push([descriptor2.reservedRange[i].start, descriptor2.reservedRange[i].end]);
        if (descriptor2.reservedName)
          for (i = 0; i < descriptor2.reservedName.length; ++i)
            type2.reserved.push(descriptor2.reservedName[i]);
      }
      return type2;
    };
    Type.prototype.toDescriptor = function toDescriptor(edition) {
      var descriptor2 = exports$1.DescriptorProto.create({ name: this.name }), i;
      for (i = 0; i < this.fieldsArray.length; ++i) {
        var fieldDescriptor;
        descriptor2.field.push(fieldDescriptor = this._fieldsArray[i].toDescriptor(edition));
        if (this._fieldsArray[i] instanceof MapField) {
          var keyType = toDescriptorType(this._fieldsArray[i].keyType, this._fieldsArray[i].resolvedKeyType, false), valueType = toDescriptorType(this._fieldsArray[i].type, this._fieldsArray[i].resolvedType, false), valueTypeName = valueType === /* type */
          11 || valueType === /* enum */
          14 ? this._fieldsArray[i].resolvedType && shortname(this.parent, this._fieldsArray[i].resolvedType) || this._fieldsArray[i].type : void 0;
          descriptor2.nestedType.push(exports$1.DescriptorProto.create({
            name: fieldDescriptor.typeName,
            field: [
              exports$1.FieldDescriptorProto.create({ name: "key", number: 1, label: 1, type: keyType }),
              // can't reference a type or enum
              exports$1.FieldDescriptorProto.create({ name: "value", number: 2, label: 1, type: valueType, typeName: valueTypeName })
            ],
            options: exports$1.MessageOptions.create({ mapEntry: true })
          }));
        }
      }
      for (i = 0; i < this.oneofsArray.length; ++i)
        descriptor2.oneofDecl.push(this._oneofsArray[i].toDescriptor());
      for (i = 0; i < this.nestedArray.length; ++i) {
        if (this._nestedArray[i] instanceof Field)
          descriptor2.field.push(this._nestedArray[i].toDescriptor(edition));
        else if (this._nestedArray[i] instanceof Type)
          descriptor2.nestedType.push(this._nestedArray[i].toDescriptor(edition));
        else if (this._nestedArray[i] instanceof Enum)
          descriptor2.enumType.push(this._nestedArray[i].toDescriptor());
      }
      if (this.extensions)
        for (i = 0; i < this.extensions.length; ++i)
          descriptor2.extensionRange.push(exports$1.DescriptorProto.ExtensionRange.create({ start: this.extensions[i][0], end: this.extensions[i][1] }));
      if (this.reserved)
        for (i = 0; i < this.reserved.length; ++i)
          if (typeof this.reserved[i] === "string")
            descriptor2.reservedName.push(this.reserved[i]);
          else
            descriptor2.reservedRange.push(exports$1.DescriptorProto.ReservedRange.create({ start: this.reserved[i][0], end: this.reserved[i][1] }));
      descriptor2.options = toDescriptorOptions(this.options, exports$1.MessageOptions);
      return descriptor2;
    };
    var numberRe = /^(?![eE])[0-9]*(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?$/;
    Field.fromDescriptor = function fromDescriptor(descriptor2, edition, nested2) {
      if (typeof descriptor2.length === "number")
        descriptor2 = exports$1.DescriptorProto.decode(descriptor2);
      if (typeof descriptor2.number !== "number")
        throw Error("missing field id");
      var fieldType;
      if (descriptor2.typeName && descriptor2.typeName.length)
        fieldType = descriptor2.typeName;
      else
        fieldType = fromDescriptorType(descriptor2.type);
      var fieldRule;
      switch (descriptor2.label) {
        // 0 is reserved for errors
        case 1:
          fieldRule = void 0;
          break;
        case 2:
          fieldRule = "required";
          break;
        case 3:
          fieldRule = "repeated";
          break;
        default:
          throw Error("illegal label: " + descriptor2.label);
      }
      var extendee = descriptor2.extendee;
      if (descriptor2.extendee !== void 0) {
        extendee = extendee.length ? extendee : void 0;
      }
      var field2 = new Field(
        descriptor2.name.length ? descriptor2.name : "field" + descriptor2.number,
        descriptor2.number,
        fieldType,
        fieldRule,
        extendee
      );
      if (!nested2)
        field2._edition = edition;
      field2.options = fromDescriptorOptions(descriptor2.options, exports$1.FieldOptions);
      if (descriptor2.proto3_optional)
        field2.options.proto3_optional = true;
      if (descriptor2.defaultValue && descriptor2.defaultValue.length) {
        var defaultValue = descriptor2.defaultValue;
        switch (defaultValue) {
          case "true":
          case "TRUE":
            defaultValue = true;
            break;
          case "false":
          case "FALSE":
            defaultValue = false;
            break;
          default:
            var match = numberRe.exec(defaultValue);
            if (match)
              defaultValue = parseInt(defaultValue);
            break;
        }
        field2.setOption("default", defaultValue);
      }
      if (packableDescriptorType(descriptor2.type)) {
        if (edition === "proto3") {
          if (descriptor2.options && !descriptor2.options.packed)
            field2.setOption("packed", false);
        } else if ((!edition || edition === "proto2") && descriptor2.options && descriptor2.options.packed)
          field2.setOption("packed", true);
      }
      return field2;
    };
    Field.prototype.toDescriptor = function toDescriptor(edition) {
      var descriptor2 = exports$1.FieldDescriptorProto.create({ name: this.name, number: this.id });
      if (this.map) {
        descriptor2.type = 11;
        descriptor2.typeName = $protobuf.util.ucFirst(this.name);
        descriptor2.label = 3;
      } else {
        switch (descriptor2.type = toDescriptorType(this.type, this.resolve().resolvedType, this.delimited)) {
          case 10:
          // group
          case 11:
          // type
          case 14:
            descriptor2.typeName = this.resolvedType ? shortname(this.parent, this.resolvedType) : this.type;
            break;
        }
        if (this.rule === "repeated") {
          descriptor2.label = 3;
        } else if (this.required && edition === "proto2") {
          descriptor2.label = 2;
        } else {
          descriptor2.label = 1;
        }
      }
      descriptor2.extendee = this.extensionField ? this.extensionField.parent.fullName : this.extend;
      if (this.partOf) {
        if ((descriptor2.oneofIndex = this.parent.oneofsArray.indexOf(this.partOf)) < 0)
          throw Error("missing oneof");
      }
      if (this.options) {
        descriptor2.options = toDescriptorOptions(this.options, exports$1.FieldOptions);
        if (this.options["default"] != null)
          descriptor2.defaultValue = String(this.options["default"]);
        if (this.options.proto3_optional)
          descriptor2.proto3_optional = true;
      }
      if (edition === "proto3") {
        if (!this.packed)
          (descriptor2.options || (descriptor2.options = exports$1.FieldOptions.create())).packed = false;
      } else if ((!edition || edition === "proto2") && this.packed)
        (descriptor2.options || (descriptor2.options = exports$1.FieldOptions.create())).packed = true;
      return descriptor2;
    };
    var unnamedEnumIndex = 0;
    Enum.fromDescriptor = function fromDescriptor(descriptor2, edition, nested2) {
      if (typeof descriptor2.length === "number")
        descriptor2 = exports$1.EnumDescriptorProto.decode(descriptor2);
      var values = {};
      if (descriptor2.value)
        for (var i = 0; i < descriptor2.value.length; ++i) {
          var name = descriptor2.value[i].name, value = descriptor2.value[i].number || 0;
          values[name && name.length ? name : "NAME" + value] = value;
        }
      var enm = new Enum(
        descriptor2.name && descriptor2.name.length ? descriptor2.name : "Enum" + unnamedEnumIndex++,
        values,
        fromDescriptorOptions(descriptor2.options, exports$1.EnumOptions)
      );
      if (!nested2)
        enm._edition = edition;
      return enm;
    };
    Enum.prototype.toDescriptor = function toDescriptor() {
      var values = [];
      for (var i = 0, ks = Object.keys(this.values); i < ks.length; ++i)
        values.push(exports$1.EnumValueDescriptorProto.create({ name: ks[i], number: this.values[ks[i]] }));
      return exports$1.EnumDescriptorProto.create({
        name: this.name,
        value: values,
        options: toDescriptorOptions(this.options, exports$1.EnumOptions)
      });
    };
    var unnamedOneofIndex = 0;
    OneOf.fromDescriptor = function fromDescriptor(descriptor2) {
      if (typeof descriptor2.length === "number")
        descriptor2 = exports$1.OneofDescriptorProto.decode(descriptor2);
      return new OneOf(
        // unnamedOneOfIndex is global, not per type, because we have no ref to a type here
        descriptor2.name && descriptor2.name.length ? descriptor2.name : "oneof" + unnamedOneofIndex++
        // fromDescriptorOptions(descriptor.options, exports.OneofOptions) - only uninterpreted_option
      );
    };
    OneOf.prototype.toDescriptor = function toDescriptor() {
      return exports$1.OneofDescriptorProto.create({
        name: this.name
        // options: toDescriptorOptions(this.options, exports.OneofOptions) - only uninterpreted_option
      });
    };
    var unnamedServiceIndex = 0;
    Service.fromDescriptor = function fromDescriptor(descriptor2, edition, nested2) {
      if (typeof descriptor2.length === "number")
        descriptor2 = exports$1.ServiceDescriptorProto.decode(descriptor2);
      var service2 = new Service(descriptor2.name && descriptor2.name.length ? descriptor2.name : "Service" + unnamedServiceIndex++, fromDescriptorOptions(descriptor2.options, exports$1.ServiceOptions));
      if (!nested2)
        service2._edition = edition;
      if (descriptor2.method)
        for (var i = 0; i < descriptor2.method.length; ++i)
          service2.add(Method.fromDescriptor(descriptor2.method[i]));
      return service2;
    };
    Service.prototype.toDescriptor = function toDescriptor() {
      var methods = [];
      for (var i = 0; i < this.methodsArray.length; ++i)
        methods.push(this._methodsArray[i].toDescriptor());
      return exports$1.ServiceDescriptorProto.create({
        name: this.name,
        method: methods,
        options: toDescriptorOptions(this.options, exports$1.ServiceOptions)
      });
    };
    var unnamedMethodIndex = 0;
    Method.fromDescriptor = function fromDescriptor(descriptor2) {
      if (typeof descriptor2.length === "number")
        descriptor2 = exports$1.MethodDescriptorProto.decode(descriptor2);
      return new Method(
        // unnamedMethodIndex is global, not per service, because we have no ref to a service here
        descriptor2.name && descriptor2.name.length ? descriptor2.name : "Method" + unnamedMethodIndex++,
        "rpc",
        descriptor2.inputType,
        descriptor2.outputType,
        Boolean(descriptor2.clientStreaming),
        Boolean(descriptor2.serverStreaming),
        fromDescriptorOptions(descriptor2.options, exports$1.MethodOptions)
      );
    };
    Method.prototype.toDescriptor = function toDescriptor() {
      return exports$1.MethodDescriptorProto.create({
        name: this.name,
        inputType: this.resolvedRequestType ? this.resolvedRequestType.fullName : this.requestType,
        outputType: this.resolvedResponseType ? this.resolvedResponseType.fullName : this.responseType,
        clientStreaming: this.requestStream,
        serverStreaming: this.responseStream,
        options: toDescriptorOptions(this.options, exports$1.MethodOptions)
      });
    };
    function fromDescriptorType(type2) {
      switch (type2) {
        // 0 is reserved for errors
        case 1:
          return "double";
        case 2:
          return "float";
        case 3:
          return "int64";
        case 4:
          return "uint64";
        case 5:
          return "int32";
        case 6:
          return "fixed64";
        case 7:
          return "fixed32";
        case 8:
          return "bool";
        case 9:
          return "string";
        case 12:
          return "bytes";
        case 13:
          return "uint32";
        case 15:
          return "sfixed32";
        case 16:
          return "sfixed64";
        case 17:
          return "sint32";
        case 18:
          return "sint64";
      }
      throw Error("illegal type: " + type2);
    }
    function packableDescriptorType(type2) {
      switch (type2) {
        case 1:
        // double
        case 2:
        // float
        case 3:
        // int64
        case 4:
        // uint64
        case 5:
        // int32
        case 6:
        // fixed64
        case 7:
        // fixed32
        case 8:
        // bool
        case 13:
        // uint32
        case 14:
        // enum (!)
        case 15:
        // sfixed32
        case 16:
        // sfixed64
        case 17:
        // sint32
        case 18:
          return true;
      }
      return false;
    }
    function toDescriptorType(type2, resolvedType, delimited) {
      switch (type2) {
        // 0 is reserved for errors
        case "double":
          return 1;
        case "float":
          return 2;
        case "int64":
          return 3;
        case "uint64":
          return 4;
        case "int32":
          return 5;
        case "fixed64":
          return 6;
        case "fixed32":
          return 7;
        case "bool":
          return 8;
        case "string":
          return 9;
        case "bytes":
          return 12;
        case "uint32":
          return 13;
        case "sfixed32":
          return 15;
        case "sfixed64":
          return 16;
        case "sint32":
          return 17;
        case "sint64":
          return 18;
      }
      if (resolvedType instanceof Enum)
        return 14;
      if (resolvedType instanceof Type)
        return delimited ? 10 : 11;
      throw Error("illegal type: " + type2);
    }
    function fromDescriptorOptionsRecursive(obj, type2) {
      var val = {};
      for (var i = 0, field2, key; i < type2.fieldsArray.length; ++i) {
        if ((key = (field2 = type2._fieldsArray[i]).name) === "uninterpretedOption") continue;
        if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
        var newKey = underScore(key);
        if (field2.resolvedType instanceof Type) {
          val[newKey] = fromDescriptorOptionsRecursive(obj[key], field2.resolvedType);
        } else if (field2.resolvedType instanceof Enum) {
          val[newKey] = field2.resolvedType.valuesById[obj[key]];
        } else {
          val[newKey] = obj[key];
        }
      }
      return val;
    }
    function fromDescriptorOptions(options, type2) {
      if (!options)
        return void 0;
      return fromDescriptorOptionsRecursive(type2.toObject(options), type2);
    }
    function toDescriptorOptionsRecursive(obj, type2) {
      var val = {};
      var keys = Object.keys(obj);
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newKey = $protobuf.util.camelCase(key);
        if (!Object.prototype.hasOwnProperty.call(type2.fields, newKey)) continue;
        var field2 = type2.fields[newKey];
        if (field2.resolvedType instanceof Type) {
          val[newKey] = toDescriptorOptionsRecursive(obj[key], field2.resolvedType);
        } else {
          val[newKey] = obj[key];
        }
        if (field2.repeated && !Array.isArray(val[newKey])) {
          val[newKey] = [val[newKey]];
        }
      }
      return val;
    }
    function toDescriptorOptions(options, type2) {
      if (!options)
        return void 0;
      return type2.fromObject(toDescriptorOptionsRecursive(options, type2));
    }
    function shortname(from, to) {
      var fromPath = from.fullName.split("."), toPath = to.fullName.split("."), i = 0, j = 0, k = toPath.length - 1;
      if (!(from instanceof Root) && to instanceof Namespace)
        while (i < fromPath.length && j < k && fromPath[i] === toPath[j]) {
          var other = to.lookup(fromPath[i++], true);
          if (other !== null && other !== to)
            break;
          ++j;
        }
      else
        for (; i < fromPath.length && j < k && fromPath[i] === toPath[j]; ++i, ++j) ;
      return toPath.slice(j).join(".");
    }
    function underScore(str) {
      return str.substring(0, 1) + str.substring(1).replace(/([A-Z])(?=[a-z]|$)/g, function($0, $1) {
        return "_" + $1.toLowerCase();
      });
    }
    function editionFromDescriptor(fileDescriptor) {
      if (fileDescriptor.syntax === "editions") {
        switch (fileDescriptor.edition) {
          case exports$1.Edition.EDITION_2023:
            return "2023";
          default:
            throw new Error("Unsupported edition " + fileDescriptor.edition);
        }
      }
      if (fileDescriptor.syntax === "proto3") {
        return "proto3";
      }
      return "proto2";
    }
    function editionToDescriptor(edition, fileDescriptor) {
      if (!edition) return;
      if (edition === "proto2" || edition === "proto3") {
        fileDescriptor.syntax = edition;
      } else {
        fileDescriptor.syntax = "editions";
        switch (edition) {
          case "2023":
            fileDescriptor.edition = exports$1.Edition.EDITION_2023;
            break;
          default:
            throw new Error("Unsupported edition " + edition);
        }
      }
    }
  })(descriptor, descriptor.exports);
  return descriptor.exports;
}
const nested$2 = { "google": { "nested": { "protobuf": { "nested": { "Api": { "fields": { "name": { "type": "string", "id": 1 }, "methods": { "rule": "repeated", "type": "Method", "id": 2 }, "options": { "rule": "repeated", "type": "Option", "id": 3 }, "version": { "type": "string", "id": 4 }, "sourceContext": { "type": "SourceContext", "id": 5 }, "mixins": { "rule": "repeated", "type": "Mixin", "id": 6 }, "syntax": { "type": "Syntax", "id": 7 } } }, "Method": { "fields": { "name": { "type": "string", "id": 1 }, "requestTypeUrl": { "type": "string", "id": 2 }, "requestStreaming": { "type": "bool", "id": 3 }, "responseTypeUrl": { "type": "string", "id": 4 }, "responseStreaming": { "type": "bool", "id": 5 }, "options": { "rule": "repeated", "type": "Option", "id": 6 }, "syntax": { "type": "Syntax", "id": 7 } } }, "Mixin": { "fields": { "name": { "type": "string", "id": 1 }, "root": { "type": "string", "id": 2 } } }, "SourceContext": { "fields": { "fileName": { "type": "string", "id": 1 } } }, "Option": { "fields": { "name": { "type": "string", "id": 1 }, "value": { "type": "Any", "id": 2 } } }, "Syntax": { "values": { "SYNTAX_PROTO2": 0, "SYNTAX_PROTO3": 1 } } } } } } };
const require$$3 = {
  nested: nested$2
};
const nested$1 = { "google": { "nested": { "protobuf": { "nested": { "SourceContext": { "fields": { "fileName": { "type": "string", "id": 1 } } } } } } } };
const require$$5 = {
  nested: nested$1
};
const nested = { "google": { "nested": { "protobuf": { "nested": { "Type": { "fields": { "name": { "type": "string", "id": 1 }, "fields": { "rule": "repeated", "type": "Field", "id": 2 }, "oneofs": { "rule": "repeated", "type": "string", "id": 3 }, "options": { "rule": "repeated", "type": "Option", "id": 4 }, "sourceContext": { "type": "SourceContext", "id": 5 }, "syntax": { "type": "Syntax", "id": 6 } } }, "Field": { "fields": { "kind": { "type": "Kind", "id": 1 }, "cardinality": { "type": "Cardinality", "id": 2 }, "number": { "type": "int32", "id": 3 }, "name": { "type": "string", "id": 4 }, "typeUrl": { "type": "string", "id": 6 }, "oneofIndex": { "type": "int32", "id": 7 }, "packed": { "type": "bool", "id": 8 }, "options": { "rule": "repeated", "type": "Option", "id": 9 }, "jsonName": { "type": "string", "id": 10 }, "defaultValue": { "type": "string", "id": 11 } }, "nested": { "Kind": { "values": { "TYPE_UNKNOWN": 0, "TYPE_DOUBLE": 1, "TYPE_FLOAT": 2, "TYPE_INT64": 3, "TYPE_UINT64": 4, "TYPE_INT32": 5, "TYPE_FIXED64": 6, "TYPE_FIXED32": 7, "TYPE_BOOL": 8, "TYPE_STRING": 9, "TYPE_GROUP": 10, "TYPE_MESSAGE": 11, "TYPE_BYTES": 12, "TYPE_UINT32": 13, "TYPE_ENUM": 14, "TYPE_SFIXED32": 15, "TYPE_SFIXED64": 16, "TYPE_SINT32": 17, "TYPE_SINT64": 18 } }, "Cardinality": { "values": { "CARDINALITY_UNKNOWN": 0, "CARDINALITY_OPTIONAL": 1, "CARDINALITY_REQUIRED": 2, "CARDINALITY_REPEATED": 3 } } } }, "Enum": { "fields": { "name": { "type": "string", "id": 1 }, "enumvalue": { "rule": "repeated", "type": "EnumValue", "id": 2 }, "options": { "rule": "repeated", "type": "Option", "id": 3 }, "sourceContext": { "type": "SourceContext", "id": 4 }, "syntax": { "type": "Syntax", "id": 5 } } }, "EnumValue": { "fields": { "name": { "type": "string", "id": 1 }, "number": { "type": "int32", "id": 2 }, "options": { "rule": "repeated", "type": "Option", "id": 3 } } }, "Option": { "fields": { "name": { "type": "string", "id": 1 }, "value": { "type": "Any", "id": 2 } } }, "Syntax": { "values": { "SYNTAX_PROTO2": 0, "SYNTAX_PROTO3": 1 } }, "Any": { "fields": { "type_url": { "type": "string", "id": 1 }, "value": { "type": "bytes", "id": 2 } } }, "SourceContext": { "fields": { "fileName": { "type": "string", "id": 1 } } } } } } } };
const require$$6 = {
  nested
};
export {
  require$$3 as a,
  require$$4 as b,
  require$$5 as c,
  require$$6 as d,
  requireDescriptor as e,
  requireProtobufjs as r
};
