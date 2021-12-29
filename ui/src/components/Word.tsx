import React, { MouseEventHandler, ReactDOM } from "react";
import { WordModel } from "../api_clients/WordsApiClient";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
} from "@ionic/react";
import { closeCircleOutline, layers, pricetag, repeat } from "ionicons/icons";

enum WordViewOption {
  None,
  Tags,
  Synonyms,
  Types,
}

interface WordState {
  selectedWordViewOption: WordViewOption;
  information: string;
}

export class Word extends React.Component<WordModel, WordState> {
  constructor(props: WordModel) {
    super(props);
    this.state = {
      selectedWordViewOption: WordViewOption.None,
      information: "",
    };
  }

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
        informationArr = this.props.types;
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

  render(): React.ReactNode {
    const styleOptionSelected = (option: WordViewOption): string => {
      return this.state.selectedWordViewOption === option ? "block" : "none";
    };
    return (
      <>
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>{this.props.meaning}</IonCardSubtitle>
            <IonCardTitle>{this.capitalize(this.props.name)}</IonCardTitle>
            <IonCardTitle>
              <IonNote color="primary">{this.state.information}</IonNote>
            </IonCardTitle>
            <IonCardTitle>
              <IonChip
                outline={
                  this.state.selectedWordViewOption !== WordViewOption.Tags
                }
                color={"primary"}
              >
                <IonIcon icon={pricetag} />
                <IonLabel
                  onClick={() => this.selectWordViewOption(WordViewOption.Tags)}
                >
                  Tags
                </IonLabel>
                <IonIcon
                  style={{
                    display: styleOptionSelected(WordViewOption.Tags),
                  }}
                  icon={closeCircleOutline}
                  onClick={() => this.selectWordViewOption(WordViewOption.None)}
                />
              </IonChip>
              <IonChip
                outline={
                  this.state.selectedWordViewOption !== WordViewOption.Synonyms
                }
                color={"primary"}
              >
                <IonIcon icon={repeat} color={"primary"} />
                <IonLabel
                  onClick={() =>
                    this.selectWordViewOption(WordViewOption.Synonyms)
                  }
                >
                  Synonyms
                </IonLabel>
                <IonIcon
                  icon={closeCircleOutline}
                  style={{
                    display: styleOptionSelected(WordViewOption.Synonyms),
                  }}
                  onClick={() => this.selectWordViewOption(WordViewOption.None)}
                />
              </IonChip>
              <IonChip
                outline={
                  this.state.selectedWordViewOption !== WordViewOption.Types
                }
                color={"primary"}
              >
                <IonIcon icon={layers} color={"primary"} />
                <IonLabel
                  onClick={() =>
                    this.selectWordViewOption(WordViewOption.Types)
                  }
                >
                  Types
                </IonLabel>
                <IonIcon
                  icon={closeCircleOutline}
                  onClick={() => this.selectWordViewOption(WordViewOption.None)}
                  style={{
                    display: styleOptionSelected(WordViewOption.Types),
                  }}
                />
              </IonChip>
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              {this.props.sentences.map((sentence) => (
                <IonItem
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
      </>
    );
  }
}
