// app/dashboard/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  DollarSign,
  Handshake,
  BarChart as BarChartIcon,
  CreditCard,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "../../lib/supabaseBrowser";
import { useSelector } from "react-redux";
import { SubscriptionDialog } from "../components/subscription/SubscriptionModal";
import SubscriptionPayment from "../components/subscription/list/subscription-payment";
type planState = {
  plan_name: string;
  commission: string;
  id: string;
  type: string;
  hst_tax?: string;
  amount: string;
  basic_amount?: string;
};

export default function DashboardPage() {
  const { user } = useSelector((state: any) => state?.user);
  const [stats, setStats] = useState({
    total: 0,
    totalProfit: 0,
    totalCommission: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataInvoice, setInvoice] = useState<any[]>([]);
  const [filter, setFilter] = useState<any>("6months");
  const [graphStats, setGraphStat] = useState<any[]>([]);
  const [maxAmount, setMaxAmount] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<boolean>(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<planState | null>(null);
  const chartData = [
    { name: "Jan", commission: 2000 },
    { name: "Feb", commission: 1750 },
    { name: "Mar", commission: 1500 },
    { name: "Apr", commission: 1250 },
    { name: "May", commission: 1000 },
    { name: "Jun", commission: 750 },
  ];

  const recentDeals = [
    {
      id: "DO23",
      client: "James Allen",
      vehicle: "2021 Toyota Camry",
      price: 35000,
      profit: 1800,
      commission: 540,
    },
    {
      id: "DO22",
      client: "Emma Scott",
      vehicle: "2020 Honda HR-V",
      price: 27000,
      profit: 1200,
      commission: 360,
    },
    {
      id: "DO21",
      client: "Michael Lee",
      vehicle: "2019 Honda Civic",
      price: 24500,
      profit: 1400,
      commission: 420,
    },
  ];

  const getFilterDate = (
    filter: "6months" | "3months" | "12months" | "all"
  ): string | null => {
    if (filter === "all") return null;

    const date = new Date();

    switch (filter) {
      case "3months":
        date.setMonth(date.getMonth() - 3);
        break;
      case "6months":
        date.setMonth(date.getMonth() - 6);
        break;
      case "12months":
        date.setMonth(date.getMonth() - 12);
        break;
    }

    return date.toISOString();
  };

  function getCommissionChartData(data: any[], filter: any) {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthCountMap: Record<any, number> = {
      "3months": 3,
      "6months": 6,
      "12months": 12,
    };

    const monthsToShow = monthCountMap[filter];
    const now = new Date();

    // Step 1: Generate list of N months including current month
    const pastMonths: { key: string; label: string }[] = [];
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const d = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1)
      );
      const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
      const label = monthNames[d.getUTCMonth()];
      pastMonths.push({ key, label });
    }

    // Step 2: Aggregate commission amounts per month (UTC-safe parsing)
    const commissionMap: Record<string, number> = {};
    data.forEach((item) => {
      const date = new Date(item.dateOfSale + "T00:00:00Z"); // ensures UTC
      const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
      const commission = parseFloat(item.commission_amount || "0");

      if (!commissionMap[key]) {
        commissionMap[key] = 0;
      }
      commissionMap[key] += Math.round(commission);
    });

    // Step 3: Final chartData
    const chartData = pastMonths.map(({ key, label }) => ({
      name: label,
      commission: parseFloat((commissionMap[key] || 0).toFixed(2)),
    }));

    return chartData;
  }
  const handleShowPopModal = async () => {
    const modalShown = sessionStorage.getItem("modal_shown");
    const { data, error } = await supabaseBrowser
      .from("user_subscription")
      .select(
        `
         *,
         subscription(*)
       `
      )
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single();

    if (!data) {
      if (!modalShown) {
        setShowModal(true);
        sessionStorage.setItem("modal_shown", "true");
      }
    }
  };
  const handleFetchInvoice = async () => {
    setLoading(true);
    try {
      await handleShowPopModal();
      let query = supabaseBrowser
        .from("invoice")
        .select("*, users!inner(*)", {
          count: "exact",
        })
        .eq("salesName", user?.id)
        .order("created_at", { ascending: false });

      // Apply filters
      const filterDate = getFilterDate(filter); // selectedFilter from UI

      if (filterDate) {
        query = query.gte("created_at", filterDate);
      }
      const { data, error, count } = await query;

      if (error) {
        console.error(error);
        setError(error.message);
      } else {
        setInvoice(data.slice(0, 4));
        const graphData = await getCommissionChartData(data, filter);
        const filetedData = await graphData?.map((w) => w?.commission);
        const max = filetedData.reduce((a, b) => (a > b ? a : b), -Infinity);
        setMaxAmount(Math.round(max));
        setGraphStat(graphData);
        const sumProfit = data?.reduce((acc, curr) => {
          return acc + parseFloat(curr?.saleAmount || "0");
        }, 0); // 0 is the initial value
        const sumCommission = data?.reduce((acc, curr) => {
          return acc + parseFloat(curr?.commission_amount || "0");
        }, 0);
        setStats({
          total: data?.length,
          totalProfit: Math.round(sumProfit),
          totalCommission: Math.round(sumCommission),
        });
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch seminar data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // const modalShown = sessionStorage.getItem("modal_shown");
    if (user?.id) {
      // handleShowPopModal();
      handleFetchInvoice();
      // if (user?.subscriptionPlan.length == 0 && !modalShown) {
      //   setShowModal(true);
      //   sessionStorage.setItem("modal_shown", "true");
      // }else if (user?.subscriptionPlan.length != 0 && !modalShown) {
      //   const activePlan = user?.subscriptionPlan?.find(
      //     (w: any) => w?.is_active
      //   );
      //   if(!activePlan){
      //     setShowModal(true);
      //     sessionStorage.setItem("modal_shown", "true");
      //   }
      // }
    }
  }, [filter, user]);

  // useEffect(() => {
  //   if (user?.id) {
  //     handleShowPopModal();
  //   }
  // }, [user?.id]);

  useEffect(() => {
    const clearModalShown = () => {
      sessionStorage.removeItem("modal_shown");
    };

    window.addEventListener("beforeunload", clearModalShown);
    return () => window.removeEventListener("beforeunload", clearModalShown);
  }, []);

  return (
    <>
      {showModal && (
        <SubscriptionDialog
          setShowModal={setShowModal}
          setPaymentMethod={setPaymentMethod}
          setSelectedSubscription={setSelectedSubscription}
        />
      )}

      {loading ? (
        <div className="space-y-6 animate-pulse">
          {/* Heading */}
          <div className="h-6 w-48 bg-gray-200 rounded" />

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                  <div className="h-5 w-5 bg-gray-200 rounded-full" />
                </div>
                <div className="h-6 w-24 bg-gray-300 rounded" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>

          {/* Graph Card */}
          <div className="p-4 border rounded-lg space-y-4 h-80">
            <div className="flex justify-between items-center">
              <div className="h-5 w-40 bg-gray-200 rounded" />
              <div className="h-8 w-40 bg-gray-200 rounded" />
            </div>
            <div className="h-full bg-gray-100 rounded" />
          </div>

          {/* Table Card */}
          <div className="p-4 border rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-5 w-40 bg-gray-200 rounded" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="grid grid-cols-6 gap-4">
                  {[...Array(6)].map((_, j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded w-full" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : !paymentMethod ? (
        <div className="space-y-6 p-6 bg-white">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-gray-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Invoice
                </CardTitle>
                <Handshake className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.total?.toLocaleString() || 0}
                </div>
                <Link
                  href="/dashboard/invoices"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Details
                </Link>
              </CardContent>
            </Card>

            <Card className="border-gray-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Profit
                </CardTitle>
                <DollarSign className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${stats?.totalProfit?.toLocaleString() || 0}
                </div>
                <Link
                  href="/dashboard/invoices"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Details
                </Link>
              </CardContent>
            </Card>

            <Card className="border-gray-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Commission
                </CardTitle>
                <CreditCard className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${stats?.totalCommission?.toLocaleString() || 0}
                </div>
                <Link
                  href="/dashboard/invoices"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Details
                </Link>
              </CardContent>
            </Card>

            {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription</CardTitle>
            <BarChartIcon className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Premium</div>
            <Link href="/dashboard/subscription" className="text-sm text-blue-600 hover:underline">
              Profile
            </Link>
          </CardContent>
        </Card> */}
          </div>

          {/* Graph Section */}
          <Card className="border-gray-100">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Commission Overview</CardTitle>
                <Select
                  value={filter}
                  onValueChange={(e) => {
                    setFilter(e);
                  }}
                >
                  <SelectTrigger className="w-[180px] border-gray-300">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-300 bg-white">
                    <SelectItem value="3months">Last 3 months</SelectItem>
                    <SelectItem value="6months">Last 6 months</SelectItem>
                    <SelectItem value="12months">Last 12 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={graphStats}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorCommission"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis
                    // domain={[0, maxAmount]}
                    domain={["auto", "auto"]}
                    // tickCount={9}
                    tickFormatter={(value: number) => `$${value}`}
                  />
                  <Tooltip
                    formatter={(value: number) => [`$${value}`, "Commission"]}
                    labelFormatter={(label: string) => `Month: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="commission"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorCommission)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Deals Table */}
          <Card className="lg:w-[100%] md:w-[100%] w-[320px] border-gray-300">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Invoice Added</CardTitle>
                <Link
                  href="/dashboard/invoices"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Invoice
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-300">
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Car Model</TableHead>
                    <TableHead className="text-right">Amount(CAD)</TableHead>
                    <TableHead className="text-right">Vin number</TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataInvoice.map((deal) => (
                    <TableRow key={deal?.invoiceId}>
                      <TableCell>{deal?.invoiceId}</TableCell>
                      <TableCell>
                        {deal?.users?.full_name ||
                          deal?.users?.display_name ||
                          deal?.users?.email ||
                          " "}
                      </TableCell>
                      <TableCell>{deal.carModel}</TableCell>
                      <TableCell className="text-right">
                        ${Number(deal?.saleAmount || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {deal?.vinNumber?.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {deal.commission.toLocaleString()}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        <SubscriptionPayment
          selectedSubscription={selectedSubscription}
          handleCancelPayment={() => {
            setSelectedSubscription(null);
            setPaymentMethod(false);
          }}
        />
      )}
    </>
  );
}
