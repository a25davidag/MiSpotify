from playlist import PlayList


class User:
    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.playlists = []

    def create_playlist(self, name) -> PlayList:
        new_playlist = PlayList(name, self)
        self.playlists.append(new_playlist)
        return new_playlist

    def get_playlist_by_name(self, name) -> PlayList:
        for playlist in self.playlists:
            if playlist.name == name:
                return playlist
        return None

    def to_dict(self):
        return {
            "username": self.username,
            "playlists": [playlist.to_dict() for playlist in self.playlists]
        }

    def __str__(self):
        return f"Usuario: {self.username}\nNumero de Playlist: {len(self.playlists)}"