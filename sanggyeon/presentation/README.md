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

## 이미지 용량 줄이기 (구조 그대로)

**같은 폴더·같은 구조**로 두고 해상도·압축만 줄입니다.

```bash
# 상견례 (public/images)
npm run optimize-images

# 청첩장 (저장소 루트의 images — presentation 기준 ../../.. /images)
npm run optimize-images:invite

# 임의 경로
node scripts/optimize-images.mjs "C:/path/to/images"
```

- 긴 변 **1920px** 초과만 축소 (`MAX_EDGE=1600` 등으로 변경 가능)
- JPEG: mozjpeg 품질 **85**
- WebP: 품질 **82**
- PNG: 투명 없으면 **같은 이름의 `.jpg`로 바꾼 뒤 PNG 삭제** (용량 크게 감소). 투명 있으면 PNG만 재압축  
  → **HTML/CSS에 `something.png`로 박아 둔 경로**는 `.jpg`로 바꿔야 할 수 있음
- **원본 덮어쓰기**이므로 실행 전 Git 커밋 또는 폴더 복사 백업 권장

청첩장 쪽은 레포가 `웨`(루트에 `index.html` + `images/`)일 때 `optimize-images:invite`가 맞습니다.

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
