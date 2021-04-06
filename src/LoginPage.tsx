import React, { useState } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { TextField, Container, FormGroup } from "@material-ui/core";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import { getAuthToken } from "./Api";

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
	})
);

var username: string;
var password: string;

const LoginPage = ({ setToken }: any) => {
	const [credentialsAreValid, setCredentialsValid] = useState(true);
	const classes = useStyles();
	return (
		<Container maxWidth="sm">
			<Card className={classes.form} variant="outlined">
				<CardContent>
					<form
						className={classes.root}
						noValidate
						onSubmit={(evt) => {
							evt.preventDefault();
							let tmpToken = getAuthToken(username, password).then((token) => {
								if (!token) {
									setCredentialsValid(false);
								} else {
									setToken(token);
									setCredentialsValid(true);
								}
							});
						}}
					>
						<FormGroup>
							<TextField
								id="outlined-basic"
								label="Username"
								variant="outlined"
								autoComplete="false"
								onChange={(evt) => (username = evt.target.value)}
							/>
							<TextField
								id="outlined-basic"
								label="Password"
								variant="outlined"
								autoComplete="false"
								onChange={(evt) => (password = evt.target.value)}
							/>
							<Button variant="contained" color="primary" type="submit">
								Login
							</Button>
						</FormGroup>
					</form>
				</CardContent>
			</Card>
		</Container>
	);
};
export default LoginPage;
