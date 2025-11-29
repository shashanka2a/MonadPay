import { ethers } from 'ethers';
import { HandleRegistryABI } from '../abis/HandleRegistryABI';

class HandleService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  
  constructor() {
    const rpcUrl = process.env.MONAD_RPC_URL || 'http://localhost:8545';
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    
    const contractAddress = process.env.HANDLE_REGISTRY_ADDRESS || '';
    if (!contractAddress) {
      throw new Error('HANDLE_REGISTRY_ADDRESS not configured');
    }
    
    this.contract = new ethers.Contract(
      contractAddress,
      HandleRegistryABI,
      this.provider
    );
  }
  
  /**
   * Check if a handle is available
   */
  async checkAvailability(handle: string): Promise<{ available: boolean }> {
    try {
      const available = await this.contract.isHandleAvailable(handle);
      return { available };
    } catch (error: any) {
      console.error('Error checking handle availability:', error);
      throw new Error(`Failed to check handle availability: ${error.message}`);
    }
  }
  
  /**
   * Get wallet address for a handle
   */
  async getAddressByHandle(handle: string): Promise<string> {
    try {
      const address = await this.contract.getAddressByHandle(handle);
      return address;
    } catch (error: any) {
      console.error('Error getting address by handle:', error);
      throw new Error(`Failed to get address: ${error.message}`);
    }
  }
  
  /**
   * Get handle for a wallet address
   */
  async getHandleByAddress(address: string): Promise<string> {
    try {
      const handle = await this.contract.getHandleByAddress(address);
      return handle;
    } catch (error: any) {
      console.error('Error getting handle by address:', error);
      throw new Error(`Failed to get handle: ${error.message}`);
    }
  }
  
  /**
   * Get complete user info
   */
  async getUserInfo(address: string): Promise<{
    address: string;
    handle: string | null;
    hasHandle: boolean;
  }> {
    try {
      const handle = await this.getHandleByAddress(address);
      return {
        address,
        handle: handle && handle !== '' ? handle : null,
        hasHandle: handle && handle !== '',
      };
    } catch (error: any) {
      console.error('Error getting user info:', error);
      return {
        address,
        handle: null,
        hasHandle: false,
      };
    }
  }
  
  /**
   * Get handle fee
   */
  async getHandleFee(): Promise<string> {
    try {
      const fee = await this.contract.HANDLE_FEE();
      return ethers.formatEther(fee);
    } catch (error: any) {
      console.error('Error getting handle fee:', error);
      return '0.001'; // Default fallback
    }
  }
}

export const handleService = new HandleService();


