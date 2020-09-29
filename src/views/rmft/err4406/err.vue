<template>
  <div class="app-container">
    <!-- 异常搜索 -->
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="120px">
      <el-form-item label="货物运输批次号" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入货物运输批次号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="运输工具名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入运输工具名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="录入时间" prop="arrivalDateTime">
        <el-date-picker
          clearable
          size="small"
          style="width: 350px"
          v-model="dateRange"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['12:00:00']"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜 索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重 置</el-button>
        <el-button type="primary" size="mini" @click="recovery" :style="{display:StartButton}">自动刷新</el-button>
        <el-button type="primary" size="mini" @click="stopReflash" :style="{display:STOPButton}">停止刷新</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="ErrList">
      <el-table-column label="货物运输批次号" align="center" prop="id" />
      <el-table-column label="运输工具名称" align="center" prop="borderTransportMeans.name" />
      <el-table-column
        label="运输方式"
        align="center"
        prop="borderTransportMeans.typeCode"
        :formatter="eIsEnterpriseTypeFormat"
      />
      <el-table-column label="抵境内第一目的港时间" align="center" prop="borderTransportMeans.arrivalDateTime" />
      <el-table-column label="确报状态" align="center" prop="statementDescription" />
      <el-table-column label="备注" align="center" prop="additionalInformation" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="detail(scope.row)"
            v-hasPermi="['waybill:declare:remove']"
          >修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listDeclare, selectErr, listTransport } from "@/api/report/transport";

import { listData } from "@/api/enterprise/qualification";
export default {
  data() {
    return {
      //定时器开始刷新按钮
      StartButton:'none',
      //定时器停止刷新按钮
      STOPButton:'',
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 日期范围
      dateRange: [],
      // 总条数
      total: 0,
      // 提运单申报表格数据
      ErrList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //运输方式类型
      CancelOptions: [],
      // 查询参数
      queryParams: {
        name:undefined,
        pageNum: 1,
        id: undefined,
        pageSize: 10,
        bindkeyinfo: undefined,
        //审批退单
        feedback: "20"
      },
      // 表头id
      headId: "",
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  created() {
    this.getList();
    //定时器开始
    this.timer = setInterval(() => {
      this.getList();
    }, 10 * 1000);
    //离开当前页面定时器移除
    this.$once("hook:beforeDestroy", () => {
      clearInterval(this.timer);
    });
    //运输方式字典配置
    this.getDicts("station_transport_fashion").then(response => {
      this.CancelOptions = response.data;
    });
  },
  methods: {
    // 运输方式字典翻译
    eIsEnterpriseTypeFormat(row, column) {
      return this.selectDictLabel(this.CancelOptions, row.borderTransportMeans.typeCode);
    },
    //定时器开始
    recovery() {
      this.msgSuccess("自动刷新开始");
      this.timer = setInterval(() => {
        this.getList();
      }, 10 * 1000);
      //定时器按钮 显示/隐藏
      this.StartButton="none";
      this.STOPButton="";
    },
    //定时器停止
    stopReflash() {
      clearInterval(this.timer);
      this.msgSuccess("自动刷新关闭");
      //定时器按钮 显示/隐藏
      this.StartButton="";
      this.STOPButton="none";
    },
    /** 查询提运单申报异常列表 */
    getList() {
      selectErr(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.ErrList = response.rows;
          this.total = response.total;
        }
      );
    },
    /**跳转修改页面 */
    detail(row) {
      this.reset();
      this.$router.push({ 
        path: "/approve/edit", 
        query: 
          { 
            tableId: row.messageId,
            consigId: row.consignmentId,
            borderId: row.borderTransportMeansId,
            
        } });
    },
    // 表单重置
    reset() {
      this.form = {
        arrivalDateTime: undefined,
        name: undefined,
        pId: undefined,
        id: undefined,
        sureid: undefined,
        optime: undefined,
        opuserid: undefined,
        bindkeytype: undefined,
        bindkeyinfo: undefined,
        rdcode: undefined,
        decltrafmode: undefined,
        ieflag: undefined,
        customsmaster: undefined,
        contractorcode: undefined,
        contractorcodescc: undefined,
        bayonetrdcode: undefined,
        vehicleweight: undefined,
        trailerweight: undefined,
        contaweight: undefined,
        feedback: undefined,
        feedbackMsg: undefined,
        feedbackTime: undefined,
        remark: undefined,
        enterpriseId: undefined
      };
      this.resetForm("form");
    },
    resetInput(){
     this.queryParams={
       id:undefined,
       name:undefined,
       beginTime:undefined,
       endTime:undefined
     };
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetInput();
      this.dateRange = [];
      this.getList();
    }
  }
};
</script>