<template>
    <div>
        <h1>hello vue</h1>
        <input type="file" ref="fileInput">
        <div class="upload-btn" @click="upload">上传</div>
        <img :src="logo" alt="">
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { uploadFile, sendMsg } from '@/server/index.js'
import logo from '@/assets/logo.svg'
const fileInput = ref(null)

const inputValue = ref("12")
const upload = () => {
    const files = fileInput.value.files

    console.log("files", files)
    // console.log(files)
    if (files.length === 0) {
        console.log("请选择文件")
        return
    }
    const formData = new FormData()

    const file = files[0]
    console.log(file)
    formData.append("file", file)
    formData.append("name", file.name)
    uploadFile(file)
        .then(async response => {
            console.log('response:', response);
            console.log('response.data:', response.data);
            console.log('response.data type:', typeof response.data);
            console.log('response.data instanceof Blob:', response.data instanceof Blob);
            const blob = new Blob([response.data], { type: response.type });
            if (!blob || !(blob instanceof Blob)) {
                console.error('不是有效的 Blob:', blob);
                return;
            }

            const filename = file.name;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            a.remove();
        })
        .catch(err => {
            console.error('上传失败:', err);
            // 如果是 blob 类型的错误响应
            if (err.response && err.response.data instanceof Blob) {
                const reader = new FileReader();
                reader.onload = () => {
                    console.error('服务器错误:', JSON.parse(reader.result));
                };
                reader.readAsText(err.response.data);
            }
        })

}

const send = async () => {
    if (!inputValue.value) {
        console.log("请输入内容")
        return
    }
    const res = await sendMsg({
        msg: inputValue.value
    })

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    console.log(reader)
    debugger
    const read = () => {
        reader.read().then((obj) => {
            console.log(obj)
            const { done, value } = obj
            if (done) {
                console.log('流结束')
                return
            }
            const chunk = decoder.decode()
            console.log('收到:', chunk)
            read() // 继续读取下一块
        })
    }
    read()
}
</script>

<style scoped>
.upload-btn {
    margin-top: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    width: 120px;
    line-height: 32px;
    background-color: #f5f5f5;
}

.send-btn {
    margin-top: 10px;
}
</style>
