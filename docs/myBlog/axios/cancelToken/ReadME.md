---
title: axios中断请求
date: 2021-10-31
categories:
 - 前端
tags:
 - axios
 - 网络请求
---

```js
    axios中断请求
    import axios from 'axios'
    export cancelToken = axios.CancelToken
    let self = this
    axios.post('https://jsonplaceholder.typicode.com/posts', '123', {
        cancelToken: new cancelToken(function(c) {
            self.cancel = c
            //单独页面针对某个请求保存其处理函数到this中
        })
    })
    methods: {
        ...this.cancel()
    }
    或者
    let cancelToken = axios.CancelToken
    let source = cancelToken.source()
    axios.post('https://jsonplaceholder.typicode.com/posts', '123', {
        cancelToken: source.token
    })
    methods: {
        xxx() {
            source.cancel('msg')
        }
    }
```
