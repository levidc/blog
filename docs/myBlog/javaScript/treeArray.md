---
title: 树形结构渲染
date: 2021-10-1
categories:
 - 前端
tags:
 - js
 - 数据结构
---
![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/12.jpg)

<!-- more -->
```js
    let arr = [{
            id: 1,
            pid: 0,
            name: 'div'
        },
        {
            id: 2,
            pid: 1,
            name: 'span'
        },
        {
            id: 3,
            pid: 1,
            name: 'input'
        },
        {
            id: 4,
            pid: 1,
            name: 'ul',
        },
        {
            id: 5,
            pid: 4,
            name: 'input',
        },
        {
            id: 6,
            pid: 4,
            name: 'ul',
        },
        {
            id: 7,
            pid: 6,
            name: 'li',
        },
        {
            id: 8,
            pid: 6,
            name: 'li',
        },
        {
            id: 9,
            pid: 111,
            name: 'p',
        }
    ]

    function treeArray(arr) {
        let map = {}
        let res = []
        for (let v of arr) {
            map[v.id] = v
        }
        console.log(map);
        arr.forEach(item => {
            let parent = map[item.pid]
            if (parent) {
                parent?.children?.length ? parent.children.push(item) : (parent.children = []).push(item)
            } else {
                res.push(item)
            }
        })
        return res
    }
```
