<template>
  <div class="image-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <div class="action-head">
        <el-radio-group v-model="collect" size="mini" @change="onCollectChange">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button
          size="mini"
          type="success"
          @click="dialogUploadVisible = true"
        >上传素材</el-button>
      </div>
      <!-- 图片 -->
      <el-row :gutter="10">
        <el-col
          :xs="12"
          :sm="6"
          :md="6"
          :lg="4"
          v-for="(img, index) in images"
          :key="index"
        >
          <div class="image-box">
            <el-image
              style="height: 100px"
              :src="img.url"
              fit="cover"
            ></el-image>
            <div class="image-shadow">
              <i class="el-icon-star-off" @click="addImages(img.id)"></i>
              <i class="el-icon-delete" @click="delImages(img.id)"></i>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- 分页设置 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :current-page.sync="page"
        @current-change="onCurrentChange"
        :page-size="pageSize">
        >
      </el-pagination>
    </el-card>
    <el-dialog
      title="上传素材"
      :visible.sync="dialogUploadVisible"
      :append-to-body="true"
    >
    <el-upload
        class="upload-demo"
        drag
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="uploadHeaders"
        name="image"
        multiple
        :show-file-list="false"
        :on-success="onUploadSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImage, addImage, delImage } from '@/api/image'
export default {
  name: 'imageIndex',
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: false, // 默认查询全部素材列表
      images: [], // 图片素材列表
      dialogUploadVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      totalCount: 0, // 总数据条数
      pageSize: 20,
      page: 1
    }
  },
  created () {
    this.loadImages(false)
  },
  mounted () {

  },
  methods: {
    // 进入页面,加载图片
    loadImages (collect) {
      getImage({
        collect,
        page: this.page,
        per_page: this.pageSize
      }).then(res => {
        const { results, total_count: totalCount } = res.data.data
        this.images = results
        this.totalCount = totalCount
      })
    },
    // 当全部收藏切换时触发该函数
    onCollectChange (value) {
      // debugger
      this.loadImages(value)
    },
    onUploadSuccess () {
      this.dialogUploadVisible = false
      this.loadImages(false)
    },
    // 切换分页时触发
    onCurrentChange (page) {
      this.page = page
      this.loadImages(false)
    },
    // 添加收藏
    addImages (imageId) {
      // console.log(imageId)
      this.$confirm('确认收藏吗？', '收藏提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 如果已收藏,则取消收藏
        if (this.collect === true) {
          return
        }
        addImage({
          collect: true // 这里要传递收藏还是取消收藏, TRUE 添加收藏,false 取消收藏
        }, imageId).then(res => {
          this.collect = true
          this.loadImages(true)
          this.$message({
            type: 'success',
            message: '收藏成功'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消收藏'
        })
      })
    },
    // 删除图片
    delImages (imageId) {
      this.$confirm('确认删除吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delImage(imageId).then(res => {
          this.loadImages(false)
          // this.collect = false
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.action-head {
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
.image-box {
  position: relative;
}
.image-shadow {
  position: absolute;
  top: 70px;
  width: 100%;
  height: 30px;
  background-color: rgba(0,0,0,0.8);
}
.el-icon-star-off {
  position: absolute;
  top: 20%;
  left: 40%;
  color: #fff;
}
.el-icon-delete {
  position: absolute;
  top: 20%;
  right: 40%;
  color: #fff;
}
</style>
