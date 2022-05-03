import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, InputChangeEventDetail, IonButton, IonSpinner, IonToast, IonText } from "@ionic/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import React from "react";
import { useHistory } from "react-router";
import { AuthenticationRequest, RegisterRequest } from "../api_clients/AuthApiClient";
import { _authApi, _messageBus } from "../App";
import { AddEditWord } from "../pages/AddEditWord";
import { MessageBus, Messages } from "../services/MessageBus";
import { ApiCallStatus } from "./AddWordForm";
import { FormChipInput } from "./FormChipInput";
import { FormInput } from "./FormInput";
import { PasswordInput } from "./PasswordInput";
import * as Yup from "yup";
import CSS from 'csstype';
import { key, mail } from "ionicons/icons";

export interface LoginFormProps {
    data: AuthenticationRequest;
}

export const LoginForm = (props: LoginFormProps) => {
    const history = useHistory(); 
    const [status, setStatus] = React.useState<ApiCallStatus>(ApiCallStatus.NONE);
    const loginButtonRef = React.useRef<HTMLIonButtonElement>(null)

    const login = async (values: AuthenticationRequest): Promise<void> => {
        const outcome = await _authApi.login(values);
        outcome == null ? setStatus(ApiCallStatus.FAIL) : setStatus(ApiCallStatus.SUCCESS);
    }

    const handleEnterPressed = (event: { keyCode: number; }) => {
        if(event.keyCode === 13) {
            loginButtonRef.current?.click()
        }
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required('Email required.')
            .email('Incorrect email.'),
        password: Yup.string()
            .required('Password required.')
            .min(5, 'At least 5 characters.')
    })

    return (<>
                <IonContent>
                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle style={{"textAlign": "center"}}>
                                <div className='titleHR'>Login</div>
                            </IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent onKeyUp={handleEnterPressed}>
                            <Formik
                                initialValues={new AuthenticationRequest()}
                                validationSchema={validationSchema}
                                onSubmit={login}
                            >
                            {formikProps =>
                                <Form>
                                    <Field
                                        as={FormInput}
                                        name='email'
                                        placeholder='Email'
                                        icon={mail}
                                        {...formikProps.getFieldMeta('email')} />
                                    <ErrorMessage
                                        name='email'
                                        component='div'
                                        className='error' />
                                    <Field
                                        as={PasswordInput}
                                        name='password'
                                        icon={key}
                                        placeholder='Password'
                                        {...formikProps.getFieldMeta('password')} />
                                    <ErrorMessage
                                        name='password'
                                        component='div'
                                        className='error' />
                                    <IonButton
                                        disabled={!formikProps.dirty || !formikProps.isValid || formikProps.isSubmitting || status === ApiCallStatus.PROCESSING}
                                        onClick={() => {
                                            setStatus(ApiCallStatus.PROCESSING);
                                            login(formikProps.values);
                                        } }
                                        fill={"solid"}
                                        size={"large"}
                                        expand={"block"}
                                        ref={loginButtonRef}
                                    >
                                        LOGIN
                                        {status === ApiCallStatus.PROCESSING && <IonSpinner name={"dots"} />}
                                    </IonButton>
                                    <div style={{textAlign: 'center'}}>
                                        <span> 
                                            Don't have an account? Click&nbsp; 
                                            <IonText 
                                                style={{cursor: 'pointer', textDecoration: 'underline'}}
                                                onClick={e => history.push('/register')}
                                            >
                                                here
                                            </IonText> 
                                            &nbsp;to register
                                        </span>
                                    </div>
                                </Form>}
                            </Formik>
                        </IonCardContent>
                    </IonCard>
                <IonToast
                    isOpen={status === ApiCallStatus.FAIL || status === ApiCallStatus.SUCCESS}
                    color={status === ApiCallStatus.SUCCESS ? 'success' : (status === ApiCallStatus.FAIL ? 'danger' : 'dark')}
                    onDidDismiss={() => {
                        if (status === ApiCallStatus.SUCCESS) {
                            _messageBus.dispatch<string>(Messages.Login, "");
                            history.push('/tab1');
                        }
                        setStatus(ApiCallStatus.NONE);
                    } }
                    message={status === ApiCallStatus.SUCCESS ? `Logged in successfully, redirecting` : 'Sorry cannot log you in at this moment.'}
                    duration={600} 
                />
                </IonContent>
            </>
    )
}