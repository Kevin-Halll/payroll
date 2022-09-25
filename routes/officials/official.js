const express = require('express')
const router = express.Router()
const db = require('../../lib/db')

router.post('/', (req, res) => {
	let sql = `SELECT * FROM employee WHERE email = ? AND pass_code = ?;`
	login = [req.body.email, req.body.pass_code];

    db.query(sql, login, (err, rows) => {
		if(err) {
			res.render('errors', {
				error: err,
				layout: false
			})
			return
		} 
		if (rows.length <= 0) {
			req.flash('error', 'Invalid Credentials. Try again...')
			res.redirect('back')
			return
		}
		res.render('official/staff', {
			page_title : 'Official',
			log : rows,
			layout : 'layouts/official-layout'
		})
	} )
})

router.get('/user-out', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

module.exports = router