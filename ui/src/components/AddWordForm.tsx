import { InputChangeEventDetail, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonInput, IonItem, IonLabel, IonNote, IonSpinner, IonToast } from "@ionic/react"
import React from "react";
import { useHistory } from "react-router";
import { WordModel } from "../api_clients/WordsApiClient";
import { _wordsApi } from "../App";
import { FormChipInput } from "./FormChipInput";
import { FormInput } from "./FormInput";

export interface AddWordFormProps {
    data: WordModel
}

enum AddWordStatus {
    NONE,
    ADDING,
    SUCCESS,
    FAIL
}

export const AddWordForm = (props: AddWordFormProps) => {
    const history = useHistory();
    const [values, setValues] = React.useState<WordModel>(props.data);
    const [status, setStatus] = React.useState<AddWordStatus>(AddWordStatus.NONE);
    React.useEffect(() => {
        setValues(props.data);
    }, [props.data])

    const isFormValid: any = {
        name: values.name !== '',
        meaning: values.name !== '',
        sentences: values.sentences.length !== 0,
        synonyms: values.synonyms.length !== 0,
        types: values.types.length !== 0,
    } 

    let disabled = Object.values(isFormValid).includes(false);

    const submitWord = async (): Promise<void> => {
        const outcome: string | undefined = await _wordsApi.addWord(values);
        outcome == null ? setStatus(AddWordStatus.FAIL) : setStatus(AddWordStatus.SUCCESS);
    }

    return (
        <>
            <IonContent>
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>
                            {props.data.id ? 'Edit' : 'Add'} Word
                        </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <FormInput 
                            label={"Name"}
                            isValid={values.name.trim() !== ''}
                            validationMessage={"Please enter the word's name."}
                            onChange={(e: CustomEvent<InputChangeEventDetail>) => setValues({...values, name: e.detail.value ?? ''})}
                            value={values.name}
                        />
                        <FormInput 
                            label={"Meaning"}
                            isValid={values.meaning.trim() !== ''}
                            validationMessage={"Please enter the word's meaning."}
                            onChange={(e: CustomEvent<InputChangeEventDetail>) => setValues({...values, meaning: e.detail.value ?? ''})}
                            value={values.meaning}
                        />
                        <FormChipInput 
                            label={"Sentences"}
                            isValid={values.sentences.length !== 0}
                            validationMessage={"Please enter at least one sentence."}
                            onSentenceChipUpdate={(data: string[]) => {
                                setValues({...values, sentences: data})
                            }}
                            values={values.sentences}
                        />
                        <FormChipInput 
                            label={"Synonyms"}
                            isValid={values.synonyms.length !== 0}
                            validationMessage={"Please enter at least one synonym."}
                            onSentenceChipUpdate={(data: string[]) => {
                                setValues({...values, synonyms: data})
                            }}
                            values={values.synonyms}
                        />
                        <FormChipInput 
                            label={"Tags"}
                            onSentenceChipUpdate={(data: string[]) => {
                                setValues({...values, tags: data})
                            }}
                            values={values.tags}
                        />
                        <FormChipInput 
                            label={"Types"}
                            isValid={values.types.length !== 0}
                            validationMessage={"Please enter at least one type."}
                            onSentenceChipUpdate={(data: string[]) => {
                                setValues({...values, types: data})
                            }}
                            values={values.types}
                        />
                            <IonButton 
                                disabled={disabled || status === AddWordStatus.ADDING} 
                                onClick={() => {
                                    setStatus(AddWordStatus.ADDING);
                                    submitWord();
                                }} 
                                fill={"solid"} 
                                size={"large"} 
                                expand={"block"}>
                                    {props.data.id ? 'Update ': 'Add '}
                                    {status === AddWordStatus.ADDING && <IonSpinner name={"dots"} />}
                            </IonButton>
                    </IonCardContent>
                </IonCard>
                
                <IonToast
                isOpen={status === AddWordStatus.FAIL || status === AddWordStatus.SUCCESS}
                color={status === AddWordStatus.SUCCESS ? 'success' : (status === AddWordStatus.FAIL ? 'danger': 'dark')}
                onDidDismiss={() => {
                        status === AddWordStatus.SUCCESS && history.push('/tab1');
                        setStatus(AddWordStatus.NONE);
                    }
                }
                message={status === AddWordStatus.SUCCESS ? 'Your word has been saved successfully!' : 'Sorry cannot save your word. Internal server error.'}
                duration={200}
                />
            </IonContent>
        </>
    )
}