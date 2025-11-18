document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('riemannCanvas');
    const ctx = canvas.getContext('2d');
    const funcInput = document.getElementById('functionInput');
    const intervalA = document.getElementById('intervalA');
    const intervalB = document.getElementById('intervalB');
    const rectanglesSlider = document.getElementById('rectangles');
    const rectanglesValueSpan = document.getElementById('rectanglesValue');
    const sumTypeSelect = document.getElementById('sumType');

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const xScale = (width - 2 * padding) / (parseFloat(intervalB.value) - parseFloat(intervalA.value));
    const yScale = 50; // Adjust for vertical scaling

    function draw() {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Parse user input
        const a = parseFloat(intervalA.value);
        const b = parseFloat(intervalB.value);
        const n = parseInt(rectanglesSlider.value);
        const sumType = sumTypeSelect.value;
        const fnString = funcInput.value;

        let func;
        try {
            // A safer way to evaluate a mathematical expression from a string
            func = new Function('x', 'return ' + fnString);
        } catch (e) {
            console.error("Invalid function provided.", e);
            return;
        }

        // Draw axes
        ctx.beginPath();
        ctx.strokeStyle = '#333';
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(padding, padding);
        ctx.stroke();

        // Draw function graph
        ctx.beginPath();
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        let firstPoint = true;
        for (let x = a; x <= b; x += (b - a) / (width - 2 * padding)) {
            const y = func(x);
            const canvasX = padding + (x - a) * xScale;
            const canvasY = height - padding - y * yScale;
            if (firstPoint) {
                ctx.moveTo(canvasX, canvasY);
                firstPoint = false;
            } else {
                ctx.lineTo(canvasX, canvasY);
            }
        }
        ctx.stroke();

        // Draw Riemann sum rectangles
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.fillStyle = 'rgba(173, 216, 230, 0.6)'; // Light blue
        const deltaX = (b - a) / n;
        let riemannSum = 0;

        for (let i = 0; i < n; i++) {
            let samplePoint;
            switch (sumType) {
                case 'left':
                    samplePoint = a + i * deltaX;
                    break;
                case 'right':
                    samplePoint = a + (i + 1) * deltaX;
                    break;
                case 'midpoint':
                    samplePoint = a + (i + 0.5) * deltaX;
                    break;
            }

            const x = a + i * deltaX;
            const y = func(samplePoint);
            const rectX = padding + (x - a) * xScale;
            const rectWidth = deltaX * xScale;
            const rectHeight = y * yScale;
            const rectY = height - padding - rectHeight;

            ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
            ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);

            riemannSum += y * deltaX;
        }
        
        // Display the calculated sum
        ctx.fillStyle = '#000';
        ctx.fillText(`Approximate Area: ${riemannSum.toFixed(4)}`, padding, padding - 10);
    }

    // Event listeners for interactive controls
    funcInput.addEventListener('change', draw);
    intervalA.addEventListener('change', draw);
    intervalB.addEventListener('change', draw);
    rectanglesSlider.addEventListener('input', () => {
        rectanglesValueSpan.textContent = rectanglesSlider.value;
        draw();
    });
    sumTypeSelect.addEventListener('change', draw);

    // Initial draw
    draw();
});
