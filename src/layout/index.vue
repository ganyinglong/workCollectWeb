<template>
  <el-container>
    <el-aside width = "100px">
      <el-menu :default-active="defaultActive" router
          :collapse="isCollapse">
          <el-menu-item v-for="(item) in navList"
            :key="item.path"
            :index="item.path"
            >
            {{item.name}}
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <div>
        <router-view/>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'Layout',
  methods: {
  },
  data () {
    return {
      defaultActive: '/collect',
      isCollapse: true,
      navList: [
        {
          path: '/collect',
          name: '补贴'
        }, {
          path: '/allowance',
          name: '津贴'
        }
      ]
    }
  }
}
</script>
