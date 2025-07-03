import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Target, 
  Mail, 
  AlertTriangle, 
  Newspaper, 
  Users, 
  Code, 
  TrendingUp,
  Brain,
  Database,
  Copy,
  CheckCircle,
  ExternalLink,
  BarChart3,
  PieChart,
  Heart,
  DollarSign
} from 'lucide-react'
import { Brief } from '../lib/supabase'
import { NewsCard } from './NewsCard'
import { HiringChart } from './HiringChart'
import { TechStackGrid } from './TechStackGrid'
import { StockChart } from './StockChart'
import { ToneAnalysis } from './ToneAnalysis'
import { IntelligenceSources } from './IntelligenceSources'

interface BriefTabsProps {
  brief: Brief
}

export function BriefTabs({ brief }: BriefTabsProps) {
  const [activeTab, setActiveTab] = useState('summary')
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const tabs = [
    {
      id: 'summary',
      label: 'Strategic Summary',
      icon: FileText,
      color: 'blue'
    },
    {
      id: 'pitch',
      label: 'Pitch Strategy',
      icon: Target,
      color: 'purple'
    },
    {
      id: 'subject',
      label: 'Subject Line',
      icon: Mail,
      color: 'green'
    },
    {
      id: 'warnings',
      label: 'What NOT to Pitch',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      id: 'news',
      label: 'News Intelligence',
      icon: Newspaper,
      color: 'emerald',
      count: brief.news?.length || 0
    },
    {
      id: 'hiring',
      label: 'Hiring Intelligence',
      icon: Users,
      color: 'blue',
      count: brief.jobSignals?.length || 0
    },
    {
      id: 'tech',
      label: 'Technology Stack',
      icon: Code,
      color: 'violet',
      count: brief.techStack?.length || 0
    },
    {
      id: 'stock',
      label: 'Stock & Financials',
      icon: TrendingUp,
      color: 'orange'
    },
    {
      id: 'tone',
      label: 'NLP Tone Analysis',
      icon: Heart,
      color: 'pink'
    },
    {
      id: 'sources',
      label: 'Intelligence Sources',
      icon: Database,
      color: 'gray'
    }
  ]

  const getTabColor = (color: string, isActive: boolean) => {
    const colors = {
      blue: isActive ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'text-gray-400 hover:text-blue-300',
      purple: isActive ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'text-gray-400 hover:text-purple-300',
      green: isActive ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'text-gray-400 hover:text-green-300',
      red: isActive ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'text-gray-400 hover:text-red-300',
      emerald: isActive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'text-gray-400 hover:text-emerald-300',
      violet: isActive ? 'bg-violet-500/20 text-violet-300 border-violet-500/30' : 'text-gray-400 hover:text-violet-300',
      orange: isActive ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' : 'text-gray-400 hover:text-orange-300',
      pink: isActive ? 'bg-pink-500/20 text-pink-300 border-pink-500/30' : 'text-gray-400 hover:text-pink-300',
      gray: isActive ? 'bg-gray-500/20 text-gray-300 border-gray-500/30' : 'text-gray-400 hover:text-gray-300'
    }
    return colors[color as keyof typeof colors] || colors.gray
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Brain className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">AI-Generated Strategic Summary</h3>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                  {brief.summary}
                </p>
              </div>
            </div>
          </motion.div>
        )

      case 'pitch':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-semibold text-white">Personalized Pitch Strategy</h3>
                </div>
                <button
                  onClick={() => copyToClipboard(brief.pitchAngle, 'pitch')}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-purple-500/25"
                >
                  {copiedField === 'pitch' ? (
                    <><CheckCircle className="w-4 h-4" /> Copied!</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Copy Pitch</>
                  )}
                </button>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                  {brief.pitchAngle}
                </p>
              </div>
            </div>
          </motion.div>
        )

      case 'subject':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-semibold text-white">Ready-to-Use Subject Line</h3>
                </div>
                <button
                  onClick={() => copyToClipboard(brief.subjectLine, 'subject')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl transition-colors font-medium"
                >
                  {copiedField === 'subject' ? (
                    <><CheckCircle className="w-4 h-4" /> Copied!</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Copy Subject</>
                  )}
                </button>
              </div>
              <div className="text-center">
                <div className="inline-block bg-green-500/20 border border-green-500/30 rounded-xl px-8 py-6">
                  <p className="text-green-300 font-semibold text-xl">"{brief.subjectLine}"</p>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 'warnings':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <h3 className="text-xl font-semibold text-white">Strategic Warnings - What NOT to Pitch</h3>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                  {brief.whatNotToPitch}
                </p>
              </div>
            </div>
          </motion.div>
        )

      case 'news':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Newspaper className="w-6 h-6 text-emerald-400" />
                <h3 className="text-xl font-semibold text-white">Live News Intelligence</h3>
                <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm font-medium">
                  {brief.news?.length || 0} articles
                </span>
              </div>
            </div>
            {brief.news && brief.news.length > 0 ? (
              <div className="space-y-4">
                {brief.news.map((newsItem, index) => (
                  <NewsCard key={index} news={newsItem} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent news found for this company</p>
              </div>
            )}
          </motion.div>
        )

      case 'hiring':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">Hiring Intelligence</h3>
                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                  {brief.jobSignals?.length || 0} positions
                </span>
              </div>
            </div>
            <HiringChart jobSignals={brief.jobSignals || []} />
          </motion.div>
        )

      case 'tech':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Code className="w-6 h-6 text-violet-400" />
                <h3 className="text-xl font-semibold text-white">Technology Stack Analysis</h3>
                <span className="bg-violet-500/20 text-violet-300 px-3 py-1 rounded-full text-sm font-medium">
                  {brief.techStack?.length || 0} technologies
                </span>
              </div>
            </div>
            <TechStackGrid techStack={brief.techStackData || []} />
          </motion.div>
        )

      case 'stock':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-orange-400" />
              <h3 className="text-xl font-semibold text-white">Stock & Financial Data</h3>
            </div>
            <StockChart stockData={brief.stockData} />
          </motion.div>
        )

      case 'tone':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-pink-400" />
              <h3 className="text-xl font-semibold text-white">NLP Tone & Emotion Analysis</h3>
            </div>
            <ToneAnalysis toneInsights={brief.toneInsights} />
          </motion.div>
        )

      case 'sources':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-6 h-6 text-gray-400" />
              <h3 className="text-xl font-semibold text-white">Intelligence Sources</h3>
            </div>
            <IntelligenceSources sources={brief.intelligenceSources} />
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-800">
        <div className="flex overflow-x-auto scrollbar-hide">
          <div className="flex space-x-1 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-t-xl font-medium transition-all duration-200 border-b-2 ${
                    isActive 
                      ? `${getTabColor(tab.color, true)} border-current` 
                      : `${getTabColor(tab.color, false)} border-transparent hover:border-gray-600`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="bg-current/20 text-current px-2 py-0.5 rounded-full text-xs font-medium">
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {renderTabContent()}
        </AnimatePresence>
      </div>
    </div>
  )
}