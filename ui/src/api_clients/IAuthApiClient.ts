import { AuthenticationRequest } from "./AuthApiClient";

export interface IAuthApiClient {
    login: (request: AuthenticationRequest) => Promise<string | undefined>;
    signup: (request: AuthenticationRequest) => any;
    authorize: () => any;
}
