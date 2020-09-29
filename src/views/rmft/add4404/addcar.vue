<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="submitForm"
          v-hasPermi="['newemptycar:head:add']"
        >新 增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-edit" size="mini" @click="emptyall">清 空</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-thumb"
          size="mini"
          @click="updateStatementCode"
          v-hasPermi="['newemptycar:head:code']"
        >申报</el-button>
      </el-col>
    </el-row>
    <el-form :model="form" ref="form" label-width="190px" size="mini" :rules="headRules">
      <el-row>
        <el-col :span="6">
          <el-form-item label="货物运输批次号" prop="id" >
            <el-input v-model="form.id" placeholder="请输入货物运输批次号" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="运输工具代码" prop="borderTransportMeans.borderId">
            <el-input
              v-model="form.borderTransportMeans.borderId"
              placeholder="请输入运输工具代码"
              clearable
              size="mini"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="运输工具名称" prop="borderTransportMeans.name">
            <el-input
              v-model="form.borderTransportMeans.name"
              placeholder="请输入运输工具名称"
              clearable
              size="mini"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="运输方式代码" prop="borderTransportMeans.typeCode">
            <el-select
              v-model="form.borderTransportMeans.typeCode"
              disabled
              placeholder="系统反填"
              style="width:100%"
            >
              <el-option
                :disabled="true"
                v-for="dict in businessTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="进出境口岸海关代码" prop="declarationofficeid">
            <el-select
              v-model="form.declarationofficeid"
              placeholder="请选择进出境口岸海关代码"
              style="width:100%"
            >
              <el-option
                v-for="dict in customsCodeTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="承运人代码" prop="carrier">
            <el-input
              v-model="form.carrier"
              placeholder="请输入承运人代码"
              size="mini"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="海关货物通关代码" prop="consignment.governmentprocedure">
            <el-input
              v-model="form.consignment.governmentprocedure"
              placeholder="请输入海关货物通关代码"
              clearable
              size="mini"
              @keyup.enter.native="handleQuery"
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
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="驾驶员代码" prop="borderTransportMeans.masterId">
            <el-input
              v-model="form.borderTransportMeans.masterId"
              placeholder="请输入驾驶员代码"
              clearable
              size="mini"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="驾驶员名称" prop="borderTransportMeans.masterName">
            <el-input
              v-model="form.borderTransportMeans.masterName"
              placeholder="请输入驾驶员名称"
              clearable
              size="mini"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="抵境内第一目的港时间" prop="borderTransportMeans.arrivalDateTime">
            <el-date-picker
              v-model="form.borderTransportMeans.arrivalDateTime"
              style="width:100%"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="传输企业备案关区" prop="customsMaster">
            <el-input
              v-model="form.customsMaster"
              :disabled="true"
              placeholder="系统反填"
              clearable
              size="mini"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="企业代码" prop="contractorCodeScc">
            <el-input
              v-model="form.contractorCodeScc"
              :disabled="true"
              placeholder="系统反填"
              clearable
              size="mini"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="确报传输人名称" prop="stationPersonName">
            <el-input
              v-model="form.stationPersonName"
              :disabled="true"
              placeholder="系统反填"
              clearable
              size="mini"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="additionalinformation">
            <el-input
              v-model="form.additionalinformation"
              placeholder="请输入备注"
              clearable
              size="mini"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="addnewcar"
          v-hasPermi="['newemptycar:bordertransportequipment:add']"
        >新 增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-edit" size="mini" @click="delectempty">清 空</el-button>
      </el-col>
    </el-row>
    <el-table :data="headList" height="300px" v-loading="loading">
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column label="托架/拖挂车编号" align="center" prop="transportId" />
      <el-table-column label="托架/拖挂车类型" align="center" prop="typeCode" :formatter="Trailerformat" />
      <el-table-column label="托架/拖挂车自重(kg)" align="center" prop="tareWeight" />
    </el-table>

    <el-form :model="Tform" ref="Tform" :inline="true" label-width="180px" :rules="headRuless">
      <el-row>
        <el-col :span="8">
          <el-form-item label="托架/拖挂车编号" prop="transportId">
            <el-input v-model="Tform.transportId" placeholder="请输入托架/拖挂车编号" size="mini" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="托架/拖挂车类型" prop="typeCode">
            <el-select v-model="Tform.typeCode" placeholder="请输入托架/拖挂车类型">
              <el-option
                v-for="dict in TrailertypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="托架/拖挂车自重(kg)" prop="tareWeight">
            <el-input v-model="Tform.tareWeight" placeholder="请输入托架/拖挂车自重" size="mini" />
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
  addemptyCar,
  init,
  listemptycar,
  emptycarAll,
  updateCode,
} from "@/api/emptycar/Head/head";

export default {
  name: "Head",
  data() {
    return {
      // //空载挂车表单效验
      // headRuless: {
      //   transportId: [
      //     {
      //       required: true,
      //       message: "托架/拖挂车编号 不能为空",
      //       trigger: "blur",
      //     },
      //   ],
      //   typeCode: [
      //     {
      //       required: true,
      //       message: "托架/拖挂车类型不能为空",
      //       trigger: "blur",
      //     },
      //   ],
      //   tareWeight: [
      //     {
      //       required: true,
      //       message: "托架/拖挂车自重(kg) 不能为空",
      //       trigger: "blur",
      //     },
      //   ],
      // },
      //表头表单效验
      headRules: {
        id: [
          {
            required: true,
            message: "货物运输批次号 不能为空",
            trigger: "blur",
          },
        ],
        "borderTransportMeans.borderId": [
          { required: true, message: "运输工具代码 不能为空", trigger: "blur" },
        ],
        "borderTransportMeans.name": [
          { required: true, message: "运输工具名称 不能为空", trigger: "blur" },
        ],
        // "borderTransportMeans.typeCode": [
        //   { required: true, message: "运输方式代码 不能为空", trigger: "blur" },
        // ],
        declarationofficeid: [
          {
            required: true,
            message: "进出境口岸海关代码 不能为空",
            trigger: "blur",
          },
        ],
        carrier: [
          { required: true, message: "承运人代码 不能为空", trigger: "blur" },
        ],
        "consignment.governmentprocedure": [
          {
            required: true,
            message: "海关货物通关代码 不能为空",
            trigger: "blur",
          },
        ],
        "borderTransportMeans.masterId": [
          { required: true, message: "驾驶员代码 不能为空", trigger: "blur" },
        ],
        "borderTransportMeans.masterName": [
          { required: true, message: "驾驶员名称 不能为空", trigger: "blur" },
        ],
        "borderTransportMeans.arrivalDateTime": [
          {
            required: true,
            message: "抵境内第一目的港时间 不能为空",
            trigger: "blur",
          },
        ],
        loadinglocation: [
          { required: true, message: "装货地代码 不能为空", trigger: "blur" },
        ],
      },
      // 遮罩层
      loading: true,
      //关联挂车表 id
      Lid: undefined,
      //Head 唯一messageId
      Aid: undefined,
      // 选中数组
      ids: [],
      idALL: undefined,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 报文头信息表格数据
      headList: [],
      //运输方式字典翻译
      businessTypeOptions: [],
      //挂车类型翻译
      TrailertypeOptions: [],
      //进出境口岸海关代码
      customsCodeTypeOptions: [],
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
      form: {
        contractorCodeScc: undefined,
        stationPersonName: undefined,
        customsMaster: undefined,
        borderTransportMeans: {},
        consignment: {},
      },
      // 表单校验
      Tform: {
        transportId: undefined,
        tareWeight: undefined,
        typeCode: undefined,
        borderTransportMeansId: undefined,
      },
      rules: {},
      headList: [],
    };
  },
  created() {
    //挂车类型字典翻译
    this.getDicts("hg_trailer_type").then((response) => {
      this.TrailertypeOptions = response.data;
    });
    //运输方式代码翻译
    this.getDicts("station_transport_fashion").then((response) => {
      this.businessTypeOptions = response.data;
    });
    //进出境口岸海关代码
    this.getDicts("hg_customs_code").then((response) => {
      this.customsCodeTypeOptions = response.data;
    });
    this.initialization();
  },
  methods: {
    //托架/拖挂车类型 翻译
    Trailerformat(row, column) {
      return this.selectDictLabel(this.TrailertypeOptions, row.typeCode);
    },
    //查询空载挂车新增
    selectempty() {
      listemptycar(this.Lid).then((response) => {
        this.headList = response.rows;
      });
    },
    //页面初始化 回填数据
    initialization() {
      this.loading = true;
      init().then((response) => {
        this.form.contractorCodeScc = response.data.contractorCodeScc;
        this.form.stationPersonName = response.data.stationPersonName;
        this.form.customsMaster = response.data.customsMaster;
        this.form.borderTransportMeans.typeCode = "4";
        this.loading = false;
      });
    },
    // 表单重置
    reset() {
      this.form = {
        customsMaster: undefined,
        contractorCodeScc: undefined,
        stationPersonName: undefined,
        borderTransportMeans: {},
        consignment: {},
      };
      this.resetForm("form");
    },
    resetcar() {
      this.Tform = {};
    },
    //重置表头按钮
    emptyall() {
      this.reset();
      this.initialization();
    },
    //重置空载按钮
    delectempty() {
      this.resetcar();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.messageId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    handleUpdate(row) {
      this.reset();
      const messageId = row.messageId || this.ids;
      getHead(messageId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改报文头信息";
      });
    },
    /** 表头提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          addemptyCar(this.form).then((response) => {
            if (response.code === 200) {
              this.msgSuccess("新增成功");
              //关联ID
              this.Lid = response.data.id;
              //Head表 唯一messageId
              this.Aid = response.data.messageId;
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },
    // //挂车新增按钮
    addnewcar: function () {
      this.loading = true;
      this.$refs["Tform"].validate((valid) => {
        if (valid) {
          this.Tform.borderTransportMeansId = this.Lid;
          emptycarAll(this.Tform).then((response) => {
            if (response.code === 200) {
              this.msgSuccess("新增成功");
              this.selectempty();
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
      this.loading = false;
    },
    //数据申报状态按钮
    updateStatementCode: function () {
      this.form.messageId = this.Aid;
      console.log(this.form.messageId);
      updateCode(this.form).then((response) => {
        if (response.code === 200) {
          this.msgSuccess("申报成功");
          // this.reset();
        } else {
          this.msgError(response.msg);
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const messageIds = row.messageId || this.ids;
      this.$confirm(
        '是否确认删除报文头信息编号为"' + messageIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delHead(messageIds);
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
      this.$confirm("是否确认导出所有报文头信息数据项?", "警告", {
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