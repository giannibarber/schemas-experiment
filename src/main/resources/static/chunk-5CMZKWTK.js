var fd = Object.defineProperty,
  pd = Object.defineProperties;
var hd = Object.getOwnPropertyDescriptors;
var ln = Object.getOwnPropertySymbols;
var ks = Object.prototype.hasOwnProperty,
  Ls = Object.prototype.propertyIsEnumerable;
var Ps = (e, t, n) =>
    t in e
      ? fd(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  be = (e, t) => {
    for (var n in (t ||= {})) ks.call(t, n) && Ps(e, n, t[n]);
    if (ln) for (var n of ln(t)) Ls.call(t, n) && Ps(e, n, t[n]);
    return e;
  },
  Me = (e, t) => pd(e, hd(t));
var ev = (e, t) => {
  var n = {};
  for (var r in e) ks.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && ln)
    for (var r of ln(e)) t.indexOf(r) < 0 && Ls.call(e, r) && (n[r] = e[r]);
  return n;
};
function js(e, t) {
  return Object.is(e, t);
}
var k = null,
  At = !1,
  dn = 1,
  ye = Symbol('SIGNAL');
function E(e) {
  let t = k;
  return (k = e), t;
}
function gd() {
  return At;
}
var Ft = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function Qr(e) {
  if (At) throw new Error('');
  if (k === null) return;
  k.consumerOnSignalRead(e);
  let t = k.nextProducerIndex++;
  if ((at(k), t < k.producerNode.length && k.producerNode[t] !== e && Ot(k))) {
    let n = k.producerNode[t];
    mn(n, k.producerIndexOfThis[t]);
  }
  k.producerNode[t] !== e &&
    ((k.producerNode[t] = e),
    (k.producerIndexOfThis[t] = Ot(k) ? Us(e, k, t) : 0)),
    (k.producerLastReadVersion[t] = e.version);
}
function md() {
  dn++;
}
function Vs(e) {
  if (!(Ot(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === dn)) {
    if (!e.producerMustRecompute(e) && !gn(e)) {
      (e.dirty = !1), (e.lastCleanEpoch = dn);
      return;
    }
    e.producerRecomputeValue(e), (e.dirty = !1), (e.lastCleanEpoch = dn);
  }
}
function Bs(e) {
  if (e.liveConsumerNode === void 0) return;
  let t = At;
  At = !0;
  try {
    for (let n of e.liveConsumerNode) n.dirty || Hs(n);
  } finally {
    At = t;
  }
}
function $s() {
  return k?.consumerAllowSignalWrites !== !1;
}
function Hs(e) {
  (e.dirty = !0), Bs(e), e.consumerMarkedDirty?.(e);
}
function pn(e) {
  return e && (e.nextProducerIndex = 0), E(e);
}
function hn(e, t) {
  if (
    (E(t),
    !(
      !e ||
      e.producerNode === void 0 ||
      e.producerIndexOfThis === void 0 ||
      e.producerLastReadVersion === void 0
    ))
  ) {
    if (Ot(e))
      for (let n = e.nextProducerIndex; n < e.producerNode.length; n++)
        mn(e.producerNode[n], e.producerIndexOfThis[n]);
    for (; e.producerNode.length > e.nextProducerIndex; )
      e.producerNode.pop(),
        e.producerLastReadVersion.pop(),
        e.producerIndexOfThis.pop();
  }
}
function gn(e) {
  at(e);
  for (let t = 0; t < e.producerNode.length; t++) {
    let n = e.producerNode[t],
      r = e.producerLastReadVersion[t];
    if (r !== n.version || (Vs(n), r !== n.version)) return !0;
  }
  return !1;
}
function Zr(e) {
  if ((at(e), Ot(e)))
    for (let t = 0; t < e.producerNode.length; t++)
      mn(e.producerNode[t], e.producerIndexOfThis[t]);
  (e.producerNode.length =
    e.producerLastReadVersion.length =
    e.producerIndexOfThis.length =
      0),
    e.liveConsumerNode &&
      (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
}
function Us(e, t, n) {
  if ((Gs(e), at(e), e.liveConsumerNode.length === 0))
    for (let r = 0; r < e.producerNode.length; r++)
      e.producerIndexOfThis[r] = Us(e.producerNode[r], e, r);
  return e.liveConsumerIndexOfThis.push(n), e.liveConsumerNode.push(t) - 1;
}
function mn(e, t) {
  if ((Gs(e), at(e), e.liveConsumerNode.length === 1))
    for (let r = 0; r < e.producerNode.length; r++)
      mn(e.producerNode[r], e.producerIndexOfThis[r]);
  let n = e.liveConsumerNode.length - 1;
  if (
    ((e.liveConsumerNode[t] = e.liveConsumerNode[n]),
    (e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[n]),
    e.liveConsumerNode.length--,
    e.liveConsumerIndexOfThis.length--,
    t < e.liveConsumerNode.length)
  ) {
    let r = e.liveConsumerIndexOfThis[t],
      o = e.liveConsumerNode[t];
    at(o), (o.producerIndexOfThis[r] = t);
  }
}
function Ot(e) {
  return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
}
function at(e) {
  (e.producerNode ??= []),
    (e.producerIndexOfThis ??= []),
    (e.producerLastReadVersion ??= []);
}
function Gs(e) {
  (e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []);
}
function zs(e) {
  let t = Object.create(yd);
  t.computation = e;
  let n = () => {
    if ((Vs(t), Qr(t), t.value === fn)) throw t.error;
    return t.value;
  };
  return (n[ye] = t), n;
}
var Wr = Symbol('UNSET'),
  qr = Symbol('COMPUTING'),
  fn = Symbol('ERRORED'),
  yd = Me(be({}, Ft), {
    value: Wr,
    dirty: !0,
    error: null,
    equal: js,
    producerMustRecompute(e) {
      return e.value === Wr || e.value === qr;
    },
    producerRecomputeValue(e) {
      if (e.value === qr) throw new Error('Detected cycle in computations.');
      let t = e.value;
      e.value = qr;
      let n = pn(e),
        r;
      try {
        r = e.computation();
      } catch (o) {
        (r = fn), (e.error = o);
      } finally {
        hn(e, n);
      }
      if (t !== Wr && t !== fn && r !== fn && e.equal(t, r)) {
        e.value = t;
        return;
      }
      (e.value = r), e.version++;
    },
  });
function Dd() {
  throw new Error();
}
var Ws = Dd;
function qs() {
  Ws();
}
function Ys(e) {
  Ws = e;
}
var vd = null;
function Qs(e) {
  let t = Object.create(Ks);
  t.value = e;
  let n = () => (Qr(t), t.value);
  return (n[ye] = t), n;
}
function Kr(e, t) {
  $s() || qs(), e.equal(e.value, t) || ((e.value = t), wd(e));
}
function Zs(e, t) {
  $s() || qs(), Kr(e, t(e.value));
}
var Ks = Me(be({}, Ft), { equal: js, value: void 0 });
function wd(e) {
  e.version++, md(), Bs(e), vd?.();
}
function Js(e, t, n) {
  let r = Object.create(Id);
  n && (r.consumerAllowSignalWrites = !0), (r.fn = e), (r.schedule = t);
  let o = (u) => {
    r.cleanupFn = u;
  };
  function i(u) {
    return u.fn === null && u.schedule === null;
  }
  function s(u) {
    i(u) ||
      (Zr(u),
      u.cleanupFn(),
      (u.fn = null),
      (u.schedule = null),
      (u.cleanupFn = Yr));
  }
  let a = () => {
    if (r.fn === null) return;
    if (gd())
      throw new Error(
        'Schedulers cannot synchronously execute watches while scheduling.'
      );
    if (((r.dirty = !1), r.hasRun && !gn(r))) return;
    r.hasRun = !0;
    let u = pn(r);
    try {
      r.cleanupFn(), (r.cleanupFn = Yr), r.fn(o);
    } finally {
      hn(r, u);
    }
  };
  return (
    (r.ref = {
      notify: () => Hs(r),
      run: a,
      cleanup: () => r.cleanupFn(),
      destroy: () => s(r),
      [ye]: r,
    }),
    r.ref
  );
}
var Yr = () => {},
  Id = Me(be({}, Ft), {
    consumerIsAlwaysLive: !0,
    consumerAllowSignalWrites: !1,
    consumerMarkedDirty: (e) => {
      e.schedule !== null && e.schedule(e.ref);
    },
    hasRun: !1,
    cleanupFn: Yr,
  });
function D(e) {
  return typeof e == 'function';
}
function ut(e) {
  let n = e((r) => {
    Error.call(r), (r.stack = new Error().stack);
  });
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  );
}
var yn = ut(
  (e) =>
    function (n) {
      e(this),
        (this.message = n
          ? `${n.length} errors occurred during unsubscription:
${n.map((r, o) => `${o + 1}) ${r.toString()}`).join(`
  `)}`
          : ''),
        (this.name = 'UnsubscriptionError'),
        (this.errors = n);
    }
);
function je(e, t) {
  if (e) {
    let n = e.indexOf(t);
    0 <= n && e.splice(n, 1);
  }
}
var P = class e {
  constructor(t) {
    (this.initialTeardown = t),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let t;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: n } = this;
      if (n)
        if (((this._parentage = null), Array.isArray(n)))
          for (let i of n) i.remove(this);
        else n.remove(this);
      let { initialTeardown: r } = this;
      if (D(r))
        try {
          r();
        } catch (i) {
          t = i instanceof yn ? i.errors : [i];
        }
      let { _finalizers: o } = this;
      if (o) {
        this._finalizers = null;
        for (let i of o)
          try {
            Xs(i);
          } catch (s) {
            (t = t ?? []),
              s instanceof yn ? (t = [...t, ...s.errors]) : t.push(s);
          }
      }
      if (t) throw new yn(t);
    }
  }
  add(t) {
    var n;
    if (t && t !== this)
      if (this.closed) Xs(t);
      else {
        if (t instanceof e) {
          if (t.closed || t._hasParent(this)) return;
          t._addParent(this);
        }
        (this._finalizers =
          (n = this._finalizers) !== null && n !== void 0 ? n : []).push(t);
      }
  }
  _hasParent(t) {
    let { _parentage: n } = this;
    return n === t || (Array.isArray(n) && n.includes(t));
  }
  _addParent(t) {
    let { _parentage: n } = this;
    this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
  }
  _removeParent(t) {
    let { _parentage: n } = this;
    n === t ? (this._parentage = null) : Array.isArray(n) && je(n, t);
  }
  remove(t) {
    let { _finalizers: n } = this;
    n && je(n, t), t instanceof e && t._removeParent(this);
  }
};
P.EMPTY = (() => {
  let e = new P();
  return (e.closed = !0), e;
})();
var Jr = P.EMPTY;
function Dn(e) {
  return (
    e instanceof P ||
    (e && 'closed' in e && D(e.remove) && D(e.add) && D(e.unsubscribe))
  );
}
function Xs(e) {
  D(e) ? e() : e.unsubscribe();
}
var oe = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var ct = {
  setTimeout(e, t, ...n) {
    let { delegate: r } = ct;
    return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n);
  },
  clearTimeout(e) {
    let { delegate: t } = ct;
    return (t?.clearTimeout || clearTimeout)(e);
  },
  delegate: void 0,
};
function vn(e) {
  ct.setTimeout(() => {
    let { onUnhandledError: t } = oe;
    if (t) t(e);
    else throw e;
  });
}
function Rt() {}
var ea = Xr('C', void 0, void 0);
function ta(e) {
  return Xr('E', void 0, e);
}
function na(e) {
  return Xr('N', e, void 0);
}
function Xr(e, t, n) {
  return { kind: e, value: t, error: n };
}
var Ve = null;
function lt(e) {
  if (oe.useDeprecatedSynchronousErrorHandling) {
    let t = !Ve;
    if ((t && (Ve = { errorThrown: !1, error: null }), e(), t)) {
      let { errorThrown: n, error: r } = Ve;
      if (((Ve = null), n)) throw r;
    }
  } else e();
}
function ra(e) {
  oe.useDeprecatedSynchronousErrorHandling &&
    Ve &&
    ((Ve.errorThrown = !0), (Ve.error = e));
}
var Be = class extends P {
    constructor(t) {
      super(),
        (this.isStopped = !1),
        t
          ? ((this.destination = t), Dn(t) && t.add(this))
          : (this.destination = bd);
    }
    static create(t, n, r) {
      return new De(t, n, r);
    }
    next(t) {
      this.isStopped ? to(na(t), this) : this._next(t);
    }
    error(t) {
      this.isStopped
        ? to(ta(t), this)
        : ((this.isStopped = !0), this._error(t));
    }
    complete() {
      this.isStopped ? to(ea, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(t) {
      this.destination.next(t);
    }
    _error(t) {
      try {
        this.destination.error(t);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  Ed = Function.prototype.bind;
function eo(e, t) {
  return Ed.call(e, t);
}
var no = class {
    constructor(t) {
      this.partialObserver = t;
    }
    next(t) {
      let { partialObserver: n } = this;
      if (n.next)
        try {
          n.next(t);
        } catch (r) {
          wn(r);
        }
    }
    error(t) {
      let { partialObserver: n } = this;
      if (n.error)
        try {
          n.error(t);
        } catch (r) {
          wn(r);
        }
      else wn(t);
    }
    complete() {
      let { partialObserver: t } = this;
      if (t.complete)
        try {
          t.complete();
        } catch (n) {
          wn(n);
        }
    }
  },
  De = class extends Be {
    constructor(t, n, r) {
      super();
      let o;
      if (D(t) || !t)
        o = { next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
      else {
        let i;
        this && oe.useDeprecatedNextContext
          ? ((i = Object.create(t)),
            (i.unsubscribe = () => this.unsubscribe()),
            (o = {
              next: t.next && eo(t.next, i),
              error: t.error && eo(t.error, i),
              complete: t.complete && eo(t.complete, i),
            }))
          : (o = t);
      }
      this.destination = new no(o);
    }
  };
function wn(e) {
  oe.useDeprecatedSynchronousErrorHandling ? ra(e) : vn(e);
}
function Cd(e) {
  throw e;
}
function to(e, t) {
  let { onStoppedNotification: n } = oe;
  n && ct.setTimeout(() => n(e, t));
}
var bd = { closed: !0, next: Rt, error: Cd, complete: Rt };
var dt = (typeof Symbol == 'function' && Symbol.observable) || '@@observable';
function H(e) {
  return e;
}
function Md(...e) {
  return ro(e);
}
function ro(e) {
  return e.length === 0
    ? H
    : e.length === 1
      ? e[0]
      : function (n) {
          return e.reduce((r, o) => o(r), n);
        };
}
var x = (() => {
  class e {
    constructor(n) {
      n && (this._subscribe = n);
    }
    lift(n) {
      let r = new e();
      return (r.source = this), (r.operator = n), r;
    }
    subscribe(n, r, o) {
      let i = xd(n) ? n : new De(n, r, o);
      return (
        lt(() => {
          let { operator: s, source: a } = this;
          i.add(
            s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i)
          );
        }),
        i
      );
    }
    _trySubscribe(n) {
      try {
        return this._subscribe(n);
      } catch (r) {
        n.error(r);
      }
    }
    forEach(n, r) {
      return (
        (r = oa(r)),
        new r((o, i) => {
          let s = new De({
            next: (a) => {
              try {
                n(a);
              } catch (u) {
                i(u), s.unsubscribe();
              }
            },
            error: i,
            complete: o,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(n) {
      var r;
      return (r = this.source) === null || r === void 0
        ? void 0
        : r.subscribe(n);
    }
    [dt]() {
      return this;
    }
    pipe(...n) {
      return ro(n)(this);
    }
    toPromise(n) {
      return (
        (n = oa(n)),
        new n((r, o) => {
          let i;
          this.subscribe(
            (s) => (i = s),
            (s) => o(s),
            () => r(i)
          );
        })
      );
    }
  }
  return (e.create = (t) => new e(t)), e;
})();
function oa(e) {
  var t;
  return (t = e ?? oe.Promise) !== null && t !== void 0 ? t : Promise;
}
function _d(e) {
  return e && D(e.next) && D(e.error) && D(e.complete);
}
function xd(e) {
  return (e && e instanceof Be) || (_d(e) && Dn(e));
}
function oo(e) {
  return D(e?.lift);
}
function w(e) {
  return (t) => {
    if (oo(t))
      return t.lift(function (n) {
        try {
          return e(n, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError('Unable to lift unknown Observable type');
  };
}
function I(e, t, n, r, o) {
  return new io(e, t, n, r, o);
}
var io = class extends Be {
  constructor(t, n, r, o, i, s) {
    super(t),
      (this.onFinalize = i),
      (this.shouldUnsubscribe = s),
      (this._next = n
        ? function (a) {
            try {
              n(a);
            } catch (u) {
              t.error(u);
            }
          }
        : super._next),
      (this._error = o
        ? function (a) {
            try {
              o(a);
            } catch (u) {
              t.error(u);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r();
            } catch (a) {
              t.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var t;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: n } = this;
      super.unsubscribe(),
        !n && ((t = this.onFinalize) === null || t === void 0 || t.call(this));
    }
  }
};
function so() {
  return w((e, t) => {
    let n = null;
    e._refCount++;
    let r = I(t, void 0, void 0, void 0, () => {
      if (!e || e._refCount <= 0 || 0 < --e._refCount) {
        n = null;
        return;
      }
      let o = e._connection,
        i = n;
      (n = null), o && (!i || o === i) && o.unsubscribe(), t.unsubscribe();
    });
    e.subscribe(r), r.closed || (n = e.connect());
  });
}
var ao = class extends x {
  constructor(t, n) {
    super(),
      (this.source = t),
      (this.subjectFactory = n),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      oo(t) && (this.lift = t.lift);
  }
  _subscribe(t) {
    return this.getSubject().subscribe(t);
  }
  getSubject() {
    let t = this._subject;
    return (
      (!t || t.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    );
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: t } = this;
    (this._subject = this._connection = null), t?.unsubscribe();
  }
  connect() {
    let t = this._connection;
    if (!t) {
      t = this._connection = new P();
      let n = this.getSubject();
      t.add(
        this.source.subscribe(
          I(
            n,
            void 0,
            () => {
              this._teardown(), n.complete();
            },
            (r) => {
              this._teardown(), n.error(r);
            },
            () => this._teardown()
          )
        )
      ),
        t.closed && ((this._connection = null), (t = P.EMPTY));
    }
    return t;
  }
  refCount() {
    return so()(this);
  }
};
var ia = ut(
  (e) =>
    function () {
      e(this),
        (this.name = 'ObjectUnsubscribedError'),
        (this.message = 'object unsubscribed');
    }
);
var le = (() => {
    class e extends x {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(n) {
        let r = new In(this, this);
        return (r.operator = n), r;
      }
      _throwIfClosed() {
        if (this.closed) throw new ia();
      }
      next(n) {
        lt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(n);
          }
        });
      }
      error(n) {
        lt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = n);
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(n);
          }
        });
      }
      complete() {
        lt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: n } = this;
            for (; n.length; ) n.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var n;
        return (
          ((n = this.observers) === null || n === void 0 ? void 0 : n.length) >
          0
        );
      }
      _trySubscribe(n) {
        return this._throwIfClosed(), super._trySubscribe(n);
      }
      _subscribe(n) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(n),
          this._innerSubscribe(n)
        );
      }
      _innerSubscribe(n) {
        let { hasError: r, isStopped: o, observers: i } = this;
        return r || o
          ? Jr
          : ((this.currentObservers = null),
            i.push(n),
            new P(() => {
              (this.currentObservers = null), je(i, n);
            }));
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: o, isStopped: i } = this;
        r ? n.error(o) : i && n.complete();
      }
      asObservable() {
        let n = new x();
        return (n.source = this), n;
      }
    }
    return (e.create = (t, n) => new In(t, n)), e;
  })(),
  In = class extends le {
    constructor(t, n) {
      super(), (this.destination = t), (this.source = n);
    }
    next(t) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.next) ===
        null ||
        r === void 0 ||
        r.call(n, t);
    }
    error(t) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.error) ===
        null ||
        r === void 0 ||
        r.call(n, t);
    }
    complete() {
      var t, n;
      (n =
        (t = this.destination) === null || t === void 0
          ? void 0
          : t.complete) === null ||
        n === void 0 ||
        n.call(t);
    }
    _subscribe(t) {
      var n, r;
      return (r =
        (n = this.source) === null || n === void 0
          ? void 0
          : n.subscribe(t)) !== null && r !== void 0
        ? r
        : Jr;
    }
  };
var Pt = class extends le {
  constructor(t) {
    super(), (this._value = t);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(t) {
    let n = super._subscribe(t);
    return !n.closed && t.next(this._value), n;
  }
  getValue() {
    let { hasError: t, thrownError: n, _value: r } = this;
    if (t) throw n;
    return this._throwIfClosed(), r;
  }
  next(t) {
    super.next((this._value = t));
  }
};
var uo = {
  now() {
    return (uo.delegate || Date).now();
  },
  delegate: void 0,
};
var En = class extends P {
  constructor(t, n) {
    super();
  }
  schedule(t, n = 0) {
    return this;
  }
};
var kt = {
  setInterval(e, t, ...n) {
    let { delegate: r } = kt;
    return r?.setInterval ? r.setInterval(e, t, ...n) : setInterval(e, t, ...n);
  },
  clearInterval(e) {
    let { delegate: t } = kt;
    return (t?.clearInterval || clearInterval)(e);
  },
  delegate: void 0,
};
var Cn = class extends En {
  constructor(t, n) {
    super(t, n), (this.scheduler = t), (this.work = n), (this.pending = !1);
  }
  schedule(t, n = 0) {
    var r;
    if (this.closed) return this;
    this.state = t;
    let o = this.id,
      i = this.scheduler;
    return (
      o != null && (this.id = this.recycleAsyncId(i, o, n)),
      (this.pending = !0),
      (this.delay = n),
      (this.id =
        (r = this.id) !== null && r !== void 0
          ? r
          : this.requestAsyncId(i, this.id, n)),
      this
    );
  }
  requestAsyncId(t, n, r = 0) {
    return kt.setInterval(t.flush.bind(t, this), r);
  }
  recycleAsyncId(t, n, r = 0) {
    if (r != null && this.delay === r && this.pending === !1) return n;
    n != null && kt.clearInterval(n);
  }
  execute(t, n) {
    if (this.closed) return new Error('executing a cancelled action');
    this.pending = !1;
    let r = this._execute(t, n);
    if (r) return r;
    this.pending === !1 &&
      this.id != null &&
      (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }
  _execute(t, n) {
    let r = !1,
      o;
    try {
      this.work(t);
    } catch (i) {
      (r = !0), (o = i || new Error('Scheduled action threw falsy error'));
    }
    if (r) return this.unsubscribe(), o;
  }
  unsubscribe() {
    if (!this.closed) {
      let { id: t, scheduler: n } = this,
        { actions: r } = n;
      (this.work = this.state = this.scheduler = null),
        (this.pending = !1),
        je(r, this),
        t != null && (this.id = this.recycleAsyncId(n, t, null)),
        (this.delay = null),
        super.unsubscribe();
    }
  }
};
var ft = class e {
  constructor(t, n = e.now) {
    (this.schedulerActionCtor = t), (this.now = n);
  }
  schedule(t, n = 0, r) {
    return new this.schedulerActionCtor(this, t).schedule(r, n);
  }
};
ft.now = uo.now;
var bn = class extends ft {
  constructor(t, n = ft.now) {
    super(t, n), (this.actions = []), (this._active = !1);
  }
  flush(t) {
    let { actions: n } = this;
    if (this._active) {
      n.push(t);
      return;
    }
    let r;
    this._active = !0;
    do if ((r = t.execute(t.state, t.delay))) break;
    while ((t = n.shift()));
    if (((this._active = !1), r)) {
      for (; (t = n.shift()); ) t.unsubscribe();
      throw r;
    }
  }
};
var sa = new bn(Cn);
var Lt = new x((e) => e.complete());
function aa(e) {
  return e && D(e.schedule);
}
function ua(e) {
  return e[e.length - 1];
}
function Mn(e) {
  return D(ua(e)) ? e.pop() : void 0;
}
function _e(e) {
  return aa(ua(e)) ? e.pop() : void 0;
}
function la(e, t, n, r) {
  function o(i) {
    return i instanceof n
      ? i
      : new n(function (s) {
          s(i);
        });
  }
  return new (n || (n = Promise))(function (i, s) {
    function a(l) {
      try {
        c(r.next(l));
      } catch (d) {
        s(d);
      }
    }
    function u(l) {
      try {
        c(r.throw(l));
      } catch (d) {
        s(d);
      }
    }
    function c(l) {
      l.done ? i(l.value) : o(l.value).then(a, u);
    }
    c((r = r.apply(e, t || [])).next());
  });
}
function ca(e) {
  var t = typeof Symbol == 'function' && Symbol.iterator,
    n = t && e[t],
    r = 0;
  if (n) return n.call(e);
  if (e && typeof e.length == 'number')
    return {
      next: function () {
        return (
          e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }
        );
      },
    };
  throw new TypeError(
    t ? 'Object is not iterable.' : 'Symbol.iterator is not defined.'
  );
}
function $e(e) {
  return this instanceof $e ? ((this.v = e), this) : new $e(e);
}
function da(e, t, n) {
  if (!Symbol.asyncIterator)
    throw new TypeError('Symbol.asyncIterator is not defined.');
  var r = n.apply(e, t || []),
    o,
    i = [];
  return (
    (o = {}),
    s('next'),
    s('throw'),
    s('return'),
    (o[Symbol.asyncIterator] = function () {
      return this;
    }),
    o
  );
  function s(f) {
    r[f] &&
      (o[f] = function (p) {
        return new Promise(function (h, m) {
          i.push([f, p, h, m]) > 1 || a(f, p);
        });
      });
  }
  function a(f, p) {
    try {
      u(r[f](p));
    } catch (h) {
      d(i[0][3], h);
    }
  }
  function u(f) {
    f.value instanceof $e
      ? Promise.resolve(f.value.v).then(c, l)
      : d(i[0][2], f);
  }
  function c(f) {
    a('next', f);
  }
  function l(f) {
    a('throw', f);
  }
  function d(f, p) {
    f(p), i.shift(), i.length && a(i[0][0], i[0][1]);
  }
}
function fa(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError('Symbol.asyncIterator is not defined.');
  var t = e[Symbol.asyncIterator],
    n;
  return t
    ? t.call(e)
    : ((e = typeof ca == 'function' ? ca(e) : e[Symbol.iterator]()),
      (n = {}),
      r('next'),
      r('throw'),
      r('return'),
      (n[Symbol.asyncIterator] = function () {
        return this;
      }),
      n);
  function r(i) {
    n[i] =
      e[i] &&
      function (s) {
        return new Promise(function (a, u) {
          (s = e[i](s)), o(a, u, s.done, s.value);
        });
      };
  }
  function o(i, s, a, u) {
    Promise.resolve(u).then(function (c) {
      i({ value: c, done: a });
    }, s);
  }
}
var _n = (e) => e && typeof e.length == 'number' && typeof e != 'function';
function xn(e) {
  return D(e?.then);
}
function Tn(e) {
  return D(e[dt]);
}
function Sn(e) {
  return Symbol.asyncIterator && D(e?.[Symbol.asyncIterator]);
}
function Nn(e) {
  return new TypeError(
    `You provided ${e !== null && typeof e == 'object' ? 'an invalid object' : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function Td() {
  return typeof Symbol != 'function' || !Symbol.iterator
    ? '@@iterator'
    : Symbol.iterator;
}
var An = Td();
function On(e) {
  return D(e?.[An]);
}
function Fn(e) {
  return da(this, arguments, function* () {
    let n = e.getReader();
    try {
      for (;;) {
        let { value: r, done: o } = yield $e(n.read());
        if (o) return yield $e(void 0);
        yield yield $e(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function Rn(e) {
  return D(e?.getReader);
}
function F(e) {
  if (e instanceof x) return e;
  if (e != null) {
    if (Tn(e)) return Sd(e);
    if (_n(e)) return Nd(e);
    if (xn(e)) return Ad(e);
    if (Sn(e)) return pa(e);
    if (On(e)) return Od(e);
    if (Rn(e)) return Fd(e);
  }
  throw Nn(e);
}
function Sd(e) {
  return new x((t) => {
    let n = e[dt]();
    if (D(n.subscribe)) return n.subscribe(t);
    throw new TypeError(
      'Provided object does not correctly implement Symbol.observable'
    );
  });
}
function Nd(e) {
  return new x((t) => {
    for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
    t.complete();
  });
}
function Ad(e) {
  return new x((t) => {
    e.then(
      (n) => {
        t.closed || (t.next(n), t.complete());
      },
      (n) => t.error(n)
    ).then(null, vn);
  });
}
function Od(e) {
  return new x((t) => {
    for (let n of e) if ((t.next(n), t.closed)) return;
    t.complete();
  });
}
function pa(e) {
  return new x((t) => {
    Rd(e, t).catch((n) => t.error(n));
  });
}
function Fd(e) {
  return pa(Fn(e));
}
function Rd(e, t) {
  var n, r, o, i;
  return la(this, void 0, void 0, function* () {
    try {
      for (n = fa(e); (r = yield n.next()), !r.done; ) {
        let s = r.value;
        if ((t.next(s), t.closed)) return;
      }
    } catch (s) {
      o = { error: s };
    } finally {
      try {
        r && !r.done && (i = n.return) && (yield i.call(n));
      } finally {
        if (o) throw o.error;
      }
    }
    t.complete();
  });
}
function W(e, t, n, r = 0, o = !1) {
  let i = t.schedule(function () {
    n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
  }, r);
  if ((e.add(i), !o)) return i;
}
function Pn(e, t = 0) {
  return w((n, r) => {
    n.subscribe(
      I(
        r,
        (o) => W(r, e, () => r.next(o), t),
        () => W(r, e, () => r.complete(), t),
        (o) => W(r, e, () => r.error(o), t)
      )
    );
  });
}
function kn(e, t = 0) {
  return w((n, r) => {
    r.add(e.schedule(() => n.subscribe(r), t));
  });
}
function ha(e, t) {
  return F(e).pipe(kn(t), Pn(t));
}
function ga(e, t) {
  return F(e).pipe(kn(t), Pn(t));
}
function ma(e, t) {
  return new x((n) => {
    let r = 0;
    return t.schedule(function () {
      r === e.length
        ? n.complete()
        : (n.next(e[r++]), n.closed || this.schedule());
    });
  });
}
function ya(e, t) {
  return new x((n) => {
    let r;
    return (
      W(n, t, () => {
        (r = e[An]()),
          W(
            n,
            t,
            () => {
              let o, i;
              try {
                ({ value: o, done: i } = r.next());
              } catch (s) {
                n.error(s);
                return;
              }
              i ? n.complete() : n.next(o);
            },
            0,
            !0
          );
      }),
      () => D(r?.return) && r.return()
    );
  });
}
function Ln(e, t) {
  if (!e) throw new Error('Iterable cannot be null');
  return new x((n) => {
    W(n, t, () => {
      let r = e[Symbol.asyncIterator]();
      W(
        n,
        t,
        () => {
          r.next().then((o) => {
            o.done ? n.complete() : n.next(o.value);
          });
        },
        0,
        !0
      );
    });
  });
}
function Da(e, t) {
  return Ln(Fn(e), t);
}
function va(e, t) {
  if (e != null) {
    if (Tn(e)) return ha(e, t);
    if (_n(e)) return ma(e, t);
    if (xn(e)) return ga(e, t);
    if (Sn(e)) return Ln(e, t);
    if (On(e)) return ya(e, t);
    if (Rn(e)) return Da(e, t);
  }
  throw Nn(e);
}
function xe(e, t) {
  return t ? va(e, t) : F(e);
}
function Pd(...e) {
  let t = _e(e);
  return xe(e, t);
}
function kd(e, t) {
  let n = D(e) ? e : () => e,
    r = (o) => o.error(n());
  return new x(t ? (o) => t.schedule(r, 0, o) : r);
}
function Ld(e) {
  return !!e && (e instanceof x || (D(e.lift) && D(e.subscribe)));
}
var He = ut(
  (e) =>
    function () {
      e(this),
        (this.name = 'EmptyError'),
        (this.message = 'no elements in sequence');
    }
);
function ve(e, t) {
  return w((n, r) => {
    let o = 0;
    n.subscribe(
      I(r, (i) => {
        r.next(e.call(t, i, o++));
      })
    );
  });
}
var { isArray: jd } = Array;
function Vd(e, t) {
  return jd(t) ? e(...t) : e(t);
}
function jn(e) {
  return ve((t) => Vd(e, t));
}
var { isArray: Bd } = Array,
  { getPrototypeOf: $d, prototype: Hd, keys: Ud } = Object;
function Vn(e) {
  if (e.length === 1) {
    let t = e[0];
    if (Bd(t)) return { args: t, keys: null };
    if (Gd(t)) {
      let n = Ud(t);
      return { args: n.map((r) => t[r]), keys: n };
    }
  }
  return { args: e, keys: null };
}
function Gd(e) {
  return e && typeof e == 'object' && $d(e) === Hd;
}
function Bn(e, t) {
  return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
}
function zd(...e) {
  let t = _e(e),
    n = Mn(e),
    { args: r, keys: o } = Vn(e);
  if (r.length === 0) return xe([], t);
  let i = new x(Wd(r, t, o ? (s) => Bn(o, s) : H));
  return n ? i.pipe(jn(n)) : i;
}
function Wd(e, t, n = H) {
  return (r) => {
    wa(
      t,
      () => {
        let { length: o } = e,
          i = new Array(o),
          s = o,
          a = o;
        for (let u = 0; u < o; u++)
          wa(
            t,
            () => {
              let c = xe(e[u], t),
                l = !1;
              c.subscribe(
                I(
                  r,
                  (d) => {
                    (i[u] = d), l || ((l = !0), a--), a || r.next(n(i.slice()));
                  },
                  () => {
                    --s || r.complete();
                  }
                )
              );
            },
            r
          );
      },
      r
    );
  };
}
function wa(e, t, n) {
  e ? W(n, e, t) : t();
}
function Ia(e, t, n, r, o, i, s, a) {
  let u = [],
    c = 0,
    l = 0,
    d = !1,
    f = () => {
      d && !u.length && !c && t.complete();
    },
    p = (m) => (c < r ? h(m) : u.push(m)),
    h = (m) => {
      i && t.next(m), c++;
      let S = !1;
      F(n(m, l++)).subscribe(
        I(
          t,
          (_) => {
            o?.(_), i ? p(_) : t.next(_);
          },
          () => {
            S = !0;
          },
          void 0,
          () => {
            if (S)
              try {
                for (c--; u.length && c < r; ) {
                  let _ = u.shift();
                  s ? W(t, s, () => h(_)) : h(_);
                }
                f();
              } catch (_) {
                t.error(_);
              }
          }
        )
      );
    };
  return (
    e.subscribe(
      I(t, p, () => {
        (d = !0), f();
      })
    ),
    () => {
      a?.();
    }
  );
}
function Ue(e, t, n = 1 / 0) {
  return D(t)
    ? Ue((r, o) => ve((i, s) => t(r, i, o, s))(F(e(r, o))), n)
    : (typeof t == 'number' && (n = t), w((r, o) => Ia(r, o, e, n)));
}
function Ea(e = 1 / 0) {
  return Ue(H, e);
}
function Ca() {
  return Ea(1);
}
function $n(...e) {
  return Ca()(xe(e, _e(e)));
}
function qd(e) {
  return new x((t) => {
    F(e()).subscribe(t);
  });
}
function Yd(...e) {
  let t = Mn(e),
    { args: n, keys: r } = Vn(e),
    o = new x((i) => {
      let { length: s } = n;
      if (!s) {
        i.complete();
        return;
      }
      let a = new Array(s),
        u = s,
        c = s;
      for (let l = 0; l < s; l++) {
        let d = !1;
        F(n[l]).subscribe(
          I(
            i,
            (f) => {
              d || ((d = !0), c--), (a[l] = f);
            },
            () => u--,
            void 0,
            () => {
              (!u || !d) && (c || i.next(r ? Bn(r, a) : a), i.complete());
            }
          )
        );
      }
    });
  return t ? o.pipe(jn(t)) : o;
}
function Ge(e, t) {
  return w((n, r) => {
    let o = 0;
    n.subscribe(I(r, (i) => e.call(t, i, o++) && r.next(i)));
  });
}
function ba(e) {
  return w((t, n) => {
    let r = null,
      o = !1,
      i;
    (r = t.subscribe(
      I(n, void 0, void 0, (s) => {
        (i = F(e(s, ba(e)(t)))),
          r ? (r.unsubscribe(), (r = null), i.subscribe(n)) : (o = !0);
      })
    )),
      o && (r.unsubscribe(), (r = null), i.subscribe(n));
  });
}
function Ma(e, t, n, r, o) {
  return (i, s) => {
    let a = n,
      u = t,
      c = 0;
    i.subscribe(
      I(
        s,
        (l) => {
          let d = c++;
          (u = a ? e(u, l, d) : ((a = !0), l)), r && s.next(u);
        },
        o &&
          (() => {
            a && s.next(u), s.complete();
          })
      )
    );
  };
}
function Qd(e, t) {
  return D(t) ? Ue(e, t, 1) : Ue(e, 1);
}
function Zd(e, t = sa) {
  return w((n, r) => {
    let o = null,
      i = null,
      s = null,
      a = () => {
        if (o) {
          o.unsubscribe(), (o = null);
          let c = i;
          (i = null), r.next(c);
        }
      };
    function u() {
      let c = s + e,
        l = t.now();
      if (l < c) {
        (o = this.schedule(void 0, c - l)), r.add(o);
        return;
      }
      a();
    }
    n.subscribe(
      I(
        r,
        (c) => {
          (i = c), (s = t.now()), o || ((o = t.schedule(u, e)), r.add(o));
        },
        () => {
          a(), r.complete();
        },
        void 0,
        () => {
          i = o = null;
        }
      )
    );
  });
}
function jt(e) {
  return w((t, n) => {
    let r = !1;
    t.subscribe(
      I(
        n,
        (o) => {
          (r = !0), n.next(o);
        },
        () => {
          r || n.next(e), n.complete();
        }
      )
    );
  });
}
function co(e) {
  return e <= 0
    ? () => Lt
    : w((t, n) => {
        let r = 0;
        t.subscribe(
          I(n, (o) => {
            ++r <= e && (n.next(o), e <= r && n.complete());
          })
        );
      });
}
function Kd(e) {
  return ve(() => e);
}
function Jd(e, t = H) {
  return (
    (e = e ?? Xd),
    w((n, r) => {
      let o,
        i = !0;
      n.subscribe(
        I(r, (s) => {
          let a = t(s);
          (i || !e(o, a)) && ((i = !1), (o = a), r.next(s));
        })
      );
    })
  );
}
function Xd(e, t) {
  return e === t;
}
function Hn(e = ef) {
  return w((t, n) => {
    let r = !1;
    t.subscribe(
      I(
        n,
        (o) => {
          (r = !0), n.next(o);
        },
        () => (r ? n.complete() : n.error(e()))
      )
    );
  });
}
function ef() {
  return new He();
}
function tf(e) {
  return w((t, n) => {
    try {
      t.subscribe(n);
    } finally {
      n.add(e);
    }
  });
}
function lo(e, t) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      e ? Ge((o, i) => e(o, i, r)) : H,
      co(1),
      n ? jt(t) : Hn(() => new He())
    );
}
function fo(e) {
  return e <= 0
    ? () => Lt
    : w((t, n) => {
        let r = [];
        t.subscribe(
          I(
            n,
            (o) => {
              r.push(o), e < r.length && r.shift();
            },
            () => {
              for (let o of r) n.next(o);
              n.complete();
            },
            void 0,
            () => {
              r = null;
            }
          )
        );
      });
}
function nf(e, t) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      e ? Ge((o, i) => e(o, i, r)) : H,
      fo(1),
      n ? jt(t) : Hn(() => new He())
    );
}
function rf(e, t) {
  return w(Ma(e, t, arguments.length >= 2, !0));
}
function of(e = {}) {
  let {
    connector: t = () => new le(),
    resetOnError: n = !0,
    resetOnComplete: r = !0,
    resetOnRefCountZero: o = !0,
  } = e;
  return (i) => {
    let s,
      a,
      u,
      c = 0,
      l = !1,
      d = !1,
      f = () => {
        a?.unsubscribe(), (a = void 0);
      },
      p = () => {
        f(), (s = u = void 0), (l = d = !1);
      },
      h = () => {
        let m = s;
        p(), m?.unsubscribe();
      };
    return w((m, S) => {
      c++, !d && !l && f();
      let _ = (u = u ?? t());
      S.add(() => {
        c--, c === 0 && !d && !l && (a = po(h, o));
      }),
        _.subscribe(S),
        !s &&
          c > 0 &&
          ((s = new De({
            next: (te) => _.next(te),
            error: (te) => {
              (d = !0), f(), (a = po(p, n, te)), _.error(te);
            },
            complete: () => {
              (l = !0), f(), (a = po(p, r)), _.complete();
            },
          })),
          F(m).subscribe(s));
    })(i);
  };
}
function po(e, t, ...n) {
  if (t === !0) {
    e();
    return;
  }
  if (t === !1) return;
  let r = new De({
    next: () => {
      r.unsubscribe(), e();
    },
  });
  return F(t(...n)).subscribe(r);
}
function sf(e) {
  return Ge((t, n) => e <= n);
}
function af(...e) {
  let t = _e(e);
  return w((n, r) => {
    (t ? $n(e, n, t) : $n(e, n)).subscribe(r);
  });
}
function uf(e, t) {
  return w((n, r) => {
    let o = null,
      i = 0,
      s = !1,
      a = () => s && !o && r.complete();
    n.subscribe(
      I(
        r,
        (u) => {
          o?.unsubscribe();
          let c = 0,
            l = i++;
          F(e(u, l)).subscribe(
            (o = I(
              r,
              (d) => r.next(t ? t(u, d, l, c++) : d),
              () => {
                (o = null), a();
              }
            ))
          );
        },
        () => {
          (s = !0), a();
        }
      )
    );
  });
}
function cf(e) {
  return w((t, n) => {
    F(e).subscribe(I(n, () => n.complete(), Rt)), !n.closed && t.subscribe(n);
  });
}
function lf(e, t, n) {
  let r = D(e) || t || n ? { next: e, error: t, complete: n } : e;
  return r
    ? w((o, i) => {
        var s;
        (s = r.subscribe) === null || s === void 0 || s.call(r);
        let a = !0;
        o.subscribe(
          I(
            i,
            (u) => {
              var c;
              (c = r.next) === null || c === void 0 || c.call(r, u), i.next(u);
            },
            () => {
              var u;
              (a = !1),
                (u = r.complete) === null || u === void 0 || u.call(r),
                i.complete();
            },
            (u) => {
              var c;
              (a = !1),
                (c = r.error) === null || c === void 0 || c.call(r, u),
                i.error(u);
            },
            () => {
              var u, c;
              a && ((u = r.unsubscribe) === null || u === void 0 || u.call(r)),
                (c = r.finalize) === null || c === void 0 || c.call(r);
            }
          )
        );
      })
    : H;
}
var lu = 'https://g.co/ng/security#xss',
  T = class extends Error {
    constructor(t, n) {
      super(du(t, n)), (this.code = t);
    }
  };
function du(e, t) {
  return `${`NG0${Math.abs(e)}`}${t ? ': ' + t : ''}`;
}
function Mr(e) {
  return { toString: e }.toString();
}
var mt = globalThis;
function N(e) {
  for (let t in e) if (e[t] === N) return t;
  throw Error('Could not find renamed property on target object.');
}
function df(e, t) {
  for (let n in t) t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n]);
}
function q(e) {
  if (typeof e == 'string') return e;
  if (Array.isArray(e)) return '[' + e.map(q).join(', ') + ']';
  if (e == null) return '' + e;
  if (e.overriddenName) return `${e.overriddenName}`;
  if (e.name) return `${e.name}`;
  let t = e.toString();
  if (t == null) return '' + t;
  let n = t.indexOf(`
`);
  return n === -1 ? t : t.substring(0, n);
}
function Ao(e, t) {
  return e == null || e === ''
    ? t === null
      ? ''
      : t
    : t == null || t === ''
      ? e
      : e + ' ' + t;
}
var ff = N({ __forward_ref__: N });
function fu(e) {
  return (
    (e.__forward_ref__ = fu),
    (e.toString = function () {
      return q(this());
    }),
    e
  );
}
function U(e) {
  return pu(e) ? e() : e;
}
function pu(e) {
  return (
    typeof e == 'function' && e.hasOwnProperty(ff) && e.__forward_ref__ === fu
  );
}
function R(e) {
  return {
    token: e.token,
    providedIn: e.providedIn || null,
    factory: e.factory,
    value: void 0,
  };
}
function hu(e) {
  return { providers: e.providers || [], imports: e.imports || [] };
}
function _r(e) {
  return _a(e, gu) || _a(e, mu);
}
function b0(e) {
  return _r(e) !== null;
}
function _a(e, t) {
  return e.hasOwnProperty(t) ? e[t] : null;
}
function pf(e) {
  let t = e && (e[gu] || e[mu]);
  return t || null;
}
function xa(e) {
  return e && (e.hasOwnProperty(Ta) || e.hasOwnProperty(hf)) ? e[Ta] : null;
}
var gu = N({ ɵprov: N }),
  Ta = N({ ɵinj: N }),
  mu = N({ ngInjectableDef: N }),
  hf = N({ ngInjectorDef: N }),
  A = class {
    constructor(t, n) {
      (this._desc = t),
        (this.ngMetadataName = 'InjectionToken'),
        (this.ɵprov = void 0),
        typeof n == 'number'
          ? (this.__NG_ELEMENT_ID__ = n)
          : n !== void 0 &&
            (this.ɵprov = R({
              token: this,
              providedIn: n.providedIn || 'root',
              factory: n.factory,
            }));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function yu(e) {
  return e && !!e.ɵproviders;
}
var gf = N({ ɵcmp: N }),
  mf = N({ ɵdir: N }),
  yf = N({ ɵpipe: N }),
  Df = N({ ɵmod: N }),
  rr = N({ ɵfac: N }),
  Vt = N({ __NG_ELEMENT_ID__: N }),
  Sa = N({ __NG_ENV_ID__: N });
function $i(e) {
  return typeof e == 'string' ? e : e == null ? '' : String(e);
}
function vf(e) {
  return typeof e == 'function'
    ? e.name || e.toString()
    : typeof e == 'object' && e != null && typeof e.type == 'function'
      ? e.type.name || e.type.toString()
      : $i(e);
}
function wf(e, t) {
  let n = t ? `. Dependency path: ${t.join(' > ')} > ${e}` : '';
  throw new T(-200, e);
}
function Hi(e, t) {
  throw new T(-201, !1);
}
var C = (function (e) {
    return (
      (e[(e.Default = 0)] = 'Default'),
      (e[(e.Host = 1)] = 'Host'),
      (e[(e.Self = 2)] = 'Self'),
      (e[(e.SkipSelf = 4)] = 'SkipSelf'),
      (e[(e.Optional = 8)] = 'Optional'),
      e
    );
  })(C || {}),
  Oo;
function Du() {
  return Oo;
}
function ne(e) {
  let t = Oo;
  return (Oo = e), t;
}
function vu(e, t, n) {
  let r = _r(e);
  if (r && r.providedIn == 'root')
    return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & C.Optional) return null;
  if (t !== void 0) return t;
  Hi(e, 'Injector');
}
var If = {},
  Bt = If,
  Ef = '__NG_DI_FLAG__',
  or = 'ngTempTokenPath',
  Cf = 'ngTokenPath',
  bf = /\n/gm,
  Mf = '\u0275',
  Na = '__source',
  yt;
function _f() {
  return yt;
}
function Te(e) {
  let t = yt;
  return (yt = e), t;
}
function xf(e, t = C.Default) {
  if (yt === void 0) throw new T(-203, !1);
  return yt === null
    ? vu(e, void 0, t)
    : yt.get(e, t & C.Optional ? null : void 0, t);
}
function Y(e, t = C.Default) {
  return (Du() || xf)(U(e), t);
}
function b(e, t = C.Default) {
  return Y(e, xr(t));
}
function xr(e) {
  return typeof e > 'u' || typeof e == 'number'
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
}
function Fo(e) {
  let t = [];
  for (let n = 0; n < e.length; n++) {
    let r = U(e[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new T(900, !1);
      let o,
        i = C.Default;
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          u = Tf(a);
        typeof u == 'number' ? (u === -1 ? (o = a.token) : (i |= u)) : (o = a);
      }
      t.push(Y(o, i));
    } else t.push(Y(r));
  }
  return t;
}
function Tf(e) {
  return e[Ef];
}
function Sf(e, t, n, r) {
  let o = e[or];
  throw (
    (t[Na] && o.unshift(t[Na]),
    (e.message = Nf(
      `
` + e.message,
      o,
      n,
      r
    )),
    (e[Cf] = o),
    (e[or] = null),
    e)
  );
}
function Nf(e, t, n, r = null) {
  e =
    e &&
    e.charAt(0) ===
      `
` &&
    e.charAt(1) == Mf
      ? e.slice(2)
      : e;
  let o = q(t);
  if (Array.isArray(t)) o = t.map(q).join(' -> ');
  else if (typeof t == 'object') {
    let i = [];
    for (let s in t)
      if (t.hasOwnProperty(s)) {
        let a = t[s];
        i.push(s + ':' + (typeof a == 'string' ? JSON.stringify(a) : q(a)));
      }
    o = `{${i.join(', ')}}`;
  }
  return `${n}${r ? '(' + r + ')' : ''}[${o}]: ${e.replace(
    bf,
    `
  `
  )}`;
}
function vt(e, t) {
  let n = e.hasOwnProperty(rr);
  return n ? e[rr] : null;
}
function Af(e, t, n) {
  if (e.length !== t.length) return !1;
  for (let r = 0; r < e.length; r++) {
    let o = e[r],
      i = t[r];
    if ((n && ((o = n(o)), (i = n(i))), i !== o)) return !1;
  }
  return !0;
}
function Of(e) {
  return e.flat(Number.POSITIVE_INFINITY);
}
function Ui(e, t) {
  e.forEach((n) => (Array.isArray(n) ? Ui(n, t) : t(n)));
}
function wu(e, t, n) {
  t >= e.length ? e.push(n) : e.splice(t, 0, n);
}
function ir(e, t) {
  return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
}
function Ff(e, t) {
  let n = [];
  for (let r = 0; r < e; r++) n.push(t);
  return n;
}
function Rf(e, t, n, r) {
  let o = e.length;
  if (o == t) e.push(n, r);
  else if (o === 1) e.push(r, e[0]), (e[0] = n);
  else {
    for (o--, e.push(e[o - 1], e[o]); o > t; ) {
      let i = o - 2;
      (e[o] = e[i]), o--;
    }
    (e[t] = n), (e[t + 1] = r);
  }
}
function Gi(e, t, n) {
  let r = nn(e, t);
  return r >= 0 ? (e[r | 1] = n) : ((r = ~r), Rf(e, r, t, n)), r;
}
function ho(e, t) {
  let n = nn(e, t);
  if (n >= 0) return e[n | 1];
}
function nn(e, t) {
  return Pf(e, t, 1);
}
function Pf(e, t, n) {
  let r = 0,
    o = e.length >> n;
  for (; o !== r; ) {
    let i = r + ((o - r) >> 1),
      s = e[i << n];
    if (t === s) return i << n;
    s > t ? (o = i) : (r = i + 1);
  }
  return ~(o << n);
}
var wt = {},
  G = [],
  $t = new A(''),
  Iu = new A('', -1),
  Eu = new A(''),
  sr = class {
    get(t, n = Bt) {
      if (n === Bt) {
        let r = new Error(`NullInjectorError: No provider for ${q(t)}!`);
        throw ((r.name = 'NullInjectorError'), r);
      }
      return n;
    }
  },
  Cu = (function (e) {
    return (e[(e.OnPush = 0)] = 'OnPush'), (e[(e.Default = 1)] = 'Default'), e;
  })(Cu || {}),
  Ht = (function (e) {
    return (
      (e[(e.Emulated = 0)] = 'Emulated'),
      (e[(e.None = 2)] = 'None'),
      (e[(e.ShadowDom = 3)] = 'ShadowDom'),
      e
    );
  })(Ht || {}),
  qe = (function (e) {
    return (
      (e[(e.None = 0)] = 'None'),
      (e[(e.SignalBased = 1)] = 'SignalBased'),
      (e[(e.HasDecoratorInputTransform = 2)] = 'HasDecoratorInputTransform'),
      e
    );
  })(qe || {});
function kf(e, t, n) {
  let r = e.length;
  for (;;) {
    let o = e.indexOf(t, n);
    if (o === -1) return o;
    if (o === 0 || e.charCodeAt(o - 1) <= 32) {
      let i = t.length;
      if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
    }
    n = o + 1;
  }
}
function Ro(e, t, n) {
  let r = 0;
  for (; r < n.length; ) {
    let o = n[r];
    if (typeof o == 'number') {
      if (o !== 0) break;
      r++;
      let i = n[r++],
        s = n[r++],
        a = n[r++];
      e.setAttribute(t, s, a, i);
    } else {
      let i = o,
        s = n[++r];
      Lf(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
    }
  }
  return r;
}
function bu(e) {
  return e === 3 || e === 4 || e === 6;
}
function Lf(e) {
  return e.charCodeAt(0) === 64;
}
function Ut(e, t) {
  if (!(t === null || t.length === 0))
    if (e === null || e.length === 0) e = t.slice();
    else {
      let n = -1;
      for (let r = 0; r < t.length; r++) {
        let o = t[r];
        typeof o == 'number'
          ? (n = o)
          : n === 0 ||
            (n === -1 || n === 2
              ? Aa(e, n, o, null, t[++r])
              : Aa(e, n, o, null, null));
      }
    }
  return e;
}
function Aa(e, t, n, r, o) {
  let i = 0,
    s = e.length;
  if (t === -1) s = -1;
  else
    for (; i < e.length; ) {
      let a = e[i++];
      if (typeof a == 'number') {
        if (a === t) {
          s = -1;
          break;
        } else if (a > t) {
          s = i - 1;
          break;
        }
      }
    }
  for (; i < e.length; ) {
    let a = e[i];
    if (typeof a == 'number') break;
    if (a === n) {
      if (r === null) {
        o !== null && (e[i + 1] = o);
        return;
      } else if (r === e[i + 1]) {
        e[i + 2] = o;
        return;
      }
    }
    i++, r !== null && i++, o !== null && i++;
  }
  s !== -1 && (e.splice(s, 0, t), (i = s + 1)),
    e.splice(i++, 0, n),
    r !== null && e.splice(i++, 0, r),
    o !== null && e.splice(i++, 0, o);
}
var Mu = 'ng-template';
function jf(e, t, n, r) {
  let o = 0;
  if (r) {
    for (; o < t.length && typeof t[o] == 'string'; o += 2)
      if (t[o] === 'class' && kf(t[o + 1].toLowerCase(), n, 0) !== -1)
        return !0;
  } else if (zi(e)) return !1;
  if (((o = t.indexOf(1, o)), o > -1)) {
    let i;
    for (; ++o < t.length && typeof (i = t[o]) == 'string'; )
      if (i.toLowerCase() === n) return !0;
  }
  return !1;
}
function zi(e) {
  return e.type === 4 && e.value !== Mu;
}
function Vf(e, t, n) {
  let r = e.type === 4 && !n ? Mu : e.value;
  return t === r;
}
function Bf(e, t, n) {
  let r = 4,
    o = e.attrs,
    i = o !== null ? Uf(o) : 0,
    s = !1;
  for (let a = 0; a < t.length; a++) {
    let u = t[a];
    if (typeof u == 'number') {
      if (!s && !ie(r) && !ie(u)) return !1;
      if (s && ie(u)) continue;
      (s = !1), (r = u | (r & 1));
      continue;
    }
    if (!s)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (u !== '' && !Vf(e, u, n)) || (u === '' && t.length === 1))
        ) {
          if (ie(r)) return !1;
          s = !0;
        }
      } else if (r & 8) {
        if (o === null || !jf(e, o, u, n)) {
          if (ie(r)) return !1;
          s = !0;
        }
      } else {
        let c = t[++a],
          l = $f(u, o, zi(e), n);
        if (l === -1) {
          if (ie(r)) return !1;
          s = !0;
          continue;
        }
        if (c !== '') {
          let d;
          if (
            (l > i ? (d = '') : (d = o[l + 1].toLowerCase()), r & 2 && c !== d)
          ) {
            if (ie(r)) return !1;
            s = !0;
          }
        }
      }
  }
  return ie(r) || s;
}
function ie(e) {
  return (e & 1) === 0;
}
function $f(e, t, n, r) {
  if (t === null) return -1;
  let o = 0;
  if (r || !n) {
    let i = !1;
    for (; o < t.length; ) {
      let s = t[o];
      if (s === e) return o;
      if (s === 3 || s === 6) i = !0;
      else if (s === 1 || s === 2) {
        let a = t[++o];
        for (; typeof a == 'string'; ) a = t[++o];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          o += 4;
          continue;
        }
      }
      o += i ? 1 : 2;
    }
    return -1;
  } else return Gf(t, e);
}
function _u(e, t, n = !1) {
  for (let r = 0; r < t.length; r++) if (Bf(e, t[r], n)) return !0;
  return !1;
}
function Hf(e) {
  let t = e.attrs;
  if (t != null) {
    let n = t.indexOf(5);
    if (!(n & 1)) return t[n + 1];
  }
  return null;
}
function Uf(e) {
  for (let t = 0; t < e.length; t++) {
    let n = e[t];
    if (bu(n)) return t;
  }
  return e.length;
}
function Gf(e, t) {
  let n = e.indexOf(4);
  if (n > -1)
    for (n++; n < e.length; ) {
      let r = e[n];
      if (typeof r == 'number') return -1;
      if (r === t) return n;
      n++;
    }
  return -1;
}
function zf(e, t) {
  e: for (let n = 0; n < t.length; n++) {
    let r = t[n];
    if (e.length === r.length) {
      for (let o = 0; o < e.length; o++) if (e[o] !== r[o]) continue e;
      return !0;
    }
  }
  return !1;
}
function Oa(e, t) {
  return e ? ':not(' + t.trim() + ')' : t;
}
function Wf(e) {
  let t = e[0],
    n = 1,
    r = 2,
    o = '',
    i = !1;
  for (; n < e.length; ) {
    let s = e[n];
    if (typeof s == 'string')
      if (r & 2) {
        let a = e[++n];
        o += '[' + s + (a.length > 0 ? '="' + a + '"' : '') + ']';
      } else r & 8 ? (o += '.' + s) : r & 4 && (o += ' ' + s);
    else
      o !== '' && !ie(s) && ((t += Oa(i, o)), (o = '')),
        (r = s),
        (i = i || !ie(r));
    n++;
  }
  return o !== '' && (t += Oa(i, o)), t;
}
function qf(e) {
  return e.map(Wf).join(',');
}
function Yf(e) {
  let t = [],
    n = [],
    r = 1,
    o = 2;
  for (; r < e.length; ) {
    let i = e[r];
    if (typeof i == 'string')
      o === 2 ? i !== '' && t.push(i, e[++r]) : o === 8 && n.push(i);
    else {
      if (!ie(o)) break;
      o = i;
    }
    r++;
  }
  return { attrs: t, classes: n };
}
function M0(e) {
  return Mr(() => {
    let t = Au(e),
      n = Me(be({}, t), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === Cu.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (t.standalone && e.dependencies) || null,
        getStandaloneInjector: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || Ht.Emulated,
        styles: e.styles || G,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: '',
      });
    Ou(n);
    let r = e.dependencies;
    return (
      (n.directiveDefs = Ra(r, !1)), (n.pipeDefs = Ra(r, !0)), (n.id = Xf(n)), n
    );
  });
}
function Qf(e) {
  return Ye(e) || Tu(e);
}
function Zf(e) {
  return e !== null;
}
function xu(e) {
  return Mr(() => ({
    type: e.type,
    bootstrap: e.bootstrap || G,
    declarations: e.declarations || G,
    imports: e.imports || G,
    exports: e.exports || G,
    transitiveCompileScopes: null,
    schemas: e.schemas || null,
    id: e.id || null,
  }));
}
function Fa(e, t) {
  if (e == null) return wt;
  let n = {};
  for (let r in e)
    if (e.hasOwnProperty(r)) {
      let o = e[r],
        i,
        s,
        a = qe.None;
      Array.isArray(o)
        ? ((a = o[0]), (i = o[1]), (s = o[2] ?? i))
        : ((i = o), (s = o)),
        t ? ((n[i] = a !== qe.None ? [r, a] : r), (t[i] = s)) : (n[i] = r);
    }
  return n;
}
function Kf(e) {
  return Mr(() => {
    let t = Au(e);
    return Ou(t), t;
  });
}
function Ye(e) {
  return e[gf] || null;
}
function Tu(e) {
  return e[mf] || null;
}
function Su(e) {
  return e[yf] || null;
}
function Jf(e) {
  let t = Ye(e) || Tu(e) || Su(e);
  return t !== null ? t.standalone : !1;
}
function Nu(e, t) {
  let n = e[Df] || null;
  if (!n && t === !0)
    throw new Error(`Type ${q(e)} does not have '\u0275mod' property.`);
  return n;
}
function Au(e) {
  let t = {};
  return {
    type: e.type,
    providersResolver: null,
    factory: null,
    hostBindings: e.hostBindings || null,
    hostVars: e.hostVars || 0,
    hostAttrs: e.hostAttrs || null,
    contentQueries: e.contentQueries || null,
    declaredInputs: t,
    inputTransforms: null,
    inputConfig: e.inputs || wt,
    exportAs: e.exportAs || null,
    standalone: e.standalone === !0,
    signals: e.signals === !0,
    selectors: e.selectors || G,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: Fa(e.inputs, t),
    outputs: Fa(e.outputs),
    debugInfo: null,
  };
}
function Ou(e) {
  e.features?.forEach((t) => t(e));
}
function Ra(e, t) {
  if (!e) return null;
  let n = t ? Su : Qf;
  return () => (typeof e == 'function' ? e() : e).map((r) => n(r)).filter(Zf);
}
function Xf(e) {
  let t = 0,
    n = [
      e.selectors,
      e.ngContentSelectors,
      e.hostVars,
      e.hostAttrs,
      e.consts,
      e.vars,
      e.decls,
      e.encapsulation,
      e.standalone,
      e.signals,
      e.exportAs,
      JSON.stringify(e.inputs),
      JSON.stringify(e.outputs),
      Object.getOwnPropertyNames(e.type.prototype),
      !!e.contentQueries,
      !!e.viewQuery,
    ].join('|');
  for (let o of n) t = (Math.imul(31, t) + o.charCodeAt(0)) << 0;
  return (t += 2147483648), 'c' + t;
}
function Fu(e) {
  return { ɵproviders: e };
}
function ep(...e) {
  return { ɵproviders: Ru(!0, e), ɵfromNgModule: !0 };
}
function Ru(e, ...t) {
  let n = [],
    r = new Set(),
    o,
    i = (s) => {
      n.push(s);
    };
  return (
    Ui(t, (s) => {
      let a = s;
      Po(a, i, [], r) && ((o ||= []), o.push(a));
    }),
    o !== void 0 && Pu(o, i),
    n
  );
}
function Pu(e, t) {
  for (let n = 0; n < e.length; n++) {
    let { ngModule: r, providers: o } = e[n];
    Wi(o, (i) => {
      t(i, r);
    });
  }
}
function Po(e, t, n, r) {
  if (((e = U(e)), !e)) return !1;
  let o = null,
    i = xa(e),
    s = !i && Ye(e);
  if (!i && !s) {
    let u = e.ngModule;
    if (((i = xa(u)), i)) o = u;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    o = e;
  }
  let a = r.has(o);
  if (s) {
    if (a) return !1;
    if ((r.add(o), s.dependencies)) {
      let u =
        typeof s.dependencies == 'function' ? s.dependencies() : s.dependencies;
      for (let c of u) Po(c, t, n, r);
    }
  } else if (i) {
    if (i.imports != null && !a) {
      r.add(o);
      let c;
      try {
        Ui(i.imports, (l) => {
          Po(l, t, n, r) && ((c ||= []), c.push(l));
        });
      } finally {
      }
      c !== void 0 && Pu(c, t);
    }
    if (!a) {
      let c = vt(o) || (() => new o());
      t({ provide: o, useFactory: c, deps: G }, o),
        t({ provide: Eu, useValue: o, multi: !0 }, o),
        t({ provide: $t, useValue: () => Y(o), multi: !0 }, o);
    }
    let u = i.providers;
    if (u != null && !a) {
      let c = e;
      Wi(u, (l) => {
        t(l, c);
      });
    }
  } else return !1;
  return o !== e && e.providers !== void 0;
}
function Wi(e, t) {
  for (let n of e)
    yu(n) && (n = n.ɵproviders), Array.isArray(n) ? Wi(n, t) : t(n);
}
var tp = N({ provide: String, useValue: N });
function ku(e) {
  return e !== null && typeof e == 'object' && tp in e;
}
function np(e) {
  return !!(e && e.useExisting);
}
function rp(e) {
  return !!(e && e.useFactory);
}
function It(e) {
  return typeof e == 'function';
}
function op(e) {
  return !!e.useClass;
}
var Lu = new A(''),
  Zn = {},
  ip = {},
  go;
function qi() {
  return go === void 0 && (go = new sr()), go;
}
var Ae = class {},
  Gt = class extends Ae {
    get destroyed() {
      return this._destroyed;
    }
    constructor(t, n, r, o) {
      super(),
        (this.parent = n),
        (this.source = r),
        (this.scopes = o),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        Lo(t, (s) => this.processProvider(s)),
        this.records.set(Iu, pt(void 0, this)),
        o.has('environment') && this.records.set(Ae, pt(void 0, this));
      let i = this.records.get(Lu);
      i != null && typeof i.value == 'string' && this.scopes.add(i.value),
        (this.injectorDefTypes = new Set(this.get(Eu, G, C.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      let t = E(null);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let n = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of n) r();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          E(t);
      }
    }
    onDestroy(t) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(t),
        () => this.removeOnDestroy(t)
      );
    }
    runInContext(t) {
      this.assertNotDestroyed();
      let n = Te(this),
        r = ne(void 0),
        o;
      try {
        return t();
      } finally {
        Te(n), ne(r);
      }
    }
    get(t, n = Bt, r = C.Default) {
      if ((this.assertNotDestroyed(), t.hasOwnProperty(Sa))) return t[Sa](this);
      r = xr(r);
      let o,
        i = Te(this),
        s = ne(void 0);
      try {
        if (!(r & C.SkipSelf)) {
          let u = this.records.get(t);
          if (u === void 0) {
            let c = lp(t) && _r(t);
            c && this.injectableDefInScope(c)
              ? (u = pt(ko(t), Zn))
              : (u = null),
              this.records.set(t, u);
          }
          if (u != null) return this.hydrate(t, u);
        }
        let a = r & C.Self ? qi() : this.parent;
        return (n = r & C.Optional && n === Bt ? null : n), a.get(t, n);
      } catch (a) {
        if (a.name === 'NullInjectorError') {
          if (((a[or] = a[or] || []).unshift(q(t)), i)) throw a;
          return Sf(a, t, 'R3InjectorError', this.source);
        } else throw a;
      } finally {
        ne(s), Te(i);
      }
    }
    resolveInjectorInitializers() {
      let t = E(null),
        n = Te(this),
        r = ne(void 0),
        o;
      try {
        let i = this.get($t, G, C.Self);
        for (let s of i) s();
      } finally {
        Te(n), ne(r), E(t);
      }
    }
    toString() {
      let t = [],
        n = this.records;
      for (let r of n.keys()) t.push(q(r));
      return `R3Injector[${t.join(', ')}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new T(205, !1);
    }
    processProvider(t) {
      t = U(t);
      let n = It(t) ? t : U(t && t.provide),
        r = ap(t);
      if (!It(t) && t.multi === !0) {
        let o = this.records.get(n);
        o ||
          ((o = pt(void 0, Zn, !0)),
          (o.factory = () => Fo(o.multi)),
          this.records.set(n, o)),
          (n = t),
          o.multi.push(t);
      }
      this.records.set(n, r);
    }
    hydrate(t, n) {
      let r = E(null);
      try {
        return (
          n.value === Zn && ((n.value = ip), (n.value = n.factory())),
          typeof n.value == 'object' &&
            n.value &&
            cp(n.value) &&
            this._ngOnDestroyHooks.add(n.value),
          n.value
        );
      } finally {
        E(r);
      }
    }
    injectableDefInScope(t) {
      if (!t.providedIn) return !1;
      let n = U(t.providedIn);
      return typeof n == 'string'
        ? n === 'any' || this.scopes.has(n)
        : this.injectorDefTypes.has(n);
    }
    removeOnDestroy(t) {
      let n = this._onDestroyHooks.indexOf(t);
      n !== -1 && this._onDestroyHooks.splice(n, 1);
    }
  };
function ko(e) {
  let t = _r(e),
    n = t !== null ? t.factory : vt(e);
  if (n !== null) return n;
  if (e instanceof A) throw new T(204, !1);
  if (e instanceof Function) return sp(e);
  throw new T(204, !1);
}
function sp(e) {
  if (e.length > 0) throw new T(204, !1);
  let n = pf(e);
  return n !== null ? () => n.factory(e) : () => new e();
}
function ap(e) {
  if (ku(e)) return pt(void 0, e.useValue);
  {
    let t = ju(e);
    return pt(t, Zn);
  }
}
function ju(e, t, n) {
  let r;
  if (It(e)) {
    let o = U(e);
    return vt(o) || ko(o);
  } else if (ku(e)) r = () => U(e.useValue);
  else if (rp(e)) r = () => e.useFactory(...Fo(e.deps || []));
  else if (np(e)) r = () => Y(U(e.useExisting));
  else {
    let o = U(e && (e.useClass || e.provide));
    if (up(e)) r = () => new o(...Fo(e.deps));
    else return vt(o) || ko(o);
  }
  return r;
}
function pt(e, t, n = !1) {
  return { factory: e, value: t, multi: n ? [] : void 0 };
}
function up(e) {
  return !!e.deps;
}
function cp(e) {
  return (
    e !== null && typeof e == 'object' && typeof e.ngOnDestroy == 'function'
  );
}
function lp(e) {
  return typeof e == 'function' || (typeof e == 'object' && e instanceof A);
}
function Lo(e, t) {
  for (let n of e)
    Array.isArray(n) ? Lo(n, t) : n && yu(n) ? Lo(n.ɵproviders, t) : t(n);
}
function _0(e, t) {
  e instanceof Gt && e.assertNotDestroyed();
  let n,
    r = Te(e),
    o = ne(void 0);
  try {
    return t();
  } finally {
    Te(r), ne(o);
  }
}
function Vu() {
  return Du() !== void 0 || _f() != null;
}
function dp(e) {
  if (!Vu()) throw new T(-203, !1);
}
function fp(e) {
  return typeof e == 'function';
}
var Z = 0,
  y = 1,
  g = 2,
  L = 3,
  ae = 4,
  J = 5,
  K = 6,
  zt = 7,
  $ = 8,
  Et = 9,
  pe = 10,
  O = 11,
  Wt = 12,
  Pa = 13,
  Mt = 14,
  Q = 15,
  rn = 16,
  ht = 17,
  we = 18,
  Tr = 19,
  Bu = 20,
  Se = 21,
  Kn = 22,
  Qe = 23,
  j = 25,
  $u = 1,
  qt = 6,
  Ie = 7,
  ar = 8,
  Ct = 9,
  V = 10,
  Yi = (function (e) {
    return (
      (e[(e.None = 0)] = 'None'),
      (e[(e.HasTransplantedViews = 2)] = 'HasTransplantedViews'),
      e
    );
  })(Yi || {});
function Ne(e) {
  return Array.isArray(e) && typeof e[$u] == 'object';
}
function he(e) {
  return Array.isArray(e) && e[$u] === !0;
}
function Hu(e) {
  return (e.flags & 4) !== 0;
}
function on(e) {
  return e.componentOffset > -1;
}
function Qi(e) {
  return (e.flags & 1) === 1;
}
function Oe(e) {
  return !!e.template;
}
function Uu(e) {
  return (e[g] & 512) !== 0;
}
var jo = class {
  constructor(t, n, r) {
    (this.previousValue = t), (this.currentValue = n), (this.firstChange = r);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function Gu(e, t, n, r) {
  t !== null ? t.applyValueToInputSignal(t, r) : (e[n] = r);
}
function zu() {
  return Wu;
}
function Wu(e) {
  return e.type.prototype.ngOnChanges && (e.setInput = hp), pp;
}
zu.ngInherit = !0;
function pp() {
  let e = Yu(this),
    t = e?.current;
  if (t) {
    let n = e.previous;
    if (n === wt) e.previous = t;
    else for (let r in t) n[r] = t[r];
    (e.current = null), this.ngOnChanges(t);
  }
}
function hp(e, t, n, r, o) {
  let i = this.declaredInputs[r],
    s = Yu(e) || gp(e, { previous: wt, current: null }),
    a = s.current || (s.current = {}),
    u = s.previous,
    c = u[i];
  (a[i] = new jo(c && c.currentValue, n, u === wt)), Gu(e, t, o, n);
}
var qu = '__ngSimpleChanges__';
function Yu(e) {
  return e[qu] || null;
}
function gp(e, t) {
  return (e[qu] = t);
}
var ka = null;
var de = function (e, t, n) {
    ka?.(e, t, n);
  },
  Qu = 'svg',
  mp = 'math',
  yp = !1;
function Dp() {
  return yp;
}
function ce(e) {
  for (; Array.isArray(e); ) e = e[Z];
  return e;
}
function Zu(e, t) {
  return ce(t[e]);
}
function X(e, t) {
  return ce(t[e.index]);
}
function Zi(e, t) {
  return e.data[t];
}
function vp(e, t) {
  return e[t];
}
function rt(e, t) {
  let n = t[e];
  return Ne(n) ? n : n[Z];
}
function wp(e) {
  return (e[g] & 4) === 4;
}
function Ki(e) {
  return (e[g] & 128) === 128;
}
function Ip(e) {
  return he(e[L]);
}
function ur(e, t) {
  return t == null ? null : e[t];
}
function Ku(e) {
  e[ht] = 0;
}
function Ep(e) {
  e[g] & 1024 || ((e[g] |= 1024), Ki(e) && Yt(e));
}
function Cp(e, t) {
  for (; e > 0; ) (t = t[Mt]), e--;
  return t;
}
function Ji(e) {
  return !!(e[g] & 9216 || e[Qe]?.dirty);
}
function Vo(e) {
  e[pe].changeDetectionScheduler?.notify(1),
    Ji(e)
      ? Yt(e)
      : e[g] & 64 &&
        (Dp()
          ? ((e[g] |= 1024), Yt(e))
          : e[pe].changeDetectionScheduler?.notify());
}
function Yt(e) {
  e[pe].changeDetectionScheduler?.notify();
  let t = Qt(e);
  for (; t !== null && !(t[g] & 8192 || ((t[g] |= 8192), !Ki(t))); ) t = Qt(t);
}
function Ju(e, t) {
  if ((e[g] & 256) === 256) throw new T(911, !1);
  e[Se] === null && (e[Se] = []), e[Se].push(t);
}
function bp(e, t) {
  if (e[Se] === null) return;
  let n = e[Se].indexOf(t);
  n !== -1 && e[Se].splice(n, 1);
}
function Qt(e) {
  let t = e[L];
  return he(t) ? t[L] : t;
}
var v = { lFrame: ac(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
function Mp() {
  return v.lFrame.elementDepthCount;
}
function _p() {
  v.lFrame.elementDepthCount++;
}
function xp() {
  v.lFrame.elementDepthCount--;
}
function Xu() {
  return v.bindingsEnabled;
}
function _t() {
  return v.skipHydrationRootTNode !== null;
}
function Tp(e) {
  return v.skipHydrationRootTNode === e;
}
function Sp(e) {
  v.skipHydrationRootTNode = e;
}
function Np() {
  v.skipHydrationRootTNode = null;
}
function M() {
  return v.lFrame.lView;
}
function B() {
  return v.lFrame.tView;
}
function x0(e) {
  return (v.lFrame.contextLView = e), e[$];
}
function T0(e) {
  return (v.lFrame.contextLView = null), e;
}
function ee() {
  let e = ec();
  for (; e !== null && e.type === 64; ) e = e.parent;
  return e;
}
function ec() {
  return v.lFrame.currentTNode;
}
function Ap() {
  let e = v.lFrame,
    t = e.currentTNode;
  return e.isParent ? t : t.parent;
}
function sn(e, t) {
  let n = v.lFrame;
  (n.currentTNode = e), (n.isParent = t);
}
function tc() {
  return v.lFrame.isParent;
}
function nc() {
  v.lFrame.isParent = !1;
}
function Op() {
  return v.lFrame.contextLView;
}
function Fp(e) {
  return (v.lFrame.bindingIndex = e);
}
function xt() {
  return v.lFrame.bindingIndex++;
}
function rc(e) {
  let t = v.lFrame,
    n = t.bindingIndex;
  return (t.bindingIndex = t.bindingIndex + e), n;
}
function Rp() {
  return v.lFrame.inI18n;
}
function Pp(e, t) {
  let n = v.lFrame;
  (n.bindingIndex = n.bindingRootIndex = e), Bo(t);
}
function kp() {
  return v.lFrame.currentDirectiveIndex;
}
function Bo(e) {
  v.lFrame.currentDirectiveIndex = e;
}
function Lp(e) {
  let t = v.lFrame.currentDirectiveIndex;
  return t === -1 ? null : e[t];
}
function oc() {
  return v.lFrame.currentQueryIndex;
}
function Xi(e) {
  v.lFrame.currentQueryIndex = e;
}
function jp(e) {
  let t = e[y];
  return t.type === 2 ? t.declTNode : t.type === 1 ? e[J] : null;
}
function ic(e, t, n) {
  if (n & C.SkipSelf) {
    let o = t,
      i = e;
    for (; (o = o.parent), o === null && !(n & C.Host); )
      if (((o = jp(i)), o === null || ((i = i[Mt]), o.type & 10))) break;
    if (o === null) return !1;
    (t = o), (e = i);
  }
  let r = (v.lFrame = sc());
  return (r.currentTNode = t), (r.lView = e), !0;
}
function es(e) {
  let t = sc(),
    n = e[y];
  (v.lFrame = t),
    (t.currentTNode = n.firstChild),
    (t.lView = e),
    (t.tView = n),
    (t.contextLView = e),
    (t.bindingIndex = n.bindingStartIndex),
    (t.inI18n = !1);
}
function sc() {
  let e = v.lFrame,
    t = e === null ? null : e.child;
  return t === null ? ac(e) : t;
}
function ac(e) {
  let t = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: e,
    child: null,
    inI18n: !1,
  };
  return e !== null && (e.child = t), t;
}
function uc() {
  let e = v.lFrame;
  return (v.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
}
var cc = uc;
function ts() {
  let e = uc();
  (e.isParent = !0),
    (e.tView = null),
    (e.selectedIndex = -1),
    (e.contextLView = null),
    (e.elementDepthCount = 0),
    (e.currentDirectiveIndex = -1),
    (e.currentNamespace = null),
    (e.bindingRootIndex = -1),
    (e.bindingIndex = -1),
    (e.currentQueryIndex = 0);
}
function Vp(e) {
  return (v.lFrame.contextLView = Cp(e, v.lFrame.contextLView))[$];
}
function Re() {
  return v.lFrame.selectedIndex;
}
function Ze(e) {
  v.lFrame.selectedIndex = e;
}
function ns() {
  let e = v.lFrame;
  return Zi(e.tView, e.selectedIndex);
}
function S0() {
  v.lFrame.currentNamespace = Qu;
}
function N0() {
  Bp();
}
function Bp() {
  v.lFrame.currentNamespace = null;
}
function lc() {
  return v.lFrame.currentNamespace;
}
var dc = !0;
function rs() {
  return dc;
}
function ge(e) {
  dc = e;
}
function $p(e, t, n) {
  let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
  if (r) {
    let s = Wu(t);
    (n.preOrderHooks ??= []).push(e, s),
      (n.preOrderCheckHooks ??= []).push(e, s);
  }
  o && (n.preOrderHooks ??= []).push(0 - e, o),
    i &&
      ((n.preOrderHooks ??= []).push(e, i),
      (n.preOrderCheckHooks ??= []).push(e, i));
}
function os(e, t) {
  for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
    let i = e.data[n].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: u,
        ngAfterViewChecked: c,
        ngOnDestroy: l,
      } = i;
    s && (e.contentHooks ??= []).push(-n, s),
      a &&
        ((e.contentHooks ??= []).push(n, a),
        (e.contentCheckHooks ??= []).push(n, a)),
      u && (e.viewHooks ??= []).push(-n, u),
      c &&
        ((e.viewHooks ??= []).push(n, c), (e.viewCheckHooks ??= []).push(n, c)),
      l != null && (e.destroyHooks ??= []).push(n, l);
  }
}
function Jn(e, t, n) {
  fc(e, t, 3, n);
}
function Xn(e, t, n, r) {
  (e[g] & 3) === n && fc(e, t, n, r);
}
function mo(e, t) {
  let n = e[g];
  (n & 3) === t && ((n &= 16383), (n += 1), (e[g] = n));
}
function fc(e, t, n, r) {
  let o = r !== void 0 ? e[ht] & 65535 : 0,
    i = r ?? -1,
    s = t.length - 1,
    a = 0;
  for (let u = o; u < s; u++)
    if (typeof t[u + 1] == 'number') {
      if (((a = t[u]), r != null && a >= r)) break;
    } else
      t[u] < 0 && (e[ht] += 65536),
        (a < i || i == -1) &&
          (Hp(e, n, t, u), (e[ht] = (e[ht] & 4294901760) + u + 2)),
        u++;
}
function La(e, t) {
  de(4, e, t);
  let n = E(null);
  try {
    t.call(e);
  } finally {
    E(n), de(5, e, t);
  }
}
function Hp(e, t, n, r) {
  let o = n[r] < 0,
    i = n[r + 1],
    s = o ? -n[r] : n[r],
    a = e[s];
  o
    ? e[g] >> 14 < e[ht] >> 16 &&
      (e[g] & 3) === t &&
      ((e[g] += 16384), La(a, i))
    : La(a, i);
}
var Dt = -1,
  Ke = class {
    constructor(t, n, r) {
      (this.factory = t),
        (this.resolving = !1),
        (this.canSeeViewProviders = n),
        (this.injectImpl = r);
    }
  };
function Up(e) {
  return e instanceof Ke;
}
function Gp(e) {
  return (e.flags & 8) !== 0;
}
function zp(e) {
  return (e.flags & 16) !== 0;
}
function pc(e) {
  return e !== Dt;
}
function cr(e) {
  return e & 32767;
}
function Wp(e) {
  return e >> 16;
}
function lr(e, t) {
  let n = Wp(e),
    r = t;
  for (; n > 0; ) (r = r[Mt]), n--;
  return r;
}
var $o = !0;
function ja(e) {
  let t = $o;
  return ($o = e), t;
}
var qp = 256,
  hc = qp - 1,
  gc = 5,
  Yp = 0,
  fe = {};
function Qp(e, t, n) {
  let r;
  typeof n == 'string'
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(Vt) && (r = n[Vt]),
    r == null && (r = n[Vt] = Yp++);
  let o = r & hc,
    i = 1 << o;
  t.data[e + (o >> gc)] |= i;
}
function dr(e, t) {
  let n = mc(e, t);
  if (n !== -1) return n;
  let r = t[y];
  r.firstCreatePass &&
    ((e.injectorIndex = t.length),
    yo(r.data, e),
    yo(t, null),
    yo(r.blueprint, null));
  let o = is(e, t),
    i = e.injectorIndex;
  if (pc(o)) {
    let s = cr(o),
      a = lr(o, t),
      u = a[y].data;
    for (let c = 0; c < 8; c++) t[i + c] = a[s + c] | u[s + c];
  }
  return (t[i + 8] = o), i;
}
function yo(e, t) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
}
function mc(e, t) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    t[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex;
}
function is(e, t) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
  let n = 0,
    r = null,
    o = t;
  for (; o !== null; ) {
    if (((r = Ic(o)), r === null)) return Dt;
    if ((n++, (o = o[Mt]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16);
  }
  return Dt;
}
function Ho(e, t, n) {
  Qp(e, t, n);
}
function Zp(e, t) {
  if (t === 'class') return e.classes;
  if (t === 'style') return e.styles;
  let n = e.attrs;
  if (n) {
    let r = n.length,
      o = 0;
    for (; o < r; ) {
      let i = n[o];
      if (bu(i)) break;
      if (i === 0) o = o + 2;
      else if (typeof i == 'number')
        for (o++; o < r && typeof n[o] == 'string'; ) o++;
      else {
        if (i === t) return n[o + 1];
        o = o + 2;
      }
    }
  }
  return null;
}
function yc(e, t, n) {
  if (n & C.Optional || e !== void 0) return e;
  Hi(t, 'NodeInjector');
}
function Dc(e, t, n, r) {
  if (
    (n & C.Optional && r === void 0 && (r = null), !(n & (C.Self | C.Host)))
  ) {
    let o = e[Et],
      i = ne(void 0);
    try {
      return o ? o.get(t, r, n & C.Optional) : vu(t, r, n & C.Optional);
    } finally {
      ne(i);
    }
  }
  return yc(r, t, n);
}
function vc(e, t, n, r = C.Default, o) {
  if (e !== null) {
    if (t[g] & 2048 && !(r & C.Self)) {
      let s = eh(e, t, n, r, fe);
      if (s !== fe) return s;
    }
    let i = wc(e, t, n, r, fe);
    if (i !== fe) return i;
  }
  return Dc(t, n, r, o);
}
function wc(e, t, n, r, o) {
  let i = Jp(n);
  if (typeof i == 'function') {
    if (!ic(t, e, r)) return r & C.Host ? yc(o, n, r) : Dc(t, n, r, o);
    try {
      let s;
      if (((s = i(r)), s == null && !(r & C.Optional))) Hi(n);
      else return s;
    } finally {
      cc();
    }
  } else if (typeof i == 'number') {
    let s = null,
      a = mc(e, t),
      u = Dt,
      c = r & C.Host ? t[Q][J] : null;
    for (
      (a === -1 || r & C.SkipSelf) &&
      ((u = a === -1 ? is(e, t) : t[a + 8]),
      u === Dt || !Ba(r, !1)
        ? (a = -1)
        : ((s = t[y]), (a = cr(u)), (t = lr(u, t))));
      a !== -1;

    ) {
      let l = t[y];
      if (Va(i, a, l.data)) {
        let d = Kp(a, t, n, s, r, c);
        if (d !== fe) return d;
      }
      (u = t[a + 8]),
        u !== Dt && Ba(r, t[y].data[a + 8] === c) && Va(i, a, t)
          ? ((s = l), (a = cr(u)), (t = lr(u, t)))
          : (a = -1);
    }
  }
  return o;
}
function Kp(e, t, n, r, o, i) {
  let s = t[y],
    a = s.data[e + 8],
    u = r == null ? on(a) && $o : r != s && (a.type & 3) !== 0,
    c = o & C.Host && i === a,
    l = er(a, s, n, u, c);
  return l !== null ? Je(t, s, l, a) : fe;
}
function er(e, t, n, r, o) {
  let i = e.providerIndexes,
    s = t.data,
    a = i & 1048575,
    u = e.directiveStart,
    c = e.directiveEnd,
    l = i >> 20,
    d = r ? a : a + l,
    f = o ? a + l : c;
  for (let p = d; p < f; p++) {
    let h = s[p];
    if ((p < u && n === h) || (p >= u && h.type === n)) return p;
  }
  if (o) {
    let p = s[u];
    if (p && Oe(p) && p.type === n) return u;
  }
  return null;
}
function Je(e, t, n, r) {
  let o = e[n],
    i = t.data;
  if (Up(o)) {
    let s = o;
    s.resolving && wf(vf(i[n]));
    let a = ja(s.canSeeViewProviders);
    s.resolving = !0;
    let u,
      c = s.injectImpl ? ne(s.injectImpl) : null,
      l = ic(e, r, C.Default);
    try {
      (o = e[n] = s.factory(void 0, i, e, r)),
        t.firstCreatePass && n >= r.directiveStart && $p(n, i[n], t);
    } finally {
      c !== null && ne(c), ja(a), (s.resolving = !1), cc();
    }
  }
  return o;
}
function Jp(e) {
  if (typeof e == 'string') return e.charCodeAt(0) || 0;
  let t = e.hasOwnProperty(Vt) ? e[Vt] : void 0;
  return typeof t == 'number' ? (t >= 0 ? t & hc : Xp) : t;
}
function Va(e, t, n) {
  let r = 1 << e;
  return !!(n[t + (e >> gc)] & r);
}
function Ba(e, t) {
  return !(e & C.Self) && !(e & C.Host && t);
}
var We = class {
  constructor(t, n) {
    (this._tNode = t), (this._lView = n);
  }
  get(t, n, r) {
    return vc(this._tNode, this._lView, t, xr(r), n);
  }
};
function Xp() {
  return new We(ee(), M());
}
function A0(e) {
  return Mr(() => {
    let t = e.prototype.constructor,
      n = t[rr] || Uo(t),
      r = Object.prototype,
      o = Object.getPrototypeOf(e.prototype).constructor;
    for (; o && o !== r; ) {
      let i = o[rr] || Uo(o);
      if (i && i !== n) return i;
      o = Object.getPrototypeOf(o);
    }
    return (i) => new i();
  });
}
function Uo(e) {
  return pu(e)
    ? () => {
        let t = Uo(U(e));
        return t && t();
      }
    : vt(e);
}
function eh(e, t, n, r, o) {
  let i = e,
    s = t;
  for (; i !== null && s !== null && s[g] & 2048 && !(s[g] & 512); ) {
    let a = wc(i, s, n, r | C.Self, fe);
    if (a !== fe) return a;
    let u = i.parent;
    if (!u) {
      let c = s[Bu];
      if (c) {
        let l = c.get(n, fe, r);
        if (l !== fe) return l;
      }
      (u = Ic(s)), (s = s[Mt]);
    }
    i = u;
  }
  return o;
}
function Ic(e) {
  let t = e[y],
    n = t.type;
  return n === 2 ? t.declTNode : n === 1 ? e[J] : null;
}
function th(e) {
  return Zp(ee(), e);
}
function $a(e, t = null, n = null, r) {
  let o = Ec(e, t, n, r);
  return o.resolveInjectorInitializers(), o;
}
function Ec(e, t = null, n = null, r, o = new Set()) {
  let i = [n || G, ep(e)];
  return (
    (r = r || (typeof e == 'object' ? void 0 : q(e))),
    new Gt(i, t || qi(), r || null, o)
  );
}
var Tt = (() => {
  let t = class t {
    static create(r, o) {
      if (Array.isArray(r)) return $a({ name: '' }, o, r, '');
      {
        let i = r.name ?? '';
        return $a({ name: i }, r.parent, r.providers, i);
      }
    }
  };
  (t.THROW_IF_NOT_FOUND = Bt),
    (t.NULL = new sr()),
    (t.ɵprov = R({ token: t, providedIn: 'any', factory: () => Y(Iu) })),
    (t.__NG_ELEMENT_ID__ = -1);
  let e = t;
  return e;
})();
var nh = 'ngOriginalError';
function Do(e) {
  return e[nh];
}
var Xe = class {
    constructor() {
      this._console = console;
    }
    handleError(t) {
      let n = this._findOriginalError(t);
      this._console.error('ERROR', t),
        n && this._console.error('ORIGINAL ERROR', n);
    }
    _findOriginalError(t) {
      let n = t && Do(t);
      for (; n && Do(n); ) n = Do(n);
      return n || null;
    }
  },
  Cc = new A('', {
    providedIn: 'root',
    factory: () => b(Xe).handleError.bind(void 0),
  }),
  ss = (() => {
    let t = class t {};
    (t.__NG_ELEMENT_ID__ = rh), (t.__NG_ENV_ID__ = (r) => r);
    let e = t;
    return e;
  })(),
  Go = class extends ss {
    constructor(t) {
      super(), (this._lView = t);
    }
    onDestroy(t) {
      return Ju(this._lView, t), () => bp(this._lView, t);
    }
  };
function rh() {
  return new Go(M());
}
function oh() {
  return St(ee(), M());
}
function St(e, t) {
  return new Nt(X(e, t));
}
var Nt = (() => {
  let t = class t {
    constructor(r) {
      this.nativeElement = r;
    }
  };
  t.__NG_ELEMENT_ID__ = oh;
  let e = t;
  return e;
})();
function ih(e) {
  return e instanceof Nt ? e.nativeElement : e;
}
var zo = class extends le {
  constructor(t = !1) {
    super(),
      (this.destroyRef = void 0),
      (this.__isAsync = t),
      Vu() && (this.destroyRef = b(ss, { optional: !0 }) ?? void 0);
  }
  emit(t) {
    let n = E(null);
    try {
      super.next(t);
    } finally {
      E(n);
    }
  }
  subscribe(t, n, r) {
    let o = t,
      i = n || (() => null),
      s = r;
    if (t && typeof t == 'object') {
      let u = t;
      (o = u.next?.bind(u)), (i = u.error?.bind(u)), (s = u.complete?.bind(u));
    }
    this.__isAsync && ((i = vo(i)), o && (o = vo(o)), s && (s = vo(s)));
    let a = super.subscribe({ next: o, error: i, complete: s });
    return t instanceof P && t.add(a), a;
  }
};
function vo(e) {
  return (t) => {
    setTimeout(e, void 0, t);
  };
}
var ze = zo;
function sh() {
  return this._results[Symbol.iterator]();
}
var Wo = class e {
    get changes() {
      return (this._changes ??= new ze());
    }
    constructor(t = !1) {
      (this._emitDistinctChangesOnly = t),
        (this.dirty = !0),
        (this._onDirty = void 0),
        (this._results = []),
        (this._changesDetected = !1),
        (this._changes = void 0),
        (this.length = 0),
        (this.first = void 0),
        (this.last = void 0);
      let n = e.prototype;
      n[Symbol.iterator] || (n[Symbol.iterator] = sh);
    }
    get(t) {
      return this._results[t];
    }
    map(t) {
      return this._results.map(t);
    }
    filter(t) {
      return this._results.filter(t);
    }
    find(t) {
      return this._results.find(t);
    }
    reduce(t, n) {
      return this._results.reduce(t, n);
    }
    forEach(t) {
      this._results.forEach(t);
    }
    some(t) {
      return this._results.some(t);
    }
    toArray() {
      return this._results.slice();
    }
    toString() {
      return this._results.toString();
    }
    reset(t, n) {
      this.dirty = !1;
      let r = Of(t);
      (this._changesDetected = !Af(this._results, r, n)) &&
        ((this._results = r),
        (this.length = r.length),
        (this.last = r[this.length - 1]),
        (this.first = r[0]));
    }
    notifyOnChanges() {
      this._changes !== void 0 &&
        (this._changesDetected || !this._emitDistinctChangesOnly) &&
        this._changes.emit(this);
    }
    onDirty(t) {
      this._onDirty = t;
    }
    setDirty() {
      (this.dirty = !0), this._onDirty?.();
    }
    destroy() {
      this._changes !== void 0 &&
        (this._changes.complete(), this._changes.unsubscribe());
    }
  },
  ah = 'ngSkipHydration',
  uh = 'ngskiphydration';
function bc(e) {
  let t = e.mergedAttrs;
  if (t === null) return !1;
  for (let n = 0; n < t.length; n += 2) {
    let r = t[n];
    if (typeof r == 'number') return !1;
    if (typeof r == 'string' && r.toLowerCase() === uh) return !0;
  }
  return !1;
}
function Mc(e) {
  return e.hasAttribute(ah);
}
function fr(e) {
  return (e.flags & 128) === 128;
}
function ch(e) {
  if (fr(e)) return !0;
  let t = e.parent;
  for (; t; ) {
    if (fr(e) || bc(t)) return !0;
    t = t.parent;
  }
  return !1;
}
var _c = new Map(),
  lh = 0;
function dh() {
  return lh++;
}
function fh(e) {
  _c.set(e[Tr], e);
}
function ph(e) {
  _c.delete(e[Tr]);
}
var Ha = '__ngContext__';
function et(e, t) {
  Ne(t) ? ((e[Ha] = t[Tr]), fh(t)) : (e[Ha] = t);
}
function xc(e) {
  return Sc(e[Wt]);
}
function Tc(e) {
  return Sc(e[ae]);
}
function Sc(e) {
  for (; e !== null && !he(e); ) e = e[ae];
  return e;
}
var qo;
function O0(e) {
  qo = e;
}
function Sr() {
  if (qo !== void 0) return qo;
  if (typeof document < 'u') return document;
  throw new T(210, !1);
}
var hh = new A('', { providedIn: 'root', factory: () => gh }),
  gh = 'ng',
  mh = new A(''),
  as = new A('', { providedIn: 'platform', factory: () => 'unknown' });
var F0 = new A(''),
  R0 = new A('', {
    providedIn: 'root',
    factory: () =>
      Sr().body?.querySelector('[ngCspNonce]')?.getAttribute('ngCspNonce') ||
      null,
  });
function yh() {
  let e = new us();
  return b(as) === 'browser' && (e.store = Dh(Sr(), b(hh))), e;
}
var us = (() => {
  let t = class t {
    constructor() {
      (this.store = {}), (this.onSerializeCallbacks = {});
    }
    get(r, o) {
      return this.store[r] !== void 0 ? this.store[r] : o;
    }
    set(r, o) {
      this.store[r] = o;
    }
    remove(r) {
      delete this.store[r];
    }
    hasKey(r) {
      return this.store.hasOwnProperty(r);
    }
    get isEmpty() {
      return Object.keys(this.store).length === 0;
    }
    onSerialize(r, o) {
      this.onSerializeCallbacks[r] = o;
    }
    toJson() {
      for (let r in this.onSerializeCallbacks)
        if (this.onSerializeCallbacks.hasOwnProperty(r))
          try {
            this.store[r] = this.onSerializeCallbacks[r]();
          } catch (o) {
            console.warn('Exception in onSerialize callback: ', o);
          }
      return JSON.stringify(this.store).replace(/</g, '\\u003C');
    }
  };
  t.ɵprov = R({ token: t, providedIn: 'root', factory: yh });
  let e = t;
  return e;
})();
function Dh(e, t) {
  let n = e.getElementById(t + '-state');
  if (n?.textContent)
    try {
      return JSON.parse(n.textContent);
    } catch (r) {
      console.warn('Exception while restoring TransferState for app ' + t, r);
    }
  return {};
}
var Nc = 'h',
  Ac = 'b',
  Yo = (function (e) {
    return (e.FirstChild = 'f'), (e.NextSibling = 'n'), e;
  })(Yo || {}),
  vh = 'e',
  wh = 't',
  cs = 'c',
  Oc = 'x',
  pr = 'r',
  Ih = 'i',
  Eh = 'n',
  Ch = 'd',
  bh = '__nghData__',
  Fc = bh,
  wo = 'ngh',
  Mh = 'nghm',
  Rc = () => null;
function _h(e, t, n = !1) {
  let r = e.getAttribute(wo);
  if (r == null) return null;
  let [o, i] = r.split('|');
  if (((r = n ? i : o), !r)) return null;
  let s = i ? `|${i}` : '',
    a = n ? o : s,
    u = {};
  if (r !== '') {
    let l = t.get(us, null, { optional: !0 });
    l !== null && (u = l.get(Fc, [])[Number(r)]);
  }
  let c = { data: u, firstChild: e.firstChild ?? null };
  return (
    n && ((c.firstChild = e), Nr(c, 0, e.nextSibling)),
    a ? e.setAttribute(wo, a) : e.removeAttribute(wo),
    c
  );
}
function xh() {
  Rc = _h;
}
function ls(e, t, n = !1) {
  return Rc(e, t, n);
}
function Th(e) {
  let t = e._lView;
  return t[y].type === 2 ? null : (Uu(t) && (t = t[j]), t);
}
function Sh(e) {
  return e.textContent?.replace(/\s/gm, '');
}
function Nh(e) {
  let t = Sr(),
    n = t.createNodeIterator(e, NodeFilter.SHOW_COMMENT, {
      acceptNode(i) {
        let s = Sh(i);
        return s === 'ngetn' || s === 'ngtns'
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    }),
    r,
    o = [];
  for (; (r = n.nextNode()); ) o.push(r);
  for (let i of o)
    i.textContent === 'ngetn'
      ? i.replaceWith(t.createTextNode(''))
      : i.remove();
}
function Nr(e, t, n) {
  (e.segmentHeads ??= {}), (e.segmentHeads[t] = n);
}
function Qo(e, t) {
  return e.segmentHeads?.[t] ?? null;
}
function Ah(e, t) {
  let n = e.data,
    r = n[vh]?.[t] ?? null;
  return r === null && n[cs]?.[t] && (r = ds(e, t)), r;
}
function Pc(e, t) {
  return e.data[cs]?.[t] ?? null;
}
function ds(e, t) {
  let n = Pc(e, t) ?? [],
    r = 0;
  for (let o of n) r += o[pr] * (o[Oc] ?? 1);
  return r;
}
function Ar(e, t) {
  if (typeof e.disconnectedNodes > 'u') {
    let n = e.data[Ch];
    e.disconnectedNodes = n ? new Set(n) : null;
  }
  return !!e.disconnectedNodes?.has(t);
}
var Un = new A(''),
  kc = !1,
  Lc = new A('', { providedIn: 'root', factory: () => kc }),
  Oh = new A(''),
  Gn;
function Fh() {
  if (Gn === void 0 && ((Gn = null), mt.trustedTypes))
    try {
      Gn = mt.trustedTypes.createPolicy('angular', {
        createHTML: (e) => e,
        createScript: (e) => e,
        createScriptURL: (e) => e,
      });
    } catch {}
  return Gn;
}
function Or(e) {
  return Fh()?.createHTML(e) || e;
}
var Ee = class {
    constructor(t) {
      this.changingThisBreaksApplicationSecurity = t;
    }
    toString() {
      return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${lu})`;
    }
  },
  Zo = class extends Ee {
    getTypeName() {
      return 'HTML';
    }
  },
  Ko = class extends Ee {
    getTypeName() {
      return 'Style';
    }
  },
  Jo = class extends Ee {
    getTypeName() {
      return 'Script';
    }
  },
  Xo = class extends Ee {
    getTypeName() {
      return 'URL';
    }
  },
  ei = class extends Ee {
    getTypeName() {
      return 'ResourceURL';
    }
  };
function fs(e) {
  return e instanceof Ee ? e.changingThisBreaksApplicationSecurity : e;
}
function P0(e, t) {
  let n = Rh(e);
  if (n != null && n !== t) {
    if (n === 'ResourceURL' && t === 'URL') return !0;
    throw new Error(`Required a safe ${t}, got a ${n} (see ${lu})`);
  }
  return n === t;
}
function Rh(e) {
  return (e instanceof Ee && e.getTypeName()) || null;
}
function k0(e) {
  return new Zo(e);
}
function L0(e) {
  return new Ko(e);
}
function j0(e) {
  return new Jo(e);
}
function V0(e) {
  return new Xo(e);
}
function B0(e) {
  return new ei(e);
}
function Ph(e) {
  let t = new ni(e);
  return kh() ? new ti(t) : t;
}
var ti = class {
    constructor(t) {
      this.inertDocumentHelper = t;
    }
    getInertBodyElement(t) {
      t = '<body><remove></remove>' + t;
      try {
        let n = new window.DOMParser().parseFromString(Or(t), 'text/html').body;
        return n === null
          ? this.inertDocumentHelper.getInertBodyElement(t)
          : (n.removeChild(n.firstChild), n);
      } catch {
        return null;
      }
    }
  },
  ni = class {
    constructor(t) {
      (this.defaultDoc = t),
        (this.inertDocument =
          this.defaultDoc.implementation.createHTMLDocument(
            'sanitization-inert'
          ));
    }
    getInertBodyElement(t) {
      let n = this.inertDocument.createElement('template');
      return (n.innerHTML = Or(t)), n;
    }
  };
function kh() {
  try {
    return !!new window.DOMParser().parseFromString(Or(''), 'text/html');
  } catch {
    return !1;
  }
}
var Lh = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function jh(e) {
  return (e = String(e)), e.match(Lh) ? e : 'unsafe:' + e;
}
function Ce(e) {
  let t = {};
  for (let n of e.split(',')) t[n] = !0;
  return t;
}
function an(...e) {
  let t = {};
  for (let n of e) for (let r in n) n.hasOwnProperty(r) && (t[r] = !0);
  return t;
}
var jc = Ce('area,br,col,hr,img,wbr'),
  Vc = Ce('colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr'),
  Bc = Ce('rp,rt'),
  Vh = an(Bc, Vc),
  Bh = an(
    Vc,
    Ce(
      'address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul'
    )
  ),
  $h = an(
    Bc,
    Ce(
      'a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video'
    )
  ),
  Ua = an(jc, Bh, $h, Vh),
  $c = Ce('background,cite,href,itemtype,longdesc,poster,src,xlink:href'),
  Hh = Ce(
    'abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width'
  ),
  Uh = Ce(
    'aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext'
  ),
  Gh = an($c, Hh, Uh),
  zh = Ce('script,style,template'),
  ri = class {
    constructor() {
      (this.sanitizedSomething = !1), (this.buf = []);
    }
    sanitizeChildren(t) {
      let n = t.firstChild,
        r = !0,
        o = [];
      for (; n; ) {
        if (
          (n.nodeType === Node.ELEMENT_NODE
            ? (r = this.startElement(n))
            : n.nodeType === Node.TEXT_NODE
              ? this.chars(n.nodeValue)
              : (this.sanitizedSomething = !0),
          r && n.firstChild)
        ) {
          o.push(n), (n = Yh(n));
          continue;
        }
        for (; n; ) {
          n.nodeType === Node.ELEMENT_NODE && this.endElement(n);
          let i = qh(n);
          if (i) {
            n = i;
            break;
          }
          n = o.pop();
        }
      }
      return this.buf.join('');
    }
    startElement(t) {
      let n = Ga(t).toLowerCase();
      if (!Ua.hasOwnProperty(n))
        return (this.sanitizedSomething = !0), !zh.hasOwnProperty(n);
      this.buf.push('<'), this.buf.push(n);
      let r = t.attributes;
      for (let o = 0; o < r.length; o++) {
        let i = r.item(o),
          s = i.name,
          a = s.toLowerCase();
        if (!Gh.hasOwnProperty(a)) {
          this.sanitizedSomething = !0;
          continue;
        }
        let u = i.value;
        $c[a] && (u = jh(u)), this.buf.push(' ', s, '="', za(u), '"');
      }
      return this.buf.push('>'), !0;
    }
    endElement(t) {
      let n = Ga(t).toLowerCase();
      Ua.hasOwnProperty(n) &&
        !jc.hasOwnProperty(n) &&
        (this.buf.push('</'), this.buf.push(n), this.buf.push('>'));
    }
    chars(t) {
      this.buf.push(za(t));
    }
  };
function Wh(e, t) {
  return (
    (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY) !==
    Node.DOCUMENT_POSITION_CONTAINED_BY
  );
}
function qh(e) {
  let t = e.nextSibling;
  if (t && e !== t.previousSibling) throw Hc(t);
  return t;
}
function Yh(e) {
  let t = e.firstChild;
  if (t && Wh(e, t)) throw Hc(t);
  return t;
}
function Ga(e) {
  let t = e.nodeName;
  return typeof t == 'string' ? t : 'FORM';
}
function Hc(e) {
  return new Error(
    `Failed to sanitize html because the element is clobbered: ${e.outerHTML}`
  );
}
var Qh = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
  Zh = /([^\#-~ |!])/g;
function za(e) {
  return e
    .replace(/&/g, '&amp;')
    .replace(Qh, function (t) {
      let n = t.charCodeAt(0),
        r = t.charCodeAt(1);
      return '&#' + ((n - 55296) * 1024 + (r - 56320) + 65536) + ';';
    })
    .replace(Zh, function (t) {
      return '&#' + t.charCodeAt(0) + ';';
    })
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
var zn;
function $0(e, t) {
  let n = null;
  try {
    zn = zn || Ph(e);
    let r = t ? String(t) : '';
    n = zn.getInertBodyElement(r);
    let o = 5,
      i = r;
    do {
      if (o === 0)
        throw new Error(
          'Failed to sanitize html because the input is unstable'
        );
      o--, (r = i), (i = n.innerHTML), (n = zn.getInertBodyElement(r));
    } while (r !== i);
    let a = new ri().sanitizeChildren(Wa(n) || n);
    return Or(a);
  } finally {
    if (n) {
      let r = Wa(n) || n;
      for (; r.firstChild; ) r.removeChild(r.firstChild);
    }
  }
}
function Wa(e) {
  return 'content' in e && Kh(e) ? e.content : null;
}
function Kh(e) {
  return e.nodeType === Node.ELEMENT_NODE && e.nodeName === 'TEMPLATE';
}
var Jh = (function (e) {
  return (
    (e[(e.NONE = 0)] = 'NONE'),
    (e[(e.HTML = 1)] = 'HTML'),
    (e[(e.STYLE = 2)] = 'STYLE'),
    (e[(e.SCRIPT = 3)] = 'SCRIPT'),
    (e[(e.URL = 4)] = 'URL'),
    (e[(e.RESOURCE_URL = 5)] = 'RESOURCE_URL'),
    e
  );
})(Jh || {});
var Xh = /^>|^->|<!--|-->|--!>|<!-$/g,
  eg = /(<|>)/g,
  tg = '\u200B$1\u200B';
function ng(e) {
  return e.replace(Xh, (t) => t.replace(eg, tg));
}
function rg(e) {
  return e.ownerDocument.body;
}
function Uc(e) {
  return e instanceof Function ? e() : e;
}
function Wn(e) {
  return (e ?? b(Tt)).get(as) === 'browser';
}
var hr = (function (e) {
    return (
      (e[(e.Important = 1)] = 'Important'),
      (e[(e.DashCase = 2)] = 'DashCase'),
      e
    );
  })(hr || {}),
  og;
function ps(e, t) {
  return og(e, t);
}
function gt(e, t, n, r, o) {
  if (r != null) {
    let i,
      s = !1;
    he(r) ? (i = r) : Ne(r) && ((s = !0), (r = r[Z]));
    let a = ce(r);
    e === 0 && n !== null
      ? o == null
        ? qc(t, n, a)
        : gr(t, n, a, o || null, !0)
      : e === 1 && n !== null
        ? gr(t, n, a, o || null, !0)
        : e === 2
          ? Ds(t, a, s)
          : e === 3 && t.destroyNode(a),
      i != null && vg(t, e, i, n, o);
  }
}
function hs(e, t) {
  return e.createText(t);
}
function ig(e, t, n) {
  e.setValue(t, n);
}
function gs(e, t) {
  return e.createComment(ng(t));
}
function Fr(e, t, n) {
  return e.createElement(t, n);
}
function sg(e, t) {
  Gc(e, t), (t[Z] = null), (t[J] = null);
}
function ag(e, t, n, r, o, i) {
  (r[Z] = o), (r[J] = t), Pr(e, r, n, 1, o, i);
}
function Gc(e, t) {
  t[pe].changeDetectionScheduler?.notify(1), Pr(e, t, t[O], 2, null, null);
}
function ug(e) {
  let t = e[Wt];
  if (!t) return Io(e[y], e);
  for (; t; ) {
    let n = null;
    if (Ne(t)) n = t[Wt];
    else {
      let r = t[V];
      r && (n = r);
    }
    if (!n) {
      for (; t && !t[ae] && t !== e; ) Ne(t) && Io(t[y], t), (t = t[L]);
      t === null && (t = e), Ne(t) && Io(t[y], t), (n = t && t[ae]);
    }
    t = n;
  }
}
function cg(e, t, n, r) {
  let o = V + r,
    i = n.length;
  r > 0 && (n[o - 1][ae] = t),
    r < i - V ? ((t[ae] = n[o]), wu(n, V + r, t)) : (n.push(t), (t[ae] = null)),
    (t[L] = n);
  let s = t[rn];
  s !== null && n !== s && lg(s, t);
  let a = t[we];
  a !== null && a.insertView(e), Vo(t), (t[g] |= 128);
}
function lg(e, t) {
  let n = e[Ct],
    o = t[L][L][Q];
  t[Q] !== o && (e[g] |= Yi.HasTransplantedViews),
    n === null ? (e[Ct] = [t]) : n.push(t);
}
function zc(e, t) {
  let n = e[Ct],
    r = n.indexOf(t);
  n.splice(r, 1);
}
function Zt(e, t) {
  if (e.length <= V) return;
  let n = V + t,
    r = e[n];
  if (r) {
    let o = r[rn];
    o !== null && o !== e && zc(o, r), t > 0 && (e[n - 1][ae] = r[ae]);
    let i = ir(e, V + t);
    sg(r[y], r);
    let s = i[we];
    s !== null && s.detachView(i[y]),
      (r[L] = null),
      (r[ae] = null),
      (r[g] &= -129);
  }
  return r;
}
function Rr(e, t) {
  if (!(t[g] & 256)) {
    let n = t[O];
    n.destroyNode && Pr(e, t, n, 3, null, null), ug(t);
  }
}
function Io(e, t) {
  if (t[g] & 256) return;
  let n = E(null);
  try {
    (t[g] &= -129),
      (t[g] |= 256),
      t[Qe] && Zr(t[Qe]),
      fg(e, t),
      dg(e, t),
      t[y].type === 1 && t[O].destroy();
    let r = t[rn];
    if (r !== null && he(t[L])) {
      r !== t[L] && zc(r, t);
      let o = t[we];
      o !== null && o.detachView(e);
    }
    ph(t);
  } finally {
    E(n);
  }
}
function dg(e, t) {
  let n = e.cleanup,
    r = t[zt];
  if (n !== null)
    for (let i = 0; i < n.length - 1; i += 2)
      if (typeof n[i] == 'string') {
        let s = n[i + 3];
        s >= 0 ? r[s]() : r[-s].unsubscribe(), (i += 2);
      } else {
        let s = r[n[i + 1]];
        n[i].call(s);
      }
  r !== null && (t[zt] = null);
  let o = t[Se];
  if (o !== null) {
    t[Se] = null;
    for (let i = 0; i < o.length; i++) {
      let s = o[i];
      s();
    }
  }
}
function fg(e, t) {
  let n;
  if (e != null && (n = e.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let o = t[n[r]];
      if (!(o instanceof Ke)) {
        let i = n[r + 1];
        if (Array.isArray(i))
          for (let s = 0; s < i.length; s += 2) {
            let a = o[i[s]],
              u = i[s + 1];
            de(4, a, u);
            try {
              u.call(a);
            } finally {
              de(5, a, u);
            }
          }
        else {
          de(4, o, i);
          try {
            i.call(o);
          } finally {
            de(5, o, i);
          }
        }
      }
    }
}
function Wc(e, t, n) {
  return pg(e, t.parent, n);
}
function pg(e, t, n) {
  let r = t;
  for (; r !== null && r.type & 40; ) (t = r), (r = t.parent);
  if (r === null) return n[Z];
  {
    let { componentOffset: o } = r;
    if (o > -1) {
      let { encapsulation: i } = e.data[r.directiveStart + o];
      if (i === Ht.None || i === Ht.Emulated) return null;
    }
    return X(r, n);
  }
}
function gr(e, t, n, r, o) {
  e.insertBefore(t, n, r, o);
}
function qc(e, t, n) {
  e.appendChild(t, n);
}
function qa(e, t, n, r, o) {
  r !== null ? gr(e, t, n, r, o) : qc(e, t, n);
}
function hg(e, t, n, r) {
  e.removeChild(t, n, r);
}
function ms(e, t) {
  return e.parentNode(t);
}
function gg(e, t) {
  return e.nextSibling(t);
}
function Yc(e, t, n) {
  return yg(e, t, n);
}
function mg(e, t, n) {
  return e.type & 40 ? X(e, n) : null;
}
var yg = mg,
  Ya;
function ys(e, t, n, r) {
  let o = Wc(e, r, t),
    i = t[O],
    s = r.parent || t[J],
    a = Yc(s, r, t);
  if (o != null)
    if (Array.isArray(n))
      for (let u = 0; u < n.length; u++) qa(i, o, n[u], a, !1);
    else qa(i, o, n, a, !1);
  Ya !== void 0 && Ya(i, r, t, n, o);
}
function tr(e, t) {
  if (t !== null) {
    let n = t.type;
    if (n & 3) return X(t, e);
    if (n & 4) return oi(-1, e[t.index]);
    if (n & 8) {
      let r = t.child;
      if (r !== null) return tr(e, r);
      {
        let o = e[t.index];
        return he(o) ? oi(-1, o) : ce(o);
      }
    } else {
      if (n & 32) return ps(t, e)() || ce(e[t.index]);
      {
        let r = Qc(e, t);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let o = Qt(e[Q]);
          return tr(o, r);
        } else return tr(e, t.next);
      }
    }
  }
  return null;
}
function Qc(e, t) {
  if (t !== null) {
    let r = e[Q][J],
      o = t.projection;
    return r.projection[o];
  }
  return null;
}
function oi(e, t) {
  let n = V + e + 1;
  if (n < t.length) {
    let r = t[n],
      o = r[y].firstChild;
    if (o !== null) return tr(r, o);
  }
  return t[Ie];
}
function Ds(e, t, n) {
  let r = ms(e, t);
  r && hg(e, r, t, n);
}
function Zc(e) {
  e.textContent = '';
}
function vs(e, t, n, r, o, i, s) {
  for (; n != null; ) {
    let a = r[n.index],
      u = n.type;
    if (
      (s && t === 0 && (a && et(ce(a), r), (n.flags |= 2)),
      (n.flags & 32) !== 32)
    )
      if (u & 8) vs(e, t, n.child, r, o, i, !1), gt(t, e, o, a, i);
      else if (u & 32) {
        let c = ps(n, r),
          l;
        for (; (l = c()); ) gt(t, e, o, l, i);
        gt(t, e, o, a, i);
      } else u & 16 ? Kc(e, t, r, n, o, i) : gt(t, e, o, a, i);
    n = s ? n.projectionNext : n.next;
  }
}
function Pr(e, t, n, r, o, i) {
  vs(n, r, e.firstChild, t, o, i, !1);
}
function Dg(e, t, n) {
  let r = t[O],
    o = Wc(e, n, t),
    i = n.parent || t[J],
    s = Yc(i, n, t);
  Kc(r, 0, t, n, o, s);
}
function Kc(e, t, n, r, o, i) {
  let s = n[Q],
    u = s[J].projection[r.projection];
  if (Array.isArray(u))
    for (let c = 0; c < u.length; c++) {
      let l = u[c];
      gt(t, e, o, l, i);
    }
  else {
    let c = u,
      l = s[L];
    fr(r) && (c.flags |= 128), vs(e, t, c, l, o, i, !0);
  }
}
function vg(e, t, n, r, o) {
  let i = n[Ie],
    s = ce(n);
  i !== s && gt(t, e, r, i, o);
  for (let a = V; a < n.length; a++) {
    let u = n[a];
    Pr(u[y], u, e, t, r, i);
  }
}
function wg(e, t, n, r, o) {
  if (t) o ? e.addClass(n, r) : e.removeClass(n, r);
  else {
    let i = r.indexOf('-') === -1 ? void 0 : hr.DashCase;
    o == null
      ? e.removeStyle(n, r, i)
      : (typeof o == 'string' &&
          o.endsWith('!important') &&
          ((o = o.slice(0, -10)), (i |= hr.Important)),
        e.setStyle(n, r, o, i));
  }
}
function Ig(e, t, n) {
  e.setAttribute(t, 'style', n);
}
function Jc(e, t, n) {
  n === '' ? e.removeAttribute(t, 'class') : e.setAttribute(t, 'class', n);
}
function Xc(e, t, n) {
  let { mergedAttrs: r, classes: o, styles: i } = n;
  r !== null && Ro(e, t, r),
    o !== null && Jc(e, t, o),
    i !== null && Ig(e, t, i);
}
var Pe = {};
function H0(e = 1) {
  el(B(), M(), Re() + e, !1);
}
function el(e, t, n, r) {
  if (!r)
    if ((t[g] & 3) === 3) {
      let i = e.preOrderCheckHooks;
      i !== null && Jn(t, i, n);
    } else {
      let i = e.preOrderHooks;
      i !== null && Xn(t, i, 0, n);
    }
  Ze(n);
}
function kr(e, t = C.Default) {
  let n = M();
  if (n === null) return Y(e, t);
  let r = ee();
  return vc(r, n, U(e), t);
}
function U0() {
  let e = 'invalid';
  throw new Error(e);
}
function tl(e, t, n, r, o, i) {
  let s = E(null);
  try {
    let a = null;
    o & qe.SignalBased && (a = t[r][ye]),
      a !== null && a.transformFn !== void 0 && (i = a.transformFn(i)),
      o & qe.HasDecoratorInputTransform &&
        (i = e.inputTransforms[r].call(t, i)),
      e.setInput !== null ? e.setInput(t, a, i, n, r) : Gu(t, a, r, i);
  } finally {
    E(s);
  }
}
function Eg(e, t) {
  let n = e.hostBindingOpCodes;
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let o = n[r];
        if (o < 0) Ze(~o);
        else {
          let i = o,
            s = n[++r],
            a = n[++r];
          Pp(s, i);
          let u = t[i];
          a(2, u);
        }
      }
    } finally {
      Ze(-1);
    }
}
function Lr(e, t, n, r, o, i, s, a, u, c, l) {
  let d = t.blueprint.slice();
  return (
    (d[Z] = o),
    (d[g] = r | 4 | 128 | 8 | 64),
    (c !== null || (e && e[g] & 2048)) && (d[g] |= 2048),
    Ku(d),
    (d[L] = d[Mt] = e),
    (d[$] = n),
    (d[pe] = s || (e && e[pe])),
    (d[O] = a || (e && e[O])),
    (d[Et] = u || (e && e[Et]) || null),
    (d[J] = i),
    (d[Tr] = dh()),
    (d[K] = l),
    (d[Bu] = c),
    (d[Q] = t.type == 2 ? e[Q] : d),
    d
  );
}
function un(e, t, n, r, o) {
  let i = e.data[t];
  if (i === null) (i = Cg(e, t, n, r, o)), Rp() && (i.flags |= 32);
  else if (i.type & 64) {
    (i.type = n), (i.value = r), (i.attrs = o);
    let s = Ap();
    i.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return sn(i, !0), i;
}
function Cg(e, t, n, r, o) {
  let i = ec(),
    s = tc(),
    a = s ? i : i && i.parent,
    u = (e.data[t] = Ng(e, a, n, t, r, o));
  return (
    e.firstChild === null && (e.firstChild = u),
    i !== null &&
      (s
        ? i.child == null && u.parent !== null && (i.child = u)
        : i.next === null && ((i.next = u), (u.prev = i))),
    u
  );
}
function nl(e, t, n, r) {
  if (n === 0) return -1;
  let o = t.length;
  for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null);
  return o;
}
function rl(e, t, n, r, o) {
  let i = Re(),
    s = r & 2;
  try {
    Ze(-1), s && t.length > j && el(e, t, j, !1), de(s ? 2 : 0, o), n(r, o);
  } finally {
    Ze(i), de(s ? 3 : 1, o);
  }
}
function ol(e, t, n) {
  if (Hu(t)) {
    let r = E(null);
    try {
      let o = t.directiveStart,
        i = t.directiveEnd;
      for (let s = o; s < i; s++) {
        let a = e.data[s];
        if (a.contentQueries) {
          let u = n[s];
          a.contentQueries(1, u, s);
        }
      }
    } finally {
      E(r);
    }
  }
}
function il(e, t, n) {
  Xu() && (kg(e, t, n, X(n, t)), (n.flags & 64) === 64 && fl(e, t, n));
}
function sl(e, t, n = X) {
  let r = t.localNames;
  if (r !== null) {
    let o = t.index + 1;
    for (let i = 0; i < r.length; i += 2) {
      let s = r[i + 1],
        a = s === -1 ? n(t, e) : e[s];
      e[o++] = a;
    }
  }
}
function al(e) {
  let t = e.tView;
  return t === null || t.incompleteFirstPass
    ? (e.tView = ws(
        1,
        null,
        e.template,
        e.decls,
        e.vars,
        e.directiveDefs,
        e.pipeDefs,
        e.viewQuery,
        e.schemas,
        e.consts,
        e.id
      ))
    : t;
}
function ws(e, t, n, r, o, i, s, a, u, c, l) {
  let d = j + r,
    f = d + o,
    p = bg(d, f),
    h = typeof c == 'function' ? c() : c;
  return (p[y] = {
    type: e,
    blueprint: p,
    template: n,
    queries: null,
    viewQuery: a,
    declTNode: t,
    data: p.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: f,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof i == 'function' ? i() : i,
    pipeRegistry: typeof s == 'function' ? s() : s,
    firstChild: null,
    schemas: u,
    consts: h,
    incompleteFirstPass: !1,
    ssrId: l,
  });
}
function bg(e, t) {
  let n = [];
  for (let r = 0; r < t; r++) n.push(r < e ? null : Pe);
  return n;
}
function Mg(e, t, n, r) {
  let i = r.get(Lc, kc) || n === Ht.ShadowDom,
    s = e.selectRootElement(t, i);
  return _g(s), s;
}
function _g(e) {
  ul(e);
}
var ul = () => null;
function xg(e) {
  Mc(e) ? Zc(e) : Nh(e);
}
function Tg() {
  ul = xg;
}
function Sg(e, t, n, r) {
  let o = gl(t);
  o.push(n), e.firstCreatePass && ml(e).push(r, o.length - 1);
}
function Ng(e, t, n, r, o, i) {
  let s = t ? t.injectorIndex : -1,
    a = 0;
  return (
    _t() && (a |= 128),
    {
      type: n,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: o,
      attrs: i,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: t,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function Qa(e, t, n, r, o) {
  for (let i in t) {
    if (!t.hasOwnProperty(i)) continue;
    let s = t[i];
    if (s === void 0) continue;
    r ??= {};
    let a,
      u = qe.None;
    Array.isArray(s) ? ((a = s[0]), (u = s[1])) : (a = s);
    let c = i;
    if (o !== null) {
      if (!o.hasOwnProperty(i)) continue;
      c = o[i];
    }
    e === 0 ? Za(r, n, c, a, u) : Za(r, n, c, a);
  }
  return r;
}
function Za(e, t, n, r, o) {
  let i;
  e.hasOwnProperty(n) ? (i = e[n]).push(t, r) : (i = e[n] = [t, r]),
    o !== void 0 && i.push(o);
}
function Ag(e, t, n) {
  let r = t.directiveStart,
    o = t.directiveEnd,
    i = e.data,
    s = t.attrs,
    a = [],
    u = null,
    c = null;
  for (let l = r; l < o; l++) {
    let d = i[l],
      f = n ? n.get(d) : null,
      p = f ? f.inputs : null,
      h = f ? f.outputs : null;
    (u = Qa(0, d.inputs, l, u, p)), (c = Qa(1, d.outputs, l, c, h));
    let m = u !== null && s !== null && !zi(t) ? qg(u, l, s) : null;
    a.push(m);
  }
  u !== null &&
    (u.hasOwnProperty('class') && (t.flags |= 8),
    u.hasOwnProperty('style') && (t.flags |= 16)),
    (t.initialInputs = a),
    (t.inputs = u),
    (t.outputs = c);
}
function Og(e) {
  return e === 'class'
    ? 'className'
    : e === 'for'
      ? 'htmlFor'
      : e === 'formaction'
        ? 'formAction'
        : e === 'innerHtml'
          ? 'innerHTML'
          : e === 'readonly'
            ? 'readOnly'
            : e === 'tabindex'
              ? 'tabIndex'
              : e;
}
function cl(e, t, n, r, o, i, s, a) {
  let u = X(t, n),
    c = t.inputs,
    l;
  !a && c != null && (l = c[r])
    ? (Is(e, n, l, r, o), on(t) && Fg(n, t.index))
    : t.type & 3
      ? ((r = Og(r)),
        (o = s != null ? s(o, t.value || '', r) : o),
        i.setProperty(u, r, o))
      : t.type & 12;
}
function Fg(e, t) {
  let n = rt(t, e);
  n[g] & 16 || (n[g] |= 64);
}
function ll(e, t, n, r) {
  if (Xu()) {
    let o = r === null ? null : { '': -1 },
      i = jg(e, n),
      s,
      a;
    i === null ? (s = a = null) : ([s, a] = i),
      s !== null && dl(e, t, n, s, o, a),
      o && Vg(n, r, o);
  }
  n.mergedAttrs = Ut(n.mergedAttrs, n.attrs);
}
function dl(e, t, n, r, o, i) {
  for (let c = 0; c < r.length; c++) Ho(dr(n, t), e, r[c].type);
  $g(n, e.data.length, r.length);
  for (let c = 0; c < r.length; c++) {
    let l = r[c];
    l.providersResolver && l.providersResolver(l);
  }
  let s = !1,
    a = !1,
    u = nl(e, t, r.length, null);
  for (let c = 0; c < r.length; c++) {
    let l = r[c];
    (n.mergedAttrs = Ut(n.mergedAttrs, l.hostAttrs)),
      Hg(e, n, t, u, l),
      Bg(u, l, o),
      l.contentQueries !== null && (n.flags |= 4),
      (l.hostBindings !== null || l.hostAttrs !== null || l.hostVars !== 0) &&
        (n.flags |= 64);
    let d = l.type.prototype;
    !s &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((e.preOrderHooks ??= []).push(n.index), (s = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((e.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
      u++;
  }
  Ag(e, n, i);
}
function Rg(e, t, n, r, o) {
  let i = o.hostBindings;
  if (i) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let a = ~t.index;
    Pg(s) != a && s.push(a), s.push(n, r, i);
  }
}
function Pg(e) {
  let t = e.length;
  for (; t > 0; ) {
    let n = e[--t];
    if (typeof n == 'number' && n < 0) return n;
  }
  return 0;
}
function kg(e, t, n, r) {
  let o = n.directiveStart,
    i = n.directiveEnd;
  on(n) && Ug(t, n, e.data[o + n.componentOffset]),
    e.firstCreatePass || dr(n, t),
    et(r, t);
  let s = n.initialInputs;
  for (let a = o; a < i; a++) {
    let u = e.data[a],
      c = Je(t, e, a, n);
    if ((et(c, t), s !== null && Wg(t, a - o, c, u, n, s), Oe(u))) {
      let l = rt(n.index, t);
      l[$] = Je(t, e, a, n);
    }
  }
}
function fl(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd,
    i = n.index,
    s = kp();
  try {
    Ze(i);
    for (let a = r; a < o; a++) {
      let u = e.data[a],
        c = t[a];
      Bo(a),
        (u.hostBindings !== null || u.hostVars !== 0 || u.hostAttrs !== null) &&
          Lg(u, c);
    }
  } finally {
    Ze(-1), Bo(s);
  }
}
function Lg(e, t) {
  e.hostBindings !== null && e.hostBindings(1, t);
}
function jg(e, t) {
  let n = e.directiveRegistry,
    r = null,
    o = null;
  if (n)
    for (let i = 0; i < n.length; i++) {
      let s = n[i];
      if (_u(t, s.selectors, !1))
        if ((r || (r = []), Oe(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (o = o || new Map()),
              s.findHostDirectiveDefs(s, a, o),
              r.unshift(...a, s);
            let u = a.length;
            ii(e, t, u);
          } else r.unshift(s), ii(e, t, 0);
        else
          (o = o || new Map()), s.findHostDirectiveDefs?.(s, r, o), r.push(s);
    }
  return r === null ? null : [r, o];
}
function ii(e, t, n) {
  (t.componentOffset = n), (e.components ??= []).push(t.index);
}
function Vg(e, t, n) {
  if (t) {
    let r = (e.localNames = []);
    for (let o = 0; o < t.length; o += 2) {
      let i = n[t[o + 1]];
      if (i == null) throw new T(-301, !1);
      r.push(t[o], i);
    }
  }
}
function Bg(e, t, n) {
  if (n) {
    if (t.exportAs)
      for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
    Oe(t) && (n[''] = e);
  }
}
function $g(e, t, n) {
  (e.flags |= 1),
    (e.directiveStart = t),
    (e.directiveEnd = t + n),
    (e.providerIndexes = t);
}
function Hg(e, t, n, r, o) {
  e.data[r] = o;
  let i = o.factory || (o.factory = vt(o.type, !0)),
    s = new Ke(i, Oe(o), kr);
  (e.blueprint[r] = s), (n[r] = s), Rg(e, t, r, nl(e, n, o.hostVars, Pe), o);
}
function Ug(e, t, n) {
  let r = X(t, e),
    o = al(n),
    i = e[pe].rendererFactory,
    s = 16;
  n.signals ? (s = 4096) : n.onPush && (s = 64);
  let a = jr(
    e,
    Lr(e, o, null, s, r, t, null, i.createRenderer(r, n), null, null, null)
  );
  e[t.index] = a;
}
function Gg(e, t, n, r, o, i) {
  let s = X(e, t);
  zg(t[O], s, i, e.value, n, r, o);
}
function zg(e, t, n, r, o, i, s) {
  if (i == null) e.removeAttribute(t, o, n);
  else {
    let a = s == null ? $i(i) : s(i, r || '', o);
    e.setAttribute(t, o, a, n);
  }
}
function Wg(e, t, n, r, o, i) {
  let s = i[t];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let u = s[a++],
        c = s[a++],
        l = s[a++],
        d = s[a++];
      tl(r, n, u, c, l, d);
    }
}
function qg(e, t, n) {
  let r = null,
    o = 0;
  for (; o < n.length; ) {
    let i = n[o];
    if (i === 0) {
      o += 4;
      continue;
    } else if (i === 5) {
      o += 2;
      continue;
    }
    if (typeof i == 'number') break;
    if (e.hasOwnProperty(i)) {
      r === null && (r = []);
      let s = e[i];
      for (let a = 0; a < s.length; a += 3)
        if (s[a] === t) {
          r.push(i, s[a + 1], s[a + 2], n[o + 1]);
          break;
        }
    }
    o += 2;
  }
  return r;
}
function pl(e, t, n, r) {
  return [e, !0, 0, t, null, r, null, n, null, null];
}
function hl(e, t) {
  let n = e.contentQueries;
  if (n !== null) {
    let r = E(null);
    try {
      for (let o = 0; o < n.length; o += 2) {
        let i = n[o],
          s = n[o + 1];
        if (s !== -1) {
          let a = e.data[s];
          Xi(i), a.contentQueries(2, t[s], s);
        }
      }
    } finally {
      E(r);
    }
  }
}
function jr(e, t) {
  return e[Wt] ? (e[Pa][ae] = t) : (e[Wt] = t), (e[Pa] = t), t;
}
function si(e, t, n) {
  Xi(0);
  let r = E(null);
  try {
    t(e, n);
  } finally {
    E(r);
  }
}
function gl(e) {
  return e[zt] || (e[zt] = []);
}
function ml(e) {
  return e.cleanup || (e.cleanup = []);
}
function yl(e, t) {
  let n = e[Et],
    r = n ? n.get(Xe, null) : null;
  r && r.handleError(t);
}
function Is(e, t, n, r, o) {
  for (let i = 0; i < n.length; ) {
    let s = n[i++],
      a = n[i++],
      u = n[i++],
      c = t[s],
      l = e.data[s];
    tl(l, c, r, a, u, o);
  }
}
function Yg(e, t, n) {
  let r = Zu(t, e);
  ig(e[O], r, n);
}
function Qg(e, t) {
  let n = rt(t, e),
    r = n[y];
  Zg(r, n);
  let o = n[Z];
  o !== null && n[K] === null && (n[K] = ls(o, n[Et])), Es(r, n, n[$]);
}
function Zg(e, t) {
  for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
}
function Es(e, t, n) {
  es(t);
  try {
    let r = e.viewQuery;
    r !== null && si(1, r, n);
    let o = e.template;
    o !== null && rl(e, t, o, 1, n),
      e.firstCreatePass && (e.firstCreatePass = !1),
      t[we]?.finishViewCreation(e),
      e.staticContentQueries && hl(e, t),
      e.staticViewQueries && si(2, e.viewQuery, n);
    let i = e.components;
    i !== null && Kg(t, i);
  } catch (r) {
    throw (
      (e.firstCreatePass &&
        ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
      r)
    );
  } finally {
    (t[g] &= -5), ts();
  }
}
function Kg(e, t) {
  for (let n = 0; n < t.length; n++) Qg(e, t[n]);
}
function Vr(e, t, n, r) {
  let o = E(null);
  try {
    let i = t.tView,
      a = e[g] & 4096 ? 4096 : 16,
      u = Lr(
        e,
        i,
        n,
        a,
        null,
        t,
        null,
        null,
        r?.injector ?? null,
        r?.embeddedViewInjector ?? null,
        r?.dehydratedView ?? null
      ),
      c = e[t.index];
    u[rn] = c;
    let l = e[we];
    return l !== null && (u[we] = l.createEmbeddedView(i)), Es(i, u, n), u;
  } finally {
    E(o);
  }
}
function Dl(e, t) {
  let n = V + t;
  if (n < e.length) return e[n];
}
function Kt(e, t) {
  return !t || t.firstChild === null || fr(e);
}
function Br(e, t, n, r = !0) {
  let o = t[y];
  if ((cg(o, t, e, n), r)) {
    let s = oi(n, e),
      a = t[O],
      u = ms(a, e[Ie]);
    u !== null && ag(o, e[J], a, t, u, s);
  }
  let i = t[K];
  i !== null && i.firstChild !== null && (i.firstChild = null);
}
function vl(e, t) {
  let n = Zt(e, t);
  return n !== void 0 && Rr(n[y], n), n;
}
function mr(e, t, n, r, o = !1) {
  for (; n !== null; ) {
    let i = t[n.index];
    i !== null && r.push(ce(i)), he(i) && Jg(i, r);
    let s = n.type;
    if (s & 8) mr(e, t, n.child, r);
    else if (s & 32) {
      let a = ps(n, t),
        u;
      for (; (u = a()); ) r.push(u);
    } else if (s & 16) {
      let a = Qc(t, n);
      if (Array.isArray(a)) r.push(...a);
      else {
        let u = Qt(t[Q]);
        mr(u[y], u, a, r, !0);
      }
    }
    n = o ? n.projectionNext : n.next;
  }
  return r;
}
function Jg(e, t) {
  for (let n = V; n < e.length; n++) {
    let r = e[n],
      o = r[y].firstChild;
    o !== null && mr(r[y], r, o, t);
  }
  e[Ie] !== e[Z] && t.push(e[Ie]);
}
var wl = [];
function Xg(e) {
  return e[Qe] ?? em(e);
}
function em(e) {
  let t = wl.pop() ?? Object.create(nm);
  return (t.lView = e), t;
}
function tm(e) {
  e.lView[Qe] !== e && ((e.lView = null), wl.push(e));
}
var nm = Me(be({}, Ft), {
    consumerIsAlwaysLive: !0,
    consumerMarkedDirty: (e) => {
      Yt(e.lView);
    },
    consumerOnSignalRead() {
      this.lView[Qe] = this;
    },
  }),
  Il = 100;
function El(e, t = !0, n = 0) {
  let r = e[pe],
    o = r.rendererFactory,
    i = !1;
  i || o.begin?.();
  try {
    rm(e, n);
  } catch (s) {
    throw (t && yl(e, s), s);
  } finally {
    i || (o.end?.(), r.inlineEffectRunner?.flush());
  }
}
function rm(e, t) {
  ai(e, t);
  let n = 0;
  for (; Ji(e); ) {
    if (n === Il) throw new T(103, !1);
    n++, ai(e, 1);
  }
}
function om(e, t, n, r) {
  let o = t[g];
  if ((o & 256) === 256) return;
  let i = !1;
  !i && t[pe].inlineEffectRunner?.flush(), es(t);
  let s = null,
    a = null;
  !i && im(e) && ((a = Xg(t)), (s = pn(a)));
  try {
    Ku(t), Fp(e.bindingStartIndex), n !== null && rl(e, t, n, 2, r);
    let u = (o & 3) === 3;
    if (!i)
      if (u) {
        let d = e.preOrderCheckHooks;
        d !== null && Jn(t, d, null);
      } else {
        let d = e.preOrderHooks;
        d !== null && Xn(t, d, 0, null), mo(t, 0);
      }
    if ((sm(t), Cl(t, 0), e.contentQueries !== null && hl(e, t), !i))
      if (u) {
        let d = e.contentCheckHooks;
        d !== null && Jn(t, d);
      } else {
        let d = e.contentHooks;
        d !== null && Xn(t, d, 1), mo(t, 1);
      }
    Eg(e, t);
    let c = e.components;
    c !== null && Ml(t, c, 0);
    let l = e.viewQuery;
    if ((l !== null && si(2, l, r), !i))
      if (u) {
        let d = e.viewCheckHooks;
        d !== null && Jn(t, d);
      } else {
        let d = e.viewHooks;
        d !== null && Xn(t, d, 2), mo(t, 2);
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[Kn])) {
      for (let d of t[Kn]) d();
      t[Kn] = null;
    }
    i || (t[g] &= -73);
  } catch (u) {
    throw (Yt(t), u);
  } finally {
    a !== null && (hn(a, s), tm(a)), ts();
  }
}
function im(e) {
  return e.type !== 2;
}
function Cl(e, t) {
  for (let n = xc(e); n !== null; n = Tc(n))
    for (let r = V; r < n.length; r++) {
      let o = n[r];
      bl(o, t);
    }
}
function sm(e) {
  for (let t = xc(e); t !== null; t = Tc(t)) {
    if (!(t[g] & Yi.HasTransplantedViews)) continue;
    let n = t[Ct];
    for (let r = 0; r < n.length; r++) {
      let o = n[r],
        i = o[L];
      Ep(o);
    }
  }
}
function am(e, t, n) {
  let r = rt(t, e);
  bl(r, n);
}
function bl(e, t) {
  Ki(e) && ai(e, t);
}
function ai(e, t) {
  let r = e[y],
    o = e[g],
    i = e[Qe],
    s = !!(t === 0 && o & 16);
  if (
    ((s ||= !!(o & 64 && t === 0)),
    (s ||= !!(o & 1024)),
    (s ||= !!(i?.dirty && gn(i))),
    i && (i.dirty = !1),
    (e[g] &= -9217),
    s)
  )
    om(r, e, r.template, e[$]);
  else if (o & 8192) {
    Cl(e, 1);
    let a = r.components;
    a !== null && Ml(e, a, 1);
  }
}
function Ml(e, t, n) {
  for (let r = 0; r < t.length; r++) am(e, t[r], n);
}
function Cs(e) {
  for (e[pe].changeDetectionScheduler?.notify(); e; ) {
    e[g] |= 64;
    let t = Qt(e);
    if (Uu(e) && !t) return e;
    e = t;
  }
  return null;
}
var tt = class {
    get rootNodes() {
      let t = this._lView,
        n = t[y];
      return mr(n, t, n.firstChild, []);
    }
    constructor(t, n, r = !0) {
      (this._lView = t),
        (this._cdRefInjectingView = n),
        (this.notifyErrorHandler = r),
        (this._appRef = null),
        (this._attachedToViewContainer = !1);
    }
    get context() {
      return this._lView[$];
    }
    set context(t) {
      this._lView[$] = t;
    }
    get destroyed() {
      return (this._lView[g] & 256) === 256;
    }
    destroy() {
      if (this._appRef) this._appRef.detachView(this);
      else if (this._attachedToViewContainer) {
        let t = this._lView[L];
        if (he(t)) {
          let n = t[ar],
            r = n ? n.indexOf(this) : -1;
          r > -1 && (Zt(t, r), ir(n, r));
        }
        this._attachedToViewContainer = !1;
      }
      Rr(this._lView[y], this._lView);
    }
    onDestroy(t) {
      Ju(this._lView, t);
    }
    markForCheck() {
      Cs(this._cdRefInjectingView || this._lView);
    }
    detach() {
      this._lView[g] &= -129;
    }
    reattach() {
      Vo(this._lView), (this._lView[g] |= 128);
    }
    detectChanges() {
      (this._lView[g] |= 1024), El(this._lView, this.notifyErrorHandler);
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
      if (this._appRef) throw new T(902, !1);
      this._attachedToViewContainer = !0;
    }
    detachFromAppRef() {
      (this._appRef = null), Gc(this._lView[y], this._lView);
    }
    attachToAppRef(t) {
      if (this._attachedToViewContainer) throw new T(902, !1);
      (this._appRef = t), Vo(this._lView);
    }
  },
  Jt = (() => {
    let t = class t {};
    t.__NG_ELEMENT_ID__ = lm;
    let e = t;
    return e;
  })(),
  um = Jt,
  cm = class extends um {
    constructor(t, n, r) {
      super(),
        (this._declarationLView = t),
        (this._declarationTContainer = n),
        (this.elementRef = r);
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(t, n) {
      return this.createEmbeddedViewImpl(t, n);
    }
    createEmbeddedViewImpl(t, n, r) {
      let o = Vr(this._declarationLView, this._declarationTContainer, t, {
        embeddedViewInjector: n,
        dehydratedView: r,
      });
      return new tt(o);
    }
  };
function lm() {
  return bs(ee(), M());
}
function bs(e, t) {
  return e.type & 4 ? new cm(t, e, St(e, t)) : null;
}
function _l(e) {
  let t = e[qt] ?? [],
    r = e[L][O];
  for (let o of t) dm(o, r);
  e[qt] = G;
}
function dm(e, t) {
  let n = 0,
    r = e.firstChild;
  if (r) {
    let o = e.data[pr];
    for (; n < o; ) {
      let i = r.nextSibling;
      Ds(t, r, !1), (r = i), n++;
    }
  }
}
function xl(e) {
  _l(e);
  for (let t = V; t < e.length; t++) yr(e[t]);
}
function fm(e) {
  let t = e[K]?.i18nNodes;
  if (t) {
    let n = e[O];
    for (let r of t.values()) Ds(n, r, !1);
    e[K].i18nNodes = void 0;
  }
}
function yr(e) {
  fm(e);
  let t = e[y];
  for (let n = j; n < t.bindingStartIndex; n++)
    if (he(e[n])) {
      let r = e[n];
      xl(r);
    } else Ne(e[n]) && yr(e[n]);
}
function pm(e) {
  let t = e._views;
  for (let n of t) {
    let r = Th(n);
    if (r !== null && r[Z] !== null)
      if (Ne(r)) yr(r);
      else {
        let o = r[Z];
        yr(o), xl(r);
      }
  }
}
var hm = new RegExp(`^(\\d+)*(${Ac}|${Nc})*(.*)`);
function gm(e) {
  let t = e.match(hm),
    [n, r, o, i] = t,
    s = r ? parseInt(r, 10) : o,
    a = [];
  for (let [u, c, l] of i.matchAll(/(f|n)(\d*)/g)) {
    let d = parseInt(l, 10) || 1;
    a.push(c, d);
  }
  return [s, ...a];
}
function mm(e) {
  return !e.prev && e.parent?.type === 8;
}
function Eo(e) {
  return e.index - j;
}
function ym(e, t) {
  let n = e.i18nNodes;
  if (n) {
    let r = n.get(t);
    return r && n.delete(t), r;
  }
  return null;
}
function $r(e, t, n, r) {
  let o = Eo(r),
    i = ym(e, o);
  if (!i) {
    let s = e.data[Eh];
    if (s?.[o]) i = vm(s[o], n);
    else if (t.firstChild === r) i = e.firstChild;
    else {
      let a = r.prev === null,
        u = r.prev ?? r.parent;
      if (mm(r)) {
        let c = Eo(r.parent);
        i = Qo(e, c);
      } else {
        let c = X(u, n);
        if (a) i = c.firstChild;
        else {
          let l = Eo(u),
            d = Qo(e, l);
          if (u.type === 2 && d) {
            let p = ds(e, l) + 1;
            i = Hr(p, d);
          } else i = c.nextSibling;
        }
      }
    }
  }
  return i;
}
function Hr(e, t) {
  let n = t;
  for (let r = 0; r < e; r++) n = n.nextSibling;
  return n;
}
function Dm(e, t) {
  let n = e;
  for (let r = 0; r < t.length; r += 2) {
    let o = t[r],
      i = t[r + 1];
    for (let s = 0; s < i; s++)
      switch (o) {
        case Yo.FirstChild:
          n = n.firstChild;
          break;
        case Yo.NextSibling:
          n = n.nextSibling;
          break;
      }
  }
  return n;
}
function vm(e, t) {
  let [n, ...r] = gm(e),
    o;
  if (n === Nc) o = t[Q][Z];
  else if (n === Ac) o = rg(t[Q][Z]);
  else {
    let i = Number(n);
    o = ce(t[i + j]);
  }
  return Dm(o, r);
}
function wm(e, t) {
  let n = [];
  for (let r of t)
    for (let o = 0; o < (r[Oc] ?? 1); o++) {
      let i = { data: r, firstChild: null };
      r[pr] > 0 && ((i.firstChild = e), (e = Hr(r[pr], e))), n.push(i);
    }
  return [e, n];
}
var Tl = () => null;
function Im(e, t) {
  let n = e[qt];
  return !t || n === null || n.length === 0
    ? null
    : n[0].data[Ih] === t
      ? n.shift()
      : (_l(e), null);
}
function Em() {
  Tl = Im;
}
function Xt(e, t) {
  return Tl(e, t);
}
var ui = class {},
  ci = class {},
  Dr = class {};
function Cm(e) {
  let t = Error(`No component factory found for ${q(e)}.`);
  return (t[bm] = e), t;
}
var bm = 'ngComponent';
var li = class {
    resolveComponentFactory(t) {
      throw Cm(t);
    }
  },
  Ur = (() => {
    let t = class t {};
    t.NULL = new li();
    let e = t;
    return e;
  })(),
  di = class {};
var Mm = (() => {
    let t = class t {};
    t.ɵprov = R({ token: t, providedIn: 'root', factory: () => null });
    let e = t;
    return e;
  })(),
  Co = {};
var Ka = new Set();
function ke(e) {
  Ka.has(e) ||
    (Ka.add(e),
    performance?.mark?.('mark_feature_usage', { detail: { feature: e } }));
}
var Sl = (() => {
  let t = class t {
    constructor() {
      (this.handler = null), (this.internalCallbacks = []);
    }
    execute() {
      this.executeInternalCallbacks(), this.handler?.execute();
    }
    executeInternalCallbacks() {
      let r = [...this.internalCallbacks];
      this.internalCallbacks.length = 0;
      for (let o of r) o();
    }
    ngOnDestroy() {
      this.handler?.destroy(),
        (this.handler = null),
        (this.internalCallbacks.length = 0);
    }
  };
  t.ɵprov = R({ token: t, providedIn: 'root', factory: () => new t() });
  let e = t;
  return e;
})();
function fi(e, t, n) {
  let r = n ? e.styles : null,
    o = n ? e.classes : null,
    i = 0;
  if (t !== null)
    for (let s = 0; s < t.length; s++) {
      let a = t[s];
      if (typeof a == 'number') i = a;
      else if (i == 1) o = Ao(o, a);
      else if (i == 2) {
        let u = a,
          c = t[++s];
        r = Ao(r, u + ': ' + c + ';');
      }
    }
  n ? (e.styles = r) : (e.stylesWithoutHost = r),
    n ? (e.classes = o) : (e.classesWithoutHost = o);
}
var vr = class extends Ur {
  constructor(t) {
    super(), (this.ngModule = t);
  }
  resolveComponentFactory(t) {
    let n = Ye(t);
    return new en(n, this.ngModule);
  }
};
function Ja(e) {
  let t = [];
  for (let n in e) {
    if (!e.hasOwnProperty(n)) continue;
    let r = e[n];
    r !== void 0 &&
      t.push({ propName: Array.isArray(r) ? r[0] : r, templateName: n });
  }
  return t;
}
function _m(e) {
  let t = e.toLowerCase();
  return t === 'svg' ? Qu : t === 'math' ? mp : null;
}
var pi = class {
    constructor(t, n) {
      (this.injector = t), (this.parentInjector = n);
    }
    get(t, n, r) {
      r = xr(r);
      let o = this.injector.get(t, Co, r);
      return o !== Co || n === Co ? o : this.parentInjector.get(t, n, r);
    }
  },
  en = class extends Dr {
    get inputs() {
      let t = this.componentDef,
        n = t.inputTransforms,
        r = Ja(t.inputs);
      if (n !== null)
        for (let o of r)
          n.hasOwnProperty(o.propName) && (o.transform = n[o.propName]);
      return r;
    }
    get outputs() {
      return Ja(this.componentDef.outputs);
    }
    constructor(t, n) {
      super(),
        (this.componentDef = t),
        (this.ngModule = n),
        (this.componentType = t.type),
        (this.selector = qf(t.selectors)),
        (this.ngContentSelectors = t.ngContentSelectors
          ? t.ngContentSelectors
          : []),
        (this.isBoundToModule = !!n);
    }
    create(t, n, r, o) {
      let i = E(null);
      try {
        o = o || this.ngModule;
        let s = o instanceof Ae ? o : o?.injector;
        s &&
          this.componentDef.getStandaloneInjector !== null &&
          (s = this.componentDef.getStandaloneInjector(s) || s);
        let a = s ? new pi(t, s) : t,
          u = a.get(di, null);
        if (u === null) throw new T(407, !1);
        let c = a.get(Mm, null),
          l = a.get(Sl, null),
          d = a.get(ui, null),
          f = {
            rendererFactory: u,
            sanitizer: c,
            inlineEffectRunner: null,
            afterRenderEventManager: l,
            changeDetectionScheduler: d,
          },
          p = u.createRenderer(null, this.componentDef),
          h = this.componentDef.selectors[0][0] || 'div',
          m = r
            ? Mg(p, r, this.componentDef.encapsulation, a)
            : Fr(p, h, _m(h)),
          S = 512;
        this.componentDef.signals
          ? (S |= 4096)
          : this.componentDef.onPush || (S |= 16);
        let _ = null;
        m !== null && (_ = ls(m, a, !0));
        let te = ws(0, null, null, 1, 0, null, null, null, null, null, null),
          z = Lr(null, te, null, S, null, null, f, p, a, null, _);
        es(z);
        let me, it;
        try {
          let re = this.componentDef,
            st,
            zr = null;
          re.findHostDirectiveDefs
            ? ((st = []),
              (zr = new Map()),
              re.findHostDirectiveDefs(re, st, zr),
              st.push(re))
            : (st = [re]);
          let ld = xm(z, m),
            dd = Tm(ld, m, re, st, z, f, p);
          (it = Zi(te, j)),
            m && Am(p, re, m, r),
            n !== void 0 && Om(it, this.ngContentSelectors, n),
            (me = Nm(dd, re, st, zr, z, [Fm])),
            Es(te, z, null);
        } finally {
          ts();
        }
        return new hi(this.componentType, me, St(it, z), z, it);
      } finally {
        E(i);
      }
    }
  },
  hi = class extends ci {
    constructor(t, n, r, o, i) {
      super(),
        (this.location = r),
        (this._rootLView = o),
        (this._tNode = i),
        (this.previousInputValues = null),
        (this.instance = n),
        (this.hostView = this.changeDetectorRef = new tt(o, void 0, !1)),
        (this.componentType = t);
    }
    setInput(t, n) {
      let r = this._tNode.inputs,
        o;
      if (r !== null && (o = r[t])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(t) &&
            Object.is(this.previousInputValues.get(t), n))
        )
          return;
        let i = this._rootLView;
        Is(i[y], i, o, t, n), this.previousInputValues.set(t, n);
        let s = rt(this._tNode.index, i);
        Cs(s);
      }
    }
    get injector() {
      return new We(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(t) {
      this.hostView.onDestroy(t);
    }
  };
function xm(e, t) {
  let n = e[y],
    r = j;
  return (e[r] = t), un(n, r, 2, '#host', null);
}
function Tm(e, t, n, r, o, i, s) {
  let a = o[y];
  Sm(r, e, t, s);
  let u = null;
  t !== null && (u = ls(t, o[Et]));
  let c = i.rendererFactory.createRenderer(t, n),
    l = 16;
  n.signals ? (l = 4096) : n.onPush && (l = 64);
  let d = Lr(o, al(n), null, l, o[e.index], e, i, c, null, null, u);
  return (
    a.firstCreatePass && ii(a, e, r.length - 1), jr(o, d), (o[e.index] = d)
  );
}
function Sm(e, t, n, r) {
  for (let o of e) t.mergedAttrs = Ut(t.mergedAttrs, o.hostAttrs);
  t.mergedAttrs !== null &&
    (fi(t, t.mergedAttrs, !0), n !== null && Xc(r, n, t));
}
function Nm(e, t, n, r, o, i) {
  let s = ee(),
    a = o[y],
    u = X(s, o);
  dl(a, o, s, n, null, r);
  for (let l = 0; l < n.length; l++) {
    let d = s.directiveStart + l,
      f = Je(o, a, d, s);
    et(f, o);
  }
  fl(a, o, s), u && et(u, o);
  let c = Je(o, a, s.directiveStart + s.componentOffset, s);
  if (((e[$] = o[$] = c), i !== null)) for (let l of i) l(c, t);
  return ol(a, s, o), c;
}
function Am(e, t, n, r) {
  if (r) Ro(e, n, ['ng-version', '17.3.7']);
  else {
    let { attrs: o, classes: i } = Yf(t.selectors[0]);
    o && Ro(e, n, o), i && i.length > 0 && Jc(e, n, i.join(' '));
  }
}
function Om(e, t, n) {
  let r = (e.projection = []);
  for (let o = 0; o < t.length; o++) {
    let i = n[o];
    r.push(i != null ? Array.from(i) : null);
  }
}
function Fm() {
  let e = ee();
  os(M()[y], e);
}
var Gr = (() => {
  let t = class t {};
  t.__NG_ELEMENT_ID__ = Rm;
  let e = t;
  return e;
})();
function Rm() {
  let e = ee();
  return Al(e, M());
}
var Pm = Gr,
  Nl = class extends Pm {
    constructor(t, n, r) {
      super(),
        (this._lContainer = t),
        (this._hostTNode = n),
        (this._hostLView = r);
    }
    get element() {
      return St(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new We(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let t = is(this._hostTNode, this._hostLView);
      if (pc(t)) {
        let n = lr(t, this._hostLView),
          r = cr(t),
          o = n[y].data[r + 8];
        return new We(o, n);
      } else return new We(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(t) {
      let n = Xa(this._lContainer);
      return (n !== null && n[t]) || null;
    }
    get length() {
      return this._lContainer.length - V;
    }
    createEmbeddedView(t, n, r) {
      let o, i;
      typeof r == 'number'
        ? (o = r)
        : r != null && ((o = r.index), (i = r.injector));
      let s = Xt(this._lContainer, t.ssrId),
        a = t.createEmbeddedViewImpl(n || {}, i, s);
      return this.insertImpl(a, o, Kt(this._hostTNode, s)), a;
    }
    createComponent(t, n, r, o, i) {
      let s = t && !fp(t),
        a;
      if (s) a = n;
      else {
        let h = n || {};
        (a = h.index),
          (r = h.injector),
          (o = h.projectableNodes),
          (i = h.environmentInjector || h.ngModuleRef);
      }
      let u = s ? t : new en(Ye(t)),
        c = r || this.parentInjector;
      if (!i && u.ngModule == null) {
        let m = (s ? c : this.parentInjector).get(Ae, null);
        m && (i = m);
      }
      let l = Ye(u.componentType ?? {}),
        d = Xt(this._lContainer, l?.id ?? null),
        f = d?.firstChild ?? null,
        p = u.create(c, o, f, i);
      return this.insertImpl(p.hostView, a, Kt(this._hostTNode, d)), p;
    }
    insert(t, n) {
      return this.insertImpl(t, n, !0);
    }
    insertImpl(t, n, r) {
      let o = t._lView;
      if (Ip(o)) {
        let a = this.indexOf(t);
        if (a !== -1) this.detach(a);
        else {
          let u = o[L],
            c = new Nl(u, u[J], u[L]);
          c.detach(c.indexOf(t));
        }
      }
      let i = this._adjustIndex(n),
        s = this._lContainer;
      return Br(s, o, i, r), t.attachToViewContainerRef(), wu(bo(s), i, t), t;
    }
    move(t, n) {
      return this.insert(t, n);
    }
    indexOf(t) {
      let n = Xa(this._lContainer);
      return n !== null ? n.indexOf(t) : -1;
    }
    remove(t) {
      let n = this._adjustIndex(t, -1),
        r = Zt(this._lContainer, n);
      r && (ir(bo(this._lContainer), n), Rr(r[y], r));
    }
    detach(t) {
      let n = this._adjustIndex(t, -1),
        r = Zt(this._lContainer, n);
      return r && ir(bo(this._lContainer), n) != null ? new tt(r) : null;
    }
    _adjustIndex(t, n = 0) {
      return t ?? this.length + n;
    }
  };
function Xa(e) {
  return e[ar];
}
function bo(e) {
  return e[ar] || (e[ar] = []);
}
function Al(e, t) {
  let n,
    r = t[e.index];
  return (
    he(r) ? (n = r) : ((n = pl(r, t, null, e)), (t[e.index] = n), jr(t, n)),
    Ol(n, t, e, r),
    new Nl(n, e, t)
  );
}
function km(e, t) {
  let n = e[O],
    r = n.createComment(''),
    o = X(t, e),
    i = ms(n, o);
  return gr(n, i, r, gg(n, o), !1), r;
}
var Ol = Fl,
  Ms = () => !1;
function Lm(e, t, n) {
  return Ms(e, t, n);
}
function Fl(e, t, n, r) {
  if (e[Ie]) return;
  let o;
  n.type & 8 ? (o = ce(r)) : (o = km(t, n)), (e[Ie] = o);
}
function jm(e, t, n) {
  if (e[Ie] && e[qt]) return !0;
  let r = n[K],
    o = t.index - j;
  if (!r || ch(t) || Ar(r, o)) return !1;
  let s = Qo(r, o),
    a = r.data[cs]?.[o],
    [u, c] = wm(s, a);
  return (e[Ie] = u), (e[qt] = c), !0;
}
function Vm(e, t, n, r) {
  Ms(e, n, t) || Fl(e, t, n, r);
}
function Bm() {
  (Ol = Vm), (Ms = jm);
}
var gi = class e {
    constructor(t) {
      (this.queryList = t), (this.matches = null);
    }
    clone() {
      return new e(this.queryList);
    }
    setDirty() {
      this.queryList.setDirty();
    }
  },
  mi = class e {
    constructor(t = []) {
      this.queries = t;
    }
    createEmbeddedView(t) {
      let n = t.queries;
      if (n !== null) {
        let r = t.contentQueries !== null ? t.contentQueries[0] : n.length,
          o = [];
        for (let i = 0; i < r; i++) {
          let s = n.getByIndex(i),
            a = this.queries[s.indexInDeclarationView];
          o.push(a.clone());
        }
        return new e(o);
      }
      return null;
    }
    insertView(t) {
      this.dirtyQueriesWithMatches(t);
    }
    detachView(t) {
      this.dirtyQueriesWithMatches(t);
    }
    finishViewCreation(t) {
      this.dirtyQueriesWithMatches(t);
    }
    dirtyQueriesWithMatches(t) {
      for (let n = 0; n < this.queries.length; n++)
        _s(t, n).matches !== null && this.queries[n].setDirty();
    }
  },
  wr = class {
    constructor(t, n, r = null) {
      (this.flags = n),
        (this.read = r),
        typeof t == 'string' ? (this.predicate = Ym(t)) : (this.predicate = t);
    }
  },
  yi = class e {
    constructor(t = []) {
      this.queries = t;
    }
    elementStart(t, n) {
      for (let r = 0; r < this.queries.length; r++)
        this.queries[r].elementStart(t, n);
    }
    elementEnd(t) {
      for (let n = 0; n < this.queries.length; n++)
        this.queries[n].elementEnd(t);
    }
    embeddedTView(t) {
      let n = null;
      for (let r = 0; r < this.length; r++) {
        let o = n !== null ? n.length : 0,
          i = this.getByIndex(r).embeddedTView(t, o);
        i &&
          ((i.indexInDeclarationView = r), n !== null ? n.push(i) : (n = [i]));
      }
      return n !== null ? new e(n) : null;
    }
    template(t, n) {
      for (let r = 0; r < this.queries.length; r++)
        this.queries[r].template(t, n);
    }
    getByIndex(t) {
      return this.queries[t];
    }
    get length() {
      return this.queries.length;
    }
    track(t) {
      this.queries.push(t);
    }
  },
  Di = class e {
    constructor(t, n = -1) {
      (this.metadata = t),
        (this.matches = null),
        (this.indexInDeclarationView = -1),
        (this.crossesNgTemplate = !1),
        (this._appliesToNextNode = !0),
        (this._declarationNodeIndex = n);
    }
    elementStart(t, n) {
      this.isApplyingToNode(n) && this.matchTNode(t, n);
    }
    elementEnd(t) {
      this._declarationNodeIndex === t.index && (this._appliesToNextNode = !1);
    }
    template(t, n) {
      this.elementStart(t, n);
    }
    embeddedTView(t, n) {
      return this.isApplyingToNode(t)
        ? ((this.crossesNgTemplate = !0),
          this.addMatch(-t.index, n),
          new e(this.metadata))
        : null;
    }
    isApplyingToNode(t) {
      if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
        let n = this._declarationNodeIndex,
          r = t.parent;
        for (; r !== null && r.type & 8 && r.index !== n; ) r = r.parent;
        return n === (r !== null ? r.index : -1);
      }
      return this._appliesToNextNode;
    }
    matchTNode(t, n) {
      let r = this.metadata.predicate;
      if (Array.isArray(r))
        for (let o = 0; o < r.length; o++) {
          let i = r[o];
          this.matchTNodeWithReadOption(t, n, $m(n, i)),
            this.matchTNodeWithReadOption(t, n, er(n, t, i, !1, !1));
        }
      else
        r === Jt
          ? n.type & 4 && this.matchTNodeWithReadOption(t, n, -1)
          : this.matchTNodeWithReadOption(t, n, er(n, t, r, !1, !1));
    }
    matchTNodeWithReadOption(t, n, r) {
      if (r !== null) {
        let o = this.metadata.read;
        if (o !== null)
          if (o === Nt || o === Gr || (o === Jt && n.type & 4))
            this.addMatch(n.index, -2);
          else {
            let i = er(n, t, o, !1, !1);
            i !== null && this.addMatch(n.index, i);
          }
        else this.addMatch(n.index, r);
      }
    }
    addMatch(t, n) {
      this.matches === null ? (this.matches = [t, n]) : this.matches.push(t, n);
    }
  };
function $m(e, t) {
  let n = e.localNames;
  if (n !== null) {
    for (let r = 0; r < n.length; r += 2) if (n[r] === t) return n[r + 1];
  }
  return null;
}
function Hm(e, t) {
  return e.type & 11 ? St(e, t) : e.type & 4 ? bs(e, t) : null;
}
function Um(e, t, n, r) {
  return n === -1 ? Hm(t, e) : n === -2 ? Gm(e, t, r) : Je(e, e[y], n, t);
}
function Gm(e, t, n) {
  if (n === Nt) return St(t, e);
  if (n === Jt) return bs(t, e);
  if (n === Gr) return Al(t, e);
}
function Rl(e, t, n, r) {
  let o = t[we].queries[r];
  if (o.matches === null) {
    let i = e.data,
      s = n.matches,
      a = [];
    for (let u = 0; s !== null && u < s.length; u += 2) {
      let c = s[u];
      if (c < 0) a.push(null);
      else {
        let l = i[c];
        a.push(Um(t, l, s[u + 1], n.metadata.read));
      }
    }
    o.matches = a;
  }
  return o.matches;
}
function vi(e, t, n, r) {
  let o = e.queries.getByIndex(n),
    i = o.matches;
  if (i !== null) {
    let s = Rl(e, t, o, n);
    for (let a = 0; a < i.length; a += 2) {
      let u = i[a];
      if (u > 0) r.push(s[a / 2]);
      else {
        let c = i[a + 1],
          l = t[-u];
        for (let d = V; d < l.length; d++) {
          let f = l[d];
          f[rn] === f[L] && vi(f[y], f, c, r);
        }
        if (l[Ct] !== null) {
          let d = l[Ct];
          for (let f = 0; f < d.length; f++) {
            let p = d[f];
            vi(p[y], p, c, r);
          }
        }
      }
    }
  }
  return r;
}
function zm(e, t) {
  return e[we].queries[t].queryList;
}
function Pl(e, t, n) {
  let r = new Wo((n & 4) === 4);
  return (
    Sg(e, t, r, r.destroy), (t[we] ??= new mi()).queries.push(new gi(r)) - 1
  );
}
function Wm(e, t, n) {
  let r = B();
  return (
    r.firstCreatePass &&
      (kl(r, new wr(e, t, n), -1), (t & 2) === 2 && (r.staticViewQueries = !0)),
    Pl(r, M(), t)
  );
}
function qm(e, t, n, r) {
  let o = B();
  if (o.firstCreatePass) {
    let i = ee();
    kl(o, new wr(t, n, r), i.index),
      Qm(o, e),
      (n & 2) === 2 && (o.staticContentQueries = !0);
  }
  return Pl(o, M(), n);
}
function Ym(e) {
  return e.split(',').map((t) => t.trim());
}
function kl(e, t, n) {
  e.queries === null && (e.queries = new yi()), e.queries.track(new Di(t, n));
}
function Qm(e, t) {
  let n = e.contentQueries || (e.contentQueries = []),
    r = n.length ? n[n.length - 1] : -1;
  t !== r && n.push(e.queries.length - 1, t);
}
function _s(e, t) {
  return e.queries.getByIndex(t);
}
function Zm(e, t) {
  let n = e[y],
    r = _s(n, t);
  return r.crossesNgTemplate ? vi(n, e, t, []) : Rl(n, e, r, t);
}
function W0(e, t) {
  ke('NgSignals');
  let n = Qs(e),
    r = n[ye];
  return (
    t?.equal && (r.equal = t.equal),
    (n.set = (o) => Kr(r, o)),
    (n.update = (o) => Zs(r, o)),
    (n.asReadonly = Km.bind(n)),
    n
  );
}
function Km() {
  let e = this[ye];
  if (e.readonlyFn === void 0) {
    let t = () => this();
    (t[ye] = e), (e.readonlyFn = t);
  }
  return e.readonlyFn;
}
function Jm(e) {
  return Object.getPrototypeOf(e.prototype).constructor;
}
function Xm(e) {
  let t = Jm(e.type),
    n = !0,
    r = [e];
  for (; t; ) {
    let o;
    if (Oe(e)) o = t.ɵcmp || t.ɵdir;
    else {
      if (t.ɵcmp) throw new T(903, !1);
      o = t.ɵdir;
    }
    if (o) {
      if (n) {
        r.push(o);
        let s = e;
        (s.inputs = qn(e.inputs)),
          (s.inputTransforms = qn(e.inputTransforms)),
          (s.declaredInputs = qn(e.declaredInputs)),
          (s.outputs = qn(e.outputs));
        let a = o.hostBindings;
        a && oy(e, a);
        let u = o.viewQuery,
          c = o.contentQueries;
        if (
          (u && ny(e, u),
          c && ry(e, c),
          ey(e, o),
          df(e.outputs, o.outputs),
          Oe(o) && o.data.animation)
        ) {
          let l = e.data;
          l.animation = (l.animation || []).concat(o.data.animation);
        }
      }
      let i = o.features;
      if (i)
        for (let s = 0; s < i.length; s++) {
          let a = i[s];
          a && a.ngInherit && a(e), a === Xm && (n = !1);
        }
    }
    t = Object.getPrototypeOf(t);
  }
  ty(r);
}
function ey(e, t) {
  for (let n in t.inputs) {
    if (!t.inputs.hasOwnProperty(n) || e.inputs.hasOwnProperty(n)) continue;
    let r = t.inputs[n];
    if (
      r !== void 0 &&
      ((e.inputs[n] = r),
      (e.declaredInputs[n] = t.declaredInputs[n]),
      t.inputTransforms !== null)
    ) {
      let o = Array.isArray(r) ? r[0] : r;
      if (!t.inputTransforms.hasOwnProperty(o)) continue;
      (e.inputTransforms ??= {}), (e.inputTransforms[o] = t.inputTransforms[o]);
    }
  }
}
function ty(e) {
  let t = 0,
    n = null;
  for (let r = e.length - 1; r >= 0; r--) {
    let o = e[r];
    (o.hostVars = t += o.hostVars),
      (o.hostAttrs = Ut(o.hostAttrs, (n = Ut(n, o.hostAttrs))));
  }
}
function qn(e) {
  return e === wt ? {} : e === G ? [] : e;
}
function ny(e, t) {
  let n = e.viewQuery;
  n
    ? (e.viewQuery = (r, o) => {
        t(r, o), n(r, o);
      })
    : (e.viewQuery = t);
}
function ry(e, t) {
  let n = e.contentQueries;
  n
    ? (e.contentQueries = (r, o, i) => {
        t(r, o, i), n(r, o, i);
      })
    : (e.contentQueries = t);
}
function oy(e, t) {
  let n = e.hostBindings;
  n
    ? (e.hostBindings = (r, o) => {
        t(r, o), n(r, o);
      })
    : (e.hostBindings = t);
}
function iy(e) {
  let t = e.inputConfig,
    n = {};
  for (let r in t)
    if (t.hasOwnProperty(r)) {
      let o = t[r];
      Array.isArray(o) && o[3] && (n[r] = o[3]);
    }
  e.inputTransforms = n;
}
var Fe = class {},
  wi = class {};
var Ii = class extends Fe {
    constructor(t, n, r) {
      super(),
        (this._parent = n),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new vr(this));
      let o = Nu(t);
      (this._bootstrapComponents = Uc(o.bootstrap)),
        (this._r3Injector = Ec(
          t,
          n,
          [
            { provide: Fe, useValue: this },
            { provide: Ur, useValue: this.componentFactoryResolver },
            ...r,
          ],
          q(t),
          new Set(['environment'])
        )),
        this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(t));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let t = this._r3Injector;
      !t.destroyed && t.destroy(),
        this.destroyCbs.forEach((n) => n()),
        (this.destroyCbs = null);
    }
    onDestroy(t) {
      this.destroyCbs.push(t);
    }
  },
  Ei = class extends wi {
    constructor(t) {
      super(), (this.moduleType = t);
    }
    create(t) {
      return new Ii(this.moduleType, t, []);
    }
  };
var Ir = class extends Fe {
  constructor(t) {
    super(),
      (this.componentFactoryResolver = new vr(this)),
      (this.instance = null);
    let n = new Gt(
      [
        ...t.providers,
        { provide: Fe, useValue: this },
        { provide: Ur, useValue: this.componentFactoryResolver },
      ],
      t.parent || qi(),
      t.debugName,
      new Set(['environment'])
    );
    (this.injector = n),
      t.runEnvironmentInitializers && n.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(t) {
    this.injector.onDestroy(t);
  }
};
function sy(e, t, n = null) {
  return new Ir({
    providers: e,
    parent: t,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector;
}
var xs = (() => {
  let t = class t {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new Pt(!1));
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value;
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0);
      let r = this.taskId++;
      return this.pendingTasks.add(r), r;
    }
    remove(r) {
      this.pendingTasks.delete(r),
        this.pendingTasks.size === 0 &&
          this._hasPendingTasks &&
          this.hasPendingTasks.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this._hasPendingTasks && this.hasPendingTasks.next(!1);
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵprov = R({ token: t, factory: t.ɵfac, providedIn: 'root' }));
  let e = t;
  return e;
})();
function Le(e, t, n) {
  let r = e[t];
  return Object.is(r, n) ? !1 : ((e[t] = n), !0);
}
function cn(e) {
  return (e.flags & 32) === 32;
}
function ay(e, t, n, r, o, i, s, a, u) {
  let c = t.consts,
    l = un(t, e, 4, s || null, ur(c, a));
  ll(t, n, l, ur(c, u)), os(t, l);
  let d = (l.tView = ws(
    2,
    l,
    r,
    o,
    i,
    t.directiveRegistry,
    t.pipeRegistry,
    null,
    t.schemas,
    c,
    null
  ));
  return (
    t.queries !== null &&
      (t.queries.template(t, l), (d.queries = t.queries.embeddedTView(l))),
    l
  );
}
function Ci(e, t, n, r, o, i, s, a) {
  let u = M(),
    c = B(),
    l = e + j,
    d = c.firstCreatePass ? ay(l, c, u, t, n, r, o, i, s) : c.data[l];
  sn(d, !1);
  let f = Ll(c, u, d, e);
  rs() && ys(c, u, f, d), et(f, u);
  let p = pl(f, u, f, d);
  return (
    (u[l] = p),
    jr(u, p),
    Lm(p, d, u),
    Qi(d) && il(c, u, d),
    s != null && sl(u, d, a),
    Ci
  );
}
var Ll = jl;
function jl(e, t, n, r) {
  return ge(!0), t[O].createComment('');
}
function uy(e, t, n, r) {
  let o = t[K],
    i = !o || _t() || cn(n) || Ar(o, r);
  if ((ge(i), i)) return jl(e, t, n, r);
  let s = o.data[wh]?.[r] ?? null;
  s !== null &&
    n.tView !== null &&
    n.tView.ssrId === null &&
    (n.tView.ssrId = s);
  let a = $r(o, e, t, n);
  Nr(o, r, a);
  let u = ds(o, r);
  return Hr(u, a);
}
function cy() {
  Ll = uy;
}
function eu(...e) {}
function ly() {
  let e = typeof mt.requestAnimationFrame == 'function',
    t = mt[e ? 'requestAnimationFrame' : 'setTimeout'],
    n = mt[e ? 'cancelAnimationFrame' : 'clearTimeout'];
  if (typeof Zone < 'u' && t && n) {
    let r = t[Zone.__symbol__('OriginalDelegate')];
    r && (t = r);
    let o = n[Zone.__symbol__('OriginalDelegate')];
    o && (n = o);
  }
  return { nativeRequestAnimationFrame: t, nativeCancelAnimationFrame: n };
}
var ue = class e {
    constructor({
      enableLongStackTrace: t = !1,
      shouldCoalesceEventChangeDetection: n = !1,
      shouldCoalesceRunChangeDetection: r = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new ze(!1)),
        (this.onMicrotaskEmpty = new ze(!1)),
        (this.onStable = new ze(!1)),
        (this.onError = new ze(!1)),
        typeof Zone > 'u')
      )
        throw new T(908, !1);
      Zone.assertZonePatched();
      let o = this;
      (o._nesting = 0),
        (o._outer = o._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
        t &&
          Zone.longStackTraceZoneSpec &&
          (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
        (o.shouldCoalesceEventChangeDetection = !r && n),
        (o.shouldCoalesceRunChangeDetection = r),
        (o.lastRequestAnimationFrameId = -1),
        (o.nativeRequestAnimationFrame = ly().nativeRequestAnimationFrame),
        py(o);
    }
    static isInAngularZone() {
      return typeof Zone < 'u' && Zone.current.get('isAngularZone') === !0;
    }
    static assertInAngularZone() {
      if (!e.isInAngularZone()) throw new T(909, !1);
    }
    static assertNotInAngularZone() {
      if (e.isInAngularZone()) throw new T(909, !1);
    }
    run(t, n, r) {
      return this._inner.run(t, n, r);
    }
    runTask(t, n, r, o) {
      let i = this._inner,
        s = i.scheduleEventTask('NgZoneEvent: ' + o, t, dy, eu, eu);
      try {
        return i.runTask(s, n, r);
      } finally {
        i.cancelTask(s);
      }
    }
    runGuarded(t, n, r) {
      return this._inner.runGuarded(t, n, r);
    }
    runOutsideAngular(t) {
      return this._outer.run(t);
    }
  },
  dy = {};
function Ts(e) {
  if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
    try {
      e._nesting++, e.onMicrotaskEmpty.emit(null);
    } finally {
      if ((e._nesting--, !e.hasPendingMicrotasks))
        try {
          e.runOutsideAngular(() => e.onStable.emit(null));
        } finally {
          e.isStable = !0;
        }
    }
}
function fy(e) {
  e.isCheckStableRunning ||
    e.lastRequestAnimationFrameId !== -1 ||
    ((e.lastRequestAnimationFrameId = e.nativeRequestAnimationFrame.call(
      mt,
      () => {
        e.fakeTopEventTask ||
          (e.fakeTopEventTask = Zone.root.scheduleEventTask(
            'fakeTopEventTask',
            () => {
              (e.lastRequestAnimationFrameId = -1),
                bi(e),
                (e.isCheckStableRunning = !0),
                Ts(e),
                (e.isCheckStableRunning = !1);
            },
            void 0,
            () => {},
            () => {}
          )),
          e.fakeTopEventTask.invoke();
      }
    )),
    bi(e));
}
function py(e) {
  let t = () => {
    fy(e);
  };
  e._inner = e._inner.fork({
    name: 'angular',
    properties: { isAngularZone: !0 },
    onInvokeTask: (n, r, o, i, s, a) => {
      if (hy(a)) return n.invokeTask(o, i, s, a);
      try {
        return tu(e), n.invokeTask(o, i, s, a);
      } finally {
        ((e.shouldCoalesceEventChangeDetection && i.type === 'eventTask') ||
          e.shouldCoalesceRunChangeDetection) &&
          t(),
          nu(e);
      }
    },
    onInvoke: (n, r, o, i, s, a, u) => {
      try {
        return tu(e), n.invoke(o, i, s, a, u);
      } finally {
        e.shouldCoalesceRunChangeDetection && t(), nu(e);
      }
    },
    onHasTask: (n, r, o, i) => {
      n.hasTask(o, i),
        r === o &&
          (i.change == 'microTask'
            ? ((e._hasPendingMicrotasks = i.microTask), bi(e), Ts(e))
            : i.change == 'macroTask' &&
              (e.hasPendingMacrotasks = i.macroTask));
    },
    onHandleError: (n, r, o, i) => (
      n.handleError(o, i), e.runOutsideAngular(() => e.onError.emit(i)), !1
    ),
  });
}
function bi(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection ||
    e.shouldCoalesceRunChangeDetection) &&
    e.lastRequestAnimationFrameId !== -1)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1);
}
function tu(e) {
  e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
}
function nu(e) {
  e._nesting--, Ts(e);
}
function hy(e) {
  return !Array.isArray(e) || e.length !== 1
    ? !1
    : e[0].data?.__ignore_ng_zone__ === !0;
}
function gy(e, t, n, r) {
  let o = M(),
    i = xt();
  if (Le(o, i, t)) {
    let s = B(),
      a = ns();
    Gg(a, o, e, t, n, r);
  }
  return gy;
}
function my(e, t, n, r) {
  return Le(e, xt(), n) ? t + $i(n) + r : Pe;
}
function Yn(e, t) {
  return (e << 17) | (t << 2);
}
function nt(e) {
  return (e >> 17) & 32767;
}
function yy(e) {
  return (e & 2) == 2;
}
function Dy(e, t) {
  return (e & 131071) | (t << 17);
}
function Mi(e) {
  return e | 2;
}
function bt(e) {
  return (e & 131068) >> 2;
}
function Mo(e, t) {
  return (e & -131069) | (t << 2);
}
function vy(e) {
  return (e & 1) === 1;
}
function _i(e) {
  return e | 1;
}
function wy(e, t, n, r, o, i) {
  let s = i ? t.classBindings : t.styleBindings,
    a = nt(s),
    u = bt(s);
  e[r] = n;
  let c = !1,
    l;
  if (Array.isArray(n)) {
    let d = n;
    (l = d[1]), (l === null || nn(d, l) > 0) && (c = !0);
  } else l = n;
  if (o)
    if (u !== 0) {
      let f = nt(e[a + 1]);
      (e[r + 1] = Yn(f, a)),
        f !== 0 && (e[f + 1] = Mo(e[f + 1], r)),
        (e[a + 1] = Dy(e[a + 1], r));
    } else
      (e[r + 1] = Yn(a, 0)), a !== 0 && (e[a + 1] = Mo(e[a + 1], r)), (a = r);
  else
    (e[r + 1] = Yn(u, 0)),
      a === 0 ? (a = r) : (e[u + 1] = Mo(e[u + 1], r)),
      (u = r);
  c && (e[r + 1] = Mi(e[r + 1])),
    ru(e, l, r, !0),
    ru(e, l, r, !1),
    Iy(t, l, e, r, i),
    (s = Yn(a, u)),
    i ? (t.classBindings = s) : (t.styleBindings = s);
}
function Iy(e, t, n, r, o) {
  let i = o ? e.residualClasses : e.residualStyles;
  i != null &&
    typeof t == 'string' &&
    nn(i, t) >= 0 &&
    (n[r + 1] = _i(n[r + 1]));
}
function ru(e, t, n, r) {
  let o = e[n + 1],
    i = t === null,
    s = r ? nt(o) : bt(o),
    a = !1;
  for (; s !== 0 && (a === !1 || i); ) {
    let u = e[s],
      c = e[s + 1];
    Ey(u, t) && ((a = !0), (e[s + 1] = r ? _i(c) : Mi(c))),
      (s = r ? nt(c) : bt(c));
  }
  a && (e[n + 1] = r ? Mi(o) : _i(o));
}
function Ey(e, t) {
  return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t
    ? !0
    : Array.isArray(e) && typeof t == 'string'
      ? nn(e, t) >= 0
      : !1;
}
var se = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
function Cy(e) {
  return e.substring(se.key, se.keyEnd);
}
function by(e) {
  return My(e), Vl(e, Bl(e, 0, se.textEnd));
}
function Vl(e, t) {
  let n = se.textEnd;
  return n === t ? -1 : ((t = se.keyEnd = _y(e, (se.key = t), n)), Bl(e, t, n));
}
function My(e) {
  (se.key = 0),
    (se.keyEnd = 0),
    (se.value = 0),
    (se.valueEnd = 0),
    (se.textEnd = e.length);
}
function Bl(e, t, n) {
  for (; t < n && e.charCodeAt(t) <= 32; ) t++;
  return t;
}
function _y(e, t, n) {
  for (; t < n && e.charCodeAt(t) > 32; ) t++;
  return t;
}
function xy(e, t, n) {
  let r = M(),
    o = xt();
  if (Le(r, o, t)) {
    let i = B(),
      s = ns();
    cl(i, s, r, e, t, r[O], n, !1);
  }
  return xy;
}
function xi(e, t, n, r, o) {
  let i = t.inputs,
    s = o ? 'class' : 'style';
  Is(e, n, i[s], s, r);
}
function Ty(e, t) {
  return Ny(e, t, null, !0), Ty;
}
function q0(e) {
  Ay(Ly, Sy, e, !0);
}
function Sy(e, t) {
  for (let n = by(t); n >= 0; n = Vl(t, n)) Gi(e, Cy(t), !0);
}
function Ny(e, t, n, r) {
  let o = M(),
    i = B(),
    s = rc(2);
  if ((i.firstUpdatePass && Hl(i, e, s, r), t !== Pe && Le(o, s, t))) {
    let a = i.data[Re()];
    Ul(i, a, o, o[O], e, (o[s + 1] = Vy(t, n)), r, s);
  }
}
function Ay(e, t, n, r) {
  let o = B(),
    i = rc(2);
  o.firstUpdatePass && Hl(o, null, i, r);
  let s = M();
  if (n !== Pe && Le(s, i, n)) {
    let a = o.data[Re()];
    if (Gl(a, r) && !$l(o, i)) {
      let u = r ? a.classesWithoutHost : a.stylesWithoutHost;
      u !== null && (n = Ao(u, n || '')), xi(o, a, s, n, r);
    } else jy(o, a, s, s[O], s[i + 1], (s[i + 1] = ky(e, t, n)), r, i);
  }
}
function $l(e, t) {
  return t >= e.expandoStartIndex;
}
function Hl(e, t, n, r) {
  let o = e.data;
  if (o[n + 1] === null) {
    let i = o[Re()],
      s = $l(e, n);
    Gl(i, r) && t === null && !s && (t = !1),
      (t = Oy(o, i, t, r)),
      wy(o, i, t, n, s, r);
  }
}
function Oy(e, t, n, r) {
  let o = Lp(e),
    i = r ? t.residualClasses : t.residualStyles;
  if (o === null)
    (r ? t.classBindings : t.styleBindings) === 0 &&
      ((n = _o(null, e, t, n, r)), (n = tn(n, t.attrs, r)), (i = null));
  else {
    let s = t.directiveStylingLast;
    if (s === -1 || e[s] !== o)
      if (((n = _o(o, e, t, n, r)), i === null)) {
        let u = Fy(e, t, r);
        u !== void 0 &&
          Array.isArray(u) &&
          ((u = _o(null, e, t, u[1], r)),
          (u = tn(u, t.attrs, r)),
          Ry(e, t, r, u));
      } else i = Py(e, t, r);
  }
  return (
    i !== void 0 && (r ? (t.residualClasses = i) : (t.residualStyles = i)), n
  );
}
function Fy(e, t, n) {
  let r = n ? t.classBindings : t.styleBindings;
  if (bt(r) !== 0) return e[nt(r)];
}
function Ry(e, t, n, r) {
  let o = n ? t.classBindings : t.styleBindings;
  e[nt(o)] = r;
}
function Py(e, t, n) {
  let r,
    o = t.directiveEnd;
  for (let i = 1 + t.directiveStylingLast; i < o; i++) {
    let s = e[i].hostAttrs;
    r = tn(r, s, n);
  }
  return tn(r, t.attrs, n);
}
function _o(e, t, n, r, o) {
  let i = null,
    s = n.directiveEnd,
    a = n.directiveStylingLast;
  for (
    a === -1 ? (a = n.directiveStart) : a++;
    a < s && ((i = t[a]), (r = tn(r, i.hostAttrs, o)), i !== e);

  )
    a++;
  return e !== null && (n.directiveStylingLast = a), r;
}
function tn(e, t, n) {
  let r = n ? 1 : 2,
    o = -1;
  if (t !== null)
    for (let i = 0; i < t.length; i++) {
      let s = t[i];
      typeof s == 'number'
        ? (o = s)
        : o === r &&
          (Array.isArray(e) || (e = e === void 0 ? [] : ['', e]),
          Gi(e, s, n ? !0 : t[++i]));
    }
  return e === void 0 ? null : e;
}
function ky(e, t, n) {
  if (n == null || n === '') return G;
  let r = [],
    o = fs(n);
  if (Array.isArray(o)) for (let i = 0; i < o.length; i++) e(r, o[i], !0);
  else if (typeof o == 'object')
    for (let i in o) o.hasOwnProperty(i) && e(r, i, o[i]);
  else typeof o == 'string' && t(r, o);
  return r;
}
function Ly(e, t, n) {
  let r = String(t);
  r !== '' && !r.includes(' ') && Gi(e, r, n);
}
function jy(e, t, n, r, o, i, s, a) {
  o === Pe && (o = G);
  let u = 0,
    c = 0,
    l = 0 < o.length ? o[0] : null,
    d = 0 < i.length ? i[0] : null;
  for (; l !== null || d !== null; ) {
    let f = u < o.length ? o[u + 1] : void 0,
      p = c < i.length ? i[c + 1] : void 0,
      h = null,
      m;
    l === d
      ? ((u += 2), (c += 2), f !== p && ((h = d), (m = p)))
      : d === null || (l !== null && l < d)
        ? ((u += 2), (h = l))
        : ((c += 2), (h = d), (m = p)),
      h !== null && Ul(e, t, n, r, h, m, s, a),
      (l = u < o.length ? o[u] : null),
      (d = c < i.length ? i[c] : null);
  }
}
function Ul(e, t, n, r, o, i, s, a) {
  if (!(t.type & 3)) return;
  let u = e.data,
    c = u[a + 1],
    l = vy(c) ? ou(u, t, n, o, bt(c), s) : void 0;
  if (!Er(l)) {
    Er(i) || (yy(c) && (i = ou(u, null, n, o, a, s)));
    let d = Zu(Re(), n);
    wg(r, s, d, o, i);
  }
}
function ou(e, t, n, r, o, i) {
  let s = t === null,
    a;
  for (; o > 0; ) {
    let u = e[o],
      c = Array.isArray(u),
      l = c ? u[1] : u,
      d = l === null,
      f = n[o + 1];
    f === Pe && (f = d ? G : void 0);
    let p = d ? ho(f, r) : l === r ? f : void 0;
    if ((c && !Er(p) && (p = ho(u, r)), Er(p) && ((a = p), s))) return a;
    let h = e[o + 1];
    o = s ? nt(h) : bt(h);
  }
  if (t !== null) {
    let u = i ? t.residualClasses : t.residualStyles;
    u != null && (a = ho(u, r));
  }
  return a;
}
function Er(e) {
  return e !== void 0;
}
function Vy(e, t) {
  return (
    e == null ||
      e === '' ||
      (typeof t == 'string'
        ? (e = e + t)
        : typeof e == 'object' && (e = q(fs(e)))),
    e
  );
}
function Gl(e, t) {
  return (e.flags & (t ? 8 : 16)) !== 0;
}
var Ti = class {
  destroy(t) {}
  updateValue(t, n) {}
  swap(t, n) {
    let r = Math.min(t, n),
      o = Math.max(t, n),
      i = this.detach(o);
    if (o - r > 1) {
      let s = this.detach(r);
      this.attach(r, i), this.attach(o, s);
    } else this.attach(r, i);
  }
  move(t, n) {
    this.attach(n, this.detach(t));
  }
};
function xo(e, t, n, r, o) {
  return e === n && Object.is(t, r) ? 1 : Object.is(o(e, t), o(n, r)) ? -1 : 0;
}
function By(e, t, n) {
  let r,
    o,
    i = 0,
    s = e.length - 1;
  if (Array.isArray(t)) {
    let a = t.length - 1;
    for (; i <= s && i <= a; ) {
      let u = e.at(i),
        c = t[i],
        l = xo(i, u, i, c, n);
      if (l !== 0) {
        l < 0 && e.updateValue(i, c), i++;
        continue;
      }
      let d = e.at(s),
        f = t[a],
        p = xo(s, d, a, f, n);
      if (p !== 0) {
        p < 0 && e.updateValue(s, f), s--, a--;
        continue;
      }
      let h = n(i, u),
        m = n(s, d),
        S = n(i, c);
      if (Object.is(S, m)) {
        let _ = n(a, f);
        Object.is(_, h)
          ? (e.swap(i, s), e.updateValue(s, f), a--, s--)
          : e.move(s, i),
          e.updateValue(i, c),
          i++;
        continue;
      }
      if (((r ??= new Cr()), (o ??= su(e, i, s, n)), Si(e, r, i, S)))
        e.updateValue(i, c), i++, s++;
      else if (o.has(S)) r.set(h, e.detach(i)), s--;
      else {
        let _ = e.create(i, t[i]);
        e.attach(i, _), i++, s++;
      }
    }
    for (; i <= a; ) iu(e, r, n, i, t[i]), i++;
  } else if (t != null) {
    let a = t[Symbol.iterator](),
      u = a.next();
    for (; !u.done && i <= s; ) {
      let c = e.at(i),
        l = u.value,
        d = xo(i, c, i, l, n);
      if (d !== 0) d < 0 && e.updateValue(i, l), i++, (u = a.next());
      else {
        (r ??= new Cr()), (o ??= su(e, i, s, n));
        let f = n(i, l);
        if (Si(e, r, i, f)) e.updateValue(i, l), i++, s++, (u = a.next());
        else if (!o.has(f))
          e.attach(i, e.create(i, l)), i++, s++, (u = a.next());
        else {
          let p = n(i, c);
          r.set(p, e.detach(i)), s--;
        }
      }
    }
    for (; !u.done; ) iu(e, r, n, e.length, u.value), (u = a.next());
  }
  for (; i <= s; ) e.destroy(e.detach(s--));
  r?.forEach((a) => {
    e.destroy(a);
  });
}
function Si(e, t, n, r) {
  return t !== void 0 && t.has(r)
    ? (e.attach(n, t.get(r)), t.delete(r), !0)
    : !1;
}
function iu(e, t, n, r, o) {
  if (Si(e, t, r, n(r, o))) e.updateValue(r, o);
  else {
    let i = e.create(r, o);
    e.attach(r, i);
  }
}
function su(e, t, n, r) {
  let o = new Set();
  for (let i = t; i <= n; i++) o.add(r(i, e.at(i)));
  return o;
}
var Cr = class {
  constructor() {
    (this.kvMap = new Map()), (this._vMap = void 0);
  }
  has(t) {
    return this.kvMap.has(t);
  }
  delete(t) {
    if (!this.has(t)) return !1;
    let n = this.kvMap.get(t);
    return (
      this._vMap !== void 0 && this._vMap.has(n)
        ? (this.kvMap.set(t, this._vMap.get(n)), this._vMap.delete(n))
        : this.kvMap.delete(t),
      !0
    );
  }
  get(t) {
    return this.kvMap.get(t);
  }
  set(t, n) {
    if (this.kvMap.has(t)) {
      let r = this.kvMap.get(t);
      this._vMap === void 0 && (this._vMap = new Map());
      let o = this._vMap;
      for (; o.has(r); ) r = o.get(r);
      o.set(r, n);
    } else this.kvMap.set(t, n);
  }
  forEach(t) {
    for (let [n, r] of this.kvMap)
      if ((t(r, n), this._vMap !== void 0)) {
        let o = this._vMap;
        for (; o.has(r); ) (r = o.get(r)), t(r, n);
      }
  }
};
function Y0(e, t, n) {
  ke('NgControlFlow');
  let r = M(),
    o = xt(),
    i = Fi(r, j + e),
    s = 0;
  if (Le(r, o, t)) {
    let a = E(null);
    try {
      if ((vl(i, s), t !== -1)) {
        let u = Ri(r[y], j + t),
          c = Xt(i, u.tView.ssrId),
          l = Vr(r, u, n, { dehydratedView: c });
        Br(i, l, s, Kt(u, c));
      }
    } finally {
      E(a);
    }
  } else {
    let a = Dl(i, s);
    a !== void 0 && (a[$] = n);
  }
}
var Ni = class {
  constructor(t, n, r) {
    (this.lContainer = t), (this.$implicit = n), (this.$index = r);
  }
  get $count() {
    return this.lContainer.length - V;
  }
};
function Q0(e, t) {
  return t;
}
var Ai = class {
  constructor(t, n, r) {
    (this.hasEmptyBlock = t), (this.trackByFn = n), (this.liveCollection = r);
  }
};
function Z0(e, t, n, r, o, i, s, a, u, c, l, d, f) {
  ke('NgControlFlow');
  let p = u !== void 0,
    h = M(),
    m = a ? s.bind(h[Q][$]) : s,
    S = new Ai(p, m);
  (h[j + e] = S), Ci(e + 1, t, n, r, o, i), p && Ci(e + 2, u, c, l, d, f);
}
var Oi = class extends Ti {
  constructor(t, n, r) {
    super(),
      (this.lContainer = t),
      (this.hostLView = n),
      (this.templateTNode = r),
      (this.needsIndexUpdate = !1);
  }
  get length() {
    return this.lContainer.length - V;
  }
  at(t) {
    return this.getLView(t)[$].$implicit;
  }
  attach(t, n) {
    let r = n[K];
    (this.needsIndexUpdate ||= t !== this.length),
      Br(this.lContainer, n, t, Kt(this.templateTNode, r));
  }
  detach(t) {
    return (
      (this.needsIndexUpdate ||= t !== this.length - 1), $y(this.lContainer, t)
    );
  }
  create(t, n) {
    let r = Xt(this.lContainer, this.templateTNode.tView.ssrId);
    return Vr(
      this.hostLView,
      this.templateTNode,
      new Ni(this.lContainer, n, t),
      { dehydratedView: r }
    );
  }
  destroy(t) {
    Rr(t[y], t);
  }
  updateValue(t, n) {
    this.getLView(t)[$].$implicit = n;
  }
  reset() {
    this.needsIndexUpdate = !1;
  }
  updateIndexes() {
    if (this.needsIndexUpdate)
      for (let t = 0; t < this.length; t++) this.getLView(t)[$].$index = t;
  }
  getLView(t) {
    return Hy(this.lContainer, t);
  }
};
function K0(e) {
  let t = E(null),
    n = Re();
  try {
    let r = M(),
      o = r[y],
      i = r[n];
    if (i.liveCollection === void 0) {
      let a = n + 1,
        u = Fi(r, a),
        c = Ri(o, a);
      i.liveCollection = new Oi(u, r, c);
    } else i.liveCollection.reset();
    let s = i.liveCollection;
    if ((By(s, e, i.trackByFn), s.updateIndexes(), i.hasEmptyBlock)) {
      let a = xt(),
        u = s.length === 0;
      if (Le(r, a, u)) {
        let c = n + 2,
          l = Fi(r, c);
        if (u) {
          let d = Ri(o, c),
            f = Xt(l, d.tView.ssrId),
            p = Vr(r, d, void 0, { dehydratedView: f });
          Br(l, p, 0, Kt(d, f));
        } else vl(l, 0);
      }
    }
  } finally {
    E(t);
  }
}
function Fi(e, t) {
  return e[t];
}
function $y(e, t) {
  return Zt(e, t);
}
function Hy(e, t) {
  return Dl(e, t);
}
function Ri(e, t) {
  return Zi(e, t);
}
function Uy(e, t, n, r, o, i) {
  let s = t.consts,
    a = ur(s, o),
    u = un(t, e, 2, r, a);
  return (
    ll(t, n, u, ur(s, i)),
    u.attrs !== null && fi(u, u.attrs, !1),
    u.mergedAttrs !== null && fi(u, u.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, u),
    u
  );
}
function zl(e, t, n, r) {
  let o = M(),
    i = B(),
    s = j + e,
    a = o[O],
    u = i.firstCreatePass ? Uy(s, i, o, t, n, r) : i.data[s],
    c = ql(i, o, u, a, t, e);
  o[s] = c;
  let l = Qi(u);
  return (
    sn(u, !0),
    Xc(a, c, u),
    !cn(u) && rs() && ys(i, o, c, u),
    Mp() === 0 && et(c, o),
    _p(),
    l && (il(i, o, u), ol(i, u, o)),
    r !== null && sl(o, u),
    zl
  );
}
function Wl() {
  let e = ee();
  tc() ? nc() : ((e = e.parent), sn(e, !1));
  let t = e;
  Tp(t) && Np(), xp();
  let n = B();
  return (
    n.firstCreatePass && (os(n, e), Hu(e) && n.queries.elementEnd(e)),
    t.classesWithoutHost != null &&
      Gp(t) &&
      xi(n, t, M(), t.classesWithoutHost, !0),
    t.stylesWithoutHost != null &&
      zp(t) &&
      xi(n, t, M(), t.stylesWithoutHost, !1),
    Wl
  );
}
function Gy(e, t, n, r) {
  return zl(e, t, n, r), Wl(), Gy;
}
var ql = (e, t, n, r, o, i) => (ge(!0), Fr(r, o, lc()));
function zy(e, t, n, r, o, i) {
  let s = t[K],
    a = !s || _t() || cn(n) || Ar(s, i);
  if ((ge(a), a)) return Fr(r, o, lc());
  let u = $r(s, e, t, n);
  return (
    Pc(s, i) && Nr(s, i, u.nextSibling),
    s && (bc(n) || Mc(u)) && on(n) && (Sp(n), Zc(u)),
    u
  );
}
function Wy() {
  ql = zy;
}
var qy = (e, t, n, r) => (ge(!0), gs(t[O], ''));
function Yy(e, t, n, r) {
  let o,
    i = t[K],
    s = !i || _t() || cn(n);
  if ((ge(s), s)) return gs(t[O], '');
  let a = $r(i, e, t, n),
    u = Ah(i, r);
  return Nr(i, r, a), (o = Hr(u, a)), o;
}
function Qy() {
  qy = Yy;
}
function J0() {
  return M();
}
function Zy(e, t, n) {
  let r = M(),
    o = xt();
  if (Le(r, o, t)) {
    let i = B(),
      s = ns();
    cl(i, s, r, e, t, r[O], n, !0);
  }
  return Zy;
}
var br = 'en-US';
var Ky = br;
function Jy(e) {
  typeof e == 'string' && (Ky = e.toLowerCase().replace(/_/g, '-'));
}
function Yl(e, t, n) {
  let r = e[O];
  switch (n) {
    case Node.COMMENT_NODE:
      return gs(r, t);
    case Node.TEXT_NODE:
      return hs(r, t);
    case Node.ELEMENT_NODE:
      return Fr(r, t, null);
  }
}
var Xy = (e, t, n, r) => (ge(!0), Yl(e, n, r));
function eD(e, t, n, r) {
  return ge(!0), Yl(e, n, r);
}
function tD() {
  Xy = eD;
}
function nD(e, t, n, r) {
  let o = M(),
    i = B(),
    s = ee();
  return oD(i, o, o[O], s, e, t, r), nD;
}
function rD(e, t, n, r) {
  let o = e.cleanup;
  if (o != null)
    for (let i = 0; i < o.length - 1; i += 2) {
      let s = o[i];
      if (s === n && o[i + 1] === r) {
        let a = t[zt],
          u = o[i + 2];
        return a.length > u ? a[u] : null;
      }
      typeof s == 'string' && (i += 2);
    }
  return null;
}
function oD(e, t, n, r, o, i, s) {
  let a = Qi(r),
    c = e.firstCreatePass && ml(e),
    l = t[$],
    d = gl(t),
    f = !0;
  if (r.type & 3 || s) {
    let m = X(r, t),
      S = s ? s(m) : m,
      _ = d.length,
      te = s ? (me) => s(ce(me[r.index])) : r.index,
      z = null;
    if ((!s && a && (z = rD(e, t, o, r.index)), z !== null)) {
      let me = z.__ngLastListenerFn__ || z;
      (me.__ngNextListenerFn__ = i), (z.__ngLastListenerFn__ = i), (f = !1);
    } else {
      i = uu(r, t, l, i, !1);
      let me = n.listen(S, o, i);
      d.push(i, me), c && c.push(o, te, _, _ + 1);
    }
  } else i = uu(r, t, l, i, !1);
  let p = r.outputs,
    h;
  if (f && p !== null && (h = p[o])) {
    let m = h.length;
    if (m)
      for (let S = 0; S < m; S += 2) {
        let _ = h[S],
          te = h[S + 1],
          it = t[_][te].subscribe(i),
          re = d.length;
        d.push(i, it), c && c.push(o, r.index, re, -(re + 1));
      }
  }
}
function au(e, t, n, r) {
  let o = E(null);
  try {
    return de(6, t, n), n(r) !== !1;
  } catch (i) {
    return yl(e, i), !1;
  } finally {
    de(7, t, n), E(o);
  }
}
function uu(e, t, n, r, o) {
  return function i(s) {
    if (s === Function) return r;
    let a = e.componentOffset > -1 ? rt(e.index, t) : t;
    Cs(a);
    let u = au(t, n, r, s),
      c = i.__ngNextListenerFn__;
    for (; c; ) (u = au(t, n, c, s) && u), (c = c.__ngNextListenerFn__);
    return o && u === !1 && s.preventDefault(), u;
  };
}
function X0(e = 1) {
  return Vp(e);
}
function iD(e, t) {
  let n = null,
    r = Hf(e);
  for (let o = 0; o < t.length; o++) {
    let i = t[o];
    if (i === '*') {
      n = o;
      continue;
    }
    if (r === null ? _u(e, i, !0) : zf(r, i)) return o;
  }
  return n;
}
function eM(e) {
  let t = M()[Q][J];
  if (!t.projection) {
    let n = e ? e.length : 1,
      r = (t.projection = Ff(n, null)),
      o = r.slice(),
      i = t.child;
    for (; i !== null; ) {
      let s = e ? iD(i, e) : 0;
      s !== null && (o[s] ? (o[s].projectionNext = i) : (r[s] = i), (o[s] = i)),
        (i = i.next);
    }
  }
}
function tM(e, t = 0, n) {
  let r = M(),
    o = B(),
    i = un(o, j + e, 16, null, n || null);
  i.projection === null && (i.projection = t),
    nc(),
    (!r[K] || _t()) && (i.flags & 32) !== 32 && Dg(o, r, i);
}
function nM(e, t, n, r) {
  qm(e, t, n, r);
}
function rM(e, t, n) {
  Wm(e, t, n);
}
function oM(e) {
  let t = M(),
    n = B(),
    r = oc();
  Xi(r + 1);
  let o = _s(n, r);
  if (e.dirty && wp(t) === ((o.metadata.flags & 2) === 2)) {
    if (o.matches === null) e.reset([]);
    else {
      let i = Zm(t, r);
      e.reset(i, ih), e.notifyOnChanges();
    }
    return !0;
  }
  return !1;
}
function iM() {
  return zm(M(), oc());
}
function sM(e) {
  let t = Op();
  return vp(t, j + e);
}
function aM(e, t = '') {
  let n = M(),
    r = B(),
    o = e + j,
    i = r.firstCreatePass ? un(r, o, 1, t, null) : r.data[o],
    s = Ql(r, n, i, t, e);
  (n[o] = s), rs() && ys(r, n, s, i), sn(i, !1);
}
var Ql = (e, t, n, r, o) => (ge(!0), hs(t[O], r));
function sD(e, t, n, r, o) {
  let i = t[K],
    s = !i || _t() || cn(n) || Ar(i, o);
  return ge(s), s ? hs(t[O], r) : $r(i, e, t, n);
}
function aD() {
  Ql = sD;
}
function uD(e) {
  return Zl('', e, ''), uD;
}
function Zl(e, t, n) {
  let r = M(),
    o = my(r, e, t, n);
  return o !== Pe && Yg(r, Re(), o), Zl;
}
function cD(e, t, n) {
  let r = B();
  if (r.firstCreatePass) {
    let o = Oe(e);
    Pi(n, r.data, r.blueprint, o, !0), Pi(t, r.data, r.blueprint, o, !1);
  }
}
function Pi(e, t, n, r, o) {
  if (((e = U(e)), Array.isArray(e)))
    for (let i = 0; i < e.length; i++) Pi(e[i], t, n, r, o);
  else {
    let i = B(),
      s = M(),
      a = ee(),
      u = It(e) ? e : U(e.provide),
      c = ju(e),
      l = a.providerIndexes & 1048575,
      d = a.directiveStart,
      f = a.providerIndexes >> 20;
    if (It(e) || !e.multi) {
      let p = new Ke(c, o, kr),
        h = So(u, t, o ? l : l + f, d);
      h === -1
        ? (Ho(dr(a, s), i, u),
          To(i, e, t.length),
          t.push(u),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          n.push(p),
          s.push(p))
        : ((n[h] = p), (s[h] = p));
    } else {
      let p = So(u, t, l + f, d),
        h = So(u, t, l, l + f),
        m = p >= 0 && n[p],
        S = h >= 0 && n[h];
      if ((o && !S) || (!o && !m)) {
        Ho(dr(a, s), i, u);
        let _ = fD(o ? dD : lD, n.length, o, r, c);
        !o && S && (n[h].providerFactory = _),
          To(i, e, t.length, 0),
          t.push(u),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          n.push(_),
          s.push(_);
      } else {
        let _ = Kl(n[o ? h : p], c, !o && r);
        To(i, e, p > -1 ? p : h, _);
      }
      !o && r && S && n[h].componentProviders++;
    }
  }
}
function To(e, t, n, r) {
  let o = It(t),
    i = op(t);
  if (o || i) {
    let u = (i ? U(t.useClass) : t).prototype.ngOnDestroy;
    if (u) {
      let c = e.destroyHooks || (e.destroyHooks = []);
      if (!o && t.multi) {
        let l = c.indexOf(n);
        l === -1 ? c.push(n, [r, u]) : c[l + 1].push(r, u);
      } else c.push(n, u);
    }
  }
}
function Kl(e, t, n) {
  return n && e.componentProviders++, e.multi.push(t) - 1;
}
function So(e, t, n, r) {
  for (let o = n; o < r; o++) if (t[o] === e) return o;
  return -1;
}
function lD(e, t, n, r) {
  return ki(this.multi, []);
}
function dD(e, t, n, r) {
  let o = this.multi,
    i;
  if (this.providerFactory) {
    let s = this.providerFactory.componentProviders,
      a = Je(n, n[y], this.providerFactory.index, r);
    (i = a.slice(0, s)), ki(o, i);
    for (let u = s; u < a.length; u++) i.push(a[u]);
  } else (i = []), ki(o, i);
  return i;
}
function ki(e, t) {
  for (let n = 0; n < e.length; n++) {
    let r = e[n];
    t.push(r());
  }
  return t;
}
function fD(e, t, n, r, o) {
  let i = new Ke(e, n, kr);
  return (
    (i.multi = []),
    (i.index = t),
    (i.componentProviders = 0),
    Kl(i, o, r && !n),
    i
  );
}
function uM(e, t = []) {
  return (n) => {
    n.providersResolver = (r, o) => cD(r, o ? o(e) : e, t);
  };
}
var pD = (() => {
  let t = class t {
    constructor(r) {
      (this._injector = r), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(r) {
      if (!r.standalone) return null;
      if (!this.cachedInjectors.has(r)) {
        let o = Ru(!1, r.type),
          i =
            o.length > 0
              ? sy([o], this._injector, `Standalone[${r.type.name}]`)
              : null;
        this.cachedInjectors.set(r, i);
      }
      return this.cachedInjectors.get(r);
    }
    ngOnDestroy() {
      try {
        for (let r of this.cachedInjectors.values()) r !== null && r.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
  };
  t.ɵprov = R({
    token: t,
    providedIn: 'environment',
    factory: () => new t(Y(Ae)),
  });
  let e = t;
  return e;
})();
function cM(e) {
  ke('NgStandalone'),
    (e.getStandaloneInjector = (t) =>
      t.get(pD).getOrCreateStandaloneInjector(e));
}
var lM = (() => {
  let t = class t {
    log(r) {
      console.log(r);
    }
    warn(r) {
      console.warn(r);
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵprov = R({ token: t, factory: t.ɵfac, providedIn: 'platform' }));
  let e = t;
  return e;
})();
var hD = new A('');
function Ss(e) {
  return !!e && typeof e.then == 'function';
}
function Jl(e) {
  return !!e && typeof e.subscribe == 'function';
}
var gD = new A(''),
  Xl = (() => {
    let t = class t {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((r, o) => {
            (this.resolve = r), (this.reject = o);
          })),
          (this.appInits = b(gD, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let r = [];
        for (let i of this.appInits) {
          let s = i();
          if (Ss(s)) r.push(s);
          else if (Jl(s)) {
            let a = new Promise((u, c) => {
              s.subscribe({ complete: u, error: c });
            });
            r.push(a);
          }
        }
        let o = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(r)
          .then(() => {
            o();
          })
          .catch((i) => {
            this.reject(i);
          }),
          r.length === 0 && o(),
          (this.initialized = !0);
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = R({ token: t, factory: t.ɵfac, providedIn: 'root' }));
    let e = t;
    return e;
  })(),
  ed = new A('');
function mD() {
  Ys(() => {
    throw new T(600, !1);
  });
}
function yD(e) {
  return e.isBoundToModule;
}
function DD(e, t, n) {
  try {
    let r = n();
    return Ss(r)
      ? r.catch((o) => {
          throw (t.runOutsideAngular(() => e.handleError(o)), o);
        })
      : r;
  } catch (r) {
    throw (t.runOutsideAngular(() => e.handleError(r)), r);
  }
}
var Ns = (() => {
  let t = class t {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = b(Cc)),
        (this.afterRenderEffectManager = b(Sl)),
        (this.externalTestViews = new Set()),
        (this.beforeRender = new le()),
        (this.afterTick = new le()),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = b(xs).hasPendingTasks.pipe(ve((r) => !r))),
        (this._injector = b(Ae));
    }
    get destroyed() {
      return this._destroyed;
    }
    get injector() {
      return this._injector;
    }
    bootstrap(r, o) {
      let i = r instanceof Dr;
      if (!this._injector.get(Xl).done) {
        let p = !i && Jf(r),
          h = !1;
        throw new T(405, h);
      }
      let a;
      i ? (a = r) : (a = this._injector.get(Ur).resolveComponentFactory(r)),
        this.componentTypes.push(a.componentType);
      let u = yD(a) ? void 0 : this._injector.get(Fe),
        c = o || a.selector,
        l = a.create(Tt.NULL, [], c, u),
        d = l.location.nativeElement,
        f = l.injector.get(hD, null);
      return (
        f?.registerApplication(d),
        l.onDestroy(() => {
          this.detachView(l.hostView),
            No(this.components, l),
            f?.unregisterApplication(d);
        }),
        this._loadComponent(l),
        l
      );
    }
    tick() {
      this._tick(!0);
    }
    _tick(r) {
      if (this._runningTick) throw new T(101, !1);
      let o = E(null);
      try {
        (this._runningTick = !0), this.detectChangesInAttachedViews(r);
      } catch (i) {
        this.internalErrorHandler(i);
      } finally {
        this.afterTick.next(), (this._runningTick = !1), E(o);
      }
    }
    detectChangesInAttachedViews(r) {
      let o = 0,
        i = this.afterRenderEffectManager;
      for (;;) {
        if (o === Il) throw new T(103, !1);
        if (r) {
          let s = o === 0;
          this.beforeRender.next(s);
          for (let { _lView: a, notifyErrorHandler: u } of this._views)
            wD(a, s, u);
        }
        if (
          (o++,
          i.executeInternalCallbacks(),
          ![...this.externalTestViews.keys(), ...this._views].some(
            ({ _lView: s }) => Li(s)
          ) &&
            (i.execute(),
            ![...this.externalTestViews.keys(), ...this._views].some(
              ({ _lView: s }) => Li(s)
            )))
        )
          break;
      }
    }
    attachView(r) {
      let o = r;
      this._views.push(o), o.attachToAppRef(this);
    }
    detachView(r) {
      let o = r;
      No(this._views, o), o.detachFromAppRef();
    }
    _loadComponent(r) {
      this.attachView(r.hostView), this.tick(), this.components.push(r);
      let o = this._injector.get(ed, []);
      [...this._bootstrapListeners, ...o].forEach((i) => i(r));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((r) => r()),
            this._views.slice().forEach((r) => r.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(r) {
      return (
        this._destroyListeners.push(r), () => No(this._destroyListeners, r)
      );
    }
    destroy() {
      if (this._destroyed) throw new T(406, !1);
      let r = this._injector;
      r.destroy && !r.destroyed && r.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵprov = R({ token: t, factory: t.ɵfac, providedIn: 'root' }));
  let e = t;
  return e;
})();
function No(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
var Qn;
function vD(e) {
  Qn ??= new WeakMap();
  let t = Qn.get(e);
  if (t) return t;
  let n = e.isStable
    .pipe(lo((r) => r))
    .toPromise()
    .then(() => {});
  return Qn.set(e, n), e.onDestroy(() => Qn?.delete(e)), n;
}
function wD(e, t, n) {
  (!t && !Li(e)) || ID(e, n, t);
}
function Li(e) {
  return Ji(e);
}
function ID(e, t, n) {
  let r;
  n ? ((r = 0), (e[g] |= 1024)) : e[g] & 64 ? (r = 0) : (r = 1), El(e, t, r);
}
var ji = class {
    constructor(t, n) {
      (this.ngModuleFactory = t), (this.componentFactories = n);
    }
  },
  dM = (() => {
    let t = class t {
      compileModuleSync(r) {
        return new Ei(r);
      }
      compileModuleAsync(r) {
        return Promise.resolve(this.compileModuleSync(r));
      }
      compileModuleAndAllComponentsSync(r) {
        let o = this.compileModuleSync(r),
          i = Nu(r),
          s = Uc(i.declarations).reduce((a, u) => {
            let c = Ye(u);
            return c && a.push(new en(c)), a;
          }, []);
        return new ji(o, s);
      }
      compileModuleAndAllComponentsAsync(r) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(r));
      }
      clearCache() {}
      clearCacheFor(r) {}
      getModuleId(r) {}
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = R({ token: t, factory: t.ɵfac, providedIn: 'root' }));
    let e = t;
    return e;
  })();
var ED = (() => {
  let t = class t {
    constructor() {
      (this.zone = b(ue)), (this.applicationRef = b(Ns));
    }
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription =
          this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.zone.run(() => {
                this.applicationRef.tick();
              });
            },
          }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵprov = R({ token: t, factory: t.ɵfac, providedIn: 'root' }));
  let e = t;
  return e;
})();
function CD(e) {
  return [
    { provide: ue, useFactory: e },
    {
      provide: $t,
      multi: !0,
      useFactory: () => {
        let t = b(ED, { optional: !0 });
        return () => t.initialize();
      },
    },
    {
      provide: $t,
      multi: !0,
      useFactory: () => {
        let t = b(xD);
        return () => {
          t.initialize();
        };
      },
    },
    { provide: Cc, useFactory: bD },
  ];
}
function bD() {
  let e = b(ue),
    t = b(Xe);
  return (n) => e.runOutsideAngular(() => t.handleError(n));
}
function MD(e) {
  let t = CD(() => new ue(_D(e)));
  return Fu([[], t]);
}
function _D(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  };
}
var xD = (() => {
  let t = class t {
    constructor() {
      (this.subscription = new P()),
        (this.initialized = !1),
        (this.zone = b(ue)),
        (this.pendingTasks = b(xs));
    }
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let r = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (r = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              ue.assertNotInAngularZone(),
                queueMicrotask(() => {
                  r !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(r), (r = null));
                });
            })
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            ue.assertInAngularZone(), (r ??= this.pendingTasks.add());
          })
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵprov = R({ token: t, factory: t.ɵfac, providedIn: 'root' }));
  let e = t;
  return e;
})();
function TD() {
  return (typeof $localize < 'u' && $localize.locale) || br;
}
var As = new A('', {
  providedIn: 'root',
  factory: () => b(As, C.Optional | C.SkipSelf) || TD(),
});
var td = new A('');
var nr = null;
function SD(e = [], t) {
  return Tt.create({
    name: t,
    providers: [
      { provide: Lu, useValue: 'platform' },
      { provide: td, useValue: new Set([() => (nr = null)]) },
      ...e,
    ],
  });
}
function ND(e = []) {
  if (nr) return nr;
  let t = SD(e);
  return (nr = t), mD(), AD(t), t;
}
function AD(e) {
  e.get(mh, null)?.forEach((n) => n());
}
var Os = (() => {
  let t = class t {};
  t.__NG_ELEMENT_ID__ = OD;
  let e = t;
  return e;
})();
function OD(e) {
  return FD(ee(), M(), (e & 16) === 16);
}
function FD(e, t, n) {
  if (on(e) && !n) {
    let r = rt(e.index, t);
    return new tt(r, r);
  } else if (e.type & 47) {
    let r = t[Q];
    return new tt(r, t);
  }
  return null;
}
function fM(e) {
  try {
    let { rootComponent: t, appProviders: n, platformProviders: r } = e,
      o = ND(r),
      i = [MD(), ...(n || [])],
      a = new Ir({
        providers: i,
        parent: o,
        debugName: '',
        runEnvironmentInitializers: !1,
      }).injector,
      u = a.get(ue);
    return u.run(() => {
      a.resolveInjectorInitializers();
      let c = a.get(Xe, null),
        l;
      u.runOutsideAngular(() => {
        l = u.onError.subscribe({
          next: (p) => {
            c.handleError(p);
          },
        });
      });
      let d = () => a.destroy(),
        f = o.get(td);
      return (
        f.add(d),
        a.onDestroy(() => {
          l.unsubscribe(), f.delete(d);
        }),
        DD(c, u, () => {
          let p = a.get(Xl);
          return (
            p.runInitializers(),
            p.donePromise.then(() => {
              let h = a.get(As, br);
              Jy(h || br);
              let m = a.get(Ns);
              return t !== void 0 && m.bootstrap(t), m;
            })
          );
        })
      );
    });
  } catch (t) {
    return Promise.reject(t);
  }
}
var cu = !1,
  RD = !1;
function PD() {
  cu || ((cu = !0), xh(), Wy(), aD(), Qy(), cy(), Bm(), Em(), Tg(), tD());
}
function kD(e, t) {
  return vD(e);
}
function pM() {
  return Fu([
    {
      provide: Un,
      useFactory: () => {
        let e = !0;
        return (
          Wn() && (e = !!b(us, { optional: !0 })?.get(Fc, null)),
          e && ke('NgHydration'),
          e
        );
      },
    },
    {
      provide: $t,
      useValue: () => {
        (RD = !!b(Oh, { optional: !0 })), Wn() && b(Un) && (LD(), PD());
      },
      multi: !0,
    },
    { provide: Lc, useFactory: () => Wn() && b(Un) },
    {
      provide: ed,
      useFactory: () => {
        if (Wn() && b(Un)) {
          let e = b(Ns),
            t = b(Tt);
          return () => {
            kD(e, t).then(() => {
              pm(e);
            });
          };
        }
        return () => {};
      },
      multi: !0,
    },
  ]);
}
function LD() {
  let e = Sr(),
    t;
  for (let n of e.body.childNodes)
    if (n.nodeType === Node.COMMENT_NODE && n.textContent?.trim() === Mh) {
      t = n;
      break;
    }
  if (!t) throw new T(-507, !1);
}
function jD(e) {
  return typeof e == 'boolean' ? e : e != null && e !== 'false';
}
function VD(e, t = NaN) {
  return !isNaN(parseFloat(e)) && !isNaN(Number(e)) ? Number(e) : t;
}
function hM(e, t) {
  ke('NgSignals');
  let n = zs(e);
  return t?.equal && (n[ye].equal = t.equal), n;
}
var BD = new A('', { providedIn: 'root', factory: () => b($D) }),
  $D = (() => {
    let t = class t {};
    t.ɵprov = R({ token: t, providedIn: 'root', factory: () => new Vi() });
    let e = t;
    return e;
  })(),
  Vi = class {
    constructor() {
      (this.queuedEffectCount = 0),
        (this.queues = new Map()),
        (this.pendingTasks = b(xs)),
        (this.taskId = null);
    }
    scheduleEffect(t) {
      if ((this.enqueue(t), this.taskId === null)) {
        let n = (this.taskId = this.pendingTasks.add());
        queueMicrotask(() => {
          this.flush(), this.pendingTasks.remove(n), (this.taskId = null);
        });
      }
    }
    enqueue(t) {
      let n = t.creationZone;
      this.queues.has(n) || this.queues.set(n, new Set());
      let r = this.queues.get(n);
      r.has(t) || (this.queuedEffectCount++, r.add(t));
    }
    flush() {
      for (; this.queuedEffectCount > 0; )
        for (let [t, n] of this.queues)
          t === null ? this.flushQueue(n) : t.run(() => this.flushQueue(n));
    }
    flushQueue(t) {
      for (let n of t) t.delete(n), this.queuedEffectCount--, n.run();
    }
  },
  Bi = class {
    constructor(t, n, r, o, i, s) {
      (this.scheduler = t),
        (this.effectFn = n),
        (this.creationZone = r),
        (this.injector = i),
        (this.watcher = Js(
          (a) => this.runEffect(a),
          () => this.schedule(),
          s
        )),
        (this.unregisterOnDestroy = o?.onDestroy(() => this.destroy()));
    }
    runEffect(t) {
      try {
        this.effectFn(t);
      } catch (n) {
        this.injector.get(Xe, null, { optional: !0 })?.handleError(n);
      }
    }
    run() {
      this.watcher.run();
    }
    schedule() {
      this.scheduler.scheduleEffect(this);
    }
    destroy() {
      this.watcher.destroy(), this.unregisterOnDestroy?.();
    }
  };
function HD(e, t) {
  ke('NgSignals'), !t?.injector && dp(HD);
  let n = t?.injector ?? b(Tt),
    r = t?.manualCleanup !== !0 ? n.get(ss) : null,
    o = new Bi(
      n.get(BD),
      e,
      typeof Zone > 'u' ? null : Zone.current,
      r,
      n,
      t?.allowSignalWrites ?? !1
    ),
    i = n.get(Os, null, { optional: !0 });
  return (
    !i || !(i._lView[g] & 8)
      ? o.watcher.notify()
      : (i._lView[Kn] ??= []).push(o.watcher.notify),
    o
  );
}
var sd = null;
function Fs() {
  return sd;
}
function $M(e) {
  sd ??= e;
}
var nd = class {};
var ad = new A(''),
  ud = (() => {
    let t = class t {
      historyGo(r) {
        throw new Error('');
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = R({ token: t, factory: () => b(zD), providedIn: 'platform' }));
    let e = t;
    return e;
  })();
var zD = (() => {
  let t = class t extends ud {
    constructor() {
      super(),
        (this._doc = b(ad)),
        (this._location = window.location),
        (this._history = window.history);
    }
    getBaseHrefFromDOM() {
      return Fs().getBaseHref(this._doc);
    }
    onPopState(r) {
      let o = Fs().getGlobalEventTarget(this._doc, 'window');
      return (
        o.addEventListener('popstate', r, !1),
        () => o.removeEventListener('popstate', r)
      );
    }
    onHashChange(r) {
      let o = Fs().getGlobalEventTarget(this._doc, 'window');
      return (
        o.addEventListener('hashchange', r, !1),
        () => o.removeEventListener('hashchange', r)
      );
    }
    get href() {
      return this._location.href;
    }
    get protocol() {
      return this._location.protocol;
    }
    get hostname() {
      return this._location.hostname;
    }
    get port() {
      return this._location.port;
    }
    get pathname() {
      return this._location.pathname;
    }
    get search() {
      return this._location.search;
    }
    get hash() {
      return this._location.hash;
    }
    set pathname(r) {
      this._location.pathname = r;
    }
    pushState(r, o, i) {
      this._history.pushState(r, o, i);
    }
    replaceState(r, o, i) {
      this._history.replaceState(r, o, i);
    }
    forward() {
      this._history.forward();
    }
    back() {
      this._history.back();
    }
    historyGo(r = 0) {
      this._history.go(r);
    }
    getState() {
      return this._history.state;
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵprov = R({ token: t, factory: () => new t(), providedIn: 'platform' }));
  let e = t;
  return e;
})();
function cd(e, t) {
  if (e.length == 0) return t;
  if (t.length == 0) return e;
  let n = 0;
  return (
    e.endsWith('/') && n++,
    t.startsWith('/') && n++,
    n == 2 ? e + t.substring(1) : n == 1 ? e + t : e + '/' + t
  );
}
function rd(e) {
  let t = e.match(/#|\?|$/),
    n = (t && t.index) || e.length,
    r = n - (e[n - 1] === '/' ? 1 : 0);
  return e.slice(0, r) + e.slice(n);
}
function ot(e) {
  return e && e[0] !== '?' ? '?' + e : e;
}
var Rs = (() => {
    let t = class t {
      historyGo(r) {
        throw new Error('');
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = R({ token: t, factory: () => b(qD), providedIn: 'root' }));
    let e = t;
    return e;
  })(),
  WD = new A(''),
  qD = (() => {
    let t = class t extends Rs {
      constructor(r, o) {
        super(),
          (this._platformLocation = r),
          (this._removeListenerFns = []),
          (this._baseHref =
            o ??
            this._platformLocation.getBaseHrefFromDOM() ??
            b(ad).location?.origin ??
            '');
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(r) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(r),
          this._platformLocation.onHashChange(r)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(r) {
        return cd(this._baseHref, r);
      }
      path(r = !1) {
        let o =
            this._platformLocation.pathname + ot(this._platformLocation.search),
          i = this._platformLocation.hash;
        return i && r ? `${o}${i}` : o;
      }
      pushState(r, o, i, s) {
        let a = this.prepareExternalUrl(i + ot(s));
        this._platformLocation.pushState(r, o, a);
      }
      replaceState(r, o, i, s) {
        let a = this.prepareExternalUrl(i + ot(s));
        this._platformLocation.replaceState(r, o, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(r = 0) {
        this._platformLocation.historyGo?.(r);
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(Y(ud), Y(WD, 8));
    }),
      (t.ɵprov = R({ token: t, factory: t.ɵfac, providedIn: 'root' }));
    let e = t;
    return e;
  })();
var YD = (() => {
  let t = class t {
    constructor(r) {
      (this._subject = new ze()),
        (this._urlChangeListeners = []),
        (this._urlChangeSubscription = null),
        (this._locationStrategy = r);
      let o = this._locationStrategy.getBaseHref();
      (this._basePath = KD(rd(od(o)))),
        this._locationStrategy.onPopState((i) => {
          this._subject.emit({
            url: this.path(!0),
            pop: !0,
            state: i.state,
            type: i.type,
          });
        });
    }
    ngOnDestroy() {
      this._urlChangeSubscription?.unsubscribe(),
        (this._urlChangeListeners = []);
    }
    path(r = !1) {
      return this.normalize(this._locationStrategy.path(r));
    }
    getState() {
      return this._locationStrategy.getState();
    }
    isCurrentPathEqualTo(r, o = '') {
      return this.path() == this.normalize(r + ot(o));
    }
    normalize(r) {
      return t.stripTrailingSlash(ZD(this._basePath, od(r)));
    }
    prepareExternalUrl(r) {
      return (
        r && r[0] !== '/' && (r = '/' + r),
        this._locationStrategy.prepareExternalUrl(r)
      );
    }
    go(r, o = '', i = null) {
      this._locationStrategy.pushState(i, '', r, o),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(r + ot(o)), i);
    }
    replaceState(r, o = '', i = null) {
      this._locationStrategy.replaceState(i, '', r, o),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(r + ot(o)), i);
    }
    forward() {
      this._locationStrategy.forward();
    }
    back() {
      this._locationStrategy.back();
    }
    historyGo(r = 0) {
      this._locationStrategy.historyGo?.(r);
    }
    onUrlChange(r) {
      return (
        this._urlChangeListeners.push(r),
        (this._urlChangeSubscription ??= this.subscribe((o) => {
          this._notifyUrlChangeListeners(o.url, o.state);
        })),
        () => {
          let o = this._urlChangeListeners.indexOf(r);
          this._urlChangeListeners.splice(o, 1),
            this._urlChangeListeners.length === 0 &&
              (this._urlChangeSubscription?.unsubscribe(),
              (this._urlChangeSubscription = null));
        }
      );
    }
    _notifyUrlChangeListeners(r = '', o) {
      this._urlChangeListeners.forEach((i) => i(r, o));
    }
    subscribe(r, o, i) {
      return this._subject.subscribe({ next: r, error: o, complete: i });
    }
  };
  (t.normalizeQueryParams = ot),
    (t.joinWithSlash = cd),
    (t.stripTrailingSlash = rd),
    (t.ɵfac = function (o) {
      return new (o || t)(Y(Rs));
    }),
    (t.ɵprov = R({ token: t, factory: () => QD(), providedIn: 'root' }));
  let e = t;
  return e;
})();
function QD() {
  return new YD(Y(Rs));
}
function ZD(e, t) {
  if (!e || !t.startsWith(e)) return t;
  let n = t.substring(e.length);
  return n === '' || ['/', ';', '?', '#'].includes(n[0]) ? n : t;
}
function od(e) {
  return e.replace(/\/index.html$/, '');
}
function KD(e) {
  if (new RegExp('^(https?:)?//').test(e)) {
    let [, n] = e.split(/\/\/[^\/]+/);
    return n;
  }
  return e;
}
function HM(e, t) {
  t = encodeURIComponent(t);
  for (let n of e.split(';')) {
    let r = n.indexOf('='),
      [o, i] = r == -1 ? [n, ''] : [n.slice(0, r), n.slice(r + 1)];
    if (o.trim() === t) return decodeURIComponent(i);
  }
  return null;
}
var UM = (() => {
    let t = class t {};
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵmod = xu({ type: t })),
      (t.ɵinj = hu({}));
    let e = t;
    return e;
  })(),
  JD = 'browser',
  XD = 'server';
function GM(e) {
  return e === JD;
}
function zM(e) {
  return e === XD;
}
var id = class {};
export {
  be as a,
  Me as b,
  ev as c,
  P as d,
  Md as e,
  x as f,
  so as g,
  ao as h,
  le as i,
  Pt as j,
  Lt as k,
  xe as l,
  Pd as m,
  kd as n,
  Ld as o,
  He as p,
  ve as q,
  zd as r,
  Ue as s,
  $n as t,
  qd as u,
  Yd as v,
  Ge as w,
  ba as x,
  Qd as y,
  Zd as z,
  jt as A,
  co as B,
  Kd as C,
  Jd as D,
  tf as E,
  lo as F,
  fo as G,
  nf as H,
  rf as I,
  of as J,
  sf as K,
  af as L,
  uf as M,
  cf as N,
  lf as O,
  T as P,
  fu as Q,
  R,
  hu as S,
  b0 as T,
  A as U,
  C as V,
  Y as W,
  b as X,
  Ht as Y,
  qe as Z,
  M0 as _,
  xu as $,
  Kf as aa,
  Fu as ba,
  Lu as ca,
  Ae as da,
  _0 as ea,
  zu as fa,
  x0 as ga,
  T0 as ha,
  S0 as ia,
  N0 as ja,
  A0 as ka,
  th as la,
  Tt as ma,
  Xe as na,
  Nt as oa,
  ze as pa,
  O0 as qa,
  hh as ra,
  mh as sa,
  as as ta,
  F0 as ua,
  R0 as va,
  us as wa,
  fs as xa,
  P0 as ya,
  k0 as za,
  L0 as Aa,
  j0 as Ba,
  V0 as Ca,
  B0 as Da,
  jh as Ea,
  $0 as Fa,
  Jh as Ga,
  hr as Ha,
  H0 as Ia,
  kr as Ja,
  U0 as Ka,
  ui as La,
  di as Ma,
  ke as Na,
  Gr as Oa,
  W0 as Pa,
  Xm as Qa,
  iy as Ra,
  wi as Sa,
  sy as Ta,
  xs as Ua,
  Ci as Va,
  ue as Wa,
  gy as Xa,
  xy as Ya,
  Ty as Za,
  q0 as _a,
  Y0 as $a,
  Q0 as ab,
  Z0 as bb,
  K0 as cb,
  zl as db,
  Wl as eb,
  Gy as fb,
  J0 as gb,
  Zy as hb,
  nD as ib,
  X0 as jb,
  eM as kb,
  tM as lb,
  nM as mb,
  rM as nb,
  oM as ob,
  iM as pb,
  sM as qb,
  aM as rb,
  uD as sb,
  uM as tb,
  cM as ub,
  lM as vb,
  Ss as wb,
  ed as xb,
  Ns as yb,
  vD as zb,
  dM as Ab,
  Os as Bb,
  fM as Cb,
  pM as Db,
  jD as Eb,
  VD as Fb,
  hM as Gb,
  HD as Hb,
  Fs as Ib,
  $M as Jb,
  nd as Kb,
  ad as Lb,
  YD as Mb,
  HM as Nb,
  UM as Ob,
  JD as Pb,
  GM as Qb,
  zM as Rb,
  id as Sb,
};
