'use strict';

const FPEncryption = require('./FPEncryption');
const CharMap = require('./CharMap');
const crypto = require('crypto');
const BASE64 = require('./common-utils/Constants').BASE64;
const CommonUtils = require('./common-utils/CommonUtils');

let keyByteArr = ''
let updatedCharMap;
let maxTlen = 32;
let ff1String;
let key = '';
let sec;
let TWEAK = '';
let commonUtils = new CommonUtils();

class CryptoUtil {

    constructor(secretKey, tweak) {
        key = secretKey;
        keyByteArr = Buffer.from(key, BASE64);
        sec = crypto.createSecretKey(keyByteArr, BASE64);

        TWEAK = tweak;
        ff1String = new FPEncryption(secretKey, TWEAK, maxTlen);
    }

    /**
     * Function that is invoked by the consumer of this library to encrypt a text/number/alphanumeric value
     * @param {*} plainText the plain text input passed to be encrypted
     * @returns the cipher value after FPE FF1 mode of encryption
     */
    encrypt(plainText) {
        // sanitize the text input
        plainText = commonUtils.sanitizeTextInput(plainText);
        // sanitized text is used to find the radix
        let radix = commonUtils.getRadix(plainText);
        updatedCharMap = commonUtils.getUpdatedCharMap();

        return ff1String.encrypt(sec, TWEAK, plainText, radix, updatedCharMap);
    }

    /**
     * Function that is invoked by the consumer of this library to decrypt the cipher text that is encrypted using the same
     * logic & base64 encoded key
     * @param {*} cipherText the cipher text that is passed to be decrypted
     * @returns the decrypted plain text value after decryption
     */
    decrypt(cipherText) {
        // sanitize the cipher text
        cipherText = commonUtils.sanitizeTextInput(cipherText);
        // sanitized cipher text is used to find the radix
        let radix = commonUtils.getRadix(cipherText);
        updatedCharMap = commonUtils.getUpdatedCharMap();

        return ff1String.decrypt(keyByteArr, TWEAK, cipherText, radix, updatedCharMap);
    }
}

module.exports = CryptoUtil;