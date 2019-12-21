<template>
  <div class="login" :style="{backgroundImage: 'url(' + background + ')' }">
    <el-form
      :model="inputdata"
      :rules="rules"
      v-loading="loading"
      status-icon
      ref="inputdata"
      label-position="left"
      class="login-page"
    >
      <h3 class="title">System Login</h3>

      <el-form-item prop="uid" label="Employee Number">
        <el-input
          type="text"
          v-model="inputdata.uid"
          clearable
          auto-complete="off"
          placeholder="Please enter employee number"
          style="width:55%; float:left ;margin-right: 10%;"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password" label="Password">
        <el-input
          type="password"
          v-model="inputdata.password"
          show-password
          auto-complete="off"
          placeholder="Please input a password"
          style="width:55%; float: right;margin-right: 12%;"
        ></el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click="handleSubmit">Sign in</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      background: require("@/assets/loginBg.png"),
      loading: false,
      inputdata: {
        uid: "",
        password: ""
      },
      rules: {
        uid: [
          {
            required: true,
            message: "Please enter your employee number",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "Please enter your password",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    handleSubmit(event) {
      this.$refs.inputdata.validate(valid => {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          if (valid) {
            this.$axios
              .post(this.$store.state.env.ServerHost + "/login", {
                uid: this.inputdata.uid,
                password: this.inputdata.password
              })
              .then(res => {
                // console.log(res)
                if (res.data.loginResult) {
                  this.loading = false;
                  this.$store.state.isLogin = true;
                  sessionStorage.setItem("isLogin", true);
                  this.$store.state.userInfo = res.data.userInfo;
                  this.$notify({
                    title: "Login successfully",
                    message:   res.data.userInfo.Name+", Welcome back ",
                    type: "success"
                  });
                  if (res.data.userInfo.headPortraitURL) {
                    this.$store.commit(
                      "CHANGE_HEAD",
                      res.data.userInfo.headPortraitURL
                    );
                  }
                  if (res.data.userInfo.Type === "Manager") {
                    console.log("change router table");
                    this.$store.commit("CHANGE_ROUTER", [
                      { name: "/orderManager", navItem: "Order management" },
                      { name: "/emplyeeManager", navItem: "Staff management" },
                      { name: "/roomManager", navItem: "Room management" }
                    ]);
                  }
                  this.$router.push({ path: "/orderManager" });
                } else {
                  this.loading = false;
                  this.$alert("Login failed", "Error", {
                    confirmButtonText: "OK"
                  });
                }
              })
              .catch(error => {
                this.loading = false;
                this.$alert("Server connection failed", "Error", {
                  confirmButtonText: "OK"
                });
              });
          } else {
            return false;
          }
        }, 1000);
      });
    }
  }
};
</script>

<style scoped>
.login {
  /* padding: 1px; */
  margin-top: 0;
  width: 100%;
  height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
}
.login-page {
  position: relative;
  top: 20vh;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  width: 420px;
  margin: auto;
  padding: 35px 35px 15px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
</style>
