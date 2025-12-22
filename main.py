from fastapi import FastAPI, HTTPException, Request, UploadFile, File, Form, Response, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import os

import subprocess
import uuid

from fastapi import Form
from starlette.responses import FileResponse

from login import Login
from user import User
from song import Song
from genre import Genre

app = FastAPI()
login_service = Login()

SESSION_COOKIE = "session_user"

MEDIA_DIR = "./media/"
TEMPLATES_DIR = "./templates"
STATIC_DIR = "./static"

app.mount("/media", StaticFiles(directory=MEDIA_DIR), name="media")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
templates = Jinja2Templates(directory=TEMPLATES_DIR)


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

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str



def require_login(request: Request):
    session_user = request.cookies.get(SESSION_COOKIE)
    if not session_user or not any(u.username == session_user for u in login_service.users):
        raise HTTPException(status_code=401, detail="No autorizado")
    return session_user


@app.get("/", response_class=HTMLResponse)
def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request, "mode": "login"})

@app.get("/register", response_class=HTMLResponse)
def register_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request, "mode": "register"})

@app.get("/menu", response_class=HTMLResponse)
def menu_page(request: Request, session_user: str = Depends(require_login)):
    return templates.TemplateResponse("menu.html", {"request": request})

@app.get("/canciones", response_class=HTMLResponse)
def canciones_page(request: Request, session_user: str = Depends(require_login)):
    return templates.TemplateResponse("cancionesLista.html", {"request": request})

@app.get("/subir-cancion", response_class=HTMLResponse)
def subir_cancion_page(request: Request, session_user: str = Depends(require_login)):
    return templates.TemplateResponse("subirCancion.html", {"request": request})

@app.get("/songs")
def get_all_songs(session_user: str = Depends(require_login)):
    username = session_user
    try:
        songs_list = [song.name for song in songs]
        user_dir = os.path.join(MEDIA_DIR, username)
        if os.path.exists(user_dir):
            for f in os.listdir(user_dir):
                if f.endswith(".mp3"):
                    songs_list.append(f.replace(".mp3",""))
        return {"songs": songs_list}
    except Exception:
        return {"songs": []}

@app.get("/play/{username}/{song_name}")
def play_song(username: str, song_name: str, session_user: str = Depends(require_login)):
    if username != session_user:
        raise HTTPException(status_code=401, detail="No autorizado")
    user_path = os.path.join(MEDIA_DIR, username, f"{song_name}.mp3")
    global_path = os.path.join(MEDIA_DIR, f"{song_name}.mp3")
    if os.path.exists(user_path):
        file_path = user_path
    elif os.path.exists(global_path):
        file_path = global_path
    else:
        raise HTTPException(status_code=404, detail="Canción no encontrada")
    return FileResponse(file_path, media_type="audio/mpeg")



@app.post("/register")
def register(user: UserCreate):
    if any(u.username == user.username for u in login_service.users):
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    login_service.create_new_user(user.username, user.password)
    return {"success": True, "message": f"Usuario '{user.username}' registrado correctamente"}

@app.post("/login")
def login(user: UserLogin, response: Response):
    if not (user.username or not user.password):
        raise HTTPException(status_code=400, detail="El usuario y contraseña requerido")
    result = login_service.login_user(user.username, user.password)
    if result:
        response.set_cookie(key=SESSION_COOKIE, value=user.username, httponly=True)
        return {"success": True, "message": f"Bienvenido {user.username}"}
    raise HTTPException(status_code=401, detail="El usuario o contraseña incorrectos")

@app.post("/upload-song")
async def upload_song(username: str = Form(...), file: UploadFile = File(...), session_user: str = Depends(require_login)):
    if username != session_user:
        raise HTTPException(status_code=401, detail="No autorizado")
    if not file.filename.endswith(".mp3"):
        raise HTTPException(status_code=400, detail="Solo se permite subir archivos MP3.")
    user_dir = os.path.join(MEDIA_DIR, username)
    os.makedirs(user_dir, exist_ok=True)
    save_path = os.path.join(user_dir, file.filename)
    with open(save_path, "wb") as f:
        f.write(await file.read())
    return {"success": True, "filename": file.filename}


@app.post("/upload-song-url")
async def upload_song_from_url(username: str = Form(...), url: str = Form(...), session_user: str = Depends(require_login)):
    print(f"Llamada recibida: username={username}, url={url}")
    if username != session_user:
        raise HTTPException(status_code=401, detail="No autorizado")
    user_dir = os.path.join(MEDIA_DIR, username)
    os.makedirs(user_dir, exist_ok=True)
    output_template = os.path.join(user_dir, "%(title)s.%(ext)s")
    try:
        subprocess.run(
            [
                "yt-dlp",
                "-x",
                "--audio-format", "mp3",
                "--ffmpeg-location", r"C:\ffmpeg\ffmpeg-2025-12-18-git-78c75d546a-full_build\bin",
                "-o", output_template,
                url
            ],
            check=True
        )
    except subprocess.CalledProcessError as e:
        print(f"Error en la descarga/conversión: {e}")
        raise HTTPException(status_code=400, detail="Error al descargar la canción")
    return {"success": True, "message": "Canción descargada correctamente"}
