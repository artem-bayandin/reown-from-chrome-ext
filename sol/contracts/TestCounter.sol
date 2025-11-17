// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TestCounter {
    uint256 public count;

    function increment() public {
        count++;
    }

    function decrement() public {
        count--;
    }
}
