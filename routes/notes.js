const router = require('express').Router()
const { getAllNotes, addNote } = require('../controllers/notes')
const authenticate = require('../middlewares/authenticate')

router
	.get('/', getAllNotes)
	.post('/', authenticate, addNote)

module.exports = router