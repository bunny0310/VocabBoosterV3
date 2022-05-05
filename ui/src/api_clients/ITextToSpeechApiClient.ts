export interface ITextToSpeechApiClient {
    convertTextToSpeech: (text: string, handler?: () => void) => void
}