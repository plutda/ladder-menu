export default function deepClone(obj) {
  // 如果不是对象或者为null，则直接返回
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  // 判断对象类型，如果是日期对象则返回一个新的日期对象
  if (obj instanceof Date) {
    return new Date(obj.getTime())
  }

  // 判断对象类型，如果是正则表达式则返回一个新的正则表达式对象
  if (obj instanceof RegExp) {
    return new RegExp(obj)
  }

  // 如果是数组，则遍历数组进行深拷贝
  if (Array.isArray(obj)) {
    return obj.map(deepClone)
  }

  // 如果是普通对象，则遍历对象进行深拷贝
  const newObj = {}
  Object.keys(obj).forEach(key => {
    newObj[key] = deepClone(obj[key])
  })

  return newObj
}
