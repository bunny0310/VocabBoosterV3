import React, { MouseEventHandler, ReactDOM, useState, useEffect } from "react";
import { WordModel, WordTypeDescriptions } from "../api_clients/WordsApiClient";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPopover,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import {
  closeCircleOutline,
  ellipsisVertical,
  layers,
  pencil,
  pencilOutline,
  pricetag,
  repeat,
  trashBin,
  trashOutline,
  volumeMedium,
} from "ionicons/icons";
import {
  RouteComponentProps,
  RouteProps,
  RouterProps,
  withRouter,
} from "react-router-dom";
import container from "../SettingsManager";
import { ITextToSpeechApiClient } from "../api_clients/ITextToSpeechApiClient";

enum WordViewOption {
  None,
  Tags,
  Synonyms,
  Types,
}

interface DeleteOptions {
  id?: string;
  isDeletable: boolean;
}

interface WordState {
  selectedWordViewOption: WordViewOption;
  information: string;
  popoveroptions: {
    show: boolean,
    event: any
  };
  showPlayFailToast: boolean;
  deleteOptions: DeleteOptions;
}

interface WordProps extends WordModel, RouteComponentProps {
  audio?: HTMLAudioElement
  audioHandler: (audio?: HTMLAudioElement) => void
  handleDeleteWord: (id: string) => Promise<boolean>
}

export class Word extends React.Component<WordProps, WordState> {
  constructor(props: WordProps) {
    super(props);
    this.state = {
      selectedWordViewOption: WordViewOption.None,
      information: "",
      popoveroptions: {
        show: false,
        event: undefined
      },
      showPlayFailToast: false,
      deleteOptions: {
        isDeletable: false
      }
    };
  }

  textToSpeechApiClient = container.get<ITextToSpeechApiClient>('ITextToSpeechApiClient')

  selectWordViewOption = (wordViewOption: WordViewOption): void => {
    let informationArr: string[] = [];
    switch (wordViewOption) {
      case WordViewOption.Synonyms:
        informationArr = this.props.synonyms;
        break;
      case WordViewOption.Tags:
        informationArr = this.props.tags;
        break;
      case WordViewOption.Types:
        informationArr = this.props.types.map(type => WordTypeDescriptions[type]);
        break;
      default:
        informationArr = [];
        break;
    }
    this.setState({
      ...this.state,
      selectedWordViewOption: wordViewOption,
      information: this.beautifyInformation(informationArr),
    });
  };

  private beautifyInformation = (information: string[]): string => {
    if (information.length === 0) {
      return "";
    }
    let informationStr = information.join(", ");
    informationStr = `(${informationStr})`;
    return informationStr;
  };

  capitalize = (str: string): string => {
    const arr = str.split(". ");
    return arr
      .map((str) => `${str[0].toUpperCase()}${str.substring(1)}`)
      .join(". ");
  };

  // TODO Prevent audio from playing if audio is already playing
  play = (): void => {
    const audio = this.props.audio
    if(!audio || (audio && (audio.duration <= 0 || audio.paused))) {
      const newAudio = this.textToSpeechApiClient.convertTextToSpeech(this.props.name, () => this.setState({
        showPlayFailToast: true,
      }))
      this.props.audioHandler(newAudio)
    }
  }

  render(): React.ReactNode {
    const styleOptionSelected = (option: WordViewOption): string => {
      return this.state.selectedWordViewOption === option ? "block" : "none";
    };
    return (
      <>
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>{this.props.meaning}</IonCardSubtitle>
            <IonCardTitle>
              {this.capitalize(this.props.name)}
              <IonIcon
                style={{"float": "right"}}
                icon={ellipsisVertical}
                color={"primary"}
                onClick={(e: any) => {
                  e.persist();
                  this.setState({
                    ...this.state,
                    popoveroptions: {
                      show: !this.state.popoveroptions.show,
                      event: this.state.popoveroptions.event ? undefined : e
                    }
                  })
                }}
              />
              <IonIcon
                style={{float: 'right'}}
                icon={volumeMedium}
                onClick={() => {
                  this.play()
                }}
              />
            </IonCardTitle>
            <IonPopover
                isOpen={this.state.popoveroptions.show}
                side={"bottom"}
                event={this.state.popoveroptions.event}
                onDidDismiss={() => {
                  this.setState({...this.state, popoveroptions: {show: false, event: undefined}})
                }
              }
            >
                <IonList lines={"none"}>
                  <IonItem onClick={() => {

                    this.setState({
                      ...this.state,
                      popoveroptions: {
                        ...this.state.popoveroptions,
                        show: false,
                      },
                      deleteOptions: {
                        id: undefined,
                        isDeletable: false
                      },
                    }, () => this.props.history.push(`/editword/${this.props.id}`))
                    
                  }
                }>
                    <IonIcon color={"primary"} icon={pencilOutline} />
                    Edit
                  </IonItem>
                  <IonItem
                  
                    onClick={() => {
                      if (this.state.deleteOptions.id != null && this.state.deleteOptions.isDeletable) {
                        this.props.handleDeleteWord(this.props.id!)
                        this.setState({
                          ...this.state,
                          popoveroptions: {
                            ...this.state.popoveroptions,
                            show: false,
                          },
                          deleteOptions: {
                            id: undefined,
                            isDeletable: false
                          }
                        });
                      } else {
                        this.setState({
                          deleteOptions: {
                            id: this.props.id,
                            isDeletable: true
                          }
                        })
                      }
                    }
                  }>
                    <IonIcon color={"danger"} icon={trashOutline} />
                    Delete {this.state.deleteOptions.id != null && this.state.deleteOptions.isDeletable && <span style={{fontSize: "12px", color: "#ff0000"}}>(Click Again to Confirm)</span>}
                  </IonItem>
                </IonList>
            </IonPopover>
            <IonNote color="primary">{this.state.information}</IonNote>
            <IonCardTitle>
              <IonChip
                outline={
                  this.state.selectedWordViewOption !== WordViewOption.Tags
                }
                color={"primary"}
                onClick={() => {
                  this.state.selectedWordViewOption === WordViewOption.Tags ?
                  this.selectWordViewOption(WordViewOption.None) :
                  this.selectWordViewOption(WordViewOption.Tags)
                }}
              >
                <IonIcon icon={pricetag} />
                <IonLabel>
                  Tags
                </IonLabel>
              </IonChip>
              <IonChip
                outline={
                  this.state.selectedWordViewOption !== WordViewOption.Synonyms
                }
                color={"primary"}
                onClick={() => {
                  this.state.selectedWordViewOption === WordViewOption.Synonyms ?
                  this.selectWordViewOption(WordViewOption.None) :
                  this.selectWordViewOption(WordViewOption.Synonyms)
                }}
              >
                <IonIcon icon={repeat} color={"primary"} />
                <IonLabel>
                  Synonyms
                </IonLabel>
              </IonChip>
              <IonChip
                outline={
                  this.state.selectedWordViewOption !== WordViewOption.Types
                }
                color={"primary"}
                onClick={() => {
                  this.state.selectedWordViewOption === WordViewOption.Types ?
                  this.selectWordViewOption(WordViewOption.None) :
                  this.selectWordViewOption(WordViewOption.Types)
                }}
              >
                <IonIcon icon={layers} color={"primary"} />
                <IonLabel>
                  Types
                </IonLabel>
              </IonChip>
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              {this.props.sentences.map((sentence, i) => (
                <IonItem
                  key={i}
                  style={{
                    "--border-color": "blue",
                  }}
                >
                  {sentence}
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>
        <IonToast
          isOpen={this.state.showPlayFailToast}
          color={'danger'}
          message={'Daily API limit reached or conversion error.'}
          duration={2000}
          onDidDismiss={() => this.setState({
            showPlayFailToast: false,
          })}
        />
      </>
    );
  }
}
