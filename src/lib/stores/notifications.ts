import { writable, derived } from 'svelte/store';

export interface AgentNotification {
	id: string;
	conversationId: string;
	propertyId: string;
	propertyTitle: string;
	prospectName: string;
	text: string;
	timestamp: string;
	read: boolean;
}

function createNotificationsStore() {
	const stored: AgentNotification[] = [];

	if (typeof localStorage !== 'undefined') {
		const data = localStorage.getItem('localia_agent_notifications');
		if (data) {
			try {
				stored.push(...JSON.parse(data));
			} catch {
				stored.length = 0;
			}
		}
	}

	const { subscribe, update } = writable<AgentNotification[]>(stored);

	function persist(notifs: AgentNotification[]) {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('localia_agent_notifications', JSON.stringify(notifs));
		}
	}

	return {
		subscribe,

		add(notif: Omit<AgentNotification, 'id' | 'timestamp' | 'read'>): string {
			const id = crypto.randomUUID();
			const timestamp = new Date().toLocaleTimeString('es-AR', {
				hour: '2-digit',
				minute: '2-digit'
			});
			const full: AgentNotification = { ...notif, id, timestamp, read: false };
			update((notifs) => {
				const updated = [full, ...notifs];
				persist(updated);
				return updated;
			});
			badgeVisible.set(true);
			return id;
		},

		markRead(id: string) {
			update((notifs) => {
				const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
				persist(updated);
				return updated;
			});
		},

		markAllRead() {
			update((notifs) => {
				const updated = notifs.map((n) => ({ ...n, read: true }));
				persist(updated);
				return updated;
			});
		},

		clearAvatarBadge() {
			badgeVisible.set(false);
		},

		setAvatarBadge(visible: boolean) {
			badgeVisible.set(visible);
		}
	};
}

const createBadgeStore = () => {
	let initial = false;
	if (typeof localStorage !== 'undefined') {
		const data = localStorage.getItem('localia_agent_badge_visible');
		if (data) {
			try {
				initial = JSON.parse(data);
			} catch {
				initial = false;
			}
		}
	}
	const { subscribe, set } = writable(initial);
	return {
		subscribe,
		set,
		setAndPersist: (v: boolean) => {
			set(v);
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem('localia_agent_badge_visible', JSON.stringify(v));
			}
		}
	};
};

export const notifications = createNotificationsStore();
export const badgeVisible = createBadgeStore();

export const unreadCount = derived(
	notifications,
	($notifications) => $notifications.filter((n) => !n.read).length
);

export const mostRecentUnread = derived(
	notifications,
	($notifications) => $notifications.find((n) => !n.read) ?? null
);
