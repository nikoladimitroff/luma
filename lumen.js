(function (window) {
    var utils = {
        clamp: function (x, min, max) {
            if (x < min)
                return min;
            if (x > max)
                return max;
            return x;
        }
    };

    var lumen = {};
    Object.defineProperty(lumen, "result", {
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

    lumen.hex = function (color) {
        color = color !== undefined ? color : lastResult;
        var asHex = (color >>> 8).toString(16);
        return "#000000".substr(0, 7 - asHex.length) + asHex;
    };

    lumen.rgba = function (color) {
        color = color !== undefined ? color : lastResult;
        return "rgba(" + 
                     ((color & masks.r) >>> offsets.r) + ", " + 
                     ((color & masks.g) >>> offsets.g) + ", " + 
                     ((color & masks.b) >>> offsets.b) + ", " + 
                     ((color & masks.a) >>> offsets.a) / INT8_MAX + ")";
    };

    lumen.color = function (value) {
        if (typeof value === "object") {
            lastResult = value.r << offsets.r |
                         value.g << offsets.g |
                         value.b << offsets.b |
                         value.a << offsets.a;
        }
        else if (PREDEFINED[value] !== undefined) {
            lastResult = PREDEFINED[value];
        }
        return this;
    };

    lumen.complementary = function (color) {
        color = color || lastResult;
        lastResult = ~color | (color & masks.a) << offsets.a;
        return this;
    };

    lumen.brighten = function (factor) {
        var color = lastResult;
        lastResult = utils.clamp(factor * ((color & masks.r) >>> offsets.r), 0, INT8_MAX) << offsets.r |
                     utils.clamp(factor * ((color & masks.g) >>> offsets.g), 0, INT8_MAX) << offsets.g |
                     utils.clamp(factor * ((color & masks.b) >>> offsets.b), 0, INT8_MAX) << offsets.b |
                     ((color & masks.a) >>> offsets.a) << offsets.a;
        return this;
    };

    lumen.dim = function (factor) {
        this.brighten(1 / factor);
        return this;
    };

    lumen.add = function (color) {
        var c1 = lastResult,
            c2 = color;
        lastResult = utils.clamp(((c1 & masks.r) >>> offsets.r) + ((c2 & masks.r) >>> offsets.r), 0, INT8_MAX) << offsets.r |
                     utils.clamp(((c1 & masks.g) >>> offsets.g) + ((c2 & masks.g) >>> offsets.g), 0, INT8_MAX) << offsets.g |
                     utils.clamp(((c1 & masks.b) >>> offsets.b) + ((c2 & masks.b) >>> offsets.b), 0, INT8_MAX) << offsets.b |
                     utils.clamp(((c1 & masks.a) >>> offsets.a) + ((c2 & masks.a) >>> offsets.a), 0, INT8_MAX) << offsets.a;
        return this;
    };

    lumen.subtract = function (color) {
        var result = lastResult;
        this.complementary(color).add(result);
        return this;
    };

    var PREDEFINED = {
        black:                  0x000000FF,
        silver:                 0xC0C0C0FF,
        gray:                   0x808080FF,
        white:                  0xFFFFFFFF,
        maroon:                 0x800000FF,
        red:                    0xFF0000FF,
        purple:                 0x800080FF,
        fuchsia:                0xFF00FFFF,
        green:                  0x008000FF,
        lime:                   0x00FF00FF,
        olive:                  0x808000FF,
        yellow:                 0xFFFF00FF,
        navy:                   0x000080FF,
        blue:                   0x0000FFFF,
        teal:                   0x008080FF,
        aqua:                   0x00FFFFFF,
        orange:                 0xFFA500FF,
        aliceblue:              0xF0F8FFFF,
        antiquewhite:           0xFAEBD7FF,
        aquamarine:             0x7FFFD4FF,
        azure:                  0xF0FFFFFF,
        beige:                  0xF5F5DCFF,
        bisque:                 0xFFE4C4FF,
        blanchedalmond:         0xFFE4C4FF,
        blueviolet:             0x8A2BE2FF,
        brown:                  0xA52A2AFF,
        burlywood:              0xDEB887FF,
        cadetblue:              0x5F9EA0FF,
        chartreuse:             0x7FFF00FF,
        chocolate:              0xD2691EFF,
        coral:                  0xFF7F50FF,
        cornflowerblue:         0x6495EDFF,
        cornsilk:               0xFFF8DCFF,
        crimson:                0xDC143CFF,
        darkblue:               0x00008BFF,
        darkcyan:               0x008B8BFF,
        darkgoldenrod:          0xB8860BFF,
        darkgray:               0xA9A9A9FF,
        darkgreen:              0x006400FF,
        darkgrey:               0xA9A9A9FF,
        darkkhaki:              0xBDB76BFF,
        darkmagenta:            0x8B008BFF,
        darkolivegreen:         0x556B2FFF,
        darkorange:             0xFF8C00FF,
        darkorchid:             0x9932CCFF,
        darkred:                0x8B0000FF,
        darksalmon:             0xE9967AFF,
        darkseagreen:           0x8FBC8FFF,
        darkslateblue:          0x483D8BFF,
        darkslategray:          0x2F4F4FFF,
        darkslategrey:          0x2F4F4FFF,
        darkturquoise:          0x00CED1FF,
        darkviolet:             0x9400D3FF,
        deeppink:               0xFF1493FF,
        deepskyblue:            0x00BFFFFF,
        dimgray:                0x696969FF,
        dimgrey:                0x696969FF,
        dodgerblue:             0x1E90FFFF,
        firebrick:              0xB22222FF,
        floralwhite:            0xFFFAF0FF,
        forestgreen:            0x228B22FF,
        gainsboro:              0xDCDCDCFF,
        ghostwhite:             0xF8F8FFFF,
        gold:                   0xFFD700FF,
        goldenrod:              0xDAA520FF,
        greenyellow:            0xADFF2FFF,
        grey:                   0x808080FF,
        honeydew:               0xF0FFF0FF,
        hotpink:                0xFF69B4FF,
        indianred:              0xCD5C5CFF,
        indigo:                 0x4B0082FF,
        ivory:                  0xFFFFF0FF,
        khaki:                  0xF0E68CFF,
        lavender:               0xE6E6FAFF,
        lavenderblush:          0xFFF0F5FF,
        lawngreen:              0x7CFC00FF,
        lemonchiffon:           0xFFFACDFF,
        lightblue:              0xADD8E6FF,
        lightcoral:             0xF08080FF,
        lightcyan:              0xE0FFFFFF,
        lightgoldenrodyellow:   0xFAFAD2FF,
        lightgray:              0xD3D3D3FF,
        lightgreen:             0x90EE90FF,
        lightgrey:              0xD3D3D3FF,
        lightpink:              0xFFB6C1FF,
        lightsalmon:            0xFFA07AFF,
        lightseagreen:          0x20B2AAFF,
        lightskyblue:           0x87CEFAFF,
        lightslategray:         0x778899FF,
        lightslategrey:         0x778899FF,
        lightsteelblue:         0xB0C4DEFF,
        lightyellow:            0xFFFFE0FF,
        limegreen:              0x32CD32FF,
        linen:                  0xFAF0E6FF,
        mediumaquamarine:       0x66CDAAFF,
        mediumblue:             0x0000CDFF,
        mediumorchid:           0xBA55D3FF,
        mediumpurple:           0x9370DBFF,
        mediumseagreen:         0x3CB371FF,
        mediumslateblue:        0x7B68EEFF,
        mediumspringgreen:      0x00FA9AFF,
        mediumturquoise:        0x48D1CCFF,
        mediumvioletred:        0xC71585FF,
        midnightblue:           0x191970FF,
        mintcream:              0xF5FFFAFF,
        mistyrose:              0xFFE4E1FF,
        moccasin:               0xFFE4B5FF,
        navajowhite:            0xFFDEADFF,
        oldlace:                0xFDF5E6FF,
        olivedrab:              0x6B8E23FF,
        orangered:              0xFF4500FF,
        orchid:                 0xDA70D6FF,
        palegoldenrod:          0xEEE8AAFF,
        palegreen:              0x98FB98FF,
        paleturquoise:          0xAFEEEEFF,
        palevioletred:          0xDB7093FF,
        papayawhip:             0xFFEFD5FF,
        peachpuff:              0xFFDAB9FF,
        peru:                   0xCD853FFF,
        pink:                   0xFFC0CBFF,
        plum:                   0xDDA0DDFF,
        powderblue:             0xB0E0E6FF,
        rosybrown:              0xBC8F8FFF,
        royalblue:              0x4169E1FF,
        saddlebrown:            0x8B4513FF,
        salmon:                 0xFA8072FF,
        sandybrown:             0xF4A460FF,
        seagreen:               0x2E8B57FF,
        seashell:               0xFFF5EEFF,
        sienna:                 0xA0522DFF,
        skyblue:                0x87CEEBFF,
        slateblue:              0x6A5ACDFF,
        slategray:              0x708090FF,
        slategrey:              0x708090FF,
        snow:                   0xFFFAFAFF,
        springgreen:            0x00FF7FFF,
        steelblue:              0x4682B4FF,
        tan:                    0xD2B48CFF,
        thistle:                0xD8BFD8FF,
        tomato:                 0xFF6347FF,
        turquoise:              0x40E0D0FF,
        violet:                 0xEE82EEFF,
        wheat:                  0xF5DEB3FF,
        whitesmoke:             0xF5F5F5FF,
        yellowgreen:            0x9ACD32FF,
        rebeccapurple:          0x663399FF
    };

    lumen.predefined = Object.keys(PREDEFINED);
    window.lumen = lumen;
})(window || {});
