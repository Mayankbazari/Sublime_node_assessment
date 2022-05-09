const express = require("express");
const {
	body
} = require("express-validator"); //used for validation
const _ = require('lodash');

const app = express();
app.use(express.json());

const customer = [{
		id: 1,
		first_name: "Aman",
		last_name: "Gupta",
		city: "Ahmedabad",
		company: "SublimeDataSystems",
	},
	{
		id: 2,
		first_name: "Ashner",
		last_name: "Grover",
		city: "Ahmedabad",
		company: "SublimeDataSystems",
	},
	{
		id: 3,
		first_name: "peyush",
		last_name: "Bansal",
		city: "Ahmedabad",
		company: "SublimeDataSystems",
	},
	{
		id: 5,
		first_name: "mayank",
		last_name: "Bazari",
		city: "Beawer",
		company: "SublimeDataSystems",
	},
];

// Home Page
app.get("/", (req, res) => {
	res.send("Welcome to Assigment By Mayank Bazari");
});

// Get Customer by Id
app.get("/customer/:id", async (req, res) => {
	const _id = req.params.id;
	try {
		const user = await customer.find((cust) => cust.id == _id);
		res.send(user);
	} catch (e) {
		res.status(500).send(e);
	}
});

// GET API for  search by first_name, last_name and city
// Defualt pagination size 10
app.get("/customer", async (req, res) => {
	const first_name = req.query.first_name || "";
	const last_name = req.query.last_name || "";
	const city = req.query.city || "";
	const page_number = parseInt(req.query.page) || 0;
	const page_size = 10;
	let result;
	console.log(first_name, last_name, city);
	if (first_name || last_name || city) {
		result = customer.filter((cust) => {
			return (
				cust.first_name.toLowerCase() === first_name.toLowerCase() ||
				cust.last_name.toLowerCase() === last_name.toLowerCase() ||
				cust.city.toLowreerCase() === city.toLowerCase()
			);
		});
	} else {
		result = customer;
	}
	if (result) {
		res.send(result.slice(page_size * page_number, page_size));
	} else {
		res.send("customer not found");
	}
});

app.get("/city", async (req, res) => {
	const _id = req.params.id;
	try {
		// const user = await customer.find((cust) => cust.id == _id);
		const result = _.values(_.groupBy(customer)).map(cust => ({
			city: cust[0].city,
			count: cust.length
		}));

		res.send(result);
	} catch (e) {
		res.status(500).send(e);
	}
});

// API for creating customer!!
app.post(
	"/customer",
	[
		body("first_name").notEmpty(),
		body("last_name").notEmpty(),
		body("city").notEmpty(),
	],
	async (req, res) => {
		const body = req.body;
		customer.push(body);
		res.send(customer);
	}
);

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));