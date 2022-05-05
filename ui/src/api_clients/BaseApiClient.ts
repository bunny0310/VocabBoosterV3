import { Storage } from "@capacitor/storage";
import axios from "axios";
import { injectable } from "inversify";
import { _messageBus } from "../App";
import { Messages } from "../services/MessageBus";
import { jwtKeyName } from "./AuthApiClient";
import { ApiOutcome } from "./WordsApiClient";

@injectable()
export abstract class BaseApiClient {
    getToken = async () => {
        const tokenObj = await Storage.get({"key": jwtKeyName});
        const token = tokenObj.value;
        return token;
    }

    getRequestOptions = async () => {
        const options = {
            headers: {
                "Authorization": `Bearer ${await this.getToken()}`
            }
        }
        return options;
    }

    getApi = async <T>(url: string) : Promise<ApiOutcome<T>> => {
        try {
            const options = await this.getRequestOptions();
            const result = await axios.get<T>(url, options);
            const data = result.data;
            const outcome: ApiOutcome<T> = {
                code: await result.status,
                data,
                isSuccessful: true
            };
            return outcome;
        }
        catch (error: any) {
            const outcome: ApiOutcome<T> = {
                code: await error?.response?.status,
                isSuccessful: false
            };
            outcome.code === 401 && _messageBus.dispatch(Messages.Logout, "")
            return outcome;    
        }
    }

    postApi = async <Request, Response>(url: string, request: Request) : Promise<ApiOutcome<Response>> => {
        try {
            const options = await this.getRequestOptions();
            const result = await axios.post<Response>(url, request, options);
            const data = result.data;
            const outcome: ApiOutcome<Response> = {
                code: await result.status,
                data,
                isSuccessful: true
            };
            return outcome;
        }
        catch (error: any) {
            const outcome: ApiOutcome<Response> = {
                code: await error?.response?.status,
                isSuccessful: false
            };
            outcome.code === 401 && _messageBus.dispatch(Messages.Logout, "")
            return outcome;    
        }
    }

    putApi = async <Request, Response>(url: string, request: Request) : Promise<ApiOutcome<Response>> => {
        try {
            const options = await this.getRequestOptions();
            const result = await axios.put<Response>(url, request, options);
            const data = result.data;
            const outcome: ApiOutcome<Response> = {
                code: await result.status,
                data,
                isSuccessful: true
            };
            return outcome;
        }
        catch (error: any) {
            const outcome: ApiOutcome<Response> = {
                code: await error?.response?.status,
                isSuccessful: false
            };
            outcome.code === 401 && _messageBus.dispatch(Messages.Logout, "")
            return outcome;    
        }
    }

    deleteApi = async <T>(url: string) : Promise<ApiOutcome<T>> => {
        try {
            const options = await this.getRequestOptions();
            const result = await axios.delete<T>(url, options);
            const data = result.data;
            const outcome: ApiOutcome<T> = {
                code: await result.status,
                data,
                isSuccessful: true
            };
            return outcome;
        }
        catch (error: any) {
            const outcome: ApiOutcome<T> = {
                code: await error?.response?.status,
                isSuccessful: false
            };
            outcome.code === 401 && _messageBus.dispatch(Messages.Logout, "")
            return outcome;    
        }
    }


}