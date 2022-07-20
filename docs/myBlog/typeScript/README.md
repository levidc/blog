---
title: typeScript基础
date: 2022-07-20
categories:
  - 编程

tags:
  - typeScript
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/57.jpg)

<!-- more -->

## 类型
```typeScript
1 元素类型后面添加[]，表示由此数据类型组成的数组
const arr:number = [1,2,3,4]

2 泛型
const arr:Array<number>=[1,2,3]

3 元祖Tuple

const arr:[string,number] = ['1',2]


4 any未知的变量类型

let ar3: any[] = [1, 'false', true, { obj: "key" }]


5 void

let unknown:void = undefined null


6 object 

const test = (data: object): object => {
  return data
}


test({key:123})
 
 
7 联合类型
  const uniontype = (params: string | number): number => {
  return params.toString().length
}
```


## 类型断言
```
方式一: <类型>值
方式二: 值 as 类型  tsx中只能用这种方式

function getLength (x: number | string) {
  if ((<string>x).length) {
    return (x as string).length
  } else {
    return x.toString().length
  }
}
```

## 类型推断
```js

声明变量时赋值了、就推断对应的类型、

const arr = [1,2,3] //array
```

## interface接口
```js
interface ClassName{
  可选属性
  name?:number, 
  name1:string,
  name2:number,
  只读属性
  readonly id:number 后续不能修改
}
```

## 函数类型
```js
定义 参数列表及对应类型和返回值类型
interface typeString {
  (data: string): string
}


const typeS: typeString = (data) => {
  return Object.prototype.toString.call(data)
}

```

## 继承
```js
使用extends关键字创建子类、派生类中constructor 调用super()调用基类(也称超类)，以此执行基类的构造函数.
注：访问派生类的构造函数中的 "this" 前，必须调用 "super"。

class Game {
  name: string
  constructor(name: string) {
    this.name = name
  }
  start (story: Array<number> = [1, 2, 3]) {
    console.log(this.name + '续集' + story.join(':'));
  }
}

class zelda extends Game {
  constructor(name: string) {
    super(name)
  }
  start (story: number[] = [1, 2, 3]) {
    console.log(this.name);
    super.start(story)
  }
}

class Person extends Game {
  constructor(name: string) {
    super(name)
  }
  start (story: number[] = [1, 2, 3, 4, 5]) {
    console.log(this.name + 'person5 Royal');
    super.start(story)
  }
}

class Pokemon extends Game {
  constructor(name: string) {
    super(name)
  }
}
const z = new zelda('zelda')
z.start()
const p = new Person('person')
p.start()


// p1 子类重写基类的方法
const p1: Game = new Person('p1')
p1.start()

// pokemon 子类无start方法、调用基类的方法
const z2: Pokemon = new Game('z2')
z2.start()
```

## 公共访问public、私有private、受保护protected
```js
  访问修饰符: 用来描述类内部的属性/方法的可访问性
  public: 默认值, 公开的外部也可以访问
  private: 只能类内部可以访问
  protected: 类内部和子类可以访问
```


## 参数属性
```js
声明和赋值结合一起、通过构造函数 的参数添加访问限定符、如readonly、public、private、protected

class params {
  constructor(readonly name: string, public skill: string) {
  }
}
const p1 = new params('levi', '123')
```
## 静态
```js
  类的属性、只在类上访问、不在其实例上
class staticN {
  name: string = '13'
  static nam2: string = '14'
}
console.log(staticN.nam2, new staticN()); 14   {name:13}
```

## 函数
```js
指定参数类型、返回值类型、
function (a:number,b:number):number{
 return a+b
}

参数都是必须的、可通过设置可选参数及默认参数规避问题
```
```js
可选参数?: 指定为对应参数的变量类型或者undefined 空值
function test (a?: string): string | undefined {
  return a
}
```

```js
剩余参数
同arguments接受参数集合，
function restParams (x: string, ...args: (string | number)[]) {
  console.log(x, args);

}
restParams('123', '12,12', '13', 15)  // '123', ['12,12','13',15]
```


## 函数重载
```js
函数名相同, 而形参不同的多个函数
function add (x: string | number, y: string | number): string | number | void {
  // 在实现上我们要注意严格判断两个参数的类型是否相等，而不能简单的写一个 x + y
  if (typeof x === 'string' && typeof y === 'string') {
    return x + y
  } else if (typeof x === 'number' && typeof y === 'number') {
    return x + y
  } else {
    return
  }
}
```

## 泛型
```js
定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定具体类型的一种特性。
函数泛型
  keyof返回T的对象key
  function getPets<T, K extends keyof T> (pet: T, key: K) {
    return pet[key];
  }

```



