<template>
  <div class="app-container">
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
      <el-form-item label="运输工具" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入运输工具名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="录入时间" prop="arrivaldatetime">
        <el-date-picker
          clearable
          size="small"
          style="width: 250px"
          v-model="dateRange"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['12:00:00']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="headList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="货物运输批次号" align="center" prop="id" />
      <el-table-column label="运输工具名称" align="center" prop="borderTransportMeans.name" />
      <el-table-column
        label="运输工具抵境第一个时间"
        align="center"
        prop="borderTransportMeans.arrivalDateTime"
      />
      <el-table-column label="运输方式" align="center" prop="borderTransportMeans.typeCode" :formatter="TransportTypeFormat"/>
      <el-table-column label="海关回执说明" align="center" prop="feedbackMsg" />
      <el-table-column label="备注" align="center" prop="additionalInformation" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="detail(scope.row)"
            v-hasPermi="['report:head:edit']"
          >详情</el-button>
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
import {
  listHead,
  getHead,
  delHead,
  addHead,
  updateHead,
  exportHead,
} from "@/api/emptycar/Head/head";

export default {
  // name: "Head",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 日期范围
      dateRange: [],
      // 运输状态字典
      TransportOptions: [],
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 【请填写功能名称】表格数据
      headList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        functioncode: undefined,
        messagetype: undefined,
        senderid: undefined,
        receiverid: undefined,
        sendtime: undefined,
        version: undefined,
        declarationofficeid: undefined,
        id: undefined,
        additionalinformation: undefined,
        carrier: undefined,
        loadinglocation: undefined,
        representativeperson: undefined,
        unloadinglocation: undefined,
        statementcode: undefined,
        statementdescription: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
     /** 运输方式字典配置 */
     this.getDicts("station_transport_fashion").then((response) => {
      this.TransportOptions = response.data;
    });
    this.getList();
   
  
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      listHead(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.headList = response.rows;
          this.total = response.total;
        }
      );
    },

    // 状态字典翻译
    TransportTypeFormat(row, column) {
      console.log(row.borderTransportMeans.typeCode)
      return this.selectDictLabel(this.TransportOptions,row.borderTransportMeans.typeCode);
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        pid: undefined,
        id: undefined,
        messageId: undefined,
        functioncode: undefined,
        messagetype: undefined,
        senderid: undefined,
        receiverid: undefined,
        sendtime: undefined,
        version: undefined,
        declarationofficeid: undefined,
        feedback: undefined,
        feedbackMsg: undefined,
        remark: undefined,
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
    /**详情按钮 */
    detail(row) {
      this.reset();
      const id = row.messageId || this.messageId;
      console.log(id);
      this.$router.push({
        path: "/emptyCar/seledetails",
        query: {
          tableId: row.messageId,
          borderId:row.borderTransportMeans.consignmentId,
        },
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.pid);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加【请填写功能名称】";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const pid = row.pid || this.ids;
      getHead(pid).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改【请填写功能名称】";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.pid != undefined) {
            updateHead(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addHead(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const pids = row.pid || this.ids;
      this.$confirm(
        '是否确认删除【请填写功能名称】编号为"' + pids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delHead(pids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有【请填写功能名称】数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportHead(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>