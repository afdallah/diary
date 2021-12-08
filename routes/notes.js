const router = require('express').Router()
const {
  getAllNotes,
  addNote,
  updateNoteById,
  getNoteById,
  deleteNoteById
} = require('../controllers/notes')
const authenticate = require('../middlewares/authenticate')

router
  .get('/', authenticate, getAllNotes) // Get all notes
  .get('/:id', authenticate, getNoteById)
  .put('/:id', authenticate, updateNoteById) // update note by id
  .post('/', authenticate, addNote) // add new note
  .delete('/:id', authenticate, deleteNoteById) // delete note by id

module.exports = router
