const NftImage = artifacts.require('./NFtImage.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('NftImage', (accounts) => {
  let contract

  before(async () => {
    contract = await NftImage.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = contract.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await contract.name()
      assert.equal(name, 'NftImage')
    })

    it('has a symbol', async () => {
      const symbol = await contract.symbol()
      assert.equal(symbol, 'NFTIMAGE')
    })

  })

  describe('minting', async () => {

    it('creates a new token', async () => {
      const result = await contract.mint('HASH1')
      const totalSupply = await contract.totalSupply()
      // SUCCESS
      assert.equal(totalSupply, 1)
      const event = result.logs[0].args
      assert.equal(event.tokenId.toNumber(), 1, 'id is correct')
      assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
      assert.equal(event.to, accounts[0], 'to is correct')

      // FAILURE: cannot mint same image twice
      await contract.mint('HASH1').should.be.rejected;
    })
  })

  describe('indexing', async () => {
    it('lists images', async () => {
      // Mint 3 more tokens
      await contract.mint('HASH2')
      await contract.mint('HASH3')
      await contract.mint('HASH4')
      const totalSupply = await contract.totalSupply()

      let image
      let result = []

      for (var i = 1; i <= totalSupply; i++) {
        image = await contract.images(i - 1)
        result.push(image)
      }

      let expected = ['HASH1', 'HASH2', 'HASH3', 'HASH4']
      assert.equal(result.join(','), expected.join(','))
    })
  })

})
