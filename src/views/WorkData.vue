<template>
    <el-form :model="workdataForm" ref="workdataForm">
      <template>
        <el-row gutter = 20>
            <el-col span = 8>
              姓名：
              <el-input v-model="workdataForm.userName" placeholder="请输入姓名"
              @change="handleNameBlur()" label="姓名" style="width: 70%"/>
            </el-col>
            <el-col span=8>
              新系统工号：
              <el-input  v-model="workdataForm.empNo" placeholder="输入工号" label="新系统工号"
              :disabled="editDisable" style="width:70%"/>
            </el-col>
            <el-col span=8>
              客户职场：
              <el-input v-model="workdataForm.workPlace" label="客户职场" :disabled="editDisable" style="width:70%" placeholder="输入客户职场"/>
            </el-col>
          </el-row>
      </template>
      <el-table :data="workdataForm.attendances" border style="margin-top:20px"
       show-summary>
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
        plain @click="formSubmit()">
          提交
        </el-button>
      </div>
    </el-form>
</template>

<script>
import moment from 'moment'
import { userInfo } from '@/api/user'
import { formSubmit } from '@/api/collect'
import { Message } from 'element-ui'

export default {
  name: 'WokeData',
  data () {
    return {
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
        ]
      }
    }
  },
  methods: {
    handleNameBlur () {
      this.editDisable = true
      userInfo(this.workdataForm.userName).then(response => {
        if (response.code === '000000' && response.data) {
          this.workdataForm.empNo = response.data.empNo || ''
          this.workdataForm.workPlace = response.data.workPlace || ''
        } else {
          this.workdataForm.empNo = ''
          this.workdataForm.workPlace = ''
        }
        this.editDisable = false
      }).catch(() => {
        this.editDisable = false
      })
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
    formSubmit () {
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
    }
  }
}
</script>
<style>
</style>
