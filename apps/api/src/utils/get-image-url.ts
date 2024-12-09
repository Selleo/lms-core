export async function getImageUrl(url: string) {
  if (!url || url.startsWith("https://")) return url;

  return await this.filesService.getFileUrl(url);
}
