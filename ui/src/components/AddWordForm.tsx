import { InputChangeEventDetail, IonBreadcrumb, IonBreadcrumbs, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonNote, IonSpinner, IonToast, IonToggle, IonToolbar } from "@ionic/react"
import { refreshOutline } from "ionicons/icons";
import React from "react";
import { useHistory } from "react-router";
import { WordModel } from "../api_clients/WordsApiClient";
import { _messageBus, _wordsApi } from "../App";
import { Messages } from "../services/MessageBus";
import { FormChipInput } from "./FormChipInput";
import { FormInput } from "./FormInput";

export interface AddWordFormProps {
    data: WordModel
}

export enum ApiCallStatus {
    NONE,
    PROCESSING,
    SUCCESS,
    FAIL
}

export enum AddEditWord {
    Add,
    Edit
}

export const AddWordForm = (props: AddWordFormProps) => {
    const history = useHistory();
    const [values, setValues] = React.useState<WordModel>(props.data);
    const [status, setStatus] = React.useState<ApiCallStatus>(ApiCallStatus.NONE);
    const [action, setAction] = React.useState<AddEditWord>(AddEditWord.Add);
    React.useEffect(() => {
        setValues(props.data);
        setAction(props.data.id ? AddEditWord.Edit : AddEditWord.Add);
        _messageBus.dispatch<string>(Messages.CloseSearchModal, "");
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
        const outcome: string | undefined = action === AddEditWord.Edit ? await (await _wordsApi.editWord(values)).data : await (await _wordsApi.addWord(values)).data;
        outcome == null ? setStatus(ApiCallStatus.FAIL) : setStatus(ApiCallStatus.SUCCESS);
    }

    return (
        <>
            <IonContent>
                <IonBreadcrumbs>
                    <IonBreadcrumb href={'/tab1'}>
                        Words
                        <span slot={'seperator'}>|</span>
                    </IonBreadcrumb>
                    <IonBreadcrumb href={`/addeditword${action === AddEditWord.Edit ? `/${props.data.id}` : ``}`}>
                         { action === AddEditWord.Add ? `New Word`: `Update Word` }
                    </IonBreadcrumb>
                </IonBreadcrumbs>
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>
                            <IonToolbar>
                            <IonButton color={'tertiary'} slot={'end'} onClick={() => setValues(new WordModel())}>
                                <IonIcon icon={refreshOutline}></IonIcon>
                            </IonButton>
                            </IonToolbar>
                            
                            <FormInput 
                                label={"Name"}
                                isValid={values.name.trim() !== ''}
                                validationMessage={"Please enter the word's name."}
                                onChange={(e: CustomEvent<InputChangeEventDetail>) => setValues({...values, name: e.detail.value ?? ''})}
                                value={values.name}
                            />
                        </IonCardTitle>
                        <IonCardSubtitle>
                            <FormInput 
                                label={"Meaning"}
                                isValid={values.meaning.trim() !== ''}
                                validationMessage={"Please enter the word's meaning."}
                                onChange={(e: CustomEvent<InputChangeEventDetail>) => setValues({...values, meaning: e.detail.value ?? ''})}
                                value={values.meaning}
                            />
                        </IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
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
                                disabled={disabled || status === ApiCallStatus.PROCESSING} 
                                onClick={() => {
                                    setStatus(ApiCallStatus.PROCESSING);
                                    submitWord();
                                }} 
                                fill={"solid"} 
                                size={"large"} 
                                expand={"block"}>
                                    {props.data.id ? 'Update ': 'Add '}
                                    {status === ApiCallStatus.PROCESSING && <IonSpinner name={"dots"} />}
                            </IonButton>
                    </IonCardContent>
                </IonCard>
                
                <IonToast
                isOpen={status === ApiCallStatus.FAIL || status === ApiCallStatus.SUCCESS}
                color={status === ApiCallStatus.SUCCESS ? 'success' : (status === ApiCallStatus.FAIL ? 'danger': 'dark')}
                onDidDismiss={() => {
                        status === ApiCallStatus.SUCCESS && action === AddEditWord.Add && history.push('/tab1');
                        setStatus(ApiCallStatus.NONE);
                    }
                }
                message={status === ApiCallStatus.SUCCESS ? `Your word has been ${action === AddEditWord.Edit ? 'updated' : 'saved'} successfully!` : 'Sorry cannot save your word. Internal server error.'}
                duration={600}
                />
            </IonContent>
        </>
    )
}