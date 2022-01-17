import { injectable } from "inversify";
import "reflect-metadata"; 
import { IWordsApiClient } from './IWordsApiClient'
import axios from "axios";
import { SearchWordsApiRequest } from "../components/SearchModal";

const baseUrl = `${process.env.NODE_ENV === 'production' ? 'https://vocabbooster-words.herokuapp.com/Words' : 'https://localhost:7296/Words'}`;

export class WordModel {
    id?: string = undefined
    name: string = "";
    meaning: string = "";
    sentences: string[] = [];
    synonyms: string[] = [];
    tags: string[] = [];
    types: string[] = [];
} 

export interface SearchWordsQueryModel {
    filter: boolean,
    limit: number,
    offset: number,
    searchByName: boolean,
    searchByMeaning: boolean,
    searchBySentences: boolean,
    searchBySynonyms: boolean,
    searchByTags: boolean,
    q: string
}

export const defaultSearchWordsQueryModel: SearchWordsQueryModel = {
    filter: false,
    limit: 5,
    offset: 0,
    searchByName: false,
    searchByMeaning: false,
    searchBySentences: false,
    searchBySynonyms: false,
    searchByTags: false,
    q: ""
}

export interface SearchWordResponse {
    id: string,
    name: string
}

export interface ApiOutcome<T> {
    data?: T,
    error?: any,
    code?: number
}

@injectable()
export class WordsApiClient implements IWordsApiClient {
    getWords = async (limit: number, offset: number) => {
        const queryModel: SearchWordsQueryModel = {
            ...defaultSearchWordsQueryModel,
            limit,
            offset
        }
        const response = await axios
        .get<WordModel[]>(this.generateWordsQuery(queryModel));
        
        const words = await response.data;
        return words;
    }

    getWord = async (id: string): Promise<ApiOutcome<WordModel>> => {
        if (!id || id.trim() === '') {
            return {
                data: undefined,
                error: "Bad Request",
                code: 400
            };
        }
        try {
            const response = await axios
            .get<WordModel>(`${baseUrl}/${id}`);
            const word = await response.data;
            const code = await response.status;
            return {
                data: word,
                code
            };
        }
        catch (error: any) {
            return {
                code: await error.response.status,
                error: "Internal Server Error"
            }
        }
    }

    private generateWordsQuery = (searchWordsQueryModel: SearchWordsQueryModel) => {
        const {filter, limit, offset, searchByName, searchByMeaning, searchBySentences, searchBySynonyms, searchByTags, q} = searchWordsQueryModel
        return `${baseUrl}?limit=${limit}&offset=${offset}&filter=${filter}&searchByName=${searchByName}&searchByMeaning=${searchByMeaning}&searchBySentences=${searchBySentences}&searchBySynonyms=${searchBySynonyms}&searchByTags=${searchByTags}&q=${q}`
    }
    
    searchWordsNameOnly = async (postRequest: SearchWordsApiRequest) => {
        const response = await axios
        .post<SearchWordResponse[]>(`${baseUrl}/SearchWordsNameOnly`, postRequest);

        const words = await response.data;
        return words;
    }

    addWord = async (body: WordModel): Promise<string|undefined> => {
        try {
            const response = await axios
            .post<WordModel>(`${baseUrl}`, body);
    
            const data = await response.data;
            return data.id!;
        }
        catch(error: any) {
            console.log(error);
            return undefined;
        }
    };

    editWord = async (body: WordModel): Promise<string|undefined> => {
        try {
            const response = await axios
            .put<WordModel>(`${baseUrl}`, body);
    
            const data = await response.data;
            return data.id!;
        }
        catch(error: any) {
            console.log(error);
            return undefined;
        }
    };
}
