/*global describe, it, expect, LinkedList*/

describe('LinkedList class', function() {
    'use strict';

    it('is defined', function() {
        expect(LinkedList).toBeDefined();
    });

    it('can be instantiated with 0 nodes', function() {
        var target = new LinkedList();

        expect(target).toBeDefined();
    });

    it('has a property, first, which should be null in an empty list', function() {
        var target = new LinkedList();

        expect(target.first).toBe(null);
    });

    it('has a property, last, which should be null in an empty list', function() {
        var target = new LinkedList();

        expect(target.last).toBe(null);
    });

    it('can be instantiated with data, which populates first and last with a node containing the data', function() {
        var init = {
            data: 'foo'
        };
        
        var target = new LinkedList(init);

        expect(target.first.data).toBe(init.data);
        expect(target.last.data).toBe(init.data);
    });

    it('allows nodes to be appended with .add(data)', function() {
        var d1 = 'foo';
        var d2 = 'bar';

        var target = new LinkedList();
        target.add(d1);

        expect(target.first.data).toBe(d1);
        expect(target.last.data).toBe(d1);

        target.add(d2);

        expect(target.first.data).toBe(d1);
        expect(target.last.data).toBe(d2);
    });

    it('sets a reference for next on the nodes, to traverse the list', function() {
        var d1 = 'foo';
        var d2 = 'bar';

        var target = new LinkedList();
        target.add(d1);
        target.add(d2);

        expect(target.first.next.data).toBe(d2);
    });

    it('sets a reference for previous on the nodes, to traverse the list', function() {
        var d1 = 'foo';
        var d2 = 'bar';

        var target = new LinkedList();
        target.add(d1);
        target.add(d2);

        expect(target.last.previous.data).toBe(d1);
    });

    it('can be instantiated with an array of data (corresponding to individual nodes)', function() {
        var init = {
            data: [
                'foo',
                'bar',
                'baz'
            ]
        };

        var target = new LinkedList(init);

        expect(target.first.data).toBe(init.data[0]);
        expect(target.first.next.data).toBe(init.data[1]);
        expect(target.last.data).toBe(init.data[2]);
    });

    it('can be setup as a circular list', function() {
        var init = {
            data: [
                'foo',
                'bar',
                'baz'
            ],
            circular: true
        };

        var target = new LinkedList(init);

        expect(target.first.previous.data).toBe(init.data[2]);
        expect(target.last.next.data).toBe(init.data[0]);
    });
});

