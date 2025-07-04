'use client'

import { useState, useEffect } from 'react'
import { PlusCircle, Newspaper, Eye, Calendar, Globe, X } from 'lucide-react'
import { detectLocation, translateText, getUITranslations } from '../lib/translation'
import { ADSENSE_CONFIG } from '../lib/adsense'
import AdSense from '../components/AdSense'

interface Article {
  id: string
  title: string
  content: string
  category: string
  createdAt: string
  views: number
}

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    category: '정치'
  })
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [userLanguage, setUserLanguage] = useState('ko')
  const [isTranslating, setIsTranslating] = useState(false)
  const [translatedArticles, setTranslatedArticles] = useState<{[key: string]: Article}>({})
  const [uiTexts, setUiTexts] = useState<any>({})

  const categories = ['전체', '정치', '경제', '사회', '기술', '기타']

  useEffect(() => {
    loadArticles()
    initializeLanguage()
  }, [])

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

  const loadArticles = () => {
    const saved = localStorage.getItem('anonymous-articles')
    if (saved) {
      setArticles(JSON.parse(saved))
    }
  }

  const saveArticles = (newArticles: Article[]) => {
    localStorage.setItem('anonymous-articles', JSON.stringify(newArticles))
    setArticles(newArticles)
  }

  const translateArticlesIfNeeded = async (articlesToTranslate: Article[]) => {
    if (userLanguage === 'ko') return articlesToTranslate

    setIsTranslating(true)
    try {
      const translated: {[key: string]: Article} = {}
      
      for (const article of articlesToTranslate) {
        if (!translatedArticles[article.id]) {
          const translatedTitle = await translateText(article.title, 'ko', userLanguage)
          const translatedContent = await translateText(article.content, 'ko', userLanguage)
          const translatedCategory = await translateText(article.category, 'ko', userLanguage)
          
          translated[article.id] = {
            ...article,
            title: translatedTitle,
            content: translatedContent,
            category: translatedCategory
          }
        }
      }
      
      setTranslatedArticles(prev => ({...prev, ...translated}))
    } catch (error) {
      console.error('Translation failed:', error)
    } finally {
      setIsTranslating(false)
    }
  }

  useEffect(() => {
    if (userLanguage !== 'ko' && articles.length > 0) {
      translateArticlesIfNeeded(articles)
    }
  }, [articles, userLanguage])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const article: Article = {
      id: Date.now().toString(),
      title: newArticle.title,
      content: newArticle.content,
      category: newArticle.category,
      createdAt: new Date().toISOString(),
      views: 0
    }

    saveArticles([article, ...articles])
    setNewArticle({ title: '', content: '', category: '정치' })
    setShowForm(false)
  }

  const incrementViews = (id: string) => {
    const updatedArticles = articles.map(article => 
      article.id === id ? { ...article, views: article.views + 1 } : article
    )
    saveArticles(updatedArticles)
  }

  const getDisplayedArticles = () => {
    const filtered = selectedCategory === '전체' 
      ? articles 
      : articles.filter(article => article.category === selectedCategory)
    
    if (userLanguage === 'ko') {
      return filtered
    }
    
    return filtered.map(article => translatedArticles[article.id] || article)
  }

  const getTodayStats = () => {
    const today = new Date().toDateString()
    const todayArticles = articles.filter(article => 
      new Date(article.createdAt).toDateString() === today
    )
    const todayViews = todayArticles.reduce((sum, article) => sum + article.views, 0)
    
    return {
      todayCount: todayArticles.length,
      todayViews: todayViews,
      totalCount: articles.length
    }
  }

  const stats = getTodayStats()

  const getUIText = (key: string, fallback: string) => {
    return uiTexts[key] || fallback
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Newspaper className="h-7 w-7" />
              <h1 className="text-xl font-bold font-serif tracking-tight">
                {getUIText('siteTitle', '익명 뉴스')}
              </h1>
            </div>
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
          slot={ADSENSE_CONFIG.SLOTS.TOP_BANNER}
          style={ADSENSE_CONFIG.STYLES.BANNER}
          format={ADSENSE_CONFIG.FORMATS.HORIZONTAL}
          className="mb-4"
        />
      </div>

      <div className="max-w-6xl mx-auto px-3 py-2">
        <div className="grid grid-cols-12 gap-4">
          {/* Main Content */}
          <div className="col-span-12 lg:col-span-8">
            {/* Article Form */}
            {showForm && (
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h2 className="text-2xl font-bold font-serif mb-4">
                  {getUIText('writeArticle', '새 기사 작성')}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                      {getUIText('category', '카테고리')}
                    </label>
                    <select
                      value={newArticle.category}
                      onChange={(e) => setNewArticle({...newArticle, category: e.target.value})}
                      className="w-full p-2 border border-gray-300 text-sm focus:outline-none focus:border-black"
                    >
                      {categories.slice(1).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                      {getUIText('title', '제목')}
                    </label>
                    <input
                      type="text"
                      value={newArticle.title}
                      onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                      className="w-full p-3 border border-gray-300 text-sm focus:outline-none focus:border-black"
                      placeholder={getUIText('titlePlaceholder', '기사 제목을 입력하세요')}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                      {getUIText('content', '내용')}
                    </label>
                    <textarea
                      value={newArticle.content}
                      onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                      className="w-full p-3 border border-gray-300 text-sm focus:outline-none focus:border-black font-serif"
                      rows={6}
                      placeholder={getUIText('contentPlaceholder', '기사 내용을 입력하세요')}
                      required
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-6 py-2 text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      {getUIText('publish', '발행')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="bg-gray-800 text-white px-6 py-2 text-sm font-medium hover:bg-gray-900 transition-colors"
                    >
                      {getUIText('cancel', '취소')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-4 pb-2 border-b border-gray-300">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-2 py-1 text-xs font-bold uppercase tracking-wide transition-colors ${
                    selectedCategory === category
                      ? 'bg-black text-white'
                      : 'text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Articles */}
            <div className="space-y-4">
              {getDisplayedArticles().map((article, index) => (
                <div key={article.id}>
                  <article className="border-b border-gray-300 pb-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 text-center">
                        <span className="text-xs font-bold text-gray-600">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold uppercase tracking-wide text-gray-600">
                            {article.category}
                          </span>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{article.views} views</span>
                            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <h3 className="text-sm font-bold leading-tight mb-2">
                          <a 
                            href={`/article/${article.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => incrementViews(article.id)}
                            className="hover:underline text-left cursor-pointer"
                          >
                            {article.title}
                          </a>
                        </h3>
                        <a 
                          href={`/article/${article.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => incrementViews(article.id)}
                          className="cursor-pointer"
                        >
                          <p className="text-xs text-gray-700 leading-relaxed hover:text-gray-900">
                            {article.content.length > 120 
                              ? article.content.substring(0, 120) + '...' 
                              : article.content
                            }
                          </p>
                        </a>
                      </div>
                    </div>
                  </article>
                  
                  {/* Insert ad after every 5th article */}
                  {(index + 1) % 5 === 0 && (
                    <div className="my-6">
                      <AdSense 
                        slot={ADSENSE_CONFIG.SLOTS.CONTENT_RECTANGLE}
                        style={ADSENSE_CONFIG.STYLES.RECTANGLE}
                        format={ADSENSE_CONFIG.FORMATS.RECTANGLE}
                        className="border-t border-b border-gray-200 py-4"
                      />
                    </div>
                  )}
                </div>
              ))}
              
              {getDisplayedArticles().length === 0 && (
                <div className="text-center py-12">
                  <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {getUIText('noArticles', '아직 작성된 기사가 없습니다.')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4">
            {/* Write Button */}
            <div className="mb-4">
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-black text-white px-3 py-2 text-xs font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
              >
                + 새 기사 작성
              </button>
            </div>

            {/* Sidebar Ad */}
            <div className="mb-4">
              <AdSense 
                slot={ADSENSE_CONFIG.SLOTS.SIDEBAR_VERTICAL}
                style={ADSENSE_CONFIG.STYLES.SIDEBAR}
                format={ADSENSE_CONFIG.FORMATS.VERTICAL}
                className="border border-gray-200 p-2"
              />
            </div>

            {/* About */}
            <div className="border-t-2 border-gray-300 pt-3 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wide mb-2">
                ABOUT THIS SITE
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                익명으로 뉴스와 의견을 공유할 수 있는 플랫폼입니다. 회원가입 없이 누구나 자유롭게 기사를 작성하고 읽을 수 있습니다.
              </p>
            </div>

            {/* Stats moved to bottom */}
            <div className="border-t-4 border-black">
              <h3 className="text-sm font-bold bg-black text-white px-2 py-1 inline-block mb-3">
                TODAY'S STATISTICS
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="font-bold">오늘 작성:</span>
                  <span className="font-bold">{stats.todayCount}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="font-bold">오늘 조회수:</span>
                  <span className="font-bold">{stats.todayViews}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">전체 기사:</span>
                  <span className="font-bold">{stats.totalCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Banner Ad */}
      <div className="max-w-7xl mx-auto px-6 py-4 border-t border-gray-200">
        <AdSense 
          slot="4567890123"
          style={{ display: 'block', textAlign: 'center' }}
          format="horizontal"
          className="mb-2"
        />
      </div>
    </div>
  )
}