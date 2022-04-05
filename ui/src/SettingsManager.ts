import { Container } from "inversify";
import { AuthApiClient } from "./api_clients/AuthApiClient";
import { IAuthApiClient } from "./api_clients/IAuthApiClient";
import { IRegApiClient } from "./api_clients/IRegApiClient";
import { ITextToSpeechApiClient } from "./api_clients/ITextToSpeechApiClient";
import { IWordsApiClient } from "./api_clients/IWordsApiClient";
import { RegApiClient } from "./api_clients/RegApiClient";
import { TextToSpeechApiClient } from "./api_clients/TextToSpeechApiClient";
import { WordsApiClient } from "./api_clients/WordsApiClient";
import { IMessageBus } from "./services/IMessageBus";
import { MessageBus } from "./services/MessageBus";

let container = new Container();

container
.bind<IWordsApiClient>('IWordsApiClient')
.to(WordsApiClient)

container
.bind<IAuthApiClient>('IAuthApiClient')
.to(AuthApiClient)

container
.bind<IMessageBus>('IMessageBus')
.to(MessageBus)

container
.bind<ITextToSpeechApiClient>('ITextToSpeechApiClient')
.to(TextToSpeechApiClient)

container
.bind<IRegApiClient>('IRegApiClient')
.to(RegApiClient)

export default container