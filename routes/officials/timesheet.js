const express = require('express')
const router = express.Router()
const db = require('../../lib/db')

router.get('/', (req, res) => {
    db.query(`SELECT payroll.timesheet.*, payroll.employee.id, payroll.employee.fname, payroll.employee.lname, payroll.hours_worked.hours_worked FROM payroll.timesheet JOIN payroll.employee JOIN payroll.hours_worked ON payroll.timesheet.employee_id = payroll.employee.id AND payroll.timesheet.hours_worked_id = payroll.hours_worked.id;`, (err, rows) => {
        if(err) {
			res.render('errors', {
				error: err,
				layout: false
			})
			return
		}
        res.render('official/timesheet', {
            page_title : 'Timesheet',
            times : rows,
            layout : 'layouts/official-layout'
        })
    })
})

module.exports = router;