import { createSlice as He, createListenerMiddleware as Be, isAnyOf as be, configureStore as $e, createAction as We } from "@reduxjs/toolkit";
import { createAction as Ft } from "@reduxjs/toolkit";
function Qe() {
  const e = /* @__PURE__ */ new Map();
  return {
    listen(t, r) {
      return e.has(t) || e.set(t, []), e.get(t).push(r), () => {
        e.set(
          t,
          (e.get(t) || []).filter((n) => n !== r)
        );
      };
    },
    fire(t, r) {
      const n = e.get(t);
      n && n.forEach((o) => o(r));
    }
  };
}
let H;
const Ge = new Uint8Array(16);
function Ye() {
  if (!H && (H = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !H))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return H(Ge);
}
const w = [];
for (let e = 0; e < 256; ++e)
  w.push((e + 256).toString(16).slice(1));
function qe(e, t = 0) {
  return w[e[t + 0]] + w[e[t + 1]] + w[e[t + 2]] + w[e[t + 3]] + "-" + w[e[t + 4]] + w[e[t + 5]] + "-" + w[e[t + 6]] + w[e[t + 7]] + "-" + w[e[t + 8]] + w[e[t + 9]] + "-" + w[e[t + 10]] + w[e[t + 11]] + w[e[t + 12]] + w[e[t + 13]] + w[e[t + 14]] + w[e[t + 15]];
}
const Xe = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), Ne = {
  randomUUID: Xe
};
function Pe(e, t, r) {
  if (Ne.randomUUID && !t && !e)
    return Ne.randomUUID();
  e = e || {};
  const n = e.random || (e.rng || Ye)();
  if (n[6] = n[6] & 15 | 64, n[8] = n[8] & 63 | 128, t) {
    r = r || 0;
    for (let o = 0; o < 16; ++o)
      t[r + o] = n[o];
    return t;
  }
  return qe(n);
}
class P {
  static get() {
    let t = Pe();
    for (; this.ids.has(t); )
      t = Pe();
    return this.ids.set(t, !0), t;
  }
}
P.ids = /* @__PURE__ */ new Map();
function N(e) {
  return "parent" in e;
}
function Mt(e) {
  return !N(e);
}
function Ze(e) {
  const { label: t = void 0, state: r, initialArtifact: n, initialMetadata: o } = e, a = {
    annotation: [],
    bookmark: []
  }, u = Object.keys(o || {}).reduce(
    (f, s) => (f[s] = [], o && o[s] && f[s].push({
      type: s,
      id: P.get(),
      val: o[s],
      createdOn: Date.now()
    }), f),
    a
  ), l = n ? [
    {
      id: P.get(),
      createdOn: Date.now(),
      val: n
    }
  ] : [];
  return {
    id: P.get(),
    label: t || "Root",
    event: "Root",
    children: [],
    level: 0,
    createdOn: Date.now(),
    meta: u,
    artifacts: l,
    state: {
      type: "checkpoint",
      val: r
    }
  };
}
function Ve({
  parent: e,
  state: t,
  label: r,
  sideEffects: n = {
    do: [],
    undo: []
  },
  initialMetadata: o,
  initialArtifact: a,
  event: u
}) {
  const l = {
    annotation: [],
    bookmark: []
  }, f = Object.keys(o || {}).reduce(
    (i, c) => (i[c] = [], o && o[c] && i[c].push({
      type: c,
      id: P.get(),
      val: o[c],
      createdOn: Date.now()
    }), i),
    l
  ), s = a ? [
    {
      id: P.get(),
      createdOn: Date.now(),
      val: a
    }
  ] : [];
  return {
    id: P.get(),
    label: r,
    event: u,
    children: [],
    parent: e.id,
    createdOn: Date.now(),
    meta: f,
    artifacts: s,
    sideEffects: n,
    state: t,
    level: e.level + 1
  };
}
function g(e) {
  for (var t = arguments.length, r = Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++)
    r[n - 1] = arguments[n];
  if ({}.NODE_ENV !== "production") {
    var o = ct[e], a = o ? typeof o == "function" ? o.apply(null, r) : o : "unknown error nr: " + e;
    throw Error("[Immer] " + a);
  }
  throw Error("[Immer] minified error nr: " + e + (r.length ? " " + r.map(function(u) {
    return "'" + u + "'";
  }).join(",") : "") + ". Find the full error at: https://bit.ly/3cXEKWf");
}
function M(e) {
  return !!e && !!e[_];
}
function S(e) {
  var t;
  return !!e && (function(r) {
    if (!r || typeof r != "object")
      return !1;
    var n = Object.getPrototypeOf(r);
    if (n === null)
      return !0;
    var o = Object.hasOwnProperty.call(n, "constructor") && n.constructor;
    return o === Object || typeof o == "function" && Function.toString.call(o) === st;
  }(e) || Array.isArray(e) || !!e[J] || !!(!((t = e.constructor) === null || t === void 0) && t[J]) || X(e) || Z(e));
}
function C(e, t, r) {
  r === void 0 && (r = !1), R(e) === 0 ? (r ? Object.keys : Oe)(e).forEach(function(n) {
    r && typeof n == "symbol" || t(n, e[n], e);
  }) : e.forEach(function(n, o) {
    return t(o, n, e);
  });
}
function R(e) {
  var t = e[_];
  return t ? t.i > 3 ? t.i - 4 : t.i : Array.isArray(e) ? 1 : X(e) ? 2 : Z(e) ? 3 : 0;
}
function k(e, t) {
  return R(e) === 2 ? e.has(t) : Object.prototype.hasOwnProperty.call(e, t);
}
function B(e, t) {
  return R(e) === 2 ? e.get(t) : e[t];
}
function Ue(e, t, r) {
  var n = R(e);
  n === 2 ? e.set(t, r) : n === 3 ? e.add(r) : e[t] = r;
}
function et(e, t) {
  return e === t ? e !== 0 || 1 / e == 1 / t : e != e && t != t;
}
function X(e) {
  return it && e instanceof Map;
}
function Z(e) {
  return ut && e instanceof Set;
}
function I(e) {
  return e.o || e.t;
}
function ve(e) {
  if (Array.isArray(e))
    return Array.prototype.slice.call(e);
  var t = ft(e);
  delete t[_];
  for (var r = Oe(t), n = 0; n < r.length; n++) {
    var o = r[n], a = t[o];
    a.writable === !1 && (a.writable = !0, a.configurable = !0), (a.get || a.set) && (t[o] = { configurable: !0, writable: !0, enumerable: a.enumerable, value: e[o] });
  }
  return Object.create(Object.getPrototypeOf(e), t);
}
function ye(e, t) {
  return t === void 0 && (t = !1), ge(e) || M(e) || !S(e) || (R(e) > 1 && (e.set = e.add = e.clear = e.delete = tt), Object.freeze(e), t && C(e, function(r, n) {
    return ye(n, !0);
  }, !0)), e;
}
function tt() {
  g(2);
}
function ge(e) {
  return e == null || typeof e != "object" || Object.isFrozen(e);
}
function T(e) {
  var t = ce[e];
  return t || g(18, e), t;
}
function rt(e, t) {
  ce[e] || (ce[e] = t);
}
function Te() {
  return {}.NODE_ENV === "production" || x || g(0), x;
}
function te(e, t) {
  t && (T("Patches"), e.u = [], e.s = [], e.v = t);
}
function W(e) {
  ae(e), e.p.forEach(nt), e.p = null;
}
function ae(e) {
  e === x && (x = e.l);
}
function Se(e) {
  return x = { p: [], l: x, h: e, m: !0, _: 0 };
}
function nt(e) {
  var t = e[_];
  t.i === 0 || t.i === 1 ? t.j() : t.g = !0;
}
function re(e, t) {
  t._ = t.p.length;
  var r = t.p[0], n = e !== void 0 && e !== r;
  return t.h.O || T("ES5").S(t, e, n), n ? (r[_].P && (W(t), g(4)), S(e) && (e = Q(t, e), t.l || G(t, e)), t.u && T("Patches").M(r[_].t, e, t.u, t.s)) : e = Q(t, r, []), W(t), t.u && t.v(t.u, t.s), e !== we ? e : void 0;
}
function Q(e, t, r) {
  if (ge(t))
    return t;
  var n = t[_];
  if (!n)
    return C(t, function(l, f) {
      return Re(e, n, t, l, f, r);
    }, !0), t;
  if (n.A !== e)
    return t;
  if (!n.P)
    return G(e, n.t, !0), n.t;
  if (!n.I) {
    n.I = !0, n.A._--;
    var o = n.i === 4 || n.i === 5 ? n.o = ve(n.k) : n.o, a = o, u = !1;
    n.i === 3 && (a = new Set(o), o.clear(), u = !0), C(a, function(l, f) {
      return Re(e, n, o, l, f, r, u);
    }), G(e, o, !1), r && e.u && T("Patches").N(n, r, e.u, e.s);
  }
  return n.o;
}
function Re(e, t, r, n, o, a, u) {
  if ({}.NODE_ENV !== "production" && o === r && g(5), M(o)) {
    var l = Q(e, o, a && t && t.i !== 3 && !k(t.R, n) ? a.concat(n) : void 0);
    if (Ue(r, n, l), !M(l))
      return;
    e.m = !1;
  } else
    u && r.add(o);
  if (S(o) && !ge(o)) {
    if (!e.h.D && e._ < 1)
      return;
    Q(e, o), t && t.A.l || G(e, o);
  }
}
function G(e, t, r) {
  r === void 0 && (r = !1), !e.l && e.h.D && e.m && ye(t, r);
}
function ne(e, t) {
  var r = e[_];
  return (r ? I(r) : e)[t];
}
function De(e, t) {
  if (t in e)
    for (var r = Object.getPrototypeOf(e); r; ) {
      var n = Object.getOwnPropertyDescriptor(r, t);
      if (n)
        return n;
      r = Object.getPrototypeOf(r);
    }
}
function ie(e) {
  e.P || (e.P = !0, e.l && ie(e.l));
}
function oe(e) {
  e.o || (e.o = ve(e.t));
}
function ue(e, t, r) {
  var n = X(t) ? T("MapSet").F(t, r) : Z(t) ? T("MapSet").T(t, r) : e.O ? function(o, a) {
    var u = Array.isArray(o), l = { i: u ? 1 : 0, A: a ? a.A : Te(), P: !1, I: !1, R: {}, l: a, t: o, k: null, o: null, j: null, C: !1 }, f = l, s = se;
    u && (f = [l], s = F);
    var i = Proxy.revocable(f, s), c = i.revoke, d = i.proxy;
    return l.k = d, l.j = c, d;
  }(t, r) : T("ES5").J(t, r);
  return (r ? r.A : Te()).p.push(n), n;
}
function ot(e) {
  return M(e) || g(22, e), function t(r) {
    if (!S(r))
      return r;
    var n, o = r[_], a = R(r);
    if (o) {
      if (!o.P && (o.i < 4 || !T("ES5").K(o)))
        return o.t;
      o.I = !0, n = Ie(r, a), o.I = !1;
    } else
      n = Ie(r, a);
    return C(n, function(u, l) {
      o && B(o.t, u) === l || Ue(n, u, t(l));
    }), a === 3 ? new Set(n) : n;
  }(e);
}
function Ie(e, t) {
  switch (t) {
    case 2:
      return new Map(e);
    case 3:
      return Array.from(e);
  }
  return ve(e);
}
function at() {
  function e(n) {
    if (!S(n))
      return n;
    if (Array.isArray(n))
      return n.map(e);
    if (X(n))
      return new Map(Array.from(n.entries()).map(function(u) {
        return [u[0], e(u[1])];
      }));
    if (Z(n))
      return new Set(Array.from(n).map(e));
    var o = Object.create(Object.getPrototypeOf(n));
    for (var a in n)
      o[a] = e(n[a]);
    return k(n, J) && (o[J] = n[J]), o;
  }
  function t(n) {
    return M(n) ? e(n) : n;
  }
  var r = "add";
  rt("Patches", { $: function(n, o) {
    return o.forEach(function(a) {
      for (var u = a.path, l = a.op, f = n, s = 0; s < u.length - 1; s++) {
        var i = R(f), c = u[s];
        typeof c != "string" && typeof c != "number" && (c = "" + c), i !== 0 && i !== 1 || c !== "__proto__" && c !== "constructor" || g(24), typeof f == "function" && c === "prototype" && g(24), typeof (f = B(f, c)) != "object" && g(15, u.join("/"));
      }
      var d = R(f), p = e(a.value), h = u[u.length - 1];
      switch (l) {
        case "replace":
          switch (d) {
            case 2:
              return f.set(h, p);
            case 3:
              g(16);
            default:
              return f[h] = p;
          }
        case r:
          switch (d) {
            case 1:
              return h === "-" ? f.push(p) : f.splice(h, 0, p);
            case 2:
              return f.set(h, p);
            case 3:
              return f.add(p);
            default:
              return f[h] = p;
          }
        case "remove":
          switch (d) {
            case 1:
              return f.splice(h, 1);
            case 2:
              return f.delete(h);
            case 3:
              return f.delete(a.value);
            default:
              return delete f[h];
          }
        default:
          g(17, l);
      }
    }), n;
  }, N: function(n, o, a, u) {
    switch (n.i) {
      case 0:
      case 4:
      case 2:
        return function(l, f, s, i) {
          var c = l.t, d = l.o;
          C(l.R, function(p, h) {
            var v = B(c, p), m = B(d, p), A = h ? k(c, p) ? "replace" : r : "remove";
            if (v !== m || A !== "replace") {
              var O = f.concat(p);
              s.push(A === "remove" ? { op: A, path: O } : { op: A, path: O, value: m }), i.push(A === r ? { op: "remove", path: O } : A === "remove" ? { op: r, path: O, value: t(v) } : { op: "replace", path: O, value: t(v) });
            }
          });
        }(n, o, a, u);
      case 5:
      case 1:
        return function(l, f, s, i) {
          var c = l.t, d = l.R, p = l.o;
          if (p.length < c.length) {
            var h = [p, c];
            c = h[0], p = h[1];
            var v = [i, s];
            s = v[0], i = v[1];
          }
          for (var m = 0; m < c.length; m++)
            if (d[m] && p[m] !== c[m]) {
              var A = f.concat([m]);
              s.push({ op: "replace", path: A, value: t(p[m]) }), i.push({ op: "replace", path: A, value: t(c[m]) });
            }
          for (var O = c.length; O < p.length; O++) {
            var D = f.concat([O]);
            s.push({ op: r, path: D, value: t(p[O]) });
          }
          c.length < p.length && i.push({ op: "replace", path: f.concat(["length"]), value: c.length });
        }(n, o, a, u);
      case 3:
        return function(l, f, s, i) {
          var c = l.t, d = l.o, p = 0;
          c.forEach(function(h) {
            if (!d.has(h)) {
              var v = f.concat([p]);
              s.push({ op: "remove", path: v, value: h }), i.unshift({ op: r, path: v, value: h });
            }
            p++;
          }), p = 0, d.forEach(function(h) {
            if (!c.has(h)) {
              var v = f.concat([p]);
              s.push({ op: r, path: v, value: h }), i.unshift({ op: "remove", path: v, value: h });
            }
            p++;
          });
        }(n, o, a, u);
    }
  }, M: function(n, o, a, u) {
    a.push({ op: "replace", path: [], value: o === we ? void 0 : o }), u.push({ op: "replace", path: [], value: n });
  } });
}
var Le, x, me = typeof Symbol < "u" && typeof Symbol("x") == "symbol", it = typeof Map < "u", ut = typeof Set < "u", je = typeof Proxy < "u" && Proxy.revocable !== void 0 && typeof Reflect < "u", we = me ? Symbol.for("immer-nothing") : ((Le = {})["immer-nothing"] = !0, Le), J = me ? Symbol.for("immer-draftable") : "__$immer_draftable", _ = me ? Symbol.for("immer-state") : "__$immer_state", ct = { 0: "Illegal state", 1: "Immer drafts cannot have computed properties", 2: "This object has been frozen and should not be mutated", 3: function(e) {
  return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + e;
}, 4: "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.", 5: "Immer forbids circular references", 6: "The first or second argument to `produce` must be a function", 7: "The third argument to `produce` must be a function or undefined", 8: "First argument to `createDraft` must be a plain object, an array, or an immerable object", 9: "First argument to `finishDraft` must be a draft returned by `createDraft`", 10: "The given draft is already finalized", 11: "Object.defineProperty() cannot be used on an Immer draft", 12: "Object.setPrototypeOf() cannot be used on an Immer draft", 13: "Immer only supports deleting array indices", 14: "Immer only supports setting array indices and the 'length' property", 15: function(e) {
  return "Cannot apply patch, path doesn't resolve: " + e;
}, 16: 'Sets cannot have "replace" patches.', 17: function(e) {
  return "Unsupported patch operation: " + e;
}, 18: function(e) {
  return "The plugin for '" + e + "' has not been loaded into Immer. To enable the plugin, import and call `enable" + e + "()` when initializing your application.";
}, 20: "Cannot use proxies if Proxy, Proxy.revocable or Reflect are not available", 21: function(e) {
  return "produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '" + e + "'";
}, 22: function(e) {
  return "'current' expects a draft, got: " + e;
}, 23: function(e) {
  return "'original' expects a draft, got: " + e;
}, 24: "Patching reserved attributes like __proto__, prototype and constructor is not allowed" }, st = "" + Object.prototype.constructor, Oe = typeof Reflect < "u" && Reflect.ownKeys ? Reflect.ownKeys : Object.getOwnPropertySymbols !== void 0 ? function(e) {
  return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
} : Object.getOwnPropertyNames, ft = Object.getOwnPropertyDescriptors || function(e) {
  var t = {};
  return Oe(e).forEach(function(r) {
    t[r] = Object.getOwnPropertyDescriptor(e, r);
  }), t;
}, ce = {}, se = { get: function(e, t) {
  if (t === _)
    return e;
  var r = I(e);
  if (!k(r, t))
    return function(o, a, u) {
      var l, f = De(a, u);
      return f ? "value" in f ? f.value : (l = f.get) === null || l === void 0 ? void 0 : l.call(o.k) : void 0;
    }(e, r, t);
  var n = r[t];
  return e.I || !S(n) ? n : n === ne(e.t, t) ? (oe(e), e.o[t] = ue(e.A.h, n, e)) : n;
}, has: function(e, t) {
  return t in I(e);
}, ownKeys: function(e) {
  return Reflect.ownKeys(I(e));
}, set: function(e, t, r) {
  var n = De(I(e), t);
  if (n != null && n.set)
    return n.set.call(e.k, r), !0;
  if (!e.P) {
    var o = ne(I(e), t), a = o == null ? void 0 : o[_];
    if (a && a.t === r)
      return e.o[t] = r, e.R[t] = !1, !0;
    if (et(r, o) && (r !== void 0 || k(e.t, t)))
      return !0;
    oe(e), ie(e);
  }
  return e.o[t] === r && (r !== void 0 || t in e.o) || Number.isNaN(r) && Number.isNaN(e.o[t]) || (e.o[t] = r, e.R[t] = !0), !0;
}, deleteProperty: function(e, t) {
  return ne(e.t, t) !== void 0 || t in e.t ? (e.R[t] = !1, oe(e), ie(e)) : delete e.R[t], e.o && delete e.o[t], !0;
}, getOwnPropertyDescriptor: function(e, t) {
  var r = I(e), n = Reflect.getOwnPropertyDescriptor(r, t);
  return n && { writable: !0, configurable: e.i !== 1 || t !== "length", enumerable: n.enumerable, value: r[t] };
}, defineProperty: function() {
  g(11);
}, getPrototypeOf: function(e) {
  return Object.getPrototypeOf(e.t);
}, setPrototypeOf: function() {
  g(12);
} }, F = {};
C(se, function(e, t) {
  F[e] = function() {
    return arguments[0] = arguments[0][0], t.apply(this, arguments);
  };
}), F.deleteProperty = function(e, t) {
  return {}.NODE_ENV !== "production" && isNaN(parseInt(t)) && g(13), F.set.call(this, e, t, void 0);
}, F.set = function(e, t, r) {
  return {}.NODE_ENV !== "production" && t !== "length" && isNaN(parseInt(t)) && g(14), se.set.call(this, e[0], t, r, e[0]);
};
var lt = function() {
  function e(r) {
    var n = this;
    this.O = je, this.D = !0, this.produce = function(o, a, u) {
      if (typeof o == "function" && typeof a != "function") {
        var l = a;
        a = o;
        var f = n;
        return function(v) {
          var m = this;
          v === void 0 && (v = l);
          for (var A = arguments.length, O = Array(A > 1 ? A - 1 : 0), D = 1; D < A; D++)
            O[D - 1] = arguments[D];
          return f.produce(v, function(ee) {
            var _e;
            return (_e = a).call.apply(_e, [m, ee].concat(O));
          });
        };
      }
      var s;
      if (typeof a != "function" && g(6), u !== void 0 && typeof u != "function" && g(7), S(o)) {
        var i = Se(n), c = ue(n, o, void 0), d = !0;
        try {
          s = a(c), d = !1;
        } finally {
          d ? W(i) : ae(i);
        }
        return typeof Promise < "u" && s instanceof Promise ? s.then(function(v) {
          return te(i, u), re(v, i);
        }, function(v) {
          throw W(i), v;
        }) : (te(i, u), re(s, i));
      }
      if (!o || typeof o != "object") {
        if ((s = a(o)) === void 0 && (s = o), s === we && (s = void 0), n.D && ye(s, !0), u) {
          var p = [], h = [];
          T("Patches").M(o, s, p, h), u(p, h);
        }
        return s;
      }
      g(21, o);
    }, this.produceWithPatches = function(o, a) {
      if (typeof o == "function")
        return function(s) {
          for (var i = arguments.length, c = Array(i > 1 ? i - 1 : 0), d = 1; d < i; d++)
            c[d - 1] = arguments[d];
          return n.produceWithPatches(s, function(p) {
            return o.apply(void 0, [p].concat(c));
          });
        };
      var u, l, f = n.produce(o, a, function(s, i) {
        u = s, l = i;
      });
      return typeof Promise < "u" && f instanceof Promise ? f.then(function(s) {
        return [s, u, l];
      }) : [f, u, l];
    }, typeof (r == null ? void 0 : r.useProxies) == "boolean" && this.setUseProxies(r.useProxies), typeof (r == null ? void 0 : r.autoFreeze) == "boolean" && this.setAutoFreeze(r.autoFreeze);
  }
  var t = e.prototype;
  return t.createDraft = function(r) {
    S(r) || g(8), M(r) && (r = ot(r));
    var n = Se(this), o = ue(this, r, void 0);
    return o[_].C = !0, ae(n), o;
  }, t.finishDraft = function(r, n) {
    var o = r && r[_];
    ({}).NODE_ENV !== "production" && (o && o.C || g(9), o.I && g(10));
    var a = o.A;
    return te(a, n), re(void 0, a);
  }, t.setAutoFreeze = function(r) {
    this.D = r;
  }, t.setUseProxies = function(r) {
    r && !je && g(20), this.O = r;
  }, t.applyPatches = function(r, n) {
    var o;
    for (o = n.length - 1; o >= 0; o--) {
      var a = n[o];
      if (a.path.length === 0 && a.op === "replace") {
        r = a.value;
        break;
      }
    }
    o > -1 && (n = n.slice(o + 1));
    var u = T("Patches").$;
    return M(r) ? u(r, n) : this.produce(r, function(l) {
      return u(l, n);
    });
  }, e;
}(), b = new lt(), pt = b.produce;
b.produceWithPatches.bind(b);
b.setAutoFreeze.bind(b);
b.setUseProxies.bind(b);
b.applyPatches.bind(b);
b.createDraft.bind(b);
b.finishDraft.bind(b);
function dt(e, t = {}) {
  const {
    artifact: r = void 0,
    metadata: n = void 0,
    rootLabel: o = "Root"
  } = t, a = Ze({
    state: e,
    label: o,
    initialArtifact: r,
    initialMetadata: n
  }), u = {
    nodes: {
      [a.id]: a
    },
    root: a.id,
    current: a.id
  };
  return He({
    name: "provenance-graph",
    initialState: u,
    reducers: {
      addMetadata(f, s) {
        const { id: i, meta: c } = s.payload, d = f.nodes[i].meta, p = Object.keys(c).reduce((h, v) => (h[v] || (h[v] = []), h[v].push({
          type: v,
          id: P.get(),
          val: c[v],
          createdOn: Date.now()
        }), h), d);
        f.nodes[s.payload.id].meta = p;
      },
      addArtifact(f, s) {
        f.nodes[s.payload.id].artifacts.push({
          id: P.get(),
          createdOn: Date.now(),
          val: s.payload.artifact
        });
      },
      changeCurrent(f, s) {
        f.current = s.payload;
      },
      addNode(f, { payload: s }) {
        f.nodes[s.id] = s, f.nodes[s.parent].children.push(s.id), f.current = s.id;
      },
      load(f, { payload: s }) {
        return s;
      }
    }
  });
}
function ht(e) {
  const t = /* @__PURE__ */ new Map(), { reducer: r, actions: n, getInitialState: o } = dt(e), a = Be();
  a.startListening({
    matcher: be(n.changeCurrent, n.addNode),
    effect: (l, f) => {
      f.cancelActiveListeners(), t.forEach((s) => {
        const i = be(n.addNode)(l), { skipOnNew: c } = s.config;
        c && i || s.func(i ? "new" : "traversal");
      });
    }
  });
  const u = $e({
    reducer: r,
    middleware: (l) => l().prepend(a.middleware)
  });
  return {
    initialState: o(),
    get backend() {
      return u.getState();
    },
    get current() {
      return u.getState().nodes[u.getState().current];
    },
    get root() {
      return u.getState().nodes[u.getState().root];
    },
    currentChange(l, f) {
      const s = {
        id: P.get(),
        func: l,
        config: f
      };
      return t.set(s.id, s), () => t.delete(s.id);
    },
    update: u.dispatch,
    ...n
  };
}
/*!
 * https://github.com/Starcounter-Jack/JSON-Patch
 * (c) 2017-2022 Joachim Wester
 * MIT licensed
 */
var vt = globalThis && globalThis.__extends || function() {
  var e = function(t, r) {
    return e = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var a in o)
        o.hasOwnProperty(a) && (n[a] = o[a]);
    }, e(t, r);
  };
  return function(t, r) {
    e(t, r);
    function n() {
      this.constructor = t;
    }
    t.prototype = r === null ? Object.create(r) : (n.prototype = r.prototype, new n());
  };
}(), yt = Object.prototype.hasOwnProperty;
function fe(e, t) {
  return yt.call(e, t);
}
function le(e) {
  if (Array.isArray(e)) {
    for (var t = new Array(e.length), r = 0; r < t.length; r++)
      t[r] = "" + r;
    return t;
  }
  if (Object.keys)
    return Object.keys(e);
  var n = [];
  for (var o in e)
    fe(e, o) && n.push(o);
  return n;
}
function E(e) {
  switch (typeof e) {
    case "object":
      return JSON.parse(JSON.stringify(e));
    case "undefined":
      return null;
    default:
      return e;
  }
}
function pe(e) {
  for (var t = 0, r = e.length, n; t < r; ) {
    if (n = e.charCodeAt(t), n >= 48 && n <= 57) {
      t++;
      continue;
    }
    return !1;
  }
  return !0;
}
function L(e) {
  return e.indexOf("/") === -1 && e.indexOf("~") === -1 ? e : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
function Ce(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
function de(e) {
  if (e === void 0)
    return !0;
  if (e) {
    if (Array.isArray(e)) {
      for (var t = 0, r = e.length; t < r; t++)
        if (de(e[t]))
          return !0;
    } else if (typeof e == "object") {
      for (var n = le(e), o = n.length, a = 0; a < o; a++)
        if (de(e[n[a]]))
          return !0;
    }
  }
  return !1;
}
function Me(e, t) {
  var r = [e];
  for (var n in t) {
    var o = typeof t[n] == "object" ? JSON.stringify(t[n], null, 2) : t[n];
    typeof o < "u" && r.push(n + ": " + o);
  }
  return r.join(`
`);
}
var xe = (
  /** @class */
  function(e) {
    vt(t, e);
    function t(r, n, o, a, u) {
      var l = this.constructor, f = e.call(this, Me(r, { name: n, index: o, operation: a, tree: u })) || this;
      return f.name = n, f.index = o, f.operation = a, f.tree = u, Object.setPrototypeOf(f, l.prototype), f.message = Me(r, { name: n, index: o, operation: a, tree: u }), f;
    }
    return t;
  }(Error)
), y = xe, gt = E, U = {
  add: function(e, t, r) {
    return e[t] = this.value, { newDocument: r };
  },
  remove: function(e, t, r) {
    var n = e[t];
    return delete e[t], { newDocument: r, removed: n };
  },
  replace: function(e, t, r) {
    var n = e[t];
    return e[t] = this.value, { newDocument: r, removed: n };
  },
  move: function(e, t, r) {
    var n = Y(r, this.path);
    n && (n = E(n));
    var o = j(r, { op: "remove", path: this.from }).removed;
    return j(r, { op: "add", path: this.path, value: o }), { newDocument: r, removed: n };
  },
  copy: function(e, t, r) {
    var n = Y(r, this.from);
    return j(r, { op: "add", path: this.path, value: E(n) }), { newDocument: r };
  },
  test: function(e, t, r) {
    return { newDocument: r, test: K(e[t], this.value) };
  },
  _get: function(e, t, r) {
    return this.value = e[t], { newDocument: r };
  }
}, mt = {
  add: function(e, t, r) {
    return pe(t) ? e.splice(t, 0, this.value) : e[t] = this.value, { newDocument: r, index: t };
  },
  remove: function(e, t, r) {
    var n = e.splice(t, 1);
    return { newDocument: r, removed: n[0] };
  },
  replace: function(e, t, r) {
    var n = e[t];
    return e[t] = this.value, { newDocument: r, removed: n };
  },
  move: U.move,
  copy: U.copy,
  test: U.test,
  _get: U._get
};
function Y(e, t) {
  if (t == "")
    return e;
  var r = { op: "_get", path: t };
  return j(e, r), r.value;
}
function j(e, t, r, n, o, a) {
  if (r === void 0 && (r = !1), n === void 0 && (n = !0), o === void 0 && (o = !0), a === void 0 && (a = 0), r && (typeof r == "function" ? r(t, 0, e, t.path) : q(t, 0)), t.path === "") {
    var u = { newDocument: e };
    if (t.op === "add")
      return u.newDocument = t.value, u;
    if (t.op === "replace")
      return u.newDocument = t.value, u.removed = e, u;
    if (t.op === "move" || t.op === "copy")
      return u.newDocument = Y(e, t.from), t.op === "move" && (u.removed = e), u;
    if (t.op === "test") {
      if (u.test = K(e, t.value), u.test === !1)
        throw new y("Test operation failed", "TEST_OPERATION_FAILED", a, t, e);
      return u.newDocument = e, u;
    } else {
      if (t.op === "remove")
        return u.removed = e, u.newDocument = null, u;
      if (t.op === "_get")
        return t.value = e, u;
      if (r)
        throw new y("Operation `op` property is not one of operations defined in RFC-6902", "OPERATION_OP_INVALID", a, t, e);
      return u;
    }
  } else {
    n || (e = E(e));
    var l = t.path || "", f = l.split("/"), s = e, i = 1, c = f.length, d = void 0, p = void 0, h = void 0;
    for (typeof r == "function" ? h = r : h = q; ; ) {
      if (p = f[i], p && p.indexOf("~") != -1 && (p = Ce(p)), o && (p == "__proto__" || p == "prototype" && i > 0 && f[i - 1] == "constructor"))
        throw new TypeError("JSON-Patch: modifying `__proto__` or `constructor/prototype` prop is banned for security reasons, if this was on purpose, please set `banPrototypeModifications` flag false and pass it to this function. More info in fast-json-patch README");
      if (r && d === void 0 && (s[p] === void 0 ? d = f.slice(0, i).join("/") : i == c - 1 && (d = t.path), d !== void 0 && h(t, 0, e, d)), i++, Array.isArray(s)) {
        if (p === "-")
          p = s.length;
        else {
          if (r && !pe(p))
            throw new y("Expected an unsigned base-10 integer value, making the new referenced value the array element with the zero-based index", "OPERATION_PATH_ILLEGAL_ARRAY_INDEX", a, t, e);
          pe(p) && (p = ~~p);
        }
        if (i >= c) {
          if (r && t.op === "add" && p > s.length)
            throw new y("The specified index MUST NOT be greater than the number of elements in the array", "OPERATION_VALUE_OUT_OF_BOUNDS", a, t, e);
          var u = mt[t.op].call(t, s, p, e);
          if (u.test === !1)
            throw new y("Test operation failed", "TEST_OPERATION_FAILED", a, t, e);
          return u;
        }
      } else if (i >= c) {
        var u = U[t.op].call(t, s, p, e);
        if (u.test === !1)
          throw new y("Test operation failed", "TEST_OPERATION_FAILED", a, t, e);
        return u;
      }
      if (s = s[p], r && i < c && (!s || typeof s != "object"))
        throw new y("Cannot perform operation at the desired path", "OPERATION_PATH_UNRESOLVABLE", a, t, e);
    }
  }
}
function V(e, t, r, n, o) {
  if (n === void 0 && (n = !0), o === void 0 && (o = !0), r && !Array.isArray(t))
    throw new y("Patch sequence must be an array", "SEQUENCE_NOT_AN_ARRAY");
  n || (e = E(e));
  for (var a = new Array(t.length), u = 0, l = t.length; u < l; u++)
    a[u] = j(e, t[u], r, !0, o, u), e = a[u].newDocument;
  return a.newDocument = e, a;
}
function wt(e, t, r) {
  var n = j(e, t);
  if (n.test === !1)
    throw new y("Test operation failed", "TEST_OPERATION_FAILED", r, t, e);
  return n.newDocument;
}
function q(e, t, r, n) {
  if (typeof e != "object" || e === null || Array.isArray(e))
    throw new y("Operation is not an object", "OPERATION_NOT_AN_OBJECT", t, e, r);
  if (U[e.op]) {
    if (typeof e.path != "string")
      throw new y("Operation `path` property is not a string", "OPERATION_PATH_INVALID", t, e, r);
    if (e.path.indexOf("/") !== 0 && e.path.length > 0)
      throw new y('Operation `path` property must start with "/"', "OPERATION_PATH_INVALID", t, e, r);
    if ((e.op === "move" || e.op === "copy") && typeof e.from != "string")
      throw new y("Operation `from` property is not present (applicable in `move` and `copy` operations)", "OPERATION_FROM_REQUIRED", t, e, r);
    if ((e.op === "add" || e.op === "replace" || e.op === "test") && e.value === void 0)
      throw new y("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)", "OPERATION_VALUE_REQUIRED", t, e, r);
    if ((e.op === "add" || e.op === "replace" || e.op === "test") && de(e.value))
      throw new y("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)", "OPERATION_VALUE_CANNOT_CONTAIN_UNDEFINED", t, e, r);
    if (r) {
      if (e.op == "add") {
        var o = e.path.split("/").length, a = n.split("/").length;
        if (o !== a + 1 && o !== a)
          throw new y("Cannot perform an `add` operation at the desired path", "OPERATION_PATH_CANNOT_ADD", t, e, r);
      } else if (e.op === "replace" || e.op === "remove" || e.op === "_get") {
        if (e.path !== n)
          throw new y("Cannot perform the operation at a path that does not exist", "OPERATION_PATH_UNRESOLVABLE", t, e, r);
      } else if (e.op === "move" || e.op === "copy") {
        var u = { op: "_get", path: e.from, value: void 0 }, l = Fe([u], r);
        if (l && l.name === "OPERATION_PATH_UNRESOLVABLE")
          throw new y("Cannot perform the operation from a path that does not exist", "OPERATION_FROM_UNRESOLVABLE", t, e, r);
      }
    }
  } else
    throw new y("Operation `op` property is not one of operations defined in RFC-6902", "OPERATION_OP_INVALID", t, e, r);
}
function Fe(e, t, r) {
  try {
    if (!Array.isArray(e))
      throw new y("Patch sequence must be an array", "SEQUENCE_NOT_AN_ARRAY");
    if (t)
      V(E(t), E(e), r || !0);
    else {
      r = r || q;
      for (var n = 0; n < e.length; n++)
        r(e[n], n, t, void 0);
    }
  } catch (o) {
    if (o instanceof y)
      return o;
    throw o;
  }
}
function K(e, t) {
  if (e === t)
    return !0;
  if (e && t && typeof e == "object" && typeof t == "object") {
    var r = Array.isArray(e), n = Array.isArray(t), o, a, u;
    if (r && n) {
      if (a = e.length, a != t.length)
        return !1;
      for (o = a; o-- !== 0; )
        if (!K(e[o], t[o]))
          return !1;
      return !0;
    }
    if (r != n)
      return !1;
    var l = Object.keys(e);
    if (a = l.length, a !== Object.keys(t).length)
      return !1;
    for (o = a; o-- !== 0; )
      if (!t.hasOwnProperty(l[o]))
        return !1;
    for (o = a; o-- !== 0; )
      if (u = l[o], !K(e[u], t[u]))
        return !1;
    return !0;
  }
  return e !== e && t !== t;
}
const Ot = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  JsonPatchError: y,
  _areEquals: K,
  applyOperation: j,
  applyPatch: V,
  applyReducer: wt,
  deepClone: gt,
  getValueByPointer: Y,
  validate: Fe,
  validator: q
}, Symbol.toStringTag, { value: "Module" }));
/*!
 * https://github.com/Starcounter-Jack/JSON-Patch
 * (c) 2017-2021 Joachim Wester
 * MIT license
 */
var Ae = /* @__PURE__ */ new WeakMap(), At = (
  /** @class */
  function() {
    function e(t) {
      this.observers = /* @__PURE__ */ new Map(), this.obj = t;
    }
    return e;
  }()
), Et = (
  /** @class */
  function() {
    function e(t, r) {
      this.callback = t, this.observer = r;
    }
    return e;
  }()
);
function _t(e) {
  return Ae.get(e);
}
function bt(e, t) {
  return e.observers.get(t);
}
function Nt(e, t) {
  e.observers.delete(t.callback);
}
function Pt(e, t) {
  t.unobserve();
}
function Tt(e, t) {
  var r = [], n, o = _t(e);
  if (!o)
    o = new At(e), Ae.set(e, o);
  else {
    var a = bt(o, t);
    n = a && a.observer;
  }
  if (n)
    return n;
  if (n = {}, o.value = E(e), t) {
    n.callback = t, n.next = null;
    var u = function() {
      he(n);
    }, l = function() {
      clearTimeout(n.next), n.next = setTimeout(u);
    };
    typeof window < "u" && (window.addEventListener("mouseup", l), window.addEventListener("keyup", l), window.addEventListener("mousedown", l), window.addEventListener("keydown", l), window.addEventListener("change", l));
  }
  return n.patches = r, n.object = e, n.unobserve = function() {
    he(n), clearTimeout(n.next), Nt(o, n), typeof window < "u" && (window.removeEventListener("mouseup", l), window.removeEventListener("keyup", l), window.removeEventListener("mousedown", l), window.removeEventListener("keydown", l), window.removeEventListener("change", l));
  }, o.observers.set(t, new Et(t, n)), n;
}
function he(e, t) {
  t === void 0 && (t = !1);
  var r = Ae.get(e.object);
  Ee(r.value, e.object, e.patches, "", t), e.patches.length && V(r.value, e.patches);
  var n = e.patches;
  return n.length > 0 && (e.patches = [], e.callback && e.callback(n)), n;
}
function Ee(e, t, r, n, o) {
  if (t !== e) {
    typeof t.toJSON == "function" && (t = t.toJSON());
    for (var a = le(t), u = le(e), l = !1, f = u.length - 1; f >= 0; f--) {
      var s = u[f], i = e[s];
      if (fe(t, s) && !(t[s] === void 0 && i !== void 0 && Array.isArray(t) === !1)) {
        var c = t[s];
        typeof i == "object" && i != null && typeof c == "object" && c != null && Array.isArray(i) === Array.isArray(c) ? Ee(i, c, r, n + "/" + L(s), o) : i !== c && (o && r.push({ op: "test", path: n + "/" + L(s), value: E(i) }), r.push({ op: "replace", path: n + "/" + L(s), value: E(c) }));
      } else
        Array.isArray(e) === Array.isArray(t) ? (o && r.push({ op: "test", path: n + "/" + L(s), value: E(i) }), r.push({ op: "remove", path: n + "/" + L(s) }), l = !0) : (o && r.push({ op: "test", path: n, value: e }), r.push({ op: "replace", path: n, value: t }));
    }
    if (!(!l && a.length == u.length))
      for (var f = 0; f < a.length; f++) {
        var s = a[f];
        !fe(e, s) && t[s] !== void 0 && r.push({ op: "add", path: n + "/" + L(s), value: E(t[s]) });
      }
  }
}
function ze(e, t, r) {
  r === void 0 && (r = !1);
  var n = [];
  return Ee(e, t, n, "", r), n;
}
const St = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  compare: ze,
  generate: he,
  observe: Tt,
  unobserve: Pt
}, Symbol.toStringTag, { value: "Module" }));
Object.assign({}, Ot, St, {
  JsonPatchError: xe,
  deepClone: E,
  escapePathComponent: L,
  unescapePathComponent: Ce
});
var z = /* @__PURE__ */ ((e) => (e.TRAVERSAL_START = "Traversal_Start", e.TRAVERSAL_END = "Traversal_End", e))(z || {});
function $(e, t) {
  const r = e.state;
  if (r.type === "checkpoint")
    return r.val;
  const { checkpointRef: n } = r, o = t[n], a = Je(o, e, t);
  a.shift();
  const u = a.map((s) => t[s]).map((s) => s.state.val).reduce((s, i) => [...s, ...i], []), l = $(o, t);
  return V(
    l,
    E(u),
    !0,
    !1
  ).newDocument;
}
function Rt(e, t) {
  const r = Object.keys(e).length;
  return new Set(
    t.map((o) => o.path.split("/")[0])
  ).size < r / 2 ? "patch" : "checkpoint";
}
function Ut({
  registry: e,
  initialState: t
}) {
  let r = !1;
  const n = Qe(), o = ht(t);
  function a(i) {
    return o.backend.nodes[i];
  }
  n.listen(z.TRAVERSAL_START, () => {
    r = !0;
  }), n.listen(z.TRAVERSAL_END, () => {
    r = !1;
  });
  const u = {
    add(i, c = o.current.id) {
      o.update(
        o.addMetadata({
          id: c,
          meta: i
        })
      );
    },
    latestOfType(i, c = o.current.id) {
      var d;
      return (d = o.backend.nodes[c].meta[i]) == null ? void 0 : d.at(-1);
    },
    allOfType(i, c = o.current.id) {
      return o.backend.nodes[c].meta[i];
    },
    latest(i = o.current.id) {
      const c = o.backend.nodes[i].meta, d = Object.keys(c).reduce(
        (p, h) => {
          const v = c[h].at(-1);
          return v && (p[h] = v), p;
        },
        {}
      );
      return Object.keys(d).length > 0 ? d : void 0;
    },
    all(i = o.current.id) {
      return o.backend.nodes[i].meta;
    },
    types(i = o.current.id) {
      return Object.keys(o.backend.nodes[i].meta);
    }
  }, l = {
    add(i, c = o.current.id) {
      o.update(
        o.addArtifact({
          id: c,
          artifact: i
        })
      );
    },
    latest(i = o.current.id) {
      return o.backend.nodes[i].artifacts.at(-1);
    },
    all(i = o.current.id) {
      return o.backend.nodes[i].artifacts;
    }
  }, f = {
    add(i, c = o.current.id) {
      u.add({ annotation: i }, c);
    },
    latest(i = o.current.id) {
      var c;
      return (c = u.latestOfType("annotation", i)) == null ? void 0 : c.val;
    },
    all(i = o.current.id) {
      var c;
      return (c = u.allOfType("annotation", i)) == null ? void 0 : c.map((d) => d.val);
    }
  }, s = {
    add(i = o.current.id) {
      u.add({ bookmark: !0 }, i);
    },
    remove(i = o.current.id) {
      u.add({ bookmark: !1 }, i);
    },
    is(i = o.current.id) {
      var c;
      return !!((c = u.latestOfType("bookmark", i)) != null && c.val);
    },
    toggle(i = o.current.id) {
      s.is(i) ? s.remove(i) : s.add(i);
    }
  };
  return {
    registry: e,
    get isTraversing() {
      return r;
    },
    getState(i = o.current) {
      return $(i, o.backend.nodes);
    },
    graph: o,
    get current() {
      return o.current;
    },
    get root() {
      return o.root;
    },
    record({
      label: i,
      state: c,
      sideEffects: d,
      eventType: p,
      onlySideEffects: h = !1
    }) {
      let v = null, m = null;
      const A = $(
        this.current,
        this.graph.backend.nodes
      );
      if (h)
        m = {
          type: "checkpoint",
          val: c
        };
      else {
        const O = ze(A, c);
        if (Rt(c, O) === "checkpoint")
          m = {
            type: "checkpoint",
            val: c
          };
        else {
          const ee = this.current.state.type === "checkpoint" ? this.current.id : this.current.state.checkpointRef;
          m = {
            type: "patch",
            val: O,
            checkpointRef: ee
          };
        }
      }
      if (!m)
        throw new Error(
          `Could not calculate new state. Previous state is: ${JSON.stringify(
            this.current.state,
            null,
            2
          )}`
        );
      if (v = Ve({
        label: i,
        state: m,
        parent: this.current,
        sideEffects: d,
        event: p
      }), !v)
        throw new Error("State Node creation failed!");
      o.update(o.addNode(v));
    },
    async apply(i, c) {
      const d = e.get(c.type), p = $(
        this.current,
        this.graph.backend.nodes
      );
      if (d.config.hasSideEffects) {
        const { do: h = c, undo: v } = d.func(c.payload);
        this.record({
          label: i,
          state: p,
          sideEffects: { do: [h], undo: [v] },
          eventType: d.config.eventType
        });
      } else {
        const h = d.func(p, c.payload);
        this.record({
          label: i,
          state: h,
          sideEffects: { do: [], undo: [] },
          eventType: d.config.eventType
        });
      }
    },
    async to(i) {
      n.fire(z.TRAVERSAL_START);
      const c = Je(
        o.current,
        o.backend.nodes[i],
        o.backend.nodes
      ), d = [];
      for (let p = 0; p < c.length - 1; ++p) {
        const h = a(c[p]), v = a(c[p + 1]);
        It(h, v) ? N(h) && d.push(
          ...h.sideEffects.undo
        ) : N(v) && d.push(...v.sideEffects.do);
      }
      for (const p of d) {
        const h = e.get(p.type).func;
        await h(p.payload);
      }
      o.update(o.changeCurrent(i)), n.fire(z.TRAVERSAL_END);
    },
    undo() {
      const { current: i } = o;
      return N(i) ? this.to(i.parent) : Promise.resolve(console.warn("Already at root!"));
    },
    redo(i = "latest") {
      const { current: c } = o;
      return c.children.length > 0 ? this.to(
        c.children[i === "oldest" ? 0 : c.children.length - 1]
      ) : Promise.resolve(
        console.warn("Already at latest in this branch!")
      );
    },
    currentChange(i, c = !1) {
      return o.currentChange(i, {
        skipOnNew: c
      });
    },
    done() {
      console.log("Setup later for URL sharing.");
    },
    tree() {
      return ke(o.root, o.backend.nodes);
    },
    on(i, c) {
      n.listen(i, c);
    },
    export() {
      return JSON.stringify(o.backend);
    },
    exportObject() {
      return JSON.parse(
        JSON.stringify(o.backend)
      );
    },
    import(i) {
      const c = JSON.parse(i), d = c.current;
      c.current = c.root, o.update(o.load(c)), this.to(d);
    },
    importObject(i) {
      const c = i.current;
      i.current = i.root, o.update(o.load(i)), this.to(c);
    },
    metadata: u,
    artifact: l,
    annotations: f,
    bookmarks: s
  };
}
function Dt(e, t, r) {
  let [n, o] = [e, t];
  n.level > o.level && ([n, o] = [o, n]);
  let a = o.level - n.level;
  for (; N(o) && a !== 0; )
    o = r[o.parent], a -= 1;
  if (n.id === o.id)
    return n.id;
  for (; n.id !== o.id; )
    N(n) && (n = r[n.parent]), N(o) && (o = r[o.parent]);
  return n.id;
}
function Je(e, t, r) {
  const n = Dt(e, t, r), o = r[n], a = [], u = [];
  let [l, f] = [e, t];
  for (; l.id !== o.id; )
    a.push(l), N(l) && (l = r[l.parent]);
  for (a.push(l); f.id !== o.id; )
    u.push(f), N(f) && (f = r[f.parent]);
  const s = u.reverse();
  return [...a, ...s].map((i) => i.id);
}
function It(e, t) {
  if (N(e) && e.parent === t.id)
    return !0;
  if (N(t) && t.parent === e.id)
    return !1;
  throw new Error(
    "Incorrect use of function. Nodes are not connected to each other."
  );
}
function ke(e, t) {
  return {
    ...e,
    children: e.children.map((r) => ke(t[r], t)),
    name: `${e.label}`
  };
}
at();
function Lt(e) {
  return e.length === 2 ? pt(e) : e;
}
class Ke {
  static create() {
    return new Ke();
  }
  constructor() {
    this.registry = /* @__PURE__ */ new Map();
  }
  has(t) {
    return this.registry.has(t);
  }
  register(t, r, n) {
    const o = r.length === 2;
    if (r.length > 2)
      throw new Error("Incorrect action function signature. Action function can only have two arguments at most!");
    if (this.has(t))
      throw new Error(`Already registered: ${t}`);
    const { label: a = t, eventType: u = t } = n || {};
    return this.registry.set(t, {
      func: Lt(r),
      config: {
        hasSideEffects: !o,
        label: typeof a == "string" ? () => a : a,
        eventType: u
      }
    }), We(t);
  }
  get(t) {
    const r = this.registry.get(t);
    if (!r)
      throw new Error(`Not registered: ${t}`);
    return r;
  }
}
export {
  P as ID,
  Ke as Registry,
  z as TrrackEvents,
  Ft as createAction,
  Ze as createRootNode,
  Ve as createStateNode,
  Qe as initEventManager,
  ht as initializeProvenanceGraph,
  Ut as initializeTrrack,
  Mt as isRootNode,
  N as isStateNode
};
//# sourceMappingURL=index.mjs.map
