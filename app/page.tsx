'use client'

import { useState, useEffect } from 'react'
import { PlusCircle, Newspaper, Eye, Calendar, Globe } from 'lucide-react'
import { detectLocation, translateText, getUITranslations } from '../lib/translation'

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Newspaper className="h-8 w-8" />
              <h1 className="text-2xl font-bold tracking-tight">
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

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.todayCount}</div>
                  <div className="text-sm text-gray-600">{getUIText('todayArticles', '오늘 작성')}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.todayViews}</div>
                  <div className="text-sm text-gray-600">{getUIText('todayViews', '오늘 조회수')}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalCount}</div>
                  <div className="text-sm text-gray-600">{getUIText('totalArticles', '전체 기사')}</div>
                </div>
              </div>
            </div>

            {/* Article Form */}
            {showForm && (
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">
                  {getUIText('writeArticle', '새 기사 작성')}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {getUIText('category', '카테고리')}
                    </label>
                    <select
                      value={newArticle.category}
                      onChange={(e) => setNewArticle({...newArticle, category: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      {categories.slice(1).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {getUIText('title', '제목')}
                    </label>
                    <input
                      type="text"
                      value={newArticle.title}
                      onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder={getUIText('titlePlaceholder', '기사 제목을 입력하세요')}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {getUIText('content', '내용')}
                    </label>
                    <textarea
                      value={newArticle.content}
                      onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows={6}
                      placeholder={getUIText('contentPlaceholder', '기사 내용을 입력하세요')}
                      required
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      {getUIText('publish', '발행')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
                    >
                      {getUIText('cancel', '취소')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Articles */}
            <div className="space-y-4">
              {getDisplayedArticles().map((article) => (
                <article key={article.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                        {article.category}
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
                    <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                      <a 
                        href={`/article/${article.id}`}
                        onClick={(e) => {
                          e.preventDefault()
                          incrementViews(article.id)
                          window.open(`/article/${article.id}`, '_blank')
                        }}
                        className="hover:text-red-600 transition-colors cursor-pointer"
                      >
                        {article.title}
                      </a>
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {article.content.length > 300 
                        ? article.content.substring(0, 300) + '...'
                        : article.content
                      }
                    </p>
                    {article.content.length > 300 && (
                      <a 
                        href={`/article/${article.id}`}
                        onClick={(e) => {
                          e.preventDefault()
                          incrementViews(article.id)
                          window.open(`/article/${article.id}`, '_blank')
                        }}
                        className="text-red-600 hover:text-red-800 font-medium mt-2 inline-block"
                      >
                        {getUIText('readMore', '더 읽기')} →
                      </a>
                    )}
                  </div>
                </article>
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
          <div className="lg:col-span-1">
            {/* Write Button */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-red-600 text-white px-4 py-3 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
              >
                <PlusCircle className="h-5 w-5" />
                <span>{getUIText('writeNew', '새 기사 작성')}</span>
              </button>
            </div>

            {/* About */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-bold text-lg mb-3">
                {getUIText('about', '소개')}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {getUIText('aboutText', '익명으로 뉴스와 의견을 공유할 수 있는 플랫폼입니다. 회원가입 없이 누구나 자유롭게 기사를 작성하고 읽을 수 있습니다.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}