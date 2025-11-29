// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title HandleRegistry
 * @notice Manages monadpay handles (@username) and their mappings to wallet addresses
 * @dev Handles are unique identifiers that map to wallet addresses on Monad blockchain
 */
contract HandleRegistry {
    // Events
    event HandleClaimed(address indexed wallet, string handle, uint256 timestamp);
    event HandleMapped(address indexed wallet, string handle, uint256 timestamp);
    event HandleReleased(string handle, address indexed previousOwner, uint256 timestamp);
    
    // Constants
    uint256 public constant HANDLE_FEE = 0.001 ether; // 0.001 MON
    uint256 public constant MIN_HANDLE_LENGTH = 2;
    uint256 public constant MAX_HANDLE_LENGTH = 30;
    
    // State variables
    mapping(string => address) public handleToAddress; // handle => wallet address
    mapping(address => string) public addressToHandle; // wallet => handle
    mapping(string => bool) public isHandleClaimed; // handle => claimed status
    
    address public owner;
    uint256 public totalHandles;
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    modifier validHandle(string memory handle) {
        require(bytes(handle).length >= MIN_HANDLE_LENGTH, "Handle too short");
        require(bytes(handle).length <= MAX_HANDLE_LENGTH, "Handle too long");
        require(isValidHandleFormat(handle), "Invalid handle format");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @notice Claim a new handle and create a new wallet mapping
     * @param handle The handle to claim (e.g., "alice")
     * @dev Requires payment of HANDLE_FEE
     */
    function claimHandle(string memory handle) 
        external 
        payable 
        validHandle(handle) 
    {
        require(!isHandleClaimed[handle], "Handle already claimed");
        require(msg.value >= HANDLE_FEE, "Insufficient fee");
        require(bytes(addressToHandle[msg.sender]).length == 0, "Address already has a handle");
        
        // Claim the handle
        handleToAddress[handle] = msg.sender;
        addressToHandle[msg.sender] = handle;
        isHandleClaimed[handle] = true;
        totalHandles++;
        
        emit HandleClaimed(msg.sender, handle, block.timestamp);
        
        // Refund excess payment
        if (msg.value > HANDLE_FEE) {
            payable(msg.sender).transfer(msg.value - HANDLE_FEE);
        }
    }
    
    /**
     * @notice Map an existing handle to an existing wallet
     * @param handle The handle to map
     * @dev Requires payment of HANDLE_FEE, used when connecting existing wallet
     */
    function mapHandle(string memory handle) 
        external 
        payable 
        validHandle(handle) 
    {
        require(!isHandleClaimed[handle], "Handle already claimed");
        require(msg.value >= HANDLE_FEE, "Insufficient fee");
        require(bytes(addressToHandle[msg.sender]).length == 0, "Address already has a handle");
        
        // Map the handle
        handleToAddress[handle] = msg.sender;
        addressToHandle[msg.sender] = handle;
        isHandleClaimed[handle] = true;
        totalHandles++;
        
        emit HandleMapped(msg.sender, handle, block.timestamp);
        
        // Refund excess payment
        if (msg.value > HANDLE_FEE) {
            payable(msg.sender).transfer(msg.value - HANDLE_FEE);
        }
    }
    
    /**
     * @notice Check if a handle is available
     * @param handle The handle to check
     * @return available True if handle is available
     */
    function isHandleAvailable(string memory handle) 
        external 
        view 
        returns (bool available) 
    {
        if (bytes(handle).length < MIN_HANDLE_LENGTH || bytes(handle).length > MAX_HANDLE_LENGTH) {
            return false;
        }
        if (!isValidHandleFormat(handle)) {
            return false;
        }
        return !isHandleClaimed[handle];
    }
    
    /**
     * @notice Get wallet address for a handle
     * @param handle The handle to lookup
     * @return wallet The wallet address, or address(0) if not found
     */
    function getAddressByHandle(string memory handle) 
        external 
        view 
        returns (address wallet) 
    {
        return handleToAddress[handle];
    }
    
    /**
     * @notice Get handle for a wallet address
     * @param wallet The wallet address to lookup
     * @return handle The handle, or empty string if not found
     */
    function getHandleByAddress(address wallet) 
        external 
        view 
        returns (string memory handle) 
    {
        return addressToHandle[wallet];
    }
    
    /**
     * @notice Release a handle (only owner, for admin purposes)
     * @param handle The handle to release
     */
    function releaseHandle(string memory handle) external onlyOwner {
        address previousOwner = handleToAddress[handle];
        require(previousOwner != address(0), "Handle not claimed");
        
        delete handleToAddress[handle];
        delete addressToHandle[previousOwner];
        isHandleClaimed[handle] = false;
        totalHandles--;
        
        emit HandleReleased(handle, previousOwner, block.timestamp);
    }
    
    /**
     * @notice Validate handle format (alphanumeric and underscore only)
     * @param handle The handle to validate
     * @return valid True if format is valid
     */
    function isValidHandleFormat(string memory handle) internal pure returns (bool valid) {
        bytes memory handleBytes = bytes(handle);
        
        // Must start with letter
        if (handleBytes.length == 0 || !isLetter(handleBytes[0])) {
            return false;
        }
        
        // Rest can be alphanumeric or underscore
        for (uint256 i = 1; i < handleBytes.length; i++) {
            if (!isAlphanumeric(handleBytes[i]) && handleBytes[i] != 0x5F) { // 0x5F = '_'
                return false;
            }
        }
        
        return true;
    }
    
    function isLetter(bytes1 char) internal pure returns (bool) {
        return (char >= 0x41 && char <= 0x5A) || (char >= 0x61 && char <= 0x7A); // A-Z or a-z
    }
    
    function isAlphanumeric(bytes1 char) internal pure returns (bool) {
        return isLetter(char) || (char >= 0x30 && char <= 0x39); // 0-9
    }
    
    /**
     * @notice Withdraw collected fees (only owner)
     */
    function withdrawFees() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    /**
     * @notice Update handle fee (only owner)
     */
    function setHandleFee(uint256 newFee) external onlyOwner {
        // In production, emit event for fee change
        // HANDLE_FEE = newFee; // Note: This would require removing 'constant'
    }
}

