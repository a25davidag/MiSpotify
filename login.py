import os
import hashlib
from user import User

USERS_FILE_PATH = "./login/users.txt"

class Login:
    def __init__(self):
        os.makedirs(os.path.dirname(USERS_FILE_PATH), exist_ok=True)
        self.users = []
        self.load_users()

    def hash_password(self, password: str) -> str:

        return hashlib.sha256(password.encode()).hexdigest()

    def load_users(self):
        self.users = []
        if not os.path.exists(USERS_FILE_PATH):
            return
        with open(USERS_FILE_PATH, "r", encoding="utf-8") as f:
            for line in f:
                username, hashed_pwd = line.strip().split(",")
                self.users.append(User(username, hashed_pwd))

    def save_user(self, user: User):
        with open(USERS_FILE_PATH, "a", encoding="utf-8") as f:
            f.write(f"{user.username},{user.password}\n")
        self.users.append(user)

    def create_new_user(self, username: str, password: str):
        self.load_users()
        if any(u.username == username for u in self.users):
            return {"error": "Usuario ya existe"}
        hashed = self.hash_password(password)
        user = User(username, hashed)
        self.save_user(user)
        return {"message": f"Usuario '{username}' registrado correctamente"}

    def login_user(self, username: str, password: str):
        self.load_users()
        hashed = self.hash_password(password)
        for u in self.users:
            if u.username == username and u.password == hashed:
                return True
        return False
