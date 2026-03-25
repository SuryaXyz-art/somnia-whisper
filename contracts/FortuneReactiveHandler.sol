// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@somnia-chain/reactivity-contracts/contracts/SomniaEventHandler.sol";

contract FortuneReactiveHandler is SomniaEventHandler {
    address public fortuneContract;
    uint256 public reactionCount;
    mapping(address => uint256) public walletReactions;

    event FortuneReaction(address indexed wallet, uint256 tokenId, string rarity, uint256 timestamp);
    event LiveFeedUpdate(uint256 reactionCount, address latestWallet);

    constructor(address _fortuneContract) {
        fortuneContract = _fortuneContract;
    }

    function _onEvent(
        address emitter,
        bytes32[] calldata /* eventTopics */,
        bytes calldata data
    ) internal override {
        require(emitter == fortuneContract, "Unauthorized emitter");

        (
            uint256 tokenId,
            address owner,
            /* string memory fortuneText */,
            uint8 rarityInt,
            uint256 timestamp
        ) = abi.decode(data, (uint256, address, string, uint8, uint256));

        string memory rarityStr;
        if (rarityInt == 0) {
            rarityStr = "COMMON";
        } else if (rarityInt == 1) {
            rarityStr = "RARE";
        } else {
            rarityStr = "LEGENDARY";
        }

        reactionCount += 1;
        walletReactions[owner] += 1;

        emit FortuneReaction(owner, tokenId, rarityStr, timestamp);
        emit LiveFeedUpdate(reactionCount, owner);
    }

    function getReactionStats(address wallet) public view returns (uint256, uint256) {
        return (walletReactions[wallet], reactionCount);
    }
}
