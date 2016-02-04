'use strict';

function surplus(total, quota, votes) {
    // t-q
    // ———  X votes
    //  t
    return total.minus(quota).div(total).times(votes);
}

function stvSurplusAllocation(round, winners) {

    var index = round.index;
    var excluded = round.excluded;
    var quota = round.quota;
    var i = index.length, item, option, summatoryOf;
    /* Given a winner, we want to transfer surplus to the next
     * non winner/non excluded option.
     * If we run out of options, remove this entry from the index.
     */
    while (i--) {
        item = index[i];
        option = item.vote[item.pos];

        if (!(summatoryOf = winners[option])) {
            continue;
        }
        while (item.pos++ < item.vote.length) {
            option = item.vote[item.pos];
            if (!winners[option] && !excluded[option]) {
                break;
            }

        }

        if (item.pos === item.vote.length) {
            index.splice(i, 1);
            continue;
        }

        item.count = surplus(summatoryOf, quota, item.count);

        if (item.count.cmp(0) === 0) {
            index.splice(i, 1);
        }
    }

}
exports = module.exports = stvSurplusAllocation;
exports.surplus = surplus;
