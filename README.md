🎵 Vibely Backend
Vibely는 Spotify 연동 및 다양한 음악 기능을 제공하는 백엔드 서버입니다.

📁 프로젝트 구조
text
📄 server.ts         # 서버 실행 (영채)
📄 app.ts            # Express 앱 설정 (영채)
📁 routes/           
│   └── index.ts 
│       
📁 controllers/
│   ├── auth.controller.ts     # 인증 (은미)
│   ├── gemini.controller.ts   # Gemini AI (효성)
│   └── spotify.controller.ts  # Spotify (효성, 혜민, 은미)
│
📁 services/
│   ├── gemini.service.ts      # Gemini AI (효성)
│   └── spotify.service.ts     # Spotify (효성, 혜민, 은미)
│
📁 models/                     # 데이터 모델 (은미)
│   └── user.model.ts
│
📁 config/           
│   └── index.ts
│
📁 database/                   # DB 연결 (영채)
│   └── mariadb.ts  
│ 
📄 .env           
📄 package.json
🗄️ 데이터베이스 구조
MariaDB의 users 테이블 스키마:

컬럼명	타입	설명
id	INT	PK, AUTO_INCREMENT
spotifyId	VARCHAR(100)	Spotify 유저 ID (UNIQUE)
accessToken	VARCHAR(512)	Spotify Access Token
refreshToken	VARCHAR(512)	Spotify Refresh Token
spotifyId에는 UNIQUE 제약조건이 걸려 있습니다.

🛠️ 사용 패키지
dotenv

express

axios

mysql

cors

🔑 Spotify API 및 Scope 정리
기능	엔드포인트 예시	필요한 스코프
Get Album	x	x
Get Playlist	x	x
Search for Item	/v1/search	user-read-private
Get Playlist Items	/v1/playlists/{playlist_id}/tracks	playlist-read-private
Get User's Saved Albums	/v1/me/albums	user-library-read
Get New Releases	x	x
Get Current User's Playlists	/v1/me/playlists	playlist-read-private
Follow Playlist	/v1/playlists/{playlist_id}/followers	playlist-modify-private, playlist-modify-public
UnFollow Playlist	/v1/playlists/{playlist_id}/followers	playlist-modify-private, playlist-modify-public
Save Album for Current User	/v1/me/albums	user-library-modify
Remove User’s Saved Album	/v1/me/albums	user-library-modify
Get Playback State	/v1/me/player	user-read-playback-state
Start/Resume Playback	/v1/me/player/play	user-modify-playback-state
Pause Playback	/v1/me/player/pause	user-modify-playback-state
Skip to Next	/v1/me/player/next	user-modify-playback-state
Skip To Previous	/v1/me/player/previous	user-modify-playback-state
Seek To Position	/v1/me/player/seek	user-modify-playback-state
Set Playback Volume	/v1/me/player/volume	user-modify-playback-state
Add Item To Playback Queue	/v1/me/player/queue	user-modify-playback-state
Get Current User's Profile	/v1/me	playlist-read-private
🚀 실행 방법
.env 파일에 환경변수 설정

MariaDB 및 필요한 DB 테이블 생성

패키지 설치

bash
npm install
서버 실행

bash
npm run dev
API 테스트는 Postman 또는 프론트엔드에서 진행

👥 팀원 역할
영채: 서버, DB, 인프라

은미: 인증, 모델

효성: Gemini, Spotify

혜민: Spotify

📝 기타
Spotify API를 사용하려면 Spotify Developer Dashboard에서 앱 등록 및 Client ID/Secret을 발급받아야 합니다.

각 API별 필요한 Scope를 반드시 확인하고 인증 플로우에 반영하세요.

토큰 갱신, 에러 처리 등은 서비스/컨트롤러에서 추가 구현 필요합니다.
