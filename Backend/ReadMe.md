---

# **CineVault Backend**

CineVault's backend powers the movie catalog system by handling API requests, managing data interactions with the PostgreSQL database, authenticating users, and enabling role-based access control.

---

## **Features**  

- **Movies API**:  
  - Fetch all movies, trending movies, or movies by category/title.  
  - Add, update, and delete movie records (role-restricted).  
  - Manage ratings, comments, and reviews for movies.  

- **User Authentication**:  
  - JWT-based authentication and session management.  
  - Google OAuth for streamlined login.  
  - Role-based access control (Viewer, Editor, Admin).  

- **Watchlist Management**:  
  - Add, remove, and fetch movies from a user's watchlist.  

- **Integration with TMDB**:  
  - Fetch movie data dynamically from the TMDB API.  

---

## **Tech Stack**  

- **Language**: TypeScript  
- **Framework**: Next.js (API Routes)  
- **Database**: PostgreSQL  
- **Authentication**: NextAuth.js with JWT and Google OAuth  
- **External APIs**: TMDB API for movie data  

---

## **Folder Structure**  

```plaintext
pages/api/                  # API routes for backend logic
├── getAllMovie.ts          # Fetch all movie data
├── getAllMoviesMainParts.ts# Fetch main parts of movies
├── getAllUsers.ts          # Fetch user details
├── getUserWatchList.ts     # Fetch a user's watchlist
├── MovieDetailsByCategory.ts # Fetch movies by category
├── MovieDetailsByTitle.ts  # Fetch movies by title
├── NewMovieRecord.ts       # Create a new movie record
├── TrendingMovieDetails.ts # Fetch trending movie details
├── updateMovieComments.ts  # Update movie comments
├── updateMovieRating.ts    # Update movie ratings
├── updateMovieRecord.ts    # Update movie details
├── updateMovieReview.ts    # Update movie reviews
├── updateUserType.ts       # Update user roles (Viewer, Editor, Admin)
├── updateUserWL.ts         # Update user's watchlist
├── tmdb/                   # TMDB API interaction
│   ├── getMovies.ts            # Fetch movies using TMDB API
```

```plaintext
src/app/                   # Backend utilities and helpers
├── api/                   # API-related functionalities
│   ├── auth/              # Authentication logic
│   │   ├── register/      # User registration route
│   │   │   ├── route.ts       # Register a new user
│   │   ├── [...nextauth]/ # NextAuth configuration
│   │   │   ├── route.ts       # NextAuth authentication logic
├── database/              # Database utilities
│   ├── dbmethods.ts       # Helper functions for database interaction
```

---

## **Environment Variables**  

Add the following variables to your `.env` file:

```env
# PostgreSQL Database
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<database_name>"

# TMDB API Key
TMDB_API_KEY=<your_tmdb_api_key>

# Google OAuth
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>

# JWT Secret
JWT_SECRET=<your_jwt_secret>
```

---

## **Endpoints**  

### **Authentication**  
- `POST /api/auth/register` - Register a new user.  
- `POST /api/auth/[...nextauth]` - Handle Google OAuth authentication.  

### **Movies**  
- `GET /api/getAllMovie` - Fetch all movies.  
- `GET /api/getAllMoviesMainParts` - Fetch main details of all movies.  
- `GET /api/MovieDetailsByCategory` - Fetch movies by category.  
- `GET /api/MovieDetailsByTitle` - Fetch movie details by title.  
- `POST /api/NewMovieRecord` - Add a new movie record (Editor/Admin only).  
- `PUT /api/updateMovieRecord` - Update an existing movie (Editor/Admin only).  
- `DELETE /api/deleteMovie/:id` - Delete a movie (Admin only).  

### **Watchlist**  
- `GET /api/getUserWatchList` - Fetch a user's watchlist.  
- `POST /api/updateUserWL` - Add or remove a movie from the watchlist.  

### **TMDB Integration**  
- `GET /api/tmdb/getMovies` - Fetch movies from the TMDB API.  

---

## **Database**  

The backend uses PostgreSQL to store data for users, movies, comments, and ratings. Ensure the database schema is set up before starting the server. Use the `dbmethods.ts` file in `src/app/database` to perform database operations.

---

## **Setup and Running**  

1. **Clone the Repository**:  
   ```bash
   git clone <repo>
   cd cinevault
   ```

2. **Install Dependencies**:  
   ```bash
   npm install
   ```

3. **Set Up the Database**:  
   - Create a PostgreSQL database.  
   - Update the `DATABASE_URL` in the `.env` file.  

4. **Run the Development Server**:  
   ```bash
   npm run dev
   ```

5. Access the application at [http://localhost:3000](http://localhost:3000).  

---

## **Contributing**  

1. Fork the repository.  
2. Create a new branch: `git checkout -b feature-name`.  
3. Commit your changes: `git commit -m "Add feature"`.  
4. Push to the branch: `git push origin feature-name`.  
5. Open a pull request.  

---

## **License**  

This project is licensed under the [MIT License](LICENSE).  

---
