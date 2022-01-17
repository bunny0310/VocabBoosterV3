import { SearchWordsApiRequest } from "../components/SearchModal";
import { ApiOutcome, SearchWordResponse, WordModel } from "./WordsApiClient";

export interface IWordsApiClient {
    getWords: (limit: number, offset: number) => Promise<WordModel[]>;
    searchWordsNameOnly: (postRequest: SearchWordsApiRequest) => Promise<SearchWordResponse[]>;
    addWord: (body: WordModel) => Promise<string|undefined>;
    editWord: (body: WordModel) => Promise<string|undefined>;
    getWord: (id: string) => Promise<ApiOutcome<WordModel>>
}
