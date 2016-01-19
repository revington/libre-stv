'use strict';
const Big = require('big.js');
const stv = require('..');
const assert = require('assert');
const party =require('./fixtures/party');

describe('#stv(votes, quota, seats)', function () {
    var fn = stv(stv.stvSurplusAllocation, stv.stvLoserExclusion);
    it('should count single transferable votes', function () {
        const quota = 6;
        const actual = fn(party, quota);
        const expected = {
            seats: [
                [2, 12],
                [0, 6],
                [3, 5]
            ]
        };
        assert.deepEqual(actual, expected);
    });
});
describe('#getWinners(summatory, quota)', function () {
    it('should return a hash object with winner IDs', function () {
        const summatory = [0, 1, 2, 2, 3].map(x => new Big(x));
        const actual = stv.getWinners(summatory, 2);
        assert.deepEqual(actual, {
            '2': summatory[2],
            '3': summatory[3],
            '4': summatory[4]
        });
    });
});
describe('#getLosers(summatory, quota)', function () {
    it('should return a hash object with loser IDs', function () {
        const summatory = [0, 1, 1, 2, 2, 3].map(x => new Big(x));
        const actual = stv.getLosers(summatory, 2);
        assert.deepEqual(actual, {
            1: true,
            2: true
        });
    });
});
