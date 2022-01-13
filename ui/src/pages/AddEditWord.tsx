import { IonInput } from "@ionic/react";
import React from "react";
import { WordModel } from "../api_clients/WordsApiClient";
import { AddWordForm } from "../components/AddWordForm";

interface AddEditWordProps {
    data?: WordModel
} 
export class AddEditWord extends React.Component<AddEditWordProps, any> {

    render = (): React.ReactNode => {
        return (
        <>
            <AddWordForm data={this.props.data ?? new WordModel()}/>
        </>)
    }
}