import { ethers } from "ethers";

// Minimal ERC721 ABI with balanceOf only
const ERC721_ABI = [
  "function balanceOf(address owner) view returns (uint256)"
];


export async function userOwnsNFT(contractAddress, userAddress) {
    try {
      const providerOrSigner = new ethers.JsonRpcProvider("https://eth-sepolia.public.blastapi.io");
    const contract = new ethers.Contract(contractAddress, ERC721_ABI, providerOrSigner);
    const balance = await contract.balanceOf(userAddress);
    console.log(balance);
    
    return BigInt(balance) > 0n;
  } catch (error) {
    console.error("Error checking NFT ownership:", error);
    return false;
  }
}
