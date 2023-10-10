const treeConfig = {
    trunk: {
        color: '#47686B',
        initialWidth: 20
    },
    needles: {
        color: '#4D7557',
        numTufts: 3,
        numNeedlesPerTuftRange: [8, 12], // min-max range
        needleLengthRange: [10, 25],    // min-max range
        angleVariability: Math.PI,
        upwardBias: Math.PI / 16
    }
};

function drawPineTrunk(canvas, startX, startY, trunkHeight) {
    const ctx = canvas.getContext('2d');

    // Tree trunk color
    ctx.strokeStyle = treeConfig.trunk.color;
    ctx.lineWidth = 8;

    // Helper function to draw one side of the trunk
    function drawSide(startX, direction) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        let prevX = startX;
        let prevY = startY;

        for (let y = startY; y >= startY - trunkHeight; y -= 20) {
            let deviation = Math.random() * 10 - 5;  // Deviation between -5 and 5
            let nextX = startX + direction * 15 + deviation;  // Trunk width of approximately 30, adjusted by deviation
            ctx.quadraticCurveTo(prevX, prevY, nextX, y);
            prevX = nextX;
            prevY = y;
        }
        ctx.stroke();
    }

    drawSide(startX, -1);  // Draw left side
    drawSide(startX, 1);   // Draw right side
}

function drawNeedleTuft(canvas, x1, y1, x2, y2, branchDirection) {
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = treeConfig.needles.color;

    const branchAngle = Math.atan2(y2 - y1, x2 - x1);
    const { numTufts, numNeedlesPerTuftRange, needleLengthRange, angleVariability, upwardBias } = treeConfig.needles;

    for (let t = 0; t < numTufts; t++) {
        const tuftPosition = 0.6 + 0.2 * t;

        const tuftX = x1 + tuftPosition * (x2 - x1);
        const tuftY = y1 + tuftPosition * (y2 - y1);

        const numNeedlesPerTuft = numNeedlesPerTuftRange[0] + Math.floor(Math.random() * (numNeedlesPerTuftRange[1] - numNeedlesPerTuftRange[0]));

        for (let i = 0; i < numNeedlesPerTuft; i++) {
            const needleLength = needleLengthRange[0] + Math.random() * (needleLengthRange[1] - needleLengthRange[0]);
            const baseAngle = branchAngle + (branchDirection === 1 ? (Math.PI / 2 - upwardBias) : (-Math.PI / 2 + upwardBias));
            const angle = baseAngle + (Math.random() - 0.5) * angleVariability;

            const endX = tuftX + needleLength * Math.cos(angle);
            const endY = tuftY + needleLength * Math.sin(angle);

            ctx.beginPath();
            ctx.moveTo(tuftX, tuftY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }
}

function drawPineBranches(canvas, startX, startY, trunkHeight) {
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = treeConfig.trunk.color;
    
    const branchStartY = startY - trunkHeight * 0.25;
    const trunkWidth = 30;

    function drawBranchSegment(x1, y1, x2, y2, width) {
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    function drawBranch(x, y, direction, length, width) {
        const angleVariability = Math.PI / 6; // up to +/- 30 degrees
        const baseAngle = direction === 1 ? Math.PI / 4 : 3 * Math.PI / 4;  // Ensuring proper direction for left (-1) and right (1)
        const angle = baseAngle + direction * (Math.random() - 0.5) * angleVariability;
    
        const endX = x + length * Math.cos(angle);
        const endY = y - length * Math.sin(angle);
        
        drawBranchSegment(x, y, endX, endY, width);
        
        if (length > 20) {
            // Main child branch continues in the same direction
            drawBranch(endX, endY, direction, length * 0.6, width * 0.7);
            
            // Chance to split the branch in the opposite direction
            if (Math.random() > 0.5) {
                drawBranch(endX, endY, -direction, length * 0.5, width * 0.7);
            }
        }
        // After the branch segment is drawn, add the foliage
        if (length <= 20) {
            drawNeedleTuft(canvas, x, y, endX, endY, direction);
            ctx.strokeStyle = treeConfig.trunk.color; // Reset branch color after drawing the tuft
        }
    }

    for (let y = branchStartY; y >= startY - trunkHeight + 50; y -= 50) {
        const branchLength = 30 + Math.random() * 40;
        const branchWidth = 4 + Math.random() * 2;

        const xOffset = trunkWidth / 2 + Math.random() * 5 - 2.5;

        drawBranch(startX - xOffset, y, -1, branchLength, branchWidth);
        drawBranch(startX + xOffset, y, 1, branchLength, branchWidth);
    }
}

window.onload = function() {
    const canvas = document.getElementById('myCanvas');
    const startX = canvas.width / 8;
    const startY = canvas.height;
    const trunkHeight = canvas.height;

    drawPineTrunk(canvas, startX, startY, trunkHeight);
    drawPineBranches(canvas, startX, startY, trunkHeight);
};
