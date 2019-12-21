<template>
  <div id="pageHeader">
    <el-page-header @back="goback" ></el-page-header>
  </div>
</template>

<script>
export default {
  name: "pageHeader",
  methods: {
    goback() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
#pageHeader {
  float: left;
  margin-left: 230px;
}
</style>
