'use strict';

const FPEncryption = require('./FPEncryption');
const CharMap = require('./CharMap');
const crypto = require('crypto');
const BASE64 = require('./common-utils/Constants').BASE64;

let keyByteArr = ''
let updatedCharMap;
let maxTlen = 32;
let ff1String;
let RADIX = 10;
let key = '';
let sec;
let TWEAK = '';

const charMap = new CharMap();

class CryptoUtil {

    constructor(secretKey, tweak) {
        key = secretKey;
        keyByteArr = Buffer.from(key, BASE64);
        sec = crypto.createSecretKey(keyByteArr, BASE64);

        updatedCharMap = charMap.convertToMap(this.getNumericCharacters());

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
        plainText = this.sanitizeTextInput(plainText);
        // sanitized text is used to find the radix
        let radix = this.getRadix(plainText);

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
        cipherText = this.sanitizeTextInput(cipherText);
        // sanitized cipher text is used to find the radix
        let radix = this.getRadix(cipherText);

        return ff1String.decrypt(keyByteArr, TWEAK, cipherText, radix, updatedCharMap);
    }

    /**
     * This utility function is to retrieve the alpahnumeric values used to map against each character of the input to encrypt/decrypt
     * @returns a character array of 62 characters that include, integers, alphabets in upper and lower case
     */
    getAlphanumericCharacters() {
        let charArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
                        'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
                        'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        return charArray;
    }

    /**
     * This utility function is to retrieve the numeric values used to map against each character of the input number to encrypt/decrypt
     * @returns an integer array of 10 numbers consisting of 0 to 9
     */
    getNumericCharacters() {
        let numArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        return numArray
    }

    /**
     * This utilty function is used to retrieve the accurate Radix value based on the input text
     * Radix differs for numeric and alphanumeric values. It is 10 for numeric & 62 for alphanumeric
     * @param {*} sanitizedInput the sanitized input is provided to obtain the accurate radix which is a key ingredient in encryption/decryption
     * @returns the radix value as either 10 or 62 depending on the input provided
     */
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

    /**
     * This utilty function is used to sanitize the input provided to encrypt & decrypt functions
     * @param {*} plainText is the input plain text or cipher text to be cleaned of any invalid characters
     *                      - invalid characters include any character other than integers & alphabets
     *                      - regex pattern used here is /[^a-z0-9A-Z]/g
     * @returns a sanitized input devoid of any special characters or spaces and retains only numbers & alphabets
     */
    sanitizeTextInput(plainText) {
        if (typeof plainText === 'undefined') {
            throw new Error("Plain text input cannot be undefined");
        }

        if(plainText < 0) {
            throw ("plainText input cannot be a negative integer, it must be positive or alphanumeric.");
        }

        let pattern = /[^a-z0-9A-Z]/g;

        let sanitizedInput = plainText.replace(pattern, '');

        return sanitizedInput;
    }
}

module.exports = CryptoUtil;