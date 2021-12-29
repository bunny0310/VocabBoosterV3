import { IonContent, IonSearchbar } from "@ionic/react";
import { inject } from "inversify";
import React from "react";
import { IWordsApiClient } from "../api_clients/IWordsApiClient";
import { WordModel } from "../api_clients/WordsApiClient";
import { _wordsApi } from "../App";
import { SearchModal } from "../components/SearchModal";
import { Word } from "../components/Word";
import container from "../SettingsManager";

export interface WordsState {
  words: WordModel[];
  showSearchModal: boolean;
}
export class Words extends React.Component<any, WordsState> {
  constructor(props: any) {
    super(props);
    this.state = {
      words: [],
      showSearchModal: false
    };
  }

  private searchModalHandler = (): void => {
    this.setState({
        ...this.state,
        showSearchModal: !this.state.showSearchModal
    })
  }

  componentDidMount = () => {
    this.getWords(5, 100);
  };

  getWords = async (limit: number, offset: number) => {
    const newWords = this.state.words;
    newWords.push(...(await _wordsApi.getWords(limit, offset)));
    this.setState({
      ...this.state,
      words: newWords,
    });
  };

  render(): React.ReactNode {
    const words = this.state.words;
    return (
      <IonContent>
        <IonSearchbar placeholder={"Search for a word"} onIonFocus={this.searchModalHandler}></IonSearchbar>
        <SearchModal showModal={this.state.showSearchModal} modalHandler={this.searchModalHandler}></SearchModal>
        {words.map((word) => {
          return (
            <Word
              name={word.name}
              meaning={word.meaning}
              sentences={word.sentences}
              synonyms={word.synonyms}
              tags={word.tags}
              types={word.types}
            ></Word>
          );
        })}
      </IonContent>
    );
  }
}
