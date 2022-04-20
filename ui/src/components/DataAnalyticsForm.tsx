import React from "react";
import {Chart} from "chart.js";
import { Line } from "react-chartjs-2"
import { IonContent } from "@ionic/react";
import { WordModel } from "../api_clients/WordsApiClient";

interface DataAnalyticsFormProps {
    chartData: WordModel[]
}

export const DataAnalyticsForm = (props: DataAnalyticsFormProps) => {
    return (

        <IonContent>
            <Line
                data={{
                    datasets: [
                        {
                            label: 'Words',
                            data: props.chartData.map(word => word.name)
                        }
                    ]
                }}
            />
        </IonContent>

    )
}