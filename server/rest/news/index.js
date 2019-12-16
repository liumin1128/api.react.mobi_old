import { getList } from './service';

export async function fetch(ctx) {
  try {
    const data = await getList(ctx.request.body);
    // console.log('data');
    // console.log(data);
    ctx.body = data;
  } catch (error) {
    console.log('error');
    console.log(error);
    ctx.body = { status: 500, error };
  }
}
