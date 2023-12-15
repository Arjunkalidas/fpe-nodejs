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