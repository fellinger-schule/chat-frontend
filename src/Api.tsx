var API_URL = "";

export async function getAuthToken(username: string, password: string) {
	const response = await fetch(`${API_URL}/user/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			username: username,
			password: password,
		}),
	});
	if (response.ok) {
		return response.text();
	} else {
		return "";
	}
}

export async function createRoom(auth: string, roomName: string) {
	const response = await fetch(`${API_URL}/room/addRoom`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${auth}`,
		},
		body: JSON.stringify({
			name: roomName,
		}),
	});
	return response.ok;
}

export async function getAllRooms(auth: string) {
	const response = await fetch(`${API_URL}/user/roomOverview`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${auth}`,
		},
	}).then((resp) => resp.json());
	return response;
}

export async function sendMessage(auth: string, roomId: number, message: string) {
	const response = await fetch(`${API_URL}/room/sendMessage`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${auth}`,
		},
		body: JSON.stringify({
			roomId: roomId,
			content: message,
		}),
	}).then((resp) => resp.ok);
	return response;
}

export async function getAllChatMessages(auth: string, roomId: number) {
	const response = await fetch(`${API_URL}/room/getMessages/${roomId}`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${auth}`,
		},
	}).then((resp) => resp.json());
	return response;
}

export async function getUserInfo(auth: string) {
	const response = await fetch(`${API_URL}/user/info`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${auth}`,
		},
	}).then((resp) => resp.json());
	return response;
}
