import { InputChangeEventDetail, IonButton, IonIcon, IonInput, IonItem } from "@ionic/react"
import './inputs.css'

export interface FormInputProps {
    disabled?: boolean
    error?: string
    icon?: string
    label: string
    name: string
    onBlur?: (e: CustomEvent<FocusEvent>) => void
    onChange?: (e: CustomEvent<InputChangeEventDetail>) => void
    placeholder?: string
    touched: boolean
    value?: string
}
export const FormInput = (props: FormInputProps) => {

    return (
        <>
        <IonItem
            className={props.error && props.touched ? 'error': ''}
        >
            {props.icon && <i style={{paddingRight: '10px'}}><IonIcon icon={props.icon} /></i> }
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