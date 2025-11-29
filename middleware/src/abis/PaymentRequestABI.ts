// ABI for PaymentRequest contract
export const PaymentRequestABI = [
  'function createRequest(uint256 amount, string memory note, uint256 expiry) external returns (bytes32)',
  'function fulfillRequest(bytes32 requestId) external payable',
  'function cancelRequest(bytes32 requestId) external',
  'function getRequest(bytes32 requestId) external view returns (tuple(bytes32 requestId, address requester, string requesterHandle, uint256 amount, string note, uint256 expiry, bool fulfilled, bool cancelled, uint256 createdAt))',
  'function getUserRequests(address user) external view returns (bytes32[])',
  'function isRequestValid(bytes32 requestId) external view returns (bool)',
  'event PaymentRequestCreated(bytes32 indexed requestId, address indexed requester, string requesterHandle, uint256 amount, string note, uint256 expiry, uint256 timestamp)',
  'event PaymentRequestFulfilled(bytes32 indexed requestId, address indexed payer, address indexed requester, uint256 amount, uint256 timestamp)',
  'event PaymentRequestCancelled(bytes32 indexed requestId, address indexed requester, uint256 timestamp)',
];

