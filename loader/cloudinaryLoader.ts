export default function cloudinaryLoader({ src, width, quality }: any) {
  const params = ["f_auto", "c_limit", `w_${width}`, `q_${quality || "auto"}`];
  return `https://res.cloudinary.com/do5vfhi5k/${params.join(",")}${src}`;
}
