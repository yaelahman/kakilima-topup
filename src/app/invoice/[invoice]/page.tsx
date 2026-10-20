"use client";

import { Invoice } from "@/components/invoice";
import { getInvoice } from "@/services/order.service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";

export default function InvoicePage() {
  const params = useParams();
  const invoice = typeof params?.invoice === "string" ? params.invoice : null;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["invoice", invoice],
    queryFn: () => getInvoice(invoice!),
    enabled: !!invoice,
    refetchInterval: (query) =>
      query.state.data?.success && query.state.data?.data?.status === 0 ? 10_000 : false,
  });

  if (!invoice) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-gray-600">Memuat invoice...</p>
        </div>
      </div>
    );
  }

  if (isError || !data?.success) {
    notFound();
  }

  return (
    <Invoice transaction={data.data} statusMeta={data.status} />
  );
}
