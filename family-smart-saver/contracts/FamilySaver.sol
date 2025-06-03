// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FamilySaver is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _goalIdCounter;

    struct Goal {
        address creator;
        string name;
        uint256 target;
        uint256 deadline;
        uint256 saved;
        bool isAchieved;
    }

    struct Contribution {
        address contributor;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(uint256 => Goal) public goals;
    mapping(uint256 => Contribution[]) public contributions;
    mapping(uint256 => string) private _tokenURIs;
    mapping(address => uint256[]) private _userGoals;

    event GoalCreated(uint256 goalId, address creator);
    event ContributionMade(uint256 goalId, address contributor, uint256 amount);
    event GoalAchieved(uint256 goalId, address achiever);
    event Withdrawal(uint256 goalId, address creator, uint256 amount);

    constructor() ERC721("FamilySaverNFT", "FAMSAVE") {}

    function createGoal(string memory _name, uint256 _target, uint256 _durationInDays) external {
        uint256 goalId = _goalIdCounter.current();
        uint256 deadline = block.timestamp + (_durationInDays * 1 days);
        
        goals[goalId] = Goal({
            creator: msg.sender,
            name: _name,
            target: _target,
            deadline: deadline,
            saved: 0,
            isAchieved: false
        });
        
        _userGoals[msg.sender].push(goalId);
        _goalIdCounter.increment();
        
        emit GoalCreated(goalId, msg.sender);
    }

    function contribute(uint256 _goalId) external payable {
        Goal storage goal = goals[_goalId];
        require(block.timestamp < goal.deadline, "Deadline has passed");
        require(!goal.isAchieved, "Goal already achieved");
        require(msg.value > 0, "Contribution must be greater than 0");
        
        goal.saved += msg.value;
        contributions[_goalId].push(Contribution({
            contributor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        }));
        
        emit ContributionMade(_goalId, msg.sender, msg.value);
        
        if (!goal.isAchieved && goal.saved >= (goal.target * 80) / 100) {
            goal.isAchieved = true;
            _mintReward(_goalId, goal.creator);
            emit GoalAchieved(_goalId, goal.creator);
        }
    }

    function withdraw(uint256 _goalId) external {
        Goal storage goal = goals[_goalId];
        require(msg.sender == goal.creator, "Only goal creator can withdraw");
        require(block.timestamp >= goal.deadline, "Deadline not reached");
        require(goal.saved > 0, "No funds to withdraw");
        
        uint256 amount = goal.saved;
        goal.saved = 0;
        payable(msg.sender).transfer(amount);
        
        emit Withdrawal(_goalId, msg.sender, amount);
    }

    function _mintReward(uint256 _goalId, address _to) private {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, string(abi.encodePacked("https://api.familysaver.app/nft/", _goalId)));
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    function getUserGoals(address _user) external view returns (uint256[] memory) {
        return _userGoals[_user];
    }

    function getGoalContributions(uint256 _goalId) external view returns (Contribution[] memory) {
        return contributions[_goalId];
    }
}
