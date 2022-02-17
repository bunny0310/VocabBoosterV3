import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonIcon, IonItem, IonToolbar } from "@ionic/react"
import { warningOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import "./Page404.css";

interface Page404Props {
    title?: string;
    message?: string;
}
export const Page404 = (props: Page404Props) => {
    const history = useHistory();
    const title = props.title ?? "Oops... Word Not Found";
    const message = props.message ?? "The word you are looking for doesn't exist. Sorry about that.";
    return (
        <IonContent>
            <div className={"block"}>
                <IonCard className={"center"} style={{"boxShadow" : "none", "textAlign": "center"}}>
                    <IonCardHeader>
                        <IonCardTitle>
                            <h1>{title}</h1>
                        </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <p>{message}</p>
                    </IonCardContent>
                    <IonToolbar>
                        <IonButton shape={"round"} fill={"outline"} onClick={() => history.push('/tab1')}>
                                Return to Home
                        </IonButton>
                    </IonToolbar>
                </IonCard>
                {/* <div className="center">
                        <h1>{title}</h1>
                </div>
                <div className="center">      
                    <IonItem>
                        <p>{message}</p>
                    </IonItem>
                </div>
                <div className="center" style={{"marginTop": "20px"}}>
                    <IonButton shape={"round"} fill={"outline"} slot="end" onClick={() => history.push('/tab1')}>
                            Return to Home
                    </IonButton>
                </div> */}
            </div>
        </IonContent>
    )
}