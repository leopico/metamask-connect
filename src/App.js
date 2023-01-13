import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import avator from "./images/avator.png";
import ethLogo from "./images/eth_logo.png";
import "./App.css";

function Home() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [connect, setConnect] = useState(false);
  const [balance, setBalance] = useState("");

  const failMessage = "Please install MetaMask or connect your MetaMask";
  const successMessage = "Your account is successfully connected";

  const provider = new ethers.providers.JsonRpcProvider(
    `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`
  );

  const checkIfWalletConnected = async () => {
    if (!window.ethereum) return; //this fn will show after connect wallet cause just check condition with window.ethereum

    const accounts = await window.ethereum.request({ method: "eth_accounts" });

    if (accounts.length) {
      //this is more than one account
      setCurrentAccount(accounts[0]);
    } else {
      return failMessage;
      // console.log('fail');
    }

    const address = "0xDAFEA492D9c6733ae3d56b7Ed1ADB60692c98Bc5";
    const balance = await provider.getBalance(address);
    const showBalance = ethers.utils.formatEther(balance);
    setBalance(showBalance);
    // console.log(showBalance);
  };

  const CWallet = async () => {
    if (!window.ethereum) return console.log(failMessage);

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setCurrentAccount(accounts[0]);
    setConnect(true);
    window.location.reload();
  };

  useEffect(() => {
    checkIfWalletConnected();
  });

  const accountChanged = async () => {
    window.ethereum.on("accountChanged", async function () {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        //this is more than one account
        setCurrentAccount(accounts[0]);
      } else {
        window.location.reload();
      }
    });
  };

  useEffect(() => {
    accountChanged();
  }, []);

  return (
    <div className="card-container">
      {!currentAccount ? "" : <span className="pro">PRO</span>}
      <img
        src={avator}
        style={{ height: "100px", width: "100px" }}
        alt="profile"
      />
      <h3>Check Ether</h3>

      {!currentAccount ? (
        <div>
          <div className="message">
            <p>{failMessage}</p>
          </div>
          <div>
            <img
              src={ethLogo}
              style={{ height: "150px", width: "150px" }}
              alt="ether"
            />
            <p>Welcome to ether account balance checker</p>
          </div>
        </div>
      ) : (
        <div>
          <h6>
            verified <span className="tick">&#10004;</span>
          </h6>
          <p>
            Ether account and balance checker
            <br />
            find account details
          </p>
          <div className="buttons">
            <button className="primary ghost" onClick={() => {}}>
              Ether Account Details
            </button>
          </div>
        </div>
      )}

      {!currentAccount && !connect ? (
        <div>
          <button className="primary" onClick={() => CWallet()}>
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="skills">
          <h6>{successMessage}</h6>
          <ul>
            <li>Account</li>
            <li>{currentAccount}</li>
            <li>balance</li>
            <li>{balance}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Home;
