// 涉及类型

// KVue： 框架构造函数

// Observer: 执行数据响应化（分辨数据是对象还是数组）

// Compile: 编译模板，初始化函数，收集依赖(更新函数，watcher的创建等)

// Watcher：执行更新函数（更新dom）

// Dep： 管理多个Watcher,批量更新

/**
 * 一些响应式处理方法
 */
// 响应式
function defineReactive(obj, key, val) {
  // 递归
  observe(val)

  // 创建一个Dep和当前key一一对应
  const dep = new Dep()


  // 对传入obj进行访问拦截
  Object.defineProperty(obj, key, {
    get() {
      console.log('get '+ key);
      // 依赖收集在这里
      Dep.target && dep.addDep(Dep.target)

      return val
    },
    set(newVal){
      if(newVal !== val) {
        console.log('set ' + key + ':' + newVal);
        // 如果传入的newVal依然是obj,需要做相应化处理
        observe(newVal)
        val = newVal

        // 
        // watchers.forEach(w => w.update())
        dep.notify()
      }
    }
  })
}

function observe(obj) {
  if(typeof obj !== 'object' || obj == null) return   
  
  // 创建Observer实例
  new Observer(obj)
  
}

function set(obj,key,val) {
  defineReactive(obj,key,val)
}


// 代理函数，方便用户直接访问$data中的数据
function proxy(vm, sourceKey) {  //   this.$data.a  =>  proxy(this,'$data)   =>   this.a
  Object.keys(vm[sourceKey]).forEach(key => {
    Object.defineProperty(vm, key, {
      get() {
        return vm[sourceKey][key]
      },
      set(newVal) {
        vm[sourceKey][key] = newVal
      }
    })
  })
}

class KVue {
  constructor(options) {
    // 保存选项
    this.$options = options
    this.$data = options.data

    // 代理
    proxy(this,'$data')

    // 响应化处理
    observe(this.$data)

    // 创建编译器实例
    new Compiler(options.el, this)
  }
}

// 根据对象类型决定如何做响应化
class Observer {
  constructor(value) {
    this.value = value

    // 判断其类型
    if(typeof value === 'object') {
      this.walk(value)
    }
  }

  // 对象数据的响应化
  walk(obj) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }

  // 数组数据的响应化， 待补充
  
}

// 观察者:  保存更新函数，值发生变化调用更新函数
// const watchers = []
class Watcher {
  constructor(vm, key, updateFn) {
    this.vm = vm

    this.key = key

    this.updateFn = updateFn

    // watchers.push(this)

    // Dep.target静态属性上设置为当前Watcher实例
    Dep.target = this
    this.vm[this.key] //读取触发了getter
    Dep.target = null

  }

  update() {
    this.updateFn.call(this.vm,this.vm[this.key])
  }
}

// Dep: 依赖， 管理某个key相关的所有Watcher实例
class Dep {
  constructor() {
    this.deps = []
  }

  addDep(dep) {
    this.deps.push(dep)
  }

  notify() {
    this.deps.forEach(dep=> dep.update())   //set里执行的操作
  }
}