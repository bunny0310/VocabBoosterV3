import { InputChangeEventDetail, IonInput, IonItem, IonLabel, IonNote } from "@ionic/react"
import { FormikErrors, FormikState, FormikTouched } from "formik";
import React from "react";
import { createRef } from "react";
import { RegisterRequest } from "../api_clients/AuthApiClient";
import './inputs.css'

export interface FormInputProps {
    name: string
    label: string;
    onChange?: (e: CustomEvent<InputChangeEventDetail>) => void;
    onBlur?: (e: CustomEvent<FocusEvent>) => void;
    disabled?: boolean;
    placeholder?: string;
    touched: boolean
    error?: string
    value?: string
}
export const FormInput = (props: FormInputProps) => {

    return (
        <>
        <IonItem
            className={props.error && props.touched ? 'error': ''}
        >
            <IonInput
                name={props.name}
                onIonChange={(e: CustomEvent<InputChangeEventDetail>) => props.onChange && props.onChange(e)}
                onIonBlur={(e: CustomEvent<FocusEvent>) => {props.onBlur && props.onBlur(e)}}
                value={props.value}
                placeholder={props.placeholder}
            />  
        </IonItem>          
        </>
    )
}