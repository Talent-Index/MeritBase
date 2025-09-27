"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

/**
 * Site header
 */
export const Header = () => {
  return (
    <div className="sticky top-0 navbar bg-gray-900 text-white min-h-0 shrink-0 justify-between z-20 shadow-md px-4">
      {/* Left side: Only logo */}
      <div className="navbar-start">
        <Link href="/" passHref className="flex items-center gap-2">
          <div className="flex relative w-10 h-10">
            <Image alt="MeritBase logo" className="cursor-pointer" fill src="/logo.svg" />
          </div>
          <span className="font-bold text-lg">MeritBase</span>
        </Link>
      </div>

      {/* Right side: Wallet connect */}
      <div className="navbar-end">
        <RainbowKitCustomConnectButton />
      </div>
    </div>
  );
};
