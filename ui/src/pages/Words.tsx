import {
  IonChip,
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonProgressBar,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonToast,
  IonToolbar,
  RefresherEventDetail,
} from "@ionic/react";
import React from "react";
import { RouteComponentProps } from "react-router";
import { WordModel } from "../api_clients/WordsApiClient";
import { _authApi, _wordsApi } from "../App";
import { ApiCallStatus } from "../components/AddWordForm";
import { NoWordFound } from "../components/NoWordFound";
import { Word } from "../components/Word";
import { WordSkeletonLoading } from "../components/WordSkeletonLoading";

interface SearchOptions {
  searching: boolean,
  filter?: SearchWordsByNameApiRequest
}

export interface WordsState {
  words: WordModel[];
  searchOptions: SearchOptions;
  status: ApiCallStatus;
  infiniteDisabled: boolean;
  audio?: HTMLAudioElement;
}

export class SearchWordsApiRequestBase {
  filter: boolean = true;
  searchByName: boolean = false;
  searchByMeaning: boolean = false;
  searchBySentences: boolean = false;
  searchBySynonyms: boolean = false;
  searchByTags: boolean = false;
  searchByType: boolean = false;
}

export class SearchWordsByNameApiRequest extends SearchWordsApiRequestBase {
  searchValue: string;

  constructor(searchValue: string) {
    super()
    this.searchValue = searchValue
    this.searchByName = true
  }
}

export class Words extends React.Component<RouteComponentProps, WordsState> {
  constructor(props: any) {
    super(props);
    this.state = {
      words: [],
      searchOptions: {
        searching: false
      },
      status: ApiCallStatus.NONE,
      infiniteDisabled: false
    };
  }

  private searchWords = async (phrase: string): Promise<void> => {

    const filterRequest = new SearchWordsByNameApiRequest(phrase)

    this.setState({
      ...this.state,
      status: ApiCallStatus.PROCESSING,
      searchOptions: {
        searching: true,
        filter: !phrase || phrase.trim().length === 0 ? undefined : filterRequest
      }
    });

    const webCall = async () => {
      const filteredWords = await this.apiCall(5, 0, this.state.searchOptions.filter)
      this.setState({
        words: filteredWords ?? [],
        searchOptions: {
          ...this.state.searchOptions,
          searching: false
        },
        status: ApiCallStatus.SUCCESS,
      });
    }

    webCall()
  }

  componentDidMount = () => {
    this.setState({
      ...this.state,
      status: ApiCallStatus.PROCESSING,
    });
    this.getWords(5, 0);
  };
  
  apiCall = async (limit: number, offset: number, filter?: SearchWordsByNameApiRequest) => {
    const outcome = await _wordsApi.getWords(limit, offset, filter);
    if (!outcome.isSuccessful) {
        this.setState({
        ...this.state,
        status: ApiCallStatus.FAIL
      });
      return [];
    }
    return outcome.data;
  }
  getWords = async (limit: number, offset: number, filter?: SearchWordsByNameApiRequest) => {
    const newWords = this.state.words;
    const queryWords = await this.apiCall(limit, offset, filter);
    if (queryWords == null) {
      return 0;
    }
    queryWords && queryWords.length > 0 && newWords.push(...queryWords);
    this.setState({
      words: newWords,
      searchOptions: {
        ...this.state.searchOptions,
        searching: false
      },
      status: ApiCallStatus.SUCCESS,
    });
    return queryWords?.length;
  };

  loadData = async (ev: any) => {
    setTimeout(async () => {
      const numberQueriedWords = await this.getWords(5, this.state.words.length, this.state.searchOptions.filter);
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
      const refreshedWords = await this.apiCall(5, 0, this.state.searchOptions.filter);
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

  audioHandler = (audio?: HTMLAudioElement) => {
    this.setState({audio});
    audio?.play()
  }

  deleteWordHandler = async (id: string): Promise<boolean> => {
    const outcome = await _wordsApi.deleteWord(id);
    const status = outcome.data ?? false;
    if (status) {
      const newWords = [...this.state.words];
      const index = newWords.findIndex(w => w.id === id);
      if (index !== -1) {
        newWords.splice(index, 1);
      }
      this.setState({
        words: newWords
      })
    }
    return status
  }

  renderSearchComponents = () => {
    const { searching, filter } = this.state.searchOptions

    const renderFilterChip = () => {
      const searchValue = filter?.searchValue
      return (
        <>
          {searchValue && <IonChip style={{position: 'fixed', zIndex: '999', right: '20px'}}>
            <b>Filter: </b>{searchValue.substring(0, Math.min(6, searchValue.length))}{searchValue.length > 6 && '...'}
            </IonChip>
          }
        </>
      )
    }

    return (
      <div className='searchComponents'>
        {searching && <IonProgressBar type="indeterminate" />}
        {filter && renderFilterChip()}
      </div>
    )
  }

  render(): React.ReactNode {
    const words = this.state.words;
    return (
      <IonContent>

      <IonRefresher slot="fixed" onIonRefresh={this.doRefresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>

      <IonToolbar
        style={{position: 'fixed'}}
      >
        <IonSearchbar
          placeholder={"Search for a word"}
          onIonChange={e => this.searchWords(e.detail.value ?? '')}
        />
      </IonToolbar>
      
      <div style={{marginTop: '60px'}}>

        {this.renderSearchComponents()}

        <div style={{marginTop: '50px'}}>
          {this.state.status === ApiCallStatus.SUCCESS &&
            this.state.words.length > 0 && 
                <> 
                  {words.map((word, i) => {
                    return (
                      <Word
                        key={i}
                        id={word.id}
                        name={word.name}
                        meaning={word.meaning}
                        sentences={word.sentences}
                        synonyms={word.synonyms}
                        tags={word.tags}
                        types={word.types}
                        audioHandler={this.audioHandler}
                        audio={this.state.audio}
                        handleDeleteWord={this.deleteWordHandler}
                        {...this.props}
                      />
                    )
                  })}
                  <IonInfiniteScroll
                    onIonInfinite={this.loadData}
                    threshold="50px"
                    disabled={this.state.infiniteDisabled}
                  >
                    <IonInfiniteScrollContent
                      loadingSpinner="bubbles"
                      loadingText="Loading more words..."
                    />
                  </IonInfiniteScroll>
                </>
          }
          {this.state.status === ApiCallStatus.SUCCESS && this.state.words.length === 0
            && <NoWordFound />
          }
        </div>
      </div>

        {(this.state.status === ApiCallStatus.PROCESSING || this.state.status === ApiCallStatus.FAIL) && (
          <>
            {[1, 1, 1, 1, 1].map((x, i) => {
              return (
                <WordSkeletonLoading key={i} />
              );
            })}
            <IonToast isOpen={this.state.status === ApiCallStatus.FAIL} color={"danger"} duration={500} message={"Unable to load words"} onDidDismiss={() => {}} />
          </>
        )}
      </IonContent>
    );
  }
}
