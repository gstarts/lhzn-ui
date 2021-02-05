<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="车牌号" prop="veLicenseNo">
        <el-input
          v-model="queryParams.veLicenseNo"
          placeholder="请输入车牌号"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="通道名称" prop="gStatus">
        <el-select v-model="queryParams.chnlNo" placeholder="请选择通道名称" clearable size="mini">
          <el-option
            v-for="dict in chnlOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="电子车牌号" prop="No" v-show="false">
        <el-input
          v-model="queryParams.No"
          placeholder="请输入电子车牌号"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
          v-show="false"
        />
      </el-form-item>

      <el-form-item label="IC卡号" prop="icNo" v-show="false">
        <el-input
          v-model="queryParams.icNo"
          placeholder="请输入IC卡号"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
          v-show="false"
        />
      </el-form-item>
      <el-form-item label="采集时间" prop="optime">
        <el-date-picker
          clearable
          size="mini"
          style="width: 350px"
          v-model="dateRange"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-row :gutter="10">
        <el-button size="small" type="primary" style="float:right" @click="Supplementary">人工采集</el-button>
        <el-col :span="1">
          <el-button size="small" type="primary" v-hasPermi="['monitor:data:artificial']" @click="handleOperat">人工抬杆
          </el-button>
        </el-col>
      </el-row>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="通关中数据" name="dur">
        <el-row>
          <el-table v-loading="loading" :data="durList">
            <el-table-column label="通道名称" align="center" prop="chnlName"/>
            <el-table-column label="核放结果" align="center" prop="opHint"/>
            <el-table-column label="车牌号" align="center" prop="veLicenseNo"/>
            <el-table-column label="地磅称重" align="center" prop="grossWt"/>
            <el-table-column label="集装箱号" align="center" prop="contaId"/>

            <el-table-column label="进出场标志" align="center" prop="iEFlag" :formatter="IEFormat"/>
            <el-table-column label="采集时间" align="center" prop="inoutTime" width="180">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.inoutTime) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="通关放行" name="list">
        <el-table v-loading="loading" :data="dataList" @cell-dblclick="doubleClickRelease">
          <el-table-column label="通道名称" align="center" prop="chnlName"/>
          <el-table-column label="核放结果" align="center" prop="opHint"/>
          <el-table-column label="车牌号" align="center" prop="veLicenseNo"/>
          <el-table-column label="地磅称重" align="center" prop="grossWt"/>
          <el-table-column label="集装箱号" align="center" prop="contaId"/>

          <el-table-column label="进出场标志" align="center" prop="iEFlag" :formatter="IEFormat"/>
          <el-table-column label="采集时间" align="center" prop="inoutTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.inoutTime) }}</span>
            </template>
          </el-table-column>

        </el-table>
      </el-tab-pane>

      <el-tab-pane label="通关异常" name="err">
        <el-table v-loading="loading" :data="errList" @cell-dblclick="doubleClick">
          <el-table-column label="通道名称" align="center" prop="chnlName"/>
          <el-table-column label="核放结果" align="center" prop="opHint"/>
          <el-table-column label="车牌号" align="center" prop="veLicenseNo"/>
          <el-table-column label="地磅称重" align="center" prop="grossWt"/>
          <el-table-column label="集装箱号" align="center" prop="contaId"/>

          <el-table-column label="进出场标志" align="center" prop="iEFlag" :formatter="IEFormat"/>
          <el-table-column label="采集时间" align="center" prop="inoutTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.inoutTime) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 异常弹窗 -->
    <el-dialog title="通关异常信息" :visible.sync="open" width="800px">
      <el-form
        ref="form"
        :label-position="labelPosition"
        label-width="140px"
        :model="form"
        size="mini"
      >
        <el-row>
          <el-col :span="10">
            <el-form-item label="车牌号:">
              <el-input v-model="form.veLicenseNo" @keyup.enter.native="getRfid"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="电子车牌:">
              <el-input v-model="form.sealId"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="集装箱号:">
              <el-input v-model="form.contaId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="地磅称重:">
              <el-input v-model="form.grossWt"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="报警详情:">
              <el-input v-model="form.opHint"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="业务解释:">
              <el-input v-model="form.procErrorDescription"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="技术解释:">
              <el-input v-model="form.techErrorDescription"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <template slot-scope="scope"> -->
        <el-row>
          <el-col :span="6">
            <el-button v-if="form.checkResult !== 'Y'" type="primary" size="mini" @click="supplementCollection">补采
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-button v-if="form.checkResult !== 'Y'" type="primary" size="mini" @click="Lifter">直接抬杆</el-button>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" size="mini" @click="cancel">返回</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <!-- 放行弹窗 -->
    <el-dialog title="通关放行信息" :visible.sync="openRelease" width="800px">
      <el-form ref="form" :label-position="labelPosition" label-width="140px" :model="form" size="small">
        <el-row>
          <el-col :span="10">
            <el-form-item label="车牌号:">
              <el-input v-model="form.veLicenseNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="电子车牌:">
              <el-input v-model="form.sealId"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="集装箱号:">
              <el-input v-model="form.contaId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="地磅称重:">
              <el-input v-model="form.grossWt"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="报警详情:">
              <el-input v-model="form.opHint"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="业务解释:">
              <el-input v-model="form.procErrorDescription"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="技术解释:">
              <el-input v-model="form.techErrorDescription"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-button type="primary" size="mini" @click="cancel">返回</el-button>
        </el-row>
      </el-form>
    </el-dialog>

    <!-- 补采弹窗 -->
    <el-dialog title="通关放行信息" :visible.sync="openSupplementary" width="380px">
      <el-form
        ref="smallForm"
        :label-position="labelPosition"
        label-width="140px"
        :model="smallForm"
        size="mini"
        :rules="rules"
      >
        <el-form-item label="通道名称:" prop="chnlNo">
          <el-select v-model="smallForm.chnlNo" placeholder="请输入通道名称" size="small">
            <el-option
              v-for="item in chnlOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="进出类型:" prop="iEFlag">
          <el-select v-model="smallForm.iEFlag" size="small">
            <el-option
              v-for="dict in importExitOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="车牌号:" prop="veLicenseNo">
          <el-select v-model="smallForm.veLicenseNo" filterable size="small" @keyup.enter.native="getRfid">
            <el-option
              v-for="dict in veRfidLicense"
              :key="dict.veNo"
              :label="dict.veNo"
              :value="dict.veNo"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="地磅称重:" prop="grossWt">
          <el-input v-model="smallForm.grossWt"></el-input>
        </el-form-item>

        <el-form-item label="电子车牌:" prop="rfid.veLicenseNo">
          <el-input v-model="smallForm.rfid.veLicenseNo"></el-input>
        </el-form-item>

        <el-form-item label="IC卡号:" prop="info.icNo">
          <el-input v-model="smallForm.info.icNo"></el-input>
        </el-form-item>

        <el-row>
          <el-button type="primary" size="mini" @click="submitForm">补采</el-button>
          <el-button @click="cancel" size="mini">取 消</el-button>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog title="人工放行" :visible.sync="artificialOpen" width="380px">
      <el-form
        ref="artificialForm"
        :label-position="labelPosition"
        label-width="140px"
        :model="artificialForm"
        size="mini"
        :rules="arfRules"
      >
        <el-form-item label="通道名称:" prop="chnlNo">
          <el-select v-model="artificialForm.chnlNo" placeholder="请选择通道">
            <el-option
              v-for="item in chnlOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="请输入抬杆原因:" prop="procErrorDescription">
          <el-input type="textarea" v-model="artificialForm.procErrorDescription"></el-input>
        </el-form-item>
        <el-row>
          <el-button type="primary" size="mini" @click="artificial">确定</el-button>
          <el-button @click="cancel" size="mini">取 消</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>


<script>
import {
  addData,
  delData,
  detailsData,
  exportData,
  getData,
  listData,
  updateDataLift,
  updateDataSet,
  artificial, VeRfidLicenseInfo
} from '@/api/monitoring/data'

import {chnlList} from '@/api/monitoring/chnlConfig'

export default {
  name: 'moniData',
  data() {
    return {
      labelPosition: 'right',
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 数据列表中的记录 total 数组
      arrTotal: [],
      durTotal: 0,
      errTotal: 0,
      dataTotal: 0,
      // 数据监控表格数据
      dataList: [],
      // 验放异常表格数据
      errList: [],
      // 验放中数据
      durList: [],
      // 弹出层标题
      title: '',
      //
      activeName: 'dur',
      // 通道列表
      chnlOptions: [],
      // 进出口标志数据字典
      importExitOptions: [],
      // 车牌号与电子车牌对照
      veRfidLicense: [],
      // 图片列表
      photoList: [],
      //抬杆原因
      roleOptions: [],
      // 是否显示弹出层
      open: false,
      openRelease: false,
      openSupplementary: false,
      artificialOpen: false,
      // 日期范围
      dateRange: [],
      // 图片地址
      PhotoName: '',
      // 通道类型列表
      chnlNameOption: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        veLicenseNo: undefined,
        chnlNo: undefined,
        inoutTime: undefined,
        gatheralldataFlg: 10
      },
      // 表单参数
      form: {},
      // 补采表单参数
      smallForm: {
        info: {
          icNo: ''
        },
        rfid: {
          veLicenseNo: ''
        }
      },
      // 人工抬杆
      artificialForm: {
        procErrorDescription: ''
      },
      // 表单校验
      rules: {
        chnlNo: [
          {required: true, message: '通道名称不能为空', trigger: 'change'}
        ],
        veLicenseNo: [
          {required: true, message: '车牌号不能为空', trigger: 'blur'},
          {min: 7, max: 7, message: '请输入7位有效车牌号', trigger: 'blur'}
        ],
        grossWt: [
          {required: true, message: '重量不能为空', trigger: 'blur'}

        ],
        iEFlag: [
          {required: true, message: '进出标志不能为空', trigger: 'change'}
        ]
        // "rfid.veLicenseNo": [
        //   { required: true, message: "电子车牌不能为空", trigger: "blur" }
        // ],
      },
      // 表单校验
      arfRules: {
        procErrorDescription: [
          {required: true, message: '请填写抬杆原因', trigger: 'blur'}
        ],
        chnlNo: [
          {required: true, message: '请选择通道', trigger: 'change'}
        ]
      }
    }
  },
  created() {
    this.getDicts('station_IE_flag').then(response => {
      this.importExitOptions = response.data
    })
    this.getChnlOptions()
    this.getVeRfidLicense()
    this.getList()

  },
  methods: {
    /** 异常的行点击按钮 */
    doubleClick(row, column, cell, event) {
      const id = row.sessionId
      detailsData(id).then(res => {
        this.form = res.data
        this.form.rfid = res.data.rfid
        this.photoList = res.data.photoList
        this.checkResult = res.data.checkResult
        this.open = true
        for (var i = 0; i < this.photoList.length; i++) {
          this.photoList[i].photoGuid = require('@/assets/image/' +
            this.photoList[i].photoGuid +
            '.jpg')
          // console.log("图片地址" + this.photoList[i].photoGuid + "\n");
        }
        //大图片默认显示第一张
        this.PhotoName = this.photoList[0].photoGuid
      })
    },
    //点击小图片时将图片路径赋值给大图
    clickImage(addres) {
      this.PhotoName = addres
    },
    /** 获取电子车牌对照信息 */
    getVeRfidLicense() {
      VeRfidLicenseInfo().then(res => {
        this.veRfidLicense = res.data
      })
    },
    /** 放行的行点击按钮 */
    doubleClickRelease(row, column, cell, event) {
      const id = row.sessionId
      detailsData(id).then(res => {
        this.form = res.data
        this.photoList = res.data.photoList
        this.checkResult = res.data.checkResult
        this.openRelease = true
        for (var i = 0; i < this.photoList.length; i++) {
          this.photoList[i].photoGuid = require('@/assets/image/' +
            this.photoList[i].photoGuid +
            '.jpg')
          // console.log("图片地址" + this.photoList[i].photoGuid + "\n");
        }
        //大图片默认显示第一张
        this.PhotoName = this.photoList[0].photoGuid
      })
    },
    /** 补采点击按钮 */
    Supplementary(row, column, cell, event) {
      this.openSupplementary = true
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['smallForm'].validate(valid => {
        if (valid) {
          addData(this.smallForm).then(response => {
            if (response.code === 200) {
              this.msgSuccess('新增成功')
              this.openSupplementary = false
              this.resetForm('smallForm')
              this.getList()
            } else {
              this.msgError(response.msg)
            }
          })
        }
      })
    },
    /** 查询数据监控列表 */
    getList() {
      this.loading = true
      listData(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.dataList = response.data.list.rows
          this.durList = []
          this.durList = response.data.dur.rows
          this.errList = response.data.err.rows
          if (this.activeName === 'dur') {
            this.total = response.data.dur.total
          }
          if (this.activeName === 'list') {
            this.total = response.data.list.total
          }
          if (this.activeName === 'err') {
            this.total = response.data.err.total
          }
          this.durTotal = (response.data.dur.total)
          this.dataTotal = (response.data.list.total)
          this.errTotal = (response.data.err.total)
          this.loading = false
        }
      )
    },
    /**通道列表 */
    getChnlOptions() {
      chnlList().then(res => {
        this.chnlOptions = res.data
      })
    },
    // 进出口标志
    IEFormat(row, column) {
      return this.selectDictLabel(this.importExitOptions, row.iEFlag)
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.openRelease = false
      this.resetForm('smallForm')
      this.openSupplementary = false
      this.resetForm('artificialForm')
      this.artificialOpen = false
      this.reset()
    },
    // 视频按钮
    video() {
      this.$message({
        showClose: true,
        message: '该功能未实现'
      })
      this.open = false
      this.openRelease = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        sessionId: undefined,
        areaId: undefined,
        chnlNo: undefined,
        iEFlag: undefined,
        getherMode: undefined,
        drCustomsNo: undefined,
        veCustomsNo: undefined,
        veLicenseNo: undefined,
        contaId: undefined,
        esealId: undefined,
        grossWt: undefined,
        operatorId: undefined,
        operateTime: undefined,
        rellistType: undefined,
        rellistIdType: undefined,
        rellistId: undefined,
        feedbackTime: undefined,
        checkResult: undefined,
        instruction: undefined,
        procErrorCode: undefined,
        procErrorDescription: undefined,
        techErrorCode: undefined,
        techErrorDescription: undefined,
        sealId: undefined,
        packNo: undefined,
        declPack: undefined,
        declGoodsWeight: undefined,
        opHint: undefined,
        ledHint: undefined,
        extendedContent: undefined,
        inoutTime: undefined,
        gatheralldataFlg: undefined,
        photoGuid: undefined,
        info: undefined,
        rfid: undefined
      }

      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.sessionId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加数据监控'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const sessionId = row.sessionId || this.ids
      getData(sessionId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改数据监控'
      })
    },

    /** 切换标签操作 */
    handleClick(tab, event) {
      if (tab.name === 'dur') {
        this.total = this.durTotal
        this.activeName = 'dur'
      }
      if (tab.name === 'list') {
        this.total = this.dataTotal
        this.activeName = 'list'
      }
      if (tab.name === 'err') {
        this.total = this.errTotal
        this.activeName = 'err'
      }
    },
    /** 补采按钮 */
    supplementCollection: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          updateDataSet(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess('补采成功')
              this.open = false
              this.openRelease = false
              this.getList()
            } else {
              this.msgError(response.msg)
            }
          })
        }
      })
    },

    /** 直接抬杆 */
    Lifter: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          updateDataLift(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess('修改成功')
              this.open = false
              this.openRelease = false
              this.getList()
            } else {
              this.msgError(response.msg)
            }
          })
        }
      })
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const sessionIds = row.sessionId || this.ids
      this.$confirm(
        '是否确认删除数据监控编号为"' + sessionIds + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(function () {
          return delData(sessionIds)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(function () {
        })
    },
    /** 人工抬杆 */
    handleOperat() {
      this.artificialOpen = true
    },
    /** 获取电子车牌*/
    getRfid() {

      let no = this.smallForm.veLicenseNo
      let item = this.veRfidLicense.find(el => el.veNo === no)
      if(typeof item === 'undefined'){
        this.msgError("系统中未找到对应的电子车牌，建议参考过卡页面的数据信息")
      }else {
        this.smallForm.rfid.veLicenseNo=item.rfId
        this.smallForm.rfid.rfidId=item.rfId
      }

    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有数据监控数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return exportData(queryParams)
        })
        .then(response => {
          this.download(response.msg)
        })
        .catch(function () {
        })
    },
    /** 提交抬杆信息 */
    artificial() {
      this.$refs['artificialForm'].validate(valid => {
        if (valid) {
          artificial(this.artificialForm).then(response => {
            if (response.code === 200) {
              this.msgSuccess('操作成功等待系统抬杆')
              this.artificialOpen = false
              this.resetForm('artificialForm')
              this.getList()
            } else {
              this.msgError(response.msg)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.el-row {
  margin-bottom: 20px;
}

.el-form {
  text-align: center;
}

.grid-content {
  max-height: 600px;
}

.grid-contentt {
  min-height: 100px;
}

.el-button {
  text-align: center;
  margin: 0 auto;
}

.rightullidiv {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.rightulliimg {
  max-width: 150px;
  max-height: 150px;
}
</style>
