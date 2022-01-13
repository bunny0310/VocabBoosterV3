import { SearchWordsApiRequest } from "../components/SearchModal";
import { WordModel } from "./WordsApiClient";

export interface IWordsApiClient {
    getWords: (limit: number, offset: number) => Promise<WordModel[]>;
    searchWordsNameOnly: (postRequest: SearchWordsApiRequest) => Promise<string[]>;
    addWord: (body: WordModel) => Promise<string|undefined>;
}
