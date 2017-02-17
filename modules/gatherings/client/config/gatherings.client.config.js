(function () {
  'use strict';

  angular
    .module('gatherings')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Gatherings',
      state: 'gatherings',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'gatherings', {
      title: 'List Gatherings',
      state: 'gatherings.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'gatherings', {
      title: 'Create Gathering',
      state: 'gatherings.create',
      roles: ['user']
    });
  }
}());
