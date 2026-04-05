# IFN636 Assessment 1.2: Photo Gallery CRUD App

This project extends the provided IFN636 authentication starter application into a full-stack photo gallery. Registered users can log in, manage their profile, and perform complete CRUD operations on their own gallery items using React, Node.js, Express, and MongoDB Atlas.

## Features

- User registration and login with JWT authentication
- Protected profile page
- Private photo gallery per user
- Create photos with either an image URL or a local file upload
- Read, update, and delete existing photo records
- Validation for required fields and image input
- Responsive frontend with loading, empty, success, and error states

## Tech Stack

- Frontend: React, React Router, Axios, Tailwind CSS
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Multer
- Database: MongoDB Atlas

## Project Structure

- `frontend/` React client
- `backend/` Express API and MongoDB models

## Environment Variables

Create `backend/.env` with:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

Optional frontend environment variable:

```env
REACT_APP_API_URL=http://localhost:5001
```

## Local Setup

1. Install dependencies:

```bash
npm run install-all
```

2. Start the frontend and backend together:

```bash
npm run dev
```

3. Open the app at `http://localhost:3000`

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`

### Photos

- `GET /api/photos`
- `GET /api/photos/:id`
- `POST /api/photos`
- `PUT /api/photos/:id`
- `DELETE /api/photos/:id`

Photo create and update requests use `multipart/form-data` with:

- `title`
- `description`
- `category`
- `captureDate`
- `imageUrl`
- `image` optional uploaded file

If both `imageUrl` and `image` are supplied, the uploaded file is used.

## Demo Flow

1. Register a user account
2. Log in
3. Open the Gallery page
4. Create a photo using an image URL
5. Create another photo using file upload
6. Edit an existing photo
7. Delete a photo
8. Open the Profile page and update account details

## Evidence To Capture For Submission

- Register page
- Login page
- Profile page
- Gallery page with list of photos
- Create photo flow
- Edit photo flow
- Delete photo result
- MongoDB Atlas collection showing stored photo records

## Notes

- Uploaded files are stored locally under `backend/uploads/`.
- Each user can only access their own photos.
- The provided MongoDB Atlas credential should be rotated before public sharing or final submission.

## Demo Credentials

Use the following account to explore the app without registering:

```
Email:    demo@photogallery.com
Password: Demo@1234
```

> These credentials are for assessment review only.

## Public URL

The application is deployed and accessible at:

```
http://54.252.254.17:3000
```

> Replace with the actual EC2 public IP once deployed.

## Running Tests

### Frontend tests

```bash
npm test --prefix frontend -- --watchAll=false
```

Expected output:

```
PASS src/App.test.js
PASS src/components/PhotoCard.test.jsx
PASS src/components/PhotoForm.test.jsx
PASS src/components/ProtectedRoute.test.jsx
Test Suites: 4 passed, 4 total
Tests:       6 passed, 6 total
```

