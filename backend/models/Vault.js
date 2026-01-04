const mongoose = require('mongoose');

const vaultSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['note', 'password', 'secret'],
        default: 'note'
    },
    encryptedPayload: {
        type: String,
        required: true
    },
    iv: {
        type: String,
        required: true
    },
    authTag: {
        type: String,
        required: true
    },
    isFavorite: {
        type: Boolean,
        default: false,
        index: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Vault', vaultSchema);
