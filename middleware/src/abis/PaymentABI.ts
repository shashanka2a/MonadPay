// ABI for Payment contract
export const PaymentABI = [
  'function sendPayment(string memory handle, string memory note) external payable',
  'function sendPaymentToAddress(address recipient, string memory note) external payable',
  'function getTransaction(bytes32 txHash) external view returns (tuple(address from, address to, uint256 amount, string note, uint256 timestamp, bytes32 txHash, bool exists))',
  'function getUserTransactions(address user) external view returns (bytes32[])',
  'function getUserTransactionCount(address user) external view returns (uint256)',
  'function getTotalTransactions() external view returns (uint256)',
  'function getTotalVolume() external view returns (uint256)',
  'event PaymentSent(address indexed from, address indexed to, uint256 amount, string note, bytes32 indexed transactionHash, uint256 timestamp)',
  'event PaymentReceived(address indexed recipient, address indexed sender, uint256 amount, string note, bytes32 indexed transactionHash, uint256 timestamp)',
];



