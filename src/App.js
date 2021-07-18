import React, { useState } from 'react';
import { Grid, Item, Button, Form, Container, Header } from 'semantic-ui-react';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import axios from 'axios';
import moment from 'moment';
import './App.css';

function App() {
	const URL = process.env.REACT_APP_GS_URL;
	const [list, setList] = useState([]);
	const [lastDate, setLastDate] = useState(null);
	const [days, setDays] = useState(0);
	const [currentDate, setNewDate] = useState(null);
	const onChange = (event, data) => setNewDate(data.value);

	const getList = () => {
		axios.get(URL)
			.then((response) => {
				console.log(response.data, response.data.length, response.data[response.data.length - 1].Date);
				setList(response.data.reverse());
				setLastDate(response.data[0].Date)
			});
	}

	React.useEffect(() => {
		getList();
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();

		var a = moment(currentDate);
		var b = moment(lastDate, "MM/DD/YY");
		const diffDays = a.diff(b, 'days') // 1
		setDays(diffDays)

		const objt = { Date: moment(currentDate).format("MM/DD/YY"), Days: diffDays };
		console.log("**** before submiting", objt)

		axios.post(URL, objt)
			.then((response) => {
				console.log(response);
				getList();
			});
	};

	return (
		<Container fluid className="container">
			<Grid columns={2} divided>
				<Grid.Row>
					<Grid.Column>
						<Header as="h2">Add TP Log</Header>
						<Form className="form">
							<Form.Field>
								<label>Date</label>
								<SemanticDatepicker format={'MM/DD/YY'} onChange={onChange} />
							</Form.Field>
							<Button color="blue" type="submit" onClick={handleSubmit}>
								Submit
							</Button>
						</Form>
					</Grid.Column>
					<Grid.Column>
						<Header as="h2">TP Logs</Header>
						<Item.Group>
							{list && list.map((item,index)=>(
								<Item key={index}>
									<Item.Content>
										<Item.Header>{item.Date}</Item.Header>
										<Item.Description>{item.Days}</Item.Description>
									</Item.Content>
								</Item>
							))}
						</Item.Group>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</Container>
	);
}

export default App;
