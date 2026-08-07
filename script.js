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
		navList.appendChild(anchor);
	};
};

function render() {
	updateNav();

	updateLogin('studentBtnList', 'student');
	updateLogin('orgBtnList', 'organiser');
};

render();
