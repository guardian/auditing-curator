import ava from 'ava';
import {handleListAllIndices} from '../src/elasticsearch';

/**
 * I can't really test elastic.listAllIndices because it makes requests
 * to elasticSearch, but I'll test the handle callback with mock data
 */

ava('elastic list indices fails in case of error', test => {
	const result = handleListAllIndices(new Error('bad'));
	test.truthy(result[0] instanceof Error);
	test.regex(result[0].message, /bad/i);
});

ava('elastic list indices splits the list by date', test => {
	const result = handleListAllIndices(null, `
		status open extras_2016_02_19 2 4 12390 0    4mb 4mb
		status open extras_2016_02_18 5 1 21300 0   4.2mb 4.2mb
		status open extras_2016_02_10 7 2 6025 0    3.5mb 3.5mb
	`);
	test.ifError(result[0]);
	test.deepEqual(result[1], [{
		index: 'extras_2016_02_19',
		date: '2016_02_19'
	}, {
		index: 'extras_2016_02_18',
		date: '2016_02_18'
	}, {
		index: 'extras_2016_02_10',
		date: '2016_02_10'
	}]);
});
