import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, InputChangeEventDetail, IonButton, IonSpinner, IonToast, IonInput } from "@ionic/react";
import  React  from 'react';
import { RouteComponentProps, useHistory } from "react-router";
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
    apiStatus: ApiCallStatus
}

interface IRegisterFormProps extends RouteComponentProps {
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
    registerButtonRef: React.RefObject<HTMLIonButtonElement>
    constructor(props: any) {
        super(props);
        this.state = {
            apiStatus: ApiCallStatus.NONE
        };
        this.registerButtonRef = React.createRef<HTMLIonButtonElement>()
    }

    handleEnterPressed = (event: { keyCode: number; }) => {
        if(event.keyCode === 13) {
            this.registerButtonRef.current?.click()
        }
    }

    register = async (values: RegisterRequest) => {
        const outcome: string | undefined = await _authApi.signup(values)
        outcome == null ? this.setState({apiStatus: ApiCallStatus.FAIL}) : this.setState({apiStatus: ApiCallStatus.SUCCESS})
    }

    onSubmit = (values: RegisterRequest) => {
        this.register(values)
        this.setState({apiStatus: ApiCallStatus.PROCESSING})
    }

    onDidDismiss = (e: any) => {
        if (this.state.apiStatus === ApiCallStatus.SUCCESS) {
            _messageBus.dispatch<string>(Messages.Login, '')
            this.props.history.push('/tab1')
        }
    }

    render() {
        return(<>
        <IonContent className="center" onKeyUp={this.handleEnterPressed}>
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
                        onSubmit={this.onSubmit}
                    >
                        {formikProps => <>
                            <Form>
                                <Field
                                    as={FormInput}
                                    name='firstName'
                                    placeholder='First Name'
                                    {...formikProps.getFieldMeta('firstName')}
                                />
                                <ErrorMessage
                                    name='firstName'
                                    component='div'
                                    className='error'
                                />
                                <Field
                                    as={FormInput}
                                    name='lastName'
                                    placeholder='Last Name'
                                    {...formikProps.getFieldMeta('lastName')}
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
                                    {...formikProps.getFieldMeta('email')}
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
                                    {...formikProps.getFieldMeta('password')}
                                /> 
                                <ErrorMessage
                                    name='password'
                                    component='div'
                                    className='error'
                                />  
                                <IonButton 
                                    disabled={!formikProps.dirty || !formikProps.isValid || formikProps.isSubmitting || this.state.apiStatus === ApiCallStatus.PROCESSING} 
                                    type={'submit'}
                                    ref={this.registerButtonRef}
                                    onSubmit={() => this.onSubmit(formikProps.values)} 
                                    fill={"solid"} 
                                    size={"large"} 
                                    expand={"block"}>
                                        REGISTER
                                        {this.state.apiStatus === ApiCallStatus.PROCESSING
                                            && <IonSpinner name={"dots"} />}
                                </IonButton>                                
                            </Form>                                
                        </>}
                    </Formik>
                </IonCardContent>
            </IonCard>
            <IonToast
            isOpen={this.state.apiStatus === ApiCallStatus.FAIL
                || this.state.apiStatus === ApiCallStatus.SUCCESS}
            color={this.state.apiStatus === ApiCallStatus.SUCCESS ? 'success' : (this.state.apiStatus === ApiCallStatus.FAIL ? 'danger': 'dark')}
            onDidDismiss={this.onDidDismiss}
            message={this.state.apiStatus === ApiCallStatus.SUCCESS ? `Registered successfully, signing you in` : 'Sorry cannot register you in at this moment.'}
            duration={1500}
            />
        </IonContent>
        </>)
    }
}