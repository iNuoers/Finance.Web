'use strict';

require('../../../css/my/custody.css');

$(function () {
    var score = $(".progress-level-in").data("score"), width = score + "%";

    $(".progress-level-in").animate({
        width: width,
        speed: 1500
    })
});