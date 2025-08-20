// app/dashboard/page.tsx
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Handshake, TicketPercent, CreditCard, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "../../lib/supabaseBrowser";
import { useSelector } from "react-redux";
import { SubscriptionDialog } from "../components/subscription/SubscriptionModal";
import SubscriptionPayment from "../components/subscription/list/subscription-payment";
import ShowUserId from "./_components/ShowUserId";
import GoogleSheet from "./_components/GoogleSheet";

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

  // 🔹 Removed totalCommission, added totalLeads
  const [stats, setStats] = useState({
    total: 0, // invoices count
    totalLeads: 0, // leads count
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

  const handleShowPopModal = async () => {
    const modalShown = sessionStorage.getItem("modal_shown");
    const { data } = await supabaseBrowser
      .from("user_subscription")
      .select(`*, subscription(*)`)
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
        .select("*, users!inner(*)", { count: "exact" })
        .eq("salesName", user?.id)
        .order("created_at", { ascending: false });

      const filterDate = getFilterDate(filter);
      if (filterDate) {
        query = query.gte("created_at", filterDate);
      }

      const { data, error } = await query;

      if (error) {
        console.error(error);
        setError(error.message);
      } else {
        setInvoice(data.slice(0, 4));

        // 🔹 Get total leads count from leads table
        const { count: leadsCount } = await supabaseBrowser
          .from("leads")
          .select("*", { count: "exact", head: true });
        // adjust filter if needed

        setStats({
          total: data?.length || 0,
          totalLeads: leadsCount || 0,
        });
      }
    } catch (error) {
      console.error(error);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      handleFetchInvoice();
    }
  }, [filter, user]);

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
        <div className="space-y-6 animate-pulse flex justify-center items-center h-screen"><Loader className="h-10 w-10 animate-spin text-blue-500"/></div>
      ) : !paymentMethod ? (
        <div className="space-y-6 p-6 bg-white min-h-screen">
          <ShowUserId />
          <GoogleSheet />
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* 🔹 Total Invoice */}
            <Card className="border-gray-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
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

            {/* 🔹 Total Leads */}
            <Card className="border-gray-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Leads
                </CardTitle>
                <TicketPercent className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalLeads?.toLocaleString() || 0}
                </div>
                <Link
                  href="/dashboard/leads"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Details
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Recent Invoices Table */}
          <Card className="w-full border-gray-300">
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
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Created Date</TableHead>
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
                      <TableCell>{deal?.users?.phone}</TableCell>
                      <TableCell>
                        ${Number(deal?.amount || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(deal?.created_at).toLocaleDateString(
                          "en-US",
                          {
                            day: "2-digit",
                            month: "short", // e.g. Jan, Feb
                            year: "numeric",
                          }
                        )}
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
