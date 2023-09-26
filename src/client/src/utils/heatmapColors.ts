import chroma from "chroma-js";

export default function generateShades(
  brightestColor: string,
  numShades: number,
  startColor: string,
) {
  const colorScale = chroma.scale([startColor, brightestColor]).mode("lab");
  const shades = [];

  for (let i = 0; i < numShades; i++) {
    const shade = colorScale(i / (numShades - 1)).hex();
    shades.push(shade);
  }

  return shades;
}
