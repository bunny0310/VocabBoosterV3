import { injectable } from "inversify";
import { IMessageBus } from "./IMessageBus";

@injectable()
export class MessageBus implements IMessageBus{
    on = (event: string, callback: any) => {
        console.log(`listening to ${event}`)
        document.addEventListener(event, () => callback());
    } 
    dispatch = function<T>(event: string, data: T) {
        console.log(`dispatching ${event}`)
        document.dispatchEvent(new CustomEvent(event, { detail: data }));
    }

    remove = (event: string, callback: any) => {
        document.removeEventListener(event, callback);
    }
}

export enum Messages {
    CloseSearchModal = "CloseSearchModal"
}