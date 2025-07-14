const VaultwrightAgent = require('./vaultwrightAgent');
const vault = new VaultwrightAgent();

vault.openVault();
vault.storeAsset("Dragon Coin");
vault.sealVault();