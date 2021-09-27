import React, { Component } from "react";
import NftTest from "./contracts/NftTest.json";
import getWeb3 from "./getWeb3";
import ipfs from "./ipfs";

import "./App.css";

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    buffer: null,
    ipfsHash: null,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = NftTest.networks[networkId];
      const instance = new web3.eth.Contract(
        NftTest.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.name().call();
    const ipfsHash = await contract.methods.ipsfhash().call();

    // Update state with the result.
    this.setState({ storageValue: response, ipfsHash });
  };

  captureFile = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
    };
  };

  onSubmit = async (event) => {
    event.preventDefault();

    const { accounts, contract } = this.state;

    console.log("this.state.buffer", this.state.buffer);

    const file = await ipfs.add(this.state.buffer);

    this.setState({ ipfsHash: file.path });

    console.log("file.path", file.path);

    await contract.methods.setIpfsHash(file.path).send({ from: accounts[0] });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    console.log("ipfsHash", this.state.ipfsHash);

    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>{this.state.accounts[0]}</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a name of NFT (by default).
        </p>
        <div>The name of the token is: {this.state.storageValue}</div>
        <h2>Upload file to IPFS</h2>
        <br />
        <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} width={200} height={200} />
        <form onSubmit={this.onSubmit}>
          <input type="file" onChange={this.captureFile} />
          <input type="submit" />
        </form>
      </div>
    );
  }
}

export default App;
