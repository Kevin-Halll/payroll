const express = require('express')
const router = express.Router()
const db = require('../../lib/db')

router.get('/', (req, res) => {
    let sql = `SELECT * FROM departments`
    db.query(sql, (err, rows) => {
        if(err) {
            res.render('errors', {
                error: err,
                layout: false
            })
            return
        }
        res.render('official/departments', {
            page_title : 'Departments',
            departments : rows,
            layout : 'layouts/official-layout'
        })
    })
})


module.exports = router