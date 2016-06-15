import ava from 'ava';
import * as date from '../src/date';

ava.test('format a date', test => {
	const noPadding = new Date('2016-10-14');
	const withPadding = new Date('2016-04-07');

	test.is(date.format(noPadding), '2016_10_14');
	test.is(date.format(withPadding), '2016_04_07');
});

ava.test('subtract dates', test => {
	const reference = new Date('2016-02-10');

	test.is(date.format(date.subtractDays(reference, 1)), '2016_02_09');
	test.is(date.format(date.subtractDays(reference, 9)), '2016_02_01');
	test.is(date.format(date.subtractDays(reference, 10)), '2016_01_31');
	test.is(date.format(date.subtractDays(reference, 31)), '2016_01_10');
	test.is(date.format(date.subtractDays(reference, 62)), '2015_12_10');
});
