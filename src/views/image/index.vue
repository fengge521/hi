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
        <el-radio-group v-model="collect" size="mini">
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
              <el-button
                type="warning"
                :icon="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
                circle
                size="small"
                @click="addImages(img)"
                :loading="img.loading"
              ></el-button>
              <el-button
                size="small"
                type="danger"
                icon="el-icon-delete-solid"
                circle
                :loading="img.loading"
                @click="delImages(img)"
              ></el-button>
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
      pageSize: 10,
      page: 1
    }
  },
  created () {
    this.loadImages(1)
  },
  mounted () {

  },
  methods: {
    // 进入页面,加载图片
    loadImages (page) {
      this.page = page
      getImage({
        collect: this.collect,
        page,
        per_page: this.pageSize
      }).then(res => {
        const results = res.data.data.results
        this.images = results
        this.totalCount = res.data.data.total_count
        results.forEach(img => {
          img.loading = false
        })
      })
    },
    // 当全部收藏切换时触发该函数
    // onCollectChange () {
    //   // debugger
    //   this.loadImages(1)
    // },
    onUploadSuccess () {
      // 关闭弹层
      this.dialogUploadVisible = false
      // 更新列表
      this.loadImages(this.page)
      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },
    // 切换分页时触发
    onCurrentChange (page) {
      // 展示loading效果
      this.loadImages(page)
    },
    // 添加收藏
    addImages (img) {
      // console.log(imageId)
      img.loading = true
      // 如果已收藏,则取消收藏
      addImage(img.id, !img.is_collected).then(res => {
        img.is_collected = !img.is_collected
        // 关闭loading
        img.loading = false
      })
    },
    // 删除图片
    delImages (img) {
      this.$confirm('确认删除吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        img.loading = true
        delImage(img.id).then(res => {
          this.loadImages(this.page)
          img.loading = false
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
  top: 60px;
  width: 100%;
  height: 40px;
  color: #fff;
  background-color: rgba(0,0,0,0.8);
  font-size: 20px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
</style>
