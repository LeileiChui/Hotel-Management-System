<template>
    <div id="navigate" v-if="$route.meta.hasNav">
        <info/>
        <div id="menu">
            <el-menu :default-active="this.$router.path" router>
                <el-menu-item
                        v-for="(item,i) in this.$store.state.routerTable"
                        :key="i"
                        :index="item.name"
                >{{ item.navItem }}
                </el-menu-item>
            </el-menu>
        </div>
        <el-button id="logout" type="danger" @click="logout">Logout</el-button>
    </div>
</template>

<script>
    import info from "@/components/info.vue";

    export default {
        name: "navigate",
        mounted() {
            // console.log(this.$store.state.routerTable);
        },
        components: {
            info
        },
        methods: {
            logout() {
                this.$confirm("Log out or not ?", "Warning", {
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancel",
                    type: "warning",
                    beforeClose: (action, instance, done) => {
                        if (action === "confirm") {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = "Executing...";
                            setTimeout(() => {
                                done();
                                setTimeout(() => {
                                    instance.confirmButtonLoading = false;
                                }, 100);
                            }, 500);
                        } else {
                            done();
                        }
                    }
                })
                    .then(() => {
                        this.$store.state.isLogin = false;
                        sessionStorage.removeItem("isLogin");
                        this.$store.state.userInfo = null;
                        this.$store.commit(
                            "CHANGE_HEAD",
                            require("@/assets/defaultHead.png")
                        );
                        this.$router.push({path: "/login"});
                    })
                    .catch(_ => {
                    });
            }
        }
    };
</script>


<style scoped>
    #navigate {
        width: 210px;
        height: 100vh;
        float: left;
        position: absolute;
        top: 0;
        left: 0;
    }

    #menu {
        width: 210px;
    }

    el-menu {
        border-right: 0;
    }

    #logout {
        position: absolute;
        bottom: 10px;
        left: 10px;
    }
</style>
