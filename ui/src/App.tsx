import { Redirect, Route, RouteComponentProps, useLocation } from 'react-router-dom';
import {
  IonApp,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { addCircle, addCircleOutline, analyticsOutline, book, bookOutline, ellipse, logOutOutline, menuOutline, square, triangle } from 'ionicons/icons';

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
import { AddEditWordFormHoc } from './components/AddEditWordFormHoc';
import { Page404 } from './pages/ErrorPages/Page404';
import { IMessageBus } from './services/IMessageBus';
import { IAuthApiClient } from './api_clients/IAuthApiClient';
import { Messages } from './services/MessageBus';
import { LoginForm } from './components/LoginForm';
import { Login } from './pages/Login';
import { RegisterForm} from './components/RegisterForm';
import { AuthContext } from './pages/Contexts/AuthContext';
import { Storage } from '@capacitor/storage';
import { jwtKeyName } from './api_clients/AuthApiClient';
import { Register } from './pages/Register';
import { RedirectComponent } from './components/RedirectComponent';
import { DataAnalytics } from './pages/DataAnalytics';
import { parseJWT } from './utils/JWTParser';

setupIonicReact();

export const _wordsApi = container.get<IWordsApiClient>("IWordsApiClient");
export const _authApi = container.get<IAuthApiClient>("IAuthApiClient");
export const _messageBus = container.get<IMessageBus>("IMessageBus");

const App: React.FC = () => {
  const [auth, setAuth] = React.useState<boolean>(_authApi.authorize());
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [firstName, setFirstName] = React.useState<string>();

  const logout = async () => {
    Storage.remove({"key": jwtKeyName});
    setAuth(false);
  }

  React.useEffect(() => {

    const configureFirstName = async () => {
      Storage.get({"key": jwtKeyName})
        .then(res => {
          const token = res.value
          if (token) {
            const parsedJWT = parseJWT(token)
            const { FirstName, email } = JSON.parse(parsedJWT.data) ?? {}
            setFirstName(FirstName)
          }
        })
    }

    _authApi.authorize();

    _messageBus.on(Messages.Login, () => {
      setAuth(true)
      configureFirstName()
    });
    _messageBus.on(Messages.Logout, async () => logout());
  }, [auth])

  return ( <>
    <AuthContext.Provider value={auth}>
      <IonApp>
        <IonHeader>
          <IonToolbar>
            <IonTitle>
              <img src={"assets/logo.png"} className={"logo"} alt="logo"></img>
            </IonTitle>
            {auth && <IonButtons slot={"end"}>
                  Welcome {firstName}
                  <IonItem lines={"none"}>
                    <IonButton size={"large"} onClick={() => setShowModal(!showModal)}>
                      <IonIcon icon={menuOutline} />
                    </IonButton>
                  </IonItem>
            </IonButtons>}
          </IonToolbar>
        </IonHeader>
        <IonContent className='customBg'>
          <IonReactRouter>
              <IonTabs>
                <IonRouterOutlet>
                    {
                      auth 
                      ? <Route exact path="/tab1" component={Words} />
                      : <Route exact path="/tab1">
                          <Redirect to="/login"></Redirect>
                      </Route>
                    }
                    {
                      auth 
                      ? <Route exact path="/addword" component={AddEditWord} />
                      : <Route exact path="/addword">
                          <Redirect to="/login"></Redirect>
                      </Route>
                    }
                    <Route exact path="/tab3" component={DataAnalytics} />
                    {/* {
                      auth 
                      ? <Route exact path="/tab3" component={DataAnalytics} />
                      : <Route exact path="/tab3">
                          <Redirect to="/login"></Redirect>
                      </Route>
                    }                     */}
                    {
                      auth 
                      ? <Route exact path="/tab1" component={Words} />
                      : <Route exact path="/tab1">
                          <Redirect to="/login"></Redirect>
                      </Route>
                    }
                    {
                      auth 
                      ? <Route exact path="/editword/:id" component={AddEditWordFormHoc} />
                      : <Route exact path="/editword/:id">
                          <Redirect to="/login"></Redirect>
                      </Route>
                    }
                    <Route exact path="/">
                      <Redirect to={auth ? "/tab1" : "/login"} />
                    </Route>
                    {/* {!auth
                      ? <Route path="/login" component={Login} />
                      : <Route path="/login"><Redirect to="/tab1" /></Route>
                    } */}
                    <Route path="/register" component={(routerProps: RouteComponentProps) => <Register {...routerProps} />} />
                    <Route path="/login" component={Login} />
                  <Route>
                    <Page404 
                      title={"Oops... Broken Link"}
                      message={"The link you are trying to navigate to is broken. Sorry about that."}
                    />
                  </Route>
                </IonRouterOutlet>
                <IonTabBar slot="bottom" style={{"display": auth ? "flex" : "none"}}>
                  <IonTabButton tab="tab1" href="/tab1">
                    <IonIcon icon={bookOutline} />
                    <IonLabel>Words</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="tab2" href="/addword">
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
          <IonModal
          isOpen={showModal}
          breakpoints={[0, 0.15, 0.15, 0.15]}
          initialBreakpoint={0.1}
          onDidDismiss={() => setShowModal(false)}
          >
          <IonContent>
            <IonList>
              <IonItem style = {{"cursor": "pointer"}} onClick={() => {
                  setShowModal(false);
                  _messageBus.dispatch<string>(Messages.Logout, "logout");
                }
              }>
                <IonLabel>
                  <IonIcon icon={logOutOutline}/>
                  Logout
                </IonLabel>
              </IonItem>
            </IonList>
          </IonContent>
          </IonModal>
        </IonContent>
      </IonApp>
    </AuthContext.Provider>
    </>
    );
  }

export default App;
