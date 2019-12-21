<template>
    <div id="orderManger">
        <div class="card" v-for="(item, i) in routerInfo" :key="i">
            <el-card :body-style="{ padding: '0px' }">
                <div style="padding: 14px;">
                    <p>{{item.msg}}</p>
                    <div class="bottom clearfix">
                        <el-button type="text" class="button" @click="openTarget(item)">View</el-button>
                    </div>
                </div>
            </el-card>
        </div>

        <div id="form">
            <el-button @click="drawer = true" type="primary" icon="el-icon-edit" style="margin-left: 16px;">
                Add Order
            </el-button>
            <el-drawer
                    :before-close="handleClose"
                    :visible.sync="drawer"
                    direction="rtl"
                    ref="drawer"
                    size="100%"
                    v-loading="formLoading"
            >
                <div class="inputForm">
                    <h1 style="margin-top: 0; margin-left: 30px;">Add Order Information</h1>
                    <el-form :model="formData" ref="formData" label-width="120px" class="form-dynamic"
                             style="padding-top: 0;padding-bottom: 0;width: 75% ">
                        <el-row :gutter="20" style="padding: 10px;">
                            <el-col :span="9">
                                <el-form-item label="FullName" required>
                                    <el-input v-model="formData.name" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="15">
                                <el-form-item label="ID Number" required>
                                    <el-input v-model="formData.idNum" clearable></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="19">
                                <el-date-picker style="width: 100% ;margin-left: 125px;"
                                                v-model="formData.date"
                                                type="daterange"
                                                range-separator="To"
                                                start-placeholder="Check In Time"
                                                end-placeholder="Check Out Time"
                                                value-format="yyyy-MM-dd"
                                                @change="getVacantRoom"
                                                :picker-options="pickerOptions">
                                </el-date-picker>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" style="padding-top: 40px;">
                            <el-col :span="9">
                                <el-form-item label="Room Type">
                                    <el-select v-model="formData.selectType" @change="getVacantRoom" clearable
                                               placeholder="Please select room type">
                                        <el-option
                                                v-for="item in roomType"
                                                :key="item.id"
                                                :label="item.TypeName"
                                                :value="item.id"
                                                :disabled="item.Remainder<=0"
                                        >
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="15">
                                <el-form-item label="Select Room">
                                    <el-select v-model="formData.selectRoom" clearable filterable
                                               placeholder="Please select room number">
                                        <el-option
                                                v-for="item in vacantRoom"
                                                :key="item.id"
                                                :label="item.address"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-collapse>
                            <el-collapse-item style="margin-left: 70px;" name="1">
                                <template slot="title">
                                    Add Accompanying Guests
                                    <el-badge :value="this.formData.domains.length"
                                              v-show="this.formData.domains.length>0"
                                              class="item">
                                        <i class="el-icon-user-solid" style="margin-left: 10px;"></i>
                                    </el-badge>
                                </template>
                                <div v-for="(domain, index) in formData.domains"
                                     :key="domain.key"
                                     :prop="'domains.' + index + '.item'"
                                >
                                    <el-row :gutter="10">
                                        <el-col :span="9">
                                            <el-form-item
                                                    :label="'Guest ' + (index+1)+' Name'"
                                                    :rules="{required: true, message: 'Content cannot be empty', trigger: 'blur'}">
                                                <el-input v-model="domain.name" clearable></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="14">
                                            <el-form-item
                                                    :label="'Guest ' + (index+1)+' ID'"
                                                    :rules="{required: true, message: 'Content cannot be empty', trigger: 'blur'}">
                                                <el-input v-model="domain.idNumber" clearable></el-input>

                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="1" style="margin-top: 8px;">
                                            <a class="remove-item"
                                               @click.prevent="removeDomain(domain)"><i
                                                    class="el-icon-close"></i></a>
                                        </el-col>
                                    </el-row>
                                </div>
                                <el-form-item class="submit-btn">
                                    <el-button icon="el-icon-delete" v-show="this.formData.domains.length>0"
                                               @click="resetForm('formData')">Empty
                                    </el-button>
                                    <el-button type="primary" icon="el-icon-plus"
                                               v-show="this.formData.domains.length<2"
                                               @click="addDomain">Add
                                    </el-button>
                                </el-form-item>
                            </el-collapse-item>
                        </el-collapse>
                    </el-form>
                    <div style="position: absolute;left: 50%; bottom: 20px;transform: translate(-50%, -50%); ">
                        <el-button @click="handleClose">Cancel</el-button>
                        <el-button type="primary" @click="handleConfirm"
                        >Confirm
                        </el-button>
                    </div>
                </div>
            </el-drawer>
        </div>

    </div>
</template>

<script>
    export default {
        name: "orderManger",
        data() {
            return {
                routerInfo: [
                    {msg: "Today's order", target: "orderView", type: "today"},
                    {msg: "All orders", target: "orderView", type: "all"}
                ],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 3600 * 1000 * 24 || time.getTime() > Date.now() + 3600 * 1000 * 24 * 29;
                    }
                },
                formLoading: false,
                //all of the room type, get from database
                roomType: [],
                //selected room type
                //Free room
                vacantRoom: [],
                //selected room
                drawer: false,
                formData: {
                    name: '',
                    idNum: '',
                    date: [],
                    now: null,
                    domains: [],
                    selectType: '',
                    selectRoom: '',
                }
            }
        },
        mounted() {
            this.$axios
                .get(this.$store.state.env.ServerHost + "/getRoomType").then(res => {
                this.roomType = res.data
            }).catch(err => {
                console.log(err)
            })
        },
        methods: {
            openTarget: function (item) {
                //   console.log(target);
                this.$store.state.currentOrderManagerType = item.type;
                this.$router.push({name: item.target});
            },
            handleConfirm() {
                if (this.formData.name && this.formData.idNum && this.formData.selectRoom) {
                    this.formLoading = true;
                    setTimeout(() => {
                        this.formLoading = false;
                        this.formData.now = this.$store.state.formatDate(new Date());
                        console.log(this.formData.now);
                        this.$axios.post(this.$store.state.env.ServerHost + "/placeOrder", {
                            name: this.formData.name,
                            idNumber: this.formData.idNum,
                            date: [this.formData.date[0], this.formData.date[1], this.formData.now],
                            others: this.formData.domains,
                            roomType: this.formData.selectType,
                            roomID: this.formData.selectRoom
                        }).then(res => {
                            if (res.data.status) {
                                this.drawer = false;
                                this.formData = {
                                    name: '',
                                    idNum: '',
                                    date: [],
                                    now: null,
                                    domains: [],
                                    selectType: '',
                                    selectRoom: '',
                                };
                                this.$notify({
                                    title: "Add Success",
                                    type: "success"
                                });
                            } else {
                                let isFirst = true;
                                let names = "";
                                for (let i in res.data.msg) {
                                    if (isFirst) {
                                        isFirst = false
                                    } else {
                                        names += ","
                                    }
                                    names += res.data.msg[i]

                                }
                                this.$notify({
                                    title: "Save Failed",
                                    message: names + "'s information conflicts with the database",
                                    type: "error"
                                });
                            }
                        });

                    }, 1000)
                } else {
                    this.$confirm('The current page has unfilled data!')
                }
            },
            handleClose(done) {
                this.$confirm('Are you sure to close? Data will not be saved!')
                    .then(_ => {
                        this.formData = {domains: []};
                        this.drawer = false;
                        done();
                    })
                    .catch(_ => {
                    });
            },
            addDomain() {
                this.formData.domains.push({
                    name: '',
                    idNum: ''
                });
            },
            /*Delete form item*/
            removeDomain(item) {
                let index = this.formData.domains.indexOf(item);
                if (index !== -1) {
                    this.formData.domains.splice(index, 1);
                }
            },
            /*Reset Form*/
            resetForm() {
                this.formData.domains = [];
            },
            getVacantRoom() {
                this.formData.selectRoom = '';
                this.vacantRoom = [];
                this.$axios.post(this.$store.state.env.ServerHost + "/getVacantRoom", {
                    roomTypeID: this.formData.selectType,
                    checkInTime: this.formData.date ? this.formData.date[0] : null,
                    checkOutTime: this.formData.date ? this.formData.date[1] : null,
                }).then(res => {
                    console.log(res.data);
                    for (const i in res.data) {
                        const item = res.data[i];
                        this.vacantRoom.push({'id': item.id, 'address': "layer " + item.layer + ", room " + item.number})
                    }
                    console.log(this.vacantRoom)
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    };
</script>

<style scoped>
    #orderManger {
        float: left;
        text-align: left;
        margin-left: 230px;
    }

    #form {
        width: 500px;
    }


    .card {
        width: 270px;
        height: 160px;
        float: left;
        margin: 80px 30px 30px 10px;
    }

    .bottom {
        margin-top: 13px;
        line-height: 12px;
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

    .form-dynamic {
        width: 650px;
        background: #fff;
        padding: 40px 20px 20px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        text-align: center;
    }

    .el-input {
        width: 95%;
    }

    .remove-item {
        color: red;
    }

    .submit-btn {
        text-align: center;
    }
</style>
