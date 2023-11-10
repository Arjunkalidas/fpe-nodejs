'use strict';

const FF1 = require('./FF1');
const charMap = require('./CharMap');
const crypto = require('crypto');

let keyByteArr = ''
let updatedCharMap;
let maxTlen = 32;
let ff1String;
let RADIX = 10;
let key = '';
let sec;
let TWEAK = '';

class CryptoUtil {

    constructor(secretKey, tweak) {

        key = secretKey;
        keyByteArr = Buffer.from(key, "base64");
        sec = crypto.createSecretKey(keyByteArr, 'base64');

        updatedCharMap = charMap.convertToMap(this.getNumericCharacters());

        TWEAK = tweak;
        ff1String = new FF1(secretKey, TWEAK, maxTlen);
    }

    encrypt(plainText) {
        // sanitize the text input
        plainText = this.sanitizeTextInput(plainText);
        // sanitized text is used to find the radix
        let radix = this.getRadix(plainText);

        return ff1String.encrypt(sec, TWEAK, plainText, radix, updatedCharMap);
    }

    decrypt(secretKey, cipherText) {
        // sanitize the cipher text
        cipherText = this.sanitizeTextInput(cipherText);
        // sanitized cipher text is used to find the radix
        let radix = this.getRadix(cipherText);

        return ff1String.decrypt(keyByteArr, TWEAK, cipherText, radix, updatedCharMap);
    }

    getAlphanumericCharacters() {
        let charArray = ['0', '1', '2']
        return charArray;
    }

    getNumericCharacters() {
        let numArray = ['0', '1'];
        return numArray
    }

    getRadix(sanitizedInput) {
        let code, i, len;
        for(i=0, len=sanitizedInput.length; i < len; i++) {
            code = sanitizedInput.charCodeAt(i);
            if(code > 47 && code < 58) {
                continue;
            } else if(code > 64 && code < 123) {
                RADIX = 62;
                updatedCharMap = charMap.convertToMap(this.getAlphanumericCharacters());
                break;
            }
        }
        return RADIX;
    }

    sanitizeTextInput(plainText) {
        if(plainText < 0) {
            throw ("plainText input cannot be a negative integer, it must be positive or alphanumeric.");
        }

        let pattern = /[^a-z0-9A-Z]/g;

        let sanitizedInput = plainText.replace(pattern, '');

        return sanitizedInput;
    }
}

module.exports = CryptoUtil;