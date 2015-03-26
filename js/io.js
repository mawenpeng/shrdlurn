'use strict';

var R = require('ramda');
var $ = require('jquery');
var Isomer = require('isomer');
var Sortable = require('sortablejs');

var C = require('./cube-composer');
var functions = require('./collection');
var solve = require('./solve');

var Shape = Isomer.Shape;
var Point = Isomer.Point;
var Color = Isomer.Color;

// Global isomer instance
var isomer;

var config = {
    // http://www.colourlovers.com/palette/1473/Ocean_Five
    colors: [
        new Color(0, 160, 176),
        new Color(106, 74, 60),
        new Color(204, 51, 63),
        new Color(235, 104, 65),
        new Color(237, 201, 81)
    ],
    isomer: {
        normal: {
            scale: 40,
            originX: 40,
            originY: 400
        },
        target: {
            scale: 22,
            originX: 1200,
            originY: 250
        }
    }
};

var renderBlock = function(y, x, value, z) {
    isomer.add(
        new Shape.Prism(
            new Point(x, -6 * y, z),
            1, 1, 1
        ),
        config.colors[value]
    );
};

var renderBlocks = function(len, y, values, x) {
    R.forEachIndexed(R.partial(renderBlock, y, len - x), values);
};

var renderLine = function(line, y) {
    var len = line.length;
    R.forEachIndexed(R.partial(renderBlocks, len, y), line.reverse());
};

var render = R.forEachIndexed(renderLine);

var addColorBlocks = function(str) {
    R.forEach(function(cstr) {
        str = str.replace(new RegExp('\\{' + cstr + '\\}', 'g'),
                          '<div class="rect ' + cstr + '"> </div>');
    }, ['X', 'BL', 'BR', 'RE', 'OR', 'YE']);
    return str;
};

// var BL = 0;
var BR = 1;
// var RE = 2;
var OR = 3;
var YE = 4;

// see http://stackoverflow.com/a/11935263/704831
function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}

var setIsomerConfig = function(config) {
    isomer.scale = config.scale;
    isomer.originX = config.originX;
    isomer.originY = config.originY;
    isomer._calculateTransformation();
};

var renderTarget = function() {
    setIsomerConfig(config.isomer.target);
    render([target]);
    setIsomerConfig(config.isomer.normal);
};

var newPuzzle = function() {
    // new initial state
    init = C.wrap([BR, OR, OR, YE, YE, YE, OR, OR, BR]);

    // new puzzle
    var randFs = getRandomSubarray(R.values(functions), 5);
    target = R.last(C.transformationSteps(init, randFs));

    // make sure the target is not too big
    var width = target.length;
    var height = R.length(R.maxBy(R.length, target));
    var total = R.length(R.flatten(target));
    if (width === 0 || width > 8 || height > 6 || total < 6) {
        newPuzzle();
        return;
    }

    // TODO: debug
    console.log('target = ' + JSON.stringify(target));

    var res = solve(init, target);
    console.log('Solution in ' + res.length.toString() + ' steps');
    console.log(res);
};

var renderAll = function() {
    var ids = [];
    $('#program').find('li').each(function() {
        ids.push($(this).attr('id'));
    });

    var fs = R.map(R.prop(R.__, functions), ids);
    isomer.canvas.clear();
    var ts = C.transformationSteps(init, fs);

    if (R.eqDeep(R.last(ts), target)) {
        $('#targetshape h2').html('Solved!');
    } else {
        $('#targetshape h2').html('Target shape');
    }
    renderTarget();

    // TODO: debug
    console.log("transformationSteps = ");
    R.forEach(function(s) {
        console.log(JSON.stringify(s));
    }, ts);

    render(ts);
};

var liClickHandler = function() {
    var $li = $(this);
    var targetId = 'program';
    if ($li.parent().attr('id') === 'program') {
        targetId = 'available';
    }
    $li.remove();
    $li.on('click', liClickHandler);
    $('#' + targetId).append($li);

    renderAll();
};

var resetControls = function() {
    $('.sortable').empty();
    R.forEach(function(fid) {
        var $li = $('<li id="' + fid + '">' + addColorBlocks(fid) + '</li>');
        $li.on('click', liClickHandler);
        $('#available').append($li);
    }, R.keys(functions));
};

var init;
var target;

window.onload = function() {
    var canvas = document.getElementById('canvas');
    isomer = new Isomer(canvas);
    setIsomerConfig(config.isomer.normal);

    newPuzzle();
    resetControls();

    $('.sortable').each(function() {
        new Sortable(this, {
            group: 'function-lists',
            ghostClass: 'sortable-ghost',
            animation: 150,
            onSort: renderAll
        });
    });

    renderAll();

    $(window).on('keypress', function(ev) {
        if (ev.keyCode === 114) { // r: reset program
            resetControls();
            renderAll();
        } else if (ev.keyCode === 103) { // g: generate new puzzle
            newPuzzle();
            renderAll();
        }
    });
};