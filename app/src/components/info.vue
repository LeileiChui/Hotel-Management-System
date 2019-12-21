<template>
  <div id="info">
    <el-avatar shape="square" :size="100" fit="cover" :src="this.$store.state.headPortraitURL"></el-avatar>
    <p>Name：{{this.$store.state.userInfo.Name}}</p>
    <p>Position：{{this.$store.state.userInfo.Position}}</p>
  </div>
</template>

<script>
export default {
  name: "info"
};
</script>

<style scoped>
#info {
  padding-top : 50px;
  padding-bottom : 10px;
}
</style>
