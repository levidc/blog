---
title: 文件类型上传读取等
date: 2022-04-29
categories:
  - 前端

tags:
  - 文件流
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/55.jpg)

<!-- more -->

## Base64

```js
Base64编码、解码
window.btoa、atob

优点

可以将二进制数据（比如图片）转化为可打印字符，方便传输数据。
对数据进行简单的加密，肉眼是安全的。
如果是在html或者css处理图片，可以减少http请求。

缺点

内容编码后体积变大，至少大1/3。因为是三字节变成四个字节，当只有一个字节的时候，也至少会变成三个字节。
编码和解码需要额外工作量。

```

## FileReader

| 方法                            |                                            描述                                            |
| ------------------------------- | :----------------------------------------------------------------------------------------: |
| FileReader.abort()              |                      中止读取操作。在返回时，readyState 属性为 DONE。                      |
| FileReader.readAsArrayBuffer()  |                               将读取的内容转成 ArrayBuffer。                               |
| FileReader.readAsBinaryString() |                                将读取的内容转成二进制数据。                                |
| FileReader.readAsDataURL()      | 将读取的内容转成并将其编码为 base64 的 data url。 格式是 data:[<mediatype>][;base64]<data> |
| FileReader.readAsText()         |                  将数据读取为给定编码（默认为 utf-8 编码）的文本字符串。                   |

```js
 FileReader 对象允许 Web 应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容

```

## Blob 转为文件

```js
const blob1 = new Blob(["blob文件"], { type: "text/plain" });
// blob转file
const file2 = new File([blob1], "test2", { type: blob1.type });
console.log("file2: ", file2);
```

## 文件转 Blob

```js
const file1 = new File(["文件对象"], "test", { type: "text/plain" });
// file转blob
const blob2 = new Blob([file1], { type: file1.type });
console.log("blob2: ", blob2);
```

## File、Blob、图片转 Base64

### Blob 转 Base64

```js
const blob = new Blob(["hello", "randy"], { type: "text/plain" });

const fileReader = new FileReader();

fileReader.readAsDataURL(blob);

fileReader.onload = () => {
  console.log(fileReader.result); // "data:text/plain;base64,aGVsbG9yYW5keQ=="
};
```

### File 转 Base64

```js
const file1 = new File(["文件对象"], "test", { type: "text/plain" });

const fileReader = new FileReader();

fileReader.readAsDataURL(file1);

fileReader.onload = () => {
  console.log(fileReader); // "data:text/plain;base64,5paH5Lu25a+56LGh"
};
```

### img 转 Base64

```js
//本地图片转 base64，注意链接是本地链接不能是网络地址。

const img2base64 = (imgUrl) => {
  let image = new Image();
  image.src = imgUrl;
  return new Promise((resolve) => {
    image.onload = () => {
      let canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      var context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, image.width, image.height);
      let dataUrl = canvas.toDataURL("image/png");
      resolve(dataUrl);
    };
  });
};

img2base64("../vue2/src/assets/logo.png").then((res) => {
  console.log(res);
});
```

### Base64 转 Blob

```js
function dataURLtoBlob(dataurl) {
  // `data:[<mediatype>][;base64],<data>`
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.\*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
```

## Base64 转文件

```js
function dataURLtoFile(dataurl, filename) {
  //将base64转换为文件
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
```

## base64 图片转为 blob

```js
function convertBase64UrlToBlob(urlData) {
  var bytes = window.atob(urlData.split(",")[1]); //去掉url的头，并转换为byte
  //处理异常,将ascii码小于0的转换为大于0
  var ab = new ArrayBuffer(bytes.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], {
    type: "image/png",
  });
}
```

## 图片解析为 base64 编码

```js
let file = new FileReader();
file.readAsDataURL(file);
// 传递base64
let _this = this;
file.onload = function () {
  _this.result = this.result;
};
```

## window.URL.createObjectURL && FileReader.readAsDataURL

```js
区别：
通过FileReader.readAsDataURL(file)可以获取一段data:base64的字符串

通过URL.createObjectURL(blob)可以获取当前文件的一个内存URL


执行时机:
createObjectURL是同步执行（立即的）

FileReader.readAsDataURL是异步执行（过一段时间）


内存使用:

createObjectURL返回一段带hash的url，并且一直存储在内存中，直到document触发了unload事件（例如：document close）或者执行revokeObjectURL来释放。
FileReader.readAsDataURL则返回包含很多字符的base64，并会比blob url消耗更多内存，但是在不用的时候会自动从内存中清除（通过垃圾回收机制）


```

## 图片上传校验尺寸大小

window.URL.createObjectURL  
可以用于在浏览器上预览本地图片或者视频

```js
const isSize = new Promise(function(resolve, reject) {
  let width = 750;
  let height = 1334;
  let _URL = window.URL || window.webkitURL;
  let image = new Image();
  image.onload = function() {
    console.log(image,'image');
    console.log(_URL);
    let valid = image.width < width || image.height < height;
    if(valid) { //不符合
      that.$confirm('图片尺寸小于750*1334, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resolve();
      }).catch(() => {
        reject();
      });
    }else{
      resolve();
    }
  };
  //
  image.src = _URL.createObjectURL(file);
  }).then(
  () => { // resolve
    return file;
  },
  () => { // 取消上传 reject
    return Promise.reject();
  }
);
  return isSize;
},
```

## 文件夹上传

```js
谷歌浏览器还有Microsoft Edge支持按照文件夹上传

webkitdirectory属性
$('.el-upload__input').webkitdirectory = true

File.webkitRelativePath属性设置为所选目录内文件所在的相对路径。

获取到的文件list upload=> :on-change="methods(file,filelist)"
```

## 锚点跳转

```js
a标签的href="#id" 跳转到对应元素相同id的标签上 路由添加#

document.querySelector("." + id).scrollIntoView(true);

```

[参考](https://juejin.cn/post/7046313942938812424)

## 下载文件
```js
  //下载为json文件
    var Link = document.createElement('a');
    Link.download = "机柜信息.json";
    Link.style.display = 'none';
    // 字符内容转变成blob地址
    var blob = new Blob([js]);
    Link.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(Link);
    Link.click();
    // 然后移除
    document.body.removeChild(Link);
```