<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <!-- 大提煤单按钮 -->
      <el-col :span="1.5">
        <el-button icon="el-icon-edit" type="primary" size="mini" @click="submitForm">新 增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button icon="el-icon-refresh" type="success" size="mini" @click="clearall">重 置</el-button>
      </el-col>
    </el-row>
    <!-- 大提煤单输入框 -->
    <el-form :model="form" ref="form" label-width="150px" size="mini" :rules="headRules">
      <el-row>
        <el-col :span="6">
          <el-form-item label="提煤单号" prop="coalNumber">
            <el-input v-model="form.coalNumber" placeholder="请输入提煤单号" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收货单位" prop="receivingUnit">
            <el-input v-model="form.receivingUnit" placeholder="请输入收货单位" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客户" prop="custom">
            <el-input v-model="form.custom" placeholder="请输入客户" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="货物名称" prop="variety">
            <el-input v-model="form.variety" placeholder="请输入货物名称" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="合 同 号" prop="contract">
            <el-input v-model="form.contract" placeholder="请输入合同号" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="提煤总量" prop="weight">
            <el-input type="number" v-model="form.weight" placeholder="请输入提煤量" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="未提重量" prop="spoilt">
            <el-input v-model="form.spoilt" placeholder="系统反填" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="已提重量" prop="spoilt">
            <el-input v-model="form.spoilt" placeholder="系统反填" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
         <el-col :span="6">
          <el-form-item label="申报中重量" prop="spoilt">
            <el-input v-model="form.spoilt" placeholder="系统反填" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="申报中车辆" prop="spoilt">
            <el-input v-model="form.spoilt" placeholder="系统反填" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="有效车辆" prop="spoilt">
            <el-input v-model="form.spoilt" placeholder="系统反填" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="已提车辆" prop="spoilt">
            <el-input v-model="form.spoilt" placeholder="系统反填" disabled />
          </el-form-item>
        </el-col>
       
      </el-row>

      <el-row>
         <el-col :span="6">
          <el-form-item label="未提车辆" prop="spoilt">
            <el-input v-model="form.spoilt" placeholder="系统反填" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="作废车辆" prop="spoilt">
            <el-input v-model="form.spoilt" placeholder="系统反填" disabled />
          </el-form-item>
        </el-col>
         <el-col :span="6">
          <el-form-item label="录入时间" prop="dateTime">
            <el-input v-model="form.dateTime" placeholder="系统反填" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="录 入 人" prop="operator">
            <el-input v-model="form.operator" placeholder="系统反填" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="备 注 栏" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 小提煤单导出按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button icon="el-icon-edit" type="primary" size="mini" @click="ssubmitForm">新 增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button icon="el-icon-refresh" type="success" size="mini" @click="clearallsmall">重 置</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="smallhandleExport"
          v-hasPermi="['coal:plate:export']"
        >导 出</el-button>
      </el-col>
    </el-row>
    <!-- 小提煤单列表 -->
    <el-table :data="plateList"  height="260px">
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column label="提煤单号" align="center" prop="coalNumber" />
      <el-table-column label="车号" align="center" prop="plate" />
      <el-table-column label="承运单位" align="center" prop="carryingUnit" />
      <el-table-column label="状态" align="center" prop="status" :formatter="eIsEnterpriseTypeFormat"/>
      <el-table-column label="开单时间" align="center" prop="dateTime" />
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 小提煤单按钮 -->
    <div class="app-container">
      <!-- 236行有调用这个功能的按钮  导出功能可用 -->
      <!-- <el-button type="warning"  icon="el-icon-download"  size="mini"  @click="smallhandleExport"  v-hasPermi="['coal:plate:export']" >导出</el-button> -->
      <!-- 小提煤单输入框 -->
      <el-form
        :model="smallform"
        ref="smallform"
        label-width="140px"
        size="mini"
        :rules="bodyRules"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="承运单位" prop="carryingUnit">
              <el-input v-model="smallform.carryingUnit" placeholder="请输入承运单位" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="司机姓名" prop="driver">
              <el-input v-model="smallform.driver" placeholder="请输入司机姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="smallform.phone" placeholder="请输入手机号码" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="装载地点" prop="loadPlace">
              <el-input v-model="smallform.loadPlace" placeholder="请输入装载地点" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="车牌号码" prop="plate">
              <el-input v-model="smallform.plate" placeholder="请输入车牌号码" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="驱动桥数目" prop="warehouseId" >
              <el-select v-model="smallform.driveNum" placeholder="请选择类型" clearable >
                <el-option
                  v-for="item in DriveAxleTruckType"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
           <el-col>
            <el-form-item label="备 注 栏" prop="remarks">
              <el-input v-model="smallform.remarks" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  listNumber,
  getNumber,
  delNumber,
  addNumber,
  addPlate,
  updateNumber,
  exportPlate,
  exportNumber,
  init,
  listPlate,
  getplateList,
  getCoalInfo
} from "@/api/coal/addCoal";
export default {
  // name:CoalEdit,
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
      // 小提煤单表格数据
      plateList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //货车驱动桥数目类型
      DriveAxleTruckType: [],
      // 小提煤单数据状态字典
      CancelOptions : [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        coalNumber: undefined,
        receivingUnit: undefined,
        custom: undefined,
        variety: undefined,
        contract: undefined,
        weight: undefined,
        dateTime: undefined,
        operator: undefined,
        spoilt: undefined,
        securityKey: undefined,
        finished: undefined
      },
      //大提煤单验证
      headRules: {
        coalNumber: [{ required: true, message: "请输入", trigger: "blur" }],
        // receivingUnit: [{ required: true, message: "请选择", trigger: "blur" }],
        custom: [{ required: true, message: "请输入", trigger: "blur" }],
        variety: [{ required: true, message: "请输入", trigger: "blur" }],
        contract: [{ required: true, message: "请输入", trigger: "blur" }],
        weight: [{ required: true, message: "必须为数字且不能为空", trigger: "blur"}]
      },
      //小提煤单验证
      bodyRules: {
        // carryingUnit: [{ required: true, message: "请输入", trigger: "blur" }],
        // driver: [{ required: true, message: "请输入", trigger: "blur" }],
        // phone: [{ required: true, message: "请输入", trigger: "blur" }],
        loadPlace: [{ required: true, message: "请输入", trigger: "blur" }],
        plate: [{ required: true, message: "请输入", trigger: "blur" }],
        driveNum: [{ required: true, message: "请选择", trigger: "blur" }]
      },
      // 表单参数
      form: {},
      smallform: {},
      // 表单校验
      rules: {}
    };
  },
  created() {
    /** 小提煤单状态字典配置 */
    this.getDicts("station_declear_status").then(response => {
      this.CancelOptions = response.data;
    });
    //字典配置
    this.getDicts("number_of_drive_axles").then(response => {
      this.DriveAxleTruckType = response.data;
    });
    const { tableId } = this.$route.query;
         
    if (tableId) {
      // 获取表详细信息
      getCoalInfo(tableId).then(res => {
        this.form = res.data.info;
        this.plateList = res.data.rows;
      });
    } else {
      this.initialization();
    }

  },
  methods: {
    /** 查询小提煤单数据列表 */
    getList() {
      getplateList(this.form.coalNumber).then(response => {
        this.plateList = response.rows;
        this.total = response.total;
      });
    },
    
    /** 大提煤单新增按钮 */
    submitForm: function() {
      this.queryParams.coalNumber = this.form.coalNumber;
      this.$refs["form"].validate(valid => {
        if (valid) {
          addNumber(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },
    /** 小提煤单新增按钮 */
    ssubmitForm: function() {
      this.$refs["smallform"].validate(valid => {
        if (valid) {
          this.smallform.coalNumber = this.form.coalNumber;
          addPlate(this.smallform).then(response => {
            if (response.code === 200) {
              this.msgSuccess("新增成功");
              this.smallBody();
              this.open = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },
    /**清空大提煤单表单 */
    clearall: function() {
      this.clearBody();
      this.initialization();
      this.plateList=[];
    },
    /**清空小提煤单表单 */
    clearallsmall: function() {
      this.smallBody();
    },
    //清空小提煤单输入栏
    smallBody() {
      this.smallform = {
        carryingUnit: undefined,
        driver: undefined,
        phone: undefined,
        loadPlace: undefined,
        plate: undefined
      };
    },
    // 清空大提煤单输入栏
    clearBody() {
      this.form = {
        coalNumber: undefined,
        receivingUnit: undefined,
        custom: undefined,
        variety: undefined,
        contract: undefined,
        weight: undefined,
        dateTime: undefined,
        operator: undefined
      };
    },
    // 70行有调用这个功能的按钮  功能可用
    /**导出小提煤单操作 */
    smallhandleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有 "小提煤单" 数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportPlate(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    },
    // 状态字典翻译
    eIsEnterpriseTypeFormat(row, column) {
      return this.selectDictLabel(this.CancelOptions, row.status);
    },
    /**页面初始化数据 */
    initialization() {
      init().then(response => {
        this.form = response.data;
      });
    }
  }
};
</script>
<style lang="css" scoped>
.el-select {
  width: 100%;
}
</style>