'use strict';

const crypto = require('crypto');
const AES_ECB_ALGORITHM = require('./common-utils/Constants').AES_ECB_ALGORITHM;
const MAX_LEN = require('./common-utils/Constants').MAX_LEN;

let mAesEcbCipher = null;

class Ciphers {

    /**
     * This is a pseudorandom function that is used to generate a randomized array of the plainText input
     * @param {*} secretKey the AES key that is base64 decoded
     * @param {*} plainText the text/data to encrypt
     * @returns 
     */
    prf(secretKey, plainText) {
        // validate key
        if(!secretKey || secretKey == null) {
            throw ("Secret Key cannot be empty or null");
        }

        // validate plainText input
        if(!plainText || plainText == null) {
            throw ("Plain text input to encrypt cannot be empty or null");
        }
        if(plainText.length < 1 || plainText.length > MAX_LEN) {
            throw ("The length of the plain text input to encrypt should be within the permitted length of 1 and "+ MAX_LEN);
        }

        let X = plainText;
        let m = X.length / 16;
        m = Math.ceil(m);

        // we extract the blocks inside the for loop
        let Y = new Int8Array(32);
        Y.fill(0);

        for(let j=0; j<m; j++) {
            let Xj = X.slice(j * 16, j * 16 + 16);
            let temp = new Int8Array(16);
            for(let i=0; i<16; i++) {
                temp[i] = Y[i] ^ Xj[i];
            }
            Y.set(this.ciph(secretKey, temp));
        }
        // slicing the first 16 bits from the resultant array, because rest of the array 16 bits is padding
        Y = Y.slice(0, 16);
        return Y;
    }

    /**
     * This is a cipher function used to generate a cipher using AES ECB algorithm and crypto library's cipher creation method
     * @param {*} secretKey the AES key that is base64 decoded
     * @param {*} plainText the text/data to encrypt
     * @returns 
     */
    ciph(secretKey, plainText) {
        // validate key
        if(!secretKey || secretKey == null) {
            throw ("Secret Key cannot be empty or null");
        }

        // validate plainText input
        if(!plainText || plainText == null) {
            throw ("Plain text input to encrypt cannot be empty or null");
        }
        if(plainText.length < 1 || plainText.length > MAX_LEN) {
            throw ("The length of the plain text input to encrypt should be within the permitted length of 1 and "+ MAX_LEN);
        }

        const cipher = crypto.createCipheriv(AES_ECB_ALGORITHM, secretKey, null);
        cipher.setAutoPadding(false);
        const encryptedBlock = Buffer.concat([cipher.update(plainText), cipher.final()]);
        return new Int8Array(encryptedBlock);
    }

    /**
     * This function is to convert a string to 32 bits 
     * @param {*} isBit boolean - the bit value with which to fill the output; false = 0, true = 1
     * @param {*} s number - the length of the output in bits (not bytes)
     * @returns 
     */
    bitstring(isBit, s) {
        // validate s
        if(s < 1) {
            throw ("s must be a positive integer");
        }
        if(s % 8 != 0) {
            throw ("s must be a multiple of 8, but it is " + s);
        }

        const arr = new Int32Array(s / 8);
        arr.fill(isBit ? 0xFF : 0x00);

        return arr;
    }

    /* NOT CURRENTLY USED ANYWHERE, BUT THERE IS A FUTURE FOR THIS FUNCTION */
    
    /**
     * This function provides an alternative way to perform pseudo randomization by using a AES ECB algorithm
     * @param {*} secretKey the AES key that is base64 decoded
     * @param {*} plainText the text/data to encrypt
     * @returns 
     */
    prf_alt(secretKey, plainText) {
        // validate key
        if(!secretKey || secretKey == null) {
            throw ("Secret Key cannot be empty or null");
        }

        // validate plainText input
        if(!plainText || plainText == null) {
            throw ("Plain text input to encrypt cannot be empty or null");
        }
        if(plainText.length < 1 || plainText.length > MAX_LEN) {
            throw ("The length of the plain text input to encrypt should be within the permitted length of 1 and "+ MAX_LEN);
        }

        let Z = new Int32Array(16);
        Z.fill(0);

        // this array of zeroes is to create an IV
        const arr = new Int32Array(16);
        arr.fill(0x00);

        mAesEcbCipher = crypto.createCipheriv(AES_ECB_ALGORITHM, secretKey, crypto.randomBytes(16));
        mAesEcbCipher.setAutoPadding(false);

        Z = mAesEcbCipher.update(plainText);

        return new Int32Array(Z.slice(Z.length - 16, Z.length));
    }
}

module.exports = Ciphers;
