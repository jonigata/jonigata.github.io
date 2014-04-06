// This file was automatically generated by Caper.
// (http://jonigata.github.io/caper/caper.html)

var caper_parser = (function() {

    var exports = {};

    var Token = {
        token_eof: 0,
        token_det: 1,
        token_n: 2,
        token_prep: 3,
        token_v: 4,
        null : null
    };
    exports.Token = Token;

    var getTokenLabel = function(t) {
        var labels = [
            "eof",
            "det",
            "n",
            "prep",
            "v",
            null
        ];
        return labels[t];
    };
    exports.getTokenLabel = getTokenLabel;

    var Nonterminal = {
        NP: 0,
        PP: 1,
        S: 2,
        VP: 3,
        null: null
    };
    var getNonterminalLabel = function(t) {
        var labels = [
            "NP",
            "PP",
            "S",
            "VP",
            null
        ];
        return labels[t];
    };

    // data Node = TNode | NNode

    var nodeIndex = 0;
    var tNodeIndex = 0;
    function TNode(token, value) {
        this.nodeType = 'TNode';
        this.nodeIndex = nodeIndex++;
        this.token = token;
        this.value = value;
        this.x = tNodeIndex++;
        this.depth = 0;

        this.toString = function() {
            return getTokenLabel(this.token)+': "'+this.value+'"';
        };
        this.collect = function(nodes, depth) {
            nodes[this.nodeIndex] = this;
            if (this.depth < depth) {
                this.depth = depth;
            }
        };
    }

    function NNode(nonterminal, successors) {
        this.nodeType = 'NNode';
        this.nodeIndex = nodeIndex++;
        this.nonterminal = nonterminal;
        this.successors = [successors];
        this.depth = 0;

        this.toString = function() {
            return getNonterminalLabel(this.nonterminal);
        };
        this.collect = function(nodes, depth) {
            nodes[this.nodeIndex] = this;
            if (this.depth < depth) {
                this.depth = depth;
            }
            var x = 0;
            var n = 0;
            for(var i = 0 ; i < this.successors.length ; i++) {
                var successors = this.successors[i];
                for(var j = 0 ; j < successors.length ; j++) {
                    var node = successors[j];
                    if (node != null) {
                        node.collect(nodes, depth+1);
                    }
                    x += node.x;
                    n++;
                }
            }
            this.x = x / n;
        };
    }

    var vertexIndex = 0;
    function Vertex(entry, n, prev, age) {
        this.entry = entry;
        this.node = n;
        this.prev = [prev];
        if (prev == null) {
            this.x = 0;
            this.y = 0;
        } else {
            this.x = age;
            this.y = prev.rightY;
            prev.rightY += 1;
        }
        this.rightY = this.y;
        this.index = vertexIndex++;
    }

    function Cons(car, cdr) {
        this.car = car;
        this.cdr = cdr;
    }

    function Slice(sa, stack) {
        this.sa = sa;

        this.stack = stack;
        this.error = false;

        var entries = [
            { state: this.state_0, gotof: this.gotof_0, index: 0 },
            { state: this.state_1, gotof: this.gotof_1, index: 1 },
            { state: this.state_2, gotof: this.gotof_2, index: 2 },
            { state: this.state_3, gotof: this.gotof_3, index: 3 },
            { state: this.state_4, gotof: this.gotof_4, index: 4 },
            { state: this.state_5, gotof: this.gotof_5, index: 5 },
            { state: this.state_6, gotof: this.gotof_6, index: 6 },
            { state: this.state_7, gotof: this.gotof_7, index: 7 },
            { state: this.state_8, gotof: this.gotof_8, index: 8 },
            { state: this.state_9, gotof: this.gotof_9, index: 9 },
            { state: this.state_10, gotof: this.gotof_10, index: 10 },
            { state: this.state_11, gotof: this.gotof_11, index: 11 },
            { state: this.state_12, gotof: this.gotof_12, index: 12 },
            null
        ];

        this.entry = function(n) {
            return entries[n];
        };

        if (this.stack == null) {
            this.pushStack(0, null, 0);
        }
    }
    exports.Slice = Slice;

    Slice.prototype = {
        dumpAux : function(s) {
            if (s == null) {
                return "";
            } else {
                return this.dumpAux(s.prev[0]) + ", " + (s.node == null ? "null" : s.node.toString());
            }
        },
        dump : function() {
            console.log(this.stack.entry.index + ": " + this.dumpAux(this.stack));
        },
        clone : function() {
            return new Slice(this.sa, this.stack);
        },
        combinable : function(slice) {
            var xs = this.stack;
            var ys = slice.stack;
            if (xs.entry.index != ys.entry.index) {
                return false;
            }
            if (xs.node.nodeType == 'TNode') {
                if (ys.node.nodeType != 'TNode' ||
                    xs.node.token != ys.node.token) {
                    throw "internal error";
                }
                return xs.node.value == ys.node.value;
            } else {
                if (ys.node.nodeType != 'NNode' ||
                    xs.node.nonterminal != ys.node.nonterminal) {
                    throw "internal error";
                }
                return true;
            }
        },
        combine : function(slice) {
            for (var i = 0 ; i < slice.stack.prev.length ; i++) {
                var n = slice.stack.prev[i];
                var shouldInsert = true;
                for (var j = 0 ; j < this.stack.prev.length ; j++) {
                    if (n == this.stack.prev[j]) {
                        shouldInsert = false;
                        break;
                    }
                }
                if (shouldInsert) {
                    this.stack.prev.push(n);
                }
            }

            if (this.stack.node.nodeType == 'NNode') {
                var x = slice.stack.node.successors;
                var y = this.stack.node.successors;

                for (var i = 0 ; i < x.length ; i++) {
                    var shouldInsert = true;
                    var s = x[i];
                    for (var j = 0 ; j < y.length ; j++) {
                        var t = y[j];
                        if (s.length == t.length) {
                            var match = true;
                            for (var k = 0 ; k < s.length ; k++) {
                                if (s[k] != t[k]) {
                                    match = false;
                                    break;
                                }
                            }
                            if (match) {
                                // already exist
                                shouldInsert = false;
                                break;
                            }
                        }
                    }
                    if (shouldInsert) {
                        y.push(s);
                    }
                }
            }
        },
        postToReduce : function(token, tnode, shifters, reducers, accepts, age) {
            this.error = false;
            this.stack.entry.state.apply(
                this, [token, tnode, shifters, reducers, accepts, age]);
        },
        postToShift : function(state, node, age) {
            this.pushStack(state, node, age);
        },
        getError : function() {
            return this.error;
        },

        pushStack : function(stateIndex, v, age) {
            this.stack = new Vertex(this.entry(stateIndex), v, this.stack, age);
        },
        popStack : function(n, nonterminal, reducers, args, age) {
            args = new Cons(this.stack.node, args);
            if (n == 1) {
                var a = [];
                while(args != null) {
                    a.push(args.car);
                    args = args.cdr;
                }
                var nnode = new NNode(nonterminal, a);
                for(var i = 0 ; i < this.stack.prev.length ; i++) {
                    var newStack = this.stack.prev[i];
                    var newSlice = new Slice(this.sa, newStack);
                    newSlice.pushStack(
                        newStack.entry.gotof.apply(this, [nonterminal]),
                        nnode,
                        age-1);
                    reducers.push(newSlice);
                }
                return;
            }
            for(var i = 0 ; i < this.stack.prev.length ; i++) {
                new Slice(
                    this.sa, this.stack.prev[i]).popStack(
                        n-1, nonterminal, reducers, args, age);
            }
        },

        state_0 : function(token, tnode, shifters, reducers, accepts, age) {
            switch(token) {
            case Token.token_det:
                // shift
                shifters.push([this.clone(), 8, tnode]);
                break;
            case Token.token_n:
                // shift
                shifters.push([this.clone(), 7, tnode]);
                break;
            default:
                this.sa.syntaxError();
                this.error = true;
                return false;
            }
        },

        gotof_0 : function(nonterminal) {
            switch(nonterminal) {
            case Nonterminal.S: return 1;
            case Nonterminal.NP: return 2;
            default:
                console.log(getNonterminalLabel(nonterminal));
                throw "unexpected nontermninal";
            }
        },

        state_1 : function(token, tnode, shifters, reducers, accepts, age) {
            switch(token) {
            case Token.token_eof:
                // accept
                accepts.push(new Slice(this.sa, this.stack));
                break;
            case Token.token_prep:
                // shift
                shifters.push([this.clone(), 5, tnode]);
                break;
            default:
                this.sa.syntaxError();
                this.error = true;
                return false;
            }
        },

        gotof_1 : function(nonterminal) {
            switch(nonterminal) {
            case Nonterminal.PP: return 4;
            default:
                console.log(getNonterminalLabel(nonterminal));
                throw "unexpected nontermninal";
            }
        },

        state_2 : function(token, tnode, shifters, reducers, accepts, age) {
            switch(token) {
            case Token.token_prep:
                // shift
                shifters.push([this.clone(), 5, tnode]);
                break;
            case Token.token_v:
                // shift
                shifters.push([this.clone(), 6, tnode]);
                break;
            default:
                this.sa.syntaxError();
                this.error = true;
                return false;
            }
        },

        gotof_2 : function(nonterminal) {
            switch(nonterminal) {
            case Nonterminal.PP: return 12;
            case Nonterminal.VP: return 3;
            default:
                console.log(getNonterminalLabel(nonterminal));
                throw "unexpected nontermninal";
            }
        },

        state_3 : function(token, tnode, shifters, reducers, accepts, age) {
            switch(token) {
            case Token.token_eof:
                // reduce
                this.popStack(
                    2, Nonterminal.S, reducers, null, age);
                break;
            case Token.token_prep:
                // reduce
                this.popStack(
                    2, Nonterminal.S, reducers, null, age);
                break;
            default:
                this.sa.syntaxError();
                this.error = true;
                return false;
            }
        },

        gotof_3 : function(nonterminal) {
            throw "unexpected gotof";
        },

        state_4 : function(token, tnode, shifters, reducers, accepts, age) {
            switch(token) {
            case Token.token_eof:
                // reduce
                this.popStack(
                    2, Nonterminal.S, reducers, null, age);
                break;
            case Token.token_prep:
                // reduce
                this.popStack(
                    2, Nonterminal.S, reducers, null, age);
                break;
            default:
                this.sa.syntaxError();
                this.error = true;
                return false;
            }
        },

        gotof_4 : function(nonterminal) {
            throw "unexpected gotof";
        },

        state_5 : function(token, tnode, shifters, reducers, accepts, age) {
            switch(token) {
            case Token.token_det:
                // shift
                shifters.push([this.clone(), 8, tnode]);
                break;
            case Token.token_n:
                // shift
                shifters.push([this.clone(), 7, tnode]);
                break;
            default:
                this.sa.syntaxError();
                this.error = true;
                return false;
            }
        },

        gotof_5 : function(nonterminal) {
            switch(nonterminal) {
            case Nonterminal.NP: return 10;
            default:
                console.log(getNonterminalLabel(nonterminal));
                throw "unexpected nontermninal";
            }
        },

        state_6 : function(token, tnode, shifters, reducers, accepts, age) {
            switch(token) {
            case Token.token_det:
                // shift
                shifters.push([this.clone(), 8, tnode]);
                break;
            case Token.token_n:
                // shift
                shifters.push([this.clone(), 7, tnode]);
                break;
            default:
                this.sa.syntaxError();
                this.error = true;
                return false;
            }
        },

        gotof_6 : function(nonterminal) {
            switch(nonterminal) {
            case Nonterminal.NP: return 11;
            default:
                console.log(getNonterminalLabel(nonterminal));
                throw "unexpected nontermninal";
            }
        },

        state_7 : function(token, tnode, shifters, reducers, accepts, age) {
            switch(token) {
            case Token.token_eof:
                // reduce
                this.popStack(
                    1, Nonterminal.NP, reducers, null, age);
                break;
            case Token.token_prep:
                // reduce
                this.popStack(
                    1, Nonterminal.NP, reducers, null, age);
                break;
            case Token.token_v:
                // reduce
                this.popStack(
                    1, Nonterminal.NP, reducers, null, age);
                break;
            default:
                this.sa.syntaxError();
                this.error = true;
                return false;
            }
        },

        gotof_7 : function(nonterminal) {
            throw "unexpected gotof";
        },

        state_8 : function(token, tnode, shifters, reducers, accepts, age) {
            switch(token) {
            case Token.token_n:
                // shift
                shifters.push([this.clone(), 9, tnode]);
                break;
            default:
                this.sa.syntaxError();
                this.error = true;
                return false;
            }
        },

        gotof_8 : function(nonterminal) {
            throw "unexpected gotof";
        },

        state_9 : function(token, tnode, shifters, reducers, accepts, age) {
            switch(token) {
            case Token.token_eof:
                // reduce
                this.popStack(
                    2, Nonterminal.NP, reducers, null, age);
                break;
            case Token.token_prep:
                // reduce
                this.popStack(
                    2, Nonterminal.NP, reducers, null, age);
                break;
            case Token.token_v:
                // reduce
                this.popStack(
                    2, Nonterminal.NP, reducers, null, age);
                break;
            default:
                this.sa.syntaxError();
                this.error = true;
                return false;
            }
        },

        gotof_9 : function(nonterminal) {
            throw "unexpected gotof";
        },

        state_10 : function(token, tnode, shifters, reducers, accepts, age) {
            switch(token) {
            case Token.token_eof:
                // reduce
                this.popStack(
                    2, Nonterminal.PP, reducers, null, age);
                break;
            case Token.token_prep:
                // shift
                shifters.push([this.clone(), 5, tnode]);
                // reduce
                this.popStack(
                    2, Nonterminal.PP, reducers, null, age);
                break;
            case Token.token_v:
                // reduce
                this.popStack(
                    2, Nonterminal.PP, reducers, null, age);
                break;
            default:
                this.sa.syntaxError();
                this.error = true;
                return false;
            }
        },

        gotof_10 : function(nonterminal) {
            switch(nonterminal) {
            case Nonterminal.PP: return 12;
            default:
                console.log(getNonterminalLabel(nonterminal));
                throw "unexpected nontermninal";
            }
        },

        state_11 : function(token, tnode, shifters, reducers, accepts, age) {
            switch(token) {
            case Token.token_eof:
                // reduce
                this.popStack(
                    2, Nonterminal.VP, reducers, null, age);
                break;
            case Token.token_prep:
                // shift
                shifters.push([this.clone(), 5, tnode]);
                // reduce
                this.popStack(
                    2, Nonterminal.VP, reducers, null, age);
                break;
            default:
                this.sa.syntaxError();
                this.error = true;
                return false;
            }
        },

        gotof_11 : function(nonterminal) {
            switch(nonterminal) {
            case Nonterminal.PP: return 12;
            default:
                console.log(getNonterminalLabel(nonterminal));
                throw "unexpected nontermninal";
            }
        },

        state_12 : function(token, tnode, shifters, reducers, accepts, age) {
            switch(token) {
            case Token.token_eof:
                // reduce
                this.popStack(
                    2, Nonterminal.NP, reducers, null, age);
                break;
            case Token.token_prep:
                // reduce
                this.popStack(
                    2, Nonterminal.NP, reducers, null, age);
                break;
            case Token.token_v:
                // reduce
                this.popStack(
                    2, Nonterminal.NP, reducers, null, age);
                break;
            default:
                this.sa.syntaxError();
                this.error = true;
                return false;
            }
        },

        gotof_12 : function(nonterminal) {
            throw "unexpected gotof";
        },

        dummy : null
    };

    function Parser(sa) {
        this.slices = [];
        this.slices.push(new Slice(sa, null));
        this.accepts = [];
        this.age = 1;
    }
    exports.Parser = Parser;

    Parser.prototype = {
        postFirst : function(token, value) {
            function PostContext(slices) {
                this.tnode = new TNode(token, value);
                this.actives = [];
                for(var i = 0 ; i < slices.length ; i++) {
                    this.actives.push(slices[i]);
                }
                this.shifters = [];
            }
            return new PostContext(this.slices);
        },
        postNext : function(context) {
            var combine = function(src, sin, din, dout) {
                var dst = [];
                for (var i = 0 ; i < src.length ; i++) {
                    var newer = sin(src[i]);
                    var kill = false;
                    for(var j = 0  ; j < dst.length ; j++) {
                        var fixed = din(dst[j]);
                        if (fixed.combinable(newer)) {
                            // unite
                            kill = true;
                            fixed.combine(newer);
                            break;
                        }
                    }
                    if (!kill) {
                        dst.push(dout(src[i]));
                    }
                }
                return dst;
            };

            if (0 < context.actives.length) {
                var reducers = [];
                var curr = context.actives.shift();
                curr.postToReduce(
                    context.tnode.token, context.tnode,
                    context.shifters, reducers, this.accepts,
                    this.age);

                context.actives = combine(
                    reducers.concat(context.actives),
                    function(x) { return x; },
                    function(x) { return x; },
                    function(x) { return x; });
                return true;
            } else {
                context.shifters = combine(
                    context.shifters,
                    function(x) { return x[0]; },
                    function(x) { return x[0]; },
                    function(x) { return x; });
                for (var i = 0 ; i < context.shifters.length ; i++) {
                    var tuple = context.shifters[i];
                    tuple[0].postToShift(tuple[1], tuple[2], this.age);
                }

                this.slices = combine(
                    context.shifters,
                    function(x) { return x[0]; },
                    function(x) { return x; },
                    function(x) { return x[0]; });

                this.age++;

console.log(this.accepts);
                this.accepts = combine(
                    this.accepts,
                    function(x) { return x; },
                    function(x) { return x; },
                    function(x) { return x; });
console.log(this.accepts);

                return false;
            }
        },
        draw: function(drawer, context) {
            // collect all living vertices
            var totalSet = {};
            var currSet = {};
            for (var i = 0 ; i < this.accepts.length ; i++) {
                var p = this.accepts[i].stack;
                currSet[p.index] = p;
            }
            if (context == null) {
                for (var i = 0 ; i < this.slices.length ; i++) {
                    var p = this.slices[i].stack;
                    currSet[p.index] = p;
                }
            } else {
                for (var i = 0 ; i < context.actives.length ; i++) {
                    var p = context.actives[i].stack;
                    currSet[p.index] = p;
                }
                for (var i = 0 ; i < context.shifters.length ; i++) {
                    var p = context.shifters[i][0].stack;
                    currSet[p.index] = p;
                }
            }

            while (true) {
                var keys = Object.keys(currSet);
                var n = keys.length;
                if (n == 0) {
                    break;
                }
                var nextSet = {};
                for (var i = 0 ; i < n ; i++) {
                    var key = keys[i];
                    var p = currSet[key];
                    totalSet[key] = p;
                    for (var j = 0 ; j < p.prev.length ; j++) {
                        var q = p.prev[j];
                        if (q != null) {
                            nextSet[q.index] = q;
                        }
                    }
                }
                currSet = nextSet;
            }

            // collect nodes
            nodes = {};
            for (var x in totalSet) {
                var node = totalSet[x].node;
                if (node != null) {
                    node.collect(nodes, 0); // collect recusively
                }
            }

            var keys = Object.keys(totalSet);
            //console.log(keys.join(', '));

            // Xで分類
            var columns = [];
            for (var i = 0 ; i < keys.length ; i++) {
                var key = keys[i];
                var p = totalSet[key];
                if (columns[p.x] == null) {
                    columns[p.x] = [];
                }
                columns[p.x].push(p);
            }

            // vertex描画
            var gap = 0;
            for (var i = 0 ; i < columns.length ; i++) {
                if (columns[i] == null) { gap++; continue; }
                columns[i].sort(function(a, b) { return a.index - b.index });

                for (var k = 0 ; k < columns[i].length ; k++) {
                    var p = columns[i][k];
                    p.y = k;

                    drawer.drawVertex(p.index, p.entry.index, p.x - gap, p.y);

                    for (var j = 0 ; j < p.prev.length ; j++) {
                        var q = p.prev[j];
                        if (q != null) {
                            drawer.drawVertexEdge(p.index, p.x, p.y,
                                                  q.index, q.x, q.y);
                        }
                    }

                }
            }

            // node描画
            var keys = Object.keys(nodes);
            for (var i = 0 ; i < keys.length ; i++) {
                var p = nodes[keys[i]];
                drawer.drawNode(p.nodeIndex, p.x, p.depth, p.toString());
            }
            for (var i = 0 ; i < keys.length ; i++) {
                var p = nodes[keys[i]];
                if (p.successors != null) {
                    for (var j = 0 ; j < p.successors.length ; j++) {
                        for (var k = 0 ; k < p.successors[j].length ; k++) {
                            var q = p.successors[j][k];
                            drawer.drawNodeEdge(p.nodeIndex, q.nodeIndex);
                        }
                    }
                }
            }

            // vertex->node描画
            for (var i = 0 ; i < columns.length ; i++) {
                if (columns[i] == null) { continue; }

                for (var k = 0 ; k < columns[i].length ; k++) {
                    var p = columns[i][k];
                    if (p.node != null) {
                        drawer.drawVertexToNodeEdge(p.index, p.node.nodeIndex);
                    }
                }
            }

        }
    };

    return exports;
})();

