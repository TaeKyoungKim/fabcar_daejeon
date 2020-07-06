var express = require('express')
var app = express()
var Util = require('./utils/Util')


app.use(express.json())

app.get('/' , async (req, res)=>{
    var result = await Util.queryAllCars()
    var resData = await JSON.parse(result)
    console.log(resData)
    res.send(resData)
})

app.get('/data' , async (req, res)=>{
    var result = await Util.queryCar()
    var resData = await JSON.parse(result)
    console.log(resData)
    res.send(resData)
})

app.get('/change' , async (req, res)=>{
    var result = await Util.changeOwner()
   
 
    res.send("Success")
})


app.listen(8000, ()=>{
    console.log(`Server is Starting at http://localhost:8000`)
})