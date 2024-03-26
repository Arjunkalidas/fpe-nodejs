# fpe-nodejs (FF1)

## Background
This is a repository for format preserving encryption in FF-1 mode written in Nodejs.

We have used the NIST recommended specifications and guidelines to create a Javascript equivalent of this library. There are implementations out there in Java for FF1 & FF3, and Nodejs for FF3 mode, but none for FF1 mode in Nodejs, hence we decided to create this repo.

* To read more on NIST's FPE documents, head over here [NIST Recommendation SP 800-38G](https://csrc.nist.gov/pubs/sp/800/38/g/upd1/final)

* To refer the specifications in detail, please use this document [NIST Recommendation SP 800-38G Revision 1](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-38G.pdf)

## Introduction
A block cipher mode of operation, commonly known as a mode, is an algorithm designed for the cryptographic transformation of data based on a block cipher. Traditional encryption modes operate on binary data, where inputs and outputs are bit strings consisting of ones and zeros. However, when dealing with non-binary symbol sequences, such as Social Security numbers (SSN), Bank Account numbers, License number etc, the existing modes may fail to maintain the original format, posing challenges when converting back to the desired data type.

Format-preserving encryption (FPE) addresses this issue, specifically catering to non-binary data. It transforms data formatted as a sequence of symbols in such a way that the encrypted data preserves the original format, including length. For instance, FPE can encrypt an SSN, maintaining it as a sequence of nine decimal digits. This capability proves valuable in scenarios where conventional encryption modes are impractical, such as legacy applications that cannot accommodate changes to data field lengths or formats.

FPE serves various cryptographic purposes, including securing financial information, data sanitization, and transparently encrypting fields in legacy databases. Two FPE modes outlined in the NIST publication are, FF1 and FF3, are format-preserving, Feistel-based encryption modes. FF3, equivalent to the BPS-BC component of BPS, is particularly relevant to legacy databases, instantiated with a 128-bit block cipher. Notably, FF2, initially included in the publication, was removed due to concerns about its expected security strength.

These FPE modes fit within the larger FFX framework, submitted to NIST for constructing FPE mechanisms. Although FF1 and FF3 are not explicitly presented as instantiations of FFX parameter sets in this publication, they each employ the Feistel structure and incorporate different Feistel round functions derived from the Advanced Encryption Standard (AES) algorithm. FF1 is a block cipher based on a ten round Feistel cipher, whereas FF3 is eight round.

In addition to formatted data, each FPE mode considers an additional input known as the "tweak," a changeable part of the key determining encryption and decryption functions. Tweaks play a crucial role, especially when the possible values for confidential data are limited. FF1 and FF3 offer distinct performance advantages, with FF1 supporting a broader range of protected data lengths and tweak flexibility, while FF3 achieves higher throughput due to its lower round count.

## How to use
The entry point of the project is the [index.js](https://github.com/Arjunkalidas/fpe-nodejs/blob/develop/index.js) file located at the root level. Any testing you would like to perform, can begin here. You may try different input texts, tweaks and keys as per your needs, but please be aware of the lower and upper bound of all the inputs you provide.


```
const cryptoUtil = require('./FF-1/CryptoUtil');

let key = "base64 encoded key here"; // eg: "TAMNxdIPhUrR4ONYGHoXJ9357F4oe+H+vFwm8f2kc7I="
// Tweak should be 32 characters or less. Tweak is an optional field.
let tweak = ""

// maximum length of plain text cannot exceed 4096
const plainText = "1234567890";

const encryptDecryptUtil = new cryptoUtil(key, tweak);

const cipherText = encryptDecryptUtil.encrypt(plainText);

const decryptedText = cryptoUtil.decrypt(cipherText);
```

## How to get involved?
For more information, on how to get involved and contribute, please head over to the [CONTRIBUTIONS.md](https://github.com/Arjunkalidas/fpe-nodejs/blob/develop/Contributions.md) document. It is a WIP, more updates coming soon.

## Code of Conduct
Refer to the [CODE_OF_CONDUCT.md](https://github.com/Arjunkalidas/fpe-nodejs/blob/develop/CODE_OF_CONDUCT.md) before contributing to this repository, as well as use the document as a reference when you interact with fellow software developers and contributors.

## Future updates
- The library supports numbers, alphanumeric and alphabets as input and tweak, but that could be expanded to support a limited set of special characters
- The encryption mode used is AES ECB, but planning to support CBC mode soon
- Option to use different encryption modes such as FF1 & FF3, or ECB, CBC with/without padding are ideas for enhancement

## Inspiration
I was inspired by the 2 libraries below and I would like to express my acknowledgements to the developers of these repos.
- [ff3 - Format Preserving Encryption in Node.js](https://github.com/mysto/node-fpe)
- [ff3 - Format Preserving Encryption in Java](https://github.com/mysto/java-fpe)

## License
This project is licensed under the terms of the [Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0).
