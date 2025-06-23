// 애드센스 설정
export const ADSENSE_CONFIG = {
  CLIENT_ID: 'ca-pub-XXXXXXXXXXXXXXXXX', // 실제 애드센스 클라이언트 ID로 교체 필요
  
  // 광고 슬롯 ID들 (실제 애드센스에서 생성한 슬롯 ID로 교체 필요)
  SLOTS: {
    TOP_BANNER: '1234567890',     // 상단 배너 광고
    SIDEBAR_VERTICAL: '2345678901', // 사이드바 세로 광고
    CONTENT_RECTANGLE: '3456789012', // 콘텐츠 중간 사각형 광고
    BOTTOM_BANNER: '4567890123',  // 하단 배너 광고
    ARTICLE_BOTTOM: '5678901234', // 기사 하단 광고
  },
  
  // 광고 스타일
  STYLES: {
    BANNER: {
      display: 'block',
      textAlign: 'center' as const,
      minHeight: '100px'
    },
    SIDEBAR: {
      display: 'block',
      minHeight: '250px',
      width: '100%'
    },
    RECTANGLE: {
      display: 'block',
      textAlign: 'center' as const,
      minHeight: '250px',
      maxWidth: '336px',
      margin: '0 auto'
    }
  },
  
  // 광고 형식
  FORMATS: {
    HORIZONTAL: 'horizontal',
    VERTICAL: 'vertical', 
    RECTANGLE: 'rectangle',
    AUTO: 'auto',
    FLUID: 'fluid'
  }
}