pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;

    // assign the contract creater as manager
    // of the contract
    constructor() public {
        manager = msg.sender;
    }

    // enters a player to the list
    function enter() public payable{
        // constraint that a player should
        // send atleast 0.01 ether to enter
        // lottery
        require(msg.value >= 0.01 ether);

        // add player to the list
        players.push(msg.sender);
    }

    // picks a random winner from the list of
    // players
    // restricted is a modifier
    function pickWinner() public restricted{
        // only manager should be able to
        // call pickWinner
        // added in modifier
        // require(msg.sender == manager);

        uint index = random() % players.length;
        address winner = players[index];

        // transfer money in this contract
        winner.transfer(this.balance);

        // empty list to start another
        // round of lottery
        // new dynamic array initial length = 0
        players = new address[](0);
    }

    // returns list of all players
    function getPlayers() public view returns (address[]) {
        return players;
    }

    // can be used in multiple placed
    // can have any name
    // can be used for repetitive logic
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    // pseudo random number generator
    function random() private view returns (uint) {
        return uint(keccak256(block.difficulty, now, players));
    }
}