const express = require('express')
const router = express.Router()
const db = require('../../lib/db')

router.get('/', (req, res) => {
    res.render('official/department-add', {
        page_title : 'Add Departments',
        layout : 'layouts/official-layout'
    })
})

router.post('/', (req, res) => {
    let sql = `INSERT INTO departments SET ?;`;

    db.query(sql, req.body, (err, results) => {
        if(err) {
            res.render('errors', {
                error: err,
                layout: false
            })
            return
        }
        req.flash('success', `${req.body.department} department has been added`);
        res.redirect('/departments');
    })
})

router.get('/:id', (req, res) => {
    let sql = `SELECT * FROM departments WHERE id = ${req.params.id}`
    db.query(sql, (err, rows) => {
        if(err) {
            res.render('errors', {
                error: err,
                layout: false
            })
            return
        }
        res.render('official/department-edit', {
            page_title : 'Departments',
            dep : rows[0],
            layout : 'layouts/official-layout'
        })
    })
})

router.post('/update/:dep_id', (req, res) => {
    let sql = `UPDATE departments SET ? WHERE id = ${req.params.dep_id}`;
    db.query(sql, req.body, (err, results) => {
        if(err) {
            console.log(err);
            res.render('errors', {
                error: err,
                layout: false
            })
            return
        }
        req.flash('success', `${req.body.department} has been updated`)
        res.redirect('/departments')
    })
})

module.exports = router