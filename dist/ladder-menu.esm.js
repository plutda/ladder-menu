function deepClone(obj) {
  // 如果不是对象或者为null，则直接返回
  if (typeof obj !== 'object' || obj === null) {
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
  const newObj = {};
  Object.keys(obj).forEach(key => {
    newObj[key] = deepClone(obj[key]);
  });
  return newObj;
}

var script = {
  props: {
    // 传入的菜单数据
    data: {
      type: Array,
      default: () => []
    },
    // 表示选中的字段
    selected: {
      type: String,
      default: () => 'selected'
    },
    children: {
      type: String,
      default: () => 'children'
    }
  },
  data() {
    return {
      menuItems: deepClone(this.data),
      subMenuItems: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.menuItems[0]) {
        this.menuItems[0][this.selected] = true;
        this.menuItems[0]._realSelected = true;
        this.$emit('update:select', this.getSelection());
      }
    },
    selectItem(item, index, list) {
      list.forEach(k => {
        k[this.selected] = false;
        k._realSelected = false;
      });
      item[this.selected] = true;
      item._realSelected = true;
      if (item[this.children].length > 0) {
        list.forEach(k => {
          k[this.children] && k[this.children].forEach(j => {
            j[this.selected] = false;
          });
        });
        item[this.children][0][this.selected] = true;
      }
      this.updateSubMenuPos(index);
      this.$emit('update:select', this.getSelection());
    },
    hoverItem(item, index) {
      this.subMenuItems = item[this.children];
      this.updateSubMenuPos(index);
    },
    leaveItem(item) {
      if (!item._realSelected) {
        item[this.selected] = false;
      }
    },
    selectSubItem(item, list) {
      list.forEach(k => {
        k[this.children] && k[this.children].forEach(j => {
          j[this.selected] = false;
        });
      });
      item[this.selected] = true;
      this.$forceUpdate();
      this.$emit('update:select', this.getSelection());
    },
    updateSubMenuPos(index) {
      this.activeEle = document.querySelector('.tab-menu-ladder_0807 .main-menu .active');
      const submenu = document.querySelector('.tab-menu-ladder_0807 .sub-menu');
      const activeEleRect = this.activeEle.getBoundingClientRect();
      const top = activeEleRect.height * index;
      const left = activeEleRect.width;
      submenu.style.top = `${top}px`;
      submenu.style.left = `${left + 2}px`;
    },
    getSelection() {
      return this.menuItems.reduce((total, cur) => {
        if (cur[this.selected]) {
          total.push(cur.id);
        }
        const children = cur[this.children] || [];
        children.forEach(item => {
          if (item[this.selected]) {
            total.push(item.id);
          }
        });
        return total;
      }, []);
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
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
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c('div', {
    staticClass: "tab-menu-ladder_0807"
  }, [_c('ul', {
    staticClass: "main-menu"
  }, _vm._l(_vm.menuItems, function (item, index) {
    return _c('li', {
      key: item.type,
      class: {
        active: item[_vm.selected]
      },
      on: {
        "click": function ($event) {
          return _vm.selectItem(item, index, _vm.menuItems);
        },
        "mouseover": function ($event) {
          return _vm.hoverItem(item, index);
        },
        "mouseleave": function ($event) {
          return _vm.leaveItem(item);
        }
      }
    }, [_c('div', {
      staticClass: "menu-item"
    }, [_c('a', {
      attrs: {
        "href": item.link
      }
    }, [_vm._v(_vm._s(item.name))])])]);
  }), 0), _vm._v(" "), _c('ul', {
    staticClass: "sub-menu"
  }, _vm._l(_vm.subMenuItems, function (item) {
    return _c('li', {
      key: item.id,
      class: {
        active: item[_vm.selected]
      },
      on: {
        "click": function ($event) {
          return _vm.selectSubItem(item, _vm.menuItems);
        }
      }
    }, [_c('div', {
      staticClass: "menu-item"
    }, [_c('a', {
      attrs: {
        "href": item.link
      }
    }, [_vm._v(_vm._s(item.name))])])]);
  }), 0)]);
};
var __vue_staticRenderFns__ = [];

/* style */
const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-3cdd8757_0", {
    source: ".tab-menu-ladder_0807[data-v-3cdd8757]{position:relative;width:24px;font-family:Arial,sans-serif;z-index:1000}.tab-menu-ladder_0807 ul[data-v-3cdd8757]{list-style:none;padding:0;margin:0;box-shadow:0 1px 6px rgb(0 0 0 / 25%);width:24px}.tab-menu-ladder_0807 li[data-v-3cdd8757]{padding:10px 0 10px 0;align-items:center;border-top:1px solid #d6d9db;border-bottom:1px solid #d6d9db;background-color:#fff;transition:all .3s ease-in-out;writing-mode:vertical-rl;width:100%}.tab-menu-ladder_0807 li[data-v-3cdd8757]:hover{cursor:pointer}.tab-menu-ladder_0807 li[data-v-3cdd8757]:last-child{border-bottom:none}.tab-menu-ladder_0807 li.active[data-v-3cdd8757]{background-color:#cdf;color:#000}.tab-menu-ladder_0807 .menu-item a[data-v-3cdd8757]{color:#4a4a4a;text-decoration:none;font-size:16px}.tab-menu-ladder_0807 li.active .menu-item a[data-v-3cdd8757]{font-weight:700;color:#0072ff}.tab-menu-ladder_0807 .sub-menu[data-v-3cdd8757]{position:absolute;opacity:0;transition:opacity .8s ease-in-out}.sub-menu[data-v-3cdd8757]:hover,.tab-menu-ladder_0807 .main-menu:hover+.sub-menu[data-v-3cdd8757]{opacity:1}",
    map: undefined,
    media: undefined
  });
};
/* scoped */
const __vue_scope_id__ = "data-v-3cdd8757";
/* module identifier */
const __vue_module_identifier__ = undefined;
/* functional template */
const __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);
var __vue_component__$1 = __vue_component__;

/* eslint-disable import/prefer-default-export */

var components = /*#__PURE__*/Object.freeze({
  __proto__: null,
  LadderMenu: __vue_component__$1
});

// Import vue components

// install function executed by Vue.use()
const install = function installLadderMenu(Vue) {
  Object.entries(components).forEach(([componentName, component]) => {
    Vue.component(componentName, component);
  });
};

export { __vue_component__$1 as LadderMenu, install as default };
