import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    // Close mobile menu and remove no-scroll class on route change
    setOpen(false);
    document.body.classList.remove("no-scroll");
  }, [pathname]);

  useEffect(() => {
    // Toggle body scroll based on menu state
    if (open) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [open]);

  return (
    <>
      {/* SEO Metadata */}
      <Helmet>
        <title>Cyber Updates - Stay Informed on Cyber Trends</title>
        <meta
          name="description"
          content="Cyber Updates brings you the latest trends in cybersecurity, tech news, and ethical hacking. Stay informed and secure your digital life."
        />
        <meta
          name="keywords"
          content="Cybersecurity, Ethical Hacking, Tech News, Cyber Trends, Popular Posts"
        />
        <meta name="author" content="Cyber Updates" />
      </Helmet>

      <nav className="w-full h-16 md:h-20 flex items-center justify-between ">
        {/* Logo */}
        <div className="flex items-center gap-4 text-2xl font-bold">
          <Link
            to="/"
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            Cyber <span className="text-gray-800">Updates</span>
          </Link>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          {/* Toggle Menu */}
          <button
            className="text-2xl text-gray-800 focus:outline-none"
            aria-label="Toggle Menu"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>

          {/* Mobile Menu Items */}
          <div
            className={`fixed top-16 right-0 w-full h-screen bg-white text-black flex flex-col items-center justify-center gap-8 transition-transform transform ${
              open ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <Link to="/" className="hover:text-blue-500">
              Home
            </Link>
            <Link to="write" className="hover:text-blue-500">
              Write
            </Link>
            <Link to="/posts?sort=trending" className="hover:text-blue-500">
              Trending
            </Link>
            <Link to="/posts?sort=popular" className="hover:text-blue-500">
              Popular
            </Link>
            <Link to="/about" className="hover:text-blue-500">
              About
            </Link>
            <SignedOut>
              <Link to="/login">
                <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white hover:bg-blue-600 transition-colors">
                  Login 👋
                </button>
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton
                signOutCallback={() => {
                  window.location.href = "/"; // Redirect to homepage after sign-out
                }}
              />
            </SignedIn>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium text-gray-700">
          <Link to="/" className="hover:text-blue-500">
            Home
          </Link>
          <Link to="write" className="hover:text-blue-500">
              Write
            </Link>
          <Link to="/posts?sort=trending" className="hover:text-blue-500">
            Trending
          </Link>
          <Link to="/posts?sort=popular" className="hover:text-blue-500">
            Popular
          </Link>
          <Link to="/about" className="hover:text-blue-500">
            About
          </Link>
          <SignedOut>
            <Link to="/login">
              <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white hover:bg-blue-600 transition-colors">
                Login 👋
              </button>
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton
              signOutCallback={() => {
                window.location.href = "/"; // Redirect to homepage after sign-out
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
