const express = require('express')
const router = express.Router()
const db = require('../../lib/db')

router.get('/', (req, res) => {
    db.query(`SELECT tsh .*, dt .*, fname, lname FROM payroll.employee et 
    JOIN payroll.timesheet tsh
    JOIN payroll.departments dt
    ON et.id = tsh.employee_id
    AND et.department_id = dt.id;`, (err, rows) => {
        if(err) {
			res.render('errors', {
				error: err,
				layout: false
			})
			return
		}
        res.render('official/payroll', {
            page_title : 'Payroll',
            payroll : rows,
            layout : 'layouts/official-layout'
        })
    })
})

module.exports = router;