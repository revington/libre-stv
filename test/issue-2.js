'use strict';
var stv = require('..');
var assert = require('assert');

describe('Issue #2', function () {
    var fn = stv(stv.stvSurplusAllocation, stv.stvLoserExclusion);
    var party = {
        "votes": [{
            "options": [0, 5, 7, 2, 4, 6, 8, 9, 3, 1],
            "count": 1
        }, {
            "options": [5, 7, 4, 8, 1, 9, 3, 2, 0, 6],
            "count": 1
        }],
        options: ["a", "b", "c", "d", "e", "f", "g", "h"],
        seats: 8
    };

    it('should not break when summatory contains null items', function () {
        var quota = 1.1818181818181819;
        var actual = fn(party, quota);
        var expected = {
            seats: [
                [7, 1, 'loser'],
                [5, 1, 'loser']
            ]
        };
        assert.deepEqual(actual, expected);
    });
});
