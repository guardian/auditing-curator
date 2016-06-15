import ava from 'ava';
import * as indices from '../src/indices';

ava.test('filter list of indices', test => {
	// out of order to test sorting
	const list = [{
		index: 'one',
		date: '2016_02_15'
	}, {
		index: 'three',
		date: '2016_02_13'
	}, {
		index: 'two',
		date: '2016_02_14'
	}];

	test.deepEqual(indices.extractOldIndices(new Date('2016-02-12'), list), [], 'index in the future');
	test.deepEqual(indices.extractOldIndices(new Date('2016-02-13'), list), [], 'leave today');
	test.deepEqual(indices.extractOldIndices(new Date('2016-02-14'), list), [{
		index: 'three',
		date: '2016_02_13'
	}], 'one old');
	test.deepEqual(indices.extractOldIndices(new Date('2016-02-15'), list), [{
		index: 'two',
		date: '2016_02_14'
	}, {
		index: 'three',
		date: '2016_02_13'
	}], 'two old');
	test.deepEqual(indices.extractOldIndices(new Date('2016-02-16'), list), [{
		index: 'one',
		date: '2016_02_15'
	}, {
		index: 'two',
		date: '2016_02_14'
	}, {
		index: 'three',
		date: '2016_02_13'
	}], 'in the future');
});
