<script>
import deepclone from '@/utils/deepclone';

export default {
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
			menuItems: deepclone(this.data),
      subMenuItems: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (this.menuItems[0]) {
        this.menuItems[0][this.selected] = true
        this.menuItems[0]._realSelected = true
        this.$emit('update:select', this.getSelection())
      }
    },
    selectItem (item, index, list) {
      list.forEach(k => {
        k[this.selected] = false
        k._realSelected = false
      })
      item[this.selected] = true
      item._realSelected = true
      if (item[this.children].length > 0) {
        list.forEach(k => {
          k[this.children] && k[this.children].forEach(j => {
            j[this.selected] = false
          })
        })
        item[this.children][0][this.selected] = true
      }
      this.updateSubMenuPos(index)
      this.$emit('update:select', this.getSelection())
    },
    hoverItem(item, index) {
      this.subMenuItems = item[this.children]
      this.updateSubMenuPos(index)
    },
    leaveItem(item) {
      if (!item._realSelected) {
        item[this.selected] = false;
      }
    },
    selectSubItem(item, list) {
      list.forEach(k => {
        k[this.children] && k[this.children].forEach(j => {
          j[this.selected] = false
        })
      })
      item[this.selected] = true
      this.$forceUpdate()

      this.$emit('update:select', this.getSelection())
    },
    updateSubMenuPos(index) {
      this.activeEle = document.querySelector('.tab-menu-ladder_0807 .main-menu .active')
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
          total.push(cur.id)
        }
        const children = cur[this.children] || []
        children.forEach(item => {
          if (item[this.selected]) {
            total.push(item.id)
          }
        })
        return total
      }, [])
    }
  }
}
</script>

<template>
  <div class="tab-menu-ladder_0807">
    <ul class="main-menu">
      <li
        v-for="(item, index) in menuItems"
        :key="item.type"
        :class="{active: item[selected]}"
        @click="selectItem(item, index, menuItems)"
        @mouseover="hoverItem(item, index)"
        @mouseleave="leaveItem(item)"
      >
        <div class="menu-item">
          <a :href="item.link">{{ item.name }}</a>
        </div>
      </li>
    </ul>
    <ul class="sub-menu">
      <li
        v-for="item in subMenuItems"
        :key="item.id"
        :class="{active: item[selected]}"
        @click="selectSubItem(item, menuItems)"
      >
        <div class="menu-item">
          <a :href="item.link">{{ item.name }}</a>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.tab-menu-ladder_0807 {
  position: relative;
  width: 24px;
  font-family: Arial, sans-serif;
  z-index: 1000;
}
.tab-menu-ladder_0807 ul {
  list-style: none;
  padding: 0;
  margin: 0;
  box-shadow: 0 1px 6px rgb(0 0 0 / 25%);
  width: 24px;
}
.tab-menu-ladder_0807 li {
  padding: 10px 0 10px 0;
  align-items: center;
  border-top: 1px solid #d6d9db;
  border-bottom: 1px solid #d6d9db;
  background-color: #fff;
  transition: all .3s ease-in-out;
  writing-mode: vertical-rl;
  width: 100%;
}
.tab-menu-ladder_0807 li:hover {
  cursor: pointer;
}
.tab-menu-ladder_0807 li:last-child {
  border-bottom: none;
}
.tab-menu-ladder_0807 li.active {
  background-color: #ccddff;
  color: #000;
}
.tab-menu-ladder_0807 .menu-item a {
  color: #4a4a4a;
  text-decoration: none;
  font-size: 16px;
}
.tab-menu-ladder_0807 li.active .menu-item a {
  font-weight: bold;
  color: #0072ff;
}

.tab-menu-ladder_0807 .sub-menu {
  position: absolute;
  opacity: 0;
  transition: opacity .8s ease-in-out;
}

.tab-menu-ladder_0807 .main-menu:hover + .sub-menu, .sub-menu:hover {
  opacity: 1;
}
</style>