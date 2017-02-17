'use strict';

describe('Gatherings E2E Tests:', function () {
  describe('Test Gatherings page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/gatherings');
      expect(element.all(by.repeater('gathering in gatherings')).count()).toEqual(0);
    });
  });
});
