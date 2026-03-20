# 상견례 디지털 PPT (React + Framer Motion)

**Our Journey & Our Future** — 태블릿·모바일 대응 스크롤/클릭형 슬라이드입니다.

## 실행

```bash
cd presentation
npm install
npm run dev
```

개발 서버 주소는 **`http://localhost:5173/sanggyeon/`** 입니다. (`vite.config`의 `base: '/sanggyeon/'` 와 맞춤)

빌드: `npm run build` → `dist/` (태블릿에서 `npm run preview` 또는 정적 호스팅)

## 메인 청첩장과 함께 Netlify에 올리기

저장소 루트(웨 폴더)에서 `node scripts/build-site.mjs` 또는 `npm run build`를 실행하면 `dist-site/`에 메인(`/`)과 상견례(`/sanggyeon/`)가 함께 생성됩니다. Netlify는 루트의 `netlify.toml`을 사용합니다.

## 에셋

- **사진·영상**: [`public/images/`](public/images/)  
  - `youth/`, `future_kid/`, `nagoya/`, `days/`, `propose/`  
  - 신랑·신부 프로필: `youth/my_youth.jpg`, `youth/your_youth.jpg` 권장  
  - 각 폴더에 **MP4/WebM**이 있으면 해당 슬라이드 히어로가 **영상 우선**으로 표시됩니다.
  - `public/images`에 파일을 추가·이동한 뒤에는 **`npm run dev`를 한 번 다시 실행**해 주세요. (목록은 Vite 기동 시 스캔됩니다.)
- **BGM**: [`public/music/bgm.mp3`](public/music/bgm.mp3) 에 파일을 넣으세요.  
  (또는 상견례 루트의 `music/bgm.mp3`를 이 경로로 복사)

## 조작

- **다음 / 이전** 버튼, 하단 점(슬라이드 점프)
- 키보드: **←** **→** **Space** **Enter**
- 우측 하단: 배경음 **켜기/끄기** (브라우저 정책상 사용자 클릭 후 재생)

## 문구 수정

[`src/content.ts`](src/content.ts) 의 프로필·스토리 텍스트를 편집하면 됩니다.
