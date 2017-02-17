'use strict';

describe('Directories E2E Tests:', function () {
  describe('Test Directories page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/directories');
      expect(element.all(by.repeater('directory in directories')).count()).toEqual(0);
    });
  });
});
