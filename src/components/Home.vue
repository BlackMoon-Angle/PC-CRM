<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      // 退出登录，清空 sessionStorage 中保存的 token
      window.sessionStorage.clear()
      // 清除后跳转至登录页
      this.$router.push('/login')
    }
  }
}
</script>

<style></style>
