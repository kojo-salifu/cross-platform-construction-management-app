import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, FileQuestion, Shield } from "lucide-react";

interface KPICardsProps {
  kpis: {
    totalBudget: number;
    actualSpent: number;
    remaining: number;
    cpi: number;
    spi: number;
    openRfis: number;
    hseIncidents: number;
  };
}

export function KPICards({ kpis }: KPICardsProps) {
  const variancePercent = ((kpis.remaining / kpis.totalBudget) * 100);
  const isOverBudget = kpis.remaining < 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Budget */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Contract Budget</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(kpis.totalBudget)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total project value
          </p>
        </CardContent>
      </Card>

      {/* Actual Spent */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Actual Spent</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(kpis.actualSpent)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatPercentage((kpis.actualSpent / kpis.totalBudget) * 100)} of budget
          </p>
        </CardContent>
      </Card>

      {/* Variance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Budget Variance</CardTitle>
          {isOverBudget ? (
            <TrendingDown className="h-4 w-4 text-red-500" />
          ) : (
            <TrendingUp className="h-4 w-4 text-green-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
            {formatCurrency(Math.abs(kpis.remaining))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isOverBudget ? 'Over budget' : 'Under budget'} ({formatPercentage(Math.abs(variancePercent))})
          </p>
        </CardContent>
      </Card>

      {/* CPI */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cost Performance (CPI)</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${kpis.cpi >= 1 ? 'text-green-600' : 'text-red-600'}`}>
            {kpis.cpi.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {kpis.cpi >= 1 ? 'Performing well' : 'Over spending'}
          </p>
        </CardContent>
      </Card>

      {/* SPI */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Schedule Performance (SPI)</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${kpis.spi >= 1 ? 'text-green-600' : 'text-orange-600'}`}>
            {kpis.spi.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {kpis.spi >= 1 ? 'On schedule' : 'Behind schedule'}
          </p>
        </CardContent>
      </Card>

      {/* Open RFIs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open RFIs</CardTitle>
          <FileQuestion className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.openRfis}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Pending responses
          </p>
        </CardContent>
      </Card>

      {/* HSE Incidents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">HSE Incidents</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${kpis.hseIncidents === 0 ? 'text-green-600' : 'text-red-600'}`}>
            {kpis.hseIncidents}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {kpis.hseIncidents === 0 ? 'Zero incidents' : 'This month'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
