(() => {
    const SVG_NS = 'http://www.w3.org/2000/svg';

    /* ── Layout constants (SVG viewBox units) ─────────────────── */
    const OUTER_R      = 460;   // outer disc background radius
    const OUTER_TEXT_R  = 430;   // where outer labels start (near edge, reading inward)
    const OUTER_TICK_R  = 450;   // tick mark outer edge
    const INNER_R       = 300;   // inner disc background radius
    const INNER_TEXT_R  = 275;   // where inner labels start (near edge, reading inward)
    const INNER_TICK_R  = 292;   // tick mark outer edge
    const CENTER_R      = 110;   // center circle radius

    let data       = {};
    let countries  = [];
    const N        = 27;          // country count
    const STEP     = 360 / N;     // degrees per slot

    let outerRotation   = 0;      // current outer-disc rotation (degrees)
    let selectedOriginIdx  = 0;
    let selectedDestIdx    = 0;
    let isDragging = false;

    /* ── Embedded lookup data ─────────────────────────────────── */
    const DECODER_DATA = {"Algeria":{"Algeria":0,"Arabia":28,"Atlantic":20,"Brazil":43,"Canada":37,"Columbia":44,"Congo":25,"E Africa":29,"Egypt":21,"England":16,"France":14,"Germany":17,"Italy":15,"Kenya":31,"Libya":10,"Mideast":19,"Nigeria":23,"Persia":30,"Peru":50,"Scandinavia":22,"Spain":13,"Sudan":24,"U.S.A.":36,"U.S.S.R.":26,"Venezuela":40,"W Africa":18,"Yugoslavia":12},"Arabia":{"Algeria":28,"Arabia":0,"Atlantic":41,"Brazil":57,"Canada":59,"Columbia":65,"Congo":30,"E Africa":18,"Egypt":14,"England":34,"France":29,"Germany":27,"Italy":24,"Kenya":26,"Libya":26,"Mideast":17,"Nigeria":31,"Persia":30,"Peru":70,"Scandinavia":32,"Spain":33,"Sudan":19,"U.S.A.":58,"U.S.S.R.":23,"Venezuela":61,"W Africa":32,"Yugoslavia":22},"Atlantic":{"Algeria":20,"Arabia":41,"Atlantic":0,"Brazil":32,"Canada":27,"Columbia":34,"Congo":37,"E Africa":39,"Egypt":33,"England":18,"France":19,"Germany":26,"Italy":22,"Kenya":43,"Libya":31,"Mideast":31,"Nigeria":35,"Persia":42,"Peru":44,"Scandinavia":25,"Spain":17,"Sudan":36,"U.S.A.":29,"U.S.S.R.":38,"Venezuela":30,"W Africa":37,"Yugoslavia":28},"Brazil":{"Algeria":43,"Arabia":57,"Atlantic":32,"Brazil":0,"Canada":49,"Columbia":27,"Congo":38,"E Africa":48,"Egypt":52,"England":50,"France":45,"Germany":53,"Italy":47,"Kenya":46,"Libya":42,"Mideast":54,"Nigeria":37,"Persia":61,"Peru":25,"Scandinavia":55,"Spain":40,"Sudan":44,"U.S.A.":41,"U.S.S.R.":60,"Venezuela":28,"W Africa":33,"Yugoslavia":51},"Canada":{"Algeria":37,"Arabia":59,"Atlantic":27,"Brazil":49,"Canada":0,"Columbia":28,"Congo":56,"E Africa":62,"Egypt":51,"England":31,"France":36,"Germany":38,"Italy":39,"Kenya":64,"Libya":44,"Mideast":47,"Nigeria":48,"Persia":55,"Peru":43,"Scandinavia":34,"Spain":35,"Sudan":57,"U.S.A.":10,"U.S.S.R.":41,"Venezuela":26,"W Africa":42,"Yugoslavia":43},"Columbia":{"Algeria":44,"Arabia":65,"Atlantic":43,"Brazil":27,"Canada":28,"Columbia":0,"Congo":52,"E Africa":64,"Egypt":59,"England":47,"France":46,"Germany":50,"Italy":48,"Kenya":62,"Libya":49,"Mideast":57,"Nigeria":45,"Persia":66,"Peru":17,"Scandinavia":51,"Spain":43,"Sudan":61,"U.S.A.":26,"U.S.S.R.":58,"Venezuela":12,"W Africa":39,"Yugoslavia":53},"Congo":{"Algeria":25,"Arabia":30,"Atlantic":37,"Brazil":38,"Canada":56,"Columbia":52,"Congo":0,"E Africa":22,"Egypt":23,"England":36,"France":33,"Germany":34,"Italy":32,"Kenya":17,"Libya":24,"Mideast":26,"Nigeria":15,"Persia":31,"Peru":54,"Scandinavia":40,"Spain":29,"Sudan":20,"U.S.A.":55,"U.S.S.R.":39,"Venezuela":50,"W Africa":21,"Yugoslavia":27},"E Africa":{"Algeria":29,"Arabia":18,"Atlantic":39,"Brazil":48,"Canada":62,"Columbia":64,"Congo":22,"E Africa":0,"Egypt":15,"England":37,"France":32,"Germany":33,"Italy":30,"Kenya":14,"Libya":23,"Mideast":24,"Nigeria":25,"Persia":19,"Peru":67,"Scandinavia":35,"Spain":31,"Sudan":12,"U.S.A.":61,"U.S.S.R.":28,"Venezuela":60,"W Africa":34,"Yugoslavia":26},"Egypt":{"Algeria":21,"Arabia":14,"Atlantic":33,"Brazil":52,"Canada":51,"Columbia":59,"Congo":23,"E Africa":15,"Egypt":0,"England":27,"France":24,"Germany":20,"Italy":19,"Kenya":25,"Libya":12,"Mideast":11,"Nigeria":18,"Persia":17,"Peru":63,"Scandinavia":28,"Spain":26,"Sudan":13,"U.S.A.":50,"U.S.S.R.":22,"Venezuela":54,"W Africa":29,"Yugoslavia":16},"England":{"Algeria":16,"Arabia":34,"Atlantic":18,"Brazil":50,"Canada":31,"Columbia":47,"Congo":36,"E Africa":37,"Egypt":27,"England":0,"France":8,"Germany":11,"Italy":13,"Kenya":40,"Libya":21,"Mideast":22,"Nigeria":33,"Persia":29,"Peru":53,"Scandinavia":15,"Spain":12,"Sudan":30,"U.S.A.":32,"U.S.S.R.":19,"Venezuela":41,"W Africa":28,"Yugoslavia":20},"France":{"Algeria":14,"Arabia":29,"Atlantic":19,"Brazil":45,"Canada":36,"Columbia":46,"Congo":33,"E Africa":32,"Egypt":24,"England":8,"France":0,"Germany":12,"Italy":10,"Kenya":37,"Libya":17,"Mideast":20,"Nigeria":30,"Persia":28,"Peru":52,"Scandinavia":16,"Spain":9,"Sudan":27,"U.S.A.":35,"U.S.S.R.":21,"Venezuela":42,"W Africa":25,"Yugoslavia":15},"Germany":{"Algeria":17,"Arabia":27,"Atlantic":26,"Brazil":53,"Canada":38,"Columbia":50,"Congo":34,"E Africa":33,"Egypt":20,"England":11,"France":12,"Germany":0,"Italy":9,"Kenya":35,"Libya":18,"Mideast":14,"Nigeria":32,"Persia":24,"Peru":58,"Scandinavia":10,"Spain":16,"Sudan":29,"U.S.A.":39,"U.S.S.R.":15,"Venezuela":45,"W Africa":31,"Yugoslavia":13},"Italy":{"Algeria":15,"Arabia":24,"Atlantic":22,"Brazil":47,"Canada":39,"Columbia":48,"Congo":32,"E Africa":30,"Egypt":19,"England":13,"France":10,"Germany":9,"Italy":0,"Kenya":33,"Libya":14,"Mideast":12,"Nigeria":29,"Persia":25,"Peru":57,"Scandinavia":17,"Spain":11,"Sudan":26,"U.S.A.":38,"U.S.S.R.":18,"Venezuela":44,"W Africa":27,"Yugoslavia":8},"Kenya":{"Algeria":31,"Arabia":26,"Atlantic":43,"Brazil":46,"Canada":64,"Columbia":62,"Congo":17,"E Africa":14,"Egypt":25,"England":40,"France":37,"Germany":35,"Italy":33,"Kenya":0,"Libya":28,"Mideast":30,"Nigeria":22,"Persia":27,"Peru":65,"Scandinavia":39,"Spain":36,"Sudan":18,"U.S.A.":63,"U.S.S.R.":34,"Venezuela":59,"W Africa":32,"Yugoslavia":29},"Libya":{"Algeria":10,"Arabia":20,"Atlantic":29,"Brazil":42,"Canada":44,"Columbia":49,"Congo":24,"E Africa":23,"Egypt":12,"England":21,"France":17,"Germany":18,"Italy":14,"Kenya":28,"Libya":0,"Mideast":13,"Nigeria":19,"Persia":22,"Peru":56,"Scandinavia":27,"Spain":15,"Sudan":16,"U.S.A.":43,"U.S.S.R.":25,"Venezuela":46,"W Africa":26,"Yugoslavia":11},"Mideast":{"Algeria":19,"Arabia":17,"Atlantic":31,"Brazil":54,"Canada":47,"Columbia":57,"Congo":26,"E Africa":24,"Egypt":11,"England":22,"France":20,"Germany":14,"Italy":12,"Kenya":30,"Libya":13,"Mideast":0,"Nigeria":28,"Persia":18,"Peru":64,"Scandinavia":21,"Spain":25,"Sudan":23,"U.S.A.":46,"U.S.S.R.":16,"Venezuela":52,"W Africa":36,"Yugoslavia":10},"Nigeria":{"Algeria":23,"Arabia":31,"Atlantic":35,"Brazil":37,"Canada":48,"Columbia":45,"Congo":15,"E Africa":25,"Egypt":18,"England":33,"France":30,"Germany":32,"Italy":29,"Kenya":22,"Libya":19,"Mideast":28,"Nigeria":0,"Persia":34,"Peru":49,"Scandinavia":36,"Spain":27,"Sudan":17,"U.S.A.":47,"U.S.S.R.":40,"Venezuela":43,"W Africa":16,"Yugoslavia":24},"Persia":{"Algeria":30,"Arabia":30,"Atlantic":42,"Brazil":61,"Canada":55,"Columbia":66,"Congo":31,"E Africa":19,"Egypt":17,"England":29,"France":28,"Germany":24,"Italy":25,"Kenya":27,"Libya":17,"Mideast":18,"Nigeria":34,"Persia":0,"Peru":72,"Scandinavia":26,"Spain":32,"Sudan":21,"U.S.A.":54,"U.S.S.R.":20,"Venezuela":62,"W Africa":41,"Yugoslavia":23},"Peru":{"Algeria":50,"Arabia":70,"Atlantic":44,"Brazil":25,"Canada":43,"Columbia":17,"Congo":54,"E Africa":67,"Egypt":63,"England":53,"France":52,"Germany":58,"Italy":57,"Kenya":65,"Libya":56,"Mideast":64,"Nigeria":49,"Persia":72,"Peru":0,"Scandinavia":60,"Spain":51,"Sudan":62,"U.S.A.":33,"U.S.S.R.":66,"Venezuela":20,"W Africa":43,"Yugoslavia":61},"Scandinavia":{"Algeria":22,"Arabia":32,"Atlantic":25,"Brazil":55,"Canada":34,"Columbia":51,"Congo":40,"E Africa":35,"Egypt":28,"England":15,"France":16,"Germany":10,"Italy":17,"Kenya":39,"Libya":27,"Mideast":21,"Nigeria":36,"Persia":26,"Peru":60,"Scandinavia":0,"Spain":20,"Sudan":31,"U.S.A.":37,"U.S.S.R.":14,"Venezuela":47,"W Africa":38,"Yugoslavia":18},"Spain":{"Algeria":13,"Arabia":33,"Atlantic":17,"Brazil":40,"Canada":35,"Columbia":43,"Congo":29,"E Africa":31,"Egypt":26,"England":12,"France":9,"Germany":16,"Italy":11,"Kenya":36,"Libya":15,"Mideast":25,"Nigeria":27,"Persia":32,"Peru":51,"Scandinavia":20,"Spain":0,"Sudan":28,"U.S.A.":34,"U.S.S.R.":24,"Venezuela":39,"W Africa":23,"Yugoslavia":19},"Sudan":{"Algeria":24,"Arabia":19,"Atlantic":36,"Brazil":44,"Canada":57,"Columbia":61,"Congo":20,"E Africa":12,"Egypt":13,"England":30,"France":27,"Germany":29,"Italy":26,"Kenya":18,"Libya":16,"Mideast":23,"Nigeria":17,"Persia":21,"Peru":62,"Scandinavia":31,"Spain":28,"Sudan":0,"U.S.A.":56,"U.S.S.R.":32,"Venezuela":55,"W Africa":22,"Yugoslavia":25},"U.S.A.":{"Algeria":36,"Arabia":58,"Atlantic":23,"Brazil":41,"Canada":10,"Columbia":26,"Congo":55,"E Africa":61,"Egypt":50,"England":32,"France":35,"Germany":39,"Italy":38,"Kenya":63,"Libya":43,"Mideast":46,"Nigeria":47,"Persia":54,"Peru":33,"Scandinavia":37,"Spain":34,"Sudan":56,"U.S.A.":0,"U.S.S.R.":45,"Venezuela":24,"W Africa":40,"Yugoslavia":42},"U.S.S.R.":{"Algeria":26,"Arabia":23,"Atlantic":38,"Brazil":60,"Canada":41,"Columbia":58,"Congo":39,"E Africa":28,"Egypt":22,"England":19,"France":21,"Germany":15,"Italy":18,"Kenya":34,"Libya":25,"Mideast":16,"Nigeria":40,"Persia":20,"Peru":66,"Scandinavia":14,"Spain":24,"Sudan":32,"U.S.A.":45,"U.S.S.R.":0,"Venezuela":53,"W Africa":44,"Yugoslavia":17},"Venezuela":{"Algeria":40,"Arabia":61,"Atlantic":30,"Brazil":28,"Canada":26,"Columbia":12,"Congo":50,"E Africa":60,"Egypt":54,"England":41,"France":42,"Germany":45,"Italy":44,"Kenya":59,"Libya":46,"Mideast":52,"Nigeria":43,"Persia":62,"Peru":20,"Scandinavia":47,"Spain":39,"Sudan":55,"U.S.A.":24,"U.S.S.R.":53,"Venezuela":0,"W Africa":35,"Yugoslavia":49},"W Africa":{"Algeria":18,"Arabia":18,"Atlantic":37,"Brazil":33,"Canada":42,"Columbia":39,"Congo":21,"E Africa":34,"Egypt":29,"England":28,"France":25,"Germany":31,"Italy":27,"Kenya":32,"Libya":32,"Mideast":26,"Nigeria":16,"Persia":41,"Peru":43,"Scandinavia":38,"Spain":23,"Sudan":22,"U.S.A.":40,"U.S.S.R.":44,"Venezuela":35,"W Africa":0,"Yugoslavia":30},"Yugoslavia":{"Algeria":12,"Arabia":22,"Atlantic":28,"Brazil":51,"Canada":43,"Columbia":53,"Congo":27,"E Africa":26,"Egypt":16,"England":20,"France":15,"Germany":13,"Italy":8,"Kenya":29,"Libya":11,"Mideast":10,"Nigeria":24,"Persia":23,"Peru":61,"Scandinavia":18,"Spain":19,"Sudan":25,"U.S.A.":42,"U.S.S.R.":17,"Venezuela":49,"W Africa":30,"Yugoslavia":0}};

    /* ── Bootstrap ────────────────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', () => {
        data = DECODER_DATA;
        countries = Object.keys(data);

        buildWheel();
        buildDropdowns();
        setupDrag();

        selectOrigin(0);
        selectDestination(1);
    });

    /* ── SVG helpers ──────────────────────────────────────────── */
    function el(tag, attrs = {}) {
        const e = document.createElementNS(SVG_NS, tag);
        for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
        return e;
    }

    /* ── Build the wheel ──────────────────────────────────────── */
    function buildWheel() {
        const svg = document.getElementById('wheel');

        // ── Defs (gradients) ──
        const defs = el('defs');

        const outerGrad = el('radialGradient', { id: 'outer-paper', cx: '50%', cy: '50%', r: '50%' });
        outerGrad.append(
            el('stop', { offset: '0%',   'stop-color': '#e8d5b5' }),
            el('stop', { offset: '70%',  'stop-color': '#dcc8a5' }),
            el('stop', { offset: '100%', 'stop-color': '#c8b890' })
        );
        defs.append(outerGrad);

        const innerGrad = el('radialGradient', { id: 'inner-paper', cx: '50%', cy: '50%', r: '50%' });
        innerGrad.append(
            el('stop', { offset: '0%',   'stop-color': '#f2e4cc' }),
            el('stop', { offset: '70%',  'stop-color': '#eadbc0' }),
            el('stop', { offset: '100%', 'stop-color': '#ddd0b8' })
        );
        defs.append(innerGrad);

        // Drop shadow for discs
        const shadow = el('filter', { id: 'disc-shadow', x: '-5%', y: '-5%', width: '110%', height: '110%' });
        shadow.append(el('feDropShadow', { dx: 0, dy: 4, 'stdDeviation': 12, 'flood-color': 'rgba(0,0,0,0.5)' }));
        defs.append(shadow);

        svg.append(defs);

        // ── Outer disc (rotatable) ──
        const outerG = el('g', { id: 'outer-disc' });

        // Background with shadow
        outerG.append(el('circle', { r: OUTER_R, fill: 'url(#outer-paper)', stroke: '#a08030', 'stroke-width': 3, filter: 'url(#disc-shadow)' }));
        // Decorative rings
        outerG.append(el('circle', { r: OUTER_R - 8, fill: 'none', stroke: 'rgba(160,128,48,0.3)', 'stroke-width': 1 }));
        outerG.append(el('circle', { r: INNER_R + 18, fill: 'none', stroke: 'rgba(160,128,48,0.25)', 'stroke-width': 0.5 }));

        // Tick marks + labels
        for (let i = 0; i < N; i++) {
            const angle = i * STEP;
            addTickMark(outerG, angle, OUTER_TICK_R, 12);
            addCountryLabel(outerG, countries[i], angle, OUTER_TEXT_R, 'outer', i);
        }

        svg.append(outerG);

        // ── Inner disc (fixed) ──
        const innerG = el('g', { id: 'inner-disc' });

        innerG.append(el('circle', { r: INNER_R, fill: 'url(#inner-paper)', stroke: '#a08030', 'stroke-width': 2 }));
        innerG.append(el('circle', { r: INNER_R - 6, fill: 'none', stroke: 'rgba(160,128,48,0.25)', 'stroke-width': 0.5 }));
        innerG.append(el('circle', { r: CENTER_R + 14, fill: 'none', stroke: 'rgba(160,128,48,0.2)', 'stroke-width': 0.5 }));

        for (let i = 0; i < N; i++) {
            const angle = i * STEP;
            addTickMark(innerG, angle, INNER_TICK_R, 10);
            addCountryLabel(innerG, countries[i], angle, INNER_TEXT_R, 'inner', i);
        }

        svg.append(innerG);

        // ── Center display (fixed) ──
        const centerG = el('g', { id: 'center-display' });

        centerG.append(el('circle', { r: CENTER_R, fill: '#14110c', stroke: '#c5a55a', 'stroke-width': 3 }));
        centerG.append(el('circle', { r: CENTER_R - 5, fill: 'none', stroke: 'rgba(197,165,90,0.25)', 'stroke-width': 1 }));

        // "CINEMAWARE" label
        const cmTxt = el('text', {
            y: -60, 'text-anchor': 'middle', 'dominant-baseline': 'central',
            'font-family': "'Cinzel', serif", 'font-size': 13,
            fill: 'rgba(197,165,90,0.5)', 'letter-spacing': '0.15em'
        });
        cmTxt.textContent = 'CINEMAWARE';
        centerG.append(cmTxt);

        // Origin → Dest
        const routeTxt = el('text', {
            id: 'center-route', y: -34, 'text-anchor': 'middle', 'dominant-baseline': 'central',
            'font-family': "'Special Elite', monospace", 'font-size': 14, fill: '#a09078'
        });
        routeTxt.textContent = '— → —';
        centerG.append(routeTxt);

        // Divider line
        centerG.append(el('line', { x1: -50, y1: -16, x2: 50, y2: -16, stroke: 'rgba(197,165,90,0.35)', 'stroke-width': 0.5 }));

        // "FUEL REQUIRED"
        const fuelLabel = el('text', {
            y: -2, 'text-anchor': 'middle', 'dominant-baseline': 'central',
            'font-family': "'Cinzel', serif", 'font-size': 10,
            fill: 'rgba(197,165,90,0.6)', 'letter-spacing': '0.2em'
        });
        fuelLabel.textContent = 'FUEL REQUIRED';
        centerG.append(fuelLabel);

        // Big fuel value
        const fuelVal = el('text', {
            id: 'center-fuel', y: 42, 'text-anchor': 'middle', 'dominant-baseline': 'central',
            'font-family': "'Cinzel', serif", 'font-size': 52, 'font-weight': 700, fill: '#c5a55a'
        });
        fuelVal.textContent = '—';
        centerG.append(fuelVal);

        svg.append(centerG);

        // ── Pointer at top ──
        const ptrG = el('g', { id: 'pointer' });
        // Pointer triangle
        ptrG.append(el('polygon', {
            points: '0,-490 -18,-458 18,-458',
            fill: '#c5a55a', stroke: '#8a6a20', 'stroke-width': 1.5
        }));
        // Line from pointer down to disc
        ptrG.append(el('line', {
            x1: 0, y1: -458, x2: 0, y2: -462,
            stroke: '#c5a55a', 'stroke-width': 2
        }));
        svg.append(ptrG);
    }

    /* ── Tick marks ───────────────────────────────────────────── */
    function addTickMark(parent, angleDeg, outerEdge, length) {
        const rad = (angleDeg - 90) * Math.PI / 180;
        const x1 = outerEdge * Math.cos(rad);
        const y1 = outerEdge * Math.sin(rad);
        const x2 = (outerEdge - length) * Math.cos(rad);
        const y2 = (outerEdge - length) * Math.sin(rad);
        parent.append(el('line', {
            x1, y1, x2, y2,
            stroke: '#8a7a60', 'stroke-width': 1.5
        }));
    }

    /* ── Country labels (radial, D3-style) ────────────────────── */
    function addCountryLabel(parent, name, angleDeg, textR, ring, idx) {
        // Convert angle (0 = top, CW) to SVG rotation (0 = right)
        const svgAngle = angleDeg - 90;
        const needsFlip = angleDeg > 180;

        const g = el('g');
        g.classList.add(`${ring}-country`);
        g.dataset.index = idx;

        const flipStr = needsFlip ? ' rotate(180)' : '';
        g.setAttribute('transform', `rotate(${svgAngle}) translate(${textR},0)${flipStr}`);

        const fontSize = ring === 'outer' ? 26 : 22;
        const txt = el('text', {
            x: needsFlip ? 8 : -8, y: 0,
            'text-anchor': needsFlip ? 'start' : 'end',
            'dominant-baseline': 'central',
            'font-size': fontSize,
            'font-family': "'Special Elite', 'Courier New', monospace",
            fill: '#3a2a1a'
        });
        txt.textContent = name;
        g.append(txt);

        if (ring === 'inner') {
            g.style.cursor = 'pointer';
            // Larger invisible hit area
            const hitBox = el('rect', {
                x: needsFlip ? -8 : -160,
                y: -14,
                width: 168,
                height: 28,
                fill: 'transparent'
            });
            g.insertBefore(hitBox, txt);

            g.addEventListener('click', (e) => {
                e.stopPropagation();
                selectDestination(idx);
            });
        }

        parent.append(g);
    }

    /* ── Drag interaction ─────────────────────────────────────── */
    function setupDrag() {
        const container = document.getElementById('wheel-container');
        const svg = document.getElementById('wheel');
        const outerDisc = document.getElementById('outer-disc');

        let startAngle = 0;
        let startRotation = 0;

        function center() {
            const r = svg.getBoundingClientRect();
            return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        }

        function ptrAngle(e) {
            const c = center();
            return Math.atan2(e.clientY - c.y, e.clientX - c.x) * 180 / Math.PI;
        }

        function ptrDist(e) {
            const c = center();
            const r = svg.getBoundingClientRect();
            const scale = 1000 / r.width;
            const dx = e.clientX - c.x;
            const dy = e.clientY - c.y;
            return Math.sqrt(dx * dx + dy * dy) * scale;
        }

        container.addEventListener('pointerdown', (e) => {
            const dist = ptrDist(e);
            // Only drag when clicking on the outer disc ring area
            if (dist > INNER_R && dist < OUTER_R + 20) {
                isDragging = true;
                startAngle = ptrAngle(e);
                startRotation = outerRotation;
                container.setPointerCapture(e.pointerId);
                e.preventDefault();
            }
        });

        container.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            const cur = ptrAngle(e);
            let delta = cur - startAngle;
            // Handle wrap-around
            if (delta > 180) delta -= 360;
            if (delta < -180) delta += 360;
            outerRotation = startRotation + delta;
            outerDisc.setAttribute('transform', `rotate(${outerRotation})`);
            updateOriginFromRotation(false);
        });

        container.addEventListener('pointerup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            container.releasePointerCapture(e.pointerId);
            snapToNearest();
        });

        container.addEventListener('pointercancel', (e) => {
            if (!isDragging) return;
            isDragging = false;
            snapToNearest();
        });
    }

    /* ── Snap to nearest country ──────────────────────────────── */
    function snapToNearest() {
        const snapped = Math.round(outerRotation / STEP) * STEP;
        animateRotation(outerRotation, snapped, 200, () => {
            outerRotation = snapped;
            updateOriginFromRotation(true);
        });
    }

    function animateRotation(from, to, duration, onDone) {
        const outerDisc = document.getElementById('outer-disc');
        const start = performance.now();
        function frame(time) {
            const t = Math.min((time - start) / duration, 1);
            const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic
            const cur = from + (to - from) * ease;
            outerDisc.setAttribute('transform', `rotate(${cur})`);
            if (t < 1) {
                requestAnimationFrame(frame);
            } else {
                if (onDone) onDone();
            }
        }
        requestAnimationFrame(frame);
    }

    /* ── Origin from rotation ─────────────────────────────────── */
    function updateOriginFromRotation(snap) {
        // The country at index 0 starts at angle 0 (top).
        // Rotating the disc by R degrees means the country at angle -R is now at top.
        const norm = ((-outerRotation % 360) + 360) % 360;
        const idx = Math.round(norm / STEP) % N;
        selectOrigin(idx, snap);
    }

    /* ── Selection ────────────────────────────────────────────── */
    function selectOrigin(idx, updateWheel = true) {
        selectedOriginIdx = idx;
        document.querySelectorAll('.outer-country').forEach((el, i) => {
            el.classList.toggle('selected', i === idx);
        });
        document.getElementById('origin-select').value = countries[idx];
        updateFuel();
    }

    function selectDestination(idx) {
        selectedDestIdx = idx;
        document.querySelectorAll('.inner-country').forEach((el, i) => {
            el.classList.toggle('selected', i === idx);
        });
        document.getElementById('dest-select').value = countries[idx];
        updateFuel();
    }

    /* ── Fuel display update ──────────────────────────────────── */
    function updateFuel() {
        const origin = countries[selectedOriginIdx];
        const dest   = countries[selectedDestIdx];
        const fuel   = data[origin]?.[dest];

        const display = fuel != null ? fuel : '—';
        document.getElementById('center-fuel').textContent = display;
        document.getElementById('center-route').textContent = `${origin} → ${dest}`;
        document.getElementById('lookup-value').textContent = display;
    }

    /* ── Dropdowns ────────────────────────────────────────────── */
    function buildDropdowns() {
        const originSel = document.getElementById('origin-select');
        const destSel   = document.getElementById('dest-select');

        countries.forEach(c => {
            originSel.add(new Option(c, c));
            destSel.add(new Option(c, c));
        });

        originSel.addEventListener('change', () => {
            const idx = countries.indexOf(originSel.value);
            if (idx < 0) return;
            // Animate outer disc to this origin
            const targetRot = -idx * STEP;
            // Find shortest rotation path
            let target = targetRot;
            const diff = target - outerRotation;
            const normDiff = ((diff % 360) + 540) % 360 - 180;
            target = outerRotation + normDiff;

            animateRotation(outerRotation, target, 400, () => {
                outerRotation = target;
                selectOrigin(idx);
            });
        });

        destSel.addEventListener('change', () => {
            const idx = countries.indexOf(destSel.value);
            if (idx >= 0) selectDestination(idx);
        });
    }
})();
