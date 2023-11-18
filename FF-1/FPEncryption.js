'use strict';

const FF1 = require('./FF1');
const CommonUtils = require('./common-utils/CommonUtils');

let charArray;
let MAXTLen;
let commonUtils;

class FPEncryption extends FF1 {
    constructor(secretKey, tweak, maxTlen){
        MAXTLen = maxTlen;
        super(secretKey, tweak, MAXTLen);
        this.commonUtils = new CommonUtils;
    }

    encrypt(secretKey, tweak, plainText, radix, charMap){
        let ff1 = new FF1(secretKey, tweak, MAXTLen);
        charArray = Array.from(plainText);
        let plainTextIntArray = this.commonUtils.convertStringToRadixedIntArray(charArray, charMap);
        let CT = ff1.encrypt(secretKey, tweak, radix, plainTextIntArray);
        let encryptedValue = this.commonUtils.convertDeRadixedIntArrayToString(CT, charMap);
        return encryptedValue;
    }

    decrypt(secretKey, tweak, cipherText, radix, charMap){
        let ff1 = new FF1(secretKey, tweak, MAXTLen);
        let charArray = Array.from(cipherText);
        let cipherTextToIntArray = this.commonUtils.convertStringToRadixedIntArray(charArray, charMap);
        let decrypt = ff1.decrypt(secretKey, tweak, radix, cipherTextToIntArray);
        let PT = this.commonUtils.convertDeRadixedIntArrayToString(decrypt, charMap);
        return PT;
    }  
}

module.exports = FPEncryption;