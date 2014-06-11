/*global describe, it, expect, renderTemplate*/

describe('renderTemplate()', function() {
    'use strict';

    it('is defined', function() {
        expect(renderTemplate).toBeDefined();
    });

    it('replaces delimited text with properties', function() {
        var data = {
            name: 'Phil Wills',
            job: 'UI Developer'
        };

        var template = '{{name}} is a fantastic {{job}}';

        var expected = 'Phil Wills is a fantastic UI Developer';
        expect(renderTemplate(template, data)).toEqual(expected);
    });

    it('replaces delimited text with nested properties', function() {
        var data = {
            name: {
                first: 'Phil',
                last: 'Wills'
            },
            job: 'UI Developer'
        };

        var template = '{{name.last}}, {{name.first}} knows how to be a {{job}}';
        var expected = 'Wills, Phil knows how to be a UI Developer';

        expect(renderTemplate(template, data)).toEqual(expected);
    });

    it('executes functions passed', function() {
        var data = {
            fullName: function() {
                return 'Phil Wills';
            }
        };

        var template = '{{fullName}} is motivated.';
        var expected = 'Phil Wills is motivated.';

        var value = renderTemplate(template, data);

        expect(value).toEqual(expected);
    });
});

