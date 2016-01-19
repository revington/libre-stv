'use strict';
var assert = require('assert');
var stv = require('..');
var surplus = stv.stvSurplusAllocation;
var Big = require('big.js');
var party = require('./fixtures/party');

describe('#stvSurplusAllocation(winners, index, quota)', function () {
    it('should transfer quota excess from winners to hopefulls (second options)', function () {
        // See https://en.wikipedia.org/wiki/Single_transferable_vote#Example
        // This will be round 2, where chocolate excess gets distributed to 
        // first-choice-chocolate second options. In this case, strawberries and sweets
        var index = stv.makeIndexOfVotes(party.votes);
        var summatory = stv.summatory(index, party);
        var ret = surplus(stv.getWinners(summatory, 6), index, 6);
        var expected = [{
            pos: 0,
            vote: [0],
            count: '4'
        }, {
            pos: 0,
            vote: [1, 0],
            count: '2'
        }, {
            pos: 1,
            vote: [2, 3],
            count: '4'
        }, {
            pos: 1,
            vote: [2, 4],
            count: '2'
        }, {
            pos: 0,
            vote: [3],
            count: '1'
        }, {
            pos: 0,
            vote: [4],
            count: '1'
        }];
        var actual = JSON.parse(JSON.stringify(index));
        assert.deepEqual(actual, expected);
    });
});
