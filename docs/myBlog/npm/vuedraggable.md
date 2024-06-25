---
title: 拖拽上传文件夹
date: 2024-03-08
categories:
  - 前端

tags:
  - vue2
  - npm

sticky: 2
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/54.jpg)

<!-- more -->

## 原生事件onDrop
```html
<div
  v-if="showDrop"
  class="picker__drop-zone"
  @dragover="(e)=>e.preventDefault()"
  @drop="onDrop"
>
  <div class="drop-arrow">
    <div class="arrow anim-floating" />
    <div class="base" />
  </div>
  <div data-v-6a50ffaa="" class="picker__drop-zone-label">拖拽文件夹到此处</div>
</div>
```
```js
    mount

    window.addEventListener('dragenter', this.dragEnterHandler)
    window.addEventListener('dragleave', this.dragLeaveHandler)
    window.addEventListener('drop', this.dropHandler)
    dragEnterHandler (e) {
      e.preventDefault()
      if (!this.showDrop) {
        this.showDrop = true
      }
    },
    dragLeaveHandler (e) {
      e.preventDefault()
      e.relatedTarget || (this.showDrop = false)
      // e.relatedTarget有效值仍在界面内
    },
    dropHandler (e) {
      e.preventDefault()
      this.showDrop = false
    },

    unmount

    window.removeEventListener('dragenter', this.dragEnterHandler)
    window.removeEventListener('dragleave', this.dragLeaveHandler)
    window.removeEventListener('drop', this.dropHandler)
    ====================================================================================================
    onDrop (e) {
      e.preventDefault()
      const dataTransfer = e.dataTransfer
      if (
        dataTransfer.items &&
        dataTransfer.items[0] &&
        dataTransfer.items[0].webkitGetAsEntry
      ) {
        this.webkitReadDataTransfer(dataTransfer)
      }
    },
    webkitReadDataTransfer (dataTransfer) {
      let fileNum = dataTransfer.items.length
      const files = []
      this.loading = true

      // 递减计数，当fileNum为0，说明读取文件完毕
      const decrement = () => {
        if (--fileNum === 0) {
          this.handleFiles(files)
          this.loading = false
        }
      }

      // 递归读取文件方法
      const readDirectory = (reader) => {
        // readEntries() 方法用于检索正在读取的目录中的目录条目，并将它们以数组的形式传递给提供的回调函数。
        reader.readEntries((entries) => {
          if (entries.length) {
            fileNum += entries.length
            entries.forEach((entry) => {
              if (entry.isFile) {
                entry.file((file) => {
                  readFiles(file, entry.fullPath)
                }, readError)
              } else if (entry.isDirectory) {
                readDirectory(entry.createReader())
              }
            })

            readDirectory(reader)
          } else {
            decrement()
          }
        }, readError)
      }
      // 文件对象
      const items = dataTransfer.items
      // 拖拽文件遍历读取
      for (var i = 0; i < items.length; i++) {
        var entry = items[i].webkitGetAsEntry()
        if (!entry) {
          decrement()
          return
        }

        if (entry.isFile) {
          // 读取单个文件
          return
          // readFiles(items[i].getAsFile(), entry.fullPath, 'file')
        } else {
          // entry.createReader() 读取目录。
          readDirectory(entry.createReader())
        }
      }

      function readFiles (file, fullPath) {
        file.relativePath = fullPath.substring(1)
        files.push(file)
        decrement()
      }
      function readError (fileError) {
        throw fileError
      }
    },

    handleFiles (files) {
      // 按文件名称去存储列表，考虑到批量拖拽不会有同名文件出现
      files.forEach((item) => {
        // relativePath 和 name 一致表示上传的为文件，不一致为文件夹
        // 文件直接放入table表格中
        // 仍需考虑去重问题
        const isExist = this.fileListArr.findIndex(x => x.name === item.name && (x.webkitRelativePath || x.relativePath) === (item.webkitRelativePath || item.relativePath))
        if (isExist > -1 || item.size > this.uploadSizeLimt) {
          return
          // this.fileListArr.splice(isExist, 1)
        }
        this.fileListArr.push(item)
      })
    },
```
```css
.picker__drop-zone{
  position: fixed;
  box-sizing: border-box;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: hsla(0,0%,100%,.9);
  border: 6px solid #ff8746;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .anim-floating {
    animation-name: anim-floating-6a50ffaa;
    animation-duration: 1s;
    animation-iteration-count: infinite;
  }
  .picker__drop-zone-label{
    margin-top: 30px;
    font-size: 25px;
    color: #333;
  }
  .drop-arrow {
    display: inline-block;
    div {
      display: block;
      background-repeat: no-repeat;
      background-position: 50%;
    }
    .arrow {
      width: 38.68px;
      height: 63.76px;
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 38.68 63.76' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M34.2 42.63 21.68 55V3c0-1.42-.88-3-2.34-3a3 3 0 0 0-2.66 3v52L4.47 42.63a2.68 2.68 0 0 0-1.85-.76 2.57 2.57 0 0 0-1.85.76 2.51 2.51 0 0 0 0 3.63L17.49 63a2.7 2.7 0 0 0 1.85.76 2.58 2.58 0 0 0 1.85-.76l16.72-16.75a2.51 2.51 0 0 0 0-3.63 2.69 2.69 0 0 0-3.7 0Zm0 0' fill='%23333'/%3E%3C/svg%3E");
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 0;
    }
    .base {
      width: 88.98px;
      height: 28.61px;
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 88.98 28.61' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M86.42.38A2.26 2.26 0 0 0 84 2.73v9.07a12.34 12.34 0 0 1-12 11.93H15.78C9.44 23.73 5 18.05 5 11.73V2.28A2.22 2.22 0 0 0 2.56 0 2.55 2.55 0 0 0 0 2.56v9.45a16.48 16.48 0 0 0 16.44 16.6h56.22A16.38 16.38 0 0 0 89 12.02V2.95A2.35 2.35 0 0 0 86.72.38h-.28z' fill='%23333'/%3E%3C/svg%3E");
    }
  }
}
@keyframes anim-floating-6a50ffaa {
  0% {
      transform: translateY(0)
  }

  50% {
      transform: translateY(25%)
  }

  to {
      transform: translateY(0)
  }
}

```
