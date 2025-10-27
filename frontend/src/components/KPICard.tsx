import { Card, CardContent } from "./ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface KPICardProps {
  title: string;
  value: string;
  change?: number;
  sparklineData?: Array<{ value: number; timestamp: string }>;
  format?: 'percentage' | 'currency' | 'number' | 'ms';
  suffix?: string;
}

export function KPICard({ title, value, change, sparklineData, format, suffix }: KPICardProps) {
  const formatValue = (val: string) => {
    if (format === 'percentage') return `${val}%`;
    if (format === 'currency') return `${val} FCFA`;
    if (format === 'ms') return `${val}ms`;
    return suffix ? `${val} ${suffix}` : val;
  };

  const getTrendIcon = () => {
    if (change === undefined) return null;
    if (change > 0) return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-3 w-3 text-red-500" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  const getTrendColor = () => {
    if (change === undefined) return 'text-muted-foreground';
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-muted-foreground';
  };

  return (
    <Card className="h-24">
      <CardContent className="p-4 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{title}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-medium">{formatValue(value)}</span>
              {change !== undefined && (
                <div className={`flex items-center gap-1 text-xs ${getTrendColor()}`}>
                  {getTrendIcon()}
                  <span>{Math.abs(change).toFixed(1)}%</span>
                </div>
              )}
            </div>
          </div>
          
          {sparklineData && sparklineData.length > 0 && (
            <div className="w-16 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={change && change > 0 ? '#10b981' : change && change < 0 ? '#ef4444' : '#6b7280'}
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}