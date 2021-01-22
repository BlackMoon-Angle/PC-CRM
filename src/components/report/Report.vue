<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 折线图区 -->
      <div id="main" style="width: 750px;height: 400px;"></div>
    </el-card>
  </div>
</template>

<script>
import lodash from 'lodash'
var echarts = require('echarts')
export default {
  data() {
    return {
      options: { // 需要合并的对象
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {},
  async mounted() { // 此时，页面上的元素已经被渲染完毕
    // 初始化 echarts 实例
    var myChart = echarts.init(document.getElementById('main'))
    // 请求数据
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取折线图数据失败！')
    }
    // 利用 lodash 将数据合并
    const result = lodash.merge(res.data, this.options)
    // 数据可视化
    myChart.setOption(result)
  },
  methods: {}
}
</script>

<style lang="less" scoped>

</style>
