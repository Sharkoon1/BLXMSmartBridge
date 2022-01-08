import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./interfaces/IUniswapV2Router02.sol";

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Arbitrage is Ownable {
    using SafeMath for uint256;

    IERC20 blxm;
    IERC20 stables;

   constructor(address tokenAddressBlxm, address tokenAddressStable) {
        blxm = IERC20(tokenAddressBlxm);
        stables = IERC20(tokenAddressStable);
    }

    function changeStable(address newStableAddress) public onlyOwner {
        stables = IERC20(newStableAddress);
    }

    function changeBlxm(address newBlxmAddress) public onlyOwner {
        blxm = IERC20(newBlxmAddress);
    }
    
    function withdrawStable(uint256 amount) public onlyOwner returns (uint256) {
        require(stables.transfer(msg.sender, amount));
        return (amount);
    }

    function withdrawBlxm(uint256 amount) public onlyOwner returns (uint256) {
        require(blxm.transfer(msg.sender, amount));
        return (amount);
    }
}