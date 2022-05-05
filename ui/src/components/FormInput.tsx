import { InputChangeEventDetail, IonInput, IonItem, IonLabel, IonNote } from "@ionic/react"
import React from "react";
import { createRef } from "react";

export interface FormInputProps {
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
    const isValid = props.isValid ?? true;
    const [touched, setTouched] = React.useState<boolean>(false);

    return (
        <>
            <IonItem>
            {(isValid || !touched) && <IonLabel position="stacked" color={"dark"}>{props.label}</IonLabel>}
            { !isValid && touched && <IonNote color={'danger'}>{props.validationMessage}</IonNote>}
                <IonInput
                    className={"formInput"}
                    onIonChange={(e: CustomEvent<InputChangeEventDetail>) => props.onChange && props.onChange(e)}
                    onKeyUp={(e: any) => {
                        !touched && setTouched(true);
                    }}
                    onIonBlur={(e: CustomEvent<FocusEvent>) => {props.onBlur && props.onBlur(e)}}
                    onIonFocus={(e: CustomEvent<FocusEvent>) => {props.onFocus && props.onFocus(e)}}
                    placeholder={props.placeholder}
                    value={props.value}
                />            
            </IonItem>
        </>
    )
}