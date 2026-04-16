import require$$1 from "path";
import { r as requireLodash_camelcase } from "../lodash.camelcase.mjs";
import { r as requireProtobufjs, a as require$$3, b as require$$4, c as require$$5, d as require$$6, e as requireDescriptor } from "../protobufjs.mjs";
import require$$0 from "fs";
import { r as requireUmd } from "../long.mjs";
var src = {};
var util = {};
var hasRequiredUtil;
function requireUtil() {
  if (hasRequiredUtil) return util;
  hasRequiredUtil = 1;
  Object.defineProperty(util, "__esModule", { value: true });
  util.addCommonProtos = util.loadProtosWithOptionsSync = util.loadProtosWithOptions = void 0;
  const fs = require$$0;
  const path = require$$1;
  const Protobuf = requireProtobufjs();
  function addIncludePathResolver(root, includePaths) {
    const originalResolvePath = root.resolvePath;
    root.resolvePath = (origin, target) => {
      if (path.isAbsolute(target)) {
        return target;
      }
      for (const directory of includePaths) {
        const fullPath = path.join(directory, target);
        try {
          fs.accessSync(fullPath, fs.constants.R_OK);
          return fullPath;
        } catch (err) {
          continue;
        }
      }
      process.emitWarning(`${target} not found in any of the include paths ${includePaths}`);
      return originalResolvePath(origin, target);
    };
  }
  async function loadProtosWithOptions(filename, options) {
    const root = new Protobuf.Root();
    options = options || {};
    if (!!options.includeDirs) {
      if (!Array.isArray(options.includeDirs)) {
        return Promise.reject(new Error("The includeDirs option must be an array"));
      }
      addIncludePathResolver(root, options.includeDirs);
    }
    const loadedRoot = await root.load(filename, options);
    loadedRoot.resolveAll();
    return loadedRoot;
  }
  util.loadProtosWithOptions = loadProtosWithOptions;
  function loadProtosWithOptionsSync(filename, options) {
    const root = new Protobuf.Root();
    options = options || {};
    if (!!options.includeDirs) {
      if (!Array.isArray(options.includeDirs)) {
        throw new Error("The includeDirs option must be an array");
      }
      addIncludePathResolver(root, options.includeDirs);
    }
    const loadedRoot = root.loadSync(filename, options);
    loadedRoot.resolveAll();
    return loadedRoot;
  }
  util.loadProtosWithOptionsSync = loadProtosWithOptionsSync;
  function addCommonProtos() {
    const apiDescriptor = require$$3;
    const descriptorDescriptor = require$$4;
    const sourceContextDescriptor = require$$5;
    const typeDescriptor = require$$6;
    Protobuf.common("api", apiDescriptor.nested.google.nested.protobuf.nested);
    Protobuf.common("descriptor", descriptorDescriptor.nested.google.nested.protobuf.nested);
    Protobuf.common("source_context", sourceContextDescriptor.nested.google.nested.protobuf.nested);
    Protobuf.common("type", typeDescriptor.nested.google.nested.protobuf.nested);
  }
  util.addCommonProtos = addCommonProtos;
  return util;
}
var hasRequiredSrc;
function requireSrc() {
  if (hasRequiredSrc) return src;
  hasRequiredSrc = 1;
  (function(exports$1) {
    Object.defineProperty(exports$1, "__esModule", { value: true });
    exports$1.loadFileDescriptorSetFromObject = exports$1.loadFileDescriptorSetFromBuffer = exports$1.fromJSON = exports$1.loadSync = exports$1.load = exports$1.IdempotencyLevel = exports$1.isAnyExtension = exports$1.Long = void 0;
    const camelCase = requireLodash_camelcase();
    const Protobuf = requireProtobufjs();
    const descriptor = requireDescriptor();
    const util_1 = requireUtil();
    const Long = requireUmd();
    exports$1.Long = Long;
    function isAnyExtension(obj) {
      return "@type" in obj && typeof obj["@type"] === "string";
    }
    exports$1.isAnyExtension = isAnyExtension;
    var IdempotencyLevel;
    (function(IdempotencyLevel2) {
      IdempotencyLevel2["IDEMPOTENCY_UNKNOWN"] = "IDEMPOTENCY_UNKNOWN";
      IdempotencyLevel2["NO_SIDE_EFFECTS"] = "NO_SIDE_EFFECTS";
      IdempotencyLevel2["IDEMPOTENT"] = "IDEMPOTENT";
    })(IdempotencyLevel = exports$1.IdempotencyLevel || (exports$1.IdempotencyLevel = {}));
    const descriptorOptions = {
      longs: String,
      enums: String,
      bytes: String,
      defaults: true,
      oneofs: true,
      json: true
    };
    function joinName(baseName, name) {
      if (baseName === "") {
        return name;
      } else {
        return baseName + "." + name;
      }
    }
    function isHandledReflectionObject(obj) {
      return obj instanceof Protobuf.Service || obj instanceof Protobuf.Type || obj instanceof Protobuf.Enum;
    }
    function isNamespaceBase(obj) {
      return obj instanceof Protobuf.Namespace || obj instanceof Protobuf.Root;
    }
    function getAllHandledReflectionObjects(obj, parentName) {
      const objName = joinName(parentName, obj.name);
      if (isHandledReflectionObject(obj)) {
        return [[objName, obj]];
      } else {
        if (isNamespaceBase(obj) && typeof obj.nested !== "undefined") {
          return Object.keys(obj.nested).map((name) => {
            return getAllHandledReflectionObjects(obj.nested[name], objName);
          }).reduce((accumulator, currentValue) => accumulator.concat(currentValue), []);
        }
      }
      return [];
    }
    function createDeserializer(cls, options) {
      return function deserialize(argBuf) {
        return cls.toObject(cls.decode(argBuf), options);
      };
    }
    function createSerializer(cls) {
      return function serialize(arg) {
        if (Array.isArray(arg)) {
          throw new Error(`Failed to serialize message: expected object with ${cls.name} structure, got array instead`);
        }
        const message = cls.fromObject(arg);
        return cls.encode(message).finish();
      };
    }
    function mapMethodOptions(options) {
      return (options || []).reduce((obj, item) => {
        for (const [key, value] of Object.entries(item)) {
          switch (key) {
            case "uninterpreted_option":
              obj.uninterpreted_option.push(item.uninterpreted_option);
              break;
            default:
              obj[key] = value;
          }
        }
        return obj;
      }, {
        deprecated: false,
        idempotency_level: IdempotencyLevel.IDEMPOTENCY_UNKNOWN,
        uninterpreted_option: []
      });
    }
    function createMethodDefinition(method, serviceName, options, fileDescriptors) {
      const requestType = method.resolvedRequestType;
      const responseType = method.resolvedResponseType;
      return {
        path: "/" + serviceName + "/" + method.name,
        requestStream: !!method.requestStream,
        responseStream: !!method.responseStream,
        requestSerialize: createSerializer(requestType),
        requestDeserialize: createDeserializer(requestType, options),
        responseSerialize: createSerializer(responseType),
        responseDeserialize: createDeserializer(responseType, options),
        // TODO(murgatroid99): Find a better way to handle this
        originalName: camelCase(method.name),
        requestType: createMessageDefinition(requestType, fileDescriptors),
        responseType: createMessageDefinition(responseType, fileDescriptors),
        options: mapMethodOptions(method.parsedOptions)
      };
    }
    function createServiceDefinition(service, name, options, fileDescriptors) {
      const def = {};
      for (const method of service.methodsArray) {
        def[method.name] = createMethodDefinition(method, name, options, fileDescriptors);
      }
      return def;
    }
    function createMessageDefinition(message, fileDescriptors) {
      const messageDescriptor = message.toDescriptor("proto3");
      return {
        format: "Protocol Buffer 3 DescriptorProto",
        type: messageDescriptor.$type.toObject(messageDescriptor, descriptorOptions),
        fileDescriptorProtos: fileDescriptors
      };
    }
    function createEnumDefinition(enumType, fileDescriptors) {
      const enumDescriptor = enumType.toDescriptor("proto3");
      return {
        format: "Protocol Buffer 3 EnumDescriptorProto",
        type: enumDescriptor.$type.toObject(enumDescriptor, descriptorOptions),
        fileDescriptorProtos: fileDescriptors
      };
    }
    function createDefinition(obj, name, options, fileDescriptors) {
      if (obj instanceof Protobuf.Service) {
        return createServiceDefinition(obj, name, options, fileDescriptors);
      } else if (obj instanceof Protobuf.Type) {
        return createMessageDefinition(obj, fileDescriptors);
      } else if (obj instanceof Protobuf.Enum) {
        return createEnumDefinition(obj, fileDescriptors);
      } else {
        throw new Error("Type mismatch in reflection object handling");
      }
    }
    function createPackageDefinition(root, options) {
      const def = {};
      root.resolveAll();
      const descriptorList = root.toDescriptor("proto3").file;
      const bufferList = descriptorList.map((value) => Buffer.from(descriptor.FileDescriptorProto.encode(value).finish()));
      for (const [name, obj] of getAllHandledReflectionObjects(root, "")) {
        def[name] = createDefinition(obj, name, options, bufferList);
      }
      return def;
    }
    function createPackageDefinitionFromDescriptorSet(decodedDescriptorSet, options) {
      options = options || {};
      const root = Protobuf.Root.fromDescriptor(decodedDescriptorSet);
      root.resolveAll();
      return createPackageDefinition(root, options);
    }
    function load(filename, options) {
      return (0, util_1.loadProtosWithOptions)(filename, options).then((loadedRoot) => {
        return createPackageDefinition(loadedRoot, options);
      });
    }
    exports$1.load = load;
    function loadSync(filename, options) {
      const loadedRoot = (0, util_1.loadProtosWithOptionsSync)(filename, options);
      return createPackageDefinition(loadedRoot, options);
    }
    exports$1.loadSync = loadSync;
    function fromJSON(json, options) {
      options = options || {};
      const loadedRoot = Protobuf.Root.fromJSON(json);
      loadedRoot.resolveAll();
      return createPackageDefinition(loadedRoot, options);
    }
    exports$1.fromJSON = fromJSON;
    function loadFileDescriptorSetFromBuffer(descriptorSet, options) {
      const decodedDescriptorSet = descriptor.FileDescriptorSet.decode(descriptorSet);
      return createPackageDefinitionFromDescriptorSet(decodedDescriptorSet, options);
    }
    exports$1.loadFileDescriptorSetFromBuffer = loadFileDescriptorSetFromBuffer;
    function loadFileDescriptorSetFromObject(descriptorSet, options) {
      const decodedDescriptorSet = descriptor.FileDescriptorSet.fromObject(descriptorSet);
      return createPackageDefinitionFromDescriptorSet(decodedDescriptorSet, options);
    }
    exports$1.loadFileDescriptorSetFromObject = loadFileDescriptorSetFromObject;
    (0, util_1.addCommonProtos)();
  })(src);
  return src;
}
var srcExports = requireSrc();
export {
  requireSrc as r,
  srcExports as s
};
