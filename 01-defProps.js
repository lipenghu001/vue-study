// 响应式
function defineReactive(obj, key, val) {
  // 递归
  observe(val)
  // 对传入obj进行访问拦截
  Object.defineProperty(obj, key, {
    get() {
      console.log('get '+ key);
      return val
    },
    set(newVal){
      if(newVal !== val) {
        console.log('set ' + key + ':' + newVal);
        // 如果传入的newVal依然是obj,需要做相应化处理
        observe(newVal)
        val = newVal
      }
    }
  })
}

function observe(obj) {
  if(typeof obj !== 'object' || obj == null) return     
  Object.keys(obj).forEach(key => {
    defineReactive(obj,key,obj[key])
  })
}

function set(obj,key,val) {
  defineReactive(obj,key,val)
}

// defineReactive(obj, 'foo', 'foo1')
// obj.foo
// obj.foo = 'foooooooooo'


const obj = {foo:'foo', bar:'bar', baz:{ a:1} ,arr:[1,2,3,4]}
observe(obj)

obj.foo
obj.foo = 'fooooooooooooooo'

obj.baz.a = 10

obj.baz = {a:100}
obj.baz.a = 10000

// obj.dong = 'dong'
set(obj, 'dong', 'dong')
obj.dong

// Object.defineProperty()对数组无效
// 分析：改变数组方法只有七个
// 解决方案：替换数组实例的原型方法，让他们在修改数组同时......
obj.arr.push(5)  
