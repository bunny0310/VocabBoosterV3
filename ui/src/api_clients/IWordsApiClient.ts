import { SearchWordsByNameApiRequest } from "../pages/Words";
import { ApiOutcome, SearchWordResponse, WordModel, WordType } from "./WordsApiClient";

export interface IWordsApiClient {
    getWords: (limit: number, offset: number, filter?: SearchWordsByNameApiRequest) => Promise<ApiOutcome<WordModel[] | undefined>>;
    getWordsRange: (type: WordType, startDate: Date, endDate: Date) => Promise<ApiOutcome<WordModel[] | undefined>>;
    searchWordsNameOnly: (postRequest: SearchWordsByNameApiRequest) => Promise<ApiOutcome<SearchWordResponse[] | undefined>>;
    addWord: (body: WordModel) => Promise<ApiOutcome<string|undefined>>;
    editWord: (body: WordModel) => Promise<ApiOutcome<string|undefined>>;
    getWord: (id: string) => Promise<ApiOutcome<WordModel | undefined>>;
    deleteWord: (id: string) => Promise<ApiOutcome<boolean>>;
}
