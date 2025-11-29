export function getNotificationLink(item: any) {
  if (item.productId) {
    return `/product/detail?productId=${item.productId}`;
  }

  if (item.articleId) {
    return `/community/detail?articleId=${item.articleId}`;
  }

  if (item.authorId) {
    return `/seller/${item.authorId}`;
  }

  return '/';
}
