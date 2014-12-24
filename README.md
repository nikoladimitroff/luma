luma.js
=====

# The way its meant to be coloured

**luma.js** is a JS library that's meant to be the very best that no one ever
was in manipulating colours.

It actually consists of two libraries. Since they currently don't have assigned
names I'll call them lumaInt32 and lumaSIMD (temp names, don't get used to them).
lumaInt32 uses an int32 to store a standard RGBA colour and lots of bitwise
magic to manipulate it. It runs everywhere, it is really fast but it sacrifices
some precision.

On the other hand, you've got lumaSIMD. It uses the brand new [SIMD.js
API][simdjs]. SIMD stands for Single Instruction, Multiple Data and is an
optimization that lets your CPU execute several instructions at once. Up until
now, SIMD was only available to native languages. SIMD.js is currently
implemented only in [Firefox Nightly][ff-nightly]. An implementation in Chromium
is under review. While you are waiting for better browser compatibility,
you can use lumaSIMD with the [polyfill found here][simd-polyfill].

Luma comes with many features - it transforms from one
colour space to another, adds, subtracts, scales, interpolates, saturates,
whatever you can think of. Feel free to add suggestions if you are missing
a feature.

## Why
I needed a library that excelled in colour manipulation but after looking around
I found that all of the existing solutions had huge room for improvements. So
I built it myself.

## How fast it is?
See for yourself by running the [provided tests][tests].

Here are the results on my [ASUS K53SV][assus](in ms):
```
Chrome:

Tests starting...
Time spent in CHROMA: 2867
Time spent in LUMA: 101
Time spent in LUMA SIMD: 121

FF nightly:

Time spent in CHROMA: 3978
Time spent in LUMA: 42
Time spent in LUMA SIMD: 116
```


[simdjs]: https://hacks.mozilla.org/2014/10/introducing-simd-js/
[ff-nightly]: https://nightly.mozilla.org/
[simd-polyfill]: https://github.com/johnmccutchan/ecmascript_simd

[tests]: https://github.com/NikolaDimitroff/luma/blob/master/performance/index.html
[assus]: http://www.asus.com/Notebooks_Ultrabooks/K53SV/