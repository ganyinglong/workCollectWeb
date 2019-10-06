<template>
    <el-form :model="workdataForm" ref="workdataForm" :rules="formRules" :inline="true">
      <el-form-item prop="userName" label="姓名：">
        <el-input v-model="workdataForm.userName" placeholder="请输入姓名"
          @change="handleNameBlur()" label="姓名"/>
      </el-form-item>
      <el-form-item prop="empNo" label="新系统工号：">
        <el-input  v-model="workdataForm.empNo" placeholder="输入工号" label="新系统工号"
          :disabled="editDisable"/>
      </el-form-item>
      <el-form-item prop="workPlace" label="客户职场：" style="width:450px">
        <el-input v-model="workdataForm.workPlace" label="客户职场" :disabled="editDisable" placeholder="输入客户职场"/>
      </el-form-item>

      <el-form-item label="年" prop="year">
        <el-date-picker
            v-model="workdataForm.year"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="选择年"
            @change="userAttendance()">
          </el-date-picker>
      </el-form-item>

      <el-form-item prop="month" label= "月">
          <el-select v-model="workdataForm.selectedMonth" @change="userAttendance()">
            <el-option v-for="item in months"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            />
          </el-select>
      </el-form-item>

      <el-table :data="workdataForm.attendances" border style="margin-top:20px" show-summary>
        <el-table-column label="日期" prop="inputDate" width="250px">
            <template slot-scope="scope">
              <el-date-picker v-model="scope.row.inputDate"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              @change="timeCalc(scope.row)"
              />
            </template>
        </el-table-column>
        <el-table-column label="日期类型" prop="dateType"/>
        <el-table-column label="签到时间" width="250px">
          <template slot-scope = "scope">
            <el-time-picker
              v-model="scope.row.checkinTime"
              value-format="HH:mm:ss"
              placeholder="选择签到时间"
              @change="timeCalc(scope.row)">
            </el-time-picker>
          </template>
        </el-table-column>
        <el-table-column label="签退时间" width="250px">
          <template slot-scope = "scope">
            <el-time-picker
              v-model="scope.row.checkoutTime"
              placeholder="选择签退时间"
              value-format="HH:mm:ss"
              @change="timeCalc(scope.row)">
            </el-time-picker>
          </template>
        </el-table-column>
        <el-table-column label="补贴开始时间" prop="subsidyStartTime"/>

        <el-table-column label="补贴时长" prop="subsidyLength"/>
        <el-table-column label="补贴金额" prop="subsidyAmount"/>
        <el-table-column label="" width="90px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger" icon="el-icon-delete" circle @click="removeColumn(scope.$index)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top:20px">
        <el-button icon="el-icon-circle-plus-outline" size="large" type="primary" plain
        @click="addColumn()" style="width:100%"></el-button>
      </div>
      <div style="margin-top:20px">
        <el-button icon="el-icon-check" type="success" style="width:100%" :loading="submitLoadding"
        plain @click="submit('workdataForm')">
          提交
        </el-button>
      </div>
    </el-form>
</template>

<script>
import moment from 'moment'
import { userInfo } from '@/api/user'
import { formSubmit, quryUserAttendance } from '@/api/collect'
import { Message } from 'element-ui'

export default {
  name: 'Attendance',
  data () {
    return {
      uid: '',
      editDisable: false,
      submitLoadding: false,
      workdataForm: {
        userName: '',
        empNo: '',
        workPlace: '',
        attendances: [
          {
            inputDate: '',
            dateType: '',
            checkinTime: '',
            checkoutTime: '',
            subsidyStartTime: '',
            subsidyLength: '',
            subsidyAmount: 0
          }
        ],
        year: moment().get('year').toString(),
        selectedMonth: moment().month()
      },
      months: [{label: '一月', value: 1}, {label: '二月', value: 2}, {label: '三月', value: 3}, {label: '四月',
        value: 4}, {label: '五月', value: 5}, {label: '六月', value: 6},
      {label: '七月', value: 7}, {label: '八月', value: 8}, {label: '九月',
        value: 9}, {label: '十月', value: 10}, {label: '十一月', value: 11}, {label: '十二月', value: 12}],
      formRules: {
        empNo: [{required: true, message: '工号不可为空', trigger: 'blur'}],
        userName: [{required: true, message: '姓名不能为空', trigger: 'blur'}],
        inputDate: [{required: true, message: '日期不能为空', trigger: 'blur'}]
      }
    }
  },
  methods: {
    handleNameBlur () {
      this.editDisable = true
      var uid = ''
      userInfo(this.workdataForm.userName).then(response => {
        if (response.code === '000000' && response.data) {
          this.workdataForm.empNo = response.data.empNo || ''
          this.workdataForm.workPlace = response.data.workPlace || ''
          uid = response.data.id
          this.uid = uid
          this.userAttendance()
        } else {
          this.workdataForm.empNo = ''
          this.workdataForm.workPlace = ''
        }
        this.editDisable = false
      }).catch(() => {
        this.editDisable = false
      })
    },
    userAttendance () {
      if (this.uid) {
        quryUserAttendance(this.uid, this.workdataForm.year, this.workdataForm.selectedMonth).then(res => {
          if (res.data) {
            // this.workdataForm.attendances = this.workdataForm.attendances.concat(res.data)
            this.workdataForm.attendances = res.data
          }
        })
      }
    },
    calcLength (row) {
      if (row.subsidyStartTime && row.checkoutTime) {
        var currentDate = moment().format('YYYY-MM-DD')
        var mills = new Date(currentDate + ' ' + row.checkoutTime) - new Date(currentDate + ' ' + row.subsidyStartTime)
        var l = (mills / 1000 / 60 / 60).toFixed(2)
        row.subsidyLength = l > 0 ? l : 0
      } else {
        row.subsidyLength = 0
      }
    },
    timeCalc (row) {
      moment.locale('zh-cn')
      var day = moment(row.inputDate).day()
      if (day === 0 || day === 6) {
        row.dateType = '周末'
        row.subsidyStartTime = row.checkinTime || ''

        this.calcLength(row)
        if (row.subsidyLength >= 6) {
          row.subsidyAmount = 70
        } else if (row.subsidyLength >= 4) {
          row.subsidyAmount = 60
        } else if (row.subsidyLength >= 2) {
          row.subsidyAmount = 30
        } else {
          row.subsidyAmount = 0
        }
      } else {
        row.dateType = '工作日'
        row.subsidyStartTime = '19:00:00'
        this.calcLength(row)
        if (row.subsidyLength >= 3) {
          row.subsidyAmount = 40
        } else if (row.subsidyLength >= 2) {
          row.subsidyAmount = 30
        } else {
          row.subsidyAmount = 0
        }
      }
    },
    removeColumn (index) {
      this.workdataForm.attendances.splice(index, 1)
    },
    addColumn () {
      this.workdataForm.attendances.push({
        inputDate: null,
        dateType: '',
        checkinTime: '',
        checkoutTime: '',
        subsidyStartTime: '',
        subsidyLength: '',
        subsidyAmount: 0
      })
    },
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          formSubmit(this.workdataForm).then(response => {
            if (response.code === '000000') {
              this.workdataForm.attendances = []
              Message({
                message: '成功',
                type: 'success',
                duration: 5 * 1000
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style>
</style>
