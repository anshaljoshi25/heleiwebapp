/**
 * Created by arunsharma on 29/2/16.
 */
'use strict';

var gm = require('gm');

exports.resizeImage = function (fqnImage, w, h, callback) {
    //try to save 32x32, 64x62 ad 128x128
    var wxh = w + "x" + h;
    gm(fqnImage)
        .resize(w, h)
        .noProfile()
        .autoOrient()
        .write(fqnImage + "_" + wxh, function (err) {
            if (err) {
                console.log("Error while creating " + wxh + " version of input image : " + fqnImage);
                callback(false);
                return;
            }

            console.log("Created " + wxh + " version!");
            callback(true);
            return;
        });
};