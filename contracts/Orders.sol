pragma solidity ^0.4.17;

contract Orders {

  address[16] public siteOrderers;

  function order(uint8 siteId) public returns (uint8) {
    require(siteId >= 0 && siteId <= 15);
    siteOrderers[siteId] = msg.sender;
    return siteId;
  }

  function getSiteOrderers() public view returns (address[16]) {
    return siteOrderers;
  }
}
