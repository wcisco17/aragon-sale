pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";


contract CarteBlanche is AragonApp {
        // Name
    string public name = "Carte Blanche Token";
    string public symbol = "CB";
    string public standard = "Carte Blanche Token v1.0";
    string private error;
    uint256 public totalSupply;

    event Transfer (
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;

    constructor (uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

        // Transfer
    function transfer(address _to, uint256 _value) public returns (bool success) {
        // Check if what the users sends is higher then the value that they have. if and else (statement)
        error = "Error Not enough value";
        require(balanceOf[msg.sender] >= _value, error);

        //  Transfer value deducting balance to one account adding it to another
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        // Transfer Messages to the value.
        emit Transfer(msg.sender, _to, _value);

        return true;
    }

}