import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, InputChangeEventDetail, IonButton, IonSpinner, IonToast } from "@ionic/react";
import  React  from 'react';
import { useHistory } from "react-router";
import { RegisterRequest } from "../api_clients/RegApiClient";
import { _authApi, _regApi } from "../App";
import { ApiCallStatus } from "./AddWordForm";
import { FormInput } from "./FormInput";
import { PasswordInput } from "./PasswordInput";




export class RegisterForm extends React.Component<{},{firstName: string, lastName: string, email: string, password: string, apiStatus: ApiCallStatus}>{
    constructor(props: any){
        super(props);
        this.state = {firstName: '', lastName: '', email: '', password: '', apiStatus: ApiCallStatus.SUCCESS};

        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePassChange = this.handlePassChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onDidDismiss = this.onDidDismiss.bind(this);
    }

    async register() {
        const {firstName, lastName, email, password} = this.state;
        const outcome: string | undefined = await _regApi.register({firstName: firstName, lastName: lastName, email: email, password: password});
        outcome == null ? this.setState({apiStatus: ApiCallStatus.FAIL}) : this.setState({apiStatus: ApiCallStatus.SUCCESS});
    }

    handleFirstNameChange(e: any){
        this.setState({firstName: e.target.value});
    }

    handleLastNameChange(e: any){
        this.setState({lastName: e.target.value});
    }

    handleEmailChange(e: any){
        this.setState({email: e.target.value})
    }
    handlePassChange(e: any){
        this.setState({password: e.target.value})
    }
    onClick(e: any){
        this.register();
        this.setState({apiStatus: ApiCallStatus.PROCESSING});
    }

    validFormString(str: string) {
        return str.trim() !== '';
    }

    onDidDismiss(e: any){;}

    render(){
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
                        isValid={this.validFormString(this.state.firstName)}
                        validationMessage={"Please enter your First Name."}
                        onChange={this.handleFirstNameChange}
                        value={this.state.firstName}
                    />
                    <FormInput 
                        label={"Last Name"}
                        isValid={this.validFormString(this.state.lastName)}
                        validationMessage={"Please enter your Last Name."}
                        onChange={this.handleLastNameChange}
                        value={this.state.lastName}
                    />
                    <FormInput 
                        label={"Email Address"}
                        isValid={this.validFormString(this.state.email)}
                        validationMessage={"Please enter your email address."}
                        onChange={this.handleEmailChange}
                        value={this.state.email}
                    />
                    <PasswordInput 
                        label={"Password"}
                        isValid={this.validFormString(this.state.password)}
                        validationMessage={"Please enter your password."}
                        onChange={this.handlePassChange}
                        value={this.state.password}
                    />
                    <IonButton 
                        disabled={this.state.email === '' || this.state.password === '' || this.state.apiStatus === ApiCallStatus.PROCESSING} 
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