(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{515:function(t,e,n){},561:function(t,e,n){"use strict";var i=n(3),s=n(2),r=n(66),o=s([].reverse),l=[1,2];i({target:"Array",proto:!0,forced:String(l)===String(l.reverse())},{reverse:function(){return r(this)&&(this.length=this.length),o(this)}})},562:function(t,e,n){"use strict";n(515)},573:function(t,e,n){"use strict";n.r(e);var i=n(64),s=(n(43),n(42),n(61),n(34),n(35),n(257),n(258),n(561),{name:"",data:function(){return{strs:[{title:"背负着难以赎清的罪孽的阴影",stop:5},{title:"我们约好的地点已有繁花盛开"},{title:"不顾罪孽与爱 春日终将逝去"},{title:"只剩下点点亮光还在空中闪耀"},{title:"请不要原谅我"},{title:"我渴望毁灭 也渴望重生"},{title:"我会永远在你的身边微笑"},{title:"至少要为身边重要的人们"},{title:"送去温柔的梦境"},{title:"告诉他们 我一直很幸福"},{title:"我就在你的身边"},{title:"我爱你"},{title:"我就和你在这里"},{title:"我就在你的身边"},{title:"那些时光就像是一场梦"}],currentIndex:0,spans:null,el:null}},mounted:function(){var t=this;if(this.el=document.querySelector(".hero .description"),this.el)this.init();else var e=this,n=setInterval((function(){t.el&&(n&&clearInterval(n),e.init()),t.el=document.querySelector(".hero .description")}),100)},methods:{init:function(){var t=this;this.currentIndex==this.strs.length&&(this.currentIndex=0),this.el.innerHTML=this.strs[this.currentIndex].title,this.el.innerHTML=this.el.textContent.replace(/\S/g,"<span>$&</span>");var e=0;this.spans=Object(i.a)(document.querySelectorAll(".hero .description span")),this.spans.forEach((function(n,i){e+=.1,t.strs[t.currentIndex].hasOwnProperty("stop")&&(t.strs[t.currentIndex].stop instanceof Array?t.strs[t.currentIndex].stop.includes(i)&&(e+=.3):t.strs[t.currentIndex].stop==i&&(e+=.3)),n.style.setProperty("--delay","".concat(e,"s"))})),this.el.addEventListener("animationend",this.lastEnd)},lastEnd:function(t){var e=this;t.target==document.querySelector(".hero .description span:last-child")&&(this.el.classList.add("ended"),setTimeout((function(){e.el.removeEventListener("animationend",e.lastEnd);var t=0;e.spans.reverse().forEach((function(n,i){e.el.classList.remove("ended"),n.style.width="2ch",n.style.animation="0.1s text-out ease-in-out forwards",t+=.05,n.style.animationDelay="".concat(t,"s")})),e.el.addEventListener("animationend",e.firstEnd)}),2e3))},firstEnd:function(t){t.target==document.querySelector(".hero .description span:first-child")&&(this.spans.forEach((function(t){t.remove()})),this.el.removeEventListener("animationend",this.firstEnd),this.currentIndex++,this.init())}}}),r=(n(562),n(5)),o=Object(r.a)(s,(function(){var t=this.$createElement;return(this._self._c||t)("div")}),[],!1,null,null,null);e.default=o.exports}}]);