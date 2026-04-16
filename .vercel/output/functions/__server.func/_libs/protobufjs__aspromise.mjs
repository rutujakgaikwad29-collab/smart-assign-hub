var aspromise;
var hasRequiredAspromise;
function requireAspromise() {
  if (hasRequiredAspromise) return aspromise;
  hasRequiredAspromise = 1;
  aspromise = asPromise;
  function asPromise(fn, ctx) {
    var params = new Array(arguments.length - 1), offset = 0, index = 2, pending = true;
    while (index < arguments.length)
      params[offset++] = arguments[index++];
    return new Promise(function executor(resolve, reject) {
      params[offset] = function callback(err) {
        if (pending) {
          pending = false;
          if (err)
            reject(err);
          else {
            var params2 = new Array(arguments.length - 1), offset2 = 0;
            while (offset2 < params2.length)
              params2[offset2++] = arguments[offset2];
            resolve.apply(null, params2);
          }
        }
      };
      try {
        fn.apply(ctx || null, params);
      } catch (err) {
        if (pending) {
          pending = false;
          reject(err);
        }
      }
    });
  }
  return aspromise;
}
export {
  requireAspromise as r
};
