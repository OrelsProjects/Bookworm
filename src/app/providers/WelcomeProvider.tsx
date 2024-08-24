"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../lib/hooks";
import { AuthStateType, selectAuth } from "../../lib/features/auth/authSlice";
import { IoClose } from "react-icons/io5";
import { Button } from "../../components/ui/button";
import { useRouter } from "next/navigation";

const TIME_TO_WAIT_TO_SHOW_WELCOME = 20000;

export default function WelcomeProvider() {
  const router = useRouter();
  const { state } = useAppSelector(selectAuth);
  const [showWelcome, setShowWelcome] = useState(false);
  const [hideWelcome, setHideWelcome] = useState(false);

  useEffect(() => {
    const shouldShowWelcome =
      state !== AuthStateType.SIGNED_IN ||
      localStorage.getItem("shouldShowWelcome") !== "false";
    if (!shouldShowWelcome) {
      return;
    }
    const timer = setTimeout(() => {
      setShowWelcome(true);
      localStorage.setItem("shouldShowWelcome", "false");
    }, TIME_TO_WAIT_TO_SHOW_WELCOME);

    return () => clearTimeout(timer);
  }, [state, showWelcome]);

  return (
    <AnimatePresence>
      {showWelcome && !hideWelcome && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.5 }}
          key="welcome"
          className="absolute bottom-0 h-36 md:h-30 w-full flex justify-center z-[999999] md:pr-0"
        >
          {!hideWelcome && (
            <motion.div className="h-full content-size flex flex-col gap-4 bg-card border-[2px] border-card-foreground rounded-t-lg p-2 relative pt-4 md:pt-2">
              <div className="text-white text-lg font-bold hidden md:flex">
                Join hundreds of readers to manage your backlog, get
                personalized recommendations and create your own books lists!
              </div>
              <div className="text-white text-base font-semibold mt-0 pr-4 md:hidden">
                Manage your books log and get personalized book recommendations!
              </div>
              <IoClose
                className="text-white text-2xl absolute top-2 right-2 cursor-pointer"
                onClick={() => setHideWelcome(true)}
              />
              <Button
                className="w-1/2 md:w-1/4 self-center text-lg md:text-xl text-primary-foreground"
                onClick={() => router.push("/login")}
              >
                Join now!
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
