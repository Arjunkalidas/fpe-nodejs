/*
*   Copyright 2024 Arjun Kalidas <askjaykal@mail.com>
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

'use strict';

const FF1 = require('./FF1');
const CommonUtils = require('./common-utils/CommonUtils');

/** Character Array formay of the plaintext input   */
let charArray;
/** Maximum Tweak Length permitted */
let MAXTLen;
/** Common Utils class instantiation */
let commonUtils = new CommonUtils();

class FPEncryption extends FF1 {

    constructor(secretKey, tweak, maxTlen) {
        MAXTLen = maxTlen;
        super(secretKey, tweak, MAXTLen);
    }

    /**
     * Wrapper method to encrypt 
     * @param {*} secretKey the base64 encoded key
     * @param {*} tweak the initialization vector (optional)
     * @param {*} plainText the plain text to encrypt
     * @param {*} radix the value to determine the numeral system used
     * @param {*} charMap the character map for alphanumeric values
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
     * @param {*} secretKey the base64 encoded key
     * @param {*} tweak the initialization vector (optional)
     * @param {*} cipherText the encrypted form of the input
     * @param {*} radix the value to determine the numeral system used
     * @param {*} charMap the character map for alphanumeric values
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