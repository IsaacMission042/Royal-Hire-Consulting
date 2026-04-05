"use client";

import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export default function Counter({ n, suffix = "" }: { n: number; suffix?: string }) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const [displayValue, setDisplayValue] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (!isInView) return;

        const controls = animate(count, n, { duration: 2 });
        
        // Subscribe to changes to ensure UI updates during animation
        const unsubscribe = rounded.on("change", (latest) => {
            setDisplayValue(latest);
        });

        return () => {
            controls.stop();
            unsubscribe();
        };
    }, [n, count, rounded, isInView]);

    return (
        <span ref={ref}>
            {displayValue}
            {suffix}
        </span>
    );
}
