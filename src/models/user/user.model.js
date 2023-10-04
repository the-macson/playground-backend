const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Name is required.'],
    },
    username: {
        type: String,
        trim: true,
        required: [true, 'Username is required.'],
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'Email is required.'],
        unique: true,
        lowercase: true,
    },
    passwordHash: {
        type: String,
        required: [true, 'Password is required.'],
    },
    authtoken: String,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
}, {timestamps: true});

const User = mongoose.models.users || mongoose.model('users', userSchema);

module.exports = User;