import { createAction as m, createSlice as _, configureStore as C, createListenerMiddleware as M, combineReducers as D, isAsyncThunkAction as G, isFulfilled as O, isAnyOf as I } from "@reduxjs/toolkit";
import { initializeTrrack as $, Registry as z } from "@trrack/core";
const f = m("NO_OP"), w = Symbol("label"), N = Symbol("do_undo_action_creators"), h = Symbol("trrackable"), B = Symbol("events"), P = Symbol("action_name_type_map"), L = Symbol("async_thunks");
function H(e) {
  const r = {};
  return Object.entries(e.actions).forEach(
    ([n, t]) => {
      r[n] = t.type;
    }
  ), r;
}
function K(e, r, n) {
  const t = {};
  return n.forEach((s) => {
    const c = s.typePrefix, o = r[c];
    if (!o) {
      t[c] = () => c;
      return;
    }
    if (typeof o == "string") {
      t[c] = () => o;
      return;
    }
    throw typeof o == "function" && (t[c] = o), new Error(`Error creating label generator for ${c.toString()}`);
  }), Object.entries(e.actions).forEach(
    ([s, c]) => {
      const o = r[s];
      if (!o) {
        t[c.type] = () => c.type;
        return;
      }
      if (typeof o == "string") {
        t[c.type] = () => o;
        return;
      }
      if (typeof o == "function") {
        t[c.type] = o;
        return;
      }
      throw new Error(
        `Error creating label generator for ${s.toString()}: ${c.type}`
      );
    }
  ), t;
}
function Y(e, r, n) {
  const t = {};
  return n.forEach((s) => {
    const c = s.typePrefix, o = r[c];
    o ? t[c] = o : t[c] = c;
  }), Object.entries(e.actions).forEach(
    ([s, c]) => {
      const o = r[s];
      o ? t[c.type] = o : t[c.type] = c.type;
    }
  ), t;
}
function F(e, r, n) {
  const t = {};
  return n.forEach((s) => {
    const c = s.typePrefix, o = r[c];
    if (o) {
      const d = (l) => {
        const { do: y, undo: u } = o(l);
        return {
          do: y || f(),
          undo: u
        };
      };
      t[c] = d;
    } else {
      const d = () => ({
        do: f(),
        undo: f()
      });
      t[c] = d;
    }
  }), Object.entries(e.actions).forEach(
    ([s, c]) => {
      const o = r[s];
      o ? t[c.type] = (d) => {
        const { do: l, undo: y } = o(d);
        return {
          do: l || f(),
          undo: y
        };
      } : t[c.type] = () => ({
        do: f(),
        undo: f()
      });
    }
  ), t;
}
function se(e) {
  const r = _(e), n = H(r), t = K(
    r,
    e.labels || {},
    e.asyncThunks || []
  ), s = Y(
    r,
    e.reducerEventTypes || {},
    e.asyncThunks || []
  ), c = F(
    r,
    e.doUndoActionCreators || {},
    e.asyncThunks || []
  );
  return {
    ...r,
    [w]: t,
    [B]: s,
    [N]: c,
    [h]: !0,
    [P]: n,
    [L]: e.asyncThunks || []
  };
}
function g(e) {
  return h ? h in e : !1;
}
const V = {
  current: null
}, U = _({
  name: "trrack",
  initialState: V,
  reducers: {
    changeCurrent: (e, r) => ({
      current: r.payload
    })
  }
}), { changeCurrent: q } = U.actions;
function J(e) {
  return C({
    reducer: U.reducer,
    preloadedState: e
  });
}
const j = m("traverse", function(r) {
  return {
    payload: r
  };
});
function Q(e) {
  return e.type === j.type;
}
function W(e) {
  return function(r, n) {
    return Q(n) ? e(n.payload, n) : e(r, n);
  };
}
function X(e) {
  return e.reduce((r, n) => g(n) ? { ...r, ...n[w] } : r, {});
}
function Z(e) {
  return e.reduce((r, n) => g(n) ? { ...r, ...n[N] } : r, {});
}
function ee(e) {
  return e.reduce((r, n) => g(n) ? { ...r, ...n[P] } : r, {});
}
function re(e) {
  return e.reduce((r, n) => {
    if (g(n)) {
      const t = {};
      return n[L].forEach((s) => {
        t[s.typePrefix] = s, t[s.fulfilled.type] = s;
      }), { ...r, ...t };
    }
    return r;
  }, {});
}
function te(e) {
  return e.reduce((r, n) => g(n) ? [
    ...r,
    ...Object.values(n.actions)
  ] : r, []);
}
function ae(e) {
  const r = M(), n = e.reducer, t = C({
    ...e,
    reducer: W(
      typeof n == "function" ? n : D(n)
    ),
    middleware(a) {
      const i = e.middleware;
      return i ? typeof i == "function" ? [
        ...i(a),
        r.middleware
      ] : [...i, r.middleware] : a().prepend(r.middleware);
    }
  }), s = r.startListening, c = X(e.slices), o = Z(e.slices), d = ee(e.slices), l = re(e.slices), y = te(e.slices), u = $({
    initialState: t.getState(),
    registry: z.create()
  });
  let T = "active";
  Object.values(l).forEach((a) => {
    u.registry.has(a.typePrefix) || u.registry.register(a.typePrefix, (i) => (T = "paused", t.dispatch(a(i)).then(() => T = "active")));
  }), e.slices.forEach((a) => {
    Object.values(a.actions).forEach((i) => {
      u.registry.register(i.type, (p) => t.dispatch(p));
    });
  });
  const k = J({
    current: u.current.id
  });
  return u.currentChange(() => {
    T = "paused", t.dispatch(j(u.getState())), k.dispatch(q(u.current.id)), T = "active";
  }), s({
    predicate(a) {
      return u.isTraversing || T === "paused" ? !1 : G(a) ? O(a) : I(y[0], ...y)(a);
    },
    effect(a, i) {
      const p = O(a), S = p ? l[a.type].typePrefix : a.type, x = a.payload, R = c[S], v = R(x), A = o[S]({
        action: a,
        currentState: i.getState(),
        previousState: i.getOriginalState()
      });
      if (!f.match(A.undo)) {
        const E = A.undo, b = f.match(A.do) ? a : A.do;
        u.record({
          label: v,
          state: i.getState(),
          eventType: d[S],
          sideEffects: {
            do: [
              {
                type: p ? S : b.type,
                payload: p ? b.payload : b
              }
            ],
            undo: [
              {
                type: E.type,
                payload: p ? E.payload : E
              }
            ]
          },
          onlySideEffects: !0
        });
      } else
        u.record({
          label: v,
          state: i.getState(),
          eventType: d[S],
          sideEffects: {
            do: [],
            undo: []
          }
        });
    }
  }), { store: t, trrack: u, trrackStore: k };
}
function ie(e) {
  return Array.isArray(e);
}
function ue(e, r) {
  return m(e, function(t) {
    return {
      payload: t
    };
  })(r);
}
export {
  P as ACTION_NAME_TYPE_MAP,
  L as ASYNC_THUNKS,
  N as DO_UNDO_ACTION_CREATORS,
  B as EVENTS,
  w as LABELS,
  f as NO_OP_ACTION,
  h as TRRACKABLE,
  ue as asyncDoUndoActionCreatorHelper,
  q as changeCurrent,
  ae as configureTrrackableStore,
  se as createTrrackableSlice,
  J as getTrrackStore,
  ie as isMiddlewareArray,
  g as isSliceTrrackable,
  j as trrackTraverseAction
};
//# sourceMappingURL=index.mjs.map
