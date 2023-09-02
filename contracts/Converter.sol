// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

//all functions in a library are internal and it cannot have static values
//val1.fun(val2, val3,...); (Syntax for imported functions fun() which takes params val1, val2, val3, ...)

library Converter {
    function getUsPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        // AggregatorV3Interface priceFeed = AggregatorV3Interface(
        //     0x694AA1769357215DE4FAC081bf1f309aDC325306
        // );
        (, int price, , , ) = priceFeed.latestRoundData();
        return uint256(price * 1e10); // us price is thousands and wei is in 18 zeroes so as to match them, we multiply be 10zeroes
    }

    function getEthUs(
        uint256 ethAmt,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        return ((ethAmt * getUsPrice(priceFeed)) / 1e18);
    }
}
