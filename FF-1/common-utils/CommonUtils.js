'use strict';

const CharMap = require('../CharMap');
const MIN_RADIX = require('./Constants').MIN_RADIX;
const MAX_RADIX = require('./Constants').MAX_RADIX;
const MAX_LEN = require('./Constants').MAX_LEN;

const charMap = new CharMap();
let RADIX = 10;
let updatedCharMap;

class CommonUtils {

    /**
     *  A utility function to concatenate byte arrays
     * @param {*} X 
     * @param {*} Y 
     * @returns 
     */
    concatenate(X, Y) {
        // validate X
        if (X == null) {
            throw ("X must not be null");
        }

        // validate Y
        if (!Y || Y == NaN) {
            throw ("Y must not be null");
        }

        let Z = new Array(X.length + Y.length);

        this.arrayCopy(X, 0, Z, 0, X.length);
        this.arrayCopy(Y, 0, Z, X.length, Y.length);
        let newArr = Int8Array.from(Z);
        return newArr;
    }

    /**
     * A utility function to copy the elements from an array to another from a particular source index to destination index
     * @param {*} src 
     * @param {*} srcIndex 
     * @param {*} dest 
     * @param {*} destIndex 
     * @param {*} length 
     */
    // Copy the objects of an array and create a new array
    arrayCopy(src, srcIndex, dest, destIndex, length) {
        dest.splice(destIndex, length, ...src.slice(srcIndex, srcIndex + length));
    }

    /**
     * A utility function to calculate the XOR value of given bytes
     * @param {*} X 
     * @param {*} Y 
     * @returns 
     */
    // returns the XOR value of X and Y
    xor(X, Y) {
        // validate X
        if(!X || X == NaN) {
            throw ("X must not be null");
        }

        if(X.length < 1 || X.length > MAX_LEN) {
            throw ("The length of X is not within the permitted range of 1 .." + MAX_LEN + " instead it is " + X.length);
        }

        // validate Y
        if (!Y || Y == NaN) {
            throw ("Y must not be null");
        }

        if (Y.length < 1 || Y.length > MAX_LEN) {
            throw ("The length of Y is not within the permitted range of 1 .." + MAX_LEN + " instead it is " + Y.length)
        }

        if (Y.length != X.length) {
            throw ("X and Y must be the same length. X: " + X.length + " Y: " + Y.length);
        }

        // allocate result array
        let Z = new Int8Array(X.length);

        // xor the bytes
        for (let i=0; i < X.length; i++) {
            Z[i] = X[i] ^ Y[i];
        }
        return Z;
    }

    /**
     * A utility function to form a byte array from the given numbers x and s
     * @param {*} x 
     * @param {*} s 
     * @returns a byte array for a string input
     */
    byteArray(x, s) {
        // validate s
        if (s < 1 || s > MAX_LEN) {
            throw ("s is not within the permitted range of 1..."+ MAX_LEN + " given : " + s);
        }

        // validate x
        if (x < 0) {
            throw ("x must be a positive integer");
        }

        if (x >= Math.pow(256, s)) {
            throw ("x must be less than 256^"+s+ " (" + x + " >= " + Math.pow(256, s) + ")");
        }

        const num = x;
        
        //convert the number num to its binary representation as a string.
        const binary = num.toString(2);

        //pad the binary string with leading zeroes to ensure it has a length that is a multiple of 8. This is necesary because each byte consists of 8 bits.
        const paddedBinary = binary.padStart(Math.ceil(binary.length / 8) * 8, '0');

        //split the padded binary string into an array of substrings, each representing a byte (8 bits).
        const bytes = paddedBinary.match(/.{1,8}/g);

        //convert each binary byte string to its decimal equivalent using parseInt() with a base of 2.
        const decimalBytes = bytes.map(byte => parseInt(byte, 2));

        //create a new array called data with the same length as the decimalBytes array.
        const data = new Array(decimalBytes.length);

        //to get -ve values
        for(let i = decimalBytes.length - 1; i>=0; i--){
            let value = decimalBytes[i];
            if(256 - value <= value){
                value = value - 256;
            }
            data[i] = value;
        }
        
        let filledArray = Array(s).fill(0);

        filledArray = filledArray.concat(data);
        let arr = new Int8Array(s);
        arr = filledArray.slice(-s);
        return arr;
    }

    /**
     * A utility function to perform the modulo operation 
     * @param {*} x 
     * @param {*} m 
     * @returns the modulus of x with m
     */
    mod(x, m) {
        // validate m
        if (m < 1) {
            throw ("m must be a positive integer");
        }

        return x - m * Math.floor(x / m);
    }

    /**
     * A utility function to obtain the power of a Big Integer
     * @param {*} x 
     * @param {*} m 
     * @returns mth power for the number x
     */
    pow(x, m) {
        // validate x
        if (!x || x == NaN || x == null) {
            throw ("x must be a valid number");
        }

        // validate m
        if (!m || m == NaN || m == null) {
            throw ("m must be a valid number");
        }

        let n = BigInt(m);
        let y = BigInt(x);
        return y ** n;
    }

    /**
     * A utility function to perform modulo operation for a Big Integer data type
     * @param {*} x 
     * @param {*} m 
     * @returns 
     */
    modBigInt(x, m) {
        // validate x
        if (x == NaN || x == null) {
           throw ("x must be a valid number: ", x);
        }

        // validate m
       if (m == NaN || m == null) {
           throw ("m must be a valid number:", m);
       }

        // validate n after converting to integer
        if (m < 1) {
            throw ("n must be a positive integer");
        }

        return ((x % m) < 0 ? (x % m) + m : (x % m)).toString();
    }

    /**
     * This function is to calculate the num using plain text and radix
     * @param {*} X  plain text to encrypt or cipher text to decrypt
     * @param {*} radix the denomenator to calculate the num
     * @returns a BigInt
     */
    num(X, radix) {
        // validate x
        if (X == null) {
            throw ("X must not be null");
        }

        if(X.length < 1 || X.length > MAX_LEN) {
            throw ("The length of X is not within the permitted range of 1 .." + MAX_LEN + " instead it is " + X.length);
        }

        // validate radix
        if (radix < MIN_RADIX || radix > MAX_RADIX) {
            throw ("Radix is not within the permitted range of "+ MIN_RADIX + "..." + MAX_RADIX +" : radix is " + radix);
        }

        let x = BigInt(0);
        let r = BigInt(radix);

        for (let i=0; i < X.length; i++) {
            // validate X[i]
            if (X[i] < 0 || X[i] >= radix) {
                throw ("X[" + i + "] is not within the range of values defined by the radix (0.."+ radix + ")");
            }
            x = (BigInt(x) * BigInt(r)) + BigInt(X[i]);
        }
        return x;
    }

    /**
     * This function is to calculate the num using plain text and radix
     * @param {*} X  plain text to encrypt or cipher text to decrypt
     * @param {*} radix the denomenator to calculate the num
     * @returns a string
     */
    num_byte(X) {
        // validate x
        if (X == null) {
            throw ("X must not be null");
        }

        if (X == NaN) {
            throw ("X must not be a valid integer");
        }

        if(X.length < 1 || X.length > MAX_LEN) {
            throw ("The length of X is not within the permitted range of 1 .." + MAX_LEN + " instead it is " + X.length);
        }

        let x = BigInt(0);
        let r = BigInt(256);

        for (let i=0; i < X.length; i++) {
            x = (x * r) + (BigInt(X[i] & 0xFF));
        }
        
        return x.toString();
    }

    str(x, radix, m) {
        // validate x
        if (x == null) {
            throw ("x must not be null");
        }

        // validate m
        if (m < 1 || m > MAX_LEN) {
            throw ("m is not within the permitted range of 1..."+ MAX_LEN + " : given "+m);
        }

        // validate radix
        if (radix < MIN_RADIX || radix > MAX_RADIX) {
            throw ("Radix is not within the permitted range of "+ MIN_RADIX + "..." + MAX_RADIX +" : radix is " + radix);
        }

        let X = new Int8Array(m);
        for (let i = 1; i <= m; i++) {
            X[m - i] = parseInt(this.modBigInt(BigInt(x), BigInt(radix)));
            x = BigInt(x) / BigInt(radix);
        }
        return X;
    }

    /**
     * A utility function to convert the given string to a radixed integer array
     * @param {*} charArray 
     * @param {*} charMap 
     * @returns 
     */
    convertStringToRadixedIntArray(charArray, charMap){
        let plainTextIntArray = new Array(charArray.length);
        let allowedCharMap = charMap;
        for(let i=0; i<charArray.length; i++){
            let currentChar = charArray[i];
            let intValue = allowedCharMap.get(currentChar);
            plainTextIntArray[i] = intValue;
        }
        return plainTextIntArray;
    }

    /**
     * A utility function to convert the given De-radixed integer array to string
     * @param {*} charArray 
     * @param {*} charMap 
     * @returns 
     */
    convertDeRadixedIntArrayToString(charArray, charMap){
        let plainTextIntArray = new Array(charArray.length);
        let allowedCharMap = charMap;
        for(let i=0; i<charArray.length; i++){
            let currentChar = charArray[i];
            let intValue = null;
            for (let [key, value] of allowedCharMap.entries()) {
                if (value === currentChar){
                    intValue = key;
                }
            }
            plainTextIntArray[i] = intValue;
        } 
        let result = plainTextIntArray.join('');
        return result;
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
        updatedCharMap = charMap.convertToMap(this.getNumericCharacters());
        let code, i, len;
        for(i=0, len=sanitizedInput.length; i < len; i++) {
            code = sanitizedInput.charCodeAt(i);
            if(code >= 48 && code <= 57) {
                continue;
            } else if(code > 64 && code < 123) {
                RADIX = 62;
                updatedCharMap = charMap.convertToMap(this.getAlphanumericCharacters());
                break;
            }
        }
        return RADIX;
    }

    /*
    * Function to get the updated Char Map after RADIX is decided in getRadix function
    * If RADIX is 10, it would be a numeric char map, else if it is 62, then alphanumeric char map
    */
    getUpdatedCharMap() {
        return updatedCharMap;
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

module.exports = CommonUtils;
