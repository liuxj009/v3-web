import axios from 'axios'
import { config } from '../config/index..js'
const request = axios.create({
    baseURL: config.baseUrl,
    // timeout: 5000
})
request.interceptors.request.use(
    config => {
        return config
    },
    err => {
        return Promise.reject(err)
    }
)
request.interceptors.response.use(
    res => {
        return res
    },
    err => {
        return Promise.reject(err)
    }
)
const sendData = (config) => {
    return request(config)
}

const uploadFile = async (file) => {
    const formData = new FormData()
    formData.append("file", file)
    const res = await sendData({
        url: "/upload/single",
        method: "post",
        data: formData
    })
    return res
}

export const sendMsg = async (data) => {
    const response = await fetch(`${baseUrl}/sse`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return response
}
const uploadFileWithProgress = async (file, onProgress) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        const formData = new FormData()
        formData.append("file", file)
        formData.append("name", file.name)

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable && onProgress) {
                const percent = Math.round((e.loaded / e.total) * 100)
                onProgress(percent, e.loaded, e.total)
            }
        }

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    resolve(JSON.parse(xhr.responseText))
                } catch {
                    resolve(xhr.responseText)
                }
            } else {
                reject(new Error(`上传失败: ${xhr.status}`))
            }
        }

        xhr.onerror = () => reject(new Error("网络错误"))

        xhr.open("POST", `${baseUrl}/upload`)
        xhr.send(formData)
    })
}

export { uploadFile, uploadFileWithProgress }