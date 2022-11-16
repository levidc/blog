---
title: 防抖节流实现
date: 2020-12-31
categories:
 - 前端
 - 面试题
tags:
 - js原生
 - 闭包
 - vue2
---
![](https://cdn.jsdelivr.net/gh/levidc/blogImg@master/img/6.jpg)

<!-- more -->
## 闭包实现

```js
    export const throttle = function(fn, delay = 2000) {
        let timer
        return function() {
            let self = this
            if (!timer) {
                timer = setTimeout(() => {
                    fn.apply(self, arguments)
                    timer = null
                }, delay);
            }
        }
    }

    export const debounce = function(fn, delay = 2000) {
        let timer
        return function() {
            let self = this
            clearTimeout(timer)
            timer = setTimeout(() => {
                fn.apply(self, arguments)
            }, delay);
        }
    }
    debounce.call(this, function() {
        todo...
    }, 500),
```

## vue自定义指令实现

```js
    export default{
        data(){
            return{

            }
        },
        directives: {
            //节流
            'throt': {
                bind: (el, binding) => {
                    let timer
                    el.addEventListener('input', () => {
                        if (!timer) {
                            timer = setTimeout(() => {
                                binding.value.func()
                                timer = null
                            }, binding.value.delay)
                        }
                    })
                }
            }
            //防抖
            'debou': {
                bind: (el, binding) => {
                    let timer
                    el.addEventListener('input', () => {
                        if (timer) clearTimeout(timer)
                        timer = setTimeout(() => {
                            binding.value.func()
                            timer = null
                        }, binding.value.delay)
                    })
                }
            }
        },
    v-throt="{func:methods,delay:50}"
```
