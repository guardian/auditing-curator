import ava from 'ava';
import {processEvent} from '../tmp/lambda/index';

ava.test.cb('ElasticSearch fail', test => {
	processEvent({
		elastic: {
			listAllIndices: function (callback) {
				callback(new Error('Invalid ElasticSearch'));
			}
		},
		callback: (err) => {
			test.regex(err.message, /invalid elasticsearch/i);
			test.end();
		}
	});
});

ava.test.cb('ElasticSearch has no indices', test => {
	processEvent({
		elastic: {
			listAllIndices: function (callback) {
				callback(null, []);
			}
		},
		today: new Date('2016-02-20'),
		callback: (err, message) => {
			test.ifError(err, 'Expecting error');
			test.regex(message, /nothing to do/i);
			test.end();
		}
	});
});

ava.test.cb('ElasticSearch has all recent indices', test => {
	processEvent({
		elastic: {
			listAllIndices: function (callback) {
				callback(null, [{
					index: 'extras_2016_02_19',
					date: '2016_02_19'
				}]);
			}
		},
		today: new Date('2016-02-20'),
		callback: (err, message) => {
			test.ifError(err, 'Expecting error');
			test.regex(message, /nothing to do/i);
			test.end();
		}
	});
});

ava.test.cb('ElasticSearch has some indices to be dropped but drop fails', test => {
	processEvent({
		elastic: {
			listAllIndices: function (callback) {
				callback(null, [{
					index: 'extras_2016_02_19',
					date: '2016_02_19'
				}, {
					index: 'extras_2016_02_10',
					date: '2016_02_10'
				}, {
					index: 'extras_2016_01_15',
					date: '2016_01_15'
				}]);
			},
			dropIndices: function (indices, callback) {
				test.deepEqual(indices, ['extras_2016_02_10', 'extras_2016_01_15']);
				callback(new Error('Invalid drop'));
			}
		},
		today: new Date('2016-02-29'),
		callback: err => {
			test.regex(err.message, /invalid drop/i);
			test.end();
		}
	});
});

ava.test.cb('ElasticSearch has some indices but dynamo fails', test => {
	processEvent({
		elastic: {
			listAllIndices: function (callback) {
				callback(null, [{
					index: 'extras_2016_02_19',
					date: '2016_02_19'
				}, {
					index: 'extras_2016_02_10',
					date: '2016_02_10'
				}, {
					index: 'extras_2016_01_15',
					date: '2016_01_15'
				}]);
			},
			dropIndices: function (indices, callback) {
				test.deepEqual(indices, ['extras_2016_02_10', 'extras_2016_01_15']);
				callback(null);
			}
		},
		dynamo: {
			putLastIndexDropped: function (index, date, callback) {
				test.is(index, 'extras_2016_02_10');
				test.deepEqual(date, new Date('2016-02-29'));
				callback(new Error('Invalid dynamo put'));
			}
		},
		today: new Date('2016-02-29'),
		callback: err => {
			test.regex(err.message, /invalid dynamo put/i);
			test.end();
		}
	});
});

ava.test.cb('ElasticSearch clear all indices', test => {
	processEvent({
		elastic: {
			listAllIndices: function (callback) {
				callback(null, [{
					index: 'extras_2016_02_19',
					date: '2016_02_19'
				}, {
					index: 'extras_2016_02_10',
					date: '2016_02_10'
				}, {
					index: 'extras_2016_01_15',
					date: '2016_01_15'
				}]);
			},
			dropIndices: function (indices, callback) {
				test.deepEqual(indices, ['extras_2016_02_10', 'extras_2016_01_15']);
				callback(null);
			}
		},
		dynamo: {
			putLastIndexDropped: function (index, date, callback) {
				test.is(index, 'extras_2016_02_10');
				test.deepEqual(date, new Date('2016-02-29'));
				callback(null);
			}
		},
		today: new Date('2016-02-29'),
		callback: (err, message) => {
			test.ifError(err, 'Expecting error');
			test.regex(message, /dropped .* extras_2016_02_10/i);
			test.end();
		}
	});
});
