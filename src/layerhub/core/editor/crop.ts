// @ts-nocheck
import {fabric} from "fabric"
import Scene from "../../core/src/design/scene";

export class CropImage extends fabric.Image{
    static type="CropImage"
    public role: string = "regular"
    public scene: Scene
    _cropInfo
    _cropper
    _isCropping
    _background

    public left1 = 0;
    public top1 = 0;
    public scale1x = 0;
    public scale1y = 0;
    public width1 = 0;
    public height1 = 0;
    public angle1 = 0;

    onMouseUp(e){
        if(e.target?.type === 'Background' || ((e.target?.type !=='MaskImage') && e.target?.type !=='path') || (e.target?.type === 'MaskImage' && !e.target?.custom?.cropMode)){
            this.applyCrop()
        }
    }

}