---
title: Git
date: 2022-11-18
categories:
  - 编程

tags:
  - git
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/16.jpg)

<!-- more -->

## git 指令

```js
    git clone url
    git pull origin master
    git status 查看状态，绿色在暂存区，红色工作区
    git add . 添加所有文件
    git commit -m "msg"
    git reset HEAD 撤销上次add内容
    git reset HEAD xxx文件名.js/xxx文件夹名 撤销制定文件或者文件夹
    git reset HEAD^ 撤销上次commit提交
    git reset --hard<版本号commit> 版本回溯
    git branch 查看分支
    git branch '分支名' 创建分支
    git checkout -b "分支名" 创建并切换到分支
    git checkout '分支名' 切换分支
    git push origin '分支名' 推送到指定分支
    git push origin --delete '分支名'删除远端分支
    git merge '分支名' 将该分支合并到当前分支,即当前所在分支被合并
    git checkout master 切换到master
    git stash 临时储藏当前改动代码
    git stash list 查看stash 记录 @{0}
    git stash pop && git stash apply 恢复 && 指定恢复何种储藏
    git remote add origin git@xxxxx.com 添加远端仓库关联
```

![git指令](/assets/studyImg/git.png)

git 问题学习
[git-book](https://git-scm.com/book/zh/v2/)

```js

    生成ssh
    ssh-keygen -o
    ssh-keygen -t rsa -C 'my@xxx.com'
```
