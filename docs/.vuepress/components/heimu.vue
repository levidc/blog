<template>
  <div class="container">
    <p class="example">雀氏蟀啊，我都说了雀氏蟀了，你耳聋啊</p>
    <img
      class="hiddenImg"
      src="https://cdn.jsdelivr.net/gh/levidc/blogImg/img/31.jpg"
      style="display: none;width:30%"
    />
  </div>
</template>
<style>
@keyframes heimugc {
  to {
    color: #fff;
  }
}
.container{
    overflow: hidden;
}
.example {
  background-color: #000000;
  color: #000;
}
.example:hover {
  animation: heimugc 0.5s forwards;
}
</style>

<script>
export default {
  mounted() {
    document.querySelector(".example").onmouseenter = function () {
      document.querySelector(".hiddenImg").style.display = "block";
    };
    document.querySelector(".example").onmouseleave = function () {
      setTimeout(() => {
          document.querySelector(".hiddenImg").style.display = "none";
      }, 50);
    };
  },
};
</script>