// Copyright (c) Cognitect, Inc.
// All rights reserved.

"use strict";

var transit = require("../target/transit.js");

// =============================================================================
// Equality & Hashing
// =============================================================================

exports.testEquality = function(test) {

    test.ok(transit.equals(1, 1));
    test.ok(!transit.equals(1, 2));
    test.ok(transit.equals(transit.integer("1"), transit.integer("1")));
    test.ok(!transit.equals(transit.integer("1"), transit.integer("2")));
    test.ok(transit.equals("foo", "foo"));
    test.ok(!transit.equals("foo", "bar"));
    test.ok(transit.equals([], []));
    test.ok(transit.equals([1,2,3], [1,2,3]));
    test.ok(!transit.equals([2,2,3], [1,2,3]));
    test.ok(transit.equals([1,[2,3],4], [1,[2,3],4]));
    test.ok(!transit.equals([1,[3,3],4], [1,[2,3],4]));
    test.ok(!transit.equals([1,2,3], {}));
    test.ok(transit.equals({}, {}));
    test.ok(transit.equals({foo: "bar"}, {foo: "bar"}));
    test.ok(!transit.equals({foo: "bar", baz: "woz"}, {foo: "bar"}));
    test.ok(!transit.equals({foo: "bar"}, {foo: "baz"}));
    test.ok(transit.equals(transit.date(1399471321791), transit.date(1399471321791)));
    test.ok(!transit.equals(transit.date(1399471321791), transit.date(1399471321792)));

    var o  = {foo: "bar", baz: "woz"},
        hc = transit.hash(o);

    test.ok(transit.equals(o, {foo: "bar", baz: "woz"}));

    var o1  = {foo: "bar", baz: "woz"},
        hc1 = transit.hash(o1),
        o2  = {foo: "bar", baz: "woz"},
        hc2 = transit.hash(o2);

    test.ok(!transit.equals(null, 1));
    test.ok(!transit.equals(1, null));
    test.ok(!transit.equals(null, []));
    test.ok(!transit.equals([], null));
    test.ok(!transit.equals(null, {}));
    test.ok(!transit.equals({}, null));

    test.ok(!transit.equals(undefined, 1));
    test.ok(!transit.equals(1, undefined));
    test.ok(!transit.equals(undefined, []));
    test.ok(!transit.equals([], undefined));
    test.ok(!transit.equals(undefined, {}));
    test.ok(!transit.equals({}, undefined));

    test.equal(transit.hash(null), 0);
    test.equal(transit.hash(undefined), 0);

    test.done();
};

exports.testEqualitySymbolsAndKeywords = function(test) {

    var k0 = transit.keyword("foo"),
        k1 = transit.keyword("foo"),
        k2 = transit.keyword("bar"),
        s0 = transit.symbol("foo"),
        s1 = transit.symbol("foo"),
        s2 = transit.symbol("bar");

    test.ok(transit.equals(k0, k1));
    test.ok(!transit.equals(k0, k2));
    test.ok(transit.equals(s0, s1));
    test.ok(!transit.equals(s0, s2));

    test.done();
};

exports.testHashCode = function(test) {

    test.equal(transit.hash("foo"), transit.hash("foo"));
    test.notEqual(transit.hash("foo"), transit.hash("fop"));
    test.equal(transit.hash([]), 0);
    test.equal(transit.hash([1,2,3]), transit.hash([1,2,3]));
    test.notEqual(transit.hash([1,2,3]), transit.hash([1,2,4]));
    test.equal(transit.hash({foo: "bar"}), transit.hash({foo: "bar"}));
    test.notEqual(transit.hash({foo: "bar"}), transit.hash({foo: "baz"}));
    test.equal(transit.hash({}), transit.hash({}));
    test.equal(transit.hash(new Date(2014,4,6)), transit.hash(new Date(2014,4,6)));

    test.done();
};

// =============================================================================
// Numbers
// =============================================================================

exports.testIntegers = function(test) {
    test.equal(typeof transit.integer("9007199254740992"), "number");
    test.equal(typeof transit.integer("9007199254740993"), "object");
    test.equal(typeof transit.integer("-9007199254740992"), "number");
    test.equal(typeof transit.integer("-9007199254740993"), "object");
    test.done();
};

// =============================================================================
// TransitMap
// =============================================================================

exports.testTransitMapBasic = function(test) {

    var m0 = transit.map([]);

    test.ok(m0.size == 0);

    var m1 = transit.map(["foo", "bar"]);

    test.ok(m1.size == 1);
    test.ok(m1.has("foo"));
    test.equal(m1.get("foo"), "bar");

    var m2 = transit.map(["foo", "bar", 101574, "baz"]);

    test.ok(m2.size == 2);
    test.ok(m2.has("foo") && m2.has(101574));
    test.ok((m2.get("foo") == "bar") && (m2.get(101574) == "baz"));

    var m3 = transit.map(["foo", "bar"]);

    test.equal(transit.hash(m1), transit.hash(m3));

    var m4 = transit.map(["foo", "bop"]);

    test.notEqual(transit.hash(m3), transit.hash(m4));

    var m5 = transit.map([[1,2], "foo", [3,4], "bar"]);

    test.ok(m5.get([1,2]) === "foo" && (m5.get([3,4]) === "bar"));

    var m5 = transit.map(["foo", "bar", "foo", "baz"]);

    test.equal(m5.size, 1);
    test.equal(m5.get("foo"), "baz");

    var m6 = transit.map(["foo", "bar", "baz", "woz"]),
        m7 = transit.map(["foo", "bar", "baz", "woz"]),
        m8 = transit.map(["baz", "woz", "foo", "bar"]);

    test.ok(transit.equals(m6,m7));
    test.ok(transit.equals(m7,m8))

    var m9  = transit.map([transit.keyword("foo"), "bar"]),
        m10 = transit.map([transit.keyword("foo"), "bar"]);

    test.ok(transit.equals(m9, m10));

    test.done();
};

exports.testTransitMapIntermediate = function(test) {
    var m = transit.map();

    m.set(transit.keyword("foo"), "bar");

    test.ok(m.has(transit.keyword("foo")), "bar");
    test.equal(m.get(transit.keyword("foo")), "bar");
    test.equal(m.size, 1);

    m.clear();

    test.equal(m.has(transit.keyword("foo")), false);
    test.equal(m.get(transit.keyword("foo")), null);
    test.equal(m.size, 0);

    test.done();
};

exports.testTransitMapVerbose = function(test) {
    var r = transit.reader("json"),
        s = "{\"~:foo\":\"bar\"}";

    test.ok(transit.equals(r.read(s), transit.map([transit.keyword("foo"), "bar"])));

    test.done();
};

exports.testTransitMapKeySet = function(test) {
    var m0 = transit.map(["foo", 1, "bar", 2, "baz", 3]);

    test.deepEqual(m0.keySet().sort(), ["foo", "bar", "baz"].sort());

    test.done();
};

exports.testTransitMapKeys = function(test) {
    var m0   = transit.map(["foo", 1, "bar", 2, "baz", 3]),
        iter = m0.keys(),
        ks   = [];

    ks.push(iter.next().value);
    ks.push(iter.next().value);
    ks.push(iter.next().value);

    test.ok(iter.next().done);
    test.deepEqual(ks.sort(), ["foo", "bar", "baz"].sort());

    test.done();
};

exports.testTransitMapValues = function(test) {
    var m0   = transit.map(["foo", 1, "bar", 2, "baz", 3]),
        iter = m0.values(),
        xs   = [];

    xs.push(iter.next().value);
    xs.push(iter.next().value);
    xs.push(iter.next().value);

    test.ok(iter.next().done);
    test.deepEqual(xs.sort(), [1,2,3].sort());

    test.done();
};

exports.testTransitMapEntries = function(test) {
    var m0   = transit.map(["foo", 1, "bar", 2, "baz", 3]),
        iter = m0.entries(),
        kvs  = [];

    kvs.push(iter.next().value);
    kvs.push(iter.next().value);
    kvs.push(iter.next().value);

    test.ok(iter.next().done);
    test.deepEqual(kvs.sort(), [["foo", 1],["bar",2],["baz",3]].sort());

    test.done();
};

exports.testTransitMapDelete = function(test) {
    var m0 = transit.map(["foo", 1, "bar", 2, "baz", 3]);

    m0.delete("foo");

    test.equal(m0.size, 2);
    test.equal(m0.has("foo"), false);
    test.deepEqual(m0.keySet().sort(), ["bar","baz"].sort());

    test.done();
};

// =============================================================================
// TransitSet
// =============================================================================

exports.testTransitSetBasic = function(test) {
    var s0 = transit.set([]);

    test.equal(s0.size, 0);

    var s1 = transit.set([1]);

    test.equal(s1.size, 1);

    var s2 = transit.set([1,1,2]);

    test.equal(s2.size, 2);

    var s3 = transit.set(["foo","bar","baz"]);
    test.ok(s3.has("foo") && s3.has("bar"), s3.has("baz"));

    var s4 = transit.set(["baz","bar","foo"]);
    test.ok(transit.equals(s3,s4));

    var s5 = transit.set(["foo",1,"bar",[1,2]]);
    test.ok(s5.has("bar"));

    test.done();
};

exports.testTransitSetKeys = function(test) {
    var s0   = transit.set(["foo", "bar", "baz"]),
        iter = s0.keys(),
        ks   = [];
    
    ks.push(iter.next().value);
    ks.push(iter.next().value);
    ks.push(iter.next().value);

    test.ok(iter.next().done);
    test.deepEqual(ks.sort(), ["foo", "bar", "baz"].sort());

    test.done();
};

exports.testTransitSetValues = function(test) {
    var s0   = transit.set(["foo", "bar", "baz"]),
        iter = s0.values(),
        vs   = [];
    
    vs.push(iter.next().value);
    vs.push(iter.next().value);
    vs.push(iter.next().value);

    test.ok(iter.next().done);
    test.deepEqual(vs.sort(), ["foo", "bar", "baz"].sort());

    test.done();
};

exports.testTransitSetEntries = function(test) {
    var s0   = transit.set(["foo", "bar", "baz"]),
        iter = s0.entries(),
        kvs  = [];

    kvs.push(iter.next().value);
    kvs.push(iter.next().value);
    kvs.push(iter.next().value);

    test.ok(iter.next().done);
    test.deepEqual(kvs.sort(), [["foo","foo"],["bar","bar"],["baz","baz"]].sort());

    test.done();
};

exports.testTransitSetDelete = function(test) {
    var s0 = transit.set(["foo", "bar", "baz"]);
    
    s0.delete("bar");

    test.equal(s0.size, 2);
    test.ok(!s0.has("bar"));
    test.deepEqual(s0.keySet().sort(), ["foo", "baz"].sort());

    test.done();
};

// =============================================================================
// UUID
// =============================================================================

exports.testUUIDfromString = function(test) {
    test.equal(transit.uuid("531a379e-31bb-4ce1-8690-158dceb64be6").toString(),
               "531a379e-31bb-4ce1-8690-158dceb64be6");

    test.done();
};

// =============================================================================
// API
// =============================================================================

exports.testWrite = function(test) {
    var writer = transit.writer("json");
    test.equal(writer.write({foo:"bar"}), "[\"^ \",\"foo\",\"bar\"]");
    test.equal(writer.write([{foobar:"foobar"},{foobar:"foobar"}]), "[[\"^ \",\"foobar\",\"foobar\"],[\"^ \",\"^!\",\"foobar\"]]");
    test.done();
};

exports.testWriteVerboseMode = function(test) {
    var writer = transit.writer("json-verbose");
    test.equal(writer.write({foo:"bar"}), "{\"foo\":\"bar\"}");
    test.equal(writer.write([{foobar:"foobar"},{foobar:"foobar"}]), "[{\"foobar\":\"foobar\"},{\"foobar\":\"foobar\"}]");
    test.equal(writer.write(transit.date(1399471321791)), "{\"~#\'\":\"~t2014-05-07T14:02:01.791Z\"}");
    test.done();
};

exports.testRead = function(test) {
    var reader = transit.reader("json");
    test.deepEqual(reader.read("{\"foo\":\"bar\"}"), {foo:"bar"});
    test.done();
};

exports.testReadTransitTypes = function(test) {
    var reader = transit.reader("json");

    // TODO: should this work? Verbose maps with complex keys? - David
    // test.ok(transit.equals(reader.read("{\"~:foo\":\"bar\"}"),
    //                        transit.map([transit.keyword("foo"), "bar"])));

    test.deepEqual(reader.read("{\"~#ints\":[1,2,3]}"), [1,2,3]);
    test.deepEqual(reader.read("{\"~#longs\":[1,2,3]}"), [1,2,3]);
    test.deepEqual(reader.read("{\"~#floats\":[1.5,2.5,3.5]}"), [1.5,2.5,3.5]);
    test.deepEqual(reader.read("{\"~#doubles\":[1.5,2.5,3.5]}"), [1.5,2.5,3.5]);
    test.deepEqual(reader.read("{\"~#bools\":[\"~?t\",\"~?f\",\"~?t\"]}"), [true,false,true]);

    test.done();
};

exports.testWriteTransitTypes = function(test) {
    var writer = transit.writer("json");
    
    test.equal(writer.write(["foo"]), "[\"foo\"]");
    test.equal(writer.write([1]), "[1]");
    test.equal(writer.write([transit.integer("9007199254740993")]), "[\"~i9007199254740993\"]");
    test.equal(writer.write([transit.integer("-9007199254740993")]), "[\"~i-9007199254740993\"]");
    test.equal(writer.write([1.5]), "[1.5]");
    test.equal(writer.write([true]), "[true]");
    test.equal(writer.write([false]), "[false]");
    test.equal(writer.write([transit.keyword("foo")]), "[\"~:foo\"]");
    test.equal(writer.write([transit.symbol("foo")]), "[\"~$foo\"]");
    test.equal(writer.write([transit.date(482196050052)]), "[\"~m482196050052\"]");
    test.equal(writer.write([transit.keyword("foo"),transit.symbol("bar")]), "[\"~:foo\",\"~$bar\"]");
    test.equal(writer.write([transit.symbol("foo"),transit.keyword("bar")]), "[\"~$foo\",\"~:bar\"]");
    test.equal(writer.write([transit.uri("http://foo.com/")]), "[\"~rhttp://foo.com/\"]");
    test.equal(writer.write(transit.list([1,2,3])), "{\"~#list\":[1,2,3]}");
    test.equal(writer.write([transit.list([1,2,3])]), "[{\"~#list\":[1,2,3]}]");
    test.equal(writer.write(transit.uuid("531a379e-31bb-4ce1-8690-158dceb64be6")), "{\"~#\'\":\"~u531a379e-31bb-4ce1-8690-158dceb64be6\"}");
    test.equal(writer.write([transit.uuid("531a379e-31bb-4ce1-8690-158dceb64be6")]), "[\"~u531a379e-31bb-4ce1-8690-158dceb64be6\"]");
    test.equal(writer.write([transit.binary("c3VyZS4=")]), "[\"~bc3VyZS4=\"]");
    
    test.done();
};

exports.testWriteTransitComplexTypes = function(test) {
    var writer = transit.writer("json"),
        s0     = transit.set(["foo","bar","baz"]),
        m0     = transit.map(["foo","bar","baz","woz"]);
    test.equal(writer.write(s0),"{\"~#set\":[\"foo\",\"bar\",\"baz\"]}");
    test.done();
}; 

exports.testRoundtrip = function(test) {
    var writer = transit.writer("json"),
        s      = "{\"~#set\":[\"foo\",\"bar\",\"baz\"]}",
        reader = transit.reader("json");
    test.equal(s, writer.write(reader.read(s)));
    test.done();
};

exports.testWriteTransitObjectMap = function(test) {
    var x      = {"~:foo0": [transit.keyword("bar"+0), 0],
                  "~:foo1": [transit.keyword("bar"+1), 1]},
        writer = transit.writer("json");
    //test.equal(writer.write(x),"{\"~~:foo0\":[\"~:bar0\",0],\"~~:foo1\":[\"~:bar1\",1]}");
    test.done();
};

exports.testWriteEdgeCases = function(test) {

    var writer = transit.writer("json");

    test.equal(writer.write([[1,2]]), "[[1,2]]");
    test.equal(writer.write([[1,2],[3,4]]), "[[1,2],[3,4]]");
    test.equal(writer.write([[[1,2]]]), "[[[1,2]]]");
    test.equal(writer.write([{foo:[1,2]}]), "[[\"^ \",\"foo\",[1,2]]]");
    //test.equal(writer.write([{foo:[1,2,{}]}]), "[[\"^ \",\"foo\",[1,2,{}]}]"); // NOTE: how should empty maps gets written? - David
    test.equal(writer.write({foo:{bar:1,noz:3},baz:{woz:2,goz:4}}), "[\"^ \",\"foo\",[\"^ \",\"bar\",1,\"noz\",3],\"baz\",[\"^ \",\"woz\",2,\"goz\",4]]");

    test.done();
};

/*
exports.testCustomDecoder = function(test) {
    var MyInt = function(integer) {
        this.integer = integer;
    };

    var opts   = {
            decoders: {
                "i": function(v) { return new MyInt(v); }
            }
        },
        reader = transit.reader("json", opts);

    var x = reader.read("\"~i1\"");
    test.equal(x.integer, "1");
    test.ok(x instanceof MyInt);

    test.done();
};
*/

exports.testCustomHandler = function(test) {
    var Point = function(x, y) {
        this.x = x;
        this.y = y;
    };

    var PointHandler = transit.makeHandler({
            tag: function(v) { return "point"; },
            rep: function(v) { return transit.tagged("array", [v.x, v.y]); },
            stringRep: function(v) { return null; }
        }),
        writer = transit.writer("json", {
        handlers: [Point, PointHandler]
    });

    test.equal(writer.write(new Point(1.5,2.5)), "{\"~#point\":[1.5,2.5]}");

    test.done();
};

exports.testWriteOptions = function(test) {
    var w = transit.writer("json");

    test.equal(w.write(transit.keyword("foo"), {marshalTop:false}), "~:foo");
    test.equal(w.write(transit.integer("1"), {marshalTop:false}), "1");

    test.done();
};

exports.testDecoder = function(test) {
    var d = transit.decoder();

    test.equal(d.decode("1"), 1);

    test.done();
};

exports.testWriteCMap = function(test) {
    var w0 = transit.writer("json"),
        m  = transit.map([[1,2], "foo"]),
        w1 = transit.writer("json-verbose");

    test.equal(w0.write(m), "{\"~#cmap\":[[1,2],\"foo\"]}");
    test.equal(w1.write(m), "{\"~#cmap\":[[1,2],\"foo\"]}");

    test.done();
};

// =============================================================================
// Links
// =============================================================================

exports.testLink = function(test) {
    var w = transit.writer(),
        r = transit.reader(),
        l = r.read("{\"~#link\":{\"href\":\"~rhttp://foo.com\",\"rel\":\"a-rel\",\"name\":\"a-name\",\"render\":\"image\",\"prompt\":\"a-prompt\"}}");

    test.ok(transit.isURI(l.rep.href));
    test.equal(l.rep.rel, "a-rel");
    test.equal(l.rep.name, "a-name");
    test.equal(l.rep.render, "image");
    test.equal(l.rep.prompt, "a-prompt");

    test.done();
};

// =============================================================================
// JSON-M
// =============================================================================

exports.testVerifyArrayHash = function(test) {
    var reader = transit.reader("json");

    test.ok(transit.equals(reader.read("[\"^ \", \"~:foo\", \"bar\"]"),
                           transit.map([transit.keyword("foo"), "bar"])));

    test.done();
};

exports.testVerifyArrayHashWithCaching = function(test) {
    var reader = transit.reader("json");

    test.ok(transit.equals(reader.read("[\"^ \", \"~:foo\", \"^!\"]"),
                           transit.map([transit.keyword("foo"), transit.keyword("foo")])));

    test.done();
};

exports.testStringableKeys = function(test) {
    var em  = transit.writer("json").marshaller(),
        m0 = transit.map(["foo", 1, "bar", 2]);

    test.ok(transit.stringableKeys(em, m0));

    var m1 = transit.map([transit.keyword("foo"), 1,
                          transit.keyword("bar"), 2]);

    test.ok(transit.stringableKeys(em, m1));

    var m2 = transit.map([["foo"], 1, ["bar"], 2]);

    test.ok(!transit.stringableKeys(em, m2));
    
    test.done();
};

// =============================================================================
// Default decoder
// =============================================================================

exports.testDefaultDecoder = function(test) {
    var r = transit.reader("json", {
        defaultDecoder: function(tag, value) {
            throw new Error("Oops!");
        }
    });

    try {
        r.read("[\"~z1\"]");
    } catch(e) {
        if(e.message === "Oops!") {
            test.done();
        }
    }
};

// =============================================================================
// Verify Test Cases
// =============================================================================

function roundtrip(s) {
    var reader = transit.reader("json"),
        writer = transit.writer("json");
    return writer.write(reader.read(s));
}

exports.testVerifyRoundTripCachedKeys = function(test) {
    test.equal(roundtrip("[\"~:foo\",\"~:bar\",[\"^ \",\"^\\\"\",[1,2]]]"), "[\"~:foo\",\"~:bar\",[\"^ \",\"^\\\"\",[1,2]]]");
    test.done();
};

exports.testVerifyJSONCornerCases = function(test) {
    test.equal(roundtrip("{\"~#point\":[1,2]}"), "{\"~#point\":[1,2]}");
    test.equal(roundtrip("[\"^ \",\"foo\",\"~xfoo\"]"), "[\"^ \",\"foo\",\"~xfoo\"]");
    test.equal(roundtrip("[\"^ \",\"~/t\",null]"), "[\"^ \",\"~/t\",null]");
    test.equal(roundtrip("[\"^ \",\"~/f\",null]"), "[\"^ \",\"~/f\",null]");
    test.equal(roundtrip("{\"~#'\":\"~f-1.1E-1\"}"), "{\"~#\'\":\"~f-1.1E-1\"}");
    test.equal(roundtrip("{\"~#'\":\"~f-1.10E-1\"}"), "{\"~#\'\":\"~f-1.10E-1\"}");
    test.equal(roundtrip(
                "{\"~#set\":[{\"~#ratio\":[\"~i4953778853208128465\",\"~i636801457410081246\"]},{\"^\\\"\":[\"~i-8516423834113052903\",\"~i5889347882583416451\"]}]}"),
                "{\"~#set\":[{\"~#ratio\":[\"~i4953778853208128465\",\"~i636801457410081246\"]},{\"^\\\"\":[\"~i-8516423834113052903\",\"~i5889347882583416451\"]}]}");

    test.done();
};

exports.testVerifyRoundtripCmap = function(test) {
    test.equal(roundtrip("{\"~#cmap\":[[1,1],\"one\"]}"), "{\"~#cmap\":[[1,1],\"one\"]}");
    test.done();
};

exports.testVerifyRoundtripMapCachedStrings = function(test) {
    test.equal(roundtrip('[["^ ","aaaa",1,"bbbb",2],["^ ","^!",3,"^\\"",4],["^ ","^!",5,"^\\"",6]]'),
                         '[["^ ","aaaa",1,"bbbb",2],["^ ","^!",3,"^\\"",4],["^ ","^!",5,"^\\"",6]]');
    test.done();
};

exports.testVerifyRoundtripEmptyString = function(test) {
    test.equal(roundtrip("[\"\",\"a\",\"ab\",\"abc\",\"abcd\",\"abcde\",\"abcdef\"]"),
                         "[\"\",\"a\",\"ab\",\"abc\",\"abcd\",\"abcde\",\"abcdef\"]");
    test.done();
};

// exports.testVerifyRoundtripBigInteger = function(test) {
//     test.equal(roundtrip("{\"~#'\":\"~n8987676543234565432178765987645654323456554331234566789\"}"),
//                          "{\"~#'\":\"~n8987676543234565432178765987645654323456554331234566789\"}");
//     test.done();
// };

exports.testRoundtripLongKey = function(test) {
    var r = transit.reader("json");

    test.deepEqual(r.read("\{\"~i1\":\"foo\"}"), transit.map([1, "foo"]));

    test.done();
};

exports.testDisableWriteCaching = function(test) {
    var writer = transit.writer("json", {cache: false});
    test.equal(writer.write([transit.keyword("foo"), transit.keyword("foo")]), "[\"~:foo\",\"~:foo\"]");
    test.done();
};

exports.testRoundtripVerboseDates = function(test) {
    var r = transit.reader("json"),
        w = transit.writer("json-verbose");

    test.equal(w.write(r.read("[\"~t1776-07-04T12:00:00.000Z\",\"~t1970-01-01T00:00:00.000Z\",\"~t2000-01-01T12:00:00.000Z\",\"~t2014-04-07T22:17:17.000Z\"]")),
                              "[\"~t1776-07-04T12:00:00.000Z\",\"~t1970-01-01T00:00:00.000Z\",\"~t2000-01-01T12:00:00.000Z\",\"~t2014-04-07T22:17:17.000Z\"]");
    
    test.done();
};

exports.testRoundtripBigInteger = function(test) {
    test.equal(roundtrip("[\"~n1\"]"), "[\"~n1\"]");
    test.done();
};

exports.testRoundtripUUIDCornerCase = function(test) {
    test.equal(roundtrip("{\"~#'\":\"~u2f9e540c-0591-eff5-4e77-267b2cb3951f\"}"),
                         "{\"~#'\":\"~u2f9e540c-0591-eff5-4e77-267b2cb3951f\"}");
    test.done();
};

exports.testMapCornerCase = function(test) {
    test.equal(roundtrip("[\"^ \"]"), "[\"^ \"]");
    test.done();
};
