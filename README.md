# 익명 뉴스 플랫폼

익명으로 뉴스 기사를 작성하고 공유할 수 있는 웹 플랫폼입니다.

## 🌟 주요 기능

- **익명 기사 작성**: 회원가입 없이 즉시 기사 작성 가능
- **카테고리 분류**: 정치, 경제, 사회, 기술, 기타로 체계적 분류
- **다국어 자동 번역**: IP 기반으로 8개 언어 자동 번역
- **반응형 디자인**: 모바일/데스크톱 최적화
- **실시간 통계**: 조회수, 작성 통계 실시간 표시

## 🌍 지원 언어

- 🇰🇷 한국어 (기본)
- 🇺🇸 English
- 🇯🇵 日本語
- 🇨🇳 中文
- 🇪🇸 Español
- 🇫🇷 Français
- 🇩🇪 Deutsch
- 🇷🇺 Русский

## 🚀 라이브 데모

**🌐 [anomynousnews.netlify.app](https://anomynousnews.netlify.app)**

## 🛠 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Translation**: LibreTranslate API
- **Location**: ipapi.co
- **Deployment**: Netlify

## 🏃‍♂️ 로컬 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

→ http://localhost:3000

## 📁 프로젝트 구조

```
anonymous-news/
├── app/
│   ├── layout.tsx          # 레이아웃 컴포넌트
│   ├── page.tsx            # 메인 페이지
│   ├── globals.css         # 글로벌 스타일
│   └── article/[id]/
│       └── page.tsx        # 기사 상세 페이지
├── lib/
│   └── translation.ts      # 번역 시스템
├── package.json
└── ...config files
```

## 💡 사용법

1. **기사 작성**: 우측 "새 기사 작성" 버튼 클릭
2. **카테고리 선택**: 정치, 경제, 사회, 기술, 기타 중 선택
3. **제목/내용 입력**: 원하는 내용 작성
4. **발행**: 즉시 메인 페이지에 표시
5. **상세 보기**: 기사 제목 클릭 시 새 창에서 전체 내용 표시

## 🌐 자동 번역

- IP 주소 기반으로 국가/언어 자동 감지
- 해외 접속 시 UI와 콘텐츠 모두 자동 번역
- 실시간 번역 상태 표시

## 📊 특징

- **WSJ 스타일**: 전문적인 뉴스 사이트 디자인
- **익명성**: 회원가입이나 로그인 불필요
- **실시간 통계**: 오늘 작성 수, 조회수 등
- **로컬 저장**: 브라우저 로컬스토리지 활용

## 🤝 기여

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 라이센스

MIT License

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

**🚀 [지금 바로 사용해보기](https://anomynousnews.netlify.app)**