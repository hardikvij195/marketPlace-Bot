"use client";

import Modal from "../../../app/components/Modal";
import {
  Search,
  Calendar,
  Eye,
  FileText,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Info,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import { supabaseBrowser } from "../../../lib/supabaseBrowser";
const ITEMS_PER_PAGE = 5;
import jsPDF from "jspdf";
import PaginationBar from "../../../app/components/Pagination";

type Invoice = {
  id: string;
  month: string;
  date: string;
  deals: string;
  commission: string;
};

const invoicesData: Invoice[] = [
  {
    id: "INV-2025-05",
    month: "May 2025",
    date: "May 30, 2025",
    deals: "5 Deals",
    commission: "$3,450",
  },
  {
    id: "INV-2025-04",
    month: "April 2025",
    date: "Apr 30, 2025",
    deals: "3 Deals",
    commission: "$1,950",
  },
  {
    id: "INV-2025-03",
    month: "March 2025",
    date: "Mar 31, 2025",
    deals: "2 Deals",
    commission: "$1,000",
  },
  {
    id: "INV-2025-02",
    month: "Feb 2025",
    date: "Feb 28, 2025",
    deals: "1 Deal",
    commission: "$700",
  },
  {
    id: "INV-2025-01",
    month: "Jan 2025",
    date: "Jan 31, 2025",
    deals: "4 Deals",
    commission: "$2,400",
  },
  {
    id: "INV-2024-12",
    month: "Dec 2024",
    date: "Dec 31, 2024",
    deals: "3 Deals",
    commission: "$1,200",
  },
  // Add more items here if needed
];

export default function InvoiceTable() {
  const printRef = useRef<HTMLDivElement>(null);
  const { user } = useSelector((state: any) => state?.user);

  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Invoice[]>([]);
  const [dataInvoice, setInvoice] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  // const limit = 10;
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const totalPages = Math.ceil(total / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentInvoices = invoicesData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    const handleFetchSeminar = async () => {
      setLoading(true);
      try {
        let query = supabaseBrowser
          .from("invoice")
          .select("*, users!inner(*)", {
            count: "exact",
          })
          .eq("salesName", user?.id)
          .order("created_at", { ascending: false })
          .range((page - 1) * limit, page * limit - 1);

        // Apply filters
        if (search) {
          query = query.ilike("users.email", `%${search}%`);
        }

        if (status && status != "all") {
          query = query.eq("status", status);
        }

        if (selectedDate) {
          query = query
            .gte("created_at", selectedDate + " 00:00:00")
            .lte("created_at", selectedDate + " 23:59:59");
        }

        const { data, error, count } = await query;

        if (error) {
          console.error(error);
          setError(error.message);
        } else {
          setInvoice(data);
          setTotal(count || 0); // Set total count of records
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch seminar data");
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      handleFetchSeminar();
    }
  }, [page, search, status, limit, selectedDate, user, limit]);
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDownloawwwd = async (row: any) => {
    const doc = new jsPDF();

    // Convert the SVG URL to a base64 image

    // Add logo image to PDF
    // doc.addImage(
    //   "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTU3IiBoZWlnaHQ9IjcwMSIgdmlld0JveD0iMCAwIDU1NyA3MDEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDQwQzAgMTcuOTA4NiAxNy45MDg2IDAgNDAgMEg1MTdDNTM5LjA5MSAwIDU1NyAxNy45MDg2IDU1NyA0MFY1MjcuMTkzQzU1NyA1NDEuODYzIDU0OC45NjkgNTU1LjM1NyA1MzYuMDc0IDU2Mi4zNTJMMjk5LjQzOCA2OTAuNzI2QzI4Ny42MTYgNjk3LjE0IDI3My4zNjIgNjk3LjE4MyAyNjEuNTAxIDY5MC44NEwyMS4xMzczIDU2Mi4zMDNDOC4xMjQ1IDU1NS4zNDUgMCA1NDEuNzg3IDAgNTI3LjAzVjQwWiIgZmlsbD0iIzBDNDY5MCIvPgo8cGF0aCBkPSJNNTAgMTdINTA3QzUyNi44ODIgMTcgNTQzIDMzLjExNzggNTQzIDUzVjUxOS43NDJDNTQzIDUzMi45NTIgNTM1Ljc2NSA1NDUuMTAxIDUyNC4xNSA1NTEuMzk1TDI5Ny40NDIgNjc0LjIzMUMyODYuODExIDY3OS45OTIgMjczLjk5OCA2ODAuMDMxIDI2My4zMzIgNjc0LjMzNEwzMy4wNCA1NTEuMzM0QzIxLjMxOTYgNTQ1LjA3NCAxNC4wMDAxIDUzMi44NjcgMTQgNTE5LjU4VjUzTDE0LjAxMTcgNTIuMDcxM0MxNC41MDQzIDMyLjYxODMgMzAuNDI4MyAxNyA1MCAxN1oiIHN0cm9rZT0iI0NFQ0RENSIgc3Ryb2tlLXdpZHRoPSI4Ii8+CjxwYXRoIGQ9Ik0xNzguNSA0NTkuNUMxNjMuNSA0NjEuNSAxNTggNDcwLjUgMTU4IDQ3OEwxNjAuNSA1MzFDMTYwLjkgNTM5LjggMTYxLjUgNTQyLjUgMTc0IDU0My41TDIwNyA1NDQuNUwyMTIgNTQyLjVIMzQwTDM0NC41IDU0My41QzM1NCA1NDQgMzc0LjQgNTQ0LjcgMzgwIDU0My41QzM4NS42IDU0Mi4zIDM4OC42NjcgNTQwIDM4OS41IDUzOUMzOTEuNSA1MzQuMiAzOTQgNDk1IDM5Mi41IDQ3MS41QzM4OSA0NjQgMzgwIDQ2MS41IDM3NC41IDQ2MEMzNzAuMSA0NTguOCAzNjAuMzMzIDQ1OS44MzMgMzU2IDQ2MC41QzM0OC44IDQ2Mi41IDIxNi41IDQ2NSAxOTEgNDU5LjVIMTc4LjVaIiBmaWxsPSIjRDlEOUQ5IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMzc2LjUgNDY5TDM0MCA0OTdDMzQ1LjIgNDk4LjIgMzYzIDQ5NC41IDM3MiA0OTJDMzgxLjYgNDg4IDM4My41IDQ3Ni41IDM4NSA0NjlIMzc2LjVaIiBmaWxsPSIjMEM0NjkwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMTc1LjUgNDY5TDIxMiA0OTdDMjA2LjggNDk4LjIgMTg5IDQ5NC41IDE4MCA0OTJDMTcwLjQgNDg4IDE2OC41IDQ3Ni41IDE2NyA0NjlIMTc1LjVaIiBmaWxsPSIjMEM0NjkwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMzY2LjUgNDU4TDM3MyA0NDMuNUMzNzkuMzMzIDQ0My42NjcgMzkyLjUgNDQ1LjIgMzk0LjUgNDUwQzM5Ni41IDQ1NC44IDM3Ni42NjcgNDU3LjMzMyAzNjYuNSA0NThaIiBmaWxsPSIjRDlEOUQ5IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMTg2IDQ1Ny41TDE3OCA0NDMuNUMxNjkuNjY3IDQ0Mi4zMzMgMTU1LjUgNDQ1IDE1Ni41IDQ0OS41QzE1OC4yNTggNDU3LjQwNiAxNzcuMzM0IDQ1OCAxODYgNDU3LjVaIiBmaWxsPSIjRDlEOUQ5IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMTk4IDQ1OUMxOTMuNiA0NTYuNiAxOTcuNSA0NDkuNjY3IDIwMCA0NDYuNUMyMDQuNSA0NDAuOCAyMTAuNSA0MjUuNSAyNDcgNDI0LjVIMzAzQzMwOC41IDQyNC44MzMgMzIyIDQyNi4yIDMzMiA0MjlDMzQyIDQzMS44IDM1MS41IDQ0Ni4xNjcgMzU1IDQ1M0MzNTYuNiA0NTYuNiAzNTQuMzMzIDQ1OC41IDM1MyA0NTlDMzUwLjgzMyA0NTIuNSAzNDMuNSA0NDAgMzM1IDQzNUMzMjYuNDg1IDQyOS45OTEgMzA5LjgzMyA0MzAuNSAzMDMgNDMwLjVIMjQ3QzIyNi4yIDQzMC41IDIxOC42NjcgNDMzLjE2NyAyMTcuNSA0MzQuNUMyMDkuMSA0MzguOSAyMDEgNDUyLjY2NyAxOTggNDU5WiIgZmlsbD0iI0Q5RDlEOSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KPHBhdGggZD0iTTQ0NiAzMTUuNUw0MzMgMzM3LjVMNDIwLjUgMzE1LjVINDAwLjVMNDIyLjUgMzUyTDM5OC41IDM4OS41SDQxNy41TDQzMyAzNjUuNUw0NDYgMzg5LjVINDY2LjVMNDQyLjUgMzUyTDQ2NCAzMTUuNUg0NDZaIiBmaWxsPSIjRDlEOUQ5IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMzcwLjUgMzE1SDMyMlYzOTAuNUgzNzAuNVYzNzcuNUgzMzhWMzYwLjVIMzY0VjM0Ni41SDMzOFYzMzBIMzcwLjVWMzE1WiIgZmlsbD0iI0Q5RDlEOSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KPHBhdGggZD0iTTI2NS41IDMxNS41SDI0OUwyNzIgMzkwLjVIMjkwLjVMMzE0LjUgMzE1LjVIMjk3TDI4MSAzNjhMMjY1LjUgMzE1LjVaIiBmaWxsPSIjRDlEOUQ5IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMjQxLjUgMzE1SDIyNVYzOTFIMjQxLjVWMzE1WiIgZmlsbD0iI0Q5RDlEOSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KPHBhdGggZD0iTTE1OCAzOTEuNUgxNzQuNVYzNjMuNUgxODQuNUwxOTggMzkxLjVIMjE2LjVMMjAwLjUgMzYxQzIyMS41IDM1MCAyMTguNSAzMTYgMTg3IDMxNkgxNThWMzkxLjVaIiBmaWxsPSIjRDlEOUQ5IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMTc0IDM0OS41VjMyOEgxODYuNUMyMDEuNSAzMzIgMTk2LjUgMzQ3IDE4Ni41IDM0OS41SDE3NFoiIGZpbGw9IiMwQzQ2OTAiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMC44Ii8+CjxwYXRoIGQ9Ik05MCAzOTAuOTQyVjMxNi40NDJDMTAyLjggMzE1LjY0MiAxMTUuMzMzIDMxNi4xMDggMTIwIDMxNi40NDJDMTMxIDMxOC41IDEzNyAzMjIuMjQyIDE0MSAzMjcuNDQyQzE0NiAzMzMuOTQyIDE0NiAzMzcuOTQyIDE0Ni41IDM1NC40NDJDMTQ2LjkgMzY3LjY0MiAxNDMuNjY3IDM3NS42MDggMTQyIDM3Ny45NDJDMTM0LjggMzg5LjU0MiAxMjIuMzMzIDM5MS40NDIgMTE3IDM5MC45NDJIOTBaIiBmaWxsPSIjRDlEOUQ5IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMTA0IDM3OS45NTFWMzI5LjNDMTEwLjU2NiAzMjguNzU2IDExNi45OTUgMzI5LjA3NCAxMTkuMzg5IDMyOS4zQzEyNS4wMzIgMzMwLjcgMTI4LjEwOSAzMzMuMjQ0IDEzMC4xNjEgMzM2Ljc3OUMxMzIuNzI2IDM0MS4xOTggMTMyLjcyNiAzNDMuOTE4IDEzMi45ODMgMzU1LjEzNkMxMzMuMTg4IDM2NC4xMSAxMzEuNTI5IDM2OS41MjcgMTMwLjY3NCAzNzEuMTEzQzEyNi45ODEgMzc5IDEyMC41ODYgMzgwLjI5MSAxMTcuODUgMzc5Ljk1MUgxMDRaIiBmaWxsPSIjMEM0NjkwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMzA4IDIxOC41VjIxMEwzMjkuNSAyMTZWMjIzTDMwOCAyMTguNVoiIGZpbGw9IiNEOUQ5RDkiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMC44Ii8+CjxwYXRoIGQ9Ik0zMDggMjM0LjVWMjI2TDMyOS41IDIzMlYyMzlMMzA4IDIzNC41WiIgZmlsbD0iI0Q5RDlEOSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KPHBhdGggZD0iTTMwOCAyNTAuNVYyNDJMMzI5LjUgMjQ4VjI1NUwzMDggMjUwLjVaIiBmaWxsPSIjRDlEOUQ5IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMzA4IDI2Ni41VjI1OEwzMjkuNSAyNjRWMjcxTDMwOCAyNjYuNVoiIGZpbGw9IiNEOUQ5RDkiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMC44Ii8+CjxwYXRoIGQ9Ik0yNjEgMTY0LjVMMjUwLjUgMTczLjVWMjg3LjVIMjYxVjE2NC41WiIgZmlsbD0iI0Q5RDlEOSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KPHBhdGggZD0iTTI3OCAxNTFMMjY4IDE1OS41VjI4Ny41SDI3OFYxNTFaIiBmaWxsPSIjRDlEOUQ5IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMjM0LjUgMjg3LjVWMjE4TDI0MS41IDIxNVYyODcuNUgyMzQuNVoiIGZpbGw9IiNEOUQ5RDkiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMC44Ii8+CjxwYXRoIGQ9Ik0zNTAuNSA1MEwxMTAgMjY2LjVMMTA5IDI2Ny41TDIxMCAyNjdWMjE4LjVMMjQwIDIwN1YxNjhMMjkzLjUgMTIwLjVMMjkyLjUgMjg3SDMwMFYxNDcuNUwzMzAgMTczLjVWMjA5TDM0MiAyMTNWMjY3SDQ0MUwzMjUgMTYxLjVMNDQ3IDUwSDM1MC41WiIgZmlsbD0iI0Q5RDlEOSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KPHBhdGggZD0iTTIxNy41IDE1MkwyNjUuNSAxMDYuNUwyMDEgNTAuNUgxMDVMMjE3LjUgMTUyWiIgZmlsbD0iI0Q5RDlEOSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KPHBhdGggZD0iTTM3NC41IDQ3Ni41TDM3MCA0ODcuNUMzNzAuOCA0ODkuOSAzNzIuNDgzIDQ4OC41IDM3My4yMjUgNDg3LjVMMzc4IDQ3Ni41QzM3Ny4yIDQ3NC4xIDM3NS4zMzMgNDc1LjUgMzc0LjUgNDc2LjVaIiBmaWxsPSIjRDlEOUQ5IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMTc3LjUgNDc2LjVMMTgyIDQ4Ny41QzE4MS4yIDQ4OS45IDE3OS41MTcgNDg4LjUgMTc4Ljc3NSA0ODcuNUwxNzQgNDc2LjVDMTc0LjggNDc0LjEgMTc2LjY2NyA0NzUuNSAxNzcuNSA0NzYuNVoiIGZpbGw9IiNEOUQ5RDkiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMC44Ii8+CjxwYXRoIGQ9Ik0yNzYgNTA1LjVDMjc4LjUgNTAyLjgzMyAyODIuMDUzIDQ5Ni41IDI3NiA0OTYuNUMyNzAgNDk2LjUgMjczLjUgNTAyLjE2NyAyNzYgNTA1LjVaIiBmaWxsPSIjMEM0NjkwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMzI5IDQ4NUwzNTUuNSA0NjUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMC44Ii8+CjxwYXRoIGQ9Ik0yOTggNDg5TDMxNyA0NjYuNSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KPHBhdGggZD0iTTI1My41IDQ4OUwyMzYgNDY3IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMjI0IDQ4NS41TDE5OCA0NjUuNSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KPHBhdGggZD0iTTIyMC4wMDIgNTExLjVDMTgwLjAwMiA1MDYgMTcwIDUwMSAxNjggNTI4QzE2OCA1MzEuNSAxODkuMTY5IDUzMS41IDE5OC4wMDIgNTMyTDIyMC4wMDIgNTExLjVaIiBmaWxsPSIjMEM0NjkwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMzMyIDUxMS41QzM3MiA1MDYgMzgyLjAwMiA1MDEgMzg0LjAwMiA1MjhDMzg0LjAwMiA1MzEuNSAzNjIuODMzIDUzMS41IDM1NCA1MzJMMzMyIDUxMS41WiIgZmlsbD0iIzBDNDY5MCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KPHBhdGggZD0iTTIxNCA1MjkuNUMyMTIuNCA1MjkuNSAyMDkuMzMzIDUzNC41IDIwOCA1MzdDMjA5IDUzMiAyMTguMTY3IDUyMS4zMzMgMjIzLjUgNTE2LjVDMjI1LjUgNTE0LjkgMjI2IDUxMy41IDIyMy41IDUxMS41QzIyNy45IDUxMS41IDI5MyA1MTQgMzI4LjUgNTExLjVMMzI3LjUgNTE1LjVDMzMwLjMgNTE1LjkgMzQzIDUzMS41IDM0My41IDUzN0MzNDMgNTM0LjUgMzM5LjUgNTMwLjE2NyAzMzcuNSA1MjkuNUMzMzUuNSA1MjguODMzIDMzMC4zMzMgNTMzLjMzMyAzMjcuNSA1MzUuNUMzMjUuOSA1MzcuMSAyNTcgNTM4IDIyMy41IDUzNS41QzIyMSA1MzMuNSAyMTUuNiA1MjkuNSAyMTQgNTI5LjVaIiBmaWxsPSIjMEM0NjkwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8L3N2Zz4K",
    //   "SVG",
    //   15,
    //   10,
    //   20,
    //   20
    // ); // Adjust size/position as needed

    // Add company name
    // doc.setFont("helvetica", "bold");
    // doc.setFontSize(14);
    // doc.text("DriveX Firm", 40, 22); // Adjust position to align with logo

    // Add Invoice title
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text("Invoice", 105, 40, { align: "center" });

    // Data fields
    doc.setFontSize(12);
    const startY = 60;
    const lineHeight = 10;
    const data = [
      ["Invoice ID", row?.invoiceId],
      [
        "Username",
        row?.users?.full_name ||
          row?.users?.display_name ||
          row?.users?.email ||
          " ",
      ],
      ["Date", row?.dateOfSale],
      ["Car Modal", row?.carModel],
      ["Amount", Number(row?.saleAmount || 0)?.toLocaleString()],
      ["Commission", row?.commission],
      [
        "Commission Amount",
        Number(row?.commission_amount || 0)?.toLocaleString(),
      ],
      ["Status", row?.status],
      ["Vin Number", row?.vinNumber],
    ];

    data.forEach(([label, value], i) => {
      doc.text(`${label}:`, 20, startY + i * lineHeight);
      doc.text(`${value || "-"}`, 70, startY + i * lineHeight);
    });

    doc.save("invoice.pdf");
  };

  const handleDownload = async (row: any) => {
    const doc = new jsPDF();

    // Your SVG base64
    const svgBase64 =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTU3IiBoZWlnaHQ9IjcwMSIgdmlld0JveD0iMCAwIDU1NyA3MDEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDQwQzAgMTcuOTA4NiAxNy45MDg2IDAgNDAgMEg1MTdDNTM5LjA5MSAwIDU1NyAxNy45MDg2IDU1NyA0MFY1MjcuMTkzQzU1NyA1NDEuODYzIDU0OC45NjkgNTU1LjM1NyA1MzYuMDc0IDU2Mi4zNTJMMjk5LjQzOCA2OTAuNzI2QzI4Ny42MTYgNjk3LjE0IDI3My4zNjIgNjk3LjE4MyAyNjEuNTAxIDY5MC44NEwyMS4xMzczIDU2Mi4zMDNDOC4xMjQ1IDU1NS4zNDUgMCA1NDEuNzg3IDAgNTI3LjAzVjQwWiIgZmlsbD0iIzBDNDY5MCIvPgo8cGF0aCBkPSJNNTAgMTdINTA3QzUyNi44ODIgMTcgNTQzIDMzLjExNzggNTQzIDUzVjUxOS43NDJDNTQzIDUzMi45NTIgNTM1Ljc2NSA1NDUuMTAxIDUyNC4xNSA1NTEuMzk1TDI5Ny40NDIgNjc0LjIzMUMyODYuODExIDY3OS45OTIgMjczLjk5OCA2ODAuMDMxIDI2My4zMzIgNjc0LjMzNEwzMy4wNCA1NTEuMzM0QzIxLjMxOTYgNTQ1LjA3NCAxNC4wMDAxIDUzMi44NjcgMTQgNTE5LjU4VjUzTDE0LjAxMTcgNTIuMDcxM0MxNC41MDQzIDMyLjYxODMgMzAuNDI4MyAxNyA1MCAxN1oiIHN0cm9rZT0iI0NFQ0RENSIgc3Ryb2tlLXdpZHRoPSI4Ii8+CjxwYXRoIGQ9Ik0xNzguNSA0NTkuNUMxNjMuNSA0NjEuNSAxNTggNDcwLjUgMTU4IDQ3OEwxNjAuNSA1MzFDMTYwLjkgNTM5LjggMTYxLjUgNTQyLjUgMTc0IDU0My41TDIwNyA1NDQuNUwyMTIgNTQyLjVIMzQwTDM0NC41IDU0My41QzM1NCA1NDQgMzc0LjQgNTQ0LjcgMzgwIDU0My41QzM4NS42IDU0Mi4zIDM4OC42NjcgNTQwIDM4OS41IDUzOUMzOTEuNSA1MzQuMiAzOTQgNDk1IDM5Mi41IDQ3MS41QzM4OSA0NjQgMzgwIDQ2MS41IDM3NC41IDQ2MEMzNzAuMSA0NTguOCAzNjAuMzMzIDQ1OS44MzMgMzU2IDQ2MC41QzM0OC44IDQ2Mi41IDIxNi41IDQ2NSAxOTEgNDU5LjVIMTc4LjVaIiBmaWxsPSIjRDlEOUQ5IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMzc2LjUgNDY5TDM0MCA0OTdDMzQ1LjIgNDk4LjIgMzYzIDQ5NC41IDM3MiA0OTJDMzgxLjYgNDg4IDM4My41IDQ3Ni41IDM4NSA0NjlIMzc2LjVaIiBmaWxsPSIjMEM0NjkwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMTc1LjUgNDY5TDIxMiA0OTdDMjA2LjggNDk4LjIgMTg5IDQ5NC41IDE4MCA0OTJDMTcwLjQgNDg4IDE2OC41IDQ3Ni41IDE2NyA0NjlIMTc1LjVaIiBmaWxsPSIjMEM0NjkwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMzY2LjUgNDU4TDM3MyA0NDMuNUMzNzkuMzMzIDQ0My42NjcgMzkyLjUgNDQ1LjIgMzk0LjUgNDUwQzM5Ni41IDQ1NC44IDM3Ni42NjcgNDU3LjMzMyAzNjYuNSA0NThaIiBmaWxsPSIjRDlEOUQ5IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMTg2IDQ1Ny41TDE3OCA0NDMuNUMxNjkuNjY3IDQ0Mi4zMzMgMTU1LjUgNDQ1IDE1Ni41IDQ0OS41QzE1OC4yNTggNDU3LjQwNiAxNzcuMzM0IDQ1OCAxODYgNDU3LjVaIiBmaWxsPSIjRDlEOUQ5IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMTk4IDQ1OUMxOTMuNiA0NTYuNiAxOTcuNSA0NDkuNjY3IDIwMCA0NDYuNUMyMDQuNSA0NDAuOCAyMTAuNSA0MjUuNSAyNDcgNDI0LjVIMzAzQzMwOC41IDQyNC44MzMgMzIyIDQyNi4yIDMzMiA0MjlDMzQyIDQzMS44IDM1MS41IDQ0Ni4xNjcgMzU1IDQ1M0MzNTYuNiA0NTYuNiAzNTQuMzMzIDQ1OC41IDM1MyA0NTlDMzUwLjgzMyA0NTIuNSAzNDMuNSA0NDAgMzM1IDQzNUMzMjYuNDg1IDQyOS45OTEgMzA5LjgzMyA0MzAuNSAzMDMgNDMwLjVIMjQ3QzIyNi4yIDQzMC41IDIxOC42NjcgNDMzLjE2NyAyMTcuNSA0MzQuNUMyMDkuMSA0MzguOSAyMDEgNDUyLjY2NyAxOTggNDU5WiIgZmlsbD0iI0Q5RDlEOSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KPHBhdGggZD0iTTQ0NiAzMTUuNUw0MzMgMzM3LjVMNDIwLjUgMzE1LjVINDAwLjVMNDIyLjUgMzUyTDM5OC41IDM4OS41SDQxNy41TDQzMyAzNjUuNUw0NDYgMzg5LjVINDY2LjVMNDQyLjUgMzUyTDQ2NCAzMTUuNUg0NDZaIiBmaWxsPSIjRDlEOUQ5IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMzcwLjUgMzE1SDMyMlYzOTAuNUgzNzAuNVYzNzcuNUgzMzhWMzYwLjVIMzY0VjM0Ni41SDMzOFYzMzBIMzcwLjVWMzE1WiIgZmlsbD0iI0Q5RDlEOSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KPHBhdGggZD0iTTI2NS41IDMxNS41SDI0OUwyNzIgMzkwLjVIMjkwLjVMMzE0LjUgMzE1LjVIMjk3TDI4MSAzNjhMMjY1LjUgMzE1LjVaIiBmaWxsPSIjRDlEOUQ5IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMjQxLjUgMzE1SDIyNVYzOTFIMjQxLjVWMzE1WiIgZmlsbD0iI0Q5RDlEOSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KPHBhdGggZD0iTTE1OCAzOTEuNUgxNzQuNVYzNjMuNUgxODQuNUwxOTggMzkxLjVIMjE2LjVMMjAwLjUgMzYxQzIyMS41IDM1MCAyMTguNSAzMTYgMTg3IDMxNkgxNThWMzkxLjVaIiBmaWxsPSIjRDlEOUQ5IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMTc0IDM0OS41VjMyOEgxODYuNUMyMDEuNSAzMzIgMTk2LjUgMzQ3IDE4Ni41IDM0OS41SDE3NFoiIGZpbGw9IiMwQzQ2OTAiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMC44Ii8+CjxwYXRoIGQ9Ik05MCAzOTAuOTQyVjMxNi40NDJDMTAyLjggMzE1LjY0MiAxMTUuMzMzIDMxNi4xMDggMTIwIDMxNi40NDJDMTMxIDMxOC41IDEzNyAzMjIuMjQyIDE0MSAzMjcuNDQyQzE0NiAzMzMuOTQyIDE0NiAzMzcuOTQyIDE0Ni41IDM1NC40NDJDMTQ2LjkgMzY3LjY0MiAxNDMuNjY3IDM3NS42MDggMTQyIDM3Ny45NDJDMTM0LjggMzg5LjU0MiAxMjIuMzMzIDM5MS40NDIgMTE3IDM5MC45NDJIOTBaIiBmaWxsPSIjRDlEOUQ5IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMTA0IDM3OS45NTFWMzI5LjNDMTEwLjU2NiAzMjguNzU2IDExNi45OTUgMzI5LjA3NCAxMTkuMzg5IDMyOS4zQzEyNS4wMzIgMzMwLjcgMTI4LjEwOSAzMzMuMjQ0IDEzMC4xNjEgMzM2Ljc3OUMxMzIuNzI2IDM0MS4xOTggMTMyLjcyNiAzNDMuOTE4IDEzMi45ODMgMzU1LjEzNkMxMzMuMTg4IDM2NC4xMSAxMzEuNTI5IDM2OS41MjcgMTMwLjY3NCAzNzEuMTEzQzEyNi45ODEgMzc5IDEyMC41ODYgMzgwLjI5MSAxMTcuODUgMzc5Ljk1MUgxMDRaIiBmaWxsPSIjMEM0NjkwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMzA4IDIxOC41VjIxMEwzMjkuNSAyMTZWMjIzTDMwOCAyMTguNVoiIGZpbGw9IiNEOUQ5RDkiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMC44Ii8+CjxwYXRoIGQ9Ik0zMDggMjM0LjVWMjI2TDMyOS41IDIzMlYyMzlMMzA4IDIzNC41WiIgZmlsbD0iI0Q5RDlEOSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KPHBhdGggZD0iTTMwOCAyNTAuNVYyNDJMMzI5LjUgMjQ4VjI1NUwzMDggMjUwLjVaIiBmaWxsPSIjRDlEOUQ5IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMzA4IDI2Ni41VjI1OEwzMjkuNSAyNjRWMjcxTDMwOCAyNjYuNVoiIGZpbGw9IiNEOUQ5RDkiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMC44Ii8+CjxwYXRoIGQ9Ik0yNjEgMTY0LjVMMjUwLjUgMTczLjVWMjg3LjVIMjYxVjE2NC41WiIgZmlsbD0iI0Q5RDlEOSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KPHBhdGggZD0iTTI3OCAxNTFMMjY4IDE1OS41VjI4Ny41SDI3OFYxNTFaIiBmaWxsPSIjRDlEOUQ5IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMjM0LjUgMjg3LjVWMjE4TDI0MS41IDIxNVYyODcuNUgyMzQuNVoiIGZpbGw9IiNEOUQ5RDkiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMC44Ii8+CjxwYXRoIGQ9Ik0zNTAuNSA1MEwxMTAgMjY2LjVMMTA5IDI2Ny41TDIxMCAyNjdWMjE4LjVMMjQwIDIwN1YxNjhMMjkzLjUgMTIwLjVMMjkyLjUgMjg3SDMwMFYxNDcuNUwzMzAgMTczLjVWMjA5TDM0MiAyMTNWMjY3SDQ0MUwzMjUgMTYxLjVMNDQ3IDUwSDM1MC41WiIgZmlsbD0iI0Q5RDlEOSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KPHBhdGggZD0iTTIxNy41IDE1MkwyNjUuNSAxMDYuNUwyMDEgNTAuNUgxMDVMMjE3LjUgMTUyWiIgZmlsbD0iI0Q5RDlEOSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KPHBhdGggZD0iTTM3NC41IDQ3Ni41TDM3MCA0ODcuNUMzNzAuOCA0ODkuOSAzNzIuNDgzIDQ4OC41IDM3My4yMjUgNDg3LjVMMzc4IDQ3Ni41QzM3Ny4yIDQ3NC4xIDM3NS4zMzMgNDc1LjUgMzc0LjUgNDc2LjVaIiBmaWxsPSIjRDlEOUQ5IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMTc3LjUgNDc2LjVMMTgyIDQ4Ny41QzE4MS4yIDQ4OS45IDE3OS41MTcgNDg4LjUgMTc4Ljc3NSA0ODcuNUwxNzQgNDc2LjVDMTc0LjggNDc0LjEgMTc2LjY2NyA0NzUuNSAxNzcuNSA0NzYuNVoiIGZpbGw9IiNEOUQ5RDkiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMC44Ii8+CjxwYXRoIGQ9Ik0yNzYgNTA1LjVDMjc4LjUgNTAyLjgzMyAyODIuMDUzIDQ5Ni41IDI3NiA0OTYuNUMyNzAgNDk2LjUgMjczLjUgNTAyLjE2NyAyNzYgNTA1LjVaIiBmaWxsPSIjMEM0NjkwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMzI5IDQ4NUwzNTUuNSA0NjUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMC44Ii8+CjxwYXRoIGQ9Ik0yOTggNDg5TDMxNyA0NjYuNSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KPHBhdGggZD0iTTI1My41IDQ4OUwyMzYgNDY3IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMjI0IDQ4NS41TDE5OCA0NjUuNSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KPHBhdGggZD0iTTIyMC4wMDIgNTExLjVDMTgwLjAwMiA1MDYgMTcwIDUwMSAxNjggNTI4QzE2OCA1MzEuNSAxODkuMTY5IDUzMS41IDE5OC4wMDIgNTMyTDIyMC4wMDIgNTExLjVaIiBmaWxsPSIjMEM0NjkwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cGF0aCBkPSJNMzMyIDUxMS41QzM3MiA1MDYgMzgyLjAwMiA1MDEgMzg0LjAwMiA1MjhDMzg0LjAwMiA1MzEuNSAzNjIuODMzIDUzMS41IDM1NCA1MzJMMzMyIDUxMS41WiIgZmlsbD0iIzBDNDY5MCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KPHBhdGggZD0iTTIxNCA1MjkuNUMyMTIuNCA1MjkuNSAyMDkuMzMzIDUzNC41IDIwOCA1MzdDMjA5IDUzMiAyMTguMTY3IDUyMS4zMzMgMjIzLjUgNTE2LjVDMjI1LjUgNTE0LjkgMjI2IDUxMy41IDIyMy41IDUxMS41QzIyNy45IDUxMS41IDI5MyA1MTQgMzI4LjUgNTExLjVMMzI3LjUgNTE1LjVDMzMwLjMgNTE1LjkgMzQzIDUzMS41IDM0My41IDUzN0MzNDMgNTM0LjUgMzM5LjUgNTMwLjE2NyAzMzcuNSA1MjkuNUMzMzUuNSA1MjguODMzIDMzMC4zMzMgNTMzLjMzMyAzMjcuNSA1MzUuNUMzMjUuOSA1MzcuMSAyNTcgNTM4IDIyMy41IDUzNS41QzIyMSA1MzMuNSAyMTUuNiA1MjkuNSAyMTQgNTI5LjVaIiBmaWxsPSIjMEM0NjkwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8L3N2Zz4K"; // (truncated for clarity)

    // Convert SVG to PNG
    const convertSvgToPng = async (svgUrl: string) => {
      return new Promise<string>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = 100;
          canvas.height = 100;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/png"));
          }
        };
        img.src = svgUrl;
      });
    };

    const pngBase64 = await convertSvgToPng(svgBase64);

    const pageWidth = doc.internal.pageSize.getWidth();
    const labelX = 20;
    const valueX = 100;
    const maxWidth = pageWidth - valueX - 20;
    const lineHeight = 10;

    // Draw centered logo
    const logoWidth = 30;
    const logoX = (pageWidth - logoWidth) / 2;
    doc.addImage(pngBase64, "PNG", logoX, 10, logoWidth, 30);

    // DriveX Firm name centered below logo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("DriveX Firm", pageWidth / 2, 45, { align: "center" });

    // Invoice title centered
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text("Invoice", pageWidth / 2, 60, { align: "center" });

    // Data rows
    const data = [
      ["Invoice ID", row?.invoiceId],
      [
        "Username",
        row?.users?.full_name ||
          row?.users?.display_name ||
          row?.users?.email ||
          " ",
      ],
      ["Date", row?.dateOfSale],
      ["Car Modal", row?.carModel],
      ["Amount", Number(row?.saleAmount || 0)?.toLocaleString()],
      ["Commission", row?.commission],
      [
        "Commission Amount",
        Number(row?.commission_amount || 0)?.toLocaleString(),
      ],
      ["Company Name", row?.companyName || 0],
      ["HST", row?.hst || 0],
      ["Status", row?.status],
      ["Vin Number", row?.vinNumber],
    ];

    let currentY = 75; // Start below title

    data.forEach(([label, value]) => {
      const displayValue = `${value || "-"}`;
      const wrappedValue = doc.splitTextToSize(displayValue, maxWidth);

      // Label
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, labelX, currentY);

      // Value (wrapped)
      doc.setFont("helvetica", "normal");
      doc.text(wrappedValue, valueX, currentY);

      // Move Y down based on line count
      currentY += wrappedValue.length * lineHeight;
    });

    // Save the PDF
    doc.save("invoice.pdf");
  };

  const handleFilterChange = (setter: any, value: any) => {
    setter(value);
    setPage(1); // reset page on filter
  };

  return (
    <>
      <main className="flex-1 p-6">
        <section className="bg-white rounded-lg border border-gray-200 p-6 overflow-x-auto lg:w-[100%] w-[320px]">
          {/* Filter Form */}
          <form
            role="search"
            aria-label="Invoice search and filters"
            className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-4 mb-6"
          >
            <div className="flex items-center border border-gray-200 rounded-md px-3 py-2 w-full sm:w-72 text-gray-400">
              <Search className="w-4 h-4 mr-2" />
              <input
                type="search"
                id="search"
                name="search"
                value={search}
                onChange={(e) => handleFilterChange(setSearch, e.target.value)}
                placeholder="Search"
                className="w-full text-sm text-gray-500 placeholder-gray-400 focus:outline-none"
              />
            </div>

            <div className="relative w-full sm:w-40">
              <select
                id="status"
                name="status"
                value={status}
                onChange={(e) => handleFilterChange(setStatus, e.target.value)}
                className="border border-gray-200 rounded-md py-2 px-4 pr-10 text-sm text-gray-700 w-full cursor-pointer appearance-none"
              >
                <option value="all">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center gap-2 border border-gray-200 rounded-md py-2 px-3 text-sm text-gray-700 bg-white w-full sm:w-auto">
                <Calendar size={16} className="text-gray-400" />
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    setPage(1); // reset pagination if needed
                  }}
                  placeholderText="Choose Date"
                  dateFormat="MMM d, yyyy"
                  className="outline-none bg-transparent w-full"
                />
              </div>
            </div>
          </form>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-gray-100 animate-pulse rounded-md"
                  ></div>
                ))}
              </div>
            ) : dataInvoice.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                No invoices found.
              </div>
            ) : (
              <table className="w-full text-left text-sm text-gray-700 border border-gray-200 rounded-md">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {[
                      "Invoice ID",
                      "Username",
                      "Car Model",
                      "Date",
                      "Amount(CAD)",
                      "Commission",
                      "Vin number",
                      "Company Name",
                      "HST",
                      "Status",
                      "Actions",
                    ].map((heading) => (
                      <th key={heading} className="py-3 px-4 font-semibold">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataInvoice.map((row) => (
                    <tr key={row?.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">{row?.invoiceId}</td>
                      <td className="py-3 px-4">
                        {row?.users?.full_name ||
                          row?.users?.display_name ||
                          row?.users?.email ||
                          " "}
                      </td>
                      <td className="py-3 px-4">{row?.carModel}</td>
                      <td className="py-3 px-4">{row?.dateOfSale}</td>
                      <td className="py-3 px-4">
                        {Number(row?.saleAmount || 0)?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">{row?.commission}%</td>
                      <td className="py-3 px-4">{row?.vinNumber}</td>
                      <td className="py-3 px-4">{row?.companyName}</td>
                      <td className="py-3 px-4">{row?.hst}</td>
                      <td className="py-3 px-4">{row?.status}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            disabled={loading}
                            onClick={() => {
                              setSelectedData(row);
                              setIsOpen(true);
                            }}
                            className="cursor-pointer p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
                          >
                            <Info className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDownload(row)}
                            className="cursor-pointer bg-[#D9E8FF] text-[#3B82F6] rounded-md p-2 hover:bg-[#c3d9ff] flex items-center gap-1 font-semibold"
                          >
                            <FileText className="w-4 h-4" />
                            PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="mt-auto">
            <PaginationBar
              page={page}
              setPage={setPage}
              totalPage={totalPages}
              totalRecord={total}
              limit={limit}
              setLimit={setLimit}
            />
          </div>
        </section>
      </main>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="mt-5 mb-5 max-w-md mx-auto p-6 bg-white shadow-md rounded-xl">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Invoice Summary
          </h2>
          <div className="text-sm text-gray-700 space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Invoice :</span>
              <span>{selectedData?.invoiceId || ""}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Selected Sales :</span>
              <span>
                {selectedData?.users?.full_name ||
                  selectedData?.users?.display_name ||
                  selectedData?.users?.email ||
                  ""}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date of sale:</span>
              <span>{selectedData?.dateOfSale || ""}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Car:</span>
              <span>{selectedData?.carModel || ""}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Sale Amount (CAD):</span>
              <span>{selectedData?.saleAmount || ""}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Commission:</span>
              <span>{selectedData?.commission || ""} %</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Vin number :</span>
              <span className="flex items-center gap-1">
                {selectedData?.vinNumber || ""}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Company Name:</span>
              <span className="flex items-center gap-1">
                {selectedData?.companyName || ""}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">HST :</span>
              <span className="flex items-center gap-1">
                {selectedData?.hst || ""}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Status :</span>
              <span className="flex items-center gap-1">
                {selectedData?.status || ""}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Commission Amount(CAD) </span>
              <span>{selectedData?.commission_amount || ""}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Uploaded File</span>
              <span>
                {" "}
                <a
                  href={selectedData?.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-sm text-blue-600 underline break-words max-w-full"
                >
                  📎 File
                </a>
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
