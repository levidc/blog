var a_idx = 0;
var icon_idx = 0;
const emojis = [
    '❤', '😄', '😅', '😂', '😉', '😊', '😍', '😘', '😜',
    '😝', '😏', '😒', '😔', '😷', '😎',
    , '😰', '😭', '😱', '😩', '😡', '💀', '👽', ,
    '😺', '😹', '😻', '💩', '👍', '👎', '👏', '🙏', '💪'
]
function getRandom(max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
jQuery(document).ready(function ($) {
    $("body").click(function (e) {
        var a = new Array("恩赐解脱", "魂之挽歌", "梦境缠绕", "幻化之锋", "神之力量", "剑刃风暴", "幽冥一击", "雷神之怒", "霜之哀伤", "黄泉颤抖", "幽冥轰爆", "灵魂隔断");
        var $i = $("<span/>").text(a[a_idx] + emojis[icon_idx]);
        a_idx = (a_idx + 1) % a.length;
        icon_idx = (icon_idx + 1) % emojis.length;
        var x = e.pageX,
            y = e.pageY;
        $i.css({
            "z-index": 999999999999999999999999999999999999999999999999999999999999999999999,
            "top": y - 20,
            "left": x,
            "position": "absolute",
            "font-weight": "bold",
            "color": `rgb(${getRandom(255, 0)},${getRandom(255, 0)},${getRandom(255, 0)})`,
            "user-select": 'none',
            "cursor": 'default'
        });
        $("body").append($i);
        $i.animate({
            "top": y - 180,
            "opacity": 0
        },
            1500,
            function () {
                $i.remove();
            });
    });
});