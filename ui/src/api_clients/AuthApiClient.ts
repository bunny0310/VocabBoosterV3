import { injectable } from "inversify"
import "reflect-metadata"
import { Storage } from '@capacitor/storage'
import axios from "axios"
import { _messageBus } from "../App"
import { Messages } from "../services/MessageBus"

let baseUrl = `${process.env.NODE_ENV === 'production' ? 'https://vocabbooster-auth.herokuapp.com/Auth' : 'http://localhost:5002/Auth'}`;
if (process.env.REACT_APP_ENV === 'qa') {
    baseUrl='https://qa-vb-auth.herokuapp.com/Auth'
}

export class AuthenticationRequest {
    email: string = ''
    password: string = ''
}

export class RegisterRequest extends AuthenticationRequest {
    firstName: string = ''
    lastName: string = ''
}

export interface TokenValidationRequest {
    token: string
}

export const jwtKeyName = "JWT_VOCABBOOSTER_2022";

@injectable()
export class AuthApiClient {
    login = async (request: AuthenticationRequest): Promise<string | undefined> => {
        try {
            const result = await axios.post<string>(baseUrl, request);
            await Storage.set({"key": jwtKeyName, "value": result.data});
            return result.data;
        } catch (error: any) {
            return undefined;
        }
    }

    signup = async (request: AuthenticationRequest) => {
        try {
            const url = `${baseUrl}/signup`
            const result = await axios.post(url, request);
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
