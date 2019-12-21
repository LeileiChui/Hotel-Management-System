var express = require('express')
var router = express.Router()

const {
    database
} = require('./db');


const {
    env
} = require('./env')


router.get('/getAllUser', (req, res) => {
    database.retrieve("Employee", ["*"], [], (result) => {
        res.send(result)
    })
})
router.post('/login', (req, res) => {
    loginInfo = req.body
    //登录信息校验
    database.retrieve("Employee", ["*"], ["id=" + loginInfo.uid, "password= '" + loginInfo.password + "'"], (result) => {

        if (result.num == 1)
            res.send({
                "loginResult": true,
                "userInfo": result.result[0]
            })
        else
            res.send({
                "loginResult": false
            })
    })
})
//注册用户
router.post("/register", (req, res) => {

    database.create("Employee", req.body, (error, result) => {
        if (error)
            res.send("register err")
        else
            res.send(["register success", result])
    })
})
//获取当前房间类型有哪些
router.get('/getRoomType', (req, res) => {
    database.retrieve("RoomType", ["*"], [], (result) => {
        res.send(result.result)
    })
})

//根据选择的时间段和房间类型筛选可选房间
router.post('/getVacantRoom', (req, res) => {
    if (!(req.body.roomTypeID && req.body.checkInTime && req.body.checkOutTime)) {
        res.send([])
    } else {
        database.retrieve("Room", ["*"], ["Type= '" + req.body.roomTypeID + "'"], (result) => {
            roomNums = []
            let now = new Date().getTime();
            let date1 = new Date(req.body.checkInTime).getTime() - 1000 * 60 * 60 * 8;
            let date2 = new Date(req.body.checkOutTime).getTime() - 1000 * 60 * 60 * 8;
            let index1 = Math.ceil((date1 - now) / 1000 / 60 / 60 / 24) + 1;
            let index2 = Math.ceil((date2 - now) / 1000 / 60 / 60 / 24) + 1;
            for (i in result.result) {
                let item = result.result[i]
                let status = JSON.parse(item.Status)
                for (i = index1; i <= index2; i++) {
                    if (!status[i])
                        break;
                }
                if (i == index2 + 1) {
                    const roomdata = JSON.parse(item.HouseNum)
                    roomdata.id = item.id
                    roomNums.push(roomdata)
                }
            }
            res.send(roomNums)
        })
    }

})
//添加房间
router.post('/addRoom', (req, res) => {
    database.retrieve("Room", ["*"], ["HouseNum = '" + JSON.stringify(req.body.HouseNum) + "'"], (result) => {
        if (result.num != 0) {
            res.send({
                "status": "Error",
                "msg": "房间号冲突"
            })
        } else {
            data = {
                "HouseNum": JSON.stringify(req.body.HouseNum),
                "Type": req.body.roomTypeID,
                "status": env.status
            }
            database.create("Room", data, (error, result) => {
                if (error)
                    res.send([false])
                else
                    res.send([true, result])
            })

        }
    })

})
//提交预定房间信息
router.post('/placeOrder', (req, res) => {
    //冲突的信息数组
    const ambiguousUserInfo = []
    //所有的客户信息，包括随从客人
    const CustomerID = []

    const customerInfo = []
    //将信息push到数组里
    customerInfo.push({
        "name": req.body.name,
        "idNumber": req.body.idNumber
    })
    for (i in req.body.others) {
        item = req.body.others[i];
        customerInfo.push(item)
    }
    //筛选身份证号，姓名与数据库冲突的客人信息，对未保存在数据库的客户的信息自动注册
    for (i in customerInfo) {
        const item=customerInfo[i]
        database.retrieve("Customer", ["*"], ["idNumber='" + customerInfo[i].idNumber + "'"], (result) => {
            //数据库中不存在该客户的信息
            if (result.num == 0) {
                let data = {
                    "Name": item.name,
                    "idNumber": item.idNumber
                }
                //自动注册
                database.create("Customer", data, (error, result) => {
                    if (error)
                        console.log(error)
                    else {
                        CustomerID.push(result.insertId)
                    }
                })
            } else {
                
                CustomerID.push(result.result[0].id)
                //如果冲突，push到冲突数组里
                if (result.result[0].Name != item.name) {
                    ambiguousUserInfo.push(item.name)
                }
            }
        })
    }
    //从数据库中查询对应房间价钱，生成订单信息用
    database.retrieve("RoomType", ["*"], ["id='" + req.body.roomType + "'"], (result) => {
        let price = result.result[0].Price;
        let data = {}
        console.log(ambiguousUserInfo)
        if (ambiguousUserInfo.length > 0) {
            data = {
                "status": false,
                "msg": ambiguousUserInfo
            }
        } else {
            data = {
                "status": true
            }

        }
        setTimeout(() => {
            //订单信息
            let orderInfo = {
                "CustomerID": CustomerID.shift(),
                "otherCustomerID": JSON.stringify(CustomerID),
                "RoomID": req.body.roomID,
                "orderDate": req.body.date[2],
                "CheckInDate": req.body.date[0],
                "CheckOutDate": req.body.date[1],
                "Price": price
            }
            if (data.status) {
                //更新对应房间被预定时间段的可选状态
                database.create("Order", orderInfo, (error, result) => {
                    database.retrieve("Room", ["*"], ["id = " + req.body.roomID], (result) => {
                        let now = new Date(req.body.date[2]).getTime();
                        let date1 = new Date(req.body.date[0]).getTime() - 1000 * 60 * 60 * 8;
                        let date2 = new Date(req.body.date[1]).getTime() - 1000 * 60 * 60 * 8;
                        let index1 = Math.ceil((date1 - now) / 1000 / 60 / 60 / 24) + 1;
                        let index2 = Math.ceil((date2 - now) / 1000 / 60 / 60 / 24) + 1;

                        let item = result.result[0]
                        let status = JSON.parse(item.Status)
                        for (i = index1; i <= index2; i++) {
                            status[i] = false
                        }
                        const sql = "UPDATE `Server`.`Room` SET `Status` = '" + JSON.stringify(status) + "' WHERE `id` = '" + req.body.roomID + "'"
                        database.query(sql)
                    })
                })
            }
            res.send(data)
        }, 500)

    })

})

router.get('/getOrderInfo/:requireDate', (req, res) => {

    let Range = ""

    getTime = () => {
        now = new Date(Date.now())
        const year = now.getFullYear(); //取得4位数的年份
        const month = now.getMonth() + 1; //取得日期中的月份，其中0表示1月，11表示12月
        const date = now.getDate(); //返回日期月份中的天数（1到31）
        let temp = "";
        if (date < 10)
            temp = "-0";
        else
            temp = "-";
        return year + "-" + month + temp + date
    }

    if (req.params.requireDate == "today") {
        Range = " WHERE `ORDER`.orderDate = \'" + getTime() + "\'"
    }
    const SQL = 'SELECT Customer.`Name`, `ORDER`.otherCustomerID,`ORDER`.orderDate,`ORDER`.CheckInDate,`ORDER`.CheckOutDate, Room.HouseNum FROM `ORDER` JOIN `Customer` ON `ORDER`.CustomerID = Customer.id JOIN Room ON Room.id=`ORDER`.RoomID' + Range
    database.query(SQL, (error, result) => {
        res.send(result)
    })
})
router.get('/getEmployeeInfo/:requireType', (req, res) => {

    getTime = () => {
        now = new Date(Date.now())
        const year = now.getFullYear(); //取得4位数的年份
        const month = now.getMonth() + 1; //取得日期中的月份，其中0表示1月，11表示12月
        const date = now.getDate(); //返回日期月份中的天数（1到31）
        let temp = "";
        if (date < 10)
            temp = "-0";
        else
            temp = "-";
        return year + "-" + month + temp + date
    }
    let Range = "WHERE TYPE=\'" + req.params.requireType + "\'"

    const SQL = 'SELECT Name,Sex,`Position`,WorkingYears,PhoneNum FROM Employee ' + Range

    database.query(SQL, (error, result) => {
        res.send(result)
    })
})

module.exports = router