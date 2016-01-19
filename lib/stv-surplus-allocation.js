'use strict';

function stvSurplusAllocation(winners, index, quota) {
    var i = index.length,
        item, option, summatoryOf, surplus, coefficient;
    while (i--) {
        item = index[i];
        option = item.vote[item.pos];
        if (!(summatoryOf = winners[option])) {
            // not a winner, keep going
            continue;
        }
        surplus = summatoryOf.minus(quota);
        coefficient = surplus.div(summatoryOf);
        if (item.pos++ === item.vote.length) {
            // if there are not more options, remove this entry from 
            // the index
            index.splice(i, 1);
            continue;
        }

        item.count = coefficient.times(item.count);
        if (item.count.cmp(0) === 0) {
            index.splice(i, 1);
        }
    }
}
exports = module.exports = stvSurplusAllocation;
