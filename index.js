const cryptoUtil = require('./FF-1/CryptoUtil');

// 44 bytes in length - 16 bytes base64 encoded
let key = "TAMNxdIPhUrR4ONYGHoXJ9357F4oe+H+vFwm8f2kc7I=";

// Tweak should be 32 characters or less. Tweak is an optional field, which you can leave empty if not required.
let tweak = ""

// maximum length of plain text cannot exceed 4096
const plainText = "10000085A637099bc";
console.log("plain Text input :: ",plainText);

// initialize crypto util by creating an instance and passing the key & tweak to the constructor
const encryptDecryptUtil = new cryptoUtil(key, tweak);
// call the invoke method and pass the data to encrypt
const cipherText = encryptDecryptUtil.encrypt(plainText);

console.log("cipher text :: ",cipherText);
// re-use the crypto util object to invoke the decrypt method
const decryptedText = encryptDecryptUtil.decrypt(cipherText);

console.log("decryptedText :: ", decryptedText);



