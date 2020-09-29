<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="120px">
      <el-form-item label="绑定介质信息" prop="bindkeyinfo">
        <el-input
          v-model="queryParams.bindkeyinfo"
          placeholder="请输入绑定介质信息"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车次确认号" prop="sureid">
        <el-input
          v-model="queryParams.sureid"
          placeholder="请输入对应车次确认号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="提运单状态" prop="feedback">
        <el-select v-model="queryParams.feedback" placeholder="请选择状态">
          <el-option
            v-for="dict in feedbackOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="录入时间" prop="optime">
        <el-date-picker
          clearable
          size="small"
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

    <el-row :gutter="10" class="mb8"></el-row>

    <el-table
      v-loading="loading"
      :data="declareList"
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="绑定介质信息" align="center" prop="bindkeyinfo" />
      <el-table-column label="申报时间" align="center" prop="optime" />
      <el-table-column label="运输方式" align="center" prop="decltrafmode" :formatter="shipTypeFormat" />
      <el-table-column label="进出口标志" align="center" prop="ieflag" :formatter="inOutMarkFormat" />
      <el-table-column
        label="过卡车辆类型"
        align="center"
        prop="bayonetrdcode"
        :formatter="viaVehicleFormat"
      />
      <el-table-column label="提运单状态" align="center" prop="feedback" :formatter="waybillFormat" />
      <el-table-column label="回执说明" align="center" prop="feedbackMsg" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-detail"
            @click="detail(scope.row)"
            v-hasPermi="['waybill:declare:query']"
          >详情</el-button>
          <el-button
            v-if="scope.row.feedback=='10' || scope.row.feedback=='20'|| scope.row.feedback=='0'|| scope.row.feedback=='FF'|| scope.row.feedback=='3' "
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['waybill:declare:query']"
          >修改</el-button>
          <el-button
            v-if="scope.row.feedback!='2'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDelete(scope.row)"
            v-hasPermi="['waybill:declare:remove']"
          >删除</el-button>
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

    <!-- 添加或修改提运单申报对话框 -->
    <!-- <import-table ref="import" @ok="handleQuery" /> -->
  </div>
</template>

<script>
import {
  wayListByuserId,
  getDeclare,
  delDeclare,
  addHead,
  addBody,
  updateDeclare,
  updateHead,
  updateBody,
  exportDeclare,
  del
} from "@/api/waybill/declare";

import { listData } from "@/api/enterprise/qualification";
export default {
  data() {
    return {
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
      declareList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //运输方式
      shipTypeOptions: [],
      // 进出口标志
      inOutMarkOptions: [],
      //过卡车辆类型
      viaOptions: [],
      // 提运单状态
      feedbackOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        BindKeyInfo: undefined,
        sureid: undefined
      },
      // 公司名称列表
      companyNameOptions: [],
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
    this.getlistData();
    this.getDicts("station_transport_fashion").then(response => {
      this.shipTypeOptions = response.data;
    });
    this.getDicts("station_IE_flag").then(response => {
      this.inOutMarkOptions = response.data;
    });
    this.getDicts("station_via_type").then(response => {
      this.viaOptions = response.data;
    });
    this.getDicts("station_declear_status").then(response => {
      this.feedbackOptions = response.data;
    });
  },
  methods: {
    /** 查询提运单列表 */
    getList() {
      wayListByuserId(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.declareList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 公司名称列表 */
    getlistData() {
      this.loading = true;
      listData().then(response => {
        this.companyNameOptions = response.rows;
      });
    },

    // 改变驳回数据颜色
    tableRowClassName({ row, rowIndex }) {
      if (row.feedback == "ZZ") {
        return "warning-row";
      }
      return "";
    },
    // 运输方式翻译
    shipTypeFormat(row, column) {
      return this.selectDictLabel(this.shipTypeOptions, row.decltrafmode);
    },
    // 进出口标志翻译
    inOutMarkFormat(row, column) {
      return this.selectDictLabel(this.inOutMarkOptions, row.ieflag);
    },
    // 过卡车辆类型
    viaVehicleFormat(row, column) {
      return this.selectDictLabel(this.viaOptions, row.bayonetrdcode);
    },
    // 提运单状态
    waybillFormat(row, column) {
      return this.selectDictLabel(this.feedbackOptions, row.feedback);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加提运单申报";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      // this.$refs.import.showedit(id);
      this.$router.push({ path: "/bind/edit", query: { tableId: id } });
    },

    /** 申报按钮操作 */
    declare(row) {
      const ids = row.id || this.ids;
      this.$confirm("是否确认进行申报提运单批量申报", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delDeclare(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("申报成功");
        })
        .catch(function() {});
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm("是否确认删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return del(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /** 打开新增弹窗 */
    openAddDialog() {
      this.$refs.import.show();
    },
    /** 自动分配 */
    allocation() {},
    /**详情按钮 */
    detail(row) {
      this.reset();
      const id = row.id || this.ids;
      this.$router.push({ path: "/bind/details", query: { tableId: id } });
    }
  }
};
</script>
<style>
.el-table .warning-row {
  background: red;
}
</style>