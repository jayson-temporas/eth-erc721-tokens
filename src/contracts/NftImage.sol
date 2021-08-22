pragma solidity 0.5.0;

import "./ERC721Full.sol";

contract NftImage is ERC721Full {
  string[] public images;
  mapping(string => bool) _imageExists;

  constructor() ERC721Full("NftImage", "NFTIMAGE") public {
  }

  // E.G. hash = "hash from ipfs"
  function mint(string memory _image) public {
    require(!_imageExists[_image]);
    uint _id = images.push(_image);
    _mint(msg.sender, _id);
    _imageExists[_image] = true;
  }

}
