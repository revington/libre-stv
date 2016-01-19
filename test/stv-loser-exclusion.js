'use strict';
const assert = require('assert');
const stv = require('..');
const losers = stv.stvLoserExclusion;
const Big = require('big.js');

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

describe('#stvLoserExclusion(losers, index)', function () {
    it('should transfer votes from losers to second options', function () {
        var index = [{
            pos: 1,
            vote: [4, 0,1],
            count: new Big(4)
        }, {
            pos: 1,
            vote: [2, 1, 0],
            count: new Big(2)
	}];
        var expected = deepCopy(index);
	expected[0].pos++;
        losers({
            '0': true
        }, index);
        // Deep copy also forces Big.js objects to get serialized,
        // you can not compare original to index because index will keep
        // the Big.js numbers will original not.
        var actual = deepCopy(index);
        assert.deepEqual(actual, expected);
    });
    it('index items running out of options should be removed', function () {
        // See https://en.wikipedia.org/wiki/Single_transferable_vote#Example
        // This will be round 3,Pear's votes transfer to their second preference, Oranges
        var index = [{
            pos: 1,
            vote: [4, 0],
            count: new Big(4)
        }, {
            pos: 1,
            vote: [2, 1, 0],
            count: new Big(2)
        }, {
            pos: 2,
            vote: [8, 2, 3],
            count: new Big(4)
        }, {
            pos: 2,
            vote: [4, 2, 4],
            count: new Big(2)
        }, {
            pos: 1,
            vote: [1, 3],
            count: new Big(1)
        }, {
            pos: 1,
            vote: [1, 4],
            count: new Big(1)
        }];
        var original = deepCopy(index);
        losers({
            '0': true
        }, index);

        // Deep copy also forces Big.js objects to get serialized,
        // you can not compare original to index because index will keep
        // the Big.js numbers will original not.
        var actual = deepCopy(index);
        assert.deepEqual(actual, original.slice(1));
    });
});
