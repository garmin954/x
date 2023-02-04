import React, { Dispatch, useEffect, useState } from 'react'
import { Button, Card, Descriptions, message, Progress, UploadProps } from 'antd'
import ShowTips from './showTips'
import { connect, useDispatch, useSelector } from 'react-redux'
import { InboxOutlined } from '@ant-design/icons';
import Dragger from 'antd/es/upload/Dragger';
import { FileUploadApi, FileUploadCombineApi, FileDownloadApi } from '@/api';
import SparkMD5 from "spark-md5";
import useThrottle from '@/hooks/useThrottle';
const ChunkSize = 1024 * 1024

const Dashboard: React.FC = (props: any) => {
    const dispatch = useDispatch()


    /**
     * 分割文件
     * @param file 
     * @param size 
     * @returns 
     */
    function createFileChunk(file: File, size = SIZE) {
        const fileChunkList = [];
        let cur = 0;
        while (cur < file.size) {
            fileChunkList.push({ file: file.slice(cur, cur + size) });
            cur += size;
        }
        return fileChunkList;
    }

    // 上传切片
    async function uploadChunks(chunkHash, name, size) {
        const requestList = chunkHash.map(({ chunk, hash }) => {
            const formData = new FormData();
            formData.append("file", chunk);
            formData.append("hash", hash);
            formData.append("filename", name);
            return { formData };
        }).map(({ formData }, i) => {
            return FileUploadApi(i, formData)
        });
        console.log('requestList ', requestList);

        // 并发请求
        await Promise.all(requestList).then((response) => {
            console.log('response --------', response);
            FileUploadCombineApi({
                name,
                hash: hash + '',
                size
            }).then((response) => {
                console.log('combine response --------', response);
            })
        });
    }



    const upprops: UploadProps = {
        name: 'file',
        multiple: true,
        customRequest: (option) => {
            return new Promise((resolve, reject) => {

                const file = option.file as File
                const chunks = Math.ceil(file.size / ChunkSize);
                const spark = new SparkMD5.ArrayBuffer();
                const fileReader = new FileReader();
                let currentChunk = 0;
                function loadNext() {
                    const start = currentChunk * ChunkSize;
                    const end = start + ChunkSize >= file.size ? file.size : start + ChunkSize;
                    fileReader.readAsArrayBuffer(file.slice(start, end));
                }

                fileReader.onload = (e) => {
                    spark.append(e.target?.result)
                    currentChunk++;

                    if (currentChunk < chunks) {
                        loadNext();
                        console.log(`第${currentChunk}分片解析完成，开始解析${currentChunk + 1}分片`);
                    } else {
                        console.log('finished loading');
                        const result = spark.end();
                        // 如果单纯的使用result 作为hash值的时候, 如果文件内容相同，而名称不同的时候
                        // 想保留两个文件无法保留。所以把文件名称加上。
                        const sparkMd5 = new SparkMD5();
                        sparkMd5.append(result);
                        sparkMd5.append(file.name);
                        const hexHash = sparkMd5.end();
                        resolve(hexHash);
                    }
                }

                fileReader.onerror = () => {
                    console.warn('文件读取失败！');
                };
                loadNext();
            }).catch(err => {
                console.log(err);
            });






            uploadChunks(chunkHash, file.name, file.size)

        },
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const [percent, setPercent] = useState(0)
    const [bytesa, setBytes] = useState(0)

    const bytes = useThrottle(bytesa, 500)

    const downloadFunc = () => {
        FileDownloadApi((progressEvent) => {
            console.log('progressEvent', progressEvent);
            
            const { progress=0, bytes } = progressEvent
            setPercent((Math.floor(progress * 100)))
            setBytes(Number((bytes / 1024).toFixed(2)))
        }).then(response => {
            const { headers, data } = response
            console.log('response:', data);
            console.log(headers);

            const fileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, '$1')
            console.log('fileName', fileName);

            // 此处当返回json文件时需要先对data进行JSON.stringify处理，其他类型文件不用做处理
            //const blob = new Blob([JSON.stringify(data)], ...)
            const blob = new Blob([data], { type: headers['content-type'] })
            let dom = document.createElement('a')
            let url = window.URL.createObjectURL(blob)
            dom.href = url
            dom.download = decodeURI(fileName)
            dom.style.display = 'none'
            document.body.appendChild(dom)
            dom.click()
            // dom.parentNode.removeChild(dom)
            window.URL.revokeObjectURL(url)
        })
    }

    return (
        <div>
            <Descriptions title={'state'}></Descriptions>
            <Dragger {...upprops}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                    band files
                </p>
            </Dragger>

            
            <Card title={<Button onClick={downloadFunc}>download</Button> }>

                <Progress
                    type="circle"
                    percent={percent} 
                    format={(percent) => <div>{percent}% <br /> <span style={{ fontSize: '12px' }}>{bytes}k/s</span></div>}
                />
            </Card>

        </div>
    )
}


export default Dashboard