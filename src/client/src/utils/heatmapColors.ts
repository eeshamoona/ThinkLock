import chroma from "chroma-js";

export default function generateShades(brightestColor: any, numShade: number) {
  const colorScale = chroma.scale(["white", brightestColor]).mode("lab");
  const shades = [];

  for (let i = 0; i < numShade; i++) {
    const shade = colorScale(i / (numShade - 1)).hex();
    shades.push(shade);
  }

  return shades;
}
