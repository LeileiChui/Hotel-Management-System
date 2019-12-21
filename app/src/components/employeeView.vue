<template>
    <div id="todayOrder" style="margin-left: 250px;">
        <h1 style="left: 350px;top:30px; position: absolute">{{this.$store.state.currentEmployeeManagerType}}</h1>
        <el-table
                :data="employeeInfo"
                style="top: 150px; position: absolute;width: 871px;"
                border
        >
            <el-table-column
                    prop="Name"
                    label="Name"
                    width="150"
                    align="center"
            />
            <el-table-column
                    prop="Sex"
                    label="Sex"
                    width="180"
                    align="center"
            />

            <el-table-column
                    prop="Position"
                    label="Position"
                    width="180"
                    align="center"
            />
            <el-table-column
                    prop="WorkingYears"
                    label="Working Years"
                    width="180"
                    align="center"
            />
            <el-table-column
                    prop="PhoneNum"
                    label="PhoneNum"
                    width="180"
                    align="center"
            />
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "employeeView",
        data() {
            return {
                employeeInfo: []
            }
        },
        mounted() {
            this.$axios
                .get(this.$store.state.env.ServerHost + "/getEmployeeInfo/" + this.$store.state.currentEmployeeManagerType)
                .then(res => {
                    this.employeeInfo = res.data;
                    for (let i in res.data) {
                        let item = res.data[i];
                    }
                    console.log(this.employeeInfo)
                }).catch(err => {
                console.log(err)
            })
        }
    }
</script>

<style scoped>
</style>
