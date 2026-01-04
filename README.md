# MERN Secure Vault Password 🛡️

![SecureVault Banner](https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop)

> **"Fort Knox for your Digital Secrets"**

SecureVault is a production-grade, open-source Password Manager and Secure Note storage application built with the **MERN Stack (MongoDB, Express, React, Node.js)**. It features a zero-knowledge architecture, ensuring that your sensitive data is encrypted *before* it leaves your device.

## 🚀 Live Demo

[Link to your deployed application]

## ✨ Key Features

### 🔐 Security First Architecture
-   **AES-256-GCM Encryption**: All secrets are encrypted with authenticated encryption.
-   **Client-Side Decryption**: Data is decrypted only in the browser memory. The server never sees the plaintext.
-   **PBKDF2 Key Derivation**: Master passwords are hashed with unique salts.
-   **Zero-Knowledge Storage**: We store only the encrypted blob (ciphertext + IV + Auth Tag).

### 🎨 Premium UI/UX
-   **Glassmorphism Design**: Modern, sleek interface with blur effects and deep dark modes.
-   **Framer Motion Animations**: Smooth transitions and micro-interactions.
-   **Split-Screen Auth Pages**: Professional, SaaS-like login and signup experiences.
-   **Responsive Layout**: Fully functional on desktop and mobile devices.

### 🛠️ Functionality
-   **Vault Management**: Store Passwords, Secure Notes, and Secrets.
-   **Categorization**: Organize entries by type (Note, Password, Secret).
-   **Favorites**: Pin important items for quick access.
-   **Smart Dashboard**: Search, filter, and pagination included.
-   **Auto-Lock**: Sensitive views auto-hide decrypted content after 30 seconds.

## 🏗️ Tech Stack

### Frontend
-   **React (Vite)**: Fast, modern UI library.
-   **Tailwind CSS**: Utility-first styling for the custom design system.
-   **Framer Motion**: Production-ready animation library.
-   **React Hook Form**: Performant form validation.
-   **React Icons**: Comprehensive icon library.

### Backend
-   **Node.js & Express**: Robust REST API.
-   **MongoDB & Mongoose**: Flexible, scalable database.
-   **Bcrypt.js**: Secure password hashing.
-   **Crypto (Node Native)**: For server-side cryptographic utilities.
-   **Helmet & CORS**: Enhanced security middleware.
-   **Express Rate Limit**: Brute-force protection.

## 🛠️ Installation & Setup

### Prerequisites
-   Node.js (v18+)
-   MongoDB (Local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/Suraj231194/Secure-Notes---Password-Vault-MERN-Project-.git
cd Secure-Notes---Password-Vault-MERN-Project-
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
SERVER_SECRET=your_server_side_pepper_key
NODE_ENV=development
```
Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the client:
```bash
npm run dev
```

## 🔒 Security Implementation Details

### Encryption Flow
1.  User enters `Master Password`.
2.  Frontend derives a `Key` using PBKDF2 (Password-Based Key Derivation Function 2).
3.  Data is encrypted using `AES-256-GCM` with a random IV (Initialization Vector).
4.  The `Ciphertext`, `IV`, and `AuthTag` are sent to the backend.

### Decryption Flow
1.  Backend sends encrypted blobs to the Client.
2.  Client uses the derived `Key` (from session/memory) to decrypt the data.
3.  Decrypted data is shown to the user but never saved to `localStorage` or disk.

## 📂 Project Structure

```
├── backend/
│   ├── controllers/    # Request handlers
│   ├── models/         # Database schemas (User, Vault, AuditLog)
│   ├── routes/         # API endpoints
│   ├── middlewares/    # Auth, RateLimiting
│   └── server.js       # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── pages/      # Full page views (Dashboard, Login, EntryForm)
    │   ├── context/    # Auth state management
    │   └── services/   # Axios API configuration
    └── index.css       # Tailwind & Custom styles
```

## 🤝 Contributing
Contributions are welcome! Please fork the repository and create a pull request.

## 📄 License
MIT License.

---
*Built with ❤️ by Suraj*
