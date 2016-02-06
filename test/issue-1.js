'use strict';
var stv = require('..');
var assert = require('assert');

describe('Issue #1', function () {
    var fn = stv(stv.stvSurplusAllocation, stv.stvLoserExclusion);
    var party = {
        votes: [{
            options: [0, 2, 1],
            count: 1
        }, {
            options: [1, 2, 0],
            count: 1
        }],
        options: ["a", "b", "c"],
        seats: 3,
    };
    it('should not break when there are not enough losers to cover all seats', function () {
        var quota = 3;
        var actual = fn(party, quota);
        var expected = {
            seats: [
                [2]
            ]
        };
        assert.deepEqual(actual, expected);
    });
});
