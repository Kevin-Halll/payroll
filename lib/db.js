const mysql = require('mysql')
require('dotenv').config()

const DB = mysql.createConnection({
	host: process.env.DB_HOST || 'localhost',
	user: process.env.DB_USER || 'root',
	password: process.env.DB_PASS || '',
	database: process.env.DB_NAME || process.env.APP_NAME.toLowerCase() || '',
	dateStrings: true,
})

DB.connect((err) => {
	if (err) throw err

	console.log('Database Connected')
})

module.exports = DB
