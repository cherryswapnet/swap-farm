// SPDX-License-Identifier: WTL
pragma solidity 0.6.12;

import '../libraries/cherry-swap-lib/contracts/token/BEP20/IBEP20.sol';

contract CherrySwapVoterProxy {
    // SYRUP
    address public constant votes = 0x67762b58f07a1f99b5054794a351Bc30f398f7E3;

    function decimals() external pure returns (uint8) {
        return uint8(18);
    }

    function name() external pure returns (string memory) {
        return 'SYRUPVOTE';
    }

    function symbol() external pure returns (string memory) {
        return 'SYRUP';
    }

    function totalSupply() external view returns (uint256) {
        return IBEP20(votes).totalSupply();
    }

    function balanceOf(address _voter) external view returns (uint256) {
        return IBEP20(votes).balanceOf(_voter);
    }

    constructor() public {}
}