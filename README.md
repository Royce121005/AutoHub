# AutoHub - Used Car Marketplace

AutoHub is a responsive, modern full-stack (MERN) Used Car Marketplace. Users can register accounts, sign in, search and filter listings by location/price/specifications, post their own vehicles for sale, manage their listings, and save favorites.

The application features a sleek dark mode glassmorphism user interface designed with pure CSS, custom loading skeletons, interactive Loan EMI estimators, and protected routes.

---

## Technical Stack

* **Frontend**: React 19, React Router DOM, Axios, Context API, CSS Modules / Scoped Variables, React Icons, Vite.
* **Backend**: Node.js, Express.js, MongoDB Atlas (via Mongoose ODM), JWT Authentication, bcryptjs, Multer (Local File Uploads), Express Validator, Helmet, Express Rate Limit.
* **Deployment**: Frontend (Vercel) | Backend (Render) | Database (MongoDB Atlas).

---

## Folder Structure

```text
AutoHub/
├── client/              # React Frontend (Vite)
│   ├── src/
│   │   ├── components/  # RouteGuard, Navbar, Footer, CarCard
│   │   ├── context/     # AuthContext, ToastContext
│   │   ├── pages/       # Home, Browse, CarDetails, SellCar, MyListings, Favorites, Profile
│   │   ├── services/    # api.js fetch client
│   │   └── styles/      # variables.css, global.css
├── server/              # Express Backend
│   ├── config/          # db.js connection configuration
│   ├── controllers/     # authController, carController, favoriteController
│   ├── middleware/      # auth, upload (multer), validator (express-validator)
│   ├── models/          # User, Car, Favorite schemas
│   ├── routes/          # API route bindings
│   └── uploads/         # Static vehicle photos upload target
└── README.md
```

---

## Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) installed (v18+ recommended)
* [MongoDB](https://www.mongodb.com/) installed locally or a [MongoDB Atlas](https://www.mongodb.com/atlas/database) account.

### 1. Database & Backend Configuration
1. Open terminal and navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the template:
   ```bash
   cp .env.example .env
   ```
4. Update the environment variables in `.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/autohub  # Or your Atlas connection string
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   ```
5. Start the backend server in development mode:
   ```bash
   npm run dev
   ```

### 2. Frontend Configuration
1. Navigate to the client folder in a new terminal:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Access the web interface at `http://localhost:5173`.

---

## REST API Reference

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Protected | Request Body / Params |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/register` | Register a new user | No | `{ name, email, password, phone, city }` |
| **POST** | `/login` | Log in user & return JWT token | No | `{ email, password }` |
| **GET** | `/profile` | Get current logged-in user profile | **Yes** | *Bearer Token* |
| **PUT** | `/profile` | Update profile settings | **Yes** | `{ name, phone, city }` |
| **PUT** | `/change-password` | Change user password | **Yes** | `{ currentPassword, newPassword }` |
| **DELETE**| `/delete-account`| Delete account and all listings | **Yes** | *Bearer Token* |

### 2. Cars Listings (`/api/cars`)
| Method | Endpoint | Description | Protected | Request Body / Params |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/` | Retrieve cars with search & filters | No | Query parameters: `page`, `limit`, `search`, `brand`, `model`, `city`, `minPrice`, `maxPrice`, `fuelType`, `transmission`, `owner` |
| **GET** | `/:id` | Fetch car details by ID | No | Path parameter: `id` |
| **POST** | `/` | Create a new car listing | **Yes** | FormData: text fields + `images` (files array) |
| **PUT** | `/:id` | Update car listing details | **Yes** | FormData (Multipart) |
| **DELETE**| `/:id` | Delete car listing | **Yes** | Path parameter: `id` |
| **PATCH** | `/:id/sold` | Mark listing as sold / available | **Yes** | Path parameter: `id` |

### 3. Saved Favorites (`/api/favorites`)
| Method | Endpoint | Description | Protected | Request Body / Params |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/` | Get user saved cars list | **Yes** | *Bearer Token* |
| **POST** | `/:carId` | Add car listing to favorites | **Yes** | Path parameter: `carId` |
| **DELETE**| `/:carId` | Remove car listing from favorites| **Yes** | Path parameter: `carId` |

---

## Deployment Guidelines

### Backend -> Render
1. Create a Web Service on Render connecting to your GitHub repository.
2. Build Command: `npm install` (if monorepo, set root directory to `server` or adjust build command).
3. Start Command: `node server.js`
4. Add environment variables under Environment settings:
   - `MONGODB_URI` (MongoDB Atlas production URI)
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`

### Frontend -> Vercel
1. Create a Project on Vercel connecting to your GitHub repository.
2. Framework Preset: **Vite**.
3. Root Directory: `client`.
4. Environment Variables:
   - Set `VITE_API_URL` to your live Render backend endpoint URL (e.g. `https://autohub-api.onrender.com/api`).
5. Click deploy! Vercel handles routing fallbacks automatically.
