import React, { useState, useEffect } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Send } from "@material-ui/icons";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import RoomList from "./RoomList";
import LoginPage from "./LoginPage";
import MessageWindow from "./MessageWindow";
import {
	createRoom,
	getAllChatMessages,
	getAllRooms,
	sendMessage,
	getUserInfo,
	addUserToRoom,
} from "./Api";
import "./App.css";

import { Button } from "@material-ui/core";

var authToken: string;
var newRoomName: string;
var newUsernameToBeAddedToRoom: string;
const drawerWidth = 300;

export interface IRoomOverview {
	roomId: number;
	roomName: string;
	lastMessageAuthorName?: string;
	lastMessageContent?: string;
	lastMessageTimestamp: string;
}

export interface IChatMessage {
	authorId: number;
	authorName: string;
	timestamp: Date;
	content: string;
}

export interface IUserInfo {
	userId: number;
	username: string;
	name: string;
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: "flex",
		},
		appBar: {
			width: `calc(100% - ${drawerWidth}px)`,
			marginRight: drawerWidth,
		},
		drawer: {
			width: drawerWidth,
			flexShrink: 0,
		},
		drawerPaper: {
			width: drawerWidth,
		},
		content: {
			flexGrow: 1,
			backgroundColor: theme.palette.background.default,
			padding: theme.spacing(3),
		},
	})
);

function App() {
	const classes = useStyles();
	const [isLoggedIn, setLoggedIn] = useState(false);
	const [currentUserInfo, setCurrentUserInfo] = useState({} as IUserInfo);
	const [isNewRoomModalOpen, setNewRoomModalOpen] = useState(false);
	const [isAddUserToGroupModalOpen, setAddUserToGroupModalOpen] = useState(false);
	const [roomOverviewList, setRoomOverviewlist] = useState([] as IRoomOverview[]);
	const [activeRoomId, setActiveRoomId] = useState(-1);
	const [chatMessages, setChatMessages] = useState([] as IChatMessage[]);

	function setToken(token: string) {
		if (token) {
			authToken = token;
			setLoggedIn(true);
			fetchAllRooms();
			//Get info about the user
			getUserInfo(authToken).then((data) => setCurrentUserInfo(data));
		}
	}

	function fetchAllRooms() {
		getAllRooms(authToken).then((data) => setRoomOverviewlist(data));
	}

	function handleCreateNewRoom(roomname: string) {
		createRoom(authToken, roomname).then((isOk) => {
			if (isOk) {
				fetchAllRooms();
				setNewRoomModalOpen(false);
			}
		});
	}

	function fetchChatMessages(roomId: number) {
		console.log("Fetching messages...", roomId);
		if (roomId > 0) getAllChatMessages(authToken, roomId).then((data) => setChatMessages(data));
	}

	function handleSendMessage(message: string) {
		sendMessage(authToken, activeRoomId, message).then((isOk) => {
			if (isOk) {
				fetchChatMessages(activeRoomId);
			}
		});
	}

	function handleCurrentRoomId(roomId: number) {
		setActiveRoomId(roomId);
		fetchChatMessages(roomId);
	}

	function handleRoomContextMenuOpen(roomId: number) {
		setAddUserToGroupModalOpen(true);
	}

	function handleAddUserToRoom(roomId: number, username: string) {
		addUserToRoom(authToken, username, roomId);
	}

	useEffect(() => {
		const timer = setInterval(() => {
			fetchChatMessages(activeRoomId);
			fetchAllRooms();
		}, 2000);
		return () => clearInterval(timer);
	});

	return isLoggedIn ? (
		<div className={classes.root}>
			<CssBaseline />
			<Drawer
				className={classes.drawer}
				variant="permanent"
				classes={{
					paper: classes.drawerPaper,
				}}
				anchor="left"
			>
				<RoomList
					setNewRoomModalOpen={setNewRoomModalOpen}
					roomOverviewList={roomOverviewList}
					setActiveRoomId={handleCurrentRoomId}
					activeRoomId={activeRoomId}
					sendMessage={handleSendMessage}
					onRightClick={handleRoomContextMenuOpen}
				/>
			</Drawer>
			<main className={classes.content}>
				{activeRoomId !== -1 ? (
					<MessageWindow
						chatMessages={chatMessages}
						sendMessage={handleSendMessage}
						currentUserInfo={currentUserInfo}
					/>
				) : (
					""
				)}
			</main>
			<Dialog open={isNewRoomModalOpen} aria-labelledby="form-dialog-title">
				<form
					onSubmit={(evt) => {
						evt.preventDefault();
						handleCreateNewRoom(newRoomName);
						setAddUserToGroupModalOpen(false);
					}}
				>
					<DialogTitle id="form-dialog-title">Create new Room</DialogTitle>
					<DialogContent>
						<DialogContentText>
							To continue, please enter what your room should be named like
						</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							id="name"
							label="Room name"
							fullWidth
							onChange={(evt) => (newRoomName = evt.target.value)}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setNewRoomModalOpen(false)} color="primary">
							Cancel
						</Button>
						<Button type="submit" color="primary">
							Accept
						</Button>
					</DialogActions>
				</form>
			</Dialog>
			<Dialog open={isAddUserToGroupModalOpen} aria-labelledby="form-dialog-title">
				<form
					onSubmit={(evt) => {
						evt.preventDefault();
						handleAddUserToRoom(activeRoomId, newUsernameToBeAddedToRoom);
						setAddUserToGroupModalOpen(false);
					}}
				>
					<DialogTitle id="form-dialog-title">Add user to room</DialogTitle>
					<DialogContent>
						<DialogContentText>
							To continue, please enter the username of the new group member
						</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							id="name"
							label="Username"
							fullWidth
							onChange={(evt) => (newUsernameToBeAddedToRoom = evt.target.value)}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setAddUserToGroupModalOpen(false)} color="primary">
							Cancel
						</Button>
						<Button color="primary" type="submit">
							Accept
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</div>
	) : (
		<LoginPage setToken={setToken} />
	);
}

export default App;
