import { getPlatforms, isPlatform } from '@ionic/react';
import { injectable } from "inversify";
import { BaseApiClient } from "./BaseApiClient";
import { FileOpener } from '@awesome-cordova-plugins/file-opener'
import axios from 'axios';
import { File } from '@awesome-cordova-plugins/file';

const url = `http://api.voicerss.org/?key=${process.env.REACT_APP_SPEECHTOTEXTKEY}&hl=en-us`

@injectable()
export class TextToSpeechApiClient extends BaseApiClient {
    convertTextToSpeech = (text: string, handler?: () => void): void => {
            if (isPlatform('mobile')) {
                axios({
                    url: `${url}&src=${text}`,
                    method: 'GET',
                    responseType: 'blob'
                })
                    .then(res => {
                        const data = res.data
                        const blob = new Blob(data)
                        console.log(File.applicationDirectory)
                        File.writeFile(
                            File.dataDirectory,
                            "sound.mp3",
                            blob,
                            {
                              replace: true,
                            }
                          )
                          .then(() => console.log(`File written in ${File.dataDirectory}/sound.mp3`));
                    })
                return;
            }
            const source = new Audio(`http://api.voicerss.org/?key=${process.env.REACT_APP_SPEECHTOTEXTKEY}&hl=en-us&src=${text}`);
            source.addEventListener("error", function(e) { 
                console.log("Logging playback error: " + e.error);
                handler && handler();
            });
            source.play()
    }
}