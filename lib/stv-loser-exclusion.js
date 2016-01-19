'use strict';

function stvLoserExclusion(losers, index) {
    var i = index.length;
    while (i--) {
        let item = index[i];
        let option = item.vote[item.pos];
        if (losers[option]) {
            if (++item.pos === item.vote.length) {
                index.splice(i, 1);
            }
        }
    }
}
exports = module.exports = stvLoserExclusion;
