import { createRequire as __fl_cr } from 'node:module'; const require = __fl_cr(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// packages/contracts/node_modules/ajv/dist/compile/codegen/code.js
var require_code = __commonJS({
  "packages/contracts/node_modules/ajv/dist/compile/codegen/code.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.regexpCode = exports.getEsmExportName = exports.getProperty = exports.safeStringify = exports.stringify = exports.strConcat = exports.addCodeArg = exports.str = exports._ = exports.nil = exports._Code = exports.Name = exports.IDENTIFIER = exports._CodeOrName = void 0;
    var _CodeOrName = class {
    };
    exports._CodeOrName = _CodeOrName;
    exports.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    var Name = class extends _CodeOrName {
      constructor(s) {
        super();
        if (!exports.IDENTIFIER.test(s))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = s;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return false;
      }
      get names() {
        return { [this.str]: 1 };
      }
    };
    exports.Name = Name;
    var _Code = class extends _CodeOrName {
      constructor(code) {
        super();
        this._items = typeof code === "string" ? [code] : code;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return false;
        const item = this._items[0];
        return item === "" || item === '""';
      }
      get str() {
        var _a;
        return (_a = this._str) !== null && _a !== void 0 ? _a : this._str = this._items.reduce((s, c) => `${s}${c}`, "");
      }
      get names() {
        var _a;
        return (_a = this._names) !== null && _a !== void 0 ? _a : this._names = this._items.reduce((names, c) => {
          if (c instanceof Name)
            names[c.str] = (names[c.str] || 0) + 1;
          return names;
        }, {});
      }
    };
    exports._Code = _Code;
    exports.nil = new _Code("");
    function _(strs, ...args) {
      const code = [strs[0]];
      let i = 0;
      while (i < args.length) {
        addCodeArg(code, args[i]);
        code.push(strs[++i]);
      }
      return new _Code(code);
    }
    exports._ = _;
    var plus = new _Code("+");
    function str2(strs, ...args) {
      const expr = [safeStringify(strs[0])];
      let i = 0;
      while (i < args.length) {
        expr.push(plus);
        addCodeArg(expr, args[i]);
        expr.push(plus, safeStringify(strs[++i]));
      }
      optimize(expr);
      return new _Code(expr);
    }
    exports.str = str2;
    function addCodeArg(code, arg) {
      if (arg instanceof _Code)
        code.push(...arg._items);
      else if (arg instanceof Name)
        code.push(arg);
      else
        code.push(interpolate(arg));
    }
    exports.addCodeArg = addCodeArg;
    function optimize(expr) {
      let i = 1;
      while (i < expr.length - 1) {
        if (expr[i] === plus) {
          const res = mergeExprItems(expr[i - 1], expr[i + 1]);
          if (res !== void 0) {
            expr.splice(i - 1, 3, res);
            continue;
          }
          expr[i++] = "+";
        }
        i++;
      }
    }
    function mergeExprItems(a, b) {
      if (b === '""')
        return a;
      if (a === '""')
        return b;
      if (typeof a == "string") {
        if (b instanceof Name || a[a.length - 1] !== '"')
          return;
        if (typeof b != "string")
          return `${a.slice(0, -1)}${b}"`;
        if (b[0] === '"')
          return a.slice(0, -1) + b.slice(1);
        return;
      }
      if (typeof b == "string" && b[0] === '"' && !(a instanceof Name))
        return `"${a}${b.slice(1)}`;
      return;
    }
    function strConcat(c1, c2) {
      return c2.emptyStr() ? c1 : c1.emptyStr() ? c2 : str2`${c1}${c2}`;
    }
    exports.strConcat = strConcat;
    function interpolate(x) {
      return typeof x == "number" || typeof x == "boolean" || x === null ? x : safeStringify(Array.isArray(x) ? x.join(",") : x);
    }
    function stringify(x) {
      return new _Code(safeStringify(x));
    }
    exports.stringify = stringify;
    function safeStringify(x) {
      return JSON.stringify(x).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    exports.safeStringify = safeStringify;
    function getProperty(key) {
      return typeof key == "string" && exports.IDENTIFIER.test(key) ? new _Code(`.${key}`) : _`[${key}]`;
    }
    exports.getProperty = getProperty;
    function getEsmExportName(key) {
      if (typeof key == "string" && exports.IDENTIFIER.test(key)) {
        return new _Code(`${key}`);
      }
      throw new Error(`CodeGen: invalid export name: ${key}, use explicit $id name mapping`);
    }
    exports.getEsmExportName = getEsmExportName;
    function regexpCode(rx) {
      return new _Code(rx.toString());
    }
    exports.regexpCode = regexpCode;
  }
});

// packages/contracts/node_modules/ajv/dist/compile/codegen/scope.js
var require_scope = __commonJS({
  "packages/contracts/node_modules/ajv/dist/compile/codegen/scope.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ValueScope = exports.ValueScopeName = exports.Scope = exports.varKinds = exports.UsedValueState = void 0;
    var code_1 = require_code();
    var ValueError = class extends Error {
      constructor(name) {
        super(`CodeGen: "code" for ${name} not defined`);
        this.value = name.value;
      }
    };
    var UsedValueState;
    (function(UsedValueState2) {
      UsedValueState2[UsedValueState2["Started"] = 0] = "Started";
      UsedValueState2[UsedValueState2["Completed"] = 1] = "Completed";
    })(UsedValueState || (exports.UsedValueState = UsedValueState = {}));
    exports.varKinds = {
      const: new code_1.Name("const"),
      let: new code_1.Name("let"),
      var: new code_1.Name("var")
    };
    var Scope = class {
      constructor({ prefixes, parent } = {}) {
        this._names = {};
        this._prefixes = prefixes;
        this._parent = parent;
      }
      toName(nameOrPrefix) {
        return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
      }
      name(prefix) {
        return new code_1.Name(this._newName(prefix));
      }
      _newName(prefix) {
        const ng = this._names[prefix] || this._nameGroup(prefix);
        return `${prefix}${ng.index++}`;
      }
      _nameGroup(prefix) {
        var _a, _b;
        if (((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._prefixes) === null || _b === void 0 ? void 0 : _b.has(prefix)) || this._prefixes && !this._prefixes.has(prefix)) {
          throw new Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
        }
        return this._names[prefix] = { prefix, index: 0 };
      }
    };
    exports.Scope = Scope;
    var ValueScopeName = class extends code_1.Name {
      constructor(prefix, nameStr) {
        super(nameStr);
        this.prefix = prefix;
      }
      setValue(value, { property, itemIndex }) {
        this.value = value;
        this.scopePath = (0, code_1._)`.${new code_1.Name(property)}[${itemIndex}]`;
      }
    };
    exports.ValueScopeName = ValueScopeName;
    var line = (0, code_1._)`\n`;
    var ValueScope = class extends Scope {
      constructor(opts) {
        super(opts);
        this._values = {};
        this._scope = opts.scope;
        this.opts = { ...opts, _n: opts.lines ? line : code_1.nil };
      }
      get() {
        return this._scope;
      }
      name(prefix) {
        return new ValueScopeName(prefix, this._newName(prefix));
      }
      value(nameOrPrefix, value) {
        var _a;
        if (value.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const name = this.toName(nameOrPrefix);
        const { prefix } = name;
        const valueKey = (_a = value.key) !== null && _a !== void 0 ? _a : value.ref;
        let vs = this._values[prefix];
        if (vs) {
          const _name = vs.get(valueKey);
          if (_name)
            return _name;
        } else {
          vs = this._values[prefix] = /* @__PURE__ */ new Map();
        }
        vs.set(valueKey, name);
        const s = this._scope[prefix] || (this._scope[prefix] = []);
        const itemIndex = s.length;
        s[itemIndex] = value.ref;
        name.setValue(value, { property: prefix, itemIndex });
        return name;
      }
      getValue(prefix, keyOrRef) {
        const vs = this._values[prefix];
        if (!vs)
          return;
        return vs.get(keyOrRef);
      }
      scopeRefs(scopeName, values = this._values) {
        return this._reduceValues(values, (name) => {
          if (name.scopePath === void 0)
            throw new Error(`CodeGen: name "${name}" has no value`);
          return (0, code_1._)`${scopeName}${name.scopePath}`;
        });
      }
      scopeCode(values = this._values, usedValues, getCode) {
        return this._reduceValues(values, (name) => {
          if (name.value === void 0)
            throw new Error(`CodeGen: name "${name}" has no value`);
          return name.value.code;
        }, usedValues, getCode);
      }
      _reduceValues(values, valueCode, usedValues = {}, getCode) {
        let code = code_1.nil;
        for (const prefix in values) {
          const vs = values[prefix];
          if (!vs)
            continue;
          const nameSet = usedValues[prefix] = usedValues[prefix] || /* @__PURE__ */ new Map();
          vs.forEach((name) => {
            if (nameSet.has(name))
              return;
            nameSet.set(name, UsedValueState.Started);
            let c = valueCode(name);
            if (c) {
              const def = this.opts.es5 ? exports.varKinds.var : exports.varKinds.const;
              code = (0, code_1._)`${code}${def} ${name} = ${c};${this.opts._n}`;
            } else if (c = getCode === null || getCode === void 0 ? void 0 : getCode(name)) {
              code = (0, code_1._)`${code}${c}${this.opts._n}`;
            } else {
              throw new ValueError(name);
            }
            nameSet.set(name, UsedValueState.Completed);
          });
        }
        return code;
      }
    };
    exports.ValueScope = ValueScope;
  }
});

// packages/contracts/node_modules/ajv/dist/compile/codegen/index.js
var require_codegen = __commonJS({
  "packages/contracts/node_modules/ajv/dist/compile/codegen/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.or = exports.and = exports.not = exports.CodeGen = exports.operators = exports.varKinds = exports.ValueScopeName = exports.ValueScope = exports.Scope = exports.Name = exports.regexpCode = exports.stringify = exports.getProperty = exports.nil = exports.strConcat = exports.str = exports._ = void 0;
    var code_1 = require_code();
    var scope_1 = require_scope();
    var code_2 = require_code();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return code_2._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return code_2.str;
    } });
    Object.defineProperty(exports, "strConcat", { enumerable: true, get: function() {
      return code_2.strConcat;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return code_2.nil;
    } });
    Object.defineProperty(exports, "getProperty", { enumerable: true, get: function() {
      return code_2.getProperty;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return code_2.stringify;
    } });
    Object.defineProperty(exports, "regexpCode", { enumerable: true, get: function() {
      return code_2.regexpCode;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return code_2.Name;
    } });
    var scope_2 = require_scope();
    Object.defineProperty(exports, "Scope", { enumerable: true, get: function() {
      return scope_2.Scope;
    } });
    Object.defineProperty(exports, "ValueScope", { enumerable: true, get: function() {
      return scope_2.ValueScope;
    } });
    Object.defineProperty(exports, "ValueScopeName", { enumerable: true, get: function() {
      return scope_2.ValueScopeName;
    } });
    Object.defineProperty(exports, "varKinds", { enumerable: true, get: function() {
      return scope_2.varKinds;
    } });
    exports.operators = {
      GT: new code_1._Code(">"),
      GTE: new code_1._Code(">="),
      LT: new code_1._Code("<"),
      LTE: new code_1._Code("<="),
      EQ: new code_1._Code("==="),
      NEQ: new code_1._Code("!=="),
      NOT: new code_1._Code("!"),
      OR: new code_1._Code("||"),
      AND: new code_1._Code("&&"),
      ADD: new code_1._Code("+")
    };
    var Node = class {
      optimizeNodes() {
        return this;
      }
      optimizeNames(_names, _constants) {
        return this;
      }
    };
    var Def = class extends Node {
      constructor(varKind, name, rhs) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.rhs = rhs;
      }
      render({ es5, _n }) {
        const varKind = es5 ? scope_1.varKinds.var : this.varKind;
        const rhs = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${varKind} ${this.name}${rhs};` + _n;
      }
      optimizeNames(names, constants) {
        if (!names[this.name.str])
          return;
        if (this.rhs)
          this.rhs = optimizeExpr(this.rhs, names, constants);
        return this;
      }
      get names() {
        return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
      }
    };
    var Assign = class extends Node {
      constructor(lhs, rhs, sideEffects) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
        this.sideEffects = sideEffects;
      }
      render({ _n }) {
        return `${this.lhs} = ${this.rhs};` + _n;
      }
      optimizeNames(names, constants) {
        if (this.lhs instanceof code_1.Name && !names[this.lhs.str] && !this.sideEffects)
          return;
        this.rhs = optimizeExpr(this.rhs, names, constants);
        return this;
      }
      get names() {
        const names = this.lhs instanceof code_1.Name ? {} : { ...this.lhs.names };
        return addExprNames(names, this.rhs);
      }
    };
    var AssignOp = class extends Assign {
      constructor(lhs, op, rhs, sideEffects) {
        super(lhs, rhs, sideEffects);
        this.op = op;
      }
      render({ _n }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + _n;
      }
    };
    var Label = class extends Node {
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        return `${this.label}:` + _n;
      }
    };
    var Break = class extends Node {
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        const label = this.label ? ` ${this.label}` : "";
        return `break${label};` + _n;
      }
    };
    var Throw = class extends Node {
      constructor(error) {
        super();
        this.error = error;
      }
      render({ _n }) {
        return `throw ${this.error};` + _n;
      }
      get names() {
        return this.error.names;
      }
    };
    var AnyCode = class extends Node {
      constructor(code) {
        super();
        this.code = code;
      }
      render({ _n }) {
        return `${this.code};` + _n;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(names, constants) {
        this.code = optimizeExpr(this.code, names, constants);
        return this;
      }
      get names() {
        return this.code instanceof code_1._CodeOrName ? this.code.names : {};
      }
    };
    var ParentNode = class extends Node {
      constructor(nodes = []) {
        super();
        this.nodes = nodes;
      }
      render(opts) {
        return this.nodes.reduce((code, n) => code + n.render(opts), "");
      }
      optimizeNodes() {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i].optimizeNodes();
          if (Array.isArray(n))
            nodes.splice(i, 1, ...n);
          else if (n)
            nodes[i] = n;
          else
            nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      optimizeNames(names, constants) {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i];
          if (n.optimizeNames(names, constants))
            continue;
          subtractNames(names, n.names);
          nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((names, n) => addNames(names, n.names), {});
      }
    };
    var BlockNode = class extends ParentNode {
      render(opts) {
        return "{" + opts._n + super.render(opts) + "}" + opts._n;
      }
    };
    var Root = class extends ParentNode {
    };
    var Else = class extends BlockNode {
    };
    Else.kind = "else";
    var If = class _If extends BlockNode {
      constructor(condition, nodes) {
        super(nodes);
        this.condition = condition;
      }
      render(opts) {
        let code = `if(${this.condition})` + super.render(opts);
        if (this.else)
          code += "else " + this.else.render(opts);
        return code;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const cond = this.condition;
        if (cond === true)
          return this.nodes;
        let e = this.else;
        if (e) {
          const ns = e.optimizeNodes();
          e = this.else = Array.isArray(ns) ? new Else(ns) : ns;
        }
        if (e) {
          if (cond === false)
            return e instanceof _If ? e : e.nodes;
          if (this.nodes.length)
            return this;
          return new _If(not(cond), e instanceof _If ? [e] : e.nodes);
        }
        if (cond === false || !this.nodes.length)
          return void 0;
        return this;
      }
      optimizeNames(names, constants) {
        var _a;
        this.else = (_a = this.else) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
        if (!(super.optimizeNames(names, constants) || this.else))
          return;
        this.condition = optimizeExpr(this.condition, names, constants);
        return this;
      }
      get names() {
        const names = super.names;
        addExprNames(names, this.condition);
        if (this.else)
          addNames(names, this.else.names);
        return names;
      }
    };
    If.kind = "if";
    var For = class extends BlockNode {
    };
    For.kind = "for";
    var ForLoop = class extends For {
      constructor(iteration) {
        super();
        this.iteration = iteration;
      }
      render(opts) {
        return `for(${this.iteration})` + super.render(opts);
      }
      optimizeNames(names, constants) {
        if (!super.optimizeNames(names, constants))
          return;
        this.iteration = optimizeExpr(this.iteration, names, constants);
        return this;
      }
      get names() {
        return addNames(super.names, this.iteration.names);
      }
    };
    var ForRange = class extends For {
      constructor(varKind, name, from, to) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.from = from;
        this.to = to;
      }
      render(opts) {
        const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind;
        const { name, from, to } = this;
        return `for(${varKind} ${name}=${from}; ${name}<${to}; ${name}++)` + super.render(opts);
      }
      get names() {
        const names = addExprNames(super.names, this.from);
        return addExprNames(names, this.to);
      }
    };
    var ForIter = class extends For {
      constructor(loop, varKind, name, iterable) {
        super();
        this.loop = loop;
        this.varKind = varKind;
        this.name = name;
        this.iterable = iterable;
      }
      render(opts) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
      }
      optimizeNames(names, constants) {
        if (!super.optimizeNames(names, constants))
          return;
        this.iterable = optimizeExpr(this.iterable, names, constants);
        return this;
      }
      get names() {
        return addNames(super.names, this.iterable.names);
      }
    };
    var Func = class extends BlockNode {
      constructor(name, args, async) {
        super();
        this.name = name;
        this.args = args;
        this.async = async;
      }
      render(opts) {
        const _async = this.async ? "async " : "";
        return `${_async}function ${this.name}(${this.args})` + super.render(opts);
      }
    };
    Func.kind = "func";
    var Return = class extends ParentNode {
      render(opts) {
        return "return " + super.render(opts);
      }
    };
    Return.kind = "return";
    var Try = class extends BlockNode {
      render(opts) {
        let code = "try" + super.render(opts);
        if (this.catch)
          code += this.catch.render(opts);
        if (this.finally)
          code += this.finally.render(opts);
        return code;
      }
      optimizeNodes() {
        var _a, _b;
        super.optimizeNodes();
        (_a = this.catch) === null || _a === void 0 ? void 0 : _a.optimizeNodes();
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNodes();
        return this;
      }
      optimizeNames(names, constants) {
        var _a, _b;
        super.optimizeNames(names, constants);
        (_a = this.catch) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNames(names, constants);
        return this;
      }
      get names() {
        const names = super.names;
        if (this.catch)
          addNames(names, this.catch.names);
        if (this.finally)
          addNames(names, this.finally.names);
        return names;
      }
    };
    var Catch = class extends BlockNode {
      constructor(error) {
        super();
        this.error = error;
      }
      render(opts) {
        return `catch(${this.error})` + super.render(opts);
      }
    };
    Catch.kind = "catch";
    var Finally = class extends BlockNode {
      render(opts) {
        return "finally" + super.render(opts);
      }
    };
    Finally.kind = "finally";
    var CodeGen = class {
      constructor(extScope, opts = {}) {
        this._values = {};
        this._blockStarts = [];
        this._constants = {};
        this.opts = { ...opts, _n: opts.lines ? "\n" : "" };
        this._extScope = extScope;
        this._scope = new scope_1.Scope({ parent: extScope });
        this._nodes = [new Root()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(prefix) {
        return this._scope.name(prefix);
      }
      // reserves unique name in the external scope
      scopeName(prefix) {
        return this._extScope.name(prefix);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(prefixOrName, value) {
        const name = this._extScope.value(prefixOrName, value);
        const vs = this._values[name.prefix] || (this._values[name.prefix] = /* @__PURE__ */ new Set());
        vs.add(name);
        return name;
      }
      getScopeValue(prefix, keyOrRef) {
        return this._extScope.getValue(prefix, keyOrRef);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(scopeName) {
        return this._extScope.scopeRefs(scopeName, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(varKind, nameOrPrefix, rhs, constant) {
        const name = this._scope.toName(nameOrPrefix);
        if (rhs !== void 0 && constant)
          this._constants[name.str] = rhs;
        this._leafNode(new Def(varKind, name, rhs));
        return name;
      }
      // `const` declaration (`var` in es5 mode)
      const(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
      }
      // `var` declaration with optional assignment
      var(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
      }
      // assignment code
      assign(lhs, rhs, sideEffects) {
        return this._leafNode(new Assign(lhs, rhs, sideEffects));
      }
      // `+=` code
      add(lhs, rhs) {
        return this._leafNode(new AssignOp(lhs, exports.operators.ADD, rhs));
      }
      // appends passed SafeExpr to code or executes Block
      code(c) {
        if (typeof c == "function")
          c();
        else if (c !== code_1.nil)
          this._leafNode(new AnyCode(c));
        return this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...keyValues) {
        const code = ["{"];
        for (const [key, value] of keyValues) {
          if (code.length > 1)
            code.push(",");
          code.push(key);
          if (key !== value || this.opts.es5) {
            code.push(":");
            (0, code_1.addCodeArg)(code, value);
          }
        }
        code.push("}");
        return new code_1._Code(code);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(condition, thenBody, elseBody) {
        this._blockNode(new If(condition));
        if (thenBody && elseBody) {
          this.code(thenBody).else().code(elseBody).endIf();
        } else if (thenBody) {
          this.code(thenBody).endIf();
        } else if (elseBody) {
          throw new Error('CodeGen: "else" body without "then" body');
        }
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(condition) {
        return this._elseNode(new If(condition));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new Else());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(If, Else);
      }
      _for(node, forBody) {
        this._blockNode(node);
        if (forBody)
          this.code(forBody).endFor();
        return this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(iteration, forBody) {
        return this._for(new ForLoop(iteration), forBody);
      }
      // `for` statement for a range of values
      forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForRange(varKind, name, from, to), () => forBody(name));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
        const name = this._scope.toName(nameOrPrefix);
        if (this.opts.es5) {
          const arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
          return this.forRange("_i", 0, (0, code_1._)`${arr}.length`, (i) => {
            this.var(name, (0, code_1._)`${arr}[${i}]`);
            forBody(name);
          });
        }
        return this._for(new ForIter("of", varKind, name, iterable), () => forBody(name));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(nameOrPrefix, obj2, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
        if (this.opts.ownProperties) {
          return this.forOf(nameOrPrefix, (0, code_1._)`Object.keys(${obj2})`, forBody);
        }
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForIter("in", varKind, name, obj2), () => forBody(name));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(For);
      }
      // `label` statement
      label(label) {
        return this._leafNode(new Label(label));
      }
      // `break` statement
      break(label) {
        return this._leafNode(new Break(label));
      }
      // `return` statement
      return(value) {
        const node = new Return();
        this._blockNode(node);
        this.code(value);
        if (node.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(Return);
      }
      // `try` statement
      try(tryBody, catchCode, finallyCode) {
        if (!catchCode && !finallyCode)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const node = new Try();
        this._blockNode(node);
        this.code(tryBody);
        if (catchCode) {
          const error = this.name("e");
          this._currNode = node.catch = new Catch(error);
          catchCode(error);
        }
        if (finallyCode) {
          this._currNode = node.finally = new Finally();
          this.code(finallyCode);
        }
        return this._endBlockNode(Catch, Finally);
      }
      // `throw` statement
      throw(error) {
        return this._leafNode(new Throw(error));
      }
      // start self-balancing block
      block(body, nodeCount) {
        this._blockStarts.push(this._nodes.length);
        if (body)
          this.code(body).endBlock(nodeCount);
        return this;
      }
      // end the current self-balancing block
      endBlock(nodeCount) {
        const len = this._blockStarts.pop();
        if (len === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const toClose = this._nodes.length - len;
        if (toClose < 0 || nodeCount !== void 0 && toClose !== nodeCount) {
          throw new Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
        }
        this._nodes.length = len;
        return this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(name, args = code_1.nil, async, funcBody) {
        this._blockNode(new Func(name, args, async));
        if (funcBody)
          this.code(funcBody).endFunc();
        return this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(Func);
      }
      optimize(n = 1) {
        while (n-- > 0) {
          this._root.optimizeNodes();
          this._root.optimizeNames(this._root.names, this._constants);
        }
      }
      _leafNode(node) {
        this._currNode.nodes.push(node);
        return this;
      }
      _blockNode(node) {
        this._currNode.nodes.push(node);
        this._nodes.push(node);
      }
      _endBlockNode(N1, N2) {
        const n = this._currNode;
        if (n instanceof N1 || N2 && n instanceof N2) {
          this._nodes.pop();
          return this;
        }
        throw new Error(`CodeGen: not in block "${N2 ? `${N1.kind}/${N2.kind}` : N1.kind}"`);
      }
      _elseNode(node) {
        const n = this._currNode;
        if (!(n instanceof If)) {
          throw new Error('CodeGen: "else" without "if"');
        }
        this._currNode = n.else = node;
        return this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const ns = this._nodes;
        return ns[ns.length - 1];
      }
      set _currNode(node) {
        const ns = this._nodes;
        ns[ns.length - 1] = node;
      }
    };
    exports.CodeGen = CodeGen;
    function addNames(names, from) {
      for (const n in from)
        names[n] = (names[n] || 0) + (from[n] || 0);
      return names;
    }
    function addExprNames(names, from) {
      return from instanceof code_1._CodeOrName ? addNames(names, from.names) : names;
    }
    function optimizeExpr(expr, names, constants) {
      if (expr instanceof code_1.Name)
        return replaceName(expr);
      if (!canOptimize(expr))
        return expr;
      return new code_1._Code(expr._items.reduce((items, c) => {
        if (c instanceof code_1.Name)
          c = replaceName(c);
        if (c instanceof code_1._Code)
          items.push(...c._items);
        else
          items.push(c);
        return items;
      }, []));
      function replaceName(n) {
        const c = constants[n.str];
        if (c === void 0 || names[n.str] !== 1)
          return n;
        delete names[n.str];
        return c;
      }
      function canOptimize(e) {
        return e instanceof code_1._Code && e._items.some((c) => c instanceof code_1.Name && names[c.str] === 1 && constants[c.str] !== void 0);
      }
    }
    function subtractNames(names, from) {
      for (const n in from)
        names[n] = (names[n] || 0) - (from[n] || 0);
    }
    function not(x) {
      return typeof x == "boolean" || typeof x == "number" || x === null ? !x : (0, code_1._)`!${par(x)}`;
    }
    exports.not = not;
    var andCode = mappend(exports.operators.AND);
    function and(...args) {
      return args.reduce(andCode);
    }
    exports.and = and;
    var orCode = mappend(exports.operators.OR);
    function or(...args) {
      return args.reduce(orCode);
    }
    exports.or = or;
    function mappend(op) {
      return (x, y) => x === code_1.nil ? y : y === code_1.nil ? x : (0, code_1._)`${par(x)} ${op} ${par(y)}`;
    }
    function par(x) {
      return x instanceof code_1.Name ? x : (0, code_1._)`(${x})`;
    }
  }
});

// packages/contracts/node_modules/ajv/dist/compile/util.js
var require_util = __commonJS({
  "packages/contracts/node_modules/ajv/dist/compile/util.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.checkStrictMode = exports.getErrorPath = exports.Type = exports.useFunc = exports.setEvaluated = exports.evaluatedPropsToName = exports.mergeEvaluated = exports.eachItem = exports.unescapeJsonPointer = exports.escapeJsonPointer = exports.escapeFragment = exports.unescapeFragment = exports.schemaRefOrVal = exports.schemaHasRulesButRef = exports.schemaHasRules = exports.checkUnknownRules = exports.alwaysValidSchema = exports.toHash = void 0;
    var codegen_1 = require_codegen();
    var code_1 = require_code();
    function toHash(arr) {
      const hash = {};
      for (const item of arr)
        hash[item] = true;
      return hash;
    }
    exports.toHash = toHash;
    function alwaysValidSchema(it, schema) {
      if (typeof schema == "boolean")
        return schema;
      if (Object.keys(schema).length === 0)
        return true;
      checkUnknownRules(it, schema);
      return !schemaHasRules(schema, it.self.RULES.all);
    }
    exports.alwaysValidSchema = alwaysValidSchema;
    function checkUnknownRules(it, schema = it.schema) {
      const { opts, self } = it;
      if (!opts.strictSchema)
        return;
      if (typeof schema === "boolean")
        return;
      const rules = self.RULES.keywords;
      for (const key in schema) {
        if (!rules[key])
          checkStrictMode(it, `unknown keyword: "${key}"`);
      }
    }
    exports.checkUnknownRules = checkUnknownRules;
    function schemaHasRules(schema, rules) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (rules[key])
          return true;
      return false;
    }
    exports.schemaHasRules = schemaHasRules;
    function schemaHasRulesButRef(schema, RULES) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (key !== "$ref" && RULES.all[key])
          return true;
      return false;
    }
    exports.schemaHasRulesButRef = schemaHasRulesButRef;
    function schemaRefOrVal({ topSchemaRef, schemaPath }, schema, keyword, $data) {
      if (!$data) {
        if (typeof schema == "number" || typeof schema == "boolean")
          return schema;
        if (typeof schema == "string")
          return (0, codegen_1._)`${schema}`;
      }
      return (0, codegen_1._)`${topSchemaRef}${schemaPath}${(0, codegen_1.getProperty)(keyword)}`;
    }
    exports.schemaRefOrVal = schemaRefOrVal;
    function unescapeFragment(str2) {
      return unescapeJsonPointer(decodeURIComponent(str2));
    }
    exports.unescapeFragment = unescapeFragment;
    function escapeFragment(str2) {
      return encodeURIComponent(escapeJsonPointer(str2));
    }
    exports.escapeFragment = escapeFragment;
    function escapeJsonPointer(str2) {
      if (typeof str2 == "number")
        return `${str2}`;
      return str2.replace(/~/g, "~0").replace(/\//g, "~1");
    }
    exports.escapeJsonPointer = escapeJsonPointer;
    function unescapeJsonPointer(str2) {
      return str2.replace(/~1/g, "/").replace(/~0/g, "~");
    }
    exports.unescapeJsonPointer = unescapeJsonPointer;
    function eachItem(xs, f) {
      if (Array.isArray(xs)) {
        for (const x of xs)
          f(x);
      } else {
        f(xs);
      }
    }
    exports.eachItem = eachItem;
    function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues, resultToName }) {
      return (gen, from, to, toName) => {
        const res = to === void 0 ? from : to instanceof codegen_1.Name ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to) : from instanceof codegen_1.Name ? (mergeToName(gen, to, from), from) : mergeValues(from, to);
        return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
      };
    }
    exports.mergeEvaluated = {
      props: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => {
          gen.if((0, codegen_1._)`${from} === true`, () => gen.assign(to, true), () => gen.assign(to, (0, codegen_1._)`${to} || {}`).code((0, codegen_1._)`Object.assign(${to}, ${from})`));
        }),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => {
          if (from === true) {
            gen.assign(to, true);
          } else {
            gen.assign(to, (0, codegen_1._)`${to} || {}`);
            setEvaluated(gen, to, from);
          }
        }),
        mergeValues: (from, to) => from === true ? true : { ...from, ...to },
        resultToName: evaluatedPropsToName
      }),
      items: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => gen.assign(to, (0, codegen_1._)`${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => gen.assign(to, from === true ? true : (0, codegen_1._)`${to} > ${from} ? ${to} : ${from}`)),
        mergeValues: (from, to) => from === true ? true : Math.max(from, to),
        resultToName: (gen, items) => gen.var("items", items)
      })
    };
    function evaluatedPropsToName(gen, ps) {
      if (ps === true)
        return gen.var("props", true);
      const props = gen.var("props", (0, codegen_1._)`{}`);
      if (ps !== void 0)
        setEvaluated(gen, props, ps);
      return props;
    }
    exports.evaluatedPropsToName = evaluatedPropsToName;
    function setEvaluated(gen, props, ps) {
      Object.keys(ps).forEach((p) => gen.assign((0, codegen_1._)`${props}${(0, codegen_1.getProperty)(p)}`, true));
    }
    exports.setEvaluated = setEvaluated;
    var snippets = {};
    function useFunc(gen, f) {
      return gen.scopeValue("func", {
        ref: f,
        code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code))
      });
    }
    exports.useFunc = useFunc;
    var Type;
    (function(Type2) {
      Type2[Type2["Num"] = 0] = "Num";
      Type2[Type2["Str"] = 1] = "Str";
    })(Type || (exports.Type = Type = {}));
    function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
      if (dataProp instanceof codegen_1.Name) {
        const isNumber = dataPropType === Type.Num;
        return jsPropertySyntax ? isNumber ? (0, codegen_1._)`"[" + ${dataProp} + "]"` : (0, codegen_1._)`"['" + ${dataProp} + "']"` : isNumber ? (0, codegen_1._)`"/" + ${dataProp}` : (0, codegen_1._)`"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
      }
      return jsPropertySyntax ? (0, codegen_1.getProperty)(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
    }
    exports.getErrorPath = getErrorPath;
    function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
      if (!mode)
        return;
      msg = `strict mode: ${msg}`;
      if (mode === true)
        throw new Error(msg);
      it.self.logger.warn(msg);
    }
    exports.checkStrictMode = checkStrictMode;
  }
});

// packages/contracts/node_modules/ajv/dist/compile/names.js
var require_names = __commonJS({
  "packages/contracts/node_modules/ajv/dist/compile/names.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var names = {
      // validation function arguments
      data: new codegen_1.Name("data"),
      // data passed to validation function
      // args passed from referencing schema
      valCxt: new codegen_1.Name("valCxt"),
      // validation/data context - should not be used directly, it is destructured to the names below
      instancePath: new codegen_1.Name("instancePath"),
      parentData: new codegen_1.Name("parentData"),
      parentDataProperty: new codegen_1.Name("parentDataProperty"),
      rootData: new codegen_1.Name("rootData"),
      // root data - same as the data passed to the first/top validation function
      dynamicAnchors: new codegen_1.Name("dynamicAnchors"),
      // used to support recursiveRef and dynamicRef
      // function scoped variables
      vErrors: new codegen_1.Name("vErrors"),
      // null or array of validation errors
      errors: new codegen_1.Name("errors"),
      // counter of validation errors
      this: new codegen_1.Name("this"),
      // "globals"
      self: new codegen_1.Name("self"),
      scope: new codegen_1.Name("scope"),
      // JTD serialize/parse name for JSON string and position
      json: new codegen_1.Name("json"),
      jsonPos: new codegen_1.Name("jsonPos"),
      jsonLen: new codegen_1.Name("jsonLen"),
      jsonPart: new codegen_1.Name("jsonPart")
    };
    exports.default = names;
  }
});

// packages/contracts/node_modules/ajv/dist/compile/errors.js
var require_errors = __commonJS({
  "packages/contracts/node_modules/ajv/dist/compile/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendErrors = exports.resetErrorsCount = exports.reportExtraError = exports.reportError = exports.keyword$DataError = exports.keywordError = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    exports.keywordError = {
      message: ({ keyword }) => (0, codegen_1.str)`must pass "${keyword}" keyword validation`
    };
    exports.keyword$DataError = {
      message: ({ keyword, schemaType }) => schemaType ? (0, codegen_1.str)`"${keyword}" keyword must be ${schemaType} ($data)` : (0, codegen_1.str)`"${keyword}" keyword is invalid ($data)`
    };
    function reportError(cxt, error = exports.keywordError, errorPaths, overrideAllErrors) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error, errorPaths);
      if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : compositeRule || allErrors) {
        addError(gen, errObj);
      } else {
        returnErrors(it, (0, codegen_1._)`[${errObj}]`);
      }
    }
    exports.reportError = reportError;
    function reportExtraError(cxt, error = exports.keywordError, errorPaths) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error, errorPaths);
      addError(gen, errObj);
      if (!(compositeRule || allErrors)) {
        returnErrors(it, names_1.default.vErrors);
      }
    }
    exports.reportExtraError = reportExtraError;
    function resetErrorsCount(gen, errsCount) {
      gen.assign(names_1.default.errors, errsCount);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign((0, codegen_1._)`${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
    }
    exports.resetErrorsCount = resetErrorsCount;
    function extendErrors({ gen, keyword, schemaValue, data, errsCount, it }) {
      if (errsCount === void 0)
        throw new Error("ajv implementation error");
      const err = gen.name("err");
      gen.forRange("i", errsCount, names_1.default.errors, (i) => {
        gen.const(err, (0, codegen_1._)`${names_1.default.vErrors}[${i}]`);
        gen.if((0, codegen_1._)`${err}.instancePath === undefined`, () => gen.assign((0, codegen_1._)`${err}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath)));
        gen.assign((0, codegen_1._)`${err}.schemaPath`, (0, codegen_1.str)`${it.errSchemaPath}/${keyword}`);
        if (it.opts.verbose) {
          gen.assign((0, codegen_1._)`${err}.schema`, schemaValue);
          gen.assign((0, codegen_1._)`${err}.data`, data);
        }
      });
    }
    exports.extendErrors = extendErrors;
    function addError(gen, errObj) {
      const err = gen.const("err", errObj);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, (0, codegen_1._)`[${err}]`), (0, codegen_1._)`${names_1.default.vErrors}.push(${err})`);
      gen.code((0, codegen_1._)`${names_1.default.errors}++`);
    }
    function returnErrors(it, errs) {
      const { gen, validateName, schemaEnv } = it;
      if (schemaEnv.$async) {
        gen.throw((0, codegen_1._)`new ${it.ValidationError}(${errs})`);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, errs);
        gen.return(false);
      }
    }
    var E = {
      keyword: new codegen_1.Name("keyword"),
      schemaPath: new codegen_1.Name("schemaPath"),
      // also used in JTD errors
      params: new codegen_1.Name("params"),
      propertyName: new codegen_1.Name("propertyName"),
      message: new codegen_1.Name("message"),
      schema: new codegen_1.Name("schema"),
      parentSchema: new codegen_1.Name("parentSchema")
    };
    function errorObjectCode(cxt, error, errorPaths) {
      const { createErrors } = cxt.it;
      if (createErrors === false)
        return (0, codegen_1._)`{}`;
      return errorObject(cxt, error, errorPaths);
    }
    function errorObject(cxt, error, errorPaths = {}) {
      const { gen, it } = cxt;
      const keyValues = [
        errorInstancePath(it, errorPaths),
        errorSchemaPath(cxt, errorPaths)
      ];
      extraErrorProps(cxt, error, keyValues);
      return gen.object(...keyValues);
    }
    function errorInstancePath({ errorPath }, { instancePath }) {
      const instPath = instancePath ? (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}` : errorPath;
      return [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)];
    }
    function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
      let schPath = parentSchema ? errSchemaPath : (0, codegen_1.str)`${errSchemaPath}/${keyword}`;
      if (schemaPath) {
        schPath = (0, codegen_1.str)`${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
      }
      return [E.schemaPath, schPath];
    }
    function extraErrorProps(cxt, { params, message }, keyValues) {
      const { keyword, data, schemaValue, it } = cxt;
      const { opts, propertyName, topSchemaRef, schemaPath } = it;
      keyValues.push([E.keyword, keyword], [E.params, typeof params == "function" ? params(cxt) : params || (0, codegen_1._)`{}`]);
      if (opts.messages) {
        keyValues.push([E.message, typeof message == "function" ? message(cxt) : message]);
      }
      if (opts.verbose) {
        keyValues.push([E.schema, schemaValue], [E.parentSchema, (0, codegen_1._)`${topSchemaRef}${schemaPath}`], [names_1.default.data, data]);
      }
      if (propertyName)
        keyValues.push([E.propertyName, propertyName]);
    }
  }
});

// packages/contracts/node_modules/ajv/dist/compile/validate/boolSchema.js
var require_boolSchema = __commonJS({
  "packages/contracts/node_modules/ajv/dist/compile/validate/boolSchema.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = void 0;
    var errors_1 = require_errors();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var boolError = {
      message: "boolean schema is false"
    };
    function topBoolOrEmptySchema(it) {
      const { gen, schema, validateName } = it;
      if (schema === false) {
        falseSchemaError(it, false);
      } else if (typeof schema == "object" && schema.$async === true) {
        gen.return(names_1.default.data);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, null);
        gen.return(true);
      }
    }
    exports.topBoolOrEmptySchema = topBoolOrEmptySchema;
    function boolOrEmptySchema(it, valid) {
      const { gen, schema } = it;
      if (schema === false) {
        gen.var(valid, false);
        falseSchemaError(it);
      } else {
        gen.var(valid, true);
      }
    }
    exports.boolOrEmptySchema = boolOrEmptySchema;
    function falseSchemaError(it, overrideAllErrors) {
      const { gen, data } = it;
      const cxt = {
        gen,
        keyword: "false schema",
        data,
        schema: false,
        schemaCode: false,
        schemaValue: false,
        params: {},
        it
      };
      (0, errors_1.reportError)(cxt, boolError, void 0, overrideAllErrors);
    }
  }
});

// packages/contracts/node_modules/ajv/dist/compile/rules.js
var require_rules = __commonJS({
  "packages/contracts/node_modules/ajv/dist/compile/rules.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRules = exports.isJSONType = void 0;
    var _jsonTypes = ["string", "number", "integer", "boolean", "null", "object", "array"];
    var jsonTypes = new Set(_jsonTypes);
    function isJSONType(x) {
      return typeof x == "string" && jsonTypes.has(x);
    }
    exports.isJSONType = isJSONType;
    function getRules() {
      const groups = {
        number: { type: "number", rules: [] },
        string: { type: "string", rules: [] },
        array: { type: "array", rules: [] },
        object: { type: "object", rules: [] }
      };
      return {
        types: { ...groups, integer: true, boolean: true, null: true },
        rules: [{ rules: [] }, groups.number, groups.string, groups.array, groups.object],
        post: { rules: [] },
        all: {},
        keywords: {}
      };
    }
    exports.getRules = getRules;
  }
});

// packages/contracts/node_modules/ajv/dist/compile/validate/applicability.js
var require_applicability = __commonJS({
  "packages/contracts/node_modules/ajv/dist/compile/validate/applicability.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.shouldUseRule = exports.shouldUseGroup = exports.schemaHasRulesForType = void 0;
    function schemaHasRulesForType({ schema, self }, type) {
      const group = self.RULES.types[type];
      return group && group !== true && shouldUseGroup(schema, group);
    }
    exports.schemaHasRulesForType = schemaHasRulesForType;
    function shouldUseGroup(schema, group) {
      return group.rules.some((rule) => shouldUseRule(schema, rule));
    }
    exports.shouldUseGroup = shouldUseGroup;
    function shouldUseRule(schema, rule) {
      var _a;
      return schema[rule.keyword] !== void 0 || ((_a = rule.definition.implements) === null || _a === void 0 ? void 0 : _a.some((kwd) => schema[kwd] !== void 0));
    }
    exports.shouldUseRule = shouldUseRule;
  }
});

// packages/contracts/node_modules/ajv/dist/compile/validate/dataType.js
var require_dataType = __commonJS({
  "packages/contracts/node_modules/ajv/dist/compile/validate/dataType.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
    var rules_1 = require_rules();
    var applicability_1 = require_applicability();
    var errors_1 = require_errors();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var DataType;
    (function(DataType2) {
      DataType2[DataType2["Correct"] = 0] = "Correct";
      DataType2[DataType2["Wrong"] = 1] = "Wrong";
    })(DataType || (exports.DataType = DataType = {}));
    function getSchemaTypes(schema) {
      const types = getJSONTypes(schema.type);
      const hasNull = types.includes("null");
      if (hasNull) {
        if (schema.nullable === false)
          throw new Error("type: null contradicts nullable: false");
      } else {
        if (!types.length && schema.nullable !== void 0) {
          throw new Error('"nullable" cannot be used without "type"');
        }
        if (schema.nullable === true)
          types.push("null");
      }
      return types;
    }
    exports.getSchemaTypes = getSchemaTypes;
    function getJSONTypes(ts) {
      const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
      if (types.every(rules_1.isJSONType))
        return types;
      throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
    }
    exports.getJSONTypes = getJSONTypes;
    function coerceAndCheckDataType(it, types) {
      const { gen, data, opts } = it;
      const coerceTo = coerceToTypes(types, opts.coerceTypes);
      const checkTypes = types.length > 0 && !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
      if (checkTypes) {
        const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
        gen.if(wrongType, () => {
          if (coerceTo.length)
            coerceData(it, types, coerceTo);
          else
            reportTypeError(it);
        });
      }
      return checkTypes;
    }
    exports.coerceAndCheckDataType = coerceAndCheckDataType;
    var COERCIBLE = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
    function coerceToTypes(types, coerceTypes) {
      return coerceTypes ? types.filter((t) => COERCIBLE.has(t) || coerceTypes === "array" && t === "array") : [];
    }
    function coerceData(it, types, coerceTo) {
      const { gen, data, opts } = it;
      const dataType = gen.let("dataType", (0, codegen_1._)`typeof ${data}`);
      const coerced = gen.let("coerced", (0, codegen_1._)`undefined`);
      if (opts.coerceTypes === "array") {
        gen.if((0, codegen_1._)`${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen.assign(data, (0, codegen_1._)`${data}[0]`).assign(dataType, (0, codegen_1._)`typeof ${data}`).if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
      }
      gen.if((0, codegen_1._)`${coerced} !== undefined`);
      for (const t of coerceTo) {
        if (COERCIBLE.has(t) || t === "array" && opts.coerceTypes === "array") {
          coerceSpecificType(t);
        }
      }
      gen.else();
      reportTypeError(it);
      gen.endIf();
      gen.if((0, codegen_1._)`${coerced} !== undefined`, () => {
        gen.assign(data, coerced);
        assignParentData(it, coerced);
      });
      function coerceSpecificType(t) {
        switch (t) {
          case "string":
            gen.elseIf((0, codegen_1._)`${dataType} == "number" || ${dataType} == "boolean"`).assign(coerced, (0, codegen_1._)`"" + ${data}`).elseIf((0, codegen_1._)`${data} === null`).assign(coerced, (0, codegen_1._)`""`);
            return;
          case "number":
            gen.elseIf((0, codegen_1._)`${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`).assign(coerced, (0, codegen_1._)`+${data}`);
            return;
          case "integer":
            gen.elseIf((0, codegen_1._)`${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`).assign(coerced, (0, codegen_1._)`+${data}`);
            return;
          case "boolean":
            gen.elseIf((0, codegen_1._)`${data} === "false" || ${data} === 0 || ${data} === null`).assign(coerced, false).elseIf((0, codegen_1._)`${data} === "true" || ${data} === 1`).assign(coerced, true);
            return;
          case "null":
            gen.elseIf((0, codegen_1._)`${data} === "" || ${data} === 0 || ${data} === false`);
            gen.assign(coerced, null);
            return;
          case "array":
            gen.elseIf((0, codegen_1._)`${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`).assign(coerced, (0, codegen_1._)`[${data}]`);
        }
      }
    }
    function assignParentData({ gen, parentData, parentDataProperty }, expr) {
      gen.if((0, codegen_1._)`${parentData} !== undefined`, () => gen.assign((0, codegen_1._)`${parentData}[${parentDataProperty}]`, expr));
    }
    function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
      const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
      let cond;
      switch (dataType) {
        case "null":
          return (0, codegen_1._)`${data} ${EQ} null`;
        case "array":
          cond = (0, codegen_1._)`Array.isArray(${data})`;
          break;
        case "object":
          cond = (0, codegen_1._)`${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
          break;
        case "integer":
          cond = numCond((0, codegen_1._)`!(${data} % 1) && !isNaN(${data})`);
          break;
        case "number":
          cond = numCond();
          break;
        default:
          return (0, codegen_1._)`typeof ${data} ${EQ} ${dataType}`;
      }
      return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
      function numCond(_cond = codegen_1.nil) {
        return (0, codegen_1.and)((0, codegen_1._)`typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._)`isFinite(${data})` : codegen_1.nil);
      }
    }
    exports.checkDataType = checkDataType;
    function checkDataTypes(dataTypes, data, strictNums, correct) {
      if (dataTypes.length === 1) {
        return checkDataType(dataTypes[0], data, strictNums, correct);
      }
      let cond;
      const types = (0, util_1.toHash)(dataTypes);
      if (types.array && types.object) {
        const notObj = (0, codegen_1._)`typeof ${data} != "object"`;
        cond = types.null ? notObj : (0, codegen_1._)`!${data} || ${notObj}`;
        delete types.null;
        delete types.array;
        delete types.object;
      } else {
        cond = codegen_1.nil;
      }
      if (types.number)
        delete types.integer;
      for (const t in types)
        cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
      return cond;
    }
    exports.checkDataTypes = checkDataTypes;
    var typeError = {
      message: ({ schema }) => `must be ${schema}`,
      params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._)`{type: ${schema}}` : (0, codegen_1._)`{type: ${schemaValue}}`
    };
    function reportTypeError(it) {
      const cxt = getTypeErrorContext(it);
      (0, errors_1.reportError)(cxt, typeError);
    }
    exports.reportTypeError = reportTypeError;
    function getTypeErrorContext(it) {
      const { gen, data, schema } = it;
      const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
      return {
        gen,
        keyword: "type",
        data,
        schema: schema.type,
        schemaCode,
        schemaValue: schemaCode,
        parentSchema: schema,
        params: {},
        it
      };
    }
  }
});

// packages/contracts/node_modules/ajv/dist/compile/validate/defaults.js
var require_defaults = __commonJS({
  "packages/contracts/node_modules/ajv/dist/compile/validate/defaults.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assignDefaults = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    function assignDefaults(it, ty) {
      const { properties, items } = it.schema;
      if (ty === "object" && properties) {
        for (const key in properties) {
          assignDefault(it, key, properties[key].default);
        }
      } else if (ty === "array" && Array.isArray(items)) {
        items.forEach((sch, i) => assignDefault(it, i, sch.default));
      }
    }
    exports.assignDefaults = assignDefaults;
    function assignDefault(it, prop, defaultValue) {
      const { gen, compositeRule, data, opts } = it;
      if (defaultValue === void 0)
        return;
      const childData = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(prop)}`;
      if (compositeRule) {
        (0, util_1.checkStrictMode)(it, `default is ignored for: ${childData}`);
        return;
      }
      let condition = (0, codegen_1._)`${childData} === undefined`;
      if (opts.useDefaults === "empty") {
        condition = (0, codegen_1._)`${condition} || ${childData} === null || ${childData} === ""`;
      }
      gen.if(condition, (0, codegen_1._)`${childData} = ${(0, codegen_1.stringify)(defaultValue)}`);
    }
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/code.js
var require_code2 = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/code.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateUnion = exports.validateArray = exports.usePattern = exports.callValidateCode = exports.schemaProperties = exports.allSchemaProperties = exports.noPropertyInData = exports.propertyInData = exports.isOwnProperty = exports.hasPropFunc = exports.reportMissingProp = exports.checkMissingProp = exports.checkReportMissingProp = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    var util_2 = require_util();
    function checkReportMissingProp(cxt, prop) {
      const { gen, data, it } = cxt;
      gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
        cxt.setParams({ missingProperty: (0, codegen_1._)`${prop}` }, true);
        cxt.error();
      });
    }
    exports.checkReportMissingProp = checkReportMissingProp;
    function checkMissingProp({ gen, data, it: { opts } }, properties, missing) {
      return (0, codegen_1.or)(...properties.map((prop) => (0, codegen_1.and)(noPropertyInData(gen, data, prop, opts.ownProperties), (0, codegen_1._)`${missing} = ${prop}`)));
    }
    exports.checkMissingProp = checkMissingProp;
    function reportMissingProp(cxt, missing) {
      cxt.setParams({ missingProperty: missing }, true);
      cxt.error();
    }
    exports.reportMissingProp = reportMissingProp;
    function hasPropFunc(gen) {
      return gen.scopeValue("func", {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        ref: Object.prototype.hasOwnProperty,
        code: (0, codegen_1._)`Object.prototype.hasOwnProperty`
      });
    }
    exports.hasPropFunc = hasPropFunc;
    function isOwnProperty(gen, data, property) {
      return (0, codegen_1._)`${hasPropFunc(gen)}.call(${data}, ${property})`;
    }
    exports.isOwnProperty = isOwnProperty;
    function propertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} !== undefined`;
      return ownProperties ? (0, codegen_1._)`${cond} && ${isOwnProperty(gen, data, property)}` : cond;
    }
    exports.propertyInData = propertyInData;
    function noPropertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} === undefined`;
      return ownProperties ? (0, codegen_1.or)(cond, (0, codegen_1.not)(isOwnProperty(gen, data, property))) : cond;
    }
    exports.noPropertyInData = noPropertyInData;
    function allSchemaProperties(schemaMap) {
      return schemaMap ? Object.keys(schemaMap).filter((p) => p !== "__proto__") : [];
    }
    exports.allSchemaProperties = allSchemaProperties;
    function schemaProperties(it, schemaMap) {
      return allSchemaProperties(schemaMap).filter((p) => !(0, util_1.alwaysValidSchema)(it, schemaMap[p]));
    }
    exports.schemaProperties = schemaProperties;
    function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it }, func, context, passSchema) {
      const dataAndSchema = passSchema ? (0, codegen_1._)`${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data;
      const valCxt = [
        [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath)],
        [names_1.default.parentData, it.parentData],
        [names_1.default.parentDataProperty, it.parentDataProperty],
        [names_1.default.rootData, names_1.default.rootData]
      ];
      if (it.opts.dynamicRef)
        valCxt.push([names_1.default.dynamicAnchors, names_1.default.dynamicAnchors]);
      const args = (0, codegen_1._)`${dataAndSchema}, ${gen.object(...valCxt)}`;
      return context !== codegen_1.nil ? (0, codegen_1._)`${func}.call(${context}, ${args})` : (0, codegen_1._)`${func}(${args})`;
    }
    exports.callValidateCode = callValidateCode;
    var newRegExp = (0, codegen_1._)`new RegExp`;
    function usePattern({ gen, it: { opts } }, pattern) {
      const u = opts.unicodeRegExp ? "u" : "";
      const { regExp } = opts.code;
      const rx = regExp(pattern, u);
      return gen.scopeValue("pattern", {
        key: rx.toString(),
        ref: rx,
        code: (0, codegen_1._)`${regExp.code === "new RegExp" ? newRegExp : (0, util_2.useFunc)(gen, regExp)}(${pattern}, ${u})`
      });
    }
    exports.usePattern = usePattern;
    function validateArray(cxt) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      if (it.allErrors) {
        const validArr = gen.let("valid", true);
        validateItems(() => gen.assign(validArr, false));
        return validArr;
      }
      gen.var(valid, true);
      validateItems(() => gen.break());
      return valid;
      function validateItems(notValid) {
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        gen.forRange("i", 0, len, (i) => {
          cxt.subschema({
            keyword,
            dataProp: i,
            dataPropType: util_1.Type.Num
          }, valid);
          gen.if((0, codegen_1.not)(valid), notValid);
        });
      }
    }
    exports.validateArray = validateArray;
    function validateUnion(cxt) {
      const { gen, schema, keyword, it } = cxt;
      if (!Array.isArray(schema))
        throw new Error("ajv implementation error");
      const alwaysValid = schema.some((sch) => (0, util_1.alwaysValidSchema)(it, sch));
      if (alwaysValid && !it.opts.unevaluated)
        return;
      const valid = gen.let("valid", false);
      const schValid = gen.name("_valid");
      gen.block(() => schema.forEach((_sch, i) => {
        const schCxt = cxt.subschema({
          keyword,
          schemaProp: i,
          compositeRule: true
        }, schValid);
        gen.assign(valid, (0, codegen_1._)`${valid} || ${schValid}`);
        const merged = cxt.mergeValidEvaluated(schCxt, schValid);
        if (!merged)
          gen.if((0, codegen_1.not)(valid));
      }));
      cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
    }
    exports.validateUnion = validateUnion;
  }
});

// packages/contracts/node_modules/ajv/dist/compile/validate/keyword.js
var require_keyword = __commonJS({
  "packages/contracts/node_modules/ajv/dist/compile/validate/keyword.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateKeywordUsage = exports.validSchemaType = exports.funcKeywordCode = exports.macroKeywordCode = void 0;
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var code_1 = require_code2();
    var errors_1 = require_errors();
    function macroKeywordCode(cxt, def) {
      const { gen, keyword, schema, parentSchema, it } = cxt;
      const macroSchema = def.macro.call(it.self, schema, parentSchema, it);
      const schemaRef = useKeyword(gen, keyword, macroSchema);
      if (it.opts.validateSchema !== false)
        it.self.validateSchema(macroSchema, true);
      const valid = gen.name("valid");
      cxt.subschema({
        schema: macroSchema,
        schemaPath: codegen_1.nil,
        errSchemaPath: `${it.errSchemaPath}/${keyword}`,
        topSchemaRef: schemaRef,
        compositeRule: true
      }, valid);
      cxt.pass(valid, () => cxt.error(true));
    }
    exports.macroKeywordCode = macroKeywordCode;
    function funcKeywordCode(cxt, def) {
      var _a;
      const { gen, keyword, schema, parentSchema, $data, it } = cxt;
      checkAsyncKeyword(it, def);
      const validate = !$data && def.compile ? def.compile.call(it.self, schema, parentSchema, it) : def.validate;
      const validateRef = useKeyword(gen, keyword, validate);
      const valid = gen.let("valid");
      cxt.block$data(valid, validateKeyword);
      cxt.ok((_a = def.valid) !== null && _a !== void 0 ? _a : valid);
      function validateKeyword() {
        if (def.errors === false) {
          assignValid();
          if (def.modifying)
            modifyData(cxt);
          reportErrs(() => cxt.error());
        } else {
          const ruleErrs = def.async ? validateAsync() : validateSync();
          if (def.modifying)
            modifyData(cxt);
          reportErrs(() => addErrs(cxt, ruleErrs));
        }
      }
      function validateAsync() {
        const ruleErrs = gen.let("ruleErrs", null);
        gen.try(() => assignValid((0, codegen_1._)`await `), (e) => gen.assign(valid, false).if((0, codegen_1._)`${e} instanceof ${it.ValidationError}`, () => gen.assign(ruleErrs, (0, codegen_1._)`${e}.errors`), () => gen.throw(e)));
        return ruleErrs;
      }
      function validateSync() {
        const validateErrs = (0, codegen_1._)`${validateRef}.errors`;
        gen.assign(validateErrs, null);
        assignValid(codegen_1.nil);
        return validateErrs;
      }
      function assignValid(_await = def.async ? (0, codegen_1._)`await ` : codegen_1.nil) {
        const passCxt = it.opts.passContext ? names_1.default.this : names_1.default.self;
        const passSchema = !("compile" in def && !$data || def.schema === false);
        gen.assign(valid, (0, codegen_1._)`${_await}${(0, code_1.callValidateCode)(cxt, validateRef, passCxt, passSchema)}`, def.modifying);
      }
      function reportErrs(errors) {
        var _a2;
        gen.if((0, codegen_1.not)((_a2 = def.valid) !== null && _a2 !== void 0 ? _a2 : valid), errors);
      }
    }
    exports.funcKeywordCode = funcKeywordCode;
    function modifyData(cxt) {
      const { gen, data, it } = cxt;
      gen.if(it.parentData, () => gen.assign(data, (0, codegen_1._)`${it.parentData}[${it.parentDataProperty}]`));
    }
    function addErrs(cxt, errs) {
      const { gen } = cxt;
      gen.if((0, codegen_1._)`Array.isArray(${errs})`, () => {
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`).assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
        (0, errors_1.extendErrors)(cxt);
      }, () => cxt.error());
    }
    function checkAsyncKeyword({ schemaEnv }, def) {
      if (def.async && !schemaEnv.$async)
        throw new Error("async keyword in sync schema");
    }
    function useKeyword(gen, keyword, result) {
      if (result === void 0)
        throw new Error(`keyword "${keyword}" failed to compile`);
      return gen.scopeValue("keyword", typeof result == "function" ? { ref: result } : { ref: result, code: (0, codegen_1.stringify)(result) });
    }
    function validSchemaType(schema, schemaType, allowUndefined = false) {
      return !schemaType.length || schemaType.some((st) => st === "array" ? Array.isArray(schema) : st === "object" ? schema && typeof schema == "object" && !Array.isArray(schema) : typeof schema == st || allowUndefined && typeof schema == "undefined");
    }
    exports.validSchemaType = validSchemaType;
    function validateKeywordUsage({ schema, opts, self, errSchemaPath }, def, keyword) {
      if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) {
        throw new Error("ajv implementation error");
      }
      const deps = def.dependencies;
      if (deps === null || deps === void 0 ? void 0 : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema, kwd))) {
        throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
      }
      if (def.validateSchema) {
        const valid = def.validateSchema(schema[keyword]);
        if (!valid) {
          const msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` + self.errorsText(def.validateSchema.errors);
          if (opts.validateSchema === "log")
            self.logger.error(msg);
          else
            throw new Error(msg);
        }
      }
    }
    exports.validateKeywordUsage = validateKeywordUsage;
  }
});

// packages/contracts/node_modules/ajv/dist/compile/validate/subschema.js
var require_subschema = __commonJS({
  "packages/contracts/node_modules/ajv/dist/compile/validate/subschema.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendSubschemaMode = exports.extendSubschemaData = exports.getSubschema = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    function getSubschema(it, { keyword, schemaProp, schema, schemaPath, errSchemaPath, topSchemaRef }) {
      if (keyword !== void 0 && schema !== void 0) {
        throw new Error('both "keyword" and "schema" passed, only one allowed');
      }
      if (keyword !== void 0) {
        const sch = it.schema[keyword];
        return schemaProp === void 0 ? {
          schema: sch,
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}`
        } : {
          schema: sch[schemaProp],
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`
        };
      }
      if (schema !== void 0) {
        if (schemaPath === void 0 || errSchemaPath === void 0 || topSchemaRef === void 0) {
          throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
        }
        return {
          schema,
          schemaPath,
          topSchemaRef,
          errSchemaPath
        };
      }
      throw new Error('either "keyword" or "schema" must be passed');
    }
    exports.getSubschema = getSubschema;
    function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
      if (data !== void 0 && dataProp !== void 0) {
        throw new Error('both "data" and "dataProp" passed, only one allowed');
      }
      const { gen } = it;
      if (dataProp !== void 0) {
        const { errorPath, dataPathArr, opts } = it;
        const nextData = gen.let("data", (0, codegen_1._)`${it.data}${(0, codegen_1.getProperty)(dataProp)}`, true);
        dataContextProps(nextData);
        subschema.errorPath = (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`;
        subschema.parentDataProperty = (0, codegen_1._)`${dataProp}`;
        subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
      }
      if (data !== void 0) {
        const nextData = data instanceof codegen_1.Name ? data : gen.let("data", data, true);
        dataContextProps(nextData);
        if (propertyName !== void 0)
          subschema.propertyName = propertyName;
      }
      if (dataTypes)
        subschema.dataTypes = dataTypes;
      function dataContextProps(_nextData) {
        subschema.data = _nextData;
        subschema.dataLevel = it.dataLevel + 1;
        subschema.dataTypes = [];
        it.definedProperties = /* @__PURE__ */ new Set();
        subschema.parentData = it.data;
        subschema.dataNames = [...it.dataNames, _nextData];
      }
    }
    exports.extendSubschemaData = extendSubschemaData;
    function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
      if (compositeRule !== void 0)
        subschema.compositeRule = compositeRule;
      if (createErrors !== void 0)
        subschema.createErrors = createErrors;
      if (allErrors !== void 0)
        subschema.allErrors = allErrors;
      subschema.jtdDiscriminator = jtdDiscriminator;
      subschema.jtdMetadata = jtdMetadata;
    }
    exports.extendSubschemaMode = extendSubschemaMode;
  }
});

// node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = __commonJS({
  "node_modules/fast-deep-equal/index.js"(exports, module) {
    "use strict";
    module.exports = function equal(a, b) {
      if (a === b) return true;
      if (a && b && typeof a == "object" && typeof b == "object") {
        if (a.constructor !== b.constructor) return false;
        var length, i, keys;
        if (Array.isArray(a)) {
          length = a.length;
          if (length != b.length) return false;
          for (i = length; i-- !== 0; )
            if (!equal(a[i], b[i])) return false;
          return true;
        }
        if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false;
        for (i = length; i-- !== 0; )
          if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
        for (i = length; i-- !== 0; ) {
          var key = keys[i];
          if (!equal(a[key], b[key])) return false;
        }
        return true;
      }
      return a !== a && b !== b;
    };
  }
});

// packages/contracts/node_modules/json-schema-traverse/index.js
var require_json_schema_traverse = __commonJS({
  "packages/contracts/node_modules/json-schema-traverse/index.js"(exports, module) {
    "use strict";
    var traverse = module.exports = function(schema, opts, cb) {
      if (typeof opts == "function") {
        cb = opts;
        opts = {};
      }
      cb = opts.cb || cb;
      var pre = typeof cb == "function" ? cb : cb.pre || function() {
      };
      var post = cb.post || function() {
      };
      _traverse(opts, pre, post, schema, "", schema);
    };
    traverse.keywords = {
      additionalItems: true,
      items: true,
      contains: true,
      additionalProperties: true,
      propertyNames: true,
      not: true,
      if: true,
      then: true,
      else: true
    };
    traverse.arrayKeywords = {
      items: true,
      allOf: true,
      anyOf: true,
      oneOf: true
    };
    traverse.propsKeywords = {
      $defs: true,
      definitions: true,
      properties: true,
      patternProperties: true,
      dependencies: true
    };
    traverse.skipKeywords = {
      default: true,
      enum: true,
      const: true,
      required: true,
      maximum: true,
      minimum: true,
      exclusiveMaximum: true,
      exclusiveMinimum: true,
      multipleOf: true,
      maxLength: true,
      minLength: true,
      pattern: true,
      format: true,
      maxItems: true,
      minItems: true,
      uniqueItems: true,
      maxProperties: true,
      minProperties: true
    };
    function _traverse(opts, pre, post, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
      if (schema && typeof schema == "object" && !Array.isArray(schema)) {
        pre(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
        for (var key in schema) {
          var sch = schema[key];
          if (Array.isArray(sch)) {
            if (key in traverse.arrayKeywords) {
              for (var i = 0; i < sch.length; i++)
                _traverse(opts, pre, post, sch[i], jsonPtr + "/" + key + "/" + i, rootSchema, jsonPtr, key, schema, i);
            }
          } else if (key in traverse.propsKeywords) {
            if (sch && typeof sch == "object") {
              for (var prop in sch)
                _traverse(opts, pre, post, sch[prop], jsonPtr + "/" + key + "/" + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema, prop);
            }
          } else if (key in traverse.keywords || opts.allKeys && !(key in traverse.skipKeywords)) {
            _traverse(opts, pre, post, sch, jsonPtr + "/" + key, rootSchema, jsonPtr, key, schema);
          }
        }
        post(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
      }
    }
    function escapeJsonPtr(str2) {
      return str2.replace(/~/g, "~0").replace(/\//g, "~1");
    }
  }
});

// packages/contracts/node_modules/ajv/dist/compile/resolve.js
var require_resolve = __commonJS({
  "packages/contracts/node_modules/ajv/dist/compile/resolve.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSchemaRefs = exports.resolveUrl = exports.normalizeId = exports._getFullPath = exports.getFullPath = exports.inlineRef = void 0;
    var util_1 = require_util();
    var equal = require_fast_deep_equal();
    var traverse = require_json_schema_traverse();
    var SIMPLE_INLINED = /* @__PURE__ */ new Set([
      "type",
      "format",
      "pattern",
      "maxLength",
      "minLength",
      "maxProperties",
      "minProperties",
      "maxItems",
      "minItems",
      "maximum",
      "minimum",
      "uniqueItems",
      "multipleOf",
      "required",
      "enum",
      "const"
    ]);
    function inlineRef(schema, limit = true) {
      if (typeof schema == "boolean")
        return true;
      if (limit === true)
        return !hasRef(schema);
      if (!limit)
        return false;
      return countKeys(schema) <= limit;
    }
    exports.inlineRef = inlineRef;
    var REF_KEYWORDS = /* @__PURE__ */ new Set([
      "$ref",
      "$recursiveRef",
      "$recursiveAnchor",
      "$dynamicRef",
      "$dynamicAnchor"
    ]);
    function hasRef(schema) {
      for (const key in schema) {
        if (REF_KEYWORDS.has(key))
          return true;
        const sch = schema[key];
        if (Array.isArray(sch) && sch.some(hasRef))
          return true;
        if (typeof sch == "object" && hasRef(sch))
          return true;
      }
      return false;
    }
    function countKeys(schema) {
      let count = 0;
      for (const key in schema) {
        if (key === "$ref")
          return Infinity;
        count++;
        if (SIMPLE_INLINED.has(key))
          continue;
        if (typeof schema[key] == "object") {
          (0, util_1.eachItem)(schema[key], (sch) => count += countKeys(sch));
        }
        if (count === Infinity)
          return Infinity;
      }
      return count;
    }
    function getFullPath(resolver, id = "", normalize) {
      if (normalize !== false)
        id = normalizeId(id);
      const p = resolver.parse(id);
      return _getFullPath(resolver, p);
    }
    exports.getFullPath = getFullPath;
    function _getFullPath(resolver, p) {
      const serialized = resolver.serialize(p);
      return serialized.split("#")[0] + "#";
    }
    exports._getFullPath = _getFullPath;
    var TRAILING_SLASH_HASH = /#\/?$/;
    function normalizeId(id) {
      return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
    }
    exports.normalizeId = normalizeId;
    function resolveUrl(resolver, baseId, id) {
      id = normalizeId(id);
      return resolver.resolve(baseId, id);
    }
    exports.resolveUrl = resolveUrl;
    var ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
    function getSchemaRefs(schema, baseId) {
      if (typeof schema == "boolean")
        return {};
      const { schemaId, uriResolver } = this.opts;
      const schId = normalizeId(schema[schemaId] || baseId);
      const baseIds = { "": schId };
      const pathPrefix = getFullPath(uriResolver, schId, false);
      const localRefs = {};
      const schemaRefs = /* @__PURE__ */ new Set();
      traverse(schema, { allKeys: true }, (sch, jsonPtr, _, parentJsonPtr) => {
        if (parentJsonPtr === void 0)
          return;
        const fullPath = pathPrefix + jsonPtr;
        let innerBaseId = baseIds[parentJsonPtr];
        if (typeof sch[schemaId] == "string")
          innerBaseId = addRef.call(this, sch[schemaId]);
        addAnchor.call(this, sch.$anchor);
        addAnchor.call(this, sch.$dynamicAnchor);
        baseIds[jsonPtr] = innerBaseId;
        function addRef(ref) {
          const _resolve = this.opts.uriResolver.resolve;
          ref = normalizeId(innerBaseId ? _resolve(innerBaseId, ref) : ref);
          if (schemaRefs.has(ref))
            throw ambiguos(ref);
          schemaRefs.add(ref);
          let schOrRef = this.refs[ref];
          if (typeof schOrRef == "string")
            schOrRef = this.refs[schOrRef];
          if (typeof schOrRef == "object") {
            checkAmbiguosRef(sch, schOrRef.schema, ref);
          } else if (ref !== normalizeId(fullPath)) {
            if (ref[0] === "#") {
              checkAmbiguosRef(sch, localRefs[ref], ref);
              localRefs[ref] = sch;
            } else {
              this.refs[ref] = fullPath;
            }
          }
          return ref;
        }
        function addAnchor(anchor) {
          if (typeof anchor == "string") {
            if (!ANCHOR.test(anchor))
              throw new Error(`invalid anchor "${anchor}"`);
            addRef.call(this, `#${anchor}`);
          }
        }
      });
      return localRefs;
      function checkAmbiguosRef(sch1, sch2, ref) {
        if (sch2 !== void 0 && !equal(sch1, sch2))
          throw ambiguos(ref);
      }
      function ambiguos(ref) {
        return new Error(`reference "${ref}" resolves to more than one schema`);
      }
    }
    exports.getSchemaRefs = getSchemaRefs;
  }
});

// packages/contracts/node_modules/ajv/dist/compile/validate/index.js
var require_validate = __commonJS({
  "packages/contracts/node_modules/ajv/dist/compile/validate/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getData = exports.KeywordCxt = exports.validateFunctionCode = void 0;
    var boolSchema_1 = require_boolSchema();
    var dataType_1 = require_dataType();
    var applicability_1 = require_applicability();
    var dataType_2 = require_dataType();
    var defaults_1 = require_defaults();
    var keyword_1 = require_keyword();
    var subschema_1 = require_subschema();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var resolve_1 = require_resolve();
    var util_1 = require_util();
    var errors_1 = require_errors();
    function validateFunctionCode(it) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          topSchemaObjCode(it);
          return;
        }
      }
      validateFunction(it, () => (0, boolSchema_1.topBoolOrEmptySchema)(it));
    }
    exports.validateFunctionCode = validateFunctionCode;
    function validateFunction({ gen, validateName, schema, schemaEnv, opts }, body) {
      if (opts.code.es5) {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${names_1.default.valCxt}`, schemaEnv.$async, () => {
          gen.code((0, codegen_1._)`"use strict"; ${funcSourceUrl(schema, opts)}`);
          destructureValCxtES5(gen, opts);
          gen.code(body);
        });
      } else {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema, opts)).code(body));
      }
    }
    function destructureValCxt(opts) {
      return (0, codegen_1._)`{${names_1.default.instancePath}="", ${names_1.default.parentData}, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${names_1.default.data}${opts.dynamicRef ? (0, codegen_1._)`, ${names_1.default.dynamicAnchors}={}` : codegen_1.nil}}={}`;
    }
    function destructureValCxtES5(gen, opts) {
      gen.if(names_1.default.valCxt, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.instancePath}`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentData}`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentDataProperty}`);
        gen.var(names_1.default.rootData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.rootData}`);
        if (opts.dynamicRef)
          gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`);
      }, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`""`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.rootData, names_1.default.data);
        if (opts.dynamicRef)
          gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`{}`);
      });
    }
    function topSchemaObjCode(it) {
      const { schema, opts, gen } = it;
      validateFunction(it, () => {
        if (opts.$comment && schema.$comment)
          commentKeyword(it);
        checkNoDefault(it);
        gen.let(names_1.default.vErrors, null);
        gen.let(names_1.default.errors, 0);
        if (opts.unevaluated)
          resetEvaluated(it);
        typeAndKeywords(it);
        returnResults(it);
      });
      return;
    }
    function resetEvaluated(it) {
      const { gen, validateName } = it;
      it.evaluated = gen.const("evaluated", (0, codegen_1._)`${validateName}.evaluated`);
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicProps`, () => gen.assign((0, codegen_1._)`${it.evaluated}.props`, (0, codegen_1._)`undefined`));
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicItems`, () => gen.assign((0, codegen_1._)`${it.evaluated}.items`, (0, codegen_1._)`undefined`));
    }
    function funcSourceUrl(schema, opts) {
      const schId = typeof schema == "object" && schema[opts.schemaId];
      return schId && (opts.code.source || opts.code.process) ? (0, codegen_1._)`/*# sourceURL=${schId} */` : codegen_1.nil;
    }
    function subschemaCode(it, valid) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          subSchemaObjCode(it, valid);
          return;
        }
      }
      (0, boolSchema_1.boolOrEmptySchema)(it, valid);
    }
    function schemaCxtHasRules({ schema, self }) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (self.RULES.all[key])
          return true;
      return false;
    }
    function isSchemaObj(it) {
      return typeof it.schema != "boolean";
    }
    function subSchemaObjCode(it, valid) {
      const { schema, gen, opts } = it;
      if (opts.$comment && schema.$comment)
        commentKeyword(it);
      updateContext(it);
      checkAsyncSchema(it);
      const errsCount = gen.const("_errs", names_1.default.errors);
      typeAndKeywords(it, errsCount);
      gen.var(valid, (0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
    }
    function checkKeywords(it) {
      (0, util_1.checkUnknownRules)(it);
      checkRefsAndKeywords(it);
    }
    function typeAndKeywords(it, errsCount) {
      if (it.opts.jtd)
        return schemaKeywords(it, [], false, errsCount);
      const types = (0, dataType_1.getSchemaTypes)(it.schema);
      const checkedTypes = (0, dataType_1.coerceAndCheckDataType)(it, types);
      schemaKeywords(it, types, !checkedTypes, errsCount);
    }
    function checkRefsAndKeywords(it) {
      const { schema, errSchemaPath, opts, self } = it;
      if (schema.$ref && opts.ignoreKeywordsWithRef && (0, util_1.schemaHasRulesButRef)(schema, self.RULES)) {
        self.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
      }
    }
    function checkNoDefault(it) {
      const { schema, opts } = it;
      if (schema.default !== void 0 && opts.useDefaults && opts.strictSchema) {
        (0, util_1.checkStrictMode)(it, "default is ignored in the schema root");
      }
    }
    function updateContext(it) {
      const schId = it.schema[it.opts.schemaId];
      if (schId)
        it.baseId = (0, resolve_1.resolveUrl)(it.opts.uriResolver, it.baseId, schId);
    }
    function checkAsyncSchema(it) {
      if (it.schema.$async && !it.schemaEnv.$async)
        throw new Error("async schema in sync schema");
    }
    function commentKeyword({ gen, schemaEnv, schema, errSchemaPath, opts }) {
      const msg = schema.$comment;
      if (opts.$comment === true) {
        gen.code((0, codegen_1._)`${names_1.default.self}.logger.log(${msg})`);
      } else if (typeof opts.$comment == "function") {
        const schemaPath = (0, codegen_1.str)`${errSchemaPath}/$comment`;
        const rootName = gen.scopeValue("root", { ref: schemaEnv.root });
        gen.code((0, codegen_1._)`${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
      }
    }
    function returnResults(it) {
      const { gen, schemaEnv, validateName, ValidationError, opts } = it;
      if (schemaEnv.$async) {
        gen.if((0, codegen_1._)`${names_1.default.errors} === 0`, () => gen.return(names_1.default.data), () => gen.throw((0, codegen_1._)`new ${ValidationError}(${names_1.default.vErrors})`));
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, names_1.default.vErrors);
        if (opts.unevaluated)
          assignEvaluated(it);
        gen.return((0, codegen_1._)`${names_1.default.errors} === 0`);
      }
    }
    function assignEvaluated({ gen, evaluated, props, items }) {
      if (props instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.props`, props);
      if (items instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.items`, items);
    }
    function schemaKeywords(it, types, typeErrors, errsCount) {
      const { gen, schema, data, allErrors, opts, self } = it;
      const { RULES } = self;
      if (schema.$ref && (opts.ignoreKeywordsWithRef || !(0, util_1.schemaHasRulesButRef)(schema, RULES))) {
        gen.block(() => keywordCode(it, "$ref", RULES.all.$ref.definition));
        return;
      }
      if (!opts.jtd)
        checkStrictTypes(it, types);
      gen.block(() => {
        for (const group of RULES.rules)
          groupKeywords(group);
        groupKeywords(RULES.post);
      });
      function groupKeywords(group) {
        if (!(0, applicability_1.shouldUseGroup)(schema, group))
          return;
        if (group.type) {
          gen.if((0, dataType_2.checkDataType)(group.type, data, opts.strictNumbers));
          iterateKeywords(it, group);
          if (types.length === 1 && types[0] === group.type && typeErrors) {
            gen.else();
            (0, dataType_2.reportTypeError)(it);
          }
          gen.endIf();
        } else {
          iterateKeywords(it, group);
        }
        if (!allErrors)
          gen.if((0, codegen_1._)`${names_1.default.errors} === ${errsCount || 0}`);
      }
    }
    function iterateKeywords(it, group) {
      const { gen, schema, opts: { useDefaults } } = it;
      if (useDefaults)
        (0, defaults_1.assignDefaults)(it, group.type);
      gen.block(() => {
        for (const rule of group.rules) {
          if ((0, applicability_1.shouldUseRule)(schema, rule)) {
            keywordCode(it, rule.keyword, rule.definition, group.type);
          }
        }
      });
    }
    function checkStrictTypes(it, types) {
      if (it.schemaEnv.meta || !it.opts.strictTypes)
        return;
      checkContextTypes(it, types);
      if (!it.opts.allowUnionTypes)
        checkMultipleTypes(it, types);
      checkKeywordTypes(it, it.dataTypes);
    }
    function checkContextTypes(it, types) {
      if (!types.length)
        return;
      if (!it.dataTypes.length) {
        it.dataTypes = types;
        return;
      }
      types.forEach((t) => {
        if (!includesType(it.dataTypes, t)) {
          strictTypesError(it, `type "${t}" not allowed by context "${it.dataTypes.join(",")}"`);
        }
      });
      narrowSchemaTypes(it, types);
    }
    function checkMultipleTypes(it, ts) {
      if (ts.length > 1 && !(ts.length === 2 && ts.includes("null"))) {
        strictTypesError(it, "use allowUnionTypes to allow union type keyword");
      }
    }
    function checkKeywordTypes(it, ts) {
      const rules = it.self.RULES.all;
      for (const keyword in rules) {
        const rule = rules[keyword];
        if (typeof rule == "object" && (0, applicability_1.shouldUseRule)(it.schema, rule)) {
          const { type } = rule.definition;
          if (type.length && !type.some((t) => hasApplicableType(ts, t))) {
            strictTypesError(it, `missing type "${type.join(",")}" for keyword "${keyword}"`);
          }
        }
      }
    }
    function hasApplicableType(schTs, kwdT) {
      return schTs.includes(kwdT) || kwdT === "number" && schTs.includes("integer");
    }
    function includesType(ts, t) {
      return ts.includes(t) || t === "integer" && ts.includes("number");
    }
    function narrowSchemaTypes(it, withTypes) {
      const ts = [];
      for (const t of it.dataTypes) {
        if (includesType(withTypes, t))
          ts.push(t);
        else if (withTypes.includes("integer") && t === "number")
          ts.push("integer");
      }
      it.dataTypes = ts;
    }
    function strictTypesError(it, msg) {
      const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
      msg += ` at "${schemaPath}" (strictTypes)`;
      (0, util_1.checkStrictMode)(it, msg, it.opts.strictTypes);
    }
    var KeywordCxt = class {
      constructor(it, def, keyword) {
        (0, keyword_1.validateKeywordUsage)(it, def, keyword);
        this.gen = it.gen;
        this.allErrors = it.allErrors;
        this.keyword = keyword;
        this.data = it.data;
        this.schema = it.schema[keyword];
        this.$data = def.$data && it.opts.$data && this.schema && this.schema.$data;
        this.schemaValue = (0, util_1.schemaRefOrVal)(it, this.schema, keyword, this.$data);
        this.schemaType = def.schemaType;
        this.parentSchema = it.schema;
        this.params = {};
        this.it = it;
        this.def = def;
        if (this.$data) {
          this.schemaCode = it.gen.const("vSchema", getData(this.$data, it));
        } else {
          this.schemaCode = this.schemaValue;
          if (!(0, keyword_1.validSchemaType)(this.schema, def.schemaType, def.allowUndefined)) {
            throw new Error(`${keyword} value must be ${JSON.stringify(def.schemaType)}`);
          }
        }
        if ("code" in def ? def.trackErrors : def.errors !== false) {
          this.errsCount = it.gen.const("_errs", names_1.default.errors);
        }
      }
      result(condition, successAction, failAction) {
        this.failResult((0, codegen_1.not)(condition), successAction, failAction);
      }
      failResult(condition, successAction, failAction) {
        this.gen.if(condition);
        if (failAction)
          failAction();
        else
          this.error();
        if (successAction) {
          this.gen.else();
          successAction();
          if (this.allErrors)
            this.gen.endIf();
        } else {
          if (this.allErrors)
            this.gen.endIf();
          else
            this.gen.else();
        }
      }
      pass(condition, failAction) {
        this.failResult((0, codegen_1.not)(condition), void 0, failAction);
      }
      fail(condition) {
        if (condition === void 0) {
          this.error();
          if (!this.allErrors)
            this.gen.if(false);
          return;
        }
        this.gen.if(condition);
        this.error();
        if (this.allErrors)
          this.gen.endIf();
        else
          this.gen.else();
      }
      fail$data(condition) {
        if (!this.$data)
          return this.fail(condition);
        const { schemaCode } = this;
        this.fail((0, codegen_1._)`${schemaCode} !== undefined && (${(0, codegen_1.or)(this.invalid$data(), condition)})`);
      }
      error(append, errorParams, errorPaths) {
        if (errorParams) {
          this.setParams(errorParams);
          this._error(append, errorPaths);
          this.setParams({});
          return;
        }
        this._error(append, errorPaths);
      }
      _error(append, errorPaths) {
        ;
        (append ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
      }
      $dataError() {
        (0, errors_1.reportError)(this, this.def.$dataError || errors_1.keyword$DataError);
      }
      reset() {
        if (this.errsCount === void 0)
          throw new Error('add "trackErrors" to keyword definition');
        (0, errors_1.resetErrorsCount)(this.gen, this.errsCount);
      }
      ok(cond) {
        if (!this.allErrors)
          this.gen.if(cond);
      }
      setParams(obj2, assign) {
        if (assign)
          Object.assign(this.params, obj2);
        else
          this.params = obj2;
      }
      block$data(valid, codeBlock, $dataValid = codegen_1.nil) {
        this.gen.block(() => {
          this.check$data(valid, $dataValid);
          codeBlock();
        });
      }
      check$data(valid = codegen_1.nil, $dataValid = codegen_1.nil) {
        if (!this.$data)
          return;
        const { gen, schemaCode, schemaType, def } = this;
        gen.if((0, codegen_1.or)((0, codegen_1._)`${schemaCode} === undefined`, $dataValid));
        if (valid !== codegen_1.nil)
          gen.assign(valid, true);
        if (schemaType.length || def.validateSchema) {
          gen.elseIf(this.invalid$data());
          this.$dataError();
          if (valid !== codegen_1.nil)
            gen.assign(valid, false);
        }
        gen.else();
      }
      invalid$data() {
        const { gen, schemaCode, schemaType, def, it } = this;
        return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema());
        function wrong$DataType() {
          if (schemaType.length) {
            if (!(schemaCode instanceof codegen_1.Name))
              throw new Error("ajv implementation error");
            const st = Array.isArray(schemaType) ? schemaType : [schemaType];
            return (0, codegen_1._)`${(0, dataType_2.checkDataTypes)(st, schemaCode, it.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
          }
          return codegen_1.nil;
        }
        function invalid$DataSchema() {
          if (def.validateSchema) {
            const validateSchemaRef = gen.scopeValue("validate$data", { ref: def.validateSchema });
            return (0, codegen_1._)`!${validateSchemaRef}(${schemaCode})`;
          }
          return codegen_1.nil;
        }
      }
      subschema(appl, valid) {
        const subschema = (0, subschema_1.getSubschema)(this.it, appl);
        (0, subschema_1.extendSubschemaData)(subschema, this.it, appl);
        (0, subschema_1.extendSubschemaMode)(subschema, appl);
        const nextContext = { ...this.it, ...subschema, items: void 0, props: void 0 };
        subschemaCode(nextContext, valid);
        return nextContext;
      }
      mergeEvaluated(schemaCxt, toName) {
        const { it, gen } = this;
        if (!it.opts.unevaluated)
          return;
        if (it.props !== true && schemaCxt.props !== void 0) {
          it.props = util_1.mergeEvaluated.props(gen, schemaCxt.props, it.props, toName);
        }
        if (it.items !== true && schemaCxt.items !== void 0) {
          it.items = util_1.mergeEvaluated.items(gen, schemaCxt.items, it.items, toName);
        }
      }
      mergeValidEvaluated(schemaCxt, valid) {
        const { it, gen } = this;
        if (it.opts.unevaluated && (it.props !== true || it.items !== true)) {
          gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1.Name));
          return true;
        }
      }
    };
    exports.KeywordCxt = KeywordCxt;
    function keywordCode(it, keyword, def, ruleType) {
      const cxt = new KeywordCxt(it, def, keyword);
      if ("code" in def) {
        def.code(cxt, ruleType);
      } else if (cxt.$data && def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      } else if ("macro" in def) {
        (0, keyword_1.macroKeywordCode)(cxt, def);
      } else if (def.compile || def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      }
    }
    var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
    var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
    function getData($data, { dataLevel, dataNames, dataPathArr }) {
      let jsonPointer;
      let data;
      if ($data === "")
        return names_1.default.rootData;
      if ($data[0] === "/") {
        if (!JSON_POINTER.test($data))
          throw new Error(`Invalid JSON-pointer: ${$data}`);
        jsonPointer = $data;
        data = names_1.default.rootData;
      } else {
        const matches = RELATIVE_JSON_POINTER.exec($data);
        if (!matches)
          throw new Error(`Invalid JSON-pointer: ${$data}`);
        const up = +matches[1];
        jsonPointer = matches[2];
        if (jsonPointer === "#") {
          if (up >= dataLevel)
            throw new Error(errorMsg("property/index", up));
          return dataPathArr[dataLevel - up];
        }
        if (up > dataLevel)
          throw new Error(errorMsg("data", up));
        data = dataNames[dataLevel - up];
        if (!jsonPointer)
          return data;
      }
      let expr = data;
      const segments = jsonPointer.split("/");
      for (const segment of segments) {
        if (segment) {
          data = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)((0, util_1.unescapeJsonPointer)(segment))}`;
          expr = (0, codegen_1._)`${expr} && ${data}`;
        }
      }
      return expr;
      function errorMsg(pointerType, up) {
        return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
      }
    }
    exports.getData = getData;
  }
});

// packages/contracts/node_modules/ajv/dist/runtime/validation_error.js
var require_validation_error = __commonJS({
  "packages/contracts/node_modules/ajv/dist/runtime/validation_error.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ValidationError = class extends Error {
      constructor(errors) {
        super("validation failed");
        this.errors = errors;
        this.ajv = this.validation = true;
      }
    };
    exports.default = ValidationError;
  }
});

// packages/contracts/node_modules/ajv/dist/compile/ref_error.js
var require_ref_error = __commonJS({
  "packages/contracts/node_modules/ajv/dist/compile/ref_error.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var resolve_1 = require_resolve();
    var MissingRefError = class extends Error {
      constructor(resolver, baseId, ref, msg) {
        super(msg || `can't resolve reference ${ref} from id ${baseId}`);
        this.missingRef = (0, resolve_1.resolveUrl)(resolver, baseId, ref);
        this.missingSchema = (0, resolve_1.normalizeId)((0, resolve_1.getFullPath)(resolver, this.missingRef));
      }
    };
    exports.default = MissingRefError;
  }
});

// packages/contracts/node_modules/ajv/dist/compile/index.js
var require_compile = __commonJS({
  "packages/contracts/node_modules/ajv/dist/compile/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveSchema = exports.getCompilingSchema = exports.resolveRef = exports.compileSchema = exports.SchemaEnv = void 0;
    var codegen_1 = require_codegen();
    var validation_error_1 = require_validation_error();
    var names_1 = require_names();
    var resolve_1 = require_resolve();
    var util_1 = require_util();
    var validate_1 = require_validate();
    var SchemaEnv = class {
      constructor(env2) {
        var _a;
        this.refs = {};
        this.dynamicAnchors = {};
        let schema;
        if (typeof env2.schema == "object")
          schema = env2.schema;
        this.schema = env2.schema;
        this.schemaId = env2.schemaId;
        this.root = env2.root || this;
        this.baseId = (_a = env2.baseId) !== null && _a !== void 0 ? _a : (0, resolve_1.normalizeId)(schema === null || schema === void 0 ? void 0 : schema[env2.schemaId || "$id"]);
        this.schemaPath = env2.schemaPath;
        this.localRefs = env2.localRefs;
        this.meta = env2.meta;
        this.$async = schema === null || schema === void 0 ? void 0 : schema.$async;
        this.refs = {};
      }
    };
    exports.SchemaEnv = SchemaEnv;
    function compileSchema(sch) {
      const _sch = getCompilingSchema.call(this, sch);
      if (_sch)
        return _sch;
      const rootId = (0, resolve_1.getFullPath)(this.opts.uriResolver, sch.root.baseId);
      const { es5, lines: lines2 } = this.opts.code;
      const { ownProperties } = this.opts;
      const gen = new codegen_1.CodeGen(this.scope, { es5, lines: lines2, ownProperties });
      let _ValidationError;
      if (sch.$async) {
        _ValidationError = gen.scopeValue("Error", {
          ref: validation_error_1.default,
          code: (0, codegen_1._)`require("ajv/dist/runtime/validation_error").default`
        });
      }
      const validateName = gen.scopeName("validate");
      sch.validateName = validateName;
      const schemaCxt = {
        gen,
        allErrors: this.opts.allErrors,
        data: names_1.default.data,
        parentData: names_1.default.parentData,
        parentDataProperty: names_1.default.parentDataProperty,
        dataNames: [names_1.default.data],
        dataPathArr: [codegen_1.nil],
        // TODO can its length be used as dataLevel if nil is removed?
        dataLevel: 0,
        dataTypes: [],
        definedProperties: /* @__PURE__ */ new Set(),
        topSchemaRef: gen.scopeValue("schema", this.opts.code.source === true ? { ref: sch.schema, code: (0, codegen_1.stringify)(sch.schema) } : { ref: sch.schema }),
        validateName,
        ValidationError: _ValidationError,
        schema: sch.schema,
        schemaEnv: sch,
        rootId,
        baseId: sch.baseId || rootId,
        schemaPath: codegen_1.nil,
        errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
        errorPath: (0, codegen_1._)`""`,
        opts: this.opts,
        self: this
      };
      let sourceCode;
      try {
        this._compilations.add(sch);
        (0, validate_1.validateFunctionCode)(schemaCxt);
        gen.optimize(this.opts.code.optimize);
        const validateCode = gen.toString();
        sourceCode = `${gen.scopeRefs(names_1.default.scope)}return ${validateCode}`;
        if (this.opts.code.process)
          sourceCode = this.opts.code.process(sourceCode, sch);
        const makeValidate = new Function(`${names_1.default.self}`, `${names_1.default.scope}`, sourceCode);
        const validate = makeValidate(this, this.scope.get());
        this.scope.value(validateName, { ref: validate });
        validate.errors = null;
        validate.schema = sch.schema;
        validate.schemaEnv = sch;
        if (sch.$async)
          validate.$async = true;
        if (this.opts.code.source === true) {
          validate.source = { validateName, validateCode, scopeValues: gen._values };
        }
        if (this.opts.unevaluated) {
          const { props, items } = schemaCxt;
          validate.evaluated = {
            props: props instanceof codegen_1.Name ? void 0 : props,
            items: items instanceof codegen_1.Name ? void 0 : items,
            dynamicProps: props instanceof codegen_1.Name,
            dynamicItems: items instanceof codegen_1.Name
          };
          if (validate.source)
            validate.source.evaluated = (0, codegen_1.stringify)(validate.evaluated);
        }
        sch.validate = validate;
        return sch;
      } catch (e) {
        delete sch.validate;
        delete sch.validateName;
        if (sourceCode)
          this.logger.error("Error compiling schema, function code:", sourceCode);
        throw e;
      } finally {
        this._compilations.delete(sch);
      }
    }
    exports.compileSchema = compileSchema;
    function resolveRef(root2, baseId, ref) {
      var _a;
      ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, ref);
      const schOrFunc = root2.refs[ref];
      if (schOrFunc)
        return schOrFunc;
      let _sch = resolve2.call(this, root2, ref);
      if (_sch === void 0) {
        const schema = (_a = root2.localRefs) === null || _a === void 0 ? void 0 : _a[ref];
        const { schemaId } = this.opts;
        if (schema)
          _sch = new SchemaEnv({ schema, schemaId, root: root2, baseId });
      }
      if (_sch === void 0)
        return;
      return root2.refs[ref] = inlineOrCompile.call(this, _sch);
    }
    exports.resolveRef = resolveRef;
    function inlineOrCompile(sch) {
      if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs))
        return sch.schema;
      return sch.validate ? sch : compileSchema.call(this, sch);
    }
    function getCompilingSchema(schEnv) {
      for (const sch of this._compilations) {
        if (sameSchemaEnv(sch, schEnv))
          return sch;
      }
    }
    exports.getCompilingSchema = getCompilingSchema;
    function sameSchemaEnv(s1, s2) {
      return s1.schema === s2.schema && s1.root === s2.root && s1.baseId === s2.baseId;
    }
    function resolve2(root2, ref) {
      let sch;
      while (typeof (sch = this.refs[ref]) == "string")
        ref = sch;
      return sch || this.schemas[ref] || resolveSchema.call(this, root2, ref);
    }
    function resolveSchema(root2, ref) {
      const p = this.opts.uriResolver.parse(ref);
      const refPath = (0, resolve_1._getFullPath)(this.opts.uriResolver, p);
      let baseId = (0, resolve_1.getFullPath)(this.opts.uriResolver, root2.baseId, void 0);
      if (Object.keys(root2.schema).length > 0 && refPath === baseId) {
        return getJsonPointer.call(this, p, root2);
      }
      const id = (0, resolve_1.normalizeId)(refPath);
      const schOrRef = this.refs[id] || this.schemas[id];
      if (typeof schOrRef == "string") {
        const sch = resolveSchema.call(this, root2, schOrRef);
        if (typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !== "object")
          return;
        return getJsonPointer.call(this, p, sch);
      }
      if (typeof (schOrRef === null || schOrRef === void 0 ? void 0 : schOrRef.schema) !== "object")
        return;
      if (!schOrRef.validate)
        compileSchema.call(this, schOrRef);
      if (id === (0, resolve_1.normalizeId)(ref)) {
        const { schema } = schOrRef;
        const { schemaId } = this.opts;
        const schId = schema[schemaId];
        if (schId)
          baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        return new SchemaEnv({ schema, schemaId, root: root2, baseId });
      }
      return getJsonPointer.call(this, p, schOrRef);
    }
    exports.resolveSchema = resolveSchema;
    var PREVENT_SCOPE_CHANGE = /* @__PURE__ */ new Set([
      "properties",
      "patternProperties",
      "enum",
      "dependencies",
      "definitions"
    ]);
    function getJsonPointer(parsedRef, { baseId, schema, root: root2 }) {
      var _a;
      if (((_a = parsedRef.fragment) === null || _a === void 0 ? void 0 : _a[0]) !== "/")
        return;
      for (const part of parsedRef.fragment.slice(1).split("/")) {
        if (typeof schema === "boolean")
          return;
        const partSchema = schema[(0, util_1.unescapeFragment)(part)];
        if (partSchema === void 0)
          return;
        schema = partSchema;
        const schId = typeof schema === "object" && schema[this.opts.schemaId];
        if (!PREVENT_SCOPE_CHANGE.has(part) && schId) {
          baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        }
      }
      let env2;
      if (typeof schema != "boolean" && schema.$ref && !(0, util_1.schemaHasRulesButRef)(schema, this.RULES)) {
        const $ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schema.$ref);
        env2 = resolveSchema.call(this, root2, $ref);
      }
      const { schemaId } = this.opts;
      env2 = env2 || new SchemaEnv({ schema, schemaId, root: root2, baseId });
      if (env2.schema !== env2.root.schema)
        return env2;
      return void 0;
    }
  }
});

// packages/contracts/node_modules/ajv/dist/refs/data.json
var require_data = __commonJS({
  "packages/contracts/node_modules/ajv/dist/refs/data.json"(exports, module) {
    module.exports = {
      $id: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
      description: "Meta-schema for $data reference (JSON AnySchema extension proposal)",
      type: "object",
      required: ["$data"],
      properties: {
        $data: {
          type: "string",
          anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }]
        }
      },
      additionalProperties: false
    };
  }
});

// node_modules/fast-uri/lib/utils.js
var require_utils = __commonJS({
  "node_modules/fast-uri/lib/utils.js"(exports, module) {
    "use strict";
    var isUUID = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu);
    var isIPv4 = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
    var isPort = RegExp.prototype.test.bind(/^\d*$/u);
    var isHexPair = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu);
    var isUnreserved = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu);
    var isPathCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/]$/u);
    var isQueryFragmentCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/?]$/u);
    var isUserinfoCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:]$/u);
    var BYTE_HEX = new Array(256);
    {
      const HEX_DIGITS = "0123456789ABCDEF";
      for (let i = 0; i < 256; i++) {
        BYTE_HEX[i] = "%" + HEX_DIGITS[i >> 4] + HEX_DIGITS[i & 15];
      }
    }
    function percentEncodeNonAscii(cp) {
      if (cp < 2048) {
        return BYTE_HEX[192 | cp >> 6] + BYTE_HEX[128 | cp & 63];
      }
      if (cp < 65536) {
        return BYTE_HEX[224 | cp >> 12] + BYTE_HEX[128 | cp >> 6 & 63] + BYTE_HEX[128 | cp & 63];
      }
      return BYTE_HEX[240 | cp >> 18] + BYTE_HEX[128 | cp >> 12 & 63] + BYTE_HEX[128 | cp >> 6 & 63] + BYTE_HEX[128 | cp & 63];
    }
    function stringArrayToHexStripped(input) {
      let acc = "";
      let code = 0;
      let i = 0;
      for (i = 0; i < input.length; i++) {
        code = input[i].charCodeAt(0);
        if (code === 48) {
          continue;
        }
        if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) {
          return "";
        }
        acc += input[i];
        break;
      }
      for (i += 1; i < input.length; i++) {
        code = input[i].charCodeAt(0);
        if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) {
          return "";
        }
        acc += input[i];
      }
      return acc;
    }
    var isHextet = RegExp.prototype.test.bind(/^[\dA-Fa-f]{1,4}$/);
    var isIPvFuture = RegExp.prototype.test.bind(/^[vV][\dA-Fa-f]+\.[A-Za-z\d\-._~!$&'()*+,;=:]+$/);
    var isZoneCharacter = RegExp.prototype.test.bind(/^[A-Za-z\d\-._~]$/);
    var nonSimpleDomain = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
    function isZoneIdentifier(zone) {
      if (zone.length === 0) return false;
      for (let i = 0; i < zone.length; i++) {
        if (isZoneCharacter(zone[i])) continue;
        if (zone[i] === "%" && i + 2 < zone.length && isHexPair(zone.slice(i + 1, i + 3))) {
          i += 2;
          continue;
        }
        return false;
      }
      return true;
    }
    function compressIPv6ZeroRun(hextets) {
      let bestStart = -1;
      let bestLength = 0;
      let runStart = -1;
      let runLength = 0;
      for (let i = 0; i < hextets.length; i++) {
        if (hextets[i] === "0") {
          if (runStart === -1) runStart = i;
          runLength++;
          if (runLength > bestLength) {
            bestLength = runLength;
            bestStart = runStart;
          }
        } else {
          runStart = -1;
          runLength = 0;
        }
      }
      if (bestLength < 2) return hextets.join(":");
      const head = hextets.slice(0, bestStart).join(":");
      const tail = hextets.slice(bestStart + bestLength).join(":");
      return head + "::" + tail;
    }
    function normalizeIPv6Address(input) {
      const compression = input.indexOf("::");
      if (compression !== -1 && input.indexOf("::", compression + 1) !== -1) return void 0;
      const left = compression === -1 ? input.split(":") : input.slice(0, compression).split(":");
      const right = compression === -1 ? [] : input.slice(compression + 2).split(":");
      if (compression !== -1) {
        if (left.length === 1 && left[0] === "") left.length = 0;
        if (right.length === 1 && right[0] === "") right.length = 0;
      }
      const parts = left.concat(right);
      let hextetCount = 0;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part === "") return void 0;
        if (part.indexOf(".") !== -1) {
          if (i !== parts.length - 1 || compression !== -1 && right.length === 0 || !isIPv4(part)) return void 0;
          hextetCount += 2;
          continue;
        }
        if (!isHextet(part)) return void 0;
        parts[i] = parseInt(part, 16).toString(16);
        hextetCount++;
      }
      if (compression === -1) {
        if (hextetCount !== 8) return void 0;
        return compressIPv6ZeroRun(parts);
      }
      if (hextetCount >= 8) return void 0;
      const expanded = parts.slice(0, left.length);
      for (let i = hextetCount; i < 8; i++) expanded.push("0");
      for (let i = left.length; i < parts.length; i++) expanded.push(parts[i]);
      return compressIPv6ZeroRun(expanded);
    }
    function normalizeIPv6(host) {
      const bracketed = host[0] === "[" && host[host.length - 1] === "]";
      const hasBracket = host[0] === "[" || host[host.length - 1] === "]";
      if (hasBracket && !bracketed) return { host, isIPV6: false, error: true };
      let input = bracketed ? host.slice(1, -1) : host;
      if (bracketed && isIPvFuture(input)) {
        input = input.toLowerCase();
        return { host: `[${input}]`, escapedHost: input, isIPV6: false, isIPVFuture: true };
      }
      if (findToken(input, ":") < 2) {
        return { host, isIPV6: false, error: bracketed };
      }
      let zoneIdentifier = "";
      const zoneSeparator = input.indexOf("%");
      if (zoneSeparator !== -1) {
        const separatorLength = input.slice(zoneSeparator, zoneSeparator + 3).toLowerCase() === "%25" ? 3 : 1;
        zoneIdentifier = input.slice(zoneSeparator + separatorLength);
        if (!isZoneIdentifier(zoneIdentifier)) return { host, isIPV6: false, error: true };
        input = input.slice(0, zoneSeparator);
      }
      const address = normalizeIPv6Address(input);
      if (address === void 0) return { host, isIPV6: false, error: true };
      return {
        host: address + (zoneIdentifier ? "%" + zoneIdentifier : ""),
        escapedHost: address + (zoneIdentifier ? "%25" + zoneIdentifier : ""),
        isIPV6: true
      };
    }
    function findToken(str2, token) {
      let ind = 0;
      for (let i = 0; i < str2.length; i++) {
        if (str2[i] === token) ind++;
      }
      return ind;
    }
    function removeDotSegments(path) {
      let input = path;
      const output = [];
      let nextSlash = -1;
      let len = 0;
      while (len = input.length) {
        if (len === 1) {
          if (input === ".") {
            break;
          } else if (input === "/") {
            output.push("/");
            break;
          } else {
            output.push(input);
            break;
          }
        } else if (len === 2) {
          if (input[0] === ".") {
            if (input[1] === ".") {
              break;
            } else if (input[1] === "/") {
              input = input.slice(2);
              continue;
            }
          } else if (input[0] === "/") {
            if (input[1] === "." || input[1] === "/") {
              output.push("/");
              break;
            }
          }
        } else if (len === 3) {
          if (input === "/..") {
            if (output.length !== 0) {
              output.pop();
            }
            output.push("/");
            break;
          }
        }
        if (input[0] === ".") {
          if (input[1] === ".") {
            if (input[2] === "/") {
              input = input.slice(3);
              continue;
            }
          } else if (input[1] === "/") {
            input = input.slice(2);
            continue;
          }
        } else if (input[0] === "/") {
          if (input[1] === ".") {
            if (input[2] === "/") {
              input = input.slice(2);
              continue;
            } else if (input[2] === ".") {
              if (input[3] === "/") {
                input = input.slice(3);
                if (output.length !== 0) {
                  output.pop();
                }
                continue;
              }
            }
          }
        }
        if ((nextSlash = input.indexOf("/", 1)) === -1) {
          output.push(input);
          break;
        } else {
          output.push(input.slice(0, nextSlash));
          input = input.slice(nextSlash);
        }
      }
      return output.join("");
    }
    var HOST_DELIMS = { "@": "%40", "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" };
    var HOST_DELIM_RE = /[@/?#:]/g;
    var HOST_DELIM_NO_COLON_RE = /[@/?#]/g;
    function reescapeHostDelimiters(host, isIP) {
      const re = isIP ? HOST_DELIM_NO_COLON_RE : HOST_DELIM_RE;
      re.lastIndex = 0;
      return host.replace(re, (ch) => HOST_DELIMS[ch]);
    }
    function normalizePercentEncoding(input, decodeUnreserved = false) {
      if (input.indexOf("%") === -1) {
        return input;
      }
      let output = "";
      for (let i = 0; i < input.length; i++) {
        if (input[i] === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            const normalizedHex = hex.toUpperCase();
            const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
            if (decodeUnreserved && isUnreserved(decoded)) {
              output += decoded;
            } else {
              output += "%" + normalizedHex;
            }
            i += 2;
            continue;
          }
        }
        output += input[i];
      }
      return output;
    }
    function normalizePathEncoding(input) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            const normalizedHex = hex.toUpperCase();
            const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
            if (decoded !== "." && isUnreserved(decoded)) {
              output += decoded;
            } else {
              output += "%" + normalizedHex;
            }
            i += 2;
            continue;
          }
        }
        if (isPathCharacter(ch)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += isEscapeSafe(code) ? ch : BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function serializePathEncoding(input, pathNoScheme = false) {
      let output = "";
      let firstSegment = pathNoScheme && input[0] !== "/";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            output += "%" + hex.toUpperCase();
            i += 2;
            continue;
          }
        }
        if (ch === "/") {
          firstSegment = false;
        }
        if (isPathCharacter(ch) && (ch !== ":" || !firstSegment)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function encodeComponent(input, isAllowed) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            output += "%" + hex.toUpperCase();
            i += 2;
            continue;
          }
        }
        if (isAllowed(ch)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function encodeUserinfo(input) {
      return encodeComponent(input, isUserinfoCharacter);
    }
    function encodeQuery(input) {
      return encodeComponent(input, isQueryFragmentCharacter);
    }
    function encodeFragment(input) {
      return encodeComponent(input, isQueryFragmentCharacter);
    }
    function isEscapeSafe(cp) {
      return cp >= 48 && cp <= 57 || cp >= 65 && cp <= 90 || cp >= 97 && cp <= 122 || cp === 42 || cp === 43 || cp === 45 || cp === 46 || cp === 47 || cp === 64 || cp === 95;
    }
    function normalizeQueryFragmentEncoding(input) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            const normalizedHex = hex.toUpperCase();
            const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
            if (isUnreserved(decoded)) {
              output += decoded;
            } else {
              output += "%" + normalizedHex;
            }
            i += 2;
            continue;
          }
        }
        if (isQueryFragmentCharacter(ch)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += isEscapeSafe(code) ? ch : BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function escapePreservingEscapes(input) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        if (input[i] === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            output += "%" + hex.toUpperCase();
            i += 2;
            continue;
          }
        }
        output += escape(input[i]);
      }
      return output;
    }
    function recomposeAuthority(component) {
      const uriTokens = [];
      if (component.userinfo !== void 0) {
        uriTokens.push(encodeUserinfo(component.userinfo));
        uriTokens.push("@");
      }
      if (component.host !== void 0) {
        let host = component.host;
        if (!isIPv4(host)) {
          let ipV6res = normalizeIPv6(host);
          if (ipV6res.isIPV6 !== true && ipV6res.isIPVFuture !== true) {
            host = normalizePercentEncoding(host, true);
            ipV6res = normalizeIPv6(host);
          }
          if (ipV6res.isIPV6 === true || ipV6res.isIPVFuture === true) {
            host = `[${ipV6res.escapedHost}]`;
          } else {
            host = reescapeHostDelimiters(host, false);
          }
        }
        uriTokens.push(host);
      }
      if (typeof component.port === "number" || typeof component.port === "string") {
        const port = String(component.port);
        if (!isPort(port)) {
          throw new TypeError("URI port is malformed.");
        }
        uriTokens.push(":");
        uriTokens.push(port);
      }
      return uriTokens.length ? uriTokens.join("") : void 0;
    }
    module.exports = {
      nonSimpleDomain,
      recomposeAuthority,
      reescapeHostDelimiters,
      normalizePercentEncoding,
      normalizePathEncoding,
      serializePathEncoding,
      normalizeQueryFragmentEncoding,
      encodeUserinfo,
      encodeQuery,
      encodeFragment,
      escapePreservingEscapes,
      removeDotSegments,
      isIPv4,
      isUUID,
      normalizeIPv6,
      stringArrayToHexStripped
    };
  }
});

// node_modules/fast-uri/lib/schemes.js
var require_schemes = __commonJS({
  "node_modules/fast-uri/lib/schemes.js"(exports, module) {
    "use strict";
    var { isUUID } = require_utils();
    var URN_REG = /^([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-./:;=@]|%[\da-f]{2})+)$/iu;
    var supportedSchemeNames = (
      /** @type {const} */
      [
        "http",
        "https",
        "ws",
        "wss",
        "urn",
        "urn:uuid"
      ]
    );
    function isValidSchemeName(name) {
      return supportedSchemeNames.indexOf(
        /** @type {*} */
        name
      ) !== -1;
    }
    function wsIsSecure(wsComponent) {
      if (wsComponent.secure === true) {
        return true;
      } else if (wsComponent.secure === false) {
        return false;
      } else if (wsComponent.scheme) {
        return wsComponent.scheme.length === 3 && (wsComponent.scheme[0] === "w" || wsComponent.scheme[0] === "W") && (wsComponent.scheme[1] === "s" || wsComponent.scheme[1] === "S") && (wsComponent.scheme[2] === "s" || wsComponent.scheme[2] === "S");
      } else {
        return false;
      }
    }
    function httpParse(component) {
      if (!component.host) {
        component.error = component.error || "HTTP URIs must have a host.";
      }
      return component;
    }
    function httpSerialize(component) {
      const secure = String(component.scheme).toLowerCase() === "https";
      if (component.port === (secure ? 443 : 80) || component.port === "") {
        component.port = void 0;
      }
      if (!component.path) {
        component.path = "/";
      }
      return component;
    }
    function wsParse(wsComponent) {
      wsComponent.secure = wsIsSecure(wsComponent);
      wsComponent.resourceName = (wsComponent.path || "/") + (wsComponent.query ? "?" + wsComponent.query : "");
      wsComponent.path = void 0;
      wsComponent.query = void 0;
      return wsComponent;
    }
    function wsSerialize(wsComponent) {
      if (wsComponent.port === (wsIsSecure(wsComponent) ? 443 : 80) || wsComponent.port === "") {
        wsComponent.port = void 0;
      }
      if (typeof wsComponent.secure === "boolean") {
        wsComponent.scheme = wsComponent.secure ? "wss" : "ws";
        wsComponent.secure = void 0;
      }
      if (wsComponent.resourceName) {
        const queryIndex = wsComponent.resourceName.indexOf("?");
        const path = queryIndex === -1 ? wsComponent.resourceName : wsComponent.resourceName.slice(0, queryIndex);
        wsComponent.path = path && path !== "/" ? path : void 0;
        wsComponent.query = queryIndex === -1 ? void 0 : wsComponent.resourceName.slice(queryIndex + 1);
        wsComponent.resourceName = void 0;
      }
      wsComponent.fragment = void 0;
      return wsComponent;
    }
    function urnParse(urnComponent, options) {
      if (!urnComponent.path) {
        urnComponent.error = "URN can not be parsed";
        return urnComponent;
      }
      const matches = urnComponent.path.match(URN_REG);
      if (matches && matches[0] === urnComponent.path) {
        const scheme = options.scheme || urnComponent.scheme || "urn";
        urnComponent.nid = matches[1].toLowerCase();
        urnComponent.nss = matches[2];
        const urnScheme = `${scheme}:${options.nid || urnComponent.nid}`;
        const schemeHandler = getSchemeHandler(urnScheme);
        urnComponent.path = void 0;
        if (schemeHandler) {
          urnComponent = schemeHandler.parse(urnComponent, options);
        }
      } else {
        urnComponent.error = urnComponent.error || "URN can not be parsed.";
      }
      return urnComponent;
    }
    function urnSerialize(urnComponent, options) {
      if (urnComponent.nid === void 0) {
        throw new Error("URN without nid cannot be serialized");
      }
      const scheme = options.scheme || urnComponent.scheme || "urn";
      const nid = urnComponent.nid.toLowerCase();
      const urnScheme = `${scheme}:${options.nid || nid}`;
      const schemeHandler = getSchemeHandler(urnScheme);
      if (schemeHandler) {
        urnComponent = schemeHandler.serialize(urnComponent, options);
      }
      const uriComponent = urnComponent;
      const nss = urnComponent.nss;
      uriComponent.path = `${nid || options.nid}:${nss}`;
      options.skipEscape = true;
      return uriComponent;
    }
    function urnuuidParse(urnComponent, options) {
      const uuidComponent = urnComponent;
      uuidComponent.uuid = uuidComponent.nss;
      uuidComponent.nss = void 0;
      if (!options.tolerant && (!uuidComponent.uuid || !isUUID(uuidComponent.uuid))) {
        uuidComponent.error = uuidComponent.error || "UUID is not valid.";
      }
      return uuidComponent;
    }
    function urnuuidSerialize(uuidComponent) {
      const urnComponent = uuidComponent;
      urnComponent.nss = (uuidComponent.uuid || "").toLowerCase();
      return urnComponent;
    }
    var http = (
      /** @type {SchemeHandler} */
      {
        scheme: "http",
        domainHost: true,
        parse: httpParse,
        serialize: httpSerialize
      }
    );
    var https = (
      /** @type {SchemeHandler} */
      {
        scheme: "https",
        domainHost: http.domainHost,
        parse: httpParse,
        serialize: httpSerialize
      }
    );
    var ws = (
      /** @type {SchemeHandler} */
      {
        scheme: "ws",
        domainHost: true,
        parse: wsParse,
        serialize: wsSerialize
      }
    );
    var wss = (
      /** @type {SchemeHandler} */
      {
        scheme: "wss",
        domainHost: ws.domainHost,
        parse: ws.parse,
        serialize: ws.serialize
      }
    );
    var urn = (
      /** @type {SchemeHandler} */
      {
        scheme: "urn",
        parse: urnParse,
        serialize: urnSerialize,
        skipNormalize: true
      }
    );
    var urnuuid = (
      /** @type {SchemeHandler} */
      {
        scheme: "urn:uuid",
        parse: urnuuidParse,
        serialize: urnuuidSerialize,
        skipNormalize: true
      }
    );
    var SCHEMES = (
      /** @type {Record<SchemeName, SchemeHandler>} */
      {
        http,
        https,
        ws,
        wss,
        urn,
        "urn:uuid": urnuuid
      }
    );
    Object.setPrototypeOf(SCHEMES, null);
    function getSchemeHandler(scheme) {
      return scheme && (SCHEMES[
        /** @type {SchemeName} */
        scheme
      ] || SCHEMES[
        /** @type {SchemeName} */
        scheme.toLowerCase()
      ]) || void 0;
    }
    module.exports = {
      wsIsSecure,
      SCHEMES,
      isValidSchemeName,
      getSchemeHandler
    };
  }
});

// node_modules/fast-uri/index.js
var require_fast_uri = __commonJS({
  "node_modules/fast-uri/index.js"(exports, module) {
    "use strict";
    var { normalizeIPv6, removeDotSegments, recomposeAuthority, normalizePercentEncoding, normalizePathEncoding, serializePathEncoding, normalizeQueryFragmentEncoding, encodeQuery, encodeFragment, reescapeHostDelimiters, isIPv4, nonSimpleDomain } = require_utils();
    var { SCHEMES, getSchemeHandler } = require_schemes();
    var VALID_SCHEME = /^[A-Za-z][A-Za-z0-9+.-]*$/u;
    var MALFORMED_SCHEME_ERROR = "URI scheme is malformed.";
    function decodeValidScheme(scheme) {
      const decodedScheme = unescape(String(scheme));
      if (!VALID_SCHEME.test(decodedScheme)) {
        throw new TypeError(MALFORMED_SCHEME_ERROR);
      }
      return decodedScheme;
    }
    function normalize(uri, options) {
      if (typeof uri === "string") {
        uri = /** @type {T} */
        normalizeString(uri, options);
      } else if (typeof uri === "object") {
        uri = /** @type {T} */
        parse(serialize(uri, options), options);
      }
      return uri;
    }
    function resolve2(baseURI, relativeURI, options) {
      const schemelessOptions = options ? Object.assign({ scheme: "null" }, options) : { scheme: "null" };
      const {
        parsed: baseParsed,
        malformedAuthorityOrPort: baseMalformed,
        malformedPercentEncoding: baseMalformedPercentEncoding,
        malformedSchemeSpecific: baseMalformedSchemeSpecific,
        malformedHost: baseMalformedHost,
        malformedScheme: baseMalformedScheme
      } = parseWithStatus(baseURI, schemelessOptions);
      const {
        parsed: relativeParsed,
        malformedAuthorityOrPort: relativeMalformed,
        malformedPercentEncoding: relativeMalformedPercentEncoding,
        malformedSchemeSpecific: relativeMalformedSchemeSpecific,
        malformedHost: relativeMalformedHost,
        malformedScheme: relativeMalformedScheme
      } = parseWithStatus(relativeURI, schemelessOptions);
      if (baseMalformed || relativeMalformed || baseMalformedPercentEncoding || relativeMalformedPercentEncoding || baseMalformedSchemeSpecific || relativeMalformedSchemeSpecific || baseMalformedHost || relativeMalformedHost || baseMalformedScheme || relativeMalformedScheme) {
        throw new Error(baseParsed.error || relativeParsed.error || "URI is malformed.");
      }
      const resolved = resolveComponent(baseParsed, relativeParsed, schemelessOptions, true);
      const resolvedSchemeHandler = getSchemeHandler(options && options.scheme || resolved.scheme);
      const resolvedHost = resolved.host;
      const resolvedHostIsIP = resolvedHost !== void 0 && resolvedHost !== "" && (isIPv4(resolvedHost) || normalizeIPv6(resolvedHost).isIPV6);
      canonicalizeHost(resolved, options || {}, resolvedSchemeHandler, resolvedHostIsIP);
      const encodedASCIIHost = resolvedHost && resolvedHost.indexOf("%") !== -1 && !new RegExp("\\P{ASCII}", "u").test(resolvedHost);
      if (resolved.error && !encodedASCIIHost) {
        throw new Error(resolved.error);
      }
      schemelessOptions.skipEscape = true;
      return serialize(resolved, schemelessOptions);
    }
    function resolveComponent(base, relative3, options, skipNormalization) {
      const target = {};
      if (!skipNormalization) {
        base = parse(serialize(base, options), options);
        relative3 = parse(serialize(relative3, options), options);
      }
      options = options || {};
      if (!options.tolerant && relative3.scheme) {
        target.scheme = relative3.scheme;
        target.userinfo = relative3.userinfo;
        target.host = relative3.host;
        target.port = relative3.port;
        target.path = removeDotSegments(relative3.path || "");
        target.query = relative3.query;
      } else {
        if (relative3.userinfo !== void 0 || relative3.host !== void 0 || relative3.port !== void 0) {
          target.userinfo = relative3.userinfo;
          target.host = relative3.host;
          target.port = relative3.port;
          target.path = removeDotSegments(relative3.path || "");
          target.query = relative3.query;
        } else {
          if (!relative3.path) {
            target.path = base.path;
            if (relative3.query !== void 0) {
              target.query = relative3.query;
            } else {
              target.query = base.query;
            }
          } else {
            if (relative3.path[0] === "/") {
              target.path = removeDotSegments(relative3.path);
            } else {
              if ((base.userinfo !== void 0 || base.host !== void 0 || base.port !== void 0) && !base.path) {
                target.path = "/" + relative3.path;
              } else if (!base.path) {
                target.path = relative3.path;
              } else {
                target.path = base.path.slice(0, base.path.lastIndexOf("/") + 1) + relative3.path;
              }
              target.path = removeDotSegments(target.path);
            }
            target.query = relative3.query;
          }
          target.userinfo = base.userinfo;
          target.host = base.host;
          target.port = base.port;
        }
        target.scheme = base.scheme;
      }
      target.fragment = relative3.fragment;
      return target;
    }
    function equal(uriA, uriB, options) {
      const normalizedA = normalizeComparableURI(uriA, options);
      const normalizedB = normalizeComparableURI(uriB, options);
      return normalizedA !== void 0 && normalizedB !== void 0 && normalizedA === normalizedB;
    }
    function serialize(cmpts, opts) {
      const component = {
        host: cmpts.host,
        scheme: cmpts.scheme,
        userinfo: cmpts.userinfo,
        port: cmpts.port,
        path: cmpts.path,
        query: cmpts.query,
        nid: cmpts.nid,
        nss: cmpts.nss,
        uuid: cmpts.uuid,
        fragment: cmpts.fragment,
        reference: cmpts.reference,
        resourceName: cmpts.resourceName,
        secure: cmpts.secure,
        error: ""
      };
      const options = Object.assign({}, opts);
      const uriTokens = [];
      if (component.scheme) {
        component.scheme = decodeValidScheme(component.scheme);
      }
      const schemeHandler = getSchemeHandler(options.scheme || component.scheme);
      if (schemeHandler && schemeHandler.serialize) schemeHandler.serialize(component, options);
      const hasAuthority = component.userinfo !== void 0 || component.host !== void 0 || component.port !== void 0;
      const pathNoScheme = !options.skipEscape && component.scheme === void 0 && !hasAuthority;
      if (component.path !== void 0) {
        if (!options.skipEscape) {
          component.path = serializePathEncoding(component.path, pathNoScheme);
        } else {
          component.path = normalizePercentEncoding(component.path);
        }
      }
      if (options.reference !== "suffix" && component.scheme) {
        component.scheme = decodeValidScheme(component.scheme);
        uriTokens.push(component.scheme, ":");
      }
      const authority = recomposeAuthority(component);
      if (authority !== void 0) {
        if (options.reference !== "suffix") {
          uriTokens.push("//");
        }
        uriTokens.push(authority);
        if (component.path && component.path[0] !== "/") {
          uriTokens.push("/");
        }
      }
      if (component.path !== void 0) {
        let s = component.path;
        if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) {
          s = removeDotSegments(s);
        }
        if (pathNoScheme) {
          s = serializePathEncoding(s, true);
        }
        if (authority === void 0 && s[0] === "/" && s[1] === "/") {
          s = "/%2F" + s.slice(2);
        }
        uriTokens.push(s);
      }
      if (component.query !== void 0) {
        uriTokens.push("?", encodeQuery(component.query));
      }
      if (component.fragment !== void 0) {
        uriTokens.push("#", encodeFragment(component.fragment));
      }
      return uriTokens.join("");
    }
    var URI_PARSE = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
    var AUTHORITY_PREFIX = /^(?:[^#/:?]+:)?\/\/([^/?#]*)/;
    var AUTHORITY_INTRODUCER_REGION = /^(?:[^#/:?]+:)?([/\\\t\n\r]*)/;
    function getParseError(parsed, matches) {
      if (matches[2] !== void 0 && parsed.path && parsed.path[0] !== "/") {
        return 'URI path must start with "/" when authority is present.';
      }
      if (typeof parsed.port === "number" && (parsed.port < 0 || parsed.port > 65535)) {
        return "URI port is malformed.";
      }
      return void 0;
    }
    function hasMalformedPercentEncoding(component) {
      if (component === void 0) return false;
      let percent = component.indexOf("%");
      while (percent !== -1) {
        if (percent + 2 >= component.length || !/^[\da-f]{2}$/iu.test(component.slice(percent + 1, percent + 3))) {
          return true;
        }
        percent = component.indexOf("%", percent + 3);
      }
      return false;
    }
    function isIPLiteral(host) {
      return host[0] === "[" && host[host.length - 1] === "]";
    }
    function hasMalformedComponentPercentEncoding(matches) {
      const host = matches[4];
      return hasMalformedPercentEncoding(matches[3]) || host !== void 0 && !isIPLiteral(host) && hasMalformedPercentEncoding(host) || hasMalformedPercentEncoding(matches[6]) || hasMalformedPercentEncoding(matches[7]) || hasMalformedPercentEncoding(matches[8]);
    }
    function canonicalizeHost(parsed, options, schemeHandler, isIP) {
      if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport) && parsed.host && !isIPLiteral(parsed.host) && (options.domainHost || schemeHandler && schemeHandler.domainHost) && isIP === false && nonSimpleDomain(parsed.host)) {
        try {
          parsed.host = new URL("http://" + parsed.host).hostname;
        } catch (e) {
          parsed.error = parsed.error || "Host's domain name can not be converted to ASCII: " + e;
          return true;
        }
      }
      return false;
    }
    function parseWithStatus(uri, opts) {
      const options = Object.assign({}, opts);
      const parsed = {
        scheme: void 0,
        userinfo: void 0,
        host: "",
        port: void 0,
        path: "",
        query: void 0,
        fragment: void 0
      };
      let malformedAuthorityOrPort = false;
      let malformedPercentEncoding = false;
      let malformedSchemeSpecific = false;
      let malformedHost = false;
      let malformedIPLiteral = false;
      let malformedScheme = false;
      let isIP = false;
      if (options.reference === "suffix") {
        if (options.scheme) {
          uri = options.scheme + ":" + uri;
        } else {
          uri = "//" + uri;
        }
      }
      const authorityMatch = uri.match(AUTHORITY_PREFIX);
      if (authorityMatch !== null && authorityMatch[1].indexOf("\\") !== -1) {
        parsed.error = "URI authority must not contain a literal backslash.";
        malformedAuthorityOrPort = true;
      }
      const introducerMatch = uri.match(AUTHORITY_INTRODUCER_REGION);
      if (introducerMatch !== null) {
        const region = introducerMatch[1];
        const normalizedRegion = region.replace(/[\t\n\r]/g, "");
        if (normalizedRegion.length >= 2) {
          if (normalizedRegion.slice(0, 2) !== "//") {
            parsed.error = parsed.error || "URI authority must not contain a literal backslash.";
            malformedAuthorityOrPort = true;
          } else if (region.length !== normalizedRegion.length) {
            parsed.error = parsed.error || "URI authority introducer must not contain whitespace.";
            malformedAuthorityOrPort = true;
          }
        }
      }
      const matches = uri.match(URI_PARSE);
      if (matches) {
        parsed.scheme = matches[1];
        parsed.userinfo = matches[3];
        parsed.host = matches[4];
        parsed.port = parseInt(matches[5], 10);
        parsed.path = matches[6] || "";
        parsed.query = matches[7];
        parsed.fragment = matches[8];
        if (parsed.scheme !== void 0) {
          const decodedScheme = unescape(parsed.scheme);
          if (VALID_SCHEME.test(decodedScheme)) {
            parsed.scheme = decodedScheme.toLowerCase();
          } else {
            parsed.error = parsed.error || MALFORMED_SCHEME_ERROR;
            malformedScheme = true;
          }
        }
        malformedPercentEncoding = hasMalformedComponentPercentEncoding(matches);
        if (malformedPercentEncoding) {
          parsed.error = parsed.error || "URI contains malformed percent-encoding.";
        }
        if (isNaN(parsed.port)) {
          parsed.port = matches[5];
        }
        const parseError = getParseError(parsed, matches);
        if (parseError !== void 0) {
          parsed.error = parsed.error || parseError;
          malformedAuthorityOrPort = true;
        }
        if (parsed.host) {
          const ipv4result = isIPv4(parsed.host);
          if (ipv4result === false) {
            const bracketedIPLiteral = isIPLiteral(parsed.host);
            const hasIPLiteralBracket = parsed.host.indexOf("[") !== -1 || parsed.host.indexOf("]") !== -1;
            const ipv6result = normalizeIPv6(parsed.host);
            isIP = ipv6result.isIPV6 || ipv6result.isIPVFuture === true;
            malformedIPLiteral = hasIPLiteralBracket && (!bracketedIPLiteral || ipv6result.error === true);
            parsed.host = isIP ? ipv6result.host : ipv6result.host.toLowerCase();
            if (malformedIPLiteral) {
              parsed.error = parsed.error || "URI host is malformed.";
              malformedAuthorityOrPort = true;
            }
          } else {
            isIP = true;
          }
        }
        if (parsed.scheme === void 0 && parsed.userinfo === void 0 && parsed.host === void 0 && parsed.port === void 0 && parsed.query === void 0 && !parsed.path) {
          parsed.reference = "same-document";
        } else if (parsed.scheme === void 0) {
          parsed.reference = "relative";
        } else if (parsed.fragment === void 0) {
          parsed.reference = "absolute";
        } else {
          parsed.reference = "uri";
        }
        if (options.reference && options.reference !== "suffix" && options.reference !== parsed.reference) {
          parsed.error = parsed.error || "URI is not a " + options.reference + " reference.";
        }
        const schemeHandler = getSchemeHandler(options.scheme || parsed.scheme);
        if (!malformedIPLiteral) {
          malformedHost = canonicalizeHost(parsed, options, schemeHandler, isIP);
        }
        if (uri.indexOf("%") !== -1 && parsed.host !== void 0 && !malformedIPLiteral) {
          let host = isIP ? parsed.host : normalizePercentEncoding(parsed.host, true);
          if (!isIP) {
            host = normalizePercentEncoding(host.toLowerCase());
          }
          parsed.host = reescapeHostDelimiters(host, isIP);
        }
        if (!schemeHandler || schemeHandler && !schemeHandler.skipNormalize) {
          if (parsed.path) {
            parsed.path = normalizePathEncoding(parsed.path);
          }
          if (parsed.query) {
            parsed.query = normalizeQueryFragmentEncoding(parsed.query);
          }
          if (parsed.fragment) {
            parsed.fragment = normalizeQueryFragmentEncoding(parsed.fragment);
          }
        }
        if (schemeHandler && schemeHandler.parse) {
          schemeHandler.parse(parsed, options);
          if (schemeHandler === SCHEMES.urn && parsed.nid === void 0) {
            malformedSchemeSpecific = true;
          }
        }
      } else {
        parsed.error = parsed.error || "URI can not be parsed.";
      }
      return { parsed, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme };
    }
    function parse(uri, opts) {
      return parseWithStatus(uri, opts).parsed;
    }
    function normalizeString(uri, opts) {
      return normalizeStringWithStatus(uri, opts).normalized;
    }
    function normalizeStringWithStatus(uri, opts) {
      const { parsed, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme } = parseWithStatus(uri, opts);
      return {
        normalized: malformedAuthorityOrPort || malformedPercentEncoding || malformedSchemeSpecific || malformedHost || malformedScheme ? uri : serialize(parsed, opts),
        malformedAuthorityOrPort,
        malformedPercentEncoding,
        malformedSchemeSpecific,
        malformedHost,
        malformedScheme
      };
    }
    function normalizeComparableURI(uri, opts) {
      if (typeof uri !== "string" && typeof uri !== "object") {
        return void 0;
      }
      let value;
      try {
        value = typeof uri === "string" ? uri : serialize(uri, opts);
      } catch {
        return void 0;
      }
      const { normalized, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme } = normalizeStringWithStatus(value, opts);
      return malformedAuthorityOrPort || malformedPercentEncoding || malformedSchemeSpecific || malformedHost || malformedScheme ? void 0 : normalized;
    }
    var fastUri = {
      SCHEMES,
      normalize,
      resolve: resolve2,
      resolveComponent,
      equal,
      serialize,
      parse
    };
    module.exports = fastUri;
    module.exports.default = fastUri;
    module.exports.fastUri = fastUri;
  }
});

// packages/contracts/node_modules/ajv/dist/runtime/uri.js
var require_uri = __commonJS({
  "packages/contracts/node_modules/ajv/dist/runtime/uri.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var uri = require_fast_uri();
    uri.code = 'require("ajv/dist/runtime/uri").default';
    exports.default = uri;
  }
});

// packages/contracts/node_modules/ajv/dist/core.js
var require_core = __commonJS({
  "packages/contracts/node_modules/ajv/dist/core.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
    var validate_1 = require_validate();
    Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
    var validation_error_1 = require_validation_error();
    var ref_error_1 = require_ref_error();
    var rules_1 = require_rules();
    var compile_1 = require_compile();
    var codegen_2 = require_codegen();
    var resolve_1 = require_resolve();
    var dataType_1 = require_dataType();
    var util_1 = require_util();
    var $dataRefSchema = require_data();
    var uri_1 = require_uri();
    var defaultRegExp = (str2, flags) => new RegExp(str2, flags);
    defaultRegExp.code = "new RegExp";
    var META_IGNORE_OPTIONS = ["removeAdditional", "useDefaults", "coerceTypes"];
    var EXT_SCOPE_NAMES = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]);
    var removedOptions = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    };
    var deprecatedOptions = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    };
    var MAX_EXPRESSION = 200;
    function requiredOptions(o) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
      const s = o.strict;
      const _optz = (_a = o.code) === null || _a === void 0 ? void 0 : _a.optimize;
      const optimize = _optz === true || _optz === void 0 ? 1 : _optz || 0;
      const regExp = (_c = (_b = o.code) === null || _b === void 0 ? void 0 : _b.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
      const uriResolver = (_d = o.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
      return {
        strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !== null && _f !== void 0 ? _f : true,
        strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !== null && _h !== void 0 ? _h : true,
        strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !== null && _k !== void 0 ? _k : "log",
        strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !== null && _m !== void 0 ? _m : "log",
        strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !== null && _p !== void 0 ? _p : false,
        code: o.code ? { ...o.code, optimize, regExp } : { optimize, regExp },
        loopRequired: (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
        loopEnum: (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
        meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
        messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
        inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
        schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : "$id",
        addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
        validateSchema: (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
        validateFormats: (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
        unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
        int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
        uriResolver
      };
    }
    var Ajv = class {
      constructor(opts = {}) {
        this.schemas = {};
        this.refs = {};
        this.formats = /* @__PURE__ */ Object.create(null);
        this._compilations = /* @__PURE__ */ new Set();
        this._loading = {};
        this._cache = /* @__PURE__ */ new Map();
        opts = this.opts = { ...opts, ...requiredOptions(opts) };
        const { es5, lines: lines2 } = this.opts.code;
        this.scope = new codegen_2.ValueScope({ scope: {}, prefixes: EXT_SCOPE_NAMES, es5, lines: lines2 });
        this.logger = getLogger(opts.logger);
        const formatOpt = opts.validateFormats;
        opts.validateFormats = false;
        this.RULES = (0, rules_1.getRules)();
        checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
        checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
        this._metaOpts = getMetaSchemaOptions.call(this);
        if (opts.formats)
          addInitialFormats.call(this);
        this._addVocabularies();
        this._addDefaultMetaSchema();
        if (opts.keywords)
          addInitialKeywords.call(this, opts.keywords);
        if (typeof opts.meta == "object")
          this.addMetaSchema(opts.meta);
        addInitialSchemas.call(this);
        opts.validateFormats = formatOpt;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data, meta, schemaId } = this.opts;
        let _dataRefSchema = $dataRefSchema;
        if (schemaId === "id") {
          _dataRefSchema = { ...$dataRefSchema };
          _dataRefSchema.id = _dataRefSchema.$id;
          delete _dataRefSchema.$id;
        }
        if (meta && $data)
          this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
      }
      defaultMeta() {
        const { meta, schemaId } = this.opts;
        return this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : void 0;
      }
      validate(schemaKeyRef, data) {
        let v;
        if (typeof schemaKeyRef == "string") {
          v = this.getSchema(schemaKeyRef);
          if (!v)
            throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
        } else {
          v = this.compile(schemaKeyRef);
        }
        const valid = v(data);
        if (!("$async" in v))
          this.errors = v.errors;
        return valid;
      }
      compile(schema, _meta) {
        const sch = this._addSchema(schema, _meta);
        return sch.validate || this._compileSchemaEnv(sch);
      }
      compileAsync(schema, meta) {
        if (typeof this.opts.loadSchema != "function") {
          throw new Error("options.loadSchema should be a function");
        }
        const { loadSchema } = this.opts;
        return runCompileAsync.call(this, schema, meta);
        async function runCompileAsync(_schema, _meta) {
          await loadMetaSchema.call(this, _schema.$schema);
          const sch = this._addSchema(_schema, _meta);
          return sch.validate || _compileAsync.call(this, sch);
        }
        async function loadMetaSchema($ref) {
          if ($ref && !this.getSchema($ref)) {
            await runCompileAsync.call(this, { $ref }, true);
          }
        }
        async function _compileAsync(sch) {
          try {
            return this._compileSchemaEnv(sch);
          } catch (e) {
            if (!(e instanceof ref_error_1.default))
              throw e;
            checkLoaded.call(this, e);
            await loadMissingSchema.call(this, e.missingSchema);
            return _compileAsync.call(this, sch);
          }
        }
        function checkLoaded({ missingSchema: ref, missingRef }) {
          if (this.refs[ref]) {
            throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
          }
        }
        async function loadMissingSchema(ref) {
          const _schema = await _loadSchema.call(this, ref);
          if (!this.refs[ref])
            await loadMetaSchema.call(this, _schema.$schema);
          if (!this.refs[ref])
            this.addSchema(_schema, ref, meta);
        }
        async function _loadSchema(ref) {
          const p = this._loading[ref];
          if (p)
            return p;
          try {
            return await (this._loading[ref] = loadSchema(ref));
          } finally {
            delete this._loading[ref];
          }
        }
      }
      // Adds schema to the instance
      addSchema(schema, key, _meta, _validateSchema = this.opts.validateSchema) {
        if (Array.isArray(schema)) {
          for (const sch of schema)
            this.addSchema(sch, void 0, _meta, _validateSchema);
          return this;
        }
        let id;
        if (typeof schema === "object") {
          const { schemaId } = this.opts;
          id = schema[schemaId];
          if (id !== void 0 && typeof id != "string") {
            throw new Error(`schema ${schemaId} must be string`);
          }
        }
        key = (0, resolve_1.normalizeId)(key || id);
        this._checkUnique(key);
        this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
        return this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(schema, key, _validateSchema = this.opts.validateSchema) {
        this.addSchema(schema, key, true, _validateSchema);
        return this;
      }
      //  Validate schema against its meta-schema
      validateSchema(schema, throwOrLogError) {
        if (typeof schema == "boolean")
          return true;
        let $schema;
        $schema = schema.$schema;
        if ($schema !== void 0 && typeof $schema != "string") {
          throw new Error("$schema must be a string");
        }
        $schema = $schema || this.opts.defaultMeta || this.defaultMeta();
        if (!$schema) {
          this.logger.warn("meta-schema not available");
          this.errors = null;
          return true;
        }
        const valid = this.validate($schema, schema);
        if (!valid && throwOrLogError) {
          const message = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(message);
          else
            throw new Error(message);
        }
        return valid;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(keyRef) {
        let sch;
        while (typeof (sch = getSchEnv.call(this, keyRef)) == "string")
          keyRef = sch;
        if (sch === void 0) {
          const { schemaId } = this.opts;
          const root2 = new compile_1.SchemaEnv({ schema: {}, schemaId });
          sch = compile_1.resolveSchema.call(this, root2, keyRef);
          if (!sch)
            return;
          this.refs[keyRef] = sch;
        }
        return sch.validate || this._compileSchemaEnv(sch);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(schemaKeyRef) {
        if (schemaKeyRef instanceof RegExp) {
          this._removeAllSchemas(this.schemas, schemaKeyRef);
          this._removeAllSchemas(this.refs, schemaKeyRef);
          return this;
        }
        switch (typeof schemaKeyRef) {
          case "undefined":
            this._removeAllSchemas(this.schemas);
            this._removeAllSchemas(this.refs);
            this._cache.clear();
            return this;
          case "string": {
            const sch = getSchEnv.call(this, schemaKeyRef);
            if (typeof sch == "object")
              this._cache.delete(sch.schema);
            delete this.schemas[schemaKeyRef];
            delete this.refs[schemaKeyRef];
            return this;
          }
          case "object": {
            const cacheKey = schemaKeyRef;
            this._cache.delete(cacheKey);
            let id = schemaKeyRef[this.opts.schemaId];
            if (id) {
              id = (0, resolve_1.normalizeId)(id);
              delete this.schemas[id];
              delete this.refs[id];
            }
            return this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(definitions) {
        for (const def of definitions)
          this.addKeyword(def);
        return this;
      }
      addKeyword(kwdOrDef, def) {
        let keyword;
        if (typeof kwdOrDef == "string") {
          keyword = kwdOrDef;
          if (typeof def == "object") {
            this.logger.warn("these parameters are deprecated, see docs for addKeyword");
            def.keyword = keyword;
          }
        } else if (typeof kwdOrDef == "object" && def === void 0) {
          def = kwdOrDef;
          keyword = def.keyword;
          if (Array.isArray(keyword) && !keyword.length) {
            throw new Error("addKeywords: keyword must be string or non-empty array");
          }
        } else {
          throw new Error("invalid addKeywords parameters");
        }
        checkKeyword.call(this, keyword, def);
        if (!def) {
          (0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
          return this;
        }
        keywordMetaschema.call(this, def);
        const definition = {
          ...def,
          type: (0, dataType_1.getJSONTypes)(def.type),
          schemaType: (0, dataType_1.getJSONTypes)(def.schemaType)
        };
        (0, util_1.eachItem)(keyword, definition.type.length === 0 ? (k) => addRule.call(this, k, definition) : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
        return this;
      }
      getKeyword(keyword) {
        const rule = this.RULES.all[keyword];
        return typeof rule == "object" ? rule.definition : !!rule;
      }
      // Remove keyword
      removeKeyword(keyword) {
        const { RULES } = this;
        delete RULES.keywords[keyword];
        delete RULES.all[keyword];
        for (const group of RULES.rules) {
          const i = group.rules.findIndex((rule) => rule.keyword === keyword);
          if (i >= 0)
            group.rules.splice(i, 1);
        }
        return this;
      }
      // Add format
      addFormat(name, format) {
        if (typeof format == "string")
          format = new RegExp(format);
        this.formats[name] = format;
        return this;
      }
      errorsText(errors = this.errors, { separator = ", ", dataVar = "data" } = {}) {
        if (!errors || errors.length === 0)
          return "No errors";
        return errors.map((e) => `${dataVar}${e.instancePath} ${e.message}`).reduce((text2, msg) => text2 + separator + msg);
      }
      $dataMetaSchema(metaSchema, keywordsJsonPointers) {
        const rules = this.RULES.all;
        metaSchema = JSON.parse(JSON.stringify(metaSchema));
        for (const jsonPointer of keywordsJsonPointers) {
          const segments = jsonPointer.split("/").slice(1);
          let keywords = metaSchema;
          for (const seg of segments)
            keywords = keywords[seg];
          for (const key in rules) {
            const rule = rules[key];
            if (typeof rule != "object")
              continue;
            const { $data } = rule.definition;
            const schema = keywords[key];
            if ($data && schema)
              keywords[key] = schemaOrData(schema);
          }
        }
        return metaSchema;
      }
      _removeAllSchemas(schemas, regex) {
        for (const keyRef in schemas) {
          const sch = schemas[keyRef];
          if (!regex || regex.test(keyRef)) {
            if (typeof sch == "string") {
              delete schemas[keyRef];
            } else if (sch && !sch.meta) {
              this._cache.delete(sch.schema);
              delete schemas[keyRef];
            }
          }
        }
      }
      _addSchema(schema, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
        let id;
        const { schemaId } = this.opts;
        if (typeof schema == "object") {
          id = schema[schemaId];
        } else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          else if (typeof schema != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let sch = this._cache.get(schema);
        if (sch !== void 0)
          return sch;
        baseId = (0, resolve_1.normalizeId)(id || baseId);
        const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId);
        sch = new compile_1.SchemaEnv({ schema, schemaId, meta, baseId, localRefs });
        this._cache.set(sch.schema, sch);
        if (addSchema && !baseId.startsWith("#")) {
          if (baseId)
            this._checkUnique(baseId);
          this.refs[baseId] = sch;
        }
        if (validateSchema)
          this.validateSchema(schema, true);
        return sch;
      }
      _checkUnique(id) {
        if (this.schemas[id] || this.refs[id]) {
          throw new Error(`schema with key or id "${id}" already exists`);
        }
      }
      _compileSchemaEnv(sch) {
        if (sch.meta)
          this._compileMetaSchema(sch);
        else
          compile_1.compileSchema.call(this, sch);
        if (!sch.validate)
          throw new Error("ajv implementation error");
        return sch.validate;
      }
      _compileMetaSchema(sch) {
        const currentOpts = this.opts;
        this.opts = this._metaOpts;
        try {
          compile_1.compileSchema.call(this, sch);
        } finally {
          this.opts = currentOpts;
        }
      }
    };
    Ajv.ValidationError = validation_error_1.default;
    Ajv.MissingRefError = ref_error_1.default;
    exports.default = Ajv;
    function checkOptions(checkOpts, options, msg, log = "error") {
      for (const key in checkOpts) {
        const opt = key;
        if (opt in options)
          this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
      }
    }
    function getSchEnv(keyRef) {
      keyRef = (0, resolve_1.normalizeId)(keyRef);
      return this.schemas[keyRef] || this.refs[keyRef];
    }
    function addInitialSchemas() {
      const optsSchemas = this.opts.schemas;
      if (!optsSchemas)
        return;
      if (Array.isArray(optsSchemas))
        this.addSchema(optsSchemas);
      else
        for (const key in optsSchemas)
          this.addSchema(optsSchemas[key], key);
    }
    function addInitialFormats() {
      for (const name in this.opts.formats) {
        const format = this.opts.formats[name];
        if (format)
          this.addFormat(name, format);
      }
    }
    function addInitialKeywords(defs) {
      if (Array.isArray(defs)) {
        this.addVocabulary(defs);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const keyword in defs) {
        const def = defs[keyword];
        if (!def.keyword)
          def.keyword = keyword;
        this.addKeyword(def);
      }
    }
    function getMetaSchemaOptions() {
      const metaOpts = { ...this.opts };
      for (const opt of META_IGNORE_OPTIONS)
        delete metaOpts[opt];
      return metaOpts;
    }
    var noLogs = { log() {
    }, warn() {
    }, error() {
    } };
    function getLogger(logger) {
      if (logger === false)
        return noLogs;
      if (logger === void 0)
        return console;
      if (logger.log && logger.warn && logger.error)
        return logger;
      throw new Error("logger must implement log, warn and error methods");
    }
    var KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
    function checkKeyword(keyword, def) {
      const { RULES } = this;
      (0, util_1.eachItem)(keyword, (kwd) => {
        if (RULES.keywords[kwd])
          throw new Error(`Keyword ${kwd} is already defined`);
        if (!KEYWORD_NAME.test(kwd))
          throw new Error(`Keyword ${kwd} has invalid name`);
      });
      if (!def)
        return;
      if (def.$data && !("code" in def || "validate" in def)) {
        throw new Error('$data keyword must have "code" or "validate" function');
      }
    }
    function addRule(keyword, definition, dataType) {
      var _a;
      const post = definition === null || definition === void 0 ? void 0 : definition.post;
      if (dataType && post)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES } = this;
      let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
      if (!ruleGroup) {
        ruleGroup = { type: dataType, rules: [] };
        RULES.rules.push(ruleGroup);
      }
      RULES.keywords[keyword] = true;
      if (!definition)
        return;
      const rule = {
        keyword,
        definition: {
          ...definition,
          type: (0, dataType_1.getJSONTypes)(definition.type),
          schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType)
        }
      };
      if (definition.before)
        addBeforeRule.call(this, ruleGroup, rule, definition.before);
      else
        ruleGroup.rules.push(rule);
      RULES.all[keyword] = rule;
      (_a = definition.implements) === null || _a === void 0 ? void 0 : _a.forEach((kwd) => this.addKeyword(kwd));
    }
    function addBeforeRule(ruleGroup, rule, before) {
      const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
      if (i >= 0) {
        ruleGroup.rules.splice(i, 0, rule);
      } else {
        ruleGroup.rules.push(rule);
        this.logger.warn(`rule ${before} is not defined`);
      }
    }
    function keywordMetaschema(def) {
      let { metaSchema } = def;
      if (metaSchema === void 0)
        return;
      if (def.$data && this.opts.$data)
        metaSchema = schemaOrData(metaSchema);
      def.validateSchema = this.compile(metaSchema, true);
    }
    var $dataRef = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function schemaOrData(schema) {
      return { anyOf: [schema, $dataRef] };
    }
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/core/id.js
var require_id = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/core/id.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var def = {
      keyword: "id",
      code() {
        throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
      }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/core/ref.js
var require_ref = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/core/ref.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.callRef = exports.getValidate = void 0;
    var ref_error_1 = require_ref_error();
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var compile_1 = require_compile();
    var util_1 = require_util();
    var def = {
      keyword: "$ref",
      schemaType: "string",
      code(cxt) {
        const { gen, schema: $ref, it } = cxt;
        const { baseId, schemaEnv: env2, validateName, opts, self } = it;
        const { root: root2 } = env2;
        if (($ref === "#" || $ref === "#/") && baseId === root2.baseId)
          return callRootRef();
        const schOrEnv = compile_1.resolveRef.call(self, root2, baseId, $ref);
        if (schOrEnv === void 0)
          throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref);
        if (schOrEnv instanceof compile_1.SchemaEnv)
          return callValidate(schOrEnv);
        return inlineRefSchema(schOrEnv);
        function callRootRef() {
          if (env2 === root2)
            return callRef(cxt, validateName, env2, env2.$async);
          const rootName = gen.scopeValue("root", { ref: root2 });
          return callRef(cxt, (0, codegen_1._)`${rootName}.validate`, root2, root2.$async);
        }
        function callValidate(sch) {
          const v = getValidate(cxt, sch);
          callRef(cxt, v, sch, sch.$async);
        }
        function inlineRefSchema(sch) {
          const schName = gen.scopeValue("schema", opts.code.source === true ? { ref: sch, code: (0, codegen_1.stringify)(sch) } : { ref: sch });
          const valid = gen.name("valid");
          const schCxt = cxt.subschema({
            schema: sch,
            dataTypes: [],
            schemaPath: codegen_1.nil,
            topSchemaRef: schName,
            errSchemaPath: $ref
          }, valid);
          cxt.mergeEvaluated(schCxt);
          cxt.ok(valid);
        }
      }
    };
    function getValidate(cxt, sch) {
      const { gen } = cxt;
      return sch.validate ? gen.scopeValue("validate", { ref: sch.validate }) : (0, codegen_1._)`${gen.scopeValue("wrapper", { ref: sch })}.validate`;
    }
    exports.getValidate = getValidate;
    function callRef(cxt, v, sch, $async) {
      const { gen, it } = cxt;
      const { allErrors, schemaEnv: env2, opts } = it;
      const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
      if ($async)
        callAsyncRef();
      else
        callSyncRef();
      function callAsyncRef() {
        if (!env2.$async)
          throw new Error("async schema referenced by sync schema");
        const valid = gen.let("valid");
        gen.try(() => {
          gen.code((0, codegen_1._)`await ${(0, code_1.callValidateCode)(cxt, v, passCxt)}`);
          addEvaluatedFrom(v);
          if (!allErrors)
            gen.assign(valid, true);
        }, (e) => {
          gen.if((0, codegen_1._)`!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e));
          addErrorsFrom(e);
          if (!allErrors)
            gen.assign(valid, false);
        });
        cxt.ok(valid);
      }
      function callSyncRef() {
        cxt.result((0, code_1.callValidateCode)(cxt, v, passCxt), () => addEvaluatedFrom(v), () => addErrorsFrom(v));
      }
      function addErrorsFrom(source) {
        const errs = (0, codegen_1._)`${source}.errors`;
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`);
        gen.assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
      }
      function addEvaluatedFrom(source) {
        var _a;
        if (!it.opts.unevaluated)
          return;
        const schEvaluated = (_a = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a === void 0 ? void 0 : _a.evaluated;
        if (it.props !== true) {
          if (schEvaluated && !schEvaluated.dynamicProps) {
            if (schEvaluated.props !== void 0) {
              it.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it.props);
            }
          } else {
            const props = gen.var("props", (0, codegen_1._)`${source}.evaluated.props`);
            it.props = util_1.mergeEvaluated.props(gen, props, it.props, codegen_1.Name);
          }
        }
        if (it.items !== true) {
          if (schEvaluated && !schEvaluated.dynamicItems) {
            if (schEvaluated.items !== void 0) {
              it.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it.items);
            }
          } else {
            const items = gen.var("items", (0, codegen_1._)`${source}.evaluated.items`);
            it.items = util_1.mergeEvaluated.items(gen, items, it.items, codegen_1.Name);
          }
        }
      }
    }
    exports.callRef = callRef;
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/core/index.js
var require_core2 = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/core/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var id_1 = require_id();
    var ref_1 = require_ref();
    var core = [
      "$schema",
      "$id",
      "$defs",
      "$vocabulary",
      { keyword: "$comment" },
      "definitions",
      id_1.default,
      ref_1.default
    ];
    exports.default = core;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/validation/limitNumber.js
var require_limitNumber = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/validation/limitNumber.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var ops = codegen_1.operators;
    var KWDs = {
      maximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
      minimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
      exclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
      exclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
    };
    var error = {
      message: ({ keyword, schemaCode }) => (0, codegen_1.str)`must be ${KWDs[keyword].okStr} ${schemaCode}`,
      params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
    };
    var def = {
      keyword: Object.keys(KWDs),
      type: "number",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        cxt.fail$data((0, codegen_1._)`${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`);
      }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/validation/multipleOf.js
var require_multipleOf = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/validation/multipleOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must be multiple of ${schemaCode}`,
      params: ({ schemaCode }) => (0, codegen_1._)`{multipleOf: ${schemaCode}}`
    };
    var def = {
      keyword: "multipleOf",
      type: "number",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, schemaCode, it } = cxt;
        const prec = it.opts.multipleOfPrecision;
        const res = gen.let("res");
        const invalid = prec ? (0, codegen_1._)`Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}` : (0, codegen_1._)`${res} !== parseInt(${res})`;
        cxt.fail$data((0, codegen_1._)`(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
      }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length = __commonJS({
  "packages/contracts/node_modules/ajv/dist/runtime/ucs2length.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ucs2length(str2) {
      const len = str2.length;
      let length = 0;
      let pos = 0;
      let value;
      while (pos < len) {
        length++;
        value = str2.charCodeAt(pos++);
        if (value >= 55296 && value <= 56319 && pos < len) {
          value = str2.charCodeAt(pos);
          if ((value & 64512) === 56320)
            pos++;
        }
      }
      return length;
    }
    exports.default = ucs2length;
    ucs2length.code = 'require("ajv/dist/runtime/ucs2length").default';
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/validation/limitLength.js
var require_limitLength = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/validation/limitLength.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var ucs2length_1 = require_ucs2length();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxLength" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} characters`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxLength", "minLength"],
      type: "string",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode, it } = cxt;
        const op = keyword === "maxLength" ? codegen_1.operators.GT : codegen_1.operators.LT;
        const len = it.opts.unicode === false ? (0, codegen_1._)`${data}.length` : (0, codegen_1._)`${(0, util_1.useFunc)(cxt.gen, ucs2length_1.default)}(${data})`;
        cxt.fail$data((0, codegen_1._)`${len} ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/validation/pattern.js
var require_pattern = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/validation/pattern.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var util_1 = require_util();
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must match pattern "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{pattern: ${schemaCode}}`
    };
    var def = {
      keyword: "pattern",
      type: "string",
      schemaType: "string",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        const u = it.opts.unicodeRegExp ? "u" : "";
        if ($data) {
          const { regExp } = it.opts.code;
          const regExpCode = regExp.code === "new RegExp" ? (0, codegen_1._)`new RegExp` : (0, util_1.useFunc)(gen, regExp);
          const valid = gen.let("valid");
          gen.try(() => gen.assign(valid, (0, codegen_1._)`${regExpCode}(${schemaCode}, ${u}).test(${data})`), () => gen.assign(valid, false));
          cxt.fail$data((0, codegen_1._)`!${valid}`);
        } else {
          const regExp = (0, code_1.usePattern)(cxt, schema);
          cxt.fail$data((0, codegen_1._)`!${regExp}.test(${data})`);
        }
      }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/validation/limitProperties.js
var require_limitProperties = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/validation/limitProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxProperties" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} properties`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxProperties", "minProperties"],
      type: "object",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxProperties" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`Object.keys(${data}).length ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/validation/required.js
var require_required = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/validation/required.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { missingProperty } }) => (0, codegen_1.str)`must have required property '${missingProperty}'`,
      params: ({ params: { missingProperty } }) => (0, codegen_1._)`{missingProperty: ${missingProperty}}`
    };
    var def = {
      keyword: "required",
      type: "object",
      schemaType: "array",
      $data: true,
      error,
      code(cxt) {
        const { gen, schema, schemaCode, data, $data, it } = cxt;
        const { opts } = it;
        if (!$data && schema.length === 0)
          return;
        const useLoop = schema.length >= opts.loopRequired;
        if (it.allErrors)
          allErrorsMode();
        else
          exitOnErrorMode();
        if (opts.strictRequired) {
          const props = cxt.parentSchema.properties;
          const { definedProperties } = cxt.it;
          for (const requiredKey of schema) {
            if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === void 0 && !definedProperties.has(requiredKey)) {
              const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
              const msg = `required property "${requiredKey}" is not defined at "${schemaPath}" (strictRequired)`;
              (0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
            }
          }
        }
        function allErrorsMode() {
          if (useLoop || $data) {
            cxt.block$data(codegen_1.nil, loopAllRequired);
          } else {
            for (const prop of schema) {
              (0, code_1.checkReportMissingProp)(cxt, prop);
            }
          }
        }
        function exitOnErrorMode() {
          const missing = gen.let("missing");
          if (useLoop || $data) {
            const valid = gen.let("valid", true);
            cxt.block$data(valid, () => loopUntilMissing(missing, valid));
            cxt.ok(valid);
          } else {
            gen.if((0, code_1.checkMissingProp)(cxt, schema, missing));
            (0, code_1.reportMissingProp)(cxt, missing);
            gen.else();
          }
        }
        function loopAllRequired() {
          gen.forOf("prop", schemaCode, (prop) => {
            cxt.setParams({ missingProperty: prop });
            gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
          });
        }
        function loopUntilMissing(missing, valid) {
          cxt.setParams({ missingProperty: missing });
          gen.forOf(missing, schemaCode, () => {
            gen.assign(valid, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties));
            gen.if((0, codegen_1.not)(valid), () => {
              cxt.error();
              gen.break();
            });
          }, codegen_1.nil);
        }
      }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/validation/limitItems.js
var require_limitItems = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/validation/limitItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxItems" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} items`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxItems", "minItems"],
      type: "array",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxItems" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`${data}.length ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/runtime/equal.js
var require_equal = __commonJS({
  "packages/contracts/node_modules/ajv/dist/runtime/equal.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var equal = require_fast_deep_equal();
    equal.code = 'require("ajv/dist/runtime/equal").default';
    exports.default = equal;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/validation/uniqueItems.js
var require_uniqueItems = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/validation/uniqueItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dataType_1 = require_dataType();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error = {
      message: ({ params: { i, j } }) => (0, codegen_1.str)`must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
      params: ({ params: { i, j } }) => (0, codegen_1._)`{i: ${i}, j: ${j}}`
    };
    var def = {
      keyword: "uniqueItems",
      type: "array",
      schemaType: "boolean",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema, parentSchema, schemaCode, it } = cxt;
        if (!$data && !schema)
          return;
        const valid = gen.let("valid");
        const itemTypes = parentSchema.items ? (0, dataType_1.getSchemaTypes)(parentSchema.items) : [];
        cxt.block$data(valid, validateUniqueItems, (0, codegen_1._)`${schemaCode} === false`);
        cxt.ok(valid);
        function validateUniqueItems() {
          const i = gen.let("i", (0, codegen_1._)`${data}.length`);
          const j = gen.let("j");
          cxt.setParams({ i, j });
          gen.assign(valid, true);
          gen.if((0, codegen_1._)`${i} > 1`, () => (canOptimize() ? loopN : loopN2)(i, j));
        }
        function canOptimize() {
          return itemTypes.length > 0 && !itemTypes.some((t) => t === "object" || t === "array");
        }
        function loopN(i, j) {
          const item = gen.name("item");
          const wrongType = (0, dataType_1.checkDataTypes)(itemTypes, item, it.opts.strictNumbers, dataType_1.DataType.Wrong);
          const indices = gen.const("indices", (0, codegen_1._)`{}`);
          gen.for((0, codegen_1._)`;${i}--;`, () => {
            gen.let(item, (0, codegen_1._)`${data}[${i}]`);
            gen.if(wrongType, (0, codegen_1._)`continue`);
            if (itemTypes.length > 1)
              gen.if((0, codegen_1._)`typeof ${item} == "string"`, (0, codegen_1._)`${item} += "_"`);
            gen.if((0, codegen_1._)`typeof ${indices}[${item}] == "number"`, () => {
              gen.assign(j, (0, codegen_1._)`${indices}[${item}]`);
              cxt.error();
              gen.assign(valid, false).break();
            }).code((0, codegen_1._)`${indices}[${item}] = ${i}`);
          });
        }
        function loopN2(i, j) {
          const eql = (0, util_1.useFunc)(gen, equal_1.default);
          const outer = gen.name("outer");
          gen.label(outer).for((0, codegen_1._)`;${i}--;`, () => gen.for((0, codegen_1._)`${j} = ${i}; ${j}--;`, () => gen.if((0, codegen_1._)`${eql}(${data}[${i}], ${data}[${j}])`, () => {
            cxt.error();
            gen.assign(valid, false).break(outer);
          })));
        }
      }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/validation/const.js
var require_const = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/validation/const.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error = {
      message: "must be equal to constant",
      params: ({ schemaCode }) => (0, codegen_1._)`{allowedValue: ${schemaCode}}`
    };
    var def = {
      keyword: "const",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schemaCode, schema } = cxt;
        if ($data || schema && typeof schema == "object") {
          cxt.fail$data((0, codegen_1._)`!${(0, util_1.useFunc)(gen, equal_1.default)}(${data}, ${schemaCode})`);
        } else {
          cxt.fail((0, codegen_1._)`${schema} !== ${data}`);
        }
      }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/validation/enum.js
var require_enum = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/validation/enum.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error = {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode }) => (0, codegen_1._)`{allowedValues: ${schemaCode}}`
    };
    var def = {
      keyword: "enum",
      schemaType: "array",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        if (!$data && schema.length === 0)
          throw new Error("enum must have non-empty array");
        const useLoop = schema.length >= it.opts.loopEnum;
        let eql;
        const getEql = () => eql !== null && eql !== void 0 ? eql : eql = (0, util_1.useFunc)(gen, equal_1.default);
        let valid;
        if (useLoop || $data) {
          valid = gen.let("valid");
          cxt.block$data(valid, loopEnum);
        } else {
          if (!Array.isArray(schema))
            throw new Error("ajv implementation error");
          const vSchema = gen.const("vSchema", schemaCode);
          valid = (0, codegen_1.or)(...schema.map((_x, i) => equalCode(vSchema, i)));
        }
        cxt.pass(valid);
        function loopEnum() {
          gen.assign(valid, false);
          gen.forOf("v", schemaCode, (v) => gen.if((0, codegen_1._)`${getEql()}(${data}, ${v})`, () => gen.assign(valid, true).break()));
        }
        function equalCode(vSchema, i) {
          const sch = schema[i];
          return typeof sch === "object" && sch !== null ? (0, codegen_1._)`${getEql()}(${data}, ${vSchema}[${i}])` : (0, codegen_1._)`${data} === ${sch}`;
        }
      }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/validation/index.js
var require_validation = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/validation/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var limitNumber_1 = require_limitNumber();
    var multipleOf_1 = require_multipleOf();
    var limitLength_1 = require_limitLength();
    var pattern_1 = require_pattern();
    var limitProperties_1 = require_limitProperties();
    var required_1 = require_required();
    var limitItems_1 = require_limitItems();
    var uniqueItems_1 = require_uniqueItems();
    var const_1 = require_const();
    var enum_1 = require_enum();
    var validation = [
      // number
      limitNumber_1.default,
      multipleOf_1.default,
      // string
      limitLength_1.default,
      pattern_1.default,
      // object
      limitProperties_1.default,
      required_1.default,
      // array
      limitItems_1.default,
      uniqueItems_1.default,
      // any
      { keyword: "type", schemaType: ["string", "array"] },
      { keyword: "nullable", schemaType: "boolean" },
      const_1.default,
      enum_1.default
    ];
    exports.default = validation;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/applicator/additionalItems.js
var require_additionalItems = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/applicator/additionalItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateAdditionalItems = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "additionalItems",
      type: "array",
      schemaType: ["boolean", "object"],
      before: "uniqueItems",
      error,
      code(cxt) {
        const { parentSchema, it } = cxt;
        const { items } = parentSchema;
        if (!Array.isArray(items)) {
          (0, util_1.checkStrictMode)(it, '"additionalItems" is ignored when "items" is not an array of schemas');
          return;
        }
        validateAdditionalItems(cxt, items);
      }
    };
    function validateAdditionalItems(cxt, items) {
      const { gen, schema, data, keyword, it } = cxt;
      it.items = true;
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      if (schema === false) {
        cxt.setParams({ len: items.length });
        cxt.pass((0, codegen_1._)`${len} <= ${items.length}`);
      } else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
        const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items.length}`);
        gen.if((0, codegen_1.not)(valid), () => validateItems(valid));
        cxt.ok(valid);
      }
      function validateItems(valid) {
        gen.forRange("i", items.length, len, (i) => {
          cxt.subschema({ keyword, dataProp: i, dataPropType: util_1.Type.Num }, valid);
          if (!it.allErrors)
            gen.if((0, codegen_1.not)(valid), () => gen.break());
        });
      }
    }
    exports.validateAdditionalItems = validateAdditionalItems;
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/applicator/items.js
var require_items = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/applicator/items.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateTuple = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    var def = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "array", "boolean"],
      before: "uniqueItems",
      code(cxt) {
        const { schema, it } = cxt;
        if (Array.isArray(schema))
          return validateTuple(cxt, "additionalItems", schema);
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    function validateTuple(cxt, extraItems, schArr = cxt.schema) {
      const { gen, parentSchema, data, keyword, it } = cxt;
      checkStrictTuple(parentSchema);
      if (it.opts.unevaluated && schArr.length && it.items !== true) {
        it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items);
      }
      const valid = gen.name("valid");
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      schArr.forEach((sch, i) => {
        if ((0, util_1.alwaysValidSchema)(it, sch))
          return;
        gen.if((0, codegen_1._)`${len} > ${i}`, () => cxt.subschema({
          keyword,
          schemaProp: i,
          dataProp: i
        }, valid));
        cxt.ok(valid);
      });
      function checkStrictTuple(sch) {
        const { opts, errSchemaPath } = it;
        const l = schArr.length;
        const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false);
        if (opts.strictTuples && !fullTuple) {
          const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
          (0, util_1.checkStrictMode)(it, msg, opts.strictTuples);
        }
      }
    }
    exports.validateTuple = validateTuple;
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/applicator/prefixItems.js
var require_prefixItems = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/applicator/prefixItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var items_1 = require_items();
    var def = {
      keyword: "prefixItems",
      type: "array",
      schemaType: ["array"],
      before: "uniqueItems",
      code: (cxt) => (0, items_1.validateTuple)(cxt, "items")
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/applicator/items2020.js
var require_items2020 = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/applicator/items2020.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    var additionalItems_1 = require_additionalItems();
    var error = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      error,
      code(cxt) {
        const { schema, parentSchema, it } = cxt;
        const { prefixItems } = parentSchema;
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        if (prefixItems)
          (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
        else
          cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/applicator/contains.js
var require_contains = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/applicator/contains.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1.str)`must contain at least ${min} valid item(s)` : (0, codegen_1.str)`must contain at least ${min} and no more than ${max} valid item(s)`,
      params: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1._)`{minContains: ${min}}` : (0, codegen_1._)`{minContains: ${min}, maxContains: ${max}}`
    };
    var def = {
      keyword: "contains",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        let min;
        let max;
        const { minContains, maxContains } = parentSchema;
        if (it.opts.next) {
          min = minContains === void 0 ? 1 : minContains;
          max = maxContains;
        } else {
          min = 1;
        }
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        cxt.setParams({ min, max });
        if (max === void 0 && min === 0) {
          (0, util_1.checkStrictMode)(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
          return;
        }
        if (max !== void 0 && min > max) {
          (0, util_1.checkStrictMode)(it, `"minContains" > "maxContains" is always invalid`);
          cxt.fail();
          return;
        }
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          let cond = (0, codegen_1._)`${len} >= ${min}`;
          if (max !== void 0)
            cond = (0, codegen_1._)`${cond} && ${len} <= ${max}`;
          cxt.pass(cond);
          return;
        }
        it.items = true;
        const valid = gen.name("valid");
        if (max === void 0 && min === 1) {
          validateItems(valid, () => gen.if(valid, () => gen.break()));
        } else if (min === 0) {
          gen.let(valid, true);
          if (max !== void 0)
            gen.if((0, codegen_1._)`${data}.length > 0`, validateItemsWithCount);
        } else {
          gen.let(valid, false);
          validateItemsWithCount();
        }
        cxt.result(valid, () => cxt.reset());
        function validateItemsWithCount() {
          const schValid = gen.name("_valid");
          const count = gen.let("count", 0);
          validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
        }
        function validateItems(_valid, block) {
          gen.forRange("i", 0, len, (i) => {
            cxt.subschema({
              keyword: "contains",
              dataProp: i,
              dataPropType: util_1.Type.Num,
              compositeRule: true
            }, _valid);
            block();
          });
        }
        function checkLimits(count) {
          gen.code((0, codegen_1._)`${count}++`);
          if (max === void 0) {
            gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true).break());
          } else {
            gen.if((0, codegen_1._)`${count} > ${max}`, () => gen.assign(valid, false).break());
            if (min === 1)
              gen.assign(valid, true);
            else
              gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true));
          }
        }
      }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/applicator/dependencies.js
var require_dependencies = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/applicator/dependencies.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateSchemaDeps = exports.validatePropertyDeps = exports.error = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    exports.error = {
      message: ({ params: { property, depsCount, deps } }) => {
        const property_ies = depsCount === 1 ? "property" : "properties";
        return (0, codegen_1.str)`must have ${property_ies} ${deps} when property ${property} is present`;
      },
      params: ({ params: { property, depsCount, deps, missingProperty } }) => (0, codegen_1._)`{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`
      // TODO change to reference
    };
    var def = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: exports.error,
      code(cxt) {
        const [propDeps, schDeps] = splitDependencies(cxt);
        validatePropertyDeps(cxt, propDeps);
        validateSchemaDeps(cxt, schDeps);
      }
    };
    function splitDependencies({ schema }) {
      const propertyDeps = {};
      const schemaDeps = {};
      for (const key in schema) {
        if (key === "__proto__")
          continue;
        const deps = Array.isArray(schema[key]) ? propertyDeps : schemaDeps;
        deps[key] = schema[key];
      }
      return [propertyDeps, schemaDeps];
    }
    function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
      const { gen, data, it } = cxt;
      if (Object.keys(propertyDeps).length === 0)
        return;
      const missing = gen.let("missing");
      for (const prop in propertyDeps) {
        const deps = propertyDeps[prop];
        if (deps.length === 0)
          continue;
        const hasProperty = (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties);
        cxt.setParams({
          property: prop,
          depsCount: deps.length,
          deps: deps.join(", ")
        });
        if (it.allErrors) {
          gen.if(hasProperty, () => {
            for (const depProp of deps) {
              (0, code_1.checkReportMissingProp)(cxt, depProp);
            }
          });
        } else {
          gen.if((0, codegen_1._)`${hasProperty} && (${(0, code_1.checkMissingProp)(cxt, deps, missing)})`);
          (0, code_1.reportMissingProp)(cxt, missing);
          gen.else();
        }
      }
    }
    exports.validatePropertyDeps = validatePropertyDeps;
    function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      for (const prop in schemaDeps) {
        if ((0, util_1.alwaysValidSchema)(it, schemaDeps[prop]))
          continue;
        gen.if(
          (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties),
          () => {
            const schCxt = cxt.subschema({ keyword, schemaProp: prop }, valid);
            cxt.mergeValidEvaluated(schCxt, valid);
          },
          () => gen.var(valid, true)
          // TODO var
        );
        cxt.ok(valid);
      }
    }
    exports.validateSchemaDeps = validateSchemaDeps;
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/applicator/propertyNames.js
var require_propertyNames = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/applicator/propertyNames.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: "property name must be valid",
      params: ({ params }) => (0, codegen_1._)`{propertyName: ${params.propertyName}}`
    };
    var def = {
      keyword: "propertyNames",
      type: "object",
      schemaType: ["object", "boolean"],
      error,
      code(cxt) {
        const { gen, schema, data, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        const valid = gen.name("valid");
        gen.forIn("key", data, (key) => {
          cxt.setParams({ propertyName: key });
          cxt.subschema({
            keyword: "propertyNames",
            data: key,
            dataTypes: ["string"],
            propertyName: key,
            compositeRule: true
          }, valid);
          gen.if((0, codegen_1.not)(valid), () => {
            cxt.error(true);
            if (!it.allErrors)
              gen.break();
          });
        });
        cxt.ok(valid);
      }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js
var require_additionalProperties = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var util_1 = require_util();
    var error = {
      message: "must NOT have additional properties",
      params: ({ params }) => (0, codegen_1._)`{additionalProperty: ${params.additionalProperty}}`
    };
    var def = {
      keyword: "additionalProperties",
      type: ["object"],
      schemaType: ["boolean", "object"],
      allowUndefined: true,
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, data, errsCount, it } = cxt;
        if (!errsCount)
          throw new Error("ajv implementation error");
        const { allErrors, opts } = it;
        it.props = true;
        if (opts.removeAdditional !== "all" && (0, util_1.alwaysValidSchema)(it, schema))
          return;
        const props = (0, code_1.allSchemaProperties)(parentSchema.properties);
        const patProps = (0, code_1.allSchemaProperties)(parentSchema.patternProperties);
        checkAdditionalProperties();
        cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
        function checkAdditionalProperties() {
          gen.forIn("key", data, (key) => {
            if (!props.length && !patProps.length)
              additionalPropertyCode(key);
            else
              gen.if(isAdditional(key), () => additionalPropertyCode(key));
          });
        }
        function isAdditional(key) {
          let definedProp;
          if (props.length > 8) {
            const propsSchema = (0, util_1.schemaRefOrVal)(it, parentSchema.properties, "properties");
            definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key);
          } else if (props.length) {
            definedProp = (0, codegen_1.or)(...props.map((p) => (0, codegen_1._)`${key} === ${p}`));
          } else {
            definedProp = codegen_1.nil;
          }
          if (patProps.length) {
            definedProp = (0, codegen_1.or)(definedProp, ...patProps.map((p) => (0, codegen_1._)`${(0, code_1.usePattern)(cxt, p)}.test(${key})`));
          }
          return (0, codegen_1.not)(definedProp);
        }
        function deleteAdditional(key) {
          gen.code((0, codegen_1._)`delete ${data}[${key}]`);
        }
        function additionalPropertyCode(key) {
          if (opts.removeAdditional === "all" || opts.removeAdditional && schema === false) {
            deleteAdditional(key);
            return;
          }
          if (schema === false) {
            cxt.setParams({ additionalProperty: key });
            cxt.error();
            if (!allErrors)
              gen.break();
            return;
          }
          if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
            const valid = gen.name("valid");
            if (opts.removeAdditional === "failing") {
              applyAdditionalSchema(key, valid, false);
              gen.if((0, codegen_1.not)(valid), () => {
                cxt.reset();
                deleteAdditional(key);
              });
            } else {
              applyAdditionalSchema(key, valid);
              if (!allErrors)
                gen.if((0, codegen_1.not)(valid), () => gen.break());
            }
          }
        }
        function applyAdditionalSchema(key, valid, errors) {
          const subschema = {
            keyword: "additionalProperties",
            dataProp: key,
            dataPropType: util_1.Type.Str
          };
          if (errors === false) {
            Object.assign(subschema, {
              compositeRule: true,
              createErrors: false,
              allErrors: false
            });
          }
          cxt.subschema(subschema, valid);
        }
      }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/applicator/properties.js
var require_properties = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/applicator/properties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var validate_1 = require_validate();
    var code_1 = require_code2();
    var util_1 = require_util();
    var additionalProperties_1 = require_additionalProperties();
    var def = {
      keyword: "properties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === void 0) {
          additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
        }
        const allProps = (0, code_1.allSchemaProperties)(schema);
        for (const prop of allProps) {
          it.definedProperties.add(prop);
        }
        if (it.opts.unevaluated && allProps.length && it.props !== true) {
          it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props);
        }
        const properties = allProps.filter((p) => !(0, util_1.alwaysValidSchema)(it, schema[p]));
        if (properties.length === 0)
          return;
        const valid = gen.name("valid");
        for (const prop of properties) {
          if (hasDefault(prop)) {
            applyPropertySchema(prop);
          } else {
            gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties));
            applyPropertySchema(prop);
            if (!it.allErrors)
              gen.else().var(valid, true);
            gen.endIf();
          }
          cxt.it.definedProperties.add(prop);
          cxt.ok(valid);
        }
        function hasDefault(prop) {
          return it.opts.useDefaults && !it.compositeRule && schema[prop].default !== void 0;
        }
        function applyPropertySchema(prop) {
          cxt.subschema({
            keyword: "properties",
            schemaProp: prop,
            dataProp: prop
          }, valid);
        }
      }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/applicator/patternProperties.js
var require_patternProperties = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/applicator/patternProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var util_2 = require_util();
    var def = {
      keyword: "patternProperties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema, data, parentSchema, it } = cxt;
        const { opts } = it;
        const patterns = (0, code_1.allSchemaProperties)(schema);
        const alwaysValidPatterns = patterns.filter((p) => (0, util_1.alwaysValidSchema)(it, schema[p]));
        if (patterns.length === 0 || alwaysValidPatterns.length === patterns.length && (!it.opts.unevaluated || it.props === true)) {
          return;
        }
        const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
        const valid = gen.name("valid");
        if (it.props !== true && !(it.props instanceof codegen_1.Name)) {
          it.props = (0, util_2.evaluatedPropsToName)(gen, it.props);
        }
        const { props } = it;
        validatePatternProperties();
        function validatePatternProperties() {
          for (const pat of patterns) {
            if (checkProperties)
              checkMatchingProperties(pat);
            if (it.allErrors) {
              validateProperties(pat);
            } else {
              gen.var(valid, true);
              validateProperties(pat);
              gen.if(valid);
            }
          }
        }
        function checkMatchingProperties(pat) {
          for (const prop in checkProperties) {
            if (new RegExp(pat).test(prop)) {
              (0, util_1.checkStrictMode)(it, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
            }
          }
        }
        function validateProperties(pat) {
          gen.forIn("key", data, (key) => {
            gen.if((0, codegen_1._)`${(0, code_1.usePattern)(cxt, pat)}.test(${key})`, () => {
              const alwaysValid = alwaysValidPatterns.includes(pat);
              if (!alwaysValid) {
                cxt.subschema({
                  keyword: "patternProperties",
                  schemaProp: pat,
                  dataProp: key,
                  dataPropType: util_2.Type.Str
                }, valid);
              }
              if (it.opts.unevaluated && props !== true) {
                gen.assign((0, codegen_1._)`${props}[${key}]`, true);
              } else if (!alwaysValid && !it.allErrors) {
                gen.if((0, codegen_1.not)(valid), () => gen.break());
              }
            });
          });
        }
      }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/applicator/not.js
var require_not = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/applicator/not.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: "not",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      code(cxt) {
        const { gen, schema, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          cxt.fail();
          return;
        }
        const valid = gen.name("valid");
        cxt.subschema({
          keyword: "not",
          compositeRule: true,
          createErrors: false,
          allErrors: false
        }, valid);
        cxt.failResult(valid, () => cxt.reset(), () => cxt.error());
      },
      error: { message: "must NOT be valid" }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/applicator/anyOf.js
var require_anyOf = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/applicator/anyOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var def = {
      keyword: "anyOf",
      schemaType: "array",
      trackErrors: true,
      code: code_1.validateUnion,
      error: { message: "must match a schema in anyOf" }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/applicator/oneOf.js
var require_oneOf = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/applicator/oneOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: "must match exactly one schema in oneOf",
      params: ({ params }) => (0, codegen_1._)`{passingSchemas: ${params.passing}}`
    };
    var def = {
      keyword: "oneOf",
      schemaType: "array",
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, it } = cxt;
        if (!Array.isArray(schema))
          throw new Error("ajv implementation error");
        if (it.opts.discriminator && parentSchema.discriminator)
          return;
        const schArr = schema;
        const valid = gen.let("valid", false);
        const passing = gen.let("passing", null);
        const schValid = gen.name("_valid");
        cxt.setParams({ passing });
        gen.block(validateOneOf);
        cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
        function validateOneOf() {
          schArr.forEach((sch, i) => {
            let schCxt;
            if ((0, util_1.alwaysValidSchema)(it, sch)) {
              gen.var(schValid, true);
            } else {
              schCxt = cxt.subschema({
                keyword: "oneOf",
                schemaProp: i,
                compositeRule: true
              }, schValid);
            }
            if (i > 0) {
              gen.if((0, codegen_1._)`${schValid} && ${valid}`).assign(valid, false).assign(passing, (0, codegen_1._)`[${passing}, ${i}]`).else();
            }
            gen.if(schValid, () => {
              gen.assign(valid, true);
              gen.assign(passing, i);
              if (schCxt)
                cxt.mergeEvaluated(schCxt, codegen_1.Name);
            });
          });
        }
      }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/applicator/allOf.js
var require_allOf = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/applicator/allOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: "allOf",
      schemaType: "array",
      code(cxt) {
        const { gen, schema, it } = cxt;
        if (!Array.isArray(schema))
          throw new Error("ajv implementation error");
        const valid = gen.name("valid");
        schema.forEach((sch, i) => {
          if ((0, util_1.alwaysValidSchema)(it, sch))
            return;
          const schCxt = cxt.subschema({ keyword: "allOf", schemaProp: i }, valid);
          cxt.ok(valid);
          cxt.mergeEvaluated(schCxt);
        });
      }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/applicator/if.js
var require_if = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/applicator/if.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params }) => (0, codegen_1.str)`must match "${params.ifClause}" schema`,
      params: ({ params }) => (0, codegen_1._)`{failingKeyword: ${params.ifClause}}`
    };
    var def = {
      keyword: "if",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, parentSchema, it } = cxt;
        if (parentSchema.then === void 0 && parentSchema.else === void 0) {
          (0, util_1.checkStrictMode)(it, '"if" without "then" and "else" is ignored');
        }
        const hasThen = hasSchema(it, "then");
        const hasElse = hasSchema(it, "else");
        if (!hasThen && !hasElse)
          return;
        const valid = gen.let("valid", true);
        const schValid = gen.name("_valid");
        validateIf();
        cxt.reset();
        if (hasThen && hasElse) {
          const ifClause = gen.let("ifClause");
          cxt.setParams({ ifClause });
          gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
        } else if (hasThen) {
          gen.if(schValid, validateClause("then"));
        } else {
          gen.if((0, codegen_1.not)(schValid), validateClause("else"));
        }
        cxt.pass(valid, () => cxt.error(true));
        function validateIf() {
          const schCxt = cxt.subschema({
            keyword: "if",
            compositeRule: true,
            createErrors: false,
            allErrors: false
          }, schValid);
          cxt.mergeEvaluated(schCxt);
        }
        function validateClause(keyword, ifClause) {
          return () => {
            const schCxt = cxt.subschema({ keyword }, schValid);
            gen.assign(valid, schValid);
            cxt.mergeValidEvaluated(schCxt, valid);
            if (ifClause)
              gen.assign(ifClause, (0, codegen_1._)`${keyword}`);
            else
              cxt.setParams({ ifClause: keyword });
          };
        }
      }
    };
    function hasSchema(it, keyword) {
      const schema = it.schema[keyword];
      return schema !== void 0 && !(0, util_1.alwaysValidSchema)(it, schema);
    }
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/applicator/thenElse.js
var require_thenElse = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/applicator/thenElse.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: ["then", "else"],
      schemaType: ["object", "boolean"],
      code({ keyword, parentSchema, it }) {
        if (parentSchema.if === void 0)
          (0, util_1.checkStrictMode)(it, `"${keyword}" without "if" is ignored`);
      }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/applicator/index.js
var require_applicator = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/applicator/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var additionalItems_1 = require_additionalItems();
    var prefixItems_1 = require_prefixItems();
    var items_1 = require_items();
    var items2020_1 = require_items2020();
    var contains_1 = require_contains();
    var dependencies_1 = require_dependencies();
    var propertyNames_1 = require_propertyNames();
    var additionalProperties_1 = require_additionalProperties();
    var properties_1 = require_properties();
    var patternProperties_1 = require_patternProperties();
    var not_1 = require_not();
    var anyOf_1 = require_anyOf();
    var oneOf_1 = require_oneOf();
    var allOf_1 = require_allOf();
    var if_1 = require_if();
    var thenElse_1 = require_thenElse();
    function getApplicator(draft2020 = false) {
      const applicator = [
        // any
        not_1.default,
        anyOf_1.default,
        oneOf_1.default,
        allOf_1.default,
        if_1.default,
        thenElse_1.default,
        // object
        propertyNames_1.default,
        additionalProperties_1.default,
        dependencies_1.default,
        properties_1.default,
        patternProperties_1.default
      ];
      if (draft2020)
        applicator.push(prefixItems_1.default, items2020_1.default);
      else
        applicator.push(additionalItems_1.default, items_1.default);
      applicator.push(contains_1.default);
      return applicator;
    }
    exports.default = getApplicator;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/dynamic/dynamicAnchor.js
var require_dynamicAnchor = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/dynamic/dynamicAnchor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dynamicAnchor = void 0;
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var compile_1 = require_compile();
    var ref_1 = require_ref();
    var def = {
      keyword: "$dynamicAnchor",
      schemaType: "string",
      code: (cxt) => dynamicAnchor(cxt, cxt.schema)
    };
    function dynamicAnchor(cxt, anchor) {
      const { gen, it } = cxt;
      it.schemaEnv.root.dynamicAnchors[anchor] = true;
      const v = (0, codegen_1._)`${names_1.default.dynamicAnchors}${(0, codegen_1.getProperty)(anchor)}`;
      const validate = it.errSchemaPath === "#" ? it.validateName : _getValidate(cxt);
      gen.if((0, codegen_1._)`!${v}`, () => gen.assign(v, validate));
    }
    exports.dynamicAnchor = dynamicAnchor;
    function _getValidate(cxt) {
      const { schemaEnv, schema, self } = cxt.it;
      const { root: root2, baseId, localRefs, meta } = schemaEnv.root;
      const { schemaId } = self.opts;
      const sch = new compile_1.SchemaEnv({ schema, schemaId, root: root2, baseId, localRefs, meta });
      compile_1.compileSchema.call(self, sch);
      return (0, ref_1.getValidate)(cxt, sch);
    }
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/dynamic/dynamicRef.js
var require_dynamicRef = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/dynamic/dynamicRef.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dynamicRef = void 0;
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var ref_1 = require_ref();
    var def = {
      keyword: "$dynamicRef",
      schemaType: "string",
      code: (cxt) => dynamicRef(cxt, cxt.schema)
    };
    function dynamicRef(cxt, ref) {
      const { gen, keyword, it } = cxt;
      if (ref[0] !== "#")
        throw new Error(`"${keyword}" only supports hash fragment reference`);
      const anchor = ref.slice(1);
      if (it.allErrors) {
        _dynamicRef();
      } else {
        const valid = gen.let("valid", false);
        _dynamicRef(valid);
        cxt.ok(valid);
      }
      function _dynamicRef(valid) {
        if (it.schemaEnv.root.dynamicAnchors[anchor]) {
          const v = gen.let("_v", (0, codegen_1._)`${names_1.default.dynamicAnchors}${(0, codegen_1.getProperty)(anchor)}`);
          gen.if(v, _callRef(v, valid), _callRef(it.validateName, valid));
        } else {
          _callRef(it.validateName, valid)();
        }
      }
      function _callRef(validate, valid) {
        return valid ? () => gen.block(() => {
          (0, ref_1.callRef)(cxt, validate);
          gen.let(valid, true);
        }) : () => (0, ref_1.callRef)(cxt, validate);
      }
    }
    exports.dynamicRef = dynamicRef;
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/dynamic/recursiveAnchor.js
var require_recursiveAnchor = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/dynamic/recursiveAnchor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dynamicAnchor_1 = require_dynamicAnchor();
    var util_1 = require_util();
    var def = {
      keyword: "$recursiveAnchor",
      schemaType: "boolean",
      code(cxt) {
        if (cxt.schema)
          (0, dynamicAnchor_1.dynamicAnchor)(cxt, "");
        else
          (0, util_1.checkStrictMode)(cxt.it, "$recursiveAnchor: false is ignored");
      }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/dynamic/recursiveRef.js
var require_recursiveRef = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/dynamic/recursiveRef.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dynamicRef_1 = require_dynamicRef();
    var def = {
      keyword: "$recursiveRef",
      schemaType: "string",
      code: (cxt) => (0, dynamicRef_1.dynamicRef)(cxt, cxt.schema)
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/dynamic/index.js
var require_dynamic = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/dynamic/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dynamicAnchor_1 = require_dynamicAnchor();
    var dynamicRef_1 = require_dynamicRef();
    var recursiveAnchor_1 = require_recursiveAnchor();
    var recursiveRef_1 = require_recursiveRef();
    var dynamic = [dynamicAnchor_1.default, dynamicRef_1.default, recursiveAnchor_1.default, recursiveRef_1.default];
    exports.default = dynamic;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/validation/dependentRequired.js
var require_dependentRequired = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/validation/dependentRequired.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dependencies_1 = require_dependencies();
    var def = {
      keyword: "dependentRequired",
      type: "object",
      schemaType: "object",
      error: dependencies_1.error,
      code: (cxt) => (0, dependencies_1.validatePropertyDeps)(cxt)
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/applicator/dependentSchemas.js
var require_dependentSchemas = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/applicator/dependentSchemas.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dependencies_1 = require_dependencies();
    var def = {
      keyword: "dependentSchemas",
      type: "object",
      schemaType: "object",
      code: (cxt) => (0, dependencies_1.validateSchemaDeps)(cxt)
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/validation/limitContains.js
var require_limitContains = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/validation/limitContains.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: ["maxContains", "minContains"],
      type: "array",
      schemaType: "number",
      code({ keyword, parentSchema, it }) {
        if (parentSchema.contains === void 0) {
          (0, util_1.checkStrictMode)(it, `"${keyword}" without "contains" is ignored`);
        }
      }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/next.js
var require_next = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/next.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dependentRequired_1 = require_dependentRequired();
    var dependentSchemas_1 = require_dependentSchemas();
    var limitContains_1 = require_limitContains();
    var next = [dependentRequired_1.default, dependentSchemas_1.default, limitContains_1.default];
    exports.default = next;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedProperties.js
var require_unevaluatedProperties = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    var error = {
      message: "must NOT have unevaluated properties",
      params: ({ params }) => (0, codegen_1._)`{unevaluatedProperty: ${params.unevaluatedProperty}}`
    };
    var def = {
      keyword: "unevaluatedProperties",
      type: "object",
      schemaType: ["boolean", "object"],
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, data, errsCount, it } = cxt;
        if (!errsCount)
          throw new Error("ajv implementation error");
        const { allErrors, props } = it;
        if (props instanceof codegen_1.Name) {
          gen.if((0, codegen_1._)`${props} !== true`, () => gen.forIn("key", data, (key) => gen.if(unevaluatedDynamic(props, key), () => unevaluatedPropCode(key))));
        } else if (props !== true) {
          gen.forIn("key", data, (key) => props === void 0 ? unevaluatedPropCode(key) : gen.if(unevaluatedStatic(props, key), () => unevaluatedPropCode(key)));
        }
        it.props = true;
        cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
        function unevaluatedPropCode(key) {
          if (schema === false) {
            cxt.setParams({ unevaluatedProperty: key });
            cxt.error();
            if (!allErrors)
              gen.break();
            return;
          }
          if (!(0, util_1.alwaysValidSchema)(it, schema)) {
            const valid = gen.name("valid");
            cxt.subschema({
              keyword: "unevaluatedProperties",
              dataProp: key,
              dataPropType: util_1.Type.Str
            }, valid);
            if (!allErrors)
              gen.if((0, codegen_1.not)(valid), () => gen.break());
          }
        }
        function unevaluatedDynamic(evaluatedProps, key) {
          return (0, codegen_1._)`!${evaluatedProps} || !${evaluatedProps}[${key}]`;
        }
        function unevaluatedStatic(evaluatedProps, key) {
          const ps = [];
          for (const p in evaluatedProps) {
            if (evaluatedProps[p] === true)
              ps.push((0, codegen_1._)`${key} !== ${p}`);
          }
          return (0, codegen_1.and)(...ps);
        }
      }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedItems.js
var require_unevaluatedItems = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "unevaluatedItems",
      type: "array",
      schemaType: ["boolean", "object"],
      error,
      code(cxt) {
        const { gen, schema, data, it } = cxt;
        const items = it.items || 0;
        if (items === true)
          return;
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        if (schema === false) {
          cxt.setParams({ len: items });
          cxt.fail((0, codegen_1._)`${len} > ${items}`);
        } else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
          const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items}`);
          gen.if((0, codegen_1.not)(valid), () => validateItems(valid, items));
          cxt.ok(valid);
        }
        it.items = true;
        function validateItems(valid, from) {
          gen.forRange("i", from, len, (i) => {
            cxt.subschema({ keyword: "unevaluatedItems", dataProp: i, dataPropType: util_1.Type.Num }, valid);
            if (!it.allErrors)
              gen.if((0, codegen_1.not)(valid), () => gen.break());
          });
        }
      }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/unevaluated/index.js
var require_unevaluated = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/unevaluated/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var unevaluatedProperties_1 = require_unevaluatedProperties();
    var unevaluatedItems_1 = require_unevaluatedItems();
    var unevaluated = [unevaluatedProperties_1.default, unevaluatedItems_1.default];
    exports.default = unevaluated;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/format/format.js
var require_format = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/format/format.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must match format "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{format: ${schemaCode}}`
    };
    var def = {
      keyword: "format",
      type: ["number", "string"],
      schemaType: "string",
      $data: true,
      error,
      code(cxt, ruleType) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        const { opts, errSchemaPath, schemaEnv, self } = it;
        if (!opts.validateFormats)
          return;
        if ($data)
          validate$DataFormat();
        else
          validateFormat();
        function validate$DataFormat() {
          const fmts = gen.scopeValue("formats", {
            ref: self.formats,
            code: opts.code.formats
          });
          const fDef = gen.const("fDef", (0, codegen_1._)`${fmts}[${schemaCode}]`);
          const fType = gen.let("fType");
          const format = gen.let("format");
          gen.if((0, codegen_1._)`typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, (0, codegen_1._)`${fDef}.type || "string"`).assign(format, (0, codegen_1._)`${fDef}.validate`), () => gen.assign(fType, (0, codegen_1._)`"string"`).assign(format, fDef));
          cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()));
          function unknownFmt() {
            if (opts.strictSchema === false)
              return codegen_1.nil;
            return (0, codegen_1._)`${schemaCode} && !${format}`;
          }
          function invalidFmt() {
            const callFormat = schemaEnv.$async ? (0, codegen_1._)`(${fDef}.async ? await ${format}(${data}) : ${format}(${data}))` : (0, codegen_1._)`${format}(${data})`;
            const validData = (0, codegen_1._)`(typeof ${format} == "function" ? ${callFormat} : ${format}.test(${data}))`;
            return (0, codegen_1._)`${format} && ${format} !== true && ${fType} === ${ruleType} && !${validData}`;
          }
        }
        function validateFormat() {
          const formatDef = self.formats[schema];
          if (!formatDef) {
            unknownFormat();
            return;
          }
          if (formatDef === true)
            return;
          const [fmtType, format, fmtRef] = getFormat(formatDef);
          if (fmtType === ruleType)
            cxt.pass(validCondition());
          function unknownFormat() {
            if (opts.strictSchema === false) {
              self.logger.warn(unknownMsg());
              return;
            }
            throw new Error(unknownMsg());
            function unknownMsg() {
              return `unknown format "${schema}" ignored in schema at path "${errSchemaPath}"`;
            }
          }
          function getFormat(fmtDef) {
            const code = fmtDef instanceof RegExp ? (0, codegen_1.regexpCode)(fmtDef) : opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(schema)}` : void 0;
            const fmt = gen.scopeValue("formats", { key: schema, ref: fmtDef, code });
            if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) {
              return [fmtDef.type || "string", fmtDef.validate, (0, codegen_1._)`${fmt}.validate`];
            }
            return ["string", fmtDef, fmt];
          }
          function validCondition() {
            if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
              if (!schemaEnv.$async)
                throw new Error("async format in sync schema");
              return (0, codegen_1._)`await ${fmtRef}(${data})`;
            }
            return typeof format == "function" ? (0, codegen_1._)`${fmtRef}(${data})` : (0, codegen_1._)`${fmtRef}.test(${data})`;
          }
        }
      }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/format/index.js
var require_format2 = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/format/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var format_1 = require_format();
    var format = [format_1.default];
    exports.default = format;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/metadata.js
var require_metadata = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/metadata.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.contentVocabulary = exports.metadataVocabulary = void 0;
    exports.metadataVocabulary = [
      "title",
      "description",
      "default",
      "deprecated",
      "readOnly",
      "writeOnly",
      "examples"
    ];
    exports.contentVocabulary = [
      "contentMediaType",
      "contentEncoding",
      "contentSchema"
    ];
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/draft2020.js
var require_draft2020 = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/draft2020.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require_core2();
    var validation_1 = require_validation();
    var applicator_1 = require_applicator();
    var dynamic_1 = require_dynamic();
    var next_1 = require_next();
    var unevaluated_1 = require_unevaluated();
    var format_1 = require_format2();
    var metadata_1 = require_metadata();
    var draft2020Vocabularies = [
      dynamic_1.default,
      core_1.default,
      validation_1.default,
      (0, applicator_1.default)(true),
      format_1.default,
      metadata_1.metadataVocabulary,
      metadata_1.contentVocabulary,
      next_1.default,
      unevaluated_1.default
    ];
    exports.default = draft2020Vocabularies;
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/discriminator/types.js
var require_types = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/discriminator/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DiscrError = void 0;
    var DiscrError;
    (function(DiscrError2) {
      DiscrError2["Tag"] = "tag";
      DiscrError2["Mapping"] = "mapping";
    })(DiscrError || (exports.DiscrError = DiscrError = {}));
  }
});

// packages/contracts/node_modules/ajv/dist/vocabularies/discriminator/index.js
var require_discriminator = __commonJS({
  "packages/contracts/node_modules/ajv/dist/vocabularies/discriminator/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var types_1 = require_types();
    var compile_1 = require_compile();
    var ref_error_1 = require_ref_error();
    var util_1 = require_util();
    var error = {
      message: ({ params: { discrError, tagName } }) => discrError === types_1.DiscrError.Tag ? `tag "${tagName}" must be string` : `value of tag "${tagName}" must be in oneOf`,
      params: ({ params: { discrError, tag, tagName } }) => (0, codegen_1._)`{error: ${discrError}, tag: ${tagName}, tagValue: ${tag}}`
    };
    var def = {
      keyword: "discriminator",
      type: "object",
      schemaType: "object",
      error,
      code(cxt) {
        const { gen, data, schema, parentSchema, it } = cxt;
        const { oneOf } = parentSchema;
        if (!it.opts.discriminator) {
          throw new Error("discriminator: requires discriminator option");
        }
        const tagName = schema.propertyName;
        if (typeof tagName != "string")
          throw new Error("discriminator: requires propertyName");
        if (schema.mapping)
          throw new Error("discriminator: mapping is not supported");
        if (!oneOf)
          throw new Error("discriminator: requires oneOf keyword");
        const valid = gen.let("valid", false);
        const tag = gen.const("tag", (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(tagName)}`);
        gen.if((0, codegen_1._)`typeof ${tag} == "string"`, () => validateMapping(), () => cxt.error(false, { discrError: types_1.DiscrError.Tag, tag, tagName }));
        cxt.ok(valid);
        function validateMapping() {
          const mapping = getMapping();
          gen.if(false);
          for (const tagValue in mapping) {
            gen.elseIf((0, codegen_1._)`${tag} === ${tagValue}`);
            gen.assign(valid, applyTagSchema(mapping[tagValue]));
          }
          gen.else();
          cxt.error(false, { discrError: types_1.DiscrError.Mapping, tag, tagName });
          gen.endIf();
        }
        function applyTagSchema(schemaProp) {
          const _valid = gen.name("valid");
          const schCxt = cxt.subschema({ keyword: "oneOf", schemaProp }, _valid);
          cxt.mergeEvaluated(schCxt, codegen_1.Name);
          return _valid;
        }
        function getMapping() {
          var _a;
          const oneOfMapping = {};
          const topRequired = hasRequired(parentSchema);
          let tagRequired = true;
          for (let i = 0; i < oneOf.length; i++) {
            let sch = oneOf[i];
            if ((sch === null || sch === void 0 ? void 0 : sch.$ref) && !(0, util_1.schemaHasRulesButRef)(sch, it.self.RULES)) {
              const ref = sch.$ref;
              sch = compile_1.resolveRef.call(it.self, it.schemaEnv.root, it.baseId, ref);
              if (sch instanceof compile_1.SchemaEnv)
                sch = sch.schema;
              if (sch === void 0)
                throw new ref_error_1.default(it.opts.uriResolver, it.baseId, ref);
            }
            const propSch = (_a = sch === null || sch === void 0 ? void 0 : sch.properties) === null || _a === void 0 ? void 0 : _a[tagName];
            if (typeof propSch != "object") {
              throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName}"`);
            }
            tagRequired = tagRequired && (topRequired || hasRequired(sch));
            addMappings(propSch, i);
          }
          if (!tagRequired)
            throw new Error(`discriminator: "${tagName}" must be required`);
          return oneOfMapping;
          function hasRequired({ required }) {
            return Array.isArray(required) && required.includes(tagName);
          }
          function addMappings(sch, i) {
            if (sch.const) {
              addMapping(sch.const, i);
            } else if (sch.enum) {
              for (const tagValue of sch.enum) {
                addMapping(tagValue, i);
              }
            } else {
              throw new Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`);
            }
          }
          function addMapping(tagValue, i) {
            if (typeof tagValue != "string" || tagValue in oneOfMapping) {
              throw new Error(`discriminator: "${tagName}" values must be unique strings`);
            }
            oneOfMapping[tagValue] = i;
          }
        }
      }
    };
    exports.default = def;
  }
});

// packages/contracts/node_modules/ajv/dist/refs/json-schema-2020-12/schema.json
var require_schema = __commonJS({
  "packages/contracts/node_modules/ajv/dist/refs/json-schema-2020-12/schema.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/schema",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/core": true,
        "https://json-schema.org/draft/2020-12/vocab/applicator": true,
        "https://json-schema.org/draft/2020-12/vocab/unevaluated": true,
        "https://json-schema.org/draft/2020-12/vocab/validation": true,
        "https://json-schema.org/draft/2020-12/vocab/meta-data": true,
        "https://json-schema.org/draft/2020-12/vocab/format-annotation": true,
        "https://json-schema.org/draft/2020-12/vocab/content": true
      },
      $dynamicAnchor: "meta",
      title: "Core and Validation specifications meta-schema",
      allOf: [
        { $ref: "meta/core" },
        { $ref: "meta/applicator" },
        { $ref: "meta/unevaluated" },
        { $ref: "meta/validation" },
        { $ref: "meta/meta-data" },
        { $ref: "meta/format-annotation" },
        { $ref: "meta/content" }
      ],
      type: ["object", "boolean"],
      $comment: "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.",
      properties: {
        definitions: {
          $comment: '"definitions" has been replaced by "$defs".',
          type: "object",
          additionalProperties: { $dynamicRef: "#meta" },
          deprecated: true,
          default: {}
        },
        dependencies: {
          $comment: '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.',
          type: "object",
          additionalProperties: {
            anyOf: [{ $dynamicRef: "#meta" }, { $ref: "meta/validation#/$defs/stringArray" }]
          },
          deprecated: true,
          default: {}
        },
        $recursiveAnchor: {
          $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".',
          $ref: "meta/core#/$defs/anchorString",
          deprecated: true
        },
        $recursiveRef: {
          $comment: '"$recursiveRef" has been replaced by "$dynamicRef".',
          $ref: "meta/core#/$defs/uriReferenceString",
          deprecated: true
        }
      }
    };
  }
});

// packages/contracts/node_modules/ajv/dist/refs/json-schema-2020-12/meta/applicator.json
var require_applicator2 = __commonJS({
  "packages/contracts/node_modules/ajv/dist/refs/json-schema-2020-12/meta/applicator.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/applicator",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/applicator": true
      },
      $dynamicAnchor: "meta",
      title: "Applicator vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        prefixItems: { $ref: "#/$defs/schemaArray" },
        items: { $dynamicRef: "#meta" },
        contains: { $dynamicRef: "#meta" },
        additionalProperties: { $dynamicRef: "#meta" },
        properties: {
          type: "object",
          additionalProperties: { $dynamicRef: "#meta" },
          default: {}
        },
        patternProperties: {
          type: "object",
          additionalProperties: { $dynamicRef: "#meta" },
          propertyNames: { format: "regex" },
          default: {}
        },
        dependentSchemas: {
          type: "object",
          additionalProperties: { $dynamicRef: "#meta" },
          default: {}
        },
        propertyNames: { $dynamicRef: "#meta" },
        if: { $dynamicRef: "#meta" },
        then: { $dynamicRef: "#meta" },
        else: { $dynamicRef: "#meta" },
        allOf: { $ref: "#/$defs/schemaArray" },
        anyOf: { $ref: "#/$defs/schemaArray" },
        oneOf: { $ref: "#/$defs/schemaArray" },
        not: { $dynamicRef: "#meta" }
      },
      $defs: {
        schemaArray: {
          type: "array",
          minItems: 1,
          items: { $dynamicRef: "#meta" }
        }
      }
    };
  }
});

// packages/contracts/node_modules/ajv/dist/refs/json-schema-2020-12/meta/unevaluated.json
var require_unevaluated2 = __commonJS({
  "packages/contracts/node_modules/ajv/dist/refs/json-schema-2020-12/meta/unevaluated.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/unevaluated",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/unevaluated": true
      },
      $dynamicAnchor: "meta",
      title: "Unevaluated applicator vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        unevaluatedItems: { $dynamicRef: "#meta" },
        unevaluatedProperties: { $dynamicRef: "#meta" }
      }
    };
  }
});

// packages/contracts/node_modules/ajv/dist/refs/json-schema-2020-12/meta/content.json
var require_content = __commonJS({
  "packages/contracts/node_modules/ajv/dist/refs/json-schema-2020-12/meta/content.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/content",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/content": true
      },
      $dynamicAnchor: "meta",
      title: "Content vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        contentEncoding: { type: "string" },
        contentMediaType: { type: "string" },
        contentSchema: { $dynamicRef: "#meta" }
      }
    };
  }
});

// packages/contracts/node_modules/ajv/dist/refs/json-schema-2020-12/meta/core.json
var require_core3 = __commonJS({
  "packages/contracts/node_modules/ajv/dist/refs/json-schema-2020-12/meta/core.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/core",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/core": true
      },
      $dynamicAnchor: "meta",
      title: "Core vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        $id: {
          $ref: "#/$defs/uriReferenceString",
          $comment: "Non-empty fragments not allowed.",
          pattern: "^[^#]*#?$"
        },
        $schema: { $ref: "#/$defs/uriString" },
        $ref: { $ref: "#/$defs/uriReferenceString" },
        $anchor: { $ref: "#/$defs/anchorString" },
        $dynamicRef: { $ref: "#/$defs/uriReferenceString" },
        $dynamicAnchor: { $ref: "#/$defs/anchorString" },
        $vocabulary: {
          type: "object",
          propertyNames: { $ref: "#/$defs/uriString" },
          additionalProperties: {
            type: "boolean"
          }
        },
        $comment: {
          type: "string"
        },
        $defs: {
          type: "object",
          additionalProperties: { $dynamicRef: "#meta" }
        }
      },
      $defs: {
        anchorString: {
          type: "string",
          pattern: "^[A-Za-z_][-A-Za-z0-9._]*$"
        },
        uriString: {
          type: "string",
          format: "uri"
        },
        uriReferenceString: {
          type: "string",
          format: "uri-reference"
        }
      }
    };
  }
});

// packages/contracts/node_modules/ajv/dist/refs/json-schema-2020-12/meta/format-annotation.json
var require_format_annotation = __commonJS({
  "packages/contracts/node_modules/ajv/dist/refs/json-schema-2020-12/meta/format-annotation.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/format-annotation",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/format-annotation": true
      },
      $dynamicAnchor: "meta",
      title: "Format vocabulary meta-schema for annotation results",
      type: ["object", "boolean"],
      properties: {
        format: { type: "string" }
      }
    };
  }
});

// packages/contracts/node_modules/ajv/dist/refs/json-schema-2020-12/meta/meta-data.json
var require_meta_data = __commonJS({
  "packages/contracts/node_modules/ajv/dist/refs/json-schema-2020-12/meta/meta-data.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/meta-data",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/meta-data": true
      },
      $dynamicAnchor: "meta",
      title: "Meta-data vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        title: {
          type: "string"
        },
        description: {
          type: "string"
        },
        default: true,
        deprecated: {
          type: "boolean",
          default: false
        },
        readOnly: {
          type: "boolean",
          default: false
        },
        writeOnly: {
          type: "boolean",
          default: false
        },
        examples: {
          type: "array",
          items: true
        }
      }
    };
  }
});

// packages/contracts/node_modules/ajv/dist/refs/json-schema-2020-12/meta/validation.json
var require_validation2 = __commonJS({
  "packages/contracts/node_modules/ajv/dist/refs/json-schema-2020-12/meta/validation.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/validation",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/validation": true
      },
      $dynamicAnchor: "meta",
      title: "Validation vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        type: {
          anyOf: [
            { $ref: "#/$defs/simpleTypes" },
            {
              type: "array",
              items: { $ref: "#/$defs/simpleTypes" },
              minItems: 1,
              uniqueItems: true
            }
          ]
        },
        const: true,
        enum: {
          type: "array",
          items: true
        },
        multipleOf: {
          type: "number",
          exclusiveMinimum: 0
        },
        maximum: {
          type: "number"
        },
        exclusiveMaximum: {
          type: "number"
        },
        minimum: {
          type: "number"
        },
        exclusiveMinimum: {
          type: "number"
        },
        maxLength: { $ref: "#/$defs/nonNegativeInteger" },
        minLength: { $ref: "#/$defs/nonNegativeIntegerDefault0" },
        pattern: {
          type: "string",
          format: "regex"
        },
        maxItems: { $ref: "#/$defs/nonNegativeInteger" },
        minItems: { $ref: "#/$defs/nonNegativeIntegerDefault0" },
        uniqueItems: {
          type: "boolean",
          default: false
        },
        maxContains: { $ref: "#/$defs/nonNegativeInteger" },
        minContains: {
          $ref: "#/$defs/nonNegativeInteger",
          default: 1
        },
        maxProperties: { $ref: "#/$defs/nonNegativeInteger" },
        minProperties: { $ref: "#/$defs/nonNegativeIntegerDefault0" },
        required: { $ref: "#/$defs/stringArray" },
        dependentRequired: {
          type: "object",
          additionalProperties: {
            $ref: "#/$defs/stringArray"
          }
        }
      },
      $defs: {
        nonNegativeInteger: {
          type: "integer",
          minimum: 0
        },
        nonNegativeIntegerDefault0: {
          $ref: "#/$defs/nonNegativeInteger",
          default: 0
        },
        simpleTypes: {
          enum: ["array", "boolean", "integer", "null", "number", "object", "string"]
        },
        stringArray: {
          type: "array",
          items: { type: "string" },
          uniqueItems: true,
          default: []
        }
      }
    };
  }
});

// packages/contracts/node_modules/ajv/dist/refs/json-schema-2020-12/index.js
var require_json_schema_2020_12 = __commonJS({
  "packages/contracts/node_modules/ajv/dist/refs/json-schema-2020-12/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var metaSchema = require_schema();
    var applicator = require_applicator2();
    var unevaluated = require_unevaluated2();
    var content = require_content();
    var core = require_core3();
    var format = require_format_annotation();
    var metadata = require_meta_data();
    var validation = require_validation2();
    var META_SUPPORT_DATA = ["/properties"];
    function addMetaSchema2020($data) {
      ;
      [
        metaSchema,
        applicator,
        unevaluated,
        content,
        core,
        with$data(this, format),
        metadata,
        with$data(this, validation)
      ].forEach((sch) => this.addMetaSchema(sch, void 0, false));
      return this;
      function with$data(ajv2, sch) {
        return $data ? ajv2.$dataMetaSchema(sch, META_SUPPORT_DATA) : sch;
      }
    }
    exports.default = addMetaSchema2020;
  }
});

// packages/contracts/node_modules/ajv/dist/2020.js
var require__ = __commonJS({
  "packages/contracts/node_modules/ajv/dist/2020.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MissingRefError = exports.ValidationError = exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = exports.Ajv2020 = void 0;
    var core_1 = require_core();
    var draft2020_1 = require_draft2020();
    var discriminator_1 = require_discriminator();
    var json_schema_2020_12_1 = require_json_schema_2020_12();
    var META_SCHEMA_ID = "https://json-schema.org/draft/2020-12/schema";
    var Ajv20202 = class extends core_1.default {
      constructor(opts = {}) {
        super({
          ...opts,
          dynamicRef: true,
          next: true,
          unevaluated: true
        });
      }
      _addVocabularies() {
        super._addVocabularies();
        draft2020_1.default.forEach((v) => this.addVocabulary(v));
        if (this.opts.discriminator)
          this.addKeyword(discriminator_1.default);
      }
      _addDefaultMetaSchema() {
        super._addDefaultMetaSchema();
        const { $data, meta } = this.opts;
        if (!meta)
          return;
        json_schema_2020_12_1.default.call(this, $data);
        this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
      }
    };
    exports.Ajv2020 = Ajv20202;
    module.exports = exports = Ajv20202;
    module.exports.Ajv2020 = Ajv20202;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Ajv20202;
    var validate_1 = require_validate();
    Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
    var validation_error_1 = require_validation_error();
    Object.defineProperty(exports, "ValidationError", { enumerable: true, get: function() {
      return validation_error_1.default;
    } });
    var ref_error_1 = require_ref_error();
    Object.defineProperty(exports, "MissingRefError", { enumerable: true, get: function() {
      return ref_error_1.default;
    } });
  }
});

// packages/mcp-server/dist/main.js
import { join as join7 } from "node:path";
import { createInterface } from "node:readline";

// packages/mcp-server/dist/server.js
import { readFileSync as readFileSync5 } from "node:fs";
import { join as join6 } from "node:path";

// packages/gate-runner/dist/index.js
import { spawn, spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { isAbsolute, join, relative, resolve } from "node:path";

// packages/canon/dist/index.js
import { createHash } from "node:crypto";

// node_modules/canonicalize/lib/canonicalize.js
function serializeString(value) {
  if (!value.isWellFormed()) {
    throw new Error("Lone surrogate is not allowed");
  }
  return JSON.stringify(value);
}
function serializePrimitive(value) {
  switch (typeof value) {
    case "number":
      if (isNaN(value)) {
        throw new Error("NaN is not allowed");
      }
      if (!isFinite(value)) {
        throw new Error("Infinity is not allowed");
      }
      return JSON.stringify(value);
    case "string":
      return serializeString(value);
    case "boolean":
      return value ? "true" : "false";
    default:
      return JSON.stringify(value);
  }
}
function enterValue(value, seen) {
  let wrappers = null;
  while (value !== null && typeof value === "object" && typeof value.toJSON === "function") {
    if (seen.has(value)) {
      throw new Error("Circular reference detected");
    }
    seen.add(value);
    (wrappers ??= []).push(value);
    value = value.toJSON();
  }
  if (value instanceof Number || value instanceof String || value instanceof Boolean) {
    value = value.valueOf();
  }
  if (value === null || typeof value !== "object") {
    if (wrappers !== null) {
      for (const wrapper of wrappers) seen.delete(wrapper);
    }
    return serializePrimitive(value);
  }
  if (seen.has(value)) {
    throw new Error("Circular reference detected");
  }
  seen.add(value);
  return {
    container: value,
    // null marks an array frame; object frames carry their sorted keys.
    // `sort()`'s default comparator orders by UTF-16 code unit, which is the
    // order JCS requires.
    keys: Array.isArray(value) ? null : Object.keys(value).sort(),
    // Next child to serialize; the frame resumes here after a nested
    // container's subtree completes.
    index: 0,
    // Whether no member has been emitted yet (controls comma placement).
    first: true,
    // toJSON wrappers to release from `seen` when this frame completes.
    wrappers
  };
}
function canonicalize(object) {
  if (object === null || typeof object !== "object") {
    return serializePrimitive(object);
  }
  const seen = /* @__PURE__ */ new Set();
  const root2 = enterValue(object, seen);
  if (typeof root2 !== "object") {
    return root2;
  }
  let result = root2.keys === null ? "[" : "{";
  const stack = [root2];
  outer:
    while (stack.length > 0) {
      const frame = stack[stack.length - 1];
      const container = frame.container;
      if (frame.keys === null) {
        while (frame.index < container.length) {
          const i = frame.index++;
          if (i > 0) {
            result += ",";
          }
          const element = container[i];
          const value = element === void 0 || typeof element === "symbol" || typeof element === "function" ? null : element;
          if (value === null || typeof value !== "object") {
            result += serializePrimitive(value);
            continue;
          }
          const child = enterValue(value, seen);
          if (typeof child !== "object") {
            result += child === void 0 ? "null" : child;
            continue;
          }
          result += child.keys === null ? "[" : "{";
          stack.push(child);
          continue outer;
        }
        result += "]";
      } else {
        const keys = frame.keys;
        while (frame.index < keys.length) {
          const key = keys[frame.index++];
          const value = container[key];
          if (value === void 0 || typeof value === "symbol" || typeof value === "function") {
            continue;
          }
          if (value === null || typeof value !== "object") {
            if (frame.first) {
              frame.first = false;
            } else {
              result += ",";
            }
            result += serializeString(key) + ":" + serializePrimitive(value);
            continue;
          }
          const child = enterValue(value, seen);
          if (child === void 0) {
            continue;
          }
          if (frame.first) {
            frame.first = false;
          } else {
            result += ",";
          }
          result += serializeString(key) + ":";
          if (typeof child !== "object") {
            result += child;
            continue;
          }
          result += child.keys === null ? "[" : "{";
          stack.push(child);
          continue outer;
        }
        result += "}";
      }
      seen.delete(container);
      if (frame.wrappers !== null) {
        for (const wrapper of frame.wrappers) seen.delete(wrapper);
      }
      stack.pop();
    }
  return result;
}

// packages/canon/dist/index.js
var MAX_DEPTH = 100;
var CanonError = class extends Error {
  name = "CanonError";
};
var UTF8 = new TextEncoder();
function check(value, path, seen, depth = 0) {
  if (value === null || typeof value === "boolean")
    return;
  if (typeof value === "string") {
    if (!value.isWellFormed())
      throw new CanonError(`lone surrogate at ${path}`);
    return;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value))
      throw new CanonError(`non-finite number at ${path}`);
    return;
  }
  if (typeof value !== "object")
    throw new CanonError(`${typeof value} is not JSON, at ${path}`);
  if (depth >= MAX_DEPTH)
    throw new CanonError(`nested deeper than ${String(MAX_DEPTH)} at ${path}`);
  if (seen.has(value))
    throw new CanonError(`circular reference at ${path}`);
  seen.add(value);
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      if (!(i in value))
        throw new CanonError(`array hole at ${path}[${String(i)}]`);
      check(value[i], `${path}[${String(i)}]`, seen, depth + 1);
    }
  } else {
    const proto = Object.getPrototypeOf(value);
    if (proto !== Object.prototype && proto !== null)
      throw new CanonError(`not a plain object at ${path}`);
    for (const [k, v] of Object.entries(value)) {
      if (!k.isWellFormed())
        throw new CanonError(`lone surrogate in a key at ${path}`);
      if (v === void 0)
        throw new CanonError(`undefined at ${path}.${k}`);
      check(v, `${path}.${k}`, seen, depth + 1);
    }
  }
  seen.delete(value);
}
function canonicalBytes(value) {
  check(value, "$", /* @__PURE__ */ new Set());
  let text2;
  try {
    text2 = canonicalize(value);
  } catch (err) {
    throw new CanonError(err instanceof Error ? err.message : String(err));
  }
  if (text2 === void 0)
    throw new CanonError("value has no JSON form");
  return UTF8.encode(text2);
}
var sha256Hex = (data) => createHash("sha256").update(data).digest("hex");
function jcs1(value) {
  return `jcs1:sha256:${sha256Hex(canonicalBytes(value))}`;
}
function raw(data) {
  return `raw:sha256:${sha256Hex(data)}`;
}
function selfFingerprint(record, field = "fingerprint") {
  return jcs1(Object.fromEntries(Object.entries(record).filter(([k]) => k !== field)));
}

// packages/contracts/dist/index.js
var import__ = __toESM(require__(), 1);

// packages/contracts/dist/generated/schemas.js
var CONTRACT_NAMES = ["agreed_focus", "braid_summary", "braid_template", "braids_lock", "context_doc", "decisions", "draft", "evidence_table", "findings", "gate", "gate_io_input", "gate_result", "option_map", "practice_headline", "primitives", "revision_log", "run_record", "source_register", "synthesis", "thread", "type", "typed_output"];
var SCHEMAS = {
  "agreed_focus": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://fairlead.heuris.com.au/contracts/braids/v0.1/agreed_focus.schema.json",
    "title": "agreed_focus",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "starting_prompt": {
        "type": "string",
        "maxLength": 4e3
      },
      "question": {
        "type": "string",
        "maxLength": 300
      },
      "sub_questions": {
        "type": "array",
        "items": {
          "type": "string",
          "maxLength": 300
        },
        "maxItems": 8
      },
      "goal": {
        "type": "string",
        "maxLength": 400
      },
      "audience": {
        "type": "string",
        "maxLength": 160
      },
      "decision": {
        "type": "string",
        "maxLength": 300
      },
      "scope": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "period": {
            "type": "string",
            "maxLength": 60
          },
          "jurisdictions": {
            "type": "array",
            "items": {
              "type": "string",
              "maxLength": 40
            },
            "maxItems": 12
          },
          "source_types": {
            "type": "array",
            "items": {
              "type": "string",
              "maxLength": 60
            },
            "maxItems": 10
          }
        },
        "required": [
          "period",
          "jurisdictions",
          "source_types"
        ]
      },
      "must_include": {
        "type": "array",
        "items": {
          "type": "string",
          "maxLength": 200
        },
        "maxItems": 10
      },
      "out_of_scope": {
        "type": "array",
        "items": {
          "type": "string",
          "maxLength": 200
        },
        "maxItems": 10
      },
      "what_good_looks_like": {
        "type": "array",
        "items": {
          "type": "string",
          "maxLength": 300
        },
        "maxItems": 8
      },
      "would_change_view": {
        "type": "string",
        "maxLength": 300
      },
      "personal_info_detected": {
        "type": "boolean"
      }
    },
    "required": [
      "starting_prompt",
      "question",
      "sub_questions",
      "goal",
      "audience",
      "decision",
      "scope",
      "must_include",
      "out_of_scope",
      "what_good_looks_like",
      "would_change_view",
      "personal_info_detected"
    ],
    "description": "Output of refine: the legacy brief renamed and extended; tier and budget_setting live in the run record."
  },
  "braid_summary": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://fairlead.heuris.com.au/contracts/braids/v0.1/braid_summary.schema.json",
    "title": "braid_summary",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "schema": {
        "const": "fairlead.braid_summary/0.1"
      },
      "run_fingerprint": {
        "$ref": "primitives.schema.json#/$defs/fingerprint_jcs1"
      },
      "template": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "template_id": {
            "$ref": "primitives.schema.json#/$defs/template_id"
          },
          "version": {
            "$ref": "primitives.schema.json#/$defs/semver"
          },
          "template_fingerprint": {
            "$ref": "primitives.schema.json#/$defs/fingerprint_jcs1"
          },
          "variant": {
            "$ref": "primitives.schema.json#/$defs/variant"
          }
        },
        "required": [
          "template_id",
          "version",
          "template_fingerprint",
          "variant"
        ]
      },
      "host_profile": {
        "$ref": "primitives.schema.json#/$defs/host_profile"
      },
      "started_on": {
        "$ref": "primitives.schema.json#/$defs/date"
      },
      "ended_on": {
        "$ref": "primitives.schema.json#/$defs/date"
      },
      "steps_by_kind": {
        "type": "object",
        "propertyNames": {
          "$ref": "primitives.schema.json#/$defs/step_kind"
        },
        "additionalProperties": {
          "type": "integer",
          "minimum": 0
        }
      },
      "gates": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "passed": {
            "type": "integer",
            "minimum": 0
          },
          "failed": {
            "type": "integer",
            "minimum": 0
          },
          "warned": {
            "type": "integer",
            "minimum": 0
          },
          "skipped": {
            "type": "integer",
            "minimum": 0
          }
        },
        "required": [
          "passed",
          "failed",
          "warned",
          "skipped"
        ]
      },
      "findings": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "block": {
            "type": "integer",
            "minimum": 0
          },
          "warn": {
            "type": "integer",
            "minimum": 0
          },
          "adopted": {
            "type": "integer",
            "minimum": 0
          },
          "partly_adopted": {
            "type": "integer",
            "minimum": 0
          },
          "declined": {
            "type": "integer",
            "minimum": 0
          }
        },
        "required": [
          "block",
          "warn",
          "adopted",
          "partly_adopted",
          "declined"
        ]
      },
      "rechecks": {
        "type": "integer",
        "minimum": 0
      },
      "decisions_by_kind": {
        "type": "object",
        "propertyNames": {
          "$ref": "primitives.schema.json#/$defs/decision_kind"
        },
        "additionalProperties": {
          "type": "integer",
          "minimum": 0
        }
      },
      "branches": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "merged": {
            "type": "integer",
            "minimum": 0
          },
          "parked": {
            "type": "integer",
            "minimum": 0
          },
          "closed": {
            "type": "integer",
            "minimum": 0
          },
          "open": {
            "type": "integer",
            "minimum": 0
          }
        },
        "required": [
          "merged",
          "parked",
          "closed",
          "open"
        ]
      },
      "refines": {
        "type": "integer",
        "minimum": 0
      },
      "practice": {
        "$ref": "primitives.schema.json#/$defs/practice"
      },
      "input_rule_alert": {
        "type": "boolean"
      },
      "output_types": {
        "type": "array",
        "items": {
          "$ref": "primitives.schema.json#/$defs/versioned_ref"
        },
        "maxItems": 50
      }
    },
    "required": [
      "schema",
      "run_fingerprint",
      "template",
      "host_profile",
      "started_on",
      "ended_on",
      "steps_by_kind",
      "gates",
      "findings",
      "rechecks",
      "decisions_by_kind",
      "branches",
      "refines",
      "practice",
      "input_rule_alert",
      "output_types"
    ],
    "description": "Content-free projection of a run record for 'Validate this run' (\xA77). Computed, never edited."
  },
  "braid_template": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://fairlead.heuris.com.au/contracts/braids/v0.1/braid_template.schema.json",
    "title": "braid_template",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "schema": {
        "const": "fairlead.braid_template/0.1"
      },
      "template_id": {
        "$ref": "primitives.schema.json#/$defs/template_id"
      },
      "version": {
        "$ref": "primitives.schema.json#/$defs/semver"
      },
      "fingerprint": {
        "$ref": "primitives.schema.json#/$defs/fingerprint_jcs1"
      },
      "catalogue": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "command": {
            "type": "string",
            "maxLength": 64,
            "pattern": "^/fairlead:[a-z][a-z0-9-]{0,31}(?![\\s\\S])"
          },
          "title": {
            "type": "string",
            "maxLength": 80
          },
          "for_when": {
            "type": "string",
            "maxLength": 200
          },
          "group": {
            "$ref": "primitives.schema.json#/$defs/name"
          },
          "status": {
            "enum": [
              "in_design",
              "testing",
              "released"
            ]
          },
          "free": {
            "type": "boolean"
          },
          "hosts": {
            "type": "object",
            "propertyNames": {
              "$ref": "primitives.schema.json#/$defs/host_profile"
            },
            "minProperties": 1,
            "additionalProperties": {
              "enum": [
                "in_design",
                "testing",
                "released",
                "not_offered"
              ]
            }
          }
        },
        "required": [
          "command",
          "title",
          "for_when",
          "group",
          "status",
          "free",
          "hosts"
        ]
      },
      "parent": {
        "anyOf": [
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "template_id": {
                "$ref": "primitives.schema.json#/$defs/template_id"
              },
              "version": {
                "$ref": "primitives.schema.json#/$defs/semver"
              },
              "fingerprint": {
                "$ref": "primitives.schema.json#/$defs/fingerprint_jcs1"
              }
            },
            "required": [
              "template_id",
              "version",
              "fingerprint"
            ]
          },
          {
            "type": "null"
          }
        ]
      },
      "risk_tier_default": {
        "$ref": "primitives.schema.json#/$defs/risk_tier"
      },
      "work_unit": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "name": {
            "$ref": "primitives.schema.json#/$defs/name"
          },
          "definition": {
            "type": "string",
            "maxLength": 300
          }
        },
        "required": [
          "name",
          "definition"
        ]
      },
      "inputs": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "port": {
              "$ref": "primitives.schema.json#/$defs/name"
            },
            "type_ref": {
              "$ref": "primitives.schema.json#/$defs/versioned_ref"
            },
            "required": {
              "type": "boolean"
            },
            "datafile": {
              "type": "boolean"
            },
            "handling": {
              "anyOf": [
                {
                  "$ref": "primitives.schema.json#/$defs/handling"
                },
                {
                  "type": "null"
                }
              ]
            },
            "handling_mode": {
              "enum": [
                "inherit",
                "override"
              ]
            },
            "allow_loosen": {
              "type": "boolean"
            }
          },
          "required": [
            "port",
            "type_ref",
            "required",
            "datafile",
            "handling"
          ],
          "allOf": [
            {
              "$ref": "primitives.schema.json#/$defs/handling_port_rule"
            },
            {
              "if": {
                "properties": {
                  "allow_loosen": {
                    "const": true
                  }
                },
                "required": [
                  "allow_loosen"
                ]
              },
              "then": {
                "properties": {
                  "handling_mode": {
                    "const": "override"
                  }
                },
                "required": [
                  "handling_mode"
                ]
              }
            },
            {
              "if": {
                "properties": {
                  "datafile": {
                    "const": false
                  }
                },
                "required": [
                  "datafile"
                ]
              },
              "then": {
                "not": {
                  "anyOf": [
                    {
                      "required": [
                        "handling_mode"
                      ]
                    },
                    {
                      "required": [
                        "allow_loosen"
                      ]
                    }
                  ]
                }
              }
            }
          ]
        },
        "maxItems": 20
      },
      "threads": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "thread_ref": {
              "$ref": "primitives.schema.json#/$defs/versioned_ref"
            },
            "thread_fingerprint": {
              "$ref": "primitives.schema.json#/$defs/fingerprint_jcs1"
            },
            "role": {
              "$ref": "primitives.schema.json#/$defs/role"
            },
            "tools": {
              "type": "array",
              "items": {
                "enum": [
                  "search",
                  "fetch",
                  "read_file",
                  "write_output",
                  "run_readonly",
                  "none"
                ]
              },
              "maxItems": 6,
              "uniqueItems": true
            },
            "reads": {
              "type": "array",
              "items": {
                "$ref": "primitives.schema.json#/$defs/name"
              },
              "maxItems": 30
            },
            "returns": {
              "$ref": "primitives.schema.json#/$defs/name"
            },
            "caps": {
              "$ref": "primitives.schema.json#/$defs/caps"
            }
          },
          "required": [
            "thread_ref",
            "thread_fingerprint",
            "role",
            "tools",
            "reads",
            "returns",
            "caps"
          ]
        },
        "maxItems": 30
      },
      "steps": {
        "type": "array",
        "items": {
          "$ref": "primitives.schema.json#/$defs/template_step"
        },
        "maxItems": 60,
        "minItems": 2
      },
      "gates": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "gate_ref": {
              "$ref": "primitives.schema.json#/$defs/versioned_ref"
            },
            "gate_fingerprint": {
              "$ref": "primitives.schema.json#/$defs/fingerprint_jcs1"
            },
            "applies_to": {
              "type": "array",
              "items": {
                "$ref": "primitives.schema.json#/$defs/versioned_ref"
              },
              "maxItems": 20
            },
            "before_checks": {
              "type": "boolean"
            },
            "on_fail": {
              "enum": [
                "block",
                "warn"
              ]
            }
          },
          "required": [
            "gate_ref",
            "gate_fingerprint",
            "applies_to",
            "before_checks",
            "on_fail"
          ]
        },
        "maxItems": 30
      },
      "checkers": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "step_id": {
              "$ref": "primitives.schema.json#/$defs/step_id"
            },
            "concerns": {
              "type": "array",
              "items": {
                "$ref": "primitives.schema.json#/$defs/name"
              },
              "maxItems": 10,
              "minItems": 1
            },
            "fetch": {
              "enum": [
                "none",
                "cited_only",
                "open"
              ]
            },
            "evidence_rules": {
              "type": "array",
              "items": {
                "enum": [
                  "EV-1",
                  "EV-2",
                  "EV-3",
                  "EV-4",
                  "EV-5",
                  "EV-6"
                ]
              },
              "maxItems": 6,
              "uniqueItems": true
            }
          },
          "required": [
            "step_id",
            "concerns",
            "fetch",
            "evidence_rules"
          ]
        },
        "maxItems": 10
      },
      "adjudication": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "policy": {
            "const": "test_every_finding"
          },
          "outcomes": {
            "type": "array",
            "items": {
              "enum": [
                "adopted",
                "partly_adopted",
                "declined"
              ]
            },
            "maxItems": 3,
            "minItems": 3,
            "uniqueItems": true
          },
          "may_propose_text": {
            "type": "boolean"
          },
          "merge_with_revise": {
            "type": "boolean"
          }
        },
        "required": [
          "policy",
          "outcomes",
          "may_propose_text",
          "merge_with_revise"
        ]
      },
      "explore": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "option_map_gate": {
            "$ref": "primitives.schema.json#/$defs/versioned_ref"
          },
          "suggested_after": {
            "type": "array",
            "items": {
              "$ref": "primitives.schema.json#/$defs/step_id"
            },
            "maxItems": 60
          }
        },
        "required": [
          "option_map_gate",
          "suggested_after"
        ],
        "description": "Explore is allowed at every step boundary (ruling 8); no field can forbid one."
      },
      "outputs": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "port": {
              "$ref": "primitives.schema.json#/$defs/name"
            },
            "type_ref": {
              "$ref": "primitives.schema.json#/$defs/versioned_ref"
            },
            "datafile": {
              "type": "boolean"
            },
            "handling": {
              "anyOf": [
                {
                  "$ref": "primitives.schema.json#/$defs/handling"
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "required": [
            "port",
            "type_ref",
            "datafile",
            "handling"
          ],
          "allOf": [
            {
              "$ref": "primitives.schema.json#/$defs/handling_port_rule"
            }
          ]
        },
        "maxItems": 20,
        "minItems": 1
      },
      "output_menu": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "choice_id": {
              "$ref": "primitives.schema.json#/$defs/name"
            },
            "label": {
              "type": "string",
              "maxLength": 80
            },
            "from_outputs": {
              "type": "array",
              "items": {
                "$ref": "primitives.schema.json#/$defs/name"
              },
              "maxItems": 10,
              "minItems": 1
            },
            "format": {
              "$ref": "primitives.schema.json#/$defs/menu_format"
            }
          },
          "required": [
            "choice_id",
            "label",
            "from_outputs",
            "format"
          ]
        },
        "maxItems": 20,
        "minItems": 1
      },
      "variants": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "full": {
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "type": "object",
                  "additionalProperties": false,
                  "properties": {
                    "op": {
                      "const": "set_rounds"
                    },
                    "value": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 3
                    },
                    "extra_round_if": {
                      "const": "blocking_open"
                    }
                  },
                  "required": [
                    "op",
                    "value"
                  ]
                },
                {
                  "type": "object",
                  "additionalProperties": false,
                  "properties": {
                    "op": {
                      "const": "merge"
                    },
                    "steps": {
                      "type": "array",
                      "items": {
                        "$ref": "primitives.schema.json#/$defs/step_id"
                      },
                      "maxItems": 2,
                      "minItems": 2
                    }
                  },
                  "required": [
                    "op",
                    "steps"
                  ]
                },
                {
                  "type": "object",
                  "additionalProperties": false,
                  "properties": {
                    "op": {
                      "const": "add_step"
                    },
                    "step": {
                      "allOf": [
                        {
                          "$ref": "primitives.schema.json#/$defs/template_step"
                        },
                        {
                          "properties": {
                            "kind": {
                              "enum": [
                                "make",
                                "check"
                              ]
                            }
                          }
                        }
                      ]
                    },
                    "after": {
                      "$ref": "primitives.schema.json#/$defs/step_id"
                    }
                  },
                  "required": [
                    "op",
                    "step",
                    "after"
                  ]
                },
                {
                  "type": "object",
                  "additionalProperties": false,
                  "properties": {
                    "op": {
                      "const": "drop_step"
                    },
                    "step_id": {
                      "$ref": "primitives.schema.json#/$defs/step_id"
                    }
                  },
                  "required": [
                    "op",
                    "step_id"
                  ]
                },
                {
                  "type": "object",
                  "additionalProperties": false,
                  "properties": {
                    "op": {
                      "const": "parallelise"
                    },
                    "step_id": {
                      "$ref": "primitives.schema.json#/$defs/step_id"
                    },
                    "copies": {
                      "type": "integer",
                      "minimum": 2,
                      "maximum": 4
                    }
                  },
                  "required": [
                    "op",
                    "step_id",
                    "copies"
                  ]
                },
                {
                  "type": "object",
                  "additionalProperties": false,
                  "properties": {
                    "op": {
                      "const": "cascade"
                    },
                    "step_id": {
                      "$ref": "primitives.schema.json#/$defs/step_id"
                    },
                    "to_model_class": {
                      "enum": [
                        "balanced",
                        "strong"
                      ]
                    },
                    "when_grade": {
                      "enum": [
                        "weak",
                        "moderate"
                      ]
                    }
                  },
                  "required": [
                    "op",
                    "step_id",
                    "to_model_class",
                    "when_grade"
                  ]
                }
              ]
            },
            "maxItems": 20
          },
          "lean": {
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "type": "object",
                  "additionalProperties": false,
                  "properties": {
                    "op": {
                      "const": "set_rounds"
                    },
                    "value": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 3
                    },
                    "extra_round_if": {
                      "const": "blocking_open"
                    }
                  },
                  "required": [
                    "op",
                    "value"
                  ]
                },
                {
                  "type": "object",
                  "additionalProperties": false,
                  "properties": {
                    "op": {
                      "const": "merge"
                    },
                    "steps": {
                      "type": "array",
                      "items": {
                        "$ref": "primitives.schema.json#/$defs/step_id"
                      },
                      "maxItems": 2,
                      "minItems": 2
                    }
                  },
                  "required": [
                    "op",
                    "steps"
                  ]
                },
                {
                  "type": "object",
                  "additionalProperties": false,
                  "properties": {
                    "op": {
                      "const": "add_step"
                    },
                    "step": {
                      "allOf": [
                        {
                          "$ref": "primitives.schema.json#/$defs/template_step"
                        },
                        {
                          "properties": {
                            "kind": {
                              "enum": [
                                "make",
                                "check"
                              ]
                            }
                          }
                        }
                      ]
                    },
                    "after": {
                      "$ref": "primitives.schema.json#/$defs/step_id"
                    }
                  },
                  "required": [
                    "op",
                    "step",
                    "after"
                  ]
                },
                {
                  "type": "object",
                  "additionalProperties": false,
                  "properties": {
                    "op": {
                      "const": "drop_step"
                    },
                    "step_id": {
                      "$ref": "primitives.schema.json#/$defs/step_id"
                    }
                  },
                  "required": [
                    "op",
                    "step_id"
                  ]
                },
                {
                  "type": "object",
                  "additionalProperties": false,
                  "properties": {
                    "op": {
                      "const": "parallelise"
                    },
                    "step_id": {
                      "$ref": "primitives.schema.json#/$defs/step_id"
                    },
                    "copies": {
                      "type": "integer",
                      "minimum": 2,
                      "maximum": 4
                    }
                  },
                  "required": [
                    "op",
                    "step_id",
                    "copies"
                  ]
                },
                {
                  "type": "object",
                  "additionalProperties": false,
                  "properties": {
                    "op": {
                      "const": "cascade"
                    },
                    "step_id": {
                      "$ref": "primitives.schema.json#/$defs/step_id"
                    },
                    "to_model_class": {
                      "enum": [
                        "balanced",
                        "strong"
                      ]
                    },
                    "when_grade": {
                      "enum": [
                        "weak",
                        "moderate"
                      ]
                    }
                  },
                  "required": [
                    "op",
                    "step_id",
                    "to_model_class",
                    "when_grade"
                  ]
                }
              ]
            },
            "maxItems": 20
          },
          "solo": {
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "type": "object",
                  "additionalProperties": false,
                  "properties": {
                    "op": {
                      "const": "set_rounds"
                    },
                    "value": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 3
                    },
                    "extra_round_if": {
                      "const": "blocking_open"
                    }
                  },
                  "required": [
                    "op",
                    "value"
                  ]
                },
                {
                  "type": "object",
                  "additionalProperties": false,
                  "properties": {
                    "op": {
                      "const": "merge"
                    },
                    "steps": {
                      "type": "array",
                      "items": {
                        "$ref": "primitives.schema.json#/$defs/step_id"
                      },
                      "maxItems": 2,
                      "minItems": 2
                    }
                  },
                  "required": [
                    "op",
                    "steps"
                  ]
                },
                {
                  "type": "object",
                  "additionalProperties": false,
                  "properties": {
                    "op": {
                      "const": "add_step"
                    },
                    "step": {
                      "allOf": [
                        {
                          "$ref": "primitives.schema.json#/$defs/template_step"
                        },
                        {
                          "properties": {
                            "kind": {
                              "enum": [
                                "make",
                                "check"
                              ]
                            }
                          }
                        }
                      ]
                    },
                    "after": {
                      "$ref": "primitives.schema.json#/$defs/step_id"
                    }
                  },
                  "required": [
                    "op",
                    "step",
                    "after"
                  ]
                },
                {
                  "type": "object",
                  "additionalProperties": false,
                  "properties": {
                    "op": {
                      "const": "drop_step"
                    },
                    "step_id": {
                      "$ref": "primitives.schema.json#/$defs/step_id"
                    }
                  },
                  "required": [
                    "op",
                    "step_id"
                  ]
                },
                {
                  "type": "object",
                  "additionalProperties": false,
                  "properties": {
                    "op": {
                      "const": "parallelise"
                    },
                    "step_id": {
                      "$ref": "primitives.schema.json#/$defs/step_id"
                    },
                    "copies": {
                      "type": "integer",
                      "minimum": 2,
                      "maximum": 4
                    }
                  },
                  "required": [
                    "op",
                    "step_id",
                    "copies"
                  ]
                },
                {
                  "type": "object",
                  "additionalProperties": false,
                  "properties": {
                    "op": {
                      "const": "cascade"
                    },
                    "step_id": {
                      "$ref": "primitives.schema.json#/$defs/step_id"
                    },
                    "to_model_class": {
                      "enum": [
                        "balanced",
                        "strong"
                      ]
                    },
                    "when_grade": {
                      "enum": [
                        "weak",
                        "moderate"
                      ]
                    }
                  },
                  "required": [
                    "op",
                    "step_id",
                    "to_model_class",
                    "when_grade"
                  ]
                }
              ]
            },
            "maxItems": 20
          }
        },
        "description": "Overlays on the template body, which is Standard (\xA73.3.4). Free bundles carry {}."
      },
      "host_requirements": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "isolated_contexts": {
            "enum": [
              "required",
              "preferred",
              "none"
            ]
          },
          "code_execution": {
            "enum": [
              "required",
              "preferred",
              "none"
            ]
          },
          "web_fetch": {
            "enum": [
              "required",
              "preferred",
              "none"
            ]
          },
          "file_io": {
            "enum": [
              "required",
              "preferred"
            ]
          },
          "hooks": {
            "enum": [
              "preferred",
              "none"
            ]
          },
          "fallbacks": {
            "type": "array",
            "items": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "capability": {
                  "enum": [
                    "isolated_contexts",
                    "code_execution",
                    "web_fetch",
                    "file_io",
                    "hooks"
                  ]
                },
                "action": {
                  "enum": [
                    "browser_app_after",
                    "instruct_only",
                    "skip_step"
                  ]
                },
                "steps": {
                  "type": "array",
                  "items": {
                    "$ref": "primitives.schema.json#/$defs/step_id"
                  },
                  "maxItems": 60,
                  "minItems": 1
                },
                "record_status": {
                  "$ref": "primitives.schema.json#/$defs/status_list"
                },
                "sidecar_status": {
                  "anyOf": [
                    {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "additionalProperties": false,
                        "properties": {
                          "invariant": {
                            "$ref": "primitives.schema.json#/$defs/invariant"
                          },
                          "status": {
                            "enum": [
                              "checked_after",
                              "not_met"
                            ]
                          }
                        },
                        "required": [
                          "invariant",
                          "status"
                        ]
                      },
                      "maxItems": 7,
                      "allOf": [
                        {
                          "not": {
                            "contains": {
                              "properties": {
                                "invariant": {
                                  "const": "C1"
                                }
                              },
                              "required": [
                                "invariant"
                              ]
                            },
                            "minContains": 2
                          }
                        },
                        {
                          "not": {
                            "contains": {
                              "properties": {
                                "invariant": {
                                  "const": "C2"
                                }
                              },
                              "required": [
                                "invariant"
                              ]
                            },
                            "minContains": 2
                          }
                        },
                        {
                          "not": {
                            "contains": {
                              "properties": {
                                "invariant": {
                                  "const": "C3"
                                }
                              },
                              "required": [
                                "invariant"
                              ]
                            },
                            "minContains": 2
                          }
                        },
                        {
                          "not": {
                            "contains": {
                              "properties": {
                                "invariant": {
                                  "const": "C4"
                                }
                              },
                              "required": [
                                "invariant"
                              ]
                            },
                            "minContains": 2
                          }
                        },
                        {
                          "not": {
                            "contains": {
                              "properties": {
                                "invariant": {
                                  "const": "C5"
                                }
                              },
                              "required": [
                                "invariant"
                              ]
                            },
                            "minContains": 2
                          }
                        },
                        {
                          "not": {
                            "contains": {
                              "properties": {
                                "invariant": {
                                  "const": "C6"
                                }
                              },
                              "required": [
                                "invariant"
                              ]
                            },
                            "minContains": 2
                          }
                        },
                        {
                          "not": {
                            "contains": {
                              "properties": {
                                "invariant": {
                                  "const": "C7"
                                }
                              },
                              "required": [
                                "invariant"
                              ]
                            },
                            "minContains": 2
                          }
                        }
                      ]
                    },
                    {
                      "type": "null"
                    }
                  ]
                }
              },
              "required": [
                "capability",
                "action",
                "steps",
                "record_status",
                "sidecar_status"
              ],
              "allOf": [
                {
                  "if": {
                    "properties": {
                      "action": {
                        "const": "browser_app_after"
                      }
                    },
                    "required": [
                      "action"
                    ]
                  },
                  "then": {
                    "properties": {
                      "sidecar_status": {
                        "type": "array"
                      }
                    }
                  }
                },
                {
                  "if": {
                    "not": {
                      "properties": {
                        "action": {
                          "const": "browser_app_after"
                        }
                      },
                      "required": [
                        "action"
                      ]
                    }
                  },
                  "then": {
                    "properties": {
                      "sidecar_status": {
                        "type": "null"
                      }
                    }
                  }
                }
              ]
            },
            "maxItems": 5
          }
        },
        "required": [
          "isolated_contexts",
          "code_execution",
          "web_fetch",
          "file_io",
          "hooks",
          "fallbacks"
        ],
        "allOf": [
          {
            "if": {
              "properties": {
                "isolated_contexts": {
                  "const": "preferred"
                }
              }
            },
            "then": {
              "properties": {
                "fallbacks": {
                  "contains": {
                    "properties": {
                      "capability": {
                        "const": "isolated_contexts"
                      }
                    },
                    "required": [
                      "capability"
                    ]
                  },
                  "minContains": 1,
                  "maxContains": 1
                }
              }
            }
          },
          {
            "if": {
              "properties": {
                "isolated_contexts": {
                  "not": {
                    "const": "preferred"
                  }
                }
              }
            },
            "then": {
              "properties": {
                "fallbacks": {
                  "not": {
                    "contains": {
                      "properties": {
                        "capability": {
                          "const": "isolated_contexts"
                        }
                      },
                      "required": [
                        "capability"
                      ]
                    }
                  }
                }
              }
            }
          },
          {
            "if": {
              "properties": {
                "code_execution": {
                  "const": "preferred"
                }
              }
            },
            "then": {
              "properties": {
                "fallbacks": {
                  "contains": {
                    "properties": {
                      "capability": {
                        "const": "code_execution"
                      }
                    },
                    "required": [
                      "capability"
                    ]
                  },
                  "minContains": 1,
                  "maxContains": 1
                }
              }
            }
          },
          {
            "if": {
              "properties": {
                "code_execution": {
                  "not": {
                    "const": "preferred"
                  }
                }
              }
            },
            "then": {
              "properties": {
                "fallbacks": {
                  "not": {
                    "contains": {
                      "properties": {
                        "capability": {
                          "const": "code_execution"
                        }
                      },
                      "required": [
                        "capability"
                      ]
                    }
                  }
                }
              }
            }
          },
          {
            "if": {
              "properties": {
                "web_fetch": {
                  "const": "preferred"
                }
              }
            },
            "then": {
              "properties": {
                "fallbacks": {
                  "contains": {
                    "properties": {
                      "capability": {
                        "const": "web_fetch"
                      }
                    },
                    "required": [
                      "capability"
                    ]
                  },
                  "minContains": 1,
                  "maxContains": 1
                }
              }
            }
          },
          {
            "if": {
              "properties": {
                "web_fetch": {
                  "not": {
                    "const": "preferred"
                  }
                }
              }
            },
            "then": {
              "properties": {
                "fallbacks": {
                  "not": {
                    "contains": {
                      "properties": {
                        "capability": {
                          "const": "web_fetch"
                        }
                      },
                      "required": [
                        "capability"
                      ]
                    }
                  }
                }
              }
            }
          },
          {
            "if": {
              "properties": {
                "file_io": {
                  "const": "preferred"
                }
              }
            },
            "then": {
              "properties": {
                "fallbacks": {
                  "contains": {
                    "properties": {
                      "capability": {
                        "const": "file_io"
                      }
                    },
                    "required": [
                      "capability"
                    ]
                  },
                  "minContains": 1,
                  "maxContains": 1
                }
              }
            }
          },
          {
            "if": {
              "properties": {
                "file_io": {
                  "not": {
                    "const": "preferred"
                  }
                }
              }
            },
            "then": {
              "properties": {
                "fallbacks": {
                  "not": {
                    "contains": {
                      "properties": {
                        "capability": {
                          "const": "file_io"
                        }
                      },
                      "required": [
                        "capability"
                      ]
                    }
                  }
                }
              }
            }
          },
          {
            "if": {
              "properties": {
                "hooks": {
                  "const": "preferred"
                }
              }
            },
            "then": {
              "properties": {
                "fallbacks": {
                  "contains": {
                    "properties": {
                      "capability": {
                        "const": "hooks"
                      }
                    },
                    "required": [
                      "capability"
                    ]
                  },
                  "minContains": 1,
                  "maxContains": 1
                }
              }
            }
          },
          {
            "if": {
              "properties": {
                "hooks": {
                  "not": {
                    "const": "preferred"
                  }
                }
              }
            },
            "then": {
              "properties": {
                "fallbacks": {
                  "not": {
                    "contains": {
                      "properties": {
                        "capability": {
                          "const": "hooks"
                        }
                      },
                      "required": [
                        "capability"
                      ]
                    }
                  }
                }
              }
            }
          }
        ]
      },
      "escalate_on": {
        "type": "array",
        "items": {
          "enum": [
            "checker_disagreement",
            "conclusion_change",
            "unresolvable_gate",
            "budget_exceeded",
            "waiver_request"
          ]
        },
        "maxItems": 5,
        "uniqueItems": true
      },
      "stop": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "max_rounds": {
            "type": "integer",
            "minimum": 1,
            "maximum": 3
          },
          "stop_when": {
            "const": "no_new_blocking"
          },
          "ticket_timeout": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "make": {
                "type": "integer",
                "minimum": 1,
                "maximum": 86400
              },
              "check": {
                "type": "integer",
                "minimum": 1,
                "maximum": 86400
              },
              "recheck": {
                "type": "integer",
                "minimum": 1,
                "maximum": 86400
              },
              "adjudicate": {
                "type": "integer",
                "minimum": 1,
                "maximum": 86400
              },
              "revise": {
                "type": "integer",
                "minimum": 1,
                "maximum": 86400
              }
            },
            "required": [
              "make",
              "check",
              "recheck",
              "adjudicate",
              "revise"
            ]
          }
        },
        "required": [
          "max_rounds",
          "stop_when",
          "ticket_timeout"
        ]
      },
      "budget": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "unit": {
            "enum": [
              "tokens",
              "requests",
              "steps"
            ]
          },
          "on_exceed": {
            "const": "pause_and_ask"
          }
        },
        "required": [
          "unit",
          "on_exceed"
        ]
      },
      "protected_paths": {
        "type": "array",
        "items": {
          "type": "string",
          "maxLength": 300,
          "minLength": 1
        },
        "maxItems": 50
      },
      "report": {
        "anyOf": [
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "report_version": {
                "$ref": "primitives.schema.json#/$defs/semver"
              },
              "report_fingerprint": {
                "$ref": "primitives.schema.json#/$defs/fingerprint_jcs1"
              }
            },
            "required": [
              "report_version",
              "report_fingerprint"
            ]
          },
          {
            "type": "null"
          }
        ]
      },
      "signature": {
        "type": "null",
        "description": "Reserved; scheme open (O-6)."
      }
    },
    "required": [
      "schema",
      "template_id",
      "version",
      "fingerprint",
      "catalogue",
      "parent",
      "risk_tier_default",
      "work_unit",
      "inputs",
      "threads",
      "steps",
      "gates",
      "checkers",
      "adjudication",
      "explore",
      "outputs",
      "output_menu",
      "variants",
      "host_requirements",
      "escalate_on",
      "stop",
      "budget",
      "protected_paths",
      "report",
      "signature"
    ],
    "description": "One versioned braid definition (\xA73.3). The free bundle has the same shape with report null and variants {}."
  },
  "braids_lock": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://fairlead.heuris.com.au/contracts/braids/v0.1/braids_lock.schema.json",
    "title": "braids_lock",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "schema": {
        "const": "fairlead.braids_lock/0.1"
      },
      "templates": {
        "type": "object",
        "propertyNames": {
          "pattern": "^[a-z0-9_.]+@(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)(?![\\s\\S])"
        },
        "additionalProperties": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "core": {
              "$ref": "primitives.schema.json#/$defs/fingerprint_jcs1"
            },
            "report": {
              "anyOf": [
                {
                  "$ref": "primitives.schema.json#/$defs/fingerprint_jcs1"
                },
                {
                  "type": "null"
                }
              ]
            },
            "free_bundle": {
              "anyOf": [
                {
                  "$ref": "primitives.schema.json#/$defs/fingerprint_jcs1"
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "required": [
            "core",
            "report",
            "free_bundle"
          ]
        }
      },
      "threads": {
        "type": "object",
        "propertyNames": {
          "pattern": "^[a-z][a-z0-9_]{0,63}@(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)(?![\\s\\S])"
        },
        "additionalProperties": {
          "$ref": "primitives.schema.json#/$defs/fingerprint"
        }
      },
      "gates": {
        "type": "object",
        "propertyNames": {
          "pattern": "^[a-z][a-z0-9_]{0,63}@(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)(?![\\s\\S])"
        },
        "additionalProperties": {
          "$ref": "primitives.schema.json#/$defs/fingerprint"
        }
      },
      "types": {
        "type": "object",
        "propertyNames": {
          "pattern": "^[a-z][a-z0-9_]{0,63}@(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)(?![\\s\\S])"
        },
        "additionalProperties": {
          "$ref": "primitives.schema.json#/$defs/fingerprint"
        }
      },
      "preambles": {
        "type": "object",
        "propertyNames": {
          "pattern": "^[a-z][a-z0-9_]{0,63}@(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)(?![\\s\\S])"
        },
        "additionalProperties": {
          "$ref": "primitives.schema.json#/$defs/fingerprint"
        }
      }
    },
    "required": [
      "schema",
      "templates",
      "threads",
      "gates",
      "types",
      "preambles"
    ],
    "description": "braids/braids.lock.json (\xA73.1, \xA73.2): every id@version pinned to its fingerprint."
  },
  "context_doc": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://fairlead.heuris.com.au/contracts/braids/v0.1/context_doc.schema.json",
    "title": "context_doc",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "run": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "run_id": {
            "$ref": "primitives.schema.json#/$defs/id_run"
          },
          "template_id": {
            "$ref": "primitives.schema.json#/$defs/template_id"
          },
          "template_fingerprint": {
            "$ref": "primitives.schema.json#/$defs/fingerprint_jcs1"
          },
          "variant": {
            "$ref": "primitives.schema.json#/$defs/variant"
          },
          "project_id": {
            "anyOf": [
              {
                "$ref": "primitives.schema.json#/$defs/id_prj"
              },
              {
                "type": "null"
              }
            ]
          },
          "branch_id": {
            "anyOf": [
              {
                "$ref": "primitives.schema.json#/$defs/id_br"
              },
              {
                "type": "null"
              }
            ]
          }
        },
        "required": [
          "run_id",
          "template_id",
          "template_fingerprint",
          "variant",
          "project_id",
          "branch_id"
        ]
      },
      "focus": {
        "anyOf": [
          {
            "$ref": "agreed_focus.schema.json"
          },
          {
            "type": "null"
          }
        ]
      },
      "sources": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "source_id": {
              "type": "string",
              "maxLength": 64,
              "pattern": "^[A-Za-z0-9_.:-]+(?![\\s\\S])"
            },
            "title": {
              "type": "string",
              "maxLength": 240
            },
            "note": {
              "type": "string",
              "maxLength": 200
            },
            "read_level": {
              "$ref": "primitives.schema.json#/$defs/read_level"
            }
          },
          "required": [
            "source_id",
            "title",
            "note",
            "read_level"
          ]
        },
        "maxItems": 60
      },
      "structure_card": {
        "type": [
          "object",
          "null"
        ],
        "description": "Column profiles only, never rows, in braids that declare datafile handling."
      },
      "decisions": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "at": {
              "$ref": "primitives.schema.json#/$defs/timestamp"
            },
            "by": {
              "enum": [
                "user",
                "leader",
                "admin",
                "adjudicator"
              ]
            },
            "text": {
              "type": "string",
              "maxLength": 400
            }
          },
          "required": [
            "at",
            "by",
            "text"
          ]
        },
        "maxItems": 200
      },
      "open_findings": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "finding_id": {
              "type": "string",
              "maxLength": 64,
              "pattern": "^[A-Za-z0-9_.:-]+(?![\\s\\S])"
            },
            "summary": {
              "type": "string",
              "maxLength": 240
            },
            "severity": {
              "enum": [
                "block",
                "warn"
              ]
            }
          },
          "required": [
            "finding_id",
            "summary",
            "severity"
          ]
        },
        "maxItems": 40
      },
      "artefact_refs": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "ref": {
              "type": "string",
              "maxLength": 64,
              "pattern": "^[A-Za-z0-9_.:-]+(?![\\s\\S])"
            },
            "kind": {
              "type": "string",
              "maxLength": 40
            },
            "path": {
              "$ref": "primitives.schema.json#/$defs/file_ref"
            },
            "contract": {
              "anyOf": [
                {
                  "$ref": "primitives.schema.json#/$defs/name"
                },
                {
                  "type": "null"
                }
              ]
            },
            "fingerprint": {
              "$ref": "primitives.schema.json#/$defs/fingerprint"
            }
          },
          "required": [
            "ref",
            "kind",
            "path",
            "contract",
            "fingerprint"
          ]
        },
        "maxItems": 100
      }
    },
    "required": [
      "run",
      "focus",
      "sources",
      "structure_card",
      "decisions",
      "open_findings",
      "artefact_refs"
    ],
    "description": "The only shared state between threads (\xA72.4). Sections are owned and capped; decisions are append-only."
  },
  "decisions": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://fairlead.heuris.com.au/contracts/braids/v0.1/decisions.schema.json",
    "title": "decisions",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "decisions": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "finding_id": {
              "type": "string",
              "maxLength": 64,
              "pattern": "^[A-Za-z0-9_.:-]+(?![\\s\\S])"
            },
            "action": {
              "enum": [
                "adopted",
                "partly_adopted",
                "declined"
              ]
            },
            "reason": {
              "type": "string",
              "maxLength": 300
            },
            "evidence_seen": {
              "type": "array",
              "items": {
                "$ref": "primitives.schema.json#/$defs/evidence"
              },
              "maxItems": 6,
              "minItems": 1
            }
          },
          "required": [
            "finding_id",
            "action",
            "reason",
            "evidence_seen"
          ]
        },
        "maxItems": 40
      },
      "escalations": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "type": {
              "enum": [
                "checker_disagreement",
                "conclusion_change",
                "unresolvable_gate",
                "budget_exceeded",
                "waiver_request"
              ]
            },
            "summary": {
              "type": "string",
              "maxLength": 400
            },
            "options": {
              "type": "array",
              "items": {
                "type": "string",
                "maxLength": 200
              },
              "maxItems": 4
            },
            "recommended": {
              "type": [
                "integer",
                "null"
              ]
            }
          },
          "required": [
            "type",
            "summary",
            "options",
            "recommended"
          ]
        },
        "maxItems": 6
      },
      "stop": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "stop": {
            "type": "boolean"
          },
          "reason": {
            "enum": [
              "no_new_blocking",
              "max_rounds",
              "budget",
              "escalated",
              "continue"
            ]
          }
        },
        "required": [
          "stop",
          "reason"
        ]
      }
    },
    "required": [
      "decisions",
      "escalations",
      "stop"
    ],
    "description": "Adjudicator output: every finding tested against the source, with the evidence seen. No content."
  },
  "draft": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://fairlead.heuris.com.au/contracts/braids/v0.1/draft.schema.json",
    "title": "draft",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "sections": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "heading": {
              "type": "string",
              "maxLength": 160
            },
            "paragraphs": {
              "type": "array",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "properties": {
                  "text": {
                    "type": "string",
                    "maxLength": 2e3
                  },
                  "claims": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "additionalProperties": false,
                      "properties": {
                        "claim_id": {
                          "type": "string",
                          "maxLength": 64,
                          "pattern": "^[A-Za-z0-9_.:-]+(?![\\s\\S])"
                        },
                        "text": {
                          "type": "string",
                          "maxLength": 400
                        },
                        "kind": {
                          "$ref": "primitives.schema.json#/$defs/claim_tag"
                        },
                        "support": {
                          "type": "array",
                          "items": {
                            "type": "object",
                            "additionalProperties": false,
                            "properties": {
                              "source_id": {
                                "type": "string",
                                "maxLength": 64,
                                "pattern": "^[A-Za-z0-9_.:-]+(?![\\s\\S])"
                              },
                              "anchor": {
                                "type": "object",
                                "additionalProperties": false,
                                "properties": {
                                  "page": {
                                    "type": [
                                      "integer",
                                      "null"
                                    ],
                                    "minimum": 1
                                  },
                                  "section": {
                                    "type": [
                                      "string",
                                      "null"
                                    ],
                                    "maxLength": 120
                                  },
                                  "quote": {
                                    "type": [
                                      "string",
                                      "null"
                                    ],
                                    "maxLength": 400
                                  }
                                },
                                "required": [
                                  "page",
                                  "section",
                                  "quote"
                                ],
                                "description": "Where in a source something comes from. At least one field should be non-null; the quote matcher gate checks quotes verbatim."
                              }
                            },
                            "required": [
                              "source_id",
                              "anchor"
                            ]
                          },
                          "maxItems": 6
                        }
                      },
                      "required": [
                        "claim_id",
                        "text",
                        "kind",
                        "support"
                      ]
                    },
                    "maxItems": 12
                  },
                  "figures": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "additionalProperties": false,
                      "properties": {
                        "figure_id": {
                          "type": "string",
                          "maxLength": 64,
                          "pattern": "^[A-Za-z0-9_.:-]+(?![\\s\\S])"
                        },
                        "value": {
                          "type": [
                            "number",
                            "string"
                          ]
                        },
                        "unit": {
                          "type": "string",
                          "maxLength": 40
                        },
                        "source_id": {
                          "type": "string",
                          "maxLength": 64,
                          "pattern": "^[A-Za-z0-9_.:-]+(?![\\s\\S])"
                        },
                        "anchor": {
                          "type": "object",
                          "additionalProperties": false,
                          "properties": {
                            "page": {
                              "type": [
                                "integer",
                                "null"
                              ],
                              "minimum": 1
                            },
                            "section": {
                              "type": [
                                "string",
                                "null"
                              ],
                              "maxLength": 120
                            },
                            "quote": {
                              "type": [
                                "string",
                                "null"
                              ],
                              "maxLength": 400
                            }
                          },
                          "required": [
                            "page",
                            "section",
                            "quote"
                          ],
                          "description": "Where in a source something comes from. At least one field should be non-null; the quote matcher gate checks quotes verbatim."
                        }
                      },
                      "required": [
                        "figure_id",
                        "value",
                        "unit",
                        "source_id",
                        "anchor"
                      ]
                    },
                    "maxItems": 20
                  }
                },
                "required": [
                  "text",
                  "claims",
                  "figures"
                ]
              },
              "maxItems": 30
            }
          },
          "required": [
            "heading",
            "paragraphs"
          ]
        },
        "maxItems": 20
      },
      "references": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "ref_id": {
              "type": "string",
              "maxLength": 64,
              "pattern": "^[A-Za-z0-9_.:-]+(?![\\s\\S])"
            },
            "source_id": {
              "type": "string",
              "maxLength": 64,
              "pattern": "^[A-Za-z0-9_.:-]+(?![\\s\\S])"
            },
            "citation": {
              "type": "string",
              "maxLength": 400
            },
            "doi": {
              "anyOf": [
                {
                  "type": "string",
                  "maxLength": 200
                },
                {
                  "type": "null"
                }
              ]
            },
            "url": {
              "anyOf": [
                {
                  "type": "string",
                  "maxLength": 500
                },
                {
                  "type": "null"
                }
              ]
            },
            "read_level": {
              "$ref": "primitives.schema.json#/$defs/read_level"
            }
          },
          "required": [
            "ref_id",
            "source_id",
            "citation",
            "read_level"
          ]
        },
        "maxItems": 200
      },
      "word_count": {
        "type": "integer",
        "minimum": 0
      }
    },
    "required": [
      "sections",
      "references",
      "word_count"
    ],
    "description": "Maker output. Every claim carries a tag and its support; every in-text citation resolves to a ref_id, and cite_gate checks each reference."
  },
  "evidence_table": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://fairlead.heuris.com.au/contracts/braids/v0.1/evidence_table.schema.json",
    "title": "evidence_table",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "rows": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "source_id": {
              "type": "string",
              "maxLength": 64,
              "pattern": "^[A-Za-z0-9_.:-]+(?![\\s\\S])"
            },
            "read_level": {
              "$ref": "primitives.schema.json#/$defs/read_level"
            },
            "sub_questions": {
              "$ref": "primitives.schema.json#/$defs/sub_questions"
            },
            "approach": {
              "type": "string",
              "maxLength": 300
            },
            "data": {
              "enum": [
                "field",
                "lab",
                "online",
                "mixed",
                "simulated",
                "review",
                "none"
              ]
            },
            "elicited": {
              "type": "string",
              "maxLength": 300
            },
            "key_findings": {
              "type": "array",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "properties": {
                  "text": {
                    "type": "string",
                    "maxLength": 400
                  },
                  "anchor": {
                    "type": "object",
                    "additionalProperties": false,
                    "properties": {
                      "page": {
                        "type": [
                          "integer",
                          "null"
                        ],
                        "minimum": 1
                      },
                      "section": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "maxLength": 120
                      },
                      "quote": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "maxLength": 400
                      }
                    },
                    "required": [
                      "page",
                      "section",
                      "quote"
                    ],
                    "description": "Where in a source something comes from. At least one field should be non-null; the quote matcher gate checks quotes verbatim."
                  }
                },
                "required": [
                  "text",
                  "anchor"
                ]
              },
              "maxItems": 6
            },
            "evidence_strength": {
              "enum": [
                "rct_or_quasi",
                "observational",
                "modelling",
                "descriptive",
                "opinion",
                "unclear"
              ]
            }
          },
          "required": [
            "source_id",
            "read_level",
            "sub_questions",
            "approach",
            "data",
            "elicited",
            "key_findings",
            "evidence_strength"
          ],
          "allOf": [
            {
              "if": {
                "properties": {
                  "read_level": {
                    "const": "record"
                  }
                },
                "required": [
                  "read_level"
                ]
              },
              "then": {
                "properties": {
                  "key_findings": {
                    "maxItems": 0
                  }
                }
              }
            }
          ]
        },
        "maxItems": 150
      }
    },
    "required": [
      "rows"
    ],
    "description": "One row per included source: approach, data, what is elicited, key findings with anchors. Record-only sources carry no findings (EV-6; the quote gate fails a quote on a record read)."
  },
  "findings": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://fairlead.heuris.com.au/contracts/braids/v0.1/findings.schema.json",
    "title": "findings",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "verdict": {
        "enum": [
          "pass",
          "issues",
          "blocking"
        ]
      },
      "scope": {
        "enum": [
          "full",
          "round_diff",
          "added_text"
        ]
      },
      "findings": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "finding_id": {
              "type": "string",
              "maxLength": 64,
              "pattern": "^[A-Za-z0-9_.:-]+(?![\\s\\S])"
            },
            "concern": {
              "type": "string",
              "maxLength": 40
            },
            "severity": {
              "enum": [
                "block",
                "warn"
              ]
            },
            "grade": {
              "anyOf": [
                {
                  "enum": [
                    "strong",
                    "moderate",
                    "weak"
                  ]
                },
                {
                  "type": "null"
                }
              ],
              "description": "EV-5; null only when EV-5 is off."
            },
            "location": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "artefact_ref": {
                  "type": "string",
                  "maxLength": 64,
                  "pattern": "^[A-Za-z0-9_.:-]+(?![\\s\\S])"
                },
                "anchor": {
                  "type": "string",
                  "maxLength": 200
                }
              },
              "required": [
                "artefact_ref",
                "anchor"
              ]
            },
            "claim": {
              "type": "string",
              "maxLength": 400
            },
            "evidence": {
              "type": "array",
              "items": {
                "$ref": "primitives.schema.json#/$defs/evidence"
              },
              "maxItems": 4
            },
            "suggested_fix": {
              "type": [
                "string",
                "null"
              ],
              "maxLength": 400
            },
            "confidence": {
              "type": "number",
              "minimum": 0,
              "maximum": 1
            }
          },
          "required": [
            "finding_id",
            "concern",
            "severity",
            "grade",
            "location",
            "claim",
            "evidence",
            "suggested_fix",
            "confidence"
          ]
        },
        "maxItems": 10
      },
      "embedded_instructions_detected": {
        "type": "boolean",
        "description": "True if any source contained text addressed to an AI (prompt injection). Always reported (S3)."
      }
    },
    "required": [
      "verdict",
      "scope",
      "findings",
      "embedded_instructions_detected"
    ],
    "description": "Every checker and re-checker. Capped at 10 findings. Evidence rules EV-1 to EV-6 (\xA73.3.2)."
  },
  "gate": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://fairlead.heuris.com.au/contracts/braids/v0.1/gate.schema.json",
    "title": "gate",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "schema": {
        "const": "fairlead.gate/0.1"
      },
      "gate_id": {
        "$ref": "primitives.schema.json#/$defs/name"
      },
      "version": {
        "$ref": "primitives.schema.json#/$defs/semver"
      },
      "fingerprint": {
        "$ref": "primitives.schema.json#/$defs/fingerprint_jcs1"
      },
      "protocol": {
        "const": "gate_io/0.1"
      },
      "scripts": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "runtime": {
              "enum": [
                "python",
                "js"
              ]
            },
            "entry": {
              "$ref": "primitives.schema.json#/$defs/file_ref"
            },
            "script_fingerprint": {
              "$ref": "primitives.schema.json#/$defs/fingerprint_raw"
            }
          },
          "required": [
            "runtime",
            "entry",
            "script_fingerprint"
          ]
        },
        "maxItems": 2,
        "minItems": 1,
        "allOf": [
          {
            "not": {
              "contains": {
                "properties": {
                  "runtime": {
                    "const": "python"
                  }
                },
                "required": [
                  "runtime"
                ]
              },
              "minContains": 2
            }
          },
          {
            "not": {
              "contains": {
                "properties": {
                  "runtime": {
                    "const": "js"
                  }
                },
                "required": [
                  "runtime"
                ]
              },
              "minContains": 2
            }
          }
        ]
      },
      "applies_to": {
        "type": "array",
        "items": {
          "$ref": "primitives.schema.json#/$defs/versioned_ref"
        },
        "maxItems": 20
      },
      "config": {
        "type": [
          "object",
          "null"
        ]
      },
      "network": {
        "anyOf": [
          {
            "const": "none"
          },
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "allow": {
                "type": "array",
                "items": {
                  "type": "string",
                  "maxLength": 253,
                  "pattern": "^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+(?![\\s\\S])"
                },
                "maxItems": 20,
                "minItems": 1
              }
            },
            "required": [
              "allow"
            ]
          }
        ]
      },
      "reads_rows": {
        "type": "boolean"
      },
      "timeout_s": {
        "type": "integer",
        "minimum": 1,
        "maximum": 900
      },
      "vectors": {
        "$ref": "primitives.schema.json#/$defs/file_ref"
      }
    },
    "required": [
      "schema",
      "gate_id",
      "version",
      "fingerprint",
      "protocol",
      "scripts",
      "applies_to",
      "config",
      "network",
      "reads_rows",
      "timeout_s",
      "vectors"
    ],
    "description": "gate.json (\xA73.8). Its fingerprint covers the scripts; both runtimes must match the vectors exactly (TPL-07)."
  },
  "gate_io_input": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://fairlead.heuris.com.au/contracts/braids/v0.1/gate_io_input.schema.json",
    "title": "gate_io_input",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "protocol": {
        "const": "gate_io/0.1"
      },
      "run_id": {
        "$ref": "primitives.schema.json#/$defs/id_run"
      },
      "step_id": {
        "$ref": "primitives.schema.json#/$defs/step_id"
      },
      "gate_ref": {
        "$ref": "primitives.schema.json#/$defs/versioned_ref"
      },
      "target": {
        "anyOf": [
          {
            "$ref": "typed_output.schema.json"
          },
          {
            "type": "null"
          }
        ],
        "description": "Null only for preflight gates, which apply to nothing [proposed]."
      },
      "extra_inputs": {
        "type": "array",
        "items": {
          "$ref": "typed_output.schema.json"
        },
        "maxItems": 20
      },
      "config": {
        "type": [
          "object",
          "null"
        ]
      }
    },
    "required": [
      "protocol",
      "run_id",
      "step_id",
      "gate_ref",
      "target",
      "extra_inputs",
      "config"
    ],
    "description": "The --input file of the gate I/O protocol gate_io/0.1 (\xA73.8). The result is one gate_result."
  },
  "gate_result": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://fairlead.heuris.com.au/contracts/braids/v0.1/gate_result.schema.json",
    "title": "gate_result",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "gate_id": {
        "type": "string",
        "maxLength": 64,
        "pattern": "^[A-Za-z0-9_.:-]+(?![\\s\\S])"
      },
      "gate_ref": {
        "$ref": "primitives.schema.json#/$defs/versioned_ref"
      },
      "status": {
        "enum": [
          "pass",
          "fail",
          "warn",
          "skipped"
        ]
      },
      "checked": {
        "type": "integer",
        "minimum": 0
      },
      "failed": {
        "type": "integer",
        "minimum": 0
      },
      "script_fingerprint": {
        "$ref": "primitives.schema.json#/$defs/fingerprint_raw"
      },
      "input_fingerprints": {
        "type": "array",
        "items": {
          "$ref": "primitives.schema.json#/$defs/fingerprint"
        },
        "maxItems": 50
      },
      "evidence": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "ref": {
              "type": "string",
              "maxLength": 200
            },
            "detail": {
              "type": "string",
              "maxLength": 400
            }
          },
          "required": [
            "ref",
            "detail"
          ]
        },
        "maxItems": 50
      }
    },
    "required": [
      "gate_id",
      "gate_ref",
      "status",
      "checked",
      "failed",
      "script_fingerprint",
      "input_fingerprints",
      "evidence"
    ],
    "description": "Deterministic gate output, produced under gate_io/0.1 (\xA73.8). Evidence is capped and never includes data rows."
  },
  "option_map": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://fairlead.heuris.com.au/contracts/braids/v0.1/option_map.schema.json",
    "title": "option_map",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "schema": {
        "const": "fairlead.option_map/0.1"
      },
      "question": {
        "type": "string",
        "maxLength": 300
      },
      "criteria": {
        "type": "array",
        "items": {
          "type": "string",
          "maxLength": 120
        },
        "maxItems": 8
      },
      "options": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "option_id": {
              "type": "string",
              "maxLength": 64,
              "pattern": "^[A-Za-z0-9_.:-]+(?![\\s\\S])"
            },
            "label": {
              "type": "string",
              "maxLength": 80
            },
            "summary": {
              "type": "string",
              "maxLength": 600
            },
            "evidence_refs": {
              "type": "array",
              "items": {
                "type": "string",
                "maxLength": 64,
                "pattern": "^[A-Za-z0-9_.:-]+(?![\\s\\S])"
              },
              "maxItems": 20
            },
            "strengths": {
              "type": "array",
              "items": {
                "type": "string",
                "maxLength": 200
              },
              "maxItems": 10
            },
            "weaknesses": {
              "type": "array",
              "items": {
                "type": "string",
                "maxLength": 200
              },
              "maxItems": 10
            },
            "risks": {
              "type": "array",
              "items": {
                "type": "string",
                "maxLength": 200
              },
              "maxItems": 10
            },
            "fits_criteria": {
              "type": "array",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "properties": {
                  "criterion": {
                    "type": "string",
                    "maxLength": 120
                  },
                  "judgement": {
                    "type": "string",
                    "maxLength": 200
                  }
                },
                "required": [
                  "criterion",
                  "judgement"
                ]
              },
              "maxItems": 8
            }
          },
          "required": [
            "option_id",
            "label",
            "summary",
            "evidence_refs",
            "strengths",
            "weaknesses",
            "risks",
            "fits_criteria"
          ]
        },
        "maxItems": 8,
        "minItems": 2
      },
      "open_questions": {
        "type": "array",
        "items": {
          "type": "string",
          "maxLength": 300
        },
        "maxItems": 10
      }
    },
    "required": [
      "schema",
      "question",
      "criteria",
      "options",
      "open_questions"
    ],
    "description": "Output of every Explore. No recommendation field; choosing is a decide step."
  },
  "practice_headline": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://fairlead.heuris.com.au/contracts/braids/v0.1/practice_headline.schema.json",
    "title": "practice_headline",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "host_profile": {
        "$ref": "primitives.schema.json#/$defs/host_profile"
      },
      "items": {
        "type": "array",
        "items": {
          "$ref": "primitives.schema.json#/$defs/record_item"
        },
        "maxItems": 7,
        "minItems": 7,
        "allOf": [
          {
            "contains": {
              "properties": {
                "invariant": {
                  "const": "C1"
                }
              },
              "required": [
                "invariant"
              ]
            },
            "minContains": 1,
            "maxContains": 1
          },
          {
            "contains": {
              "properties": {
                "invariant": {
                  "const": "C2"
                }
              },
              "required": [
                "invariant"
              ]
            },
            "minContains": 1,
            "maxContains": 1
          },
          {
            "contains": {
              "properties": {
                "invariant": {
                  "const": "C3"
                }
              },
              "required": [
                "invariant"
              ]
            },
            "minContains": 1,
            "maxContains": 1
          },
          {
            "contains": {
              "properties": {
                "invariant": {
                  "const": "C4"
                }
              },
              "required": [
                "invariant"
              ]
            },
            "minContains": 1,
            "maxContains": 1
          },
          {
            "contains": {
              "properties": {
                "invariant": {
                  "const": "C5"
                }
              },
              "required": [
                "invariant"
              ]
            },
            "minContains": 1,
            "maxContains": 1
          },
          {
            "contains": {
              "properties": {
                "invariant": {
                  "const": "C6"
                }
              },
              "required": [
                "invariant"
              ]
            },
            "minContains": 1,
            "maxContains": 1
          },
          {
            "contains": {
              "properties": {
                "invariant": {
                  "const": "C7"
                }
              },
              "required": [
                "invariant"
              ]
            },
            "minContains": 1,
            "maxContains": 1
          }
        ]
      },
      "floors": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "floor": {
              "enum": [
                "F-1",
                "F-2",
                "F-3",
                "F-4"
              ]
            },
            "held": {
              "type": "boolean"
            },
            "note": {
              "type": "string",
              "maxLength": 200
            }
          },
          "required": [
            "floor",
            "held",
            "note"
          ]
        },
        "maxItems": 4,
        "minItems": 4,
        "allOf": [
          {
            "contains": {
              "properties": {
                "floor": {
                  "const": "F-1"
                }
              },
              "required": [
                "floor"
              ]
            },
            "minContains": 1,
            "maxContains": 1
          },
          {
            "contains": {
              "properties": {
                "floor": {
                  "const": "F-2"
                }
              },
              "required": [
                "floor"
              ]
            },
            "minContains": 1,
            "maxContains": 1
          },
          {
            "contains": {
              "properties": {
                "floor": {
                  "const": "F-3"
                }
              },
              "required": [
                "floor"
              ]
            },
            "minContains": 1,
            "maxContains": 1
          },
          {
            "contains": {
              "properties": {
                "floor": {
                  "const": "F-4"
                }
              },
              "required": [
                "floor"
              ]
            },
            "minContains": 1,
            "maxContains": 1
          }
        ]
      },
      "input_rule_alert": {
        "$ref": "primitives.schema.json#/$defs/input_rule_alert"
      },
      "judgement_items": {
        "type": "array",
        "items": {
          "type": "string",
          "maxLength": 120
        },
        "maxItems": 20
      },
      "line": {
        "type": "string",
        "maxLength": 400
      }
    },
    "required": [
      "host_profile",
      "items",
      "floors",
      "input_rule_alert",
      "judgement_items",
      "line"
    ],
    "description": "Generated by Fairlead code from the run record (O-12, H-8). Ceilings per \xA76.2.1; required evidence is checked by the record check (REC-05)."
  },
  "primitives": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://fairlead.heuris.com.au/contracts/braids/v0.1/primitives.schema.json",
    "title": "primitives",
    "$defs": {
      "id_run": {
        "type": "string",
        "pattern": "^run_[0-7][0-9A-HJKMNP-TV-Z]{25}(?![\\s\\S])",
        "description": "'run_' plus a 26-character ULID (Crockford base32)."
      },
      "id_prj": {
        "type": "string",
        "pattern": "^prj_[0-7][0-9A-HJKMNP-TV-Z]{25}(?![\\s\\S])",
        "description": "'prj_' plus a 26-character ULID (Crockford base32)."
      },
      "id_br": {
        "type": "string",
        "pattern": "^br_[0-7][0-9A-HJKMNP-TV-Z]{25}(?![\\s\\S])",
        "description": "'br_' plus a 26-character ULID (Crockford base32)."
      },
      "id_ho": {
        "type": "string",
        "pattern": "^ho_[0-7][0-9A-HJKMNP-TV-Z]{25}(?![\\s\\S])",
        "description": "'ho_' plus a 26-character ULID (Crockford base32)."
      },
      "id_hb": {
        "type": "string",
        "pattern": "^hb_[0-7][0-9A-HJKMNP-TV-Z]{25}(?![\\s\\S])",
        "description": "'hb_' plus a 26-character ULID (Crockford base32)."
      },
      "id_arc": {
        "type": "string",
        "pattern": "^arc_[0-7][0-9A-HJKMNP-TV-Z]{25}(?![\\s\\S])",
        "description": "'arc_' plus a 26-character ULID (Crockford base32)."
      },
      "id_dec": {
        "type": "string",
        "pattern": "^dec_[0-7][0-9A-HJKMNP-TV-Z]{25}(?![\\s\\S])",
        "description": "'dec_' plus a 26-character ULID (Crockford base32)."
      },
      "id_evt": {
        "type": "string",
        "pattern": "^evt_[0-7][0-9A-HJKMNP-TV-Z]{25}(?![\\s\\S])",
        "description": "'evt_' plus a 26-character ULID (Crockford base32)."
      },
      "id_mbr": {
        "type": "string",
        "pattern": "^mbr_[0-7][0-9A-HJKMNP-TV-Z]{25}(?![\\s\\S])",
        "description": "'mbr_' plus a 26-character ULID (Crockford base32)."
      },
      "id_acc": {
        "type": "string",
        "pattern": "^acc_[0-7][0-9A-HJKMNP-TV-Z]{25}(?![\\s\\S])",
        "description": "'acc_' plus a 26-character ULID (Crockford base32)."
      },
      "id_prc": {
        "type": "string",
        "pattern": "^prc_[0-7][0-9A-HJKMNP-TV-Z]{25}(?![\\s\\S])",
        "description": "'prc_' plus a 26-character ULID (Crockford base32)."
      },
      "id_tkt": {
        "type": "string",
        "pattern": "^tkt_[0-7][0-9A-HJKMNP-TV-Z]{25}(?![\\s\\S])",
        "description": "'tkt_' plus a 26-character ULID (Crockford base32)."
      },
      "name": {
        "type": "string",
        "pattern": "^[a-z][a-z0-9_]{0,63}(?![\\s\\S])"
      },
      "file_ref": {
        "type": "string",
        "maxLength": 300,
        "minLength": 1,
        "pattern": "^(?![/\\\\])(?![A-Za-z]:)(?!(?:[^/]*/)*\\.\\.(?:/|(?![\\s\\S])))[^\\\\\\u0000-\\u001f\\u007f-\\u009f\u2028\u2029]+(?![\\s\\S])",
        "description": "Path relative to the run folder (or archive root); no '..', no absolute path."
      },
      "date": {
        "type": "string",
        "pattern": "^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])(?![\\s\\S])"
      },
      "timestamp": {
        "type": "string",
        "pattern": "^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\\.[0-9]{1,9})?Z(?![\\s\\S])",
        "description": "RFC 3339, UTC."
      },
      "context_id": {
        "type": "string",
        "pattern": "^ctx_[0-9]{1,4}(?![\\s\\S])"
      },
      "fingerprint": {
        "type": "string",
        "pattern": "^(jcs1|raw):sha256:[0-9a-f]{64}(?![\\s\\S])",
        "description": "Provisional until spike S-B (BRAIDS_SPEC \xA76.1)."
      },
      "fingerprint_jcs1": {
        "type": "string",
        "pattern": "^jcs1:sha256:[0-9a-f]{64}(?![\\s\\S])",
        "description": "RFC 8785 JSON. Provisional until spike S-B (BRAIDS_SPEC \xA76.1)."
      },
      "fingerprint_raw": {
        "type": "string",
        "pattern": "^raw:sha256:[0-9a-f]{64}(?![\\s\\S])",
        "description": "File bytes. Provisional until spike S-B (BRAIDS_SPEC \xA76.1)."
      },
      "fingerprint_ref": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "fingerprint": {
            "$ref": "primitives.schema.json#/$defs/fingerprint"
          },
          "of": {
            "enum": [
              "run_record",
              "typed_output",
              "template",
              "free_bundle",
              "report",
              "report_document",
              "report_manifest",
              "file",
              "project_record",
              "archive_manifest",
              "hand_back",
              "hand_off_pack",
              "post_run_checks"
            ]
          }
        },
        "required": [
          "fingerprint",
          "of"
        ]
      },
      "semver": {
        "type": "string",
        "pattern": "^(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)(?![\\s\\S])"
      },
      "versioned_ref": {
        "type": "string",
        "pattern": "^[a-z][a-z0-9_]{0,63}@(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)(?![\\s\\S])",
        "description": "<id>@<semver>: a type, thread, gate or preamble."
      },
      "template_id": {
        "type": "string",
        "maxLength": 128,
        "pattern": "^[a-z0-9_.]+(?![\\s\\S])"
      },
      "step_id": {
        "type": "string",
        "pattern": "^s[0-9]+[a-z]?(?![\\s\\S])"
      },
      "record_path": {
        "type": "string",
        "maxLength": 300,
        "pattern": "^(/.*|output:[a-z][a-z0-9_]{0,63}(/.*)?)(?![\\s\\S])",
        "description": "RFC 6901 pointer into the frozen run record, or output:<port> plus a pointer."
      },
      "entitlement": {
        "enum": [
          "free",
          "individual",
          "small",
          "mid",
          "large",
          "enterprise"
        ]
      },
      "host_profile": {
        "enum": [
          "claude_code",
          "claude_web_plugin"
        ]
      },
      "risk_tier": {
        "enum": [
          "T1",
          "T2",
          "T3"
        ]
      },
      "budget_setting": {
        "enum": [
          "light",
          "normal",
          "thorough"
        ]
      },
      "variant": {
        "enum": [
          "full",
          "standard",
          "lean",
          "solo"
        ]
      },
      "invariant": {
        "enum": [
          "C1",
          "C2",
          "C3",
          "C4",
          "C5",
          "C6",
          "C7"
        ]
      },
      "status": {
        "enum": [
          "enforced",
          "instructed",
          "checked_after",
          "not_met",
          "na"
        ]
      },
      "step_kind": {
        "enum": [
          "preflight",
          "refine",
          "make",
          "run",
          "gate",
          "check",
          "adjudicate",
          "revise",
          "recheck",
          "decide",
          "deliver"
        ]
      },
      "step_status": {
        "enum": [
          "done",
          "failed",
          "skipped",
          "blocked",
          "waived"
        ]
      },
      "isolation": {
        "enum": [
          "separate_context",
          "shared_context",
          "unknown"
        ]
      },
      "decision_kind": {
        "enum": [
          "focus_accept",
          "focus_change",
          "escalation",
          "branch_outcome",
          "output_choice",
          "waiver",
          "input_rule_loosen",
          "abandon"
        ]
      },
      "read_level": {
        "enum": [
          "full_text",
          "full_text_partial",
          "abstract",
          "record"
        ]
      },
      "claim_tag": {
        "enum": [
          "evidence",
          "assumption",
          "derived",
          "judgement",
          "from_memory"
        ]
      },
      "handling_rule": {
        "enum": [
          "structure_card_only",
          "full_access",
          "none_declared"
        ]
      },
      "handling": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "rule": {
            "$ref": "primitives.schema.json#/$defs/handling_rule"
          },
          "source": {
            "enum": [
              "declared",
              "inherited"
            ]
          },
          "set_by": {
            "$ref": "primitives.schema.json#/$defs/template_id"
          }
        },
        "required": [
          "rule",
          "source",
          "set_by"
        ]
      },
      "menu_format": {
        "enum": [
          "md",
          "docx",
          "html",
          "csv",
          "json",
          "table"
        ]
      },
      "role": {
        "enum": [
          "maker",
          "finder",
          "checker",
          "adjudicator",
          "reviser"
        ]
      },
      "input_rule_alert": {
        "anyOf": [
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "rule": {
                "$ref": "primitives.schema.json#/$defs/handling_rule"
              },
              "signs": {
                "type": "array",
                "items": {
                  "enum": [
                    "canary_hit",
                    "datafile_path_read",
                    "row_pattern"
                  ]
                },
                "maxItems": 20,
                "minItems": 1
              },
              "detected_by": {
                "enum": [
                  "hook",
                  "transcript_scan",
                  "import_scan"
                ]
              }
            },
            "required": [
              "rule",
              "signs",
              "detected_by"
            ]
          },
          {
            "type": "null"
          }
        ]
      },
      "invariant_status": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "invariant": {
            "$ref": "primitives.schema.json#/$defs/invariant"
          },
          "status": {
            "$ref": "primitives.schema.json#/$defs/status"
          }
        },
        "required": [
          "invariant",
          "status"
        ]
      },
      "practice": {
        "type": "array",
        "items": {
          "$ref": "primitives.schema.json#/$defs/invariant_status"
        },
        "maxItems": 7,
        "minItems": 7,
        "allOf": [
          {
            "contains": {
              "properties": {
                "invariant": {
                  "const": "C1"
                }
              },
              "required": [
                "invariant"
              ]
            },
            "minContains": 1,
            "maxContains": 1
          },
          {
            "contains": {
              "properties": {
                "invariant": {
                  "const": "C2"
                }
              },
              "required": [
                "invariant"
              ]
            },
            "minContains": 1,
            "maxContains": 1
          },
          {
            "contains": {
              "properties": {
                "invariant": {
                  "const": "C3"
                }
              },
              "required": [
                "invariant"
              ]
            },
            "minContains": 1,
            "maxContains": 1
          },
          {
            "contains": {
              "properties": {
                "invariant": {
                  "const": "C4"
                }
              },
              "required": [
                "invariant"
              ]
            },
            "minContains": 1,
            "maxContains": 1
          },
          {
            "contains": {
              "properties": {
                "invariant": {
                  "const": "C5"
                }
              },
              "required": [
                "invariant"
              ]
            },
            "minContains": 1,
            "maxContains": 1
          },
          {
            "contains": {
              "properties": {
                "invariant": {
                  "const": "C6"
                }
              },
              "required": [
                "invariant"
              ]
            },
            "minContains": 1,
            "maxContains": 1
          },
          {
            "contains": {
              "properties": {
                "invariant": {
                  "const": "C7"
                }
              },
              "required": [
                "invariant"
              ]
            },
            "minContains": 1,
            "maxContains": 1
          }
        ]
      },
      "caps": {
        "type": "object",
        "propertyNames": {
          "pattern": "^[a-z][a-z0-9_]{0,63}(?![\\s\\S])"
        },
        "additionalProperties": {
          "type": "integer",
          "minimum": 0
        },
        "maxProperties": 10
      },
      "evidence": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "source_id": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 64,
                "pattern": "^[A-Za-z0-9_.:-]+(?![\\s\\S])"
              },
              {
                "type": "null"
              }
            ]
          },
          "quote": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 400
              },
              {
                "type": "null"
              }
            ]
          },
          "gate_ref": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 64
              },
              {
                "type": "null"
              }
            ]
          },
          "read_level": {
            "anyOf": [
              {
                "$ref": "primitives.schema.json#/$defs/read_level"
              },
              {
                "type": "null"
              }
            ]
          }
        },
        "required": [
          "source_id",
          "quote",
          "gate_ref"
        ]
      },
      "handling_port_rule": {
        "if": {
          "properties": {
            "datafile": {
              "const": true
            }
          },
          "required": [
            "datafile"
          ]
        },
        "then": {
          "properties": {
            "handling": {
              "$ref": "primitives.schema.json#/$defs/handling"
            }
          }
        }
      },
      "status_list": {
        "type": "array",
        "items": {
          "$ref": "primitives.schema.json#/$defs/invariant_status"
        },
        "maxItems": 7,
        "allOf": [
          {
            "not": {
              "contains": {
                "properties": {
                  "invariant": {
                    "const": "C1"
                  }
                },
                "required": [
                  "invariant"
                ]
              },
              "minContains": 2
            }
          },
          {
            "not": {
              "contains": {
                "properties": {
                  "invariant": {
                    "const": "C2"
                  }
                },
                "required": [
                  "invariant"
                ]
              },
              "minContains": 2
            }
          },
          {
            "not": {
              "contains": {
                "properties": {
                  "invariant": {
                    "const": "C3"
                  }
                },
                "required": [
                  "invariant"
                ]
              },
              "minContains": 2
            }
          },
          {
            "not": {
              "contains": {
                "properties": {
                  "invariant": {
                    "const": "C4"
                  }
                },
                "required": [
                  "invariant"
                ]
              },
              "minContains": 2
            }
          },
          {
            "not": {
              "contains": {
                "properties": {
                  "invariant": {
                    "const": "C5"
                  }
                },
                "required": [
                  "invariant"
                ]
              },
              "minContains": 2
            }
          },
          {
            "not": {
              "contains": {
                "properties": {
                  "invariant": {
                    "const": "C6"
                  }
                },
                "required": [
                  "invariant"
                ]
              },
              "minContains": 2
            }
          },
          {
            "not": {
              "contains": {
                "properties": {
                  "invariant": {
                    "const": "C7"
                  }
                },
                "required": [
                  "invariant"
                ]
              },
              "minContains": 2
            }
          }
        ]
      },
      "produced_output": {
        "allOf": [
          {
            "$ref": "typed_output.schema.json"
          },
          {
            "properties": {
              "produced_by": {
                "type": "object"
              }
            }
          }
        ],
        "description": "A typed output a run produced: produced_by is never null."
      },
      "sub_questions": {
        "type": "array",
        "items": {
          "type": "integer",
          "minimum": 1,
          "maximum": 8
        },
        "maxItems": 8,
        "description": "Positions (from 1) in agreed_focus.sub_questions [proposed]."
      },
      "record_item": {
        "anyOf": [
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "invariant": {
                "const": "C1"
              },
              "status": {
                "enum": [
                  "enforced",
                  "checked_after",
                  "instructed",
                  "not_met"
                ]
              },
              "mechanism": {
                "const": "hook_gated_subagent"
              },
              "evidence": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 200
              }
            },
            "required": [
              "invariant",
              "status",
              "mechanism",
              "evidence"
            ]
          },
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "invariant": {
                "const": "C1"
              },
              "status": {
                "enum": [
                  "checked_after",
                  "instructed",
                  "not_met"
                ]
              },
              "mechanism": {
                "const": "observed_subagent"
              },
              "evidence": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 200
              }
            },
            "required": [
              "invariant",
              "status",
              "mechanism",
              "evidence"
            ]
          },
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "invariant": {
                "const": "C1"
              },
              "status": {
                "enum": [
                  "instructed",
                  "not_met"
                ]
              },
              "mechanism": {
                "const": "separate_turn"
              },
              "evidence": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 200
              }
            },
            "required": [
              "invariant",
              "status",
              "mechanism",
              "evidence"
            ]
          },
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "invariant": {
                "const": "C2"
              },
              "status": {
                "enum": [
                  "enforced",
                  "checked_after",
                  "instructed",
                  "not_met"
                ]
              },
              "mechanism": {
                "const": "ticketed_subagent"
              },
              "evidence": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 200
              }
            },
            "required": [
              "invariant",
              "status",
              "mechanism",
              "evidence"
            ]
          },
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "invariant": {
                "const": "C2"
              },
              "status": {
                "enum": [
                  "checked_after",
                  "instructed",
                  "not_met"
                ]
              },
              "mechanism": {
                "const": "ticketed_subagent_unattributed"
              },
              "evidence": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 200
              }
            },
            "required": [
              "invariant",
              "status",
              "mechanism",
              "evidence"
            ]
          },
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "invariant": {
                "const": "C2"
              },
              "status": {
                "enum": [
                  "instructed",
                  "not_met"
                ]
              },
              "mechanism": {
                "const": "model_prompted_subagent"
              },
              "evidence": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 200
              }
            },
            "required": [
              "invariant",
              "status",
              "mechanism",
              "evidence"
            ]
          },
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "invariant": {
                "const": "C2"
              },
              "status": {
                "enum": [
                  "not_met"
                ]
              },
              "mechanism": {
                "const": "shared_conversation"
              },
              "evidence": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 200
              }
            },
            "required": [
              "invariant",
              "status",
              "mechanism",
              "evidence"
            ]
          },
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "invariant": {
                "const": "C3"
              },
              "status": {
                "enum": [
                  "enforced",
                  "checked_after",
                  "instructed",
                  "not_met"
                ]
              },
              "mechanism": {
                "const": "gate_gated_spawn"
              },
              "evidence": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 200
              }
            },
            "required": [
              "invariant",
              "status",
              "mechanism",
              "evidence"
            ]
          },
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "invariant": {
                "const": "C3"
              },
              "status": {
                "enum": [
                  "checked_after",
                  "instructed",
                  "not_met"
                ]
              },
              "mechanism": {
                "const": "code_execution_gate"
              },
              "evidence": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 200
              }
            },
            "required": [
              "invariant",
              "status",
              "mechanism",
              "evidence"
            ]
          },
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "invariant": {
                "const": "C3"
              },
              "status": {
                "enum": [
                  "checked_after",
                  "instructed",
                  "not_met"
                ]
              },
              "mechanism": {
                "const": "gate_order_observed"
              },
              "evidence": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 200
              }
            },
            "required": [
              "invariant",
              "status",
              "mechanism",
              "evidence"
            ]
          },
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "invariant": {
                "const": "C3"
              },
              "status": {
                "enum": [
                  "instructed",
                  "not_met"
                ]
              },
              "mechanism": {
                "const": "instruction_only"
              },
              "evidence": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 200
              }
            },
            "required": [
              "invariant",
              "status",
              "mechanism",
              "evidence"
            ]
          },
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "invariant": {
                "const": "C4"
              },
              "status": {
                "enum": [
                  "checked_after",
                  "instructed",
                  "not_met"
                ]
              },
              "mechanism": {
                "const": "path_guard_and_scan"
              },
              "evidence": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 200
              }
            },
            "required": [
              "invariant",
              "status",
              "mechanism",
              "evidence"
            ]
          },
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "invariant": {
                "const": "C4"
              },
              "status": {
                "enum": [
                  "instructed",
                  "not_met"
                ]
              },
              "mechanism": {
                "const": "instruction_only"
              },
              "evidence": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 200
              }
            },
            "required": [
              "invariant",
              "status",
              "mechanism",
              "evidence"
            ]
          },
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "invariant": {
                "const": "C4"
              },
              "status": {
                "enum": [
                  "na"
                ]
              },
              "mechanism": {
                "const": "not_declared"
              },
              "evidence": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 200
              }
            },
            "required": [
              "invariant",
              "status",
              "mechanism",
              "evidence"
            ]
          },
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "invariant": {
                "const": "C5"
              },
              "status": {
                "enum": [
                  "checked_after",
                  "instructed",
                  "not_met"
                ]
              },
              "mechanism": {
                "const": "write_guard_and_pack_fingerprints"
              },
              "evidence": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 200
              }
            },
            "required": [
              "invariant",
              "status",
              "mechanism",
              "evidence"
            ]
          },
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "invariant": {
                "const": "C5"
              },
              "status": {
                "enum": [
                  "checked_after",
                  "instructed",
                  "not_met"
                ]
              },
              "mechanism": {
                "const": "pack_fingerprints"
              },
              "evidence": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 200
              }
            },
            "required": [
              "invariant",
              "status",
              "mechanism",
              "evidence"
            ]
          },
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "invariant": {
                "const": "C5"
              },
              "status": {
                "enum": [
                  "instructed",
                  "not_met"
                ]
              },
              "mechanism": {
                "const": "instruction_only"
              },
              "evidence": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 200
              }
            },
            "required": [
              "invariant",
              "status",
              "mechanism",
              "evidence"
            ]
          },
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "invariant": {
                "const": "C6"
              },
              "status": {
                "enum": [
                  "enforced",
                  "checked_after",
                  "instructed",
                  "not_met"
                ]
              },
              "mechanism": {
                "const": "observed_answer_blocking"
              },
              "evidence": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 200
              }
            },
            "required": [
              "invariant",
              "status",
              "mechanism",
              "evidence"
            ]
          },
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "invariant": {
                "const": "C6"
              },
              "status": {
                "enum": [
                  "checked_after",
                  "instructed",
                  "not_met"
                ]
              },
              "mechanism": {
                "const": "observed_answer"
              },
              "evidence": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 200
              }
            },
            "required": [
              "invariant",
              "status",
              "mechanism",
              "evidence"
            ]
          },
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "invariant": {
                "const": "C6"
              },
              "status": {
                "enum": [
                  "instructed",
                  "not_met"
                ]
              },
              "mechanism": {
                "const": "decision_events"
              },
              "evidence": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 200
              }
            },
            "required": [
              "invariant",
              "status",
              "mechanism",
              "evidence"
            ]
          },
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "invariant": {
                "const": "C6"
              },
              "status": {
                "enum": [
                  "instructed",
                  "not_met"
                ]
              },
              "mechanism": {
                "const": "instruction_only"
              },
              "evidence": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 200
              }
            },
            "required": [
              "invariant",
              "status",
              "mechanism",
              "evidence"
            ]
          },
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "invariant": {
                "const": "C7"
              },
              "status": {
                "enum": [
                  "enforced",
                  "checked_after",
                  "instructed",
                  "not_met"
                ]
              },
              "mechanism": {
                "const": "code_generated_headline"
              },
              "evidence": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 200
              }
            },
            "required": [
              "invariant",
              "status",
              "mechanism",
              "evidence"
            ]
          },
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "invariant": {
                "const": "C7"
              },
              "status": {
                "enum": [
                  "instructed",
                  "not_met"
                ]
              },
              "mechanism": {
                "const": "model_generated_headline"
              },
              "evidence": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 200
              }
            },
            "required": [
              "invariant",
              "status",
              "mechanism",
              "evidence"
            ]
          }
        ],
        "description": "A mechanism valid in a run record, with a status no stronger than its ceiling (H-2 allows weaker)."
      },
      "sidecar_item": {
        "anyOf": [
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "invariant": {
                "const": "C3"
              },
              "status": {
                "enum": [
                  "checked_after",
                  "not_met"
                ]
              },
              "mechanism": {
                "const": "browser_app_gate"
              },
              "evidence": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 200
              }
            },
            "required": [
              "invariant",
              "status",
              "mechanism",
              "evidence"
            ]
          },
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "invariant": {
                "const": "C4"
              },
              "status": {
                "enum": [
                  "checked_after",
                  "not_met"
                ]
              },
              "mechanism": {
                "const": "import_scan"
              },
              "evidence": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 200
              }
            },
            "required": [
              "invariant",
              "status",
              "mechanism",
              "evidence"
            ]
          },
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "invariant": {
                "const": "C5"
              },
              "status": {
                "enum": [
                  "checked_after",
                  "not_met"
                ]
              },
              "mechanism": {
                "const": "pinned_pack_check"
              },
              "evidence": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 200
              }
            },
            "required": [
              "invariant",
              "status",
              "mechanism",
              "evidence"
            ]
          },
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "invariant": {
                "const": "C7"
              },
              "status": {
                "enum": [
                  "checked_after",
                  "not_met"
                ]
              },
              "mechanism": {
                "const": "import_regenerated"
              },
              "evidence": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 200
              }
            },
            "required": [
              "invariant",
              "status",
              "mechanism",
              "evidence"
            ]
          }
        ],
        "description": "A sidecar mechanism: raises only to checked_after, or lowers to not_met (\xA76.2.2)."
      },
      "event_run_started": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "seq": {
            "type": "integer",
            "minimum": 1
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "type": {
            "const": "run_started"
          },
          "data": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "source": {
                "enum": [
                  "mcp_server",
                  "hook",
                  "code_execution",
                  "model"
                ]
              },
              "template_id": {
                "$ref": "primitives.schema.json#/$defs/template_id"
              },
              "version": {
                "$ref": "primitives.schema.json#/$defs/semver"
              },
              "template_fingerprint": {
                "$ref": "primitives.schema.json#/$defs/fingerprint_jcs1"
              },
              "bundle_fingerprint": {
                "$ref": "primitives.schema.json#/$defs/fingerprint_jcs1"
              },
              "variant": {
                "$ref": "primitives.schema.json#/$defs/variant"
              },
              "host_profile": {
                "$ref": "primitives.schema.json#/$defs/host_profile"
              },
              "entitlement": {
                "$ref": "primitives.schema.json#/$defs/entitlement"
              },
              "client_version": {
                "$ref": "primitives.schema.json#/$defs/semver"
              }
            },
            "required": [
              "source",
              "template_id",
              "version",
              "template_fingerprint",
              "bundle_fingerprint",
              "variant",
              "host_profile",
              "entitlement",
              "client_version"
            ]
          }
        },
        "required": [
          "seq",
          "at",
          "type",
          "data"
        ]
      },
      "event_hooks_armed": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "seq": {
            "type": "integer",
            "minimum": 1
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "type": {
            "const": "hooks_armed"
          },
          "data": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "source": {
                "enum": [
                  "mcp_server",
                  "hook",
                  "code_execution",
                  "model"
                ]
              },
              "hooks": {
                "type": "array",
                "items": {
                  "anyOf": [
                    {
                      "type": "object",
                      "additionalProperties": false,
                      "properties": {
                        "hook_id": {
                          "const": "BH-1"
                        },
                        "event": {
                          "const": "PreToolUse"
                        },
                        "matcher": {
                          "type": "string",
                          "maxLength": 200
                        },
                        "script_fingerprint": {
                          "$ref": "primitives.schema.json#/$defs/fingerprint"
                        },
                        "heartbeat_seq": {
                          "type": "integer",
                          "minimum": 1
                        }
                      },
                      "required": [
                        "hook_id",
                        "event",
                        "matcher",
                        "script_fingerprint",
                        "heartbeat_seq"
                      ]
                    },
                    {
                      "type": "object",
                      "additionalProperties": false,
                      "properties": {
                        "hook_id": {
                          "const": "BH-2"
                        },
                        "event": {
                          "const": "PreToolUse"
                        },
                        "matcher": {
                          "type": "string",
                          "maxLength": 200
                        },
                        "script_fingerprint": {
                          "$ref": "primitives.schema.json#/$defs/fingerprint"
                        },
                        "heartbeat_seq": {
                          "type": "integer",
                          "minimum": 1
                        }
                      },
                      "required": [
                        "hook_id",
                        "event",
                        "matcher",
                        "script_fingerprint",
                        "heartbeat_seq"
                      ]
                    },
                    {
                      "type": "object",
                      "additionalProperties": false,
                      "properties": {
                        "hook_id": {
                          "const": "BH-3"
                        },
                        "event": {
                          "const": "PostToolUse"
                        },
                        "matcher": {
                          "type": "string",
                          "maxLength": 200
                        },
                        "script_fingerprint": {
                          "$ref": "primitives.schema.json#/$defs/fingerprint"
                        },
                        "heartbeat_seq": {
                          "type": "integer",
                          "minimum": 1
                        }
                      },
                      "required": [
                        "hook_id",
                        "event",
                        "matcher",
                        "script_fingerprint",
                        "heartbeat_seq"
                      ]
                    },
                    {
                      "type": "object",
                      "additionalProperties": false,
                      "properties": {
                        "hook_id": {
                          "const": "BH-3"
                        },
                        "event": {
                          "const": "UserPromptSubmit"
                        },
                        "matcher": {
                          "type": "string",
                          "maxLength": 200
                        },
                        "script_fingerprint": {
                          "$ref": "primitives.schema.json#/$defs/fingerprint"
                        },
                        "heartbeat_seq": {
                          "type": "null"
                        }
                      },
                      "required": [
                        "hook_id",
                        "event",
                        "matcher",
                        "script_fingerprint",
                        "heartbeat_seq"
                      ]
                    },
                    {
                      "type": "object",
                      "additionalProperties": false,
                      "properties": {
                        "hook_id": {
                          "const": "BH-4"
                        },
                        "event": {
                          "const": "SubagentStop"
                        },
                        "matcher": {
                          "type": "string",
                          "maxLength": 200
                        },
                        "script_fingerprint": {
                          "$ref": "primitives.schema.json#/$defs/fingerprint"
                        },
                        "heartbeat_seq": {
                          "type": "null"
                        }
                      },
                      "required": [
                        "hook_id",
                        "event",
                        "matcher",
                        "script_fingerprint",
                        "heartbeat_seq"
                      ]
                    },
                    {
                      "type": "object",
                      "additionalProperties": false,
                      "properties": {
                        "hook_id": {
                          "const": "BH-5"
                        },
                        "event": {
                          "const": "Stop"
                        },
                        "matcher": {
                          "type": "string",
                          "maxLength": 200
                        },
                        "script_fingerprint": {
                          "$ref": "primitives.schema.json#/$defs/fingerprint"
                        },
                        "heartbeat_seq": {
                          "type": "null"
                        }
                      },
                      "required": [
                        "hook_id",
                        "event",
                        "matcher",
                        "script_fingerprint",
                        "heartbeat_seq"
                      ]
                    }
                  ]
                },
                "maxItems": 6,
                "minItems": 3,
                "allOf": [
                  {
                    "not": {
                      "contains": {
                        "allOf": [
                          {
                            "properties": {
                              "hook_id": {
                                "const": "BH-1"
                              }
                            },
                            "required": [
                              "hook_id"
                            ]
                          },
                          {
                            "properties": {
                              "event": {
                                "const": "PreToolUse"
                              }
                            },
                            "required": [
                              "event"
                            ]
                          }
                        ]
                      },
                      "minContains": 2
                    }
                  },
                  {
                    "not": {
                      "contains": {
                        "allOf": [
                          {
                            "properties": {
                              "hook_id": {
                                "const": "BH-2"
                              }
                            },
                            "required": [
                              "hook_id"
                            ]
                          },
                          {
                            "properties": {
                              "event": {
                                "const": "PreToolUse"
                              }
                            },
                            "required": [
                              "event"
                            ]
                          }
                        ]
                      },
                      "minContains": 2
                    }
                  },
                  {
                    "not": {
                      "contains": {
                        "allOf": [
                          {
                            "properties": {
                              "hook_id": {
                                "const": "BH-3"
                              }
                            },
                            "required": [
                              "hook_id"
                            ]
                          },
                          {
                            "properties": {
                              "event": {
                                "const": "PostToolUse"
                              }
                            },
                            "required": [
                              "event"
                            ]
                          }
                        ]
                      },
                      "minContains": 2
                    }
                  },
                  {
                    "not": {
                      "contains": {
                        "allOf": [
                          {
                            "properties": {
                              "hook_id": {
                                "const": "BH-3"
                              }
                            },
                            "required": [
                              "hook_id"
                            ]
                          },
                          {
                            "properties": {
                              "event": {
                                "const": "UserPromptSubmit"
                              }
                            },
                            "required": [
                              "event"
                            ]
                          }
                        ]
                      },
                      "minContains": 2
                    }
                  },
                  {
                    "not": {
                      "contains": {
                        "allOf": [
                          {
                            "properties": {
                              "hook_id": {
                                "const": "BH-4"
                              }
                            },
                            "required": [
                              "hook_id"
                            ]
                          },
                          {
                            "properties": {
                              "event": {
                                "const": "SubagentStop"
                              }
                            },
                            "required": [
                              "event"
                            ]
                          }
                        ]
                      },
                      "minContains": 2
                    }
                  },
                  {
                    "not": {
                      "contains": {
                        "allOf": [
                          {
                            "properties": {
                              "hook_id": {
                                "const": "BH-5"
                              }
                            },
                            "required": [
                              "hook_id"
                            ]
                          },
                          {
                            "properties": {
                              "event": {
                                "const": "Stop"
                              }
                            },
                            "required": [
                              "event"
                            ]
                          }
                        ]
                      },
                      "minContains": 2
                    }
                  },
                  {
                    "contains": {
                      "allOf": [
                        {
                          "properties": {
                            "hook_id": {
                              "const": "BH-1"
                            }
                          },
                          "required": [
                            "hook_id"
                          ]
                        },
                        {
                          "properties": {
                            "event": {
                              "const": "PreToolUse"
                            }
                          },
                          "required": [
                            "event"
                          ]
                        }
                      ]
                    }
                  },
                  {
                    "contains": {
                      "allOf": [
                        {
                          "properties": {
                            "hook_id": {
                              "const": "BH-2"
                            }
                          },
                          "required": [
                            "hook_id"
                          ]
                        },
                        {
                          "properties": {
                            "event": {
                              "const": "PreToolUse"
                            }
                          },
                          "required": [
                            "event"
                          ]
                        }
                      ]
                    }
                  },
                  {
                    "contains": {
                      "allOf": [
                        {
                          "properties": {
                            "hook_id": {
                              "const": "BH-3"
                            }
                          },
                          "required": [
                            "hook_id"
                          ]
                        },
                        {
                          "properties": {
                            "event": {
                              "const": "PostToolUse"
                            }
                          },
                          "required": [
                            "event"
                          ]
                        }
                      ]
                    }
                  }
                ]
              },
              "config_fingerprint": {
                "$ref": "primitives.schema.json#/$defs/fingerprint"
              },
              "guarded_paths": {
                "type": "object",
                "additionalProperties": false,
                "properties": {
                  "protected": {
                    "type": "array",
                    "items": {
                      "$ref": "primitives.schema.json#/$defs/file_ref"
                    },
                    "maxItems": 200
                  },
                  "datafile": {
                    "type": "array",
                    "items": {
                      "$ref": "primitives.schema.json#/$defs/file_ref"
                    },
                    "maxItems": 200
                  }
                },
                "required": [
                  "protected",
                  "datafile"
                ]
              }
            },
            "required": [
              "source",
              "hooks",
              "config_fingerprint",
              "guarded_paths"
            ]
          }
        },
        "required": [
          "seq",
          "at",
          "type",
          "data"
        ]
      },
      "event_step_started": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "seq": {
            "type": "integer",
            "minimum": 1
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "type": {
            "const": "step_started"
          },
          "step_id": {
            "$ref": "primitives.schema.json#/$defs/step_id"
          },
          "data": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "source": {
                "enum": [
                  "mcp_server",
                  "hook",
                  "code_execution",
                  "model"
                ]
              },
              "kind": {
                "$ref": "primitives.schema.json#/$defs/step_kind"
              },
              "round": {
                "type": "integer",
                "minimum": 1
              },
              "attempt": {
                "type": "integer",
                "minimum": 1
              },
              "context_id": {
                "anyOf": [
                  {
                    "$ref": "primitives.schema.json#/$defs/context_id"
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "isolation": {
                "$ref": "primitives.schema.json#/$defs/isolation"
              }
            },
            "required": [
              "source",
              "kind",
              "round",
              "attempt",
              "context_id",
              "isolation"
            ],
            "allOf": [
              {
                "if": {
                  "not": {
                    "properties": {
                      "kind": {
                        "enum": [
                          "preflight",
                          "gate",
                          "run"
                        ]
                      }
                    },
                    "required": [
                      "kind"
                    ]
                  }
                },
                "then": {
                  "properties": {
                    "context_id": {
                      "$ref": "primitives.schema.json#/$defs/context_id"
                    }
                  }
                }
              }
            ]
          }
        },
        "required": [
          "seq",
          "at",
          "type",
          "step_id",
          "data"
        ]
      },
      "event_step_ended": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "seq": {
            "type": "integer",
            "minimum": 1
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "type": {
            "const": "step_ended"
          },
          "step_id": {
            "$ref": "primitives.schema.json#/$defs/step_id"
          },
          "data": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "source": {
                "enum": [
                  "mcp_server",
                  "hook",
                  "code_execution",
                  "model"
                ]
              },
              "status": {
                "$ref": "primitives.schema.json#/$defs/step_status"
              },
              "output_fingerprints": {
                "type": "array",
                "items": {
                  "$ref": "primitives.schema.json#/$defs/fingerprint"
                },
                "maxItems": 200
              }
            },
            "required": [
              "source",
              "status",
              "output_fingerprints"
            ]
          }
        },
        "required": [
          "seq",
          "at",
          "type",
          "step_id",
          "data"
        ]
      },
      "event_subagent_spawned": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "seq": {
            "type": "integer",
            "minimum": 1
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "type": {
            "const": "subagent_spawned"
          },
          "step_id": {
            "$ref": "primitives.schema.json#/$defs/step_id"
          },
          "data": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "source": {
                "enum": [
                  "mcp_server",
                  "hook",
                  "code_execution",
                  "model"
                ]
              },
              "context_id": {
                "$ref": "primitives.schema.json#/$defs/context_id"
              },
              "thread_ref": {
                "$ref": "primitives.schema.json#/$defs/versioned_ref"
              },
              "agent_type": {
                "type": "string",
                "maxLength": 128
              },
              "agent_definition_fingerprint": {
                "$ref": "primitives.schema.json#/$defs/fingerprint"
              },
              "tools": {
                "type": "array",
                "items": {
                  "type": "string",
                  "maxLength": 128
                },
                "maxItems": 50
              },
              "prompt_fingerprint": {
                "$ref": "primitives.schema.json#/$defs/fingerprint"
              },
              "ticket_id": {
                "anyOf": [
                  {
                    "$ref": "primitives.schema.json#/$defs/id_tkt"
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "observed_by": {
                "enum": [
                  "hook",
                  "model"
                ]
              }
            },
            "required": [
              "source",
              "context_id",
              "thread_ref",
              "agent_type",
              "agent_definition_fingerprint",
              "tools",
              "prompt_fingerprint",
              "observed_by"
            ]
          }
        },
        "required": [
          "seq",
          "at",
          "type",
          "step_id",
          "data"
        ]
      },
      "event_ticket_issued": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "seq": {
            "type": "integer",
            "minimum": 1
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "type": {
            "const": "ticket_issued"
          },
          "step_id": {
            "$ref": "primitives.schema.json#/$defs/step_id"
          },
          "data": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "source": {
                "enum": [
                  "mcp_server",
                  "hook",
                  "code_execution",
                  "model"
                ]
              },
              "ticket_id": {
                "$ref": "primitives.schema.json#/$defs/id_tkt"
              },
              "context_id": {
                "$ref": "primitives.schema.json#/$defs/context_id"
              },
              "kind": {
                "enum": [
                  "make",
                  "check",
                  "recheck",
                  "adjudicate",
                  "revise"
                ]
              },
              "thread_ref": {
                "$ref": "primitives.schema.json#/$defs/versioned_ref"
              },
              "agent_type": {
                "type": "string",
                "maxLength": 128
              },
              "timeout_s": {
                "type": "integer",
                "minimum": 1,
                "maximum": 86400
              },
              "expires_at": {
                "$ref": "primitives.schema.json#/$defs/timestamp"
              }
            },
            "required": [
              "source",
              "ticket_id",
              "context_id",
              "kind",
              "thread_ref",
              "agent_type",
              "timeout_s",
              "expires_at"
            ]
          }
        },
        "required": [
          "seq",
          "at",
          "type",
          "step_id",
          "data"
        ]
      },
      "event_subagent_ended": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "seq": {
            "type": "integer",
            "minimum": 1
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "type": {
            "const": "subagent_ended"
          },
          "step_id": {
            "$ref": "primitives.schema.json#/$defs/step_id"
          },
          "data": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "source": {
                "enum": [
                  "mcp_server",
                  "hook",
                  "code_execution",
                  "model"
                ]
              },
              "ticket_id": {
                "anyOf": [
                  {
                    "$ref": "primitives.schema.json#/$defs/id_tkt"
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "context_id": {
                "anyOf": [
                  {
                    "$ref": "primitives.schema.json#/$defs/context_id"
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "matched_by": {
                "enum": [
                  "ticket_token",
                  "agent_id",
                  "none"
                ]
              },
              "transcript_fingerprint": {
                "anyOf": [
                  {
                    "$ref": "primitives.schema.json#/$defs/fingerprint"
                  },
                  {
                    "type": "null"
                  }
                ]
              }
            },
            "required": [
              "source",
              "matched_by"
            ],
            "allOf": [
              {
                "if": {
                  "properties": {
                    "matched_by": {
                      "const": "none"
                    }
                  },
                  "required": [
                    "matched_by"
                  ]
                },
                "then": {
                  "properties": {
                    "ticket_id": {
                      "type": "null"
                    },
                    "context_id": {
                      "type": "null"
                    }
                  }
                }
              },
              {
                "if": {
                  "not": {
                    "properties": {
                      "matched_by": {
                        "const": "none"
                      }
                    },
                    "required": [
                      "matched_by"
                    ]
                  }
                },
                "then": {
                  "required": [
                    "ticket_id",
                    "context_id"
                  ],
                  "properties": {
                    "ticket_id": {
                      "$ref": "primitives.schema.json#/$defs/id_tkt"
                    },
                    "context_id": {
                      "$ref": "primitives.schema.json#/$defs/context_id"
                    }
                  }
                }
              }
            ]
          }
        },
        "required": [
          "seq",
          "at",
          "type",
          "data"
        ],
        "allOf": [
          {
            "if": {
              "properties": {
                "data": {
                  "properties": {
                    "matched_by": {
                      "const": "none"
                    }
                  },
                  "required": [
                    "matched_by"
                  ]
                }
              }
            },
            "then": {
              "not": {
                "required": [
                  "step_id"
                ]
              }
            }
          },
          {
            "if": {
              "properties": {
                "data": {
                  "not": {
                    "properties": {
                      "matched_by": {
                        "const": "none"
                      }
                    },
                    "required": [
                      "matched_by"
                    ]
                  }
                }
              }
            },
            "then": {
              "required": [
                "step_id"
              ]
            }
          }
        ]
      },
      "event_ticket_closed": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "seq": {
            "type": "integer",
            "minimum": 1
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "type": {
            "const": "ticket_closed"
          },
          "step_id": {
            "$ref": "primitives.schema.json#/$defs/step_id"
          },
          "data": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "source": {
                "enum": [
                  "mcp_server",
                  "hook",
                  "code_execution",
                  "model"
                ]
              },
              "ticket_id": {
                "$ref": "primitives.schema.json#/$defs/id_tkt"
              },
              "context_id": {
                "anyOf": [
                  {
                    "$ref": "primitives.schema.json#/$defs/context_id"
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "closed_by": {
                "enum": [
                  "subagent_ended",
                  "expired"
                ]
              },
              "ended_seq": {
                "anyOf": [
                  {
                    "type": "integer",
                    "minimum": 1
                  },
                  {
                    "type": "null"
                  }
                ]
              }
            },
            "required": [
              "source",
              "ticket_id",
              "closed_by"
            ],
            "allOf": [
              {
                "if": {
                  "properties": {
                    "closed_by": {
                      "const": "subagent_ended"
                    }
                  },
                  "required": [
                    "closed_by"
                  ]
                },
                "then": {
                  "required": [
                    "ended_seq"
                  ],
                  "properties": {
                    "ended_seq": {
                      "type": "integer",
                      "minimum": 1
                    }
                  }
                }
              },
              {
                "if": {
                  "properties": {
                    "closed_by": {
                      "const": "expired"
                    }
                  },
                  "required": [
                    "closed_by"
                  ]
                },
                "then": {
                  "properties": {
                    "ended_seq": {
                      "type": "null"
                    }
                  }
                }
              }
            ]
          }
        },
        "required": [
          "seq",
          "at",
          "type",
          "step_id",
          "data"
        ]
      },
      "event_inputs_served": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "seq": {
            "type": "integer",
            "minimum": 1
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "type": {
            "const": "inputs_served"
          },
          "step_id": {
            "$ref": "primitives.schema.json#/$defs/step_id"
          },
          "data": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "source": {
                "enum": [
                  "mcp_server",
                  "hook",
                  "code_execution",
                  "model"
                ]
              },
              "ticket_id": {
                "$ref": "primitives.schema.json#/$defs/id_tkt"
              },
              "context_id": {
                "$ref": "primitives.schema.json#/$defs/context_id"
              },
              "caller": {
                "enum": [
                  "agent_id",
                  "foreground_only",
                  "ticket_secret",
                  "none"
                ]
              },
              "caller_fingerprint": {
                "anyOf": [
                  {
                    "$ref": "primitives.schema.json#/$defs/fingerprint"
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "input_fingerprints": {
                "type": "array",
                "items": {
                  "$ref": "primitives.schema.json#/$defs/fingerprint"
                },
                "maxItems": 200
              }
            },
            "required": [
              "source",
              "ticket_id",
              "context_id",
              "caller",
              "input_fingerprints"
            ]
          }
        },
        "required": [
          "seq",
          "at",
          "type",
          "step_id",
          "data"
        ]
      },
      "event_output_accepted": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "seq": {
            "type": "integer",
            "minimum": 1
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "type": {
            "const": "output_accepted"
          },
          "step_id": {
            "$ref": "primitives.schema.json#/$defs/step_id"
          },
          "data": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "source": {
                "enum": [
                  "mcp_server",
                  "hook",
                  "code_execution",
                  "model"
                ]
              },
              "ticket_id": {
                "$ref": "primitives.schema.json#/$defs/id_tkt"
              },
              "context_id": {
                "$ref": "primitives.schema.json#/$defs/context_id"
              },
              "caller": {
                "enum": [
                  "agent_id",
                  "foreground_only",
                  "ticket_secret",
                  "none"
                ]
              },
              "caller_fingerprint": {
                "anyOf": [
                  {
                    "$ref": "primitives.schema.json#/$defs/fingerprint"
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "port": {
                "$ref": "primitives.schema.json#/$defs/name"
              },
              "fingerprint": {
                "$ref": "primitives.schema.json#/$defs/fingerprint"
              }
            },
            "required": [
              "source",
              "ticket_id",
              "context_id",
              "caller",
              "port",
              "fingerprint"
            ]
          }
        },
        "required": [
          "seq",
          "at",
          "type",
          "step_id",
          "data"
        ]
      },
      "event_hook_check": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "seq": {
            "type": "integer",
            "minimum": 1
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "type": {
            "const": "hook_check"
          },
          "step_id": {
            "$ref": "primitives.schema.json#/$defs/step_id"
          },
          "data": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "source": {
                "enum": [
                  "mcp_server",
                  "hook",
                  "code_execution",
                  "model"
                ]
              },
              "hook_id": {
                "enum": [
                  "BH-1",
                  "BH-2",
                  "BH-3",
                  "BH-4",
                  "BH-5"
                ]
              },
              "check": {
                "enum": [
                  "heartbeat",
                  "agent_type",
                  "foreground",
                  "ticket_prompt",
                  "gates_before_check",
                  "decision_before_step",
                  "protected_path",
                  "datafile_path",
                  "caller_context",
                  "run_open_at_stop"
                ]
              },
              "tool": {
                "anyOf": [
                  {
                    "type": "string",
                    "maxLength": 128
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "result": {
                "enum": [
                  "allow",
                  "deny"
                ]
              },
              "subject_fingerprint": {
                "anyOf": [
                  {
                    "$ref": "primitives.schema.json#/$defs/fingerprint"
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "cites": {
                "type": "array",
                "items": {
                  "type": "integer",
                  "minimum": 1
                },
                "maxItems": 50
              }
            },
            "required": [
              "source",
              "hook_id",
              "check",
              "tool",
              "result",
              "cites"
            ],
            "allOf": [
              {
                "if": {
                  "properties": {
                    "hook_id": {
                      "const": "BH-1"
                    }
                  },
                  "required": [
                    "hook_id"
                  ]
                },
                "then": {
                  "properties": {
                    "check": {
                      "enum": [
                        "heartbeat",
                        "agent_type",
                        "foreground",
                        "ticket_prompt",
                        "gates_before_check",
                        "decision_before_step"
                      ]
                    }
                  }
                }
              },
              {
                "if": {
                  "properties": {
                    "hook_id": {
                      "const": "BH-2"
                    }
                  },
                  "required": [
                    "hook_id"
                  ]
                },
                "then": {
                  "properties": {
                    "check": {
                      "enum": [
                        "heartbeat",
                        "protected_path",
                        "datafile_path",
                        "caller_context"
                      ]
                    }
                  }
                }
              },
              {
                "if": {
                  "properties": {
                    "hook_id": {
                      "const": "BH-3"
                    }
                  },
                  "required": [
                    "hook_id"
                  ]
                },
                "then": {
                  "properties": {
                    "check": {
                      "enum": [
                        "heartbeat"
                      ]
                    }
                  }
                }
              },
              {
                "if": {
                  "properties": {
                    "hook_id": {
                      "const": "BH-4"
                    }
                  },
                  "required": [
                    "hook_id"
                  ]
                },
                "then": {
                  "not": {}
                }
              },
              {
                "if": {
                  "properties": {
                    "hook_id": {
                      "const": "BH-5"
                    }
                  },
                  "required": [
                    "hook_id"
                  ]
                },
                "then": {
                  "properties": {
                    "check": {
                      "enum": [
                        "run_open_at_stop"
                      ]
                    }
                  }
                }
              },
              {
                "if": {
                  "properties": {
                    "check": {
                      "const": "heartbeat"
                    }
                  },
                  "required": [
                    "check"
                  ]
                },
                "then": {
                  "properties": {
                    "result": {
                      "const": "allow"
                    }
                  }
                }
              },
              {
                "if": {
                  "properties": {
                    "check": {
                      "const": "run_open_at_stop"
                    }
                  },
                  "required": [
                    "check"
                  ]
                },
                "then": {
                  "properties": {
                    "tool": {
                      "type": "null"
                    }
                  }
                }
              },
              {
                "if": {
                  "not": {
                    "properties": {
                      "check": {
                        "const": "run_open_at_stop"
                      }
                    },
                    "required": [
                      "check"
                    ]
                  }
                },
                "then": {
                  "properties": {
                    "tool": {
                      "type": "string",
                      "maxLength": 128
                    }
                  }
                }
              }
            ]
          }
        },
        "required": [
          "seq",
          "at",
          "type",
          "data"
        ]
      },
      "event_gate_exit": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "seq": {
            "type": "integer",
            "minimum": 1
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "type": {
            "const": "gate_exit"
          },
          "step_id": {
            "$ref": "primitives.schema.json#/$defs/step_id"
          },
          "data": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "source": {
                "enum": [
                  "mcp_server",
                  "hook",
                  "code_execution",
                  "model"
                ]
              },
              "gate_ref": {
                "$ref": "primitives.schema.json#/$defs/versioned_ref"
              },
              "runtime": {
                "enum": [
                  "python",
                  "js"
                ]
              },
              "runner": {
                "enum": [
                  "plugin_local",
                  "code_execution"
                ]
              },
              "script_fingerprint": {
                "$ref": "primitives.schema.json#/$defs/fingerprint_raw"
              },
              "input_fingerprints": {
                "type": "array",
                "items": {
                  "$ref": "primitives.schema.json#/$defs/fingerprint"
                },
                "maxItems": 200
              },
              "exit_code": {
                "type": "integer"
              },
              "status": {
                "enum": [
                  "pass",
                  "fail",
                  "warn",
                  "skipped",
                  "error"
                ]
              },
              "result_fingerprint": {
                "anyOf": [
                  {
                    "$ref": "primitives.schema.json#/$defs/fingerprint"
                  },
                  {
                    "type": "null"
                  }
                ]
              }
            },
            "required": [
              "source",
              "gate_ref",
              "runtime",
              "runner",
              "script_fingerprint",
              "input_fingerprints",
              "exit_code",
              "status",
              "result_fingerprint"
            ],
            "allOf": [
              {
                "if": {
                  "properties": {
                    "status": {
                      "const": "pass"
                    }
                  },
                  "required": [
                    "status"
                  ]
                },
                "then": {
                  "properties": {
                    "exit_code": {
                      "const": 0
                    }
                  }
                }
              },
              {
                "if": {
                  "properties": {
                    "status": {
                      "const": "fail"
                    }
                  },
                  "required": [
                    "status"
                  ]
                },
                "then": {
                  "properties": {
                    "exit_code": {
                      "const": 1
                    }
                  }
                }
              },
              {
                "if": {
                  "properties": {
                    "status": {
                      "const": "warn"
                    }
                  },
                  "required": [
                    "status"
                  ]
                },
                "then": {
                  "properties": {
                    "exit_code": {
                      "const": 2
                    }
                  }
                }
              },
              {
                "if": {
                  "properties": {
                    "status": {
                      "const": "skipped"
                    }
                  },
                  "required": [
                    "status"
                  ]
                },
                "then": {
                  "properties": {
                    "exit_code": {
                      "const": 3
                    }
                  }
                }
              }
            ]
          }
        },
        "required": [
          "seq",
          "at",
          "type",
          "step_id",
          "data"
        ]
      },
      "event_file_read": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "seq": {
            "type": "integer",
            "minimum": 1
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "type": {
            "const": "file_read"
          },
          "step_id": {
            "$ref": "primitives.schema.json#/$defs/step_id"
          },
          "data": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "source": {
                "enum": [
                  "mcp_server",
                  "hook",
                  "code_execution",
                  "model"
                ]
              },
              "path_class": {
                "enum": [
                  "input",
                  "output",
                  "protected",
                  "datafile"
                ]
              },
              "path": {
                "$ref": "primitives.schema.json#/$defs/file_ref"
              },
              "fingerprint": {
                "$ref": "primitives.schema.json#/$defs/fingerprint"
              }
            },
            "required": [
              "source",
              "path_class",
              "path",
              "fingerprint"
            ]
          }
        },
        "required": [
          "seq",
          "at",
          "type",
          "step_id",
          "data"
        ]
      },
      "event_user_answer_observed": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "seq": {
            "type": "integer",
            "minimum": 1
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "type": {
            "const": "user_answer_observed"
          },
          "step_id": {
            "$ref": "primitives.schema.json#/$defs/step_id"
          },
          "data": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "source": {
                "enum": [
                  "mcp_server",
                  "hook",
                  "code_execution",
                  "model"
                ]
              },
              "via": {
                "enum": [
                  "ask_user_question",
                  "user_prompt"
                ]
              },
              "question_ref": {
                "anyOf": [
                  {
                    "$ref": "primitives.schema.json#/$defs/file_ref"
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "answer_fingerprint": {
                "$ref": "primitives.schema.json#/$defs/fingerprint"
              }
            },
            "required": [
              "source",
              "via",
              "answer_fingerprint"
            ]
          }
        },
        "required": [
          "seq",
          "at",
          "type",
          "data"
        ]
      },
      "event_transcript_scan": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "seq": {
            "type": "integer",
            "minimum": 1
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "type": {
            "const": "transcript_scan"
          },
          "step_id": {
            "$ref": "primitives.schema.json#/$defs/step_id"
          },
          "data": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "source": {
                "enum": [
                  "mcp_server",
                  "hook",
                  "code_execution",
                  "model"
                ]
              },
              "rule": {
                "$ref": "primitives.schema.json#/$defs/handling_rule"
              },
              "method": {
                "enum": [
                  "canary",
                  "row_pattern"
                ]
              },
              "scope": {
                "type": "array",
                "items": {
                  "$ref": "primitives.schema.json#/$defs/context_id"
                },
                "maxItems": 100,
                "minItems": 1
              },
              "scanned_fingerprints": {
                "type": "array",
                "items": {
                  "$ref": "primitives.schema.json#/$defs/fingerprint"
                },
                "maxItems": 200
              },
              "result": {
                "enum": [
                  "clean",
                  "hit"
                ]
              }
            },
            "required": [
              "source",
              "rule",
              "method",
              "scope",
              "scanned_fingerprints",
              "result"
            ]
          }
        },
        "required": [
          "seq",
          "at",
          "type",
          "data"
        ]
      },
      "event_input_rule_sign": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "seq": {
            "type": "integer",
            "minimum": 1
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "type": {
            "const": "input_rule_sign"
          },
          "step_id": {
            "$ref": "primitives.schema.json#/$defs/step_id"
          },
          "data": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "source": {
                "enum": [
                  "mcp_server",
                  "hook",
                  "code_execution",
                  "model"
                ]
              },
              "rule": {
                "$ref": "primitives.schema.json#/$defs/handling_rule"
              },
              "sign": {
                "enum": [
                  "canary_hit",
                  "datafile_path_read",
                  "row_pattern"
                ]
              },
              "detected_by": {
                "enum": [
                  "hook",
                  "transcript_scan",
                  "import_scan"
                ]
              },
              "file_fingerprint": {
                "anyOf": [
                  {
                    "$ref": "primitives.schema.json#/$defs/fingerprint"
                  },
                  {
                    "type": "null"
                  }
                ]
              }
            },
            "required": [
              "source",
              "rule",
              "sign",
              "detected_by"
            ]
          }
        },
        "required": [
          "seq",
          "at",
          "type",
          "data"
        ]
      },
      "event_pack_fingerprints": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "seq": {
            "type": "integer",
            "minimum": 1
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "type": {
            "const": "pack_fingerprints"
          },
          "step_id": {
            "$ref": "primitives.schema.json#/$defs/step_id"
          },
          "data": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "source": {
                "enum": [
                  "mcp_server",
                  "hook",
                  "code_execution",
                  "model"
                ]
              },
              "phase": {
                "enum": [
                  "before",
                  "after"
                ]
              },
              "packs": {
                "type": "array",
                "items": {
                  "type": "object",
                  "additionalProperties": false,
                  "properties": {
                    "path": {
                      "$ref": "primitives.schema.json#/$defs/file_ref"
                    },
                    "fingerprint": {
                      "$ref": "primitives.schema.json#/$defs/fingerprint"
                    }
                  },
                  "required": [
                    "path",
                    "fingerprint"
                  ]
                },
                "maxItems": 200
              },
              "matches_pinned": {
                "type": "boolean"
              }
            },
            "required": [
              "source",
              "phase",
              "packs",
              "matches_pinned"
            ]
          }
        },
        "required": [
          "seq",
          "at",
          "type",
          "data"
        ]
      },
      "event_decision_recorded": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "seq": {
            "type": "integer",
            "minimum": 1
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "type": {
            "const": "decision_recorded"
          },
          "step_id": {
            "$ref": "primitives.schema.json#/$defs/step_id"
          },
          "data": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "source": {
                "enum": [
                  "mcp_server",
                  "hook",
                  "code_execution",
                  "model"
                ]
              },
              "decision_id": {
                "$ref": "primitives.schema.json#/$defs/id_dec"
              },
              "kind": {
                "$ref": "primitives.schema.json#/$defs/decision_kind"
              },
              "by_role": {
                "enum": [
                  "user",
                  "leader",
                  "admin"
                ]
              },
              "by_member_id": {
                "anyOf": [
                  {
                    "$ref": "primitives.schema.json#/$defs/id_mbr"
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "blocking_step_id": {
                "anyOf": [
                  {
                    "$ref": "primitives.schema.json#/$defs/step_id"
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "answer_seq": {
                "anyOf": [
                  {
                    "type": "integer",
                    "minimum": 1
                  },
                  {
                    "type": "null"
                  }
                ]
              }
            },
            "required": [
              "source",
              "decision_id",
              "kind",
              "by_role"
            ]
          }
        },
        "required": [
          "seq",
          "at",
          "type",
          "data"
        ]
      },
      "event_refine": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "seq": {
            "type": "integer",
            "minimum": 1
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "type": {
            "const": "refine"
          },
          "step_id": {
            "$ref": "primitives.schema.json#/$defs/step_id"
          },
          "data": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "source": {
                "enum": [
                  "mcp_server",
                  "hook",
                  "code_execution",
                  "model"
                ]
              },
              "old_fp": {
                "$ref": "primitives.schema.json#/$defs/fingerprint"
              },
              "new_fp": {
                "$ref": "primitives.schema.json#/$defs/fingerprint"
              },
              "reason_ref": {
                "$ref": "primitives.schema.json#/$defs/file_ref"
              },
              "stale_steps": {
                "type": "array",
                "items": {
                  "$ref": "primitives.schema.json#/$defs/step_id"
                },
                "maxItems": 100
              }
            },
            "required": [
              "source",
              "old_fp",
              "new_fp",
              "reason_ref",
              "stale_steps"
            ]
          }
        },
        "required": [
          "seq",
          "at",
          "type",
          "data"
        ]
      },
      "event_branch_state": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "seq": {
            "type": "integer",
            "minimum": 1
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "type": {
            "const": "branch_state"
          },
          "step_id": {
            "$ref": "primitives.schema.json#/$defs/step_id"
          },
          "data": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "source": {
                "enum": [
                  "mcp_server",
                  "hook",
                  "code_execution",
                  "model"
                ]
              },
              "branch_id": {
                "$ref": "primitives.schema.json#/$defs/id_br"
              },
              "from": {
                "anyOf": [
                  {
                    "enum": [
                      "active",
                      "awaiting_decision",
                      "merged",
                      "parked",
                      "closed"
                    ]
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "to": {
                "enum": [
                  "active",
                  "awaiting_decision",
                  "merged",
                  "parked",
                  "closed"
                ]
              },
              "decision_id": {
                "anyOf": [
                  {
                    "$ref": "primitives.schema.json#/$defs/id_dec"
                  },
                  {
                    "type": "null"
                  }
                ]
              }
            },
            "required": [
              "source",
              "branch_id",
              "from",
              "to"
            ]
          }
        },
        "required": [
          "seq",
          "at",
          "type",
          "data"
        ]
      },
      "event_headline_generated": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "seq": {
            "type": "integer",
            "minimum": 1
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "type": {
            "const": "headline_generated"
          },
          "step_id": {
            "$ref": "primitives.schema.json#/$defs/step_id"
          },
          "data": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "source": {
                "enum": [
                  "mcp_server",
                  "hook",
                  "code_execution",
                  "model"
                ]
              },
              "generator": {
                "enum": [
                  "fairlead_code",
                  "model"
                ]
              },
              "generator_version": {
                "type": "string",
                "maxLength": 64
              },
              "items_fingerprint": {
                "$ref": "primitives.schema.json#/$defs/fingerprint_jcs1"
              }
            },
            "required": [
              "source",
              "generator",
              "generator_version",
              "items_fingerprint"
            ]
          }
        },
        "required": [
          "seq",
          "at",
          "type",
          "data"
        ]
      },
      "event_delivered": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "seq": {
            "type": "integer",
            "minimum": 1
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "type": {
            "const": "delivered"
          },
          "step_id": {
            "$ref": "primitives.schema.json#/$defs/step_id"
          },
          "data": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "source": {
                "enum": [
                  "mcp_server",
                  "hook",
                  "code_execution",
                  "model"
                ]
              },
              "choice_ids": {
                "type": "array",
                "items": {
                  "$ref": "primitives.schema.json#/$defs/name"
                },
                "maxItems": 20
              },
              "report_built": {
                "type": "boolean"
              }
            },
            "required": [
              "source",
              "choice_ids",
              "report_built"
            ]
          }
        },
        "required": [
          "seq",
          "at",
          "type",
          "step_id",
          "data"
        ]
      },
      "sidecar_event_gate_exit": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "seq": {
            "type": "integer",
            "minimum": 1
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "type": {
            "const": "gate_exit"
          },
          "step_id": {
            "$ref": "primitives.schema.json#/$defs/step_id"
          },
          "data": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "source": {
                "enum": [
                  "browser_app",
                  "mcp_server"
                ]
              },
              "gate_ref": {
                "$ref": "primitives.schema.json#/$defs/versioned_ref"
              },
              "runtime": {
                "enum": [
                  "python",
                  "js"
                ]
              },
              "runner": {
                "enum": [
                  "browser_app",
                  "plugin_local"
                ]
              },
              "script_fingerprint": {
                "$ref": "primitives.schema.json#/$defs/fingerprint_raw"
              },
              "input_fingerprints": {
                "type": "array",
                "items": {
                  "$ref": "primitives.schema.json#/$defs/fingerprint"
                },
                "maxItems": 200
              },
              "exit_code": {
                "type": "integer"
              },
              "status": {
                "enum": [
                  "pass",
                  "fail",
                  "warn",
                  "skipped",
                  "error"
                ]
              },
              "result_fingerprint": {
                "anyOf": [
                  {
                    "$ref": "primitives.schema.json#/$defs/fingerprint"
                  },
                  {
                    "type": "null"
                  }
                ]
              }
            },
            "required": [
              "source",
              "gate_ref",
              "runtime",
              "runner",
              "script_fingerprint",
              "input_fingerprints",
              "exit_code",
              "status",
              "result_fingerprint"
            ],
            "allOf": [
              {
                "if": {
                  "properties": {
                    "status": {
                      "const": "pass"
                    }
                  },
                  "required": [
                    "status"
                  ]
                },
                "then": {
                  "properties": {
                    "exit_code": {
                      "const": 0
                    }
                  }
                }
              },
              {
                "if": {
                  "properties": {
                    "status": {
                      "const": "fail"
                    }
                  },
                  "required": [
                    "status"
                  ]
                },
                "then": {
                  "properties": {
                    "exit_code": {
                      "const": 1
                    }
                  }
                }
              },
              {
                "if": {
                  "properties": {
                    "status": {
                      "const": "warn"
                    }
                  },
                  "required": [
                    "status"
                  ]
                },
                "then": {
                  "properties": {
                    "exit_code": {
                      "const": 2
                    }
                  }
                }
              },
              {
                "if": {
                  "properties": {
                    "status": {
                      "const": "skipped"
                    }
                  },
                  "required": [
                    "status"
                  ]
                },
                "then": {
                  "properties": {
                    "exit_code": {
                      "const": 3
                    }
                  }
                }
              }
            ]
          }
        },
        "required": [
          "seq",
          "at",
          "type",
          "step_id",
          "data"
        ]
      },
      "sidecar_event_transcript_scan": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "seq": {
            "type": "integer",
            "minimum": 1
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "type": {
            "const": "transcript_scan"
          },
          "step_id": {
            "$ref": "primitives.schema.json#/$defs/step_id"
          },
          "data": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "source": {
                "enum": [
                  "browser_app",
                  "mcp_server"
                ]
              },
              "rule": {
                "$ref": "primitives.schema.json#/$defs/handling_rule"
              },
              "method": {
                "enum": [
                  "canary",
                  "row_pattern"
                ]
              },
              "scope": {
                "type": "array",
                "items": {
                  "$ref": "primitives.schema.json#/$defs/context_id"
                },
                "maxItems": 100,
                "minItems": 1
              },
              "scanned_fingerprints": {
                "type": "array",
                "items": {
                  "$ref": "primitives.schema.json#/$defs/fingerprint"
                },
                "maxItems": 200
              },
              "result": {
                "enum": [
                  "clean",
                  "hit"
                ]
              }
            },
            "required": [
              "source",
              "rule",
              "method",
              "scope",
              "scanned_fingerprints",
              "result"
            ]
          }
        },
        "required": [
          "seq",
          "at",
          "type",
          "data"
        ]
      },
      "sidecar_event_input_rule_sign": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "seq": {
            "type": "integer",
            "minimum": 1
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "type": {
            "const": "input_rule_sign"
          },
          "step_id": {
            "$ref": "primitives.schema.json#/$defs/step_id"
          },
          "data": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "source": {
                "enum": [
                  "browser_app",
                  "mcp_server"
                ]
              },
              "rule": {
                "$ref": "primitives.schema.json#/$defs/handling_rule"
              },
              "sign": {
                "enum": [
                  "canary_hit",
                  "datafile_path_read",
                  "row_pattern"
                ]
              },
              "detected_by": {
                "enum": [
                  "hook",
                  "transcript_scan",
                  "import_scan"
                ]
              },
              "file_fingerprint": {
                "anyOf": [
                  {
                    "$ref": "primitives.schema.json#/$defs/fingerprint"
                  },
                  {
                    "type": "null"
                  }
                ]
              }
            },
            "required": [
              "source",
              "rule",
              "sign",
              "detected_by"
            ]
          }
        },
        "required": [
          "seq",
          "at",
          "type",
          "data"
        ]
      },
      "sidecar_event_pack_fingerprints": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "seq": {
            "type": "integer",
            "minimum": 1
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "type": {
            "const": "pack_fingerprints"
          },
          "step_id": {
            "$ref": "primitives.schema.json#/$defs/step_id"
          },
          "data": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "source": {
                "enum": [
                  "browser_app",
                  "mcp_server"
                ]
              },
              "phase": {
                "enum": [
                  "before",
                  "after"
                ]
              },
              "packs": {
                "type": "array",
                "items": {
                  "type": "object",
                  "additionalProperties": false,
                  "properties": {
                    "path": {
                      "$ref": "primitives.schema.json#/$defs/file_ref"
                    },
                    "fingerprint": {
                      "$ref": "primitives.schema.json#/$defs/fingerprint"
                    }
                  },
                  "required": [
                    "path",
                    "fingerprint"
                  ]
                },
                "maxItems": 200
              },
              "matches_pinned": {
                "type": "boolean"
              }
            },
            "required": [
              "source",
              "phase",
              "packs",
              "matches_pinned"
            ]
          }
        },
        "required": [
          "seq",
          "at",
          "type",
          "data"
        ]
      },
      "sidecar_event_headline_generated": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "seq": {
            "type": "integer",
            "minimum": 1
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "type": {
            "const": "headline_generated"
          },
          "step_id": {
            "$ref": "primitives.schema.json#/$defs/step_id"
          },
          "data": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "source": {
                "enum": [
                  "browser_app",
                  "mcp_server"
                ]
              },
              "generator": {
                "enum": [
                  "fairlead_code",
                  "model"
                ]
              },
              "generator_version": {
                "type": "string",
                "maxLength": 64
              },
              "items_fingerprint": {
                "$ref": "primitives.schema.json#/$defs/fingerprint_jcs1"
              }
            },
            "required": [
              "source",
              "generator",
              "generator_version",
              "items_fingerprint"
            ]
          }
        },
        "required": [
          "seq",
          "at",
          "type",
          "data"
        ]
      },
      "record_event": {
        "anyOf": [
          {
            "$ref": "primitives.schema.json#/$defs/event_run_started"
          },
          {
            "$ref": "primitives.schema.json#/$defs/event_hooks_armed"
          },
          {
            "$ref": "primitives.schema.json#/$defs/event_step_started"
          },
          {
            "$ref": "primitives.schema.json#/$defs/event_step_ended"
          },
          {
            "$ref": "primitives.schema.json#/$defs/event_subagent_spawned"
          },
          {
            "$ref": "primitives.schema.json#/$defs/event_ticket_issued"
          },
          {
            "$ref": "primitives.schema.json#/$defs/event_subagent_ended"
          },
          {
            "$ref": "primitives.schema.json#/$defs/event_ticket_closed"
          },
          {
            "$ref": "primitives.schema.json#/$defs/event_inputs_served"
          },
          {
            "$ref": "primitives.schema.json#/$defs/event_output_accepted"
          },
          {
            "$ref": "primitives.schema.json#/$defs/event_hook_check"
          },
          {
            "$ref": "primitives.schema.json#/$defs/event_gate_exit"
          },
          {
            "$ref": "primitives.schema.json#/$defs/event_file_read"
          },
          {
            "$ref": "primitives.schema.json#/$defs/event_user_answer_observed"
          },
          {
            "$ref": "primitives.schema.json#/$defs/event_transcript_scan"
          },
          {
            "$ref": "primitives.schema.json#/$defs/event_input_rule_sign"
          },
          {
            "$ref": "primitives.schema.json#/$defs/event_pack_fingerprints"
          },
          {
            "$ref": "primitives.schema.json#/$defs/event_decision_recorded"
          },
          {
            "$ref": "primitives.schema.json#/$defs/event_refine"
          },
          {
            "$ref": "primitives.schema.json#/$defs/event_branch_state"
          },
          {
            "$ref": "primitives.schema.json#/$defs/event_headline_generated"
          },
          {
            "$ref": "primitives.schema.json#/$defs/event_delivered"
          }
        ],
        "description": "Run-record events (\xA76.2.1). browser_app never appears in a run record."
      },
      "sidecar_event": {
        "anyOf": [
          {
            "$ref": "primitives.schema.json#/$defs/sidecar_event_gate_exit"
          },
          {
            "$ref": "primitives.schema.json#/$defs/sidecar_event_transcript_scan"
          },
          {
            "$ref": "primitives.schema.json#/$defs/sidecar_event_input_rule_sign"
          },
          {
            "$ref": "primitives.schema.json#/$defs/sidecar_event_pack_fingerprints"
          },
          {
            "$ref": "primitives.schema.json#/$defs/sidecar_event_headline_generated"
          }
        ],
        "description": "post_run_checks events (\xA76.2.2): five types only."
      },
      "decision": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "decision_id": {
            "$ref": "primitives.schema.json#/$defs/id_dec"
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "by_role": {
            "enum": [
              "user",
              "leader",
              "admin"
            ]
          },
          "by_member_id": {
            "anyOf": [
              {
                "$ref": "primitives.schema.json#/$defs/id_mbr"
              },
              {
                "type": "null"
              }
            ]
          },
          "kind": {
            "$ref": "primitives.schema.json#/$defs/decision_kind"
          },
          "text_ref": {
            "anyOf": [
              {
                "$ref": "primitives.schema.json#/$defs/file_ref"
              },
              {
                "type": "null"
              }
            ]
          },
          "branch_id": {
            "anyOf": [
              {
                "$ref": "primitives.schema.json#/$defs/id_br"
              },
              {
                "type": "null"
              }
            ]
          },
          "outcome": {
            "anyOf": [
              {
                "enum": [
                  "merged",
                  "parked",
                  "closed"
                ]
              },
              {
                "type": "null"
              }
            ]
          }
        },
        "required": [
          "decision_id",
          "at",
          "by_role",
          "kind"
        ],
        "allOf": [
          {
            "if": {
              "properties": {
                "kind": {
                  "const": "branch_outcome"
                }
              },
              "required": [
                "kind"
              ]
            },
            "then": {
              "required": [
                "branch_id",
                "outcome"
              ],
              "properties": {
                "branch_id": {
                  "$ref": "primitives.schema.json#/$defs/id_br"
                },
                "outcome": {
                  "enum": [
                    "merged",
                    "parked",
                    "closed"
                  ]
                }
              }
            }
          }
        ],
        "description": "A person's decision in a run record. branch_id and outcome are required on branch_outcome [proposed]."
      },
      "project_decision": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "decision_id": {
            "$ref": "primitives.schema.json#/$defs/id_dec"
          },
          "at": {
            "$ref": "primitives.schema.json#/$defs/timestamp"
          },
          "by_role": {
            "enum": [
              "user",
              "leader",
              "admin",
              "org_admin"
            ]
          },
          "by_member_id": {
            "anyOf": [
              {
                "$ref": "primitives.schema.json#/$defs/id_mbr"
              },
              {
                "type": "null"
              }
            ]
          },
          "kind": {
            "enum": [
              "focus_accept",
              "focus_change",
              "escalation",
              "branch_outcome",
              "output_choice",
              "waiver",
              "input_rule_loosen",
              "abandon",
              "admin_change",
              "lead_handover"
            ]
          },
          "text_ref": {
            "anyOf": [
              {
                "$ref": "primitives.schema.json#/$defs/file_ref"
              },
              {
                "type": "null"
              }
            ]
          },
          "branch_id": {
            "anyOf": [
              {
                "$ref": "primitives.schema.json#/$defs/id_br"
              },
              {
                "type": "null"
              }
            ]
          },
          "outcome": {
            "anyOf": [
              {
                "enum": [
                  "merged",
                  "parked",
                  "closed"
                ]
              },
              {
                "type": "null"
              }
            ]
          },
          "member_id": {
            "anyOf": [
              {
                "$ref": "primitives.schema.json#/$defs/id_mbr"
              },
              {
                "type": "null"
              }
            ]
          },
          "change": {
            "anyOf": [
              {
                "enum": [
                  "add",
                  "remove"
                ]
              },
              {
                "type": "null"
              }
            ]
          },
          "from_member_id": {
            "anyOf": [
              {
                "$ref": "primitives.schema.json#/$defs/id_mbr"
              },
              {
                "type": "null"
              }
            ]
          },
          "to_member_id": {
            "anyOf": [
              {
                "$ref": "primitives.schema.json#/$defs/id_mbr"
              },
              {
                "type": "null"
              }
            ]
          }
        },
        "required": [
          "decision_id",
          "at",
          "by_role",
          "kind"
        ],
        "allOf": [
          {
            "if": {
              "properties": {
                "kind": {
                  "const": "branch_outcome"
                }
              },
              "required": [
                "kind"
              ]
            },
            "then": {
              "required": [
                "branch_id",
                "outcome"
              ],
              "properties": {
                "branch_id": {
                  "$ref": "primitives.schema.json#/$defs/id_br"
                },
                "outcome": {
                  "enum": [
                    "merged",
                    "parked",
                    "closed"
                  ]
                }
              }
            }
          },
          {
            "if": {
              "properties": {
                "by_role": {
                  "const": "org_admin"
                }
              },
              "required": [
                "by_role"
              ]
            },
            "then": {
              "properties": {
                "kind": {
                  "const": "lead_handover"
                }
              },
              "required": [
                "kind"
              ]
            }
          },
          {
            "if": {
              "allOf": [
                {
                  "properties": {
                    "kind": {
                      "const": "branch_outcome"
                    }
                  },
                  "required": [
                    "kind"
                  ]
                },
                {
                  "properties": {
                    "outcome": {
                      "const": "merged"
                    }
                  },
                  "required": [
                    "outcome"
                  ]
                }
              ]
            },
            "then": {
              "properties": {
                "by_role": {
                  "const": "leader"
                }
              },
              "required": [
                "by_role"
              ]
            }
          },
          {
            "if": {
              "allOf": [
                {
                  "properties": {
                    "kind": {
                      "const": "branch_outcome"
                    }
                  },
                  "required": [
                    "kind"
                  ]
                },
                {
                  "properties": {
                    "outcome": {
                      "enum": [
                        "parked",
                        "closed"
                      ]
                    }
                  },
                  "required": [
                    "outcome"
                  ]
                }
              ]
            },
            "then": {
              "properties": {
                "by_role": {
                  "enum": [
                    "leader",
                    "admin"
                  ]
                }
              },
              "required": [
                "by_role"
              ]
            }
          },
          {
            "if": {
              "properties": {
                "kind": {
                  "const": "admin_change"
                }
              },
              "required": [
                "kind"
              ]
            },
            "then": {
              "properties": {
                "by_role": {
                  "const": "leader"
                }
              },
              "required": [
                "by_role"
              ]
            }
          },
          {
            "if": {
              "properties": {
                "kind": {
                  "const": "lead_handover"
                }
              },
              "required": [
                "kind"
              ]
            },
            "then": {
              "allOf": [
                {
                  "properties": {
                    "by_role": {
                      "enum": [
                        "leader",
                        "org_admin"
                      ]
                    }
                  },
                  "required": [
                    "by_role"
                  ]
                },
                {
                  "properties": {
                    "change": {
                      "anyOf": [
                        {
                          "const": "add"
                        },
                        {
                          "type": "null"
                        }
                      ]
                    }
                  }
                }
              ]
            }
          },
          {
            "if": {
              "properties": {
                "kind": {
                  "const": "lead_handover"
                }
              },
              "required": [
                "kind"
              ]
            },
            "then": {
              "required": [
                "from_member_id",
                "to_member_id"
              ],
              "properties": {
                "from_member_id": {
                  "$ref": "primitives.schema.json#/$defs/id_mbr"
                },
                "to_member_id": {
                  "$ref": "primitives.schema.json#/$defs/id_mbr"
                }
              }
            }
          },
          {
            "if": {
              "properties": {
                "kind": {
                  "const": "admin_change"
                }
              },
              "required": [
                "kind"
              ]
            },
            "then": {
              "required": [
                "member_id",
                "change"
              ],
              "properties": {
                "member_id": {
                  "$ref": "primitives.schema.json#/$defs/id_mbr"
                },
                "change": {
                  "enum": [
                    "add",
                    "remove"
                  ]
                }
              }
            }
          }
        ],
        "description": "As the run record's decision, plus admin_change and lead_handover (P-6, P-7). Roles are checked here; member-level rules (the leader's own id, the admin minimum) by code (PRJ-02). On a lead_handover, member_id with change 'add' makes the new leader an admin in the same decision [proposed]."
      },
      "template_step": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "step_id": {
            "$ref": "primitives.schema.json#/$defs/step_id"
          },
          "kind": {
            "$ref": "primitives.schema.json#/$defs/step_kind"
          },
          "thread_ref": {
            "$ref": "primitives.schema.json#/$defs/versioned_ref"
          },
          "gate_ref": {
            "$ref": "primitives.schema.json#/$defs/versioned_ref"
          },
          "needs": {
            "type": "array",
            "items": {
              "$ref": "primitives.schema.json#/$defs/step_id"
            },
            "maxItems": 20
          },
          "reads": {
            "type": "array",
            "items": {
              "$ref": "primitives.schema.json#/$defs/name"
            },
            "maxItems": 30
          },
          "produces": {
            "type": "array",
            "items": {
              "$ref": "primitives.schema.json#/$defs/name"
            },
            "maxItems": 10
          },
          "scope": {
            "enum": [
              "full",
              "round_diff",
              "added_text"
            ]
          },
          "parallel_group": {
            "$ref": "primitives.schema.json#/$defs/name"
          }
        },
        "required": [
          "step_id",
          "kind",
          "needs"
        ],
        "allOf": [
          {
            "if": {
              "properties": {
                "kind": {
                  "const": "check"
                }
              },
              "required": [
                "kind"
              ]
            },
            "then": {
              "required": [
                "scope"
              ],
              "properties": {
                "scope": {
                  "enum": [
                    "full",
                    "round_diff"
                  ]
                }
              }
            }
          },
          {
            "if": {
              "properties": {
                "kind": {
                  "const": "recheck"
                }
              },
              "required": [
                "kind"
              ]
            },
            "then": {
              "required": [
                "scope"
              ],
              "properties": {
                "scope": {
                  "const": "added_text"
                }
              }
            }
          },
          {
            "if": {
              "not": {
                "properties": {
                  "kind": {
                    "enum": [
                      "check",
                      "recheck"
                    ]
                  }
                },
                "required": [
                  "kind"
                ]
              }
            },
            "then": {
              "not": {
                "anyOf": [
                  {
                    "required": [
                      "scope"
                    ]
                  }
                ]
              }
            }
          },
          {
            "if": {
              "properties": {
                "kind": {
                  "enum": [
                    "make",
                    "check",
                    "recheck"
                  ]
                }
              },
              "required": [
                "kind"
              ]
            },
            "then": {
              "required": [
                "thread_ref"
              ]
            }
          },
          {
            "if": {
              "not": {
                "properties": {
                  "kind": {
                    "enum": [
                      "make",
                      "check",
                      "recheck",
                      "adjudicate",
                      "revise"
                    ]
                  }
                },
                "required": [
                  "kind"
                ]
              }
            },
            "then": {
              "not": {
                "anyOf": [
                  {
                    "required": [
                      "thread_ref"
                    ]
                  }
                ]
              }
            }
          },
          {
            "if": {
              "properties": {
                "kind": {
                  "enum": [
                    "preflight",
                    "gate"
                  ]
                }
              },
              "required": [
                "kind"
              ]
            },
            "then": {
              "required": [
                "gate_ref"
              ]
            }
          },
          {
            "if": {
              "not": {
                "properties": {
                  "kind": {
                    "enum": [
                      "preflight",
                      "gate"
                    ]
                  }
                },
                "required": [
                  "kind"
                ]
              }
            },
            "then": {
              "not": {
                "anyOf": [
                  {
                    "required": [
                      "gate_ref"
                    ]
                  }
                ]
              }
            }
          }
        ]
      }
    }
  },
  "revision_log": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://fairlead.heuris.com.au/contracts/braids/v0.1/revision_log.schema.json",
    "title": "revision_log",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "schema": {
        "const": "fairlead.revision_log/0.1"
      },
      "step_id": {
        "$ref": "primitives.schema.json#/$defs/step_id"
      },
      "output_port": {
        "$ref": "primitives.schema.json#/$defs/name"
      },
      "from_fingerprint": {
        "$ref": "primitives.schema.json#/$defs/fingerprint"
      },
      "to_fingerprint": {
        "$ref": "primitives.schema.json#/$defs/fingerprint"
      },
      "entries": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "entry_id": {
              "type": "string",
              "maxLength": 64,
              "pattern": "^[A-Za-z0-9_.:-]+(?![\\s\\S])"
            },
            "adjudication_ref": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "step_id": {
                  "$ref": "primitives.schema.json#/$defs/step_id"
                },
                "finding_id": {
                  "type": "string",
                  "maxLength": 64,
                  "pattern": "^[A-Za-z0-9_.:-]+(?![\\s\\S])"
                }
              },
              "required": [
                "step_id",
                "finding_id"
              ]
            },
            "action": {
              "enum": [
                "applied",
                "partly_applied",
                "not_applied"
              ]
            },
            "location": {
              "type": "string",
              "maxLength": 200
            },
            "summary": {
              "type": "string",
              "maxLength": 200
            }
          },
          "required": [
            "entry_id",
            "adjudication_ref",
            "action",
            "location",
            "summary"
          ]
        },
        "maxItems": 100
      },
      "added_ranges": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "location": {
              "type": "string",
              "maxLength": 200
            },
            "kind": {
              "enum": [
                "added",
                "changed"
              ]
            }
          },
          "required": [
            "location",
            "kind"
          ]
        },
        "maxItems": 200
      },
      "adjudicator_wording": {
        "type": "boolean"
      }
    },
    "required": [
      "schema",
      "step_id",
      "output_port",
      "from_fingerprint",
      "to_fingerprint",
      "entries",
      "added_ranges",
      "adjudicator_wording"
    ],
    "description": "Written by every revise step. Fairlead code checks added_ranges against the actual changes (revision gate), fills from_fingerprint and to_fingerprint, and serves the recheck every changed range."
  },
  "run_record": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://fairlead.heuris.com.au/contracts/braids/v0.1/run_record.schema.json",
    "title": "run_record",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "schema": {
        "const": "fairlead.run_record/0.1"
      },
      "run_id": {
        "$ref": "primitives.schema.json#/$defs/id_run"
      },
      "fingerprint": {
        "$ref": "primitives.schema.json#/$defs/fingerprint_jcs1"
      },
      "template": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "template_id": {
            "$ref": "primitives.schema.json#/$defs/template_id"
          },
          "version": {
            "$ref": "primitives.schema.json#/$defs/semver"
          },
          "template_fingerprint": {
            "$ref": "primitives.schema.json#/$defs/fingerprint_jcs1"
          },
          "bundle": {
            "enum": [
              "core",
              "free"
            ]
          },
          "bundle_fingerprint": {
            "$ref": "primitives.schema.json#/$defs/fingerprint_jcs1"
          },
          "variant": {
            "$ref": "primitives.schema.json#/$defs/variant"
          },
          "report_version": {
            "anyOf": [
              {
                "$ref": "primitives.schema.json#/$defs/semver"
              },
              {
                "type": "null"
              }
            ]
          },
          "report_fingerprint": {
            "anyOf": [
              {
                "$ref": "primitives.schema.json#/$defs/fingerprint_jcs1"
              },
              {
                "type": "null"
              }
            ]
          }
        },
        "required": [
          "template_id",
          "version",
          "template_fingerprint",
          "bundle",
          "bundle_fingerprint",
          "variant",
          "report_version",
          "report_fingerprint"
        ]
      },
      "entitlement": {
        "$ref": "primitives.schema.json#/$defs/entitlement"
      },
      "risk_tier": {
        "$ref": "primitives.schema.json#/$defs/risk_tier"
      },
      "budget_setting": {
        "$ref": "primitives.schema.json#/$defs/budget_setting"
      },
      "host": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "profile": {
            "$ref": "primitives.schema.json#/$defs/host_profile"
          },
          "surface": {
            "type": "string",
            "maxLength": 64
          },
          "client_version": {
            "$ref": "primitives.schema.json#/$defs/semver"
          }
        },
        "required": [
          "profile",
          "surface",
          "client_version"
        ]
      },
      "project": {
        "anyOf": [
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "project_id": {
                "$ref": "primitives.schema.json#/$defs/id_prj"
              },
              "branch_id": {
                "$ref": "primitives.schema.json#/$defs/id_br"
              },
              "hand_off_id": {
                "$ref": "primitives.schema.json#/$defs/id_ho"
              }
            },
            "required": [
              "project_id",
              "branch_id",
              "hand_off_id"
            ]
          },
          {
            "type": "null"
          }
        ]
      },
      "inputs": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "port": {
              "$ref": "primitives.schema.json#/$defs/name"
            },
            "typed_output": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "fingerprint": {
                  "$ref": "primitives.schema.json#/$defs/fingerprint_raw"
                },
                "of": {
                  "enum": [
                    "typed_output",
                    "file"
                  ]
                }
              },
              "required": [
                "fingerprint",
                "of"
              ]
            },
            "source": {
              "enum": [
                "user_supplied",
                "hand_off_pack"
              ]
            },
            "from_run_id": {
              "$ref": "primitives.schema.json#/$defs/id_run"
            },
            "from_run_fingerprint": {
              "$ref": "primitives.schema.json#/$defs/fingerprint_jcs1"
            }
          },
          "required": [
            "port",
            "typed_output",
            "source"
          ],
          "allOf": [
            {
              "if": {
                "properties": {
                  "source": {
                    "const": "user_supplied"
                  }
                },
                "required": [
                  "source"
                ]
              },
              "then": {
                "not": {
                  "anyOf": [
                    {
                      "required": [
                        "from_run_id"
                      ]
                    },
                    {
                      "required": [
                        "from_run_fingerprint"
                      ]
                    }
                  ]
                }
              }
            }
          ]
        },
        "maxItems": 50
      },
      "focus": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "starting_prompt": {
            "type": "string",
            "maxLength": 4e3
          },
          "agreed_focus_ref": {
            "anyOf": [
              {
                "$ref": "primitives.schema.json#/$defs/file_ref"
              },
              {
                "type": "null"
              }
            ]
          },
          "accepted_at": {
            "anyOf": [
              {
                "$ref": "primitives.schema.json#/$defs/timestamp"
              },
              {
                "type": "null"
              }
            ]
          },
          "accepted_by": {
            "anyOf": [
              {
                "enum": [
                  "user",
                  "leader",
                  "admin"
                ]
              },
              {
                "type": "null"
              }
            ]
          }
        },
        "required": [
          "starting_prompt",
          "agreed_focus_ref",
          "accepted_at",
          "accepted_by"
        ],
        "description": "Null acceptance fields only on a run abandoned before the focus was accepted."
      },
      "steps": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "step_id": {
              "$ref": "primitives.schema.json#/$defs/step_id"
            },
            "kind": {
              "$ref": "primitives.schema.json#/$defs/step_kind"
            },
            "thread_ref": {
              "$ref": "primitives.schema.json#/$defs/versioned_ref"
            },
            "gate_ref": {
              "$ref": "primitives.schema.json#/$defs/versioned_ref"
            },
            "round": {
              "type": "integer",
              "minimum": 1
            },
            "attempt": {
              "type": "integer",
              "minimum": 1
            },
            "context_id": {
              "anyOf": [
                {
                  "$ref": "primitives.schema.json#/$defs/context_id"
                },
                {
                  "type": "null"
                }
              ]
            },
            "isolation": {
              "$ref": "primitives.schema.json#/$defs/isolation"
            },
            "model": {
              "type": "string",
              "maxLength": 64
            },
            "started_at": {
              "$ref": "primitives.schema.json#/$defs/timestamp"
            },
            "ended_at": {
              "anyOf": [
                {
                  "$ref": "primitives.schema.json#/$defs/timestamp"
                },
                {
                  "type": "null"
                }
              ]
            },
            "status": {
              "$ref": "primitives.schema.json#/$defs/step_status"
            },
            "output_refs": {
              "type": "array",
              "items": {
                "$ref": "primitives.schema.json#/$defs/file_ref"
              },
              "maxItems": 50
            }
          },
          "required": [
            "step_id",
            "kind",
            "round",
            "attempt",
            "context_id",
            "isolation",
            "started_at",
            "ended_at",
            "status",
            "output_refs"
          ],
          "allOf": [
            {
              "if": {
                "not": {
                  "properties": {
                    "kind": {
                      "enum": [
                        "preflight",
                        "gate",
                        "run"
                      ]
                    }
                  },
                  "required": [
                    "kind"
                  ]
                }
              },
              "then": {
                "properties": {
                  "context_id": {
                    "$ref": "primitives.schema.json#/$defs/context_id"
                  }
                }
              }
            }
          ]
        },
        "maxItems": 500
      },
      "findings": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "step_id": {
              "$ref": "primitives.schema.json#/$defs/step_id"
            },
            "ref": {
              "$ref": "primitives.schema.json#/$defs/file_ref"
            }
          },
          "required": [
            "step_id",
            "ref"
          ]
        },
        "maxItems": 200
      },
      "adjudications": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "step_id": {
              "$ref": "primitives.schema.json#/$defs/step_id"
            },
            "ref": {
              "$ref": "primitives.schema.json#/$defs/file_ref"
            },
            "adopted": {
              "type": "integer",
              "minimum": 0
            },
            "partly_adopted": {
              "type": "integer",
              "minimum": 0
            },
            "declined": {
              "type": "integer",
              "minimum": 0
            }
          },
          "required": [
            "step_id",
            "ref",
            "adopted",
            "partly_adopted",
            "declined"
          ]
        },
        "maxItems": 100
      },
      "decisions": {
        "type": "array",
        "items": {
          "$ref": "primitives.schema.json#/$defs/decision"
        },
        "maxItems": 200
      },
      "branches": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "branch_id": {
              "$ref": "primitives.schema.json#/$defs/id_br"
            },
            "opened_at_step": {
              "$ref": "primitives.schema.json#/$defs/step_id"
            },
            "state": {
              "enum": [
                "active",
                "awaiting_decision",
                "merged",
                "parked",
                "closed"
              ]
            },
            "outcome": {
              "anyOf": [
                {
                  "type": "object",
                  "additionalProperties": false,
                  "properties": {
                    "kind": {
                      "enum": [
                        "merged",
                        "parked",
                        "closed"
                      ]
                    },
                    "changed_items": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "maxLength": 64
                      },
                      "maxItems": 100
                    },
                    "revisit": {
                      "anyOf": [
                        {
                          "anyOf": [
                            {
                              "$ref": "primitives.schema.json#/$defs/date"
                            },
                            {
                              "$ref": "primitives.schema.json#/$defs/step_id"
                            }
                          ],
                          "description": "A date, or the step at which to revisit."
                        },
                        {
                          "type": "null"
                        }
                      ]
                    }
                  },
                  "required": [
                    "kind",
                    "changed_items"
                  ],
                  "allOf": [
                    {
                      "if": {
                        "not": {
                          "properties": {
                            "kind": {
                              "const": "parked"
                            }
                          },
                          "required": [
                            "kind"
                          ]
                        }
                      },
                      "then": {
                        "properties": {
                          "revisit": {
                            "type": "null"
                          }
                        }
                      }
                    }
                  ]
                },
                {
                  "type": "null"
                }
              ]
            },
            "reason_ref": {
              "anyOf": [
                {
                  "$ref": "primitives.schema.json#/$defs/file_ref"
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "required": [
            "branch_id",
            "opened_at_step",
            "state"
          ],
          "allOf": [
            {
              "if": {
                "properties": {
                  "state": {
                    "const": "merged"
                  }
                },
                "required": [
                  "state"
                ]
              },
              "then": {
                "required": [
                  "outcome"
                ],
                "properties": {
                  "outcome": {
                    "type": "object",
                    "properties": {
                      "kind": {
                        "const": "merged"
                      }
                    },
                    "required": [
                      "kind"
                    ]
                  }
                }
              }
            },
            {
              "if": {
                "properties": {
                  "state": {
                    "enum": [
                      "parked",
                      "closed"
                    ]
                  }
                },
                "required": [
                  "state"
                ]
              },
              "then": {
                "required": [
                  "reason_ref"
                ],
                "properties": {
                  "reason_ref": {
                    "not": {
                      "type": "null"
                    }
                  }
                }
              }
            },
            {
              "if": {
                "properties": {
                  "state": {
                    "const": "parked"
                  }
                },
                "required": [
                  "state"
                ]
              },
              "then": {
                "properties": {
                  "outcome": {
                    "anyOf": [
                      {
                        "type": "null"
                      },
                      {
                        "properties": {
                          "kind": {
                            "const": "parked"
                          }
                        },
                        "required": [
                          "kind"
                        ]
                      }
                    ]
                  }
                }
              }
            },
            {
              "if": {
                "properties": {
                  "state": {
                    "const": "closed"
                  }
                },
                "required": [
                  "state"
                ]
              },
              "then": {
                "properties": {
                  "outcome": {
                    "anyOf": [
                      {
                        "type": "null"
                      },
                      {
                        "properties": {
                          "kind": {
                            "const": "closed"
                          }
                        },
                        "required": [
                          "kind"
                        ]
                      }
                    ]
                  }
                }
              }
            }
          ]
        },
        "maxItems": 50
      },
      "refines": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "at": {
              "$ref": "primitives.schema.json#/$defs/timestamp"
            },
            "old_fp": {
              "$ref": "primitives.schema.json#/$defs/fingerprint"
            },
            "new_fp": {
              "$ref": "primitives.schema.json#/$defs/fingerprint"
            },
            "reason_ref": {
              "$ref": "primitives.schema.json#/$defs/file_ref"
            },
            "stale_steps": {
              "type": "array",
              "items": {
                "$ref": "primitives.schema.json#/$defs/step_id"
              },
              "maxItems": 100
            }
          },
          "required": [
            "at",
            "old_fp",
            "new_fp",
            "reason_ref",
            "stale_steps"
          ]
        },
        "maxItems": 50
      },
      "outputs": {
        "type": "array",
        "items": {
          "$ref": "primitives.schema.json#/$defs/produced_output"
        },
        "maxItems": 100
      },
      "delivery": {
        "anyOf": [
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "choice_ids": {
                "type": "array",
                "items": {
                  "$ref": "primitives.schema.json#/$defs/name"
                },
                "maxItems": 20
              },
              "delivered_at": {
                "$ref": "primitives.schema.json#/$defs/timestamp"
              },
              "report_built": {
                "type": "boolean"
              }
            },
            "required": [
              "choice_ids",
              "delivered_at",
              "report_built"
            ]
          },
          {
            "type": "null"
          }
        ]
      },
      "practice_headline": {
        "$ref": "practice_headline.schema.json"
      },
      "usage": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "step_id": {
              "$ref": "primitives.schema.json#/$defs/step_id"
            },
            "tokens": {
              "type": "integer",
              "minimum": 0
            },
            "requests": {
              "type": "integer",
              "minimum": 0
            },
            "tool_uses": {
              "type": "integer",
              "minimum": 0
            },
            "duration_ms": {
              "type": "integer",
              "minimum": 0
            },
            "grade": {
              "enum": [
                "measured",
                "host_reported",
                "estimated",
                "unknown"
              ]
            }
          },
          "required": [
            "step_id",
            "duration_ms",
            "grade"
          ]
        },
        "maxItems": 500
      },
      "events": {
        "type": "array",
        "items": {
          "$ref": "primitives.schema.json#/$defs/record_event"
        },
        "maxItems": 2e4,
        "minItems": 1,
        "prefixItems": [
          {
            "allOf": [
              {
                "allOf": [
                  {
                    "$ref": "primitives.schema.json#/$defs/record_event"
                  },
                  {
                    "properties": {
                      "seq": {
                        "const": 1
                      }
                    }
                  }
                ]
              },
              {
                "properties": {
                  "type": {
                    "const": "run_started"
                  }
                }
              }
            ]
          }
        ]
      },
      "harness_events": {
        "anyOf": [
          {
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "type": "object",
                  "additionalProperties": false,
                  "properties": {
                    "type": {
                      "const": "harness_label"
                    },
                    "at": {
                      "$ref": "primitives.schema.json#/$defs/timestamp"
                    },
                    "data": {
                      "type": "object",
                      "additionalProperties": false,
                      "properties": {
                        "label": {
                          "type": "string",
                          "maxLength": 64,
                          "pattern": "^[A-Za-z0-9_.-]+(?![\\s\\S])"
                        },
                        "condition": {
                          "enum": [
                            "naive",
                            "full",
                            "standard",
                            "lean",
                            "solo"
                          ]
                        },
                        "task": {
                          "$ref": "primitives.schema.json#/$defs/name"
                        }
                      },
                      "required": [
                        "label",
                        "condition",
                        "task"
                      ]
                    }
                  },
                  "required": [
                    "type",
                    "at",
                    "data"
                  ]
                },
                {
                  "type": "object",
                  "additionalProperties": false,
                  "properties": {
                    "type": {
                      "$ref": "primitives.schema.json#/$defs/name"
                    },
                    "at": {
                      "$ref": "primitives.schema.json#/$defs/timestamp"
                    },
                    "data": {
                      "type": "object",
                      "maxProperties": 20,
                      "additionalProperties": {
                        "type": [
                          "string",
                          "integer",
                          "boolean"
                        ]
                      }
                    }
                  },
                  "required": [
                    "type",
                    "at",
                    "data"
                  ]
                }
              ]
            },
            "maxItems": 1e3,
            "minItems": 1,
            "prefixItems": [
              {
                "type": "object",
                "additionalProperties": false,
                "properties": {
                  "type": {
                    "const": "harness_label"
                  },
                  "at": {
                    "$ref": "primitives.schema.json#/$defs/timestamp"
                  },
                  "data": {
                    "type": "object",
                    "additionalProperties": false,
                    "properties": {
                      "label": {
                        "type": "string",
                        "maxLength": 64,
                        "pattern": "^[A-Za-z0-9_.-]+(?![\\s\\S])"
                      },
                      "condition": {
                        "enum": [
                          "naive",
                          "full",
                          "standard",
                          "lean",
                          "solo"
                        ]
                      },
                      "task": {
                        "$ref": "primitives.schema.json#/$defs/name"
                      }
                    },
                    "required": [
                      "label",
                      "condition",
                      "task"
                    ]
                  }
                },
                "required": [
                  "type",
                  "at",
                  "data"
                ]
              }
            ]
          },
          {
            "type": "null"
          }
        ]
      }
    },
    "required": [
      "schema",
      "run_id",
      "fingerprint",
      "template",
      "entitlement",
      "risk_tier",
      "budget_setting",
      "host",
      "project",
      "inputs",
      "focus",
      "steps",
      "findings",
      "adjudications",
      "decisions",
      "branches",
      "refines",
      "outputs",
      "delivery",
      "practice_headline",
      "usage",
      "events",
      "harness_events"
    ],
    "allOf": [
      {
        "if": {
          "properties": {
            "entitlement": {
              "enum": [
                "free",
                "individual"
              ]
            }
          },
          "required": [
            "entitlement"
          ]
        },
        "then": {
          "properties": {
            "project": {
              "type": "null"
            },
            "inputs": {
              "items": {
                "allOf": [
                  {
                    "properties": {
                      "source": {
                        "const": "user_supplied"
                      }
                    }
                  },
                  {
                    "not": {
                      "anyOf": [
                        {
                          "required": [
                            "from_run_id"
                          ]
                        },
                        {
                          "required": [
                            "from_run_fingerprint"
                          ]
                        }
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      },
      {
        "if": {
          "properties": {
            "entitlement": {
              "const": "free"
            }
          },
          "required": [
            "entitlement"
          ]
        },
        "then": {
          "properties": {
            "budget_setting": {
              "const": "normal"
            },
            "template": {
              "properties": {
                "variant": {
                  "const": "standard"
                },
                "bundle": {
                  "const": "free"
                },
                "report_version": {
                  "type": "null"
                },
                "report_fingerprint": {
                  "type": "null"
                }
              }
            },
            "delivery": {
              "anyOf": [
                {
                  "type": "null"
                },
                {
                  "properties": {
                    "report_built": {
                      "const": false
                    }
                  }
                }
              ]
            }
          }
        }
      },
      {
        "if": {
          "properties": {
            "inputs": {
              "contains": {
                "properties": {
                  "source": {
                    "const": "hand_off_pack"
                  }
                },
                "required": [
                  "source"
                ]
              }
            }
          },
          "required": [
            "inputs"
          ]
        },
        "then": {
          "properties": {
            "project": {
              "type": "object"
            }
          }
        }
      },
      {
        "if": {
          "properties": {
            "delivery": {
              "type": "null"
            }
          },
          "required": [
            "delivery"
          ]
        },
        "then": {
          "properties": {
            "decisions": {
              "contains": {
                "properties": {
                  "kind": {
                    "const": "abandon"
                  }
                },
                "required": [
                  "kind"
                ]
              }
            }
          }
        }
      },
      {
        "if": {
          "properties": {
            "decisions": {
              "contains": {
                "properties": {
                  "kind": {
                    "const": "abandon"
                  }
                },
                "required": [
                  "kind"
                ]
              }
            }
          },
          "required": [
            "decisions"
          ]
        },
        "then": {
          "properties": {
            "delivery": {
              "type": "null"
            }
          },
          "not": {
            "properties": {
              "events": {
                "contains": {
                  "properties": {
                    "type": {
                      "const": "delivered"
                    }
                  },
                  "required": [
                    "type"
                  ]
                }
              }
            }
          }
        }
      },
      {
        "if": {
          "properties": {
            "delivery": {
              "type": "object"
            }
          },
          "required": [
            "delivery"
          ]
        },
        "then": {
          "properties": {
            "events": {
              "contains": {
                "properties": {
                  "type": {
                    "const": "delivered"
                  }
                },
                "required": [
                  "type"
                ]
              }
            }
          }
        }
      },
      {
        "properties": {
          "focus": {
            "anyOf": [
              {
                "properties": {
                  "agreed_focus_ref": {
                    "not": {
                      "type": "null"
                    }
                  },
                  "accepted_at": {
                    "not": {
                      "type": "null"
                    }
                  },
                  "accepted_by": {
                    "not": {
                      "type": "null"
                    }
                  }
                }
              },
              {
                "properties": {
                  "agreed_focus_ref": {
                    "type": "null"
                  },
                  "accepted_at": {
                    "type": "null"
                  },
                  "accepted_by": {
                    "type": "null"
                  }
                }
              }
            ]
          }
        }
      },
      {
        "if": {
          "properties": {
            "focus": {
              "properties": {
                "accepted_at": {
                  "type": "null"
                }
              }
            }
          }
        },
        "then": {
          "properties": {
            "delivery": {
              "type": "null"
            }
          }
        }
      },
      {
        "properties": {
          "template": {
            "anyOf": [
              {
                "properties": {
                  "report_version": {
                    "not": {
                      "type": "null"
                    }
                  },
                  "report_fingerprint": {
                    "not": {
                      "type": "null"
                    }
                  }
                }
              },
              {
                "properties": {
                  "report_version": {
                    "type": "null"
                  },
                  "report_fingerprint": {
                    "type": "null"
                  }
                }
              }
            ]
          }
        }
      }
    ],
    "description": "The canonical record of one run (\xA76.2). Frozen at delivered, or at an abandon decision (R-7)."
  },
  "source_register": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://fairlead.heuris.com.au/contracts/braids/v0.1/source_register.schema.json",
    "title": "source_register",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "items": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "source_id": {
              "type": "string",
              "maxLength": 64,
              "pattern": "^[A-Za-z0-9_.:-]+(?![\\s\\S])"
            },
            "title": {
              "type": "string",
              "maxLength": 300
            },
            "authors": {
              "type": "array",
              "items": {
                "type": "string",
                "maxLength": 80
              },
              "maxItems": 20
            },
            "year": {
              "type": [
                "integer",
                "null"
              ]
            },
            "venue": {
              "type": "string",
              "maxLength": 160
            },
            "locator": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "doi": {
                  "anyOf": [
                    {
                      "type": "string",
                      "maxLength": 200
                    },
                    {
                      "type": "null"
                    }
                  ]
                },
                "url": {
                  "anyOf": [
                    {
                      "type": "string",
                      "maxLength": 500
                    },
                    {
                      "type": "null"
                    }
                  ]
                },
                "arxiv_id": {
                  "anyOf": [
                    {
                      "type": "string",
                      "maxLength": 40
                    },
                    {
                      "type": "null"
                    }
                  ]
                }
              },
              "required": [
                "doi",
                "url",
                "arxiv_id"
              ]
            },
            "read_level": {
              "$ref": "primitives.schema.json#/$defs/read_level"
            },
            "sub_questions": {
              "$ref": "primitives.schema.json#/$defs/sub_questions"
            },
            "why_included": {
              "type": "string",
              "maxLength": 300
            },
            "found_via": {
              "enum": [
                "search",
                "backward_citation",
                "forward_citation",
                "provided",
                "checker_proposed"
              ]
            }
          },
          "required": [
            "source_id",
            "title",
            "authors",
            "year",
            "venue",
            "locator",
            "read_level",
            "sub_questions",
            "why_included",
            "found_via"
          ]
        },
        "maxItems": 150
      },
      "screened": {
        "type": "integer",
        "minimum": 0
      },
      "searches": {
        "type": "integer",
        "minimum": 0
      }
    },
    "required": [
      "items",
      "screened",
      "searches"
    ],
    "description": "Included sources with locators and read levels (EV-2). The cite and quote gates read it."
  },
  "synthesis": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://fairlead.heuris.com.au/contracts/braids/v0.1/synthesis.schema.json",
    "title": "synthesis",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "points": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "text": {
              "type": "string",
              "maxLength": 500
            },
            "label": {
              "$ref": "primitives.schema.json#/$defs/claim_tag"
            },
            "basis": {
              "type": "array",
              "items": {
                "type": "string",
                "maxLength": 120
              },
              "maxItems": 6
            }
          },
          "required": [
            "text",
            "label",
            "basis"
          ]
        },
        "maxItems": 20
      },
      "counter_case": {
        "type": "string",
        "maxLength": 800
      },
      "next_step": {
        "type": "string",
        "maxLength": 300
      }
    },
    "required": [
      "points",
      "counter_case",
      "next_step"
    ]
  },
  "thread": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://fairlead.heuris.com.au/contracts/braids/v0.1/thread.schema.json",
    "title": "thread",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "schema": {
        "const": "fairlead.thread/0.1"
      },
      "thread_id": {
        "$ref": "primitives.schema.json#/$defs/name"
      },
      "version": {
        "$ref": "primitives.schema.json#/$defs/semver"
      },
      "fingerprint": {
        "$ref": "primitives.schema.json#/$defs/fingerprint_jcs1"
      },
      "name": {
        "type": "string",
        "maxLength": 80
      },
      "purpose": {
        "type": "string",
        "maxLength": 300
      },
      "archetype": {
        "enum": [
          "finder",
          "maker",
          "checker",
          "adjudicator",
          "reviser"
        ]
      },
      "default_role": {
        "$ref": "primitives.schema.json#/$defs/role"
      },
      "reads": {
        "type": "array",
        "items": {
          "$ref": "primitives.schema.json#/$defs/name"
        },
        "maxItems": 30
      },
      "never_sees": {
        "type": "array",
        "items": {
          "$ref": "primitives.schema.json#/$defs/name"
        },
        "maxItems": 20
      },
      "tools": {
        "type": "array",
        "items": {
          "enum": [
            "search",
            "fetch",
            "read_file",
            "write_output",
            "run_readonly",
            "none"
          ]
        },
        "maxItems": 6,
        "minItems": 1,
        "uniqueItems": true
      },
      "returns": {
        "$ref": "primitives.schema.json#/$defs/name"
      },
      "caps": {
        "$ref": "primitives.schema.json#/$defs/caps"
      },
      "default_model_class": {
        "enum": [
          "fast",
          "balanced",
          "strong"
        ]
      },
      "targets": {
        "type": "array",
        "items": {
          "$ref": "primitives.schema.json#/$defs/name"
        },
        "maxItems": 30
      },
      "preambles": {
        "type": "array",
        "items": {
          "$ref": "primitives.schema.json#/$defs/versioned_ref"
        },
        "maxItems": 2,
        "minItems": 2,
        "prefixItems": [
          {
            "pattern": "^common@"
          }
        ]
      },
      "prompt": {
        "type": "string",
        "maxLength": 8e3
      },
      "placeholders": {
        "type": "array",
        "items": {
          "type": "string",
          "pattern": "^(focus|context_doc|inputs\\.[a-z][a-z0-9_]{0,63}|gate_results|findings|diff|scope|contract|caps)(?![\\s\\S])"
        },
        "maxItems": 20,
        "uniqueItems": true
      }
    },
    "required": [
      "schema",
      "thread_id",
      "version",
      "fingerprint",
      "name",
      "purpose",
      "archetype",
      "default_role",
      "reads",
      "never_sees",
      "tools",
      "returns",
      "caps",
      "default_model_class",
      "targets",
      "preambles",
      "prompt",
      "placeholders"
    ],
    "allOf": [
      {
        "if": {
          "properties": {
            "archetype": {
              "enum": [
                "finder",
                "maker"
              ]
            }
          },
          "required": [
            "archetype"
          ]
        },
        "then": {
          "properties": {
            "default_role": {
              "enum": [
                "finder",
                "maker"
              ]
            }
          }
        }
      },
      {
        "if": {
          "properties": {
            "archetype": {
              "const": "checker"
            }
          },
          "required": [
            "archetype"
          ]
        },
        "then": {
          "properties": {
            "default_role": {
              "const": "checker"
            }
          }
        }
      },
      {
        "if": {
          "properties": {
            "archetype": {
              "const": "adjudicator"
            }
          },
          "required": [
            "archetype"
          ]
        },
        "then": {
          "properties": {
            "default_role": {
              "const": "adjudicator"
            }
          }
        }
      },
      {
        "if": {
          "properties": {
            "archetype": {
              "const": "reviser"
            }
          },
          "required": [
            "archetype"
          ]
        },
        "then": {
          "properties": {
            "default_role": {
              "const": "reviser"
            }
          }
        }
      },
      {
        "if": {
          "properties": {
            "archetype": {
              "const": "finder"
            }
          },
          "required": [
            "archetype"
          ]
        },
        "then": {
          "properties": {
            "preambles": {
              "prefixItems": [
                {},
                {
                  "pattern": "^finder@"
                }
              ]
            }
          }
        }
      },
      {
        "if": {
          "properties": {
            "archetype": {
              "const": "maker"
            }
          },
          "required": [
            "archetype"
          ]
        },
        "then": {
          "properties": {
            "preambles": {
              "prefixItems": [
                {},
                {
                  "pattern": "^maker@"
                }
              ]
            }
          }
        }
      },
      {
        "if": {
          "properties": {
            "archetype": {
              "const": "checker"
            }
          },
          "required": [
            "archetype"
          ]
        },
        "then": {
          "properties": {
            "preambles": {
              "prefixItems": [
                {},
                {
                  "pattern": "^checker@"
                }
              ]
            }
          }
        }
      },
      {
        "if": {
          "properties": {
            "archetype": {
              "const": "adjudicator"
            }
          },
          "required": [
            "archetype"
          ]
        },
        "then": {
          "properties": {
            "preambles": {
              "prefixItems": [
                {},
                {
                  "pattern": "^adjudicator@"
                }
              ]
            }
          }
        }
      },
      {
        "if": {
          "properties": {
            "archetype": {
              "const": "reviser"
            }
          },
          "required": [
            "archetype"
          ]
        },
        "then": {
          "properties": {
            "preambles": {
              "prefixItems": [
                {},
                {
                  "pattern": "^reviser@"
                }
              ]
            }
          }
        }
      }
    ],
    "description": "One thread-library entry (\xA73.6). A template may only narrow its tools, reads and caps."
  },
  "type": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://fairlead.heuris.com.au/contracts/braids/v0.1/type.schema.json",
    "title": "type",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "schema": {
        "const": "fairlead.type/0.1"
      },
      "type_id": {
        "$ref": "primitives.schema.json#/$defs/name"
      },
      "version": {
        "$ref": "primitives.schema.json#/$defs/semver"
      },
      "fingerprint": {
        "$ref": "primitives.schema.json#/$defs/fingerprint_jcs1"
      },
      "title": {
        "type": "string",
        "maxLength": 80
      },
      "description": {
        "type": "string",
        "maxLength": 400
      },
      "contract": {
        "anyOf": [
          {
            "$ref": "primitives.schema.json#/$defs/name"
          },
          {
            "type": "null"
          }
        ]
      },
      "media_types": {
        "type": "array",
        "items": {
          "type": "string",
          "maxLength": 100
        },
        "maxItems": 10,
        "minItems": 1
      },
      "datafile_capable": {
        "type": "boolean"
      },
      "required_gates": {
        "type": "array",
        "items": {
          "$ref": "primitives.schema.json#/$defs/name"
        },
        "maxItems": 20
      },
      "menu_formats": {
        "type": "array",
        "items": {
          "$ref": "primitives.schema.json#/$defs/menu_format"
        },
        "maxItems": 6,
        "uniqueItems": true
      }
    },
    "required": [
      "schema",
      "type_id",
      "version",
      "fingerprint",
      "title",
      "description",
      "contract",
      "media_types",
      "datafile_capable",
      "required_gates",
      "menu_formats"
    ],
    "description": "Typed-output registry entry (\xA73.7)."
  },
  "typed_output": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://fairlead.heuris.com.au/contracts/braids/v0.1/typed_output.schema.json",
    "title": "typed_output",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "port": {
        "$ref": "primitives.schema.json#/$defs/name"
      },
      "type_ref": {
        "$ref": "primitives.schema.json#/$defs/versioned_ref"
      },
      "contract": {
        "anyOf": [
          {
            "$ref": "primitives.schema.json#/$defs/name"
          },
          {
            "type": "null"
          }
        ]
      },
      "path": {
        "$ref": "primitives.schema.json#/$defs/file_ref"
      },
      "fingerprint": {
        "$ref": "primitives.schema.json#/$defs/fingerprint_raw"
      },
      "media_type": {
        "type": "string",
        "maxLength": 100
      },
      "datafile": {
        "type": "boolean"
      },
      "handling": {
        "anyOf": [
          {
            "$ref": "primitives.schema.json#/$defs/handling"
          },
          {
            "type": "null"
          }
        ]
      },
      "produced_by": {
        "anyOf": [
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "run_id": {
                "$ref": "primitives.schema.json#/$defs/id_run"
              },
              "step_id": {
                "$ref": "primitives.schema.json#/$defs/step_id"
              }
            },
            "required": [
              "run_id",
              "step_id"
            ]
          },
          {
            "type": "null"
          }
        ],
        "description": "Null for a run input the user supplied [proposed]."
      }
    },
    "required": [
      "port",
      "type_ref",
      "contract",
      "path",
      "fingerprint",
      "media_type",
      "datafile",
      "handling",
      "produced_by"
    ],
    "allOf": [
      {
        "$ref": "primitives.schema.json#/$defs/handling_port_rule"
      }
    ]
  }
};

// packages/contracts/dist/index.js
var ajv = new import__.Ajv2020({
  allErrors: true,
  strict: false,
  // the schemas carry descriptions and conditional keywords Ajv's strict mode flags
  validateFormats: false
  // matches Python, which validates without a format checker
});
for (const name of CONTRACT_NAMES)
  ajv.addSchema(SCHEMAS[name]);
var NAMES = new Set(CONTRACT_NAMES);
var compiled = /* @__PURE__ */ new Map();
function isContractName(name) {
  return NAMES.has(name);
}
function validator(name) {
  let v = compiled.get(name);
  if (v === void 0) {
    const id = SCHEMAS[name].$id;
    if (typeof id !== "string")
      throw new Error(`contract ${name} has no $id`);
    const found = ajv.getSchema(id);
    if (found === void 0)
      throw new Error(`contract ${name} did not compile`);
    v = found;
    compiled.set(name, v);
  }
  return v;
}
var describe = (e) => `${e.instancePath || "/"}: ${e.message ?? e.keyword}`;
function schemaOf(name) {
  const defs = SCHEMAS.primitives.$defs ?? {};
  const inline = (node, depth) => {
    if (depth > 40)
      return {};
    if (Array.isArray(node))
      return node.map((x) => inline(x, depth + 1));
    if (!node || typeof node !== "object")
      return node;
    const o = node;
    if (typeof o.$ref === "string") {
      const m = /^([a-z_]+)\.schema\.json(?:#\/\$defs\/([A-Za-z0-9_]+))?$/.exec(o.$ref);
      if (m?.[2])
        return inline(defs[m[2]], depth + 1);
      if (m?.[1] && isContractName(m[1]))
        return inline(SCHEMAS[m[1]], depth + 1);
    }
    const out = {};
    for (const [k, v] of Object.entries(o))
      if (k !== "$id" && k !== "$schema" && k !== "$defs")
        out[k] = inline(v, depth + 1);
    return out;
  };
  return inline(SCHEMAS[name], 0);
}
var PRIMITIVE_DEFS = Object.keys(SCHEMAS.primitives.$defs ?? {}).sort();
function validatePrimitive(def, value) {
  if (!PRIMITIVE_DEFS.includes(def))
    throw new Error(`unknown primitive definition ${def}`);
  const base = SCHEMAS.primitives.$id;
  const v = ajv.getSchema(`${base}#/$defs/${def}`);
  if (v === void 0)
    throw new Error(`primitive definition ${def} did not compile`);
  return v(value) ? [] : (v.errors ?? []).map(describe);
}
function validateContract(name, value) {
  if (!isContractName(name))
    throw new Error(`unknown contract ${String(name)}`);
  const v = validator(name);
  return v(value) ? [] : (v.errors ?? []).map(describe);
}

// packages/gate-runner/dist/index.js
var STATUS_BY_EXIT = ["pass", "fail", "warn", "skipped"];
function works(cmd, args) {
  const r = spawnSync(cmd, args, { stdio: "ignore", timeout: 1e4, windowsHide: true });
  return r.status === 0;
}
function findRuntimes() {
  let python = null;
  for (const cmd of ["python3", "python"]) {
    if (works(cmd, ["-c", "import sys; sys.exit(0 if sys.version_info[0] == 3 else 1)"])) {
      python = cmd;
      break;
    }
  }
  return { node: process.execPath, python };
}
var cachedRuntimes = null;
function inside(base, p) {
  const rel = relative(resolve(base), resolve(p));
  return rel !== "" && !rel.startsWith("..") && !isAbsolute(rel);
}
function fingerprintsOf(input) {
  const i = input;
  const all = [i.target, ...i.extra_inputs ?? []].map((x) => x?.fingerprint);
  return all.filter((f) => typeof f === "string");
}
async function runGate(opts) {
  const runtimes = opts.runtimes ?? (cachedRuntimes ??= findRuntimes());
  const rawStep = opts.input.step_id;
  const stepId = typeof rawStep === "string" && /^[A-Za-z0-9_-]{1,64}$/.test(rawStep) ? rawStep : "step";
  const ioDir = join(opts.runDir, "gate_io", stepId, `${Date.now().toString(36)}-${randomBytes(4).toString("hex")}`);
  mkdirSync(ioDir, { recursive: true });
  const inputPath = join(ioDir, "input.json");
  const resultPath = join(ioDir, "result.json");
  const logPath = join(ioDir, "log.txt");
  writeFileSync(inputPath, JSON.stringify(opts.input));
  const gate = JSON.parse(readFileSync(join(opts.gateDir, "gate.json"), "utf8"));
  const gateRef = `${gate.gate_id}@${gate.version}`;
  const base = {
    result: null,
    inputPath,
    resultPath: null,
    logPath
  };
  const inputFps = fingerprintsOf(opts.input);
  const wanted = opts.runtime ?? "either";
  const order = wanted === "either" ? ["js", "python"] : [wanted];
  const available = (r) => r === "js" ? runtimes.node : runtimes.python;
  const script = order.map((r) => gate.scripts.find((s) => s.runtime === r)).find((s) => s && available(s.runtime));
  if (!script) {
    const has = gate.scripts.map((s) => s.runtime);
    const missing = order.filter((r) => has.includes(r));
    const problem = missing.length === 0 ? `gate ${gateRef} has no ${wanted} script` : `cannot run gate ${gateRef}: install ${missing.includes("js") ? "Node.js 22 (https://nodejs.org)" : "Python 3 (https://www.python.org)"}`;
    writeFileSync(logPath, problem + "\n");
    return { ...base, status: "error", exitCode: -1, runtime: null, problem, event: null };
  }
  const event = (status2, exitCode, resultFp2) => ({
    source: "mcp_server",
    gate_ref: gateRef,
    runtime: script.runtime,
    runner: "plugin_local",
    script_fingerprint: script.script_fingerprint,
    input_fingerprints: inputFps,
    exit_code: exitCode,
    status: status2,
    result_fingerprint: resultFp2
  });
  const fail = (problem, exitCode = -1, resultFp2 = null) => {
    writeFileSync(logPath, problem + "\n", { flag: "a" });
    return { ...base, status: "error", exitCode, runtime: script.runtime, problem, event: event("error", exitCode, resultFp2) };
  };
  if (selfFingerprint(gate) !== gate.fingerprint) {
    return fail(`gate.json for ${gateRef} does not match its own fingerprint; refused`);
  }
  const entry = join(opts.gateDir, script.entry);
  if (!inside(opts.gateDir, entry) || !existsSync(entry))
    return fail(`script ${script.entry} not found; refused`);
  if (raw(readFileSync(entry)) !== script.script_fingerprint) {
    return fail(`script ${script.entry} does not match its fingerprint in gate.json; refused`);
  }
  const exe = available(script.runtime);
  const timeoutMs = opts.timeoutMs ?? gate.timeout_s * 1e3;
  const env2 = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith("FAIRLEAD_")));
  Object.assign(env2, opts.env ?? {});
  const outcome = await new Promise((done) => {
    const child = spawn(exe, [entry, "--input", inputPath, "--out", resultPath], {
      cwd: opts.runDir,
      env: env2,
      windowsHide: true
    });
    let log = "";
    child.stdout.on("data", (b) => log += b.toString("utf8"));
    child.stderr.on("data", (b) => log += b.toString("utf8"));
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, timeoutMs);
    child.on("error", (err) => {
      clearTimeout(timer);
      done({ code: null, timedOut: false, log: log + String(err) });
    });
    child.on("close", (code2) => {
      clearTimeout(timer);
      done({ code: code2, timedOut, log });
    });
  });
  writeFileSync(logPath, outcome.log);
  if (outcome.timedOut)
    return fail(`gate ${gateRef} timed out after ${String(timeoutMs)} ms`);
  if (outcome.code === null)
    return fail(`gate ${gateRef} could not be started`);
  const code = outcome.code;
  if (code < 0 || code > 3)
    return fail(`gate ${gateRef} ended with exit code ${String(code)}`, code);
  if (!existsSync(resultPath))
    return fail(`gate ${gateRef} wrote no result`, code);
  const bytes = readFileSync(resultPath);
  const resultFp = raw(bytes);
  let result;
  try {
    result = JSON.parse(bytes.toString("utf8"));
  } catch {
    return fail(`gate ${gateRef} wrote a result that is not JSON`, code, resultFp);
  }
  const problems = validateContract("gate_result", result);
  if (problems.length > 0)
    return fail(`gate ${gateRef} wrote an invalid gate_result: ${problems.slice(0, 3).join("; ")}`, code, resultFp);
  const status = STATUS_BY_EXIT[code];
  const claimed = result.status;
  if (claimed !== status)
    return fail(`gate ${gateRef} result status ${String(claimed)} disagrees with exit code ${String(code)}`, code, resultFp);
  return {
    ...base,
    status,
    exitCode: code,
    runtime: script.runtime,
    result,
    resultPath,
    problem: null,
    event: event(status, code, resultFp)
  };
}

// packages/record/dist/events.js
var EVENT_TYPES = [
  "run_started",
  "hooks_armed",
  "step_started",
  "step_ended",
  "subagent_spawned",
  "ticket_issued",
  "subagent_ended",
  "ticket_closed",
  "inputs_served",
  "output_accepted",
  "hook_check",
  "gate_exit",
  "file_read",
  "user_answer_observed",
  "transcript_scan",
  "input_rule_sign",
  "pack_fingerprints",
  "decision_recorded",
  "refine",
  "branch_state",
  "headline_generated",
  "delivered"
];
var RecordFrozen = class extends Error {
  name = "RecordFrozen";
};
var TYPES = new Set(EVENT_TYPES);
function deepFreeze(value) {
  if (value && typeof value === "object") {
    for (const v of Object.values(value))
      deepFreeze(v);
    Object.freeze(value);
  }
  return value;
}
var utc = (d2) => d2.toISOString().replace(/\.\d{3}Z$/, "Z");
var EventLog = class {
  list = [];
  closed = false;
  abandoned = false;
  now;
  constructor(opts = {}) {
    this.now = opts.now ?? (() => /* @__PURE__ */ new Date());
    for (const e of opts.events ?? [])
      this.list.push(deepFreeze(structuredClone(e)));
  }
  get frozen() {
    return this.closed;
  }
  get events() {
    return this.list;
  }
  ofType(type) {
    return this.list.filter((e) => e.type === type);
  }
  bySeq(seq) {
    return this.list[seq - 1];
  }
  /** Append one event; throws (and keeps nothing) if it does not fit its contract definition. */
  append(type, data, stepId) {
    if (!TYPES.has(type))
      throw new Error(`unknown event type ${type}`);
    if (this.closed)
      throw new RecordFrozen(`the run record is frozen; ${type} cannot be added`);
    if (this.abandoned && type !== "headline_generated") {
      throw new RecordFrozen(`the run was abandoned; only headline_generated may follow, not ${type}`);
    }
    const event = {
      seq: this.list.length + 1,
      at: utc(this.now()),
      type,
      ...stepId === void 0 ? {} : { step_id: stepId },
      data: structuredClone(data)
    };
    const problems = validatePrimitive(`event_${type}`, event);
    if (problems.length > 0)
      throw new Error(`${type} event does not fit its contract: ${problems.slice(0, 4).join("; ")}`);
    this.list.push(deepFreeze(event));
    if (type === "delivered")
      this.closed = true;
    if (type === "decision_recorded" && data.kind === "abandon")
      this.abandoned = true;
    if (type === "headline_generated" && this.abandoned)
      this.closed = true;
    return event;
  }
};

// packages/record/dist/headline.js
var d = (e) => e.data;
var NO_FILE_TOOLS = /^(Read|Write|Edit|MultiEdit|NotebookEdit|Bash|PowerShell|Glob|Grep)$/;
function ticketViews(events) {
  const views = /* @__PURE__ */ new Map();
  for (const e of events) {
    const t = d(e).ticket_id;
    if (e.type === "ticket_issued" && typeof t === "string") {
      views.set(t, {
        ticket_id: t,
        step_id: e.step_id ?? "",
        kind: String(d(e).kind),
        context_id: String(d(e).context_id),
        issued: e,
        spawnChecks: [],
        served: [],
        accepted: []
      });
    }
  }
  for (const e of events) {
    const t = d(e).ticket_id;
    if (typeof t !== "string")
      continue;
    const v = views.get(t);
    if (!v)
      continue;
    if (e.type === "subagent_spawned" && d(e).observed_by === "hook" && !v.spawned) {
      v.spawned = e;
      for (const c of events) {
        if (c.seq >= e.seq)
          break;
        const cites = d(c).cites ?? [];
        if (c.type === "hook_check" && d(c).hook_id === "BH-1" && cites.includes(v.issued.seq))
          v.spawnChecks.push(c);
      }
    }
    if (e.type === "inputs_served")
      v.served.push(e);
    if (e.type === "output_accepted")
      v.accepted.push(e);
    if (e.type === "ticket_closed" && !v.closed)
      v.closed = e;
  }
  for (const v of views.values()) {
    const se = events.find((e) => e.type === "step_ended" && e.step_id === v.step_id && e.seq > v.issued.seq);
    if (se)
      v.stepEnded = se;
    const ended = v.closed ? d(v.closed).ended_seq : null;
    const endedEvent = typeof ended === "number" ? events[ended - 1] : void 0;
    if (endedEvent)
      v.ended = endedEvent;
  }
  return [...views.values()];
}
var endedDone = (v) => v.stepEnded !== void 0 && d(v.stepEnded).status === "done";
var allowed = (checks, check2) => checks.find((c) => d(c).check === check2 && d(c).result === "allow");
function gatedTicket(v, armed) {
  if (!armed || !v.spawned)
    return null;
  const at = allowed(v.spawnChecks, "agent_type");
  const fg = allowed(v.spawnChecks, "foreground");
  if (!at || !fg)
    return null;
  if (!v.closed || d(v.closed).closed_by !== "subagent_ended" || !v.ended)
    return null;
  if (d(v.ended).matched_by === "none" || d(v.ended).ticket_id !== v.ticket_id)
    return null;
  const calls = [...v.served, ...v.accepted];
  if (calls.length === 0)
    return null;
  const fps = new Set(calls.map((c) => d(c).caller_fingerprint));
  if (calls.some((c) => d(c).caller !== "agent_id" && d(c).caller !== "foreground_only") || fps.size !== 1)
    return null;
  const spawned = v.spawned;
  const closed = v.closed;
  if (v.accepted.some((o) => o.seq < spawned.seq || o.seq > closed.seq))
    return null;
  if (!endedDone(v) || !v.stepEnded)
    return null;
  return [v.issued.seq, at.seq, fg.seq, spawned.seq, ...calls.map((c) => c.seq), v.ended.seq, closed.seq, v.stepEnded.seq];
}
function unattributed(v) {
  return [...v.served, ...v.accepted].some((c) => d(c).caller === "ticket_secret" || d(c).caller === "none");
}
function generateHeadline(events, facts) {
  const firstTicket = events.find((e) => e.type === "ticket_issued")?.seq ?? Infinity;
  const armedEv = events.find((e) => e.type === "hooks_armed" && e.seq < firstTicket);
  const unticketed = events.filter((e) => e.type === "subagent_spawned" && d(e).ticket_id === null);
  const integrityLost = events.some((e) => e.type === "hook_check" && d(e).tool === "integrity");
  const armed = armedEv !== void 0 && unticketed.length === 0 && !integrityLost;
  const hooks = armedEv ? d(armedEv).hooks : [];
  const beat = (id) => hooks.find((h) => h.hook_id === id && h.heartbeat_seq !== null)?.heartbeat_seq ?? null;
  const tickets = ticketViews(events);
  const makers = tickets.filter((t) => t.kind === "make");
  const checkers = tickets.filter((t) => t.kind === "check" || t.kind === "recheck");
  const items = [];
  {
    const all = [...makers, ...checkers];
    const proofs = all.map((v) => gatedTicket(v, armed));
    const distinct = new Set(all.map((v) => v.context_id)).size === all.length;
    if (makers.length && checkers.length && distinct && proofs.every((p) => p !== null) && armed) {
      items.push({ invariant: "C1", status: "enforced", mechanism: "hook_gated_subagent", evidence: uniq([armedEv.seq, ...proofs.flat()]) });
    } else if (makers.length && checkers.length && all.every((v) => v.spawned && endedDone(v)) && distinct) {
      items.push({ invariant: "C1", status: "checked_after", mechanism: "observed_subagent", evidence: uniq(all.map((v) => v.spawned?.seq ?? 0)) });
    } else {
      const starts = events.filter((e) => e.type === "step_started" && (d(e).kind === "make" || d(e).kind === "check"));
      items.push({ invariant: "C1", status: "instructed", mechanism: "separate_turn", evidence: uniq(starts.map((e) => e.seq)) });
    }
  }
  {
    const makerContexts = new Set(makers.map((m) => m.context_id));
    const shared = checkers.some((c) => makerContexts.has(c.context_id));
    const full = checkers.map((v) => {
      const base = gatedTicket(v, armed);
      const tp = allowed(v.spawnChecks, "ticket_prompt");
      const clean = v.spawned ? d(v.spawned).tools.every((t) => !NO_FILE_TOOLS.test(t)) : false;
      if (!base || !tp || !v.spawned || d(tp).subject_fingerprint !== d(v.spawned).prompt_fingerprint || !clean || v.served.length === 0)
        return null;
      return [...base, tp.seq];
    });
    if (checkers.length === 0) {
      items.push({ invariant: "C2", status: "instructed", mechanism: "model_prompted_subagent", evidence: [] });
    } else if (shared) {
      items.push({ invariant: "C2", status: "not_met", mechanism: "shared_conversation", evidence: uniq(checkers.map((c) => c.issued.seq)) });
    } else if (full.every((p) => p !== null) && armed) {
      items.push({ invariant: "C2", status: "enforced", mechanism: "ticketed_subagent", evidence: uniq([armedEv.seq, ...full.flat()]) });
    } else if (checkers.every((v) => v.spawned && endedDone(v) && allowed(v.spawnChecks, "ticket_prompt")) && checkers.some(unattributed)) {
      items.push({ invariant: "C2", status: "checked_after", mechanism: "ticketed_subagent_unattributed", evidence: uniq(checkers.map((c) => c.spawned?.seq ?? 0)) });
    } else {
      items.push({ invariant: "C2", status: "instructed", mechanism: "model_prompted_subagent", evidence: uniq(checkers.map((c) => c.spawned?.seq ?? c.issued.seq)) });
    }
  }
  {
    const gateExits = events.filter((e) => e.type === "gate_exit");
    const gated = checkers.map((v) => {
      const g = allowed(v.spawnChecks, "gates_before_check");
      if (!g || !armed)
        return null;
      const cites = d(g).cites ?? [];
      const cited = cites.map((s) => events[s - 1]).filter((e) => e?.type === "gate_exit");
      if (cited.length === 0 || cited.some((e) => d(e).runner !== "plugin_local" || !["pass", "warn"].includes(String(d(e).status))))
        return null;
      return [...cited.map((e) => e.seq), g.seq];
    });
    const startOf = (v) => events.find((e) => e.type === "step_started" && e.step_id === v.step_id)?.seq ?? Infinity;
    if (checkers.length && gated.every((p) => p !== null) && armed) {
      items.push({ invariant: "C3", status: "enforced", mechanism: "gate_gated_spawn", evidence: uniq([armedEv.seq, ...gated.flat()]) });
    } else if (checkers.length && checkers.every((v) => gateExits.some((g) => d(g).runner === "plugin_local" && g.seq < startOf(v)))) {
      items.push({ invariant: "C3", status: "checked_after", mechanism: "gate_order_observed", evidence: uniq(gateExits.map((g) => g.seq)) });
    } else {
      items.push({ invariant: "C3", status: "instructed", mechanism: "instruction_only", evidence: [] });
    }
  }
  {
    const signs = events.filter((e) => e.type === "input_rule_sign");
    if (!facts.declaredInputRule)
      items.push({ invariant: "C4", status: "na", mechanism: "not_declared", evidence: [] });
    else {
      const scans = events.filter((e) => e.type === "transcript_scan");
      const allClean = scans.length > 0 && scans.every((s) => d(s).result === "clean");
      if (armedEv && beat("BH-2") !== null && allClean && signs.length === 0) {
        items.push({ invariant: "C4", status: "checked_after", mechanism: "path_guard_and_scan", evidence: uniq([armedEv.seq, ...scans.map((s) => s.seq)]) });
      } else {
        items.push({ invariant: "C4", status: "instructed", mechanism: "instruction_only", evidence: [] });
      }
    }
  }
  {
    const packs = events.filter((e) => e.type === "pack_fingerprints" && d(e).source !== "model");
    const before = packs.find((e) => d(e).phase === "before");
    const after = packs.find((e) => d(e).phase === "after");
    const equal = before && after && JSON.stringify(d(before).packs) === JSON.stringify(d(after).packs);
    if (equal && armedEv && beat("BH-2") !== null) {
      items.push({ invariant: "C5", status: "checked_after", mechanism: "write_guard_and_pack_fingerprints", evidence: [armedEv.seq, before.seq, after.seq] });
    } else if (equal) {
      items.push({ invariant: "C5", status: "checked_after", mechanism: "pack_fingerprints", evidence: [before.seq, after.seq] });
    } else {
      items.push({ invariant: "C5", status: "instructed", mechanism: "instruction_only", evidence: [] });
    }
  }
  {
    const decisions = events.filter((e) => e.type === "decision_recorded");
    const seen = /* @__PURE__ */ new Set();
    const cited = decisions.map((e) => {
      const a = d(e).answer_seq;
      const ans = typeof a === "number" ? events[a - 1] : void 0;
      if (ans?.type !== "user_answer_observed" || d(ans).source !== "hook" || ans.seq >= e.seq || seen.has(ans.seq))
        return null;
      const step = d(e).blocking_step_id;
      const opened = typeof step === "string" ? events.filter((x) => x.type === "step_started" && x.step_id === step && x.seq < e.seq).at(-1) : void 0;
      if (opened && ans.seq < opened.seq)
        return null;
      seen.add(ans.seq);
      return [e.seq, ans.seq];
    });
    if (decisions.length && cited.every((c) => c !== null) && armed) {
      items.push({ invariant: "C6", status: "enforced", mechanism: "observed_answer_blocking", evidence: uniq([armedEv.seq, ...cited.flat()]) });
    } else if (decisions.length && cited.every((c) => c !== null)) {
      items.push({ invariant: "C6", status: "checked_after", mechanism: "observed_answer", evidence: uniq(cited.flat()) });
    } else if (decisions.length) {
      items.push({ invariant: "C6", status: "instructed", mechanism: "decision_events", evidence: uniq(decisions.map((e) => e.seq)) });
    } else {
      items.push({ invariant: "C6", status: "instructed", mechanism: "instruction_only", evidence: [] });
    }
  }
  {
    const h = events.filter((e) => e.type === "headline_generated" && d(e).generator === "fairlead_code" && (d(e).source === "mcp_server" || d(e).source === "code_execution"));
    const last = h.at(-1);
    items.push(last ? { invariant: "C7", status: "enforced", mechanism: "code_generated_headline", evidence: [last.seq] } : { invariant: "C7", status: "instructed", mechanism: "model_generated_headline", evidence: [] });
  }
  const c2 = items.find((i) => i.invariant === "C2");
  const floors = [
    { floor: "F-1", held: c2?.status !== "not_met", note: c2?.status === "not_met" ? "a check ran in the maker's context and is not called independent" : "maker and checker ran as separate steps in separate contexts" },
    { floor: "F-2", held: true, note: facts.declaredInputRule ? "no sign of a breached input rule" : "no input rule declared" },
    { floor: "F-3", held: true, note: "judgement items are listed as judgement, not tests" },
    { floor: "F-4", held: true, note: "every status is generated from the record's events" }
  ];
  return {
    host_profile: facts.hostProfile,
    items,
    floors,
    input_rule_alert: null,
    judgement_items: ["adjudication of checker findings", "the person's decisions"],
    line: lineOf(items)
  };
}
var LABEL = {
  C1: "Separation",
  C2: "Blind check",
  C3: "Gates first",
  C4: "Input rule",
  C5: "Tests read-only",
  C6: "Your decisions",
  C7: "Labelling"
};
var WORD = {
  enforced: "enforced",
  checked_after: "checked afterwards",
  instructed: "instructed",
  not_met: "not met",
  na: "n/a"
};
function lineOf(items) {
  return items.map((i) => `${LABEL[i.invariant]} ${WORD[i.status]}`).join(" \xB7 ");
}
function uniq(xs) {
  return [...new Set(xs.filter((x) => x > 0))].sort((a, b) => a - b);
}

// packages/record/dist/record.js
var InvalidRecord = class extends Error {
  name = "InvalidRecord";
};
function buildRecord(p) {
  const body = {
    schema: "fairlead.run_record/0.1",
    run_id: p.run_id,
    template: p.template,
    entitlement: p.entitlement,
    risk_tier: p.risk_tier,
    budget_setting: p.budget_setting,
    host: p.host,
    project: null,
    inputs: [],
    focus: p.focus,
    steps: p.steps,
    findings: p.findings,
    adjudications: p.adjudications,
    decisions: p.decisions,
    branches: [],
    refines: [],
    outputs: p.outputs,
    delivery: p.delivery,
    practice_headline: p.headline,
    usage: p.usage,
    events: p.events,
    harness_events: null
  };
  const record = { ...body, fingerprint: selfFingerprint(body) };
  const problems = validateContract("run_record", record);
  if (problems.length)
    throw new InvalidRecord(`the run record does not fit its contract: ${problems.slice(0, 6).join("; ")}`);
  return record;
}

// packages/mcp-server/dist/bundle.js
import { existsSync as existsSync2, readFileSync as readFileSync2 } from "node:fs";
import { join as join2 } from "node:path";
var BundleError = class extends Error {
  name = "BundleError";
};
var readJson = (p) => JSON.parse(readFileSync2(p, "utf8"));
var split = (ref) => {
  const at = ref.lastIndexOf("@");
  if (at <= 0)
    throw new BundleError(`bad reference ${ref}`);
  return [ref.slice(0, at), ref.slice(at + 1)];
};
function loadVerified(path, contract, ref, expected) {
  if (!existsSync2(path))
    throw new BundleError(`${ref}: ${path} is missing`);
  const doc = readJson(path);
  const problems = validateContract(contract, doc);
  if (problems.length)
    throw new BundleError(`${ref}: not a valid ${contract}: ${problems.slice(0, 2).join("; ")}`);
  const fp = selfFingerprint(doc);
  if (fp !== doc.fingerprint)
    throw new BundleError(`${ref}: its own fingerprint does not match`);
  if (expected !== null && fp !== expected)
    throw new BundleError(`${ref}: does not match the fingerprint the template pins`);
  return doc;
}
function loadBundle(dir, lockPath) {
  const doc = readJson(join2(dir, "bundle.json"));
  const problems = validateContract("braid_template", doc);
  if (problems.length)
    throw new BundleError(`bundle.json is not a valid braid_template: ${problems.slice(0, 2).join("; ")}`);
  if (selfFingerprint(doc) !== doc.fingerprint)
    throw new BundleError("bundle.json does not match its own fingerprint");
  const template = doc;
  const lock = readJson(lockPath);
  const threads = /* @__PURE__ */ new Map();
  const preambles = /* @__PURE__ */ new Map();
  for (const t of template.threads) {
    const [id, v] = split(t.thread_ref);
    const thread = loadVerified(join2(dir, "threads", id, v, "thread.json"), "thread", t.thread_ref, t.thread_fingerprint);
    threads.set(t.thread_ref, thread);
    for (const pre of thread.preambles) {
      if (preambles.has(pre))
        continue;
      const [pid, pv] = split(pre);
      const path = join2(dir, "preambles", pid, pv, "preamble.md");
      if (!existsSync2(path))
        throw new BundleError(`${pre}: preamble missing`);
      const bytes = readFileSync2(path);
      const pinned = lock.preambles?.[pre];
      if (!pinned || raw(bytes) !== pinned)
        throw new BundleError(`${pre}: preamble does not match braids.lock.json`);
      preambles.set(pre, bytes.toString("utf8"));
    }
  }
  const gateDirs = /* @__PURE__ */ new Map();
  for (const g of template.gates) {
    const [id, v] = split(g.gate_ref);
    const gdir = join2(dir, "gates", id, v);
    loadVerified(join2(gdir, "gate.json"), "gate", g.gate_ref, g.gate_fingerprint);
    gateDirs.set(g.gate_ref, gdir);
  }
  const types = /* @__PURE__ */ new Map();
  const typeRefs = new Set(template.outputs.map((o) => o.type_ref));
  for (const g of template.gates)
    for (const t of g.applies_to)
      typeRefs.add(t);
  for (const ref of typeRefs) {
    const [id, v] = split(ref);
    const path = join2(dir, "types", id, v, "type.json");
    if (existsSync2(path))
      types.set(ref, loadVerified(path, "type", ref, null));
  }
  return { dir, template, threads, gateDirs, types, preambles };
}
function assemblePrompt(bundle, threadRef, values) {
  const thread = bundle.threads.get(threadRef);
  if (!thread)
    throw new BundleError(`unknown thread ${threadRef}`);
  const all = { contract: thread.returns, caps: JSON.stringify(thread.caps), ...values };
  const parts = [...thread.preambles.map((p) => (bundle.preambles.get(p) ?? "").trim()), thread.prompt.trim()];
  const text2 = parts.filter((p) => p.length > 0).join("\n\n");
  return text2.replace(/\{\{\s*([A-Za-z_.]+)\s*\}\}/g, (_m, name) => all[name] ?? "null") + "\n";
}

// packages/mcp-server/dist/run.js
import { createHash as createHash2, randomBytes as randomBytes3 } from "node:crypto";
import { existsSync as existsSync4, mkdirSync as mkdirSync3, readFileSync as readFileSync4, readdirSync as readdirSync2, statSync, writeFileSync as writeFileSync3 } from "node:fs";
import { join as join4, relative as relative2 } from "node:path";

// packages/hooks/dist/spool.js
import { createHmac, randomBytes as randomBytes2, timingSafeEqual } from "node:crypto";
import { existsSync as existsSync3, linkSync, mkdirSync as mkdirSync2, readFileSync as readFileSync3, readdirSync, renameSync, rmSync, writeFileSync as writeFileSync2 } from "node:fs";
import { join as join3 } from "node:path";
var SESSION_ID = /^[A-Za-z0-9_-]{1,128}$/;
function sessionDir(dataDir, sessionId) {
  if (!SESSION_ID.test(sessionId))
    throw new Error(`refusing unsafe session id ${JSON.stringify(sessionId)}`);
  return join3(dataDir, "sessions", sessionId);
}
var tmpName = () => `.tmp-${String(process.pid)}-${randomBytes2(6).toString("hex")}`;
function writeAtomic(path, dir, data) {
  const tmp = join3(dir, tmpName());
  writeFileSync2(tmp, data);
  renameSync(tmp, path);
}
function readOrCreateKey(dataDir, sessionId) {
  const dir = sessionDir(dataDir, sessionId);
  const path = join3(dir, "key");
  if (existsSync3(path))
    return readFileSync3(path);
  mkdirSync2(dir, { recursive: true });
  const tmp = join3(dir, tmpName());
  writeFileSync2(tmp, randomBytes2(32));
  try {
    linkSync(tmp, path);
  } catch (err) {
    if (err.code !== "EEXIST")
      throw err;
  } finally {
    rmSync(tmp, { force: true });
  }
  return readFileSync3(path);
}
var mac = (key, json) => createHmac("sha256", key).update(json, "utf8").digest("hex");
function sign(key, value) {
  const json = JSON.stringify(value);
  return `${mac(key, json)}
${json}`;
}
function verify(key, text2) {
  const nl = text2.indexOf("\n");
  if (nl !== 64)
    return null;
  const given = Buffer.from(text2.slice(0, nl), "hex");
  const json = text2.slice(nl + 1);
  const want = Buffer.from(mac(key, json), "hex");
  return given.length === want.length && timingSafeEqual(given, want) ? json : null;
}
var NAME = /^(\d{15})\.json$/;
function readEntries(dataDir, sessionId, seen = /* @__PURE__ */ new Set(), keys) {
  const dir = join3(sessionDir(dataDir, sessionId), "spool");
  const keyPath = join3(sessionDir(dataDir, sessionId), "key");
  const out = { entries: [], rejected: [], gaps: [] };
  if (!existsSync3(dir) || !existsSync3(keyPath))
    return out;
  const current = readFileSync3(keyPath);
  const schedule = keys && keys.length > 0 ? [...keys].sort((a, b) => a.fromN - b.fromN) : [{ fromN: 1, key: current }];
  const keyFor = (n) => schedule.filter((k) => k.fromN <= n).at(-1)?.key ?? current;
  const present = /* @__PURE__ */ new Set();
  for (const name of readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
    const file = join3(dir, name);
    const m = NAME.exec(name);
    if (m)
      present.add(Number(m[1]));
    if (seen.has(file))
      continue;
    const text2 = readFileSync3(file, "utf8");
    const json = m ? verify(keyFor(Number(m[1])), text2) : null;
    const entry = json === null ? null : JSON.parse(json);
    if (!m || entry?.session_id !== sessionId || entry.n !== Number(m[1]))
      out.rejected.push(file);
    else
      out.entries.push({ file, entry, mac: text2.slice(0, 64) });
  }
  const max = Math.max(0, ...present);
  for (let i = 1; i <= max; i++)
    if (!present.has(i))
      out.gaps.push(i);
  out.entries.sort((a, b) => a.entry.n - b.entry.n);
  return out;
}
function verifyEntryFile(file, key) {
  if (!existsSync3(file))
    return null;
  const json = verify(key, readFileSync3(file, "utf8"));
  return json === null ? null : JSON.parse(json);
}
function rotateKey(dataDir, sessionId) {
  const dir = sessionDir(dataDir, sessionId);
  const key = randomBytes2(32);
  writeAtomic(join3(dir, "key"), dir, key);
  return key;
}
function writeState(dataDir, sessionId, state) {
  const key = readOrCreateKey(dataDir, sessionId);
  const dir = sessionDir(dataDir, sessionId);
  writeAtomic(join3(dir, "state.json"), dir, sign(key, state));
}

// packages/hooks/dist/hooks.js
var MCP = "mcp__plugin_heddle_heddle__";
var START = `${MCP}heddle_run_start`;
var CALLER_TOOLS = /* @__PURE__ */ new Set([`${MCP}heddle_inputs`, `${MCP}heddle_output`]);
var WIN = process.platform === "win32";
var BS = String.fromCharCode(92);

// packages/mcp-server/dist/run.js
var MCP_PREFIX = "mcp__plugin_heddle_heddle__";
var CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
function newId(prefix, now = Date.now()) {
  let bits = BigInt(now) << 80n | BigInt(`0x${randomBytes3(10).toString("hex")}`);
  let s = "";
  for (let i = 0; i < 26; i++) {
    s = (CROCKFORD[Number(bits & 31n)] ?? "0") + s;
    bits >>= 5n;
  }
  return `${prefix}_${s}`;
}
var fpText = (text2) => `raw:sha256:${createHash2("sha256").update(text2, "utf8").digest("hex")}`;
var short = (tool) => tool?.startsWith(MCP_PREFIX) ? tool.slice(MCP_PREFIX.length) : tool;
var Refusal = class extends Error {
  name = "Refusal";
};
var Run = class {
  opts;
  runId;
  folder;
  log;
  steps = /* @__PURE__ */ new Map();
  tickets = /* @__PURE__ */ new Map();
  ports = /* @__PURE__ */ new Map();
  decisions = [];
  startingPrompt;
  sessionId = null;
  armed = false;
  heartbeats = {};
  focus = null;
  delivered = false;
  abandoned = false;
  headlineLine = null;
  gateResultsByStep = /* @__PURE__ */ new Map();
  /** Signature of every spool entry seen, by number: a later change, re-creation or deletion shows. */
  ingestedMacs = /* @__PURE__ */ new Map();
  /** Which key verifies which entries; set when the key is rotated at arming. */
  keys = void 0;
  /** The spool number of this run's start call: entries before it belong to earlier activity. */
  startN = 0;
  /** Rotation: the old key, the number after which only the new key counts, and when it happened. */
  rotation = null;
  answersUsed = /* @__PURE__ */ new Set();
  /** The person's own words for each observed answer (seq), from the spool. */
  answerText = /* @__PURE__ */ new Map();
  /** Why the run can no longer be trusted, if it cannot; then only abandoning is allowed. */
  integrity = [];
  lastState = null;
  agentStarts = /* @__PURE__ */ new Map();
  contextCounter = 1;
  // ctx_1 is the main conversation
  startToolUseId = null;
  constructor(opts, startingPrompt) {
    this.opts = opts;
    const now = opts.now();
    this.runId = newId("run", now.getTime());
    this.folder = join4(opts.projectDir, "heddle-runs", this.runId);
    mkdirSync3(join4(this.folder, "outputs"), { recursive: true });
    this.log = new EventLog({ now: opts.now });
    this.startingPrompt = startingPrompt.slice(0, 4e3);
    for (const s of opts.bundle.template.steps) {
      this.steps.set(s.step_id, {
        step: s,
        status: "pending",
        round: 1,
        attempt: 1,
        context_id: null,
        isolation: "unknown",
        started_at: null,
        ended_at: null,
        output_refs: [],
        ticket_id: null
      });
    }
  }
  get template() {
    return this.opts.bundle.template;
  }
  ref(path) {
    return relative2(this.folder, path).replaceAll("\\", "/");
  }
  // ---------------------------------------------------------------- start and arming
  /** Write run_started and the opening pack fingerprints, and remember the start call. */
  start(toolUseId) {
    const t = this.template;
    this.startToolUseId = toolUseId;
    this.log.append("run_started", {
      source: "mcp_server",
      template_id: t.template_id,
      version: t.version,
      template_fingerprint: t.fingerprint,
      bundle_fingerprint: this.opts.bundleFingerprint,
      variant: "standard",
      host_profile: "claude_code",
      entitlement: this.opts.entitlement,
      client_version: this.opts.clientVersion
    });
    this.log.append("pack_fingerprints", { source: "mcp_server", phase: "before", packs: this.packs(), matches_pinned: true });
  }
  /** The bundle's files with their raw fingerprints (the read-only packs, C5). */
  packs() {
    const out = [];
    const walk = (dir) => {
      for (const name of readdirSync2(dir).sort()) {
        const p = join4(dir, name);
        if (statSync(p).isDirectory())
          walk(p);
        else
          out.push({ path: `bundle/${relative2(this.opts.bundle.dir, p).replaceAll("\\", "/")}`, fingerprint: raw(readFileSync4(p)) });
      }
    };
    walk(this.opts.bundle.dir);
    return out;
  }
  /**
   * Learn the session from the start call's spool entry, skip every entry from before it, and
   * ingest the rest. Returns false when the start call left no entry (hooks are off: P8f).
   */
  bindSession() {
    if (this.sessionId !== null)
      return true;
    const sessions = existsSync4(join4(this.opts.dataDir, "sessions")) ? readdirSync2(join4(this.opts.dataDir, "sessions")) : [];
    for (const sid of sessions) {
      let found;
      let entries;
      try {
        entries = readEntries(this.opts.dataDir, sid).entries;
        found = entries.find((e) => e.entry.tool_use_id === this.startToolUseId && e.entry.event === "PreToolUse");
      } catch {
        continue;
      }
      if (!found)
        continue;
      this.sessionId = sid;
      this.startN = found.entry.n;
      for (const e of readEntries(this.opts.dataDir, sid).entries) {
        if (e.entry.n < found.entry.n)
          this.ingestedMacs.set(e.entry.n, e.mac);
      }
      return true;
    }
    return false;
  }
  /** Replace the session key after arming; entries numbered after this verify only under the new key. */
  rotateKey() {
    if (this.sessionId === null)
      return;
    const dir = join4(this.opts.dataDir, "sessions", this.sessionId);
    const old = readFileSync4(join4(dir, "key"));
    const fresh = rotateKey(this.opts.dataDir, this.sessionId);
    const afterN = Math.max(0, ...readdirSync2(join4(dir, "spool")).map((f) => Number(/^(\d{15})\.json$/.exec(f)?.[1] ?? 0)));
    this.keys = [
      { fromN: 1, key: old },
      { fromN: afterN + 1, key: fresh }
    ];
    this.rotation = { old, afterN, at: Date.now() };
  }
  // ---------------------------------------------------------------- spool ingestion
  ingest() {
    if (this.sessionId === null)
      return;
    const read = readEntries(this.opts.dataDir, this.sessionId, /* @__PURE__ */ new Set(), this.keys);
    const entries = read.entries;
    const numberOf = (file) => Number(/(\d{15})\.json$/.exec(file)?.[1] ?? 0);
    const gaps = read.gaps.filter((n) => n >= this.startN);
    const rejected = read.rejected.filter((f) => numberOf(f) >= this.startN && !this.inFlightAtRotation(f));
    if (gaps.length)
      this.flag(`hook spool entries were deleted (${gaps.slice(0, 5).join(", ")})`);
    if (rejected.length)
      this.flag("a hook spool entry was altered, copied or does not verify");
    const highest = Math.max(0, ...entries.map((e) => e.entry.n));
    const ingestedMax = Math.max(0, ...this.ingestedMacs.keys());
    if (ingestedMax > highest)
      this.flag("the newest hook spool entries were deleted");
    for (const { entry, mac: mac2 } of entries) {
      const known = this.ingestedMacs.get(entry.n);
      if (known !== void 0) {
        if (known !== mac2)
          this.flag(`hook spool entry ${String(entry.n)} was replaced`);
        continue;
      }
      this.ingestedMacs.set(entry.n, mac2);
      if (this.log.frozen)
        continue;
      try {
        this.ingestOne(entry);
      } catch (err) {
        this.flag(`a hook entry could not be recorded (${err instanceof Error ? err.message.slice(0, 120) : "unknown"})`);
      }
    }
  }
  /**
   * An entry a hook signed with the old key just as the key was replaced (it read the key before the
   * rotation and claimed its number after). It is not used, and it is not an alarm.
   */
  inFlightAtRotation(file) {
    const r = this.rotation;
    if (!r)
      return false;
    const e = verifyEntryFile(file, r.old);
    return e !== null && e.n > r.afterN && e.at <= r.at + 2e3;
  }
  /** The verified spool entries of this session, under the run's key schedule. */
  spoolEntries() {
    if (this.sessionId === null)
      return [];
    return readEntries(this.opts.dataDir, this.sessionId, /* @__PURE__ */ new Set(), this.keys).entries.map((e) => e.entry);
  }
  ingestOne(e) {
    const tool = short(e.tool);
    const checkSeqs = {};
    let ticketForSpawn;
    if (e.event === "PreToolUse" && (e.tool === "Agent" || e.tool === "Task")) {
      const pf = typeof e.facts.prompt_fp === "string" ? e.facts.prompt_fp : null;
      ticketForSpawn = [...this.tickets.values()].find((t) => t.prompt_fp === pf && t.state === "issued");
    }
    for (const c of e.checks) {
      const cites = ticketForSpawn ? [ticketForSpawn.issued_seq] : [];
      if (ticketForSpawn && c.check === "gates_before_check")
        cites.push(...this.gateSeqsFor(ticketForSpawn.step_id));
      if (ticketForSpawn && c.check === "decision_before_step")
        cites.push(...this.decisionSeqs());
      const ev = this.log.append("hook_check", {
        source: "hook",
        hook_id: c.hook_id,
        check: c.check,
        tool: c.tool ?? tool,
        result: c.result,
        subject_fingerprint: c.subject_fp ?? null,
        cites
      });
      checkSeqs[`${c.hook_id}:${c.check}`] = ev.seq;
      if (c.check === "heartbeat" && e.tool_use_id === this.startToolUseId)
        this.heartbeats[c.hook_id] = ev.seq;
    }
    if (ticketForSpawn && e.decision === "allow") {
      const t = ticketForSpawn;
      t.state = "live";
      t.spawn_allowed_at = e.at;
      this.log.append("subagent_spawned", {
        source: "hook",
        context_id: t.context_id,
        thread_ref: t.thread_ref,
        agent_type: t.agent_type,
        agent_definition_fingerprint: this.agentDefinitionFingerprint(t.thread_ref),
        tools: this.agentTools(t.thread_ref),
        prompt_fingerprint: t.prompt_fp,
        ticket_id: t.ticket_id,
        observed_by: "hook"
      }, t.step_id);
    }
    if (!ticketForSpawn && e.decision === "allow" && e.event === "PreToolUse" && (e.tool === "Agent" || e.tool === "Task") && !this.delivered) {
      const agentType = typeof e.facts.subagent_type === "string" && e.facts.subagent_type ? e.facts.subagent_type : "unknown";
      this.log.append("subagent_spawned", {
        source: "hook",
        context_id: this.newContext(),
        thread_ref: "unticketed@0.0.0",
        agent_type: agentType,
        agent_definition_fingerprint: this.textFingerprint(agentType),
        tools: [],
        prompt_fingerprint: typeof e.facts.prompt_fp === "string" ? e.facts.prompt_fp : this.textFingerprint(""),
        ticket_id: null,
        observed_by: "hook"
      }, this.runningStepId() ?? this.lastStartedStepId() ?? this.template.steps[0]?.step_id ?? "s0");
    }
    if (e.event === "SubagentStart" && e.agent_id) {
      this.agentStarts.set(e.agent_id, { at: e.at, agent_type: e.agent_type ?? "" });
    }
    if (e.event === "SubagentStop" && e.agent_id)
      this.subagentEnded(e);
    if (e.event === "PostToolUse" && e.tool === "AskUserQuestion" || e.event === "UserPromptSubmit") {
      if (typeof e.facts.answer_fp === "string") {
        const ev = this.log.append("user_answer_observed", {
          source: "hook",
          via: e.facts.via === "ask_user_question" ? "ask_user_question" : "user_prompt",
          question_ref: null,
          answer_fingerprint: e.facts.answer_fp
        });
        if (typeof e.facts.answer_text === "string")
          this.answerText.set(ev.seq, e.facts.answer_text);
      }
    }
  }
  subagentEnded(e) {
    let ticket = [...this.tickets.values()].find((t) => t.agent_id === e.agent_id && t.state === "live");
    let matched = ticket ? "agent_id" : "none";
    if (!ticket && typeof e.facts.ticket_token === "string") {
      ticket = this.tickets.get(e.facts.ticket_token);
      if (ticket?.state === "live")
        matched = "ticket_token";
      else
        ticket = void 0;
    }
    const ended = this.log.append("subagent_ended", {
      source: "hook",
      ticket_id: ticket?.ticket_id ?? null,
      context_id: ticket?.context_id ?? null,
      matched_by: matched,
      transcript_fingerprint: typeof e.facts.last_message_fp === "string" ? e.facts.last_message_fp : null
    }, ticket?.step_id);
    if (!ticket)
      return;
    ticket.state = "closed";
    ticket.closed_by = "subagent_ended";
    this.log.append("ticket_closed", { source: "mcp_server", ticket_id: ticket.ticket_id, context_id: ticket.context_id, closed_by: "subagent_ended", ended_seq: ended.seq }, ticket.step_id);
    this.endStep(ticket.step_id, this.stepComplete(ticket) ? "done" : "failed");
  }
  /** Close every ticket past its expiry: its outputs are voided and its step fails. */
  expireTickets() {
    const now = this.opts.now().getTime();
    for (const t of this.tickets.values()) {
      if (t.state === "closed" || now < t.expires_at)
        continue;
      t.state = "closed";
      t.closed_by = "expired";
      this.log.append("ticket_closed", { source: "mcp_server", ticket_id: t.ticket_id, context_id: t.context_id, closed_by: "expired", ended_seq: null }, t.step_id);
      for (const o of t.outputs) {
        const versions = this.ports.get(o.port) ?? [];
        this.ports.set(o.port, versions.filter((v) => v.ticket_id !== t.ticket_id));
      }
      this.endStep(t.step_id, "failed");
    }
  }
  // ---------------------------------------------------------------- helpers used by tools
  agentType(threadRef) {
    return `fairlead:${threadRef.slice(0, threadRef.lastIndexOf("@"))}`;
  }
  agentTools(threadRef) {
    const id = threadRef.slice(0, threadRef.lastIndexOf("@"));
    const file = this.opts.pluginRoot ? join4(this.opts.pluginRoot, "agents", `${id}.md`) : null;
    if (file && existsSync4(file)) {
      const line = /^tools:(.*)$/m.exec(readFileSync4(file, "utf8"));
      if (line?.[1] !== void 0)
        return line[1].split(",").map((s) => s.trim()).filter((s) => s.length > 0);
    }
    const thread = this.opts.bundle.threads.get(threadRef);
    const tools = [`${MCP_PREFIX}heddle_inputs`, `${MCP_PREFIX}heddle_output`];
    if (thread?.tools.includes("fetch"))
      tools.push("WebFetch");
    if (thread?.tools.includes("search"))
      tools.push("WebSearch");
    return tools;
  }
  agentDefinitionFingerprint(threadRef) {
    const id = threadRef.slice(0, threadRef.lastIndexOf("@"));
    const path = this.opts.pluginRoot ? join4(this.opts.pluginRoot, "agents", `${id}.md`) : null;
    if (path && existsSync4(path))
      return raw(readFileSync4(path));
    return jcs1({ thread_ref: threadRef, tools: this.agentTools(threadRef) });
  }
  newContext() {
    this.contextCounter += 1;
    return `ctx_${String(this.contextCounter)}`;
  }
  /** gate_exit seqs for the gate steps a step needs (C3 evidence). */
  gateSeqsFor(stepId) {
    const needs = this.steps.get(stepId)?.step.needs ?? [];
    return this.log.ofType("gate_exit").filter((e) => e.step_id !== void 0 && needs.includes(e.step_id)).map((e) => e.seq);
  }
  decisionSeqs() {
    return this.log.ofType("decision_recorded").map((e) => e.seq);
  }
  /** The newest of the person's answers after `afterSeq` that no decision has cited yet, or null. */
  findAnswer(afterSeq) {
    const answers = this.log.ofType("user_answer_observed").filter((e) => e.seq > afterSeq && !this.answersUsed.has(e.seq) && e.data.source === "hook");
    return answers.at(-1) ?? null;
  }
  /** Spend an answer on a decision; each answer backs one decision only. */
  useAnswer(seq) {
    this.answersUsed.add(seq);
  }
  /** Check every accepted output is still the bytes that were accepted. */
  verifyPorts() {
    for (const versions of this.ports.values()) {
      for (const v of versions) {
        const bytes = existsSync4(v.path) ? readFileSync4(v.path) : Buffer.alloc(0);
        if (raw(bytes) !== v.fingerprint)
          this.flag(`the accepted ${v.port} was changed on disk`);
      }
    }
  }
  flag(problem) {
    if (!this.integrity.includes(problem))
      this.integrity.push(problem);
  }
  lastStartedStepId() {
    return this.log.ofType("step_started").at(-1)?.step_id ?? null;
  }
  runningStepId() {
    return [...this.steps.values()].find((s) => s.status === "running")?.step.step_id ?? null;
  }
  startStep(stepId, contextId, isolation) {
    const s = this.steps.get(stepId);
    if (!s)
      throw new Refusal(`unknown step ${stepId}`);
    s.status = "running";
    s.context_id = contextId;
    s.isolation = isolation;
    s.started_at = this.opts.now().toISOString().replace(/\.\d{3}Z$/, "Z");
    this.log.append("step_started", { source: "mcp_server", kind: s.step.kind, round: s.round, attempt: s.attempt, context_id: contextId, isolation }, stepId);
    return s;
  }
  endStep(stepId, status) {
    const s = this.steps.get(stepId);
    if (!s)
      return;
    s.status = status;
    s.ended_at = this.opts.now().toISOString().replace(/\.\d{3}Z$/, "Z");
    const fps = s.output_refs.map((r) => raw(readFileSync4(join4(this.folder, r))));
    this.log.append("step_ended", { source: "mcp_server", status, output_fingerprints: fps }, stepId);
  }
  stepComplete(t) {
    const produces = this.steps.get(t.step_id)?.step.produces ?? [];
    return produces.every((p) => t.outputs.some((o) => o.port === p));
  }
  /** Where a step's port lives and what it must look like. */
  portSpec(port, step) {
    const out = this.template.outputs.find((o) => o.port === port);
    if (out)
      return { type_ref: out.type_ref, contract: this.opts.bundle.types.get(out.type_ref)?.contract ?? null };
    const thread = step.thread_ref ? this.opts.bundle.threads.get(step.thread_ref) : void 0;
    for (const [ref, t] of this.opts.bundle.types)
      if (t.type_id === port)
        return { type_ref: ref, contract: t.contract };
    if (thread && (port === thread.returns || port === `${thread.returns}s`))
      return { type_ref: `${thread.returns}@0.1.0`, contract: thread.returns };
    if (port === "focus")
      return { type_ref: "agreed_focus@0.1.0", contract: "agreed_focus" };
    for (const c of ["findings", "decisions", "revision_log"])
      if (port === c)
        return { type_ref: `${c}@0.1.0`, contract: c };
    return { type_ref: `${port}@0.1.0`, contract: null };
  }
  /** Validate and store one port value. */
  putPort(port, value, step, ticketId) {
    const spec = this.portSpec(port, step);
    let bytes;
    if (spec.contract === null) {
      if (typeof value !== "string")
        throw new Refusal(`port ${port} takes text`);
      bytes = value;
    } else {
      const problems = validateContract(spec.contract, value);
      if (problems.length)
        throw new Refusal(`port ${port} must be a valid ${spec.contract}: ${problems.slice(0, 4).join("; ")}`);
      bytes = JSON.stringify(value, null, 2) + "\n";
    }
    const versions = this.ports.get(port) ?? [];
    const dir = join4(this.folder, "outputs", step.step_id);
    mkdirSync3(dir, { recursive: true });
    const k = versions.filter((x) => x.step_id === step.step_id).length + 1;
    const path = join4(dir, `${port}${k > 1 ? `.${String(k)}` : ""}${spec.contract === null ? ".md" : ".json"}`);
    writeFileSync3(path, bytes);
    const v = { port, path, fingerprint: raw(Buffer.from(bytes, "utf8")), type_ref: spec.type_ref, contract: spec.contract, step_id: step.step_id, ticket_id: ticketId };
    versions.push(v);
    this.ports.set(port, versions);
    const s = this.steps.get(step.step_id);
    if (s && !s.output_refs.includes(this.ref(path)))
      s.output_refs.push(this.ref(path));
    return v;
  }
  /** The current value of a port (or `<port>_before`: the version before the current one). */
  getPort(name) {
    const before = name.endsWith("_before");
    const port = before ? name.slice(0, -"_before".length) : name;
    const versions = this.ports.get(port) ?? [];
    return (before ? versions.at(-2) : versions.at(-1)) ?? null;
  }
  /**
   * What a reader of a port gets. Steps producing a port in sequence form a chain (draft, then the
   * revised draft): the reader gets the latest version. Steps producing it in one parallel_group form
   * a set (two checkers' findings): the reader gets each member's latest version, in braid order.
   */
  readPortSet(name) {
    const latest = this.getPort(name);
    if (!latest || name.endsWith("_before"))
      return latest ? [latest] : [];
    const group = this.steps.get(latest.step_id)?.step.parallel_group;
    if (!group)
      return [latest];
    const versions = this.ports.get(name) ?? [];
    const set = [];
    for (const s of this.steps.values()) {
      if (s.step.parallel_group !== group)
        continue;
      const v = versions.filter((x) => x.step_id === s.step.step_id).at(-1);
      if (v)
        set.push(v);
    }
    return set;
  }
  /** A port's bytes, only if they are still the bytes that were accepted. */
  readPort(v) {
    const bytes = existsSync4(v.path) ? readFileSync4(v.path) : Buffer.alloc(0);
    if (raw(bytes) !== v.fingerprint) {
      this.flag(`the accepted ${v.port} was changed on disk`);
      throw new Refusal(`The accepted ${v.port} was changed after it was handed back, so it cannot be used.`);
    }
    return bytes.toString("utf8");
  }
  typedOutput(v) {
    return {
      port: v.port,
      type_ref: v.type_ref,
      contract: v.contract,
      path: this.ref(v.path),
      fingerprint: v.fingerprint,
      media_type: v.contract === null ? "text/markdown" : "application/json",
      datafile: false,
      handling: null,
      produced_by: { run_id: this.runId, step_id: v.step_id }
    };
  }
  // ---------------------------------------------------------------- state for the hooks
  publish() {
    if (this.sessionId === null)
      return;
    const ready = new Set(this.readySteps().map((s) => s.step.step_id));
    const state = {
      v: 1,
      run_id: this.runId,
      open: !this.delivered && !this.abandoned,
      delivered: this.delivered,
      abandoned: this.abandoned,
      run_folder: this.folder,
      protected: [this.opts.bundle.dir, ...this.opts.pluginRoot ? [this.opts.pluginRoot] : []],
      datafile: [],
      watched: [...this.ports.values()].flat().map((v) => ({ path: v.path, class: "output" })),
      tickets: [...this.tickets.values()].map((t) => {
        const step = this.steps.get(t.step_id);
        const kind = t.kind;
        const gatesOk = kind !== "check" && kind !== "recheck" ? true : this.gatesPassedFor(t.step_id);
        return {
          ticket_id: t.ticket_id,
          step_id: t.step_id,
          kind,
          agent_type: t.agent_type,
          prompt_fp: t.prompt_fp,
          state: t.state,
          gates_ok: gatesOk,
          decision_ok: step ? ready.has(t.step_id) || step.status === "running" : false
        };
      })
    };
    const path = join4(this.opts.dataDir, "sessions", this.sessionId, "state.json");
    if (this.lastState !== null && (!existsSync4(path) || readFileSync4(path, "utf8") !== this.lastState)) {
      this.flag("the run state the hooks read was removed or changed");
    }
    writeState(this.opts.dataDir, this.sessionId, state);
    this.lastState = readFileSync4(path, "utf8");
  }
  gatesPassedFor(stepId) {
    const needs = this.steps.get(stepId)?.step.needs ?? [];
    return needs.every((n) => {
      const s = this.steps.get(n);
      if (!s)
        return false;
      if (s.step.kind !== "gate" && s.step.kind !== "preflight")
        return true;
      return s.status === "done" || s.status === "waived";
    });
  }
  /** Steps whose needs are all met and that have not started. */
  readySteps() {
    const ok2 = (id) => {
      const s = this.steps.get(id);
      return s?.status === "done" || s?.status === "waived" || s?.status === "skipped";
    };
    return [...this.steps.values()].filter((s) => s.status === "pending" && s.step.needs.every(ok2));
  }
  recordGateResult(stepId, run) {
    if (run.result === null || run.event === null)
      return;
    this.gateResultsByStep.set(stepId, { result: run.result, fingerprint: run.event.result_fingerprint ?? "", gate_ref: run.event.gate_ref });
  }
  /** The results of the gate steps a step needs (what a checker reads as gate_results). */
  gateResults(stepId) {
    const needs = this.steps.get(stepId)?.step.needs ?? [];
    return needs.map((n) => this.gateResultsByStep.get(n)).filter((r) => r !== void 0);
  }
  /** The revision gate's change set, if one has run: the text a recheck is scoped to. */
  diff() {
    const entries = [...this.gateResultsByStep.values()].filter((r) => r.gate_ref.startsWith("revision_gate@"));
    const last = entries.at(-1);
    if (!last)
      return null;
    const ev = last.result.evidence ?? [];
    return { text: ev.map((e) => `${e.ref}: ${e.detail}`).join("\n"), fingerprint: last.fingerprint };
  }
  /** The snapshot sections of the run record, derived from the run's state (§6.2). */
  recordParts(headline) {
    const t = this.template;
    const started = [...this.steps.values()].filter((s) => s.started_at !== null);
    const steps = started.map((s) => ({
      step_id: s.step.step_id,
      kind: s.step.kind,
      ...s.step.thread_ref ? { thread_ref: s.step.thread_ref } : {},
      ...s.step.gate_ref ? { gate_ref: s.step.gate_ref } : {},
      round: s.round,
      attempt: s.attempt,
      context_id: s.context_id,
      isolation: s.isolation,
      started_at: s.started_at,
      ended_at: s.ended_at,
      status: s.status === "running" || s.status === "pending" ? "blocked" : s.status,
      output_refs: s.output_refs
    }));
    const findings = (this.ports.get("findings") ?? []).map((v) => ({ step_id: v.step_id, ref: this.ref(v.path) }));
    const adjudications = (this.ports.get("decisions") ?? []).map((v) => {
      const doc = JSON.parse(this.readPort(v));
      const count = (a) => (doc.decisions ?? []).filter((x) => x.action === a).length;
      return { step_id: v.step_id, ref: this.ref(v.path), adopted: count("adopted"), partly_adopted: count("partly_adopted"), declined: count("declined") };
    });
    const outputs = t.outputs.map((o) => this.getPort(o.port)).filter((v) => v !== null).map((v) => this.typedOutput(v));
    const delivered = this.log.ofType("delivered").at(-1);
    const toMs = (iso) => iso ? Date.parse(iso) : 0;
    return {
      run_id: this.runId,
      template: {
        template_id: t.template_id,
        version: t.version,
        template_fingerprint: t.fingerprint,
        bundle: "free",
        bundle_fingerprint: this.opts.bundleFingerprint,
        variant: "standard",
        report_version: null,
        report_fingerprint: null
      },
      entitlement: this.opts.entitlement,
      risk_tier: typeof t.risk_tier_default === "string" ? t.risk_tier_default : "T2",
      budget_setting: "normal",
      host: { profile: "claude_code", surface: "claude_code", client_version: this.opts.clientVersion },
      focus: {
        starting_prompt: this.startingPrompt,
        agreed_focus_ref: this.focus?.agreed_focus_ref ?? null,
        accepted_at: this.focus?.accepted_at ?? null,
        accepted_by: this.focus ? "user" : null
      },
      steps,
      findings,
      adjudications,
      decisions: this.decisions.map((x) => ({ ...x })),
      outputs,
      delivery: delivered ? { choice_ids: [...delivered.data.choice_ids ?? []], delivered_at: delivered.at, report_built: false } : null,
      headline,
      usage: started.filter((s) => s.ended_at !== null).map((s) => ({ step_id: s.step.step_id, duration_ms: Math.max(0, toMs(s.ended_at) - toMs(s.started_at)), grade: "measured" })),
      events: this.log.events
    };
  }
  writeJson(rel, value) {
    const path = join4(this.folder, rel);
    mkdirSync3(join4(path, ".."), { recursive: true });
    writeFileSync3(path, JSON.stringify(value, null, 2) + "\n");
    return path;
  }
  fingerprintOf(value) {
    return selfFingerprint(value);
  }
  textFingerprint(text2) {
    return fpText(text2);
  }
};

// packages/mcp-server/dist/render.js
import { mkdirSync as mkdirSync4, writeFileSync as writeFileSync4 } from "node:fs";
import { join as join5 } from "node:path";
var esc = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
function draftMarkdown(d2, title) {
  const out = [`# ${title}`, ""];
  for (const s of d2.sections) {
    out.push(`## ${s.heading}`, "");
    for (const p of s.paragraphs)
      out.push(p.text, "");
  }
  out.push("## References", "");
  for (const r of d2.references)
    out.push(`${r.ref_id}. ${r.citation}${r.doi ? ` https://doi.org/${r.doi}` : r.url ? ` ${r.url}` : ""}`);
  return out.join("\n") + "\n";
}
function draftHtml(d2, title) {
  const body = [`<h1>${esc(title)}</h1>`];
  for (const s of d2.sections) {
    body.push(`<h2>${esc(s.heading)}</h2>`);
    for (const p of s.paragraphs)
      body.push(`<p>${esc(p.text)}</p>`);
  }
  body.push("<h2>References</h2><ol>");
  for (const r of d2.references) {
    const link = r.doi ? `https://doi.org/${r.doi}` : r.url;
    body.push(`<li>${esc(r.citation)}${link ? ` <a href="${esc(link)}">${esc(link)}</a>` : ""}</li>`);
  }
  body.push("</ol>");
  return `<!doctype html>
<html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title>
<style>body{font-family:system-ui,sans-serif;max-width:46rem;margin:2rem auto;padding:0 1rem;line-height:1.55;color:#1e1e1e}h1,h2{line-height:1.2}</style></head><body>
${body.join("\n")}
</body></html>
`;
}
function csv(rows, columns) {
  const cell = (v) => {
    const s = v === null || v === void 0 ? "" : typeof v === "string" ? v : JSON.stringify(v);
    return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
  };
  return [columns.join(","), ...rows.map((r) => columns.map((c) => cell(r[c])).join(","))].join("\n") + "\n";
}
function checkChoices(run, choiceIds) {
  for (const id of choiceIds) {
    const choice = run.template.output_menu.find((m) => m.choice_id === id);
    if (!choice)
      throw new Refusal(`Unknown choice ${id}.`);
    if (choice.format === "docx")
      throw new Refusal("Word output is not available in this version yet. Choose the Markdown or web page version instead.");
    if (!["md", "html", "csv"].includes(choice.format))
      throw new Refusal(`Choice ${id} cannot be built in this version.`);
    for (const port of choice.from_outputs)
      if (!run.getPort(port))
        throw new Refusal(`There is no ${port} to deliver.`);
  }
}
function render(run, choiceIds) {
  const menu = run.template.output_menu;
  const dir = join5(run.folder, "results");
  mkdirSync4(dir, { recursive: true });
  const files = [];
  const json = (port) => {
    const v = run.getPort(port);
    if (!v)
      throw new Refusal(`There is no ${port} to deliver.`);
    return JSON.parse(run.readPort(v));
  };
  const title = "Literature scoping review";
  for (const id of choiceIds) {
    const choice = menu.find((m) => m.choice_id === id);
    if (!choice)
      continue;
    const port = choice.from_outputs[0] ?? "";
    let name;
    let text2;
    if (choice.format === "docx")
      throw new Refusal("Word output is not available in this version yet. Choose the Markdown or web page version instead.");
    if (port === "draft" && choice.format === "md")
      [name, text2] = ["review.md", draftMarkdown(json("draft"), title)];
    else if (port === "draft" && choice.format === "html")
      [name, text2] = ["review.html", draftHtml(json("draft"), title)];
    else if (port === "evidence" && choice.format === "csv") {
      const rows = json("evidence").rows;
      [name, text2] = ["evidence.csv", csv(rows, ["source_id", "read_level", "sub_questions", "approach", "data", "elicited", "key_findings", "evidence_strength"])];
    } else if (port === "sources" && choice.format === "csv") {
      const items = json("sources").items;
      [name, text2] = ["sources.csv", csv(items, ["source_id", "title", "authors", "year", "venue", "locator", "read_level", "sub_questions", "why_included", "found_via"])];
    } else if (port === "search_record" && choice.format === "md") {
      const v = run.getPort("search_record");
      if (!v)
        throw new Refusal("There is no search record to deliver.");
      [name, text2] = ["search_record.md", run.readPort(v)];
    } else {
      throw new Refusal(`Choice ${id} cannot be built in this version.`);
    }
    const path = join5(dir, name);
    writeFileSync4(path, text2);
    files.push(path);
  }
  return files;
}

// packages/mcp-server/dist/server.js
var str = { type: "string" };
var obj = (props, required = []) => ({
  type: "object",
  properties: props,
  required,
  additionalProperties: false
});
var TOOLS = [
  { name: "heddle_run_start", description: "Start a Fairlead braid run. Pass a fresh random nonce and the person's starting request verbatim.", inputSchema: obj({ nonce: str, prompt: str }, ["nonce", "prompt"]) },
  { name: "heddle_arm", description: "Call straight after heddle_run_start: confirms the plugin's hooks are live for this run.", inputSchema: obj({}) },
  { name: "heddle_next", description: "What to do next in the open run: the ready steps and exactly how to run each.", inputSchema: obj({}) },
  { name: "heddle_ticket", description: "Issue the ticket for a ready step that runs as a subagent. Then start that subagent with the Agent tool, in the foreground, with the ticket text as its whole prompt.", inputSchema: obj({ step_id: str }, ["step_id"]) },
  { name: "heddle_inputs", description: "For a step's subagent only: fetch your task and inputs with your ticket id. Long inputs come in parts: call again with part 2, 3 ... as the reply says.", inputSchema: obj({ ticket: str, part: { type: "integer", minimum: 1 } }, ["ticket"]) },
  { name: "heddle_output", description: "For a step's subagent only: hand back one output port under your ticket. content is the JSON value (or text for text ports).", inputSchema: obj({ ticket: str, port: str, content: {} }, ["ticket", "port", "content"]) },
  { name: "heddle_gate", description: "Run a ready gate step on the user's machine.", inputSchema: obj({ step_id: str }, ["step_id"]) },
  { name: "heddle_step", description: "Start a step that runs in this conversation (refine or decide) before asking the person. A decide step's material can come in parts: call again with the same step_id and part 2, 3 ... as the reply says.", inputSchema: obj({ step_id: str, part: { type: "integer", minimum: 1 } }, ["step_id"]) },
  { name: "heddle_decision", description: "Record the person's decision after they answered (AskUserQuestion or their reply). kind: focus_accept (with focus, the agreed_focus JSON), escalation, waiver, output_choice or abandon. A waiver names the failed step (step_id), or several failed steps (step_ids) when the person waived them all with one answer. text: their decision in a sentence.", inputSchema: obj({ kind: str, step_id: str, step_ids: { type: "array", items: str }, text: str, focus: {} }, ["kind", "text"]) },
  { name: "heddle_deliver", description: "Finish the run: builds the chosen results, generates the practice headline and freezes the run record. choice_ids from the braid's output menu.", inputSchema: obj({ choice_ids: { type: "array", items: str } }, ["choice_ids"]) }
];
var text = (v) => typeof v === "string" ? v : "";
var ok = (msg) => ({ text: msg });
var refused = (msg) => ({ text: msg, isError: true });
var FairleadServer = class {
  opts;
  bundle;
  run = null;
  now;
  gate;
  seenNonces = /* @__PURE__ */ new Set();
  /** A main-conversation step's reply, in parts, by run and step. */
  stepParts = /* @__PURE__ */ new Map();
  constructor(opts) {
    this.opts = opts;
    this.bundle = loadBundle(opts.bundleDir, opts.lockPath);
    this.now = opts.now ?? (() => /* @__PURE__ */ new Date());
    this.gate = opts.gate ?? runGate;
  }
  tools() {
    return TOOLS;
  }
  get currentRun() {
    return this.run;
  }
  async call(name, args, meta = {}) {
    try {
      if (name === "heddle_run_start")
        return this.start(args, meta);
      const run = this.run;
      if (!run)
        return refused("No Fairlead run is open. Start one with heddle_run_start.");
      run.ingest();
      run.expireTickets();
      run.verifyPorts();
      if (run.integrity.length > 0 && name !== "heddle_next" && !(name === "heddle_decision" && text(args.kind) === "abandon")) {
        run.publish();
        return refused(integrityMessage(run));
      }
      if (MAIN_ONLY.has(name) && run.armed) {
        const entry = this.entryFor(run, name, meta);
        if (!entry || entry.agent_id) {
          run.publish();
          return refused("This tool belongs to the main conversation, not a step's subagent.");
        }
      }
      let result;
      switch (name) {
        case "heddle_arm":
          result = this.arm(run);
          break;
        case "heddle_next":
          result = this.next(run);
          break;
        case "heddle_ticket":
          result = this.ticket(run, text(args.step_id));
          break;
        case "heddle_inputs":
          result = this.inputs(run, text(args.ticket), meta, typeof args.part === "number" ? args.part : 1);
          break;
        case "heddle_output":
          result = this.output(run, text(args.ticket), text(args.port), args.content, meta);
          break;
        case "heddle_gate":
          result = await this.runGateStep(run, text(args.step_id));
          break;
        case "heddle_step":
          result = this.mainStep(run, text(args.step_id), typeof args.part === "number" ? args.part : 1);
          break;
        case "heddle_decision":
          result = this.decision(run, args);
          break;
        case "heddle_deliver":
          result = this.deliver(run, Array.isArray(args.choice_ids) ? args.choice_ids.map(String) : []);
          break;
        default:
          result = refused(`Unknown tool ${name}.`);
      }
      run.publish();
      return result;
    } catch (err) {
      this.run?.publish();
      if (err instanceof Refusal)
        return refused(err.message);
      if (err instanceof RecordFrozen)
        return refused("This run's record is frozen; nothing more can be added. Start a new run if needed.");
      throw err;
    }
  }
  // ---------------------------------------------------------------- start, arm, next
  start(args, meta) {
    const nonce = text(args.nonce);
    if (!nonce)
      throw new Refusal("heddle_run_start needs a fresh random nonce.");
    if (this.seenNonces.has(nonce))
      throw new Refusal("That nonce was already used; pass a fresh one.");
    if (this.run && !this.run.delivered && !this.run.abandoned)
      throw new Refusal(`Run ${this.run.runId} is still open. Deliver or abandon it first.`);
    this.seenNonces.add(nonce);
    const run = new Run({
      dataDir: this.opts.dataDir,
      projectDir: this.opts.projectDir,
      bundle: this.bundle,
      bundleFingerprint: this.bundle.template.fingerprint,
      pluginRoot: this.opts.pluginRoot,
      clientVersion: this.opts.clientVersion,
      entitlement: "free",
      now: this.now,
      gate: this.gate
    }, text(args.prompt));
    this.run = run;
    run.start(meta.toolUseId ?? null);
    run.bindSession();
    run.ingest();
    run.publish();
    return ok(`Run ${run.runId} started for "${this.bundle.template.template_id}" ${this.bundle.template.version}. Its folder is heddle-runs/${run.runId}/. Now call heddle_arm.`);
  }
  arm(run) {
    if (run.armed)
      return ok("Hooks are already armed for this run. Call heddle_next.");
    const bound = run.bindSession();
    run.ingest();
    const need = ["BH-1", "BH-2", "BH-3"];
    const missing = need.filter((h) => run.heartbeats[h] === void 0);
    if (!bound || missing.length > 0) {
      return ok("The plugin's hooks did not answer for this run (they may be turned off). The run continues, but its practice headline will show weaker statuses for separation, blind checks and gates. Call heddle_next.");
    }
    const hookScript = this.opts.pluginRoot ? join6(this.opts.pluginRoot, "hooks", "heddle_hook.mjs") : null;
    const hooksJson = this.opts.pluginRoot ? join6(this.opts.pluginRoot, "hooks", "hooks.json") : null;
    const fileFp = (p) => p ? run.textFingerprint(safeRead(p)) : jcs1({ hook: "unpackaged" });
    const script = fileFp(hookScript);
    run.log.append("hooks_armed", {
      source: "mcp_server",
      hooks: [
        { hook_id: "BH-1", event: "PreToolUse", matcher: "Agent|Task|SendMessage|Workflow|heddle_run_start", script_fingerprint: script, heartbeat_seq: run.heartbeats["BH-1"] ?? null },
        { hook_id: "BH-2", event: "PreToolUse", matcher: "Read|Write|Edit|MultiEdit|NotebookEdit|Grep|Glob|Bash|PowerShell|fairlead_*", script_fingerprint: script, heartbeat_seq: run.heartbeats["BH-2"] ?? null },
        { hook_id: "BH-3", event: "PostToolUse", matcher: ".*", script_fingerprint: script, heartbeat_seq: run.heartbeats["BH-3"] ?? null },
        { hook_id: "BH-3", event: "UserPromptSubmit", matcher: "", script_fingerprint: script, heartbeat_seq: null },
        { hook_id: "BH-4", event: "SubagentStop", matcher: "", script_fingerprint: script, heartbeat_seq: null },
        { hook_id: "BH-5", event: "Stop", matcher: "", script_fingerprint: script, heartbeat_seq: null }
      ],
      config_fingerprint: hooksJson ? run.textFingerprint(safeRead(hooksJson)) : jcs1({ hooks: "unpackaged" }),
      guarded_paths: { protected: ["bundle/"], datafile: [] }
    });
    run.armed = true;
    run.rotateKey();
    return ok("Hooks are armed for this run. Call heddle_next.");
  }
  next(run) {
    if (run.delivered)
      return ok("This run is delivered and its record is frozen.");
    if (run.integrity.length > 0)
      return ok(integrityMessage(run));
    const ready = run.readySteps();
    const running = [...run.steps.values()].filter((s) => s.status === "running");
    const lines2 = [];
    for (const s of running)
      lines2.push(`Step ${s.step.step_id} (${s.step.kind}) is running.`);
    for (const s of ready)
      lines2.push(howTo(run, s.step.step_id));
    const failed = [...run.steps.values()].filter((s) => s.status === "failed");
    const [only] = failed;
    if (failed.length === 1 && only) {
      const s = only;
      lines2.push(`Step ${s.step.step_id} (${s.step.kind}) failed. Tell the person plainly, ask with these options in this order, none marked as recommended: "Waive it and continue", "Stop the run". Then call heddle_decision with kind waiver (step_id ${s.step.step_id}) or abandon.`);
    } else if (failed.length > 1) {
      const ids = failed.map((s) => s.step.step_id);
      lines2.push(`Steps ${ids.join(", ")} failed. Tell the person plainly what failed, ask in one question with these options in this order, none marked as recommended: "Waive them all and continue", "Stop the run". Then call heddle_decision once with kind waiver and step_ids ${JSON.stringify(ids)}, or abandon. One answer covers one decision.`);
    }
    if (lines2.length === 0)
      lines2.push("Nothing is ready. If a subagent is running, wait for it to finish, then call heddle_next again.");
    return ok(lines2.join("\n"));
  }
  // ---------------------------------------------------------------- tickets, inputs, outputs
  ticket(run, stepId) {
    const s = run.steps.get(stepId);
    if (!s)
      throw new Refusal(`Unknown step ${stepId}.`);
    if (!s.step.thread_ref)
      throw new Refusal(`Step ${stepId} does not run as a subagent.`);
    if (s.status !== "pending" || !run.readySteps().includes(s))
      throw new Refusal(`Step ${stepId} is not ready (call heddle_next).`);
    const kind = s.step.kind;
    const ticketId = newId("tkt", this.now().getTime());
    const contextId = run.newContext();
    const agentType = run.agentType(s.step.thread_ref);
    const timeout = run.template.stop.ticket_timeout[kind] ?? 1800;
    const expires = this.now().getTime() + timeout * 1e3;
    const text2 = `TICKET: ${ticketId}
You are running step ${stepId} of a Fairlead braid. Call heddle_inputs with ticket ${ticketId} first.`;
    run.startStep(stepId, contextId, "separate_context");
    const issued = run.log.append("ticket_issued", {
      source: "mcp_server",
      ticket_id: ticketId,
      context_id: contextId,
      kind,
      thread_ref: s.step.thread_ref,
      agent_type: agentType,
      timeout_s: timeout,
      expires_at: new Date(expires).toISOString().replace(/\.\d{3}Z$/, "Z")
    }, stepId);
    run.tickets.set(ticketId, {
      ticket_id: ticketId,
      step_id: stepId,
      kind,
      thread_ref: s.step.thread_ref,
      agent_type: agentType,
      text: text2,
      prompt_fp: run.textFingerprint(text2),
      context_id: contextId,
      issued_seq: issued.seq,
      expires_at: expires,
      state: "issued",
      spawn_allowed_at: null,
      agent_id: null,
      outputs: [],
      closed_by: null
    });
    s.ticket_id = ticketId;
    return ok(`Ticket issued for step ${stepId}. Now use the Agent tool, in the foreground (do not set run_in_background), with subagent_type "${agentType}" and this exact text as the whole prompt, nothing added:

${text2}`);
  }
  /** The PreToolUse spool entry for this very call (its tool_use_id), if the hooks wrote one. */
  entryFor(run, tool, meta) {
    if (!meta.toolUseId || run.sessionId === null)
      return void 0;
    return run.spoolEntries().find((e) => e.tool_use_id === meta.toolUseId && e.event === "PreToolUse" && e.tool === `${MCP_PREFIX}${tool}`);
  }
  /** The caller of heddle_inputs or heddle_output: the subagent holding the live ticket. */
  caller(run, ticketId, tool, meta) {
    const ticket = run.tickets.get(ticketId);
    if (!ticket)
      throw new Refusal("Unknown ticket.");
    if (!run.armed) {
      if (ticket.state === "closed")
        throw new Refusal("That ticket is closed.");
      ticket.state = "live";
      return { ticket, agentId: null };
    }
    if (ticket.state !== "live")
      throw new Refusal(ticket.state === "closed" ? "That ticket is closed." : "That ticket's subagent has not started.");
    const entry = this.entryFor(run, tool, meta);
    if (!entry)
      throw new Refusal("The caller of this tool cannot be identified, so it is refused.");
    if (!entry.agent_id)
      throw new Refusal("This tool is for the step's subagent, not the main conversation.");
    if (entry.agent_type !== ticket.agent_type)
      throw new Refusal("This ticket belongs to a different agent.");
    if (ticket.agent_id === null)
      ticket.agent_id = entry.agent_id;
    else if (ticket.agent_id !== entry.agent_id)
      throw new Refusal("This ticket belongs to another subagent.");
    return { ticket, agentId: entry.agent_id };
  }
  /**
   * A subagent's task and inputs, in parts. Claude Code saves a tool result over its size limit to a
   * file, which a checker (no file tools) cannot open; so the full text is built once per ticket,
   * recorded once (inputs_served), and handed over in parts well under the limit.
   */
  inputs(run, ticketId, meta, part) {
    const { ticket, agentId } = this.caller(run, ticketId, "heddle_inputs", meta);
    ticket.inputParts ??= splitParts(this.buildInputs(run, ticket, agentId));
    const parts = ticket.inputParts;
    const k = Number.isInteger(part) && part >= 1 ? part : 1;
    if (k > parts.length)
      throw new Refusal(`There are ${String(parts.length)} parts.`);
    const head = parts.length === 1 ? "" : `[Part ${String(k)} of ${String(parts.length)}.${k < parts.length ? ` Call heddle_inputs again with ticket ${ticket.ticket_id} and part ${String(k + 1)} before you start.` : " This is the last part."}]

`;
    return ok(head + (parts[k - 1] ?? ""));
  }
  buildInputs(run, ticket, agentId) {
    const s = run.steps.get(ticket.step_id);
    if (!s)
      throw new Refusal("Unknown step.");
    const values = { scope: s.step.scope ?? "full", diff: "(none)" };
    const served = [];
    for (const read of s.step.reads ?? []) {
      if (read === "gate_results") {
        const results = run.gateResults(s.step.step_id);
        values.gate_results = JSON.stringify(results.map((r) => r.result));
        served.push(...results.map((r) => r.fingerprint));
        continue;
      }
      if (read === "diff") {
        const d2 = run.diff();
        values.diff = d2 ? d2.text : "(none)";
        if (d2)
          served.push(d2.fingerprint);
        continue;
      }
      const text2 = portText(run, read);
      if (text2 === null)
        continue;
      if (read === "focus")
        values.focus = text2.text;
      values[`inputs.${read}`] = text2.text;
      values[read] = values[read] ?? text2.text;
      served.push(...text2.fingerprints);
    }
    const prompt = assemblePrompt(this.bundle, ticket.thread_ref, values);
    run.log.append("inputs_served", {
      source: "mcp_server",
      ticket_id: ticket.ticket_id,
      context_id: ticket.context_id,
      caller: agentId === null ? "none" : "agent_id",
      caller_fingerprint: agentId === null ? null : run.textFingerprint(agentId),
      input_fingerprints: served
    }, ticket.step_id);
    const produces = s.step.produces ?? [];
    const shapes = produces.map((p) => {
      const c = run.portSpec(p, s.step).contract;
      return c && isContractName(c) ? `JSON Schema for ${p} (contract ${c}):
${JSON.stringify(schemaOf(c))}` : `${p}: plain text (Markdown).`;
    }).join("\n\n");
    return `${prompt}
---
When you have finished, hand back each of these outputs with heddle_output (ticket ${ticket.ticket_id}): ${produces.map((p) => `${p} (${run.portSpec(p, s.step).contract ?? "text"})`).join(", ")}. Then reply "done".

${shapes}`;
  }
  output(run, ticketId, port, content, meta) {
    const { ticket, agentId } = this.caller(run, ticketId, "heddle_output", meta);
    const s = run.steps.get(ticket.step_id);
    if (!s)
      throw new Refusal("Unknown step.");
    if (!(s.step.produces ?? []).includes(port))
      throw new Refusal(`Step ${s.step.step_id} does not produce ${port}. It produces: ${(s.step.produces ?? []).join(", ")}.`);
    let value = content;
    if (typeof content === "string" && run.portSpec(port, s.step).contract !== null) {
      try {
        value = JSON.parse(content);
      } catch {
        throw new Refusal(`Port ${port} takes JSON.`);
      }
    }
    const v = run.putPort(port, value, s.step, ticket.ticket_id);
    const ev = run.log.append("output_accepted", {
      source: "mcp_server",
      ticket_id: ticket.ticket_id,
      context_id: ticket.context_id,
      caller: agentId === null ? "none" : "agent_id",
      caller_fingerprint: agentId === null ? null : run.textFingerprint(agentId),
      port,
      fingerprint: v.fingerprint
    }, ticket.step_id);
    ticket.outputs.push({ port, fingerprint: v.fingerprint, seq: ev.seq, path: v.path });
    if (!run.armed && run.stepComplete(ticket))
      run.endStep(ticket.step_id, "done");
    return ok(`Accepted ${port}.`);
  }
  // ---------------------------------------------------------------- gates and main-conversation steps
  async runGateStep(run, stepId) {
    const s = run.steps.get(stepId);
    if (!s?.step.gate_ref)
      throw new Refusal(`Step ${stepId} is not a gate step.`);
    if (s.status !== "pending" || !run.readySteps().includes(s))
      throw new Refusal(`Step ${stepId} is not ready (call heddle_next).`);
    const gateDir = this.bundle.gateDirs.get(s.step.gate_ref);
    if (!gateDir)
      throw new Refusal(`Gate ${s.step.gate_ref} is not in this braid.`);
    run.startStep(stepId, null, "unknown");
    const reads = (s.step.reads ?? []).map((r) => run.getPort(r)).filter((v) => v !== null);
    const [target, ...extra] = reads.map((v) => run.typedOutput(v));
    const input = {
      protocol: "gate_io/0.1",
      run_id: run.runId,
      step_id: stepId,
      gate_ref: s.step.gate_ref,
      target: target ?? null,
      extra_inputs: extra,
      config: null
    };
    const result = await this.gate({ runDir: run.folder, gateDir, input });
    if (result.event)
      run.log.append("gate_exit", result.event, stepId);
    if (result.resultPath) {
      const rel = run.ref(result.resultPath);
      s.output_refs.push(rel);
      run.recordGateResult(stepId, result);
    }
    const passed = result.status === "pass" || result.status === "warn" || result.status === "skipped";
    run.endStep(stepId, passed ? "done" : "failed");
    s.gate_status = result.status;
    return passed ? ok(`Gate ${s.step.gate_ref} ${result.status}. Call heddle_next.`) : ok(`Gate ${s.step.gate_ref} ${result.status}${result.problem ? `: ${result.problem}` : ""}. Call heddle_next.`);
  }
  mainStep(run, stepId, part) {
    const s = run.steps.get(stepId);
    if (!s)
      throw new Refusal(`Unknown step ${stepId}.`);
    if (!["refine", "decide"].includes(s.step.kind))
      throw new Refusal(`Step ${stepId} is a ${s.step.kind} step; use the tool heddle_next names.`);
    const key = `${run.runId}/${stepId}`;
    if (part !== 1) {
      const parts2 = this.stepParts.get(key);
      if (!parts2 || s.status !== "running")
        throw new Refusal(`Call heddle_step with step_id ${stepId} (no part) first.`);
      return ok(partOf(parts2, part, (k) => `Call heddle_step again with step_id ${stepId} and part ${String(k)} before you ask the person.`));
    }
    if (s.status !== "pending" || !run.readySteps().includes(s))
      throw new Refusal(`Step ${stepId} is not ready.`);
    run.startStep(stepId, "ctx_1", "shared_context");
    const material = [];
    for (const read of s.step.reads ?? []) {
      if (read === "gate_results") {
        material.push(`### gate_results
${JSON.stringify(run.gateResults(stepId).map((r) => r.result))}`);
        continue;
      }
      const t = portText(run, read);
      if (t)
        material.push(`### ${read}
${t.text}`);
    }
    const instruction = s.step.kind === "refine" ? "Refine the topic with the person: propose an agreed focus (research question, scope, inclusion rules), ask them with AskUserQuestion whether to accept it, then call heddle_decision with kind focus_accept, step_id " + stepId + ", text summarising their answer, and focus set to the agreed_focus JSON." : `Show the person what needs their decision for step ${stepId} (in plain words), then ask them with AskUserQuestion, using exactly these options in this order: "Accept the adjudicator's decisions as they stand", "Change some decisions", "Stop the run". Use the same wording and order every time, and never mark an option as recommended: the adjudicator's recommendation is information in your summary, not a choice made for them. Then call heddle_decision with kind escalation, step_id ${stepId} and text summarising what they decided.`;
    const body = material.length === 0 ? instruction : `${instruction}

What the person is deciding on, from this run's records. Summarise it for them in plain words; do not paste the raw data. Show each finding as one block: what it says, its evidence passage (the quoted source text), the gate result for that claim if a gate checked it, and what the adjudicator recommended, with its reasons. Put blocking findings first, then warnings; collapse repeats of the same issue into one block that says how many times it occurs.

${material.join(BLANK_LINE)}`;
    const parts = splitParts(body);
    this.stepParts.set(key, parts);
    return ok(partOf(parts, 1, (k) => `Call heddle_step again with step_id ${stepId} and part ${String(k)} before you ask the person.`));
  }
  decision(run, args) {
    const kind = text(args.kind);
    const kinds = ["focus_accept", "focus_change", "escalation", "branch_outcome", "output_choice", "waiver", "input_rule_loosen", "abandon"];
    if (!kinds.includes(kind))
      throw new Refusal(`kind must be one of: ${kinds.join(", ")}.`);
    const stepId = typeof args.step_id === "string" && args.step_id ? args.step_id : null;
    const waived = kind === "waiver" && Array.isArray(args.step_ids) ? args.step_ids.filter((x) => typeof x === "string") : stepId ? [stepId] : [];
    if (kind === "waiver") {
      if (waived.length === 0)
        throw new Refusal("A waiver names the failed step (step_id) or steps (step_ids).");
      for (const id of waived)
        if (run.steps.get(id)?.status !== "failed")
          throw new Refusal(`Step ${id} has not failed, so there is nothing to waive.`);
    }
    const s = stepId ? run.steps.get(stepId) : void 0;
    if (stepId && !s)
      throw new Refusal(`Unknown step ${stepId}.`);
    if (s && (s.step.kind === "refine" || s.step.kind === "decide") && s.status !== "running") {
      throw new Refusal(`Start step ${s.step.step_id} with heddle_step first, then ask the person.`);
    }
    if (kind === "focus_accept") {
      if (!s || s.step.kind !== "refine")
        throw new Refusal("focus_accept belongs to the refine step.");
      const problems = validateContract("agreed_focus", args.focus);
      if (problems.length)
        throw new Refusal(`focus must be a valid agreed_focus: ${problems.slice(0, 4).join("; ")}`);
    }
    const startedSeq = s && (s.step.kind === "refine" || s.step.kind === "decide") ? run.log.ofType("step_started").filter((e) => e.step_id === s.step.step_id).at(-1)?.seq ?? 0 : run.log.ofType("decision_recorded").at(-1)?.seq ?? 0;
    const answer = run.findAnswer(startedSeq);
    if (!answer)
      throw new Refusal("No answer from the person is on record for this decision. Ask them first (AskUserQuestion), then call heddle_decision.");
    run.useAnswer(answer.seq);
    const decisionId = newId("dec", this.now().getTime());
    const textPath = run.writeJson(`decisions/${decisionId}.json`, {
      person_said: run.answerText.get(answer.seq) ?? null,
      summary: text(args.text)
    });
    if (kind === "abandon") {
      for (let i = 0; i < run.integrity.length; i++) {
        run.log.append("hook_check", { source: "mcp_server", hook_id: "BH-2", check: "protected_path", tool: "integrity", result: "deny", subject_fingerprint: null, cites: [] });
      }
    }
    run.log.append("decision_recorded", {
      source: "mcp_server",
      decision_id: decisionId,
      kind,
      by_role: "user",
      blocking_step_id: kind === "waiver" && waived.length > 1 ? null : stepId,
      answer_seq: answer.seq
    });
    run.decisions.push({ decision_id: decisionId, at: answer.at, by_role: "user", kind, text_ref: run.ref(textPath) });
    if (kind === "abandon") {
      run.abandoned = true;
      this.finish(run, []);
      return ok("The run is abandoned and its record is frozen. Tell the person where it is.");
    }
    if (kind === "focus_accept" && s) {
      const v = run.putPort("focus", args.focus, s.step, null);
      run.focus = { agreed_focus_ref: run.ref(v.path), accepted_at: answer.at };
      run.endStep(s.step.step_id, "done");
    } else if (kind === "waiver") {
      for (const id of waived) {
        const w = run.steps.get(id);
        if (w?.status === "failed")
          w.status = "waived";
      }
    } else if (s && s.status === "running" && s.step.kind === "decide") {
      run.endStep(s.step.step_id, "done");
    }
    return ok("Decision recorded. Call heddle_next.");
  }
  // ---------------------------------------------------------------- deliver
  deliver(run, choiceIds) {
    const s = [...run.steps.values()].find((x) => x.step.kind === "deliver");
    if (!s || !run.readySteps().includes(s))
      throw new Refusal("The run is not ready to deliver (call heddle_next).");
    const menu = run.template.output_menu;
    const chosen = choiceIds.length ? choiceIds : ["review_md"];
    for (const c of chosen)
      if (!menu.some((m) => m.choice_id === c))
        throw new Refusal(`Unknown choice ${c}. Choices: ${menu.map((m) => m.choice_id).join(", ")}.`);
    checkChoices(run, chosen);
    run.startStep(s.step.step_id, "ctx_1", "shared_context");
    const files = render(run, chosen);
    run.endStep(s.step.step_id, "done");
    const recordPath = this.finish(run, chosen);
    return ok(`Delivered. Results: ${files.map((f) => run.ref(f)).join(", ")}. The run record (with its practice headline) is ${run.ref(recordPath)}.
Practice: ${run.headlineLine ?? ""}`);
  }
  /** Close the record: pack fingerprints, headline, delivered (unless abandoned), write and freeze. */
  finish(run, chosen) {
    if (!run.abandoned) {
      run.log.append("pack_fingerprints", { source: "mcp_server", phase: "after", packs: run.packs(), matches_pinned: true });
    }
    const headline = generateHeadline(run.log.events, { declaredInputRule: false, hostProfile: "claude_code" });
    run.headlineLine = headline.line;
    run.log.append("headline_generated", {
      source: "mcp_server",
      generator: "fairlead_code",
      generator_version: "0.1.0",
      items_fingerprint: jcs1(headline.items)
    });
    const final = generateHeadline(run.log.events, { declaredInputRule: false, hostProfile: "claude_code" });
    if (!run.abandoned) {
      const deliverStep = [...run.steps.values()].find((x) => x.step.kind === "deliver")?.step.step_id ?? "deliver";
      run.log.append("delivered", { source: "mcp_server", choice_ids: chosen, report_built: false }, deliverStep);
      run.delivered = true;
    }
    const record = buildRecord(run.recordParts(final));
    return run.writeJson("run_record.json", record);
  }
};
function safeRead(path) {
  try {
    return readFileSync5(path, "utf8");
  } catch {
    return "";
  }
}
var BLANK_LINE = `

`;
function portText(run, read) {
  const set = run.readPortSet(read);
  const [only] = set;
  if (!only)
    return null;
  const data = (v) => v.contract === null ? run.readPort(v) : JSON.stringify(JSON.parse(run.readPort(v)));
  const text2 = set.length === 1 ? data(only) : only.contract === null ? set.map((v) => `[from step ${v.step_id}]
${data(v)}`).join(BLANK_LINE) : `[${set.map(data).join(",")}]`;
  return { text: text2, fingerprints: set.map((v) => v.fingerprint) };
}
function partOf(parts, k, next) {
  if (!Number.isInteger(k) || k < 1 || k > parts.length)
    throw new Refusal(`There are ${String(parts.length)} parts.`);
  if (parts.length === 1)
    return parts[0] ?? "";
  const head = `[Part ${String(k)} of ${String(parts.length)}.${k < parts.length ? ` ${next(k + 1)}` : " This is the last part."}]

`;
  return head + (parts[k - 1] ?? "");
}
function splitParts(text2, max = 3e4) {
  const parts = [];
  let rest = text2;
  while (rest.length > max) {
    let cut = rest.lastIndexOf("\n", max);
    if (cut < max / 2)
      cut = max;
    parts.push(rest.slice(0, cut));
    rest = rest.slice(cut);
  }
  parts.push(rest);
  return parts;
}
var MAIN_ONLY = /* @__PURE__ */ new Set(["heddle_ticket", "heddle_gate", "heddle_step", "heddle_decision", "heddle_deliver", "heddle_next"]);
function integrityMessage(run) {
  return `This run can no longer be trusted: ${run.integrity.join("; ")}. Tell the person plainly. The only way forward is to abandon this run (ask them, then call heddle_decision with kind abandon) and start a new one.`;
}
function howTo(run, stepId) {
  const s = run.steps.get(stepId);
  if (!s)
    return "";
  const k = s.step.kind;
  if (s.step.thread_ref)
    return `Step ${stepId} (${k}) is ready: call heddle_ticket with step_id ${stepId}.`;
  if (s.step.gate_ref)
    return `Step ${stepId} (${k}, gate ${s.step.gate_ref}) is ready: call heddle_gate with step_id ${stepId}.`;
  if (k === "refine" || k === "decide")
    return `Step ${stepId} (${k}) is ready: call heddle_step with step_id ${stepId}, then follow its instructions with the person.`;
  if (k === "deliver") {
    return `Step ${stepId} (deliver) is ready: ask the person which results they want (${run.template.output_menu.map((m) => `${m.choice_id}: ${m.label}`).join("; ")}), then call heddle_deliver with their choice_ids.`;
  }
  return `Step ${stepId} (${k}) is ready.`;
}

// packages/mcp-server/dist/main.js
var root = process.env.CLAUDE_PLUGIN_ROOT ?? "";
var env = {
  dataDir: process.env.CLAUDE_PLUGIN_DATA ?? "",
  projectDir: process.env.CLAUDE_PROJECT_DIR ?? process.cwd(),
  bundleDir: join7(root, "bundle"),
  lockPath: join7(root, "bundle", "braids.lock.json"),
  pluginRoot: root || null
};
var server = null;
var clientVersion = "0.0.0";
var send = (msg) => {
  process.stdout.write(JSON.stringify(msg) + "\n");
};
function serverFor() {
  server ??= new FairleadServer({ ...env, clientVersion });
  return server;
}
var lines = createInterface({ input: process.stdin, crlfDelay: Infinity });
lines.on("line", (line) => {
  void handle(line);
});
async function handle(line) {
  if (!line.trim())
    return;
  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    return;
  }
  if (msg.id === void 0)
    return;
  const id = msg.id;
  try {
    switch (msg.method) {
      case "initialize": {
        const info = msg.params?.clientInfo;
        if (typeof info?.version === "string" && /^\d+\.\d+\.\d+$/.test(info.version))
          clientVersion = info.version;
        send({
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: msg.params?.protocolVersion ?? "2025-06-18",
            capabilities: { tools: {} },
            serverInfo: { name: "heddle", version: "0.1.0" }
          }
        });
        return;
      }
      case "tools/list":
        send({ jsonrpc: "2.0", id, result: { tools: TOOLS } });
        return;
      case "tools/call": {
        const params = msg.params ?? {};
        const meta = params._meta ?? {};
        const toolUseId = typeof meta["claudecode/toolUseId"] === "string" ? meta["claudecode/toolUseId"] : void 0;
        const name = typeof params.name === "string" ? params.name : "";
        const args = params.arguments ?? {};
        const r = await serverFor().call(name, args, toolUseId === void 0 ? {} : { toolUseId });
        send({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text: r.text }], isError: r.isError === true } });
        return;
      }
      case "ping":
        send({ jsonrpc: "2.0", id, result: {} });
        return;
      default:
        send({ jsonrpc: "2.0", id, error: { code: -32601, message: `method not found: ${String(msg.method)}` } });
    }
  } catch (err) {
    process.stderr.write(`heddle server: ${err instanceof Error ? err.stack ?? err.message : String(err)}
`);
    send({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text: "Heddle hit an internal error; the run is unchanged." }], isError: true } });
  }
}
