<template>
    <div id="roomManager" style="
        margin-left: 230px;">
        <div class="card" v-for="(item, i) in routerInfo" :key="i">
            <el-card :body-style="{ padding: '0px' }">
                <img :src=item.imgSrc
                     class="image">
                <div style="padding: 14px;">
                    <span>{{item.msg}}</span>
                    <div class="bottom clearfix">
                        <el-button type="text" class="button" @click="openTarget(item.target)">View</el-button>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: "roomManager",
        data() {
            return {
                routerInfo: [
                    {msg: "Single Room", target: "1", imgSrc: require("@/assets/roomType1.jpg")},
                    {msg: "Double Room", target: "2", imgSrc: require("@/assets/roomType2.jpg")},
                    {msg: "King-size Bed Room", target: "3", imgSrc: require("@/assets/roomType3.jpg")},
                    {msg: "Family Room", target: "4", imgSrc: require("@/assets/roomType4.jpg")}
                ]
            };
        },
        methods: {
            openTarget: function (target) {
                this.$store.state.currentRoomManagerPageID = target;
                this.$router.push({name: "roomView"});
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
