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
  isInAppWallet?: boolean; // Flag to indicate if this is an in-app wallet
}

const STORAGE_KEY = 'monadpay_inapp_wallet';

class WalletService {
  private state: WalletState = {
    isConnected: false,
    address: null,
    provider: null,
    signer: null,
    chainId: null,
    isInAppWallet: false,
  };
  private inAppWallet: ethers.HDNodeWallet | ethers.Wallet | null = null;
  private inAppProvider: ethers.JsonRpcProvider | null = null;

  /**
   * Check if MetaMask is installed
   */
  isMetaMaskInstalled(): boolean {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  }

  /**
   * Check if in-app wallet exists
   */
  hasInAppWallet(): boolean {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored !== null;
  }

  /**
   * Create a new in-app wallet
   */
  createInAppWallet(): { address: string; mnemonic: string; privateKey: string } {
    const wallet = ethers.Wallet.createRandom();
    const mnemonic = wallet.mnemonic?.phrase || '';
    
    // Store encrypted private key (for testnet, we can store it directly)
    // In production, you should encrypt this
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: mnemonic,
      }));
    }

    this.inAppWallet = wallet;
    this.inAppProvider = new ethers.JsonRpcProvider(MONAD_TESTNET.rpcUrls[0]);
    
    this.state = {
      isConnected: true,
      address: wallet.address,
      provider: this.inAppProvider as any, // Type assertion for compatibility
      signer: wallet.connect(this.inAppProvider) as any,
      chainId: 10140,
      isInAppWallet: true,
    };

    return {
      address: wallet.address,
      mnemonic,
      privateKey: wallet.privateKey,
    };
  }

  /**
   * Load in-app wallet from storage
   */
  async loadInAppWallet(): Promise<WalletState> {
    if (typeof window === 'undefined') {
      throw new Error('Cannot load wallet in server environment');
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      throw new Error('No in-app wallet found');
    }

    try {
      const walletData = JSON.parse(stored);
      const wallet = new ethers.Wallet(walletData.privateKey);
      
      this.inAppWallet = wallet;
      this.inAppProvider = new ethers.JsonRpcProvider(MONAD_TESTNET.rpcUrls[0]);
      const signer = wallet.connect(this.inAppProvider);

      this.state = {
        isConnected: true,
        address: wallet.address,
        provider: this.inAppProvider as any,
        signer: signer as any,
        chainId: 10140,
        isInAppWallet: true,
      };

      return this.state;
    } catch (error) {
      console.error('Error loading in-app wallet:', error);
      throw new Error('Failed to load in-app wallet');
    }
  }

  /**
   * Clear in-app wallet (for logout/disconnect)
   */
  clearInAppWallet(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    this.inAppWallet = null;
    this.inAppProvider = null;
    this.state = {
      isConnected: false,
      address: null,
      provider: null,
      signer: null,
      chainId: null,
      isInAppWallet: false,
    };
  }

  /**
   * Connect to MetaMask wallet
   */
  async connectWallet(): Promise<WalletState> {
    if (!this.isMetaMaskInstalled() || !window.ethereum) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider);
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
    if (!this.isMetaMaskInstalled() || !window.ethereum) {
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
          await window.ethereum!.request({
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
    // If it's an in-app wallet, clear it
    if (this.state.isInAppWallet) {
      this.clearInAppWallet();
    } else {
      this.state = {
        isConnected: false,
        address: null,
        provider: null,
        signer: null,
        chainId: null,
        isInAppWallet: false,
      };
    }
  }

  /**
   * Get balance in MON
   */
  async getBalance(address?: string): Promise<string> {
    const targetAddress = address || this.state.address;
    if (!targetAddress) {
      throw new Error('No address provided');
    }

    // Use in-app provider if available, otherwise use state provider
    const provider = this.inAppProvider || this.state.provider;
    if (!provider) {
      throw new Error('Wallet not connected');
    }

    const balance = await provider.getBalance(targetAddress);
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
    // Use in-app signer if available, otherwise use state signer
    const signer = (this.inAppWallet && this.inAppProvider) 
      ? this.inAppWallet.connect(this.inAppProvider)
      : this.state.signer;

    if (!signer) {
      throw new Error('Wallet not connected');
    }

    const paymentContract = new ethers.Contract(
      paymentContractAddress,
      PAYMENT_CONTRACT_ABI,
      signer
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
    // Use in-app signer if available, otherwise use state signer
    const signer = (this.inAppWallet && this.inAppProvider) 
      ? this.inAppWallet.connect(this.inAppProvider)
      : this.state.signer;

    if (!signer) {
      throw new Error('Wallet not connected');
    }

    const paymentContract = new ethers.Contract(
      paymentContractAddress,
      PAYMENT_CONTRACT_ABI,
      signer
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
    // Use in-app provider if available, otherwise use state provider
    const provider = this.inAppProvider || this.state.provider;
    if (!provider) {
      throw new Error('Wallet not connected');
    }

    const registryContract = new ethers.Contract(
      handleRegistryAddress,
      HANDLE_REGISTRY_ABI,
      provider
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
    // Use in-app provider if available, otherwise use state provider
    const provider = this.inAppProvider || this.state.provider;
    if (!provider) {
      throw new Error('Wallet not connected');
    }

    const receipt = await provider.waitForTransaction(txHash);
    if (!receipt) {
      throw new Error('Transaction receipt not found');
    }
    return receipt;
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

