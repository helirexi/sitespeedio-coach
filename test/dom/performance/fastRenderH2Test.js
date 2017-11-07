'use strict';

const createTestRunner = require('../../help/browsertimeRunner')
    .createTestRunner,
  assert = require('assert');

let BROWSERS = ['chrome', 'firefox'];

describe('Fast render advice HTTP/2:', function() {
  BROWSERS.forEach(function(browser) {
    describe('browser: ' + browser, function() {
      const runner = createTestRunner(browser, 'performance', true);

      before(() => runner.start(browser));

      after(() => runner.stop());

      it('We should know that synchronous JavaScript makes the page render slower', function() {
        this.skip();

        return runner
          .run('fastRender.js', 'fastrender/avoidJSSyncInHead.html')
          .then(result => {
            // In H2 world we don't hurt CSS, we hope it is pushed.
            assert.strictEqual(result.offending.length, 1);
          });
      });

      it('We should know that loading JavaScript asynchronously is OK', function() {
        this.skip();

        return runner
          .run('fastRender.js', 'fastrender/jsAsyncIsOk.html')
          .then(result => {
            assert.strictEqual(result.offending.length, 0);
          });
      });

      it.skip('We should know that loading too large CSS files is not OK', function() {
        return runner
          .run('fastRender.js', 'fastrender/tooLargeCSS.html')
          .then(result => {
            assert.strictEqual(result.offending.length, 1);
          });
      });
    });
  });
});
