import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | archieven', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:archieven');
    assert.ok(route);
  });
});
