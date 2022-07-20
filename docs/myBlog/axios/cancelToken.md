---
title: axios常用中断请求等
date: 2022-05-26
categories:
 - 前端
tags:
 - axios
 - 网络请求
---
![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/25.jpg)

<!-- more -->


## 中断请求
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


## 请求失败重新请求
```js
设置timeout
//在main.js设置全局的请求次数，请求的间隙
axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;

axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
    var config = err.config;
    // If config does not exist or the retry option is not set, reject
    if (!config || !config.retry) return Promise.reject(err);

    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0;

    // Check if we've maxed out the total number of retries
    if (config.__retryCount >= config.retry) {
        // Reject with the error
        return Promise.reject(err);
    }

    // Increase the retry count
    config.__retryCount += 1;

    // Create new promise to handle exponential backoff
    var backoff = new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, config.retryDelay || 1);
    });

    // Return the promise in which recalls axios to retry the request
    return backoff.then(function () {
        return axios(config);
    });
});

```