import { writable } from 'svelte/store';

export type MessageSender = 'prospect' | 'bot' | 'agent';

export interface Message {
	id: string;
	text: string;
	sender: MessageSender;
	timestamp: string;
}

export interface Conversation {
	id: string;
	name: string;
	phone: string;
	email?: string;
	propertyId: string;
	propertyTitle?: string;
	lastMessage: string;
	messages: Message[];
	unread: boolean;
}

function createMessagesStore() {
	const stored: Conversation[] = [];

	if (typeof localStorage !== 'undefined') {
		const data = localStorage.getItem('localia_messages');
		if (data) {
			try {
				stored.push(...JSON.parse(data));
			} catch {
				stored.length = 0;
			}
		}
	}

	const { subscribe, set, update } = writable<Conversation[]>(stored);

	function persist(convs: Conversation[]) {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('localia_messages', JSON.stringify(convs));
		}
	}

	return {
		subscribe,

		addConversation(conv: Omit<Conversation, 'unread'>, silent = false): string {
			const newConv: Conversation = { ...conv, unread: false };
			let convId = '';
			update((convs) => {
				convs = [newConv, ...convs];
				convId = newConv.id;
				persist(convs);
				return convs;
			});

			if (silent) return convId;

			setTimeout(() => {
				update((convs) => {
					const conv = convs.find((c) => c.id === convId);
					if (!conv) return convs;

					const botMessage: Message = {
						id: Date.now().toString(),
						text: `¡Hola ${conv.name}! Soy ChePibe, el asistente de Localia. Recibí tu mensaje sobre la propiedad "${conv.propertyTitle || 'la propiedad'}". Un agente se comunicará con vos a la brevedad. ¿Hay algo más en lo que pueda ayudarte?`,
						sender: 'bot',
						timestamp: new Date().toLocaleTimeString('es-AR', {
							hour: '2-digit',
							minute: '2-digit'
						})
					};

					const updated = convs.map((c) =>
						c.id === convId
							? {
									...c,
									messages: [...c.messages, botMessage],
									lastMessage: botMessage.text
								}
							: c
					);
					persist(updated);
					return updated;
				});
			}, 2000);

			return convId;
		},

		addMessage(convId: string, msg: Omit<Message, 'id' | 'timestamp'>) {
			const timestamp = new Date().toLocaleTimeString('es-AR', {
				hour: '2-digit',
				minute: '2-digit'
			});
			const fullMsg: Message = { ...msg, id: Date.now().toString(), timestamp };
			update((convs) => {
				const updated = convs.map((c) =>
					c.id === convId
						? { ...c, messages: [...c.messages, fullMsg], lastMessage: fullMsg.text }
						: c
				);
				persist(updated);
				return updated;
			});
		},

		markRead(convId: string) {
			update((convs) => {
				const updated = convs.map((c) => (c.id === convId ? { ...c, unread: false } : c));
				persist(updated);
				return updated;
			});
		}
	};
}

export const messages = createMessagesStore();
