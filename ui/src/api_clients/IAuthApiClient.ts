import { AuthenticationRequest } from "./AuthApiClient";

export interface IAuthApiClient {
    login: (request: AuthenticationRequest) => any;
    signup: (request: AuthenticationRequest) => any;
    authorize: () => any;
}
