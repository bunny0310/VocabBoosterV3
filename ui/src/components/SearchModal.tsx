import {
  CheckboxChangeEventDetail,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonNote,
  IonProgressBar,
  IonSearchbar,
  IonText,
  IonToolbar,
  SearchbarChangeEventDetail,
} from "@ionic/react";
import { closeCircleOutline, ellipsisVertical, searchCircle } from "ionicons/icons";
import React, { createRef } from "react";
import { _wordsApi } from "../App";

interface SearchModalProps {
  showModal: boolean;
  modalHandler: () => void;
}

export interface SearchWordsApiRequestBase {
  searchByName: boolean;
  searchByMeaning: boolean;
  searchBySentences: boolean;
  searchBySynonyms: boolean;
  searchByTags: boolean;
  searchByType: boolean;
}

export interface SearchWordsApiRequest extends SearchWordsApiRequestBase {
  searchValue: string;
}

enum SearchOption {
  Name,
  Meaning,
  Sentences,
  Synonyms,
  Tags,
  Type,
}

export const SearchModal = (props: SearchModalProps) => {
  const searchbarRef = createRef<HTMLIonSearchbarElement>();
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [showAdvancedOptions, setShowAdvancedOptions] =
    React.useState<boolean>(false);
  const checkboxList: SearchOption[] = [
    SearchOption.Name,
    SearchOption.Meaning,
    SearchOption.Sentences,
    SearchOption.Synonyms,
    SearchOption.Tags,
    SearchOption.Type,
  ];

  const defaultSelectedOptions = checkboxList.map((so) => false);
  defaultSelectedOptions[0] = true;
  const [selectedOptions, setSelectedOptions] = React.useState<boolean[]>(
    defaultSelectedOptions
  );
  const [searchedWords, setSearchedWords] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const constructBasePostRequest = () => {
    const postRequest: SearchWordsApiRequestBase = {
      searchByName: selectedOptions[SearchOption.Name],
      searchByMeaning: selectedOptions[SearchOption.Meaning],
      searchBySentences: selectedOptions[SearchOption.Sentences],
      searchBySynonyms: selectedOptions[SearchOption.Synonyms],
      searchByTags: selectedOptions[SearchOption.Tags],
      searchByType: selectedOptions[SearchOption.Type],
    };
    return postRequest;
  };

  React.useCallback(() => {
    setLoading(true);
    const constructPostRequest = () => {
      return {
        ...constructBasePostRequest(),
        searchValue: searchbarRef.current?.value ?? "",
      };
    };
    const getSearchResults = async () => {
      const postRequest = constructPostRequest();
      setSearchedWords(await _wordsApi.searchWordsNameOnly(postRequest));
      setLoading(false);
    };
    if (searchbarRef.current) {
      showAdvancedOptions
        ? searchbarRef.current?.blur()
        : searchbarRef.current?.setFocus();
    }
    setTimeout(() => {
      if (searchbarRef.current) {
        showAdvancedOptions
          ? searchbarRef.current?.blur()
          : searchbarRef.current?.setFocus();
      }
    }, 1000);
    if (!showAdvancedOptions) {
      getSearchResults();
    }
  }, [showAdvancedOptions, searchbarRef]);

  const modalHandler = (): void => {
    props.modalHandler();
    setShowAdvancedOptions(false);
  };
  const searchOptionsHandler = (
    e: CustomEvent<CheckboxChangeEventDetail>
  ): void => {
    const val = e.detail.value as SearchOption;
    const selectedOptionsClone = selectedOptions.map((so, i) =>
      i === val ? !so : so
    );
    setSelectedOptions(selectedOptionsClone);
  }

  const searchHandler = (e: CustomEvent<SearchbarChangeEventDetail>) => {
    const val = e.detail.value;
    setShowAdvancedOptions(false);
    setLoading(true);
    setSearchValue(val ?? "");
    const getSearchResults = async () => {
      if (val == null) {
        setSearchedWords([]);
        return;
      }
      const postRequest: SearchWordsApiRequest = {
        ...constructBasePostRequest(),
        searchValue: val,
      };
      setSearchedWords(await _wordsApi.searchWordsNameOnly(postRequest));
      setLoading(false);
      console.log(searchedWords)
    }
    getSearchResults()
  }

  return (
    <IonModal isOpen={props.showModal}>
        <IonHeader>
            <IonToolbar>
                <IonSearchbar
                id={"searchBar"}
                placeholder={"Search for a word"}
                showCancelButton="always"
                onIonCancel={modalHandler}
                onIonChange={searchHandler}
                ref={searchbarRef}
                ></IonSearchbar>
                <IonButtons slot="end">
                    <IonButton
                        onClick={() => {
                        setShowAdvancedOptions(!showAdvancedOptions);
                        }}
                    >
                        <IonIcon
                        icon={showAdvancedOptions ? closeCircleOutline : ellipsisVertical}
                        ></IonIcon>
                    </IonButton>
                </IonButtons>
            </IonToolbar>
            {loading && <IonProgressBar type="indeterminate"></IonProgressBar>}
        </IonHeader>
        <IonContent>
            {showAdvancedOptions && (
            <IonCard>
                <IonCardContent>
                    {selectedOptions.map((so) => so)}
                    <IonList>
                        {checkboxList.map((searchOption, i) => {
                            return (
                            <>
                                <IonItem key={i}>
                                    <IonLabel>
                                        {SearchOption[searchOption]}
                                    </IonLabel>
                                    <IonCheckbox
                                        value={searchOption}
                                        checked={selectedOptions[searchOption]}
                                        onIonChange={searchOptionsHandler}
                                    ></IonCheckbox>
                                </IonItem>
                            </>
                            );
                        })}
                    </IonList>
                </IonCardContent>
            </IonCard>
            )}
            {!loading && 
                <>
                    {searchValue.trimStart().trimEnd() !== "" && <IonItem>
                        <IonIcon icon={searchCircle}></IonIcon>
                        <IonText color={"dark"}>{`Search for "${searchValue}" in words`}</IonText>
                    </IonItem>}
                    {searchedWords.length !== 0 && 
                    <>
                    <IonListHeader>
                        <IonNote color={"dark"}>
                            Suggested word searches
                        </IonNote>
                    </IonListHeader>
                        <IonList>
                            {searchedWords.map((wordName, i) => {
                                return (<IonItem key={i}>{wordName}</IonItem>)
                            })}
                        </IonList>
                    </>}
                </>
            }
        </IonContent>
    </IonModal>
  );
};
