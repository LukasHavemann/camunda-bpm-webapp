'use strict';

var Base = require('./base');

module.exports = Base.extend({

  diagramElement: function() {
    return element(by.css('[cam-widget-bpmn-viewer]'));
  },

  instancesBadgeFor: function(activityName) {
    return element(by.css('.djs-overlays-'+activityName+' .badge[tooltip="Running Activity Instances"]'));
  },

  diagramActivity: function(activityName) {
    return element(by.css('*[data-element-id=' + '"' + activityName + '"' + ']'));
  },

  selectActivity: function(activityName) {
    this.diagramActivity(activityName).click();
  },

  deselectAll: function() {
    this.diagramElement().click();
  },

  isActivitySelected: function(activityName) {
    return this.diagramActivity(activityName).getAttribute('class').then(function(classes) {
      return classes.indexOf('highlight') !== -1;
    });
  },

  isActivityNotSelected: function(activityName) {
    return this.diagramActivity(activityName).getAttribute('class').then(function(classes) {
      return classes.indexOf('highlight') === -1;
    });
  }

});
