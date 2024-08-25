function toRadians(degrees) {
    return degrees * Math.PI / 180;
}
/**
 * Calculates the heading (bearing) from one point to another.
 * @param {number} lat1 - Latitude of the first point in degrees.
 * @param {number} lon1 - Longitude of the first point in degrees.
 * @param {number} lat2 - Latitude of the second point in degrees.
 * @param {number} lon2 - Longitude of the second point in degrees.
 * @returns {number} The heading from the first point to the second point in degrees.
 */
export function heading(lat1, lon1, lat2, lon2) {
    // Convert degrees to radians

    const lat1Rad = toRadians(lat1);
    const lon1Rad = toRadians(lon1);
    const lat2Rad = toRadians(lat2);
    const lon2Rad = toRadians(lon2);

    const dLon = lon2Rad - lon1Rad;

    const x = Math.sin(dLon) * Math.cos(lat2Rad);
    const y = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);

    let heading = Math.atan2(x, y);

    // Convert heading from radians to degrees
    heading = heading * 180 / Math.PI;

    // Normalize heading to be between 0 and 360 degrees
    heading = (heading + 360) % 360;

    return heading;
}
