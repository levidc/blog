---
title: prototype原型&&原型链
date: 2017-12-28
categories:
 - 前端

tags:
 - js 
 - prototype原型
---

```js
    Object.__proto__ === Function.prototype,
        Object.__proto__ === Function.__proto__,
        Function.__proto__ === Function.prototype,
```

![prototype](/assets/studyImg/prototype.jpg)

## 原型的继承方法

## 原型链继承

```js
    function Father() {
        this.name = 'father'
        this.arr = [1, 2, 3]
    }
    Father.prototype.call = function() {
        console.log(this);
    }

    function Son() {}
    Son.prototype = new Father()
    let f = new Father()
    let s = new Son()
    let s2 = new Son()
    s.arr.push(1)
    console.log(s.arr);
    console.log(s2.arr);
    //s,s2指向同一个引用。
```

## 构造函数继承

```js
    function Son() {
        Father.call(this)
    }
    解决引用值问题， 但无法访问继承的方法
```

## 组合继承

```js
    function Father() {
        this.name = 'father'
        this.arr = [1, 2, 3]
    }
    Father.prototype.call = function() {
        console.log(this);
    }

    function Son() {
        Father.call(this)
    }
    Son.prototype = new Father()
    let f = new Father()
    let s = new Son()
    let s2 = new Son()
    s.call()
    解决引用值和方法问题， 但父函数执行两次， 且子函数的原型丢失
```

## 寄生组合继承

```js
    function Father() {
        this.name = 'father'
        this.arr = [1, 2, 3]
    }
    Father.prototype.call = function() {
        console.log(this);
    }

    function Son() {
        Father.call(this)
    }
    Son.prototype = Object.create(Father.prototype)
    Son.prototype.constructor = Son
```

```js
       // 实现继承的核心函数
       function inheritPrototype(subType, superType) {
           function F() {};
           //F()的原型指向的是superType
           F.prototype = superType.prototype;
           //subType的原型指向的是F()
           subType.prototype = new F();
           // 重新将构造函数指向自己，修正构造函数
           subType.prototype.constructor = subType;
       }
       // 设置父类
       function SuperType(name) {
           this.name = name;
           this.colors = ["red", "blue", "green"];
           SuperType.prototype.sayName = function() {
               console.log(this.name)
           }
       }
       // 设置子类
       function SubType(name, age) {
           //构造函数式继承--子类构造函数中执行父类构造函数
           SuperType.call(this, name);
           this.age = age;
       }
       // 核心：因为是对父类原型的复制，所以不包含父类的构造函数，也就不会调用两次父类的构造函数造成浪费
       inheritPrototype(SubType, SuperType)
       // 添加子类私有方法
       SubType.prototype.sayAge = function() {
           console.log(this.age);
       }
       var instance = new SubType("Taec", 18)
       console.dir(instance)
```

![inheritProto](/assets/studyImg/inheritProto.png)
