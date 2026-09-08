# 내 차 어디에?

GPS 좌표와 층·구역, 메모, 사진을 함께 저장하는 모바일 우선 주차 위치 기록 PWA입니다. 기록은 서버로 전송되지 않고 현재 브라우저의 IndexedDB에만 저장됩니다.

## 실행 방법

### 방법 1. 원클릭 실행 (가장 추천)
- 바탕화면의 **`내 차 어디에`** 바로가기 또는 프로젝트 폴더의 **`실행하기.bat`** 파일을 더블클릭합니다.
- PC 브라우저(`https://localhost:4173`)가 자동으로 실행됩니다.
- 콘솔에 출력되는 **QR 코드**를 스마트폰(동일 Wi-Fi)으로 스캔하면 스마트폰에서도 바로 접속하여 GPS 위치를 기록할 수 있습니다.

### 방법 2. 터미널 수동 실행
```bash
npm install
npm run start
```
(또는 개발 모드: `npm run dev:host`)

## 사용

1. 층·구역과 메모를 입력하고 필요하면 사진을 추가합니다.
2. **현재 위치 저장**을 누르고 브라우저의 위치 권한을 허용합니다.
3. 가장 최근 기록은 현재 주차 위치로 표시됩니다.
4. 기록을 선택하면 좌표, GPS 정확도, 사진을 확인하고 OpenStreetMap에서 열 수 있습니다.
5. 휴지통 버튼으로 기록을 삭제할 수 있습니다.

사진은 저장 공간을 줄이기 위해 기기에서 JPEG로 압축됩니다. 브라우저 데이터나 사이트 데이터를 삭제하면 주차 기록도 함께 삭제되며 다른 기기와 동기화되지 않습니다.

## 검증

```bash
npm run build
npm run lint
```

## GitHub Pages 배포 (자동화)

이 프로젝트에는 GitHub Actions를 통한 자동 배포 워크플로우(`.github/workflows/deploy.yml`)가 구성되어 있습니다.

1. GitHub에서 새 저장소(예: `parking-app` 또는 `Parking_App`)를 생성합니다.
2. 코드를 GitHub 저장소의 `main` 브랜치에 푸시합니다.
3. GitHub 저장소의 **Settings** → **Pages**로 이동합니다.
4. **Build and deployment** > **Source** 항목을 **`GitHub Actions`**로 선택합니다.
5. 푸시할 때마다 GitHub Actions가 자동으로 빌드하여 `https://<아이디>.github.io/<저장소이름>/` 주소로 HTTPS 배포를 완료합니다.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
