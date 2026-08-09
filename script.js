const userList = [
	{ name: "Alice", role: "student" },
	{ name: "Bob", role: "student" },
	{ name: "Charlie", role: "student" },
	{ name: "Dave", role: "student" },
	{ name: "Eve", role: "student" },
	{ name: "Mallory", role: "student" },
	{ name: "Walter", role: "student" },
	{ name: "John Smith", role: "organiser" },
	{ name: "Jane Gray", role: "organiser" },
	{ name: "Sarah Schwarz", role: "organiser" },
	{ name: "John Doe", role: "organiser" },
	{ name: "Mary Tyler", role: "organiser" }
];

const defaultEvents = [
	{
		name: "WebDev Workshop",
		description: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Consectetur adipiscing elit quisque faucibus ex sapien vitae. Ex sapien vitae pellentesque sem placerat in id. Placerat in id cursus mi pretium tellus duis. Pretium tellus duis convallis tempus leo eu aenean.",
		organiser: "John Smith",
		participants: [],
		date: "01.07.2027"
	},
	{
		name: "Open Lecture: Statistics and AI",
		description: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Consectetur adipiscing elit quisque faucibus ex sapien vitae. Ex sapien vitae pellentesque sem placerat in id. Placerat in id cursus mi pretium tellus duis.",
		organiser: "John Smith",
		participants: ["Alice", "Dave"],
		date: "03.07.2026"
	},
	{
		name: "Rust Study Group",
		description: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Consectetur adipiscing elit quisque faucibus ex sapien vitae. Ex sapien vitae pellentesque sem placerat in id.",
		organiser: "John Smith",
		participants: ["Alice", "Bob", "Charlie"],
		date: "13.07.2026"
	},
	{
		name: "Linux Installation Party",
		description: "Consectetur adipiscing elit quisque faucibus ex sapien vitae. Ex sapien vitae pellentesque sem placerat in id. Placerat in id cursus mi pretium tellus duis. Pretium tellus duis convallis tempus leo eu aenean.",
		organiser: "John Smith",
		participants: ["Alice", "Bob", "Charlie", "Eve"],
		date: "31.07.2026"
	},
	{
		name: "Semester Closing Party",
		description: "Ex sapien vitae pellentesque sem placerat in id. Placerat in id cursus mi pretium tellus duis. Pretium tellus duis convallis tempus leo eu aenean.",
		organiser: "Mary Tyler",
		participants: ["Alice", "Bob", "Charlie", "Eve", "Mallory"],
		date: "01.09.2026"
	},
];

function login(name) {
	if (typeof localStorage.getItem('login') === 'string') {
		console.error('Already logged in');
		return;
	};
	for (const user of userList) {
		if (user.name === name) {
			localStorage.setItem('login', name);
			return;
		};
	};
	console.error(`User '${name}' not found`);
};

function logout() {
	localStorage.removeItem('login');
};

function updateLogin(id, role) {
	const loginList = document.getElementById(id);
	if (loginList) {
		loginList.addEventListener('click', e => {
			if (e.target.tagName !== 'A') return;
			login(e.target.innerText);
		});
		loginList.innerHTML = '';
		userList.filter(u => u.role === role).forEach(user => {
			const listElement = document.createElement('li');
			const anchor = document.createElement('a');
			anchor.setAttribute('href', './myevents.html');
			anchor.innerText = user.name;
			listElement.appendChild(anchor);
			loginList.appendChild(listElement);
		});
	};

};

function updateNav() {
	const navList = document.getElementById('navList');

	if (navList) {
		navList.innerHTML = '';

		const user = localStorage.getItem('login');
		const loggedIn = (typeof user === 'string');

		if (loggedIn) {
			const myEvents = document.createElement('a');
			myEvents.innerText = 'My Events';
			myEvents.setAttribute('href', './myevents.html');
			navList.appendChild(myEvents);
		};

		const signInOut = document.createElement('a');
		if (loggedIn) {
			signInOut.innerText = 'Sign Out';
			signInOut.setAttribute('href', './index.html');
			signInOut.addEventListener('click', () => {
				localStorage.removeItem('login');
			});
		} else {
			signInOut.innerText = 'Sign In';
			signInOut.setAttribute('href', './signin.html');
		};
		navList.appendChild(signInOut);
	};
};

function generateEventList(events, sort, filter) {
	let filteredEvents;
	const login = localStorage.getItem('login');
	if (!filter || (typeof login !== 'string')) {
		filteredEvents = events;
	} else {
		if (userList.find(u => u.name === login).role === 'student') {
			filteredEvents = events.filter(e => e.participants.includes(login));
		} else {
			filteredEvents = events.filter(e => e.organiser === login);
		}
	}

	let sortedEvents;
	switch (sort) {
		case 'date':
			sortedEvents = filteredEvents.toSorted((a, b) => {
				const aDate = a.date.split('.').map(str => Number(str));
				const bDate = b.date.split('.').map(str => Number(str));

				const year = aDate[2] - bDate[2];
				if (year != 0) return year;

				const month = aDate[1] - bDate[1];
				if (month != 0) return month;

				return aDate[0] - bDate[0];
			});
			break;
		case 'name':
			sortedEvents = filteredEvents.toSorted((a, b) => a.name.localeCompare(b.name));
			break;
		case 'participants':
			sortedEvents = filteredEvents.toSorted((a, b) => b.participants.length - a.participants.length);
			break;
		default:
			sortedEvents = filteredEvents;
	};

	return sortedEvents.map(evt => {
		const listElement = document.createElement('li');
		listElement.innerHTML = `<a href='./event.html' class='eventName'>${evt.name}</a> <span class='eventDate'>${evt.date}</span> <span class='eventParticipants'>${evt.participants.length}</span>`;
		listElement.addEventListener('click', e => {
			if (e.target.tagName !== 'A') return;
			localStorage.setItem('event', evt.name);
		});
		return listElement;
	});
};

function updateEventList(sort = 'default') {
	const eventList = document.getElementById('eventList');
	if (eventList) {
		const data = localStorage.getItem('data');
		if ((typeof data) !== 'string') return;
		const events = JSON.parse(data);

		eventList.innerHTML = '';

		generateEventList(events, sort, false).forEach(e => {
			eventList.appendChild(e);
		});
	};
};

function updateFilteredEventList(sort = 'default') {
	const eventList = document.getElementById('filteredEventList');
	if (eventList) {
		const data = localStorage.getItem('data');
		if ((typeof data) !== 'string') return;
		const events = JSON.parse(data);

		eventList.innerHTML = '';

		generateEventList(events, sort, true).forEach(e => {
			eventList.appendChild(e);
		});
	};
};

function addListControl() {
	const listControl = document.getElementById('listControl');
	if (listControl) {
		listControl.addEventListener('change', e => {
			updateEventList(e.target.value);
			updateFilteredEventList(e.target.value);
		});
	};
};

function updateEventPage() {
	const eventPage = document.getElementById('eventPage');
	if (eventPage) {
		const data = localStorage.getItem('data');
		if (typeof data !== 'string') return;

		const eventName = localStorage.getItem('event');
		if (typeof eventName !== 'string') return;

		const events = JSON.parse(data);
		const event = events.find(e => eventName === e.name);
		if (!event) return;

		eventPage.innerHTML = '';

		const header = document.createElement('h2')
		header.innerText = event.name;
		eventPage.appendChild(header);

		const description = document.createElement('p');
		description.innerText = event.description;
		eventPage.appendChild(description);

		const organiser = document.createElement('p');
		organiser.innerText = `Organised by ${event.organiser}`
		eventPage.appendChild(organiser);

		const login = localStorage.getItem('login');
		if (typeof login === 'string') {
			const studentStatus = userList.find(u => u.name === login).role === 'student';
			if (studentStatus) {
				const registered = event.participants.includes(login);
				const registerBtn = document.createElement('button');
				registerBtn.innerText = registered ? 'Unregister' : 'Register';
				registerBtn.addEventListener('click', () => {
					const idx = event.participants.indexOf(login);
					if (idx != -1) { // unregister
						event.participants.splice(idx, 1);
					} else { // register
						event.participants.push(login);
					}
					localStorage.setItem('data', JSON.stringify(events));
					updateEventPage();
				});
				eventPage.appendChild(registerBtn);
			} else {
				const organiser = event.organiser === login;
				if (organiser) {
					const participants = document.createElement('p')
					participants.innerText = 'Participants:'
					eventPage.appendChild(participants);

					const studentList = document.createElement('ul');
					for (let student of event.participants) {
						const studentElement = document.createElement('li');
						studentElement.innerText = student;
						studentList.appendChild(studentElement);
					};
					eventPage.appendChild(studentList);
				}
			};

		};
	};
};

function render() {
	updateNav();
	addListControl();
	updateEventList('date');
	updateFilteredEventList('date');
	updateEventPage();

	updateLogin('studentBtnList', 'student');
	updateLogin('orgBtnList', 'organiser');
};

const resetDataBtn = document.getElementById('mockBtn');
if (resetDataBtn) {
	resetDataBtn.addEventListener('click', () => {
		localStorage.setItem('data', JSON.stringify(defaultEvents));
		render();
	});
};

render();
