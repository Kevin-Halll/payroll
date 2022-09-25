const express = require('express')
const { route } = require('..')
const router = express.Router()
const db = require('../../lib/db')

router.get('/:id', (req, res) => {
    let sql = `SELECT * FROM departments`;
    let sql2 = `SELECT * FROM role_types`;
    let sql3 = `SELECT *, et.id empID, dt.id depID, rt.id roleID FROM payroll.employee et JOIN payroll.departments dt JOIN payroll.role_types rt ON et.department_id = dt.id AND et.role_id = rt.id WHERE et.id = ${req.params.id};`;
    db.query(sql, (err, deps) => {
        db.query(sql2, (errors, roles) => {
            db.query(sql3, (error, rows) => {

                if(err, errors) {
                    res.render('errors', {
                        error: err,
                        error: errors,
                        error: error,
                        layout: false
                    })
                    return
                } 
                res.render('official/employee-edit', {
                    page_title : 'Employee Info Edits',
                    deps :  deps,
                    roles : roles,
                    employee : rows[0],
                    layout : 'layouts/official-layout'
                })
            })

        })
    })

})

router.post('/', (req, res) => {
    let sql = `UPDATE employee SET ? WHERE id = ${req.body.employee_id};`;
    let removeField = delete req.body.employee_id
    db.query(sql, req.body, (err, results) => {
        if(err) {
            res.render('errors', {
                error: err,
                layout: false
            })
            return
        }
        req.flash('success', `${req.body.fname} ${req.body.lname} has been updated`) 
        res.redirect('/employee')
    })
})

router.get('/delete/:id', (req, res) => {
    db.query(`SELECT fname, lname FROM employee WHERE id = ${req.params.id}`, (error, row) =>{
        let sql = `DELETE FROM employee WHERE id = ${req.params.id}`;
        db.query(sql, (err, results) => {
            if(err) {
                res.render('errors', {
                    error: err,
                    error: error,
                    layout: false
                })
                return
            }
            req.flash('success', `${row[0].fname} ${row[0].lname} has been deleted successfully`)
            res.redirect('/employee')
        })

    })
})

module.exports = router;