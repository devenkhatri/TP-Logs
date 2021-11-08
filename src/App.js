import React, { useState, useCallback } from 'react';
import { Grid, Button, Form, Container, Header, Label, Table, GridColumn, Loader } from 'semantic-ui-react';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import axios from 'axios';
import moment from 'moment';
import './App.css';
import useGoogleSheets from 'use-google-sheets';

function App() {
	const URL = process.env.REACT_APP_GS_URL;	
	const [list, setList] = useState([]);
	const [lastDate, setLastDate] = useState(null);
	const [days, setDays] = useState(0);
	const [currentDate, setNewDate] = useState(null);
	const onChange = (event, data) => setNewDate(data.value);
	const { data } = useGoogleSheets({
		apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
		sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID,
		sheetsNames: ['H'],
	  });
	  const [loaded, setLoaded] = useState(false);

	const getList = useCallback(() => {
		if(data && data.length>0){
			const mainData = data[0].data.reverse().slice(0, 5)
			setList(mainData);
			setLastDate(mainData[0].Date);
			setLoaded(true);
			// axios.get(URL)
			// 	.then((response) => {
			// 		// console.log(response.data, response.data.length, response.data[response.data.length - 1].Date);
			// 		setList(response.data.reverse().slice(0, 5));
			// 		setLastDate(response.data[0].Date)
			// 		setLoaded(true);
			// 	});		
		}
	}, [data])

	React.useEffect(() => {		
		getList();
	},[data, getList]);

	const handleSubmit = (e) => {
		e.preventDefault();

		setLoaded(false);

		var a = moment(currentDate);
		var b = moment(lastDate, "MM/DD/YY");
		const diffDays = a.diff(b, 'days') // 1
		setDays(diffDays)

		const objt = { Date: moment(currentDate).format("MM/DD/YY"), Days: diffDays };
		console.log("**** before submiting", objt, days)

		axios.post(URL, objt)
			.then((response) => {
				console.log(response);
				getList();
			});
	};

	return (
		<Container fluid className="container">
			<Grid stackable divided='vertically'>
				<Grid.Row columns={2}>
					<GridColumn>
						<Header as="h1">Add TP Log</Header>
					</GridColumn>
					<GridColumn>
						<Form className="form">
							<Form.Field>
								<label>Date</label>
								<SemanticDatepicker format={'MM/DD/YY'} onChange={onChange} />
							</Form.Field>
							<Button color="blue" type="submit" onClick={handleSubmit}>
								Submit
							</Button>
						</Form>
					</GridColumn>
				</Grid.Row>
				{!loaded &&
					<Grid.Row>
						<Loader active inline='centered'>Processing...</Loader>
					</Grid.Row>
				}
				<Grid.Row>
					<GridColumn>
						<Header as="h1">Past TP Logs</Header>
						<Table celled color={'blue'}>
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell>Date</Table.HeaderCell>
									<Table.HeaderCell>Different</Table.HeaderCell>
								</Table.Row>
							</Table.Header>

							<Table.Body>
								{list && list.map((item, index) => (
									<Table.Row key={index}>
										<Table.Cell>
											<Label>{moment(item.Date).format("DD-MMM-YYYY")}</Label>
										</Table.Cell>
										<Table.Cell>{item.Days}</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table>
					</GridColumn>
				</Grid.Row>
			</Grid>
		</Container>
	);
}

export default App;
