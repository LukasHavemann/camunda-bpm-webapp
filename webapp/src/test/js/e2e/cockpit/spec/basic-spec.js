//  - Login Page
//        |
//        v  login
//  - Dashboard View
//        |
//        v  select Process Defintion (CallingCallActivity)
//  - Process Defintion View
//    - Called Process Definitions tab
//        |
//        v  open Called Process (CallActivity)
//    - Called Process Definitions tab
//        |
//        v  switch tab
//    - Job Definitions tabs
//        |
//        v  switch tab
//    - Process Instances tabs
//        |
//        v  select instance
//  - Process Instance View

'use strict';

var dashboardPage = require('../pages/dashboard');
var processDefinitionPage = require('../pages/process-definition');
var processInstancePage = require('../pages/process-instance');

describe('cockpit - ', function() {

  describe('start test', function () {

    it('should login', function () {

      // when
      dashboardPage.navigateToWebapp('Cockpit');
      dashboardPage.authentication.userLogin('jonny1', 'jonny1');

      // then
      dashboardPage.isActive();
    });

  });


  describe('dashboard', function () {

    it('should select process', function() {

      // when
      dashboardPage.deployedProcessesList.selectProcess(3);

      // then
      expect(processDefinitionPage.fullPageHeaderProcessDefinitionName()).toEqual('PROCESS DEFINITION\n' + 'CallingCallActivity');
    });

  });


  describe('process definition view', function() {

    it('should check action bar', function () {

      // then
      expect(processDefinitionPage.actionBar.suspendButton().isEnabled()).toBe(true);
    });


    it('should check Called Process Definitions tab', function() {

      // when
      processDefinitionPage.table.calledProcessDefinitionsTab.selectTab();

      // then
      processDefinitionPage.table.calledProcessDefinitionsTab.checkTabName();
      processDefinitionPage.table.calledProcessDefinitionsTab.isTabSelected();
    });


    function clickFirstCalledProcessDefintion() {
      return processDefinitionPage.table.calledProcessDefinitionsTab.calledProcessDefintionName(0).then(function(title) {
        processDefinitionPage.table.calledProcessDefinitionsTab.selectCalledProcessDefinitions(0);
        return title;
      });
    }

    it('should open called process defintion', function () {

      var processName;

      // when
      clickFirstCalledProcessDefintion().then(function(name) {
        processName = name;
      })
      .then(processDefinitionPage.pageHeaderProcessDefinitionName)
      .then(function(headerName) {

        // then
        expect(processName).toBe(headerName);
      });
      // TODO check URL
    });


    it('should select calling activity', function () {

      // when
      processDefinitionPage.table.calledProcessDefinitionsTab.selectTab();
      processDefinitionPage.table.calledProcessDefinitionsTab.selectCalledFromActivity(0);

      // then
      processInstancePage.diagram.isActivitySelected('CallActivity_1');
    });
    
    
    it('should go deeper', function () {

      var processName;

      // when
      clickFirstCalledProcessDefintion().then(function(name) {
        processName = name;
      })
          .then(processDefinitionPage.pageHeaderProcessDefinitionName)
          .then(function(headerName) {

            // then
            expect(processName).toBe(headerName);
          });
      // TODO check URL
    });


    it('should check Job Definitions tab', function() {

      // when
      processDefinitionPage.table.jobDefinitionsTab.selectTab();

      // then
      processDefinitionPage.table.jobDefinitionsTab.checkTabName();
      processDefinitionPage.table.jobDefinitionsTab.isTabSelected();
      processDefinitionPage.table.calledProcessDefinitionsTab.isTabNotSelected();
    });


    it('should select job activity', function () {

      // when
      processDefinitionPage.table.jobDefinitionsTab.selectJobDefinition(0);

      // then
      processInstancePage.diagram.isActivitySelected('ServiceTask_1');
      expect(processDefinitionPage.table.jobDefinitionsTab.jobDefinitionName(0)).toBe('Service Task');
      expect(processDefinitionPage.table.jobDefinitionsTab.suspendJobButton(0).isEnabled()).toBe(true);
    });


    it('should check Process Instances tab', function() {

      // when
      processDefinitionPage.table.processInstancesTab.selectTab();

      // then
      processDefinitionPage.table.processInstancesTab.checkTabName();
      processDefinitionPage.table.processInstancesTab.isTabSelected();
    });


    function clickFirstProcessInstance() {
      return processDefinitionPage.table.processInstancesTab.processInstanceId(0).then(function(title) {
        processDefinitionPage.table.processInstancesTab.selectProcessInstance(0);
        return title;
      });
    }

    it('should select process instance and check instance view page', function() {

      // when
      var instanceId;

      clickFirstProcessInstance()
        .then(function(id) {
          instanceId = id;
        })
        .then(processInstancePage.pageHeaderProcessInstanceName)
        .then(function(headerId) {
          expect(instanceId).toBe(headerId);
        })
        .then(function() {
          processInstancePage.isActive({ instance: instanceId });
        });

    });

  });


  // disabled by CAM-3171
  xdescribe('cockpit navigation', function () {

    it('should call dashboard by bread crumb', function () {

      processInstancePage.pageHeaderProcessInstanceName()
          .then(function(instanceId) {

            // when
            processInstancePage.selectBreadCrumb(0);

            // then
            expect(dashboardPage.isActive());

            // when
            browser.navigate().back();

            // then
            processInstancePage.isActive({ instance: instanceId });
          })
    });


    it('should call defintions page by bread crumb', function () {

      // when
      processInstancePage.selectBreadCrumb(2);

      // then
      processDefinitionPage.table.processInstancesTab.selectProcessInstance(5);
    });


    it('should call dashboard by header menu', function () {
      var url;

      browser.getCurrentUrl()
        .then(function(urlString) {
          url = urlString;
        })
        .then(processInstancePage.pageHeaderProcessInstanceName)
        .then(function(instanceId) {

          // when
          processInstancePage.clickNavBarHeader();

          // then
          dashboardPage.isActive();

          // when
          browser.get(url);

          // then
          processInstancePage.isActive({ instance: instanceId });
        });

    });

  });


  describe('process instance view', function () {


    describe('variables tab -', function () {

      it('should select change variable process and open instance view', function () {

        // given
        dashboardPage.navbarBrand().click();

        // when
        dashboardPage.deployedProcessesList.selectProcess(4);  // change variable process

        // then
        processDefinitionPage.table.processInstancesTab.selectProcessInstance(0);
      });


      it('should open Variables tab', function () {

        // when
        processInstancePage.table.variablesTab.selectTab();

        // then
        processInstancePage.table.variablesTab.checkTabName();
      });

    });


    describe('user task tab -', function () {

      it('should open User Task tab', function () {

        // when
        processInstancePage.table.userTaskTab.selectTab();

        // then
        processInstancePage.table.userTaskTab.checkTabName();
      });


      it('should select user task in table', function () {

        // when
        processInstancePage.table.userTaskTab.selectUserTask(0);

        // then
        processInstancePage.diagram.isActivitySelected('userTask');

        processInstancePage.diagram.deselectActivity('userTask');
      });

    });


    describe('incidents tab -', function () {

      it('should select Another Failing Process and open instance view', function () {

        // given
        dashboardPage.navbarBrand().click();

        // when
        dashboardPage.deployedProcessesList.selectProcess(0);  // Another Failing Process

        // then
        processDefinitionPage.table.processInstancesTab.selectProcessInstance(0);
      });


      it('should select Incident tab', function () {

        // when
        processInstancePage.table.incidentTab.selectTab();

        // then
        processInstancePage.table.incidentTab.checkTabName();
      });

    });


    describe('called process instances tab -', function () {

      it('should select CallActivity Process and open instance view', function () {

        // given
        dashboardPage.navbarBrand().click();

        // when
        dashboardPage.deployedProcessesList.selectProcess(2);  // CallActivity Process

        // then
        processDefinitionPage.table.processInstancesTab.selectProcessInstance(0);
      });


      it('should open Called Process Instances tab', function () {

        // when
        processInstancePage.table.calledProcessInstancesTab.selectTab();

        // then
        processInstancePage.table.calledProcessInstancesTab.checkTabName();
      });

    });


    it('should check action bar', function () {

      // then
      expect(processInstancePage.actionBar.cancelButton().isEnabled()).toBe(true);
      expect(processInstancePage.actionBar.retryButton().isEnabled()).toBe(true);
      expect(processInstancePage.actionBar.addVariableButton().isEnabled()).toBe(true);
      expect(processInstancePage.actionBar.suspendButton().isEnabled()).toBe(true);
    });


    it('should select diagram element', function() {
      // used process: CallActivity

      // when
      processInstancePage.diagram.selectActivity('CallActivity_1');

      // then
      processInstancePage.diagram.isActivitySelected('CallActivity_1');
    });


    it('should deselect diagram element', function() {
      // used process: CallActivity

      // when
      processInstancePage.diagram.deselectActivity('CallActivity_1');

      // then
      processInstancePage.diagram.isActivityNotSelected('CallActivity_1');

    });

  });


  describe('end test', function() {

    it('should log out', function () {

      dashboardPage.logout();
    });

  });


});