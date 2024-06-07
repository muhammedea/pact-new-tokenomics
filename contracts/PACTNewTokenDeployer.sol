// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "./PACTConvert.sol";
import "./PACTToken.sol";

contract PACTNewTokenDeployer {
    address public immutable oldToken;
    address public immutable operator;
    bool public isDeployed;

    constructor(address _oldToken) {
        oldToken = _oldToken;
        operator = msg.sender;
    }

    function deployNewPact() external {
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
        newPact.transfer(address(convert), 5_000_000_000e18);
        newPact.transfer(0x59aAc0b8bd03b7Ba9D391Eb989c3Ea8CdE638144, 25_000_000_000e18);
        newPact.transfer(0xBD11CaeA0a854ba328e202ceD2F0269fD8027c6e, 25_000_000_000e18);
        newPact.transfer(0x213962Ba8e4cef1D618c88d62D2FFA39eC5Eb22D, 30_000_000_000e18);
        newPact.transfer(0x3844cb665cf676B1Eb7C896E04D3E9eC3BAB5a75, 15_000_000_000e18);
        convert.grantRole(convert.DEFAULT_ADMIN_ROLE(), operator);
        convert.grantRole(convert.WHITELISTER_ROLE(), operator);
        convert.grantRole(convert.PAUSER_ROLE(), operator);
        isDeployed = true;
    }
}
