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
  pwd   查看当前目录地址
  mkdir xxx 创建目录文件夹
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

## 安装 oh my zsh

```js
  首先安装zsh
  Ubuntu
  apt install zsh
  确认
  zsh --version


  安装oh-my-zsh
  使用gitee源
  sh -c "$(wget https://gitee.com/gloriaied/oh-my-zsh/raw/master/tools/install.sh -O -)"
  编辑配置文件
  vim ~/.zshrc
  zsh_theme更改主题样式
  plugins=（
    git
    z //跳转最常访问的路径。如blog，直接通过 z blog目录名实现跳转
  ）

  修改完配置文件需要重新加载：source ~/.zshrc

```

```js
  vim常用操作
  ESC + :q!   强制退出
  :wq 保存后退出
  /(关键字） 全局查找
```

## 安装 tmux

```js
  $ sudo apt-get install tmux
  $ tmux启动
  设置终端默认启用tmux
  edit - Profile Preference - Title and Command - Run a custom command instead of my shell - Custom command -tmux

  常用tmux操作指令
  启动后，底部状态栏 左侧显示窗口信息（编号和名称）右侧显示系统信息
  ctrl + D /exit 退出编辑器

  会话操作
  tmux 更改会话名 tmux rename -t oldname newname
  查看所有会话窗口 tmux ls
  tmux split-window 将 window 垂直划分为两个 pane
  tmux split-window -h 将 window 水平划分为两个 pane
  ctrl + b顺时针切换会话
  ctrl + b x 关闭当前会话
  tmux switch -t <session-name>切换到对应会话
  tmux detach 离开当前会话
  tmux kill-session -t xxx会话名


  窗口操作
  新建窗口
  ctrl +b 新建窗口
  ctrl + 1、2 窗口序号切换窗口
  ctrl + b  p n 上一个、下一个窗口
  ctrl + b &关闭当前窗口
```

## 安装 nvm

```js
  安装wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
  vim ~/.bashrc

  #写入配置
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm
  source ~/.bashrc
  #判断nvm是否安装
  nvm -v

  nvm use xxx 使用对应版本
  nvm install 14.13.2 安装对应版本
  nvm list 查看已安装的版本
```
