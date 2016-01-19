'use strict';

function droopQuota(votesCast, availableSeats) {
    return (votesCast / (availableSeats + 1)) + 1;
}
exports = module.exports = droopQuota;
