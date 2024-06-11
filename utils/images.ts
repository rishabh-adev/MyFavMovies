

export function getImageUrl(path: string | undefined, width:string| undefined): string {
  return `https://image.tmdb.org/t/p/${width}${path}`;
}
