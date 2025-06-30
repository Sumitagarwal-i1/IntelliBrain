import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  Users, 
  Newspaper, 
  Code,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'
import { Navigation } from '../components/Navigation'

export function Landing() {
  const [currentDemo, setCurrentDemo] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const demoSteps = [
    {
      title: "Enter Company Details",
      description: "Start by entering a company name and your strategic intent",
      visual: "form-input"
    },
    {
      title: "AI Analysis in Progress",
      description: "Our AI analyzes real-time data from multiple sources",
      visual: "analyzing"
    },
    {
      title: "Strategic Brief Generated",
      description: "Get personalized insights and pitch strategies",
      visual: "brief-result"
    }
  ]

  useEffect(() => {
    if (!isPlaying) return
    
    const interval = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % demoSteps.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isPlaying, demoSteps.length])

  const features = [
    {
      icon: TrendingUp,
      title: 'Real-Time Intelligence',
      description: 'Live news feeds, hiring signals, and market intelligence to stay ahead of the competition.',
      color: 'green',
      demo: 'Live data from NewsData.io, JSearch, and BuiltWith APIs'
    },
    {
      icon: Target,
      title: 'AI-Powered Strategies',
      description: 'Groq LLaMA-3 crafts personalized pitch angles and subject lines tailored to each company.',
      color: 'violet',
      demo: 'Advanced natural language processing for strategic insights'
    },
    {
      icon: Building2,
      title: 'Tech Stack Analysis',
      description: 'Deep technology profiling to understand exactly what tools and platforms they use.',
      color: 'orange',
      demo: 'Comprehensive technology detection and confidence scoring'
    }
  ]

  const DemoVisual = ({ type }: { type: string }) => {
    switch (type) {
      case 'form-input':
        return (
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400 mb-2">Company Name</div>
                <div className="bg-gray-800 rounded px-3 py-2 text-white">Shopify</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-2">Strategic Intent</div>
                <div className="bg-gray-800 rounded px-3 py-2 text-gray-300 text-sm">
                  Pitch our AI analytics platform to help optimize their e-commerce infrastructure...
                </div>
              </div>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-primary-600 rounded px-4 py-2 text-white text-center font-medium"
              >
                Generate Intelligence Brief
              </motion.div>
            </div>
          </div>
        )
      
      case 'analyzing':
        return (
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <div className="text-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mx-auto mb-4"
              >
                <Brain className="w-6 h-6 text-white" />
              </motion.div>
              <div className="text-white font-medium">Analyzing Shopify</div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Fetching real-time news...', status: 'complete' },
                { label: 'Analyzing hiring signals...', status: 'active' },
                { label: 'Detecting tech stack...', status: 'pending' },
                { label: 'Generating AI insights...', status: 'pending' }
              ].map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    step.status === 'complete' ? 'bg-green-500' :
                    step.status === 'active' ? 'bg-primary-500 animate-pulse' :
                    'bg-gray-600'
                  }`} />
                  <span className={`text-sm ${
                    step.status === 'complete' ? 'text-green-400' :
                    step.status === 'active' ? 'text-white' :
                    'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'brief-result':
        return (
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-white font-medium">Shopify</div>
                <div className="text-xs text-gray-400">Brief generated successfully</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-primary-500/10 border border-primary-500/20 rounded p-3">
                <div className="text-xs text-primary-400 mb-1">Strategic Summary</div>
                <div className="text-sm text-gray-300">
                  Shopify is experiencing rapid growth with recent platform expansions...
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-gray-800 rounded p-2 text-center">
                  <div className="text-green-400 font-medium">12</div>
                  <div className="text-gray-500">News</div>
                </div>
                <div className="bg-gray-800 rounded p-2 text-center">
                  <div className="text-blue-400 font-medium">8</div>
                  <div className="text-gray-500">Jobs</div>
                </div>
                <div className="bg-gray-800 rounded p-2 text-center">
                  <div className="text-purple-400 font-medium">15</div>
                  <div className="text-gray-500">Tech</div>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      <Navigation />

      {/* Hero Section */}
      <main className="pt-24 container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                AI-Powered B2B
                <span className="bg-gradient-to-r from-primary-400 to-violet-400 bg-clip-text text-transparent">
                  {" "}Intelligence
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                Generate personalized strategic briefs with real-time company intelligence. 
                Transform your outreach with AI-driven insights from live data sources.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/app"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary-600 hover:bg-primary-500 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-primary-500/25 hover:scale-105"
                >
                  <Sparkles className="w-5 h-5" />
                  Create Your First Brief
                  <ArrowRight className="w-5 h-5" />
                </Link>
                
                <button className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white rounded-xl font-semibold text-lg transition-all duration-200">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>

              {/* Real-time Data Sources */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-gray-400">Live News Data</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-gray-400">Hiring Signals</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  <span className="text-gray-400">Tech Stack Analysis</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6">
              {/* Demo Controls */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Live Demo</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 text-gray-400" /> : <Play className="w-4 h-4 text-gray-400" />}
                  </button>
                  <button
                    onClick={() => setCurrentDemo(0)}
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Demo Steps */}
              <div className="flex justify-between mb-6">
                {demoSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex-1 text-center cursor-pointer transition-all duration-300 ${
                      index === currentDemo ? 'text-primary-400' : 'text-gray-500'
                    }`}
                    onClick={() => setCurrentDemo(index)}
                  >
                    <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      index === currentDemo 
                        ? 'bg-primary-500 text-white' 
                        : index < currentDemo 
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="text-xs font-medium">{step.title}</div>
                  </div>
                ))}
              </div>

              {/* Demo Visual */}
              <div className="mb-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentDemo}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DemoVisual type={demoSteps[currentDemo].visual} />
                  </motion.div>
                </AnimatePresence>
              </div>

              <p className="text-sm text-gray-400 text-center">
                {demoSteps[currentDemo].description}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.2 }}
                className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 bg-${feature.color}-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 text-${feature.color}-400`} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 group-hover:text-primary-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  {feature.description}
                </p>
                <div className="text-xs text-gray-500 bg-gray-800/50 rounded-lg p-3">
                  <strong>Technology:</strong> {feature.demo}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="bg-gradient-to-r from-primary-500/10 to-violet-500/10 border border-primary-500/20 rounded-2xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your B2B Outreach?</h2>
          <p className="text-gray-300 mb-6 text-lg max-w-2xl mx-auto">
            Join forward-thinking sales teams using real-time AI intelligence to close more deals with precision and confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-500 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105"
            >
              <Zap className="w-5 h-5" />
              Start Free Analysis
            </Link>
            <Link
              to="/docs"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white rounded-xl font-semibold text-lg transition-all duration-200"
            >
              <Brain className="w-5 h-5" />
              View Documentation
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  )
}