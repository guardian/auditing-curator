import LambdaElastic from 'lambda-elasticsearch';
import AWS from 'aws-sdk';

const elastic = LambdaElastic(AWS, {
	region: 'eu-west-1',
	endpoint: 'search-auditing-3plcaurilp4l5wra76vqzfyrsy.eu-west-1.es.amazonaws.com'
});

const indexLineRegex = /extras_(\d{4}_\d{2}_\d{2})/;

export function listAllIndices (callback) {
	elastic.send({
		method: 'GET',
		path: '/_cat/indices/extras_*',
		json: false
	}, function (err, data) {
		const response = handleListAllIndices(err, data);
		callback(response[0], response[1]);
	});
}

export function handleListAllIndices (err, data) {
	if (err) {
		return [err];
	} else {
		return [null, data.split('\n').map(line => {
			const match = line.match(indexLineRegex);
			return match ? {
				index: match[0],
				date: match[1]
			} : null;
		}).filter(Boolean)];
	}
}

export function dropIndices (indices, callback) {
	elastic.send({
		method: 'DELETE',
		path: '/' + indices.join(','),
		json: false
	}, callback);
}
