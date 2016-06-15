import ava from 'ava';
import {handleDynamoResponse} from '../src/dynamo';

/**
 * I can't really test dynamo.getLastIndexDropped because it makes requests
 * to dynamoDB, but I'll test the handle callback with mock data
 */

const errorMessage = {
	status: 400,
	message: 'not found'
};
const today = new Date();

ava('dynamo error case', test => {
	test.deepEqual(handleDynamoResponse(errorMessage), [errorMessage]);
});

ava('dynamo empty response', test => {
	test.deepEqual(handleDynamoResponse(null, { Count: 0 }), [null], 'test empty response');
});

ava('dynamo valid response', test => {
	test.deepEqual(handleDynamoResponse(null, {
		Count: 1,
		Items: [{
			taskName: { S: 'dropExtraIndex' },
			startTime: { S: today.toISOString() },
			lastIndexDropped: { S: 'banana' }
		}]
	}), [null, {
		startTime: today,
		lastIndexDropped: 'banana'
	}], 'test valid response');
});
