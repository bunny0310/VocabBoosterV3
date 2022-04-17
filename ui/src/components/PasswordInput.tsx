import { InputChangeEventDetail, IonButtons, IonIcon, IonInput, IonItem, IonLabel, IonNote } from "@ionic/react"
import { eye, trash } from "ionicons/icons";
import React from "react";
import './inputs.css'

export interface PasswordInputProps {
    name?: string
    label: string
    value?: string
    onChange?: (e: CustomEvent<InputChangeEventDetail>) => void
    onBlur?: (e: CustomEvent<FocusEvent>) => void
    onFocus?: (e: CustomEvent<FocusEvent>) => void
    disabled?: boolean
    placeholder?: string
    error?: string
    touched: boolean
}
export const PasswordInput = (props: PasswordInputProps) => {
    const [show, setShow] = React.useState<boolean>(false);

    return (
        <>
            <IonItem
                className={props.error && props.touched ? 'error': ''}
            >
                <IonInput
                    name={props.name}
                    type={show ? "text" : "password"}
                    onIonChange={(e: CustomEvent<InputChangeEventDetail>) => props.onChange && props.onChange(e)}
                    onIonBlur={(e: CustomEvent<FocusEvent>) => {props.onBlur && props.onBlur(e)}}
                    placeholder={props.placeholder}
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