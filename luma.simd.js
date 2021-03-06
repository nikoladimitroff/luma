(function (window) {
    "use strict";
    var utils = {
        clamp: function (x, min, max) {
            if (x < min)
                return min;
            if (x > max)
                return max;
            return x;
        },

        toHSLA: function (color) {
            color = color !== undefined ? color : lastResult;

            var red = color.x,
                green = color.y,
                blue = color.z,
                alpha = color.w;

            var max = Math.max(red, green, blue),
                min = Math.min(red, green, blue);

            var chroma = max - min;
            var hue = 0;
            if (chroma !== 0) {
                switch (max) {
                    case red:
                        hue = ((green - blue) / chroma) % 6;
                        if (green < blue)
                            hue += 6;
                        break;
                    case green: hue = (blue - red) / chroma + 2; break;
                    case blue: hue = (red - green) / chroma + 4; break;
                };
                hue *= 60;
            }
            var lightness = (max + min) / 2;
            var saturation = 0;
            if (lightness !== 0 && lightness !== 1)
                saturation = chroma / (1 - Math.abs(2 * lightness - 1));

            return {
                h: hue,
                s: saturation,
                l: lightness,
                a: alpha
            };
        },
        fromHSLA: function (hue, saturation, lightness, alpha) {
            var red = 0,
                green = 0,
                blue = 0,
                chroma = 0;
            if (saturation !== 0) {
                var chroma = saturation * (1 - Math.abs(2 * lightness - 1)),
                    huePrime = hue / 60,
                    x = chroma * (1 - Math.abs(huePrime % 2 - 1));
                
                if (huePrime >= 0 && huePrime < 1) {
                    red = chroma; green = x;
                }
                else if (huePrime >= 1 && huePrime < 2) {
                    red = x; green = chroma;
                }
                else if (huePrime >= 2 && huePrime < 3) {
                    green = chroma; blue = x;
                }
                else if (huePrime >= 3 && huePrime < 4) {
                    green = x; blue = chroma;
                }
                else if (huePrime >= 4 && huePrime < 5) {
                    red = x; blue = chroma;
                }
                else if (huePrime >= 5 && huePrime < 6) {
                    red = chroma; blue = x;
                }
            }
            var min = lightness - chroma / 2;
            red += min;
            green += min;
            blue += min;
            return SIMD.float32x4(red, green, blue, alpha);
        },
        toRGBA: function (color) {
            color = color !== undefined ? color : lastResult;

            return {
                r: ~~(color.x * 255),
                g: ~~(color.y * 255),
                b: ~~(color.z * 255),
                a: color.w
            };
        },

        rgbaRegex: new RegExp("rgba\\((\\d{1,3}),\\s*(\\d{1,3}),\\s*(\\d{1,3}),\\s*(\\d(?:\\.\\d+)?)\\)"),
        hslaRegex: new RegExp("hsla\\((\\d+(?:\\.\\d+)?),\\s*(\\d+(?:\\.\\d+)?)%,\\s*(\\d+(?:\\.\\d+)?)%,\\s*(\\d+(?:\\.\\d+)?)\\)"),
        hexRegex: new RegExp("#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})"),
        parseColor: function (colorAsString) {
            var match;
            if ((match = utils.rgbaRegex.exec(colorAsString)) !== null) {
                return SIMD.float32x4(~~match[1] / INT8_MAX,
                                      ~~match[2] / INT8_MAX,
                                      ~~match[3] / INT8_MAX,
                                      parseFloat(match[4]));
            }
            if ((match = utils.hslaRegex.exec(colorAsString)) !== null) {
                var hue = parseFloat(match[1]),
                    saturation = parseFloat(match[2]) / 100,
                    lightness = parseFloat(match[3]) / 100,
                    alpha = parseFloat(match[4]);

                return utils.fromHSLA(hue, saturation, lightness, alpha);
            }
            if ((match = utils.hexRegex.exec(colorAsString)) !== null) {
                return SIMD.float32x4(parseInt(match[1], 16) / INT8_MAX,
                                      parseInt(match[2], 16) / INT8_MAX,
                                      parseInt(match[3], 16) / INT8_MAX,
                                      1);
            }
        },
        drawHslCircle: function (context, color, center, radius, steps, radiusSteps) {
            color = luma(color).result;
            var DEGREES_IN_CIRCUMFERENCE = 360;
            var degreesPerStep = DEGREES_IN_CIRCUMFERENCE / steps;
            var distancePerRadiusStep = radius / radiusSteps;

            for (var i = 0; i < steps; i++) {
                for (var j = 0; j < radiusSteps; j++) {
                    context.strokeStyle = luma(color)
                                          .shiftHue(i * degreesPerStep)
                                          .desaturate(1 - j / radiusSteps)
                                          .rgba();

                    var angle = Math.PI * (i * degreesPerStep) / 180;
                    var nextAngle = Math.PI * ((i + 1) * degreesPerStep) / 180;
                    var distance = j * distancePerRadiusStep,
                        nextDistance = (j + 1) * distancePerRadiusStep;
                    var c1 = new Vector2(center.x + distance * Math.cos(angle),
                                         center.y + distance * Math.sin(angle));
                    var c2 = new Vector2(center.x + distance * Math.cos(nextAngle),
                                         center.y + distance * Math.sin(nextAngle));

                    var v = new Vector2(center.x + nextDistance * Math.cos(angle),
                                        center.y + nextDistance * Math.sin(angle));
                    var u = new Vector2(center.x + nextDistance * Math.cos(nextAngle),
                                        center.y + nextDistance * Math.sin(nextAngle));

                    context.beginPath();
                    context.moveTo(c1.x, c1.y);
                    context.lineTo(v.x, v.y);
                    context.lineTo(u.x, u.y);
                    context.lineTo(c2.x, c2.y);
                    context.closePath();
                    context.stroke();
                }
            }
        }
    };

    var luma = function (value) {
        if (typeof value === "object" && value.constructor === SIMD.float32x4) {
            lastResult = value;
        }
        else if (typeof value === "object" &&
            value.r !== undefined &&
            value.g !== undefined &&
            value.b !== undefined &&
            value.a !== undefined) {

            lastResult = SIMD.float32x4(value.r,
                                        value.g,
                                        value.b,
                                        value.a);
        }
        else if (PREDEFINED[value] !== undefined) {
            lastResult = PREDEFINED[value];
        }
        else if (typeof value == "string") {
            lastResult = utils.parseColor(value);
        }
        else if (typeof value == "number") {
            lastResult = SIMD.float32x4(((value & masks.r) >>> offsets.r) / INT8_MAX,
                                        ((value & masks.g) >>> offsets.g) / INT8_MAX,
                                        ((value & masks.b) >>> offsets.b) / INT8_MAX,
                                        ((value & masks.a) >>> offsets.a) / INT8_MAX);
            ;
        }
        return luma;
    };

    Object.defineProperty(luma, "result", {
        get: function () {
            return lastResult;
        }
    });

    var lastResult = null;

    var masks = {
        r: 0xFF000000,
        g: 0x00FF0000,
        b: 0x0000FF00,
        a: 0x000000FF
    };

    var offsets = {
        r: 24,
        g: 16,
        b: 8,
        a: 0
    };

    var INT8_MAX = 0xFF;
    var INT32_MAX = 0xFFFFFFFF;

    luma.hex = function (color) {
        throw Error("Not implemented");
        color = color !== undefined ? color : lastResult;
        var asHex = (color >>> 8).toString(16);
        return "#000000".substr(0, 7 - asHex.length) + asHex;
    };

    luma.rgba = function (color) {
        color = color !== undefined ? color : lastResult;
        return "rgba(" + 
                     ~~(color.x * 255) + ", " + 
                     ~~(color.y * 255) + ", " + 
                     ~~(color.z * 255) + ", " + 
                     color.w + ")";
    };

    luma.hsla = function (color) {
        color = color !== undefined ? color : lastResult;
        var hsla = utils.toHSLA(color);

        return "hsla(" + 
                     hsla.h + ", " + 
                     hsla.s * 100 + "%, " + 
                     hsla.l * 100 + "%, " + 
                     hsla.a + ")";
    };

    luma.random = function () {
        lastResult = SIMD.float32x4(Math.random(),
                                    Math.random(),
                                    Math.random(),
                                    Math.random());
        return this;
    }

    var MAX = SIMD.float32x4(1, 1, 1, 1);
    var MIN = SIMD.float32x4(0, 0, 0, 1);

    luma.complementary = function (color) {
        color = color || lastResult;
        lastResult = SIMD.float32x4.sub(MAX, color);
        lastResult = SIMD.float32x4.withW(lastResult, 1);
        return this;
    };

    
    luma.brighten = function (factor) {
        var color = lastResult;
        lastResult = SIMD.float32x4.clamp(color, MIN, MAX);
        return this;
    };

    luma.dim = function (factor) {
        this.brighten(1 / factor);
        return this;
    };

    luma.add = function (color) {
        var c1 = lastResult,
            c2 = color;
        lastResult = SIMD.float32x4.clamp(SIMD.float32x4.add(c1, c2), MIN, MAX);
        return this;
    };

    luma.subtract = function (color) {
        var c1 = lastResult,
            c2 = color;
        lastResult = SIMD.float32x4.clamp(SIMD.float32x4.sub(c1, c2), MIN, MAX);
        return this;
    };

    luma.shiftHue = function (angle) {
        var color = utils.toHSLA(lastResult);
        color.h = (color.h + angle) % 360;
        lastResult = utils.fromHSLA(color.h, color.s, color.l, color.a);
        return this;
    };
    
    luma.saturate = function (amount) {
        var color = utils.toHSLA(lastResult);
        color.s = utils.clamp(color.s + amount, 0, 1);
        lastResult = utils.fromHSLA(color.h, color.s, color.l, color.a);
        return this;
    };
    
    luma.desaturate = function (amount) {
        this.saturate(-amount);
        return this;
    };

    luma.grayscale = function () {
        var lightness = 0.21 * lastResult.x +
                        0.72 * lastResult.y +
                        0.07 * lastResult.z;
        lastResult = SIMD.float32x4(lightness,
                                    lightness,
                                    lightness,
                                    lastResult.w);
        return this;
    };


    var PREDEFINED = {
        black:                  ~~0x000000FF,
        silver:                 ~~0xC0C0C0FF,
        gray:                   ~~0x808080FF,
        white:                  ~~0xFFFFFFFF,
        maroon:                 ~~0x800000FF,
        red:                    ~~0xFF0000FF,
        purple:                 ~~0x800080FF,
        fuchsia:                ~~0xFF00FFFF,
        green:                  ~~0x008000FF,
        lime:                   ~~0x00FF00FF,
        olive:                  ~~0x808000FF,
        yellow:                 ~~0xFFFF00FF,
        navy:                   ~~0x000080FF,
        blue:                   ~~0x0000FFFF,
        teal:                   ~~0x008080FF,
        aqua:                   ~~0x00FFFFFF,
        orange:                 ~~0xFFA500FF,
        aliceblue:              ~~0xF0F8FFFF,
        antiquewhite:           ~~0xFAEBD7FF,
        aquamarine:             ~~0x7FFFD4FF,
        azure:                  ~~0xF0FFFFFF,
        beige:                  ~~0xF5F5DCFF,
        bisque:                 ~~0xFFE4C4FF,
        blanchedalmond:         ~~0xFFE4C4FF,
        blueviolet:             ~~0x8A2BE2FF,
        brown:                  ~~0xA52A2AFF,
        burlywood:              ~~0xDEB887FF,
        cadetblue:              ~~0x5F9EA0FF,
        chartreuse:             ~~0x7FFF00FF,
        chocolate:              ~~0xD2691EFF,
        coral:                  ~~0xFF7F50FF,
        cornflowerblue:         ~~0x6495EDFF,
        cornsilk:               ~~0xFFF8DCFF,
        crimson:                ~~0xDC143CFF,
        darkblue:               ~~0x00008BFF,
        darkcyan:               ~~0x008B8BFF,
        darkgoldenrod:          ~~0xB8860BFF,
        darkgray:               ~~0xA9A9A9FF,
        darkgreen:              ~~0x006400FF,
        darkgrey:               ~~0xA9A9A9FF,
        darkkhaki:              ~~0xBDB76BFF,
        darkmagenta:            ~~0x8B008BFF,
        darkolivegreen:         ~~0x556B2FFF,
        darkorange:             ~~0xFF8C00FF,
        darkorchid:             ~~0x9932CCFF,
        darkred:                ~~0x8B0000FF,
        darksalmon:             ~~0xE9967AFF,
        darkseagreen:           ~~0x8FBC8FFF,
        darkslateblue:          ~~0x483D8BFF,
        darkslategray:          ~~0x2F4F4FFF,
        darkslategrey:          ~~0x2F4F4FFF,
        darkturquoise:          ~~0x00CED1FF,
        darkviolet:             ~~0x9400D3FF,
        deeppink:               ~~0xFF1493FF,
        deepskyblue:            ~~0x00BFFFFF,
        dimgray:                ~~0x696969FF,
        dimgrey:                ~~0x696969FF,
        dodgerblue:             ~~0x1E90FFFF,
        firebrick:              ~~0xB22222FF,
        floralwhite:            ~~0xFFFAF0FF,
        forestgreen:            ~~0x228B22FF,
        gainsboro:              ~~0xDCDCDCFF,
        ghostwhite:             ~~0xF8F8FFFF,
        gold:                   ~~0xFFD700FF,
        goldenrod:              ~~0xDAA520FF,
        greenyellow:            ~~0xADFF2FFF,
        grey:                   ~~0x808080FF,
        honeydew:               ~~0xF0FFF0FF,
        hotpink:                ~~0xFF69B4FF,
        indianred:              ~~0xCD5C5CFF,
        indigo:                 ~~0x4B0082FF,
        ivory:                  ~~0xFFFFF0FF,
        khaki:                  ~~0xF0E68CFF,
        lavender:               ~~0xE6E6FAFF,
        lavenderblush:          ~~0xFFF0F5FF,
        lawngreen:              ~~0x7CFC00FF,
        lemonchiffon:           ~~0xFFFACDFF,
        lightblue:              ~~0xADD8E6FF,
        lightcoral:             ~~0xF08080FF,
        lightcyan:              ~~0xE0FFFFFF,
        lightgoldenrodyellow:   ~~0xFAFAD2FF,
        lightgray:              ~~0xD3D3D3FF,
        lightgreen:             ~~0x90EE90FF,
        lightgrey:              ~~0xD3D3D3FF,
        lightpink:              ~~0xFFB6C1FF,
        lightsalmon:            ~~0xFFA07AFF,
        lightseagreen:          ~~0x20B2AAFF,
        lightskyblue:           ~~0x87CEFAFF,
        lightslategray:         ~~0x778899FF,
        lightslategrey:         ~~0x778899FF,
        lightsteelblue:         ~~0xB0C4DEFF,
        lightyellow:            ~~0xFFFFE0FF,
        limegreen:              ~~0x32CD32FF,
        linen:                  ~~0xFAF0E6FF,
        mediumaquamarine:       ~~0x66CDAAFF,
        mediumblue:             ~~0x0000CDFF,
        mediumorchid:           ~~0xBA55D3FF,
        mediumpurple:           ~~0x9370DBFF,
        mediumseagreen:         ~~0x3CB371FF,
        mediumslateblue:        ~~0x7B68EEFF,
        mediumspringgreen:      ~~0x00FA9AFF,
        mediumturquoise:        ~~0x48D1CCFF,
        mediumvioletred:        ~~0xC71585FF,
        midnightblue:           ~~0x191970FF,
        mintcream:              ~~0xF5FFFAFF,
        mistyrose:              ~~0xFFE4E1FF,
        moccasin:               ~~0xFFE4B5FF,
        navajowhite:            ~~0xFFDEADFF,
        oldlace:                ~~0xFDF5E6FF,
        olivedrab:              ~~0x6B8E23FF,
        orangered:              ~~0xFF4500FF,
        orchid:                 ~~0xDA70D6FF,
        palegoldenrod:          ~~0xEEE8AAFF,
        palegreen:              ~~0x98FB98FF,
        paleturquoise:          ~~0xAFEEEEFF,
        palevioletred:          ~~0xDB7093FF,
        papayawhip:             ~~0xFFEFD5FF,
        peachpuff:              ~~0xFFDAB9FF,
        peru:                   ~~0xCD853FFF,
        pink:                   ~~0xFFC0CBFF,
        plum:                   ~~0xDDA0DDFF,
        powderblue:             ~~0xB0E0E6FF,
        rosybrown:              ~~0xBC8F8FFF,
        royalblue:              ~~0x4169E1FF,
        saddlebrown:            ~~0x8B4513FF,
        salmon:                 ~~0xFA8072FF,
        sandybrown:             ~~0xF4A460FF,
        seagreen:               ~~0x2E8B57FF,
        seashell:               ~~0xFFF5EEFF,
        sienna:                 ~~0xA0522DFF,
        skyblue:                ~~0x87CEEBFF,
        slateblue:              ~~0x6A5ACDFF,
        slategray:              ~~0x708090FF,
        slategrey:              ~~0x708090FF,
        snow:                   ~~0xFFFAFAFF,
        springgreen:            ~~0x00FF7FFF,
        steelblue:              ~~0x4682B4FF,
        tan:                    ~~0xD2B48CFF,
        thistle:                ~~0xD8BFD8FF,
        tomato:                 ~~0xFF6347FF,
        turquoise:              ~~0x40E0D0FF,
        violet:                 ~~0xEE82EEFF,
        wheat:                  ~~0xF5DEB3FF,
        whitesmoke:             ~~0xF5F5F5FF,
        yellowgreen:            ~~0x9ACD32FF,
        rebeccapurple:          ~~0x663399FF
    };

    luma.predefined = {};
    Object.keys(PREDEFINED).forEach(function (colorName) {
        PREDEFINED[colorName] = luma(PREDEFINED[colorName]).result;
    });
    Object.keys(PREDEFINED).forEach(function (colorName) {
        Object.defineProperty(luma.predefined, colorName, {
            get: function () {
                lastResult = PREDEFINED[colorName];
                return luma;
            },
            enumerable: true,
        });
    });
    luma.utils = utils;
    window.lumasimd = luma;
})(window || {});
