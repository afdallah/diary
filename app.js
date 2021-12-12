const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const mongoosePaginate = require('mongoose-paginate-v2')
require('dotenv').config()


const options = {
  page: 1,
  limit: 5,
  collation: {
    locale: 'en',
  },
  customLabels: {
    totalDocs: 'total',
    docs: 'list',
  }
}

mongoosePaginate.paginate.options = options
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const notesRouter = require('./routes/notes')

const app = express()

app.use(logger('dev'))
app.use(cors())
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
