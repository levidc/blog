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
const arr:number[] = [1,2,3,4]

2 泛型
const arr:Array<number>=[1,2,3]

3 元祖Tuple,已知元素数量和类型的数组
let turple: [...args: (number | string)[]]


const arr:[string,number] = ['1',2]


4// 枚举 手动添加对应值，默认0、累加
enum num { 'a=3', 'b=5', 'c=2' }
let n: string = num[2]
console.log(n);


5 any未知的变量类型

let ar3: any[] = [1, 'false', true, { obj: "key" }]


6 void

let unknown:void = undefined null


7 object 

const test = (data: object): object => {
  return data
}


test({key:123})
 
 
8 联合类型
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
  可选属性 name?:number, 
  只读属性 readonly id:number 后续不能修改
  任意属性 [prop:string]:any  //当有多个属性类型时、必须指定any类型
}
```
### interface继承
```js
单继承
interface name extends name2
多继承
interface name extends name2,name3


继承属性重名问题
interface father {
  name: string
}
interface GrandPa {
  name: number
}
interface son extends father,GrandPa {
  name: '12'
}
1:若son的属性name 值不是string类型、将报错
2: 多父接口的重名属性类型不完全一致、即上述name 类型不一致也报错，

下列父接口重名draw方法也可通过子接口定义同名draw方法 避免父接口合并操作，但是draw需要与父接口类型一致
interface Color {
  draw (): { color: string };
}

interface Shape {
  draw (): { x: number; y: number };
}

interface Circle extends Color, Shape {
  draw (): { color: string; x: number; y: number };
}
let test: Circle = {
  draw: function () {
    return {
      color: '123',
      x: 1,
      y: 2
    }
  }
}
```

### 函数接口

```js
定义 参数列表及对应类型和返回值类型
interface typeString {
  (data: string): string
}


const typeS: typeString = (data) => {
  return Object.prototype.toString.call(data)
}
```
### 泛型接口
```js
  interface 

1 函数中定义泛型


2 接口中定义泛型
```
## type
```js
type stringFun = (data: string) => string 定义函数返回类型
type arrName = Array<number | string> 定义数组类型
let arr: arrName = [2, 3, '5'] 

// 联合类型
type unitType = stringFun | arrName

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


### 函数重载
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

### 函数声明
```js
1 声明式函数
function f1 (x: number, y: number = 2): number {
  return x + y
}
2 表达式函数
const f2 = (x: number, y: number = 2): number => x + y

3 接口式函数

interface f3 {
  (x: number, y: number): number
}
const f4: f3 = (x, y) => x + y
console.log(
  f4(1, 2)
);


4 完整函数声明
let num: (n1: number, n2: number) => number =
  function (d1: number, d2?: number) {
    if (d2) {
      return d1 + d2
    } else {
      return d1
    }
  }

```




## 泛型
```js
定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定具体类型的一种特性。
```
### 函数泛型
```js
  keyof返回T的对象key
  function getPets<T, K extends keyof T> (k: T, v: K) {
    return k[v];
  }



  function t1<T> (params: T): T {
    return params
  }
  泛型函数变量<变量名:T>

  泛型参数名数量和方式一致即可

  1:let t: <T>(v: T) => T = t1      // 设置类型参数
  
  2:let t2: { <T> (v: T): T } = t1  // 对象字面量
```
### 泛型约束
```js
  interface addLength {
    length: number
  }
  function getLength<T extends addLength> (data: T): T {
    console.log(data.length);
    return data
  }
  let fn = getLength(params) //params必须拥有length属性

```

