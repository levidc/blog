---
title: linux常用指令
date: 2021-11-11
categories:
  - 前端

tags:
  - linux
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/15.jpg)

<!-- more -->

```js
  $ sudo dpkg -i  xxx文件名   安装对应的linux版本文件如.deb格式
  // 可以找到对应安装文件的位置，直接拖动到终端、直接获取文件名
  $ ls              查看当前文件夹下所有文件
  $ sudo -root      设置管理员权限操作
  $ sudo -root chmod -R 777 xx 文件名   文件夹添加权限
  rm -rf  xxx 删除文件夹名称
  设置桌面快捷启动方式及桌面小标
  最快方式 找到如下目录 cd /usr/share/applications/
  拖动快捷方式到桌面即可，图标需要找到相应的png图片手动设置即可

```

## 安装 node

```js
  首先选择对应下载链接
  wget http://nodejs.org/dist/latest/node-v10.11.0-linux-x64.tar.gz
  下载到本地
  tar  xf node-v5.10.1-linux-x64.tar.gz -C /usr/local/
  切换到本地，建立软连接
  cd /usr/local/
  mv node-v5.10.1-linux-x64/ nodejs
  ln -s /usr/local/nodejs/bin/node /usr/local/bin
  ln -s /usr/local/nodejs/bin/npm /usr/local/bin

  测试node -v
```

## 安装 yarn

```js
  通过下载源下载yarn
  sudo apt-key adv --keyserver pgp.mit.edu --recv D101F7899D41F3C3
  echo "deb http://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
  sudo apt-get update && sudo apt-get install yarn

  测试yarn -v
```

## 设置淘宝镜像

```js
  npm或者yarn设置淘宝源

  查看当前配置镜像
  npm get registry
  yarn config get registry

  设置淘宝镜像
  npm config set registry http://registry.npm.taobao.org/
  yarn config set registry http://registry.npm.taobao.org/

  恢复到初始的镜像
  npm config set registry https://registry.npmjs.org/
  yarn config set registry http://registry.npmjs.org/
```
