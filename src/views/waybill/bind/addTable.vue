<template>
  <!-- 表头信息 -->
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="clearall"
          v-hasPermi="['waybill:head:clear']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          @click="submitForm()"
          v-hasPermi="['waybill:head:add']"
        >暂存</el-button>
      </el-col>
    </el-row>
    <!-- 提运单表头 -->
    <el-form ref="form" :model="form" :rules="headRules" label-width="150px" size="mini">
      <el-row>
        <el-col :span="6">
          <el-form-item label="数据中心同一编号" prop="dataId">
            <el-input v-model="form.dataId" placeholder="系统反填" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="车次确认编号" prop="sureid">
            <el-input v-model="form.sureid" placeholder="系统反填" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="关区代码" prop="customsmaster">
            <el-input v-model="form.customsmaster" placeholder="请输入关区代码" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="单证状态" prop="feedback">
            <el-select v-model="form.documentstatus" placeholder="未暂存" disabled>
              <el-option
                v-for="dict in feedbackOptions"
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
          <el-form-item label="录入时间" prop="optime">
            <el-input v-model="form.optime" placeholder="系统反填" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="统一社会引用代码" prop="contractorcodescc">
            <el-input v-model="form.contractorcodescc" placeholder="系统反填" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="组织机构代码" prop="contractorcode">
            <el-input v-model="form.contractorcode" placeholder="系统反填" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="操作人员" prop="opuserid">
            <el-input v-model="form.opuserid" placeholder="系统反填" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="绑定介质类型" prop="bindkeytype">
            <el-select
              v-model="form.bindkeytype"
              placeholder="请选择绑定介质类型"
             
            >
              <el-option
                v-for="dict in mediumTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="绑定介质关键信息" prop="bindkeyinfo">
            <el-input v-model="form.bindkeyinfo"  placeholder="请输入绑定介质关键信息" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="业务类型" prop="rdcode">
            <el-select v-model="form.rdcode" placeholder="请选择业务类型">
              <el-option
                v-for="dict in businessTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="运输方式" prop="decltrafmode">
            <el-select v-model="form.decltrafmode" placeholder="请选择运输方式">
              <el-option
                v-for="dict in shipTypeOptions"
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
          <el-form-item label="进出口标志" prop="ieflag">
            <el-select v-model="form.ieflag" placeholder="请选择进出口方式">
              <el-option
                v-for="dict in importExitOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="过卡车辆类型" prop="bayonetrdcode">
            <el-select v-model="form.bayonetrdcode" placeholder="请选择过卡车辆类型">
              <el-option
                v-for="dict in viaOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="车辆重量(KG)" prop="vehicleweight">
            <el-input v-model="form.vehicleweight" placeholder="请输入车辆重量" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="挂车重量(KG)" prop="trailerweight">
            <el-input v-model="form.trailerweight" placeholder="请输入挂车重量" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="集装箱重量(KG)" prop="contaweight">
            <el-input v-model="form.contaweight" placeholder="请输入集装箱重量" />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入备注信息" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 提运单body列表 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="clearBody"
          v-hasPermi="['waybill:body:clear']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          @click="submitBodyForm"
          v-hasPermi="['waybill:body:add','waybill:body:edit']"
        >暂存</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['waybill:body:remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table
      :data="bodyList"
      @selection-change="handleSelectionChange"
      @cell-dblclick="doubleClick"
      height="260px"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column
        label="绑定对象类型"
        align="center"
        prop="bindobjtype"
        :formatter="bindobjtypeFormatter"
      />
      <el-table-column label="绑定对象ID" align="center" prop="bindobjid" />
      <el-table-column label="业务类型" align="center" prop="rdcode" :formatter="businessTypeFormat" />
      <el-table-column label="提单类型" align="center" prop="billtype" :formatter="waybillTypeFormat" />
      <el-table-column label="集装箱号1" align="center" prop="contaid1" />
      <el-table-column label="集装箱号2" align="center" prop="contaid2" />
      <el-table-column label="安全智能锁号1" align="center" prop="esealid1" />
      <el-table-column label="安全智能锁号2" align="center" prop="esealid2" />
    </el-table>
    <!-- row-dblclick   当某一行被双击时会触发该事件-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 提运单表体 -->
    <el-form ref="bodyForm" :model="bodyform" :rules="bodyRules" label-width="150px" size="mini">
      <el-row>
        <el-col :span="6">
          <el-form-item label="进出方向">
            <el-select v-model="bodyform.iedirection" placeholder="请选择进出方向">
              <el-option
                v-for="dict in inOutOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="绑定对象类型" prop="bindobjtype">
            <el-select v-model="bodyform.bindobjtype" placeholder="请选择绑定对象类型">
              <el-option
                v-for="dict in bindobjtypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="绑定对象ID" prop="bindobjid">
            <el-input v-model="bodyform.bindobjid" placeholder="请输入绑定对象ID" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="货物运输批次号">
            <el-input v-model="bodyform.voyageno" placeholder="请输入货物运输批次号" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="船名" prop="transportid">
            <el-input v-model="bodyform.transportid" placeholder="请输入船名" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="业务类型">
            <el-select v-model="bodyform.rdcode" placeholder="请选择业务类型">
              <el-option
                v-for="dict in businessTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="提单类型" prop="billtype">
            <el-select v-model="bodyform.billtype" placeholder="请选择提单类型">
              <el-option
                v-for="dict in waybillTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="提货重量(KG)" prop="goodswt">
            <el-input v-model="bodyform.goodswt" placeholder="请输入本次提货重量" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="集装箱号1" prop="containerF">
            <el-input v-model="bodyform.contaid1" placeholder="请输入集装箱号1" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="集装箱号2" prop="containerS">
            <el-input v-model="bodyform.contaid2" placeholder="请输入集装箱号2" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="安全智能锁号1" prop="securityLockF">
            <el-input v-model="bodyform.esealid1" placeholder="请输入安全智能锁号1" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="安全智能锁号2" prop="securityLockS">
            <el-input v-model="bodyform.esealid2" placeholder="请输入安全智能锁号2" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="商品名称" prop="goodsName">
            <el-input v-model="bodyform.goodsName" placeholder="请输入商品名称" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
        <el-form-item label="所属仓库" prop="warehouseId">
        <el-select v-model="bodyform.warehouseId" placeholder="请选择货物所属仓库" clearable size="small">
          <el-option
            v-for="item in depotNameOptions"
            :key="item.id"
            :label="item.wName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="bodyform.remark" placeholder="请输入备注信息" />
        </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer"></div>
  </div>
</template>

<script>
import {
  listbodyTable,
  getDeclare,
  addHead,
  addBody,
  updateBody,
  getWaybillBody,
  delBody,
  init,
  check
} from "@/api/waybill/declare";
import { listData } from "@/api/enterprise/qualification";
import {depotList} from "@/api/depot/management";
export default {
   name: "BindEdit",
  data() {
    /**校验船名 */
    var validateTransport = (rule, value, callback) => {
      const toNumberVal = Number(value);
      if (
        ((typeof value === "string" && value === "") || value === null) &&
        this.form.decltrafmode == "2"
      ) {
        callback(new Error("请填写船名"));
      } else {
        callback();
      }
    };
    /**校验提单类型 */
    var validateBilltype = (rule, value, callback) => {
      const toNumberVal = Number(value);
      if (
        ((typeof value === "string" && value === "") || value === null) &&
        this.bodyform.bindobjtype == "B"
      ) {
        callback(new Error("请选择"));
      } else {
        callback();
      }
    };
  
    /** 校验绑定对象ID */
    var validateBindobjid = (rule, value, callback) => {
      const toNumberVal = Number(value);
      if (
        ((typeof value === "string" && value === "") || value === null) &&
        this.bodyform.bindobjtype == "B" &&
        this.form.ieflag == "E"
      ) {
        callback();
      } else if (
        (typeof value === "string" && value === "") ||
        value === null
      ) {
        callback(new Error("请输入"));
      } else {
        callback();
      }
    };

    /** 绑定介质信息校验 */
    var validateBindkeyinfo = (rule, value, callback) => {
      const toNumberVal = Number(value);
      if ((typeof value === "string" && value === "") || value === null) {
        callback(new Error("请输入绑定介质信息"));
      }
      check(value,this.headId).then(res => {
        if (res.code == "200" && res.msg) {
          callback(new Error(res.msg));
        } else {
          callback();
        }
      });
    };
    return {
      // 遮罩层
      visible: false,
      // 选中数组值
      tables: [],
      // 总条数
      total: 0,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 表数据
      bodyList: [],
      // 选中数组
      ids: [],
      //绑定介质类型
      mediumTypeOptions: [],
      // 绑定对戏类型
      bindobjtypeOptions: [],
      //进出口标志
      importExitOptions: [],
      //过卡车辆类型
      viaOptions: [],
      //运输方式
      shipTypeOptions: [],
      // 业务类型
      businessTypeOptions: [],
      // 进出标志
      inOutOptions: [],
      // 提单类型
      waybillTypeOptions: [],
      // 公司名称列表
      companyNameOptions: [],
        // 仓库名称列表
      depotNameOptions:[],
      // 状态码
      feedbackOptions: [],
      // 表头id
      headId: undefined,
      // 表单参数
      form: {
        bayonetrdcode: "02",
        vehicleweight: "0",
        trailerweight:"0",
        contaweight:"0",
        
      },
      bodyform: {
       bindobjtype:"B",
       rdcode:"1000000000",
       billtype:"1",
       iedirection:"E",
      },
      // 表头表单校验
      rules: {},
      // 表体表单校验
      bodyRules: {},
      // 自动分配时表头信息是否插入
      insertFlag: false,

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        headId: undefined,
        tableName: undefined,
        tableComment: undefined
      },

      headRules: {
        bindkeytype: [{ required: true, message: "请选择", trigger: "blur" }],
        bindkeyinfo: [{ required: true, message: "请选择", trigger: "blur" },{ validator: validateBindkeyinfo, trigger: "blur" }],
        rdcode: [{ required: true, message: "请选择", trigger: "blur" }],
        decltrafmode: [{ required: true, message: "请选择", trigger: "blur" }],
        ieflag: [{ required: true, message: "请选择", trigger: "blur" }],
        vehicleweight: [{ required: true, message: "请输入", trigger: "blur" }],
        trailerweight: [{ required: true, message: "请输入", trigger: "blur" }],
        contaweight: [{ required: true, message: "请输入", trigger: "blur" }],
        bayonetrdcode: [{ required: true, message: "请输入", trigger: "blur" }]
      },

      bodyRules: {
        // 绑定对象类型
        bindobjtype: [{ required: true, message: "请选择", trigger: "blur" }],
        // 所属仓库
         warehouseId: [{ required: true, message: "请选择", trigger: "blur" }],
         //商品名称
          goodsName: [{ required: true, message: "请输入", trigger: "blur" }],
        // 船名
        transportid: [{ validator: validateTransport, trigger: "blur" }],
        //提单类型
        billtype: [{ validator: validateBilltype, trigger: "blur" }],
        // 绑定对象ID
        bindobjid: [{ validator: validateBindobjid, trigger: "blur" }],
        // 本次提货重量
        goodswt: [{ required: true, message: "请输入", trigger: "blur" }]
      }
    };
  },

  created() {
    this.getDicts("station_medium_type").then(response => {
      this.mediumTypeOptions = response.data;
    });
    this.getDicts("station_bindobjt_type").then(response => {
      this.bindobjtypeOptions = response.data;
    });
    this.getDicts("station_IE_flag").then(response => {
      this.importExitOptions = response.data;
    });
    this.getDicts("station_via_type").then(response => {
      this.viaOptions = response.data;
    });
    this.getDicts("station_transport_fashion").then(response => {
      this.shipTypeOptions = response.data;
    });
    this.getDicts("station_business_type").then(response => {
      this.businessTypeOptions = response.data;
    });
    this.getDicts("station_IO_flag").then(response => {
      this.inOutOptions = response.data;
    });
    this.getDicts("station_waybill_type").then(response => {
      this.waybillTypeOptions = response.data;
    });
    this.getDicts("station_declear_status").then(response => {
      this.feedbackOptions = response.data;
    });
    this.getdepotList();
    const {tableId}  = this.$route.query;
    console.log("tableId"+tableId)
    if (tableId) {
      //将表头id 保存
      this.headId = tableId;
      // 获取表详细信息
      getDeclare(this.headId).then(res => {
        this.form = res.data.info;
        this.bodyList = res.data.rows;
      });
    } else {
      this.initialization();
    }
  },
  methods: {
    /** 查询提运单表体列表 */
    getList() {
      this.queryParams.headId = this.headId;
      listbodyTable(this.queryParams).then(res => {
        if (res.code === 200) {
          this.bodyList = res.rows;
        }
      });
    },
    /** 公司名称列表 */
    getlistData() {
      this.loading = true;
      listData().then(response => {
        this.companyNameOptions = response.rows;
        
      });
    },
      /** 仓库名称列表 */
    getdepotList(){
      depotList().then(response =>{
        this.depotNameOptions= response.rows;
        this.bodyform.warehouseId=this.depotNameOptions[0].id
      })
    },
    /**多选框操作 */

    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 绑定介质类型翻译
    mediumTypeFormat(row, column) {
      return this.selectDictLabel(this.mediumTypeOptions, row.bindkeytype);
    },
    //业务类型翻译
    businessTypeFormat(row, column) {
      return this.selectDictLabel(this.businessTypeOptions, row.rdcode);
    },
    // 提单类型翻译
    waybillTypeFormat(row, column) {
      return this.selectDictLabel(this.waybillTypeOptions, row.billtype);
    },
    bindobjtypeFormatter(row, column) {
      return this.selectDictLabel(this.bindobjtypeOptions, row.bindobjtype);
    },

    /** 表头提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.feedback = "0";
          addHead(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess(response.msg);
              this.open = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },
    /** 表体提交按钮 */
    submitBodyForm: function() {
      this.$refs["bodyForm"].validate(valid => {
        if (valid) {
          if (this.bodyform.id != undefined) {
            this.queryParams.headId = this.form.id;
            updateBody(this.bodyform).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.clearBody();
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            this.bodyform.headId = this.headId;
            addBody(this.bodyform).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.clearBody();
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },

    // 重置表体信息
    clearBody() {
      this.bodyform = {
        id: undefined,
        headId: undefined,
        bindobjtype: "B",
        bindobjid: undefined,
        iedirection: 'E',
        transportid: undefined,
        voyageno: undefined,
        rdcode: "1000000000",
        billtype: "1",
        goodswt: undefined,
        contaid1: undefined,
        contaid2: undefined,
        esealid1: undefined,
        esealid2: undefined,
        warehouseId:this.depotNameOptions[0].id,
        remark: undefined
      };
    },
    // 重置基础信息
    clearHead() {
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
        vehicleweight: "0",
        trailerweight: "0",
        contaweight: "0",
        feedback: undefined,
        feedbackMsg: undefined,
        feedbackTime: undefined,
        remark: undefined,
        enterpriseId: undefined
      };
    },

    /** 行点击按钮 */
    doubleClick(row, column, cell, event) {
      if (row.id != undefined) {
        getWaybillBody(row.id).then(res => {
          if (res.code === 200) {
            this.bodyform = res.data;
          }
        });
      }
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
          return delBody(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },

    /**清空全部表单 */
    clearall: function() {
      this.clearHead();
      this.clearBody();
      this.initialization();
      this.bodyList = [];
    },

    /**页面初始化数据 */
    initialization() {
      init().then(response => {
        this.form = response.data;
        this.headId = this.form.id;
        this.form.bayonetrdcode = "02";
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
