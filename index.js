/*
*   Copyright 2024 Arjun Kalidas
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

const cryptoUtil = require('./FF-1/CryptoUtil');

// 44 bytes in length - 16 bytes base64 encoded
let key = "TAMNxdIPhUrR4ONYGHoXJ9357F4oe+H+vFwm8f2kc7I=";

// Tweak should be 32 characters or less. Tweak is an optional field, which you can leave empty if not required.
let tweak = ""

// maximum length of plain text cannot exceed 4096
const plainText = "7693804ABC3407980"; // can be account numbers, SSN, driving license etc
console.log("plain Text input :: ",plainText);

// initialize crypto util by creating an instance and passing the key & tweak to the constructor
const encryptDecryptUtil = new cryptoUtil(key, tweak);
// call the invoke method and pass the data to encrypt
const cipherText = encryptDecryptUtil.encrypt(plainText);
console.log("cipher text :: ",cipherText);

// Decrypted util invocation
const decryptedText = encryptDecryptUtil.decrypt(cipherText);
console.log("decryptedText :: ", decryptedText);

