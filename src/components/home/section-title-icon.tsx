"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { motion } from "framer-motion";

const floatTransition = {
    repeat: Infinity,
    repeatType: "reverse" as const,
    duration: 2,
    ease: "easeInOut",
};

interface SectionTitleWithIconProps {
    icon: IconDefinition;
    children: React.ReactNode;
    className?: string;
}

/** Animated icon before section label (e.g. Produk Terbaru, Game Populer). */
export function SectionTitleWithIcon({ icon, children, className = "" }: SectionTitleWithIconProps) {
    return (
        <span className={`inline-flex items-center gap-2 ${className}`}>
            <FontAwesomeIcon icon={icon} className="h-4 w-4 md:h-[1.1rem] md:w-[1.1rem]" />
            {children}
        </span>
    );
}
