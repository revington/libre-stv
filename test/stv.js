'use strict';
var Big = require('big.js');
var stv = require('..');
var assert = require('assert');
var party = require('./fixtures/party');

describe('#stv(votes, quota, seats)', function () {
    var fn = stv(stv.stvSurplusAllocation, stv.stvLoserExclusion);
    it('should count single transferable votes', function () {
        var quota = 6;
        var actual = fn(party, quota);
        var expected = {
            seats: [
                [2, 12],
                [0, 6],
                [3]
            ]
        };
        assert.deepEqual(actual, expected);
    });
});
describe('#getWinners(summatory, quota)', function () {
    it('should return a hash object with winner IDs', function () {
        var summatory = [0, 1, 2, 2, 3].map(function (x) {
            return new Big(x)
        });
        var actual = stv.getWinners(summatory, 2);
        assert.deepEqual(actual, {
            '2': summatory[2],
            '3': summatory[3],
            '4': summatory[4]
        });
    });
});
describe('#getLosers(summatory, quota)', function () {
    it('should return a hash object with loser IDs', function () {
        var summatory = [0, 1, 1, 2, 2, 3].map(function (x) {
            return new Big(x)
        });
        var actual = stv.getLosers(summatory, 2);
        assert.deepEqual(actual, {
            1: true,
            2: true
        });
    });
});
