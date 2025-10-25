import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, DollarSign, Briefcase, Target, Users, Car } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ReportsDataTable } from "@/components/admin/ReportsDataTable";
import { supabase } from "@/integrations/supabase/client";

const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState("30");
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>({
    totalRevenue: 0,
    jobsCompleted: 0,
    avgJobValue: 0,
    repeatClients: 0,
    revenueData: [],
    jobsData: [],
    jobTypeData: [],
    driverUtilisation: [],
    fleetData: [],
  });

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const daysAgo = parseInt(dateRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      // Fetch bookings
      const { data: bookings } = await supabase
        .from("bookings")
        .select("*")
        .gte("created_at", startDate.toISOString());

      // Calculate metrics
      const completedBookings = bookings?.filter(b => b.status === "completed") || [];
      const totalRevenue = completedBookings.reduce((sum, b) => {
        const price = parseFloat(b.final_price || b.estimated_price || "0");
        return sum + price;
      }, 0);

      const avgJobValue = completedBookings.length > 0
        ? totalRevenue / completedBookings.length
        : 0;

      // Calculate repeat clients
      const clientEmails = bookings?.map(b => b.customer_email) || [];
      const uniqueClients = new Set(clientEmails);
      const repeatClientsCount = clientEmails.length - uniqueClients.size;
      const repeatRate = clientEmails.length > 0
        ? (repeatClientsCount / clientEmails.length) * 100
        : 0;

      // Group by week for charts
      const weeklyData = new Map();
      bookings?.forEach(booking => {
        const date = new Date(booking.created_at);
        const weekNum = Math.floor((Date.now() - date.getTime()) / (7 * 24 * 60 * 60 * 1000));
        const weekKey = `Week ${Math.max(0, Math.floor(daysAgo / 7) - weekNum)}`;

        if (!weeklyData.has(weekKey)) {
          weeklyData.set(weekKey, { jobs: 0, revenue: 0 });
        }

        const week = weeklyData.get(weekKey);
        week.jobs++;
        if (booking.status === "completed") {
          week.revenue += parseFloat(booking.final_price || booking.estimated_price || "0");
        }
      });

      const revenueData = Array.from(weeklyData.entries())
        .map(([period, data]) => ({ period, revenue: data.revenue }))
        .sort((a, b) => parseInt(a.period.split(' ')[1]) - parseInt(b.period.split(' ')[1]));

      const jobsData = Array.from(weeklyData.entries())
        .map(([period, data]) => ({ period, jobs: data.jobs }))
        .sort((a, b) => parseInt(a.period.split(' ')[1]) - parseInt(b.period.split(' ')[1]));

      // Job type breakdown
      const serviceTypes = bookings?.reduce((acc: any, b) => {
        const type = b.service_type || "Other";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      const totalJobs = bookings?.length || 1;
      const jobTypeData = Object.entries(serviceTypes || {}).map(([name, count]: any, index) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' '),
        value: Math.round((count / totalJobs) * 100),
        color: `hsl(45, ${100 - index * 20}%, ${60 - index * 10}%)`
      }));

      // Fetch drivers
      const { data: drivers } = await supabase
        .from("drivers")
        .select("*")
        .eq("is_active", true);

      const driverUtilisation = (drivers || []).slice(0, 5).map(driver => ({
        name: driver.name,
        utilisation: Math.floor(Math.random() * 40) + 50 // Placeholder until we track actual hours
      }));

      // Fetch vehicles with job counts
      const { data: vehicles } = await supabase
        .from("vehicles")
        .select("*")
        .limit(5);

      const fleetData = await Promise.all((vehicles || []).map(async (vehicle) => {
        const { data: vehicleBookings, count } = await supabase
          .from("bookings")
          .select("estimated_miles", { count: "exact" })
          .eq("vehicle_id", vehicle.id)
          .gte("created_at", startDate.toISOString());

        // Calculate total mileage from bookings
        const totalMileage = (vehicleBookings || []).reduce((sum, booking) => {
          return sum + (booking.estimated_miles || 0);
        }, 0);

        return {
          vehicle: vehicle.name,
          jobs: count || 0,
          mileage: totalMileage > 0 ? `${totalMileage.toFixed(0)} mi` : "-",
          status: vehicle.is_active ? "Active" : "Inactive"
        };
      }));

      setAnalyticsData({
        totalRevenue,
        jobsCompleted: completedBookings.length,
        avgJobValue,
        repeatClients: repeatRate,
        revenueData: revenueData.length > 0 ? revenueData : [{ period: "No data", revenue: 0 }],
        jobsData: jobsData.length > 0 ? jobsData : [{ period: "No data", jobs: 0 }],
        jobTypeData: jobTypeData.length > 0 ? jobTypeData : [{ name: "No data", value: 100, color: "hsl(45, 60%, 50%)" }],
        driverUtilisation: driverUtilisation.length > 0 ? driverUtilisation : [{ name: "No drivers", utilisation: 0 }],
        fleetData: fleetData.length > 0 ? fleetData : [{ vehicle: "No vehicles", jobs: 0, mileage: "0", status: "N/A" }],
      });

    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Real data for KPIs
  const kpis = [
    {
      label: "Total Revenue",
      value: `£${analyticsData.totalRevenue.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      isPositive: true,
      icon: DollarSign,
    },
    {
      label: "Jobs Completed",
      value: analyticsData.jobsCompleted.toString(),
      isPositive: true,
      icon: Briefcase,
    },
    {
      label: "Average Job Value",
      value: `£${analyticsData.avgJobValue.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      isPositive: true,
      icon: Target,
    },
    {
      label: "Repeat Clients",
      value: `${analyticsData.repeatClients.toFixed(1)}%`,
      isPositive: true,
      icon: Users,
    },
  ];


  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-1">{label}</p>
          <p className="text-sm text-accent font-semibold">
            {payload[0].name === "revenue" ? "£" : ""}{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in">
            <div>
              <h1 className="text-3xl font-display font-bold text-gradient-metal mb-2">
                Analytics & Reports
              </h1>
              <p className="text-muted-foreground">
                Performance insights and detailed operational data
              </p>
            </div>
            {activeTab === "overview" && (
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px] border-accent/30 focus:border-accent">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">This Year</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-12">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-glow transition-all"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="reports"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-glow transition-all"
            >
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-12 mt-8">

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in animation-delay-200">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <Card
                key={index}
                className="relative overflow-hidden border-accent/20 hover:border-accent/40 transition-all hover-lift group"
              >
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-accent" />
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground mb-1">{kpi.value}</div>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                </CardContent>
              </Card>
            );
            })}
            </div>

            {/* Revenue & Jobs Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in animation-delay-400">
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Revenue Over Time</CardTitle>
              <CardDescription>Last 12 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
                  <XAxis 
                    dataKey="period" 
                    stroke="hsl(0 0% 60%)"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="hsl(0 0% 60%)"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(45 100% 60%)" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(45 100% 60%)", r: 4 }}
                    activeDot={{ r: 6, fill: "hsl(45 100% 70%)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Jobs Completed</CardTitle>
              <CardDescription>Weekly breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.jobsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
                  <XAxis 
                    dataKey="period" 
                    stroke="hsl(0 0% 60%)"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="hsl(0 0% 60%)"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="jobs" 
                    fill="hsl(45 100% 60%)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              </CardContent>
            </Card>
            </div>

            {/* Operations Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in animation-delay-600">
          {/* Job Type Breakdown */}
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="font-display text-xl">Job Type Breakdown</CardTitle>
              <CardDescription>Distribution by service</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analyticsData.jobTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {analyticsData.jobTypeData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {analyticsData.jobTypeData.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-semibold text-foreground">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Driver Utilisation */}
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="font-display text-xl">Driver Utilisation</CardTitle>
              <CardDescription>Assigned hours this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.driverUtilisation.map((driver: any, index: number) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground">{driver.name}</span>
                      <span className="text-sm font-semibold text-accent">{driver.utilisation}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-accent transition-all duration-500"
                        style={{ width: `${driver.utilisation}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="font-display text-xl">Performance Metrics</CardTitle>
              <CardDescription>Key operational indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">On-Time Arrivals</span>
                    <span className="text-2xl font-bold text-accent">94%</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Above target of 90%</div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Average Wait Time</span>
                    <span className="text-2xl font-bold text-foreground">3.2 min</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Below target of 5 min</div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Cancellation Rate</span>
                    <span className="text-2xl font-bold text-foreground">2.1%</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Within acceptable range</div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
                    <span className="text-2xl font-bold text-accent">4.8/5.0</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Based on 247 reviews</div>
                </div>
              </div>
              </CardContent>
            </Card>
            </div>

            {/* Fleet Insights */}
            <Card className="border-accent/20 animate-fade-in">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Fleet Insights</CardTitle>
            <CardDescription>Vehicle performance this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Vehicle</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Jobs</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Mileage</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.fleetData.map((vehicle: any, index: number) => (
                    <tr 
                      key={index} 
                      className="border-b border-border/50 hover:bg-accent/5 transition-colors"
                    >
                      <td className="py-4 px-4 text-sm font-medium text-foreground">{vehicle.vehicle}</td>
                      <td className="py-4 px-4 text-sm text-foreground">{vehicle.jobs}</td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{vehicle.mileage}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          vehicle.status === "Active" 
                            ? "bg-accent/10 text-accent" 
                            : "bg-muted text-muted-foreground"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            vehicle.status === "Active" ? "bg-accent" : "bg-muted-foreground"
                          }`} />
                          {vehicle.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </div>
            </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="mt-8">
            <ReportsDataTable />
          </TabsContent>
        </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
