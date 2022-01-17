import { Container } from "inversify";
import { IWordsApiClient } from "./api_clients/IWordsApiClient";
import { WordsApiClient } from "./api_clients/WordsApiClient";
import { IMessageBus } from "./services/IMessageBus";
import { MessageBus } from "./services/MessageBus";

let container = new Container();

container
.bind<IWordsApiClient>('IWordsApiClient')
.to(WordsApiClient)

container
.bind<IMessageBus>('IMessageBus')
.to(MessageBus)

export default container