import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, InputChangeEventDetail, IonButton, IonSpinner, IonToast } from "@ionic/react";
import  React  from 'react';
import { useHistory } from "react-router";
import { RegisterRequest } from "../api_clients/RegApiClient";
import { _authApi, _regApi } from "../App";
import { ApiCallStatus } from "./AddWordForm";
import { FormInput } from "./FormInput";
import { PasswordInput } from "./PasswordInput";



interface IRegisterFormState {
    data: RegisterRequest,
    apiStatus: ApiCallStatus
}

interface IRegisterFormProps {

}

export class RegisterForm extends React.Component<IRegisterFormProps, IRegisterFormState> {
    constructor(props: any) {
        super(props);
        this.state = {
            data: new RegisterRequest(),
            apiStatus: ApiCallStatus.NONE
        };
    }

    register = async () => {
        if(!this.state.data) {
            return
        }
        const outcome: string | undefined = await _regApi.register(this.state.data);
        outcome == null ? this.setState({apiStatus: ApiCallStatus.FAIL}) : this.setState({apiStatus: ApiCallStatus.SUCCESS});
    }

    handleFirstNameChange = (e: any) => {
        this.setState(
            {
                data: {
                    // ... creating new properties except for firstName
                    ...this.state.data, 
                    firstName: e.target.value ?? ''
                }    
            }
        );
    }

    handleLastNameChange = (e: any) => {
        this.setState(
            {
                data: {
                    ...this.state.data, 
                    lastName: e.target.value ?? ''
                }    
            }
        );
    }

    handleEmailChange = (e: any) => {
        this.setState(
            {
                data: {
                    ...this.state.data, 
                    email: e.target.value ?? ''
                }    
            }
        );
    }
    handlePassChange = (e: any) => {
        this.setState(
            {
                data: {
                    ...this.state.data, 
                    password: e.target.value ?? ''
                }    
            }
        );
    }

    onClick = (e: any) => {
        this.register();
        this.setState({apiStatus: ApiCallStatus.PROCESSING});
    }

    validFormString = (str: string) => {
        return str.trim() !== '';
    }

    onDidDismiss = (e: any) => {
        
    }

    render() {
        const validationObject: any = {
            firstName: this.state.data.firstName !== '',
            lastName: this.state.data.lastName !== '',
            email: this.state.data.email !== '',
            password: this.state.data.password !== ''
        }
        const isFormValid = !Object.values(validationObject).includes(false)
        
        return(<>
        <IonContent className="center">
            <IonCard>
                <IonCardHeader>
                    <IonCardTitle style={{"textAlign": "center"}}>
                        Register
                    </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                <FormInput 
                        label={"First Name"}
                        isValid={this.validFormString(this.state.data.firstName)}
                        validationMessage={"Please enter your First Name."}
                        onChange={this.handleFirstNameChange}
                        value={this.state.data.firstName}
                    />
                    <FormInput 
                        label={"Last Name"}
                        isValid={this.validFormString(this.state.data.lastName)}
                        validationMessage={"Please enter your Last Name."}
                        onChange={this.handleLastNameChange}
                        value={this.state.data.lastName}
                    />
                    <FormInput 
                        label={"Email Address"}
                        isValid={this.validFormString(this.state.data.email)}
                        validationMessage={"Please enter your email address."}
                        onChange={this.handleEmailChange}
                        value={this.state.data.email}
                    />
                    <PasswordInput 
                        label={"Password"}
                        isValid={this.validFormString(this.state.data.password)}
                        validationMessage={"Please enter your password."}
                        onChange={this.handlePassChange}
                        value={this.state.data.password}
                    />
                    <IonButton 
                        disabled={!isFormValid || this.state.apiStatus === ApiCallStatus.PROCESSING} 
                        onClick={this.onClick} 
                        fill={"solid"} 
                        size={"large"} 
                        expand={"block"}>
                            REGISTER
                            {this.state.apiStatus === ApiCallStatus.PROCESSING
                                && <IonSpinner name={"dots"} />}
                    </IonButton>
                </IonCardContent>
            </IonCard>
            <IonToast
            isOpen={this.state.apiStatus === ApiCallStatus.FAIL
                || this.state.apiStatus === ApiCallStatus.SUCCESS}
            color={this.state.apiStatus === ApiCallStatus.SUCCESS ? 'success' : (this.state.apiStatus === ApiCallStatus.FAIL ? 'danger': 'dark')}
            onDidDismiss={this.onDidDismiss}
            message={this.state.apiStatus === ApiCallStatus.SUCCESS ? `Registered successfully` : 'Sorry cannot register you in at this moment.'}
            duration={600}
            />
        </IonContent>
        </>)
    }
}