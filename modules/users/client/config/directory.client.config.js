'use strict';

// Configuring the Chat module
angular.module('users').run(['Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Directory',
      state: 'directory'
    });
  }
]);

