import React from "react";
import { Line } from "react-chartjs-2"
import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonIcon, IonItem, IonItemDivider, IonLabel, IonSelect, IonSelectOption } from "@ionic/react";
import { WordModel, WordType, WordTypeDescriptions } from "../api_clients/WordsApiClient"
import { Chart, registerables } from 'chart.js'
import { chevronBack, chevronForward } from 'ionicons/icons'
import "./DataAnalyticsGraph.css"
import { eachDayOfInterval, isSameDay, subDays } from "date-fns";

Chart.register(...registerables);

interface DataAnalyticsGraphProps {
    chartData: WordModel[]
    type: WordType,
    endDate: Date,
    getNextWeekData: () => void,
    getPrevWeekData: () => void,
    updateType: (type: WordType) => void,
    disabledForward: boolean,
    disabledBack: boolean
}

export const DataAnalyticsGraph = (props: DataAnalyticsGraphProps) => {
    const { chartData, type, endDate, getNextWeekData, getPrevWeekData, updateType, disabledForward, disabledBack } = props
    const dates = eachDayOfInterval({start: subDays(endDate, 6), end: endDate})
    const data = {
        labels: dates.map(date => date.toLocaleDateString('en-US', {dateStyle: 'short'})),
        datasets: [
            {
                label: `Number of ${WordTypeDescriptions[type]}s`,
                data: dates.map(date => chartData.filter(word => isSameDay(new Date(word.updatedAt!), date)).length),
                fill: true,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)"
            }
        ]
    }
    
    return (

        <IonContent className={'center'}>
            <IonCard>
                <IonCardContent>
                <Line
                    data={data}
                /> 
                </IonCardContent>
            </IonCard>
            <IonItemDivider color='primary'>
                <IonLabel>Select Type: </IonLabel>
                <IonSelect value={type} onIonChange={e => updateType(e.detail.value)}>
                    {Object.keys(WordTypeDescriptions).map(key => {
                            const typeKey = (parseInt(key) as WordType)
                            return <IonSelectOption key={typeKey} value={typeKey}>{WordTypeDescriptions[typeKey]}</IonSelectOption>
                        }
                    )}
                </IonSelect>
                <IonItem color={'primary'} slot={'end'}>
                    <IonButton
                        color={'light'}
                        fill={'clear'}
                        size={'small'}
                        disabled={disabledBack}
                        onClick={getPrevWeekData}
                    >
                        <IonIcon icon={chevronBack} />
                    </IonButton>
                    <IonButton
                        color={'light'}
                        fill={'clear'}
                        size={'small'}
                        disabled={disabledForward}
                        onClick={getNextWeekData}
                    >
                        <IonIcon icon={chevronForward} />
                    </IonButton>
                    <span slot="end">Week ending {endDate.toLocaleDateString('en-US', {dateStyle: 'short'})}</span>
                </IonItem>
            </IonItemDivider>
        </IonContent>

    )
}