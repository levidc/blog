---
title: websocket
date: 2021-11-29
categories:
  - 前端
tags:
  - js
  - websocket
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/21.jpg)

<!-- more -->

## 基本了解

```js
why：http请求只能有客户端发起，而获取连续状态的变化，起初的方案由ajax轮训来实现，每隔一段时间，重新请求一次，获取最新数据，
效率低、性能差、故由此诞生了websocket;

what:WebSocket 协议在2008年诞生，2011年成为国际标准。所有浏览器都已经支持了。
最大特点就是，服务器可以主动向客户端推送信息，客户端也可以主动向服务器发送信息，是真正的双向平等对话，属于服务器推送技术的一种。
其他特点
（1）建立在 TCP 协议之上，服务器端的实现比较容易。
（2）与 HTTP 协议有着良好的兼容性。默认端口也是80和443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。
（3）数据格式比较轻量，性能开销小，通信高效。
（4）可以发送文本，也可以发送二进制数据。
（5）没有同源限制，客户端可以与任意服务器通信。
（6）协议标识符是ws（如果加密，则为wss），服务器网址就是 URL。
```

## 常用 api

### WebSocket 构造函数

```js
WebSocket 对象作为一个构造函数，用于新建 WebSocket 实例。
var ws = new WebSocket('ws://localhost:8080');
```

### webSocket.readyState

```js
readyState属性返回实例对象的当前状态，共有四种。
CONNECTING：值为0，表示正在连接。
OPEN：值为1，表示连接成功，可以通信了。
CLOSING：值为2，表示连接正在关闭。
CLOSED：值为3，表示连接已经关闭，或者打开连接失败。
```

### webSocket.onmessage 等

```js
1 webSocket.onopen
实例对象的onopen属性，用于指定连接成功后的回调函数。

2 webSocket.onclose
实例对象的onclose属性，用于指定连接关闭后的回调函数。

3 webSocket.onmessage
实例对象的onmessage属性，用于指定收到服务器数据后的回调函数。

ws.onmessage = function(event){
  var data = JSON.parse(event.data)
  // 返回的数据可能是文本也可能是二进制数据（blob对象或Arraybuffer对象）。
  // 判断类型
  if(typeof event.data === String) {
    console.log("Received data string");
  }

  if(event.data instanceof ArrayBuffer){
    var buffer = event.data;
    console.log("Received arraybuffer");
  }
}


4 webSocket.onerror
实例对象的onerror属性，用于指定报错时的回调函数。

5 webSocket.send
实例对象的send()方法用于向服务器发送数据。
发送文本的例子：
ws.send('your message');

发送 Blob 对象的例子。
var file = document
  .querySelector('input[type="file"]')
  .files[0];
ws.send(file);


发送 ArrayBuffer 对象的例子。
// Sending canvas ImageData as ArrayBuffer
var img = canvas_context.getImageData(0, 0, 400, 320);
var binary = new Uint8Array(img.data.length);
for (var i = 0; i < img.data.length; i++) {
  binary[i] = img.data[i];
}
ws.send(binary.buffer);
```

## onclose 断开后错误码

```js
ws.onclose = function(event){
  event.wasClean '是否正常断开，布尔值，如果非正常断开，则为false'
  event.code    '错误码整数类型'
  event.reason '错误原因'
}
```

| 状态码    |         名称         | 描述                                                                                              |
| --------- | :------------------: | ------------------------------------------------------------------------------------------------- |
| 0–999     |                      | 保留段, 未使用.                                                                                   |
| 1000      |     CLOSE_NORMAL     | 正常关闭; 无论为何目的而创建, 该链接都已成功完成任务.                                             |
| 1001      |   CLOSE_GOING_AWAY   | 终端离开, 可能因为服务端错误, 也可能因为浏览器正从打开连接的页面跳转离开.                         |
| 1002      | CLOSE_PROTOCOL_ERROR | 由于协议错误而中断连接.                                                                           |
| 1003      |  CLOSE_UNSUPPORTED   | 由于接收到不允许的数据类型而断开连接 (如仅接收文本数据的终端接收到了二进制数据).                  |
| 1004      |                      | 保留. 其意义可能会在未来定义.                                                                     |
| 1005      |   CLOSE_NO_STATUS    | 保留. 表示没有收到预期的状态码.                                                                   |
| 1006      |    CLOSE_ABNORMAL    | 保留. 用于期望收到状态码时连接非正常关闭 (也就是说, 没有发送关闭帧).                              |
| 1007      |   Unsupported Data   | 由于收到了格式不符的数据而断开连接 (如文本消息中包含了非 UTF-8 数据).                             |
| 1008      |   Policy Violation   | 由于收到不符合约定的数据而断开连接. 这是一个通用状态码, 用于不适合使用 1003 和 1009 状态码的场景. |
| 1009      |   CLOSE_TOO_LARGE    | 由于收到过大的数据帧而断开连接.                                                                   |
| 1010      |  Missing Extension   | 客户端期望服务器商定一个或多个拓展, 但服务器没有处理, 因此客户端断开连接.                         |
| 1011      |    Internal Error    | 客户端由于遇到没有预料的情况阻止其完成请求, 因此服务端断开连接.                                   |
| 1012      |   Service Restart    | 服务器由于重启而断开连接.                                                                         |
| 1013      |   Try Again Later    | 服务器由于临时原因断开连接, 如服务器过载因此断开一部分客户端连接.                                 |
| 1014      |                      | 由 WebSocket 标准保留以便未来使用.                                                                |
| 1015      |    TLS Handshake     | 保留. 表示连接由于无法完成 TLS 握手而关闭 (例如无法验证服务器证书).                               |
| 1016–1999 |                      | 由 WebSocket 标准保留以便未来使用.                                                                |
| 2000–2999 |                      | 由 WebSocket 拓展保留使用.                                                                        |
| 3000–3999 |                      | 可以由库或框架使用.? 不应由应用使用. 可以在 IANA 注册, 先到先得.                                  |
| 4000–4999 |                      | 可以由应用使用.                                                                                   |

## WebSocket 心跳及重连机制

:::tip
在使用 websocket 的过程中，有时候会遇到网络断开的情况，但是在网络断开的时候服务器端并没有触发 onclose 的事件。这样会有：服务器会继续向客户端发送多余的链接，并且这些数据还会丢失。所以就需要一种机制来检测客户端和服务端是否处于正常的链接状态。因此就有了 websocket 的心跳了。还有心跳，说明还活着，没有心跳说明已经挂掉了。
:::

```js
1为什么叫心跳包呢
它就像心跳一样每隔固定的时间发一次，来告诉服务器，我还活着。

2.心跳机制
心跳机制是每隔一段时间会向服务器发送一个数据包，告诉服务器自己还活着，同时客户端会确认服务器端是否还活着。
如果还活着的话，就会回传一个数据包给客户端来确定服务器端也还活着，否则的话，有可能是网络断开连接了。需要重连~

3.如何实现心跳机制

var lockReconnect = false;  //避免ws重复连接
var ws = null;          // 判断当前浏览器是否支持WebSocket
var wsUrl = serverConfig.socketUrl;
createWebSocket(wsUrl);   //连接ws

function createWebSocket(url) {
    try{
        if('WebSocket' in window){
            ws = new WebSocket(url);
        }
        initEventHandle();
    }catch(e){
        reconnect(url);
        console.log(e);
    }
}

function initEventHandle() {
    ws.onclose = function () {
    	if (_this.stopWebsocket) {
        _this.stopWebsocket = false
        console.log('llws连接关闭!' + new Date().toLocaleString())
      } else {
        reconnect(wsUrl)
      }
    };
    ws.onerror = function () {
        reconnect(wsUrl);
        console.log("llws连接错误!");
    };
    ws.onopen = function () {
        heartCheck.reset().start();      //心跳检测重置
        console.log("llws连接成功!"+new Date().toLocaleString());
        ws.send('data') //发送后端协定的字段、代表可以开始传递数据了
    };
    ws.onmessage = function (event) {    //如果获取到消息，心跳检测重置
        heartCheck.reset().start();      //拿到任何消息都说明当前连接是正常的
        console.log("llws收到消息啦:" +event.data);
        if(event.data!='pong'){
            let data = JSON.parse(event.data);
        }
    };
}
// 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
window.onbeforeunload = function() {
    ws.close();
}

function reconnect(url) {
    if(lockReconnect) return;
    lockReconnect = true;
    setTimeout(function () {     //没连接上会一直重连，设置延迟避免请求过多
        createWebSocket(url);
        lockReconnect = false;
    }, 2000);  //断开连接按钮点击后，如果再点击连接，导致上一个没及时关闭，仍处在连接状态。
}

//心跳检测
var heartCheck = {
    timeout: 1000,        //1分钟发一次心跳
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function(){
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        return this;
    },
    start: function(){
        var self = this;
        this.timeoutObj = setTimeout(function(){
            //这里发送一个心跳，后端收到后，返回一个心跳消息，
            //onmessage拿到返回的心跳就说明连接正常
            ws.send("ping");
            console.log("ping!")
            self.serverTimeoutObj = setTimeout(function(){//如果超过一定时间还没重置，说明后端主动断开了
                ws.close();     //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            }, self.timeout)
        }, this.timeout)
    }
}



// 收到客户端消息后调用的方法
@OnMessage
public void onMessage(String message, Session session) {
  if(message.equals("ping")){
  }else{
  ...//to do
}

//针对vue中
data(){
  return {
    stopWebsocket:'false' //按钮主动关闭连接，
  }
}
methods:{
  openWeb() {
    this.initwebsockt()  //开始连接
  },
  closeWeb() {
    this.ws.send('stop')  //协定的关闭字段出发onclose
    this.stopWebsocket = true  //onclose中关闭重新请求
  },
}
```

## 创建聊天室 demo

```js
node.js
socket.

```
