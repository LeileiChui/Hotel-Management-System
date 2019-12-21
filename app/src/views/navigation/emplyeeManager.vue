<template>
    <div id="orderManger" style="margin-left: 230px;">
        <div class="card" v-for="(item, i) in routerInfo" :key="i">


            <el-card :body-style="{ padding: '0px' }">
                <img :src=item.imgSrc
                     class="image">
                <div style="padding: 14px;">
                    <span>{{item.msg}}</span>
                    <div class="bottom clearfix">
                        <el-button type="text" class="button" @click="openTarget(item)">View</el-button>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: "orderManger",
        data() {
            return {
                routerInfo: [
                    {msg: "Reception", target: "employeeView", type:"Reception", imgSrc: require("@/assets/Reception.jpg")},
                    {msg: "HouseKeeping", target: "employeeView", type:"HouseKeeping", imgSrc: require("@/assets/HouseKeeping.jpg")},
                    {msg: "FoodBeverage", target: "employeeView", type:"FoodBeverage", imgSrc: require("@/assets/FoodBeverage.jpg")},
                    {msg: "Security", target: "employeeView", type:"Security", imgSrc: require("@/assets/Security.jpg")}
                ]
            };
        },
        methods: {
            openTarget: function (item) {
                //   console.log(target);
                this.$store.state.currentEmployeeManagerType = item.type;
                this.$router.push({name: item.target});
            }
        }
    };
</script>

<style scoped>
    .card {
        width: 270px;
        height: 160px;
        float: left;
        margin: 80px 30px 30px 10px;
    }

    .image {
        width: 100%;
        display: block;
    }

    .button {
        float: right;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both;
    }
</style>
