import React from "react"
import { RegisterRequest } from "../api_clients/RegApiClient"
import { RegisterForm } from "../components/RegisterForm"

interface RegisterProps{
    data?: RegisterRequest
}

export class Register extends React.Component<RegisterProps, any>{
    render = (): React.ReactNode => {
        return(
            <>
                <RegisterForm />
            </>)
        }
}