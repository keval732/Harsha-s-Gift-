let highestZ = 1;

class Paper {
  holding = false;
  rotating = false;
  offsetX = 0;
  offsetY = 0;
  posX = 0;
  posY = 0;
  rotation = Math.random() * 30 - 15;
  initialAngle = 0;

  init(paper) {
    paper.style.transform = `translate(0px, 0px) rotate(${this.rotation}deg)`;

    paper.addEventListener('touchstart', (e) => {
      e.preventDefault();
      paper.style.zIndex = highestZ++;
      
      if (e.touches.length === 1) {
        // Single finger drag
        this.holding = true;
        const touch = e.touches[0];
        this.offsetX = touch.clientX - this.posX;
        this.offsetY = touch.clientY - this.posY;
      }

      if (e.touches.length === 2) {
        // Two finger rotate
        this.rotating = true;
        this.initialAngle = this.getAngle(e.touches);
      }
    });

    paper.addEventListener('touchmove', (e) => {
      e.preventDefault();

      if (this.holding && e.touches.length === 1) {
        const touch = e.touches[0];
        this.posX = touch.clientX - this.offsetX;
        this.posY = touch.clientY - this.offsetY;
      }

      if (this.rotating && e.touches.length === 2) {
        const currentAngle = this.getAngle(e.touches);
        const angleDiff = currentAngle - this.initialAngle;
        this.rotation += angleDiff;
        this.initialAngle = currentAngle;
      }

      paper.style.transform = `translate(${this.posX}px, ${this.posY}px) rotate(${this.rotation}deg)`;
    });

    paper.addEventListener('touchend', (e) => {
      if (e.touches.length === 0) {
        this.holding = false;
        this.rotating = false;
      }
    });
  }

  getAngle(touches) {
    const dx = touches[1].clientX - touches[0].clientX;
    const dy = touches[1].clientY - touches[0].clientY;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
