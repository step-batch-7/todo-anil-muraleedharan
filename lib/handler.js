const { readFileSync, existsSync, statSync, writeFileSync } = require('fs');
const { App } = require('./app');
const querystring = require('querystring');
const CONTENT_TYPES = require('./mimeTypes');
const STATIC_FOLDER = `${__dirname}/../public`;
const statusCodes = { badRequest: 400, notFound: 404, redirecting: 303 };
const TODO_STORE = `${__dirname}/../data/todo.json`;

const getPreviousContents = TODO_STORE =>
  existsSync(TODO_STORE) ? JSON.parse(readFileSync(TODO_STORE, 'utf8')) : [];

const updateDatabase = tasksSet => {
  const { title, tasks } = querystring.parse(tasksSet);
  const parsedTasks = JSON.parse(tasks);

  const previousContents = getPreviousContents(TODO_STORE);
  const timeStamp = new Date().getTime();
  previousContents.push({ title, tasks: parsedTasks, timeStamp });
  writeFileSync(TODO_STORE, JSON.stringify(previousContents));
};

const updateDatabaseAndRedirect = (req, res) => {
  res.setHeader('Content-Type', CONTENT_TYPES.txt);
  updateDatabase(req.body);
  res.statusCode = statusCodes.redirecting;
  res.setHeader('location', '/index.html');
  res.end(JSON.stringify(getPreviousContents(TODO_STORE)));
};

const notFound = function(req, res) {
  res.setHeader('Content-Type', CONTENT_TYPES.txt);
  res.statusCode = statusCodes.notFound;
  res.end('notFound');
};

const methodNotAllowed = function(req, res) {
  console.log(req.body);

  res.setHeader('Content-Type', CONTENT_TYPES.txt);
  res.statusCode = statusCodes.badRequest;
  res.end('badRequest');
};

const isPathValid = path => {
  const stat = existsSync(path) && statSync(path);
  return !stat || !stat.isFile();
};

const isHomePath = path => path === '/';

const serveStaticFile = (req, res, next) => {
  if (isHomePath(req.url)) {
    req.url = '/index.html';
  }
  const path = `${STATIC_FOLDER}${req.url}`;
  if (isPathValid(path)) {
    return next();
  }
  const [, extension] = path.match(/.*\.(.*)$/);
  res.setHeader('Content-Type', CONTENT_TYPES[extension]);
  res.end(readFileSync(path));
};

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    req.body = data;
    next();
  });
};

const app = new App();
app.use(readBody);
app.get('', serveStaticFile);
app.post('/saveToDo', updateDatabaseAndRedirect);
app.get('', notFound);
app.post('', notFound);
app.use(methodNotAllowed);

module.exports = { app };