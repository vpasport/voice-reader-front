import { useState, useRef, useEffect, useCallback, useContext, useMemo } from 'react';
import dynamic from 'next/dynamic';
import styles from './style.module.scss';

import { FiMic, FiPlay } from 'react-icons/fi';
import { Slider } from 'primereact/slider';

import { FileUploader } from '../';
import { AppContext } from '../../utils';

const ReactMic = dynamic(
    () => import('react-mic').then(module => module.ReactMic),
    { ssr: false }
)

const AudioPlayer = () => {
    const { socket, setFileTranslate } = useContext(AppContext);

    const audioRef = useRef(null);

    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [record, setRecord] = useState(false);
    const [recordFile, setRecordFile] = useState();
    const [progress, setProgress] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.2);
    const [chuncks, setChuncks] = useState([]);

    useEffect(() => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            console.log('getUserMedia supported.');
            navigator.mediaDevices.getUserMedia({ audio: true})
                .then((stream) => {
                    setMediaRecorder(new MediaRecorder(stream))
                })
                .catch((err) => {
                    console.log('The following getUserMedia error occured: ' + err);
                });
        } else {
            console.log('getUserMedia not supported on your browser!');
        }

        return () => {
            setMediaRecorder(null);
        }
    }, [])

    useEffect(() => {
        if (mediaRecorder !== null) {
            mediaRecorder.audioChannels = 1;

            mediaRecorder.ondataavailable = function (e) {
                let blob = new Blob([e.data], { 'type': 'audio/ogg; codecs=opus' });
                setChuncks(prev => ([...prev, e.data]));
                socket.emit('voice', {
                    blob
                })
            }

            mediaRecorder.onstop = async (e) => {
                const blob = new Blob([...chuncks], { 'type': 'audio/ogg; codecs=opus' });
                const file = new File([blob], 'test.ogg');

                const formData = new FormData();

                formData.append('audio', file);
                formData.append('languageCode', 'ru-RU');
                formData.append('audioChannelCount', 1);
                formData.append('sampleRateHertz', 48000);
                formData.append('encoding', 'WEBM_OPUS');

                const response = await fetch('http://localhost:3001/translate', {
                    credentials: 'include',
                    method: 'POST',
                    body: formData
                })

                const json = await response.json();

                setFileTranslate(json);
                setChuncks([]);
            }
        }
    }, [mediaRecorder, chuncks])

    useEffect(() => {
        if (mediaRecorder)
            if (record) {
                mediaRecorder.start(1000);
                console.log(mediaRecorder.state);
                console.log("recorder started");
            } else {
                mediaRecorder.stop();
                const blob = new Blob(chuncks, { 'type': 'audio/ogg; codecs=opus' })
                blob.blobURL = window.URL.createObjectURL(blob);
                setRecordFile(blob)
                console.log(mediaRecorder.state);
                console.log("recorder stoped");
            }
    }, [record])

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.2;
        }
    }, [audioRef])

    useEffect(() => {
        if (audioRef?.current)
            audioRef.current.volume = volume;
    }, [volume, audioRef])

    return (
        <div className={styles.main}>
            <audio
                ref={audioRef}
                controls={true}
                src={recordFile?.blobURL}
                className={styles.audio}
                onTimeUpdate={() => setProgress(audioRef.current.currentTime / audioRef.current.duration * 100)}
            />

            <div className={styles.player}>
                <div>
                    <div className={styles.progress_line}>
                        <div
                            className={styles.progress}
                            style={{
                                width: `${progress}%`
                            }}
                        />
                    </div>
                </div>
                <div className={styles.control}>
                    <FiPlay
                        size={25}
                        onClick={() => {
                            if (!recordFile) return;
                            if (playing) {
                                audioRef.current.pause();
                                setPlaying(false);
                            } else {
                                if (progress === 100) setProgress(0);
                                audioRef.current.play();
                                setPlaying(true);
                            }
                        }}
                        color={playing ? '#2196f3' : '#aaa'}
                    />
                    <FiMic
                        size={25}
                        onClick={() => setRecord(!record)}
                        color={record ? '#2196f3' : '#aaa'}
                    />
                    <div className={styles.volume_slider}>
                        <Slider
                            value={volume}
                            onChange={({ value }) => setVolume(value)}
                            max={1}
                            step={0.1}
                        />
                    </div>
                </div>
            </div>
            {/* <FileUploader /> */}
        </div>
    )
}

export { AudioPlayer };