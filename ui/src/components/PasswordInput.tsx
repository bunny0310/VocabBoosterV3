import { InputChangeEventDetail, IonButtons, IonIcon, IonInput, IonItem, IonLabel, IonNote } from "@ionic/react"
import { eye, trash } from "ionicons/icons";
import React from "react";

export interface PasswordInputProps {
    label: string;
    value?: string;
    onChange?: (e: CustomEvent<InputChangeEventDetail>) => void;
    onBlur?: (e: CustomEvent<FocusEvent>) => void;
    onFocus?: (e: CustomEvent<FocusEvent>) => void;
    disabled?: boolean;
    placeholder?: string;
    isValid?: boolean;
    validationMessage?: string;
}
export const PasswordInput = (props: PasswordInputProps) => {
    const isValid = props.isValid ?? true;
    const [touched, setTouched] = React.useState<boolean>(false);
    const [show, setShow] = React.useState<boolean>(false);

    return (
        <>
            <IonItem>
            {(isValid || !touched) && <IonLabel position="stacked" color={"dark"}>{props.label}</IonLabel>}
            { !isValid && touched && <IonNote color={'danger'}>{props.validationMessage}</IonNote>}
                <IonInput
                    type={show ? "text" : "password"}
                    className={"formInput"}
                    onIonChange={(e: CustomEvent<InputChangeEventDetail>) => props.onChange && props.onChange(e)}
                    onKeyUp={(e: any) => {
                        !touched && setTouched(true);
                    }}
                    onIonBlur={(e: CustomEvent<FocusEvent>) => {props.onBlur && props.onBlur(e)}}
                    onIonFocus={(e: CustomEvent<FocusEvent>) => {props.onFocus && props.onFocus(e)}}
                    placeholder={props.placeholder}
                    value={props.value}
                >
                </IonInput>    
                <IonIcon 
                    color={show ? 'primary' : 'dark'}
                    style={{"marginTop": "30px"}} 
                    icon={eye} 
                    slot={"end"} 
                    onClick={() => setShow(!show)}
                />
            </IonItem>
        </>
    )
}