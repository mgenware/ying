var _m = {"&":"&amp;","<":"&lt;",">":"&gt;",'"':'&quot;'};

function _e(p) {
    if (!p) {
        return '';
    }
    return String(p).replace(/[&<>"'\/]/g, function(s) {
        return _m[s];
    });
}
