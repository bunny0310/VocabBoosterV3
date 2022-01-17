import React from "react";
import { useParams } from "react-router";
import { WordModel } from "../api_clients/WordsApiClient";
import { _wordsApi } from "../App";
import { Page404 } from "../pages/ErrorPages/Page404";
import { AddWordForm } from "./AddWordForm";
import { WordSkeletonLoading } from "./WordSkeletonLoading";

interface AddEditWordFormParams {
    id: string;
}

enum Status {
    NONE,
    LOADING,
    NOTFOUND,
    SUCCESS,
    FAILURE
}

export const AddEditWordFormHoc = (props: any) => {
    const { id } = useParams<AddEditWordFormParams>();
    const [word, setWord] = React.useState<WordModel|undefined>(undefined);
    const [status, setStatus] = React.useState<Status>(Status.NONE);
    React.useEffect(() => {
        setStatus(Status.LOADING);
        const getWord = async () => {
            try {
                const outcome = await _wordsApi.getWord(id);
                const word = outcome.data;
                word == null ? setStatus(Status.NOTFOUND) : setStatus(Status.SUCCESS);
                word != null  && setWord(word);
            }
            catch (error: any) {
                console.log(error);
                setStatus(Status.FAILURE)
            }
        }
        getWord();
    }, [id])

    return (<>
        {status === Status.LOADING && <WordSkeletonLoading />}
        {status === Status.SUCCESS && word && <AddWordForm data={word} />}
        {status === Status.NOTFOUND && <Page404 />}
    </>)
}