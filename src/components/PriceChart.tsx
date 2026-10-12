import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PriceHistory } from '../types';

interface PriceChartProps {
  data: PriceHistory[];
}

export default function PriceChart({ data }: PriceChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        📈 Andamento Prezzi (ultimi 4 mesi)
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => new Date(value).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}
              className="text-xs"
              tick={{ fontSize: 11 }}
            />
            <YAxis
              domain={['dataMin - 20', 'dataMax + 20']}
              tickFormatter={(value) => `€${value}`}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`€${value.toFixed(2)}`, '']}
              labelFormatter={(value) => new Date(value).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="minPrice"
              stroke="#10b981"
              strokeWidth={2}
              name="Prezzo Minimo"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="avgPrice"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Prezzo Medio"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="maxPrice"
              stroke="#ef4444"
              strokeWidth={2}
              name="Prezzo Massimo"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Min: €439.99</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Media: €495.00</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Max: €549.99</span>
          </div>
        </div>
        <span className="text-green-600 dark:text-green-400 font-medium">
          ↓ -20% dal prezzo di lancio
        </span>
      </div>
    </div>
  );
}
