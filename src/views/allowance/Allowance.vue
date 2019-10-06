<template>
  <el-form :model="formData" :rules="formRules">
    <el-row>
      <el-col :span="8">
        <el-form-item label="姓名" prop="userName">
          <el-input label="姓名" placeholder="请输入姓名" v-model = "formData.userName"
            @change="handleNameBlur()" style="width:70%"/>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="新系统工号" prop="empNo">
          <el-input label="工号" placeholder="请输入工号"
            :disabled="canNotEdit" v-model="formData.empNo" style="width:70%"/>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="所在项目" prop="projectName">
          <el-input placeholder="输入所在项目" :disabled="canNotEdit"
            v-model="formData.projectName" style="width:70%"/>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="6">
        <el-form-item label="入职时间">
          <el-date-picker value-format="yyyy-MM-dd" v-model="formData.initiationDate" :disabled="canNotEdit" style="width:70%">
            </el-date-picker>
        </el-form-item>
      </el-col>

      <el-col :span="6">
        <el-form-item label="试用期结束时间">
          <el-date-picker value-format="yyyy-MM-dd" v-model="formData.probationEnd" :disabled="canNotEdit">
            </el-date-picker>
        </el-form-item>
      </el-col>

      <el-col :span="6">
        <el-form-item label="离职日期">
          <el-date-picker value-format="yyyy-MM-dd" v-model="formData.probationEnd" :disabled="canNotEdit"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>

    <el-table :data="formData.tableData">
      <el-table-column label="项目开始时间" >
        <template slot-scope="scope">
          <el-date-picker value-format="yyyy-MM-dd" v-model="scope.row.projectStart" :disabled="dis(scope.$index)"/>
        </template>
      </el-table-column>
      <el-table-column label="项目结束时间">
        <template slot-scope="scope">
          <el-date-picker value-format="yyyy-MM-dd" v-model="scope.row.projectEnd" :disabled="dis(scope.$index)"/>
        </template>
      </el-table-column>
      <el-table-column label="当月在项天数">
        <template slot-scope="scope">
          <el-input v-model="scope.row.projectDays" :disabled="dis(scope.$index)"/>
        </template>
      </el-table-column>
      <el-table-column label="当月事病假天数">
        <template slot-scope="scope">
          <el-input v-model="scope.row.leaveDays" :disabled="dis(scope.$index)"/>
        </template>
      </el-table-column>
      <el-table-column label="当月事病假请假明细(格式:XX年XX月XX日X假X天)、产假人员">
        <template slot-scope="scope">
          <el-input type="textarea" v-model="scope.row.leaveDetail" :disabled="dis(scope.$index)"/>
        </template>
      </el-table-column>
      <el-table-column label="备注（各种调休、带薪假、当月入离职当天是否在项员工等）">
        <template slot-scope="scope">
          <el-input type="textarea" v-model="scope.row.mark" :disabled="dis(scope.$index)"/>
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
import { submitAllowance, queryUserAllowances } from '@/api/allowance'
import { Message } from 'element-ui'
import moment from 'moment'

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
          this.uid = response.data.id
          this.userAllowance()
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
    userAllowance () {
      if (this.uid) {
        queryUserAllowances(this.uid).then(res => {
          if (res.data) {
            this.formData.tableData = this.formData.tableData.concat(res.data)
          }
        })
      }
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
          this.submitLoadding = false
          Message({
            message: '成功',
            type: 'success',
            duration: 5 * 1000
          })
        } else {
          this.submitLoadding = false
          Message({
            message: response.msg,
            type: 'error',
            duration: 5 * 1000
          })
        }
      }).catch(() => {
        this.submitLoadding = false
      })
    }
  },
  data () {
    return {
      uid: '',
      submitLoadding: false,
      canNotEdit: false,
      month: moment().month(),
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
      months: [{label: '一月', value: 1}, {label: '二月', value: 2}, {label: '三月', value: 3}, {label: '四月',
        value: 4}, {label: '五月', value: 5}, {label: '六月', value: 6},
      {label: '七月', value: 7}, {label: '八月', value: 8}, {label: '九月',
        value: 9}, {label: '十月', value: 10}, {label: '十一月', value: 11}, {label: '十二月', value: 12}],
      formRules: {
        empNo: [{required: true, message: '工号不可为空', trigger: 'blur'}],
        userName: [{required: true, message: '姓名不能为空', trigger: 'blur'}],
        projectName: [{required: true, message: '所在项目不能为空', trigger: 'blur'}]
      },
      dis (index) {
        return index > 0
      }
    }
  }
}
</script>
