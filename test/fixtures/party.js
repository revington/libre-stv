exports = module.exports = {
    type: 'stv',
    quota: 'droop',
    options: ['orange', 'pear', 'chocolate', 'strawberry', 'sweets'],
    seats: 3,
    votes: [{
        options: [0],
        count: 4
    }, {
        options: [1, 0],
        count: 2
    }, {
        options: [2, 3],
        count: 8
    }, {
        options: [2, 4],
        count: 4
    }, {
        options: [3],
        count: 1
    }, {
        options: [4],
        count: 1
    }]
};
