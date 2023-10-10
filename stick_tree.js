// Get the canvas context
window.onload = function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
  
    // Set the tree color
    ctx.strokeStyle = '#663300';
  
    // Function to draw a branch
    function drawBranch(startX, startY, len, angle, depth) {
        if (depth > 7) return; // Limit the recursion depth
        
        ctx.beginPath();
        ctx.save();

        ctx.translate(startX, startY);
        ctx.rotate(angle * Math.PI / 180);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -len);

        // Reduce the line width as we go deeper into recursion
        ctx.lineWidth *= 0.8;

        ctx.stroke();

        let numberOfBranches = Math.random() * (4 - 2) + 2; // 2 to 4 branches
        let averageAngle = 50 / (numberOfBranches - 1);
        
        for (let i = 0; i < numberOfBranches; i++) {
            let newLength = len * (0.7 + Math.random() * 0.3); // 70% to 100% of the previous length
            let branchAngle = i * averageAngle - 25 + (Math.random() * 20 - 10); // Adding randomness between -10 and 10 degrees
            drawBranch(0, -len, newLength, branchAngle, depth + 1);
        }
  
      ctx.restore();
    }
  
    // Draw the tree
    drawBranch(canvas.width / 2, canvas.height, 100, 0, 0);
  };
  