'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Eye, Calendar, Globe } from 'lucide-react'
import { detectLocation, translateText, getUITranslations } from '../../../lib/translation'

interface Article {
  id: string
  title: string
  content: string
  category: string
  createdAt: string
  views: number
}

// Static params generation for static export
export function generateStaticParams() {
  // Return empty array for now - articles will be handled client-side
  return []
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<Article | null>(null)
  const [userLanguage, setUserLanguage] = useState('ko')
  const [isTranslating, setIsTranslating] = useState(false)
  const [translatedArticle, setTranslatedArticle] = useState<Article | null>(null)
  const [uiTexts, setUiTexts] = useState<any>({})

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
      const foundArticle = articles.find(a => a.id === params.id)
      if (foundArticle) {
        // 조회수 증가
        const updatedArticles = articles.map(a => 
          a.id === params.id ? { ...a, views: a.views + 1 } : a
        )
        localStorage.setItem('anonymous-articles', JSON.stringify(updatedArticles))
        setArticle({ ...foundArticle, views: foundArticle.views + 1 })
      }
    }
  }

  const translateArticleIfNeeded = async (articleToTranslate: Article) => {
    if (userLanguage === 'ko') return

    setIsTranslating(true)
    try {
      const translatedTitle = await translateText(articleToTranslate.title, 'ko', userLanguage)
      const translatedContent = await translateText(articleToTranslate.content, 'ko', userLanguage)
      const translatedCategory = await translateText(articleToTranslate.category, 'ko', userLanguage)
      
      setTranslatedArticle({
        ...articleToTranslate,
        title: translatedTitle,
        content: translatedContent,
        category: translatedCategory
      })
    } catch (error) {
      console.error('Translation failed:', error)
    } finally {
      setIsTranslating(false)
    }
  }

  useEffect(() => {
    if (article && userLanguage !== 'ko') {
      translateArticleIfNeeded(article)
    }
  }, [article, userLanguage])

  const displayArticle = userLanguage === 'ko' ? article : (translatedArticle || article)

  const getUIText = (key: string, fallback: string) => {
    return uiTexts[key] || fallback
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {getUIText('notFound', '기사를 찾을 수 없습니다')}
          </h1>
          <button
            onClick={() => window.close()}
            className="text-red-600 hover:text-red-800"
          >
            {getUIText('goBack', '돌아가기')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.close()}
              className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>{getUIText('goBack', '돌아가기')}</span>
            </button>
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

      {/* Article Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-sm border">
          <div className="p-8">
            {/* Article Meta */}
            <div className="flex items-center justify-between mb-6">
              <span className="inline-block bg-red-600 text-white text-sm px-3 py-1 rounded-full">
                {displayArticle?.category}
              </span>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
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
            <h1 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">
              {displayArticle?.title}
            </h1>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-2xl text-gray-800 leading-relaxed whitespace-pre-wrap">
                {displayArticle?.content}
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}