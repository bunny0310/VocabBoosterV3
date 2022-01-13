import { InputChangeEventDetail, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonIcon, IonInput, IonItem, IonLabel, IonNote } from "@ionic/react"
import { closeCircle } from "ionicons/icons";
import React from "react";

export interface FormChipInputProps {
    label: string;
    onSentenceChipUpdate?: (data: string[]) => void;
    onBlur?: (e: CustomEvent<FocusEvent>) => void;
    onFocus?: (e: CustomEvent<FocusEvent>) => void;
    disabled?: boolean;
    placeholder?: string;
    isValid?: boolean;
    values?: string[]
    validationMessage?: string;
}
export const FormChipInput = (props: FormChipInputProps) => {
    const [values, setValues] = React.useState<string[]>(props.values ?? []);
    const [value, setValue] = React.useState<string>('');
    const [touched, setTouched] = React.useState<boolean>(false);
    const isValid = props.isValid ?? true;

    React.useEffect(() => {
        setValues(props.values ?? []);
    }, [props.values])

    const keyPressHandler = (e: any) => {
        !touched && setTouched(true);
        if (e.key === "Enter" && value.trim() !== '') {
            const newValues = [...values];
            newValues.push(value);
            setValues(newValues);
            setValue('');
            props.onSentenceChipUpdate && props.onSentenceChipUpdate(newValues);
        }
    }

    const onChangehandler = (e: CustomEvent<InputChangeEventDetail>) => {
        const val = e.detail.value;
        if (val == null) {
            setValue('');
            return;
        }
        setValue(e.detail.value!);
    }

    return (
        <>
            <IonCard>
                <IonCardHeader>
                    <IonCardSubtitle>
                        {values.map((value, i) => {return (<>
                            <IonChip color={"primary"} key={i}>
                                <IonNote>{value}</IonNote>
                                <IonIcon icon={closeCircle}  onClick={(e: any) => {
                                    !touched && setTouched(true);
                                    const newValues = [...values];
                                    newValues.splice(i, 1)
                                    setValues(newValues);
                                    props.onSentenceChipUpdate && props.onSentenceChipUpdate(newValues);
                            }}/>
                            </IonChip>
                        </>
                        )}
                    )}
                    </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                    <IonItem className={"formField"}>
                        {(isValid || !touched) && <IonLabel position="stacked" color={"dark"}>{props.label}</IonLabel>}
                        { !isValid && touched && <IonNote color={'danger'}>{props.validationMessage}</IonNote>}
                        <IonInput
                            className={"formField"}
                            onKeyUp={keyPressHandler}
                            onIonChange={onChangehandler} 
                            onIonBlur={(e: CustomEvent<FocusEvent>) => {props.onBlur && props.onBlur(e)}}
                            onIonFocus={(e: CustomEvent<FocusEvent>) => {props.onFocus && props.onFocus(e)}}
                            placeholder={props.placeholder}
                            value={value}
                        /> 
                    </IonItem> 
                </IonCardContent>          
            </IonCard>
        </>
    )
}