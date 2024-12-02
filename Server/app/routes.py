from flask import Blueprint, request, jsonify
from app.models import User, db, Movie, Genre, Review
import bcrypt

main = Blueprint('main', __name__)

TMDB_API_KEY = "21069d25811d412b13e0a048b3562e68"

# Authenticate User (Login/Registration)
@main.route('/auth', methods=['POST'])
def authenticate_user():
    try:
        data = request.get_json()
        if not data:
            raise ValueError("No JSON body provided")

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"message": "Missing fields"}), 400

        user = User.query.filter_by(username=username).first()

        if user:
            # If the username exists, check if this is a login attempt
            if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
                return jsonify({
                    "success": True,
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "user_type": user.user_type,
                        "watchlist": [
                            {
                                "id": movie.id,
                                "title": movie.title,
                                "poster_path": f"https://image.tmdb.org/t/p/w500{movie.poster_path}" if movie.poster_path else None
                            }
                            for movie in user.watchlist
                        ],
                        
                    }
                }), 200
            else:
                return jsonify({"message": "Invalid credentials"}), 401
        else:
            # Register new user
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            new_user = User(username=username, password=hashed_password, user_type="user")
            db.session.add(new_user)
            db.session.commit()

            return jsonify({
                "success": True,
                "user": {
                    "id": new_user.id,
                    "username": new_user.username,
                    "watchlist": [],
                }
            }), 201

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        db.session.rollback()
        return jsonify({"message": "Server error", "error": str(e)}), 500


# Get User Profile
@main.route('/api/user/<int:user_id>/profile', methods=['GET'])
def get_user_profile(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        profile_data = {
            "id": user.id,
            "username": user.username,
            "watchlist": [
                {
                    "id": movie.id,
                    "title": movie.title,
                    "poster_url": f"https://image.tmdb.org/t/p/w500{movie.poster_path}" if movie.poster_path else None,
                    "release_date": movie.release_date.strftime("%Y-%m-%d") if movie.release_date else None,
                    "rating": movie.rating,
                    "overview": movie.overview,
                }
                for movie in user.watchlist
            ],
            "reviews": [
                {
                    "movie_title": review.movie.title,
                    "text": review.comment,
                    "rating": review.rating,    

                }
                for review in user.reviews
            ]
        }
        return jsonify(profile_data), 200
    except Exception as e:
        print(f"Error fetching user profile: {e}")
        return jsonify({"error": "Internal server error"}), 500

# Get All Movies
@main.route('/api/movies', methods=['GET'])
def get_all_movies():
    try:
        # Fetch all movies from the database
        movies = Movie.query.all()

        # Serialize movie data
        movies_data = [
            {
                "id": movie.id,
                "title": movie.title,
                "overview": movie.overview,
                "poster_url": f"https://image.tmdb.org/t/p/w500{movie.poster_path}" if movie.poster_path else None,
                "release_date": movie.release_date.strftime("%Y-%m-%d") if movie.release_date else None,
                "rating": movie.rating,
                "genres": [genre.name for genre in movie.genres]  # Assuming genres are linked
            }
            for movie in movies
        ]

        return jsonify({"movies": movies_data}), 200
    except Exception as e:
        print(f"Error fetching all movies: {e}")
        return jsonify({"error": "Internal server error"}), 500


@main.route('/api/genres/<string:genre_name>/movies', methods=['GET'])
def get_movies_by_genre(genre_name):
    try:
        # Fetch the genre and its associated movies
        genre = Genre.query.filter_by(name=genre_name).first()
        if not genre:
            return jsonify({"error": "Genre not found"}), 404

        movies = [
            {
                "id": movie.id,
                "title": movie.title,
                "poster_url": f"https://image.tmdb.org/t/p/w500{movie.poster_path}" if movie.poster_path else None,
                "release_date": movie.release_date.strftime("%Y-%m-%d") if movie.release_date else None,
                "rating": movie.rating,
                "overview": movie.overview,
                "actors": movie.actors,
                "genres": [g.name for g in movie.genres]
            }
            for movie in genre.movies
        ]

        return jsonify({"movies": movies}), 200
    except Exception as e:
        print(f"Error fetching movies for genre {genre_name}: {e}")
        return jsonify({"error": "Internal server error"}), 500

@main.route('/api/movies/recent', methods=['GET'])
def get_recent_movies():
    try:
        # Fetch recently released movies, sorted by release date
        recent_movies = Movie.query.order_by(Movie.release_date.desc()).limit(10).all()

        # TMDB image base URL
        IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

        # Convert movies to a JSON-serializable format
        movies = [
            {
                "id": movie.id,
                "title": movie.title,
                "genres": [genre.name for genre in movie.genres],
                "release_date": movie.release_date.strftime("%Y-%m-%d") if movie.release_date else None,
                "poster_url": f"{IMAGE_BASE_URL}{movie.poster_path}" if movie.poster_path else None,
                "rating": movie.rating,
                "actors": movie.actors,
                "overview": movie.overview,
            }
            for movie in recent_movies
        ]

        return jsonify({"movies": movies}), 200
    except Exception as e:
        print(f"Error fetching recent movies: {e}")
        return jsonify({"error": "Unable to fetch recent movies"}), 500
#get movie by id
@main.route('/api/movies/<int:movie_id>', methods=['GET'])
def get_movie_details(movie_id):
    try:
        # Fetch the movie by ID
        movie = Movie.query.get(movie_id)
        if not movie:
            return jsonify({"error": "Movie not found"}), 404

        # Serialize movie data
        movie_data = {
            "id": movie.id,
            "title": movie.title,
            "genres": [genre.name for genre in movie.genres],  # Fetch genre names
            "release_date": movie.release_date.strftime("%Y-%m-%d") if movie.release_date else None,
            "poster_url": f"https://image.tmdb.org/t/p/w500{movie.poster_path}" if movie.poster_path else None,
            "rating": movie.rating,
            "actors": movie.actors,  # Assuming this is a comma-separated string
            "overview": movie.overview,
            "reviews": [
                {
                    "user": review.user.username,  # Fetch the username of the reviewer
                    "rating": review.rating,
                    "comment": review.comment,
                    "timestamp": review.timestamp.strftime("%Y-%m-%d %H:%M:%S")
                }
                for review in movie.reviews
            ],
        }

        return jsonify(movie_data), 200
    except Exception as e:
        print(f"Error fetching movie details: {e}")
        return jsonify({"error": "Internal server error"}), 500


# Add Movie to Watchlist
@main.route('/api/user/<int:user_id>/watchlist/add', methods=['POST'])
def add_to_watchlist(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.get_json()
        movie_id = data.get("movie_id")
        if not movie_id:
            return jsonify({"error": "Movie ID is required"}), 400

        movie = Movie.query.get(movie_id)
        if not movie:
            return jsonify({"error": "Movie not found"}), 404

        if movie not in user.watchlist:
            user.watchlist.append(movie)
            db.session.commit()
            return jsonify({"message": f"{movie.title} added to watchlist"}), 200
        else:
            return jsonify({"message": "Movie already in watchlist"}), 400
    except Exception as e:
        print(f"Error adding to watchlist: {e}")
        db.session.rollback()
        return jsonify({"error": "Server error"}), 500


# Remove Movie from Watchlist
@main.route('/api/user/<int:user_id>/watchlist/remove', methods=['POST'])
def remove_from_watchlist(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.get_json()
        movie_id = data.get("movie_id")
        if not movie_id:
            return jsonify({"error": "Movie ID is required"}), 400

        movie = Movie.query.get(movie_id)
        if not movie:
            return jsonify({"error": "Movie not found"}), 404

        if movie in user.watchlist:
            user.watchlist.remove(movie)
            db.session.commit()
            return jsonify({"message": f"{movie.title} removed from watchlist"}), 200
        else:
            return jsonify({"message": "Movie not in watchlist"}), 400
    except Exception as e:
        print(f"Error removing from watchlist: {e}")
        db.session.rollback()
        return jsonify({"error": "Server error"}), 500


# Get User's Watchlist
@main.route('/api/user/<int:user_id>/watchlist', methods=['GET'])
def get_watchlist(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        watchlist = [
            {
                "id": movie.id,
                "title": movie.title,
                "poster_url": f"https://image.tmdb.org/t/p/w500{movie.poster_path}" if movie.poster_path else None,
                "release_date": movie.release_date.strftime("%Y-%m-%d") if movie.release_date else None,
                "rating": movie.rating,
                "overview": movie.overview
            }
            for movie in user.watchlist
        ]

        return jsonify({"watchlist": watchlist}), 200
    except Exception as e:
        print(f"Error fetching watchlist: {e}")
        return jsonify({"error": "Server error"}), 500


# Add Review
@main.route('/api/movies/<int:movie_id>/review', methods=['POST'])
def add_review(movie_id):
    print(f"Review request received for movie ID: {movie_id}")
    try:
        data = request.get_json()
        print(f"Request payload: {data}")

        user_id = data.get("user_id")
        rating = data.get("rating")
        comment = data.get("comment", "")

        if not user_id or rating is None:
            return jsonify({"error": "User ID and rating are required"}), 400

        user = User.query.get(user_id)
        print(f"User query result for ID {user_id}: {user}")

        movie = Movie.query.get(movie_id)
        print(f"Movie query result for ID {movie_id}: {movie}")

        if not user:
            return jsonify({"error": "User not found"}), 404
        if not movie:
            return jsonify({"error": "Movie not found"}), 404

        review = Review(user_id=user.id, movie_id=movie.id, rating=rating, comment=comment)
        db.session.add(review)
        db.session.commit()

        return jsonify({"message": "Review added successfully"}), 201
    except Exception as e:
        print(f"Error adding review: {e}")
        db.session.rollback()
        return jsonify({"error": "Server error"}), 500


# Get Reviews for a Movie
@main.route('/api/movies/<int:movie_id>/reviews', methods=['GET'])
def get_movie_reviews(movie_id):
    try:
        movie = Movie.query.get(movie_id)
        if not movie:
            return jsonify({"error": "Movie not found"}), 404

        reviews = [
            {
                "user": review.user.username,
                "rating": review.rating,
                "comment": review.comment,
                "timestamp": review.timestamp.strftime("%Y-%m-%d %H:%M:%S")
            }
            for review in movie.reviews
        ]

        return jsonify({"reviews": reviews}), 200
    except Exception as e:
        print(f"Error fetching reviews: {e}")
        return jsonify({"error": "Server error"}), 500

@main.route('/api/movies/add', methods=['POST'])
def add_movie():
    try:
        data = request.get_json()

        # Validate input
        required_fields = ['title', 'release_date', 'overview', 'rating', 'actors']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        # Create a new Movie object
        new_movie = Movie(
            title=data['title'],
            release_date=data['release_date'],
            overview=data['overview'],
            rating=data['rating'],
            poster_path=data.get('poster_path'),
            actors=data['actors'],
        )

        # Add genres if provided
        if 'genres' in data and isinstance(data['genres'], list):
            genres = Genre.query.filter(Genre.name.in_(data['genres'])).all()
            new_movie.genres.extend(genres)

        db.session.add(new_movie)
        db.session.commit()

        return jsonify({"message": "Movie added successfully", "movie_id": new_movie.id}), 201
    except Exception as e:
        print(f"Error adding movie: {e}")
        db.session.rollback()
        return jsonify({"error": "Server error"}), 500


@main.route('/api/movies/<int:movie_id>/delete', methods=['DELETE'])
def delete_movie(movie_id):
    try:
        # Fetch the movie by ID
        movie = Movie.query.get(movie_id)
        if not movie:
            return jsonify({"error": "Movie not found"}), 404

        db.session.delete(movie)
        db.session.commit()

        return jsonify({"message": f"Movie with ID {movie_id} deleted successfully"}), 200
    except Exception as e:
        print(f"Error deleting movie: {e}")
        db.session.rollback()
        return jsonify({"error": "Server error"}), 500

@main.route('/api/movies/<int:movie_id>/update', methods=['PUT'])
def update_movie(movie_id):
    try:
        data = request.get_json()

        # Fetch the movie by ID
        movie = Movie.query.get(movie_id)
        if not movie:
            return jsonify({"error": "Movie not found"}), 404

        # Update movie fields if provided
        if 'title' in data:
            movie.title = data['title']
        if 'release_date' in data:
            movie.release_date = data['release_date']
        if 'overview' in data:
            movie.overview = data['overview']
        if 'rating' in data:
            movie.rating = data['rating']
        if 'poster_path' in data:
            movie.poster_path = data['poster_path']
        if 'actors' in data:
            movie.actors = data['actors']

        # Update genres if provided
        if 'genres' in data and isinstance(data['genres'], list):
            genres = Genre.query.filter(Genre.name.in_(data['genres'])).all()
            movie.genres = genres

        db.session.commit()

        return jsonify({"message": f"Movie with ID {movie_id} updated successfully"}), 200
    except Exception as e:
        print(f"Error updating movie: {e}")
        db.session.rollback()
        return jsonify({"error": "Server error"}), 500
