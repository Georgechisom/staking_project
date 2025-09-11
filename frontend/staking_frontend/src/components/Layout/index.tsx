import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const location = useLocation();

  const toggleTheme = () => setIsDark(!isDark);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: "Dashboard", href: "/" },
    { name: "Stake", href: "/stake" },
    { name: "Withdraw", href: "/withdraw" },
    { name: "Rewards", href: "/rewards" },
  ];

  return (
    <div
      className={`w-full min-h-screen ${
        isDark ? "bg-black text-white" : "bg-gray-700 text-black"
      } flex flex-col relative`}
    >
      {/* Navbar */}
      <nav
        className={`fixed top-0 w-full h-20 ${
          isDark ? "bg-black/20" : "bg-white/20"
        } backdrop-blur-md shadow-lg border-b border-purple-500/50 z-50 px-4`}
      >
        <div className="w-full h-full flex justify-between items-center">
          {/* Logo */}
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            WinsomeStakes
          </motion.div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <motion.div
                key={link.name}
                className={`transition-colors duration-200 ${
                  location.pathname === link.href
                    ? "text-purple-400 border-b-2 border-purple-400"
                    : "text-gray-300 hover:text-white"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to={link.href} className="block">
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Connect Button and Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                isDark
                  ? "text-white hover:bg-white/10"
                  : "text-black hover:bg-black/10"
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <ConnectButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className={`md:hidden fixed top-20 right-0 w-64 h-screen ${
                isDark ? "bg-black/90" : "bg-white/90"
              } backdrop-blur-md border-l border-purple-500/20 shadow-xl`}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex flex-col space-y-4 p-4 mt-4">
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-full self-start ${
                    isDark
                      ? "text-white hover:bg-white/10"
                      : "text-black hover:bg-black/10"
                  }`}
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                {navLinks.map((link) => (
                  <motion.div
                    key={link.name}
                    className={`transition-colors duration-200 ${
                      location.pathname === link.href
                        ? "text-purple-400 border-l-4 border-purple-400 pl-2"
                        : "text-gray-300 hover:text-white"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to={link.href} className="block">
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile FAB Connect Button */}
      <motion.div
        className="md:hidden fixed bottom-24 right-4 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
      >
        <ConnectButton />
      </motion.div>

      {/* Main Content */}
      <motion.main
        className="flex-1 pt-24 pb-20 px-4 md:px-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {children}
      </motion.main>

      {/* Footer */}
      <footer className="w-full h-16 bg-black/20 backdrop-blur-md border-t border-purple-500/20 py-3 px-4">
        <div className="flex justify-center items-center h-full text-gray-400 text-sm ">
          &copy; {new Date().getFullYear()}
          {"  "}
          <span className="text-blue-400  mx-2">WinsomeStakes.</span>{" "}
          <span className="text-purple-400">All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
