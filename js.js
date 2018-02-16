function append(el, before = null) {
	document.body.insertBefore(el, before);
	return el;
}

function newEl(content, type = "div", autoAppend = true) {
	const el = document.createElement(type);
	if(content) el.textContent = content;
	return autoAppend ? append(el) : el;
}

function addText(content, align, size) {
	const el = newEl(content, "p");
	if(size) el.style["font-size"] = size;
	if(align) el.style["text-align"] = align;
	return append(el);
}

document.title = "👀";

newEl("@import url(\"https://fonts.googleapis.com/css?family=Supermercado+One\");@import url(\"https://fonts.googleapis.com/css?family=Inconsolata:700\");@import url(\"https://fonts.googleapis.com/css?family=Roboto+Mono\");body{font-family:\"Inconsolata\",monospace;line-height:18px;font-size:18px}a{text-decoration:none;border-bottom:1px solid;color:#88f}", "style");

const themes = {
	light: `body{background:#fff;color:#000}`,
	dark: `body{background:#002;color:#fff}`
}

const cdark = document.cookie.match(/dark=([01])/);
let dark = cdark ? cdark[1] === "1" : (document.cookie = `dark=1;expires=${new Date(Date.now() + 2419200000).toUTCString()}`, true);

const theme = newEl(themes[dark ? "dark" : "light"], "style");

const buttons = newEl();
buttons.style.position = "sticky";
buttons.style.top = "15px";
buttons.style.opacity = 0.3;
buttons.style["font-size"] = "20px";
buttons.style.cursor = "pointer";
buttons.style["-webkit-user-select"] = "none";
buttons.style.display = "inline-block";

let r, s = 0;
const pagebg = newEl("💡", "div", false);
pagebg.onclick = () => (theme.textContent = themes[++s < 50 ? ((dark = !dark) ? "dark" : "light") : s == 50 && setInterval(() => document.body.style.background = `hsl(${r ? --r : r = 360},100%,50%)`, 10) && "light"], document.cookie = `dark=${dark - 0};expires=${new Date(Date.now() + 2419200000).toUTCString()}`);
pagebg.style.display = "inline-block";
pagebg.title = "Toggle the lights";
buttons.appendChild(pagebg);

const home = newEl("🏠", "div", false);
home.onclick = () => load("home");
home.style.display = "inline-block";
home.title = "Back to home page";
home.style["margin-left"] = "10px";
buttons.appendChild(home);



let currPage = [];

function addPageContent(el) {
	currPage.push(el);
	return el;
}

function clearPage() {
	for(const el of currPage) el.parentNode.removeChild(el);
	currPage = [];
}

function pageEl(content, el) {
	return addPageContent(newEl(content, el));
}

function br(times) {
	if(times) for(let i = 0; i++ < times;) pageEl(null, "br");
	else return pageEl(null, "br");
}

function link(content, href) {
	const a = pageEl(content, "a");
	a.href = href;
	return a;
}

function tlink(...args) {
	const a = link(...args);
	a.style["font-size"] = "22px";
	return a;
}

function p(...args) {
	return addPageContent(addText(...args));
}

function pageLink(content, page) {
	const link = pageEl(content);
	link.onclick = () => load(page);
	link.style["text-decoration"] = "none";
	link.style["border-bottom"] = "1px solid";
	link.style.color = "#88f";
	link.style.display = "inline";
	link.style["font-size"] = "22px";
	link.style.cursor = "pointer";
	return link;
}

function codeblock(content) {
	const code = pageEl();
	let fl;
	for(const codeline of content.split("\n")) {
		fl = fl ? code.appendChild(br()) : true;
		code.appendChild(document.createTextNode(codeline));
	}
	code.style["background-color"] = "#000";
	code.style.color = "#fff";
	code.style.display = "inline-block";
	code.style["margin-left"] = "20px";
	code.style.padding = "10px";
	code.style["border-radius"] = "5px";
	code.style["font-family"] = "\"Roboto Mono\",monospace";
	code.style["line-height"] = "25px";
	return code;
}

function line(...args) {
	const el = p();
	for(const arg of args) el.appendChild(typeof arg === "string" ? document.createTextNode(arg) : arg);
	return el;
}

function load(page) {
	clearPage();
	const newScript = newEl(null, "script");
	newScript.onerror = () => load("404");
	newScript.src = `pages/${page}.js`;
	history.pushState(null, null, page === "home" ? "/" : `?${page}`);
	document.body.removeChild(newScript);
}

load(location.search.slice(1) || "home");