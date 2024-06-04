// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "./ubeswap/voting/TransferrableVotingToken.sol";

contract PACTToken is TransferrableVotingToken {
    /// @notice The maximum supply of PACT Tokens.
    uint128 public constant MAX_SUPPLY = 100_000_000_000e18;

    /**
     * @notice Construct a new PACT Token
     * Note: this contract doesn't specify an initial minter, so there is no way new
     * tokens can get created.
     * @param _initialOwner The initial account to grant all the tokens
     */
    constructor(
        address _initialOwner
    ) TransferrableVotingToken("impactMarket", "PACT", 18, MAX_SUPPLY, _initialOwner) {}
}
