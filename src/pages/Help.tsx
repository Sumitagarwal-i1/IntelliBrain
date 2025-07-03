import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  MessageCircle,
  BookOpen,
  Zap,
  Users,
  CreditCard,
  Settings,
  AlertTriangle
} from 'lucide-react'
import { Navigation } from '../components/Navigation'
import { Link } from 'react-router-dom'

export function Help() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqCategories = [
    {
      title: 'Getting Started',
      icon: Zap,
      color: 'blue',
      faqs: [
        {
          question: 'How do I create my first brief?',
          answer: 'Click "New Brief" in your dashboard, enter a company name and your strategic intent, then let our AI generate comprehensive insights. The process typically takes 2-3 minutes.'
        },
        {
          question: 'What information do I need to provide?',
          answer: 'You need the target company name and a description of your strategic intent. Optionally, you can add your company context for more personalized briefs.'
        },
        {
          question: 'How accurate is the AI analysis?',
          answer: 'Our AI uses real-time data from verified sources including NewsData.io, JSearch, and Yahoo Finance. Analysis accuracy depends on data availability and is continuously improving.'
        },
        {
          question: 'Can I edit or improve generated briefs?',
          answer: 'Yes! Use the "Improve This Brief" button to regenerate strategic sections with enhanced insights. You can also copy and customize any section.'
        }
      ]
    },
    {
      title: 'Plans & Billing',
      icon: CreditCard,
      color: 'green',
      faqs: [
        {
          question: 'What\'s included in the free plan?',
          answer: 'The free plan includes 5 briefs per month, basic AI analysis, news intelligence, job signals, and technology stack detection.'
        },
        {
          question: 'How does billing work?',
          answer: 'Plans are billed monthly or annually. You can upgrade, downgrade, or cancel anytime. Changes take effect immediately.'
        },
        {
          question: 'Is there a discount for annual plans?',
          answer: 'Yes! Annual plans save 20% compared to monthly billing. Enterprise customers can discuss custom pricing.'
        },
        {
          question: 'Can I get a refund?',
          answer: 'We offer a 30-day money-back guarantee for all paid plans. Contact support for refund requests.'
        }
      ]
    },
    {
      title: 'Troubleshooting',
      icon: AlertTriangle,
      color: 'orange',
      faqs: [
        {
          question: 'Why is my brief generation failing?',
          answer: 'Check your internet connection and try again. If the issue persists, the company might have limited public data available.'
        },
        {
          question: 'No company suggestions appearing?',
          answer: 'Try typing the full company name or check your spelling. Our autocomplete works best with well-known companies.'
        },
        {
          question: 'Brief is missing some data sections?',
          answer: 'Some companies have limited public information. Private companies or those with minimal online presence may have fewer data points.'
        },
        {
          question: 'How do I report a bug or issue?',
          answer: 'Use the contact form or email support@pitchintel.ai with details about the issue, including screenshots if possible.'
        }
      ]
    }
  ]

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0)

  const toggleFaq = (categoryIndex: number, faqIndex: number) => {
    const faqId = categoryIndex * 100 + faqIndex
    setOpenFaq(openFaq === faqId ? null : faqId)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="pt-24 container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Help Center
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Find answers to common questions and learn how to get the most out of PitchIntel.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help articles..."
              className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {(searchQuery ? filteredFaqs : faqCategories).map((category, categoryIndex) => {
            const Icon = category.icon
            
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + categoryIndex * 0.1 }}
                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 bg-${category.color}-500/20 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 text-${category.color}-400`} />
                  </div>
                  <h2 className="text-xl font-semibold text-white">{category.title}</h2>
                </div>

                <div className="space-y-3">
                  {category.faqs.map((faq, faqIndex) => {
                    const faqId = categoryIndex * 100 + faqIndex
                    const isOpen = openFaq === faqId
                    
                    return (
                      <div key={faqIndex} className="border border-gray-700 rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleFaq(categoryIndex, faqIndex)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/50 transition-colors"
                        >
                          <span className="font-medium text-white pr-4">{faq.question}</span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
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
              </motion.div>
            )
          })}
        </div>

        {/* No Results */}
        {searchQuery && filteredFaqs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No results found</h3>
            <p className="text-gray-400 mb-6">
              Try different keywords or browse the categories above.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Clear search
            </button>
          </motion.div>
        )}

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8 text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Still need help?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you succeed with PitchIntel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Contact Support
            </Link>
            <Link
              to="/docs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white rounded-lg font-medium transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              View Documentation
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}