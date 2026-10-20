"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBullhorn } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getHomepagePopup } from "@/services/homepage.service";

const STORAGE_KEY_PREFIX = "popup_dismiss_";

function getTodayKey(): string {
  if (typeof window === "undefined") return "";
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function wasDismissedToday(popupId: number): boolean {
  if (typeof window === "undefined") return false;
  const key = `${STORAGE_KEY_PREFIX}${popupId}`;
  const stored = localStorage.getItem(key);
  const today = getTodayKey();
  return stored === today;
}

function dismissForToday(popupId: number): void {
  if (typeof window === "undefined") return;
  const key = `${STORAGE_KEY_PREFIX}${popupId}`;
  localStorage.setItem(key, getTodayKey());
}

export type PopupNotificationData = {
  id: number;
  title: string;
  content: string | null;
  image: string | null;
  expired_at: string | null;
} | null;

export function NotificationPopup() {
  const { data } = useQuery({
    queryKey: ["homepage", "popup"],
    queryFn: () => getHomepagePopup(),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  const popup = (data?.popup_notification ?? null) as PopupNotificationData;
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !popup) return;
    if (wasDismissedToday(popup.id)) return;
    setOpen(true);
  }, [mounted, popup]);

  const handleClose = () => setOpen(false);

  const handleDismissToday = () => {
    if (popup) dismissForToday(popup.id);
    setOpen(false);
  };

  if (!popup) return null;

  const imageUrl = popup.image || null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: "20px" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: "20px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-white rounded-t-2xl md:rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 p-4 md:p-5 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faBullhorn} className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 truncate">
                  {popup.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="flex-shrink-0 p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-200/80 transition-colors"
                aria-label="Tutup"
              >
                <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 p-4 md:p-5">
              {imageUrl && (
                <div className="mb-4 rounded-xl overflow-hidden ring-1 ring-gray-100">
                  <Image
                    src={imageUrl}
                    alt={popup.title}
                    width={600}
                    height={300}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
              {popup.content && (
                <div
                  className="text-gray-600 text-[15px] leading-relaxed [&_br]:block [&_br]:h-2"
                  dangerouslySetInnerHTML={{ __html: popup.content.replace(/\n/g, "<br />") }}
                />
              )}
            </div>

            {/* Footer */}
            <div className="p-4 md:p-5 pt-0 flex flex-col gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors duration-300 shadow-sm"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleDismissToday}
                className="w-full py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-300"
              >
                Jangan tampilkan lagi hari ini
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
