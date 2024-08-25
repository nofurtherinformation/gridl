import { heading } from "./heading.js";

const points = {
  origin: {
    lat: 0,
    lon: 0,
  },
  n: {
    lat: 1,
    lon: 0,
  },
  e: {
    lat: 0,
    lon: 1,
  },
  s: {
    lat: -1,
    lon: 0,
  },
  w: {
    lat: 0,
    lon: -1,
  },
  ne: {
    lat: 1,
    lon: 1,
  },
  se: {
    lat: -1,
    lon: 1,
  },
  sw: {
    lat: -1,
    lon: -1,
  },
  nw: {
    lat: 1,
    lon: -1,
  }
}

// describe("heading", () => {
//   it("should return the correct heading", () => {
//     expect(heading(points.origin, points.n)).toBe(0);
//     expect(heading(points.origin, points.e)).toBe(90);
//     expect(heading(points.origin, points.s)).toBe(180);
//     expect(heading(points.origin, points.w)).toBe(270);
//     expect(heading(points.origin, points.ne)).toBe(45);
//     expect(heading(points.origin, points.se)).toBe(135);
//     expect(heading(points.origin, points.sw)).toBe(225);
//     expect(heading(points.origin, points.nw)).toBe(315);
//   });
// });
// as vanilla
const [
  on,
  oe,
  os,
  ow,
  one,
  onw,
  osw,
  ose
] = [
  heading(points.origin.lat, points.origin.lon, points.n.lat, points.n.lon),
  heading(points.origin.lat, points.origin.lon, points.e.lat, points.e.lon),
  heading(points.origin.lat, points.origin.lon, points.s.lat, points.s.lon),
  heading(points.origin.lat, points.origin.lon, points.w.lat, points.w.lon),
  heading(points.origin.lat, points.origin.lon, points.ne.lat, points.ne.lon),
  heading(points.origin.lat, points.origin.lon, points.nw.lat, points.nw.lon),
  heading(points.origin.lat, points.origin.lon, points.sw.lat, points.sw.lon),
  heading(points.origin.lat, points.origin.lon, points.se.lat, points.se.lon),

]
console.log(on, oe, os, ow, one, onw, osw, ose)