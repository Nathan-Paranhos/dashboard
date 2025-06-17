import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown, Minus } from 'lucide-react';

type TrendType = 'up' | 'down' | 'neutral';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  icon,
  isLoading = false,
  className,
}: MetricCardProps) {
  const getTrendInfo = (): { icon: React.ReactNode; color: string } => {
    if (change === undefined || change === 0) {
      return {
        icon: <Minus className="h-4 w-4" />,
        color: 'text-muted-foreground',
      };
    }

    if (change > 0) {
      return {
        icon: <ArrowUp className="h-4 w-4" />,
        color: 'text-emerald-600 dark:text-emerald-400',
      };
    }

    return {
      icon: <ArrowDown className="h-4 w-4" />,
      color: 'text-destructive',
    };
  };

  const trend = getTrendInfo();

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-3/4" />
          <div className="mt-2 flex items-center">
            <Skeleton className="mr-1 h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="rounded-full bg-primary/10 p-2 text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className={`mt-1 flex items-center text-xs ${trend.color}`}>
            {trend.icon}
            <span className="ml-1">
              {Math.abs(change)}% em relação ao mês passado
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface MetricCardSkeletonProps {
  className?: string;
}

export function MetricCardSkeleton({ className }: MetricCardSkeletonProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-3/4" />
        <div className="mt-2 flex items-center">
          <Skeleton className="mr-1 h-4 w-4" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}
