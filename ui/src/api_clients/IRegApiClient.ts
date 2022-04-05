import { RegisterRequest } from "./RegApiClient";

export interface IRegApiClient {
    register: (request: RegisterRequest) => any;
}