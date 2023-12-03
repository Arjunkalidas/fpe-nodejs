'use strict';

const MIN_RADIX = require('./Constants').MIN_RADIX;
const MAX_RADIX = require('./Constants').MAX_RADIX;
const MAX_LEN = require('./Constants').MAX_LEN;

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
     * @returns 
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
     * @returns 
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
     * @returns 
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
            if(intValue == null){
                throw ("Invalid character "+currentChar+" found, in the text provided. Only numbers and alphanumeric characters supported.");
            }
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
            for (let [key, value] of allowedCharMap.entries()){
                if (value === currentChar){
                    intValue = key;
                }
            }
            if(intValue == null){
                throw ("Invalid character "+currentChar+" found, in the text provided. Only numbers and alphanumeric characters supported.");
            }
            plainTextIntArray[i] = intValue;
        } 
        let result = plainTextIntArray.join('');
        return result;
    }
}

module.exports = CommonUtils;