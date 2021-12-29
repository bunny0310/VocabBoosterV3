import { Container } from "inversify";
import { IWordsApiClient } from "./api_clients/IWordsApiClient";
import { WordsApiClient } from "./api_clients/WordsApiClient";

let container = new Container();
container
.bind<IWordsApiClient>('IWordsApiClient')
.to(WordsApiClient)

export default container