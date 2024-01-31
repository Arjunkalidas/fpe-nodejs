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

class CharMap {

    /**
     * This function converts the input character array to a map
     * @param {*} charArray 
     * @returns a map with key as the ASCII character and value as an integer
     */
    convertToMap(charArray) {
        let map = new Map();
        for(let i = 0; i < charArray.length; i++) {
            let char = charArray[i];
            map.set(char, i);
        }
        return map;
    }
}

module.exports = CharMap;