import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

interface HeaderProps {
  onLoginClick?: () => void;
}

const Header = ({
  onLoginClick = () => (window.location.href = "/login"),
}: HeaderProps) => {
  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 z-50">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="h-10" />
        </div>

        <Button onClick={onLoginClick} variant="outline" className="ml-4">
          Login
        </Button>
      </div>
    </header>
  );
};

export default Header;
