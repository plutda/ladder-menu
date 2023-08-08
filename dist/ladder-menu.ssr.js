'use strict';function _iterableToArrayLimit(arr, i) {
  var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
  if (null != _i) {
    var _s,
      _e,
      _x,
      _r,
      _arr = [],
      _n = !0,
      _d = !1;
    try {
      if (_x = (_i = _i.call(arr)).next, 0 === i) {
        if (Object(_i) !== _i) return;
        _n = !1;
      } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
    } catch (err) {
      _d = !0, _e = err;
    } finally {
      try {
        if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
}
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}function deepClone(obj) {
  // 如果不是对象或者为null，则直接返回
  if (_typeof(obj) !== 'object' || obj === null) {
    return obj;
  }

  // 判断对象类型，如果是日期对象则返回一个新的日期对象
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // 判断对象类型，如果是正则表达式则返回一个新的正则表达式对象
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // 如果是数组，则遍历数组进行深拷贝
  if (Array.isArray(obj)) {
    return obj.map(deepClone);
  }

  // 如果是普通对象，则遍历对象进行深拷贝
  var newObj = {};
  Object.keys(obj).forEach(function (key) {
    newObj[key] = deepClone(obj[key]);
  });
  return newObj;
}var script = {
  props: {
    // 传入的菜单数据
    data: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    // 表示选中的字段
    selected: {
      type: String,
      default: function _default() {
        return 'selected';
      }
    },
    children: {
      type: String,
      default: function _default() {
        return 'children';
      }
    }
  },
  data: function data() {
    return {
      menuItems: deepClone(this.data),
      subMenuItems: []
    };
  },
  mounted: function mounted() {
    this.init();
  },
  methods: {
    init: function init() {
      if (this.menuItems[0]) {
        this.menuItems[0][this.selected] = true;
        this.menuItems[0]._realSelected = true;
        this.$emit('update:select', this.getSelection());
      }
    },
    selectItem: function selectItem(item, index, list) {
      var _this = this;
      list.forEach(function (k) {
        k[_this.selected] = false;
        k._realSelected = false;
      });
      item[this.selected] = true;
      item._realSelected = true;
      if (item[this.children].length > 0) {
        list.forEach(function (k) {
          k[_this.children] && k[_this.children].forEach(function (j) {
            j[_this.selected] = false;
          });
        });
        item[this.children][0][this.selected] = true;
      }
      this.updateSubMenuPos(index);
      this.$emit('update:select', this.getSelection());
    },
    hoverItem: function hoverItem(item, index) {
      this.subMenuItems = item[this.children];
      this.updateSubMenuPos(index);
    },
    leaveItem: function leaveItem(item) {
      if (!item._realSelected) {
        item[this.selected] = false;
      }
    },
    selectSubItem: function selectSubItem(item, list) {
      var _this2 = this;
      list.forEach(function (k) {
        k[_this2.children] && k[_this2.children].forEach(function (j) {
          j[_this2.selected] = false;
        });
      });
      item[this.selected] = true;
      this.$forceUpdate();
      this.$emit('update:select', this.getSelection());
    },
    updateSubMenuPos: function updateSubMenuPos(index) {
      this.activeEle = document.querySelector('.tab-menu-ladder_0807 .main-menu .active');
      var submenu = document.querySelector('.tab-menu-ladder_0807 .sub-menu');
      var activeEleRect = this.activeEle.getBoundingClientRect();
      var top = activeEleRect.height * index;
      var left = activeEleRect.width;
      submenu.style.top = "".concat(top, "px");
      submenu.style.left = "".concat(left + 2, "px");
    },
    getSelection: function getSelection() {
      var _this3 = this;
      return this.menuItems.reduce(function (total, cur) {
        if (cur[_this3.selected]) {
          total.push(cur.id);
        }
        var children = cur[_this3.children] || [];
        children.forEach(function (item) {
          if (item[_this3.selected]) {
            total.push(item.id);
          }
        });
        return total;
      }, []);
    }
  }
};function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}function createInjectorSSR(context) {
    if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
    }
    if (!context)
        return () => { };
    if (!('styles' in context)) {
        context._styles = context._styles || {};
        Object.defineProperty(context, 'styles', {
            enumerable: true,
            get: () => context._renderStyles(context._styles)
        });
        context._renderStyles = context._renderStyles || renderStyles;
    }
    return (id, style) => addStyle(id, style, context);
}
function addStyle(id, css, context) {
    const group = css.media || 'default' ;
    const style = context._styles[group] || (context._styles[group] = { ids: [], css: '' });
    if (!style.ids.includes(id)) {
        style.media = css.media;
        style.ids.push(id);
        let code = css.source;
        style.css += code + '\n';
    }
}
function renderStyles(styles) {
    let css = '';
    for (const key in styles) {
        const style = styles[key];
        css +=
            '<style data-vue-ssr-id="' +
                Array.from(style.ids).join(' ') +
                '"' +
                (style.media ? ' media="' + style.media + '"' : '') +
                '>' +
                style.css +
                '</style>';
    }
    return css;
}/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c('div', {
    staticClass: "tab-menu-ladder_0807"
  }, [_vm._ssrNode("<ul class=\"main-menu\" data-v-3cdd8757>" + _vm._ssrList(_vm.menuItems, function (item, index) {
    return "<li" + _vm._ssrClass(null, {
      active: item[_vm.selected]
    }) + " data-v-3cdd8757><div class=\"menu-item\" data-v-3cdd8757><a" + _vm._ssrAttr("href", item.link) + " data-v-3cdd8757>" + _vm._ssrEscape(_vm._s(item.name)) + "</a></div></li>";
  }) + "</ul> <ul class=\"sub-menu\" data-v-3cdd8757>" + _vm._ssrList(_vm.subMenuItems, function (item) {
    return "<li" + _vm._ssrClass(null, {
      active: item[_vm.selected]
    }) + " data-v-3cdd8757><div class=\"menu-item\" data-v-3cdd8757><a" + _vm._ssrAttr("href", item.link) + " data-v-3cdd8757>" + _vm._ssrEscape(_vm._s(item.name)) + "</a></div></li>";
  }) + "</ul>")]);
};
var __vue_staticRenderFns__ = [];

/* style */
var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-3cdd8757_0", {
    source: ".tab-menu-ladder_0807[data-v-3cdd8757]{position:relative;width:24px;font-family:Arial,sans-serif;z-index:1000}.tab-menu-ladder_0807 ul[data-v-3cdd8757]{list-style:none;padding:0;margin:0;box-shadow:0 1px 6px rgb(0 0 0 / 25%);width:24px}.tab-menu-ladder_0807 li[data-v-3cdd8757]{padding:10px 0 10px 0;align-items:center;border-top:1px solid #d6d9db;border-bottom:1px solid #d6d9db;background-color:#fff;transition:all .3s ease-in-out;writing-mode:vertical-rl;width:100%}.tab-menu-ladder_0807 li[data-v-3cdd8757]:hover{cursor:pointer}.tab-menu-ladder_0807 li[data-v-3cdd8757]:last-child{border-bottom:none}.tab-menu-ladder_0807 li.active[data-v-3cdd8757]{background-color:#cdf;color:#000}.tab-menu-ladder_0807 .menu-item a[data-v-3cdd8757]{color:#4a4a4a;text-decoration:none;font-size:16px}.tab-menu-ladder_0807 li.active .menu-item a[data-v-3cdd8757]{font-weight:700;color:#0072ff}.tab-menu-ladder_0807 .sub-menu[data-v-3cdd8757]{position:absolute;opacity:0;transition:opacity .8s ease-in-out}.sub-menu[data-v-3cdd8757]:hover,.tab-menu-ladder_0807 .main-menu:hover+.sub-menu[data-v-3cdd8757]{opacity:1}",
    map: undefined,
    media: undefined
  });
};
/* scoped */
var __vue_scope_id__ = "data-v-3cdd8757";
/* module identifier */
var __vue_module_identifier__ = "data-v-3cdd8757";
/* functional template */
var __vue_is_functional_template__ = false;
/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, createInjectorSSR, undefined);
var __vue_component__$1 = __vue_component__;/* eslint-disable import/prefer-default-export */var components$1=/*#__PURE__*/Object.freeze({__proto__:null,LadderMenu:__vue_component__$1});// install function executed by Vue.use()
var install = function installLadderMenu(Vue) {
  Object.entries(components$1).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      componentName = _ref2[0],
      component = _ref2[1];
    Vue.component(componentName, component);
  });
};var components=/*#__PURE__*/Object.freeze({__proto__:null,'default':install,LadderMenu:__vue_component__$1});// Attach named exports directly to plugin. IIFE/CJS will
// only expose one global var, with component exports exposed as properties of
// that global var (eg. plugin.component)
Object.entries(components).forEach(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
    componentName = _ref2[0],
    component = _ref2[1];
  if (componentName !== 'default') {
    install[componentName] = component;
  }
});module.exports=install;