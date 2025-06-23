'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Eye, Calendar, Globe } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { detectLocation, translateText, getUITranslations } from '../../../lib/translation'
import AdSense from '../../../components/AdSense'

interface Article {
  id: string
  title: string
  content: string
  category: string
  createdAt: string
  views: number
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<Article | null>(null)
  const [translatedArticle, setTranslatedArticle] = useState<Article | null>(null)
  const [userLanguage, setUserLanguage] = useState('ko')
  const [isTranslating, setIsTranslating] = useState(false)
  const [uiTexts, setUiTexts] = useState<any>({})
  const router = useRouter()

  useEffect(() => {
    loadArticle()
    initializeLanguage()
  }, [params.id])

  const initializeLanguage = async () => {
    try {
      const location = await detectLocation()
      const language = location.language
      setUserLanguage(language)
      
      if (language !== 'ko') {
        const texts = await getUITranslations(language)
        setUiTexts(texts)
      }
    } catch (error) {
      console.error('Language detection failed:', error)
    }
  }

  const loadArticle = () => {
    const saved = localStorage.getItem('anonymous-articles')
    if (saved) {
      const articles: Article[] = JSON.parse(saved)
      const foundArticle = articles.find(article => article.id === params.id)
      
      if (foundArticle) {
        // Increment views
        const updatedArticles = articles.map(article => 
          article.id === params.id 
            ? { ...article, views: article.views + 1 } 
            : article
        )
        localStorage.setItem('anonymous-articles', JSON.stringify(updatedArticles))
        setArticle({ ...foundArticle, views: foundArticle.views + 1 })
      }
    }
  }

  const translateArticle = async (articleToTranslate: Article) => {
    if (userLanguage === 'ko') return articleToTranslate

    setIsTranslating(true)
    try {
      const translatedTitle = await translateText(articleToTranslate.title, 'ko', userLanguage)
      const translatedContent = await translateText(articleToTranslate.content, 'ko', userLanguage)
      const translatedCategory = await translateText(articleToTranslate.category, 'ko', userLanguage)
      
      const translated = {
        ...articleToTranslate,
        title: translatedTitle,
        content: translatedContent,
        category: translatedCategory
      }
      
      setTranslatedArticle(translated)
    } catch (error) {
      console.error('Translation failed:', error)
    } finally {
      setIsTranslating(false)
    }
  }

  useEffect(() => {
    if (article && userLanguage !== 'ko') {
      translateArticle(article)
    }
  }, [article, userLanguage])

  const getUIText = (key: string, fallback: string) => {
    return uiTexts[key] || fallback
  }

  const displayArticle = translatedArticle || article

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {getUIText('articleNotFound', '기사를 찾을 수 없습니다')}
          </h2>
          <Link 
            href="/"
            className="text-blue-600 hover:underline"
          >
            {getUIText('backToHome', '홈으로 돌아가기')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">
                {getUIText('backToNews', '뉴스로 돌아가기')}
              </span>
            </Link>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Globe className="h-4 w-4" />
                <span>{userLanguage.toUpperCase()}</span>
              </div>
              {isTranslating && (
                <span className="text-gray-300">
                  {getUIText('translating', '번역 중...')}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Top Banner Ad */}
      <div className="max-w-7xl mx-auto px-6 py-2">
        <AdSense 
          slot="5678901234"
          style={{ display: 'block', textAlign: 'center' }}
          format="horizontal"
          className="mb-4"
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Main Content */}
          <article className="col-span-12 lg:col-span-8">
            {/* Article Meta */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="inline-block bg-red-600 text-white text-sm px-3 py-1 rounded-full">
                {displayArticle?.category}
              </span>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{article.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Article Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-8 leading-tight font-serif">
              {displayArticle?.title}
            </h1>

            {/* Pre-content Ad */}
            <div className="mb-8">
              <AdSense 
                slot="6789012345"
                style={{ display: 'block', textAlign: 'center' }}
                format="rectangle"
                className="border-t border-b border-gray-200 py-4"
              />
            </div>

            {/* Article Content */}
            <div className="prose prose-xl max-w-none">
              <div className="text-2xl text-gray-800 leading-relaxed whitespace-pre-wrap font-serif">
                {displayArticle?.content}
              </div>
            </div>

            {/* Post-content Ad */}
            <div className="mt-8">
              <AdSense 
                slot="7890123456"
                style={{ display: 'block', textAlign: 'center' }}
                format="rectangle"
                className="border-t border-b border-gray-200 py-4"
              />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="col-span-12 lg:col-span-4">
            {/* Sidebar Ad */}
            <div className="mb-6">
              <AdSense 
                slot="8901234567"
                style={{ display: 'block', textAlign: 'center' }}
                format="vertical"
                className="border border-gray-200 p-4"
              />
            </div>

            {/* Related Articles or Other Content */}
            <div className="border-t-2 border-gray-300 pt-4">
              <h3 className="text-sm font-bold uppercase tracking-wide mb-4">
                {getUIText('relatedArticles', '관련 기사')}
              </h3>
              <p className="text-sm text-gray-600">
                {getUIText('moreArticlesMessage', '더 많은 기사를 보려면 홈페이지로 돌아가세요.')}
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Bottom Banner Ad */}
      <div className="max-w-7xl mx-auto px-6 py-4 border-t border-gray-200">
        <AdSense 
          slot="9012345678"
          style={{ display: 'block', textAlign: 'center' }}
          format="horizontal"
          className="mb-2"
        />
      </div>
    </div>
  )
}
