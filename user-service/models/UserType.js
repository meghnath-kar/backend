const mongoose = require('mongoose');

const userTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User type name is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    displayName: {
        type: String,
        required: [true, 'Display name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'user_types'
});

userTypeSchema.index({ name: 1 });
userTypeSchema.index({ isActive: 1 });

module.exports = mongoose.model('UserType', userTypeSchema);
