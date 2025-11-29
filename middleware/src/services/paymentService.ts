import { ethers } from 'ethers';
import { PaymentABI } from '../abis/PaymentABI';
import { handleService } from './handleService';

interface PreparePaymentParams {
  from: string;
  toHandle?: string;
  toAddress?: string;
  amount: string;
  note: string;
}

class PaymentService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  
  constructor() {
    const rpcUrl = process.env.MONAD_RPC_URL || 'http://localhost:8545';
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    
    const contractAddress = process.env.PAYMENT_CONTRACT_ADDRESS || '';
    if (!contractAddress) {
      throw new Error('PAYMENT_CONTRACT_ADDRESS not configured');
    }
    
    this.contract = new ethers.Contract(
      contractAddress,
      PaymentABI,
      this.provider
    );
  }
  
  /**
   * Prepare payment transaction data
   */
  async preparePayment(params: PreparePaymentParams): Promise<{
    to: string;
    amount: string;
    amountWei: string;
    note: string;
    transactionData: string;
  }> {
    try {
      let toAddress: string;
      
      // Resolve handle to address if needed
      if (params.toHandle) {
        toAddress = await handleService.getAddressByHandle(params.toHandle);
        if (!toAddress || toAddress === '0x0000000000000000000000000000000000000000') {
          throw new Error(`Handle "${params.toHandle}" not found`);
        }
      } else if (params.toAddress) {
        toAddress = params.toAddress;
      } else {
        throw new Error('Must provide either toHandle or toAddress');
      }
      
      // Convert amount to wei
      const amountWei = ethers.parseEther(params.amount);
      
      // Encode transaction data
      let transactionData: string;
      if (params.toHandle) {
        // Use sendPayment(string handle, string note)
        const iface = new ethers.Interface(PaymentABI);
        transactionData = iface.encodeFunctionData('sendPayment', [
          params.toHandle,
          params.note || '',
        ]);
      } else {
        // Use sendPaymentToAddress(address recipient, string note)
        const iface = new ethers.Interface(PaymentABI);
        transactionData = iface.encodeFunctionData('sendPaymentToAddress', [
          toAddress,
          params.note || '',
        ]);
      }
      
      return {
        to: toAddress,
        amount: params.amount,
        amountWei: amountWei.toString(),
        note: params.note || '',
        transactionData,
      };
    } catch (error: any) {
      console.error('Error preparing payment:', error);
      throw new Error(`Failed to prepare payment: ${error.message}`);
    }
  }
  
  /**
   * Get balance for an address
   */
  async getBalance(address: string): Promise<bigint> {
    try {
      const balance = await this.provider.getBalance(address);
      return balance;
    } catch (error: any) {
      console.error('Error getting balance:', error);
      throw new Error(`Failed to get balance: ${error.message}`);
    }
  }
  
  /**
   * Get transaction by hash
   */
  async getTransaction(txHash: string): Promise<any> {
    try {
      const tx = await this.contract.getTransaction(txHash);
      return {
        from: tx.from,
        to: tx.to,
        amount: tx.amount.toString(),
        amountWei: tx.amount.toString(),
        note: tx.note,
        timestamp: tx.timestamp.toString(),
        txHash: tx.txHash,
      };
    } catch (error: any) {
      console.error('Error getting transaction:', error);
      return null;
    }
  }
}

export const paymentService = new PaymentService();



