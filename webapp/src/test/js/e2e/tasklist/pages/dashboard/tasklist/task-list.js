'use strict';

var Page = require('./../dashboard-view');

module.exports = Page.extend({

  formElement: function() {
    return element(by.css('[cam-tasks]'));
  },

  taskList: function() {
    return this.formElement().all(by.repeater('(delta, task) in tasks'));
  },

  taskListInfoText: function() {
    return this.formElement().getText();
  },

  selectTask: function(item) {
    this.taskList().get(item).element(by.binding('task.name')).click();
  },

  taskName: function(item) {
    return this.taskList().get(item).element(by.binding('task.name')).getText();
  },

  taskProcessDefinitionName: function(item) {
    return this.taskList().get(item).element(by.binding('task._embedded.processDefinition[0].name')).getText();
  },

  taskPriority: function(item) {
    return this.taskList().get(item).element(by.binding('task.priority')).getText();
  },

  taskCreated: function(item) {
    return this.taskList().get(item).element(by.binding('task.created')).getText();
  },

  taskAssignee: function(item) {
    return this.taskList().get(item).element(by.binding('task.assignee')).getText();
  },

  taskVariables: function(taskItem) {
    return this.taskList().get(taskItem).all(by.repeater('(delta, info) in variableDefinitions'));
  },

  taskVariableNameElement: function(taskItem, variableItem) {
    browser.actions().mouseMove(this.taskVariables(taskItem).get(variableItem).element(by.css('.variable-label'))).perform();

    browser.sleep(1000);

    return this.taskVariables(taskItem).get(variableItem).element(by.css('.variable-label')).getAttribute('tooltip');
  },

  taskVariableName: function(taskItem, variableItem) {
    return this.taskVariableNameElement(taskItem, variableItem);
  },

  taskVariableLabel: function(taskItem, variableItem) {
    return this.taskVariables(taskItem).get(variableItem).element(by.css('.variable-label'));
  },

  taskVariableValue: function(taskItem, variableItem) {
    return this.taskVariables(taskItem).get(variableItem).element(by.css('.variable-value'));
  }

});
