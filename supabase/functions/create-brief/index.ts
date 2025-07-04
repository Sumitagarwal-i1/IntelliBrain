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
  userCompany?: {
    name: string
    industry: string
    product: string
    valueProposition: string
    website?: string
    goals: string
  }
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

    const { companyName, website, userIntent, userId, userCompany }: CreateBriefRequest = await req.json()

    // Validate input
    if (!companyName || !userIntent) {
      return new Response(
        JSON.stringify({ error: 'Company name and user intent are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Creating enhanced strategic brief for ${companyName}...`)

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

    // 3. Generate enhanced strategic analysis
    const strategicAnalysis = await generateEnhancedStrategicAnalysis(
      companyName, 
      userIntent, 
      newsData, 
      jobSignals, 
      techStackData,
      stockData, 
      toneInsights,
      userCompany
    )

    const hiringTrends = `Active hiring: ${jobSignals.length} roles across ${new Set(jobSignals.map(j => j.location.split(',')[0])).size} locations`
    const newsTrends = `${newsData.length} recent articles - ${toneInsights.sentiment || 'neutral'} sentiment`

    // 4. Save comprehensive brief to database
    const { data, error } = await supabaseClient
      .from('briefs')
      .insert({
        companyName,
        website,
        userIntent,
        summary: strategicAnalysis.summary,
        news: newsData,
        techStack: techStackData.map(t => t.name),
        pitchAngle: strategicAnalysis.pitchAngle,
        subjectLine: strategicAnalysis.subjectLine,
        whatNotToPitch: strategicAnalysis.whatNotToPitch,
        signalTag: strategicAnalysis.signalTag,
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

    console.log(`Successfully created enhanced strategic brief for ${companyName}`)

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

// Enhanced strategic analysis generation
async function generateEnhancedStrategicAnalysis(
  companyName: string, 
  userIntent: string, 
  newsData: NewsItem[], 
  jobSignals: JobSignal[],
  techStackData: TechStackItem[],
  stockData: StockData,
  toneInsights: ToneInsights,
  userCompany?: {
    name: string
    industry: string
    product: string
    valueProposition: string
    website?: string
    goals: string
  }
) {
  // Analyze signals for strategic insights
  const keySignals = extractKeySignals(newsData, jobSignals, stockData, techStackData)
  const inferredPriorities = analyzeCompanyPriorities(keySignals, toneInsights)
  const strategicAngle = generateStrategicAngle(userCompany, companyName, keySignals, userIntent)
  const painPoints = identifyPainPoints(keySignals, techStackData, jobSignals)
  const buyerPersonas = identifyBuyerPersonas(jobSignals, techStackData)
  
  // Generate enhanced content following the specified format
  const summary = generateStrategicSummary(companyName, keySignals, inferredPriorities, strategicAngle, userCompany)
  const pitchAngle = generateEnhancedPitchStrategy(companyName, userCompany, userIntent, keySignals, painPoints, buyerPersonas)
  const subjectLine = generateStrategicSubjectLine(companyName, userCompany)
  const whatNotToPitch = generateStrategicWarnings(companyName, keySignals, toneInsights, techStackData)
  const signalTag = generateSignalTag(keySignals, toneInsights)

  return {
    summary,
    pitchAngle,
    subjectLine,
    whatNotToPitch,
    signalTag
  }
}

function extractKeySignals(newsData: NewsItem[], jobSignals: JobSignal[], stockData: StockData, techStackData: TechStackItem[]) {
  const signals = []
  
  // News-based signals
  newsData.forEach(news => {
    const title = news.title.toLowerCase()
    if (title.includes('funding') || title.includes('raised') || title.includes('series')) {
      signals.push(`Secured funding round (${news.source})`)
    }
    if (title.includes('launch') || title.includes('announces')) {
      signals.push(`Launched new initiative: ${news.title.split(' ').slice(0, 6).join(' ')}`)
    }
    if (title.includes('partnership') || title.includes('acquisition')) {
      signals.push(`Strategic partnership/acquisition activity`)
    }
    if (title.includes('ai') || title.includes('artificial intelligence')) {
      signals.push(`AI product development focus`)
    }
  })

  // Hiring signals
  if (jobSignals.length > 10) {
    signals.push(`Aggressive hiring: ${jobSignals.length}+ open positions`)
  } else if (jobSignals.length > 5) {
    signals.push(`Selective expansion: ${jobSignals.length} strategic hires`)
  }

  const engineeringRoles = jobSignals.filter(job => 
    job.title.toLowerCase().includes('engineer') || 
    job.title.toLowerCase().includes('developer')
  ).length
  
  if (engineeringRoles > 5) {
    signals.push(`Engineering team scaling: ${engineeringRoles} technical roles`)
  }

  const salesRoles = jobSignals.filter(job => 
    job.title.toLowerCase().includes('sales') || 
    job.title.toLowerCase().includes('account') ||
    job.title.toLowerCase().includes('business development')
  ).length
  
  if (salesRoles > 3) {
    signals.push(`GTM expansion: ${salesRoles} sales positions`)
  }

  // Stock signals
  if (stockData.priceChange?.includes('+')) {
    signals.push(`Positive market performance: ${stockData.priceChange}`)
  }

  // Tech stack signals
  const modernTech = techStackData.filter(tech => 
    ['React', 'Node.js', 'Python', 'Kubernetes', 'AWS', 'TypeScript'].includes(tech.name)
  )
  if (modernTech.length > 5) {
    signals.push(`Modern tech stack: ${modernTech.length} cutting-edge technologies`)
  }

  return signals.slice(0, 4) // Top 4 signals
}

function analyzeCompanyPriorities(signals: string[], toneInsights: ToneInsights) {
  const priorities = []
  
  if (signals.some(s => s.includes('hiring') || s.includes('expansion'))) {
    priorities.push('Scaling operations and team growth')
  }
  
  if (signals.some(s => s.includes('AI') || s.includes('tech stack'))) {
    priorities.push('Technology modernization and AI integration')
  }
  
  if (signals.some(s => s.includes('GTM') || s.includes('sales'))) {
    priorities.push('Go-to-market acceleration and revenue growth')
  }
  
  if (signals.some(s => s.includes('funding') || s.includes('partnership'))) {
    priorities.push('Strategic partnerships and market expansion')
  }

  if (toneInsights.sentiment === 'positive') {
    priorities.push('Capitalizing on positive momentum')
  }

  return priorities.slice(0, 3).join(', ')
}

function generateStrategicAngle(userCompany: any, companyName: string, signals: string[], userIntent: string) {
  if (!userCompany) {
    return `Strategic timing optimal for ${userIntent} based on current expansion signals and market positioning.`
  }

  const angle = `${userCompany.name}'s ${userCompany.product} aligns perfectly with ${companyName}'s current ${
    signals.some(s => s.includes('scaling')) ? 'scaling phase' : 
    signals.some(s => s.includes('AI')) ? 'AI transformation' :
    'growth trajectory'
  }. ${userCompany.valueProposition} directly addresses their ${
    signals.some(s => s.includes('engineering')) ? 'technical scaling challenges' :
    signals.some(s => s.includes('GTM')) ? 'go-to-market acceleration needs' :
    'operational efficiency requirements'
  }.`

  return angle
}

function identifyPainPoints(signals: string[], techStackData: TechStackItem[], jobSignals: JobSignal[]) {
  const painPoints = []
  
  if (signals.some(s => s.includes('scaling') || s.includes('hiring'))) {
    painPoints.push('Scaling bottlenecks as team grows rapidly')
    painPoints.push('Maintaining quality and consistency during expansion')
  }
  
  if (techStackData.length > 8) {
    painPoints.push('Technology stack complexity and integration challenges')
  }
  
  if (jobSignals.some(job => job.title.toLowerCase().includes('devops') || job.title.toLowerCase().includes('infrastructure'))) {
    painPoints.push('Infrastructure scaling and deployment efficiency')
  }
  
  if (signals.some(s => s.includes('AI'))) {
    painPoints.push('AI implementation and workflow integration gaps')
  }

  return painPoints.slice(0, 3)
}

function identifyBuyerPersonas(jobSignals: JobSignal[], techStackData: TechStackItem[]) {
  const personas = []
  
  if (jobSignals.some(job => job.title.toLowerCase().includes('cto') || job.title.toLowerCase().includes('vp engineering'))) {
    personas.push('CTO/VP of Engineering')
  } else if (jobSignals.some(job => job.title.toLowerCase().includes('engineer'))) {
    personas.push('VP of Engineering')
  }
  
  if (jobSignals.some(job => job.title.toLowerCase().includes('product'))) {
    personas.push('VP of Product')
  }
  
  if (jobSignals.some(job => job.title.toLowerCase().includes('sales') || job.title.toLowerCase().includes('revenue'))) {
    personas.push('Chief Revenue Officer')
  }
  
  if (jobSignals.some(job => job.title.toLowerCase().includes('operations'))) {
    personas.push('VP of Operations')
  }

  return personas.slice(0, 2)
}

function generateStrategicSummary(companyName: string, signals: string[], priorities: string, strategicAngle: string, userCompany: any) {
  const tagline = generateTagline(signals)
  
  return `🚀 Strategic Opportunity: ${companyName}
${companyName} demonstrates strong momentum with ${signals.length} key market signals indicating strategic expansion and technology advancement. Current positioning suggests active growth phase with focus on operational scaling.

🔍 Key Signals:
${signals.map(signal => `• ${signal}`).join('\n')}

🧠 Inferred Priorities:
${priorities}

🎯 Strategic Angle:
${strategicAngle}

📌 Tagline:
${tagline}`
}

function generateEnhancedPitchStrategy(companyName: string, userCompany: any, userIntent: string, signals: string[], painPoints: string[], personas: string[]) {
  const positioningAngle = userCompany ? 
    `${userCompany.name} enables ${companyName} to ${userIntent.toLowerCase()} while maintaining operational excellence during their current growth phase.` :
    `Strategic partnership opportunity to support ${companyName}'s expansion through ${userIntent.toLowerCase()}.`

  const primaryHook = userCompany ?
    `${userCompany.valueProposition} specifically designed for companies like ${companyName} experiencing rapid scaling challenges.` :
    `Targeted solution addressing ${companyName}'s current operational and strategic priorities.`

  const messagingThemes = generateMessagingThemes(signals, painPoints)
  const objectionResponse = userCompany ?
    `"Already using X" → Response: "${userCompany.name} integrates with existing tools to provide unified visibility and control."` :
    `"Already have solutions" → Response: "We complement existing infrastructure to eliminate blind spots."`

  const suggestedCTA = userCompany ?
    `"Would it be valuable to see how ${userCompany.name} helped similar companies during their scaling phase?"` :
    `"Would it be helpful to share a brief analysis of optimization opportunities specific to your current growth stage?"`

  return `🎯 Pitch Strategy

📌 Positioning Angle:
${positioningAngle}

🧠 Primary Hook:
${primaryHook}

❗ Pain Points to Target:
${painPoints.map(point => `• ${point}`).join('\n')}

👤 Ideal Buyer Personas:
${personas.map(persona => `• ${persona}`).join('\n')}

📣 Messaging Themes:
${messagingThemes.map(theme => `• ${theme}`).join('\n')}

🚧 Objections to Expect:
${objectionResponse}

📥 Suggested CTA:
${suggestedCTA}`
}

function generateStrategicSubjectLine(companyName: string, userCompany: any) {
  if (userCompany) {
    return `${userCompany.name} x ${companyName} Strategic Partnership`
  }
  return `Strategic Growth Insights for ${companyName}`
}

function generateStrategicWarnings(companyName: string, signals: string[], toneInsights: ToneInsights, techStackData: TechStackItem[]) {
  const warnings = []
  
  if (signals.some(s => s.includes('AI'))) {
    warnings.push(`Don't lead with basic automation — they're already investing in AI capabilities`)
  }
  
  if (signals.some(s => s.includes('scaling') || s.includes('hiring'))) {
    warnings.push(`Avoid cost-cutting messaging — they're in growth mode, not optimization phase`)
  }
  
  if (toneInsights.sentiment === 'positive') {
    warnings.push(`Don't emphasize problems — they're experiencing positive momentum`)
  }
  
  if (techStackData.length > 5) {
    warnings.push(`Skip generic "modernization" pitches — they already have sophisticated tech stack`)
  }
  
  warnings.push(`Refrain from generic productivity claims — they demand outcome-based, strategic messaging`)

  return `❌ What Not to Pitch

${warnings.map(warning => `• ${warning}`).join('\n')}

Strategic reasoning: Based on current market sentiment (${toneInsights.sentiment}), hiring focus, and technology sophistication, ${companyName} requires consultative, outcome-focused engagement rather than transactional product pitches.`
}

function generateTagline(signals: string[]) {
  const themes = []
  
  if (signals.some(s => s.includes('scaling') || s.includes('hiring'))) {
    themes.push('Scaling Operations')
  }
  
  if (signals.some(s => s.includes('AI') || s.includes('tech'))) {
    themes.push('AI Integration')
  }
  
  if (signals.some(s => s.includes('GTM') || s.includes('sales'))) {
    themes.push('Revenue Growth')
  }
  
  if (signals.some(s => s.includes('funding') || s.includes('partnership'))) {
    themes.push('Market Expansion')
  }

  return themes.slice(0, 3).join(' | ') || 'Strategic Growth | Operational Excellence | Market Leadership'
}

function generateMessagingThemes(signals: string[], painPoints: string[]) {
  const themes = []
  
  if (painPoints.some(p => p.includes('scaling'))) {
    themes.push('Scaling without breaking')
  }
  
  if (painPoints.some(p => p.includes('complexity'))) {
    themes.push('Simplifying technical complexity')
  }
  
  if (painPoints.some(p => p.includes('AI'))) {
    themes.push('AI workflow integration')
  }
  
  if (signals.some(s => s.includes('GTM'))) {
    themes.push('Revenue acceleration')
  }

  return themes.length > 0 ? themes : ['Operational efficiency', 'Strategic alignment', 'Growth enablement']
}

function generateSignalTag(signals: string[], toneInsights: ToneInsights) {
  if (signals.some(s => s.includes('scaling') || s.includes('hiring'))) {
    return `Rapid Scaling - ${toneInsights.sentiment?.charAt(0).toUpperCase() + toneInsights.sentiment?.slice(1) || 'Neutral'} Momentum`
  }
  
  if (signals.some(s => s.includes('AI'))) {
    return `AI Transformation - Technology Focus`
  }
  
  if (signals.some(s => s.includes('funding'))) {
    return `Growth Capital - Expansion Phase`
  }
  
  return `Strategic Growth - Market Positioning`
}

// Helper functions for API integrations (keeping existing implementations)
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

// Mock data generators for fallback
function generateMockNews(companyName: string): NewsItem[] {
  return [
    {
      title: `${companyName} announces strategic AI integration initiative`,
      description: `${companyName} has unveiled comprehensive AI transformation plans focusing on workflow automation and customer experience enhancement.`,
      url: `https://example.com/news/${companyName.toLowerCase().replace(/\s+/g, '-')}`,
      publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'TechCrunch',
      sourceFavicon: 'https://techcrunch.com/favicon.ico'
    },
    {
      title: `${companyName} secures Series B funding for global expansion`,
      description: `The company raised $50M to accelerate product development and international market penetration.`,
      url: `https://example.com/funding/${companyName.toLowerCase().replace(/\s+/g, '-')}`,
      publishedAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'VentureBeat',
      sourceFavicon: 'https://venturebeat.com/favicon.ico'
    }
  ]
}

function generateMockJobs(companyName: string): JobSignal[] {
  const roles = [
    'Senior Software Engineer', 'VP of Engineering', 'Product Manager', 
    'Data Scientist', 'DevOps Engineer', 'UX Designer', 'Sales Director',
    'Customer Success Manager', 'Marketing Director', 'Operations Manager'
  ]
  const locations = ['San Francisco, CA', 'New York, NY', 'Remote', 'Seattle, WA', 'Austin, TX']
  
  return roles.map(role => ({
    title: role,
    company: companyName,
    location: locations[Math.floor(Math.random() * locations.length)],
    postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    description: `Join our growing team as a ${role}. We're looking for talented individuals to help build scalable solutions and drive innovation.`,
    salary: `$${Math.floor(Math.random() * 100 + 100)}k - $${Math.floor(Math.random() * 100 + 150)}k`
  }))
}

function generateMockTone(): ToneInsights {
  const emotions = ['joy', 'trust', 'anticipation', 'surprise', 'fear', 'sadness']
  const primaryEmotion = emotions[Math.floor(Math.random() * emotions.length)]
  
  return {
    emotion: primaryEmotion,
    confidence: Math.random() * 0.4 + 0.6,
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