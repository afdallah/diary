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

exports.addNote = async function (req, res, next) {
	if (!req.body) res.status(400).json({ status: false, message: 'No request body' })

	try {
		const note = Note.create(req.body)
		return res.status(201).json({
			status: true,
			message: 'Successfully added note',
		})
	} catch (error) {
		res.status(500).json({
			status: false,
			message: 'Failed to add note',
			error: error.message
		})
	}
}