const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');


const app = express();

const router = require('./js/router');


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(router)

app.listen(3001, (err) => {
    if (err)
        console.log("ops, 服务器启动失败")
    else
        console.log('http://localhost:3001')
});