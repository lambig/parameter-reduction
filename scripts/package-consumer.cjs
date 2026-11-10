const assert = require('node:assert/strict');
function check(api) {
    assert.deepEqual(api.map(x => x * 2)([1, 2]), [2, 4]);
    assert.deepEqual(api.filter(x => x > 1)([1, 2, 3]), [2, 3]);
}
check(require('parameter-reduction'));
import('parameter-reduction').then(api => {
    check(api.default);
    console.log('Installed parameter-reduction: require and import consumers passed.');
}).catch(error => { console.error(error); process.exitCode = 1; });
