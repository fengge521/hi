<template>
  <div class="fans-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <div ref="main" style="width: 600px;height:400px;"></div>
      <h2>地图图表示例</h2>
      <map-demo />
      <h2>纯粹的百度地图示例</h2>
      <bmap-demo />
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import MapDemo from './components/map-demo'
import BmapDemo from './components/bmap-demo'
export default {
  name: 'FansIndex',
  components: {
    MapDemo, // 百度地图结合 echarts
    BmapDemo // 纯粹的百度地图
  },
  data () {
    return {
      MapDemo, // 百度地图结合 echarts
      BmapDemo // 纯粹的百度地图
    }
  },
  created () {

  },
  mounted () {
    var myChart = echarts.init(this.$refs.main)

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['衬衫123', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    }

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  },
  methods: {

  }
}
</script>

<style scoped lang="less">

</style>
