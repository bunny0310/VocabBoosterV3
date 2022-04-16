import { InputChangeEventDetail, IonInput, IonItem, IonLabel, IonNote } from "@ionic/react"
import React from "react";
import { createRef } from "react";

export interface FormInputProps {
    name?: string
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
export const FormInput = (props: FormInputProps) => {

    return (
        <>
            <IonInput
                name={props.name}
                onIonChange={(e: CustomEvent<InputChangeEventDetail>) => props.onChange && props.onChange(e)}
                onIonBlur={(e: CustomEvent<FocusEvent>) => {props.onBlur && props.onBlur(e)}}
                onIonFocus={(e: CustomEvent<FocusEvent>) => {props.onFocus && props.onFocus(e)}}
                placeholder={props.placeholder}
            />            
        </>
    )
}