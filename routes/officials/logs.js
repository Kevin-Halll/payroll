const express = require('express')
const router = express.Router()
const db = require('../../lib/db')

router.get('/', (req, res) => {
    let sql = `SELECT et.fname, et.lname, hw.start_time, hw.end_time, hw.hours_worked FROM payroll.hours_worked hw JOIN payroll.employee et ON hw.employee_id = et.id;`
    db.query(sql, (err, rows) => {
        res.render('official/logs', {
            page_title : 'Time Logs',
            logs : rows,
            layout : 'layouts/official-layout'
        })
    })
})

module.exports = router