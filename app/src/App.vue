<template>
  <div id="app">
    <navigate v-if="$route.meta.hasNav" />
    <pageHeader v-if="$route.meta.hasHeader" />
    <!-- 其他页面 -->
    <router-view v-if="$route.meta.hasNav" />
    <!-- 登陆页面 -->
    <router-view v-if="!$route.meta.hasNav" />
  </div>
</template>


<script>
import navigate from "@/components/navigate.vue";
import pageHeader from "@/components/pageHeader.vue";

export default {
  name: "app",
  components: {
    navigate,
    pageHeader
  }
};
</script>



<style lang="stylus">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  margin: 0;
  color: #2c3e50;
}
</style>
