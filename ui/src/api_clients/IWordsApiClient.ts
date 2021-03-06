import { SearchWordsApiRequest } from "../components/SearchModal";
import { ApiOutcome, SearchWordResponse, WordModel } from "./WordsApiClient";

export interface IWordsApiClient {
    getWords: (limit: number, offset: number) => Promise<ApiOutcome<WordModel[] | undefined>>;
    searchWordsNameOnly: (postRequest: SearchWordsApiRequest) => Promise<ApiOutcome<SearchWordResponse[] | undefined>>;
    addWord: (body: WordModel) => Promise<ApiOutcome<string|undefined>>;
    editWord: (body: WordModel) => Promise<ApiOutcome<string|undefined>>;
    getWord: (id: string) => Promise<ApiOutcome<WordModel | undefined>>
}
