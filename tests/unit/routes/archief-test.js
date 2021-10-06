import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | archief', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:archief');
    assert.ok(route);
  });
});
