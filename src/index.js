const con= require('./connection/connection.js')
const {body, checkSchema, validationResult} = require('express-validator');
const mysql = require('mysql')
const express = require('express');
const { response } = require('express');
const app = express()

app.use(express.json())

const checker = {

    email:{
        normalizeEmail:true,
        errorMessage: "E-mail isn't valid"
    },
    name:{
        notEmpty: true,
        errorMessage: "Name field cannot be empty"
    },
    DOB:{
        custom:{
            options: (value)=> { return !isNaN(Date.parse(value))},
            errorMessage:"Date is invalid"
        }

    },
    gender: {
        custom:{
            options: (value)=>{ return value==='m'||value==='M'||value==='f'||value==='F'},
            errorMessage:"Given value of gender is not acceptable"
        }
    },
    password:{
        isStrongPassword: {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1
        },
        errorMessage: "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number"
    }

}



app.post('/registration',checkSchema(checker),(req,res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty())
    {
        return res.status(400).json({errors: errors.array()})
    }

 
    let sql = "INSERT INTO registory SET ?";
    const data = {email: req.body.email, name:req.body.name,DOB:req.body.DOB,gender:req.body.gender,password:req.body.password}


    let query = con.query(sql,data,(err,result) => {
        if(err) {
            res.status(500).json(err)
         }

        res.status(200).send('User have been registered')
    })
})

app.post('/login',(req,res) => {

    const sql = `SELECT * FROM registory WHERE email="${req.body.email}";`

    con.query(sql,(err,result) => {
        if(err){
            return res.status(500).send('Something went wrong')
        }

        if(result.length === 0)
        {
            return res.status(401).send('User does not exist in system')
        }

        if(result[0].password != req.body.password)
        {
            return res.status(401).send('Password is wrong')
        }

        return res.status(200).send('User logged in sucessfully')
    })    

})

app.get('/details',(req,res) => {

    const sql = `SELECT * FROM registory WHERE email="${req.body.email}";`

    con.query(sql,(err,result) => {
        if(err)
        {
            res.status(500).send('Something went wrong')
        }
        else
        {
            res.status(200).send(result)
        }
    })


})

app.post('/logout',(req,res) => {

    // console.log('this is logout functionality')

})

app.listen(3000,() => {
    console.log('Server is running on Port 3000 ...')
})