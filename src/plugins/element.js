import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

const elementUI = [Button, Form, FormItem, Input]

load(Vue)
function load(Vue) { elementUI.forEach(item => [Vue.use(item)]) }
// 全局挂载弹框提示组件
Vue.prototype.$message = Message
