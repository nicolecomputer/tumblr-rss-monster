exports.ucfirst = function ucFirst(potentialString) {
    var s = "".concat(potentialString);
    return "".concat(s.charAt(0).toUpperCase()).concat(s.substr(1));
};
exports.howmany = function howMany(count, singular, plural) {
    return "".concat(count, " ").concat(count === 1 ? singular : (plural || "".concat(singular, "s")));
};
exports.img = function img(src, width, height, opts) {
    if (!opts) {
        opts = {};
    }
    opts.src = src;
    opts.width = width;
    opts.height = height;
    return ("<img ".concat(Object
        .keys(opts)
        .map(function (k) { return opts[k] ? "".concat(k, "=\"").concat(opts[k], "\"") : ''; })
        .join(' '), ">"));
};
exports.getTimeDiffString = function getTimeDiffString(t, p) {
    var timeInt = Math.abs(t);
    var pfx = p ? " ".concat(p) : '';
    if (t <= 1000) {
        return '';
    }
    if ((timeInt /= 1000) < 60)
        return "".concat(Math.round(timeInt * 10) / 10, " seconds").concat(pfx);
    if ((timeInt /= 60) < 60)
        return "".concat(Math.round(timeInt * 10) / 10, " minutes").concat(pfx);
    if ((timeInt /= 60) < 24)
        return "".concat(Math.round(timeInt * 10) / 10, " hours").concat(pfx);
    if ((timeInt /= 24) < 7)
        return "".concat(Math.round(timeInt * 10) / 10, " days").concat(pfx);
    return "".concat(Math.round((t / 7) * 10) / 10, " weeks").concat(pfx);
};
// look at me, parsing HTML with regular expressions
exports.wrapHTMLMaybe = function wrapHTMLMaybe(text, tag) {
    text = "".concat(text).trim();
    // Text starts/ends with HTML tags
    var rStart = /^\<(\w+)\>/;
    var rEnd = /\<\/(\w+)\>$/;
    // End tags exist in text
    // const rTag = /\<\/(?:p|a|em|strong|blockquote|h1|h2|h3|h4|h5|h6)\>/
    var openingTag = text.match(rStart);
    var closingTag = text.match(rEnd);
    console.log('Text:', text);
    console.log('- tag:', tag);
    console.log('- openingTag:', (openingTag && openingTag[1]) || '(none)');
    console.log('- closingTag:', (closingTag && closingTag[1]) || '(none)');
    // if rTag.test(text)
    if (openingTag && openingTag[1] === tag) {
        return text;
    }
    else {
        return "<".concat(tag, ">\n\n").concat(text, "\n\n</").concat(tag, ">");
    }
};
