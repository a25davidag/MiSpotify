from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import os

from login import Login
from user import User
from song import Song
from genre import Genre

app = FastAPI()
login_service = Login()

MEDIA_DIR = "./media/"
TEMPLATES_DIR = "./templates"
STATIC_DIR = "./static"

app.mount("/media", StaticFiles(directory=MEDIA_DIR), name="media")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
templates = Jinja2Templates(directory=TEMPLATES_DIR)

users_dict = {}

songs = [
         Song("99999999-Acid Blood", "3:31", "2020-16-12", Genre.TECHNO),
         Song("Aitana-Los Angeles", "2:38", "2024-01-04", Genre.POP),
         Song("Al safir-todo lo rompo", "2:58", "2023-03-22", Genre.RAP),
         Song("Anuel-feat Badbunny-La ultima vez", "5:00", "2023-04-09", Genre.TRAP),
         Song("Beny jr-2019", "2:33", "2012-05-4", Genre.DRILL),
         Song("Beny jr-Mbappe,Bellingham,Vinicius Jr", "2:54", "2015-02-23", Genre.DRILL),
         Song("Carl Cox-Finder", "3:26", "2010-03-12", Genre.TECHNO),
         Song("Cascada-Everytime we touch","3:17","2014-12-4",Genre.POP),
         Song("Chris stussy-Go","3:16","2000-05-12",Genre.TECHNO),
         Song("Cupido-La pared","4:50","2012-01.23",Genre.RAP),
         Song("Eminem feat.Rihanna-Love the way you lie","4:26","2000-01-24",Genre.POP),
         Song("Gym clase - stereo hearts ","3:36","2002-05-12",Genre.POP),
         Song("Jambo-Indira Paganotto ","6:11","2007-02-14",Genre.TECHNO),
         Song("Jokki feat.Cupido-Estoy de bajon","2:49","2008-06-30",Genre.POP),
         Song("Julieta Venega-A donde va el Viento","2:43","2012-09-12",Genre.POP),
         Song("Julieta Venega-Limon y sal","3:25","2005-11-27",Genre.POP),
         Song("Lyaz-Replay","3:02","2014-11-06",Genre.POP),
         Song("Nico moreno feat.Samuel-See me coming","4:16","2023-04-20",Genre.TECHNO),
         Song("Nico Moreno-My black rave","6:52","2021-09.23",Genre.TECHNO),
         Song("Nico moreno-You make me horny","4:54","2019-12-20",Genre.TECHNO),
         Song("Obsku feat.Tomike.Ive arrived","2:31","2007-03-11",Genre.TECHNO),
         Song("onlynumbers festejó.Slayer Diesel-Resson to die ","4:25","1999-02-17",Genre.TECHNO),
         Song("Pawsa feat.Nate Doggs-Pick up the phone","3:44","2023-11-12",Genre.TECHNO),
         Song("Pimp Flaco-Te gusta conducir","3:20","2018-08-12",Genre.RAP),
         Song("Radio macade-dime dónde está el camino","4:18","2009,02-12",Genre.POP),
         Song("Rihanna - Don't Stop The Music","4:26","2012-08-23",Genre.POP),
         Song("Rihanna-SyM","4:03","2003-01-23",Genre.POP),
         Song("Rihanna-Umbrella","4:36","2006-12-25",Genre.POP),
         Song("Robbie Williams-Feel","4:22","2019-04-30",Genre.POP),
         Song("Sean Paul-Got 2 luv U","3:26","2012-05-23",Genre.TECHNO),
         Song("Whitney Houston-Its not right but its ok","2:32","2005-02-14",Genre.TECHNO)
]

# Pydantic models
class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

# Endpoints
@app.get("/")
def login_page(request: Request):
    return templates.TemplateResponse("spotify.html", {"request": request,"mode":"login"})

@app.get("/register")
def register_page(request: Request):
    return templates.TemplateResponse("spotify.html", {"request": request, "mode": "register"})


@app.post("/register")
def register(user: UserCreate):
    if user.username in users_dict:
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    login_service.create_new_user(user.username, user.password)
    new_user = User(user.username, user.password)
    users_dict[user.username] = new_user
    return {"success": True, "message": f"Usuario '{user.username}' registrado correctamente"}

@app.post("/login")
def login(user: UserLogin):
    result = login_service.login_user(user.username, user.password)
    if result:
        return {"success": True, "message": f"Bienvenido {user.username}"}
    return {"success": False, "message": "Usuario o contraseña incorrectos"}


@app.get("/songs")
def get_all_songs():
    try:
        # Listar todos los archivos mp3 en la carpeta MEDIA_DIR
        songs_list = [f[:-4] for f in os.listdir(MEDIA_DIR) if f.endswith(".mp3")]
        return {"songs": songs_list}
    except FileNotFoundError:
        return {"songs": []}