import { InputChangeEventDetail, IonBreadcrumb, IonBreadcrumbs, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonNote, IonSpinner, IonToast, IonToggle, IonToolbar } from "@ionic/react"
import { ErrorMessage, Field, Form, Formik } from "formik";
import { refreshOutline } from "ionicons/icons";
import React from "react";
import { useHistory } from "react-router";
import { WordModel } from "../api_clients/WordsApiClient";
import { _messageBus, _wordsApi } from "../App";
import { Messages } from "../services/MessageBus";
import { FormChipInput } from "./FormChipInput";
import { FormInput } from "./FormInput";
import * as Yup from 'yup'

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
    const [status, setStatus] = React.useState<ApiCallStatus>(ApiCallStatus.NONE);
    const [action, setAction] = React.useState<AddEditWord>(AddEditWord.Add);
    React.useEffect(() => {
        setAction(props.data.id ? AddEditWord.Edit : AddEditWord.Add);
        _messageBus.dispatch<string>(Messages.CloseSearchModal, "");
    }, [props.data])

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Name is required.'),
        meaning: Yup.string()
            .required('Meaning is required.'),
        sentences: Yup.array()
            .of(Yup.string())
            .min(1, 'At least one sentence required'),
        synonyms: Yup.array()
            .of(Yup.string())
            .min(1, 'At least one synonym required'),
        types: Yup.array()
            .of(Yup.string())
            .min(1, 'At least one type required')
    })

    const submitWord = async (values: WordModel): Promise<void> => {
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
                <Formik
                    onSubmit={submitWord}
                    initialValues={props.data}
                    validationSchema={validationSchema}
                >
                    {formikProps => <>
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>
                                    <IonToolbar>
                                    <IonButton color={'tertiary'} slot={'end'} onClick={() => formikProps.setValues(new WordModel())}>
                                        <IonIcon icon={refreshOutline}></IonIcon>
                                    </IonButton>
                                    </IonToolbar>
                                </IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                        <Form>
                                            <Field 
                                                as={FormInput}
                                                placeholder={'Name'}
                                                name={'name'}
                                                {...formikProps.getFieldMeta('name')}
                                            />
                                            <ErrorMessage
                                                component={'div'}
                                                className={'error'}
                                                name={'name'}
                                            />   
                                            <Field 
                                                as={FormInput}
                                                placeholder={'Meaning'}
                                                name={'meaning'}
                                                {...formikProps.getFieldMeta('meaning')}
                                            /> 
                                            <ErrorMessage
                                                component={'div'}
                                                className={'error'}
                                                name={'meaning'}
                                            /> 
                                            <Field 
                                                as={FormChipInput}
                                                placeholder={'Sentences'}
                                                name={'sentences'}
                                                values={formikProps.values.sentences}
                                                onSentenceChipUpdate={(data: string[]) => {
                                                    formikProps.setFieldValue('sentences', data)
                                                }}
                                                {...formikProps.getFieldMeta('sentences')}
                                            /> 
                                            <ErrorMessage
                                                component={'div'}
                                                className={'error'}
                                                name={'sentences'}
                                            />
                                            <Field 
                                                as={FormChipInput}
                                                placeholder={'Synonyms'}
                                                name={'synonyms'}
                                                values={formikProps.values.synonyms}
                                                onSentenceChipUpdate={(data: string[]) => {
                                                    formikProps.setFieldValue('synonyms', data)
                                                }}
                                                {...formikProps.getFieldMeta('synonyms')}
                                            /> 
                                            <ErrorMessage
                                                component={'div'}
                                                className={'error'}
                                                name={'synonyms'}
                                            />  
                                            <Field 
                                                as={FormChipInput}
                                                placeholder={'Tags'}
                                                name={'tags'}
                                                values={formikProps.values.tags}
                                                onSentenceChipUpdate={(data: string[]) => {
                                                    formikProps.setFieldValue('tags', data)
                                                }}
                                                {...formikProps.getFieldMeta('tags')}
                                            /> 
                                            <Field 
                                                as={FormChipInput}
                                                placeholder={'Types'}
                                                name={'types'}
                                                values={formikProps.values.types}
                                                onSentenceChipUpdate={(data: string[]) => {
                                                    formikProps.setFieldValue('types', data)
                                                }}
                                                {...formikProps.getFieldMeta('types')}
                                            /> 
                                            <ErrorMessage
                                                component={'div'}
                                                className={'error'}
                                                name={'types'}
                                            />
                                            <IonButton 
                                                disabled={!formikProps.dirty || !formikProps.isValid || status === ApiCallStatus.PROCESSING} 
                                                onClick={() => {
                                                    setStatus(ApiCallStatus.PROCESSING);
                                                    submitWord(formikProps.values);
                                                }} 
                                                fill={"solid"} 
                                                size={"large"} 
                                                expand={"block"}>
                                                    {props.data.id ? 'Update ': 'Add '}
                                                    {status === ApiCallStatus.PROCESSING && <IonSpinner name={"dots"} />}
                                            </IonButton>      
                                        </Form>
                            </IonCardContent>
                        </IonCard>
                    </>}
                </Formik>
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