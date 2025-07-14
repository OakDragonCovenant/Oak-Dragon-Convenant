class VaultwrightAgent {
  constructor() {
    this.state = "Vault Sealed";
    this.assets = [];
  }

  openVault() {
    this.state = "Vault Open";
    console.log("Vault is now accessible.");
  }

  storeAsset(asset) {
    this.assets.push(asset);
    console.log(`Stored: ${asset}`);
  }

  sealVault() {
    this.state = "Vault Sealed";
    console.log("Vault has been sealed.");
  }
}

module.exports = VaultwrightAgent;