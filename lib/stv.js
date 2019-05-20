'use strict';
var Big = require('big.js');
var bigZero = new Big(0);

var WINNER = 'winner';
var LOSER = 'loser';
function getWinners(summatory, quota) {
    var ret = {},
        thereIsAWinner,
        i;
    for (i = 0; i < summatory.length; i++) {
        // (Big.js).cmp returns -1, 0 or 1 as minus than, equal than, bigger than
        // winners are  0 and 1 values
        if (!summatory[i]) {
            continue;
        }
        if (~summatory[i].cmp(quota)) {
            ret[i] = summatory[i];
            thereIsAWinner = true;
        }
    }
    return thereIsAWinner && ret;
}

function getLosers(summatory, quota) {
    var ret, i, min;
    for (i = 0; i < summatory.length; i++) {
        // (Big.js).cmp returns -1, 0 or 1 as minus than, equal than, bigger than
        // winners are  0 and 1 values
        if (!summatory[i]) {
            continue;
        }
        if (~summatory[i].cmp(quota)) {
            continue;
        }
        if (summatory[i].cmp(0) === 0) {
            continue;
        }

        if (!ret) {
            ret = summatory[i];
            min = {};
            min[i] = true;
            continue;

        }
        switch (summatory[i].cmp(ret)) {
        case -1:
            ret = summatory[i];
            min = {};
            min[i] = true;
            break;
        case 0:
            min[i] = true;
            break;
        case 1:
            break;
        }
    }
    return min;
}

function min(arr) {
    return arr.filter(function (x) {
        return x.cmp(bigZero) === 1;
    }).sort()[0];
}

function arrayFilledWithZeros(size) {
    var ret = [];
    while (size--) {
        ret.push(bigZero);
    }
    return ret;

}

function Index(vote) {
    this.pos = 0;
    this.vote = vote.options;
    this.count = new Big(vote.count);
}

function makeIndexOfVotes(votes) {
    var ret = [],
        i;
    if (!votes) {
        throw new Error('votes is required');
    }
    if (!Array.isArray(votes)) {
        throw new Error('votes must to be an array');
    }
    if (!votes.length) {
        throw new Error('votes can not be an empty array');
    }

    for (i = 0; i < votes.length; i++) {
        ret.push(new Index(votes[i]));
    }
    return ret;
}

function indexSummatory(round, topic) {
    var i,
        ix = arrayFilledWithZeros(topic.votes.length),
        curr, key;
    for (i = 0; i < round.index.length; i++) {
        curr = round.index[i];
        key = curr.vote[curr.pos];
        if (!round.excluded[key]) {
            ix[key] = (ix[key] || bigZero).plus(curr.count);
        }
    }
    ix.min = min(ix);
    return ix;
}

function makeLosersWinners(round, topic) {
    var summatory = round.summatory;
    var excluded = round.excluded;
    // eslint-disable-next-line no-unused-vars
    var ret = summatory.ret;

    var item, remain = summatory.map(function (x, i) {
        return [i, x];
    }).filter(function (x) {
        return !excluded[x[0]] && x[1].cmp(0) > 0;
    }).sort(function (a, b) {
        return a[1].cmp(b[1]);
    });
    while (round.ret.length < topic.seats && (item = remain.pop())) {
        round.winner(item[0] - 0, item[1].toString() - 0, LOSER);
    }
}

exports = module.exports = function (surplusAllocationFN, loserExclusionFN) {
    return function stv(topic, quota) {
        var winners, roundsWithoutWinners = 0;
        var round = {
            index: makeIndexOfVotes(topic.votes),
            ret: [],
            excluded: {},
            quota: quota
        };
        round.winner = function (option, votes, type) {
            this.ret.push([option, votes, type]);
            this.excluded[option] = type || WINNER;
        };

        while (round.ret.length < topic.seats && round.index.length) {
            round.summatory = indexSummatory(round, topic);
            if (typeof round.summatory.min === 'undefined') {
                break;
            }
            // Winners
            if ((winners = getWinners(round.summatory, quota))) {
                // surplus allocation from winners to hopefulls
                surplusAllocationFN(round, winners);
                // After surplus allocation we want to give seats
                // to winners and start again.
                Object.keys(winners).forEach(function (key) {
                    round.winner(key - 0, winners[key].toString() - 0, WINNER);
                });
            } else {
                // In the event of no winners:
                if (roundsWithoutWinners++) {
                    makeLosersWinners(round, topic);
                    break;
                }
                // losers
                loserExclusionFN(getLosers(round.summatory, quota), round.index);
            }
        }
        return {
            seats: round.ret
        };
    };
};
exports.makeIndexOfVotes = makeIndexOfVotes;
exports.summatory = indexSummatory;
exports.getWinners = getWinners;
exports.getLosers = getLosers;
exports.makeLosersWinners = makeLosersWinners;
