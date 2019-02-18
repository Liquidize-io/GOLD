const BigNumber = web3.BigNumber;

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();


const AssetInfo         = require("./AssetInfo.js");
const WithdrawalToken   = require("./WithdrawalToken.js");
const CompliantToken    = require("./CompliantToken.js");
const BurnableExToken   = require("./BurnableExToken.js");
const TokenWithFees    = require("./TokenWithFees.js");
const TraceableToken   = require("./TraceableToken.js");
const CanReclaimToken   = require("./zeppelin/contracts/ownership/CanReclaimToken.js");
const Contactable       = require("./zeppelin/contracts/ownership/Contactable.js");
const CanDelegateToken  = require("./delegate/CanDelegateToken.js");
const DelegateToken     = require("./delegate/DelegateToken.js");
const ClaimableEx       = require("./ownership/ClaimableEx.js");
const StandartToken     = require("./base-token/StandardToken.js");
const MintableToken     = require("./base-token/MintableToken.js");
const PausableToken     = require("./base-token/PausableToken.js");


const GOLDToken = artifacts.require("./GOLDToken.sol");

contract('GOLDToken', function (accounts) {
  let token;
  var systemWallet = accounts[7];
  var investor = accounts[1];

  let tokenName = "GOLD Token";
  let tokenSymbol = "GOLD";
  let publicDoc = 'https://tinyurl.com/GOLD';

  before(async function () {
    token = await GOLDToken.deployed();
  });

  describe('changeTokenName()', function() {
    it('Should allow owner to set new name and symbol', async function() {
      let _oldTokenName = await token.name();
      let _oldTokenSymbol = await token.symbol();
      let _newTokenName = "GOLD Token";
      let _newTokenSymbol = "GOLD";
      assert.notEqual(_oldTokenName, _newTokenName);
      assert.notEqual(_oldTokenSymbol, _newTokenSymbol);

      const {logs} = await token.changeTokenName(_newTokenName, _newTokenSymbol);
      let _currName = await token.name();
      let _currSymbol = await token.symbol();

      assert.equal(_currName, _newTokenName);
      assert.equal(_currSymbol, _newTokenSymbol);

      // Should log event
      const event = logs.find(e => e.event === 'ChangeTokenName');
      event.should.exist;
      (event.args.newName).should.equal(_newTokenName);
      (event.args.newSymbol).should.equal(_newTokenSymbol);
    });

    it('Should reject non-owner to set new name and symbol', async function() {
      let _newTokenName = "GOLD Token";
      let _newTokenSymbol = "GOLD";
      await token.changeTokenName(_newTokenName, _newTokenSymbol, {from: investor}).should.be.rejected;
    });
  });

  describe('AssetInfo', function() {
    AssetInfo.check(accounts, deployContract);
  });

  describe('Contactable', function() {
    Contactable.check(accounts, deployContract);
  });

  describe('CanReclaimToken', function() {
    CanReclaimToken.check(accounts, deploy, deployContract);
  });

  describe('ClaimableEx', function() {
    ClaimableEx.check(accounts, deployContract);
  });

  describe('TokenWithFees', function() {
    TokenWithFees.check(accounts, deployContract);
  });

  describe('TraceableToken', function() {
    TraceableToken.check(accounts, deployContract);
  });

  describe('StandardToken', function() {
    StandartToken.check(accounts, deployContract);
  });

  describe('MintableToken', function() {
    MintableToken.check(accounts, deployContract)
  });

  describe('PausableToken', function() {
    PausableToken.check(accounts, deployContract)
  });

  describe('WithdrawalToken', function() {
    WithdrawalToken.check(accounts, deployContract)
  });

  describe('CompliantToken', function() {
    CompliantToken.check(accounts, deployContract);
  });

  describe('DelegateToken', function() {
    DelegateToken.check(accounts, deployContract);
  });

  describe('CanDelegateToken', function() {
    CanDelegateToken.check(accounts, deploy, deployContract);
  });

  describe('BurnableExToken', function() {
    BurnableExToken.check(accounts, deployContract);
  });

  async function deploy() {
    var _token = await GOLDToken.new(tokenName, tokenSymbol, publicDoc, systemWallet);
    return _token;
  }

  async function deployContract() {
    return deploy();
  }
})
