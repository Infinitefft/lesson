process.env.grpc_proxy = "";
process.env.http_proxy = "";
process.env.https_proxy = "";
process.env.no_proxy = "localhost,127.0.0.1";

import "dotenv/config";
import { parse } from 'path';

import {
  MilvusClient,
  DataType,
  IndexType,
  MetricType,
} from '@zilliz/milvus2-sdk-node';

import {
  OpenAIEmbeddings,
} from '@langchain/openai';
import {
  EPubLoader
} from '@langchain/community/document_loaders/fs/epub';
import {
  RecursiveCharacterTextSplitter
} from '@langchain/textsplitters';

const COLLECTION_NAME = "ebook";
const VECTION_DIM = 1024;
const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 50;
const EPUB_FILE = './天龙八部.epub';

const ADDRESS = process.env.MILVUS_ADDRESS;
const TOKEN = process.env.MILVUS_TOKEN;
const BOOK_NAME = parse(EPUB_FILE).name;
console.log(BOOK_NAME);

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.EMBEDDING_MODEL_KEY,
  model: process.env.EMBEDDING_MODEL_NAME,
  configuration: {
    baseURL: process.env.OPENAI_API_BASE_URL,
  },
  dimesions: VECTION_DIM,
})

const client = new MilvusClient({
  address: ADDRESS,
  token: TOKEN,
})

async function getEmbedding(text) {
  const result = await embeddings.embedQuery(text);
  return result;
}


async function ensureBookCollection(bookId) {
  try {
    const hasCollection = await client.hasCollection({
      collection_name: COLLECTION_NAME,
    })
    if (!hasCollection.value) {
      console.log(`${COLLECTION_NAME} 集合不存在，创建集合`);
      await client.createCollection({
        collection_name: COLLECTION_NAME,
        fields: [
          { name: 'id', data_type: DataType.VarChar, max_length: 100, is_primary_key: true },
          { name: 'book_id', data_type: DataType.VarChar, max_length: 100 },
          { name: 'book_name', data_type: DataType.VarChar, max_length: 100 },
          { name: 'chapter_num', data_type: DataType.Int32 },
          { name: 'index', data_type: DataType.Int32 },
          { name: 'content', data_type: DataType.VarChar, max_length: 10000 },
          { name: 'vector', data_type: DataType.FloatVector, dim: VECTION_DIM },
        ]
      });
      console.log('集合创建成功');

      await client.createIndex({
        collection_name: COLLECTION_NAME,
        field_name: 'vector',
        // 索引类型 向量检索算法
        index_type: IndexType.IVF_FLAT,
        // 相似度计算方式
        metric_type: MetricType.COSINE,
        params: {
          nlist: VECTION_DIM,
        }
      });
      console.log('索引创建成功');
    }

    try {
      await client.loadCollection({
        collection_name: COLLECTION_NAME,
      });
      console.log('集合加载成功');
    } catch (err) {
      console.log('集合已处于加载状态');
    }
  } catch (err) {
    console.error('集合创建失败', err.message);
    throw err;
  }
}


async function loadAndProcessEPubStreaming(bookId) {
  try {
    console.log('开始加载 EPUB 文件');
    const loader = new EPubLoader(
      EPUB_FILE,
      {
        splitChapters: true,
      }
    );

    // 会先按照章节进行拆分
    const documents = await loader.load();
    // console.log(documents);

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: CHUNK_SIZE,
      chunkOverlap: CHUNK_OVERLAP,
      // 分隔符没有指定，默认使用 '\n\n'，'\n'，'。'，','
    })
    let totalInserted = 0;
    for (let chapterIndex = 0; chapterIndex < documents.length; chapterIndex++) {
      const chapter = documents[chapterIndex];
      const chapterContent = chapter.pageContent;
      console.log(`处理第 ${chapterIndex + 1}/${documents.length} 章`);
      const chunks = await textSplitter.splitText(chapterContent);
      console.log(`拆分为 ${chunks.length} 个片段`);
      if (chunks.length === 0) {
        console.log(`跳过空章节\n`);
        continue;
      }
      console.log('生成向量并插入中...');
      const insertedCount = await insertChunksBatch(chunks, bookId, chapterIndex + 1);
      totalInserted += insertedCount;
    }
    console.log(`累计插入 ${totalInserted} 个片段`);
    return totalInserted;
  } catch (err) {
    console.error('加载 EPUB 文件失败', err.message);
    throw err;
  }
}


async function insertChunksBatch(chunks, bookId, chapterIndex) {
  try {
    if (chunks.length === 0) {
      return 0;
    }
    // 性能优化 embedding 并发
    // 返回结果是符合 schema 的数组
    const insertData = await Promise.all(
      chunks.map(async (chunks, chunkIndex) => {
        const vector = await getEmbedding(chunks);
        return {
          id: `${bookId}_${chapterIndex}_${chunkIndex}`,
          book_id: bookId,
          book_name: BOOK_NAME,
          chapter_num: chapterIndex,
          index: chunkIndex,
          content: chunks,
          vector
        }
      })
    )
    const insertResult = await client.insert({
      collection_name: COLLECTION_NAME,
      data: insertData,
    })
    return Number(insertResult.insert_cnt) || 0;
  } catch (err) {
    console.error('插入数据失败', err.message);
    throw err;
  }
}


async function main() {
  try {
    console.log('电子书处理');
    console.log('连接Milvus');
    await client.connectPromise;
    console.log('连接成功');

    const bookId = 1;
    await ensureBookCollection(bookId);
    await loadAndProcessEPubStreaming(bookId);

  } catch (err) {
    console.error(err);
  }
}

main();