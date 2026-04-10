<template>
  <div class="page">
    <div class="page_top">
      <p>正在上传 </p>
    </div>
    <div class="content">

    </div>
    <div class="bottom_box">
      <div class="input_btn">
        选择文件上传
        <input 
          type="file"
          multiple
          class="is_input"
          @change="handleUploadFile"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import  { ref, reactive, computed } from 'vue';
// vue 响应式 ref 简单数据， reactive 复杂数据
// 切片太小， 并发数太高
// 切片太大， 并发的意义不大
const chunkSize  = 1* 1024* 1024; // 1MB
// 上传切片列表
const uploadFileList = ref([]);
// 最大请求并发数 6  流量阀
const maxRequest = ref(6);

const useWorker = (file) => {
  return new Promise((resolve) => {
    const worker = new Worker(
      // new URL 的第一个参数必须是相对当前文件的静态路径，不能用 @ 别名（浏览器按 URL 拼路径，不会走 Vite alias）
      new URL('./worker/hash-worker.js', import.meta.url)
    );
    worker.postMessage('hello worker');
    worker.onmessage = (e) => {
      console.log(e.data);
    }
  })
}

const handleUploadFile = async (e)=> {
  const fileEle = e.target;
  // console.log(fileEle.files);
  if (!fileEle || !fileEle.files || fileEle.files.length === 0) {
    return false
  }

  const files = fileEle.files;

  Array.from(files).forEach(async (item, i) => {
    // 单个上传文件
    const file = item;
    console.log(file);
    // 
    let inTaskArrItem = reactive({
      id: new Date() + i // 文件唯一id
    })
    await useWorker(file);
  })
} 
</script>
<style scoped>

</style>

<style scoped>
  * {
    margin: 0;
    padding: 0;
  }
  .page {
    margin: 0 auto;
    background-color: #28323e;
    width: 100vw;
    height: 100vh;
    color: #fff;
    position: relative;
  }
  .page_top {
    height: 48px;
    padding: 0 48px;
    display: flex;
    justify-content: space-between;
    align-content: center;
    font-size: 14px;
    color: #8386be;
  }
</style>
