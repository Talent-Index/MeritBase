"use client";

import React from "react";
import { useAccount } from "wagmi";

/**
 * Simple one-click MetaMask connector button.
 * - If MetaMask / an injected provider is present: attempts to connect using the injected connector.
 * - If not present: opens MetaMask download page.
 */
export const ConnectMetaMaskButton = () => {
  const { isConnected } = useAccount();

  const handleClick = async () => {
    if (typeof window === "undefined") return;
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      // Open MetaMask install page
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    try {
      // Request accounts directly from the injected provider. Wagmi/RainbowKit will pick up the
      // provider change and update the app state via events.
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (e) {
      console.error("MetaMask requestAccounts failed:", e);
    }
  };

  if (isConnected) return null;

  return (
    <button className="btn btn-secondary btn-sm mr-2" onClick={handleClick} type="button">
      Connect MetaMask
    </button>
  );
};
