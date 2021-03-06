import { InputChangeEventDetail, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonIcon, IonInput, IonItem, IonLabel, IonList, IonNote, IonTextarea, TextareaChangeEventDetail } from "@ionic/react"
import { closeCircle, pencil } from "ionicons/icons";
import React from "react";
import './FormListInput.css';

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
    const [touched, setTouched] = React.useState<boolean>(false);
    const [editableArr, setEditableArr] = React.useState<IEditItem[]>([]);
    const isValid = props.isValid ?? true;

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
        !touched && setTouched(true);

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
        !touched && setTouched(true);

        const newEditableArr = [...editableArr];
        newEditableArr[i].editable = true;
        setEditableArr(newEditableArr)
    }

    const removeHandler = (i: number, e: any) => {
                !touched && setTouched(true);
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
            {values.length !== 0 && <IonCard>
                <IonCardContent>
                    <IonList>
                        {values.map((value, i) => {return (
                            <>
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
                            </>)}
                )}
                    </IonList>
                </IonCardContent>
            </IonCard>}
            
            <IonItem className={"formField"}>
                {(isValid || !touched) && <IonLabel position="stacked" color={"dark"}>{props.label}</IonLabel>}
                { !isValid && touched && <IonNote color={'danger'}>{props.validationMessage}</IonNote>}
                <IonInput
                    className={"formField"}
                    onKeyUp={e => keyPressHandler(e, EditItemOrInput.Input)}
                    onIonChange={e => onChangehandler(e, EditItemOrInput.Input)} 
                    onIonBlur={(e: CustomEvent<FocusEvent>) => {props.onBlur && props.onBlur(e)}}
                    onIonFocus={(e: CustomEvent<FocusEvent>) => {props.onFocus && props.onFocus(e)}}
                    placeholder={props.placeholder}
                    value={value}
                />
            </IonItem> 
        </>
    )
}