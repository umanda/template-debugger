// @ts-nocheck
import {fabric} from "fabric"
import {LayerType} from "../common/constants"
import {FabricCanvas} from "../common/interfaces"
import type Config from "../common/config"

interface GuidelinesOptions {
    canvas: FabricCanvas
    config: Config
}

class Guidelines {
    private canvas: FabricCanvas
    private config: Config
    public viewportTransform: number[] = []
    public aligningLineOffset: any
    public aligningLineMargin: any
    public aligningLineWidth: any
    public aligningLineColor: any
    public ctx: CanvasRenderingContext2D

    constructor(options: GuidelinesOptions) {
        this.canvas = options.canvas
        this.config = options.config

        if (this.config.guidelines.enabled) {
            this.initAligningGuidelines(this.canvas)
        }
    }

    initAligningGuidelines(canvas) {
        var ctx = canvas.getSelectionContext(),
            aligningLineOffset = 3,
            aligningLineMargin = 12,
            aligningLineWidth = 1.2,
            aligningLineColor = "#e056fd",
            viewportTransform,
            zoom = canvas.getZoom()

        function drawVerticalLine(coords) {
            drawLine(
                coords.x + 0.5,
                coords.y1 > coords.y2 ? coords.y2 : coords.y1,
                coords.x + 0.5,
                coords.y2 > coords.y1 ? coords.y2 : coords.y1
            )
        }

        function drawHorizontalLine(coords) {
            drawLine(
                coords.x1 > coords.x2 ? coords.x2 : coords.x1,
                coords.y + 0.5,
                coords.x2 > coords.x1 ? coords.x2 : coords.x1,
                coords.y + 0.5
            )
        }

        function drawLine(x1, y1, x2, y2) {
            ctx.save();

            ctx.lineWidth = aligningLineWidth;
            ctx.strokeStyle = aligningLineColor;
            ctx.beginPath();
            ctx.moveTo(((x1 * zoom + canvas.viewportTransform[4])), ((y1 * zoom + canvas.viewportTransform[5])));
            ctx.lineTo(((x2 * zoom + canvas.viewportTransform[4])), ((y2 * zoom + canvas.viewportTransform[5])));
            ctx.stroke();
            ctx.restore();
        }

        function isInRange(value1: any, value2: any, customAligningLineMargin?: number) {
            return Math.abs(value1 - value2) <= aligningLineMargin
        }

        var verticalLines: any[] = []
        var horizontalLines: any[] = []

        canvas.on({
            'mouse:up': onMouseUp,
            'mouse:down': onMouseDown,
            'object:moving': onObjectMoving,
            'object:scaling': scalingAndRotatingGuidelines,
            'object:resizing': scalingAndRotatingGuidelines,
            'object:rotating': scalingAndRotatingGuidelines,
            'before:render': beforeRender,
            'after:render': afterRender,
        })

        function scalingAndRotatingGuidelines(e: Fabric.IObjectEvent) {
            if (canvas._isCropping) return
            let activeObject = e.target,
                canvasObjects = canvas.getObjects(),
                activeObjectCenter = activeObject.getCenterPoint(),
                activeObjectLeft = activeObjectCenter.x,
                activeObjectTop = activeObjectCenter.y,
                transform = canvas._currentTransform

            let newLeft:number[] = [activeObjectLeft], newTop:number[] = [activeObjectTop];

            aligningLineOffset = 3 / canvas.getZoom()
            aligningLineMargin = 5 / canvas.getZoom()

            if (!transform) return

            for (let i = canvasObjects.length; i--;) {
                if (
                    canvasObjects[i] === activeObject ||
                    canvasObjects[i].type === LayerType.BACKGROUND ||
                    canvasObjects[i].type === LayerType.BACKGROUND_CONTAINER
                )
                    continue
                newLeft = horizontalSnap(activeObject, canvasObjects[i], newLeft, true);
                newTop = verticalSnap(activeObject, canvasObjects[i], newTop, true);
            }
            let posX = activeObjectLeft;
            let posY = activeObjectTop;
            if (typeof newLeft[1] != "undefined") {
                posX = newLeft[1];
            }
            if (typeof newTop[1] != "undefined") {
                posY = newTop[1];
            }
            scalingSnap(posX, posY, activeObject);
        }
        
        function scalingSnap(posX:number, posY:number, activeObject:fabric.Object) {
            let activeObjectCenter = activeObject.getCenterPoint(),
                activeObjectLeft = activeObjectCenter.x,
                activeObjectTop = activeObjectCenter.y;

            switch(activeObject.__corner) {
                case 'tl':
                    if (posY < activeObjectTop) {
                        activeObject.set({scaleY: activeObject.scaleY + ((activeObjectTop - posY)/activeObject.height), top: posY - activeObject.getScaledHeight()/2});
                    }
                    if(posX < activeObjectLeft){
                        activeObject.set({scaleX: activeObject.scaleX + ((activeObjectLeft - posX)/activeObject.width), left: posX - activeObject.getScaledWidth()/2});
                    }
                    break;
                case 'mt':
                    if (posY < activeObjectTop) {
                        activeObject.set({scaleY: activeObject.scaleY + ((activeObjectTop - posY)/activeObject.height), top:posY - activeObject.getScaledHeight()/2});
                    }
                    else {
                        activeObject.set({scaleY: activeObject.scaleY - ((posY - activeObjectTop)/activeObject.height), top:posY - activeObject.getScaledHeight()/2});
                    }
                    break;
                case 'tr':
                    if (posX > activeObjectLeft) {
                        activeObject.set({scaleX: activeObject.scaleX + ((posX - activeObjectLeft)/activeObject.width)});
                    }
                    if (posY < activeObjectTop) {
                        activeObject.set({scaleY: activeObject.scaleY + ((activeObjectTop - posY)/activeObject.height), top: posY - activeObject.getScaledHeight()/2});
                    }
                    break;
                case 'ml':
                    if(posX < activeObjectLeft){
                        activeObject.set({scaleX: activeObject.scaleX + ((activeObjectLeft - posX)/activeObject.width), left:posX - activeObject.getScaledWidth()/2});
                    }else{
                        activeObject.set({scaleX: activeObject.scaleX - ((posX - activeObjectLeft)/activeObject.width), left: posX - activeObject.getScaledWidth()/2});
                    }
                    break;
                case 'mr':
                    if(posX > activeObjectLeft){
                        activeObject.set({scaleX: activeObject.scaleX + ((posX - activeObjectLeft)/activeObject.width)});
                    }else{
                        activeObject.set({scaleX: activeObject.scaleX - ((activeObjectLeft - posX)/activeObject.width)});
                    }
                    break;
                case 'bl':
                    if(posX < activeObjectLeft){
                        activeObject.set({scaleX: activeObject.scaleX + ((activeObjectLeft - posX)/activeObject.width), left:posX - activeObject.getScaledWidth()/2});
                    }
                    if(posY > activeObjectTop){
                        activeObject.set({scaleY: activeObject.scaleY + ((posY - activeObjectTop)/activeObject.height)});
                    }
                    break;
                case 'mb':
                    if (posY > activeObjectTop) {
                        activeObject.set({scaleY: activeObject.scaleY + ((posY - activeObjectTop)/activeObject.height)});
                    }else{
                        activeObject.set({scaleY: activeObject.scaleY - ((activeObjectTop - posY)/activeObject.height)});
                    }
                    break;
                case 'br':
                    if(posX > activeObjectLeft){
                        activeObject.set({scaleX: activeObject.scaleX + ((posX - activeObjectLeft)/activeObject.width)});
                    }
                    if(posY > activeObjectTop){
                        activeObject.set({scaleY: activeObject.scaleY + ((posY - activeObjectTop)/activeObject.height)});
                    }
                    break;
                default:
                    break;
            }
        }

        function onMouseDown() {
            viewportTransform = canvas.viewportTransform
            zoom = canvas.getZoom()
        }

        function onObjectMoving(e: Fabric.IObjectEvent, isScaling) {
            if (canvas._isCropping) return
            var activeObject = e.target,
                canvasObjects = canvas.getObjects(),
                activeObjectCenter = activeObject.getCenterPoint(),
                activeObjectLeft = activeObjectCenter.x,
                activeObjectTop = activeObjectCenter.y,
                transform = canvas._currentTransform
            if (!transform) return

            let newLeft:number[] = [activeObjectLeft], newTop:number[] = [activeObjectTop];

            aligningLineOffset = 3 / canvas.getZoom()
            aligningLineMargin = 5 / canvas.getZoom()

            for (var i = canvasObjects.length; i--;) {
                if (
                    canvasObjects[i] === activeObject ||
                    canvasObjects[i].type === LayerType.BACKGROUND ||
                    canvasObjects[i].type === LayerType.BACKGROUND_CONTAINER
                )
                    continue
                newLeft = horizontalSnap(activeObject, canvasObjects[i], newLeft, isScaling)
                newTop = verticalSnap(activeObject, canvasObjects[i], newTop, isScaling)
            }
            let posX = activeObjectLeft;
            let posY = activeObjectTop;
            if (typeof newLeft[1] != "undefined") {
                posX = newLeft[1];
            }
            if (typeof newTop[1] != "undefined") {
                posY = newTop[1];
            }
            activeObject.setPositionByOrigin(new fabric.Point(posX, posY), 'center', 'center');
        }

        function horizontalSnap(activeObject: fabric.Object, canvasObject:fabric.Object, newLeft:number[], isScaling:boolean) {
            let activeObjectCenter = activeObject.getCenterPoint(),
                activeObjectLeft = activeObjectCenter.x,
                activeObjectTop = activeObjectCenter.y,
                activeObjectBoundingRect = activeObject.getBoundingRect(),
                activeObjectHeight = activeObjectBoundingRect.height / viewportTransform[3],
                activeObjectWidth = activeObjectBoundingRect.width / viewportTransform[0];

            var objectCenter = canvasObject.getCenterPoint(),
                objectLeft = objectCenter.x,
                objectTop = objectCenter.y,
                objectBoundingRect = canvasObject.getBoundingRect(),
                objectHeight = objectBoundingRect.height / viewportTransform[3],
                objectWidth = objectBoundingRect.width / viewportTransform[0]

            if (objectWidth > activeObjectWidth && typeof isScaling == "undefined") {
                // snap by the horizontal center line
                if (isInRange(objectLeft, activeObjectLeft)) {
                    verticalLines.push({
                        x: objectLeft,
                        y1: (objectTop < activeObjectTop)
                            ? (objectTop - objectHeight / 2 - aligningLineOffset)
                            : (objectTop + objectHeight / 2 + aligningLineOffset),
                        y2: (activeObjectTop > objectTop)
                            ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
                            : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
                    });
                    newLeft.push(objectLeft);
                }
            }

            let leftComparison = objectLeft - objectWidth / 2;
            let rightComparison = activeObjectLeft - activeObjectWidth / 2;
            let diffComparison = 0;

            if (isInRange(leftComparison, rightComparison)) {
                verticalLines.push({
                    x: objectLeft - objectWidth / 2,
                    y1: (objectTop < activeObjectTop)
                        ? (objectTop - objectHeight / 2 - aligningLineOffset)
                        : (objectTop + objectHeight / 2 + aligningLineOffset),
                    y2: (activeObjectTop > objectTop)
                        ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
                        : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
                });
                newLeft.push(objectLeft - objectWidth / 2 + activeObjectWidth / 2 - diffComparison);
            }
            // snap by the right edge
            if (isInRange(objectLeft + objectWidth / 2, activeObjectLeft + activeObjectWidth / 2)) {
                verticalLines.push({
                    x: objectLeft + objectWidth / 2,
                    y1: (objectTop < activeObjectTop)
                        ? (objectTop - objectHeight / 2 - aligningLineOffset)
                        : (objectTop + objectHeight / 2 + aligningLineOffset),
                    y2: (activeObjectTop > objectTop)
                        ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
                        : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
                });
                newLeft.push(objectLeft + objectWidth / 2 - activeObjectWidth / 2);
            }

            // snap by the right edge
            if (isInRange(objectLeft + objectWidth / 2, activeObjectLeft - activeObjectWidth / 2)) {
                verticalLines.push({
                    x: objectLeft + objectWidth / 2,
                    y1: (objectTop < activeObjectTop)
                        ? (objectTop - objectHeight / 2 - aligningLineOffset)
                        : (objectTop + objectHeight / 2 + aligningLineOffset),
                    y2: (activeObjectTop > objectTop)
                        ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
                        : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
                });
                newLeft.push(objectLeft + objectWidth / 2 + activeObjectWidth / 2);
            }

            // snap by the left edge based on width
            if (isInRange(objectLeft - objectWidth / 2, activeObjectLeft + activeObjectWidth / 2)) {
                verticalLines.push({
                    x: objectLeft - objectWidth / 2,
                    y1: (objectTop < activeObjectTop)
                        ? (objectTop - objectHeight / 2 - aligningLineOffset)
                        : (objectTop + objectHeight / 2 + aligningLineOffset),
                    y2: (activeObjectTop > objectTop)
                        ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
                        : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
                });
                newLeft.push(objectLeft - objectWidth / 2 - activeObjectWidth / 2);
            }

            if (isInRange(activeObjectLeft, canvas.width / 2)) {
                if (canvasObject.type === "Frame") {
                    verticalLines.push({
                        x: canvas.width / 2,
                        y1: -5000,
                        y2: 5000,
                    })
                }else{
                    verticalLines.push({
                        x: canvas.width / 2,
                        y1: 0,
                        y2: canvas.height
                    });
                }
                newLeft.push(canvas.width / 2);
            }
            return newLeft;
        }

        function verticalSnap(activeObject: fabric.Object, canvasObject:fabric.Object, newTop:number[]) {
            let activeObjectCenter = activeObject.getCenterPoint(),
                activeObjectLeft = activeObjectCenter.x,
                activeObjectTop = activeObjectCenter.y,
                activeObjectBoundingRect = activeObject.getBoundingRect(),
                activeObjectHeight = activeObjectBoundingRect.height / viewportTransform[3],
                activeObjectWidth = activeObjectBoundingRect.width / viewportTransform[0];

            var objectCenter = canvasObject.getCenterPoint(),
                objectLeft = objectCenter.x,
                objectTop = objectCenter.y,
                objectBoundingRect = canvasObject.getBoundingRect(),
                objectHeight = objectBoundingRect.height / viewportTransform[3],
                objectWidth = objectBoundingRect.width / viewportTransform[0]

            if (objectHeight > activeObjectHeight) {
                // snap by the vertical center line
                if (isInRange(objectTop, activeObjectTop)) {
                    horizontalLines.push({
                        y: objectTop,
                        x1: (objectLeft < activeObjectLeft)
                            ? (objectLeft - objectWidth / 2 - aligningLineOffset)
                            : (objectLeft + objectWidth / 2 + aligningLineOffset),
                        x2: (activeObjectLeft > objectLeft)
                            ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
                            : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
                    });
                    newTop.push(objectTop);
                }
            }

            if (isInRange(objectTop - objectHeight / 2, activeObjectTop - activeObjectHeight / 2)) {
                horizontalLines.push({
                    y: objectTop - objectHeight / 2,
                    x1: (objectLeft < activeObjectLeft)
                        ? (objectLeft - objectWidth / 2 - aligningLineOffset)
                        : (objectLeft + objectWidth / 2 + aligningLineOffset),
                    x2: (activeObjectLeft > objectLeft)
                        ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
                        : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
                });
                newTop.push(objectTop - objectHeight / 2 + activeObjectHeight / 2);

            }
            // snap by the top edge
            if (isInRange(objectTop - objectHeight / 2, activeObjectTop + activeObjectHeight / 2)) {
                horizontalLines.push({
                    y: objectTop - objectHeight / 2,
                    x1: (objectLeft < activeObjectLeft)
                        ? (objectLeft - objectWidth / 2 - aligningLineOffset)
                        : (objectLeft + objectWidth / 2 + aligningLineOffset),
                    x2: (activeObjectLeft > objectLeft)
                        ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
                        : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
                });
                newTop.push(objectTop - objectHeight / 2 - activeObjectHeight / 2);
            }

            // snap by the bottom edge
            if (isInRange(objectTop + objectHeight / 2, activeObjectTop + activeObjectHeight / 2)) {
                horizontalLines.push({
                    y: objectTop + objectHeight / 2,
                    x1: (objectLeft < activeObjectLeft)
                        ? (objectLeft - objectWidth / 2 - aligningLineOffset)
                        : (objectLeft + objectWidth / 2 + aligningLineOffset),
                    x2: (activeObjectLeft > objectLeft)
                        ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
                        : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
                });
                newTop.push(objectTop + objectHeight / 2 - activeObjectHeight / 2);
            }
            // snap by the bottom edge and top of active object
            if (isInRange(objectTop + objectHeight / 2 + activeObjectHeight / 2, activeObjectTop)) {
                horizontalLines.push({
                    y: objectTop + objectHeight / 2,
                    x1: (objectLeft < activeObjectLeft)
                        ? (objectLeft - objectWidth / 2 - aligningLineOffset)
                        : (objectLeft + objectWidth / 2 + aligningLineOffset),
                    x2: (activeObjectLeft > objectLeft)
                        ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
                        : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
                });
                newTop.push(objectTop + objectHeight / 2 + activeObjectHeight / 2);
            }
            if (isInRange(activeObjectTop, canvas.height / 2)) {
                if (canvasObject.type === "Frame") {
                    horizontalLines.push({
                        y: canvas.height / 2,
                        x1: -5000,
                        x2: 5000
                    })
                }else{
                    horizontalLines.push({
                        y: canvas.height / 2,
                        x1: 0,
                        x2: canvas.width
                    });
                }
                newTop.push(canvas.height / 2);
            }
            return newTop;
        }

        function beforeRender() {
            canvas.clearContext(canvas.contextTop)
        }

        function afterRender() {
            for (let i = verticalLines.length; i--;) {
                drawVerticalLine(verticalLines[i])
            }
            for (let i = horizontalLines.length; i--;) {
                drawHorizontalLine(horizontalLines[i])
            }
            verticalLines.length = horizontalLines.length = 0
        }

        function onMouseUp() {
            verticalLines.length = horizontalLines.length = 0
            canvas.renderAll()
        }
    }
}

export default Guidelines