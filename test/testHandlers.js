const request = require('supertest');
const { app } = require('../lib/handler');

describe('GET', () => {
  it('should give homepage on "/" req', done => {
    request(app.serve.bind(app))
      .get('/')
      .expect(200, done)
      .expect('Content-Type', 'text/html');
  });

  it('should give css for /style.css', done => {
    request(app.serve.bind(app))
      .get('/style.css')
      .expect(200, done)
      .expect('Content-Type', 'text/css');
  });

  it('should fetch all todo content on /getTodoLists', done => {
    request(app.serve.bind(app))
      .get('/getTodoLists')
      .expect(200, done)
      .expect('Content-Type', 'application/json');
  });

  it('should return an error: page not found on /badUrl', done => {
    request(app.serve.bind(app))
      .get('/badUrl')
      .expect(404, done)
      .expect(/pageNotFound/)
      .expect('Content-Type', 'text/plain');
  });
});

describe('POST', () => {
  it('should save the new todo on /saveTodo', done => {
    request(app.serve.bind(app))
      .post('/saveTodo')
      .send('{ "title" : "HomeWork", "tasks" : [ "Physics", "Maths" ] }')
      .expect(200, done)
      .expect('Content-Type', 'application/json');
  });

  it('should toggle the status of the task on /updateTaskStatus', done => {
    request(app.serve.bind(app))
      .post('/updateTaskStatus')
      .send('{ "todoId" : 1, "taskId" : "1-1" }')
      .expect(200, done)
      .expect('Content-Type', 'application/json');
  });

  it('should insert a task on /insertTask', done => {
    request(app.serve.bind(app))
      .post('/insertTask')
      .send('{ "todoId" : 1, "taskContent" : "Maths" }')
      .expect(200, done)
      .expect('Content-Type', 'application/json');
  });

  it('should delete a task on /deleteTask', done => {
    request(app.serve.bind(app))
      .post('/deleteTask')
      .send('{ "todoId" : 1, "taskId" : "1-2" }')
      .expect(200, done)
      .expect('Content-Type', 'application/json');
  });

  it('should delete the todo on /deleteTodo', done => {
    request(app.serve.bind(app))
      .post('/deleteTodo')
      .send('{ "todoId" : 1 }')
      .expect(200, done)
      .expect('Content-Type', 'application/json');
  });

  it('should give an error pageNotFound with status code 404', done => {
    request(app.serve.bind(app))
      .post('/badRequest')
      .expect(404, done)
      .expect('Content-Type', 'text/plain')
      .expect(/pageNotFound/);
  });
});

describe('PUT', () => {
  it('should give an error badRequest with status code 400', done => {
    request(app.serve.bind(app))
      .put('/badRequest')
      .expect(400, done)
      .expect('Content-Type', 'text/plain')
      .expect(/badRequest/);
  });
});