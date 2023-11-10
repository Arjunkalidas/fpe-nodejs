'use strict';

class charMap {

    convertToMap(charArray) {
        let map = new Map();
        for(let i = 0; i < charArray.length; i++) {
            let char = charArray[i];
            map.set(char, i);
        }
        return map;
    }
}

module.exports = charMap;