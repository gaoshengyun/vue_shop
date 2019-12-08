<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button @click="logout" type="info">退出</el-button>
    </el-header>
    <!-- 页面主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollpase ? '64px' : '200px'">
        <div @click="toggleCollapse" class="toggle-buuton">|||</div>
        <el-menu
          :collapse="isCollpase"
          :collapse-transition="false"
          router
          unique-opened
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff">
          <!-- 一级菜单 -->
          <el-submenu
            v-for="item in menuList"
            :key="item.id"
            :index="item.id + ''">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span> {{item.authName}} </span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              v-for="subItem in item.children" :key="subItem.id"
              :index="'/' + subItem.path">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span> {{subItem.authName}} </span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: 'Home',
  data () {
    return {
      menuList: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollpase: false
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menuList = res.data
    },
    toggleCollapse () {
      this.isCollpase = !this.isCollpase
    }
  },
  mounted () {
    this.getMenuList()
  }
}
</script>
<style lang="scss" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  div{
    display: flex;
    align-items: center;
    span {
      color: #fff;
      font-size: 20px;
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .toggle-buuton {
    background-color: #4a5064;
    color: #fff;
    text-align: center;
    font-size: 10px;
    line-height: 24px;
    letter-spacing: .2em;
    cursor: pointer;
  }
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
</style>
