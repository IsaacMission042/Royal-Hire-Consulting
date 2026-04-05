"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

export default function Counter({ n, suffix = "" }: { n: number; suffix?: string }) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const controls = animate(count, n, { duration: 2 });
        
        // Subscribe to changes to ensure UI updates during animation
        const unsubscribe = rounded.on("change", (latest) => {
            setDisplayValue(latest);
        });

        return () => {
            controls.stop();
            unsubscribe();
        };
    }, [n, count, rounded]);

    return (
        <span>
            {displayValue}
            {suffix}
        </span>
    );
}
