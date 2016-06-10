function AlignmentPattern(posX, posY, estimatedModuleSize) {
    this.x = posX;
    this.y = posY;
    this.count = 1;
    this.estimatedModuleSize = estimatedModuleSize;

    this.__defineGetter__("EstimatedModuleSize", function() {
        return this.estimatedModuleSize;
    });
    this.__defineGetter__("Count", function() {
        return this.count;
    });
    this.__defineGetter__("X", function() {
        return Math.floor(this.x);
    });
    this.__defineGetter__("Y", function() {
        return Math.floor(this.y);
    });
    this.incrementCount = function() {
        this.count++;
    }
    this.aboutEquals = function(moduleSize, i, j) {
        if (Math.abs(i - this.y) <= moduleSize && Math.abs(j - this.x) <= moduleSize) {
            var moduleSizeDiff = Math.abs(moduleSize - this.estimatedModuleSize);
            return moduleSizeDiff <= 1.0 || moduleSizeDiff / this.estimatedModuleSize <= 1.0;
        }
        return false;
    }

}
