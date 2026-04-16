import { r as requireAspromise } from "./protobufjs__aspromise.mjs";
import { r as requireInquire } from "./protobufjs__inquire.mjs";
var fetch_1;
var hasRequiredFetch;
function requireFetch() {
  if (hasRequiredFetch) return fetch_1;
  hasRequiredFetch = 1;
  fetch_1 = fetch;
  var asPromise = requireAspromise(), inquire = requireInquire();
  var fs = inquire("fs");
  function fetch(filename, options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = {};
    } else if (!options)
      options = {};
    if (!callback)
      return asPromise(fetch, this, filename, options);
    if (!options.xhr && fs && fs.readFile)
      return fs.readFile(filename, function fetchReadFileCallback(err, contents) {
        return err && typeof XMLHttpRequest !== "undefined" ? fetch.xhr(filename, options, callback) : err ? callback(err) : callback(null, options.binary ? contents : contents.toString("utf8"));
      });
    return fetch.xhr(filename, options, callback);
  }
  fetch.xhr = function fetch_xhr(filename, options, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function fetchOnReadyStateChange() {
      if (xhr.readyState !== 4)
        return void 0;
      if (xhr.status !== 0 && xhr.status !== 200)
        return callback(Error("status " + xhr.status));
      if (options.binary) {
        var buffer = xhr.response;
        if (!buffer) {
          buffer = [];
          for (var i = 0; i < xhr.responseText.length; ++i)
            buffer.push(xhr.responseText.charCodeAt(i) & 255);
        }
        return callback(null, typeof Uint8Array !== "undefined" ? new Uint8Array(buffer) : buffer);
      }
      return callback(null, xhr.responseText);
    };
    if (options.binary) {
      if ("overrideMimeType" in xhr)
        xhr.overrideMimeType("text/plain; charset=x-user-defined");
      xhr.responseType = "arraybuffer";
    }
    xhr.open("GET", filename);
    xhr.send();
  };
  return fetch_1;
}
export {
  requireFetch as r
};
