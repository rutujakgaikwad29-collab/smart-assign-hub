var pool_1;
var hasRequiredPool;
function requirePool() {
  if (hasRequiredPool) return pool_1;
  hasRequiredPool = 1;
  pool_1 = pool;
  function pool(alloc, slice, size) {
    var SIZE = size || 8192;
    var MAX = SIZE >>> 1;
    var slab = null;
    var offset = SIZE;
    return function pool_alloc(size2) {
      if (size2 < 1 || size2 > MAX)
        return alloc(size2);
      if (offset + size2 > SIZE) {
        slab = alloc(SIZE);
        offset = 0;
      }
      var buf = slice.call(slab, offset, offset += size2);
      if (offset & 7)
        offset = (offset | 7) + 1;
      return buf;
    };
  }
  return pool_1;
}
export {
  requirePool as r
};
