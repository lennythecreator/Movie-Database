# CineVault Backend Setup Documentation

This document provides a step-by-step guide to setting up the backend for **CineVault**. It includes the necessary files, dependencies, database setup, and instructions for running the server.

---

## File Structure

```
Server/
├── app/
│   ├── __init__.py
│   ├── .env
│   ├── load_movies.py
│   ├── models.py
│   ├── routes.py
├── migrations/
├── venv/
├── app.py
├── hash.py
├── requirements.txt
```

---

## Prerequisites

- **Python 3.8+**
- **PostgreSQL** installed and running
- **Virtual Environment** for Python

---

## 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

---

## 2. Create and Activate a Virtual Environment

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

---

## 3. Install Dependencies

Run the following command to install the required libraries:

```bash
pip install -r requirements.txt
```

If `requirements.txt` does not exist, generate it using:

```bash
pip freeze > requirements.txt
```

---

## 4. Database Setup

### 4.1 Configure Database Connection

Ensure that you configure your PostgreSQL database connection in the `.env` file:

**`.env` File Example:**

```
DATABASE_URL=postgresql://postgres:lenny@localhost:5433/MovieDB
FLASK_APP=app.py
FLASK_ENV=development
```

### 4.2 Create the Database

```sql
CREATE DATABASE cinevault;
```

### 4.3 Apply Migrations

```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

---

## 5. Populate Initial Data

Run the script to load initial movie data from `load_movies.py`:

```bash
python load_movies.py
```

This script inserts movie and genre data into the database.

---

## 6. Start the Flask Application

Run the Flask server:

```bash
flask --app app.py run
```

The server will run by default on `http://127.0.0.1:5000`.

---

## File Overview

### 1. **`__init__.py`**

This file initializes the Flask application and sets up the database connection and migrations.

**Key Components:**

- Flask Application
- SQLAlchemy ORM for database handling
- Flask-Migrate for database migrations

### 2. **`models.py`**

This file defines the database schema using SQLAlchemy models.

**Key Models:**

- **User**: Stores user credentials and their associated watchlist.
- **Movie**: Represents movies with attributes like title, overview, poster path, etc.
- **Genre**: Represents movie genres.
- **Review**: Stores user reviews for movies.

**Relationships:**

- Many-to-Many: Movies and Genres
- Many-to-Many: Users and Watchlist
- One-to-Many: Users and Reviews

### 3. **`routes.py`**

Contains all the routes (API endpoints) to handle user authentication, movie management, and reviews.

**Key Routes:**

- **Authentication**: `/auth`
- **Fetch Movies**: `/api/movies`
- **Add/Remove Watchlist**: `/api/user/<user_id>/watchlist/add` and `/remove`
- **Add Movie**: `/api/movies/add`
- **Update Movie**: `/api/movies/<movie_id>/update`
- **Delete Movie**: `/api/movies/<movie_id>/delete`

### 4. **`load_movies.py`**

This script loads initial data for movies and genres into the database.

---

## Testing the Endpoints

### 1. Add a New Movie

- **Endpoint**: `/api/movies/add`
- **Method**: `POST`
- **Payload**:

```json
{
  "title": "Movie Title",
  "release_date": "2024-01-01",
  "overview": "Description of the movie.",
  "rating": 8.5,
  "actors": "Actor1, Actor2",
  "genres": ["Action", "Comedy"]
}
```

### 2. Update a Movie

- **Endpoint**: `/api/movies/<movie_id>/update`
- **Method**: `PUT`
- **Payload**:

```json
{
  "title": "Updated Title",
  "rating": 9.0
}
```

### 3. Delete a Movie

- **Endpoint**: `/api/movies/<movie_id>/delete`
- **Method**: `DELETE`

---

## Additional Notes

- Ensure PostgreSQL is running during development.
- Use tools like Postman for testing API endpoints.
- For frontend integration, ensure the API base URL matches the frontend configuration.

---

By following these steps, you can set up and run the backend for **CineVault** successfully.

