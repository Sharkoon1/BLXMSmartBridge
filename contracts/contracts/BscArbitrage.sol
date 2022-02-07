import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./interfaces/IPancakeRouter02.sol";

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BscArbitrage is Ownable {
	event ChangedStable(address stable);
	event ChangedBasic(address basic);
    using SafeMath for uint256;

    IPancakeRouter02 pancakeRouter;
    address public pancakeRouterAddress = 0xD99D1c33F9fC3444f8101754aBC46c52416550D1;

    IERC20 basics;
    IERC20 stables;
    address public basicAddress;
    address public stableAddress;

    constructor(address tokenAddressBasic, address tokenAddressStable) {
        pancakeRouter = IPancakeRouter02(pancakeRouterAddress);

        basicAddress = tokenAddressBasic;
        stableAddress = tokenAddressStable;

        basics = IERC20(tokenAddressBasic);
        stables = IERC20(tokenAddressStable);
    }

    function changeStable(address newStableAddress) public onlyOwner {
        stableAddress = newStableAddress;
        stables = IERC20(newStableAddress);
		emit ChangedStable(newStableAddress);
    }

    function changeBasic(address newBasicAddress) public onlyOwner {
        basicAddress = newBasicAddress;
        basics = IERC20(newBasicAddress);
		emit ChangedBasic(newBasicAddress);
    }

    function withdrawStable(uint256 amount) public onlyOwner returns (uint256) {
        require(stables.transfer(msg.sender, amount));
        return (amount);
    }

    function withdrawBasic(uint256 amount) public onlyOwner returns (uint256) {
        require(basics.transfer(msg.sender, amount));
        return (amount);
    }

     function getPathBasicToStable() public view returns (address[] memory) {
        address[] memory path = new address[](2);
        path[0] = basicAddress;
        path[1] = stableAddress;

        return path;
    }

    function getPathStableToBasic() public view returns (address[] memory) {
        address[] memory path = new address[](2);
        path[0] = stableAddress;
        path[1] = basicAddress;

        return path;
    }

    function swapStableToBasic(uint256 amount, uint256 minAmountOut) public onlyOwner {
        stables.approve(pancakeRouterAddress, amount);

        pancakeRouter.swapExactTokensForTokens(
            amount,
            minAmountOut,
            getPathStableToBasic(),
            address(this),
            block.timestamp + 1200
        );
    }

    function swapBasicToStable(uint256 amount, uint256 minAmountOut) public onlyOwner {
        basics.approve(pancakeRouterAddress, amount);

        pancakeRouter.swapExactTokensForTokens(
            amount,
            minAmountOut,
            getPathBasicToStable(),
            address(this),
            block.timestamp + 1200
        );
    }

    function setpancakeRouterAddress(address _pancakeRouterAddress) public onlyOwner
    {
        pancakeRouter = IPancakeRouter02(_pancakeRouterAddress);
        pancakeRouterAddress = _pancakeRouterAddress;
    }
}