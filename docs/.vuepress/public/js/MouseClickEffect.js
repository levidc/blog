;(function () {
	function r(e, n, t) {
		function o(i, f) {
			if (!n[i]) {
				if (!e[i]) {
					var c = 'function' == typeof require && require
					if (!f && c) return c(i, !0)
					if (u) return u(i, !0)
					var a = new Error("Cannot find module '" + i + "'")
					throw ((a.code = 'MODULE_NOT_FOUND'), a)
				}
				var p = (n[i] = { exports: {} })
				e[i][0].call(
					p.exports,
					function (r) {
						var n = e[i][1][r]
						return o(n || r)
					},
					p,
					p.exports,
					r,
					e,
					n,
					t
				)
			}
			return n[i].exports
		}
		for (
			var u = 'function' == typeof require && require, i = 0;
			i < t.length;
			i++
		)
			o(t[i])
		return o
	}
	return r
})()(
	{
		1: [
			function (require, module, exports) {
				var a_idx = 0
				var icon_idx = 0
				// http://emojixd.com/group/smileys-emotion
				var emoji = require('./emoji.json')
				const emojis = Object.values(emoji)

				function getRandom(max, min) {
					return Math.floor(Math.random() * (max - min + 1) + min)
				}

				let xPos = 300
				let yPos = 200
				let step = 2
				let delay = 10
				let height = 0
				let Hoffset = 0
				let Woffset = 0
				let yon = 0
				let xon = 0
				let pause = true
				let interval
				let accCount = 0
				jQuery(document).ready(function ($) {
					$('body').click(function (e) {
						var a = new Array(
							'恩赐解脱',
							'魂之挽歌',
							'梦境缠绕',
							'幻化之锋',
							'神之力量',
							'剑刃风暴',
							'幽冥一击',
							'雷神之怒',
							'霜之哀伤',
							'黄泉颤抖',
							'幽冥轰爆',
							'灵魂隔断'
						)
						var $i = $('<span/>').text(a[a_idx] + emojis[icon_idx])
						a_idx = (a_idx + 1) % a.length
						icon_idx = (icon_idx + 1) % emojis.length
						var x = e.pageX,
							y = e.pageY
						$i.css({
							'z-index': 999999999999999999999999999999999999999999999999999999999999999999999,
							top: y - 20,
							left: x,
							position: 'absolute',
							'font-weight': 'bold',
							color: `rgb(${getRandom(255, 0)},${getRandom(255, 0)},${getRandom(
								255,
								0
							)})`,
							'user-select': 'none',
							cursor: 'default',
						})
						$('body').append($i)
						$i.animate(
							{
								top: y - 180,
								opacity: 0,
							},
							1500,
							function () {
								$i.remove()
							}
						)
					})
					let div = document.createElement('div')
					div.id = 'bulin'
					document.body.appendChild(div)
					bulin.onclick = function (e) {
						if (accCount >= 1) {
							let rocket = $('<span/>').text('🚀')
							$('body').append(rocket)
							rocket.css({
								'z-index': 999999999999999999999999999999999999999999999999999999999999999999999,
								left: 0,
								bottom: 0,
								position: 'absolute',
								'font-weight': 'bold',
								color: `rgb(${getRandom(255, 0)},${getRandom(
									255,
									0
								)},${getRandom(255, 0)})`,
								'user-select': 'none',
								cursor: 'default',
								'z-index': '999999',
								'font-size': '5rem',
							})
							$('body').append(rocket)
							rocket.animate(
								{
									bottom: document.documentElement.clientHeight + 'px',
									left: document.body.clientWidth + 'px',
									// "opacity": 0,
									zoom: '2',
								},
								2000,
								function () {
									rocket.remove()
								}
							)
						}
						step += 1
						accCount += 1
					}
					function changePos() {
						width = document.body.clientWidth //body width
						let asideHeight =
							document.getElementsByTagName('aside')[0]?.offsetHeight
						height =
							document.body.clientHeight > asideHeight
								? document.body.clientHeight
								: asideHeight
						if (width < 1200) {
							//    bulin.style.zoom='.5'
						} else {
							bulin.style.zoom = '1'
						}
						Hoffset = bulin.offsetHeight // height
						Woffset = bulin.offsetWidth // width
						bulin.style.left = xPos + 'px'
						bulin.style.top = yPos + 'px'
						if (yon) {
							yPos = yPos + step
						} else {
							yPos = yPos - step
						}
						if (yPos < 0) {
							yon = 1
							yPos = 0
						}
						if (yPos >= height - Hoffset) {
							yon = 0
							yPos = height - Hoffset
						}
						if (xon) {
							xPos = xPos + step
						} else {
							xPos = xPos - step
						}
						if (xPos < 0) {
							xon = 1
							xPos = 0
							bulin.style.transform = 'rotateY(180deg)'
						}
						if (xPos >= width - Woffset) {
							xon = 0
							xPos = width - Woffset
							bulin.style.transform = 'rotateY(360deg)'
						}
					}
					function start() {
						bulin.visibility = 'visible'
						interval = setInterval(() => {
							changePos()
						}, delay)
					}
					// function pause_resume() {
					// 	if (pause) {
					// 		clearInterval(interval)
					// 		pause = false
					// 	} else {
					// 		interval = setInterval(changePos(), delay)
					// 		pause = true
					// 	}
					// }
					start()
				})
			},
			{ './emoji.json': 2 },
		],
		2: [
			function (require, module, exports) {
				module.exports = {
					smiley: '😃',
					smile: '😄',
					grin: '😁',
					laughing: '😆',
					sweat_smile: '😅',
					joy: '😂',
					blush: '😊',
					innocent: '😇',
					wink: '😉',
					relieved: '😌',
					heart_eyes: '😍',
					kissing_heart: '😘',
					yum: '😋',
					disappointed: '😞',
					weary: '😩',
					angry: '😠',
					rage: '😡',
					no_mouth: '😶',
					dizzy_face: '😵',
					flushed: '😳',
					scream: '😱',
					cold_sweat: '😰',
					sob: '😭',
					mask: '😷',
					hot: '🥵',
				}
			},
			{},
		],
	},
	{},
	[1]
)
