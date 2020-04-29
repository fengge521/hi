<template>
  <div class="settings-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <el-row>
        <el-col :span="15">
          <el-form ref="form" :model="user" label-width="80px" :rules="formRules">
            <el-form-item label="编号">
              {{ user.id }}
            </el-form-item>
            <el-form-item label="手机">
              {{ user.mobile }}
            </el-form-item>
            <el-form-item label="媒体名称" prop="name">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="onUpdateUser"
                :loading="updateProfileLoading"
              >保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :offset="2" :span="4">
          <label for="file">
            <el-avatar
              shape="square"
              :size="150"
              fit="cover"
              :src="user.photo"
            ></el-avatar>
            <p>点击修改头像</p>
          </label>
          <input
            id="file"
            type="file"
            hidden
            ref="file"
            @change="onFileChange"
          >
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      append-to-body
      @opened="onDialogOpened"
      @closed="onDialogClosed"
    >
      <div class="preview-image-wrap">
        <img
          class="preview-image"
          :src="previewImage"
          ref="preview-image"
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onUpdatePhoto" :loading="updatePhotoLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserProfile, updateUserPhoto, updateUserProfile } from '@/api/uesr'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import globalBus from '@/utils/global-bus'
export default {
  name: 'SettingsIndex',
  data () {
    return {
      user: {
        email: '',
        id: null,
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      },
      dialogVisible: false, // 控制上传图片裁切预览的显示状态
      previewImage: '', // 预览图片
      cropper: null,
      updatePhotoLoading: false, // 更新用户头像 loading 状态
      updateProfileLoading: false, // 更新基本信息的 loading 状态
      formRules: {
        name: [
          { required: true, message: '请输入媒体名称', trigger: 'blur' },
          { min: 1, max: 7, message: '长度在 1 到 7 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入媒体名称', trigger: 'blur' },
          {
            vaildator (rule, value, callback) {
              if (/^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(value) === true) {
                callback(new Error('请输入正确的邮箱格式'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  created () {
    this.loadUserMessage()
  },
  mounted () {

  },
  methods: {
    onUpdateUser () {
      // 表单验证
      this.$refs.form.validate(valid => {
        // 如验证失败停止提交
        if (!valid) {
          return
        }
        // 验证通过，提交表单
        // 开启 loading 状态
        this.updateProfileLoading = true
        const { name, intro, email } = this.user
        updateUserProfile({
          name,
          intro,
          email
        }).then(res => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })

          // 关闭 loading 状态
          this.updateProfileLoading = false

          // 更新头部当前登录用户的信息
          // 发布通知，用户信息已修改
          globalBus.$emit('update-user', this.user)
        })
      })
    },
    loadUserMessage () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onFileChange () {
      // 处于图片预览
      const file = this.$refs.file
      // h5中的api
      const blobData = window.URL.createObjectURL(file.files[0])
      this.previewImage = blobData
      // 显示弹出层
      this.dialogVisible = true
      // 这个解决了选择相同文件不触发 change 事件问题
      this.$refs.file.value = ''
    },
    onDialogOpened () {
      const image = this.$refs['preview-image']
      if (this.cropper) {
        this.cropper.replace(this.previewImage)
        return
      }
      this.cropper = new Cropper(image, {
        viewMode: 1,
        dragMode: 'none',
        aspectRatio: 1,
        cropBoxResizable: false
      })
    },
    onDialogClosed () {
      // 对话框关闭，销毁裁切器
      // this.cropper.destroy()
    },
    onUpdatePhoto () {
      // 获取裁切的图片对象
      this.cropper.getCroppedCanvas().toBlob(file => {
        const fd = new FormData()
        fd.append('photo', file)
        // 请求更新用户头像请求提交 fd
        updateUserPhoto(fd).then(res => {
          console.log(res)
          // 关闭对话框
          this.dialogVisible = false
          // 更新视图展示
          // 直接把裁切结果的文件对象转为 blob 数据本地预览
          this.user.photo = window.URL.createObjectURL(file)
          // 关闭确定按钮的 loading
          this.updatePhotoLoading = false

          this.$message({
            type: 'success',
            message: '更新头像成功'
          })

          // 更新顶部登录用户的信息
          globalBus.$emit('update-user', this.user)
        })
      })
    }
  }
}
</script>

<style scoped lang="less">

</style>
