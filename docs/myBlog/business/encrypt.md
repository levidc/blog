---
title: 加密解密
date: 2025-07-04
categories:
  - 前端

tags:
  - 数据加密
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/62.jpg)

<!-- more -->

## 生成公钥及私钥

```js
加密解密
git bash
openssl genrsa -out private.pem 1024

openssl rsa -in private.pem -pubout -out public.pem
cat private.pem / cat public.pem


```

## FileReader

```js
pnpm i jsencrypt
import JSEncrypt from 'jsencrypt'

    encryptPassword (password) {
      const encryptor = new JSEncrypt()
      encryptor.setPublicKey(this.publicKey) // 公钥
      return encryptor.encrypt(password)
    },
    decryptPassword (pwd) {
      const decrypt = new JSEncrypt()
      decrypt.setPrivateKey(this.privateKey) // 私钥
      return decrypt.decrypt(pwd)
    },
```

