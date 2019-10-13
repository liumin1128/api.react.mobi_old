import Article from '@/mongo/models/article';

export async function verifyPermission(user, id) {
  if (!user && !id) return false;
  const data = await Article.findById(id);
  if (!data || !data.user) return false;
  return `${data.user}` === `${user}`;
}
