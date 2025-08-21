import { useGetSalesLast7DaysQuery, useGetSalesLast30DaysQuery } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Calendar, BarChart3 } from "lucide-react";

export default function SalesDashboardPage() {
  const { data: sales7Days, isLoading: loading7Days, isError: error7Days } = useGetSalesLast7DaysQuery();
  const { data: sales30Days, isLoading: loading30Days, isError: error30Days } = useGetSalesLast30DaysQuery();

  // Transform data for 7-day chart (Multiple Bar Chart)
  const transform7DaysData = (data) => {
    if (!data || !data.data) return [];
    
    return data.data.map(dayData => ({
      day: dayData.day,
      Shoes: dayData.Shoes || 0,
      Shorts: dayData.Shorts || 0,
      'T-shirts': dayData['T-shirts'] || 0,
      Pants: dayData.Pants || 0,
      Socks: dayData.Socks || 0,
    }));
  };

  // Transform data for 30-day chart (Stacked Bar Chart)
  const transform30DaysData = (data) => {
    if (!data || !data.data) return [];
    
    return data.data.map(dayData => ({
      day: dayData.day,
      Shoes: dayData.Shoes || 0,
      Shorts: dayData.Shorts || 0,
      'T-shirts': dayData['T-shirts'] || 0,
      Pants: dayData.Pants || 0,
      Socks: dayData.Socks || 0,
    }));
  };

  const chartColors = {
    Shoes: '#8884d8',
    Shorts: '#82ca9d',
    'T-shirts': '#ffc658',
    Pants: '#ff7300',
    Socks: '#8dd1e1',
  };

  if (loading7Days || loading30Days) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading sales data...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error7Days || error30Days) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-red-800 mb-2">Failed to load sales data</h2>
              <p className="text-red-600">Please try refreshing the page or contact support if the problem persists.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const chart7DaysData = transform7DaysData(sales7Days);
  const chart30DaysData = transform30DaysData(sales30Days);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Sales Dashboard</h1>
          </div>
          <p className="text-lg text-gray-600">Analytics and insights for your store performance</p>
        </div>

        {/* 7 Days Chart - Multiple Bar Chart */}
        <Card className="mb-8">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Calendar className="w-5 h-5" />
              Last 7 Days Sales by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart7DaysData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Shoes" fill={chartColors.Shoes} />
                  <Bar dataKey="Shorts" fill={chartColors.Shorts} />
                  <Bar dataKey="T-shirts" fill={chartColors['T-shirts']} />
                  <Bar dataKey="Pants" fill={chartColors.Pants} />
                  <Bar dataKey="Socks" fill={chartColors.Socks} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 30 Days Chart - Stacked Bar Chart */}
        <Card>
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center gap-2 text-green-900">
              <BarChart3 className="w-5 h-5" />
              Last 30 Days Sales by Category (Stacked)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart30DaysData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Shoes" stackId="a" fill={chartColors.Shoes} />
                  <Bar dataKey="Shorts" stackId="a" fill={chartColors.Shorts} />
                  <Bar dataKey="T-shirts" stackId="a" fill={chartColors['T-shirts']} />
                  <Bar dataKey="Pants" stackId="a" fill={chartColors.Pants} />
                  <Bar dataKey="Socks" stackId="a" fill={chartColors.Socks} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">7-Day Total</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {chart7DaysData.reduce((total, day) => 
                      total + day.Shoes + day.Shorts + day['T-shirts'] + day.Pants + day.Socks, 0
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">30-Day Total</p>
                  <p className="text-2xl font-bold text-green-900">
                    {chart30DaysData.reduce((total, day) => 
                      total + day.Shoes + day.Shorts + day['T-shirts'] + day.Pants + day.Socks, 0
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-medium">Top Category</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {(() => {
                      const totals = {
                        Shoes: chart30DaysData.reduce((sum, day) => sum + day.Shoes, 0),
                        Shorts: chart30DaysData.reduce((sum, day) => sum + day.Shorts, 0),
                        'T-shirts': chart30DaysData.reduce((sum, day) => sum + day['T-shirts'], 0),
                        Pants: chart30DaysData.reduce((sum, day) => sum + day.Pants, 0),
                        Socks: chart30DaysData.reduce((sum, day) => sum + day.Socks, 0),
                      };
                      const topCategory = Object.entries(totals).reduce((a, b) => a[1] > b[1] ? a : b);
                      return topCategory[0];
                    })()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
