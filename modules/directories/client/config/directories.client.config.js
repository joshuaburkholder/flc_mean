(function () {
  'use strict';

  angular
    .module('directories')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Directories',
      state: 'directories',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'directories', {
      title: 'List Directories',
      state: 'directories.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'directories', {
      title: 'Create Directory',
      state: 'directories.create',
      roles: ['user']
    });
  }
}());
