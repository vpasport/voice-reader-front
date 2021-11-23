import { useEffect, useCallback, useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';

import styles from './style.module.scss'

import { AudioPlayer } from '../components';
import io from 'socket.io-client';

import { AppContext } from '../utils'

export default function Home() {
	const [socket, setSocket] = useState(null);

	const [translateStream, setTranslateStream] = useState(null);
	const [fileTranslate, setFileTranslate] = useState(null);

	const initSocket = useCallback(() => {
		const _socket = io(`http://localhost:8081`, { transports: ['websocket', 'polling', 'flashsocket'] });

		_socket.on("connect", () => console.info("Sockets connected"));
		_socket.on("disconnect", () => console.log("Sockets disconnected"));

		_socket.on('voice-response', (response) => {
			// console.log(response)
			setTranslateStream(response);
		})

		setSocket(_socket);
	}, []);

	useEffect(() => {
		initSocket()

		return () => {
			if (socket) socket.disconnect();
		}
	}, [])

	return (
		<AppContext.Provider
			value={{
				socket, setFileTranslate
			}}
		>
			<div className={styles.main}>
				<div className={styles.audio}>
					<AudioPlayer />
				</div>
				<div className={styles.translates}>
					<div className={styles.translate}>
						<h3>Потоковый перевод:</h3>
						<InputTextarea
							value={translateStream ? translateStream.alternatives[0].text : ''}
							className={styles.translate_textarea}
						// onChange={(e) => setValue1(e.target.value)}
						// rows={5}
						// cols={30}
						/>
					</div>
					<div className={styles.translate}>
						<h3>Перевод конечного файла:</h3>
						<InputTextarea
							value={'test'}
							className={styles.translate_textarea}
							value={fileTranslate ? fileTranslate.results.results[0].alternatives[0].transcript : ''}
						// onChange={(e) => setValue1(e.target.value)}
						// rows={5}
						// cols={30}
						/>
					</div>
				</div>
			</div>
		</AppContext.Provider>
	)
}
