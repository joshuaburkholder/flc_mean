'use strict';

describe('Potlucks E2E Tests:', function () {
  describe('Test Potlucks page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/potlucks');
      expect(element.all(by.repeater('potluck in potlucks')).count()).toEqual(0);
    });
  });
});
