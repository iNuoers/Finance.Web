'use strict';

require('../../css/my-custody.css');

var _f = require('./header.js')._f;

$(function () {
    var score = $(".progress-level-in").data("score"), width = score + "%";

    $(".progress-level-in").animate({
        width: width,
        speed: 1500
    })
});