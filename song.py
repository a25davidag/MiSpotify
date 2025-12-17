from genre import Genre


class Song:

    def __init__(self, name, duration, release_date, genre: Genre):
        self.name = name
        self.duration = duration
        self.releaseDate = release_date
        self.genre = genre



    def __str__(self):
        return f"Song: {self.name})"

    def to_dict(self):
        return {
            "name": self.name,
            "duration": self.duration,
            "release_date": self.release_date,
            "genre": self.genre.name
        }