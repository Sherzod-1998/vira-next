import React, {
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import { Avatar, Box, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import { useRouter } from 'next/router';
import ScrollableFeed from 'react-scrollable-feed';
import { RippleBadge } from '../../scss/MaterialTheme/styled';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { Member } from '../types/member/member';
import { Messages, REACT_APP_API_URL } from '../config';
import { sweetErrorAlert } from '../sweetAlert';
import { getJwtToken } from '../auth';

interface MessagePayload {
	event: string;
	text: string;
	memberData: Member;
}

interface InfoPayload {
	event: string;
	totalClients: number;
	memberData: Member;
	action: string;
}

const Chat = () => {
	const chatContentRef = useRef<HTMLDivElement>(null);
	const [messagesList, setMessagesList] = useState<MessagePayload[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<number>(0);
	const [messageInput, setMessageInput] = useState<string>('');
	const [open, setOpen] = useState(false);
	const [openButton, setOpenButton] = useState(false);
	const [socket, setSocket] = useState<WebSocket | null>(null);

	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** WS INIT – faqat chat uchun alohida socket */
	useEffect(() => {
		if (typeof window === 'undefined') return;

		const baseUrl =
			process.env.NEXT_PUBLIC_CHAT_WS_URL ||
			process.env.REACT_APP_API_WS ||
			'ws://localhost:3007';

		const token = getJwtToken();
		const CHAT_WS_URL = token ? `${baseUrl}?token=${token}` : baseUrl;

		console.log('[Chat] opening WS:', CHAT_WS_URL);

		const ws = new WebSocket(CHAT_WS_URL);

		ws.onopen = () => {
			console.log('[Chat] Chat WebSocket OPEN');
		};

		ws.onerror = (e) => {
			console.error('[Chat] Chat WebSocket ERROR', e);
		};

		ws.onclose = (e) => {
			console.log('[Chat] Chat WebSocket CLOSED', e.code, e.reason);
		};

		setSocket(ws);

		return () => {
			ws.close();
		};
	}, []);

	/** WS MESSAGE HANDLER */
	useEffect(() => {
		if (!socket) {
			console.log('[Chat] socket hali tayyor emas');
			return;
		}

		const handleMessage = (msg: MessageEvent) => {
			try {
				const raw = msg.data as string;
				console.log('[Chat] raw message data:', raw);

				const data = JSON.parse(raw);
				console.log('[Chat] parsed message:', data);

				const event = data.event;

				switch (event) {
					case 'info': {
						const newInfo: InfoPayload = data;
						setOnlineUsers(newInfo.totalClients);
						break;
					}
					case 'getMessages': {
						const list: MessagePayload[] = data.list;
						console.log('[Chat] getMessages list length:', list.length);
						setMessagesList(list);
						break;
					}
					case 'message': {
						// backend: { event:'message', text, memberData }
						const payload: MessagePayload =
							data.data && data.data.text ? data.data : data;

						console.log('[Chat] new message payload:', payload);
						setMessagesList((prev) => [...prev, payload]);
						break;
					}
					default: {
						console.log('[Chat] unknown event type:', event, data);
					}
				}
			} catch (err) {
				console.error('[Chat] WebSocket parse error: ', err);
			}
		};

		socket.addEventListener('message', handleMessage);

		return () => {
			socket.removeEventListener('message', handleMessage);
		};
	}, [socket]);

	/** Chat tugmasini biroz kechiktirib ko‘rsatish */
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setOpenButton(true);
		}, 100);
		return () => clearTimeout(timeoutId);
	}, []);

	/** Route o‘zgarganda chat tugmasini qayta yopish */
	useEffect(() => {
		setOpenButton(false);
	}, [router.pathname]);

	/** HANDLERS */
	const handleOpenChat = () => {
		setOpen((prevState) => !prevState);
	};

	const getInputMessageHandler = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setMessageInput(e.target.value);
		},
		[],
	);

	const getKeyHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			onClickHandler();
		}
	};

	const onClickHandler = () => {
		if (!messageInput) {
			sweetErrorAlert(Messages.error4);
			return;
		}
		if (!socket) {
			console.log('[Chat] chat socket hali yo‘q, faqat localda ko‘rinadi');
			setMessageInput('');
			return;
		}

		if (socket.readyState !== WebSocket.OPEN) {
			console.log(
				'[Chat] chat socket OPEN emas, readyState =',
				socket.readyState,
			);
			setMessageInput('');
			return;
		}

		console.log('[Chat] sending message to chat server: ', messageInput);

		socket.send(
			JSON.stringify({
				event: 'message',
				data: messageInput,
			}),
		);

		setMessageInput('');
	};

	console.log('[Chat] messagesList length:', messagesList.length);

	return (
		<Stack className="chatting">
			{openButton ? (
				<button className="chat-button" onClick={handleOpenChat}>
					{open ? <CloseFullscreenIcon /> : <MarkChatUnreadIcon />}
				</button>
			) : null}

			<Stack className={`chat-frame ${open ? 'open' : ''}`}>
				<Box className={'chat-top'} component={'div'}>
					<div style={{ fontFamily: 'Nunito' }}>Online Chat</div>
					<RippleBadge
						style={{ margin: '-18px 0 0 21px' }}
						badgeContent={onlineUsers}
					/>
				</Box>

				<Box
					className={'chat-content'}
					id="chat-content"
					ref={chatContentRef}
					component={'div'}
				>
					<ScrollableFeed>
						<Stack className={'chat-main'}>
							<Box
								flexDirection={'row'}
								style={{ display: 'flex' }}
								sx={{ m: '10px 0px' }}
								component={'div'}
							>
								<div className={'welcome'}>Welcome to Live chat!</div>
							</Box>

							{messagesList.map((ele: MessagePayload, index: number) => {
								const { text, memberData } = ele;

								const memberImages = memberData?.memberImage
									? `${REACT_APP_API_URL}/${memberData.memberImage}`
									: '/img/profile/defaultUser.svg';

								const isMe = memberData?._id === user?._id;

								if (isMe) {
									return (
										<Box
											key={index}
											component={'div'}
											flexDirection={'row'}
											style={{ display: 'flex' }}
											alignItems={'flex-end'}
											justifyContent={'flex-end'}
											sx={{ m: '10px 0px' }}
										>
											<div className={'msg-right'}>{text}</div>
										</Box>
									);
								}

								return (
									<Box
										key={index}
										flexDirection={'row'}
										style={{ display: 'flex' }}
										sx={{ m: '10px 0px' }}
										component={'div'}
									>
										<Avatar
											alt={memberData?.memberNick || 'user'}
											src={memberImages}
										/>
										<div className={'msg-left'}>{text}</div>
									</Box>
								);
							})}
						</Stack>
					</ScrollableFeed>
				</Box>

				<Box className={'chat-bott'} component={'div'}>
					<input
						type={'text'}
						name={'message'}
						className={'msg-input'}
						placeholder={'Type message'}
						value={messageInput}
						onChange={getInputMessageHandler}
						onKeyDown={getKeyHandler}
					/>
					<button className={'send-msg-btn'} onClick={onClickHandler}>
						<SendIcon style={{ color: '#fff' }} />
					</button>
				</Box>
			</Stack>
		</Stack>
	);
};

export default Chat;
