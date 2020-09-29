<template>
  <div class="app-container">
    <!--<el-row>
     <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          @click="submitHeadForm"
          v-hasPermi="['report:head:edit']"
        >修改</el-button>
      </el-col>
    </el-row>-->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="clearall">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          @click="addHeadForm()"
          v-hasPermi="['report:head:add']"
        >暂存</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-upload2" size="mini" @click="declare" v-hasPermi="['report:head:declare']">申报</el-button>
      </el-col>
    </el-row>

    <el-form :model="form" ref="form" :rules="headRules" label-width="190px" size="mini">
      <el-row>
        <el-col :span="6">
          <el-form-item label="货物运输批次号" prop="id">
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
               
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="运输方式代码" prop="borderTransportMeans.typeCode">
            <el-select
              v-model="form.borderTransportMeans.typeCode"
              :disabled="true"
              placeholder="请选择运输方式"
            >
              <el-option
                v-for="dict in TransportDictionary"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
                 
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="进出境口岸海关代码" prop="declarationOfficeId">
            <el-select v-model="form.declarationOfficeId" placeholder="请选择进出境口岸海关">
              <el-option
                v-for="dict in CustomsDictionary"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
                 
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="承运人代码" prop="carrier">
            <el-input
              v-model="form.carrier"
              placeholder="请输入承运人代码"
              clearable
              size="mini"
               
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="海关货物通关代码" prop="consignment.governmentProcedure">
            <el-input
              v-model="form.consignment.governmentProcedure"
              placeholder="请输入海关货物通关代码"
              clearable
              size="mini"
               
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="装货地代码" prop="loadingLocation">
            <el-input
              v-model="form.loadingLocation"
              placeholder="请输入装货地代码"
              clearable
              size="mini"
               
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
               
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="抵境内第一目的港时间" prop="borderTransportMeans.arrivalDateTime">
            <el-date-picker
              clearable
              style="width: 100%"
              v-model="form.borderTransportMeans.arrivalDateTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择时间"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="传输企业备案关区" prop="customsMaster">
            <el-select
              v-model="form.customsMaster"
              :disabled="true"
              placeholder="请选择传输企业备案关区"
              size="mini"
            >
              <el-option
                v-for="dict in CustomsDictionary"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
                 
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="企业代码" prop="contractorCodeScc">
            <el-input
              v-model="form.contractorCodeScc "
              placeholder="请输入企业代码"
              clearable
              size="mini"
               
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
               
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          @click="submittForm"
          v-hasPermi="['report:head:edit']"
        >修改</el-button>
      </el-col>
    </el-row>-->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="clearBody">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          @click="submitBodyForm"
          v-hasPermi="['report:transport:add']"
        >暂存</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="headList" height="180px">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column label="托架/拖挂车编号" align="center" prop="transportId" />
      <el-table-column label="托架/拖挂车类型" align="center" prop="typeCode" :formatter="Trailerformat" />
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
    <el-form :model="Tform" ref="Tform" :rules="bodyRules" :inline="true" label-width="180px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="托架/拖挂车编号" prop="transportId">
            <el-input v-model="Tform.transportId" placeholder="请输入托架/拖挂车编号" size="mini" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="托架/拖挂车类型" prop="typeCode">
            <el-select v-model="Tform.typeCode" placeholder="请选择托架/拖挂车类型" size="mini">
              <el-option
                v-for="dict in TrailerType"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
                 
              ></el-option>
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

    <!-- <el-row>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          @click="submitcForm"
          v-hasPermi="['report:head:edit']"
        >修改</el-button>
    </el-col>-->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="clearCoalBody">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          @click="coalBodyForm"
          v-hasPermi="['report:coal:add']"
        >暂存</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="coalList" height="180px">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column label="集装箱(器)编号" align="center" prop="transportEquipmentId" />
      <el-table-column
        label="集装箱(器)尺寸类型"
        align="center"
        prop="characteristicCode"
        :formatter="ContainerSizeformat"
      />
      <el-table-column
        label="集装箱(器)来源代码"
        align="center"
        prop="supplierPartyTypeCode"
        :formatter="ContainerSourceformat"
      />
      <el-table-column label="集装箱(器)自重kg" align="center" prop="tareWeight" />
      <el-table-column
        label="集装箱（器）重箱或者空箱标识"
        align="center"
        prop="fullnessCode"
        :formatter="ContainerSelfWeightformat"
      />
    </el-table>

    <el-form :model="Cform" ref="Cform" :rules="coalRules" :inline="true" label-width="180px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="集装箱(器)编号" prop="transportEquipmentId">
            <el-input v-model="Cform.transportEquipmentId" placeholder="请输入集装箱(器)编号" size="mini" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="集装箱(器)尺寸类型" prop="characteristicCode">
            <el-select v-model="Cform.characteristicCode" placeholder="请选择集装箱(器)尺寸类型" size="mini">
              <el-option
                v-for="dict in ContainerSize"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="集装箱(器)来源代码" prop="supplierPartyTypeCode">
            <el-select
              v-model="Cform.supplierPartyTypeCode"
              placeholder="请选择集装箱(器)来源代码"
              size="mini"
            >
              <el-option
                v-for="dict in ContainerSource"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="集装箱(器)自重kg" prop="tareWeight">
            <el-input v-model="Cform.tareWeight" placeholder="请输入集装箱(器)自重kg" size="mini" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="重箱或者空箱标识" prop="fullnessCode">
            <el-select v-model="Cform.fullnessCode" placeholder="请选择集装箱(器)重箱或者空箱标识" size="mini">
              <el-option
                v-for="dict in ContainerSelfWeight"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {
  listHead,
  getInfoHead,
  getHead,
  delHead,
  addHead,
  updateHead,
  updateDeclare,
  exportHead,
  getTransport,
  getCoal,
  getTransportDetail,
  getCoalDetail,
  updateTransport,
  updateCoal,
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
      // 运输方式字典
      TransportDictionary: [],
      // 进出境口岸关区字典
      CustomsDictionary: [],
      // 托架/拖车类型字典
      TrailerType: [],
      // 集装箱(器)来源字典
      ContainerSource: [],
      // 集装箱(器)尺寸类型字典
      ContainerSize: [],
      // 集装箱（器）重箱或者空箱标识
      ContainerSelfWeight: [],
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
        // borderTransportMeans:{
        //   borderId: undefined,
        //   name: undefined,
        //   typeCode: undefined,
        //   masterId:undefined,
        //   masterName:undefined,
        //   arrivalDateTime:undefined
        // },
        // consignment:{
        //   governmentProcedure: undefined
        // }
      },
      // 表单参数
      form: {
        // contractorCodeScc: undefined,
        // customsMaster :undefined,
        // arrivalDateTime: undefined,
        borderTransportMeans: {
          borderId: undefined,
          name: undefined,
          typeCode: undefined,
          masterId: undefined,
          masterName: undefined,
          arrivalDateTime: undefined,
        },
        consignment: {
          governmentProcedure: undefined,
        },
      },
      // 挂车表单参数
      Tform: {
        transportId: undefined,
        typeCode: undefined,
        tareWeight: undefined,
      },
      // 集装箱表单参数
      Cform: {},
      CID: undefined,
      TID: undefined,
      // 表单校验
      rules: {},
      headRules: {
        id: [
          { required: true, message: "请输入货物运输批次号", trigger: "blur" },
        ],
        declarationOfficeId: [
          {
            required: true,
            message: "请输入进出境口岸海关代码",
            trigger: "blur",
          },
        ],
        carrier: [
          { required: true, message: "请输入承运人代码", trigger: "blur" },
        ],
        loadingLocation: [
          { required: true, message: "请输入装货地代码", trigger: "blur" },
        ],
        // additionalInformation: [
        //   { required: true, message: "请输入备注信息", trigger: "blur" },
        // ],
        "borderTransportMeans.borderId": [
          { required: true, message: "请输入运输工具代码", trigger: "blur" },
        ],
        "borderTransportMeans.name": [
          { required: true, message: "请输入运输工具名称", trigger: "blur" },
        ],
        "borderTransportMeans.masterId": [
          { required: true, message: "请输入驾驶员代码", trigger: "blur" },
        ],
        "borderTransportMeans.masterName": [
          { required: true, message: "请输入驾驶员名称", trigger: "blur" },
        ],
        "borderTransportMeans.arrivalDateTime": [
          {
            required: true,
            message: "请输入抵境内第一目的港时间",
            trigger: "blur",
          },
        ],
        "consignment.governmentProcedure": [
          {
            required: true,
            message: "请输入海关货物通关代码",
            trigger: "blur",
          },
        ],
      },
      bodyRules: {
        transportId: [
          { required: true, message: "请输入托架/拖挂车编号", trigger: "blur" },
        ],
        typeCode: [
          { required: true, message: "请输入托架/拖挂车类型", trigger: "blur" },
        ],
        tareWeight: [
          { required: true, message: "请输入托架/拖挂车自重", trigger: "blur" },
        ],
      },
      coalRules: {
        transportEquipmentId: [
          { required: true, message: "请输入集装箱(器)编号", trigger: "blur" },
        ],
        characteristicCode: [
          {
            required: true,
            message: "请输入集装箱(器)尺寸类型",
            trigger: "blur",
          },
        ],
        supplierPartyTypeCode: [
          {
            required: true,
            message: "请输入集装箱(器)来源代码",
            trigger: "blur",
          },
        ],
        tareWeight: [
          {
            required: true,
            message: "请输入集装箱(器)自重kg",
            trigger: "blur",
          },
        ],
        fullnessCode: [
          {
            required: true,
            message: "集装箱（器）重箱或者空箱标识",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getList();
    /** 运输方式字典 */
    this.getDicts("station_transport_fashion").then((response) => {
      this.TransportDictionary = response.data;
    });
    /** 进出境口岸关区代码字典 */
    this.getDicts("hg_customs_code").then((response) => {
      this.CustomsDictionary = response.data;
    });
    /** 托架/拖挂车类型字典 */
    this.getDicts("hg_trailer_type").then((response) => {
      this.TrailerType = response.data;
    });
    /** 集装箱(器)来源字典 */
    this.getDicts("hg_container_source").then((response) => {
      this.ContainerSource = response.data;
    });
    /** 集装箱(器)尺寸类型字典 */
    this.getDicts("hg_container_size_type").then((response) => {
      this.ContainerSize = response.data;
    });
    /** 集装箱（器）重箱或者空箱标识 */
    this.getDicts("hg_container_self_weight").then((response) => {
      this.ContainerSelfWeight = response.data;
    });
  },
  methods: {
    /** 查询表头信息列表 */
    getList() {
      this.loading = true;
      getInfoHead().then((response) => {
        this.form.stationPersonName = response.data.stationPersonName;
        this.form.customsMaster = response.data.customsMaster;
        this.form.contractorCodeScc = response.data.contractorCodeScc;
        this.form.borderTransportMeans.typeCode = "4";
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 新增后表单查询 */
    getHeadList() {
      this.loading = true;
      getHead(this.form.messageId).then((response) => {
        this.form = response.data;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询挂车信息*/
    getListsmt() {
      this.loading = true;
      getTransport(this.TID).then((response) => {
        this.headList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /**查询集装箱信息 */
    getListCoal() {
      this.loading = true;
      getCoal(this.CID).then((response) => {
        this.coalList = response.data;
        this.total = response.total;
        this.loading = false;
      });
    },
    // /** 挂车行点击按钮 */
    // doubleClick(row, column, cell, event) {
    //   getTransportDetail(row.id).then((res) => {
    //     this.Tform = res.data;
    //   });
    // },
    // /**集装箱点击按钮 */
    // doubleClickOne(row, column, cell, event) {
    //   getCoalDetail(row.id).then((res) => {
    //     this.cFrom = res.data;
    //   });
    // },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    //托架/拖挂车类型 翻译
    Trailerformat(row, column) {
      return this.selectDictLabel(this.TrailerType, row.typeCode);
    },
    //集装箱(器)来源 翻译
    ContainerSourceformat(row, column) {
      return this.selectDictLabel(
        this.ContainerSource,
        row.supplierPartyTypeCode
      );
    },
    //集装箱(器)尺寸类型 翻译
    ContainerSizeformat(row, column) {
      return this.selectDictLabel(this.ContainerSize, row.characteristicCode);
    },
    //集装箱（器）重箱或者空箱标识翻译
    ContainerSelfWeightformat(row, column) {
      return this.selectDictLabel(this.ContainerSelfWeight, row.fullnessCode);
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
        remark: undefined,
      };

      this.resetForm("form");
    },

    // 清空信息
    clearall: function () {
      this.clearBody();
      this.clearCoalBody();
      this.clearHead();
      this.getList();
    },

    // 清空表头信息
    clearHead() {
      this.form = {
        id: undefined,
        declarationOfficeId: undefined,
        carrier: undefined,
        loadingLocation: undefined,
        customsMaster: undefined,
        additionalInformation: undefined,
        borderTransportMeans: {
          borderId: undefined,
          name: undefined,
          typeCode: undefined,
          masterId: undefined,
          masterName: undefined,
          arrivalDateTime: undefined,
        },
        consignment: {
          governmentProcedure: undefined,
        },
      };
    },

    // 清空挂车信息
    clearBody() {
      this.Tform = {
        transportId: undefined,
        typeCode: undefined,
        tareWeight: undefined,
      };
    },

    // 清空集装箱信息
    clearCoalBody() {
      this.Cform = {
        transportEquipmentId: undefined,
        characteristicCode: undefined,
        supplierPartyTypeCode: undefined,
        tareWeight: undefined,
        fullnessCode: undefined,
      };
    },

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
    // /** 修改按钮操作 */
    // handleUpdate(row) {
    //   this.reset();
    //   const pid = row.pid || this.ids;
    //   getInfoHead(pid).then((response) => {
    //     this.form = response.data;
    //     this.open = true;
    //     this.title = "修改【请填写功能名称】";
    //   });
    // },
    // /** 修改表头信息*/
    // submitHeadForm: function() {
    //         updateHead(this.form).then(response => {
    //           if (response.code === 200) {
    //             this.msgSuccess("修改成功");
    //             this.getList();
    //           } else {
    //             this.msgError(response.msg);
    //           }
    //         });

    // },
    declare: function () {
      updateDeclare(this.form).then((response) => {
        if (response.code === 200) {
          this.msgSuccess("申报成功");
        } else {
          this.msgError(response.msg);
        }
      });
    },
    /** 表头提交按钮 */
    addHeadForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.messageId != undefined) {
            updateHead(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.getHeadList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addHead(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess(response.msg);
                this.TID = response.data.Bid;
                this.CID = response.data.Cid;
                this.form.messageId = response.data.Mid;
                this.getHeadList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 挂车表体提交按钮 */
    submitBodyForm: function () {
      this.$refs["Tform"].validate((valid) => {
        this.Tform.borderTransportMeansId = this.TID;
        if (valid) {
          updateTransport(this.Tform).then((response) => {
            if (response.code == 200) {
              this.msgSuccess("新增成功");
              this.getListsmt();
              this.clearBody();
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },

    /** 集装箱表体提交按钮 */
    coalBodyForm: function () {
      this.$refs["Cform"].validate((valid) => {
        this.Cform.consignmentId = this.CID;
        if (valid) {
          updateCoal(this.Cform).then((response) => {
            if (response.code === 200) {
              this.msgSuccess("新增成功");
              this.getListCoal();
              this.clearCoalBody();
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },

    // /** 挂车修改按钮 */
    // submittForm: function () {
    //   updateTransport(this.Tform).then((response) => {
    //     if (response.code === 200) {
    //       this.msgSuccess("修改成功");
    //       // this.reset();
    //       this.getListsmt();
    //       this.clearBody();
    //     } else {
    //       this.msgError(response.msg);
    //     }
    //   });
    // },
    // /**集装箱修改按钮 */
    // submitcForm: function () {
    //   updateCoal(this.cFrom).then((response) => {
    //     if (response.code === 200) {
    //       this.msgSuccess("修改成功");
    //       this.getListCoal();
    //       this.clearCoalBody();
    //     } else {
    //       this.msgError(response.msg);
    //     }
    //   });
    // },
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
    // /**页面初始化数据 */
    // initialization() {
    //   init().then(response => {
    //     this.form = response.data;
    //     this.coalList = response.data;
    //     this.headList = response.data
    //     // this.queryParams.id = this.form.id;
    //     // this.smallform.headId = this.form.id;
    //     // this.queryParams.headId = this.form.id;
    //     // this.form.ieDirection = "I";
    //   });
    // }
  },
};
</script>