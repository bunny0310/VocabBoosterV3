import { injectable } from "inversify";
import "reflect-metadata"; 
import { IWordsApiClient } from './IWordsApiClient'
import axios from "axios";
import { SearchWordsApiRequest } from "../components/SearchModal";

const baseUrl = `https://localhost:7296/Words`;

export interface WordModel {
    name: string,
    meaning: string,
    sentences: string[],
    synonyms: string[],
    tags: string[],
    types: string[]
} 

@injectable()
export class WordsApiClient implements IWordsApiClient {
    getWords = async (limit: number, offset: number) => {
        const response = await axios
        .get<WordModel[]>(`${baseUrl}?limit=${limit}&offset=${offset}`);
        
        const words = await response.data;
        return words;
    }
    
    searchWordsNameOnly = async (postRequest: SearchWordsApiRequest) => {
        const response = await axios
        .post<string[]>(`${baseUrl}/SearchWordsNameOnly`, postRequest);

        const words = await response.data;
        return words;
    }
}
