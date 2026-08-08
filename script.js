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
		participants: ["Alice"]
	},
	{
		name: "Open Lecture: Statistics and AI",
		description: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Consectetur adipiscing elit quisque faucibus ex sapien vitae. Ex sapien vitae pellentesque sem placerat in id. Placerat in id cursus mi pretium tellus duis.",
		organiser: "John Smith",
		participants: ["Alice", "Bob"]
	},
	{
		name: "Rust Study Group",
		description: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Consectetur adipiscing elit quisque faucibus ex sapien vitae. Ex sapien vitae pellentesque sem placerat in id.",
		organiser: "John Smith",
		participants: ["Alice", "Bob", "Charlie"]
	},
	{
		name: "Linux Installation Party",
		description: "Consectetur adipiscing elit quisque faucibus ex sapien vitae. Ex sapien vitae pellentesque sem placerat in id. Placerat in id cursus mi pretium tellus duis. Pretium tellus duis convallis tempus leo eu aenean.",
		organiser: "John Smith",
		participants: ["Alice", "Bob", "Charlie", "Eve"]
	},
	{
		name: "Semester Closing Party",
		description: "Ex sapien vitae pellentesque sem placerat in id. Placerat in id cursus mi pretium tellus duis. Pretium tellus duis convallis tempus leo eu aenean.",
		organiser: "Mary Tyler",
		participants: ["Alice", "Bob", "Charlie", "Eve", "Mallory"]
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
	const loggedIn = (typeof localStorage.getItem('login')) === 'string';
	if (navList) {
		const anchor = document.createElement('a');
		if (loggedIn) {
			anchor.innerText = 'Sign Out';
			anchor.setAttribute('href', './index.html');
			anchor.addEventListener('click', () => {
				localStorage.removeItem('login');
			});
		} else {
			anchor.innerText = 'Sign In';
			anchor.setAttribute('href', './signin.html');
		};
		navList.innerHTML = '';
		navList.appendChild(anchor);
	};
};

function updateEventList() {
	const eventList = document.getElementById('eventList');
	if (eventList) {
		eventList.innerHTML = '';
		for (evt of defaultEvents) {
			const listElement = document.createElement('li');
			listElement.innerText = evt.name;
			eventList.appendChild(listElement);
		};
	};
};

function render() {
	updateNav();
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
