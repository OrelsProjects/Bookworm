import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { EventTracker } from "../eventTracker";

const FEEDBACK_GIVEN = "feedback_given";
const TIME_BETWEEN_FEEDBACKS = 120000;

const Feedback = (): React.ReactElement => {
  const feedbackRef = useRef<HTMLAnchorElement>(null);
  let interval = useRef<NodeJS.Timeout | null>(null);
  const controls = useAnimation();

  useEffect(() => {
    const isFeedbackGiven = localStorage.getItem(FEEDBACK_GIVEN);
    if (isFeedbackGiven) {
      return;
    }
    interval.current = setInterval(() => {
      controls
        .start({
          scale: 1.1,
          rotate: [0, 10, -10, 10, -10, 10, -10, 0],
          transition: { duration: 0.9 },
        })
        .then(() => {
          controls.start({
            scale: 1,
            transition: { duration: 0.3 },
          });
        });
    }, TIME_BETWEEN_FEEDBACKS);

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [controls]);

  const handleFeedbackClick = () => {
    feedbackRef.current?.click();
    localStorage.setItem(FEEDBACK_GIVEN, "true");
    EventTracker.track("User clicked on feedback button");
    if (interval.current) {
      clearInterval(interval.current);
    }
  };

  return (
    <div>
      <motion.div
        onClick={handleFeedbackClick}
        animate={controls}
        className="cursor-pointer hover:scale-110 transition-transform"
      >
        <img src="/feedback.png" alt="feedback" width={48} height={48} />
      </motion.div>

      <a
        ref={feedbackRef}
        href="https://forms.gle/q3XqsasS6pwC5Ezb6"
        target="_blank"
        rel="noreferrer"
      />
    </div>
  );
};

export default Feedback;
