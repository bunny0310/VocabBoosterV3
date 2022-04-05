import { injectable } from "inversify";
import "reflect-metadata"; 
import { Storage } from '@capacitor/storage';
import axios from "axios";
import { _messageBus } from "../App";
import { Messages } from "../services/MessageBus";

//don't know what the baseURL should be
const baseUrl = `${process.env.NODE_ENV === 'production' ? '' : ''}`;

export class RegisterRequest{
    firstName: string = '';
    lastName: string = '';
    email: string = '';
    password: string = '';
}

@injectable()
export class RegApiClient{
    register = async(request: RegisterRequest) => {
        try {
            const result = await axios.post(baseUrl, request);
            const data = await result.data;
            //return data ????
        } catch (error: any) {
            return undefined;
        }
    }
}