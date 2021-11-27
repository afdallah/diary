const router = require('express').Router()
const { getAllNotes, addNote } = require('../controllers/notes')

router
	.get('/', getAllNotes)
	.post('/', addNote)

module.exports = router