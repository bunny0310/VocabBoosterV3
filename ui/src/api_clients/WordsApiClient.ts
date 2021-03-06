import { injectable } from "inversify";
import "reflect-metadata"; 
import { IWordsApiClient } from './IWordsApiClient'
import { Storage } from '@capacitor/storage';
import axios from "axios";
import { SearchWordsApiRequest } from "../components/SearchModal";
import { jwtKeyName } from "./AuthApiClient";
import { Word } from "../components/Word";
import { _messageBus } from "../App";
import { Messages } from "../services/MessageBus";
import { BaseApiClient } from "./BaseApiClient";

const baseUrl = `${process.env.NODE_ENV === 'production' ? 'https://vocabbooster-words.herokuapp.com/Words' : 'https://localhost:5001/Words'}`;

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
    message?: any,
    code?: number,
    isSuccessful: boolean
}

@injectable()
export class WordsApiClient extends BaseApiClient implements IWordsApiClient{
    getWords = async (limit: number, offset: number): Promise<ApiOutcome<WordModel[] | undefined>> => {
            const queryModel: SearchWordsQueryModel = {
                ...defaultSearchWordsQueryModel,
                limit,
                offset
            }            
            const outcome = await this.getApi<WordModel[] | undefined>(this.generateWordsQuery(queryModel));
            return outcome;
    }

    getWord = async (id: string): Promise<ApiOutcome<WordModel | undefined>> => {
        if (!id || id.trim() === '') {
            return {
                data: undefined,
                message: "Bad Request",
                code: 400,
                isSuccessful: false
            };
        }
        const outcome = await this.getApi<WordModel | undefined>(`${baseUrl}/${id}`);
        return outcome;
    }

    private generateWordsQuery = (searchWordsQueryModel: SearchWordsQueryModel) => {
        const {filter, limit, offset, searchByName, searchByMeaning, searchBySentences, searchBySynonyms, searchByTags, q} = searchWordsQueryModel
        return `${baseUrl}?limit=${limit}&offset=${offset}&filter=${filter}&searchByName=${searchByName}&searchByMeaning=${searchByMeaning}&searchBySentences=${searchBySentences}&searchBySynonyms=${searchBySynonyms}&searchByTags=${searchByTags}&q=${q}`
    }
    
    searchWordsNameOnly = async (postRequest: SearchWordsApiRequest) => {
        const outcome = await this.postApi<SearchWordsApiRequest, SearchWordResponse[] | undefined>(`${baseUrl}/SearchWordsNameOnly`, postRequest);
        return outcome;
    }

    addWord = async (body: WordModel): Promise<ApiOutcome<string|undefined>> => {
        const outcome = await this.postApi<WordModel, WordModel>(`${baseUrl}`, body);
        const result =  {
            code: outcome.code,
            isSuccessful: outcome.isSuccessful,
            message: outcome.message,
            data: outcome.data ? outcome.data.id : undefined
        };
        return result;
    }

    editWord = async (body: WordModel): Promise<ApiOutcome<string|undefined>> => {
        const outcome = await this.putApi<WordModel, WordModel>(`${baseUrl}`, body);
        const result =  {
            code: outcome.code,
            isSuccessful: outcome.isSuccessful,
            message: outcome.message,
            data: outcome.data ? outcome.data.id : undefined
        };
        return result;
    };
}
