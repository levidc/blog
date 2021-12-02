---
title: vuex的使用
date: 2021-12-02
categories:
  - 前端

tags:
  - vue
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/43.jpg)

<!-- more -->

## vuex 属性

```js
/store/index.js
import Vue from "vue";
import Vuex from "vuex";
import view from "./modules/view";
Vue.use(Vuex);
export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    view,
  },
  getters,
});


// modules文件夹下模块化单独js文件
-----------------------------
const view = {
  namespaced: true,
  state: {
    isFullScren: false,
    testView: 'view'
  },
  mutations: {
    SET_FUllSCREEN(state, value) {
      state.isFullScren = value
    }
  },
  actions: {
    ChangeFullScreen({ commit, state }) {
      commit('SET_FUllSCREEN', !(state.isFullScren))
    }
  }
}
export default view
-----------------------------

//main.js中引入 import store from './store'
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
```

### state

```js
基础的状态值
this.$store.state.'属性名'
直接赋值或修改也是响应式的，不过不推荐、
通过...mapState()函数映射


当映射的计算属性的名称与 state 的子节点名称相同时，我们也可以给 mapState 传一个字符串数组。
...mapState(['state'])
```

### getters

```js
相当于computed，引入到页面中，不能直接更改，
import { mapGetters } from 'vuex'
computed:{
  ...mapGetters(['value','value',...])
}

/store/getters.js
const getters = {
  // 模块下的state的映射
  fullScreen: state => state.view.isFullScren,
  name: state => state.user.name
}
export default getters
import getters from './getters'
new Vuex.Store({
  {
    getters
  }
})
```

### mutations

```js
mutations触发state的改变，必须是同步的
this.store.commit('mutation',payload)
mutation(state,payload){
  state.xxx = payload....
}
```

### actions

```js
actions调用mutations从而改变state，本身是异步的
通过结合接口进行使用，如存储登录信息等
this.$store.dispatch('actionName',payload)
actionName({commit,state},payload){
  commit('mutationName',payload...)
}

//第一个参数context可以接收一个与store实例具有相同方法的属性context，
//通过使用es6解构赋值取得相应属性，这个属性中包括下面几部分
context:{
  state, 等同于store.$state，若在模块中则为局部状态
  rootState, 等同于store.$state,只存在模块中
  commit, 等同于store.$commit
  dispatch, 等同于store.$dispatch
  getters  等同于store.$getters
}
```

### modules

```js
import xxx from './modules/xxx'
/store/index.js
new Vuex.Store({
    modules: {
    xxx
  },
})
```

## 页面引用

### 开启命名空间

```js
modules下单个模块添加namespaced后，可以开启命名空间
mapGetters、mapState、mapMutations、mapActions、注入到页面中的方式也需要添加模块名
例如
modules/view.js
namespaced:true,

store/index.js
import view from '/modules/view'
export default new Vuex.Store({
....,
//使用modules
  modules:{
    view
    ...
  }
})
...mapMutations('view', {
    SET_FUllSCREEN: 'SET_FUllSCREEN'
  }),
// 开启命名空间后，不设置模块名，直接map函数映射值，无法读取到相应的方法
即使同名也不好使用简写，格式为('模块名',{
  '引入页面中的别名':'模块中的名'
})
```

### 无命名空间

```js
mapGetters、mapState、mapMutations、mapActions直接注入，直接使用
computed:{
  ...mapGetters(['value','value2']),
  ...mapState(['value','value2'])
}
methods:{
  ...mapMutations(['value','value2']),
  ...mapActions(['value','value2'])
}
或者不映射方式
直接通过 this.$store.getters/state/commit('mutations名')/dispatch('actions名')
mapState映射的

```

:::danger
1 重名的 mutation、actions 等需要注意，都会执行;

2 mapState 映射的变量名如果和 modules 设置的模块名一样，取模块名下所有的{...state},反之则为 根目录下 index.js 下的 state
:::
