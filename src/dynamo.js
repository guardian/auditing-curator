import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB({
	region: 'eu-west-1'
});

export function getLastIndexDropped (callback) {
	dynamodb.query({
		TableName: 'auditing-CuratorJobsDatabase-FUFQ9QNEXVFX',
		ScanIndexForward: false,
		KeyConditionExpression: 'taskName = :task',
		ExpressionAttributeValues: {
			':task': {
				S: 'dropExtraIndex'
			}
		}
	}, function (err, data) {
		const response = handleDynamoResponse(err, data);
		callback(response[0], response[1]);
	});
}

export function putLastIndexDropped (index, date, callback) {
	dynamodb.putItem({
		TableName: 'auditing-CuratorJobsDatabase-FUFQ9QNEXVFX',
		Item: {
			taskName: {
				S: 'dropExtraIndex'
			},
			startTime: {
				S: date.toISOString()
			},
			lastIndexDropped: {
				S: index
			}
		}
	}, function (err) {
		callback(err);
	});
}

export function handleDynamoResponse (err, data) {
	if (err) {
		return [err];
	} else if (data.Count === 0) {
		return [null];
	} else {
		const startTime = data.Items[0].startTime.S;
		const lastIndexDropped = data.Items[0].lastIndexDropped.S;

		return [null, {
			startTime: new Date(startTime),
			lastIndexDropped
		}];
	}
}
