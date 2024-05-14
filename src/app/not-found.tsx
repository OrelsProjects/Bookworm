'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const NotFound = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      router.push('/explore');
    }
  }, [router]);

  return null;
};

export default NotFound;
