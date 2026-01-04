const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';

const generateUserSalt = () => {
    return crypto.randomBytes(16).toString('hex');
};

const deriveKey = (userKeySalt) => {
    return new Promise((resolve, reject) => {
        // derive a 32-byte key using the server secret and user's salt
        crypto.scrypt(process.env.SERVER_SECRET, userKeySalt, 32, (err, derivedKey) => {
            if (err) reject(err);
            resolve(derivedKey);
        });
    });
};

const encrypt = (text, key) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');

    return {
        encryptedData: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag
    };
};

const decrypt = (encryptedData, ivHex, authTagHex, key) => {
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8'); // Will throw if auth fails

    return decrypted;
};

module.exports = { generateUserSalt, deriveKey, encrypt, decrypt };
