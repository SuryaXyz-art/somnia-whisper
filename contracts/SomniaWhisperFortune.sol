// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract SomniaWhisperFortune is ERC721Enumerable, Ownable {
    using Strings for uint256;

    uint256 private _tokenIds;
    uint256 public mintPrice = 0.001 ether;

    enum Rarity { COMMON, RARE, LEGENDARY }

    struct FortuneData {
        address walletAddress;
        string fortuneText;
        uint256 txCount;
        uint256 totalValue;
        uint256 timestamp;
        Rarity rarity;
    }

    mapping(uint256 => FortuneData) public fortunes;

    event FortuneMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string fortuneText,
        Rarity rarity,
        uint256 timestamp
    );

    constructor() ERC721("SomniaWhisperFortune", "SWF") Ownable(msg.sender) {}

    function mintFortune(
        string memory fortuneText,
        uint256 txCount,
        uint256 totalValue
    ) public payable {
        require(msg.value >= mintPrice, "Insufficient funds to mint");

        Rarity rarity;
        if (txCount > 500 && totalValue > 10 ether) {
            rarity = Rarity.LEGENDARY;
        } else if (txCount > 100) {
            rarity = Rarity.RARE;
        } else {
            rarity = Rarity.COMMON;
        }

        _tokenIds += 1;
        uint256 newItemId = _tokenIds;

        fortunes[newItemId] = FortuneData({
            walletAddress: msg.sender,
            fortuneText: fortuneText,
            txCount: txCount,
            totalValue: totalValue,
            timestamp: block.timestamp,
            rarity: rarity
        });

        _safeMint(msg.sender, newItemId);
        emit FortuneMinted(newItemId, msg.sender, fortuneText, rarity, block.timestamp);
    }

    function setMintPrice(uint256 _newPrice) public onlyOwner {
        mintPrice = _newPrice;
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(fortunes[tokenId].timestamp != 0, "URI query for nonexistent token");

        string memory svg = _generateSVG(tokenId);
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Somnia Fortune #',
                        tokenId.toString(),
                        '", "description": "On-chain mystical fortune NFT for Somnia.", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(svg)),
                        '"}'
                    )
                )
            )
        );
        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function _substring(string memory str, uint256 startIndex, uint256 endIndex) internal pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        if (startIndex >= strBytes.length) return "";
        uint256 end = endIndex > strBytes.length ? strBytes.length : endIndex;
        bytes memory result = new bytes(end - startIndex);
        for(uint i = startIndex; i < end; i++) {
            result[i - startIndex] = strBytes[i];
        }
        if (end == endIndex && endIndex < strBytes.length) {
            return string(abi.encodePacked(result, "..."));
        }
        return string(result);
    }

    function _toShortAddress(address _addr) internal pure returns (string memory) {
        bytes memory addrString = bytes(Strings.toHexString(uint256(uint160(_addr)), 20));
        bytes memory shortAddress = new bytes(12); // "0xXXXX...XXXX"
        shortAddress[0] = addrString[0];
        shortAddress[1] = addrString[1];
        shortAddress[2] = addrString[2];
        shortAddress[3] = addrString[3];
        shortAddress[4] = addrString[4];
        shortAddress[5] = addrString[5];
        shortAddress[6] = ".";
        shortAddress[7] = ".";
        shortAddress[8] = addrString[38];
        shortAddress[9] = addrString[39];
        shortAddress[10] = addrString[40];
        shortAddress[11] = addrString[41];
        return string(shortAddress);
    }

    function _generateSVG(uint256 tokenId) internal view returns (string memory) {
        FortuneData memory data = fortunes[tokenId];

        string memory rarityStars;
        string memory rarityColor;
        
        if (data.rarity == Rarity.LEGENDARY) {
            rarityStars = unicode"★★★";
            rarityColor = "url(#legendaryGrad)";
        } else if (data.rarity == Rarity.RARE) {
            rarityStars = unicode"★★";
            rarityColor = "#f0b43a";
        } else {
            rarityStars = unicode"★";
            rarityColor = "#ffffff";
        }

        string memory line1 = _substring(data.fortuneText, 0, 40);
        string memory line2 = _substring(data.fortuneText, 40, 80);

        return string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">',
                '<defs>',
                '<radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">',
                '<stop offset="0%" stop-color="#1a0533"/>',
                '<stop offset="100%" stop-color="#07080f"/>',
                '</radialGradient>',
                '<linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">',
                '<stop offset="0%" stop-color="#9333ea"/>',
                '<stop offset="100%" stop-color="#14b8a6"/>',
                '</linearGradient>',
                '<linearGradient id="legendaryGrad" x1="0%" y1="0%" x2="100%" y2="0%">',
                '<stop offset="0%" stop-color="#f59e0b"/>',
                '<stop offset="50%" stop-color="#ef4444"/>',
                '<stop offset="100%" stop-color="#8b5cf6"/>',
                '<animate attributeName="x1" values="0%;100%;0%" dur="3s" repeatCount="indefinite" />',
                '<animate attributeName="x2" values="100%;0%;100%" dur="3s" repeatCount="indefinite" />',
                '</linearGradient>',
                '</defs>',
                '<rect width="500" height="500" fill="url(#bgGrad)"/>',
                '<rect x="10" y="10" width="480" height="480" fill="none" stroke="url(#borderGrad)" stroke-width="4" rx="15"/>',
                
                '<text x="250" y="80" font-family="sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle">Mystical Fortune #', tokenId.toString(), '</text>',
                '<text x="250" y="140" font-family="sans-serif" font-size="40" fill="', rarityColor, '" text-anchor="middle">', rarityStars, '</text>',
                
                '<rect x="40" y="180" width="420" height="120" fill="#ffffff" fill-opacity="0.05" rx="10"/>',
                '<text x="250" y="230" font-family="sans-serif" font-size="18" fill="white" text-anchor="middle">', line1, '</text>',
                '<text x="250" y="260" font-family="sans-serif" font-size="18" fill="white" text-anchor="middle">', line2, '</text>',
                
                '<text x="250" y="400" font-family="monospace" font-size="14" fill="#a8b2d1" text-anchor="middle">Wallet: ', _toShortAddress(data.walletAddress), '</text>',
                '<text x="250" y="430" font-family="sans-serif" font-size="14" fill="#a8b2d1" text-anchor="middle">Minted: ', data.timestamp.toString(), '</text>',
                '</svg>'
            )
        );
    }
}
