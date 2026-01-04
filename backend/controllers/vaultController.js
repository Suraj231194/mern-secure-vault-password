const Vault = require('../models/Vault');
const AuditLog = require('../models/AuditLog');
const { deriveKey, encrypt, decrypt } = require('../utils/encryption');

// @desc    Create new vault entry
// @route   POST /api/vault
// @access  Private
const createEntry = async (req, res) => {
    const { title, category, content } = req.body; // Changed type to category, added content

    if (!title || !category || !content) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    try {
        const key = await deriveKey(req.user.keySalt);
        const { encryptedData, iv, authTag } = encrypt(content, key);

        const vault = await Vault.create({
            userId: req.user._id,
            title,
            category,
            encryptedPayload: encryptedData, // Renamed from encryptedData to payload in schema? Checked schema: encryptedPayload
            iv,
            authTag
        });

        await AuditLog.create({
            userId: req.user._id,
            action: 'CREATE_ENTRY',
            details: `Created ${category} entry: ${title}`,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        res.status(201).json({
            _id: vault._id,
            title: vault.title,
            category: vault.category,
            createdAt: vault.createdAt
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all vault entries (metadata only)
// @route   GET /api/vault
// @access  Private
const getEntries = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, category, isFavorite } = req.query;

        let query = { userId: req.user._id };

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        if (category) {
            query.category = category;
        }
        if (isFavorite === 'true') {
            query.isFavorite = true;
        }

        const vaults = await Vault.find(query)
            .select('-encryptedPayload -iv -authTag')
            .sort({ isFavorite: -1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Vault.countDocuments(query);

        res.status(200).json({
            vaults,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single vault entry (decrypted)
// @route   GET /api/vault/:id
// @access  Private
const getEntryById = async (req, res) => {
    try {
        const vault = await Vault.findOne({ _id: req.params.id, userId: req.user._id });

        if (!vault) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        const key = await deriveKey(req.user.keySalt);

        let content;
        try {
            content = decrypt(vault.encryptedPayload, vault.iv, vault.authTag, key);
        } catch (err) {
            return res.status(500).json({ message: 'Decryption failed. Integrity error.' });
        }

        await AuditLog.create({
            userId: req.user._id,
            action: 'VIEW_ENTRY',
            details: `Viewed ${vault.category} entry: ${vault.title}`,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        res.status(200).json({
            _id: vault._id,
            title: vault.title,
            category: vault.category,
            content,
            isFavorite: vault.isFavorite,
            createdAt: vault.createdAt,
            updatedAt: vault.updatedAt
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update vault entry
// @route   PUT /api/vault/:id
// @access  Private
const updateEntry = async (req, res) => {
    const { title, category, content, isFavorite } = req.body;

    try {
        const vault = await Vault.findOne({ _id: req.params.id, userId: req.user._id });

        if (!vault) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        if (title) vault.title = title;
        if (category) vault.category = category;
        if (isFavorite !== undefined) vault.isFavorite = isFavorite;

        if (content) {
            const key = await deriveKey(req.user.keySalt);
            const { encryptedData, iv, authTag } = encrypt(content, key);
            vault.encryptedPayload = encryptedData;
            vault.iv = iv;
            vault.authTag = authTag;
        }

        await vault.save();

        await AuditLog.create({
            userId: req.user._id,
            action: 'UPDATE_ENTRY',
            details: `Updated ${vault.category} entry: ${vault.title}`,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        res.status(200).json({
            _id: vault._id,
            title: vault.title,
            category: vault.category,
            updatedAt: vault.updatedAt
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete vault entry
// @route   DELETE /api/vault/:id
// @access  Private
const deleteEntry = async (req, res) => {
    try {
        const vault = await Vault.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

        if (!vault) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        await AuditLog.create({
            userId: req.user._id,
            action: 'DELETE_ENTRY',
            details: `Deleted ${vault.category} entry: ${vault.title}`,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        res.status(200).json({ message: 'Entry deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createEntry,
    getEntries,
    getEntryById,
    updateEntry,
    deleteEntry
};
