---
title: antd
date: 2023-02-27
categories:
  - 前端
tags:
  - react
  - js
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/61.jpg)

<!-- more -->

## form 基本使用
```js
<form
 name="form"
 ref="form"
 onFinish="this.methods"
 layout="vertical" // horizontal
 scrollToFirstError //校验失败自动滚动到第一个错误处
 initialValues={} // initialValue 初始值 不能用setValues更改、使用
                  // 使用setFieldsValue
 onFinish={this.onFinish} //校验通过的callback
 labelCol={span:4}
 wrapperCol={span:20}

>
</form>



```



## form API
```js
const ref = React.createRef() //Form表单ref绑定 ref

this.ref.current.setFieldsValue({key:'value'}) //表单赋值、数据回显

this.ref.current.resetFields() //表单重置


```


## select










