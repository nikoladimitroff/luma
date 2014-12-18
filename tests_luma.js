var expect = chai.expect;

var INTEGER_ERROR = 1;
var FLOATING_ERROR = 1e-2;

var runTests = function (tests) {
    for (var testCase in tests) {
        var int32 = "INT32_" + testCase;
        var simd = "SIMD_" + testCase;

        it(int32, tests[testCase].bind(undefined, luma));
        it(simd, tests[testCase].bind(undefined, lumasimd));
    }
};

describe("Color conversions", function () {
    var tests = {
        "rgba2hsla": function (luma) {
            // rgba(57, 172, 153, 1) == hsla(170, 50%, 45%, 1)
            var color = luma("rgba(57, 172, 153, 1)").utils.toHSLA(luma.result);
            expect(color.h).to.be.closeTo(170, INTEGER_ERROR);
            expect(color.s).to.be.closeTo(0.5, FLOATING_ERROR);
            expect(color.l).to.be.closeTo(0.45, FLOATING_ERROR);
            expect(color.a).to.be.closeTo(1, FLOATING_ERROR);

            // rgba(244, 103, 87, 0.25) == hsla(6, 88%, 65%, 0.25)
            color = luma("rgba(244, 103, 87, 0.25)").utils.toHSLA(luma.result);
            expect(color.h).to.be.closeTo(6, INTEGER_ERROR);
            expect(color.s).to.be.closeTo(0.88, FLOATING_ERROR);
            expect(color.l).to.be.closeTo(0.65, FLOATING_ERROR);
            expect(color.a).to.be.closeTo(0.25, FLOATING_ERROR);
        },
        "hsla2rgba": function (luma) {
            // rgba(57, 172, 153, 1) == hsla(170, 50%, 45%, 1)
            var color = luma("hsla(170, 50%, 45%, 1)").utils.toRGBA(luma.result);
            expect(color.r).to.be.closeTo(57, INTEGER_ERROR);
            expect(color.g).to.be.closeTo(172, INTEGER_ERROR);
            expect(color.b).to.be.closeTo(153, INTEGER_ERROR);
            expect(color.a).to.be.closeTo(1, FLOATING_ERROR);

            // rgba(244, 103, 87, 0.25) == hsla(6, 88%, 65%, 0.25)
            color = luma("hsla(6, 88%, 65%, 0.25)").utils.toRGBA(luma.result);
            expect(color.r).to.be.closeTo(244, INTEGER_ERROR);
            expect(color.g).to.be.closeTo(103, INTEGER_ERROR);
            expect(color.b).to.be.closeTo(87, INTEGER_ERROR);
            expect(color.a).to.be.closeTo(0.25, FLOATING_ERROR);
        },
        "hex2rgba": function (luma) {
            // rgba(57, 172, 153, 1) == #39ac99
            var color = luma("#39ac99").utils.toRGBA(luma.result);
            expect(color.r).to.be.closeTo(57, INTEGER_ERROR);
            expect(color.g).to.be.closeTo(172, INTEGER_ERROR);
            expect(color.b).to.be.closeTo(153, INTEGER_ERROR);
            expect(color.a).to.be.closeTo(1, FLOATING_ERROR);

            // rgba(244, 103, 87, 0.25) == #f46757
            color = luma("#f46757").utils.toRGBA(luma.result);
            expect(color.r).to.be.closeTo(244, INTEGER_ERROR);
            expect(color.g).to.be.closeTo(103, INTEGER_ERROR);
            expect(color.b).to.be.closeTo(87, INTEGER_ERROR);
            expect(color.a).to.be.closeTo(1, FLOATING_ERROR);
        }
    };

    runTests(tests);
});

describe("color operations", function () {
    var tests = {
        "hue shift": function (luma) {
            var red = luma.predefined.red.result;
            expect(luma(red).shiftHue(0).result).to.deep.equal(red);
            expect(luma(red).shiftHue(360).result).to.deep.equal(red);
            expect(luma(red).shiftHue(-360).result).to.deep.equal(red);
        },
        "saturate": function (luma) {
            var red = luma.predefined.red.result;
            expect(luma(red).saturate(0).result).to.deep.equal(red);
            expect(luma(red).saturate(1).result).to.deep.equal(red);
            var desaturated = luma(red).saturate(-1).utils.toRGBA();

            expect(desaturated.r).to.be.closeTo(128, INTEGER_ERROR);
            expect(desaturated.g).to.be.closeTo(128, INTEGER_ERROR);
            expect(desaturated.b).to.be.closeTo(128, INTEGER_ERROR);
            expect(desaturated.a).to.be.closeTo(1, FLOATING_ERROR);
        },
        "desaturate": function (luma) {
        }
    }
    runTests(tests);
});