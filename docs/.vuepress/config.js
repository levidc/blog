const moment = require('moment')
const emoj = require('./public/js/emo.json')
moment.locale('zh-cn')
module.exports = {
	base: '/blog/',
	title: 'その日々は夢のように',
	description: '那些时光就像是一场梦',
	theme: 'reco',
	head: [
		[
			'script',
			{
				src: 'https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js',
			},
		],
		// 引入鼠标点击脚本
		[
			'script',
			{
				src: '/js/MouseClickEffect.js',
			},
		],
		['link', { rel: 'icon', href: '/favicon.ico' }],
		[
			'meta',
			{
				name: 'viewport',
				content: 'width=device-width,initial-scale=1,user-scalable=no',
			},
		],
		[
			'meta',
			{
				name: 'keywords',
				content: 'その日々は夢のように|那些时光就像是一场梦',
			},
		],
		[
			'meta',
			{
				name: 'description',
				content: 'その日々は夢のように|那些时光就像是一场梦',
			},
		],
		['meta', { name: 'author', content: 'levidc' }],
	],
	keyPage: {
		keys: ['ef205c81732d0183c2b855100d823643'], // 1.3.0 版本后需要设置为密文
		color: '#42b983', // 登录页动画球的颜色
		lineColor: '#42b983', // 登录页动画线的颜色
	},
	plugins: [
		[
			'@vuepressplugin-medium-zoom',
			{
				selector: '.page img',
				delay: 1000,
				options: {
					margin: 24,
					background: 'rgba(25,18,25,0.9)',
					scrollOffset: 40,
				},
			},
		],
		[
			'vuepress-plugin-nuggets-style-copy',
			{
				copyText: 'copy',
				tip: {
					content: 'ok!',
				},
			},
		],
		[
			'@vuepress/last-updated',
			{
				transformer: (timestamp) => {
					// 不要忘了安装 moment
					return moment(timestamp).format('lll')
				},
			},
		],
		[
			'vuepress-plugin-auto-sidebar',
			{
				collapse: {
					open: true,
				},
			},
		],
		[
			'dynamic-title',
			{
				// Icon 建议根据自身需求选择
				showIcon: '/blog/favicon.ico',
				showText: '',
				hideIcon: '/blog/favicon.ico',
				hideText: 'talk is cheap, show me the code',
				recoverTime: 2000,
			},
		],
		[
			'meting',
			{
				meting: {
					// 网易
					server: 'netease',
					// 读取歌单列表
					type: 'playlist',
					mid: '7041268108',
				},
				// 不配置该项的话不会出现全局播放器
				aplayer: {
					// 吸底模式
					fixed: true,
					mini: true,
					// 自动播放
					autoplay: true,
					// 歌曲栏折叠
					listFolded: true,
					// 颜色
					theme: '#A95AF5',
					// 播放顺序为随机
					order: 'random',
					// 初始音量
					volume: 0.1,
					// 关闭歌词显示
					lrcType: 0,
				},
				mobile: {
					// 手机端去掉cover图
					cover: false,
				},
			},
		],
		// [
		//     '@vuepress-reco/vuepress-plugin-kan-ban-niang', {
		//         theme: [
		//             'miku', 'whiteCat', 'haru1', 'haru2', 'haruto', 'koharu', 'izumi', 'shizuku', 'wanko', 'blackCat', 'z16'
		//         ],
		//         clean: false,
		//         messages: {
		//             welcome: '欢迎来到我的博客',
		//             home: '数悉日春花,盼明日再会',
		//             theme: '好吧，希望你能喜欢我的其他小伙伴。',
		//             close: '你不喜欢我了吗？痴痴地望着你。'
		//         },
		//         messageStyle: { right: '68px', bottom: '290px' },
		//         width: 250,
		//         height: 320
		//     }
		// ],
	],
	themeConfig: {
		type: 'blog',
		lastUpdated: '最后更新于',
		logo: '/assets/img/avatar.jpg',
		author: 'levidc',
		authorAvatar: '/assets/img/logo.png',
		search: true,
		searchMaxSuggestions: 10,
		subSidebar: 'auto',
		sidebarDepth: 1,
		displayAllHeaders: false,
		valineConfig: {
			appId: 'toBjqpnUIs3DNiGRm5rpvSFN-gzGzoHsz', // your appId
			appKey: '8YdrFTb94nOjxWxe6XgKHC4b', // your appKey
			placeholder: '留下你帅气的笔迹',
			visitor: true,
			emojiCDN: 'https://cdn.jsdelivr.net/gh/GamerNoTitle/ValineCDN/Tieba-New/',
			// 表情title和图片映射
			emojiMaps: emoj,
		},
		blogConfig: {
			category: {
				location: 2, // 在导航栏菜单中所占的位置，默认2
				text: 'Category', // 默认文案 “分类”
			},
			// tag: {
			//     location: 3,     // 在导航栏菜单中所占的位置，默认3
			//     text: 'Tag'      // 默认文案 “标签”
			// },
			socialLinks: [
				// 信息栏展示社交信息
				{ icon: 'reco-github', link: 'https://github.com/recoluan' },
				{ icon: 'reco-npm', link: 'https://www.npmjs.com/~reco_luan' },
			],
		},
		nav: [
			{ text: 'Home', link: '/', icon: 'reco-home' },
			{
				text: 'tag',
				items: [
					{ text: 'javaScript', link: '/tag/js/' },
					{ text: 'CSS', link: '/tag/css/' },
					{ text: 'Vue', link: '/tag/vue/' },
					{ text: 'linux', link: '/tag/linux/' },
					{ text: 'Game', link: '/tag/game/' },
					{ text: '日常', link: '/tag/日常/' },
				],
				icon: 'reco-tag',
			},
			{
				text: 'HELP',
				items: [
					{
						text: 'vuepress',
						link: 'https://vuepress.vuejs.org/zh/',
					},
					{ text: 'can i use', link: 'https://caniuse.com/' },
					{
						text: 'MDN',
						link: 'https://developer.mozilla.org/zh-CN/',
					},
					{ text: 'PS', link: 'https://ps.gaoding.com/#/' },
				],
				icon: 'reco-coding',
			},
			{ text: '时间轴', link: '/timeline/', icon: 'reco-date' },
			{
				text: 'mine',
				icon: 'reco-message',
				items: [
					{
						text: 'GitHub',
						link: 'https://github.com/levidc',
						icon: 'reco-github',
					},
					// { text: '博客园', link: 'https://cnblogs.com/glassysky', icon: 'reco-bokeyuan' },
					// { text: '掘金', link: 'https://juejin.im', icon: 'reco-juejin' },
					{
						text: '码云',
						link: 'https://gitee.com/levidc',
						icon: 'reco-mayun',
					},
					{
						text: '哔哩哔哩',
						link: 'https://space.bilibili.com/6654841',
						icon: 'reco-bilibili',
					},
					// { text: 'Twitter', link: 'https://twitter.com/GLASSYSKY113', icon: 'reco-twitter' }
				],
			},

			// {
			//     text: 'Languages',
			//     items: [
			//         {
			//             text: 'Group1', items: [
			//                 { text: 'Guide', link: '/guide/' },
			//                 { text: 'thank', link: '/thank.html' },
			//             ]
			//         },
			//         {
			//             text: 'Group2', items: [
			//                 { text: 'Guide', link: '/guide/' },
			//                 { text: 'thank', link: '/thank.html' },
			//             ]
			//         }
			//     ]
			// }
		],
		friendLink: [
			{
				title: '午后南杂',
				desc: 'Enjoy when you can, and endure when you must.',
				logo: 'https://photo.smallsunnyfox.com/images/blog/friendlink/reco.png',
				link: 'https://www.recoluan.com',
			},
			{
				title: 'vuepress-theme-reco',
				desc: 'A simple and beautiful vuepress Blog & Doc theme.',
				logo: 'https://photo.smallsunnyfox.com/images/blog/friendlink/theme_reco.png',
				link: 'https://vuepress-theme-reco.recoluan.com',
			},
		],
	},
}
