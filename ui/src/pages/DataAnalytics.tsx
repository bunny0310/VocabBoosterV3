import React from "react";
import {Chart} from "chart.js";
import { WordModel, WordType } from "../api_clients/WordsApiClient";
import { _wordsApi } from "../App";
import { DataAnalyticsForm } from "../components/DataAnalyticsForm";

interface DataAnalysticsState  {
    data?: WordModel[]
}
export class DataAnalytics extends React.Component<any, DataAnalysticsState> {
    loadData = async () => {
        const outcome = await _wordsApi.getWordsRange(WordType.Adjective, new Date('01-01-2022'), new Date('04-01-2022'))
        const data = outcome.data
        this.setState({
            data
        })
    }

    componentDidMount = () => {
        this.loadData()
    }
    render = (): React.ReactNode => {
        return (
        <>
            {this.state.data
            &&
            <DataAnalyticsForm chartData={this.state.data} />} 
        </>)
    }

}