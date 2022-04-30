import { IonButton, IonCard, IonCardContent } from "@ionic/react"
import { useHistory } from "react-router"

export const NoWordFound = () => {
    const history = useHistory()

    return (<IonCard color='light' style={{textAlign: 'center'}}>
        <IonCardContent>
            <strong>NO WORD ADDED YET!</strong>
            <br/>
            <IonButton 
                size='small' 
                color='primary'
                onClick={e => history.push('/addword')}
            >
                Click here to add a new word
            </IonButton>
        </IonCardContent>
    </IonCard>)
}