const mongoose = require('mongoose')
const { Schema } = mongoose;

const userSchema = new Schema({
	fullName: { type: String, trim: true, required: true },
	userName: { type: String, trime: true, unique: true, required: true},
	email: { type: String, trim: true, required: true, unique: true, lowercase: true },
	pin: { type: Number, required: true },
	hashPassword: { type: String },
	birthday: { type: Date },
	phoneNumber: { type: String, trim: true, required: true },
	role: { type: String, enum: ['consultant', 'user'], default: 'user'},
	gender: {
		type: String,
		enum: ['male', 'female'],
	}
}, {
	versionKey: false,
	timestamps: true,
})

userSchema.methods.toJSON = function (a, b) {
	const user = this.toObject()
	delete user.hashPassword
	delete user.pin
	return user
}

module.exports = mongoose.model('User', userSchema)
