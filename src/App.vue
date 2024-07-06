<template>
  <div>
    <input type="file" @change="file1Change">
    <input type="file" @change="file2Change">
    <span>语言：</span>
    <input type="text" v-model="language">
    <button @click="diffFile">比对</button>
    <span>文件名：</span>
    <input type="text" v-model="fileName">
    <button @click="download">下载</button>
  </div>
  <div style="width: calc(100vw - 20px); height: calc(100vh - 40px);" ref="monacoRef"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue'
import * as monaco from 'monaco-editor'

const monacoRef = shallowRef<HTMLDivElement>()
const editor = shallowRef<monaco.editor.IStandaloneDiffEditor>()

let original = '() => {}'
let modified = '() => { console.log(123)}'

const language = ref('javascript')
const fileName = ref('')

const file1Change = (e: any) => {
  const file = e.target.files[0] // 获取上传的文件
  if (file) {
    const reader = new FileReader()
    
    reader.onload = (event: any) => {
      original = event.target.result // 获取文件的文本数据
    }
    
    reader.readAsText(file) // 以文本格式读取文件
  } else {
    console.log('未选择文件')
  }
}

const file2Change = (e: any) => {
  const file = e.target.files[0] // 获取上传的文件
  console.log(file)
  fileName.value = file.name
  if (file) {
    const reader = new FileReader()
    
    reader.onload = (event: any) => {
      modified = event.target.result // 获取文件的文本数据
    }
    
    reader.readAsText(file) // 以文本格式读取文件
  } else {
    console.log('未选择文件')
  }
}

const download = () => {
  const value = editor.value?.getModel()?.modified.getValue() || ''
  const blob = new Blob([value])

  const elink = document.createElement('a')
  if ('download' in elink) {
    elink.download = fileName.value
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob as Blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href)
    elink.remove()
  }
}

const diffFile = () => {
  editor.value?.setModel({
    original: monaco.editor.createModel(original, language.value),
    modified: monaco.editor.createModel(modified, language.value)
  })
}

onMounted(() => {
  editor.value = monaco.editor.createDiffEditor(monacoRef.value!, {
    theme: 'vs-dark',
    // readOnly: true,
  }, {})

  diffFile()
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
button {
  margin-right: 10px;
}
</style>
