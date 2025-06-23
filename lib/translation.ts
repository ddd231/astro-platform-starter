// 위치 감지 함수
export async function detectLocation() {
  try {
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    
    // 국가 코드를 언어 코드로 매핑
    const languageMap: {[key: string]: string} = {
      'KR': 'ko', // 한국
      'US': 'en', 'GB': 'en', 'CA': 'en', 'AU': 'en', // 영어권
      'JP': 'ja', // 일본
      'CN': 'zh', 'TW': 'zh', 'HK': 'zh', // 중국어권
      'ES': 'es', 'MX': 'es', 'AR': 'es', // 스페인어권
      'FR': 'fr', // 프랑스
      'DE': 'de', // 독일
      'RU': 'ru', // 러시아
    }
    
    const language = languageMap[data.country_code] || 'en'
    
    return {
      country: data.country_name,
      countryCode: data.country_code,
      language: language
    }
  } catch (error) {
    console.error('Location detection failed:', error)
    return { country: 'Unknown', countryCode: 'US', language: 'en' }
  }
}

// 번역 함수 (LibreTranslate 사용)
export async function translateText(text: string, fromLang: string, toLang: string): Promise<string> {
  if (fromLang === toLang) return text
  
  try {
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        source: fromLang,
        target: toLang,
        format: 'text'
      }),
      headers: { 'Content-Type': 'application/json' }
    })
    
    const data = await response.json()
    return data.translatedText || text
  } catch (error) {
    console.error('Translation failed:', error)
    return text
  }
}

// UI 텍스트 번역
export async function getUITranslations(language: string) {
  const uiTexts = {
    // 한국어 원본
    ko: {
      siteTitle: '익명 뉴스',
      translating: '번역 중...',
      todayArticles: '오늘 작성',
      todayViews: '오늘 조회수',
      totalArticles: '전체 기사',
      writeArticle: '새 기사 작성',
      category: '카테고리',
      title: '제목',
      content: '내용',
      titlePlaceholder: '기사 제목을 입력하세요',
      contentPlaceholder: '기사 내용을 입력하세요',
      publish: '발행',
      cancel: '취소',
      readMore: '더 읽기',
      noArticles: '아직 작성된 기사가 없습니다.',
      writeNew: '새 기사 작성',
      about: '소개',
      aboutText: '익명으로 뉴스와 의견을 공유할 수 있는 플랫폼입니다. 회원가입 없이 누구나 자유롭게 기사를 작성하고 읽을 수 있습니다.',
      notFound: '기사를 찾을 수 없습니다',
      goBack: '돌아가기'
    }
  }

  if (language === 'ko') {
    return uiTexts.ko
  }

  try {
    const translations: {[key: string]: string} = {}
    
    for (const [key, koreanText] of Object.entries(uiTexts.ko)) {
      translations[key] = await translateText(koreanText, 'ko', language)
    }
    
    return translations
  } catch (error) {
    console.error('UI translation failed:', error)
    return uiTexts.ko
  }
}