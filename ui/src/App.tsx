import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { addCircle, addCircleOutline, analyticsOutline, book, bookOutline, ellipse, square, triangle } from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Theme variables */
import './theme/variables.css';

/* Custom CSS */
import './App.css'
import container from './SettingsManager';
import { IWordsApiClient } from './api_clients/IWordsApiClient';
import { WordModel } from './api_clients/WordsApiClient';
import { Words } from './pages/Words';
import { AddEditWord } from './pages/AddEditWord';
import React from 'react';

setupIonicReact();

export const _wordsApi = container.get<IWordsApiClient>("IWordsApiClient");

const App: React.FC = () => {  

  return (
    <IonApp>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <img src={"assets/logo.png"} className={"logo"}></img>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet>
                <Route exact path="/tab1">
                  <Words></Words>
                </Route>
                <Route exact path="/tab2">
                  <AddEditWord />
                </Route>
                <Route path="/tab3">
                </Route>
                <Route exact path="/">
                  <Redirect to="/tab1" />
                </Route>
              </IonRouterOutlet>
              <IonTabBar slot="bottom">
                <IonTabButton tab="tab1" href="/tab1">
                  <IonIcon icon={bookOutline} />
                  <IonLabel>Words</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab2" href="/tab2">
                  <IonIcon icon={addCircleOutline} />
                  <IonLabel>Add Word</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab3" href="/tab3">
                  <IonIcon icon={analyticsOutline} />
                  <IonLabel>Analytics</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </IonReactRouter>
      </IonContent>
    </IonApp>);
  }

export default App;
