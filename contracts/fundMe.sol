// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./Converter.sol";

error NotOwner();

contract FundMe {
    //ETH to usd : 0x694AA1769357215DE4FAC081bf1f309aDC325306

    using Converter for uint256;

    AggregatorV3Interface public priceFeed;
    address public immutable owner;
    uint256 constant minVal = 10 * 1e18;
    mapping(address => uint256) public funders;
    address[] public fundersAdd;

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor(address priceFeedAddress) {
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    function fund() public payable {
        require(msg.value.getEthUs(priceFeed) >= minVal, "Put more, Bro");
        if (fundersAdd.length > 0) {
            for (uint i = 0; i < fundersAdd.length; i++) {
                if (fundersAdd[i] == msg.sender) break;
                else if (
                    fundersAdd[i] != msg.sender && i == (fundersAdd.length - 1)
                ) fundersAdd.push(msg.sender);
            }
        } else fundersAdd.push(msg.sender);

        funders[msg.sender] += msg.value;
    }

    function withdraw(uint256 amt, address _from) public onlyOwner {
        require(amt <= funders[_from], "You are asking for too much");
        funders[_from] -= amt;

        (bool callSuccess, ) = payable(msg.sender).call{value: amt}("");
        require(callSuccess, "Failure in calling");
    }
}
