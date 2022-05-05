export interface ITextToSpeechApiClient {
    convertTextToSpeech: (text: string, handler?: () => void) => HTMLAudioElement | undefined
}