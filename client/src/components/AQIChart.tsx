import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const MOCK_DATA = [
  { time: "00:00", aqi: 45 }, { time: "04:00", aqi: 42 },
  { time: "08:00", aqi: 85 }, { time: "12:00", aqi: 120 },
  { time: "16:00", aqi: 110 }, { time: "20:00", aqi: 95 },
  { time: "23:59", aqi: 75 },
];

export function AQIChart() {
  return (
    <Card className="col-span-1 lg:col-span-2 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>24h AQI Trend</CardTitle>
        <CardDescription>Average air quality index over the last 24 hours in Nagpur.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_DATA}>
              <defs>
                <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderRadius: '12px', 
                  border: '1px solid hsl(var(--border))',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area 
                type="monotone" 
                dataKey="aqi" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorAqi)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
