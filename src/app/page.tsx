"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectAuth } from "../lib/features/auth/authSlice";
import { Loading } from "../components";

function App() {
  const router = useRouter();
  const [shouldShowError, setShouldShowError] = React.useState(false);
  const { user, loadingState, error } = useSelector(selectAuth);

  useEffect(() => {
    if (!loadingState.loading) {
      router.push("/mobile");
    }
  }, [loadingState, user]);

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
    <div className="h-full w-full flex flex-col justify-center items-center ">
      {loadingState.loading && (
        <Loading spinnerClassName="!w-24 !h-24 !fill-primary" />
      )}
    </div>
  );
}

export default App;
