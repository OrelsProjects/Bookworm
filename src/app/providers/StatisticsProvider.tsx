"use client";

import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

export default function StatisticsProvider() {
    const pathname = usePathname();
    useEffect(() => {
    }, [pathname]);
}