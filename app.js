const express = require('express')
const logger = require('morgan')
require('dotenv').config()

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const notesRouter = require('./routes/notes')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', indexRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/notes', notesRouter)
app.use('*', function(req, res, next) {
  res.status(404).json({
    status: 404,
    message: 'Not found'
  })
})

// error handler
app.use(function (err, req, res, next) {
  const { statusCode = 400, message } = err

  res.status(statusCode).json({
    status: false,
    message,
  })
})

module.exports = app
