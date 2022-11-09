// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract BuyMeACoffee {
  // Event to emit when a Memo is created
  event NewMemo(
    address indexed from,
    uint256 time,
    string name,
    string message
  );

  // Memo structure
  struct Memo {
    address from;
    uint256 time;
    string name;
    string message;
  }

  // List of all memos received
  Memo[] memos;

  // Owner address
  address payable owner;
  address payable withdrawAddress;

  // Deploy logic, it runs only first time!!
  constructor() {
    owner = payable(msg.sender);
    withdrawAddress = owner;
  }

  /**
  * @dev change owner address
  * @param _newAddress new address
  */
  function updateOwnerAddress(address _newAddress) public {
    require(payable(msg.sender) == owner, 'You not are the owner!');
    withdrawAddress = payable(_newAddress);
  }

  /**
  * @dev buy a coffee for contract owner
  * @param _name name of the coffee buyer
  * @param _message a nice message from the coffee buyer
  */
  function buyCoffee(string memory _name, string memory _message) public payable {
    require(msg.value > 0, "You can't buy a coffee with 0 eth");

    // Create a new Memo and push inside the storage
    memos.push(Memo(msg.sender, block.timestamp, _name, _message));

    // Emit Memo event
    emit NewMemo(msg.sender, block.timestamp, _name, _message);
  }

  /**
  * @dev sent the entire balance stored inside this contract to the owner
  */
  function withdrawTips() public {
    // address(this).balance > contains all balance inside the contract
    require(withdrawAddress.send(address(this).balance));
  }

  /**
  * @dev retrive all the memos received and stores on the blockchain
  */
  function getMemos() public view returns(Memo[] memory) {
    return memos;
  }
}
