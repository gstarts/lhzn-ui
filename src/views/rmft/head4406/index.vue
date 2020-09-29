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
      <el-form-item label="录入时间" prop="arrivalDateTime">
        <el-date-picker
          clearable
          size="small"
          style="width: 250px"
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

    <el-table v-loading="loading" :data="headList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="货物运输批次号" align="center" prop="id" />
      <el-table-column label="运输工具名称" align="center" prop="borderTransportMeans.name" />
      <el-table-column label="运输工具抵境第一时间" align="center" prop="borderTransportMeans.arrivalDateTime" />
      <el-table-column
        label="运输方式"
        align="center"
        prop="borderTransportMeans.typeCode "
        :formatter="TransportTypeFormat"
      />
      <el-table-column label="海关回执说明" align="center" prop="statementDescription" />
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

    <!-- 添加或修改【请填写功能名称】对话框 -->
    <!-- <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="货物运输批次号" prop="id">
          <el-input v-model="form.id" placeholder="请输入货物运输批次号" />
        </el-form-item>
        <el-form-item label="货物运输批次号" prop="messageId">
          <el-input v-model="form.messageId" placeholder="请输入货物运输批次号" />
        </el-form-item>
        <el-form-item label="货物运输批次号" prop="functionCode">
          <el-input v-model="form.functionCode" placeholder="请输入货物运输批次号" />
        </el-form-item>
        <el-form-item label="货物运输批次号">
          <el-select v-model="form.messageType" placeholder="请选择货物运输批次号">
            <el-option label="请选择字典生成" value />
          </el-select>
        </el-form-item>
        <el-form-item label="货物运输批次号" prop="senderId">
          <el-input v-model="form.senderId" placeholder="请输入货物运输批次号" />
        </el-form-item>
        <el-form-item label="货物运输批次号" prop="receiverId">
          <el-input v-model="form.receiverId" placeholder="请输入货物运输批次号" />
        </el-form-item>
        <el-form-item label="货物运输批次号" prop="sendTime">
          <el-input v-model="form.sendTime" placeholder="请输入货物运输批次号" />
        </el-form-item>
        <el-form-item label="货物运输批次号" prop="version">
          <el-input v-model="form.version" placeholder="请输入货物运输批次号" />
        </el-form-item>
        <el-form-item label="进出境口岸海关代码" prop="declarationOfficeId">
          <el-input v-model="form.declarationOfficeId" placeholder="请输入进出境口岸海关代码" />
        </el-form-item>
        <el-form-item label="海关回执" prop="additionalInformation">
          <el-input v-model="form.additionalInformation" placeholder="请输入海关回执" />
        </el-form-item>
        <el-form-item label="海关回执说明" prop="statementDescription">
          <el-input v-model="form.statementDescription" placeholder="请输入海关回执说明" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import {
  listHead,
  getHead,
  delHead,
  addHead,
  updateHead,
  exportHead
} from "@/api/report/head";

export default {
  name: "Head",
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
        id: undefined,
        messageId: undefined,
        functionCode: undefined,
        messageType: undefined,
        senderId: undefined,
        receiverId: undefined,
        sendTime: undefined,
        version: undefined,
        declarationOfficeId: undefined,
        additionalInformation: undefined,
        statementDescription: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  created() {
    this.getList();
    /** 运输方式字典配置 */
    this.getDicts("station_transport_fashion").then(response => {
      this.TransportOptions = response.data;
    });
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      listHead(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.headList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },

    // 状态字典翻译
    TransportTypeFormat(row, column) {
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
        id: undefined,
        messageId: undefined,
        functionCode: undefined,
        messageType: undefined,
        senderId: undefined,
        receiverId: undefined,
        sendTime: undefined,
        version: undefined,
        declarationOfficeId: undefined,
        statementDescription: undefined,
        additionalInformation: undefined
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
      const RelatedId = row.messageId || this.messageId;
      const consignmentId = row.consignment.id || this.consignment.id;
      const bordertransportId = row.borderTransportMeans.id || this.borderTransportMeans.id;
      this.$router.push({
        path: "/approve/details",
        query: 
          { 
            tableId: RelatedId,
            consigId: consignmentId,
            borderId: bordertransportId,
          }
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.messageId);
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
      const pid = row.messageId || this.messageId;
      getHead(pid).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改【请填写功能名称】";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.messageId != undefined) {
            updateHead(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addHead(this.form).then(response => {
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
      const pids = row.messageId || this.messageId;
      this.$confirm(
        '是否确认删除【请填写功能名称】编号为"' + pids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delHead(pids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有【请填写功能名称】数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportHead(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>