import { useState, useEffect } from "react";
import { web3Service } from "@/lib/web3";

export function useWallet() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if already connected
    if (web3Service.isConnected()) {
      setIsConnected(true);
      web3Service.getAddress().then(addr => setAddress(addr));
    }

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
        } else {
          setAddress(null);
          setIsConnected(false);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    const result = await web3Service.connectWallet();
    
    if (result.success && result.address) {
      setIsConnected(true);
      setAddress(result.address);
    } else {
      setError(result.error || "فشل في الاتصال");
    }

    setIsConnecting(false);
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
    setError(null);
  };

  return {
    isConnected,
    address,
    isConnecting,
    error,
    connectWallet,
    disconnect
  };
}
