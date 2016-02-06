'use strict';
var stv = require('..');
var assert = require('assert');

describe('Issue #5', function () {
    var fn = stv(stv.stvSurplusAllocation, stv.stvLoserExclusion);
    var party = {
        'votes': [{
            'options': [5, 0, 4, 1, 2, 3, 6, 7, 8, 9],
            'count': 1
        }, {
            'options': [0, 5, 7, 2, 4, 6, 8, 9, 3, 1],
            'count': 1
        }, {
            'options': [5, 7, 4, 8, 1, 9, 3, 2, 0, 6],
            'count': 1
        }, {
            'options': [7, 0, 2, 8, 5, 6, 1, 3, 9, 4],
            'count': 1
        }],
        options: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
        seats: 8
    };

    it('should not break when summatory contains null items', function () {
        var quota = 1.3636363636363638;
        var actual = fn(party, quota);
        var expected = {
            seats: [
                [5, 2],
                [0],
                [4]
            ]
        };
        assert.deepEqual(actual, expected);
    });
});
