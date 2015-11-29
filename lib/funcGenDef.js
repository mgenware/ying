var _m = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'': '&#39;'};

function _e(p) {
    if (!p) {
        return '';
    }
    return String(p).replace(/[&<>"']/g, function(s) {
        return _m[s];
    });
}
