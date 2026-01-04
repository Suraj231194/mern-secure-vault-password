const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const generateToken = require('../utils/generateToken');
const { generateUserSalt } = require('../utils/encryption');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const keySalt = generateUserSalt();

        const user = await User.create({
            email,
            passwordHash: password,
            keySalt
        });

        if (user) {
            generateToken(res, user._id);

            // Audit Log
            await AuditLog.create({
                userId: user._id,
                action: 'REGISTER',
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
            });

            res.status(201).json({
                _id: user._id,
                email: user.email,
                createdAt: user.createdAt
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id);

            user.lastLoginAt = new Date();
            await user.save();

            // Audit Log
            await AuditLog.create({
                userId: user._id,
                action: 'LOGIN',
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
            });

            res.json({
                _id: user._id,
                email: user.email,
                lastLoginAt: user.lastLoginAt
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });

    // Best effort audit log - might fail if no user mechanism in logout route, 
    // but better handled if we protect logout or pass user ID. 
    // Since standard logout is public, we skip audit or need to decode token manually if wanted.

    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
    const user = {
        _id: req.user._id,
        email: req.user.email,
        lastLoginAt: req.user.lastLoginAt
    };
    res.status(200).json(user);
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
};
