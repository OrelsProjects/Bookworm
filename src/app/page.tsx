"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectAuth } from "../lib/features/auth/authSlice";

function App() {
  const router = useRouter();
  const [shouldShowError, setShouldShowError] = React.useState(false);
  const { user, loading, error } = useSelector(selectAuth);

  useEffect(() => {
    if (!loading && user) {
      router.push("/home");
    }
  }, [loading, user]);

  // Sometimes the redirect of google returns with an error and 300ms later it returns with the user
  // So if error is not null, we wait 1s to present error.
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (error) {
      timeout = setTimeout(() => {
        setShouldShowError(true);
      }, 1000);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  });

  return (
    <div className="flex flex-col justify-center items-center ">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>{shouldShowError && <div>{error}</div>}</>
      )}
    </div>
  );
}

export default App;
