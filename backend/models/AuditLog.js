const mongoose = require('mongoose');

const auditLogSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    action: {
        type: String,
        required: true,
        enum: ['LOGIN', 'REGISTER', 'CREATE_ENTRY', 'VIEW_ENTRY', 'UPDATE_ENTRY', 'DELETE_ENTRY', 'LOGOUT']
    },
    details: {
        type: String // Optional details e.g. "Viewed 'Gmail Password'"
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
