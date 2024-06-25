---
title: vscode配置、插件及快捷键相关
date: 2024-06-25
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
volar
auto rename tag
chatGPT-chatMoss
Date & Time
GitLens
i18n Ally
Iconify IntelliSense
LeetCode
LiveServer
Vue-Offical
WindiCSS IntelliSense
```
## 用户代码片段
文件=>首选项=>配置用户代码片段
```js
	"Print to explain": {
		"prefix": "funn",
		"body": [
			"/**",
			" * @func $1",
			" * @Description $2",
			" * @Author: your name",
			" * @param {$3} $4 $5",
			" * @return {$6} $7",
			" */"
		],
		"description": "a func mode"
	},
	"Print to console": {
		"prefix": "vue",
		"body": [
			// "<!--",
			// "* @Description: $0",
			// "* @Author: your name",
			// "* @Date: $CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE $CURRENT_HOUR:$CURRENT_MINUTE:$CURRENT_SECOND",
			// "* @LastEditTime: $CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE $CURRENT_HOUR:$CURRENT_MINUTE:$CURRENT_SECOND",
			// "* @LastEditors: Please set LastEditors",
			// "-->",
			"",
			"<template>",
			"<div></div>",
			"</template>",
			"",
			"<script>",
			"export default {",
			"name: '',",
			"props: {},",
			"components: {},",
			"data() {",
			"return {",
			"};",
			"},",
			"computed: {},",
			"watch: {},",
			"methods: {},",
			"created() {},",
			"mounted() {}",
			"};",
			"</script>",
			"<style lang=\"scss\" scoped>",
			"</style>"
		],
		"description": "A vue file template"
	},

```


## setting 配置

```js
 {
	"open-in-browser.default": "chrome",
	"fileheader.customMade": {
	  "autoAdd": false
	},
	"editor.fontSize": 16, // 两个选择器中是否换行
	"editor.fontFamily": "Consolas, 'Courier New', monospace",
	//设置文字大小

	//设置文字行高
	"editor.lineHeight": 24,

	//开启行数提示
	"editor.lineNumbers": "on",

	// 在输入时显示含有参数文档和类型信息的小面板。
	"editor.parameterHints.enabled": true,

	// 自动换行
	"editor.wordWrap": "on",

	// 自定义vscode面板颜色
	"workbench.colorCustomizations": {
	  "tab.activeBackground": "#46a177", // 活动选项卡的背景色
	  "activityBar.background": "#214386", //活动栏背景色
	  // "sideBar.background": "#193a2f", //侧边栏背景色
	  "activityBar.foreground": "#17bd96", //活动栏前景色(例如用于图标),
	  // "editor.background": "#292a2c" //编辑器背景颜色
	  // "editor.foreground":"#ff0000", 	//编辑器默认前景色
	  // "editor.findMatchBackground":"#23f8c8", 	//当前搜索匹配项的颜色
	  // "editor.findMatchHighlightBackground":"#ff0000", 	//其他搜索匹配项的颜色
	  // "editor.lineHighlightBackground":"#ff0000", 	//光标所在行高亮文本的背景颜色
	  // "editor.selectionBackground":"#ff0000", 	//编辑器所选内容的颜色
	  // "editor.selectionHighlightBackground":"#ff0000", 	//与所选内容具有相同内容的区域颜色
	  // "editor.rangeHighlightBackground":"#ff0000", 	//突出显示范围的背景颜色，例如 "Quick Open" 和“查找”功能
	  // "editorBracketMatch.background":"#ff0000", 	//匹配括号的背景色
	  // "editorCursor.foreground":"#ff0000", 	//编辑器光标颜色
	  // "editorGutter.background":"#ff0000", 	//编辑器导航线的背景色，导航线包括边缘符号和行号
	  // "editorLineNumber.foreground":"#ff0000", 	//编辑器行号颜色
	  // "sideBar.foreground":"#ff0000", 	//侧边栏前景色
	  // "sideBarSectionHeader.background":"#ff0000", 	//侧边栏节标题的背景颜色
	  // "statusBar.background":"#ff0000", 	//标准状态栏背景色
	  // "statusBar.noFolderBackground":"#ff0000", 	//没有打开文件夹时状态栏的背景色
	  // "statusBar.debuggingBackground":"#ff0000", 	//调试程序时状态栏的背景色
	  // "tab.activeForeground":"#ff0000", 	//活动组中活动选项卡的前景色
	  "tab.inactiveBackground":"#6c2d79", 	//非活动选项卡的背景色
	  // "tab.inactiveForeground":"#9b2828"  // 活动组中非活动选项卡的前景色
	},
	// vscode默认启用了根据文件类型自动设置tabsize的选项
	"editor.detectIndentation": false,

	// 重新设定tabsize
	"editor.tabSize": 2,

	// #每次保存的时候自动格式化
	"editor.formatOnSave": true,

	//  #让函数(名)和后面的括号之间加个空格
	"javascript.format.insertSpaceBeforeFunctionParenthesis": true,

	// #这个按用户自身习惯选择
	"vetur.format.defaultFormatter.html": "js-beautify-html",

	// #让vue中的js按编辑器自带的ts格式进行格式化
	"vetur.format.defaultFormatter.js": "vscode-typescript",

	// 保存时运行的代码ESLint操作类型。
	"editor.codeActionsOnSave": {
	  "source.fixAll.eslint": true
	},

	// 添加emmet支持vue文件
	"emmet.includeLanguages": {
	  "wxml": "html",
	  "vue": "html"
	},

	// 两个选择器中是否换行
	"minapp-vscode.disableAutoConfig": true,

	//快速预览（右侧）
	"editor.minimap.enabled": true,

	// tab 代码补全
	"files.associations": {
	  "*.wpy": "vue",
	  "*.vue": "vue",
	  "*.cjson": "jsonc",
	  "*.wxss": "css",
	  "*.wxs": "javascript"
	},

	// 用来配置如何使用ESLint CLI引擎API启动ESLint。 默认为空选项
	"eslint.options": {
	  "extensions": [".js", ".vue"]
	},

	// 在onSave还是onType时执行linter。默认为onType。
	"eslint.run": "onSave",

	// 启用ESLint作为已验证文件的格式化程序。
	"eslint.format.enable": true,

	// 语言标识符的数组，为此ESLint扩展应被激活，并应尝试验证文件。
	"eslint.probe": ["javascript", "javascriptreact", "vue-html", "vue", "html"],

	//关闭rg.exe进程 用cnpm导致会出现rg.exe占用内存很高
	"search.followSymlinks": false,

	// 给js-beautify-html设置属性隔断
	"vetur.format.defaultFormatterOptions": {
	  "js-beautify-html": {
		"wrap_attributes": "force-aligned",
		"max_preserve_newlines": 0
	  }
	},

	// style默认偏移一个indent
	"vetur.format.styleInitialIndent": true,

	// 定义匿名函数的函数关键字后面的空格处理。
	"javascript.format.insertSpaceAfterFunctionKeywordForAnonymousFunctions": true,

	// 定义函数参数括号前的空格处理方式。
	"typescript.format.insertSpaceBeforeFunctionParenthesis": true,

	// // 新版本消息
	// "vsicons.dontShowNewVersionMessage": true,

	// 控制资源管理器是否在把文件删除到废纸篓时进行确认。
	"explorer.confirmDelete": false,

	// 使用eslint-plugin-vue验证<template>中的vue-html
  "vetur.validation.template": false,
	"[html]": {
	  "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "files.autoSave": "afterDelay"
  }


```
