// Do some initializing stuff
fabric.Object.prototype.set({
    transparentCorners: false,
    cornerColor: 'rgba(102,153,255,0.5)',
    cornerSize: 12,
    padding: 5
});

var canvas = window._canvas = new fabric.Canvas('c');

function loadSVG(id) {
    var elem = document.getElementById(id),
        svgStr = elem.innerHTML;

    fabric.loadSVGFromString(svgStr, function (objects, options) {
        // Group elements to fabric.PathGroup (more than 1 elements) or
        // to fabric.Path
        var loadedObject = fabric.util.groupSVGElements(objects, options);
        // Set sourcePath
        loadedObject.set('sourcePath', elem.getAttribute('data-url'));

        canvas.add(loadedObject);
        console.log(loadedObject);
        loadedObject.center().setCoords();
        canvas.renderAll();
    });
}

var loadSVGWithoutGrouping = function (id) {
    var elem = document.getElementById(id),
        svgStr = elem.innerHTML;

    fabric.loadSVGFromString(svgStr, function (objects) {
        canvas.add.apply(canvas, objects);
        canvas.renderAll();
    });
};

var groupObjects = function () {
    var activeGroup = canvas.getActiveGroup();
    if (activeGroup) {
        var objectsInGroup = activeGroup.getObjects();
        var objects = objectsInGroup;
        var left = activeGroup.getLeft();
        var top = activeGroup.getTop();
        var originLeft = activeGroup._originalLeft;
        var originTop = activeGroup._originalLeft;
        var coords = activeGroup.oCoords;
        console.log(activeGroup);
        var group = new fabric.Group(objects);
        group.set({
            _originalLeft: originLeft,
            _originalTop: originTop,
            left: left,
            top: top,
            oCoords: coords,
            type: "group"
        });
        console.log(group);
        canvas.discardActiveGroup();
        objectsInGroup.forEach(function (object) {
            canvas.remove(object);
        });
    }
    canvas.add(group);
    canvas.renderAll();

}

var otherGroup = function () {

    var activegroup = canvas.getActiveGroup();
    var objectsInGroup = activegroup.getObjects();
    console.log(activegroup);
    activegroup.clone(function (newgroup) {
        canvas.discardActiveGroup();
        objectsInGroup.forEach(function (object) {
            canvas.remove(object);
        });
        newgroup.set({
            fill: "",

        });
        canvas.add(newgroup);
        canvas.renderAll();
        console.log(newgroup);
    });
}

var unGroup = function () {
    var activeObject = canvas.getActiveObject();
    if (activeObject.type == "group") {
        var items = activeObject._objects;
        alert(items);
        activeObject._restoreObjectsState();
        canvas.remove(activeObject);
        for (var i = 0; i < items.length; i++) {
            canvas.add(items[i]);
            canvas.item(canvas.size() - 1).hasControls = true;
        }
        canvas.renderAll();
    }
}

document.getElementById('svg-load').addEventListener('click', function () {

    var elem = document.getElementById('option'),
        value = elem.options[elem.selectedIndex].value;
    switch (value) {
        case 'group':
            loadSVG("svg3");
            break;

        case 'wgroup':
            loadSVGWithoutGrouping("svg3");
            break;
    }

});

document.getElementById('json').addEventListener('click', function () {
    groupObjects();
});

document.getElementById('ugroup').addEventListener('click', function () {
    unGroup();
});



document.getElementById('inp-btn').addEventListener('click', function () {
    loadSVG("inp-ele");
});


document.getElementById('btn-btn').addEventListener('click', function () {
    loadSVG("button-ele");
});

document.getElementById('opt-btn').addEventListener('click', function () {
    loadSVG("opt-ele");
});


var can = document.querySelector('.upper-canvas');
var ctx = can.getContext("2d");
function wiring() {
    canvas.selection = false;
    canvas.forEachObject(function (o) {
        o.selectable = false;
    });
    if (document.getElementById('wire').checked) {
        var clicks = 0;
        var lastClick = [0, 0];

        can.addEventListener('click', drawLine, false);
        var x;
        var y;
        var rectc;
        rectc = can.getBoundingClientRect();
        function getCursorPosition(e) {


            if (e.pageX != undefined && e.pageY != undefined) {
                console.log(rectc);
                x = e.pageX - rectc.left;
                y = e.pageY - rectc.top;
            } else {
                console.log(rectc);
                x = e.clientX - rectc.left;
                y = e.clientY - rectc.top;
            }

            return [x, y];
        }

        function drawLine(e) {
            // console.log('clicked');
            x = getCursorPosition(e)[0] - this.offsetLeft;
            y = getCursorPosition(e)[1] - this.offsetTop;

            if (clicks != 1) {
                clicks++;
            } else {
                ctx.beginPath();
                ctx.moveTo(lastClick[0], lastClick[1]);
                ctx.lineTo(x, y, 6);

                ctx.strokeStyle = '#000000';
                ctx.stroke();

                clicks = 0;
            }

            lastClick = [x, y];
        }

        can.addEventListener('touchstart', drawLine_touch, false);

        function getCursorPosition_touch(e) {

            if (e.pageX != undefined && e.pageY != undefined) {
                x = e.pageX - rectc.left;
                y = e.pageY - rectc.top;
            } else {
                x = e.targetTouches[0].pageX - rectc.left;
                y = e.targetTouches[0].pageY - rectc.top;
            }
            return [x, y];
        }

        function drawLine_touch(e) {
            console.log('touched');

            x = getCursorPosition_touch(e)[0] - this.offsetLeft;
            y = getCursorPosition_touch(e)[1] - this.offsetTop;

            if (clicks != 1) {
                clicks++;
            } else {
                ctx.beginPath();
                ctx.moveTo(lastClick[0], lastClick[1]);
                ctx.lineTo(x, y, 6);

                ctx.strokeStyle = '#000000';
                ctx.stroke();

                clicks = 0;
            }

            lastClick = [x, y];
        }
    } else {
        console.log('select radio button for wiring')
    }
}


const imgAdded = (e) => {
    console.log(e)
    const inputElem = document.getElementById('myImg')
    const file = inputElem.files[0];
    reader.readAsDataURL(file)
}
const reader = new FileReader()
const inputFile = document.getElementById('myImg');
inputFile.addEventListener('change', imgAdded)

reader.addEventListener("load", () => {
    fabric.Image.fromURL(reader.result, img => {
        canvas.add(img)
        canvas.requestRenderAll()
    })
})