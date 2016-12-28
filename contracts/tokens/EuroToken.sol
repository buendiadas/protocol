pragma solidity ^0.4.4;

import "./PreminedAsset.sol";

/// @title EuroToken Contract.
/// @author Melonport AG <team@melonport.com>
/// @notice Premined amount used to make markets
contract EuroToken is PreminedAsset {

    // FILEDS

    // Constant token specific fields
    string public constant name = "Euro Token";
    string public constant symbol = "EUT";
    uint public constant precision = 8;
    uint public constant preminedAmount = 10**10;

    // METHODS

    function EuroToken()
        PreminedAsset(name, symbol, precision, preminedAmount)
    {}
}