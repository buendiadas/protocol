pragma solidity ^0.4.11;

/// @title Version Protocol Contract
/// @author Melonport AG <team@melonport.com>
/// @notice This is to be considered as a protocol on how to access the underlying Version Contract
contract VersionProtocol {
  function numCreatedVaults() constant returns (uint) {}
  function getVault(uint atIndex) constant returns (address) {}
  function createVault(
      string withName,
      address ofUniverse,
      address ofSubscribe,
      address ofRedeem,
      address ofRiskMgmt,
      address ofManagmentFee,
      address ofPerformanceFee
  )
      returns (address)
  {}
  function annihilateVault(uint atIndex) {}    
}
