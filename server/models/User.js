import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, "Please provide a username"],
		unique: true,
	},
	email: {
		type: String,
		required: [true, "Please provide a email"],
		unique: true,
	},
	password: String,
	image: String,
	provider: String,
	providerId: String,

	isVerfied: {
		type: Boolean,
		default: false,
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
	role: {
		type: String,
		enum: ['user', 'admin'],
		required: true,
		default: 'user'
	},
	
	forgotPasswordToken: String,
	forgotPasswordTokenExpiry: Date,
	verifyToken: String,
	verifyTokenExpiry: Date,
	usernameChangeAt: { type: Date, default: null },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});


// userSchema.pre('save', async function (next) {
// 	if (this.role === 'admin') {
// 		const adminExists = await mongoose.models.User.findOne({ role: 'admin' })
// 		if (adminExists) {
// 			throw new Error('An admin already exists.')
// 		}
// 	}
// 	next()
// });


// Prevent OverwriteModelError
const UserModel = mongoose.models.User || mongoose.model('User', userSchema)

export default UserModel
