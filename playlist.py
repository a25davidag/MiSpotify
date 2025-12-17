import os
from typing import List
from song import Song

# Evitamos importar User al inicio para no circularidad
# Solo lo usaremos como tipo en anotaciones, así que podemos usar "forward references"

class PlayList:
    def __init__(self, name: str, user: "User"):
        self.name = name
        self.user = user
        self.songs: List[Song] = []  # Lista de canciones

    def add_song(self, song: Song):
        self.songs.append(song)

    def get_songs_names(self) -> list[str]:
        return [song.name for song in self.songs]

    def to_dict(self) -> dict:
        # Convierte la playlist a diccionario para JSON
        return {
            "name": self.name,
            "user": self.user.username,
            "songs": [song.to_dict() for song in self.songs]
        }

    def __str__(self):
        return f"PlayList: {self.name} ({len(self.songs)} canciones)"