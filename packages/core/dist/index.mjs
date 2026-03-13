function U(e) {
  const t = (r) => ({
    type: e,
    payload: r
  });
  return t.type = e, t.match = (r) => r.type === e, t.toString = () => e, t;
}
function $e() {
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
let B;
const We = new Uint8Array(16);
function Ge() {
  if (!B && (B = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !B))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return B(We);
}
const w = [];
for (let e = 0; e < 256; ++e)
  w.push((e + 256).toString(16).slice(1));
function Qe(e, t = 0) {
  return w[e[t + 0]] + w[e[t + 1]] + w[e[t + 2]] + w[e[t + 3]] + "-" + w[e[t + 4]] + w[e[t + 5]] + "-" + w[e[t + 6]] + w[e[t + 7]] + "-" + w[e[t + 8]] + w[e[t + 9]] + "-" + w[e[t + 10]] + w[e[t + 11]] + w[e[t + 12]] + w[e[t + 13]] + w[e[t + 14]] + w[e[t + 15]];
}
const Ye = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), Ne = {
  randomUUID: Ye
};
function Pe(e, t, r) {
  if (Ne.randomUUID && !t && !e)
    return Ne.randomUUID();
  e = e || {};
  const n = e.random || (e.rng || Ge)();
  if (n[6] = n[6] & 15 | 64, n[8] = n[8] & 63 | 128, t) {
    r = r || 0;
    for (let o = 0; o < 16; ++o)
      t[r + o] = n[o];
    return t;
  }
  return Qe(n);
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
function Dt(e) {
  return !N(e);
}
function qe(e) {
  const { label: t = void 0, state: r, initialArtifact: n, initialMetadata: o } = e, i = {
    annotation: [],
    bookmark: []
  }, u = Object.keys(o || {}).reduce(
    (l, s) => (l[s] = [], o && o[s] && l[s].push({
      type: s,
      id: P.get(),
      val: o[s],
      createdOn: Date.now()
    }), l),
    i
  ), f = n ? [
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
    artifacts: f,
    state: {
      type: "checkpoint",
      val: r
    }
  };
}
function Xe({
  parent: e,
  state: t,
  label: r,
  sideEffects: n = {
    do: [],
    undo: []
  },
  initialMetadata: o,
  initialArtifact: i,
  event: u
}) {
  const f = {
    annotation: [],
    bookmark: []
  }, l = Object.keys(o || {}).reduce(
    (a, c) => (a[c] = [], o && o[c] && a[c].push({
      type: c,
      id: P.get(),
      val: o[c],
      createdOn: Date.now()
    }), a),
    f
  ), s = i ? [
    {
      id: P.get(),
      createdOn: Date.now(),
      val: i
    }
  ] : [];
  return {
    id: P.get(),
    label: r,
    event: u,
    children: [],
    parent: e.id,
    createdOn: Date.now(),
    meta: l,
    artifacts: s,
    sideEffects: n,
    state: t,
    level: e.level + 1
  };
}
function m(e) {
  for (var t = arguments.length, r = Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++)
    r[n - 1] = arguments[n];
  if ({}.NODE_ENV !== "production") {
    var o = it[e], i = o ? typeof o == "function" ? o.apply(null, r) : o : "unknown error nr: " + e;
    throw Error("[Immer] " + i);
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
    return o === Object || typeof o == "function" && Function.toString.call(o) === ut;
  }(e) || Array.isArray(e) || !!e[J] || !!(!((t = e.constructor) === null || t === void 0) && t[J]) || Z(e) || V(e));
}
function x(e, t, r) {
  r === void 0 && (r = !1), R(e) === 0 ? (r ? Object.keys : Ae)(e).forEach(function(n) {
    r && typeof n == "symbol" || t(n, e[n], e);
  }) : e.forEach(function(n, o) {
    return t(o, n, e);
  });
}
function R(e) {
  var t = e[_];
  return t ? t.i > 3 ? t.i - 4 : t.i : Array.isArray(e) ? 1 : Z(e) ? 2 : V(e) ? 3 : 0;
}
function H(e, t) {
  return R(e) === 2 ? e.has(t) : Object.prototype.hasOwnProperty.call(e, t);
}
function $(e, t) {
  return R(e) === 2 ? e.get(t) : e[t];
}
function Ce(e, t, r) {
  var n = R(e);
  n === 2 ? e.set(t, r) : n === 3 ? e.add(r) : e[t] = r;
}
function Ze(e, t) {
  return e === t ? e !== 0 || 1 / e == 1 / t : e != e && t != t;
}
function Z(e) {
  return ot && e instanceof Map;
}
function V(e) {
  return at && e instanceof Set;
}
function I(e) {
  return e.o || e.t;
}
function ye(e) {
  if (Array.isArray(e))
    return Array.prototype.slice.call(e);
  var t = ct(e);
  delete t[_];
  for (var r = Ae(t), n = 0; n < r.length; n++) {
    var o = r[n], i = t[o];
    i.writable === !1 && (i.writable = !0, i.configurable = !0), (i.get || i.set) && (t[o] = { configurable: !0, writable: !0, enumerable: i.enumerable, value: e[o] });
  }
  return Object.create(Object.getPrototypeOf(e), t);
}
function ge(e, t) {
  return t === void 0 && (t = !1), me(e) || M(e) || !S(e) || (R(e) > 1 && (e.set = e.add = e.clear = e.delete = Ve), Object.freeze(e), t && x(e, function(r, n) {
    return ge(n, !0);
  }, !0)), e;
}
function Ve() {
  m(2);
}
function me(e) {
  return e == null || typeof e != "object" || Object.isFrozen(e);
}
function T(e) {
  var t = se[e];
  return t || m(18, e), t;
}
function et(e, t) {
  se[e] || (se[e] = t);
}
function Te() {
  return {}.NODE_ENV === "production" || F || m(0), F;
}
function re(e, t) {
  t && (T("Patches"), e.u = [], e.s = [], e.v = t);
}
function G(e) {
  ie(e), e.p.forEach(tt), e.p = null;
}
function ie(e) {
  e === F && (F = e.l);
}
function Se(e) {
  return F = { p: [], l: F, h: e, m: !0, _: 0 };
}
function tt(e) {
  var t = e[_];
  t.i === 0 || t.i === 1 ? t.j() : t.g = !0;
}
function ne(e, t) {
  t._ = t.p.length;
  var r = t.p[0], n = e !== void 0 && e !== r;
  return t.h.O || T("ES5").S(t, e, n), n ? (r[_].P && (G(t), m(4)), S(e) && (e = Q(t, e), t.l || Y(t, e)), t.u && T("Patches").M(r[_].t, e, t.u, t.s)) : e = Q(t, r, []), G(t), t.u && t.v(t.u, t.s), e !== Oe ? e : void 0;
}
function Q(e, t, r) {
  if (me(t))
    return t;
  var n = t[_];
  if (!n)
    return x(t, function(f, l) {
      return Re(e, n, t, f, l, r);
    }, !0), t;
  if (n.A !== e)
    return t;
  if (!n.P)
    return Y(e, n.t, !0), n.t;
  if (!n.I) {
    n.I = !0, n.A._--;
    var o = n.i === 4 || n.i === 5 ? n.o = ye(n.k) : n.o, i = o, u = !1;
    n.i === 3 && (i = new Set(o), o.clear(), u = !0), x(i, function(f, l) {
      return Re(e, n, o, f, l, r, u);
    }), Y(e, o, !1), r && e.u && T("Patches").N(n, r, e.u, e.s);
  }
  return n.o;
}
function Re(e, t, r, n, o, i, u) {
  if ({}.NODE_ENV !== "production" && o === r && m(5), M(o)) {
    var f = Q(e, o, i && t && t.i !== 3 && !H(t.R, n) ? i.concat(n) : void 0);
    if (Ce(r, n, f), !M(f))
      return;
    e.m = !1;
  } else
    u && r.add(o);
  if (S(o) && !me(o)) {
    if (!e.h.D && e._ < 1)
      return;
    Q(e, o), t && t.A.l || Y(e, o);
  }
}
function Y(e, t, r) {
  r === void 0 && (r = !1), !e.l && e.h.D && e.m && ge(t, r);
}
function oe(e, t) {
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
function ue(e) {
  e.P || (e.P = !0, e.l && ue(e.l));
}
function ae(e) {
  e.o || (e.o = ye(e.t));
}
function ce(e, t, r) {
  var n = Z(t) ? T("MapSet").F(t, r) : V(t) ? T("MapSet").T(t, r) : e.O ? function(o, i) {
    var u = Array.isArray(o), f = { i: u ? 1 : 0, A: i ? i.A : Te(), P: !1, I: !1, R: {}, l: i, t: o, k: null, o: null, j: null, C: !1 }, l = f, s = fe;
    u && (l = [f], s = z);
    var a = Proxy.revocable(l, s), c = a.revoke, p = a.proxy;
    return f.k = p, f.j = c, p;
  }(t, r) : T("ES5").J(t, r);
  return (r ? r.A : Te()).p.push(n), n;
}
function rt(e) {
  return M(e) || m(22, e), function t(r) {
    if (!S(r))
      return r;
    var n, o = r[_], i = R(r);
    if (o) {
      if (!o.P && (o.i < 4 || !T("ES5").K(o)))
        return o.t;
      o.I = !0, n = Ie(r, i), o.I = !1;
    } else
      n = Ie(r, i);
    return x(n, function(u, f) {
      o && $(o.t, u) === f || Ce(n, u, t(f));
    }), i === 3 ? new Set(n) : n;
  }(e);
}
function Ie(e, t) {
  switch (t) {
    case 2:
      return new Map(e);
    case 3:
      return Array.from(e);
  }
  return ye(e);
}
function nt() {
  function e(n) {
    if (!S(n))
      return n;
    if (Array.isArray(n))
      return n.map(e);
    if (Z(n))
      return new Map(Array.from(n.entries()).map(function(u) {
        return [u[0], e(u[1])];
      }));
    if (V(n))
      return new Set(Array.from(n).map(e));
    var o = Object.create(Object.getPrototypeOf(n));
    for (var i in n)
      o[i] = e(n[i]);
    return H(n, J) && (o[J] = n[J]), o;
  }
  function t(n) {
    return M(n) ? e(n) : n;
  }
  var r = "add";
  et("Patches", { $: function(n, o) {
    return o.forEach(function(i) {
      for (var u = i.path, f = i.op, l = n, s = 0; s < u.length - 1; s++) {
        var a = R(l), c = u[s];
        typeof c != "string" && typeof c != "number" && (c = "" + c), a !== 0 && a !== 1 || c !== "__proto__" && c !== "constructor" || m(24), typeof l == "function" && c === "prototype" && m(24), typeof (l = $(l, c)) != "object" && m(15, u.join("/"));
      }
      var p = R(l), d = e(i.value), h = u[u.length - 1];
      switch (f) {
        case "replace":
          switch (p) {
            case 2:
              return l.set(h, d);
            case 3:
              m(16);
            default:
              return l[h] = d;
          }
        case r:
          switch (p) {
            case 1:
              return h === "-" ? l.push(d) : l.splice(h, 0, d);
            case 2:
              return l.set(h, d);
            case 3:
              return l.add(d);
            default:
              return l[h] = d;
          }
        case "remove":
          switch (p) {
            case 1:
              return l.splice(h, 1);
            case 2:
              return l.delete(h);
            case 3:
              return l.delete(i.value);
            default:
              return delete l[h];
          }
        default:
          m(17, f);
      }
    }), n;
  }, N: function(n, o, i, u) {
    switch (n.i) {
      case 0:
      case 4:
      case 2:
        return function(f, l, s, a) {
          var c = f.t, p = f.o;
          x(f.R, function(d, h) {
            var v = $(c, d), y = $(p, d), A = h ? H(c, d) ? "replace" : r : "remove";
            if (v !== y || A !== "replace") {
              var O = l.concat(d);
              s.push(A === "remove" ? { op: A, path: O } : { op: A, path: O, value: y }), a.push(A === r ? { op: "remove", path: O } : A === "remove" ? { op: r, path: O, value: t(v) } : { op: "replace", path: O, value: t(v) });
            }
          });
        }(n, o, i, u);
      case 5:
      case 1:
        return function(f, l, s, a) {
          var c = f.t, p = f.R, d = f.o;
          if (d.length < c.length) {
            var h = [d, c];
            c = h[0], d = h[1];
            var v = [a, s];
            s = v[0], a = v[1];
          }
          for (var y = 0; y < c.length; y++)
            if (p[y] && d[y] !== c[y]) {
              var A = l.concat([y]);
              s.push({ op: "replace", path: A, value: t(d[y]) }), a.push({ op: "replace", path: A, value: t(c[y]) });
            }
          for (var O = c.length; O < d.length; O++) {
            var D = l.concat([O]);
            s.push({ op: r, path: D, value: t(d[O]) });
          }
          c.length < d.length && a.push({ op: "replace", path: l.concat(["length"]), value: c.length });
        }(n, o, i, u);
      case 3:
        return function(f, l, s, a) {
          var c = f.t, p = f.o, d = 0;
          c.forEach(function(h) {
            if (!p.has(h)) {
              var v = l.concat([d]);
              s.push({ op: "remove", path: v, value: h }), a.unshift({ op: r, path: v, value: h });
            }
            d++;
          }), d = 0, p.forEach(function(h) {
            if (!c.has(h)) {
              var v = l.concat([d]);
              s.push({ op: r, path: v, value: h }), a.unshift({ op: "remove", path: v, value: h });
            }
            d++;
          });
        }(n, o, i, u);
    }
  }, M: function(n, o, i, u) {
    i.push({ op: "replace", path: [], value: o === Oe ? void 0 : o }), u.push({ op: "replace", path: [], value: n });
  } });
}
var Le, F, we = typeof Symbol < "u" && typeof Symbol("x") == "symbol", ot = typeof Map < "u", at = typeof Set < "u", je = typeof Proxy < "u" && Proxy.revocable !== void 0 && typeof Reflect < "u", Oe = we ? Symbol.for("immer-nothing") : ((Le = {})["immer-nothing"] = !0, Le), J = we ? Symbol.for("immer-draftable") : "__$immer_draftable", _ = we ? Symbol.for("immer-state") : "__$immer_state", it = { 0: "Illegal state", 1: "Immer drafts cannot have computed properties", 2: "This object has been frozen and should not be mutated", 3: function(e) {
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
}, 24: "Patching reserved attributes like __proto__, prototype and constructor is not allowed" }, ut = "" + Object.prototype.constructor, Ae = typeof Reflect < "u" && Reflect.ownKeys ? Reflect.ownKeys : Object.getOwnPropertySymbols !== void 0 ? function(e) {
  return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
} : Object.getOwnPropertyNames, ct = Object.getOwnPropertyDescriptors || function(e) {
  var t = {};
  return Ae(e).forEach(function(r) {
    t[r] = Object.getOwnPropertyDescriptor(e, r);
  }), t;
}, se = {}, fe = { get: function(e, t) {
  if (t === _)
    return e;
  var r = I(e);
  if (!H(r, t))
    return function(o, i, u) {
      var f, l = De(i, u);
      return l ? "value" in l ? l.value : (f = l.get) === null || f === void 0 ? void 0 : f.call(o.k) : void 0;
    }(e, r, t);
  var n = r[t];
  return e.I || !S(n) ? n : n === oe(e.t, t) ? (ae(e), e.o[t] = ce(e.A.h, n, e)) : n;
}, has: function(e, t) {
  return t in I(e);
}, ownKeys: function(e) {
  return Reflect.ownKeys(I(e));
}, set: function(e, t, r) {
  var n = De(I(e), t);
  if (n != null && n.set)
    return n.set.call(e.k, r), !0;
  if (!e.P) {
    var o = oe(I(e), t), i = o == null ? void 0 : o[_];
    if (i && i.t === r)
      return e.o[t] = r, e.R[t] = !1, !0;
    if (Ze(r, o) && (r !== void 0 || H(e.t, t)))
      return !0;
    ae(e), ue(e);
  }
  return e.o[t] === r && (r !== void 0 || t in e.o) || Number.isNaN(r) && Number.isNaN(e.o[t]) || (e.o[t] = r, e.R[t] = !0), !0;
}, deleteProperty: function(e, t) {
  return oe(e.t, t) !== void 0 || t in e.t ? (e.R[t] = !1, ae(e), ue(e)) : delete e.R[t], e.o && delete e.o[t], !0;
}, getOwnPropertyDescriptor: function(e, t) {
  var r = I(e), n = Reflect.getOwnPropertyDescriptor(r, t);
  return n && { writable: !0, configurable: e.i !== 1 || t !== "length", enumerable: n.enumerable, value: r[t] };
}, defineProperty: function() {
  m(11);
}, getPrototypeOf: function(e) {
  return Object.getPrototypeOf(e.t);
}, setPrototypeOf: function() {
  m(12);
} }, z = {};
x(fe, function(e, t) {
  z[e] = function() {
    return arguments[0] = arguments[0][0], t.apply(this, arguments);
  };
}), z.deleteProperty = function(e, t) {
  return {}.NODE_ENV !== "production" && isNaN(parseInt(t)) && m(13), z.set.call(this, e, t, void 0);
}, z.set = function(e, t, r) {
  return {}.NODE_ENV !== "production" && t !== "length" && isNaN(parseInt(t)) && m(14), fe.set.call(this, e[0], t, r, e[0]);
};
var st = function() {
  function e(r) {
    var n = this;
    this.O = je, this.D = !0, this.produce = function(o, i, u) {
      if (typeof o == "function" && typeof i != "function") {
        var f = i;
        i = o;
        var l = n;
        return function(v) {
          var y = this;
          v === void 0 && (v = f);
          for (var A = arguments.length, O = Array(A > 1 ? A - 1 : 0), D = 1; D < A; D++)
            O[D - 1] = arguments[D];
          return l.produce(v, function(te) {
            var be;
            return (be = i).call.apply(be, [y, te].concat(O));
          });
        };
      }
      var s;
      if (typeof i != "function" && m(6), u !== void 0 && typeof u != "function" && m(7), S(o)) {
        var a = Se(n), c = ce(n, o, void 0), p = !0;
        try {
          s = i(c), p = !1;
        } finally {
          p ? G(a) : ie(a);
        }
        return typeof Promise < "u" && s instanceof Promise ? s.then(function(v) {
          return re(a, u), ne(v, a);
        }, function(v) {
          throw G(a), v;
        }) : (re(a, u), ne(s, a));
      }
      if (!o || typeof o != "object") {
        if ((s = i(o)) === void 0 && (s = o), s === Oe && (s = void 0), n.D && ge(s, !0), u) {
          var d = [], h = [];
          T("Patches").M(o, s, d, h), u(d, h);
        }
        return s;
      }
      m(21, o);
    }, this.produceWithPatches = function(o, i) {
      if (typeof o == "function")
        return function(s) {
          for (var a = arguments.length, c = Array(a > 1 ? a - 1 : 0), p = 1; p < a; p++)
            c[p - 1] = arguments[p];
          return n.produceWithPatches(s, function(d) {
            return o.apply(void 0, [d].concat(c));
          });
        };
      var u, f, l = n.produce(o, i, function(s, a) {
        u = s, f = a;
      });
      return typeof Promise < "u" && l instanceof Promise ? l.then(function(s) {
        return [s, u, f];
      }) : [l, u, f];
    }, typeof (r == null ? void 0 : r.useProxies) == "boolean" && this.setUseProxies(r.useProxies), typeof (r == null ? void 0 : r.autoFreeze) == "boolean" && this.setAutoFreeze(r.autoFreeze);
  }
  var t = e.prototype;
  return t.createDraft = function(r) {
    S(r) || m(8), M(r) && (r = rt(r));
    var n = Se(this), o = ce(this, r, void 0);
    return o[_].C = !0, ie(n), o;
  }, t.finishDraft = function(r, n) {
    var o = r && r[_];
    ({}).NODE_ENV !== "production" && (o && o.C || m(9), o.I && m(10));
    var i = o.A;
    return re(i, n), ne(void 0, i);
  }, t.setAutoFreeze = function(r) {
    this.D = r;
  }, t.setUseProxies = function(r) {
    r && !je && m(20), this.O = r;
  }, t.applyPatches = function(r, n) {
    var o;
    for (o = n.length - 1; o >= 0; o--) {
      var i = n[o];
      if (i.path.length === 0 && i.op === "replace") {
        r = i.value;
        break;
      }
    }
    o > -1 && (n = n.slice(o + 1));
    var u = T("Patches").$;
    return M(r) ? u(r, n) : this.produce(r, function(f) {
      return u(f, n);
    });
  }, e;
}(), b = new st(), xe = b.produce;
b.produceWithPatches.bind(b);
b.setAutoFreeze.bind(b);
b.setUseProxies.bind(b);
b.applyPatches.bind(b);
b.createDraft.bind(b);
b.finishDraft.bind(b);
/*!
 * https://github.com/Starcounter-Jack/JSON-Patch
 * (c) 2017-2022 Joachim Wester
 * MIT licensed
 */
var ft = globalThis && globalThis.__extends || function() {
  var e = function(t, r) {
    return e = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o)
        o.hasOwnProperty(i) && (n[i] = o[i]);
    }, e(t, r);
  };
  return function(t, r) {
    e(t, r);
    function n() {
      this.constructor = t;
    }
    t.prototype = r === null ? Object.create(r) : (n.prototype = r.prototype, new n());
  };
}(), lt = Object.prototype.hasOwnProperty;
function le(e, t) {
  return lt.call(e, t);
}
function de(e) {
  if (Array.isArray(e)) {
    for (var t = new Array(e.length), r = 0; r < t.length; r++)
      t[r] = "" + r;
    return t;
  }
  if (Object.keys)
    return Object.keys(e);
  var n = [];
  for (var o in e)
    le(e, o) && n.push(o);
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
function Fe(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
function he(e) {
  if (e === void 0)
    return !0;
  if (e) {
    if (Array.isArray(e)) {
      for (var t = 0, r = e.length; t < r; t++)
        if (he(e[t]))
          return !0;
    } else if (typeof e == "object") {
      for (var n = de(e), o = n.length, i = 0; i < o; i++)
        if (he(e[n[i]]))
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
var ze = (
  /** @class */
  function(e) {
    ft(t, e);
    function t(r, n, o, i, u) {
      var f = this.constructor, l = e.call(this, Me(r, { name: n, index: o, operation: i, tree: u })) || this;
      return l.name = n, l.index = o, l.operation = i, l.tree = u, Object.setPrototypeOf(l, f.prototype), l.message = Me(r, { name: n, index: o, operation: i, tree: u }), l;
    }
    return t;
  }(Error)
), g = ze, dt = E, C = {
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
    var n = q(r, this.path);
    n && (n = E(n));
    var o = j(r, { op: "remove", path: this.from }).removed;
    return j(r, { op: "add", path: this.path, value: o }), { newDocument: r, removed: n };
  },
  copy: function(e, t, r) {
    var n = q(r, this.from);
    return j(r, { op: "add", path: this.path, value: E(n) }), { newDocument: r };
  },
  test: function(e, t, r) {
    return { newDocument: r, test: K(e[t], this.value) };
  },
  _get: function(e, t, r) {
    return this.value = e[t], { newDocument: r };
  }
}, pt = {
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
  move: C.move,
  copy: C.copy,
  test: C.test,
  _get: C._get
};
function q(e, t) {
  if (t == "")
    return e;
  var r = { op: "_get", path: t };
  return j(e, r), r.value;
}
function j(e, t, r, n, o, i) {
  if (r === void 0 && (r = !1), n === void 0 && (n = !0), o === void 0 && (o = !0), i === void 0 && (i = 0), r && (typeof r == "function" ? r(t, 0, e, t.path) : X(t, 0)), t.path === "") {
    var u = { newDocument: e };
    if (t.op === "add")
      return u.newDocument = t.value, u;
    if (t.op === "replace")
      return u.newDocument = t.value, u.removed = e, u;
    if (t.op === "move" || t.op === "copy")
      return u.newDocument = q(e, t.from), t.op === "move" && (u.removed = e), u;
    if (t.op === "test") {
      if (u.test = K(e, t.value), u.test === !1)
        throw new g("Test operation failed", "TEST_OPERATION_FAILED", i, t, e);
      return u.newDocument = e, u;
    } else {
      if (t.op === "remove")
        return u.removed = e, u.newDocument = null, u;
      if (t.op === "_get")
        return t.value = e, u;
      if (r)
        throw new g("Operation `op` property is not one of operations defined in RFC-6902", "OPERATION_OP_INVALID", i, t, e);
      return u;
    }
  } else {
    n || (e = E(e));
    var f = t.path || "", l = f.split("/"), s = e, a = 1, c = l.length, p = void 0, d = void 0, h = void 0;
    for (typeof r == "function" ? h = r : h = X; ; ) {
      if (d = l[a], d && d.indexOf("~") != -1 && (d = Fe(d)), o && (d == "__proto__" || d == "prototype" && a > 0 && l[a - 1] == "constructor"))
        throw new TypeError("JSON-Patch: modifying `__proto__` or `constructor/prototype` prop is banned for security reasons, if this was on purpose, please set `banPrototypeModifications` flag false and pass it to this function. More info in fast-json-patch README");
      if (r && p === void 0 && (s[d] === void 0 ? p = l.slice(0, a).join("/") : a == c - 1 && (p = t.path), p !== void 0 && h(t, 0, e, p)), a++, Array.isArray(s)) {
        if (d === "-")
          d = s.length;
        else {
          if (r && !pe(d))
            throw new g("Expected an unsigned base-10 integer value, making the new referenced value the array element with the zero-based index", "OPERATION_PATH_ILLEGAL_ARRAY_INDEX", i, t, e);
          pe(d) && (d = ~~d);
        }
        if (a >= c) {
          if (r && t.op === "add" && d > s.length)
            throw new g("The specified index MUST NOT be greater than the number of elements in the array", "OPERATION_VALUE_OUT_OF_BOUNDS", i, t, e);
          var u = pt[t.op].call(t, s, d, e);
          if (u.test === !1)
            throw new g("Test operation failed", "TEST_OPERATION_FAILED", i, t, e);
          return u;
        }
      } else if (a >= c) {
        var u = C[t.op].call(t, s, d, e);
        if (u.test === !1)
          throw new g("Test operation failed", "TEST_OPERATION_FAILED", i, t, e);
        return u;
      }
      if (s = s[d], r && a < c && (!s || typeof s != "object"))
        throw new g("Cannot perform operation at the desired path", "OPERATION_PATH_UNRESOLVABLE", i, t, e);
    }
  }
}
function ee(e, t, r, n, o) {
  if (n === void 0 && (n = !0), o === void 0 && (o = !0), r && !Array.isArray(t))
    throw new g("Patch sequence must be an array", "SEQUENCE_NOT_AN_ARRAY");
  n || (e = E(e));
  for (var i = new Array(t.length), u = 0, f = t.length; u < f; u++)
    i[u] = j(e, t[u], r, !0, o, u), e = i[u].newDocument;
  return i.newDocument = e, i;
}
function ht(e, t, r) {
  var n = j(e, t);
  if (n.test === !1)
    throw new g("Test operation failed", "TEST_OPERATION_FAILED", r, t, e);
  return n.newDocument;
}
function X(e, t, r, n) {
  if (typeof e != "object" || e === null || Array.isArray(e))
    throw new g("Operation is not an object", "OPERATION_NOT_AN_OBJECT", t, e, r);
  if (C[e.op]) {
    if (typeof e.path != "string")
      throw new g("Operation `path` property is not a string", "OPERATION_PATH_INVALID", t, e, r);
    if (e.path.indexOf("/") !== 0 && e.path.length > 0)
      throw new g('Operation `path` property must start with "/"', "OPERATION_PATH_INVALID", t, e, r);
    if ((e.op === "move" || e.op === "copy") && typeof e.from != "string")
      throw new g("Operation `from` property is not present (applicable in `move` and `copy` operations)", "OPERATION_FROM_REQUIRED", t, e, r);
    if ((e.op === "add" || e.op === "replace" || e.op === "test") && e.value === void 0)
      throw new g("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)", "OPERATION_VALUE_REQUIRED", t, e, r);
    if ((e.op === "add" || e.op === "replace" || e.op === "test") && he(e.value))
      throw new g("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)", "OPERATION_VALUE_CANNOT_CONTAIN_UNDEFINED", t, e, r);
    if (r) {
      if (e.op == "add") {
        var o = e.path.split("/").length, i = n.split("/").length;
        if (o !== i + 1 && o !== i)
          throw new g("Cannot perform an `add` operation at the desired path", "OPERATION_PATH_CANNOT_ADD", t, e, r);
      } else if (e.op === "replace" || e.op === "remove" || e.op === "_get") {
        if (e.path !== n)
          throw new g("Cannot perform the operation at a path that does not exist", "OPERATION_PATH_UNRESOLVABLE", t, e, r);
      } else if (e.op === "move" || e.op === "copy") {
        var u = { op: "_get", path: e.from, value: void 0 }, f = ke([u], r);
        if (f && f.name === "OPERATION_PATH_UNRESOLVABLE")
          throw new g("Cannot perform the operation from a path that does not exist", "OPERATION_FROM_UNRESOLVABLE", t, e, r);
      }
    }
  } else
    throw new g("Operation `op` property is not one of operations defined in RFC-6902", "OPERATION_OP_INVALID", t, e, r);
}
function ke(e, t, r) {
  try {
    if (!Array.isArray(e))
      throw new g("Patch sequence must be an array", "SEQUENCE_NOT_AN_ARRAY");
    if (t)
      ee(E(t), E(e), r || !0);
    else {
      r = r || X;
      for (var n = 0; n < e.length; n++)
        r(e[n], n, t, void 0);
    }
  } catch (o) {
    if (o instanceof g)
      return o;
    throw o;
  }
}
function K(e, t) {
  if (e === t)
    return !0;
  if (e && t && typeof e == "object" && typeof t == "object") {
    var r = Array.isArray(e), n = Array.isArray(t), o, i, u;
    if (r && n) {
      if (i = e.length, i != t.length)
        return !1;
      for (o = i; o-- !== 0; )
        if (!K(e[o], t[o]))
          return !1;
      return !0;
    }
    if (r != n)
      return !1;
    var f = Object.keys(e);
    if (i = f.length, i !== Object.keys(t).length)
      return !1;
    for (o = i; o-- !== 0; )
      if (!t.hasOwnProperty(f[o]))
        return !1;
    for (o = i; o-- !== 0; )
      if (u = f[o], !K(e[u], t[u]))
        return !1;
    return !0;
  }
  return e !== e && t !== t;
}
const vt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  JsonPatchError: g,
  _areEquals: K,
  applyOperation: j,
  applyPatch: ee,
  applyReducer: ht,
  deepClone: dt,
  getValueByPointer: q,
  validate: ke,
  validator: X
}, Symbol.toStringTag, { value: "Module" }));
/*!
 * https://github.com/Starcounter-Jack/JSON-Patch
 * (c) 2017-2021 Joachim Wester
 * MIT license
 */
var Ee = /* @__PURE__ */ new WeakMap(), yt = (
  /** @class */
  function() {
    function e(t) {
      this.observers = /* @__PURE__ */ new Map(), this.obj = t;
    }
    return e;
  }()
), gt = (
  /** @class */
  function() {
    function e(t, r) {
      this.callback = t, this.observer = r;
    }
    return e;
  }()
);
function mt(e) {
  return Ee.get(e);
}
function wt(e, t) {
  return e.observers.get(t);
}
function Ot(e, t) {
  e.observers.delete(t.callback);
}
function At(e, t) {
  t.unobserve();
}
function Et(e, t) {
  var r = [], n, o = mt(e);
  if (!o)
    o = new yt(e), Ee.set(e, o);
  else {
    var i = wt(o, t);
    n = i && i.observer;
  }
  if (n)
    return n;
  if (n = {}, o.value = E(e), t) {
    n.callback = t, n.next = null;
    var u = function() {
      ve(n);
    }, f = function() {
      clearTimeout(n.next), n.next = setTimeout(u);
    };
    typeof window < "u" && (window.addEventListener("mouseup", f), window.addEventListener("keyup", f), window.addEventListener("mousedown", f), window.addEventListener("keydown", f), window.addEventListener("change", f));
  }
  return n.patches = r, n.object = e, n.unobserve = function() {
    ve(n), clearTimeout(n.next), Ot(o, n), typeof window < "u" && (window.removeEventListener("mouseup", f), window.removeEventListener("keyup", f), window.removeEventListener("mousedown", f), window.removeEventListener("keydown", f), window.removeEventListener("change", f));
  }, o.observers.set(t, new gt(t, n)), n;
}
function ve(e, t) {
  t === void 0 && (t = !1);
  var r = Ee.get(e.object);
  _e(r.value, e.object, e.patches, "", t), e.patches.length && ee(r.value, e.patches);
  var n = e.patches;
  return n.length > 0 && (e.patches = [], e.callback && e.callback(n)), n;
}
function _e(e, t, r, n, o) {
  if (t !== e) {
    typeof t.toJSON == "function" && (t = t.toJSON());
    for (var i = de(t), u = de(e), f = !1, l = u.length - 1; l >= 0; l--) {
      var s = u[l], a = e[s];
      if (le(t, s) && !(t[s] === void 0 && a !== void 0 && Array.isArray(t) === !1)) {
        var c = t[s];
        typeof a == "object" && a != null && typeof c == "object" && c != null && Array.isArray(a) === Array.isArray(c) ? _e(a, c, r, n + "/" + L(s), o) : a !== c && (o && r.push({ op: "test", path: n + "/" + L(s), value: E(a) }), r.push({ op: "replace", path: n + "/" + L(s), value: E(c) }));
      } else
        Array.isArray(e) === Array.isArray(t) ? (o && r.push({ op: "test", path: n + "/" + L(s), value: E(a) }), r.push({ op: "remove", path: n + "/" + L(s) }), f = !0) : (o && r.push({ op: "test", path: n, value: e }), r.push({ op: "replace", path: n, value: t }));
    }
    if (!(!f && i.length == u.length))
      for (var l = 0; l < i.length; l++) {
        var s = i[l];
        !le(e, s) && t[s] !== void 0 && r.push({ op: "add", path: n + "/" + L(s), value: E(t[s]) });
      }
  }
}
function Je(e, t, r) {
  r === void 0 && (r = !1);
  var n = [];
  return _e(e, t, n, "", r), n;
}
const _t = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  compare: Je,
  generate: ve,
  observe: Et,
  unobserve: At
}, Symbol.toStringTag, { value: "Module" }));
Object.assign({}, vt, _t, {
  JsonPatchError: ze,
  deepClone: E,
  escapePathComponent: L,
  unescapePathComponent: Fe
});
function Ue(e) {
  return E(e);
}
function bt(e, t = {}) {
  const {
    artifact: r = void 0,
    metadata: n = void 0,
    rootLabel: o = "Root"
  } = t, i = qe({
    state: e,
    label: o,
    initialArtifact: r,
    initialMetadata: n
  }), u = {
    nodes: {
      [i.id]: i
    },
    root: i.id,
    current: i.id
  }, f = {
    addMetadata: U("provenance-graph/addMetadata"),
    addArtifact: U("provenance-graph/addArtifact"),
    changeCurrent: U("provenance-graph/changeCurrent"),
    addNode: U(
      "provenance-graph/addNode"
    ),
    load: U("provenance-graph/load")
  };
  function l(s, a) {
    if (f.addMetadata.match(a)) {
      const { id: c, meta: p } = a.payload, d = s.nodes[c].meta, h = Object.keys(p).reduce((v, y) => (v[y] || (v[y] = []), v[y].push({
        type: y,
        id: P.get(),
        val: p[y],
        createdOn: Date.now()
      }), v), d);
      return s.nodes[c].meta = h, s;
    }
    if (f.addArtifact.match(a))
      return s.nodes[a.payload.id].artifacts.push({
        id: P.get(),
        createdOn: Date.now(),
        val: a.payload.artifact
      }), s;
    if (f.changeCurrent.match(a))
      return s.current = a.payload, s;
    if (f.addNode.match(a)) {
      const { payload: c } = a;
      return s.nodes[c.id] = c, s.nodes[c.parent].children.push(c.id), s.current = c.id, s;
    }
    return f.load.match(a) ? Ue(a.payload) : s;
  }
  return {
    actions: f,
    getInitialState() {
      return Ue(u);
    },
    reduce: l
  };
}
function Nt(e) {
  const t = /* @__PURE__ */ new Map(), { reduce: r, actions: n, getInitialState: o } = bt(e);
  let i = o();
  function u(l) {
    if (!n.changeCurrent.match(l) && !n.addNode.match(l))
      return;
    const s = n.addNode.match(l);
    t.forEach((a) => {
      const { skipOnNew: c } = a.config;
      c && s || a.func(s ? "new" : "traversal");
    });
  }
  function f(l) {
    return i = xe(i, (s) => {
      const a = r(s, l);
      if (a !== s)
        return a;
    }), u(l), l;
  }
  return {
    initialState: o(),
    get backend() {
      return i;
    },
    get current() {
      return i.nodes[i.current];
    },
    get root() {
      return i.nodes[i.root];
    },
    currentChange(l, s) {
      const a = {
        id: P.get(),
        func: l,
        config: s
      };
      return t.set(a.id, a), () => t.delete(a.id);
    },
    update: f,
    ...n
  };
}
var k = /* @__PURE__ */ ((e) => (e.TRAVERSAL_START = "Traversal_Start", e.TRAVERSAL_END = "Traversal_End", e))(k || {});
function W(e, t) {
  const r = e.state;
  if (r.type === "checkpoint")
    return r.val;
  const { checkpointRef: n } = r, o = t[n], i = He(o, e, t);
  i.shift();
  const u = i.map((s) => t[s]).map((s) => s.state.val).reduce((s, a) => [...s, ...a], []), f = W(o, t);
  return ee(
    f,
    E(u),
    !0,
    !1
  ).newDocument;
}
function Pt(e, t) {
  const r = Object.keys(e).length;
  return new Set(
    t.map((o) => o.path.split("/")[1])
  ).size < r / 2 ? "patch" : "checkpoint";
}
function It({
  registry: e,
  initialState: t
}) {
  let r = !1;
  const n = $e(), o = Nt(t);
  function i(a) {
    return o.backend.nodes[a];
  }
  n.listen(k.TRAVERSAL_START, () => {
    r = !0;
  }), n.listen(k.TRAVERSAL_END, () => {
    r = !1;
  });
  const u = {
    add(a, c = o.current.id) {
      o.update(
        o.addMetadata({
          id: c,
          meta: a
        })
      );
    },
    latestOfType(a, c = o.current.id) {
      var p;
      return (p = o.backend.nodes[c].meta[a]) == null ? void 0 : p.at(-1);
    },
    allOfType(a, c = o.current.id) {
      return o.backend.nodes[c].meta[a];
    },
    latest(a = o.current.id) {
      const c = o.backend.nodes[a].meta, p = Object.keys(c).reduce(
        (d, h) => {
          const v = c[h].at(-1);
          return v && (d[h] = v), d;
        },
        {}
      );
      return Object.keys(p).length > 0 ? p : void 0;
    },
    all(a = o.current.id) {
      return o.backend.nodes[a].meta;
    },
    types(a = o.current.id) {
      return Object.keys(o.backend.nodes[a].meta);
    }
  }, f = {
    add(a, c = o.current.id) {
      o.update(
        o.addArtifact({
          id: c,
          artifact: a
        })
      );
    },
    latest(a = o.current.id) {
      return o.backend.nodes[a].artifacts.at(-1);
    },
    all(a = o.current.id) {
      return o.backend.nodes[a].artifacts;
    }
  }, l = {
    add(a, c = o.current.id) {
      u.add({ annotation: a }, c);
    },
    latest(a = o.current.id) {
      var c;
      return (c = u.latestOfType("annotation", a)) == null ? void 0 : c.val;
    },
    all(a = o.current.id) {
      var c;
      return (c = u.allOfType("annotation", a)) == null ? void 0 : c.map((p) => p.val);
    }
  }, s = {
    add(a = o.current.id) {
      u.add({ bookmark: !0 }, a);
    },
    remove(a = o.current.id) {
      u.add({ bookmark: !1 }, a);
    },
    is(a = o.current.id) {
      var c;
      return !!((c = u.latestOfType("bookmark", a)) != null && c.val);
    },
    toggle(a = o.current.id) {
      s.is(a) ? s.remove(a) : s.add(a);
    }
  };
  return {
    registry: e,
    get isTraversing() {
      return r;
    },
    getState(a = o.current) {
      return W(a, o.backend.nodes);
    },
    graph: o,
    get current() {
      return o.current;
    },
    get root() {
      return o.root;
    },
    record({
      label: a,
      state: c,
      sideEffects: p,
      eventType: d,
      onlySideEffects: h = !1
    }) {
      let v = null, y = null;
      const A = W(
        this.current,
        this.graph.backend.nodes
      );
      if (h)
        y = {
          type: "checkpoint",
          val: c
        };
      else {
        const O = Je(A, c);
        if (Pt(c, O) === "checkpoint")
          y = {
            type: "checkpoint",
            val: c
          };
        else {
          const te = this.current.state.type === "checkpoint" ? this.current.id : this.current.state.checkpointRef;
          y = {
            type: "patch",
            val: O,
            checkpointRef: te
          };
        }
      }
      if (!y)
        throw new Error(
          `Could not calculate new state. Previous state is: ${JSON.stringify(
            this.current.state,
            null,
            2
          )}`
        );
      if (v = Xe({
        label: a,
        state: y,
        parent: this.current,
        sideEffects: p,
        event: d
      }), !v)
        throw new Error("State Node creation failed!");
      o.update(o.addNode(v));
    },
    async apply(a, c) {
      const p = e.get(c.type), d = W(
        this.current,
        this.graph.backend.nodes
      );
      if (p.config.hasSideEffects) {
        const { do: h = c, undo: v } = p.func(c.payload);
        this.record({
          label: a,
          state: d,
          sideEffects: { do: [h], undo: [v] },
          eventType: p.config.eventType
        });
      } else {
        const h = p.func(d, c.payload);
        this.record({
          label: a,
          state: h,
          sideEffects: { do: [], undo: [] },
          eventType: p.config.eventType
        });
      }
    },
    async to(a) {
      n.fire(k.TRAVERSAL_START);
      const c = He(
        o.current,
        o.backend.nodes[a],
        o.backend.nodes
      ), p = [];
      for (let d = 0; d < c.length - 1; ++d) {
        const h = i(c[d]), v = i(c[d + 1]);
        St(h, v) ? N(h) && p.push(
          ...h.sideEffects.undo
        ) : N(v) && p.push(...v.sideEffects.do);
      }
      for (const d of p) {
        const h = e.get(d.type).func;
        await h(d.payload);
      }
      o.update(o.changeCurrent(a)), n.fire(k.TRAVERSAL_END);
    },
    undo() {
      const { current: a } = o;
      return N(a) ? this.to(a.parent) : Promise.resolve(console.warn("Already at root!"));
    },
    redo(a = "latest") {
      const { current: c } = o;
      return c.children.length > 0 ? this.to(
        c.children[a === "oldest" ? 0 : c.children.length - 1]
      ) : Promise.resolve(
        console.warn("Already at latest in this branch!")
      );
    },
    currentChange(a, c = !1) {
      return o.currentChange(a, {
        skipOnNew: c
      });
    },
    done() {
      console.log("Setup later for URL sharing.");
    },
    tree() {
      return Ke(o.root, o.backend.nodes);
    },
    on(a, c) {
      n.listen(a, c);
    },
    export() {
      return JSON.stringify(o.backend);
    },
    exportObject() {
      return JSON.parse(
        JSON.stringify(o.backend)
      );
    },
    import(a) {
      const c = JSON.parse(a), p = c.current;
      c.current = c.root, o.update(o.load(c)), this.to(p);
    },
    importObject(a) {
      const c = a.current;
      a.current = a.root, o.update(o.load(a)), this.to(c);
    },
    metadata: u,
    artifact: f,
    annotations: l,
    bookmarks: s
  };
}
function Tt(e, t, r) {
  let [n, o] = [e, t];
  n.level > o.level && ([n, o] = [o, n]);
  let i = o.level - n.level;
  for (; N(o) && i !== 0; )
    o = r[o.parent], i -= 1;
  if (n.id === o.id)
    return n.id;
  for (; n.id !== o.id; )
    N(n) && (n = r[n.parent]), N(o) && (o = r[o.parent]);
  return n.id;
}
function He(e, t, r) {
  const n = Tt(e, t, r), o = r[n], i = [], u = [];
  let [f, l] = [e, t];
  for (; f.id !== o.id; )
    i.push(f), N(f) && (f = r[f.parent]);
  for (i.push(f); l.id !== o.id; )
    u.push(l), N(l) && (l = r[l.parent]);
  const s = u.reverse();
  return [...i, ...s].map((a) => a.id);
}
function St(e, t) {
  if (N(e) && e.parent === t.id)
    return !0;
  if (N(t) && t.parent === e.id)
    return !1;
  throw new Error(
    "Incorrect use of function. Nodes are not connected to each other."
  );
}
function Ke(e, t) {
  return {
    ...e,
    children: e.children.map((r) => Ke(t[r], t)),
    name: `${e.label}`
  };
}
nt();
function Rt(e) {
  return e.length === 2 ? xe(e) : e;
}
class Be {
  static create() {
    return new Be();
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
    const { label: i = t, eventType: u = t } = n || {};
    return this.registry.set(t, {
      func: Rt(r),
      config: {
        hasSideEffects: !o,
        label: typeof i == "string" ? () => i : i,
        eventType: u
      }
    }), U(t);
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
  Be as Registry,
  k as TrrackEvents,
  U as createAction,
  qe as createRootNode,
  Xe as createStateNode,
  $e as initEventManager,
  Nt as initializeProvenanceGraph,
  It as initializeTrrack,
  Dt as isRootNode,
  N as isStateNode
};
//# sourceMappingURL=index.mjs.map
