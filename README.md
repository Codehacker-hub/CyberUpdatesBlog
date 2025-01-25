# CyberUpdates Blog App

CyberUpdates Blog App is a modern web application designed for sharing and managing blog posts. It consists of a **frontend** and **backend** built with cutting-edge technologies to deliver a seamless experience for users.

---

## Features

### Frontend:
- React.js with **Vite** for fast development and optimized builds.
- Rich text editing with **Tiptap** and **React-Quill**.
- Infinite scroll for posts.
- **React Query** for efficient data fetching and state management.
- Image uploads powered by **ImageKit**.
- User authentication and authorization using **Clerk**.
- Real-time notifications and updates.
- Styled with **TailwindCSS**.
- Secure sanitization of content with **DOMPurify**.

### Backend:
- **Express.js** framework.
- Authentication and authorization using **Clerk SDK**.
- Rate limiting with **Express-Rate-Limit** for enhanced security.
- Image uploads and media handling using **ImageKit**.
- MongoDB integration using **Mongoose**.
- Request validation with **Express Validator**.
- Environment configuration via **dotenv**.

---

## Installation

Follow these steps to set up the project on your local machine:

### Prerequisites:
- Node.js (v18+ recommended)
- MongoDB instance (local or cloud-based, e.g., MongoDB Atlas)
- Clerk account for authentication
- ImageKit account for media storage

### Clone the Repository:
```bash
git clone https://github.com/your-repo/cyberupdates-blog-app.git
cd cyberupdates-blog-app
```

### Set Up Environment Variables:
Create `.env` files in the `frontend` and `backend` folders with the necessary configurations.

#### Backend `.env`:
```env
MONGODB_URI=
CLERK_WEBHOOK_SECRET= 
CLERK_PUBLISHABLE_KEY= 
CLERK_SECRET_KEY= 

CLIENT_URL=

IMAGEKIT_PUBLIC_KEY =
IMAGEKIT_PRIVATE_KEY = 
IMAGEKIT_URL_ENDPOINT = 
```

#### Frontend `.env`:
```env
VITE_IK_URL_ENDPOINT = 
VITE_IK_PUBLIC_KEY =
VITE_CLERK_PUBLISHABLE_KEY=
VITE_API_URL = 
VITE_SIE_URL = 
```

---

## Installation Steps

### Backend:
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```

### Frontend:
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## Folder Structure

```
cyberupdates-blog-app/
├── backend/
│   ├── controllers/         # Application logic for routes
│   ├── middlewares/         # Request validations and utilities
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── .env                 # Backend environment variables
│   └── server.js            # Express app entry point
│
├── frontend/
│   ├── src/                 # React source code
│   ├── public/              # Static assets
│   ├── .env                 # Frontend environment variables
│   └── vite.config.js       # Vite configuration
│
└── README.md                # Project documentation
```

---

## Scripts

### Backend:
- **Start Server:**
  ```bash
  npm start
  ```

### Frontend:
- **Development Server:**
  ```bash
  npm run dev
  ```
- **Build for Production:**
  ```bash
  npm run build
  ```
- **Preview Production Build:**
  ```bash
  npm run preview
  ```

---

## Deployment

### Frontend:
1. Build the frontend:
   ```bash
   npm run build
   ```
2. Deploy the `dist/` folder to a static hosting service like Vercel, Netlify, or AWS S3.

### Backend:
1. Deploy the backend to a hosting provider like Heroku, Render, or AWS.
2. Ensure environment variables are correctly configured on the hosting platform.

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgements

- [Clerk](https://clerk.dev) for authentication.
- [ImageKit](https://imagekit.io) for image handling.
- [React Query](https://tanstack.com/query) for efficient state management.
- [Tiptap](https://tiptap.dev) for rich text editing.
- [TailwindCSS](https://tailwindcss.com) for styling.
