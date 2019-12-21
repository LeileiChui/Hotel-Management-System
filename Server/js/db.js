const bcryptjs = require('bcryptjs');
const mysql = require('mysql');


const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Server',
    multipleStatements: true
})

const length = (result, callback) => {
    num = 0
    for (i in result)
        num++
    callback({
        "num": num,
        "result": result
    })
}


database.connect((error) => {
    if (error) {
        console.log("数据库连接失败")
        console.log(error)
    } else
        console.log("数据库连接成功")
})

//数据库查询函数
database.retrieve = async (tableName, columns, params, callback) => {
    let sql = "SELECT "
    const reply = null
    for (let i in columns) {
        if (i != 0)
            sql += " , "
        sql += columns[i]
    }

    sql += " FROM " + tableName

    for (let i in params) {
        if (i != 0)
            sql += " and "
        else
            sql += " WHERE "
        sql += params[i]
    }
    console.log(sql)
    database.query(sql, (error, result) => {
        if (error) {
            console.log("ops,出错了鸭")
            console.log(error)
            callback(error)
        } else {
            length(result, callback)
        }
    })
};

//数据库插入函数
database.create = async (tableName, data, callback) => {
    sql = "INSERT INTO " + "`" + tableName + "` "
    columns = ""
    values = ""
    let isFirst = true
    for (i in data) {
        if (isFirst)
            isFirst = false
        else {
            columns += ", "
            values += ", "
        }
        columns += "`" + i + "`"
        values += "'" + data[i] + "'"
    }
    sql += "(" + columns + ") VALUES (" + values + ")"
    console.log(sql)
    database.query(sql, (error, result) => {
        if (error) {
            console.log("ops,出错了鸭")
            console.log(error)
            callback(error, result)
        } else {
            console.log("数据插入成功")
            callback(error, result)
        }
    })

}

module.exports = {
    database
}