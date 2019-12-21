<template>
    <div id="todayOrder" style="margin-left: 250px;">
        <h1 style="left: 400px;top:30px; position: absolute">{{this.title}}</h1>
        <el-table
                :data="orderInfo"
                style="top: 150px; position: absolute;width: 871px;"
                border
        >
            <el-table-column
                    prop="Name"
                    label="Name"
                    width="120"
                    align="center"
            />
            <el-table-column
                    prop="guestNum"
                    label="Number of Guests"
                    width="150"
                    align="center"
            />

            <el-table-column
                    prop="roomAddress"
                    label="Room Address"
                    width="150"
                    align="center"
            />
            <el-table-column
                    prop="orderDate"
                    label="Order Date"
                    width="150"
                    align="center"
            />
            <el-table-column
                    prop="CheckInDate"
                    label="Check-in Date"
                    width="150"
                    align="center"
            />
            <el-table-column
                    prop="CheckOutDate"
                    label="Check-out Date"
                    width="150"
                    align="center"
            />
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "orderView",
        data() {
            return {
                orderInfo: [],
                title:""
            }
        },
        mounted() {
            if (this.$store.state.currentOrderManagerType==="today")
                this.title="Today's order";
            else
                this.title="All orders";
            this.$axios
                .get(this.$store.state.env.ServerHost + "/getOrderInfo/" + this.$store.state.currentOrderManagerType)
                .then(res => {
                    this.orderInfo = res.data;
                    for (let i in res.data) {
                        let item = res.data[i];
                        this.orderInfo[i].guestNum = JSON.parse(item.otherCustomerID).length;
                        this.orderInfo[i].roomAddress = "layer " + JSON.parse(item.HouseNum).layer + ",room " + JSON.parse(item.HouseNum).number;
                    }
                    console.log(this.orderInfo)
                }).catch(err => {
                console.log(err)
            })
        }
    }
</script>

<style scoped>
</style>
