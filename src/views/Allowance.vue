<template>
  <el-form :model="formData">
    <el-row gutter="20">
      <el-col :span="8">
        姓名：
        <el-input label="姓名" placeholder="请输入姓名" v-model = "formData.userName"
        @change="handleNameBlur()"
        style="width:70%" ></el-input>
      </el-col>
      <el-col :span="8">
        新系统工号：
        <el-input label="工号" placeholder="请输入工号"
        :disabled="canNotEdit"
        v-model="formData.empNo" style="width:70%"/>
      </el-col>
      <el-col span="8">
        所在项目：
        <el-input placeholder="输入所在项目" :disabled="canNotEdit"
        v-model="formData.projectName" style="width:70%"/>
      </el-col>
    </el-row>
    <el-row gutter="20" style="margin-top:20px">
      <el-col :span="8" type="inline-flex" justify="start">
        入职时间：
        <el-date-picker value-format="yyyy-MM-dd" v-model="formData.initiationDate" :disabled="canNotEdit">
        </el-date-picker>
      </el-col>
      <el-col :span="8">
        试用期结束时间：
        <el-date-picker value-format="yyyy-MM-dd" v-model="formData.probationEnd" :disabled="canNotEdit">
        </el-date-picker>
      </el-col>
      <el-col :span="8">
        离职日期：
        <el-date-picker value-format="yyyy-MM-dd" v-model="formData.quitDate" :disabled="canNotEdit">
        </el-date-picker>
      </el-col>
    </el-row>
    <el-table :data="formData.tableData">
      <el-table-column label="项目开始时间" >
        <template slot-scope="scope">
          <el-date-picker value-format="yyyy-MM-dd" v-model="scope.row.projectStart"/>
        </template>
      </el-table-column>
      <el-table-column label="项目结束时间">
        <template slot-scope="scope">
          <el-date-picker value-format="yyyy-MM-dd" v-model="scope.row.projectEnd"/>
        </template>
      </el-table-column>
      <el-table-column label="当月在项天数">
        <template slot-scope="scope">
          <el-input v-model="scope.row.projectDays"/>
        </template>
      </el-table-column>
      <el-table-column label="当月事病假天数">
        <template slot-scope="scope">
          <el-input v-model="scope.row.leaveDays"/>
        </template>
      </el-table-column>
      <el-table-column label="当月事病假请假明细(格式:XX年XX月XX日X假X天)、产假人员">
        <template slot-scope="scope">
          <el-input type="textarea" v-model="scope.row.leaveDetail"/>
        </template>
      </el-table-column>
      <el-table-column label="备注（各种调休、带薪假、当月入离职当天是否在项员工等）">
        <template slot-scope="scope">
          <el-input type="textarea" v-model="scope.row.mark"/>
        </template>
      </el-table-column>
      <el-table-column label="" width="90px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger" icon="el-icon-delete"
              circle v-if="scope.row.state==0"
              @click="removeColumn(scope.$index)"></el-button>
          </template>
        </el-table-column>
    </el-table>
    <div style="margin-top:20px">
      <el-button @click="submit" icon="el-icon-check"
      plain title="提交"
      type="success" :loading="submitLoadding" style="width:100%">提交</el-button>
    </div>
  </el-form>
</template>

<script>
import { userInfo } from '@/api/user'
import { submitAllowance } from '@/api/allowance'
import { Message } from 'element-ui'

export default {
  name: 'Allowance',
  methods: {
    handleNameBlur () {
      this.canNotEdit = true
      userInfo(this.formData.userName).then(response => {
        if (response.code === '000000' && response.data) {
          this.formData.empNo = response.data.empNo || ''
          this.formData.projectName = response.data.projectName || ''
          this.formData.initiationDate = response.data.initiationDate || ''
        } else {
          this.formData.empNo = ''
          this.formData.projectName = ''
          this.formData.initiationDate = ''
          this.formData.probationEnd = ''
          this.formData.quitDate = ''
        }
        this.canNotEdit = false
      }).catch(() => {
        this.canNotEdit = false
      })
    },
    addColumn () {
      this.formData.tableData.push({
        projectStart: '',
        projectEnd: '',
        projectDays: 0,
        leaveDays: 0,
        leaveDetail: '',
        mark: ''
      })
    },
    submit () {
      this.submitLoadding = true
      submitAllowance(this.formData).then(response => {
        if (response.code === '000000') {
          this.formData.tableData = [{
            projectStart: '',
            projectEnd: '',
            projectDays: 0,
            leaveDays: 0,
            leaveDetail: '',
            mark: '',
            state: 0
          }]
          this.submitLoadding = false
          Message({
            message: '成功',
            type: 'success',
            duration: 5 * 1000
          })
        }
      })
    }
  },
  data () {
    return {
      submitLoadding: false,
      canNotEdit: false,
      formData: {
        userName: '',
        empNo: '',
        projectName: '',
        initiationDate: '',
        probationEnd: '',
        quitDate: '',
        tableData: [
          {
            projectStart: '',
            projectEnd: '',
            projectDays: 0,
            leaveDays: 0,
            leaveDetail: '',
            mark: '',
            state: 0
          }
        ]
      },
      userName: '小明'
    }
  }
}
</script>
