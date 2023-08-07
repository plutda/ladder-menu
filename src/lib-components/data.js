export const dataSubmenu = [
  {id: 1, name: '查询', type: 'query', selected: true},
  {id: 2, name: '新增', type: 'create'},
  {id: 3, name: '修改', type: 'update'},
  {id: 4, name: '删除', type: 'delete'},
]
export const relationSubmenu = [
  {id: 5, name: '新增', type: 'create'},
  {id: 6, name: '删除', type: 'delete'},
]

export const menuData = [
  {id: 111, name: '数据类', type: 'data', selected: false, children: dataSubmenu},
  {id: 222, name: '关系类', type: 'relation', selected: false, children: relationSubmenu},
]