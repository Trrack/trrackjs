import He, { useMemo as $, useState as Y, useEffect as ae, useRef as _r } from "react";
import * as K from "d3";
import { stratify as Cr } from "d3";
import { useTransition as qe, easings as V, animated as N, useSpring as Z } from "react-spring";
import { Tooltip as Je, Stack as ie, Text as oe, Popover as be, Textarea as Tr, Group as Xe, Button as Ne } from "@mantine/core";
import { isStateNode as Ke } from "@trrack/core";
import { faEdit as Or } from "@fortawesome/free-solid-svg-icons/faEdit";
import { FontAwesomeIcon as Ze } from "@fortawesome/react-fontawesome";
import { faBookmark as Pr } from "@fortawesome/free-solid-svg-icons/faBookmark";
import { useResizeObserver as Dr } from "@mantine/hooks";
import jr from "react-dom";
import { createRoot as Ar } from "react-dom/client";
var we = { exports: {} }, J = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ze;
function Wr() {
  if (ze)
    return J;
  ze = 1;
  var i = He, u = Symbol.for("react.element"), a = Symbol.for("react.fragment"), r = Object.prototype.hasOwnProperty, s = i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, o = { key: !0, ref: !0, __self: !0, __source: !0 };
  function h(p, d, y) {
    var v, g = {}, T = null, A = null;
    y !== void 0 && (T = "" + y), d.key !== void 0 && (T = "" + d.key), d.ref !== void 0 && (A = d.ref);
    for (v in d)
      r.call(d, v) && !o.hasOwnProperty(v) && (g[v] = d[v]);
    if (p && p.defaultProps)
      for (v in d = p.defaultProps, d)
        g[v] === void 0 && (g[v] = d[v]);
    return { $$typeof: u, type: p, key: T, ref: A, props: g, _owner: s.current };
  }
  return J.Fragment = a, J.jsx = h, J.jsxs = h, J;
}
var X = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ue;
function Fr() {
  return Ue || (Ue = 1, process.env.NODE_ENV !== "production" && function() {
    var i = He, u = Symbol.for("react.element"), a = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), s = Symbol.for("react.strict_mode"), o = Symbol.for("react.profiler"), h = Symbol.for("react.provider"), p = Symbol.for("react.context"), d = Symbol.for("react.forward_ref"), y = Symbol.for("react.suspense"), v = Symbol.for("react.suspense_list"), g = Symbol.for("react.memo"), T = Symbol.for("react.lazy"), A = Symbol.for("react.offscreen"), L = Symbol.iterator, j = "@@iterator";
    function S(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = L && e[L] || e[j];
      return typeof t == "function" ? t : null;
    }
    var k = i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function R(e) {
      {
        for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), c = 1; c < t; c++)
          n[c - 1] = arguments[c];
        le("error", e, n);
      }
    }
    function le(e, t, n) {
      {
        var c = k.ReactDebugCurrentFrame, w = c.getStackAddendum();
        w !== "" && (t += "%s", n = n.concat([w]));
        var E = n.map(function(b) {
          return String(b);
        });
        E.unshift("Warning: " + t), Function.prototype.apply.call(console[e], console, E);
      }
    }
    var se = !1, l = !1, C = !1, P = !1, W = !1, G;
    G = Symbol.for("react.module.reference");
    function ue(e) {
      return !!(typeof e == "string" || typeof e == "function" || e === r || e === o || W || e === s || e === y || e === v || P || e === A || se || l || C || typeof e == "object" && e !== null && (e.$$typeof === T || e.$$typeof === g || e.$$typeof === h || e.$$typeof === p || e.$$typeof === d || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      e.$$typeof === G || e.getModuleId !== void 0));
    }
    function ce(e, t, n) {
      var c = e.displayName;
      if (c)
        return c;
      var w = t.displayName || t.name || "";
      return w !== "" ? n + "(" + w + ")" : n;
    }
    function Ee(e) {
      return e.displayName || "Context";
    }
    function I(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && R("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case r:
          return "Fragment";
        case a:
          return "Portal";
        case o:
          return "Profiler";
        case s:
          return "StrictMode";
        case y:
          return "Suspense";
        case v:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case p:
            var t = e;
            return Ee(t) + ".Consumer";
          case h:
            var n = e;
            return Ee(n._context) + ".Provider";
          case d:
            return ce(e, e.render, "ForwardRef");
          case g:
            var c = e.displayName || null;
            return c !== null ? c : I(e.type) || "Memo";
          case T: {
            var w = e, E = w._payload, b = w._init;
            try {
              return I(b(E));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var B = Object.assign, H = 0, Re, Se, xe, ke, _e, Ce, Te;
    function Oe() {
    }
    Oe.__reactDisabledLog = !0;
    function rr() {
      {
        if (H === 0) {
          Re = console.log, Se = console.info, xe = console.warn, ke = console.error, _e = console.group, Ce = console.groupCollapsed, Te = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: Oe,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        H++;
      }
    }
    function tr() {
      {
        if (H--, H === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: B({}, e, {
              value: Re
            }),
            info: B({}, e, {
              value: Se
            }),
            warn: B({}, e, {
              value: xe
            }),
            error: B({}, e, {
              value: ke
            }),
            group: B({}, e, {
              value: _e
            }),
            groupCollapsed: B({}, e, {
              value: Ce
            }),
            groupEnd: B({}, e, {
              value: Te
            })
          });
        }
        H < 0 && R("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var de = k.ReactCurrentDispatcher, fe;
    function Q(e, t, n) {
      {
        if (fe === void 0)
          try {
            throw Error();
          } catch (w) {
            var c = w.stack.trim().match(/\n( *(at )?)/);
            fe = c && c[1] || "";
          }
        return `
` + fe + e;
      }
    }
    var he = !1, ee;
    {
      var nr = typeof WeakMap == "function" ? WeakMap : Map;
      ee = new nr();
    }
    function Pe(e, t) {
      if (!e || he)
        return "";
      {
        var n = ee.get(e);
        if (n !== void 0)
          return n;
      }
      var c;
      he = !0;
      var w = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var E;
      E = de.current, de.current = null, rr();
      try {
        if (t) {
          var b = function() {
            throw Error();
          };
          if (Object.defineProperty(b.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(b, []);
            } catch (M) {
              c = M;
            }
            Reflect.construct(e, [], b);
          } else {
            try {
              b.call();
            } catch (M) {
              c = M;
            }
            e.call(b.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (M) {
            c = M;
          }
          e();
        }
      } catch (M) {
        if (M && c && typeof M.stack == "string") {
          for (var m = M.stack.split(`
`), O = c.stack.split(`
`), x = m.length - 1, _ = O.length - 1; x >= 1 && _ >= 0 && m[x] !== O[_]; )
            _--;
          for (; x >= 1 && _ >= 0; x--, _--)
            if (m[x] !== O[_]) {
              if (x !== 1 || _ !== 1)
                do
                  if (x--, _--, _ < 0 || m[x] !== O[_]) {
                    var D = `
` + m[x].replace(" at new ", " at ");
                    return e.displayName && D.includes("<anonymous>") && (D = D.replace("<anonymous>", e.displayName)), typeof e == "function" && ee.set(e, D), D;
                  }
                while (x >= 1 && _ >= 0);
              break;
            }
        }
      } finally {
        he = !1, de.current = E, tr(), Error.prepareStackTrace = w;
      }
      var U = e ? e.displayName || e.name : "", Ve = U ? Q(U) : "";
      return typeof e == "function" && ee.set(e, Ve), Ve;
    }
    function ar(e, t, n) {
      return Pe(e, !1);
    }
    function ir(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function re(e, t, n) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return Pe(e, ir(e));
      if (typeof e == "string")
        return Q(e);
      switch (e) {
        case y:
          return Q("Suspense");
        case v:
          return Q("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case d:
            return ar(e.render);
          case g:
            return re(e.type, t, n);
          case T: {
            var c = e, w = c._payload, E = c._init;
            try {
              return re(E(w), t, n);
            } catch {
            }
          }
        }
      return "";
    }
    var te = Object.prototype.hasOwnProperty, De = {}, je = k.ReactDebugCurrentFrame;
    function ne(e) {
      if (e) {
        var t = e._owner, n = re(e.type, e._source, t ? t.type : null);
        je.setExtraStackFrame(n);
      } else
        je.setExtraStackFrame(null);
    }
    function or(e, t, n, c, w) {
      {
        var E = Function.call.bind(te);
        for (var b in e)
          if (E(e, b)) {
            var m = void 0;
            try {
              if (typeof e[b] != "function") {
                var O = Error((c || "React class") + ": " + n + " type `" + b + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[b] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw O.name = "Invariant Violation", O;
              }
              m = e[b](t, b, c, n, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (x) {
              m = x;
            }
            m && !(m instanceof Error) && (ne(w), R("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", c || "React class", n, b, typeof m), ne(null)), m instanceof Error && !(m.message in De) && (De[m.message] = !0, ne(w), R("Failed %s type: %s", n, m.message), ne(null));
          }
      }
    }
    var lr = Array.isArray;
    function pe(e) {
      return lr(e);
    }
    function sr(e) {
      {
        var t = typeof Symbol == "function" && Symbol.toStringTag, n = t && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return n;
      }
    }
    function ur(e) {
      try {
        return Ae(e), !1;
      } catch {
        return !0;
      }
    }
    function Ae(e) {
      return "" + e;
    }
    function We(e) {
      if (ur(e))
        return R("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", sr(e)), Ae(e);
    }
    var q = k.ReactCurrentOwner, cr = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, Fe, Ie, ve;
    ve = {};
    function dr(e) {
      if (te.call(e, "ref")) {
        var t = Object.getOwnPropertyDescriptor(e, "ref").get;
        if (t && t.isReactWarning)
          return !1;
      }
      return e.ref !== void 0;
    }
    function fr(e) {
      if (te.call(e, "key")) {
        var t = Object.getOwnPropertyDescriptor(e, "key").get;
        if (t && t.isReactWarning)
          return !1;
      }
      return e.key !== void 0;
    }
    function hr(e, t) {
      if (typeof e.ref == "string" && q.current && t && q.current.stateNode !== t) {
        var n = I(q.current.type);
        ve[n] || (R('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', I(q.current.type), e.ref), ve[n] = !0);
      }
    }
    function pr(e, t) {
      {
        var n = function() {
          Fe || (Fe = !0, R("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", t));
        };
        n.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: n,
          configurable: !0
        });
      }
    }
    function vr(e, t) {
      {
        var n = function() {
          Ie || (Ie = !0, R("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", t));
        };
        n.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: n,
          configurable: !0
        });
      }
    }
    var mr = function(e, t, n, c, w, E, b) {
      var m = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: u,
        // Built-in properties that belong on the element
        type: e,
        key: t,
        ref: n,
        props: b,
        // Record the component responsible for creating this element.
        _owner: E
      };
      return m._store = {}, Object.defineProperty(m._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(m, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: c
      }), Object.defineProperty(m, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: w
      }), Object.freeze && (Object.freeze(m.props), Object.freeze(m)), m;
    };
    function yr(e, t, n, c, w) {
      {
        var E, b = {}, m = null, O = null;
        n !== void 0 && (We(n), m = "" + n), fr(t) && (We(t.key), m = "" + t.key), dr(t) && (O = t.ref, hr(t, w));
        for (E in t)
          te.call(t, E) && !cr.hasOwnProperty(E) && (b[E] = t[E]);
        if (e && e.defaultProps) {
          var x = e.defaultProps;
          for (E in x)
            b[E] === void 0 && (b[E] = x[E]);
        }
        if (m || O) {
          var _ = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          m && pr(b, _), O && vr(b, _);
        }
        return mr(e, m, O, w, c, q.current, b);
      }
    }
    var me = k.ReactCurrentOwner, Me = k.ReactDebugCurrentFrame;
    function z(e) {
      if (e) {
        var t = e._owner, n = re(e.type, e._source, t ? t.type : null);
        Me.setExtraStackFrame(n);
      } else
        Me.setExtraStackFrame(null);
    }
    var ye;
    ye = !1;
    function ge(e) {
      return typeof e == "object" && e !== null && e.$$typeof === u;
    }
    function $e() {
      {
        if (me.current) {
          var e = I(me.current.type);
          if (e)
            return `

Check the render method of \`` + e + "`.";
        }
        return "";
      }
    }
    function gr(e) {
      {
        if (e !== void 0) {
          var t = e.fileName.replace(/^.*[\\\/]/, ""), n = e.lineNumber;
          return `

Check your code at ` + t + ":" + n + ".";
        }
        return "";
      }
    }
    var Le = {};
    function br(e) {
      {
        var t = $e();
        if (!t) {
          var n = typeof e == "string" ? e : e.displayName || e.name;
          n && (t = `

Check the top-level render call using <` + n + ">.");
        }
        return t;
      }
    }
    function Ge(e, t) {
      {
        if (!e._store || e._store.validated || e.key != null)
          return;
        e._store.validated = !0;
        var n = br(t);
        if (Le[n])
          return;
        Le[n] = !0;
        var c = "";
        e && e._owner && e._owner !== me.current && (c = " It was passed a child from " + I(e._owner.type) + "."), z(e), R('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', n, c), z(null);
      }
    }
    function Be(e, t) {
      {
        if (typeof e != "object")
          return;
        if (pe(e))
          for (var n = 0; n < e.length; n++) {
            var c = e[n];
            ge(c) && Ge(c, t);
          }
        else if (ge(e))
          e._store && (e._store.validated = !0);
        else if (e) {
          var w = S(e);
          if (typeof w == "function" && w !== e.entries)
            for (var E = w.call(e), b; !(b = E.next()).done; )
              ge(b.value) && Ge(b.value, t);
        }
      }
    }
    function wr(e) {
      {
        var t = e.type;
        if (t == null || typeof t == "string")
          return;
        var n;
        if (typeof t == "function")
          n = t.propTypes;
        else if (typeof t == "object" && (t.$$typeof === d || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        t.$$typeof === g))
          n = t.propTypes;
        else
          return;
        if (n) {
          var c = I(t);
          or(n, e.props, "prop", c, e);
        } else if (t.PropTypes !== void 0 && !ye) {
          ye = !0;
          var w = I(t);
          R("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", w || "Unknown");
        }
        typeof t.getDefaultProps == "function" && !t.getDefaultProps.isReactClassApproved && R("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function Er(e) {
      {
        for (var t = Object.keys(e.props), n = 0; n < t.length; n++) {
          var c = t[n];
          if (c !== "children" && c !== "key") {
            z(e), R("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", c), z(null);
            break;
          }
        }
        e.ref !== null && (z(e), R("Invalid attribute `ref` supplied to `React.Fragment`."), z(null));
      }
    }
    function Ye(e, t, n, c, w, E) {
      {
        var b = ue(e);
        if (!b) {
          var m = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (m += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var O = gr(w);
          O ? m += O : m += $e();
          var x;
          e === null ? x = "null" : pe(e) ? x = "array" : e !== void 0 && e.$$typeof === u ? (x = "<" + (I(e.type) || "Unknown") + " />", m = " Did you accidentally export a JSX literal instead of a component?") : x = typeof e, R("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", x, m);
        }
        var _ = yr(e, t, n, w, E);
        if (_ == null)
          return _;
        if (b) {
          var D = t.children;
          if (D !== void 0)
            if (c)
              if (pe(D)) {
                for (var U = 0; U < D.length; U++)
                  Be(D[U], e);
                Object.freeze && Object.freeze(D);
              } else
                R("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              Be(D, e);
        }
        return e === r ? Er(_) : wr(_), _;
      }
    }
    function Rr(e, t, n) {
      return Ye(e, t, n, !0);
    }
    function Sr(e, t, n) {
      return Ye(e, t, n, !1);
    }
    var xr = Sr, kr = Rr;
    X.Fragment = r, X.jsx = xr, X.jsxs = kr;
  }()), X;
}
process.env.NODE_ENV === "production" ? we.exports = Wr() : we.exports = Fr();
var Qe = we.exports;
const f = Qe.jsx, F = Qe.jsxs;
function Ir(i) {
  return {
    glyph: () => /* @__PURE__ */ f("circle", { r: 5, fill: "white", stroke: i, strokeWidth: 2 }),
    currentGlyph: () => /* @__PURE__ */ f("circle", { r: 5, fill: i, stroke: i, strokeWidth: 2 }),
    backboneGlyph: () => /* @__PURE__ */ f("circle", { r: 5, fill: "white", stroke: i, strokeWidth: 2 }),
    bundleGlyph: () => /* @__PURE__ */ f("circle", { r: 5, fill: "white", stroke: i, strokeWidth: 2 }),
    hoverGlyph: () => /* @__PURE__ */ f("circle", { r: 6, fill: "white", stroke: i, strokeWidth: 2 })
  };
}
function Mr(i) {
  var a;
  const u = (a = K.color(i)) == null ? void 0 : a.brighter().toString();
  return {
    glyph: () => /* @__PURE__ */ f(
      "circle",
      {
        r: 5,
        fill: "#413839",
        stroke: u,
        strokeWidth: 2
      }
    ),
    currentGlyph: () => /* @__PURE__ */ f(
      "circle",
      {
        r: 5,
        fill: u,
        stroke: u,
        strokeWidth: 2
      }
    ),
    backboneGlyph: () => /* @__PURE__ */ f(
      "circle",
      {
        r: 5,
        fill: "#413839",
        stroke: u,
        strokeWidth: 2
      }
    ),
    bundleGlyph: () => /* @__PURE__ */ f(
      "circle",
      {
        r: 5,
        fill: "#413839",
        stroke: u,
        strokeWidth: 2
      }
    ),
    hoverGlyph: () => /* @__PURE__ */ f(
      "circle",
      {
        r: 6,
        fill: "#413839",
        stroke: u,
        strokeWidth: 2
      }
    )
  };
}
function $r({
  width: i,
  depth: u,
  yOffset: a,
  onClick: r,
  config: s,
  node: o,
  currentNode: h,
  nodes: p,
  isHover: d,
  setHover: y,
  colorMap: v,
  xOffset: g,
  extraHeight: T
}) {
  var j;
  const A = qe([o], {
    config: {
      duration: s.animationDuration,
      easing: V.easeInOutSine
    },
    keys: [o.id],
    from: {
      opacity: 0,
      transform: `translate(${-i * s.gutter + g} , ${(u - 1) * s.verticalSpace + a})`
    },
    enter: {
      delay: (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ((j = p[o.id].parent) == null ? void 0 : j.children.length) > 1 ? s.animationDuration / 3 : 0
      ),
      opacity: 1,
      transform: `translate(${-i * s.gutter + g} , ${u * s.verticalSpace + a})`
    },
    update: {
      opacity: 1,
      transform: `translate(${-i * s.gutter + g} , ${u * s.verticalSpace + a + T})`
    }
  }), L = $(() => {
    var R;
    const S = (R = s.iconConfig) == null ? void 0 : R[o.event], k = s.isDarkMode ? Mr(v[o.event]) : Ir(v[o.event]);
    return S && S.glyph ? o.id === h && S.currentGlyph ? S.currentGlyph(o) : d && S.hoverGlyph ? S.hoverGlyph(o) : i === 0 && S.backboneGlyph ? S.backboneGlyph(o) : S.glyph(o) : o.id === h ? k.currentGlyph(o) : d ? k.hoverGlyph(o) : i === 0 ? k.backboneGlyph(o) : k.glyph(o);
  }, [
    s.iconConfig,
    s.isDarkMode,
    o,
    v,
    h,
    d,
    i
  ]);
  return A((S) => /* @__PURE__ */ f(
    N.g,
    {
      ...S,
      cursor: "pointer",
      onClick: r,
      className: "provenance-node",
      "data-node-id": o.id,
      onMouseOver: () => {
        S.transform.isAnimating || y(o.id);
      },
      onMouseOut: () => y(null),
      children: /* @__PURE__ */ f(
        Je,
        {
          position: "top-start",
          openDelay: 200,
          withinPortal: !0,
          withArrow: !0,
          color: "gray",
          multiline: !0,
          sx: { maxWidth: "200px" },
          label: /* @__PURE__ */ F(ie, { spacing: 0, children: [
            /* @__PURE__ */ f(oe, { weight: 600, children: o.label }),
            s.getAnnotation(o.id).length > 0 ? /* @__PURE__ */ f(oe, { size: "xs", children: s.getAnnotation(o.id) }) : null
          ] }),
          children: L
        }
      )
    }
  ));
}
function Lr({
  x1Width: i,
  x2Width: u,
  y1Depth: a,
  y2Depth: r,
  y1Offset: s,
  y2Offset: o,
  config: h,
  xOffset: p,
  uniqueKey: d,
  nodes: y,
  parentNode: v
}) {
  return qe([d], {
    config: {
      duration: h.animationDuration,
      easing: V.easeInOutSine
    },
    keys: [d],
    from: {
      opacity: 0,
      y1: (a - 1) * h.verticalSpace + s,
      y2: (r - 1) * h.verticalSpace + o
    },
    enter: {
      delay: (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        y[v.id].children.length > 1 ? h.animationDuration / 3 : 0
      ),
      opacity: 1,
      x1: -i * h.gutter + p,
      x2: -u * h.gutter + p,
      y1: a * h.verticalSpace + s,
      y2: r * h.verticalSpace + o
    },
    update: {
      opacity: 1,
      x1: -i * h.gutter + p,
      x2: -u * h.gutter + p,
      y1: a * h.verticalSpace + s,
      y2: r * h.verticalSpace + o
    }
  })((T) => /* @__PURE__ */ f(
    N.line,
    {
      ...T,
      stroke: h.isDarkMode ? "white" : "black",
      pointerEvents: "none"
    }
  ));
}
function Gr({
  color: i,
  annotation: u,
  setAnnotation: a,
  setAnnotationOpen: r,
  annotationOpen: s
}) {
  const [o, h] = Y(!1), [p, d] = Y(u);
  return /* @__PURE__ */ f(
    "div",
    {
      style: {
        marginRight: "5px",
        color: s || o ? i : "lightgray"
      },
      onClick: (y) => y.stopPropagation(),
      onMouseEnter: () => h(!0),
      onMouseLeave: () => h(!1),
      children: /* @__PURE__ */ F(
        be,
        {
          width: 150,
          trapFocus: !0,
          position: "bottom",
          withArrow: !0,
          arrowSize: 10,
          shadow: "md",
          onChange: r,
          opened: s,
          children: [
            /* @__PURE__ */ f(be.Target, { children: /* @__PURE__ */ f(
              Ze,
              {
                icon: Or,
                onClick: (y) => {
                  y.stopPropagation(), r(!s);
                }
              }
            ) }),
            /* @__PURE__ */ f(
              be.Dropdown,
              {
                sx: (y) => ({
                  background: y.colorScheme === "dark" ? y.colors.dark[7] : y.white
                }),
                children: /* @__PURE__ */ F(ie, { spacing: 4, children: [
                  /* @__PURE__ */ f(
                    Tr,
                    {
                      autosize: !0,
                      maxRows: 10,
                      label: "Annotation",
                      value: p,
                      size: "xs",
                      mt: 0,
                      onChange: (y) => d(y.currentTarget.value)
                    }
                  ),
                  /* @__PURE__ */ F(Xe, { position: "right", spacing: 4, children: [
                    /* @__PURE__ */ f(
                      Ne,
                      {
                        compact: !0,
                        onClick: (y) => {
                          y.stopPropagation(), r(!1);
                        },
                        size: "xs",
                        variant: "outline",
                        children: "Close"
                      }
                    ),
                    /* @__PURE__ */ f(
                      Ne,
                      {
                        compact: !0,
                        onClick: (y) => {
                          y.stopPropagation(), a(p), r(!1);
                        },
                        size: "xs",
                        children: "Save"
                      }
                    )
                  ] })
                ] })
              }
            )
          ]
        }
      )
    }
  );
}
function Br({
  onClick: i,
  isBookmarked: u,
  color: a
}) {
  const [r, s] = Y(!1);
  return /* @__PURE__ */ f(
    "div",
    {
      style: {
        marginRight: "5px",
        color: u || r ? a : "lightgray"
      },
      onClick: (o) => {
        o.stopPropagation(), i();
      },
      onMouseEnter: () => s(!0),
      onMouseLeave: () => s(!1),
      children: /* @__PURE__ */ f(Ze, { icon: Pr })
    }
  );
}
function Yr({
  depth: i,
  yOffset: u,
  node: a,
  config: r,
  onClick: s,
  isHover: o,
  setHover: h,
  colorMap: p,
  isCurrent: d,
  extraHeight: y,
  setExtraHeight: v
}) {
  const [g, { height: T }] = Dr(), A = Z({
    config: {
      duration: r.animationDuration,
      easing: V.easeInOutSine
    },
    top: i * r.verticalSpace + r.marginTop + u - r.verticalSpace / 2 + y
  }), L = Z({
    config: {
      duration: r.animationDuration,
      easing: V.easeInOutSine
    },
    opacity: d ? 1 : 0
  });
  ae(() => {
    d && v(T);
  }, [T, d, v]);
  const [j, S] = Y(!1);
  return /* @__PURE__ */ f(
    N.div,
    {
      style: {
        ...A,
        cursor: "pointer",
        position: "absolute",
        height: r.verticalSpace * 2,
        flexWrap: "wrap",
        width: "100%"
      },
      className: "node-description",
      onClick: s,
      "data-node-id": a.id,
      onMouseEnter: () => h(a.id),
      onMouseLeave: () => h(null),
      children: /* @__PURE__ */ F(ie, { style: { height: "100%" }, spacing: 0, children: [
        /* @__PURE__ */ F(
          Xe,
          {
            spacing: 2,
            noWrap: !0,
            style: { height: r.verticalSpace },
            children: [
              /* @__PURE__ */ f(
                Je,
                {
                  position: "top-start",
                  openDelay: 200,
                  withinPortal: !0,
                  withArrow: !0,
                  color: "gray",
                  multiline: !0,
                  sx: { maxWidth: "200px" },
                  label: /* @__PURE__ */ F(ie, { spacing: 0, children: [
                    /* @__PURE__ */ f(oe, { weight: 600, children: a.label }),
                    r.getAnnotation(a.id).length > 0 ? /* @__PURE__ */ f(oe, { size: "xs", children: r.getAnnotation(a.id) }) : null
                  ] }),
                  children: /* @__PURE__ */ f(
                    "div",
                    {
                      style: {
                        width: `calc(100% - ${r.marginRight}px - ${o || j ? 50 : r.isBookmarked(a.id) ? 25 : 0}px)`,
                        display: "flex",
                        flexDirection: "row",
                        color: r.isDarkMode ? "white" : "black"
                      },
                      children: /* @__PURE__ */ F(
                        "div",
                        {
                          style: {
                            alignItems: "start",
                            justifyContent: "center",
                            display: "flex",
                            flexDirection: "column",
                            marginRight: "auto",
                            width: "100%"
                          },
                          children: [
                            /* @__PURE__ */ f(
                              "p",
                              {
                                style: {
                                  maxWidth: "100%",
                                  margin: 0,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap"
                                },
                                children: a.label
                              }
                            ),
                            Ke(a) ? /* @__PURE__ */ f(
                              "p",
                              {
                                style: {
                                  width: "100%",
                                  margin: 0,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  color: "gray",
                                  fontSize: 10
                                },
                                children: r.getAnnotation(a.id)
                              }
                            ) : null
                          ]
                        }
                      )
                    }
                  )
                }
              ),
              r.bookmarkNode !== null && (o || j || r.isBookmarked(a.id)) ? /* @__PURE__ */ f(
                Br,
                {
                  color: p[a.event],
                  isBookmarked: r.isBookmarked(a.id),
                  onClick: () => {
                    var k;
                    return (k = r.bookmarkNode) == null ? void 0 : k.call(r, a.id);
                  }
                }
              ) : null,
              r.annotateNode !== null && (o || j) ? /* @__PURE__ */ f(
                Gr,
                {
                  color: "cornflowerblue",
                  annotationOpen: j,
                  setAnnotationOpen: (k) => S(k),
                  setAnnotation: (k) => {
                    var R;
                    return (R = r.annotateNode) == null ? void 0 : R.call(r, a.id, k);
                  },
                  annotation: r.getAnnotation(a.id)
                }
              ) : null
            ]
          }
        ),
        d ? /* @__PURE__ */ f(N.div, { style: { ...L }, ref: g, children: r.nodeExtra[a.event] || r.nodeExtra["*"] }) : null
      ] })
    }
  );
}
function Vr({
  nodes: i,
  links: u,
  currentNode: a,
  config: r
}) {
  const [s, o] = Y(null), [h, p] = Y(0), [d, y] = Y(0), v = _r(null);
  ae(() => {
    p(0);
  }, [a]);
  const g = $(() => Math.max(
    ...Object.values(i).map((l) => l.width ? l.width : 0)
    // config.nodeWidthShown
  ), [i]), T = $(() => Math.max(
    ...Object.values(i).map(
      (l) => l.height ? l.height : 0
    )
  ), [i]), A = Z({
    config: {
      duration: r.animationDuration,
      easing: V.easeInOutSine
    },
    width: `${r.labelWidth + r.marginRight + (r.nodeWidthShown - g > 0 ? (r.nodeWidthShown - g) * r.gutter : 0)}px`
  }), L = Z({
    config: {
      duration: r.animationDuration,
      easing: V.easeInOutSine
    },
    width: `${(g > r.nodeWidthShown ? r.nodeWidthShown : g) * r.gutter + r.marginLeft + r.nodeAndLabelGap}px`
  }), j = Z({
    config: {
      duration: r.animationDuration,
      easing: V.easeInOutSine
    },
    immediate: h !== 0,
    transform: `translate(${r.marginLeft + h}, ${r.marginTop})`
  }), S = $(() => {
    const l = [
      "#1F77B4",
      "#FF7F0E",
      "#2CA02C",
      "#D62728",
      "#9467BD",
      "#8C564B",
      "#CFECF9",
      "#7F7F7F",
      "#BCBD22",
      "#17BECF"
    ];
    let C = 0;
    const P = {};
    return P.Root = r.isDarkMode ? "white" : "black", Object.values(i).forEach((W) => {
      P[W.data.event] || (P[W.data.event] = l[C % 10], C += 1);
    }), P;
  }, [i, r.isDarkMode]), k = $(() => Object.values(i).filter((l) => l.width === 0).map((l) => /* @__PURE__ */ f(
    Yr,
    {
      isCurrent: l.id === a,
      extraHeight: l.depth > i[a].depth ? d : 0,
      setExtraHeight: y,
      config: r,
      depth: l.depth,
      node: l.data,
      currentNode: a,
      onClick: () => r.changeCurrent(l.id),
      isHover: l.id === s,
      setHover: (C) => o(C),
      colorMap: S,
      yOffset: 0
    },
    l.id
  )), [i, a, d, r, s, S]), R = $(() => u.map((l) => {
    const C = l.source.width, P = l.target.width;
    return /* @__PURE__ */ f(
      Lr,
      {
        uniqueKey: l.source.id + l.target.id,
        parentNode: l.source,
        nodes: i,
        x1Width: C,
        x2Width: P,
        y1Depth: l.source.depth,
        y2Depth: l.target.depth,
        config: r,
        xOffset: (g > r.nodeWidthShown ? r.nodeWidthShown : g) * r.gutter,
        y1Offset: l.source.depth > i[a].depth ? d : 0,
        y2Offset: l.target.depth > i[a].depth ? d : 0
      },
      l.source.id + l.target.id
    );
  }), [u, i, r, g, a, d]), le = $(() => Object.values(i).map((l) => /* @__PURE__ */ f(
    $r,
    {
      width: l.width,
      depth: l.depth,
      onClick: () => {
        l.width !== 0 && o(null), r.changeCurrent(l.id);
      },
      nodes: i,
      extraHeight: l.depth > i[a].depth ? d : 0,
      config: r,
      node: l.data,
      currentNode: a,
      isHover: l.id === s,
      setHover: (C) => o(C),
      colorMap: S,
      xOffset: (g > r.nodeWidthShown ? r.nodeWidthShown : g) * r.gutter,
      yOffset: 0
    },
    l.id
  )), [
    i,
    a,
    d,
    r,
    s,
    S,
    g
  ]);
  ae(() => {
    var W, G;
    const l = document.getElementById("panLayer");
    if (!((W = l == null ? void 0 : l.width) != null && W.baseVal) || !((G = l == null ? void 0 : l.height) != null && G.baseVal))
      return;
    const C = K.zoom().scaleExtent([1, 1]).translateExtent([
      [(r.nodeWidthShown - g) * r.gutter, 0],
      [
        (g > r.nodeWidthShown ? r.nodeWidthShown : g) * r.gutter + r.marginLeft + r.nodeAndLabelGap,
        0
      ]
    ]);
    C.on("zoom", (ue) => {
      const { transform: ce } = ue;
      p(ce.x);
    });
    const P = K.select(l);
    C.transform(P, K.zoomIdentity), K.select(l).call(C);
  }, [g, r, a]);
  const se = Object.keys(i).length;
  return ae(() => {
    const l = v.current;
    if (!l)
      return;
    const C = i[a].depth * r.verticalSpace, P = l.scrollTop, W = l.clientHeight, G = C - W + r.verticalSpace + r.marginTop;
    C > P + W - r.verticalSpace && (typeof l.scrollTo == "function" ? l.scrollTo(0, G) : l.scrollTop = G);
  }, [se, r.marginTop, r.verticalSpace, i, a]), /* @__PURE__ */ F(
    "div",
    {
      ref: v,
      style: {
        display: "flex",
        height: "100%",
        gap: "0px",
        overflowY: "auto",
        overflowX: "hidden"
      },
      children: [
        /* @__PURE__ */ f(
          N.div,
          {
            style: {
              height: "100%",
              ...L
            },
            children: /* @__PURE__ */ f(
              "svg",
              {
                id: "panLayer",
                style: {
                  overflow: "hidden",
                  height: `${(T + 1) * r.verticalSpace + r.marginTop + d}px`,
                  width: `${r.nodeWidthShown * r.gutter + r.marginLeft + r.nodeAndLabelGap}px`
                },
                cursor: g > r.nodeWidthShown ? "ew-resize" : "default",
                children: /* @__PURE__ */ F(N.g, { ...j, children: [
                  R,
                  le
                ] })
              }
            )
          }
        ),
        /* @__PURE__ */ f(
          N.div,
          {
            style: {
              position: "relative",
              ...A
            },
            children: k
          }
        )
      ]
    }
  );
}
function Nr(i, u, a, r) {
  const s = /* @__PURE__ */ new Set(), o = [];
  let h = 0;
  for (o.push(i[u]); o.length > 0; ) {
    const p = o.pop();
    s.has(p.id) ? p.width = a[p.id] : (p.width = h, a[p.id] = p.width, s.add(p.id)), p.children ? o.push(
      ...p.children.sort((d, y) => {
        const v = r.includes(d.id) ? 1 : 0, g = r.includes(y.id) ? 1 : 0;
        return v - g;
      })
    ) : h += 1;
  }
}
function er(i, u, a, r) {
  if (!i[u])
    return !1;
  if (u === a)
    return r.push(u), !0;
  const s = i[u].children || [];
  for (const o of s)
    if (er(i, o.id, a, r))
      return r.push(o.id), !0;
  return !1;
}
function zr(i, u, a) {
  const r = [];
  return er(i, u, a, r), [u, ...r.reverse()];
}
function Ur(i, u, a) {
  const r = {}, s = zr(i, a, u);
  return Nr(i, a, r, s), s;
}
function Hr(i, u, a) {
  const { stratifiedMap: r, links: s } = $(() => {
    const o = Object.values(i), p = Cr().id((v) => v.id).parentId((v) => v.id === a ? null : Ke(v) ? v.parent : null)(o), d = p.descendants(), y = {};
    return d.forEach((v) => {
      y[v.id] = v;
    }), Ur(y, u, a), { stratifiedMap: y, links: p.links() };
  }, [u, a, i]);
  return { stratifiedMap: r, links: s };
}
const qr = {
  gutter: 25,
  nodeWidthShown: 3,
  verticalSpace: 30,
  marginTop: 50,
  marginRight: 40,
  marginLeft: 50,
  animationDuration: 500,
  annotationHeight: 150,
  nodeAndLabelGap: 20,
  labelWidth: 150,
  iconConfig: null,
  changeCurrent: () => null,
  bookmarkNode: () => null,
  annotateNode: null,
  getAnnotation: () => "",
  isBookmarked: () => !1,
  isDarkMode: !1,
  nodeExtra: {}
};
function Jr() {
  return qr;
}
function Xr({
  nodeMap: i,
  root: u,
  currentNode: a,
  config: r
}) {
  const { stratifiedMap: s, links: o } = Hr(
    i,
    a,
    u
  ), h = $(() => ({ ...Jr(), ...r }), [r]);
  return /* @__PURE__ */ f(
    Vr,
    {
      nodes: s,
      links: o,
      config: h,
      currentNode: a
    }
  );
}
async function st(i, u, a = {}, r = !1) {
  let s = null;
  function o() {
    const h = /* @__PURE__ */ f(
      Xr,
      {
        root: u.root.id,
        config: {
          changeCurrent: (p) => u.to(p),
          ...a
        },
        nodeMap: u.graph.backend.nodes,
        currentNode: u.current.id
      }
    );
    r ? jr.render(h, i) : (s || (s = Ar(i)), s.render(h));
  }
  u.currentChange(() => {
    o();
  }), o();
}
export {
  Xr as ProvVis,
  st as ProvVisCreator,
  Vr as Tree,
  Mr as defaultDarkmodeIcon,
  Ir as defaultIcon
};
//# sourceMappingURL=index.mjs.map
