from app import db

# Association Table for User Watchlist
user_watchlist_association = db.Table(
    'user_watchlist',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('movie_id', db.Integer, db.ForeignKey('movie.id'), primary_key=True)
)

# Association Table for Movies and Genres
movie_genre_association = db.Table(
    'movie_genre',
    db.Column('movie_id', db.Integer, db.ForeignKey('movie.id'), primary_key=True),
    db.Column('genre_id', db.Integer, db.ForeignKey('genre.id'), primary_key=True)
)

# User Model
class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    user_type = db.Column(db.String(50), nullable=False)
    watchlist = db.relationship('Movie', secondary=user_watchlist_association, backref='users')
    reviews = db.relationship('Review', back_populates='user', cascade="all, delete-orphan")

# Movie Model
class Movie(db.Model):
    __tablename__ = 'movie'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    overview = db.Column(db.Text)
    poster_path = db.Column(db.String)
    release_date = db.Column(db.Date)
    rating = db.Column(db.Float)
    actors = db.Column(db.Text)
    genres = db.relationship('Genre', secondary=movie_genre_association, back_populates='movies')
    reviews = db.relationship('Review', back_populates='movie', cascade="all, delete-orphan")

# Genre Model
class Genre(db.Model):
    __tablename__ = 'genre'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    movies = db.relationship('Movie', secondary=movie_genre_association, back_populates='genres')

# Review Model
class Review(db.Model):
    __tablename__ = 'review'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey('movie.id'), nullable=False)
    rating = db.Column(db.Float, nullable=False)  # Changed to FLOAT
    comment = db.Column(db.Text, nullable=True)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())

    user = db.relationship('User', back_populates='reviews')
    movie = db.relationship('Movie', back_populates='reviews')
