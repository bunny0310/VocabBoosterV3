import { writeFile, readFileSync } from "fs"
import { ObjectID } from "bson"

const blob = readFileSync("data/words.json", "utf-8")
let words = []
blob.split('\n').forEach(line => {
    try {
        words.push(JSON.parse(line))
    }
    catch (err) {
    }
})

function pad(n: number) {
    return (n < 10) ? ("0" + n) : n;
}

function millisecondPad(n: number) {
    if (n < 10) {
        return `00${n}`;
    }
    if (n < 100) {
        return `0${n}`
    }
    return n
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
}

enum WordType {
    Adverb,
    Adjective,
    Excerpt,
    Expression,
    Noun,
    Verb,
    Metaphor,
    PhrasalVerb
}

const morphedWords = []

for(const word of words) {
    const types = word.types as string[]
    const mappedTypes = types.map(type => {
        switch(type.toLowerCase()) {
            case 'noun':
                return WordType.Noun
            case 'adjective':
                return WordType.Adjective
            case 'adverb':
                return WordType.Adverb
            case 'excerpt':
                return WordType.Excerpt
            case 'expression':
                return WordType.Expression
            case 'verb':
                return WordType.Verb
            case 'phrasal verb':
                return WordType.PhrasalVerb
            case 'metaphor':
                return WordType.Metaphor
            default:
                return -1
        }
    })
    const date = randomDate()
    const morphedWord = {
        ...word,
        types: mappedTypes,
        // "_id": {"$oid": new ObjectID().toString()},
        user: {"$oid":"5fef467bcb823fa32b020478"},
        // createdAt: {"$date": date},
        // updatedAt: {"$date": date},
    }
    morphedWords.push(morphedWord)
}

let bigString = ''
for(const word of morphedWords) {
    bigString += JSON.stringify(word)
}

writeFile('./data/words.json', bigString, () => {
})




