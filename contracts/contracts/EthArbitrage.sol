import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./interfaces/IUniswapV2Router02.sol";

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EthArbitrage is Ownable {
    using SafeMath for uint256;

    IUniswapV2Router02 uniswapRouter;
    address public uniswapRouterAddress = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    IERC20 basics;
    IERC20 stables;
    address public basicAddress;
    address public stableAddress;

    constructor(address tokenAddressBasic, address tokenAddressStable) {
        uniswapRouter = IUniswapV2Router02(uniswapRouterAddress);

        basicAddress = tokenAddressBasic;
        stableAddress = tokenAddressStable;

        basics = IERC20(tokenAddressBasic);
        stables = IERC20(tokenAddressStable);
    }

    function changeStable(address newStableAddress) public onlyOwner {
        stableAddress = newStableAddress;
        stables = IERC20(newStableAddress);
    }

    function changeBasic(address newBasicAddress) public onlyOwner {
        basicAddress = newBasicAddress;
        basics = IERC20(newBasicAddress);
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

    function swapStableToBasic(uint256 amount) public onlyOwner {
        stables.approve(uniswapRouterAddress, amount);

        uniswapRouter.swapExactTokensForTokens(
            amount,
            1000000,
            getPathStableToBasic(),
            address(this),
            block.timestamp + 15
        );
    }

    function swapBasicToStable(uint256 amount) public onlyOwner {
        basics.approve(uniswapRouterAddress, amount);

        uniswapRouter.swapExactTokensForTokens(
            amount,
            1000000,
            getPathBasicToStable(),
            address(this),
            block.timestamp + 15
        );
    }

    function setUniswapRouterAddress(address _uniswapRouterAddress) public onlyOwner
    {
        uniswapRouter = IUniswapV2Router02(_uniswapRouterAddress);
        uniswapRouterAddress = _uniswapRouterAddress;
    }
}