'use strict'

const Ciphers = require('./Ciphers');
const CommonUtils = require('./common-utils/CommonUtils');
const MIN_RADIX = require('./common-utils/Constants').MIN_RADIX;
const MAX_RADIX = require('./common-utils/Constants').MAX_RADIX;
const MIN_LEN = require('./common-utils/Constants').MIN_LEN;
const MAX_LEN = require('./common-utils/Constants').MAX_LEN;
const NUM_ROUNDS = require('./common-utils/Constants').NUM_ROUNDS;

// Max Tweak Length
let MAXTlen = 32;
// cipher initialization
const ciphers = new Ciphers();
// common utils initialization
const commonUtils = new CommonUtils();

class FF1 {

    constructor(secretKey, tweak, maxTlen) {

        MAXTlen = Math.max(MAXTlen, maxTlen);

        // validate secretKey
        if (!secretKey || secretKey == null) {
            throw ("Secret Key cannot be empty or null");
        }

        // validate tweak for null values
        if (tweak == null) {
            throw ("Tweak cannot be null, it must hold a value or pass an empty string if not using.");
        }

        // validate tweak for Max Tweak length
        if (tweak.length > MAXTlen) {
            throw ("Tweak cannot have length greater than MAXTlen, you have provided "+tweak.length);
        }

        // validate if Max Tweak length less than 0 or greater than maximum length
        if (MAXTlen < 0 || MAXTlen > MAX_LEN) {
            throw ("MAXTlen must be in the the range [0..4096], you have provided "+ maxTlen);
        }
    }

    /**
     * Function to encrypt a provided string - numeric or alphanumeric
     * @param {*} secretKey base 64 decoded key
     * @param {*} tweak padding (optional)
     * @param {*} radix radix is 10 for numeric & 62 for alphanumeric
     * @param {*} plainText the input text to encrypt
     * @returns 
     */
    encrypt(secretKey, tweak, radix, plainText) {
        // validate key
        if (!secretKey || secretKey == null) {
            throw ("Secret Key cannot be empty or null");
        }

        // validate tweak for null values
        if (tweak == null) {
            throw ("Tweak cannot be null, it must hold a value or pass an empty string if not using.");
        }

        // validate tweak length against max length
        if (tweak.length > MAXTlen) {
            throw ("Tweak cannot have length greater than MAXTlen, you have provided "+tweak.length);
        }

        // validate radix
        if (radix < MIN_RADIX || radix > MAX_RADIX) {
            throw ("radix must be between 2 and 36, inclusive, but provided radix is "+ radix);
        }

        // validate plain text input
        if (!plainText || plainText == null) {
            throw ("Plain text input to encrypt must not be null or empty.");
        }

        // validate if plain text input length less than min length or less than max length
        if (plainText.length < MIN_LEN || plainText.length > MAX_LEN) {
            throw ("The length of the plain text input to encrypt should be within the permitted range of "+ MIN_LEN +" and " + MAX_LEN + ". You have provided " + plainText.length);
        }

        // validate the radix raised to plain text length is less than 100 
        if (Math.pow(radix, plainText.length) < 100) {
            throw ("The length of plain text to encrypt must be such that radix ^ length > 100, but here (radix ^ length = "+ Math.pow(radix, plainText.length));
        }

        let X = plainText;

        // length of input
        const n = X.length;
        // length of tweak
        const t = tweak.length;

        // calculate split point
        const u = Math.floor(n / 2.0);
        const v = n - u;

        // split the plain text input
        let A = X.slice(0, u);
        let B = X.slice(u, n);

        let b = Math.ceil(Math.ceil(v * Math.log2(radix)) / 8.0);

        let d = 4 * Math.ceil(b / 4.0) + 4;

        // Javascript bitwise operations work on 32-bit signed integers, so if the values of radix, n, t, or u
        // are larger than 32 bits, you may have to adjust the MAXTlen accordingly
        const tbr = commonUtils.byteArray(radix, 3);
        const fbn = commonUtils.byteArray(n, 4);
        const fbt = commonUtils.byteArray(t, 4);

        let b1 = commonUtils.mod(u, 256) & (0xFF);

        let utf8Encode = new TextEncoder();

        tweak = utf8Encode.encode(tweak);

        const P = [0x01, 0x02, 0x01, tbr[0], tbr[1], tbr[2], 0x0A, b1, fbn[0], fbn[1], fbn[2], fbn[3], fbt[0], fbt[1], fbt[2], fbt[3]];

        // iterating for 10 times as per the NIST specs for FF-1 mode of encryption
        for (let i = 0; i < NUM_ROUNDS; i++) {
            let tbMod = commonUtils.mod(-t - b - 1, 16);
            let tbModByteArray = commonUtils.byteArray(0, tbMod);
            let Q = commonUtils.concatenate(tweak, tbModByteArray);

            let ibyteArr = commonUtils.byteArray(i, 1);
            Q = commonUtils.concatenate(Q, ibyteArr);

            let radixNumConv = commonUtils.num(B, radix)
            Q = commonUtils.concatenate(Q, commonUtils.byteArray(radixNumConv, b));

            let R = new Int8Array(16);

            let PQ = commonUtils.concatenate(P, Q);

            R = ciphers.prf(secretKey, PQ);

            let S = R;

            for (let j = 1; j <= Math.ceil(d /16.0) - 1; j++) {
                let byteArray = commonUtils.byteArray(j, 16);
                let xor_R = commonUtils.xor(R, byteArray);
                S = commonUtils.concatenate(S, ciphers.ciph(secretKey, xor_R));
            }

            S = S.slice(0, d);
            let y = commonUtils.num_byte(S);

            let m = i % 2 == 0 ? u : v;

            let c = commonUtils.modBigInt((BigInt(commonUtils.num(A, radix)) + BigInt(y)), commonUtils.pow(radix, m));

            let C = commonUtils.str(c, radix, m);

            A = B;

            B = C;
        }

        return commonUtils.concatenate(A, B);
    }

    /**
     * Function to decrypt the cipher text that was encrypted using FPE FF1 encryption logic
     * @param {*} secretKey the base 64 decoded key
     * @param {*} tweak the padding (optional)
     * @param {*} radix radix is 10 for numeric or 62 for alphanumeric
     * @param {*} cipherText the cipher text that will be decrypted
     * @returns 
     */
    decrypt(secretKey, tweak, radix, cipherText) {
        // validate key
        if (!secretKey || secretKey == null) {
            throw ("Secret Key cannot be empty or null");
        }

        // validate tweak for null values
        if (tweak == null) {
            throw ("Tweak cannot be null, it must hold a value or pass an empty string if not using.");
        }

        // validate tweak length is greater than Maximum tweak length
        if (tweak.length > MAXTlen) {
            throw ("Tweak cannot have length greater than MAXTlen, you have provided "+tweak.length);
        }

        // validate radix
        if (radix < MIN_RADIX || radix > MAX_RADIX) {
            throw ("radix must be between 2 and 36, inclusive, but provided radix is "+ radix);
        }

        // validate plain text input
        if (!cipherText || cipherText == null) {
            throw ("Cipher text input to deccrypt must not be null or empty.");
        }

        // validate if cipher text is length less than min length and greater than max length
        if (cipherText.length < MIN_LEN || cipherText.length > MAX_LEN) {
            throw ("The length of the cipher text input to decrypt should be within the permitted range of "+ MIN_LEN +" and " + MAX_LEN + ". You have provided " + cipherText.length);
        }

        // validate the radix raised to plain text length is less than 100 
        if (Math.pow(radix, cipherText.length) < 100) {
            throw ("The length of cipher text to decrypt must be such that radix ^ length > 100, but here (radix ^ length = "+ Math.pow(radix, cipherText.length));
        }

        let X = cipherText;

        // length of input
        const n = X.length;
        // length of tweak
        const t = tweak.length;

        // calculate split point
        const u = Math.floor(n / 2.0);
        const v = n - u;

        let A = X.slice(0, u);
        let B = X.slice(u, n);

        let b = Math.ceil(Math.ceil(v * Math.log2(radix)) / 8.0);

        let d = 4 * Math.ceil(b / 4.0) + 4;

        const tbr = commonUtils.byteArray(radix, 3);
        const fbn = commonUtils.byteArray(n, 4);
        const fbt = commonUtils.byteArray(t, 4);

        let b1 = commonUtils.mod(u, 256) & (0xFF);

        let utf8Encode = new TextEncoder();

        tweak = utf8Encode.encode(tweak);

        const P = [0x01, 0x02, 0x01, tbr[0], tbr[1], tbr[2], 0x0A, b1, fbn[0], fbn[1], fbn[2], fbn[3], fbt[0], fbt[1], fbt[2], fbt[3]];

        // iterating for 10 times as per the NIST specs for FF-1 mode of decryption
        for (let i = NUM_ROUNDS-1; i >= 0; i--) {
            let tbMod = commonUtils.mod(-t - b - 1, 16);
            let tbModByteArray = commonUtils.byteArray(0, tbMod);
            let Q = commonUtils.concatenate(tweak, tbModByteArray);

            let ibyteArr = commonUtils.byteArray(i, 1);
            Q = commonUtils.concatenate(Q, ibyteArr);

            let radixNumConv = commonUtils.num(A, radix)
            Q = commonUtils.concatenate(Q, commonUtils.byteArray(radixNumConv, b));

            let R = new Int8Array(16);

            let PQ = commonUtils.concatenate(P, Q);

            R = ciphers.prf(secretKey, PQ);

            let S = R;

            for (let j = 1; j <= Math.ceil(d /16.0) - 1; j++) {
                let byteArray = commonUtils.byteArray(j, 16);
                let xor_R = commonUtils.xor(R, byteArray);
                S = commonUtils.concatenate(S, ciphers.ciph(secretKey, xor_R));
            }

            S = S.slice(0, d);
            let y = commonUtils.num_byte(S);

            let m = i % 2 == 0 ? u : v;

            let c = commonUtils.modBigInt((BigInt(commonUtils.num(B, radix)) - BigInt(y)), commonUtils.pow(radix, m));

            let C = commonUtils.str(c, radix, m);

            B = A;

            A = C;
        }

        return commonUtils.concatenate(A, B);
    }
}

module.exports = FF1;