import { injectable } from "inversify";
import "reflect-metadata"; 
import { Storage } from '@capacitor/storage';
import axios from "axios";
import { _messageBus } from "../App";
import { Messages } from "../services/MessageBus";

const baseUrl = `${process.env.NODE_ENV === 'production' ? 'https://vocabbooster-auth.herokuapp.com/Auth' : 'http://localhost:5002/Auth'}`;

export class AuthenticationRequest {
    email: string = '';
    password: string = '';
}

export interface TokenValidationRequest {
    token: string
} 

export const jwtKeyName = "JWT_VOCABBOOSTER_2022";

@injectable()
export class AuthApiClient {
    login = async (request: AuthenticationRequest) => {
        try {
            const result = await axios.post(baseUrl, request);
            const data = await result.data;
            await Storage.set({"key": jwtKeyName, "value": data});
            return data;
        } catch (error: any) {
            return undefined;
        }
    }

    authorize = async () => {
        const token = await (await Storage.get({"key": jwtKeyName})).value ?? "";
        const request: TokenValidationRequest = {
            token
        };
        try {
            const result = await axios.post(`${baseUrl}/validate`, request);
            const data = await result.data;
            if (!data) {
                _messageBus.dispatch<string>(Messages.Logout, "logout");
                return false;
            } else {
                _messageBus.dispatch<string>(Messages.Login, "login");
                return true;
            }
        }
        catch (error: any) {
            console.log(error);
            await Storage.remove({"key": jwtKeyName});
            _messageBus.dispatch<string>(Messages.Logout, "logout");
            return false;            
        }
    }
}
