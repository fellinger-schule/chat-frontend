import React, { useEffect } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { Add } from "@material-ui/icons";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { IRoomOverview } from "./App";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		list: {
			width: "100%",
			overflowY: "hidden",
			overflowX: "scroll",
			backgroundColor: theme.palette.background.paper,
		},
		inline: {
			display: "inline",
		},
		addButton: {
			display: "flex",
			justifyContent: "center",
		},
	})
);

const RoomList = (props: any) => {
	const classes = useStyles();

	return (
		<List>
			{props["roomOverviewList"]
				.sort(
					(room1: IRoomOverview, room2: IRoomOverview) =>
						Date.parse(room2.lastMessageTimestamp.slice(0, -5)) -
						Date.parse(room1.lastMessageTimestamp.slice(0, -5))
				)
				.map((room: IRoomOverview) => (
					<>
						<ListItem
							alignItems="flex-start"
							button
							selected={props["activeRoomId"] == room.roomId}
							onClick={() => props["setActiveRoomId"](room.roomId)}
							onContextMenu={(evt) => {
								evt.preventDefault();
								props["setActiveRoomId"](room.roomId);
								props["onRightClick"](room.roomId);
							}}
						>
							<ListItemAvatar>
								<Avatar>{room.roomName[0].toUpperCase()}</Avatar>
							</ListItemAvatar>
							<ListItemText
								primary={room.roomName}
								secondary={
									<>
										<Typography
											component="span"
											variant="body2"
											className={classes.inline}
											color="textPrimary"
										>
											{room.lastMessageAuthorName || ""}
										</Typography>
										{" — " + room.lastMessageContent || ""}
									</>
								}
							/>
						</ListItem>
						<Divider />
					</>
				))}
			<ListItem
				button
				className={classes.addButton}
				onClick={() => props["setNewRoomModalOpen"](true)}
			>
				<Add />
			</ListItem>
			<Divider />
		</List>
	);
};
export default RoomList;
