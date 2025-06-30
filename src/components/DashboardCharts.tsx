import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Newspaper, Code, Building2, AlertCircle } from 'lucide-react'
import { Brief } from '../lib/supabase'

interface DashboardChartsProps {
  briefs: Brief[]
}

export function DashboardCharts({ briefs }: DashboardChartsProps) {
  // Only show charts if we have meaningful data
  const hasData = briefs.length > 0
  const hasMinimalData = briefs.length > 0 && briefs.length < 3

  if (!hasData) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No data available for visualization
        </h3>
        <p className="text-gray-400">
          Create some briefs to see analytics and charts
        </p>
      </div>
    )
  }

  // Prepare data for charts based on actual brief data
  const briefsOverTime = briefs.reduce((acc, brief) => {
    const date = new Date(brief.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const timeData = Object.entries(briefsOverTime).map(([date, count]) => ({
    date,
    briefs: count
  })).slice(-7) // Last 7 days

  const signalDistribution = briefs.reduce((acc, brief) => {
    const tag = brief.signalTag || 'Unknown'
    const category = tag.toLowerCase().includes('hiring') ? 'Hiring' :
                    tag.toLowerCase().includes('funding') ? 'Funding' :
                    tag.toLowerCase().includes('growth') ? 'Growth' :
                    tag.toLowerCase().includes('launch') ? 'Product' : 'Other'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const signalData = Object.entries(signalDistribution).map(([name, value]) => ({
    name,
    value,
    color: name === 'Hiring' ? '#10b981' :
           name === 'Funding' ? '#3b82f6' :
           name === 'Growth' ? '#8b5cf6' :
           name === 'Product' ? '#f59e0b' : '#6b7280'
  }))

  const techStackData = briefs.reduce((acc, brief) => {
    if (brief.techStack && brief.techStack.length > 0) {
      brief.techStack.forEach(tech => {
        acc[tech] = (acc[tech] || 0) + 1
      })
    }
    return acc
  }, {} as Record<string, number>)

  const topTech = Object.entries(techStackData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }))

  const totalStats = {
    totalBriefs: briefs.length,
    totalNews: briefs.reduce((sum, brief) => sum + (brief.news?.length || 0), 0),
    totalJobs: briefs.reduce((sum, brief) => sum + (brief.jobSignals?.length || 0), 0),
    totalTech: Object.keys(techStackData).length
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center"
        >
          <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-6 h-6 text-primary-400" />
          </div>
          <div className="text-2xl font-bold text-white">{totalStats.totalBriefs}</div>
          <div className="text-sm text-gray-400">Total Briefs</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center"
        >
          <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Newspaper className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{totalStats.totalNews}</div>
          <div className="text-sm text-gray-400">News Articles</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center"
        >
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{totalStats.totalJobs}</div>
          <div className="text-sm text-gray-400">Job Signals</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center"
        >
          <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Code className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{totalStats.totalTech}</div>
          <div className="text-sm text-gray-400">Technologies</div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Briefs Over Time - Only show if we have time data */}
        {timeData.length > 1 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-400" />
              Brief Generation Trend
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="briefs"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 flex items-center justify-center"
          >
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">Trend Analysis</h3>
              <p className="text-gray-500 text-sm">Create more briefs to see trends over time</p>
            </div>
          </motion.div>
        )}

        {/* Signal Distribution - Only show if we have signal data */}
        {signalData.length > 0 && signalData.some(item => item.value > 0) ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Signal Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={signalData.filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {signalData.filter(item => item.value > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {signalData.filter(item => item.value > 0).map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-400">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 flex items-center justify-center"
          >
            <div className="text-center">
              <Building2 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">Signal Analysis</h3>
              <p className="text-gray-500 text-sm">No signal data available for visualization</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Top Technologies - Only show if we have tech data */}
      {topTech.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Code className="w-5 h-5 text-purple-400" />
            Most Detected Technologies
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topTech} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 flex items-center justify-center"
        >
          <div className="text-center">
            <Code className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">Technology Analysis</h3>
            <p className="text-gray-500 text-sm">No technology data available for visualization</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}