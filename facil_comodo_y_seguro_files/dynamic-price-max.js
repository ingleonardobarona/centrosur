/**
 * Dynamic price slider max — universal.
 *
 * Reads filters from any Houzez search builder form on the page, calls
 * /wp-json/centrosur/v1/section-max to get the real MAX(fave_property_price)
 * for that subset, and overrides the jQuery UI slider's max value.
 *
 * Re-runs when status / location / type selects change, so the slider always
 * reflects what's actually available in the user's current filter context.
 *
 * Bails out silently on pages without a price slider or without a search form.
 */
(function ($) {
    if (typeof $ === 'undefined') { return; }

    var API = '/wp-json/centrosur/v1/section-max';

    function fmt(n) {
        return '$' + Number(n || 0).toLocaleString('es-CO');
    }

    // Contexto implicito de la pagina (extraido del widget Elementor por PHP).
    var CTX = window.CNSR_LISTING_CTX || { status: [], city: [], type: [] };

    function readFilters($form) {
        // Valores del form tienen prioridad; si vacios, caer al contexto implicito.
        function vals(selectName, ctxKey) {
            var v = $form.length ? $form.find('select[name="' + selectName + '"]').val() : null;
            var arr = !v ? [] : (Array.isArray(v) ? v.filter(Boolean) : [v].filter(Boolean));
            if (arr.length > 0) { return arr; }
            return (CTX[ctxKey] || []).slice();
        }
        return {
            status: vals('status[]', 'status'),
            city:   vals('location[]', 'city'),
            type:   vals('type[]', 'type')
        };
    }

    function buildQuery(filters) {
        var p = new URLSearchParams();
        ['status', 'city', 'type'].forEach(function (k) {
            (filters[k] || []).forEach(function (s) {
                if (s) { p.append(k + '[]', s); }
            });
        });
        return p.toString();
    }

    function fetchMax(filters) {
        var qs = buildQuery(filters);
        return fetch(API + (qs ? '?' + qs : ''), { credentials: 'same-origin' })
            .then(function (r) { return r.ok ? r.json() : null; })
            .catch(function () { return null; });
    }

    function applyMax(maxPrice) {
        var $r = $('.price-range');
        if (!$r.length || !$r.data('ui-slider')) { return false; }
        if (!maxPrice || maxPrice <= 0) { return false; }
        $r.slider('option', 'max', maxPrice);
        $r.slider('values', [0, maxPrice]);
        $('input[name="min-price"]').val(0);
        $('input[name="max-price"]').val(maxPrice);
        $('.min-price-range').text(fmt(0));
        $('.max-price-range').text(fmt(maxPrice));
        return true;
    }

    function update($form) {
        var filters = readFilters($form);
        fetchMax(filters).then(function (res) {
            if (res && res.max_price > 0) { applyMax(res.max_price); }
        });
    }

    function init() {
        var $form = $('form.houzez-search-builder-form-js, form.houzez-search-form-js').first();
        if (!$('.price-range').length) { return; } // sin slider, nada que hacer
        // Aun sin form (caso pagina con widget de listado sin search builder),
        // podemos correr una vez con CTX para ajustar el slider inicial.

        var tries = 0;
        var iv = setInterval(function () {
            if ($('.price-range').data('ui-slider') || ++tries > 30) {
                clearInterval(iv);
                update($form);
                if ($form.length) {
                    $form.on('change',
                        'select[name="status[]"], select[name="location[]"], select[name="type[]"]',
                        function () { update($form); }
                    );
                }
            }
        }, 100);
    }

    $(init);
})(window.jQuery);
