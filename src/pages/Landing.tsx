import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
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
  RotateCcw,
  Heart,
  BarChart3,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  UserCheck,
  PieChart,
  Search,
  Lightbulb,
  Briefcase,
  TrendingDown,
  FileText
} from 'lucide-react'
import { Navigation } from '../components/Navigation'

export function Landing() {
  const [currentDemo, setCurrentDemo] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

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
      description: 'Live news feeds, hiring signals, stock data, and market intelligence to stay ahead.',
      color: 'emerald',
      demo: 'NewsData.io, JSearch, Yahoo Finance APIs'
    },
    {
      icon: Target,
      title: 'AI-Powered Strategies',
      description: 'Advanced AI crafts personalized pitch angles and subject lines tailored to each company.',
      color: 'blue',
      demo: 'Groq LLaMA-3 with natural language processing'
    },
    {
      icon: Heart,
      title: 'NLP Tone Analysis',
      description: 'Deep emotion and sentiment analysis to understand company mood and market positioning.',
      color: 'pink',
      demo: 'Twinword API for emotion detection and sentiment scoring'
    }
  ]

  const audienceCards = [
    {
      icon: Lightbulb,
      title: 'Founders',
      description: 'Research potential partners, investors, and acquisition targets with comprehensive intelligence.',
      color: 'yellow'
    },
    {
      icon: BarChart3,
      title: 'Analysts',
      description: 'Generate detailed market research and competitive analysis reports in minutes.',
      color: 'blue'
    },
    {
      icon: Users,
      title: 'Sales Teams',
      description: 'Craft personalized outreach strategies with real-time company insights and signals.',
      color: 'green'
    },
    {
      icon: Briefcase,
      title: 'Agencies',
      description: 'Deliver premium intelligence reports to clients with professional-grade analysis.',
      color: 'purple'
    }
  ]

  const useCases = [
    {
      title: 'Partnership Development',
      description: 'Identify strategic partnership opportunities and craft compelling proposals.',
      icon: Building2,
      color: 'blue'
    },
    {
      title: 'Investment Research',
      description: 'Analyze potential investments with comprehensive market and company intelligence.',
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Competitive Analysis',
      description: 'Monitor competitors and identify market positioning opportunities.',
      icon: Search,
      color: 'purple'
    },
    {
      title: 'Client Acquisition',
      description: 'Research prospects and create personalized outreach campaigns that convert.',
      icon: Target,
      color: 'orange'
    }
  ]

  const howItWorksSteps = [
    {
      step: 1,
      title: 'Enter Company & Intent',
      description: 'Input target company details and describe your strategic objective.',
      icon: Building2,
      color: 'blue'
    },
    {
      step: 2,
      title: 'AI Research',
      description: 'Our AI analyzes real-time data from news, jobs, stock, and social sources.',
      icon: Zap,
      color: 'purple'
    },
    {
      step: 3,
      title: 'Brief Output',
      description: 'Receive comprehensive strategic brief with actionable insights and recommendations.',
      icon: FileText,
      color: 'green'
    }
  ]

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'How do I create my first brief?',
          answer: 'Simply click "Start Free Now", enter a company name and your strategic intent, then let our AI generate comprehensive insights in minutes.'
        },
        {
          question: 'What data sources does PitchIntel use?',
          answer: 'We integrate with NewsData.io for real-time news, JSearch for job postings, Yahoo Finance for stock data, Twinword for NLP analysis, and Clearbit for company metadata.'
        }
      ]
    },
    {
      category: 'Plans & Billing',
      questions: [
        {
          question: 'Is there a free plan?',
          answer: 'Yes! Our free plan includes 5 briefs per month with basic AI analysis, news intelligence, and job signals.'
        },
        {
          question: 'Can I upgrade or downgrade anytime?',
          answer: 'Absolutely. You can change your plan at any time, and changes take effect immediately.'
        }
      ]
    },
    {
      category: 'Account',
      questions: [
        {
          question: 'How secure is my data?',
          answer: 'We use enterprise-grade security with encryption in transit and at rest. Your data is never shared with third parties.'
        },
        {
          question: 'Can I export my briefs?',
          answer: 'Yes, Pro users can export briefs as PDF/HTML and share them with team members or clients.'
        }
      ]
    }
  ]

  const DemoVisual = ({ type }: { type: string }) => {
    switch (type) {
      case 'form-input':
        return (
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400 mb-2">Company Name</div>
                <div className="bg-gray-800 rounded-lg px-3 py-2 text-white">Shopify</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-2">Strategic Intent</div>
                <div className="bg-gray-800 rounded-lg px-3 py-2 text-gray-300 text-sm">
                  I want to explore acquisition opportunities and understand their technology stack...
                </div>
              </div>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-blue-600 rounded-lg px-4 py-2 text-white text-center font-medium"
              >
                Generate Intelligence Brief
              </motion.div>
            </div>
          </div>
        )
      
      case 'analyzing':
        return (
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="text-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 flex items-center justify-center mx-auto mb-4"
              >
                <img 
                  src="/ChatGPT Image Jul 3, 2025, 06_37_50 PM.png" 
                  alt="PitchIntel Logo"
                  className="w-12 h-12 object-contain"
                />
              </motion.div>
              <div className="text-white font-medium">Analyzing Shopify</div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Fetching real-time news...', status: 'complete' },
                { label: 'Analyzing hiring signals...', status: 'complete' },
                { label: 'Processing stock data...', status: 'active' },
                { label: 'Running NLP tone analysis...', status: 'pending' },
                { label: 'Generating AI insights...', status: 'pending' }
              ].map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    step.status === 'complete' ? 'bg-green-500' :
                    step.status === 'active' ? 'bg-blue-500 animate-pulse' :
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
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
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
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <div className="text-xs text-blue-400 mb-1">Strategic Summary</div>
                <div className="text-sm text-gray-300">
                  Shopify shows strong growth momentum with positive market sentiment...
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="bg-gray-800 rounded p-2 text-center">
                  <div className="text-emerald-400 font-medium">12</div>
                  <div className="text-gray-500">News</div>
                </div>
                <div className="bg-gray-800 rounded p-2 text-center">
                  <div className="text-blue-400 font-medium">8</div>
                  <div className="text-gray-500">Jobs</div>
                </div>
                <div className="bg-gray-800 rounded p-2 text-center">
                  <div className="text-violet-400 font-medium">15</div>
                  <div className="text-gray-500">Tech</div>
                </div>
                <div className="bg-gray-800 rounded p-2 text-center">
                  <div className="text-pink-400 font-medium">Joy</div>
                  <div className="text-gray-500">Tone</div>
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
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
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
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {" "}Intelligence
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                Generate personalized strategic briefs with real-time company intelligence. 
                Transform your outreach with AI-driven insights from live data sources and NLP analysis.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/app"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-blue-500/25 hover:scale-105"
                >
                  <Sparkles className="w-5 h-5" />
                  Start Free Now
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
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-gray-400">Live News Data</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-gray-400">Stock & Finance</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                  <span className="text-gray-400">NLP Tone Analysis</span>
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
                      index === currentDemo ? 'text-blue-400' : 'text-gray-500'
                    }`}
                    onClick={() => setCurrentDemo(index)}
                  >
                    <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      index === currentDemo 
                        ? 'bg-blue-500 text-white' 
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

        {/* Audience Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-32 mb-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Built to Empower Forward-Thinking Teams
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From startup founders to enterprise sales teams, PitchIntel delivers the intelligence you need to make informed decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {audienceCards.map((card, index) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6 text-center hover:border-gray-700 transition-all duration-300 group hover:scale-105"
                >
                  <div className={`w-16 h-16 bg-${card.color}-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 text-${card.color}-400`} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{card.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{card.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Use Cases Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mb-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Who Is PitchIntel For?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover how different teams leverage AI-powered intelligence for strategic advantage.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon
              return (
                <motion.div
                  key={useCase.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 bg-${useCase.color}-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 text-${useCase.color}-400`} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{useCase.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{useCase.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="mb-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Three simple steps to generate comprehensive strategic intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 + index * 0.2 }}
                  className="text-center relative"
                >
                  {index < howItWorksSteps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-gray-600 to-gray-800 transform translate-x-1/2" />
                  )}
                  <div className={`w-24 h-24 bg-${step.color}-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10 border-4 border-gray-900`}>
                    <Icon className={`w-10 h-10 text-${step.color}-400`} />
                  </div>
                  <div className={`text-sm font-bold text-${step.color}-400 mb-2`}>STEP {step.step}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

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
                  <div className={`w-12 h-12 bg-${feature.color}-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 text-${feature.color}-400`} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 group-hover:text-blue-300 transition-colors">
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

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="mb-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to know about PitchIntel and how it works.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {faqs.map((category, categoryIndex) => (
              <div key={category.category} className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-6">{category.category}</h3>
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => {
                    const faqId = categoryIndex * 100 + faqIndex
                    const isOpen = openFaq === faqId
                    
                    return (
                      <div key={faqIndex} className="border border-gray-700 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : faqId)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/50 transition-colors"
                        >
                          <span className="font-medium text-white">{faq.question}</span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4 pt-0 text-gray-400 leading-relaxed">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0 }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8 text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Create Your First Strategic Brief?
          </h2>
          <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
            Join thousands of professionals using PitchIntel to make smarter business decisions with AI-powered intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105"
            >
              <Zap className="w-5 h-5" />
              Start Free Now
            </Link>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white rounded-xl font-semibold text-lg transition-all duration-200">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}