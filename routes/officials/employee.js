const express = require('express')
const { route } = require('..')
const router = express.Router()
const db = require('../../lib/db')

const getData2 = (sql, callback) => {
   
    db.query(sql, (err, rows) => {
        callback(rows);
    })
}
const getData = (resolve, reject) => { 
    let sql = `SELECT * FROM departments`;
    db.query(sql, (err, rows) => {
        if(err){
            return reject('failed...')
        }
        return resolve(rows)
    })
}

router.get('/', (req, res) => {
    let sql = `SELECT *, et.id empID FROM payroll.employee et JOIN payroll.departments dt JOIN payroll.role_types rt ON et.department_id = dt.id AND et.role_id = rt.id;`
    db.query(sql, (err, rows) => {
        res.render('official/employees', {
            page_title : 'Employees',
            employees : rows,
            layout : 'layouts/official-layout'
        })
    })
})

router.get('/employee', (req, res) => {
    let sql = `SELECT * FROM departments`;
    let sql2 = `SELECT * FROM role_types`;
    db.query(sql, (err, deps) => {
        db.query(sql2, (errors, roles) => {
            if(err, errors) {
                res.render('errors', {
                    error: err,
                    error: errors,
                    layout: false
                })
                return
            } 
            res.render('official/add-employee', {
                page_title : 'Employee Info',
                deps :  deps,
                roles : roles,
                layout : 'layouts/official-layout'
            })

        })
    })

})

router.post('/submit', (req, res) => {
    let sql = `INSERT INTO employee SET ?;`;
    employee = {
        department_id : req.body.department_id,
        fname : req.body.fname,
        lname : req.body.lname,
        email : req.body.email,
        phone_nm : req.body.phone_nm,
        TRN : req.body.trn,
        NIS : req.body.nis,
        role_id : req.body.role_id,
        pass_code : req.body.pass_code
    }

    db.query(sql, employee, (err, results) => {
		if(err) {
			res.render('errors', {
				error: err,
				layout: false
			})
			return
		}
		req.flash('success', `${req.body.fname} ${req.body.lname} have been added successfully`)
		res.redirect('/employee')

	})
})

module.exports = router