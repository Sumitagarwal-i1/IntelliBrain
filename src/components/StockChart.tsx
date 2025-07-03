import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, BarChart3, AlertCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

interface StockData {
  ticker?: string
  currentPrice?: string
  priceChange?: string
  priceHistory?: Array<{ date: string; value: number }>
  marketCap?: string
  volume?: string
}

interface StockChartProps {
  stockData?: StockData
}

export function StockChart({ stockData }: StockChartProps) {
  if (!stockData || !stockData.ticker) {
    return (
      <div className="bg-gray-900/50 rounded-2xl p-8 text-center border border-gray-800">
        <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-400 mb-2">No Stock Data Available</h3>
        <p className="text-gray-500 text-sm">This company may be private or stock data is unavailable</p>
      </div>
    )
  }

  const isPositive = stockData.priceChange?.startsWith('+') || false
  const isNegative = stockData.priceChange?.startsWith('-') || false

  return (
    <div className="space-y-6">
      {/* Stock Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-green-400" />
            <h4 className="text-lg font-semibold text-white">Current Price</h4>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {stockData.currentPrice || 'N/A'}
          </div>
          {stockData.priceChange && (
            <div className={`flex items-center gap-1 text-sm font-medium ${
              isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-gray-400'
            }`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : isNegative ? <TrendingDown className="w-4 h-4" /> : null}
              {stockData.priceChange}
            </div>
          )}
        </div>

        {stockData.marketCap && (
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              <h4 className="text-lg font-semibold text-white">Market Cap</h4>
            </div>
            <div className="text-2xl font-bold text-white">
              {stockData.marketCap}
            </div>
          </div>
        )}

        {stockData.volume && (
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              <h4 className="text-lg font-semibold text-white">Volume</h4>
            </div>
            <div className="text-2xl font-bold text-white">
              {stockData.volume}
            </div>
          </div>
        )}
      </div>

      {/* Price History Chart */}
      {stockData.priceHistory && stockData.priceHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800"
        >
          <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-orange-400" />
            Price History (30 Days)
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stockData.priceHistory}>
                <XAxis 
                  dataKey="date" 
                  stroke="#9ca3af" 
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  fontSize={12}
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? '#10b981' : isNegative ? '#ef4444' : '#3b82f6'}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: isPositive ? '#10b981' : isNegative ? '#ef4444' : '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Stock Info */}
      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
        <p className="text-xs text-gray-400 flex items-center gap-2">
          <BarChart3 className="w-3 h-3" />
          Stock data provided by Yahoo Finance API. Prices may be delayed.
        </p>
      </div>
    </div>
  )
}