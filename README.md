### 🎵 Vibely Backend
Vibely는 Spotify 연동 및 다양한 음악 기능을 제공하는 백엔드 서버입니다.

----

### 📁 프로젝트 구조
```
server.ts                # 서버 실행
app.ts                   # Express 앱 설정
routes/
  └── index.ts 
controllers/
  ├── auth.controller.ts      # 인증
  ├── gemini.controller.ts    # Gemini AI
  └── spotify.controller.ts   # Spotify
services/
  ├── gemini.service.ts       # Gemini AI 
  └── spotify.service.ts      # Spotify
models/                       # 데이터 모델
  └── user.model.ts
config/
  └── index.ts
database/                     # DB 연결
  └── mariadb.ts  
.env           
package.json
```
----

### 🗄️ 데이터베이스(users 테이블) 구조
MariaDB의 users 테이블 스키마:
| 컬럼명      | 타입           | 설명                           |
|:-----------|:---------------|:-------------------------------|
| id         | INT            | PK, AUTO_INCREMENT             |
| spotifyId  | VARCHAR(100)   | Spotify 유저 ID (**UNIQUE**)   |
| accessToken| VARCHAR(512)   | Spotify Access Token           |
| refreshToken| VARCHAR(512)  | Spotify Refresh Token          |

- spotifyId에는 UNIQUE 제약조건이 걸려 있습니다.
----

### 🔑 Spotify API 및 Scope 정리
| 기능                           | 엔드포인트 예시                          | 필요한 스코프                                     |
|:-------------------------------|:------------------------------------------|:--------------------------------------------------|
| Get Album                      | x                                        | x                                                |
| Get Playlist                   | x                                        | x                                                |
| Search for Item                | /v1/search                               | user-read-private                                |
| Get Playlist Items             | /v1/playlists/{playlist_id}/tracks       | playlist-read-private                            |
| Get User's Saved Albums        | /v1/me/albums                            | user-library-read                                |
| Get New Releases               | x                                        | x                                                |
| Get Current User's Playlists   | /v1/me/playlists                         | playlist-read-private                            |
| Follow Playlist                | /v1/playlists/{playlist_id}/followers    | playlist-modify-private, playlist-modify-public  |
| UnFollow Playlist              | /v1/playlists/{playlist_id}/followers    | playlist-modify-private, playlist-modify-public  |
| Save Album for Current User    | /v1/me/albums                            | user-library-modify                              |
| Remove User’s Saved Album      | /v1/me/albums                            | user-library-modify                              |
| Get Playback State             | /v1/me/player                            | user-read-playback-state                         |
| Start/Resume Playback          | /v1/me/player/play                       | user-modify-playback-state                       |
| Pause Playback                 | /v1/me/player/pause                      | user-modify-playback-state                       |
| Skip to Next                   | /v1/me/player/next                       | user-modify-playback-state                       |
| Skip To Previous               | /v1/me/player/previous                   | user-modify-playback-state                       |
| Seek To Position               | /v1/me/player/seek                       | user-modify-playback-state                       |
| Set Playback Volume            | /v1/me/player/volume                     | user-modify-playback-state                       |
| Add Item To Playback Queue     | /v1/me/player/queue                      | user-modify-playback-state                       |
| Get Current User's Profile     | /v1/me                                   | playlist-read-private                            |

----

### 🛠️ 사용 패키지
- dotenv

- express

- axios

- mysql

- cors


----
### 🚀 실행 방법
.env 파일에 환경변수 설정

MariaDB 및 필요한 DB 테이블 생성

패키지 설치

----

### 👥 팀원 역할
영채: 서버, DB

은미: 인증, 모델,Spotify

효성: Gemini, Spotify

혜민: Spotify,
