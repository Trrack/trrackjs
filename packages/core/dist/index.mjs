Object.defineProperty(exports, "__esModule", { value: !0 });
exports.createAction = void 0;
function c(t) {
  const r = function(e) {
    return arguments.length === 0 ? {
      type: t
    } : {
      type: t,
      payload: e
    };
  };
  return r.type = t, r.match = (e) => e.type === t, r.toString = () => t, r;
}
exports.createAction = c;
Object.defineProperty(exports, "__esModule", { value: !0 });
exports.initEventManager = void 0;
function l() {
  const t = /* @__PURE__ */ new Map();
  return {
    listen(r, e) {
      return t.has(r) || t.set(r, []), t.get(r).push(e), () => {
        t.set(r, (t.get(r) || []).filter((i) => i !== e));
      };
    },
    fire(r, e) {
      const i = t.get(r);
      i && i.forEach((n) => n(e));
    }
  };
}
exports.initEventManager = l;
var f = globalThis && globalThis.__createBinding || (Object.create ? function(t, r, e, i) {
  i === void 0 && (i = e);
  var n = Object.getOwnPropertyDescriptor(r, e);
  (!n || ("get" in n ? !r.__esModule : n.writable || n.configurable)) && (n = { enumerable: !0, get: function() {
    return r[e];
  } }), Object.defineProperty(t, i, n);
} : function(t, r, e, i) {
  i === void 0 && (i = e), t[i] = r[e];
}), a = globalThis && globalThis.__exportStar || function(t, r) {
  for (var e in t)
    e !== "default" && !Object.prototype.hasOwnProperty.call(r, e) && f(r, t, e);
};
Object.defineProperty(exports, "__esModule", { value: !0 });
a(require("./components"), exports);
a(require("./provenance-graph"), exports);
var s = globalThis && globalThis.__createBinding || (Object.create ? function(t, r, e, i) {
  i === void 0 && (i = e);
  var n = Object.getOwnPropertyDescriptor(r, e);
  (!n || ("get" in n ? !r.__esModule : n.writable || n.configurable)) && (n = { enumerable: !0, get: function() {
    return r[e];
  } }), Object.defineProperty(t, i, n);
} : function(t, r, e, i) {
  i === void 0 && (i = e), t[i] = r[e];
}), o = globalThis && globalThis.__exportStar || function(t, r) {
  for (var e in t)
    e !== "default" && !Object.prototype.hasOwnProperty.call(r, e) && s(r, t, e);
};
Object.defineProperty(exports, "__esModule", { value: !0 });
o(require("./trrack"), exports);
o(require("./trrack-config-opts"), exports);
o(require("./trrack-events"), exports);
o(require("./types"), exports);
var d = globalThis && globalThis.__createBinding || (Object.create ? function(t, r, e, i) {
  i === void 0 && (i = e);
  var n = Object.getOwnPropertyDescriptor(r, e);
  (!n || ("get" in n ? !r.__esModule : n.writable || n.configurable)) && (n = { enumerable: !0, get: function() {
    return r[e];
  } }), Object.defineProperty(t, i, n);
} : function(t, r, e, i) {
  i === void 0 && (i = e), t[i] = r[e];
}), u = globalThis && globalThis.__exportStar || function(t, r) {
  for (var e in t)
    e !== "default" && !Object.prototype.hasOwnProperty.call(r, e) && d(r, t, e);
};
Object.defineProperty(exports, "__esModule", { value: !0 });
u(require("./action"), exports);
u(require("./reg"), exports);
var _ = globalThis && globalThis.__createBinding || (Object.create ? function(t, r, e, i) {
  i === void 0 && (i = e);
  var n = Object.getOwnPropertyDescriptor(r, e);
  (!n || ("get" in n ? !r.__esModule : n.writable || n.configurable)) && (n = { enumerable: !0, get: function() {
    return r[e];
  } }), Object.defineProperty(t, i, n);
} : function(t, r, e, i) {
  i === void 0 && (i = e), t[i] = r[e];
}), b = globalThis && globalThis.__exportStar || function(t, r) {
  for (var e in t)
    e !== "default" && !Object.prototype.hasOwnProperty.call(r, e) && _(r, t, e);
};
Object.defineProperty(exports, "__esModule", { value: !0 });
b(require("./id"), exports);
//# sourceMappingURL=index.mjs.map
