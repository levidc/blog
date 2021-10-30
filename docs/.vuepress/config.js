const moment = require('moment');
moment.locale("zh-cn")
module.exports = {
    base:'/blog/',
    title:'その日々は夢のように',
    description:'123',
    head: [
        ['link',{rel:'icon',href:'/favicon.ico'}],
        ['meta',{name:'keywords',content:'その日々は夢のように|那些时光就像是一场梦'}],
        ['meta',{name:'description',content:'その日々は夢のように|那些时光就像是一场梦'}],
        ['meta',{name:'author',content:'levidc'}]
    ],
    plugins: [
        [
          '@vuepress/last-updated',
          {
            transformer: (timestamp) => {
              // 不要忘了安装 moment
              return moment(timestamp).format("LLLL")
            }
          }
        ]
      ],
    themeConfig: {
        lastUpdated:'更新时间',
        logo: '/assets/img/logo.png',
        nav: [
            { text: 'Home', link: '/' },
            {
                text: '前端',
                items: [
                    { text: 'javaScript', link: '/frontEnd/javaScript/' },
                    { text: 'CSS', link: '/frontEnd/Css/' }
                ]
            },
            { text: 'thank', link: '/thank.html' },
            {
                text: 'Languages',
                items: [
                    {
                        text: 'Group1', items: [
                            { text: 'Guide', link: '/guide/' },
                            { text: 'thank', link: '/thank.html' },
                        ]
                    },
                    {
                        text: 'Group2', items: [
                            { text: 'Guide', link: '/guide/' },
                            { text: 'thank', link: '/thank.html' },
                        ]
                    }
                ]
            }
        ],
        sidebar: [
            '/',
            'thank',
        ]
    }
}