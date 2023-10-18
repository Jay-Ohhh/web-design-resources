"use client";

import { useEffect, useState } from "react";
import { BsFillSunFill, BsMoonFill } from "react-icons/bs";
import { useTheme } from "next-themes";
import Button from "./ui/Button";
import { AnimatePresence, motion } from "framer-motion";

const ThemeSwitch = () => {
  const { theme = "light", setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div>
      <Button
        variant="default"
        size="icon"
        className="flex h-7 w-7 shrink-0 items-center justify-center duration-300"
        onClick={() => {
          theme === "light" ? setTheme("dark") : setTheme("light");
        }}
      >
        <AnimatePresence>
          <div className="relative h-full w-full">
            {mounted ?
              theme === "light" ? (
                <motion.div
                  className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 p-2"
                  key={1}
                  initial={{ opacity: 0, left: "0%" }}
                  animate={{ opacity: 1, left: "50%" }}
                  exit={{ opacity: 0, left: "100%" }}
                  transition={{ duration: 0.2 }}
                >
                  <BsMoonFill className="h-full w-full" />
                </motion.div>
              ) : (
                <motion.div
                  className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 p-1.5"
                  key={2}
                  initial={{ opacity: 0, left: "0%" }}
                  animate={{ opacity: 1, left: "50%" }}
                  exit={{ opacity: 0, left: "100%" }}
                  transition={{ duration: 0.2 }}
                >
                  <BsFillSunFill className="h-full w-full" />
                </motion.div>
              ) : null}
          </div>
        </AnimatePresence>
      </Button>
    </div>
  );
};

export default ThemeSwitch;
