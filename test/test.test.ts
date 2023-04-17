// test/Box.test.js
// Load dependencies
import chai from 'chai'
// import { expect } from "chai";
import { artifacts, contract } from "hardhat";
import chaiAsPromised from "chai-as-promised";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { abiUsd } from "../a1_abi";
import dotenv from 'dotenv'
dotenv.config()

const expect = chai.expect
chai.use(chaiAsPromised)


const smartContract = process.env.SM_ADDRESS?.toString()
const holder = process.env.HOLDER?.toString()
const zeroPrivate = process.env.ZERO_PRIVATE?.toString()||''
// Start test block
describe("Scan listing token", function () {
  // Use large integers ('big numbers')

  const web3 = new Web3("http://127.0.0.1:8545");
  const contract = new web3.eth.Contract(abiUsd as AbiItem[], smartContract);
  const zeroWallet = web3.eth.accounts.privateKeyToAccount(
    zeroPrivate
  );
  const zeroAddress = zeroWallet.address

  beforeEach(async () => {
    // this.box = await Box.new({ from: owner });
  });

  it("Balance valid", async function () {
    const balance = await contract.methods
      .balanceOf(holder)
      .call();
    console.log('Valid balance:', balance);
    expect(Number(balance)).gt(0);
  });

  it("Balance inValid", async function () {
    const testAmount = 100
    const zeroBalance = await contract.methods
      .balanceOf(zeroAddress)
      .call();
    console.log('Zero balance:', zeroBalance);
    expect(Number(zeroBalance)).lt(testAmount);
  });

  it("transfer from zeroAddress to holder", async function () {
    const testAmount = 100
    const [holderBalance, zeroBalance] = await Promise.all([
      contract.methods.balanceOf(holder).call(),
      contract.methods.balanceOf(zeroAddress).call(),
    ]); 
    console.log("zero Balance:", zeroBalance);
    expect(Number(zeroBalance)).lt(testAmount);

    const transferMethod = contract.methods.transfer(holder, testAmount).send({
        from: zeroAddress
    })
    await expect(transferMethod).to.be.rejectedWith()
  });


  it("transfer from holder to zero Address", async function () {
    const testAmount = 100
    const [holderBalance, zeroBalance] = await Promise.all([
      contract.methods.balanceOf(holder).call(),
      contract.methods.balanceOf(zeroAddress).call(),
    ]); 
    console.log('balance1:', zeroBalance);
    expect(holderBalance > 0)
    const transaction = await contract.methods.transfer(zeroAddress, testAmount).send({
        from: holder
    })
    const balanceAfter = await contract.methods
    .balanceOf(zeroAddress)
    .call();
    console.log(balanceAfter);
    
    const tx = await web3.eth.getTransactionReceipt(transaction.transactionHash)
    
    expect(Number(balanceAfter)).eq(Number(zeroBalance) + testAmount);
    expect(tx.logs.length).gt(0)
  });

  it("Approve and allowce from holder", async function () {
    const approveAmount = 10;
    const allowance = await contract.methods
      .allowance(holder, zeroAddress)
      .call();
    console.log("allowance:", allowance);

    await contract.methods.approve(zeroAddress, approveAmount).send({
      from: holder,
    });
    const allowAfter = await contract.methods
      .allowance(holder, zeroAddress)
      .call();

    expect(Number(approveAmount)).eq(Number(allowAfter));
  });

  it("TransferFrom zero address to zero", async function () {
    
    const approveAmount = 100000;
    await contract.methods.approve(zeroAddress, approveAmount).send({
      from: holder,
    });
    const allowance = await contract.methods
      .allowance(holder, zeroAddress)
      .call();
    console.log("allowance:", allowance);

    
    expect(Number(allowance)).eq(approveAmount)
    const [ holderBalance,zeroBalance]= await Promise.all([
      contract.methods.balanceOf(holder).call(),
      contract.methods.balanceOf(zeroAddress).call(),
    ])
    
    await contract.methods.transferFrom(holder, zeroAddress, approveAmount).send({
      from: zeroAddress,
    });
    const [ holderBlAfter,zeroBlAfter]= await Promise.all([
      contract.methods.balanceOf(holder).call(),
      contract.methods.balanceOf(zeroAddress).call(),
    ])

    expect(Number(holderBlAfter)).eq(Number(holderBalance) - approveAmount);
    expect(Number(zeroBlAfter)).eq(Number(zeroBalance) + approveAmount);
  });

  it("Token Total supply", async function () {
    const totalSupply = await contract.methods.totalSupply().call();

    expect(Number(totalSupply)).gt(0);
  });

});
