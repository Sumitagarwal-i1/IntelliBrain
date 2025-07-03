import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Check, 
  Zap, 
  Crown, 
  Building2, 
  ArrowRight,
  Sparkles,
  Users,
  BarChart3,
  Share2,
  Download,
  Linkedin,
  Database,
  Brain,
  Shield
} from 'lucide-react'
import { Navigation } from '../components/Navigation'
import { Link } from 'react-router-dom'

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false)

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for trying out PitchIntel',
      price: { monthly: 0, yearly: 0 },
      icon: Sparkles,
      color: 'gray',
      features: [
        '5 briefs per month',
        'Basic AI analysis',
        'News intelligence',
        'Job signals',
        'Technology stack detection',
        'Email support'
      ],
      limitations: [
        'No stock data',
        'No tone analysis',
        'No sharing features',
        'No export options'
      ],
      cta: 'Get Started Free',
      popular: false
    },
    {
      name: 'Pro',
      description: 'For sales teams and professionals',
      price: { monthly: 49, yearly: 39 },
      icon: Zap,
      color: 'blue',
      features: [
        'Unlimited briefs',
        'Advanced AI analysis',
        'Real-time stock data',
        'NLP tone analysis',
        'Shareable brief links',
        'PDF/HTML export',
        'LinkedIn post generation',
        'Priority support',
        'Advanced charts & analytics',
        'User company context'
      ],
      cta: 'Upgrade to Pro',
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'For large teams and organizations',
      price: { monthly: 'Custom', yearly: 'Custom' },
      icon: Crown,
      color: 'purple',
      features: [
        'Everything in Pro',
        'CRM integrations',
        'API access',
        'Custom data sources',
        'White-label options',
        'Advanced security',
        'Dedicated support',
        'Custom training',
        'SLA guarantees',
        'Multi-team management'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ]

  const getColorClasses = (color: string, type: 'bg' | 'text' | 'border') => {
    const colors = {
      gray: {
        bg: 'bg-gray-500/10',
        text: 'text-gray-400',
        border: 'border-gray-500/20'
      },
      blue: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        border: 'border-blue-500/20'
      },
      purple: {
        bg: 'bg-purple-500/10',
        text: 'text-purple-400',
        border: 'border-purple-500/20'
      }
    }
    return colors[color as keyof typeof colors]?.[type] || colors.gray[type]
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="pt-24 container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-white mb-6">
            Choose Your
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {" "}Intelligence
            </span>
            {" "}Plan
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Unlock the power of AI-driven B2B intelligence. From basic insights to enterprise-grade analytics.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium ${!isYearly ? 'text-white' : 'text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isYearly ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  isYearly ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-white' : 'text-gray-400'}`}>
              Yearly
            </span>
            {isYearly && (
              <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                Save 20%
              </span>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            const price = typeof plan.price.monthly === 'number' 
              ? (isYearly ? plan.price.yearly : plan.price.monthly)
              : plan.price.monthly

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-gray-900/50 backdrop-blur border rounded-2xl p-8 ${
                  plan.popular 
                    ? 'border-blue-500/50 shadow-2xl shadow-blue-500/10' 
                    : 'border-gray-800 hover:border-gray-700'
                } transition-all duration-200 hover:scale-105`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`w-16 h-16 ${getColorClasses(plan.color, 'bg')} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-8 h-8 ${getColorClasses(plan.color, 'text')}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  <div className="mb-6">
                    {typeof price === 'number' ? (
                      <>
                        <span className="text-4xl font-bold text-white">${price}</span>
                        <span className="text-gray-400">/{isYearly ? 'year' : 'month'}</span>
                        {isYearly && typeof plan.price.monthly === 'number' && plan.price.monthly > 0 && (
                          <div className="text-sm text-gray-500 line-through">
                            ${plan.price.monthly}/month
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-4xl font-bold text-white">{price}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations?.map((limitation, limitationIndex) => (
                    <div key={limitationIndex} className="flex items-center gap-3 opacity-50">
                      <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-gray-600 rounded-full" />
                      </div>
                      <span className="text-gray-500">{limitation}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-blue-500/25'
                      : plan.name === 'Enterprise'
                      ? 'bg-purple-600 hover:bg-purple-500 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )
          })}
        </div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">Feature Comparison</h2>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-6 border-b border-gray-800 bg-gray-800/50">
              <div className="font-semibold text-white">Features</div>
              <div className="text-center font-semibold text-gray-400">Free</div>
              <div className="text-center font-semibold text-blue-400">Pro</div>
              <div className="text-center font-semibold text-purple-400">Enterprise</div>
            </div>
            
            {[
              { name: 'Monthly Briefs', free: '5', pro: 'Unlimited', enterprise: 'Unlimited' },
              { name: 'AI Analysis', free: 'Basic', pro: 'Advanced', enterprise: 'Advanced' },
              { name: 'Real-time News', free: '✓', pro: '✓', enterprise: '✓' },
              { name: 'Job Signals', free: '✓', pro: '✓', enterprise: '✓' },
              { name: 'Stock Data', free: '✗', pro: '✓', enterprise: '✓' },
              { name: 'Tone Analysis', free: '✗', pro: '✓', enterprise: '✓' },
              { name: 'Share & Export', free: '✗', pro: '✓', enterprise: '✓' },
              { name: 'API Access', free: '✗', pro: '✗', enterprise: '✓' },
              { name: 'CRM Integration', free: '✗', pro: '✗', enterprise: '✓' }
            ].map((row, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 p-4 border-b border-gray-800 last:border-b-0">
                <div className="text-gray-300 font-medium">{row.name}</div>
                <div className="text-center text-gray-400">{row.free}</div>
                <div className="text-center text-blue-400">{row.pro}</div>
                <div className="text-center text-purple-400">{row.enterprise}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                question: 'What data sources does PitchIntel use?',
                answer: 'We integrate with NewsData.io for real-time news, JSearch for job postings, Yahoo Finance for stock data, Twinword for NLP analysis, and Clearbit for company metadata.'
              },
              {
                question: 'Can I cancel my subscription anytime?',
                answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.'
              },
              {
                question: 'Is my data secure?',
                answer: 'Absolutely. We use enterprise-grade security measures and never share your data with third parties. All data is encrypted in transit and at rest.'
              },
              {
                question: 'Do you offer custom integrations?',
                answer: 'Yes, our Enterprise plan includes custom integrations with your existing CRM, sales tools, and data sources. Contact our sales team for details.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your B2B Intelligence?</h2>
          <p className="text-gray-300 mb-6 text-lg max-w-2xl mx-auto">
            Join thousands of sales professionals using PitchIntel to close more deals with AI-powered insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105"
            >
              <Zap className="w-5 h-5" />
              Start Free Trial
            </Link>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white rounded-xl font-semibold text-lg transition-all duration-200">
              <Users className="w-5 h-5" />
              Contact Sales
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}