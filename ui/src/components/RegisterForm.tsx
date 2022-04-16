import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, InputChangeEventDetail, IonButton, IonSpinner, IonToast, IonInput } from "@ionic/react";
import  React  from 'react';
import { useHistory } from "react-router";
import { RegisterRequest } from "../api_clients/AuthApiClient";
import { _authApi, _messageBus } from "../App";
import { Messages } from "../services/MessageBus";
import { ApiCallStatus } from "./AddWordForm";
import { FormInput } from "./FormInput";
import { PasswordInput } from "./PasswordInput";
import { RedirectComponent } from "./RedirectComponent";
import { ErrorMessage, Field, Form, Formik } from "formik"
import * as Yup from "yup"



interface IRegisterFormState {
    data: RegisterRequest,
    apiStatus: ApiCallStatus
}

interface IRegisterFormProps {

}

const validationSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('First name required'),
    lastName: Yup.string()
        .required('Last name required'),
    email: Yup.string()
        .required('Email required.')
        .email('Incorrect email.'),
    password: Yup.string()
        .required('Password required.')
        .min(5, 'At least 5 characters.')
})

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
        const outcome: string | undefined = await _authApi.signup(this.state.data)
        outcome == null ? this.setState({apiStatus: ApiCallStatus.FAIL}) : this.setState({apiStatus: ApiCallStatus.SUCCESS})
    }

    handleFirstNameChange = (e: any) => {
        this.setState(
            {
                data: {
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
        this.register()
        this.setState({apiStatus: ApiCallStatus.PROCESSING})
    }

    validFormString = (str: string) => {
        return str.trim() !== ''
    }

    onDidDismiss = (e: any) => {
        if (this.state.apiStatus === ApiCallStatus.SUCCESS) {
            _messageBus.dispatch<string>(Messages.Login, '')
            _messageBus.dispatch(Messages.Redirect, '/tab1')
        }
    }

    render() {
        
        return(<>
        {/* <RedirectComponent /> */}
        {/* <IonContent className="center"> */}
            <IonCard>
                <IonCardHeader>
                    <IonCardTitle style={{"textAlign": "center"}}>
                        Register
                    </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    <Formik
                        initialValues={new RegisterRequest()}
                        validationSchema={validationSchema}
                        onSubmit={this.onClick}
                    >
                        {formikProps => <>
                            <Form>
                                <Field
                                    as={FormInput}
                                    name='firstName'
                                    placeholder='First Name'
                                />
                                {/* <ErrorMessage
                                    name='firstName'
                                    component='div'
                                    className='error'
                                />
                                <Field
                                    as={FormInput}
                                    name='lastName'
                                    placeholder='Last Name'
                                />
                                <ErrorMessage
                                    name='lastName'
                                    component='div'
                                    className='error'
                                />
                                <Field
                                    as={FormInput}
                                    name='email'
                                    placeholder='Email'
                                /> 
                                <ErrorMessage
                                    name='email'
                                    component='div'
                                    className='error'
                                />
                                <Field
                                    as={PasswordInput}
                                    name='password'
                                    placeholder='Password'
                                /> 
                                <ErrorMessage
                                    name='password'
                                    component='div'
                                    className='error'
                                />                                   */}
                            </Form>                                
                        </>}
                    </Formik>
                    {/* <FormInput 
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
                    </IonButton> */}
                </IonCardContent>
            </IonCard>
            <IonToast
            isOpen={this.state.apiStatus === ApiCallStatus.FAIL
                || this.state.apiStatus === ApiCallStatus.SUCCESS}
            color={this.state.apiStatus === ApiCallStatus.SUCCESS ? 'success' : (this.state.apiStatus === ApiCallStatus.FAIL ? 'danger': 'dark')}
            onDidDismiss={this.onDidDismiss}
            message={this.state.apiStatus === ApiCallStatus.SUCCESS ? `Registered successfully, signing you in` : 'Sorry cannot register you in at this moment.'}
            duration={3000}
            />
        {/* </IonContent> */}
        </>)
    }
}