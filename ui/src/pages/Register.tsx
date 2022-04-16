import React from "react"
import { RouteComponentProps } from "react-router"
import { RegisterRequest } from "../api_clients/AuthApiClient"
import { RegisterForm } from "../components/RegisterForm"

interface RegisterProps extends RouteComponentProps {
    data?: RegisterRequest

}

export class Register extends React.Component<RegisterProps, any>{
    render = (): React.ReactNode => {
        return(
            <>
                <RegisterForm {...this.props} />
            </>)
        }
}