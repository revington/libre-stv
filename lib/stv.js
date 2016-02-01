'use strict';
var Big = require('big.js');
var bigZero = new Big(0);

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
        return x.cmp(bigZero) === 1
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

function indexSummatory(indexArray, topic) {
    var i,
        ix = arrayFilledWithZeros(topic.votes.length),
        curr, key,
        winners = {};
    for (i = 0; i < indexArray.length; i++) {
        curr = indexArray[i];
        key = curr.vote[curr.pos];
        ix[key] = (ix[key] || bigZero).plus(curr.count);
    }
    ix.min = min(ix);
    return ix;
}

function makeLosersWinners(summatory, ret, topic) {
    var item, remain = summatory.map(function (x, i) {
        return [i, x];
    }).filter(function (x) {
        return x[1].cmp(0) > 0;
    }).sort(function (a, b) {
        return a[1].cmp(b[1]);
    });
    while (ret.length < topic.seats && (item = remain.pop())) {
        ret.push([item[0] - 0, item[1].toString() - 0]);
    }
}

exports = module.exports = function (surplusAllocationFN, loserExclusionFN) {
    return function stv(topic, quota) {
        var index = makeIndexOfVotes(topic.votes),
            summatory,
            ret = [],
            i,
            winners,
            roundsWithoutWinners = 0;
        while (ret.length < topic.seats && index.length) {
            summatory = indexSummatory(index, topic);
            if (typeof summatory.min === 'undefined') {
                break;
            }
            // Winners
            if (winners = getWinners(summatory, quota)) {
                Object.keys(winners).forEach(function (key) {
                    ret.push([key - 0, winners[key].toString() - 0]);
                });
                // surplus allocation from winners to hopefulls
                surplusAllocationFN(winners, index, quota);
            } else {
                if (roundsWithoutWinners++) {
                    makeLosersWinners(summatory, ret, topic);
                    break;
                }
                // losers
                loserExclusionFN(getLosers(summatory, quota), index);
            }
        }
        return {
            seats: ret
        };
    };
};
exports.makeIndexOfVotes = makeIndexOfVotes;
exports.summatory = indexSummatory;
exports.getWinners = getWinners;
exports.getLosers = getLosers;
exports.makeLosersWinners = makeLosersWinners;
