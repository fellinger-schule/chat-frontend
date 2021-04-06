import React, { useState } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { IChatMessage, IUserInfo } from "./App";
import SendIcon from "@material-ui/icons/Send";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Fab from "@material-ui/core/Fab";
import TextField from "@material-ui/core/TextField";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: "100%",
			maxWidth: "36ch",
			backgroundColor: theme.palette.background.paper,
		},
		inline: {
			display: "inline",
		},
		form: {
			"& .MuiTextField-root": {
				margin: theme.spacing(1),
				width: "25ch",
			},
		},
		messageList: {
			width: "fit-content",
			border: `1px solid ${theme.palette.divider}`,
			borderRadius: theme.shape.borderRadius,
			backgroundColor: theme.palette.background.paper,
			color: theme.palette.text.secondary,
			overflowX: "hidden",
		},
		messageBar: {
			padding: "20px",
			border: `1px solid ${theme.palette.divider}`,
			borderRadius: theme.shape.borderRadius,
			backgroundColor: theme.palette.background.paper,
			color: theme.palette.text.secondary,
		},
		messageItem: {},
	})
);

const MessageWindow = (props: any) => {
	const [messageBarContent, setMessageBarContent] = useState("");
	const classes = useStyles();
	return (
		<>
			{props["chatMessages"].map((message: IChatMessage) => (
				<Box
					display="flex"
					justifyContent={
						props["currentUserInfo"].id !== message.authorId ? "flex-start" : "flex-end"
					}
					m={1}
					p={1}
				>
					<ListItem alignItems="flex-start" className={classes.messageList}>
						{props["currentUserInfo"].id !== message.authorId ? (
							<>
								<ListItemAvatar>
									<Avatar>{message.authorName[0] || ""}</Avatar>
								</ListItemAvatar>
								<ListItemText primary={message.authorName} secondary={message.content} />
							</>
						) : (
							<ListItemText secondary={message.content} />
						)}
					</ListItem>
				</Box>
			))}
			<form
				onSubmit={(evt) => {
					evt.preventDefault();
					props["sendMessage"](messageBarContent);
					setMessageBarContent("");
				}}
			>
				<Grid container className={classes.messageBar}>
					<Grid item xs={11}>
						<TextField
							id="outlined-basic-email"
							label="Type Something"
							fullWidth
							value={messageBarContent}
							onChange={(evt) => setMessageBarContent(evt.target.value)}
						/>
					</Grid>
					<Grid xs={1}>
						<Fab color="primary" aria-label="add" type="submit">
							<SendIcon />
						</Fab>
					</Grid>
				</Grid>
			</form>
		</>
	);
};
export default MessageWindow;
