export interface IMessageBus {
    on: (event: string, callback: any) => void;
    dispatch: <T>(event: string, data: T) => void;
    remove: (event: string, callback: any) => void;
}
