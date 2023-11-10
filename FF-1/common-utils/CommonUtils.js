'use strict';

const MAX_LEN = 4096;
const MIN_RADIX = 2;
const MAX_RADIX = 65536;

class CommonUtils {

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

    arrayCopy(src, srcIndex, dest, destIndex, length) {
        dest.splice(destIndex, length, ...src.slice(srcIndex, srcIndex + length));
    }

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
        // TODO: filling the rest of the function for byteArray conversion of plaintext
    }

    mod(x, m) {
        // validate m
        if (m < 1) {
            throw ("m must be a positive integer");
        }

        return x - m * Math.floor(x / m);
    }

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

    modBigInt(x, m) {
        // validate x
        if (!x || x == NaN || x == null) {
            throw ("x must be a valid number");
        }

        // validate m
        if (!m || m == NaN || m == null) {
            throw ("m must be a valid number");
        }

        let n = parseInt(m);

        // validate n after converting to integer
        if (n < 1) {
            throw ("n must be a positive integer");
        }

        let y = parseInt(x);
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
        
        return X.toString();
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
}

module.exports = CommonUtils;