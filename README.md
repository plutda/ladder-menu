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


| 字段名称          | 类型     | 默认值 | 描述                                                      |
| ----------------- | -------- | ------ | --------------------------------------------------------- |
| data          | array   | 必填   | 菜单数据                                    |
| select         | array   | 非必填 | 菜单中选中项的id集合                  |
| children         | string   | 非必填 | 表示子菜单的字段,默认为'children'                  |
| selected         | string   | 非必填 | 表示菜单项被选中的字段,默认为'selected'               |

