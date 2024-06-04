// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "./PACTConvert.sol";
import "./PACTToken.sol";

contract PACTNewTokenDeployer {
    address public immutable oldToken;
    address public immutable tokenReceiver;
    address public immutable operator;
    bool public isDeployed;

    constructor(address _oldToken, address _tokenReceiver, address _operator) {
        oldToken = _oldToken;
        tokenReceiver = _tokenReceiver;
        operator = _operator;
    }

    function deployNew() external {
        require(msg.sender == operator, "Only operator");
        require(isDeployed == false, "Already deployed");
        PACTToken newPact = new PACTToken(address(this));
        PACTConvert convert = new PACTConvert(
            address(newPact),
            oldToken,
            block.timestamp,
            block.timestamp + (60 * 60 * 24 * 365),
            100
        );
        newPact.transfer(address(convert), 10_000_000_000e18);
        newPact.transfer(tokenReceiver, 90_000_000_000e18);
        convert.grantRole(convert.DEFAULT_ADMIN_ROLE(), operator);
        convert.grantRole(convert.WHITELISTER_ROLE(), operator);
        convert.grantRole(convert.PAUSER_ROLE(), operator);
        isDeployed = true;
    }
}
