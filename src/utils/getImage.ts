export function getImage(image: any) {
  if (typeof image === "string") {
    return { uri: image };
  }
  return image;
}
