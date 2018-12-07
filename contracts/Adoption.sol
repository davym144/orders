pragma solidity ^0.4.17;

contract Orders {

  address[16] public siteOrderers;

  function adopt(uint8 siteId) public returns (uint8) {
    require(siteId >= 0 && siteId <= 15);
    siteOrderers[siteId] = msg.sender;
    return siteId;
  }

  function getsiteOrderers() public view returns (address[16]) {
    return siteOrderers;
  }
}
