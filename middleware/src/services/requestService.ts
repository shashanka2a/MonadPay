import { ethers } from 'ethers';
import { PaymentRequestABI } from '../abis/PaymentRequestABI';

interface CreateRequestParams {
  requester: string;
  amount: string;
  note: string;
  expiry: number;
}

class RequestService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  
  constructor() {
    const rpcUrl = process.env.MONAD_RPC_URL || 'http://localhost:8545';
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    
    const contractAddress = process.env.PAYMENT_REQUEST_CONTRACT_ADDRESS || '';
    if (!contractAddress) {
      throw new Error('PAYMENT_REQUEST_CONTRACT_ADDRESS not configured');
    }
    
    this.contract = new ethers.Contract(
      contractAddress,
      PaymentRequestABI,
      this.provider
    );
  }
  
  /**
   * Create a payment request
   */
  async createRequest(params: CreateRequestParams): Promise<{
    requestId: string;
    requester: string;
    amount: string;
    note: string;
    expiry: number;
    transactionData: string;
  }> {
    try {
      const amountWei = ethers.parseEther(params.amount);
      
      // Encode transaction data
      const iface = new ethers.Interface(PaymentRequestABI);
      const transactionData = iface.encodeFunctionData('createRequest', [
        amountWei,
        params.note || '',
        params.expiry || 0,
      ]);
      
      // Generate expected request ID (same logic as contract)
      const requestId = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ['address', 'uint256', 'uint256', 'uint256', 'string'],
          [
            params.requester,
            amountWei,
            Math.floor(Date.now() / 1000),
            0, // block number (approximate)
            params.note || '',
          ]
        )
      );
      
      return {
        requestId,
        requester: params.requester,
        amount: params.amount,
        note: params.note || '',
        expiry: params.expiry || 0,
        transactionData,
      };
    } catch (error: any) {
      console.error('Error creating request:', error);
      throw new Error(`Failed to create request: ${error.message}`);
    }
  }
  
  /**
   * Get payment request details
   */
  async getRequest(requestId: string): Promise<any> {
    try {
      const request = await this.contract.getRequest(requestId);
      return {
        requestId: request.requestId,
        requester: request.requester,
        requesterHandle: request.requesterHandle,
        amount: request.amount.toString(),
        amountWei: request.amount.toString(),
        note: request.note,
        expiry: request.expiry.toString(),
        fulfilled: request.fulfilled,
        cancelled: request.cancelled,
        createdAt: request.createdAt.toString(),
      };
    } catch (error: any) {
      console.error('Error getting request:', error);
      return null;
    }
  }
  
  /**
   * Get all requests for a user
   */
  async getUserRequests(address: string): Promise<any[]> {
    try {
      const requestIds = await this.contract.getUserRequests(address);
      const requests = await Promise.all(
        requestIds.map((id: string) => this.getRequest(id))
      );
      return requests.filter((r: any) => r !== null);
    } catch (error: any) {
      console.error('Error getting user requests:', error);
      return [];
    }
  }
  
  /**
   * Validate if a request is still valid
   */
  async validateRequest(requestId: string): Promise<boolean> {
    try {
      const isValid = await this.contract.isRequestValid(requestId);
      return isValid;
    } catch (error: any) {
      console.error('Error validating request:', error);
      return false;
    }
  }
}

export const requestService = new RequestService();


