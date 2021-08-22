import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import NftImage from '../abis/NftImage.json'
import ipfs from './ipfs';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    const networkData = NftImage.networks[networkId]
    if(networkData) {
      const abi = NftImage.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract })
      const totalSupply = await contract.methods.totalSupply().call()
      this.setState({ totalSupply })
      // Load Images
      for (var i = 1; i <= totalSupply; i++) {
        const image = await contract.methods.images(i - 1).call()
        const owner = await contract.methods.ownerOf(i).call();
        if(this.state.account === owner) {
          this.setState({
            images: [...this.state.images, { id: i, hash: image}]
          })
        }
      }
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  mint = (imageHash) => {
    this.state.contract.methods.mint(imageHash).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({
        images: [...this.state.images, imageHash]
      })
      window.location.reload()
    })
  }

  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result)})
    }
  }

  onSubmit = (event) => {
    event.preventDefault()
    ipfs.files.add(this.state.buffer, (error, result) => {
      if (error) {
        console.log(error);
        return;
      }
      this.setState({ ipfsHash: result[0].hash })
      this.mint(result[0].hash);
    })
  }

  transferNft = async (imageHash, address) => {
    console.log(this.state.account);
    const result = await this.state.contract.methods.safeTransferFrom(this.state.account, address.value, imageHash.value).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        window.location.reload()
      })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      buffer: null,
      ipfsHash: '',
      contract: null,
      totalSupply: 0,
      images: []
    }

    this.captureFile = this.captureFile.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.transferNft = this.transferNft.bind(this)
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            NFT Image Token
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <div className="col-md-6">
              <div className="content mr-auto ml-auto">
                  <h1>Issue NFT Token</h1>
                  <form onSubmit={this.onSubmit}>
                    <input
                      type='file'
                      accept="image/png, image/jpeg"
                      className='form-control mb-1'
                      onChange={this.captureFile}

                    />
                    <input
                      type='submit'
                      className='btn btn-block btn-primary'
                      value='MINT'
                    />
                  </form>
                </div>
            </div>

            <div className="col-md-6">
              <div className="content mr-auto ml-auto">
                  <h1>Transfer NFT</h1>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    this.transferNft(this.imageHash, this.address)
                  }}>
                    <input
                      type='text'
                      className='form-control mb-1'
                      placeholder="Enter NFT Token ID"
                      ref={(input) => { this.imageHash = input }}
                    />
                    <input
                      type='text'
                      className='form-control mb-1'
                      placeholder="Enter Address"
                      ref={(input) => { this.address = input }}
                    />
                    <input
                      type='submit'
                      className='btn btn-block btn-primary'
                      value='Transfer'
                    />
                  </form>
                </div>
            </div>
          </div>
          <hr/>
          <h3>My NFTs</h3>
          <div className="row">
            { this.state.images.map((image, key) => {
              return(
                <div key={key} className="col-md-3 mb-3">
                  <img style={{ 'height' : '200px' }}src={"https://ipfs.io/ipfs/" + image.hash} />
                  Token ID: {image.id}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
