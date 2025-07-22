import React, { useState } from "react";

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button onClick={toggleMenu} className="focus:outline-none">
        {!isOpen ? (
          // Hamburger Icon
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="white"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        ) : (
          // "X" Icon
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="white"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-4 flex">
          {/* Vertical Line */}
          <div className="h-38 w-1 rounded bg-lion" />

          {/* Dropdown Menu */}
          <div className="w-60 text-xl">
            <ul className="flex flex-col space-y-1 p-4">
              <li>
                <a
                  href="#"
                  className="tracking-wide text-violet dark:text-bone"
                >
                  Mix Your First Plan
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="tracking-wide text-violet dark:text-bone"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="tracking-wide text-violet dark:text-bone"
                >
                  About Plancake
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="tracking-wide text-violet dark:text-bone"
                >
                  Login/Signup
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
