import { useState } from "react";
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full h-16 md:h-20 flex items-center justify-between">
      {/*Logo*/}

      <div className="flex items-center gap-4 text-2xl font-bold">
        <Link to="/">
          <span className="font-bold text-blue-500 hover:text-blue-700 transition-colors duration-300">
            Cyber <span className="text-gray-800">Updates</span>
          </span>
        </Link>
      </div>

      {/*Moblie View*/}
      <div className="md:hidden">
        {/*Toggle Menu*/}
        <div
          className="cursor-pointer text-2xl "
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? "X" : "≡"}
        </div>

        {/*Mobile Menu Items*/}
        <div
          className={`w-full h-screen flex  flex-col items-center justify-center gap-8 font-medium text-lg absolute top-16 bg-red-700  transition-all ease-in-out ${
            open ? "-right-0" : "-right-[100%]"
          }`}
        >
          <Link to="/">Home</Link>
          <Link to="/">Trending</Link>
          <Link to="/">Popular</Link>
          <Link to="/">About</Link>
          <Link to="">
            <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">
              Login 👋{" "}
            </button>
          </Link>
        </div>
      </div>
      {/*Desktop Menu*/}
      <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium ">
        <Link to="/">Home</Link>
        <Link to="/trendiing">Trending</Link>
        <Link to="/">Popular</Link>
        <Link to="/">About</Link>
        <SignedOut>
          <Link to="/login">
            <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">
              Login 👋{" "}
            </button>
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
