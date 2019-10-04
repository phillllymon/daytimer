import {
    vectorMag,
    getHeading,
    toRadians,
    toDegrees
} from '../util/vector_util';

export const makeInArrow = (ctx, x, y, angle, offset, length, width, color) => {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.moveTo(
        x - (offset * Math.sin(angle)),
        y + (offset * Math.cos(angle))
    );
    ctx.lineTo(
        x - ((offset + length) * Math.sin(angle)),
        y + ((offset + length) * Math.cos(angle))
    );
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.fillStyle = color;
    ctx.moveTo(
        x - ((offset - 2) * Math.sin(angle)),
        y + ((offset - 2) * Math.cos(angle))
    );
    ctx.lineTo(
        x - ((offset + 8) * Math.sin(angle + 0.15)),
        y + ((offset + 8) * Math.cos(angle + 0.15))
    );
    ctx.lineTo(
        x - ((offset + 8) * Math.sin(angle - 0.15)),
        y + ((offset + 8) * Math.cos(angle - 0.15))
    );
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
};

export const makeOutArrow = (ctx, x, y, angle, offset, length, width, color) => {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.moveTo(
        x + (offset * Math.sin(angle)),
        y - (offset * Math.cos(angle))
    );
    ctx.lineTo(
        x + ((offset + length) * Math.sin(angle)),
        y - ((offset + length) * Math.cos(angle))
    );
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.fillStyle = color;
    ctx.moveTo(
        x + ((offset + length + 2) * Math.sin(angle)),
        y - ((offset + length + 2) * Math.cos(angle))
    );
    ctx.lineTo(
        x + ((offset + length - 8) * Math.sin(angle + 0.15)),
        y - ((offset + length - 8) * Math.cos(angle + 0.15))
    );
    ctx.lineTo(
        x + ((offset + length - 8) * Math.sin(angle - 0.15)),
        y - ((offset + length - 8) * Math.cos(angle - 0.15))
    );
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
};

export const makeStreamRipple = (ctx, x, y, velocity, heading) => {
    let boatVel = velocity;
    let boatSpeed = vectorMag(boatVel);
    let boatVelHeading = getHeading(boatVel);
    let relBoatVelHeading = toRadians(toDegrees(boatVelHeading) - heading);
    let streamVector = [
        boatSpeed * Math.sin(relBoatVelHeading),
        boatSpeed * Math.cos(relBoatVelHeading)
    ];
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'lightblue';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(
        x - streamVector[0],
        y + streamVector[1]
    );
    ctx.stroke();
}

