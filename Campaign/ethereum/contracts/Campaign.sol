pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimumContribution) public {

        // deploy a new Campaign contract
        // msg.sender for Campaign will be this
        // factory contract, therefore we need to
        // pass the sender address to Campaign contract
        address newCampaign = new Campaign(minimumContribution, msg.sender);

        // add to deployedCampaigns list
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {

    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    constructor(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    // mark the function as payable as
    // user needs to pay to contribute
    function contribute() public payable {
        // check if money contributed
        // is greater than minimum minimumContribution
        require(msg.value >= minimumContribution);

        // change status of approver address in
        // mapping
        approvers[msg.sender] =  true;
        approversCount++;
    }


    // Create a request function
    // only to be called by the manager
    function createRequest(string description, uint value, address recipient)
    public restricted {
        // canot use storage keyword
        // We just need to initialize value properties
        // mapping is a reference property
        // therefore no need to initialize
        Request memory newRequest = Request({
                            description: description,
                            value: value,
                            recipient: recipient,
                            complete: false,
                            approvalCount: 0
                            });

            requests.push(newRequest);
    }


    // approve request
    function approveRequest(uint index) public {
        // create a storage local variable
        Request storage request = requests[index];

        // check if person has contributed
        require(approvers[msg.sender]);

        // check if the sender has not approved before
        // sender has not voted before for this request
        require(!request.approvals[msg.sender]);

        // add to voted list
        request.approvals[msg.sender] = true;

        // increment approvalCount for this request
        request.approvalCount++;
    }


    // Only manager can call this.
    // This will allocate money to the owner of the request
    function finalizeRequest(uint index) public restricted {
        // create a storage local variable
        Request storage request = requests[index];

        // check if votes are more than 50%
        require(request.approvalCount > (approversCount / 2));

        // check if request has been already completed
        require(!request.complete);

        // transfer requested value
        request.recipient.transfer(request.value);

        // set request as complete
        request.complete = true;
    }
}