pragma solidity ^0.5.0;

import "./Token.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Exchange {
    using SafeMath for uint;
    // Variables
    address public feeAccount; // account that receives exchange fees
    uint public feePercent;
    address constant ETHER = address(0); // store Ether in tokens mapping with blank address
    uint public orderCount;

    // Mappings
    mapping(address => mapping(address => uint)) public tokens;
    mapping(uint => _Order) public orders;
    mapping(uint => bool) public orderCancelled;
    mapping(uint => bool) public orderFilled;

    // Events
    event Deposit(address indexed token, address indexed user, uint amount, uint balance);
    event Withdraw(address indexed token, address indexed user, uint amount, uint balance);
    event Order(uint id, address user, address tokenGet, uint amountGet, address tokenGive, uint amountGive, uint timestamp);
    event Cancel(uint id, address user, address tokenGet, uint amountGet, address tokenGive, uint amountGive, uint timestamp);
    event Trade(uint id, address user, address tokenGet, uint amountGet, address tokenGive, uint amountGive, address userFill, uint timestamp);

    // Structs
    struct _Order {
        uint id;
        address user;
        address tokenGet;
        uint amountGet;
        address tokenGive;
        uint amountGive;
        uint timestamp;
    }

    constructor(address _feeAccount, uint _feePercent) public {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    function() external payable {
        revert();
    }

    function depositEther() public payable {
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }

    function withdrawEther(uint _amount) public {
        require(tokens[ETHER][msg.sender] >= _amount);
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
        msg.sender.transfer(_amount);
        emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
    }

    function depositToken(address _token, uint _amount) public {
        require(_token != ETHER);
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function withdrawToken(address _token, uint _amount) public {
        require(_token != ETHER);
        require(tokens[_token][msg.sender] >= _amount);
        tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
        require(Token(_token).transfer(msg.sender, _amount));
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function balanceOf(address _token, address _user) public view returns(uint) {
        return tokens[_token][_user];
    }

    function makeOrder(address _tokenGet, uint _amountGet, address _tokenGive, uint _amountGive) public {
        orderCount = orderCount.add(1);
        orders[orderCount] = _Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, now);
        emit Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, now);
    }

    function cancelOrder(uint _id) public {
        _Order storage _order = orders[_id];
        require(address(_order.user) == msg.sender);
        require(_order.id == _id);
        require(orderCancelled[_id] == false);
        orderCancelled[_id] = true;
        emit Cancel(_id, msg.sender, _order.tokenGet, _order.amountGet, _order.tokenGive, _order.amountGive, now);
    }

    function fillOrder(uint _id) public {
        require(_id > 0 && _id <= orderCount);
        require(!orderFilled[_id]);
        require(!orderCancelled[_id]);
        _Order storage _order = orders[_id];
        _trade(_order.id, _order.user, _order.tokenGet, _order.amountGet, _order.tokenGive, _order.amountGive);
        orderFilled[_order.id] = true;
    }

    function _trade(uint _orderId, address _user, address _tokenGet, uint _amountGet, address _tokenGive, uint _amountGive) internal {
        uint _feeAmount = _amountGet.mul(feePercent).div(100);

        tokens[_tokenGet][msg.sender] = tokens[_tokenGet][msg.sender].sub(_amountGet.add(_feeAmount));
        tokens[_tokenGet][_user] = tokens[_tokenGet][_user].add(_amountGet);

        tokens[_tokenGet][feeAccount] = tokens[_tokenGet][feeAccount].add(_feeAmount); // Collects Fees
        tokens[_tokenGive][_user] = tokens[_tokenGive][_user].sub(_amountGive);
        tokens[_tokenGive][msg.sender] = tokens[_tokenGive][msg.sender].add(_amountGive);
        emit Trade(_orderId, _user, _tokenGet, _amountGet, _tokenGive, _amountGive, msg.sender, now);
    }
}