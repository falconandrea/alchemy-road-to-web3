// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract ChainBattles is ERC721URIStorage {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Property {
        uint256 level;
        uint256 speed;
        uint256 strength;
        uint256 hp;
        uint256 mp;
    }

    mapping(uint256 => Property) public tokenIdToProperties;

    constructor() ERC721("Chain Battles", "CBTLS") {}

    function generateCharacter(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        Property memory character = tokenIdToProperties[tokenId];

        bytes memory svg = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
            "<style>.base { fill: white; font-family: serif; font-size: 14px; }</style>",
            '<rect width="100%" height="100%" fill="black" />',
            '<text x="50%" y="20%" class="base" dominant-baseline="middle" text-anchor="middle">',
            "Warrior",
            "</text>",
            '<text x="50%" y="30%" class="base" dominant-baseline="middle" text-anchor="middle">',
            "Levels: ",
            character.level.toString(),
            "</text>",
            '<text x="50%" y="40%" class="base" dominant-baseline="middle" text-anchor="middle">',
            "HP: ",
            character.hp.toString(),
            " - MP: ",
            character.mp.toString(),
            "</text>",
            '<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">',
            "Speed: ",
            character.speed.toString(),
            " - Strength: ",
            character.strength.toString(),
            "</text>",
            "</svg>"
        );

        return
            string(
                abi.encodePacked(
                    "data:image/svg+xml;base64,",
                    Base64.encode(svg)
                )
            );
    }

    function getInfoCharacter(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        Property memory character = tokenIdToProperties[tokenId];
        bytes memory dataURI = abi.encodePacked(
            "{",
            '"level": "',
            character.level.toString(),
            '",',
            '"hp": "',
            character.hp.toString(),
            '",',
            '"mp": "',
            character.mp.toString(),
            '",',
            '"speed": "',
            character.speed.toString(),
            '",',
            '"strength": "',
            character.strength.toString(),
            '"',
            "}"
        );
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(dataURI)
                )
            );
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        bytes memory dataURI = abi.encodePacked(
            "{",
            '"name": "Chain Battles #',
            tokenId.toString(),
            '",',
            '"description": "Battles on chain",',
            '"image": "',
            generateCharacter(tokenId),
            '"',
            "}"
        );
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(dataURI)
                )
            );
    }

    function mint() public {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        tokenIdToProperties[newItemId] = Property(1, 10, 15, 20, 15);
        _setTokenURI(newItemId, getTokenURI(newItemId));
    }

    function random(uint256 limit, uint256 salt)
        private
        view
        returns (uint256)
    {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.timestamp, salt)
                )
            ) % limit;
    }

    function train(uint256 tokenId) public {
        require(_exists(tokenId), "Please use an existing Token");
        require(
            ownerOf(tokenId) == msg.sender,
            "You must own this token to train it"
        );
        tokenIdToProperties[tokenId].level =
            tokenIdToProperties[tokenId].level +
            1;
        tokenIdToProperties[tokenId].hp =
            tokenIdToProperties[tokenId].hp +
            random(10, 15);
        tokenIdToProperties[tokenId].mp =
            tokenIdToProperties[tokenId].mp +
            random(10, 25);
        tokenIdToProperties[tokenId].speed =
            tokenIdToProperties[tokenId].speed +
            random(10, 35);
        tokenIdToProperties[tokenId].strength =
            tokenIdToProperties[tokenId].strength +
            random(10, 45);
        _setTokenURI(tokenId, getTokenURI(tokenId));
    }
}
