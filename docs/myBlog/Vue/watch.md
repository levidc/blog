---
title: watch模拟
date: 2022-01-26
categories:
  - 前端

tags:
  - vue
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/49.jpg)

<!-- more -->

```js
const data = {
  flag: false,
  firstName: "Zheng",
  lastName: "Yimeng",
};

const computed = {
  name() {
    if (!data.flag) {
      return "你拿不到";
    }
    return data.firstName + " " + data.lastName;
  },
};

function observe(obj) {
  const keys = Object.keys(obj);
  /** 需要注意这里，我并没有对传入的 obj 本身做响应式处理，是为了简化代码 （vue 源代码对传入的对象也做了处理） */
  keys.forEach((key) => {
    observer(obj, key);
  });
}

function observer(obj, key) {
  let value = obj[key]; //?1 为什么需要这个东西
  let dep = new Dep(); // 每个属性都有一个自身的 dep。
  Object.defineProperty(obj, key, {
    get() {
      if (Dep.target) {
        console.log(`收集依赖 ${key}`);
        Dep.target.addDep(dep);
      }
      return value; //?1 因为在这里写 obj[key] 的时候相当于重新访问这个 key，会再次触发 get 方法，进入死循环
    },
    set(newVal) {
      if (value === newVal) return;
      value = newVal;
      if (dep.subs.length) {
        console.log(`${key} 改变了，我要更新它记录的 watcher 了`);
        dep.notify();
      }
    },
  });
}

function initComputed(computed) {
  /** 注意我这里搞 computed 重新拆来搞只是为了让大家看明白，vue 源代码和我不一样，但是原理类似 */
  const watchers = {};
  const keys = Object.keys(computed);
  keys.forEach((key) => {
    watchers[key] = new Watcher(computed[key]);
  });
  return watchers;
}

function Dep() {
  this.subs = [];
}

Dep.prototype.notify = function () {
  this.subs.forEach((watcher) => watcher.update());
};

function Watcher(func) {
  this.get = func;
  this.deps = [];
  Dep.target = this;
  this.value = this.get(); // 函数体是 { return data.firstName + ' ' + data.lastName }，所以会调用 data.firstName 和 data.lastName 的 get 方法
  Dep.target = null;
}

Watcher.prototype.addDep = function (dep) {
  // 这里为什么需要记录 dep? 因为：假设现在 flag 为 true，那么我们的 computed.name 收集依赖的时候收集到了 data.flag, data.firstName, data.lastName，这三个属性每个都有一个 dep，修改其中一个都会重新调用 dep.notify() 从而更新 name 值, 但是当我们修改其中的一个属性的时候，这个收集的依赖其实就已经改变了，比如修改了 flag = false，再修改 data.firstName 和 data.lastName 的时候，就不应该再重新求 computed.name 值了，因为走不到那一步，那么 data.firstName 和 data.lastName 的 dep 就应该为空，这样在修改 data.firstName 和 data.lastName 的时候因为他们的 dep 为空就不会重新求 computed.name 值了
  this.deps.push(dep);
  dep.subs.push(this); // 到这里的时候，还记得吗？自身属性的 watcher 就被记录下来了
};

Watcher.prototype.update = function () {
  this.deps.forEach((dep) => (dep.subs = [])); // 在这里把该 计算属性 对应的每个 依赖属性 的 dep 都清空
  Dep.target = this;
  let value = this.get(); // 这里调用 get 后重新收集依赖
  Dep.target = null;
  if (this.value !== value) {
    this.value = value;
    // value改变，渲染页面
  }
};

function MyVue({ data, computed }) {
  observe(data);
  this.watchers = initComputed(computed);
  // 这里把属性简单地绑给实例本身
  Object.keys(this.watchers).forEach((key) => {
    // 这里 computed 我假设不让手动修改它，所以不作处理
    Object.defineProperty(this, key, {
      get() {
        return this.watchers[key].value;
      },
    });
  });
  Object.keys(data).forEach((key) => {
    Object.defineProperty(this, key, {
      get() {
        return data[key];
      },
      set(newVal) {
        data[key] = newVal;
      },
    });
  });
}

window.vm = new MyVue({ data, computed });
```
