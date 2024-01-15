![header](https://capsule-render.vercel.app/api?type=waving&color=0:FF5501,100:FE3821)

<div align="center">

![team16](./open-market/public/logo/logo2.svg)

# [모두의 오디오 : MODI](https://github.com/techitPlus-FE-team3/open_market_projerct)

### 테킷 플러스 프론트엔드 1기
### 오픈마켓 프로젝트 : TEAM IP3

## 프로젝트 개요

🗓️ 기획 기간 : 2023.11.20 ~ 2023.11.27<br/>
🗓️ 개발 기간 : 2023.11.28 ~ 2023.12.22<br/>
**소규모 음원 제작자들을 위한 오픈마켓 플랫폼 구축**<br/>
(web for PC)

[모두의 오디오 MODI](https://develop--ip3-modi.netlify.app/)

## 팀원 소개

|                 [안승지](https://github.com/s-ja)                 |               [강보경](https://github.com/hungerbk)               |               [김진주](https://github.com/pearlKinn)               |
| :---------------------------------------------------------------: | :---------------------------------------------------------------: | :----------------------------------------------------------------: |
| <img width="200" height="200" src="./samples/teamates/asj.png" /> | <img width="200" height="200" src="./samples/teamates/kbk.png" /> | <img width="200" height="200" src="./samples//teamates/kjj.png" /> |

</div>

<div align="center">

## 🛠️Tech Stack

### Environment

<img src="https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?style=for-the-badge&logo=Visual%20Studio%20Code&logoColor=white">
<img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white">
<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white">

#### Language

<img src="https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=Typescript&logoColor=white"/>

#### Framework

<img src="https://img.shields.io/badge/vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>

#### State Management

<img src="https://img.shields.io/badge/reactquery-FF4154?style=for-the-badge&logo=reactquery&logoColor=white"/> <img src="https://img.shields.io/badge/recoil-3578E5?style=for-the-badge&logo=recoil&logoColor=white"/>

#### Style

<img src="https://img.shields.io/badge/emotion-673AB8?style=for-the-badge&logo=emotion&logoColor=white"/> <img src="https://img.shields.io/badge/mui-007FFF?style=for-the-badge&logo=mui&logoColor=white"/>

#### Library

<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=white"/> <img src="https://img.shields.io/badge/reactrouter-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white"/>

  <br/>

#### Deploy

<img src="https://img.shields.io/badge/mongodb-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/> <img src="https://img.shields.io/badge/koyeb-121212?style=for-the-badge&logo=koyeb&logoColor=white"/> <img src="https://img.shields.io/badge/netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white"/>

### 🧰Tools

<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"> <img src="https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white"> <img src="https://img.shields.io/badge/discord-5865F2?style=for-the-badge&logo=discord&logoColor=white">

</div>

## 📁디렉터리 트리

```
📦src
 ┣ 📂components
 ┃ ┣ 📂listMusicPlayer
 ┃ ┃ ┣ 📜ControlPanel.tsx
 ┃ ┃ ┣ 📜MusicPlayer.tsx
 ┃ ┃ ┗ 📜PlayerSlider.tsx
 ┃ ┣ 📜AuthInput.tsx
 ┃ ┣ 📜FilterComponent.tsx
 ┃ ┣ 📜FormInput.tsx
 ┃ ┣ 📜FunctionalButton.tsx
 ┃ ┣ 📜LoadingSpinner.tsx
 ┃ ┣ 📜MyPageList.tsx
 ┃ ┣ 📜ProductDetailBadgeComponent.tsx
 ┃ ┣ 📜ProductDetailComponent.tsx
 ┃ ┣ 📜ProductListComponent.tsx
 ┃ ┣ 📜ProductListItem.tsx
 ┃ ┣ 📜ReplyComponent.tsx
 ┃ ┣ 📜SearchBar.tsx
 ┃ ┣ 📜SelectGenre.tsx
 ┃ ┗ 📜Textarea.tsx
 ┣ 📂hooks
 ┃ ┣ 📜useCategoryFilterProductList.ts
 ┃ ┗ 📜useRequireAuth.ts
 ┣ 📂interfaces
 ┃ ┣ 📜category.d.ts
 ┃ ┣ 📜custom.d.ts
 ┃ ┣ 📜order.d.ts
 ┃ ┣ 📜product.d.ts
 ┃ ┗ 📜user.d.ts
 ┣ 📂layout
 ┃ ┣ 📜AuthLayout.tsx
 ┃ ┣ 📜Footer.tsx
 ┃ ┣ 📜Header.tsx
 ┃ ┗ 📜RootLayout.tsx
 ┣ 📂pages
 ┃ ┣ 📂error
 ┃ ┃ ┣ 📜Error404.tsx
 ┃ ┃ ┗ 📜ErrorBoundary.tsx
 ┃ ┣ 📂product
 ┃ ┃ ┣ 📜ProductDetail.tsx
 ┃ ┃ ┣ 📜ProductEdit.tsx
 ┃ ┃ ┣ 📜ProductManage.tsx
 ┃ ┃ ┣ 📜ProductPurchase.tsx
 ┃ ┃ ┗ 📜ProductRegistration.tsx
 ┃ ┣ 📂user
 ┃ ┃ ┣ 📜MyPage.tsx
 ┃ ┃ ┣ 📜SignIn.tsx
 ┃ ┃ ┣ 📜SignUp.tsx
 ┃ ┃ ┣ 📜UserEdit.tsx
 ┃ ┃ ┣ 📜UserOrders.tsx
 ┃ ┃ ┗ 📜UserProducts.tsx
 ┃ ┗ 📜Index.tsx
 ┣ 📂states
 ┃ ┣ 📜authState.ts
 ┃ ┣ 📜categoryState.ts
 ┃ ┗ 📜productListState.ts
 ┣ 📂styles
 ┃ ┗ 📜common.ts
 ┣ 📂utils
 ┃ ┣ 📜debounce.ts
 ┃ ┣ 📜filterProductList.ts
 ┃ ┣ 📜formData.ts
 ┃ ┣ 📜index.ts
 ┃ ┣ 📜itemWithExpireTime.ts
 ┃ ┣ 📜numberWithComma.ts
 ┃ ┣ 📜refreshToken.ts
 ┃ ┗ 📜uploadFile.ts
 ┣ 📜App.tsx
 ┣ 📜main.tsx
 ┣ 📜routes.tsx
 ┗ 📜vite-env.d.ts
```

## 👀서버 구동

### 프로젝트 루트에서 실행
<!-- * -s 옵션: 라우터를 추가할 경우 클라이언트가 요청한 모든 URL에 대해서 index.html을 응답하도록 설정 -->

```
cd open-market
npm run dev
```

### 프로젝트 빌드

```
cd open-market
npm run build
```

### 프로젝트 프리뷰

```
cd open-market
npm run preview
```

![footer](https://capsule-render.vercel.app/api?section=footer&type=waving&color=0:FF5501,100:FE3821)
