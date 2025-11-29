// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./HandleRegistry.sol";

/**
 * @title PaymentRequest
 * @notice Manages payment requests (QR codes) for requesting payments
 * @dev Stores payment request data that can be fulfilled later
 */
contract PaymentRequest {
    // Events
    event PaymentRequestCreated(
        bytes32 indexed requestId,
        address indexed requester,
        string requesterHandle,
        uint256 amount,
        string note,
        uint256 expiry,
        uint256 timestamp
    );
    
    event PaymentRequestFulfilled(
        bytes32 indexed requestId,
        address indexed payer,
        address indexed requester,
        uint256 amount,
        uint256 timestamp
    );
    
    event PaymentRequestCancelled(
        bytes32 indexed requestId,
        address indexed requester,
        uint256 timestamp
    );
    
    // State variables
    HandleRegistry public handleRegistry;
    
    struct Request {
        bytes32 requestId;
        address requester;
        string requesterHandle;
        uint256 amount;
        string note;
        uint256 expiry; // Unix timestamp
        bool fulfilled;
        bool cancelled;
        uint256 createdAt;
    }
    
    mapping(bytes32 => Request) public requests;
    mapping(address => bytes32[]) public userRequests; // user => request IDs
    
    uint256 public totalRequests;
    
    constructor(address _handleRegistry) {
        handleRegistry = HandleRegistry(_handleRegistry);
    }
    
    /**
     * @notice Create a payment request
     * @param amount Amount requested in MON (wei)
     * @param note Optional note/description
     * @param expiry Expiry timestamp (0 for no expiry)
     * @return requestId The generated request ID
     */
    function createRequest(
        uint256 amount,
        string memory note,
        uint256 expiry
    ) external returns (bytes32 requestId) {
        require(amount > 0, "Amount must be greater than 0");
        
        // Get requester's handle
        string memory requesterHandle = handleRegistry.getHandleByAddress(msg.sender);
        require(bytes(requesterHandle).length > 0, "Requester must have a handle");
        
        // Generate request ID
        requestId = keccak256(
            abi.encodePacked(
                msg.sender,
                amount,
                block.timestamp,
                block.number,
                note
            )
        );
        
        // Check expiry
        require(expiry == 0 || expiry > block.timestamp, "Expiry must be in the future");
        
        Request memory request = Request({
            requestId: requestId,
            requester: msg.sender,
            requesterHandle: requesterHandle,
            amount: amount,
            note: note,
            expiry: expiry,
            fulfilled: false,
            cancelled: false,
            createdAt: block.timestamp
        });
        
        requests[requestId] = request;
        userRequests[msg.sender].push(requestId);
        totalRequests++;
        
        emit PaymentRequestCreated(
            requestId,
            msg.sender,
            requesterHandle,
            amount,
            note,
            expiry,
            block.timestamp
        );
        
        return requestId;
    }
    
    /**
     * @notice Fulfill a payment request
     * @param requestId The request ID to fulfill
     * @dev Transfers MON to requester and marks request as fulfilled
     */
    function fulfillRequest(bytes32 requestId) external payable {
        Request storage request = requests[requestId];
        require(request.requester != address(0), "Request not found");
        require(!request.fulfilled, "Request already fulfilled");
        require(!request.cancelled, "Request was cancelled");
        require(msg.value >= request.amount, "Insufficient payment amount");
        
        // Check expiry
        if (request.expiry > 0) {
            require(block.timestamp <= request.expiry, "Request has expired");
        }
        
        // Transfer MON to requester
        (bool success, ) = request.requester.call{value: request.amount}("");
        require(success, "Transfer failed");
        
        // Mark as fulfilled
        request.fulfilled = true;
        
        // Refund excess payment
        if (msg.value > request.amount) {
            payable(msg.sender).transfer(msg.value - request.amount);
        }
        
        emit PaymentRequestFulfilled(
            requestId,
            msg.sender,
            request.requester,
            request.amount,
            block.timestamp
        );
    }
    
    /**
     * @notice Cancel a payment request (only by requester)
     * @param requestId The request ID to cancel
     */
    function cancelRequest(bytes32 requestId) external {
        Request storage request = requests[requestId];
        require(request.requester == msg.sender, "Only requester can cancel");
        require(!request.fulfilled, "Request already fulfilled");
        require(!request.cancelled, "Request already cancelled");
        
        request.cancelled = true;
        
        emit PaymentRequestCancelled(requestId, msg.sender, block.timestamp);
    }
    
    /**
     * @notice Get request details
     * @param requestId The request ID
     * @return Request struct
     */
    function getRequest(bytes32 requestId) 
        external 
        view 
        returns (Request memory) 
    {
        require(requests[requestId].requester != address(0), "Request not found");
        return requests[requestId];
    }
    
    /**
     * @notice Get all requests for a user
     * @param user User's wallet address
     * @return Array of request IDs
     */
    function getUserRequests(address user) 
        external 
        view 
        returns (bytes32[] memory) 
    {
        return userRequests[user];
    }
    
    /**
     * @notice Check if a request is valid (not fulfilled, not cancelled, not expired)
     * @param requestId The request ID to check
     * @return valid True if request is valid
     */
    function isRequestValid(bytes32 requestId) external view returns (bool valid) {
        Request memory request = requests[requestId];
        
        if (request.requester == address(0)) return false;
        if (request.fulfilled) return false;
        if (request.cancelled) return false;
        if (request.expiry > 0 && block.timestamp > request.expiry) return false;
        
        return true;
    }
}

