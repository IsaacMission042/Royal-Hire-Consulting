# Royal Hire Consulting - Learning Platform

This repository contains both the frontend (client) and backend (server) for the Royal Hire Consulting Learning Platform.

## Quick Start

### 1. Installation
Run the following command in the root directory to install all dependencies for both the frontend and backend:
```bash
npm run install-all
```

### 2. Database Seeding
To populate the database with initial modules and an admin user, run:
```bash
npm run seed
```

### 3. Running the Application
To start both the frontend and backend simultaneously in development mode:
```bash
npm run dev
```

The application will be available at:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

## Project Structure
- `/client`: Next.js frontend application.
- `/server`: Node.js/Express backend application.

## Environment Variables
Ensure you have the following `.env` files configured:

### Server (`/server/.env`)
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PAYSTACK_SECRET_KEY=your_paystack_key
CLOUDINARY_URL=your_cloudinary_url
SMTP_USER=your_email
SMTP_PASS=your_email_password
```

### Client (`/client/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Admin Credentials (Default)
- **Email**: `admin@royalhire.com`
- **Password**: `admin123`
