"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const blob = (0, fs_1.readFileSync)("data/words.json", "utf-8");
let words = [];
blob.split('\n').forEach(line => {
    try {
        words.push(JSON.parse(line));
    }
    catch (err) {
    }
});
function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}
function millisecondPad(n) {
    if (n < 10) {
        return `00${n}`;
    }
    if (n < 100) {
        return `0${n}`;
    }
    return n;
}
const randomDate = () => {
    const year = 2022;
    const month = Math.floor(Math.random() * 5) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const hour = Math.floor(Math.random() * 23) + 1;
    const minute = Math.floor(Math.random() * 59) + 1;
    const second = Math.floor(Math.random() * 59) + 1;
    const msecond = Math.floor(Math.random() * 999) + 1;
    return `${pad(year)}-${pad(month)}-${pad(day)}T${pad(hour)}:${[pad(minute)]}:${pad(second)}.${millisecondPad(msecond)}Z`;
};
var WordType;
(function (WordType) {
    WordType[WordType["Adverb"] = 0] = "Adverb";
    WordType[WordType["Adjective"] = 1] = "Adjective";
    WordType[WordType["Excerpt"] = 2] = "Excerpt";
    WordType[WordType["Expression"] = 3] = "Expression";
    WordType[WordType["Noun"] = 4] = "Noun";
    WordType[WordType["Verb"] = 5] = "Verb";
    WordType[WordType["Metaphor"] = 6] = "Metaphor";
    WordType[WordType["PhrasalVerb"] = 7] = "PhrasalVerb";
})(WordType || (WordType = {}));
const morphedWords = [];
for (const word of words) {
    const types = word.types;
    const mappedTypes = types.map(type => {
        switch (type.toLowerCase()) {
            case 'noun':
                return WordType.Noun;
            case 'adjective':
                return WordType.Adjective;
            case 'adverb':
                return WordType.Adverb;
            case 'excerpt':
                return WordType.Excerpt;
            case 'expression':
                return WordType.Expression;
            case 'verb':
                return WordType.Verb;
            case 'phrasal verb':
                return WordType.PhrasalVerb;
            case 'metaphor':
                return WordType.Metaphor;
            default:
                return -1;
        }
    });
    const date = randomDate();
    const morphedWord = Object.assign(Object.assign({}, word), { types: mappedTypes, 
        // "_id": {"$oid": new ObjectID().toString()},
        user: { "$oid": "5fef467bcb823fa32b020478" } });
    morphedWords.push(morphedWord);
}
let bigString = '';
for (const word of morphedWords) {
    bigString += JSON.stringify(word);
}
(0, fs_1.writeFile)('./data/words.json', bigString, () => {
});
//# sourceMappingURL=refactor.js.map