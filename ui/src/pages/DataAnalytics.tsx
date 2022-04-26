import React from "react";
import {Chart} from "chart.js";
import { WordModel, WordType } from "../api_clients/WordsApiClient";
import { _wordsApi } from "../App";
import { DataAnalyticsGraph } from "../components/DataAnalyticsGraph";
import { WordSkeletonLoading } from "../components/WordSkeletonLoading";
import { getWeekRange } from "../utils/dateUtil";
import { subDays, addDays } from "date-fns"

interface DataAnalysticsState  {
    data?: WordModel[]
    loading: boolean
    startDate: Date,
    endDate: Date
    currentDate: Date
    type: WordType,
    disabledForward: boolean,
    disabledBack: boolean
}
export class DataAnalytics extends React.Component<any, DataAnalysticsState> {
    
    constructor(props: any) {
        super(props)
        const [startDate, endDate] = getWeekRange()
        this.state = {
            data: undefined,
            loading: false,
            startDate,
            endDate,
            currentDate: new Date(),
            type: WordType.Noun,
            disabledBack: false,
            disabledForward: true
        }
    }

    getNextWeekData = () => {
       const curr = this.state.currentDate
       const now = new Date()
       if (this.state.disabledForward) {
           return
       }
       const nextCurr = addDays(curr, 7)
       const [startDate, endDate] = getWeekRange(nextCurr)
       this.setState({
           currentDate: nextCurr,
           startDate,
           endDate,
           disabledForward: nextCurr.getDate() >= now.getDate() && nextCurr.getMonth() >= now.getMonth() && nextCurr.getFullYear() >= now.getFullYear(),
           disabledBack: startDate.getFullYear() !== now.getFullYear()
       }, () => {
        this.loadData(this.state.type, startDate, endDate)
       })
    }

    getPrevWeekData = () => {
        const curr = this.state.currentDate
        const now = new Date()
        const nextCurr = subDays(curr, 7)
        const [startDate, endDate] = getWeekRange(nextCurr)
        if (this.state.disabledBack) {
            return
        }
        this.setState({
            currentDate: nextCurr,
            startDate,
            endDate,
            disabledForward: nextCurr.getDate() >= now.getDate() && nextCurr.getMonth() >= now.getMonth() && nextCurr.getFullYear() >= now.getFullYear(),
            disabledBack: startDate.getFullYear() !== now.getFullYear()
        }, () => {
         this.loadData(this.state.type, startDate, endDate)
        })
     }
    
    loadData = async (type: WordType, startDate: Date, endDate: Date) => {
        const outcome = await _wordsApi.getWordsRange(type, startDate, endDate)
        const data = outcome?.data
        this.setState({
            data
        })
    }

    componentDidMount() {
        this.loadData(this.state.type, this.state.startDate, this.state.endDate)
    }

    componentDidUpdate(prevProps: any, prevState: DataAnalysticsState) {
        if (prevState.type !== this.state.type) {
            this.loadData(this.state.type, this.state.startDate, this.state.endDate)
        }
    } 
    
    render = (): React.ReactNode => {
        return (
        <>
            {this.state.data
            &&
            <DataAnalyticsGraph 
                chartData={this.state.data} 
                type={this.state.type}
                endDate={this.state.endDate}
                getNextWeekData={this.getNextWeekData}
                getPrevWeekData={this.getPrevWeekData}
                updateType={(type: WordType) => this.setState({type})}
                disabledForward={this.state.disabledForward}
                disabledBack={this.state.disabledBack}
            />} 
            {!this.state.data
            &&
            <WordSkeletonLoading />}
        </>)
    }

}