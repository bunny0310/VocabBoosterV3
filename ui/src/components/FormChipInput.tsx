import { InputChangeEventDetail, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonIcon, IonInput, IonItem, IonLabel, IonList, IonNote, IonTextarea, TextareaChangeEventDetail } from "@ionic/react"
import { closeCircle, pencil } from "ionicons/icons";
import React from "react";
import './FormListInput.css';
import './inputs.css';

export interface FormChipInputProps {
    label: string;
    onSentenceChipUpdate?: (data: string[]) => void;
    onBlur?: (e: CustomEvent<FocusEvent>) => void;
    disabled?: boolean;
    placeholder?: string;
    isValid?: boolean;
    name?: string
    values?: string[]
    touched: boolean
    error?: string
}

interface IEditItem {
    editable: boolean,
    value: string
}

enum EditItemOrInput {
    Input,
    Item
}

export const FormChipInput = (props: FormChipInputProps) => {
    const [values, setValues] = React.useState<string[]>(props.values ?? []);
    const [value, setValue] = React.useState<string>('');
    const [editableArr, setEditableArr] = React.useState<IEditItem[]>([]);

    React.useEffect(() => {
        setValues(props.values ?? []);
    }, [props.values])

    React.useEffect(() => {
        const editItemArr: IEditItem[] = []
        values.forEach(value => {
            editItemArr.push({
                editable: false,
                value
            })
        })
        setEditableArr(editItemArr)
    }, [props.values])

    const keyPressHandler = (e: any, editItemOrInput: EditItemOrInput, editItemIndex?: number) => {

        let inputValue = value
        if (editItemOrInput === EditItemOrInput.Item && editItemIndex != null) {
            inputValue = editableArr[editItemIndex].value
        }
        if (e.key === "Enter" && inputValue.trim() !== '') {
            if (editItemOrInput === EditItemOrInput.Item && editItemIndex != null) {
                const newEditableArr = [...editableArr];
                newEditableArr[editItemIndex].editable = false;
                setEditableArr(newEditableArr);
            }
            else {
                setValue('');
            }
            const newValues = [...values];
            if (editItemOrInput === EditItemOrInput.Input) {
                newValues.push(inputValue);
            }
            else {
                editItemIndex != null && (newValues[editItemIndex] = inputValue);
            }
            setValues(newValues);
            props.onSentenceChipUpdate && props.onSentenceChipUpdate(newValues);
        }
    }

    const editHandler = (i: number, e: any) => {
        const newEditableArr = [...editableArr];
        newEditableArr[i].editable = true;
        setEditableArr(newEditableArr)
    }

    const removeHandler = (i: number, e: any) => {
                const newValues = [...values];
                newValues.splice(i, 1)
                setValues(newValues);

                const newEditableArr = [...editableArr];
                newEditableArr.splice(i, 1);
                setEditableArr(newEditableArr);

                props.onSentenceChipUpdate && props.onSentenceChipUpdate(newValues);
    }

    const onChangehandler = (e: CustomEvent<TextareaChangeEventDetail>, editItemOrInput: EditItemOrInput, editItemIndex?: number) => {
        const val = e.detail.value;
        const newEditableArr = [...editableArr];
        if (val == null) {
            if (editItemOrInput === EditItemOrInput.Item && editItemIndex != null) {
                newEditableArr[editItemIndex].value = '';
                setEditableArr(newEditableArr);
            }
            else {
                setValue('');
            }
            return;
        }

        if (editItemIndex != null) {
            newEditableArr[editItemIndex].value = e.detail.value!;
            setEditableArr(newEditableArr);
        }
        else {
            setValue(e.detail.value!);
        }
    }

    return (
        <>
            <IonLabel>
                {props.label}
                {values.length !== 0 && <IonCard>
                    <IonCardContent>
                        <IonList>
                            {values.map((value, i) => {return (
                                <React.Fragment key={i}>
                                    {editableArr[i] && !editableArr[i].editable 
                                    && <IonItem key={i} className={`listBlock`}>
                                            {value}
                                            <IonIcon 
                                                color={'primary'}
                                                icon={pencil} 
                                                size={'small'} 
                                                slot="end" 
                                                onClick={(e: any) => editHandler(i, e)}
                                                title={`edit`}
                                            /> 
                                            <IonIcon 
                                                color={'danger'}
                                                icon={closeCircle} 
                                                size={'small'} 
                                                slot="end" 
                                                onClick={(e: any) => removeHandler(i, e)}
                                                title={`delete`}
                                            />       
                                        </IonItem>
                                    }
                                    {editableArr[i] && editableArr[i].editable
                                    && <IonInput
                                            className={"formField"}
                                            onKeyUp={e => keyPressHandler(e, EditItemOrInput.Item, i)}
                                            onIonChange={e => onChangehandler(e, EditItemOrInput.Item, i)} 
                                            placeholder={'Enter a value'}
                                            value={editableArr[i].value}
                                        />
                                    }
                                </React.Fragment>)}
                    )}
                        </IonList>
                    </IonCardContent>
                </IonCard>}
                <IonItem 
                    className={`formField ${props.touched && props.error ? 'error': ''}`}
                >
                    <IonInput
                        className={"formField"}
                        name={props.name}
                        onKeyUp={e => keyPressHandler(e, EditItemOrInput.Input)}
                        onIonChange={e => onChangehandler(e, EditItemOrInput.Input)} 
                        onIonBlur={(e: CustomEvent<FocusEvent>) => {props.onBlur && props.onBlur(e)}}
                        placeholder={props.placeholder}
                    />
                </IonItem>   
            </IonLabel> 
        </>
    )
}