const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const FamilySaver = await hre.ethers.getContractFactory("FamilySaver");
  const familySaver = await FamilySaver.deploy();
  
  await familySaver.deployed();

  console.log("FamilySaver deployed to:", familySaver.address);
  console.log("Transaction hash:", familySaver.deployTransaction.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
