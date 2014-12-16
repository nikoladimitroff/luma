var expect = chai.expect;

var INTEGER_ERROR = 1;
var FLOATING_ERROR = 1e-2;
describe("Color conversions", function () {
    it("rgba2hsla", function () {
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
    });

    it("hsla2rgba", function () {
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
    });

    it("hex2rgba", function () {
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
    });
});

describe("color operations", function () {
    it("hue shift", function () {
        var red = luma.predefined.red.result;
        expect(luma(red).shiftHue(0).result).to.equal(red);
        expect(luma(red).shiftHue(360).result).to.equal(red);
        expect(luma(red).shiftHue(-360).result).to.equal(red);
    });

    it("saturate", function () {
        var red = luma.predefined.red.result;
        expect(luma(red).saturate(0).result).to.equal(red);
        expect(luma(red).saturate(1).result).to.equal(red);
        var desaturated = luma(red).saturate(-1).utils.toRGBA();

        console.log(luma(desaturated).saturate(1).rgba());
        expect(desaturated.r).to.be.closeTo(128, INTEGER_ERROR);
        expect(desaturated.g).to.be.closeTo(128, INTEGER_ERROR);
        expect(desaturated.b).to.be.closeTo(128, INTEGER_ERROR);
        expect(desaturated.a).to.be.closeTo(1, FLOATING_ERROR);
    });
    
    it("desaturate", function () {
        
    });
});