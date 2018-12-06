pragma solidity ^0.4.24;

import "./CarteBlanche.sol";
import "@aragon/os/contracts/apps/AragonApp.sol";


contract CarteBlancheSale is AragonApp {
    address admin;
    CarteBlanche public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokenSold;

    event Sell(
        address _buyer,
        uint256 _amount
    );

    constructor(CarteBlanche _tokenContract, uint256 _tokenPrice) public {
        // Assign an Admin to as the sender
        admin = msg.sender;
        // Token Contract
        tokenContract = _tokenContract;
        // Token Price
        tokenPrice = _tokenPrice;
    }

    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }

    // Buying tokens
    function buyTokens(uint256 _numberOfTokens) public payable {
        require(msg.value == multiply(_numberOfTokens, tokenPrice), "Error");
        require(tokenContract.balanceOf(this) >= _numberOfTokens, "Error");
        require(tokenContract.transfer(msg.sender, _numberOfTokens), "Error");
        // Require that a transfer is successful


        // Keep track of numbers of tokens sold
        tokenSold += _numberOfTokens;
        // Trigger a sell event
        emit Sell(msg.sender, _numberOfTokens);
    }

    function endSale() public {
        // Only an admin can end the sale
        require(msg.sender == admin, "Error");
        // Transfer remaining Dapp tokens to Admin
        require(tokenContract.transfer(admin, tokenContract.balanceOf(this)), "Error");
        // Destroy this contract
        selfdestruct(admin);
    }
}