'use client';

import { ethers } from 'ethers';

// Monad Testnet Configuration
const MONAD_TESTNET = {
  chainId: '0x279C', // 10140 in hex
  chainName: 'Monad Testnet',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: ['https://testnet-rpc.monad.xyz'],
  blockExplorerUrls: ['https://testnet-explorer.monad.xyz'],
};

// Contract ABIs (minimal for interaction)
const PAYMENT_CONTRACT_ABI = [
  'function sendPayment(string memory handle, string memory note) external payable',
  'function sendPaymentToAddress(address recipient, string memory note) external payable',
];

const HANDLE_REGISTRY_ABI = [
  'function getAddressByHandle(string memory handle) external view returns (address)',
  'function isHandleAvailable(string memory handle) external view returns (bool)',
];

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  chainId: number | null;
}

class WalletService {
  private state: WalletState = {
    isConnected: false,
    address: null,
    provider: null,
    signer: null,
    chainId: null,
  };

  /**
   * Check if MetaMask is installed
   */
  isMetaMaskInstalled(): boolean {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  }

  /**
   * Connect to MetaMask wallet
   */
  async connectWallet(): Promise<WalletState> {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.');
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      
      // Check if on Monad Testnet, if not, prompt to switch
      if (network.chainId !== BigInt(10140)) {
        await this.switchToMonadTestnet();
      }

      this.state = {
        isConnected: true,
        address,
        provider,
        signer,
        chainId: Number(network.chainId),
      };

      return this.state;
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      throw new Error(error.message || 'Failed to connect wallet');
    }
  }

  /**
   * Switch to Monad Testnet
   */
  async switchToMonadTestnet(): Promise<void> {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MONAD_TESTNET.chainId }],
      });
    } catch (switchError: any) {
      // If chain doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [MONAD_TESTNET],
          });
        } catch (addError) {
          throw new Error('Failed to add Monad Testnet to MetaMask');
        }
      } else {
        throw switchError;
      }
    }
  }

  /**
   * Get current wallet state
   */
  getWalletState(): WalletState {
    return { ...this.state };
  }

  /**
   * Disconnect wallet
   */
  disconnectWallet(): void {
    this.state = {
      isConnected: false,
      address: null,
      provider: null,
      signer: null,
      chainId: null,
    };
  }

  /**
   * Get balance in MON
   */
  async getBalance(address?: string): Promise<string> {
    if (!this.state.provider) {
      throw new Error('Wallet not connected');
    }

    const targetAddress = address || this.state.address;
    if (!targetAddress) {
      throw new Error('No address provided');
    }

    const balance = await this.state.provider.getBalance(targetAddress);
    return ethers.formatEther(balance);
  }

  /**
   * Send payment via handle
   */
  async sendPayment(
    handle: string,
    amount: string, // Amount in MON (e.g., "1.5")
    note: string,
    paymentContractAddress: string
  ): Promise<ethers.ContractTransactionResponse> {
    if (!this.state.signer) {
      throw new Error('Wallet not connected');
    }

    const paymentContract = new ethers.Contract(
      paymentContractAddress,
      PAYMENT_CONTRACT_ABI,
      this.state.signer
    );

    const amountWei = ethers.parseEther(amount);

    try {
      const tx = await paymentContract.sendPayment(handle, note, {
        value: amountWei,
      });

      return tx;
    } catch (error: any) {
      console.error('Error sending payment:', error);
      throw new Error(error.message || 'Failed to send payment');
    }
  }

  /**
   * Send payment to address directly
   */
  async sendPaymentToAddress(
    recipientAddress: string,
    amount: string, // Amount in MON
    note: string,
    paymentContractAddress: string
  ): Promise<ethers.ContractTransactionResponse> {
    if (!this.state.signer) {
      throw new Error('Wallet not connected');
    }

    const paymentContract = new ethers.Contract(
      paymentContractAddress,
      PAYMENT_CONTRACT_ABI,
      this.state.signer
    );

    const amountWei = ethers.parseEther(amount);

    try {
      const tx = await paymentContract.sendPaymentToAddress(recipientAddress, note, {
        value: amountWei,
      });

      return tx;
    } catch (error: any) {
      console.error('Error sending payment:', error);
      throw new Error(error.message || 'Failed to send payment');
    }
  }

  /**
   * Resolve handle to address
   */
  async resolveHandle(
    handle: string,
    handleRegistryAddress: string
  ): Promise<string> {
    if (!this.state.provider) {
      throw new Error('Wallet not connected');
    }

    const registryContract = new ethers.Contract(
      handleRegistryAddress,
      HANDLE_REGISTRY_ABI,
      this.state.provider
    );

    try {
      const address = await registryContract.getAddressByHandle(handle);
      return address;
    } catch (error: any) {
      console.error('Error resolving handle:', error);
      throw new Error('Handle not found');
    }
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForTransaction(txHash: string): Promise<ethers.TransactionReceipt> {
    if (!this.state.provider) {
      throw new Error('Wallet not connected');
    }

    return await this.state.provider.waitForTransaction(txHash);
  }
}

// Export singleton instance
export const walletService = new WalletService();

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (event: string, handler: (...args: any[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

