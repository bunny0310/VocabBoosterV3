import { IonCard, IonCardHeader, IonSkeletonText, IonCardSubtitle, IonCardContent } from "@ionic/react"

export const WordSkeletonLoading = (props: any) => {
    return (
    <IonCard>
        <IonCardHeader>
          <IonSkeletonText animated />
        </IonCardHeader>
        <IonCardSubtitle>
          <IonSkeletonText animated />
        </IonCardSubtitle>
        <IonCardContent>
          <IonSkeletonText animated />
          <IonSkeletonText animated />
          <IonSkeletonText animated />
        </IonCardContent>
    </IonCard>
    )
}