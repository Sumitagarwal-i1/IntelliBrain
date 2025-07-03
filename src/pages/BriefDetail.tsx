import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Zap,
  RefreshCw,
  Share2
} from 'lucide-react'
import { Brief, briefsService } from '../lib/supabase'
import { BriefOverview } from '../components/BriefOverview'
import { BriefTabs } from '../components/BriefTabs'
import { ShareModal } from '../components/ShareModal'
import { Navigation } from '../components/Navigation'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { useAuth } from '../contexts/AuthContext'

export function BriefDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [brief, setBrief] = useState<Brief | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isImproving, setIsImproving] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    if (id && user) {
      loadBrief(id)
    }
  }, [id, user])

  const loadBrief = async (briefId: string) => {
    try {
      setLoading(true)
      setError(null)
      const briefData = await briefsService.getById(briefId, user?.id)
      if (!briefData) {
        setError('Brief not found or you do not have permission to view it.')
      } else {
        setBrief(briefData)
      }
    } catch (error) {
      console.error('Error loading brief:', error)
      setError('Failed to load brief. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleImproveBrief = async () => {
    if (!brief) return
    
    setIsImproving(true)
    try {
      // Call the improve brief API
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/improve-brief`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          briefId: brief.id,
          userId: user?.id
        }),
      })

      if (response.ok) {
        // Reload the brief to get updated data
        await loadBrief(brief.id)
      }
    } catch (error) {
      console.error('Failed to improve brief:', error)
    } finally {
      setIsImproving(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="pt-24 container mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">{error}</h1>
            <Link to="/app" className="text-blue-400 hover:text-blue-300">
              ← Back to Briefs
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!brief) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="pt-24 container mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Brief Not Found</h1>
            <Link to="/app" className="text-blue-400 hover:text-blue-300">
              ← Back to Briefs
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="pt-24 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/app"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Briefs
          </Link>
          
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors font-medium"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>

        {/* Company Overview - Horizontal Layout */}
        <div className="mb-8">
          <BriefOverview brief={brief} />
        </div>

        {/* Two-Column Layout: Vertical Tabs + Content */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column - Vertical Tab Navigation */}
          <div className="lg:col-span-1">
            <BriefTabs brief={brief} layout="vertical" />
          </div>

          {/* Right Column - Tab Content */}
          <div className="lg:col-span-4">
            <BriefTabs brief={brief} layout="content" />
          </div>
        </div>

        {/* Floating Improve Button */}
        <motion.button
          onClick={handleImproveBrief}
          disabled={isImproving}
          whileHover={{ scale: isImproving ? 1 : 1.05 }}
          whileTap={{ scale: isImproving ? 1 : 0.95 }}
          className="fixed bottom-8 right-8 flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full font-medium shadow-2xl hover:shadow-purple-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-50"
        >
          {isImproving ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Improving Brief...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Improve This Brief
            </>
          )}
        </motion.button>

        {/* Share Modal */}
        <ShareModal 
          brief={brief}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      </div>
    </div>
  )
}