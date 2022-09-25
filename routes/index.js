const express = require('express')
const router = express.Router()
const db = require('../lib/db')

router.get('/', (req, res) => {
	let sql = `SELECT id, fname, lname FROM employee;`
	db.query(sql, (err, rows) => {
		if(err) {
			res.render('errors', {
				error: err,
				layout: false
			})
			return
		} 
		res.render('index', {
			page_title: 'Home',
			logs: rows
		})
		
	})
})

router.post('/', (req, res) => {
	// let sql = `INSERT INTO hours_worked SET ?`;

	if(req.body.log_option == 'time-in'){
		log = {
			employee_id : req.body.employee_id,
			start_time : req.body.start_time,
		}

		db.query(`SELECT * FROM payroll.hours_worked hw WHERE hw.employee_id = ${req.body.employee_id} AND hw.start_time LIKE '%${req.body.start_time.split('T')[0]}%';`, (errors, rows) => {
			if(rows.length <= 0) {
				let sql = `INSERT INTO hours_worked SET ?`;
				db.query(sql, log, (err, results) => {
					if(err) {
						res.render('errors', {
							error: err,
							layout: false
						})
						return
					}
					req.flash('success', 'Clocked In Successfully')
					res.redirect('/')
			
				})
	
			}else if(rows.length > 0) {
				req.flash('error', 'You have already clocked in today...')
				res.redirect('/')
				return
			}
		})
	} else if(req.body.log_option == 'time-out') {
		log = {
			employee_id : req.body.employee_id,
			end_time : req.body.end_time,
		}

		db.query(`SELECT * FROM payroll.hours_worked hw WHERE hw.employee_id = ${req.body.employee_id} AND hw.start_time LIKE '%${req.body.end_time.split('T')[0]}%' AND hw.end_time IS NULL;`, (errors, rows) => {
			if(rows.length > 0) {
				let hours_worked = Math.round(Math.abs(new Date(`${req.body.end_time}`) - new Date(`${rows[0].start_time}`))/3.6e+6);

				let sql = `UPDATE payroll.hours_worked SET end_time = '${req.body.end_time}', hours_worked = ${hours_worked} WHERE id = ${rows[0].id}`;

				let query = `SELECT hw .*, dt .*, et.fname, et.lname FROM payroll.employee et
				JOIN payroll.hours_worked hw
				JOIN payroll.departments dt
				ON et.id = hw.employee_id
				AND et.department_id = dt.id WHERE et. id = ${req.body.employee_id}`;

				db.query(query, (fail, fields) => {
					
					db.query(sql, log, (err, results) => {
						if(err) {
							console.log(req.body.end_time);
							console.log(err, error);
							res.render('errors', {
								error: err,
								error: error,
								error: fail,
								layout: false
							})
							return
						}
						
						timesheet = {
							hours_worked_id : rows[0].id,
							employee_id : rows[0].employee_id,
							date : rows[0].start_time.split(' ')[0],
							hours : (hours_worked > 8 ? 8 : hours_worked),
							overtime : (hours_worked <= 8 ? 0 : hours_worked - 8),
							standard_pay : (hours_worked > 8 ? 8 * fields[0].rate_per_hour : hours_worked * fields[0].rate_per_hour),
							overtime_pay : (hours_worked <= 8 ? 0 : (hours_worked - 8) * 1.5 * fields[0].rate_per_hour),
							total_pay :  (hours_worked > 8 ? 8 * fields[0].rate_per_hour : hours_worked * fields[0].rate_per_hour) + (hours_worked <= 8 ? 0 : (hours_worked - 8) * 1.5 * fields[0].rate_per_hour),

						}
						db.query(`INSERT INTO timesheet SET ?`, timesheet, (error, data) => {
							req.flash('success', 'Clock-out was successfully done')
							res.redirect('/')
						})
	
					})
					
					
				})
			}else if(rows.length <= 0) {
				req.flash('error', 'You may need to clock in to proceed...')
				res.redirect('/')
				return
			}
		})
	}

})
module.exports = router
