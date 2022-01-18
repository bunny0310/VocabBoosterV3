import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, InputChangeEventDetail, IonButton, IonSpinner, IonToast } from "@ionic/react";
import React from "react";
import { useHistory } from "react-router";
import { AuthenticationRequest } from "../api_clients/AuthApiClient";
import { _authApi, _messageBus } from "../App";
import { AddEditWord } from "../pages/AddEditWord";
import { MessageBus, Messages } from "../services/MessageBus";
import { ApiCallStatus } from "./AddWordForm";
import { FormChipInput } from "./FormChipInput";
import { FormInput } from "./FormInput";

export interface LoginFormProps {
    data: AuthenticationRequest;
}

export const LoginForm = (props: LoginFormProps) => {
    const history = useHistory(); 

    const [values, setValues] = React.useState<AuthenticationRequest>(props.data);
    const [status, setStatus] = React.useState<ApiCallStatus>(ApiCallStatus.NONE);
    React.useEffect(() => {
        setValues(props.data);
    }, [props.data])

    const isFormValid: any = {
        email: values.email !== '',
        password: values.password !== '',
    } 

    let disabled = Object.values(isFormValid).includes(false);

    const login = async (): Promise<void> => {
        const outcome: string | undefined = await _authApi.login(values);
        outcome == null ? setStatus(ApiCallStatus.FAIL) : setStatus(ApiCallStatus.SUCCESS);
    }

    return (<>
                    <IonContent className="center">
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle style={{"textAlign": "center"}}>
                                    Login
                                </IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <FormInput 
                                    label={"Email Address"}
                                    isValid={values.email.trim() !== ''}
                                    validationMessage={"Please enter your email address."}
                                    onChange={(e: CustomEvent<InputChangeEventDetail>) => setValues({...values, email: e.detail.value ?? ''})}
                                    value={values.email}
                                />
                                <FormInput 
                                    label={"Password"}
                                    isValid={values.password.trim() !== ''}
                                    validationMessage={"Please enter your password."}
                                    onChange={(e: CustomEvent<InputChangeEventDetail>) => setValues({...values, password: e.detail.value ?? ''})}
                                    value={values.password}
                                />
                                <IonButton 
                                    disabled={disabled || status === ApiCallStatus.PROCESSING} 
                                    onClick={() => {
                                        setStatus(ApiCallStatus.PROCESSING);
                                        login();
                                    }} 
                                    fill={"solid"} 
                                    size={"large"} 
                                    expand={"block"}>
                                        LOGIN
                                        {status === ApiCallStatus.PROCESSING && <IonSpinner name={"dots"} />}
                                </IonButton>
                            </IonCardContent>
                        </IonCard>
                        
                        <IonToast
                        isOpen={status === ApiCallStatus.FAIL || status === ApiCallStatus.SUCCESS}
                        color={status === ApiCallStatus.SUCCESS ? 'success' : (status === ApiCallStatus.FAIL ? 'danger': 'dark')}
                        onDidDismiss={() => {
                                if (status === ApiCallStatus.SUCCESS) {
                                    _messageBus.dispatch<string>(Messages.Login, "");
                                    history.push('/tab1');
                                }
                                setStatus(ApiCallStatus.NONE);
                            }
                        }
                        message={status === ApiCallStatus.SUCCESS ? `Logged in successfully, redirecting` : 'Sorry cannot log you in at this moment.'}
                        duration={600}
                        />
                    </IonContent>
    </>)
}