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
  IonToast,
  RefresherEventDetail,
} from "@ionic/react";
import { inject } from "inversify";
import React from "react";
import { RouteComponentProps } from "react-router";
import { IWordsApiClient } from "../api_clients/IWordsApiClient";
import { WordModel } from "../api_clients/WordsApiClient";
import { _authApi, _wordsApi } from "../App";
import { ApiCallStatus } from "../components/AddWordForm";
import { SearchModal } from "../components/SearchModal";
import { Word } from "../components/Word";
import { WordSkeletonLoading } from "../components/WordSkeletonLoading";
import container from "../SettingsManager";

export interface WordsState {
  words: WordModel[];
  showSearchModal: boolean;
  status: ApiCallStatus;
  infiniteDisabled: boolean;
}
export class Words extends React.Component<RouteComponentProps, WordsState> {
  constructor(props: any) {
    super(props);
    this.state = {
      words: [],
      showSearchModal: false,
      status: ApiCallStatus.NONE,
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
    // _authApi.authorize();
    this.setState({
      ...this.state,
      status: ApiCallStatus.PROCESSING,
    });
    this.getWords(5, 0);
  };
  
  apiCall = async (limit: number, offset: number) => {
    const outcome = await _wordsApi.getWords(limit, offset);
    if (!outcome.isSuccessful) {
        this.setState({
        ...this.state,
        status: ApiCallStatus.FAIL
      });
      return [];
    }
    return outcome.data;
  }
  getWords = async (limit: number, offset: number) => {
    const newWords = this.state.words;
    const queryWords = await this.apiCall(limit, offset);
    if (queryWords == null || queryWords?.length === 0) {
      return 0;
    }
    queryWords && queryWords.length > 0 && newWords.push(...queryWords);
    this.setState({
      ...this.state,
      words: newWords,
      status: ApiCallStatus.SUCCESS,
    });
    return queryWords?.length;
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
      status: ApiCallStatus.PROCESSING
    });
    const refreshWords = async () => {
      const refreshedWords = await this.apiCall(5, 0);
      if (refreshedWords == null || refreshedWords.length === 0) {
        return [];
      }
      this.setState({
        ...this.state,
        status: ApiCallStatus.SUCCESS,
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
        {this.state.status === ApiCallStatus.SUCCESS && (
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
        {(this.state.status === ApiCallStatus.PROCESSING || this.state.status === ApiCallStatus.FAIL) && (
          <>
            {[1, 1, 1, 1, 1].map((x, i) => {
              return (
                <WordSkeletonLoading />
              );
            })}
            <IonToast isOpen={this.state.status === ApiCallStatus.FAIL} color={"danger"} duration={500} message={"Unable to load words"} onDidDismiss={() => {}} />
          </>
        )}
      </IonContent>
    );
  }
}
