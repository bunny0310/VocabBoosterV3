import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonSkeletonText,
  RefresherEventDetail,
} from "@ionic/react";
import { inject } from "inversify";
import React from "react";
import { RouteComponentProps } from "react-router";
import { IWordsApiClient } from "../api_clients/IWordsApiClient";
import { WordModel } from "../api_clients/WordsApiClient";
import { _wordsApi } from "../App";
import { SearchModal } from "../components/SearchModal";
import { Word } from "../components/Word";
import { WordSkeletonLoading } from "../components/WordSkeletonLoading";
import container from "../SettingsManager";

export interface WordsState {
  words: WordModel[];
  showSearchModal: boolean;
  loading: boolean;
  infiniteDisabled: boolean;
}
export class Words extends React.Component<RouteComponentProps, WordsState> {
  constructor(props: any) {
    super(props);
    this.state = {
      words: [],
      showSearchModal: false,
      loading: false,
      infiniteDisabled: false
    };
  }

  private searchModalHandler = (e: CustomEvent<void>, id?: string): void => {
    if (id) {
      this.props.history.push(`/addeditword/${id}`);
    }
    this.setState({
      ...this.state,
      showSearchModal: !this.state.showSearchModal,
    });
  };

  componentDidMount = () => {
    this.setState({
      ...this.state,
      loading: true,
    });
    this.getWords(5, 0);
  };

  getWords = async (limit: number, offset: number) => {
    const newWords = this.state.words;
    const queryWords = await _wordsApi.getWords(limit, offset)
    queryWords.length > 0 && newWords.push(...queryWords);
    this.setState({
      ...this.state,
      words: newWords,
      loading: false,
    });
    return queryWords.length;
  };

  loadData = async (ev: any) => {
    setTimeout(async () => {
      const numberQueriedWords = await this.getWords(5, this.state.words.length);
      numberQueriedWords === 0 && this.setState({
        ...this.state,
        infiniteDisabled: true
      })
      ev.target.complete();
    }, 500);
  }  

  doRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    this.setState({
      ...this.state,
      loading: true
    });
    const refreshWords = async () => {
      const refreshedWords = await _wordsApi.getWords(5, 0);
      this.setState({
        ...this.state,
        loading: false,
        words: refreshedWords
      })
    }
    await refreshWords();
    event.detail.complete();
  }

  render(): React.ReactNode {
    const words = this.state.words;
    return (
      <IonContent>
      <IonRefresher slot="fixed" onIonRefresh={this.doRefresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>
        <IonSearchbar
          placeholder={"Search for a word"}
          onIonFocus={this.searchModalHandler}
        ></IonSearchbar>
        <SearchModal
          showModal={this.state.showSearchModal}
          modalHandler={this.searchModalHandler}
        ></SearchModal>
        {!this.state.loading && (
          <> 
            {words.map((word) => {
              return (
                <Word
                  id={word.id}
                  name={word.name}
                  meaning={word.meaning}
                  sentences={word.sentences}
                  synonyms={word.synonyms}
                  tags={word.tags}
                  types={word.types}
                  {...this.props}
                ></Word>
              );
            })}
        <IonInfiniteScroll
          onIonInfinite={this.loadData}
          threshold="50px"
          disabled={this.state.infiniteDisabled}
        >
          <IonInfiniteScrollContent
            loadingSpinner="bubbles"
            loadingText="Loading more words..."
          ></IonInfiniteScrollContent>
        </IonInfiniteScroll>
          </>
        )}
        {this.state.loading && (
          <>
            {[1, 1, 1, 1, 1].map((x, i) => {
              return (
                <WordSkeletonLoading />
              );
            })}
          </>
        )}
      </IonContent>
    );
  }
}
