const mysql = require('mysql')

const con =mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'user'
})

con.connect((error,result) => {
    if(error) throw console.log(error)

    console.log('App is connected with database')
})

module.exports = con