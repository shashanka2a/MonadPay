// ABI for HandleRegistry contract
export const HandleRegistryABI = [
  'function claimHandle(string memory handle) external payable',
  'function mapHandle(string memory handle) external payable',
  'function isHandleAvailable(string memory handle) external view returns (bool)',
  'function getAddressByHandle(string memory handle) external view returns (address)',
  'function getHandleByAddress(address wallet) external view returns (string memory)',
  'function HANDLE_FEE() external view returns (uint256)',
  'function totalHandles() external view returns (uint256)',
  'event HandleClaimed(address indexed wallet, string handle, uint256 timestamp)',
  'event HandleMapped(address indexed wallet, string handle, uint256 timestamp)',
];



