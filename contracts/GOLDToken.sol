pragma solidity ^0.4.24;

import './zeppelin/contracts/ownership/Contactable.sol';

import './base-token/PausableToken.sol';
import './delegate/CanDelegateToken.sol';
import './delegate/DelegateToken.sol';
import './AssetInfo.sol';
import './BurnableExToken.sol';
import './CompliantToken.sol';
import './TokenWithFees.sol';
import './WithdrawalToken.sol';


/**
 * @title GOLD token.
 * @dev GOLD is a ERC20 token that:
 *  - has no tokens limit.
 *  - mints new tokens for each new property (real asset).
 *  - can pause and unpause token transfer (and authorization) actions.
 *  - token holders can be distributed profit from asset manager.
 *  - contains real asset information.
 *  - can delegate to a new contract.
 *  - can enforce burning all tokens.
 *  - transferring tokens to 0x0 address is treated as burning.
 *  - transferring tokens with fees are sent to the system wallet.
 *  - attempts to check KYC/AML and Blacklist using Registry.
 *  - attempts to reject ERC20 token transfers to itself and allows token transfer out.
 *  - attempts to reject ether sent and allows any ether held to be transferred out.
 *  - allows the new owner to accept the ownership transfer, the owner can cancel the transfer if needed.
 **/
contract GOLDToken is Contactable, AssetInfo, BurnableExToken, CanDelegateToken, DelegateToken, TokenWithFees, CompliantToken, WithdrawalToken, PausableToken {
  string public name = "Liquid GOLD";
  string public symbol = "XGOLD";
  uint8 public constant decimals = 18;

  event ChangeTokenName(string newName, string newSymbol);

  /**
   * @param _name Name of this token.
   * @param _symbol Symbol of this token.
   */
  constructor(
    string _name,
    string _symbol,
    string _publicDocument,
    address _wallet
  )
    public
    AssetInfo(_publicDocument)
    TokenWithFees(_wallet)
  {
    name = _name;
    symbol = _symbol;
    contactInformation = 'https://rax.exchange/';
  }

  function changeTokenName(string _name, string _symbol) public onlyOwner {
    name = _name;
    symbol = _symbol;
    emit ChangeTokenName(_name, _symbol);
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a new owner.
   * @param _newOwner The address to transfer ownership to.
   */
  function transferOwnership(address _newOwner) onlyOwner public {
    // do not allow self ownership
    require(_newOwner != address(this));
    super.transferOwnership(_newOwner);
  }
}
