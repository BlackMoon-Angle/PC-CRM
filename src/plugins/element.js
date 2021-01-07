import Vue from 'vue'
import { Button, Form, FormItem, Input, Message, Container, Header, Aside, Main, Menu, Submenu, MenuItem, Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch, Tooltip, Pagination, Dialog } from 'element-ui'

const elementUI = [Button, Form, FormItem, Input, Container, Header, Aside, Main, Menu, Submenu, MenuItem, Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch, Tooltip, Pagination, Dialog]

load(Vue)
function load(Vue) { elementUI.forEach(item => [Vue.use(item)]) }
// 全局挂载弹框提示组件
Vue.prototype.$message = Message
