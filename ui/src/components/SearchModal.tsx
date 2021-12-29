import {
    CheckboxChangeEventDetail,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonSearchbar,
  IonToolbar,
} from "@ionic/react";
import { closeCircleOutline, ellipsisVertical } from "ionicons/icons";
import React, { createRef } from "react";
import { _wordsApi } from "../App";

interface SearchModalProps {
  showModal: boolean;
  modalHandler: () => void;
}

export interface SearchWordsApiRequest {
    searchByName: boolean;
    searchByMeaning: boolean;
    searchBySentences: boolean;
    searchBySynonyms: boolean;
    searchByTags: boolean;
    searchByType: boolean;
    name: string;
    meaning: string;
    sentences: string[];
    synonyms: string[];
    tags: string[];
    type: string
}

enum SearchOption {
    Name,
    Meaning,
    Sentences,
    Synonyms,
    Tags,
    Type
}

export const SearchModal = (props: SearchModalProps) => {
    const searchbarRef = createRef<HTMLIonSearchbarElement>();
    const [showAdvancedOptions, setShowAdvancedOptions] = React.useState<boolean>(false);
    const checkboxList: SearchOption[] = [
        SearchOption.Name,
        SearchOption.Meaning, 
        SearchOption.Sentences,
        SearchOption.Synonyms,
        SearchOption.Tags,
        SearchOption.Type,
    ];

    const defaultSelectedOptions = checkboxList.map(so => false);
    defaultSelectedOptions[0] = true;
    const [selectedOptions, setSelectedOptions] = React.useState<boolean[]>(defaultSelectedOptions);

    React.useEffect(() => {
        const getSearchResults = async () => {
            const postRequest = generateSearchWordPostRequest();
            const words = await _wordsApi.searchWordsNameOnly(postRequest);
            console.log(words);
        }
        if (searchbarRef.current) {
            showAdvancedOptions ? searchbarRef.current?.blur() : searchbarRef.current?.setFocus()
            }
            setTimeout(() => {
            if (searchbarRef.current) {
                showAdvancedOptions ? searchbarRef.current?.blur() : searchbarRef.current?.setFocus()
            }
            }, 1000);
            if (!showAdvancedOptions) {
                getSearchResults();
            }
    }, [showAdvancedOptions, searchbarRef])

    const generateSearchWordPostRequest = (): SearchWordsApiRequest => {
        const postRequest: SearchWordsApiRequest = {
            searchByName: selectedOptions[SearchOption.Name],
            searchByMeaning: selectedOptions[SearchOption.Meaning],
            searchBySentences: selectedOptions[SearchOption.Sentences],
            searchBySynonyms: selectedOptions[SearchOption.Synonyms],
            searchByTags: selectedOptions[SearchOption.Tags],
            searchByType: selectedOptions[SearchOption.Type],
            name: searchbarRef.current?.value ?? "",
            meaning: searchbarRef.current?.value ?? "",
            sentences: [searchbarRef.current?.value ?? ""],
            synonyms: [searchbarRef.current?.value ?? ""],
            tags: [searchbarRef.current?.value ?? ""],
            type: searchbarRef.current?.value ?? "",
        }
        return postRequest
    }

    const modalHandler = (): void => {
        props.modalHandler();
        setShowAdvancedOptions(false)
    }
    const searchOptionsHandler = (e: CustomEvent<CheckboxChangeEventDetail>): void => {
        const val = (e.detail.value as SearchOption);
        const selectedOptionsClone = selectedOptions.map((so, i) => i === val ? !so : so);
        setSelectedOptions(selectedOptionsClone)
    }
    return (
        <IonModal isOpen={props.showModal}>
            <IonToolbar>
            <IonSearchbar
                id={"searchBar"}
                placeholder={"Search for a word"}
                showCancelButton="always"
                onIonCancel={modalHandler}
                ref={searchbarRef}
            ></IonSearchbar>
            <IonButtons slot="end">
                <IonButton onClick={() => {
                    setShowAdvancedOptions(!showAdvancedOptions);
                    }}>
                    <IonIcon icon={showAdvancedOptions ? closeCircleOutline : ellipsisVertical}></IonIcon>
                </IonButton>
            </IonButtons>
            </IonToolbar>
            <IonContent>
                <IonCard style={{"display": showAdvancedOptions ? 'block' : 'none'}}>
                    <IonCardContent>
                        {selectedOptions.map(so => so)}
                        {checkboxList.map((searchOption, i) => {
                            return (
                                <>
                                <IonItem key={i}>
                                {SearchOption[searchOption]}
                                <IonCheckbox value={searchOption} checked={selectedOptions[searchOption]} onIonChange={searchOptionsHandler}></IonCheckbox>
                                </IonItem>
                                </>
                            )
                        })}
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonModal>
        );
    };
