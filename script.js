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
			anchor.setAttribute('href', './index.html');
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

function updateEventList(sort = 'default') {
	const eventList = document.getElementById('eventList');
	if (eventList) {
		const data = localStorage.getItem('data');
		if ((typeof data) !== 'string') return;
		const events = JSON.parse(data);

		eventList.innerHTML = '';

		let sortedEvents;
		switch (sort) {
			case 'date':
				sortedEvents = events.toSorted((a, b) => {
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
				sortedEvents = events.toSorted((a, b) => a.name.localeCompare(b.name));
				break;
			case 'participants':
				sortedEvents = events.toSorted((a, b) => a.participants.length - b.participants.length);
				break;
			default:
				sortedEvents = events;
		};

		for (let evt of sortedEvents) {
			const listElement = document.createElement('li');
			listElement.innerHTML = `<a href='./event.html' class='eventName'>${evt.name}</a> <span class='eventDate'>${evt.date}</span> <span class='eventParticipants'>${evt.participants.length}</span>`;
			listElement.addEventListener('click', e => {
				if (e.target.tagName !== 'A') return;
				localStorage.setItem('event', evt.name);
			});
			eventList.appendChild(listElement);
		};
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
		const description = document.createElement('p');
		description.innerText = event.description;

		eventPage.appendChild(header);
		eventPage.appendChild(description);
	};
};

function render() {
	updateNav();
	updateEventPage();
	updateEventList();

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
