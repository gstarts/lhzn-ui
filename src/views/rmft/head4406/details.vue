<template>
  <div class="app-container">
    <el-form :model="form" ref="form" label-width="190px" size="mini">
      <el-row>
        <el-col :span="6">
          <el-form-item label="货物运输批次号" prop="id">
            <el-input v-model="form.id" placeholder="请输入货物运输批次号" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="运输工具代码" prop="borderId">
            <el-input
              v-model="form.borderTransportMeans.borderId"
              placeholder="请输入运输工具代码"
              clearable
              size="mini"
              @keyup.enter.native="handleQuery"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="运输工具名称" prop="name">
            <el-input
              v-model="form.borderTransportMeans.name"
              placeholder="请输入运输工具名称"
              clearable
              size="mini"
              @keyup.enter.native="handleQuery"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="运输方式代码" prop="typeCode">
            <el-input
              v-model="form.borderTransportMeans.typeCode"
              placeholder="请输入运输方式代码"
              clearable
              size="mini"
              @keyup.enter.native="handleQuery"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="进出境口岸海关代码" prop="declarationOfficeId">
            <el-input
              v-model="form.declarationOfficeId"
              placeholder="请输入进出境口岸海关代码"
              clearable
              size="mini"
              @keyup.enter.native="handleQuery"
              disabled
            />
          </el-form-item>
        </el-col>

         <el-col :span="6">
          <el-form-item label="承运人代码" prop="carrier">
            <el-input
              v-model="form.carrier"
              placeholder="请输入承运人代码"
              clearable
              size="mini"
              @keyup.enter.native="handleQuery"
              disabled
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="海关货物通关代码" prop="governmentProcedure">
            <el-input
              v-model="form.consignment.governmentProcedure"
              placeholder="请输入海关货物通关代码"
              clearable
              size="mini"
              @keyup.enter.native="handleQuery"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="装货地代码" prop="loadinglocation">
            <el-input
              v-model="form.loadinglocation"
              placeholder="请输入装货地代码"
              clearable
              size="mini"
              @keyup.enter.native="handleQuery"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="驾驶员代码" prop="masterId">
            <el-input
              v-model="form.borderTransportMeans.masterId"
              placeholder="请输入驾驶员代码"
              clearable
              size="mini"
              @keyup.enter.native="handleQuery"
              disabled
            />
          </el-form-item>
        </el-col>
       <el-col :span="6">
          <el-form-item label="驾驶员名称" prop="masterName">
            <el-input
              v-model="form.borderTransportMeans.masterName"
              placeholder="请输入驾驶员名称"
              clearable
              size="mini"
              @keyup.enter.native="handleQuery"
              disabled
            />
          </el-form-item>
        </el-col>
       <el-col :span="6">
          <el-form-item label="抵境内第一目的港时间" prop="arrivalDateTime">
            <el-input
              v-model="form.borderTransportMeans.arrivalDateTime"
              placeholder="请输入抵境内第一目的港时间"
              clearable
              size="mini"
              @keyup.enter.native="handleQuery"
              disabled
            />
          </el-form-item>
        </el-col>
       <el-col :span="6">
          <el-form-item label="传输企业备案关区" prop="customsMaster">
            <el-input
              v-model="form.customsMaster"
              placeholder="请输入传输企业备案关区"
              clearable
              size="mini"
              @keyup.enter.native="handleQuery"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="企业代码" prop="contractorCodeScc">
            <el-input
              v-model="form.contractorCodeScc"
              placeholder="请输入企业代码"
              clearable
              size="mini"
              @keyup.enter.native="handleQuery"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="确报传输人名称" prop="stationPersonName">
            <el-input
              v-model="form.stationPersonName"
              placeholder="请输入确报传输人名称"
              clearable
              size="mini"
              @keyup.enter.native="handleQuery"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="additionalInformation">
            <el-input
              v-model="form.additionalInformation"
              placeholder="请输入备注"
              clearable
              size="mini"
              @keyup.enter.native="handleQuery"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row> 
    </el-form>

    <el-table v-loading="loading" :data="headList" height="180px" @cell-dblclick="doubleClick">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column label="托架/拖挂车编号" align="center" prop="transportId" />
      <el-table-column label="托架/拖挂车类型" align="center" prop="typeCode" />
      <el-table-column label="托架/拖挂车自重(kg)" align="center" prop="tareWeight" />
    </el-table>

    <!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
       size="mini"
    />-->
    <el-form :model="Tform" ref="Tform" :inline="true" label-width="180px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="托架/拖挂车编号" prop="transportId">
            <el-input v-model="Tform.transportId" placeholder="请输入托架/拖挂车编号" size="mini" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="托架/拖挂车类型" prop="typeCode">
            <el-input v-model="Tform.typeCode" placeholder="请输入托架/拖挂车类型" size="mini" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="托架/拖挂车自重(kg)" prop="tareWeight">
            <el-input v-model="Tform.tareWeight" placeholder="请输入托架/拖挂车自重" size="mini" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table v-loading="loading" :data="coalList" height="180px" @cell-dblclick="doubleClickOne">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column label="集装箱(器)编号" align="center" prop="transportEquipmentId" />
      <el-table-column label="集装箱(器)尺寸类型" align="center" prop="characteristicCode" />
      <el-table-column label="集装箱(器)来源代码" align="center" prop="supplierPartyTypeCode" />
      <el-table-column label="集装箱(器)自重kg" align="center" prop="tareWeight" />
    </el-table>

    <el-form :model="cFrom" ref="cFrom" :inline="true" label-width="180px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="集装箱(器)编号" prop="id">
            <el-input v-model="cFrom.transportEquipmentId" placeholder="请输入集装箱(器)编号" size="mini" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="集装箱(器)尺寸类型" prop="characteristicCode">
            <el-input
              v-model="cFrom.characteristicCode"
              placeholder="请输入集装箱(器)尺寸类型"
              size="mini"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="集装箱(器)来源代码" prop="supplierPartyTypeCode">
            <el-input
              v-model="cFrom.supplierPartyTypeCode"
              placeholder="请输入集装箱(器)来源代码重"
              size="mini"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="集装箱(器)自重kg" prop="tareWeight">
            <el-input v-model="cFrom.tareWeight" placeholder="请输入集装箱(器)自重kg" size="mini" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
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
  getTransport,
  getCoal,
  getTransportDetail,
  getCoalDetail,
  updateTransport,
  updateCoal
} from "@/api/report/head";

export default {
  name: "Head",
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
      // 总条数
      total: 0,
      // 【请填写功能名称】表格数据
      headList: [],
      coalList: [],

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
        feedback: undefined,
        feedbackMsg: undefined,
        pid: undefined,
        borderId: undefined
      },
      // 表单参数
      form: {
      },
      // 挂车表单参数
      Tform: {
      },
      // 集装箱表单参数
      cFrom: {},
      // 表单校验
      rules: {}
    };
  },
  created() {
    // const { tableId } = this.$route.query;
    let  tableId  = this.$route.query.tableId;
    let consigId  = this.$route.query.consigId;
    let borderId  = this.$route.query.borderId;

    this.queryParams.messageId = tableId;
    this.queryParams.borderTransportMeansId = borderId;
    this.queryParams.consignmentId = consigId; 
    
    

    this.getList();
    this.getListsmt();
    this.getListCoal();
  },
  methods: {
    /** 查询表头信息列表 */
    getList() {
      this.loading = true;
      getHead(this.queryParams.messageId).then(response => {
        this.form = response.data;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询挂车信息*/
    getListsmt() {
      this.loading = true;
      getTransport(this.queryParams.borderTransportMeansId).then(response => {
        this.headList = response.data;
        this.total = response.total;
        this.loading = false;
      });
    },
    /**查询集装箱信息 */
    getListCoal() {
      this.loading = true;
      getCoal(this.queryParams.consignmentId).then(response => {
        this.coalList = response.data;
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 挂车行点击按钮 */
    doubleClick(row, column, cell, event) {
      getTransportDetail(row.id).then(res => {
        this.Tform = res.data;
      });
    },
    /**集装箱点击按钮 */
    doubleClickOne(row, column, cell, event) {
      getCoalDetail(row.id).then(res => {
        this.cFrom = res.data;
      });
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
        functionCode: undefined,
        messageType: undefined,
        senderId: undefined,
        receiverId: undefined,
        sendTime: undefined,
        version: undefined,
        declarationOfficeId: undefined,
        feedback: undefined,
        feedbackMsg: undefined,
        remark: undefined
      };

      this.resetForm("form");
    },

    clearBody() {
      this.Tform = {
        id: undefined,
        typeCode: undefined,
        tareWeight: undefined
      };
    },

    clearCoalBody() {
      this.cFrom = {
        id: undefined,
        characteristicCode: undefined,
        supplierPartyTypeCode: undefined,
        tareWeight: undefined
      };
    },
    /**
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.pid);
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
      getHead(messageId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改【请填写功能名称】";
      });
    },
    /** 修改表头信息*/
    submitHeadForm: function() {
      updateHead(this.form).then(response => {
        if (response.code === 200) {
          this.msgSuccess("修改成功");
          this.getList();
        } else {
          this.msgError(response.msg);
        }
      });
    },

    /** 挂车修改按钮 */
    submittForm: function() {
      updateTransport(this.Tform).then(response => {
        if (response.code === 200) {
          this.msgSuccess("修改成功");
          // this.reset();
          this.getListsmt();
          this.clearBody();
        } else {
          this.msgError(response.msg);
        }
      });
    },
    /**集装箱修改按钮 */
    submitcForm: function() {
      updateCoal(this.cFrom).then(response => {
        if (response.code === 200) {
          this.msgSuccess("修改成功");
          this.getListCoal();
          this.clearCoalBody();
        } else {
          this.msgError(response.msg);
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