# ladder-menu
vue2、ladder menu[梯形菜单]

<img src="./screenshot.png" alt="Demo" width="400">

[在线预览](https://plutda.github.io/ladder-menu/)

## 安装

npm i ladder-menu -S

### 使用
```script
import ladderMenu from 'ladder-menu'
Vue.use(ladderMenu)
```

```html
<ladder-menu
  :data="menuData"
  :select.sync="select"
  children="children"
  selected="selected"
/>
```

```
data() {
  return {
    menuData: [
      {
        id: 111,
        name: '数据类',
        type: 'data',
        selected: false,
        children: [
          {id: 1, name: '查询', selected: true},
          {id: 2, name: '新增'},
          {id: 3, name: '修改'},
          {id: 4, name: '删除'}
        ]
      },
      {
        id: 222,
        name: '关系类',
        type: 'relation',
        selected: false,
        children: [
          {id: 5, name: '新增'},
          {id: 6, name: '删除'}
        ]
      },
    ],
    select: []
  }
}
```


| 字段名称          | 类型     | 默认值 | 描述                                                      |
| ----------------- | -------- | ------ | --------------------------------------------------------- |
| data          | array   | 必填   | 菜单数据                                    |
| select         | array   | 非必填 | 菜单中选中项的id集合                  |
| children         | string   | 非必填 | 表示子菜单的字段,默认为'children'                  |
| selected         | string   | 非必填 | 表示菜单项被选中的字段,默认为'selected'               |

