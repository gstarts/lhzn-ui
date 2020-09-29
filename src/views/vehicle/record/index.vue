<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="车牌号" prop="vLicense">
        <el-input
          v-model="queryParams.vLicense"
          placeholder="请输入车牌号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车辆类型" prop="vType">
        <el-select v-model="queryParams.vType" placeholder="请选择车辆类型" clearable size="small">
          <el-option
            v-for="dict in vehicleTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="车主" prop="vOwner">
        <el-input
          v-model="queryParams.vOwner"
          placeholder="请输入车主"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公司" prop="vEnterpriseId">
        <el-input
          v-model="queryParams.vName"
          placeholder="请输入公司"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['vehicle:record:add']"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['vehicle:record:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['vehicle:record:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['vehicle:record:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="recordList">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="车牌号" align="center" prop="vLicense" />
      <el-table-column label="车辆类型" align="center" prop="vType" :formatter="vehicleTypeFormat" />
      <el-table-column label="车主" align="center" prop="vOwner" />
      <el-table-column label="公司名称" align="center" prop="enterpriseInfo.eName" />
      <el-table-column label="备注" align="center" prop="vRemarks" />
      <el-table-column label="备案时间" align="center" prop="crtime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.crtime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['vehicle:record:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['vehicle:record:remove']"
          >删除</el-button>
          <el-button
            v-if="scope.row.vICNo==0"
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="ICbind(scope.row)"
            v-hasPermi="['vehicle:record:bind']"
          >绑定IC卡</el-button>
          <el-button
            v-if="scope.row.vICNo!=''"
            size="mini"
            type="text"
            icon="el-icon-minus"
            @click="untie(scope.row)"
            v-hasPermi="['vehicle:record:untie']"
          >解绑IC卡</el-button>
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

    <!-- 添加或修改车辆备案对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="车牌号" prop="vLicense">
              <el-input v-model="form.vLicense" placeholder="请输入车牌号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车辆性质" prop="vType">
              <el-select v-model="form.vType" placeholder="请选择" style="width:280px">
                <el-option
                  v-for="dict in vehicleTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司简称" prop="vEnterpriseId">
              <el-select v-model="form.vEnterpriseId" placeholder="请输入公司简称" style="width:280px">
                <el-option
                  v-for="item in companyNameOptions"
                  :key="item.id"
                  :label="item.eName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车主" prop="vOwner">
              <el-input v-model="form.vOwner" placeholder="请输入车主" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="收费类型" prop="vChargeTypeId">
              <el-select v-model="form.vChargeTypeId" placeholder="请选择收费类型" style="width:280px">
                <el-option
                  v-for="dict in vehicleTollOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.vChargeTypeId==2" label="车辆有效期" prop="vPayTime">
              <el-date-picker
                clearable
                size="small"
                style="width: 280px"
                v-model="form.vPayTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="车辆有效期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="拖车号" prop="vTrailerNo">
              <el-input v-model="form.vTrailerNo" placeholder="请输入拖车号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="前车架号" prop="vFrontNumber">
              <el-input v-model="form.vFrontNumber" placeholder="请输入前车架号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车头重量" prop="vHeadstockWeight">
              <el-input v-model="form.vHeadstockWeight" placeholder="请输入车头重量" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="后车架号" prop="vRearNumber">
              <el-input v-model="form.vRearNumber" placeholder="请输入后车架号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="备注" prop="vRemarks">
              <el-input type="textarea" v-model="form.vRemarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 绑定IC卡时 弹出的对话框 -->
    <el-dialog :title="title" :visible.sync="openIC" width="300px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="small">
        <el-form-item label="车牌号" prop="name">
          <el-input v-model="form.vLicense" placeholder="请输入车牌号" />
        </el-form-item>
        <el-form-item label="IC卡号" prop="vICNo">
          <el-input v-model="form.vICNo" placeholder="请输入IC卡号" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bindForm">绑定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  licenselist,
  listRecord,
  getRecord,
  delRecord,
  addRecord,
  updateRecord,
  exportRecord,
  bindIC,
  uniteIC
} from "@/api/vehicle/record";
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
      // 总条数
      total: 0,
      // 车辆备案表格数据
      recordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示绑定对话框
      openIC: false,
      // 是否有效字典
      delOptions: [],
      // 车辆类型字典
      vehicleTypeOptions: [],
      //  车牌号列表
      vehiclelicenseOptions: [],
      // 收费类型列表
      vehicleTollOptions: [],
      // 公式名称列表
      companyNameOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        vLicense: undefined,
        vType: undefined,
        vName: undefined,
        vOwner: undefined,
        vLicense:undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        vLicense: [
          { required: true, trigger: "change", message: "车牌号不能为空" }
        ],
        vType: [
          { required: true, trigger: "change", message: "车辆性质不能为空" }
        ],
        vEnterpriseId: [
          { required: true, trigger: "change", message: "公司简称不能为空" }
        ],
        vChargeTypeId: [
          { required: true, trigger: "change", message: "收费类型不能为空" }
        ],
        vICNo: [
          { required: true, trigger: "change", message: "IC卡号不能为空" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("station_yes_no").then(response => {
      this.delOptions = response.data;
    });
    this.getDicts("station_vehicle_type").then(response => {
      this.vehicleTypeOptions = response.data;
    });
    this.getDicts("station_toll_type").then(response => {
      this.vehicleTollOptions = response.data;
    });
    this.getvehiclelicenselist();
    this.getlistData();
  },
  methods: {
    /** 查询车牌号列表 */
    getvehiclelicenselist() { 
      licenselist(this.queryParams).then(response => {
        this.vehiclelicenseOptions = response.rows;
      });
    },
    /** 公司名称列表 */
    getlistData() {
      this.loading = true;
      listData().then(response => {
        this.companyNameOptions = response.rows;
      });
    },
    /** 查询车辆备案列表 */
    getList() {
      this.loading = true;
      listRecord(this.queryParams).then(response => {
        this.recordList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 车辆类型字典翻译
    vehicleTypeFormat(row, column) {
      return this.selectDictLabel(this.vehicleTypeOptions, row.vType);
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.openIC = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        vLicense: undefined,
        vType: undefined,
        vEnterpriseId: undefined,
        vOwner: undefined,
        vChargeTypeId: undefined,
        vTrailerNo: undefined,
        vFrontNumber: undefined,
        vRearNumber: undefined,
        vHeadstockWeight: undefined,
        vRemarks: undefined,
        vPayTime: undefined,
        version: undefined,
        crtime: undefined,
        cruser: undefined,
        crusername: undefined,
        del: undefined,
        vICNo: undefined,
        id:undefined
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // // 多选框选中数据
    // handleSelectionChange(selection) {
    //   this.ids = selection.map(item => item.id);
    //   this.single = selection.length != 1;
    //   this.multiple = !selection.length;
    // },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加车辆备案";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getRecord(id).then(response => {
        this.form = response.data;
        this.form.vType = this.form.vType.toString();
        this.form.vChargeTypeId = this.form.vChargeTypeId.toString();
        this.open = true;
        this.title = "修改车辆备案";
      });
    },

    /**绑定IC卡操作 */
    ICbind(row) {
      this.reset();
      const id = row.id || this.ids;
      getRecord(id).then(response => {
        this.form = response.data;
        this.openIC = true;
        this.title = "绑定IC卡";
      });
    },
    /**确定绑定IC卡 */
    bindForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          bindIC(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess("绑定成功");
              this.openIC = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },
    /** 解除绑定 */
    untie(row) {
      const id = row.id || this.ids;
      this.$confirm("解绑IC卡信息可能给您带来不便,确定解除绑定吗？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return uniteIC(id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("解绑成功");
        })
        .catch(function() {});
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateRecord(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addRecord(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$confirm("是否确认删除车辆备案数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delRecord(ids);
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
      this.$confirm("是否确认导出所有车辆备案数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportRecord(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })

        .catch(function() {});
    }
  }
};
</script>