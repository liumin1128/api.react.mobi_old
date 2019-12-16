import algoliasearch from 'algoliasearch';

import { APP_ID, ADMIN_KEY } from '@/config/algolia';

export const client = algoliasearch(APP_ID, ADMIN_KEY);

export const test_test = client.initIndex('test_test');

test_test.setSettings({
  attributesForFaceting: [
    'title',
    'content',
    'categorys',
    'category',
    'author',
  ],
});

export function pushAllDataToAlgolia(index, model, keys) {
  let skip = 0;
  const limit = 10;

  function loop() {
    model
      .find({}, keys)
      .limit(limit)
      .skip(skip)
      .then((result) => {
        if (result.length !== 0) {
          index.saveObjects(
            result.map(i => ({
              title: i.title,
              content: i.content,
              objectID: i._id,
              categories: i.tags,
              cover: i.cover || (Array.isArray(i.photos) ? i.photos[0] : ''),
            })),
          );
        }
        if (result.length === limit) {
          skip += limit;
          loop();
        }
      });
  }

  loop();
}

// 添加，更新和部分更新之间的差异＃
// Algolia提供了三种更改索引内容的方法。了解它们之间的差异很重要，这样您才能更好地管理更新。

// 添加对象＃
// 要将新记录添加到索引时，需要使用addObjects。

// 也就是说，您还可以使用此方法来更新记录，方法是包括objectID现有记录的。我们不建议这样做。相反，您应该使用saveObjects。

// 该addObjects方法不需要objectID。

// 当您指定objectID且objectID索引中不存在时，将创建一条新记录。
// 当您指定an objectID并且objectID索引中已经存在时，相关记录将被替换。
// 如果您未指定objectID，则Algolia会自动分配objectID，在响应中返回。
// 更新对象＃
// 要替换整个记录时，需要使用saveObjects。

// 该saveObjects方法需要objectID。

// 当objectID索引中存在指定的内容时，将替换相关记录。
// 当objectID索引中不存在指定的内容时，将创建一个新记录。
// 如果objectID未指定，则该方法将返回错误。
// 注意：用于更新对象的方法称为saveObjects。在整个文档中，我们可以互换使用这些术语。

// 部分更新对象＃
// 当您要替换单个属性时，需要使用partialUpdateObjects。

// 该partialUpdateObjects方法需要objectID。

// 当指定的内容objectID存在于索引中时，将替换属性。
// 当objectID索引中不存在指定的内容时，将创建一个新记录。
// 如果objectID未指定，则该方法将返回错误。
// 注意：要记住的重要一件事是，partialUpdateObjects方法不会替换整个对象。它仅添加，删除或更新指定的单个属性。未指定的属性保持不变。这与addObjects和saveObjects不同，后者都替换了整个对象。

// 对于所有三个＃
// 这些方法均具有单数和复数形式。
// 如果为单数（例如addObject），则该方法仅接受单个对象作为参数
// 如果为复数（例如addObjects），则该方法接受一个或多个对象
