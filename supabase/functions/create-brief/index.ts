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

    // 2. Generate mock data for demo purposes (replace with real APIs in production)
    const newsData: NewsItem[] = [
      {
        title: `${companyName} announces new strategic initiative`,
        description: `${companyName} has unveiled plans for expansion and growth in the coming quarter, focusing on innovation and market leadership.`,
        url: `https://example.com/news/${companyName.toLowerCase().replace(/\s+/g, '-')}`,
        publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'TechCrunch',
        sourceFavicon: 'https://techcrunch.com/favicon.ico'
      },
      {
        title: `${companyName} raises funding for technology advancement`,
        description: `The company secured significant investment to accelerate product development and expand their engineering team.`,
        url: `https://example.com/funding/${companyName.toLowerCase().replace(/\s+/g, '-')}`,
        publishedAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'VentureBeat',
        sourceFavicon: 'https://venturebeat.com/favicon.ico'
      }
    ]

    const jobSignals: JobSignal[] = [
      {
        title: 'Senior Software Engineer',
        company: companyName,
        location: 'San Francisco, CA',
        postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'We are looking for a senior software engineer to join our growing team and help build scalable solutions.',
        salary: '$120,000 - $180,000'
      },
      {
        title: 'Product Manager',
        company: companyName,
        location: 'Remote',
        postedDate: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Lead product strategy and work with cross-functional teams to deliver exceptional user experiences.',
        salary: '$130,000 - $160,000'
      }
    ]

    const techStackData: TechStackItem[] = [
      { name: 'React', confidence: 'High', source: 'Job Analysis', category: 'Frontend' },
      { name: 'Node.js', confidence: 'High', source: 'Job Analysis', category: 'Backend' },
      { name: 'PostgreSQL', confidence: 'Medium', source: 'Industry Standard', category: 'Database' },
      { name: 'AWS', confidence: 'High', source: 'Industry Standard', category: 'Cloud' },
      { name: 'TypeScript', confidence: 'Medium', source: 'Job Analysis', category: 'Language' }
    ]

    // 3. Generate AI analysis
    const aiAnalysis = {
      summary: `${companyName} is experiencing significant growth momentum with recent funding and strategic initiatives. The company is actively expanding their engineering team and investing in technology infrastructure. This presents an excellent opportunity for partnerships and solutions that can support their scaling operations.`,
      pitchAngle: `Given ${companyName}'s recent expansion and hiring surge, particularly in engineering roles, there's a clear need for solutions that can streamline their development processes and support their growing team. ${userIntent} aligns perfectly with their current growth trajectory and technology investments. The timing is ideal as they're building infrastructure to support their next phase of growth.`,
      subjectLine: `Supporting ${companyName}'s Engineering Expansion`,
      whatNotToPitch: `Avoid pitching basic or entry-level solutions as ${companyName} is clearly in a growth phase requiring enterprise-grade capabilities. Don't focus on cost-cutting measures since they're in an investment phase. Avoid generic pitches that don't acknowledge their recent funding and expansion activities.`,
      signalTag: 'Scaling Engineering Team Post-Funding'
    }

    const hiringTrends = `Active hiring: ${jobSignals.length} Engineering roles (primarily San Francisco, Remote)`
    const newsTrends = `${newsData.length} recent articles - positive sentiment around funding and growth`

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
          builtWithUsed: false
        },
        companyLogo,
        hiringTrends,
        newsTrends,
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

// Import Supabase client
import { createClient } from 'npm:@supabase/supabase-js@2'