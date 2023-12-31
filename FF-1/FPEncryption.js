'use strict';

const FF1 = require('./FF1');
const CommonUtils = require('./common-utils/CommonUtils');

let charArray;
let MAXTLen;
let commonUtils = new CommonUtils();

class FPEncryption extends FF1 {

    constructor(secretKey, tweak, maxTlen) {
        MAXTLen = maxTlen;
        super(secretKey, tweak, MAXTLen);
    }

    /**
     * Wrapper method to encrypt 
     * @param {*} secretKey 
     * @param {*} tweak 
     * @param {*} plainText 
     * @param {*} radix 
     * @param {*} charMap 
     * @returns the encrypted cipher text
     */
    encrypt(secretKey, tweak, plainText, radix, charMap) {
        let ff1 = new FF1(secretKey, tweak, MAXTLen);
        charArray = Array.from(plainText);
        let plainTextIntArray = commonUtils.convertStringToRadixedIntArray(charArray, charMap);
        let cipherText = ff1.encrypt(secretKey, tweak, radix, plainTextIntArray);
        let encryptedValue = commonUtils.convertDeRadixedIntArrayToString(cipherText, charMap);
        return encryptedValue;
    }

    /**
     * Wrapper method to decrypt
     * @param {*} secretKey 
     * @param {*} tweak 
     * @param {*} cipherText 
     * @param {*} radix 
     * @param {*} charMap 
     * @returns the decrypted plain text
     */
    decrypt(secretKey, tweak, cipherText, radix, charMap) {
        let ff1 = new FF1(secretKey, tweak, MAXTLen);
        let charArray = Array.from(cipherText);
        let cipherTextToIntArray = commonUtils.convertStringToRadixedIntArray(charArray, charMap);
        let decryptText = ff1.decrypt(secretKey, tweak, radix, cipherTextToIntArray);
        let plainText = commonUtils.convertDeRadixedIntArrayToString(decryptText, charMap);
        return plainText;
    }
}

module.exports = FPEncryption;