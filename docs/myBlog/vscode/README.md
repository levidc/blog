---
title: vscode配置、插件及快捷键相关
date: 2021-11-11
categories:
  - 编程

tags:
  - 工具
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/33.jpg)

<!-- more -->

## 快捷键

```js
crtl + g跳转行数
ctrl + l 选中多行
shift + alt + ↓  复制当前行代码
ctrl +  → 右跳转
shift+alt+F 代码格式化
ctrl + X 剪切当前行代码
```

## 插件

```js
auto close tag
chinese
koroFileHeader
live Server
path intellisence
prettier-code formatter
vetur
vue
open in browser
eslint
```

## setting 配置

```js
  {
	"open-in-browser.default": "chrome",
	"fileheader.customMade": {
		"autoAdd": false
	},
	// vscode默认启用了根据文件类型自动设置tabsize的选项
	"editor.detectIndentation": false,
	// 重新设定tabsize
	"editor.tabSize": 2,
	// #值设置为true时，每次保存的时候自动格式化；值设置为false时，代码格式化请按shift+alt+F
	"editor.formatOnSave": true,
	// #每次保存的时候将代码按eslint格式进行修复
	"eslint.autoFixOnSave": false,
	// 添加 vue 支持
	"eslint.validate": [
		"javascript",
		"javascriptreact",
		{
			"language": "vue",
			"autoFix": true
		}
	],
	//  #让prettier使用eslint的代码格式进行校验
	"prettier.eslintIntegration": true,
	//  #去掉代码结尾的分号
	"prettier.semi": false,
	//  #使用带引号替代双引号
	"prettier.singleQuote": true,
	"prettier.tabWidth": 2,
	//  #让函数(名)和后面的括号之间加个空格
	"javascript.format.insertSpaceBeforeFunctionParenthesis": true,
	// #这个按用户自身习惯选择
	"vetur.format.defaultFormatter.html": "js-beautify-html",
	// #让vue中的js按"prettier"格式进行格式化
	"vetur.format.defaultFormatter.js": "prettier",
	"vetur.format.defaultFormatterOptions": {
		"js-beautify-html": {
			// #vue组件中html代码格式化样式
			"wrap_attributes": "force-aligned", //也可以设置为“auto”，效果会不一样
			"wrap_line_length": 200,
			"end_with_newline": false,
			"semi": false,
			"singleQuote": true
		},
		"prettier": {
			"semi": false,
			"singleQuote": true
		}
	},
	"[jsonc]": {
		"editor.defaultFormatter": "esbenp.prettier-vscode"
	},
	// 格式化stylus, 需安装Manta's Stylus Supremacy插件
	// "stylusSupremacy.insertColons": false, // 是否插入冒号
	// "stylusSupremacy.insertSemicolons": false, // 是否插入分号
	// "stylusSupremacy.insertBraces": false, // 是否插入大括号
	// "stylusSupremacy.insertNewLineAroundImports": false, // import之后是否换行
	// "stylusSupremacy.insertNewLineAroundBlocks": false,
	"prettier.useTabs": true,
	"files.autoSave": "afterDelay",
	"explorer.confirmDelete": false,
	"[javascript]": {
		"editor.defaultFormatter": "esbenp.prettier-vscode"
	},
	"[json]": {
		"editor.defaultFormatter": "esbenp.prettier-vscode"
	},
	"diffEditor.ignoreTrimWhitespace": false,
	"editor.codeActionsOnSave": {
		"source.fixAll.eslint": true
	},
	"[html]": {
		"editor.defaultFormatter": "esbenp.prettier-vscode"
	},
	"editor.fontSize": 16, // 两个选择器中是否换行
	"editor.fontFamily": "Consolas, 'Courier New', monospace"
}


```
