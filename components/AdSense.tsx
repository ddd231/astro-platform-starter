'use client'

import { useEffect } from 'react'
import { ADSENSE_CONFIG } from '../lib/adsense'

interface AdSenseProps {
  slot: string
  format?: string
  responsive?: boolean
  style?: React.CSSProperties
  className?: string
}

export default function AdSense({ 
  slot, 
  format = 'auto', 
  responsive = true,
  style = { display: 'block' },
  className = ''
}: AdSenseProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  return (
    <div className={`adsense-container ${className}`}>
      <p className="text-xs text-gray-500 mb-2 text-center">Advertisement</p>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={ADSENSE_CONFIG.CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      ></ins>
    </div>
  )
}

// 사이드바 광고용 컴포넌트
export function SidebarAd() {
  return (
    <div className="mb-6">
      <p className="text-xs text-gray-500 mb-2 text-center">Advertisement</p>
      <AdSense 
        slot="1234567890"
        format="auto"
        className="min-h-[250px] bg-gray-100 border border-gray-200"
        style={{ display: 'block', minHeight: '250px' }}
      />
    </div>
  )
}

// 배너 광고용 컴포넌트 (상단)
export function BannerAd() {
  return (
    <div className="my-4">
      <p className="text-xs text-gray-500 mb-2 text-center">Advertisement</p>
      <AdSense 
        slot="0987654321"
        format="horizontal"
        className="min-h-[100px] bg-gray-100 border border-gray-200"
        style={{ display: 'block', minHeight: '100px' }}
      />
    </div>
  )
}

// 인피드 광고용 컴포넌트 (기사 중간)
export function InFeedAd() {
  return (
    <div className="my-6 mx-auto max-w-2xl">
      <p className="text-xs text-gray-500 mb-2 text-center">Advertisement</p>
      <AdSense 
        slot="1357924680"
        format="fluid"
        className="min-h-[200px] bg-gray-100 border border-gray-200 rounded"
        style={{ display: 'block', minHeight: '200px' }}
      />
    </div>
  )
}

// 기사 상세 페이지 하단 광고
export function ArticleBottomAd() {
  return (
    <div className="mt-8 mb-4">
      <p className="text-xs text-gray-500 mb-2 text-center">Advertisement</p>
      <AdSense 
        slot="2468013579"
        format="rectangle"
        className="min-h-[250px] bg-gray-100 border border-gray-200 rounded mx-auto"
        style={{ display: 'block', minHeight: '250px', maxWidth: '336px' }}
      />
    </div>
  )
}