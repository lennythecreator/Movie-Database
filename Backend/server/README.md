# CineVault Backend

Backend server for CineVault - Your personal movie collection manager.

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB (local or Atlas connection)

## Setup & Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root of the server directory with the following variables:

```env
POPULAR_URL='https://api.themoviedb.org/3/movie/popular?'
SEARCH_URL='https://api.themoviedb.org/3/search/movie?'
DETAILS_URL='https://api.themoviedb.org/3/movie/'
GENRE_URL='https://api.themoviedb.org/3/discover/movie?'
API_KEY='tmdb api key'
MONGODB_URI='mongodb://localhost:27017/YourDB' 
#eg.'mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.e2hzd0r.mongodb.net/YourDB?retryWrites=true&w=majority'
TEST_MONGODB_URI='<YOUR TEST DB CONNECTION STRING>' 
# eg.'mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.e2hzd0r.mongodb.net/testMovieApp?retryWrites=true&w=majority' - only required if you want to run tests
PORT= 3001
```

3. Start development server:

```bash
npm run dev
```

The server will start running on `http://localhost:3001`

## Available Scripts

* `npm run dev` - Starts the development server with hot-reload
* `npm start` - Starts the production server
* `npm test` - Runs the test suite
* `npm run lint` - Runs the linter

## API Endpoints

### Authentication

* `POST /api/auth/register` - Register new user
* `POST /api/auth/login` - Login user

### Movies

* `GET /api/movies` - Get all movies
* `POST /api/movies` - Add new movie
* `GET /api/movies/:id` - Get specific movie
* `PUT /api/movies/:id` - Update movie
* `DELETE /api/movies/:id` - Delete movie

## Project Structure

```bash
server/
├── config/         # Configuration files
├── controllers/    # Route controllers,  manages the business logic and request handling
├── models/         # Database models
├── tests/          # holds all test files
└── utils/          # stores helper functions and shared utilities, including configurations, middleware etc.
```

## Error Handling

The API uses standard HTTP status codes and returns errors in the following format:

```json
(error.name === '') {
    return response
      .status(code)
      .json({ error: 'MESSAGE.' });
  }
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

#### How to run local environment

1. In your terminal, navigate to the `server` directory and run `npm install`
2. Create `.env` file in `server` directory
3. Navigate to the `server` directory and run `npm run dev`
4. In another terminal session navigate to `client` and run `npm run dev`
5. Visit `http://localhost:5173/`
