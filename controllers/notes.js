const Note = require('../models/Note')

exports.getAllNotes = async function (req, res, next) {
  try {
    const notes = await Note.find({})

    return res.status(200).json({
      status: true,
      message: 'Successfully fetch all notes',
      notes
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch all notes',
      error: error.message
    })
  }
}

exports.getNoteById = async function (req, res, next) {
  if (!req.params.id)
    return res.status(400).json({ status: false, message: 'No id provided' })

  try {
    const note = await Note.findById(req.params.id)

    return res.status(200).json({
      status: true,
      message: 'Successfully fetch note',
      note
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch note',
      error: error.message
    })
  }
}

exports.addNote = async function (req, res, next) {
  if (!req.body)
    res.status(400).json({ status: false, message: 'No request body' })
  if (!req.user) res.status(401).json({ status: false, message: 'No user' })

  console.log(req.body)
  try {
    const note = Note.create({ ...req.body, user: req.user._id })
    return res.status(201).json({
      status: true,
      message: 'Successfully added note'
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to add note',
      error: error.message
    })
  }
}

// Update note by id
module.exports.updateNoteById = function (req, res, next) {
  if (!req.params.id)
    return res.status(400).json({
      status: false,
      message: 'No note id supplied'
    })

  Note.findByIdAndUpdate(req.params.id, req.body)
    .then(note => {
      if (!note)
        return res.status(404).json({
          status: false,
          message: 'Note not found'
        })

      return res.status(200).json({
        status: true,
        message: 'Successfully updated note',
        // note: req.body
        note: { ...note.toObject(), ...req.body }
      })
    })
    .catch(err =>
      res.status(500).json({
        status: false,
        message: err.message
      })
    )
}

exports.deleteNoteById = function (req, res, next) {
  if (!req.params.id)
    return res.status(400).json({
      status: false,
      message: 'No note id supplied'
    })

  Note.findByIdAndRemove(req.params.id)
    .then(note => {
      if (!note)
        return res.status(404).json({
          status: false,
          message: 'Note not found'
        })

      return res.status(200).json({
        status: true,
        message: 'Successfully deleted note'
      })
    })
    .catch(err =>
      res.status(500).json({
        status: false,
        message: err.message
      })
    )
}
