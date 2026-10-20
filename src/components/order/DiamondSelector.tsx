"use client";

import { useMemo, useState } from "react";
import { faCoins, faCheck, faTicket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { formatRupiah, getImageUrl } from "@/lib/helper";

function denomIconUrl(icon: string | null | undefined): string {
  if (!icon) return "/images/diamond.png";
  return getImageUrl(icon, "product");
}

function getDenomImage(item: any, productIcon: string | null | undefined): string {
  return item?.icon ?? item?.pricelist?.icon ?? productIcon ?? null;
}

type TabId = string;

interface DiamondSelectorProps {
  selectedPrice: any;
  onChange: (item: any) => void;
  denoms: any[];
  icon: string | null | undefined;
}

export const DiamondSelector = ({
  selectedPrice,
  onChange,
  denoms = [],
  icon,
}: DiamondSelectorProps) => {
  const tabs = useMemo(() => {
    const allTab = { id: "__all__" as TabId, name: "Semua", icon };
    const seen = new Map<string, { id: TabId; name: string; icon: string | null }>();
    for (const d of denoms) {
      const p = d.pricelist;
      if (p?.name && !seen.has(p.name)) {
        seen.set(p.name, { id: p.name, name: p.name, icon: p.icon ?? null });
      }
    }
    return [allTab, ...Array.from(seen.values())];
  }, [denoms, icon]);

  const [activeTab, setActiveTab] = useState<TabId>("__all__");

  const filteredDenoms = useMemo(() => {
    if (activeTab === "__all__") return denoms;
    return denoms.filter((d) => d.pricelist?.name === activeTab);
  }, [denoms, activeTab]);

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-950 px-4 py-4 text-white">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white">
          <FontAwesomeIcon icon={faCoins} className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-sky-300">Langkah 01</p>
          <span className="font-display text-lg font-semibold">Pilih Nominal</span>
        </div>
      </div>
      {tabs.length > 1 && (
        <div className="flex gap-1.5 p-3 overflow-x-auto border-b border-gray-100 bg-gray-50/50">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${isActive
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
              >
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg overflow-hidden ${isActive ? "bg-white/20" : "bg-gray-100"}`}>
                  <Image
                    src={denomIconUrl(tab.icon)}
                    alt={tab.name}
                    width={28}
                    height={28}
                    className="h-full w-full object-contain"
                    unoptimized={!!tab.icon}
                  />
                </span>
                <span className="truncate max-w-[100px]">{tab.name}</span>
              </button>
            );
          })}
        </div>
      )}
      <div className="p-4 md:p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {filteredDenoms.map((item, i) => {
          const isSelected = selectedPrice?.id === item.id;
          return (
            <button
              key={item.id ?? i}
              type="button"
              onClick={() => onChange(item)}
              className={`relative flex items-center gap-3 rounded-xl border-2 p-3 md:p-4 text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 ${isSelected
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/10 scale-[1.02]"
                  : "border-gray-200 bg-gray-50/50 hover:border-primary/50 hover:bg-primary/5 hover:shadow-md"
                }`}
            >
              {isSelected && (
                <span className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                  <FontAwesomeIcon icon={faCheck} className="h-3 w-3" />
                </span>
              )}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100 md:h-14 md:w-14">
                <Image
                  src={denomIconUrl(icon || item.icon)}
                  alt={item.name || "Nominal"}
                  width={56}
                  height={56}
                  className="h-full w-full object-contain"
                  unoptimized={!!(item?.icon ?? item?.pricelist?.icon)}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-800 text-xs md:text-base truncate">
                  {item.name}
                </p>
                <p className={`text-xs md:text-sm font-medium mt-0.5 ${isSelected ? "text-primary" : "text-gray-600"}`}>
                  {formatRupiah(item.price)}
                </p>
                {item.voucher_count != null && item.voucher_count > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="inline-flex items-center gap-0.5 text-[10px] md:text-xs px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">
                      <FontAwesomeIcon icon={faTicket} className="h-2.5 w-2.5" />
                      {item.voucher_count} voucher
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
        </div>
      </div>
    </div>
  );
};
