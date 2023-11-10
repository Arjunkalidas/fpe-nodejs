const cryptoUtil = require('./FF-1/CryptoUtil');

let key = "base64 encoded key here";
// Tweak should be 32 characters or less. Tweak is an optional field, which you can leave empty if not required.
let tweak = ""

// maximum length of plain text cannot exceed 4096
const plainText = "text to encrypt";
console.log("plain Text input :: ",plainText);

const encryptDecryptUtil = new cryptoUtil(key, tweak);

const cipherText = encryptDecryptUtil.encrypt(plainText);

console.log("cipher text :: ",cipherText);

const decryptedText = cryptoUtil.decrypt(key, cipherText);

console.log("decryptedText :: ", decryptedText);