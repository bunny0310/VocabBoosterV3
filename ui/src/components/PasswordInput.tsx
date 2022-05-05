import { InputChangeEventDetail, IonButtons, IonIcon, IonInput, IonItem, IonLabel, IonNote } from "@ionic/react"
import { eye, trash } from "ionicons/icons";
import React from "react";
import './inputs.css'

export interface PasswordInputProps {
    disabled?: boolean
    error?: string
    icon?: string
    label: string
    name?: string
    onBlur?: (e: CustomEvent<FocusEvent>) => void
    onChange?: (e: CustomEvent<InputChangeEventDetail>) => void
    onFocus?: (e: CustomEvent<FocusEvent>) => void
    placeholder?: string
    touched: boolean
    value?: string
}
export const PasswordInput = (props: PasswordInputProps) => {
    const [show, setShow] = React.useState<boolean>(false);

    return (
        <>
            <IonItem
                className={props.error && props.touched ? 'error': ''}
            >
                {props.icon && <i style={{paddingRight: '10px'}}><IonIcon icon={props.icon} /></i> }
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