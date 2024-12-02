import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import requests
from app import create_app, db
from app.models import Movie,Genre

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

TMDB_API_KEY = "21069d25811d412b13e0a048b3562e68"

def fetch_and_save_movies_with_genres():
    try:
        # Fetch popular movies from TMDB
        tmdb_url = f"https://api.themoviedb.org/3/movie/popular?api_key={TMDB_API_KEY}&language=en-US&page=1"
        response = requests.get(tmdb_url)
        response.raise_for_status()
        data = response.json()

        for movie_data in data["results"]:
            # Fetch movie genres
            genres = movie_data.get("genre_ids", [])
            # Debug: Print genre IDs
            print(f"Movie: {movie_data['title']}, Genre IDs: {genres}")

            # Fetch genre names
            genre_names = fetch_genre_names(genres)

            # Debug: Print genre names
            print(f"Movie: {movie_data['title']}, Genres: {genre_names}")
            # Get or create Genre objects
            genre_objects = []
            for name in genre_names:
                genre = Genre.query.filter_by(name=name).first()
                if not genre:
                    genre = Genre(name=name)
                    db.session.add(genre)
                genre_objects.append(genre)

            # Fetch movie credits for cast information
            credits_url = f"https://api.themoviedb.org/3/movie/{movie_data['id']}/credits?api_key={TMDB_API_KEY}"
            credits_response = requests.get(credits_url)
            credits_response.raise_for_status()
            credits_data = credits_response.json()

            # Extract top 5 actors
            cast = [member["name"] for member in credits_data["cast"][:5]]
            cast_string = ", ".join(cast)

            # Check if the movie already exists in the database
            movie = Movie.query.filter_by(id=movie_data["id"]).first()
            print(f"Inserting movie: {movie_data['title']}, Genres: {genre_names}")

            if not movie:
                # Add new movie to the database
                movie = Movie(
                    id=movie_data["id"],
                    title=movie_data["title"],
                    overview=movie_data["overview"],
                    poster_path=movie_data["poster_path"],
                    release_date=movie_data["release_date"],
                    rating=movie_data["vote_average"],
                    actors=cast_string,
                    genres=genre_objects
                )
                db.session.add(movie)

        db.session.commit()
        print("Movies with genres saved successfully.")

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from TMDB: {e}")

    except Exception as e:
        db.session.rollback()
        print(f"Error saving to database: {e}")


def fetch_genre_names(genre_ids):
    """Fetch genre names based on their IDs using TMDB."""
    genres_url = f"https://api.themoviedb.org/3/genre/movie/list?api_key={TMDB_API_KEY}&language=en-US"
    response = requests.get(genres_url)
    response.raise_for_status()
    genres_data = response.json()

    # Map genre IDs to genre names
    id_to_name = {genre["id"]: genre["name"] for genre in genres_data["genres"]}
    return [id_to_name[genre_id] for genre_id in genre_ids if genre_id in id_to_name]


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        fetch_and_save_movies_with_genres()