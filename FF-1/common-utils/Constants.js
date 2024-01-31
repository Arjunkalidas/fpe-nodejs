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

/** Encryption mode */
const ENCRYPTION_MODE = "ENCYRPTION_MODE";

/** Decryption mode */
const DECRYPTION_MODE = "DECRYPTION_MODE";

/** FPE mode */
const FPE_MODE = "FPE_MODE";

/** FF1 mode */
const FF1 = "FF1";

/** FF3 mode */
const FF3 = "FF3";

/** AES ECB ALGORITHM */
const AES_ECB_ALGORITHM = 'aes-256-ecb';

/** AES CBC ALGORITHM */
const AES_CBC_ALGORITHM = 'aes-256-cbc';

/** MAX LEN of input */
const MAX_LEN = 4096;

/** MIN RADIX permitted */
const MIN_RADIX = 2;

/** MAX RADIX permitted */
const MAX_RADIX = 65536;

/** MIN LEN of the input */
const MIN_LEN = 2;

/** NUM ROUNDS of iteration to achieve FF1 mode */
const NUM_ROUNDS = 10;

/** BASE 64 mode for text encoding */
const BASE64 = "base64";

module.exports = {
    ENCRYPTION_MODE,
    DECRYPTION_MODE,
    FPE_MODE,
    FF1,
    FF3,
    AES_ECB_ALGORITHM,
    AES_CBC_ALGORITHM,
    MAX_LEN,
    MIN_RADIX,
    MAX_RADIX,
    MIN_LEN,
    NUM_ROUNDS,
    BASE64
}
