// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./HandleRegistry.sol";

/**
 * @title Payment
 * @notice Handles MON token transfers between users via handles
 * @dev Integrates with HandleRegistry for handle-to-address resolution
 */
contract Payment {
    // Events
    event PaymentSent(
        address indexed from,
        address indexed to,
        uint256 amount,
        string note,
        bytes32 indexed transactionHash,
        uint256 timestamp
    );
    
    event PaymentReceived(
        address indexed recipient,
        address indexed sender,
        uint256 amount,
        string note,
        bytes32 indexed transactionHash,
        uint256 timestamp
    );
    
    // State variables
    HandleRegistry public handleRegistry;
    
    // Transaction tracking
    struct Transaction {
        address from;
        address to;
        uint256 amount;
        string note;
        uint256 timestamp;
        bytes32 txHash;
        bool exists;
    }
    
    mapping(bytes32 => Transaction) public transactions;
    mapping(address => bytes32[]) public userTransactions; // user => transaction hashes
    bytes32[] public allTransactions;
    
    uint256 public totalTransactions;
    uint256 public totalVolume; // Total MON transferred
    
    constructor(address _handleRegistry) {
        handleRegistry = HandleRegistry(_handleRegistry);
    }
    
    /**
     * @notice Send payment to a handle
     * @param handle Recipient's handle (e.g., "alice")
     * @param note Optional payment note/memo
     * @dev Resolves handle to address and transfers MON
     */
    function sendPayment(string memory handle, string memory note) 
        external 
        payable 
    {
        require(msg.value > 0, "Amount must be greater than 0");
        
        address recipient = handleRegistry.getAddressByHandle(handle);
        require(recipient != address(0), "Handle not found");
        require(recipient != msg.sender, "Cannot send to yourself");
        
        // Transfer MON
        (bool success, ) = recipient.call{value: msg.value}("");
        require(success, "Transfer failed");
        
        // Create transaction record
        bytes32 txHash = keccak256(
            abi.encodePacked(
                msg.sender,
                recipient,
                msg.value,
                block.timestamp,
                block.number
            )
        );
        
        Transaction memory tx = Transaction({
            from: msg.sender,
            to: recipient,
            amount: msg.value,
            note: note,
            timestamp: block.timestamp,
            txHash: txHash,
            exists: true
        });
        
        transactions[txHash] = tx;
        userTransactions[msg.sender].push(txHash);
        userTransactions[recipient].push(txHash);
        allTransactions.push(txHash);
        
        totalTransactions++;
        totalVolume += msg.value;
        
        emit PaymentSent(msg.sender, recipient, msg.value, note, txHash, block.timestamp);
        emit PaymentReceived(recipient, msg.sender, msg.value, note, txHash, block.timestamp);
    }
    
    /**
     * @notice Send payment directly to an address
     * @param recipient Recipient's wallet address
     * @param note Optional payment note/memo
     */
    function sendPaymentToAddress(address recipient, string memory note) 
        external 
        payable 
    {
        require(msg.value > 0, "Amount must be greater than 0");
        require(recipient != address(0), "Invalid recipient");
        require(recipient != msg.sender, "Cannot send to yourself");
        
        // Transfer MON
        (bool success, ) = recipient.call{value: msg.value}("");
        require(success, "Transfer failed");
        
        // Create transaction record
        bytes32 txHash = keccak256(
            abi.encodePacked(
                msg.sender,
                recipient,
                msg.value,
                block.timestamp,
                block.number
            )
        );
        
        Transaction memory tx = Transaction({
            from: msg.sender,
            to: recipient,
            amount: msg.value,
            note: note,
            timestamp: block.timestamp,
            txHash: txHash,
            exists: true
        });
        
        transactions[txHash] = tx;
        userTransactions[msg.sender].push(txHash);
        userTransactions[recipient].push(txHash);
        allTransactions.push(txHash);
        
        totalTransactions++;
        totalVolume += msg.value;
        
        emit PaymentSent(msg.sender, recipient, msg.value, note, txHash, block.timestamp);
        emit PaymentReceived(recipient, msg.sender, msg.value, note, txHash, block.timestamp);
    }
    
    /**
     * @notice Get transaction details by hash
     * @param txHash Transaction hash
     * @return Transaction struct
     */
    function getTransaction(bytes32 txHash) 
        external 
        view 
        returns (Transaction memory) 
    {
        require(transactions[txHash].exists, "Transaction not found");
        return transactions[txHash];
    }
    
    /**
     * @notice Get all transactions for a user
     * @param user User's wallet address
     * @return Array of transaction hashes
     */
    function getUserTransactions(address user) 
        external 
        view 
        returns (bytes32[] memory) 
    {
        return userTransactions[user];
    }
    
    /**
     * @notice Get transaction count for a user
     * @param user User's wallet address
     * @return count Number of transactions
     */
    function getUserTransactionCount(address user) 
        external 
        view 
        returns (uint256 count) 
    {
        return userTransactions[user].length;
    }
    
    /**
     * @notice Get total number of transactions
     * @return count Total transactions
     */
    function getTotalTransactions() external view returns (uint256 count) {
        return totalTransactions;
    }
    
    /**
     * @notice Get total volume transferred
     * @return volume Total MON transferred
     */
    function getTotalVolume() external view returns (uint256 volume) {
        return totalVolume;
    }
}



