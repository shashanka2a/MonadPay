'use client';

import { useState, useEffect, useCallback } from 'react';
import { walletService, WalletState } from '../utils/wallet';

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    provider: null,
    signer: null,
    chainId: null,
  });
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBalance = useCallback(async () => {
    try {
      const state = walletService.getWalletState();
      if (state.address) {
        const bal = await walletService.getBalance();
        setBalance(bal);
      }
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  }, []);

  // Check connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      // First check for in-app wallet
      if (walletService.hasInAppWallet()) {
        try {
          const state = await walletService.loadInAppWallet();
          setWalletState(state);
          await updateBalance();
          return;
        } catch (error) {
          console.error('Error loading in-app wallet:', error);
        }
      }

      // Then check for MetaMask
      if (walletService.isMetaMaskInstalled()) {
        try {
          const provider = new (await import('ethers')).BrowserProvider(window.ethereum!);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            const state = walletService.getWalletState();
            if (state.isConnected) {
              setWalletState(state);
              await updateBalance();
            }
          }
        } catch (error) {
          // Not connected
        }
      }
    };

    checkConnection();
  }, [updateBalance]);

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setWalletState({
          isConnected: false,
          address: null,
          provider: null,
          signer: null,
          chainId: null,
        });
        setBalance('0');
      } else {
        walletService.connectWallet().then(setWalletState);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [updateBalance]);

  const connect = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const state = await walletService.connectWallet();
      setWalletState(state);
      await updateBalance();
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [updateBalance]);

  const disconnect = useCallback(() => {
    walletService.disconnectWallet();
    setWalletState({
      isConnected: false,
      address: null,
      provider: null,
      signer: null,
      chainId: null,
      isInAppWallet: false,
    });
    setBalance('0');
  }, []);

  const createInAppWallet = useCallback(() => {
    const walletData = walletService.createInAppWallet();
    setWalletState(walletService.getWalletState());
    return walletData;
  }, []);

  return {
    ...walletState,
    balance,
    isLoading,
    error,
    connect,
    disconnect,
    updateBalance,
    createInAppWallet,
    isMetaMaskInstalled: walletService.isMetaMaskInstalled(),
    hasInAppWallet: walletService.hasInAppWallet(),
  };
}

