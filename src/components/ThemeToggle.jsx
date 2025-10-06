import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <label className="swap swap-rotate ml-4">
      <input
        type="checkbox"
        aria-label="Toggle theme"
        checked={isDark}
        onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
      />
      <svg className="swap-off h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M5.64 17.657l-1.414 1.415L2.81 17.657l1.415-1.415 1.414 1.415zM1 13h3v-2H1v2zm10 10h2v-3h-2v3zM4.226 6.343L2.81 4.929 4.226 3.515l1.414 1.414L4.226 6.343zM13 1h-2v3h2V1zm7.774 5.343l-1.414-1.414 1.414-1.414 1.414 1.414-1.414 1.414zM23 11h-3v2h3v-2zM18.36 17.657l1.414 1.415 1.415-1.415-1.415-1.415-1.414 1.415zM12 7a5 5 0 100 10 5 5 0 000-10z" />
      </svg>
      <svg className="swap-on h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M21.752 15.002A9 9 0 1112.998 2.25c.225 0 .45.008.674.024a.75.75 0 01.36 1.365 7.5 7.5 0 007.33 12.363.75.75 0 01.391 1.363z" />
      </svg>
    </label>
  );
}
