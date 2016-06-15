import * as dynamoLib from './dynamo';
import * as elasticLib from './elasticsearch';
import {extractOldIndices} from './indices';
import {subtractDays} from './date';

const dropIndexOlderThanDays = 14;

export function handler (event, context, callback) {
	processEvent({event, callback,
		dynamo: dynamoLib,
		elastic: elasticLib,
		today: new Date()
	});
}

export function processEvent ({
	dynamo, callback, elastic, today
}) {
	elastic.listAllIndices(function (err, data) {
		if (err) {
			callback(new Error('Unable to list all indices: ' + err.message));
		} else {
			processIndices({
				dynamo, callback, elastic, indices: data, today
			});
		}
	});
}

function processIndices ({
	dynamo, callback, elastic, indices, today
}) {
	const indicestoDelete = extractOldIndices(subtractDays(today, dropIndexOlderThanDays), indices);
	if (indicestoDelete.length) {
		dropIndices({
			dynamo, callback, elastic, indicestoDelete, today
		});
	} else {
		callback(null, 'Nothing to do');
	}
}

function dropIndices ({
	dynamo, callback, elastic, indicestoDelete, today
}) {
	elastic.dropIndices(indicestoDelete.map(index => index.index), function (err) {
		if (err) {
			callback(new Error('Unable to drop index: ' + err.message));
		} else {
			logDeletedIndexInDynamo({
				dynamo, callback, elastic, last: indicestoDelete[0].index, today
			});
		}
	});
}

function logDeletedIndexInDynamo ({
	dynamo, callback, last, today
}) {
	dynamo.putLastIndexDropped(last, today, function (err) {
		if (err) {
			callback(new Error('Unable to store in dynamo: ' + err.message));
		} else {
			callback(null, 'Index dropped until ' + last);
		}
	});
}
