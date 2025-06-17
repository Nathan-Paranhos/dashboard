import { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
  TooltipProps,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';

type ChartType = 'line' | 'bar';

type ChartData = {
  name: string;
  [key: string]: string | number;
}[];

interface DashboardChartProps {
  title: string;
  data: ChartData;
  dataKeys: string[];
  type?: ChartType;
  height?: number;
  isLoading?: boolean;
  className?: string;
  showLegend?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  tooltipFormatter?: (value: any, name: string, props: any) => [string, string];
  legendFormatter?: (value: string) => string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
  formatter,
}: TooltipProps<any, any> & { formatter?: DashboardChartProps['tooltipFormatter'] }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-4 shadow-sm">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => {
          const [value, name] = formatter
            ? formatter(entry.value, entry.name!, entry)
            : [entry.value, entry.name];
            
          return (
            <p key={`tooltip-${index}`} className="text-sm" style={{ color: entry.color }}>
              {name}: <span className="font-medium">{value}</span>
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

export function DashboardChart({
  title,
  data,
  dataKeys,
  type = 'line',
  height = 300,
  isLoading = false,
  className,
  showLegend = true,
  xAxisLabel,
  yAxisLabel,
  tooltipFormatter,
  legendFormatter,
}: DashboardChartProps) {
  // Cores padrão para as linhas/barras
  const colors = [
    '#3b82f6', // blue-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#14b8a6', // teal-500
    '#f97316', // orange-500
    '#6366f1', // indigo-500
  ];

  // Verifica se há dados para exibir
  const hasData = useMemo(() => {
    return data && data.length > 0 && data.some(item => 
      dataKeys.some(key => item[key] !== undefined && item[key] !== null)
    );
  }, [data, dataKeys]);

  // Renderiza o gráfico com base no tipo
  const renderChart = () => {
    if (isLoading) {
      return <Skeleton className="h-full w-full" />;
    }

    if (!hasData) {
      return (
        <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
          <p>Nenhum dado disponível</p>
        </div>
      );
    }


    if (type === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            >
              {xAxisLabel && (
                <Label 
                  value={xAxisLabel} 
                  offset={-5} 
                  position="insideBottom" 
                  className="text-xs"
                />
              )}
            </XAxis>
            <YAxis 
              tick={{ fontSize: 12 }} 
              tickLine={false} 
              axisLine={false}
              width={40}
            >
              {yAxisLabel && (
                <Label 
                  value={yAxisLabel} 
                  angle={-90} 
                  position="insideLeft" 
                  className="text-xs"
                  style={{ textAnchor: 'middle' }}
                />
              )}
            </YAxis>
            <Tooltip 
              content={<CustomTooltip formatter={tooltipFormatter} />} 
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            />
            {showLegend && (
              <Legend 
                formatter={legendFormatter} 
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              />
            )}
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    }

    // Gráfico de linha (padrão)
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          >
            {xAxisLabel && (
              <Label 
                value={xAxisLabel} 
                offset={-5} 
                position="insideBottom" 
                className="text-xs"
              />
            )}
          </XAxis>
          <YAxis 
            tick={{ fontSize: 12 }} 
            tickLine={false} 
            axisLine={false}
            width={40}
          >
            {yAxisLabel && (
              <Label 
                value={yAxisLabel} 
                angle={-90} 
                position="insideLeft" 
                className="text-xs"
                style={{ textAnchor: 'middle' }}
              />
            )}
          </YAxis>
          <Tooltip 
            content={<CustomTooltip formatter={tooltipFormatter} />} 
            cursor={{ stroke: 'rgba(0, 0, 0, 0.1)', strokeWidth: 1 }}
          />
          {showLegend && (
            <Legend 
              formatter={legendFormatter} 
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            />
          )}
          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className={cn('h-[300px]', `h-[${height}px]`)}>
        {renderChart()}
      </CardContent>
    </Card>
  );
}

export function DashboardChartSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent className="h-[300px]">
        <Skeleton className="h-full w-full" />
      </CardContent>
    </Card>
  );
}
