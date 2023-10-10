const treeConfig = {
    trunk: {
        color: '#8B4513',
        initialWidth: 20
    },
    needles: {
        color: '#006400',
        numTufts: 3,
        numNeedlesPerTuftRange: [8, 12], // min-max range
        needleLengthRange: [10, 25],    // min-max range
        angleVariability: Math.PI,
        upwardBias: Math.PI / 16
    }
};

// Helper function to calculate the width at a given height
function calculateWidthAtHeight(y, startY, trunkHeight) {
    const progress = (startY - y) / trunkHeight;  // How far along the trunk we are, as a ratio from 0 (base) to 1 (top)
    
    // Quadratic ease-in
    const easeInProgress = progress * progress;
    
    return treeConfig.trunk.initialWidth * (1 - easeInProgress);
}

function drawPineTrunk(canvas, startX, startY, trunkHeight) {
    const ctx = canvas.getContext('2d');
    const topWidth = 0;  // Set width at the top of the trunk

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
            let trunkWidthAtCurrentHeight = calculateWidthAtHeight(y, startY, trunkHeight);
            let nextX = startX + direction * trunkWidthAtCurrentHeight / 2 + deviation;  // Adjusted trunk width based on current height
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

    let currentSpacing = 70; // Initial spacing at the bottom
    const spacingReductionRate = 0.9; // Each step reduces the spacing by this factor

    for (let y = branchStartY; y >= startY - trunkHeight + 50; y -= currentSpacing) {
        const branchLength = 30 + Math.random() * 40;
        const branchWidth = 4 + Math.random() * 2;

        // Calculate the xOffset based on the trunk's width at the current y position
        const trunkWidthAtCurrentHeight = calculateWidthAtHeight(y, startY, trunkHeight);
        const xOffset = trunkWidthAtCurrentHeight / 2 + Math.random() * 5 - 2.5;

        drawBranch(startX - xOffset, y, -1, branchLength, branchWidth);
        drawBranch(startX + xOffset, y, 1, branchLength, branchWidth);
        currentSpacing *= spacingReductionRate; // Reduce the spacing as we move up
    }
}

function drawPineTree(canvas, startX, startY, trunkHeight) {
    drawPineTrunk(canvas, startX, startY, trunkHeight);
    drawPineBranches(canvas, startX, startY, trunkHeight);
}

function drawForest(canvas, numTrees) {
    const treeSpacing = canvas.width / (numTrees + 1); // Base spacing

    for (let i = 1; i <= numTrees; i++) {
        const depthFactor = 0.5 + Math.random() * 0.5; // Random value between 0.5 (far) and 1 (near)
        
        const adjustedTreeSpacing = treeSpacing * depthFactor;
        const treeStartX = i * adjustedTreeSpacing;
        const treeStartY = canvas.height - (canvas.height - 50) * (1 - depthFactor); // Lower the start for farther trees. The "50" provides a base offset from the bottom.
        
        const treeHeight = canvas.height * (0.8 + Math.random() * 0.2) * depthFactor; // Adjust height by depth
        
        drawPineTree(canvas, treeStartX, treeStartY, treeHeight);
    }
}

window.onload = function() {
    const canvas = document.getElementById('myCanvas');
    drawForest(canvas, 10); // Drawing 5 trees for instance
};
