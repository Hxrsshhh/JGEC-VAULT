"use client";

import { useEffect, useState } from "react";

export default function Clock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };

    update(); // run once
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, []);

  return <p className="text-[9px] font-bold">{time}</p>;
}