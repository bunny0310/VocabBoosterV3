import React from "react"
import { AuthenticationRequest } from "../api_clients/AuthApiClient"
import { WordModel } from "../api_clients/WordsApiClient"
import { AddWordForm } from "../components/AddWordForm"
import { LoginForm } from "../components/LoginForm"

interface LoginProps {
    data?: AuthenticationRequest
} 
export class Login extends React.Component<LoginProps, any> {

    render = (): React.ReactNode => {
        return (
        <>
                <LoginForm data={this.props.data ?? new AuthenticationRequest()}/>
        </>)
    }
}