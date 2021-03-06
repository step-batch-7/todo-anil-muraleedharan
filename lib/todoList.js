const { Todo } = require('./todo');
const numbers = { zero: 0, one: 1 };

const addTaskDetails = (tasks, todoId) => {
  let taskId = numbers.zero;
  const idAddedTasks = tasks.map(task => {
    taskId++;
    const taskSet = {};
    taskSet.id = `${todoId}-${taskId}`;
    taskSet.status = false;
    taskSet.content = task;
    return taskSet;
  });
  return idAddedTasks;
};

class TodoList {
  constructor() {
    this.todoList = [];
  }
  static load(dataBaseContents) {
    const newTodoLists = new TodoList();
    dataBaseContents.forEach(({ title, tasks, id, timeStamp }) =>
      newTodoLists.todoList.push(
        Todo.createNewTodo({ title, tasks, id, timeStamp })
      )
    );
    return newTodoLists;
  }
  get allTodo() {
    return this.todoList.slice();
  }
  toText() {
    return JSON.stringify(this.todoList);
  }
  generateId() {
    const zero = 0;
    const prevId = this.todoList[zero] ? this.todoList[zero].id : zero;
    return prevId + numbers.one;
  }
  findTodo(todoId) {
    return this.todoList.find(todo => todo.id === +todoId);
  }
  addTodo(title, tasks, timeStamp, id = this.generateId()) {
    this.todoList.unshift(
      Todo.createNewTodo({
        title,
        tasks: addTaskDetails(tasks, id),
        id,
        timeStamp
      })
    );
  }
  deleteTodo(todoId) {
    const matchingElement = this.findTodo(todoId);
    const todoPosition = this.todoList.indexOf(matchingElement);
    const numOne = numbers.one;
    this.todoList.splice(todoPosition, numOne);
  }
  insertTask(todoId, task) {
    const todo = this.findTodo(todoId);
    todo.insertTask(task);
  }
  deleteTask(todoId, taskId) {
    const todo = this.findTodo(todoId);
    todo.deleteTask(taskId);
  }
  updateTaskStatus(todoId, taskId) {
    const todo = this.findTodo(todoId);
    todo.updateTaskStatus(taskId);
  }
  editTitle(todoId, title) {
    const todo = this.findTodo(todoId);
    todo.editTitle(title);
  }
  editTask(todoId, taskId, task) {
    const todo = this.findTodo(todoId);
    todo.editTask(taskId, task);
  }
}

module.exports = { TodoList };
