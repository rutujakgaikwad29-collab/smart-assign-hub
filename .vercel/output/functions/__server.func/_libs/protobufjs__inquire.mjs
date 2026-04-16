var inquire_1;
var hasRequiredInquire;
function requireInquire() {
  if (hasRequiredInquire) return inquire_1;
  hasRequiredInquire = 1;
  inquire_1 = inquire;
  function inquire(moduleName) {
    try {
      var mod = eval("quire".replace(/^/, "re"))(moduleName);
      if (mod && (mod.length || Object.keys(mod).length))
        return mod;
    } catch (e) {
    }
    return null;
  }
  return inquire_1;
}
export {
  requireInquire as r
};
