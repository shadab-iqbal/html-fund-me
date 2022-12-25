// require doesn't work in frontend javascript. thus, using import
// auto-complete doesn't add extension by itself. have to manually add it
import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress, goerli_contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const withdrawButton = document.getElementById("withdrawButton");
const balanceButton = document.getElementById("balanceButton");

connectButton.onclick = async function () {
  //checking if metamask is installed or not
  if (typeof window.ethereum === "undefined") {
    alert("Please install Metamask extension!");
  } else {
    try {
      // this the command for connecting our website to the Metamask wallet
      await window.ethereum.request({ method: "eth_requestAccounts" });
      // changing the state of the button
      connectButton.innerHTML = "Connected";
      // alert("Metamask Connected!");
    } catch (error) {
      console.log(error);
    }
  }
};

fundButton.onclick = async function () {
  const ethAmount = document.getElementById("ethAmount").value;
  if (connectButton.innerHTML === "Connected") {
    // to interact with the contract, we need 3 things => provider, signer, contract
    // while using hardhat, these are very easy to access, but as we are using frontend JS here,
    // we need to do these the long way

    // fetching the provider from window.ethereum
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const txResponse = await contract.fund({
      value: ethers.utils.parseEther(ethAmount),
    });
    const tx = await txResponse.wait(1);
    alert("Funding Succesful!");
  } else {
    alert("Please connect your Wallet first!");
  }
};

withdrawButton.onclick = async function () {
  if (connectButton.innerHTML === "Connected") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const txResponse = await contract.withdraw();
    const tx = await txResponse.wait(1);
    alert("Withdraw Succesful!");
  } else {
    alert("Please connect your Wallet first!");
  }
};

balanceButton.onclick = async function () {
  if (connectButton.innerHTML === "Connected") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // previously, we fetched the balance using ethers.provider.getBalance(address)
    // but now, Metamask is our provider, so we have to fetch the balance using metamask
    const balance = await provider.getBalance(contractAddress);
    alert(`Total Funded Amount: ${ethers.utils.formatEther(balance)}`);
  } else {
    alert("Please connect your Wallet first!");
  }
};
