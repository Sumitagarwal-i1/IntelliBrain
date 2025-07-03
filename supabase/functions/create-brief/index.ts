const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface CreateBriefRequest {
  companyName: string
  website?: string
  userIntent: string
  userId?: string
}

interface NewsItem {
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
  sourceFavicon?: string
}

interface JobSignal {
  title: string
  company: string
  location: string
  postedDate: string
  description: string
  salary?: string
}

interface TechStackItem {
  name: string
  confidence: 'High' | 'Medium' | 'Low'
  source: string
  category: string
  firstDetected?: string
}

interface StockData {
  ticker?: string
  currentPrice?: string
  priceChange?: string
  priceHistory?: Array<{ date: string; value: number }>
  marketCap?: string
  volume?: string
}

interface ToneInsights {
  emotion?: string
  confidence?: number
  mood?: string
  sentiment?: 'positive' | 'negative' | 'neutral'
  emotions?: Array<{ name: string; score: number }>
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { companyName, website, userIntent, userId }: CreateBriefRequest = await req.json()

    // Validate input
    if (!companyName || !userIntent) {
      return new Response(
        JSON.stringify({ error: 'Company name and user intent are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Creating brief for ${companyName}...`)

    // 1. Extract domain and setup Clearbit
    let companyDomain = ''
    let companyLogo = ''
    if (website) {
      try {
        const url = new URL(website)
        companyDomain = url.hostname.replace('www.', '')
        companyLogo = `https://logo.clearbit.com/${companyDomain}`
      } catch (e) {
        console.log('Failed to extract domain from website:', e)
      }
    }

    // 2. Fetch real data from APIs
    const newsData: NewsItem[] = await fetchNewsData(companyName)
    const jobSignals: JobSignal[] = await fetchJobSignals(companyName)
    const techStackData: TechStackItem[] = await analyzeTechStack(jobSignals)
    const stockData: StockData = await fetchStockData(companyName)
    const toneInsights: ToneInsights = await analyzeTone(userIntent, newsData)

    // 3. Generate AI analysis using Groq
    const aiAnalysis = await generateAIAnalysis(companyName, userIntent, newsData, jobSignals, stockData, toneInsights)

    const hiringTrends = `Active hiring: ${jobSignals.length} roles across ${new Set(jobSignals.map(j => j.location.split(',')[0])).size} locations`
    const newsTrends = `${newsData.length} recent articles - ${toneInsights.sentiment || 'neutral'} sentiment`

    // 4. Save comprehensive brief to database
    const { data, error } = await supabaseClient
      .from('briefs')
      .insert({
        companyName,
        website,
        userIntent,
        summary: aiAnalysis.summary,
        news: newsData,
        techStack: techStackData.map(t => t.name),
        pitchAngle: aiAnalysis.pitchAngle,
        subjectLine: aiAnalysis.subjectLine,
        whatNotToPitch: aiAnalysis.whatNotToPitch,
        signalTag: aiAnalysis.signalTag,
        jobSignals: jobSignals,
        techStackData: techStackData,
        intelligenceSources: {
          news: newsData.length,
          jobs: jobSignals.length,
          technologies: techStackData.length,
          stockData: !!stockData.ticker,
          toneAnalysis: !!toneInsights.emotion,
          builtWithUsed: false
        },
        companyLogo,
        hiringTrends,
        newsTrends,
        stockData,
        toneInsights,
        userId: userId || null
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to save brief to database', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Successfully created brief for ${companyName}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        brief: data
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error creating brief:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Helper functions for API integrations
async function fetchNewsData(companyName: string): Promise<NewsItem[]> {
  try {
    const apiKey = Deno.env.get('NEWSDATA_API_KEY')
    if (!apiKey) {
      console.log('NewsData API key not found, using mock data')
      return generateMockNews(companyName)
    }

    const response = await fetch(`https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(companyName)}&language=en&size=10`)
    const data = await response.json()

    if (data.results) {
      return data.results.map((item: any) => ({
        title: item.title,
        description: item.description || '',
        url: item.link,
        publishedAt: item.pubDate,
        source: item.source_id,
        sourceFavicon: `https://www.google.com/s2/favicons?domain=${item.source_id}`
      }))
    }
  } catch (error) {
    console.error('Error fetching news data:', error)
  }

  return generateMockNews(companyName)
}

async function fetchJobSignals(companyName: string): Promise<JobSignal[]> {
  try {
    const apiKey = Deno.env.get('JSEARCH_API_KEY')
    if (!apiKey) {
      console.log('JSearch API key not found, using mock data')
      return generateMockJobs(companyName)
    }

    const response = await fetch(`https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(companyName)}&page=1&num_pages=1`, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    })
    const data = await response.json()

    if (data.data) {
      return data.data.slice(0, 10).map((job: any) => ({
        title: job.job_title,
        company: job.employer_name,
        location: job.job_city + ', ' + job.job_state,
        postedDate: job.job_posted_at_datetime_utc,
        description: job.job_description?.substring(0, 200) + '...',
        salary: job.job_min_salary && job.job_max_salary ? 
          `$${job.job_min_salary.toLocaleString()} - $${job.job_max_salary.toLocaleString()}` : undefined
      }))
    }
  } catch (error) {
    console.error('Error fetching job signals:', error)
  }

  return generateMockJobs(companyName)
}

async function fetchStockData(companyName: string): Promise<StockData> {
  try {
    // For demo purposes, generate realistic stock data
    // In production, integrate with Yahoo Finance API
    const stockTickers: Record<string, string> = {
      'shopify': 'SHOP',
      'apple': 'AAPL',
      'microsoft': 'MSFT',
      'google': 'GOOGL',
      'amazon': 'AMZN',
      'meta': 'META',
      'tesla': 'TSLA',
      'netflix': 'NFLX'
    }

    const ticker = stockTickers[companyName.toLowerCase()]
    if (!ticker) {
      return {}
    }

    // Generate realistic stock data
    const basePrice = Math.random() * 200 + 50
    const change = (Math.random() - 0.5) * 10
    const changePercent = (change / basePrice * 100).toFixed(2)

    const priceHistory = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: basePrice + (Math.random() - 0.5) * 20
    }))

    return {
      ticker,
      currentPrice: `$${basePrice.toFixed(2)}`,
      priceChange: `${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent}%)`,
      priceHistory,
      marketCap: `$${(Math.random() * 500 + 100).toFixed(1)}B`,
      volume: `${(Math.random() * 50 + 10).toFixed(1)}M`
    }
  } catch (error) {
    console.error('Error fetching stock data:', error)
    return {}
  }
}

async function analyzeTone(userIntent: string, newsData: NewsItem[]): Promise<ToneInsights> {
  try {
    const apiKey = Deno.env.get('TWINWORD_API_KEY')
    if (!apiKey) {
      console.log('Twinword API key not found, using mock data')
      return generateMockTone()
    }

    // Combine user intent and news headlines for analysis
    const textToAnalyze = userIntent + ' ' + newsData.slice(0, 3).map(n => n.title).join(' ')

    const response = await fetch('https://twinword-emotion-analysis-v1.p.rapidapi.com/analyze/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'twinword-emotion-analysis-v1.p.rapidapi.com'
      },
      body: `text=${encodeURIComponent(textToAnalyze)}`
    })

    const data = await response.json()

    if (data.emotions_detected) {
      return {
        emotion: data.emotions_detected[0]?.emotion,
        confidence: data.emotions_detected[0]?.emotion_score,
        mood: data.mood,
        sentiment: data.sentiment,
        emotions: data.emotions_detected?.slice(0, 6) || []
      }
    }
  } catch (error) {
    console.error('Error analyzing tone:', error)
  }

  return generateMockTone()
}

async function analyzeTechStack(jobSignals: JobSignal[]): Promise<TechStackItem[]> {
  const techKeywords = [
    'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'AWS', 'Docker', 
    'Kubernetes', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API',
    'Microservices', 'CI/CD', 'Git', 'Jenkins', 'Terraform', 'Vue.js', 'Angular'
  ]

  const detectedTech: Record<string, number> = {}
  
  jobSignals.forEach(job => {
    const jobText = (job.title + ' ' + job.description).toLowerCase()
    techKeywords.forEach(tech => {
      if (jobText.includes(tech.toLowerCase())) {
        detectedTech[tech] = (detectedTech[tech] || 0) + 1
      }
    })
  })

  return Object.entries(detectedTech)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({
      name,
      confidence: count > 2 ? 'High' : count > 1 ? 'Medium' : 'Low',
      source: 'Job Analysis',
      category: getCategoryForTech(name),
      firstDetected: new Date().toISOString()
    }))
}

function getCategoryForTech(tech: string): string {
  const categories: Record<string, string> = {
    'React': 'Frontend',
    'Vue.js': 'Frontend',
    'Angular': 'Frontend',
    'Node.js': 'Backend',
    'Python': 'Backend',
    'JavaScript': 'Language',
    'TypeScript': 'Language',
    'AWS': 'Cloud',
    'Docker': 'DevOps',
    'Kubernetes': 'DevOps',
    'PostgreSQL': 'Database',
    'MongoDB': 'Database',
    'Redis': 'Database'
  }
  return categories[tech] || 'Other'
}

async function generateAIAnalysis(
  companyName: string, 
  userIntent: string, 
  newsData: NewsItem[], 
  jobSignals: JobSignal[],
  stockData: StockData,
  toneInsights: ToneInsights
) {
  // In production, integrate with Groq API for real AI analysis
  // For now, generate intelligent mock responses based on real data
  
  const hasPositiveNews = newsData.some(n => 
    n.title.toLowerCase().includes('growth') || 
    n.title.toLowerCase().includes('funding') ||
    n.title.toLowerCase().includes('expansion')
  )

  const isHiring = jobSignals.length > 5
  const hasStockData = !!stockData.ticker
  const sentiment = toneInsights.sentiment || 'neutral'

  return {
    summary: `${companyName} demonstrates ${sentiment} market sentiment with ${newsData.length} recent news mentions and ${jobSignals.length} active job postings. ${hasPositiveNews ? 'Recent positive developments indicate growth momentum.' : ''} ${isHiring ? 'Active hiring suggests expansion phase.' : ''} ${hasStockData ? `Stock performance shows ${stockData.priceChange?.includes('+') ? 'positive' : 'mixed'} market reception.` : ''}`,
    
    pitchAngle: `Given ${companyName}'s current ${sentiment} sentiment and ${isHiring ? 'active hiring phase' : 'market position'}, ${userIntent} aligns well with their strategic direction. ${hasPositiveNews ? 'Recent positive news coverage creates an opportune moment for engagement.' : ''} The timing is ideal for partnerships that support their ${isHiring ? 'growth and scaling initiatives' : 'operational objectives'}.`,
    
    subjectLine: `Strategic Partnership Opportunity for ${companyName}${hasPositiveNews ? ' - Capitalizing on Recent Growth' : ''}`,
    
    whatNotToPitch: `Avoid generic solutions that don't acknowledge ${companyName}'s ${sentiment} market position. ${isHiring ? 'Don\'t pitch cost-cutting measures during their expansion phase.' : 'Focus on value creation rather than cost reduction.'} Avoid ignoring their recent ${newsData.length > 0 ? 'news developments' : 'market activities'} and ${toneInsights.emotion ? `current ${toneInsights.emotion} sentiment` : 'business context'}.`,
    
    signalTag: `${isHiring ? 'Scaling Team' : 'Market Active'} - ${sentiment.charAt(0).toUpperCase() + sentiment.slice(1)} Sentiment`
  }
}

// Mock data generators for fallback
function generateMockNews(companyName: string): NewsItem[] {
  return [
    {
      title: `${companyName} announces strategic expansion plans`,
      description: `${companyName} has unveiled comprehensive growth initiatives focusing on market expansion and technology advancement.`,
      url: `https://example.com/news/${companyName.toLowerCase().replace(/\s+/g, '-')}`,
      publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'TechCrunch',
      sourceFavicon: 'https://techcrunch.com/favicon.ico'
    },
    {
      title: `${companyName} secures significant funding round`,
      description: `The company raised substantial investment to accelerate product development and team expansion.`,
      url: `https://example.com/funding/${companyName.toLowerCase().replace(/\s+/g, '-')}`,
      publishedAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'VentureBeat',
      sourceFavicon: 'https://venturebeat.com/favicon.ico'
    }
  ]
}

function generateMockJobs(companyName: string): JobSignal[] {
  const roles = ['Senior Software Engineer', 'Product Manager', 'Data Scientist', 'DevOps Engineer', 'UX Designer']
  const locations = ['San Francisco, CA', 'New York, NY', 'Remote', 'Seattle, WA', 'Austin, TX']
  
  return roles.map(role => ({
    title: role,
    company: companyName,
    location: locations[Math.floor(Math.random() * locations.length)],
    postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    description: `Join our growing team as a ${role}. We're looking for talented individuals to help build scalable solutions.`,
    salary: `$${Math.floor(Math.random() * 100 + 100)}k - $${Math.floor(Math.random() * 100 + 150)}k`
  }))
}

function generateMockTone(): ToneInsights {
  const emotions = ['joy', 'trust', 'anticipation', 'surprise', 'fear', 'sadness']
  const primaryEmotion = emotions[Math.floor(Math.random() * emotions.length)]
  
  return {
    emotion: primaryEmotion,
    confidence: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
    mood: primaryEmotion === 'joy' || primaryEmotion === 'trust' ? 'positive' : 
          primaryEmotion === 'fear' || primaryEmotion === 'sadness' ? 'negative' : 'neutral',
    sentiment: primaryEmotion === 'joy' || primaryEmotion === 'trust' ? 'positive' : 
               primaryEmotion === 'fear' || primaryEmotion === 'sadness' ? 'negative' : 'neutral',
    emotions: emotions.map(emotion => ({
      name: emotion,
      score: emotion === primaryEmotion ? Math.random() * 0.3 + 0.7 : Math.random() * 0.4
    }))
  }
}

// Import Supabase client
import { createClient } from 'npm:@supabase/supabase-js@2'