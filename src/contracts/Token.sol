pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Token {
    using SafeMath for uint;

    // Variables
    string public name = "Meme Token";
    string public symbol = "MEME";
    uint256 public decimals = 18;
    uint256 public totalSupply;
    mapping(address => uint) public balanceOf;

    // Events
    event Transfer(address indexed from, address indexed to, uint value);

    constructor() public {
        totalSupply = 10000 * (10 ** decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "You don't have enough tokens");
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

}