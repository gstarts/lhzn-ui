<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="仓库名称" prop="cWarehouseName">
        <el-input
          v-model="queryParams.cWarehouseName"
          placeholder="请输入仓库名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="仓库类型" prop="cWType">
        <el-input
          v-model="queryParams.cWType"
          placeholder="仓库类型"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="仓库用途" prop="cPurpose">
        <el-input
          v-model="queryParams.cPurpose"
          placeholder="请输入仓库用途"
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
          v-hasPermi="['depot:contract:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['depot:contract:remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="contractList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="仓库名称"
        align="center"
        prop="cWarehouseId"
        :formatter="warehouseNameFormat"
      />
      <el-table-column
        label="公司名称"
        align="center"
        prop="cEnterpriseId"
        :formatter="companyNameFormat"
      />
      <el-table-column label="仓库用途" align="center" prop="cPurpose" />
      <el-table-column label="到期时间" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.cEndTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" align="center" prop="cPrice" />
      <el-table-column label="定金" align="center" prop="cEarnest" />
      <el-table-column label="是否支付" align="center" prop="cIsPay" :formatter="eIsPayFormat" />
      <el-table-column label="创建时间" align="center" width="180">
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
            v-hasPermi="['depot:contract:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['depot:contract:remove']"
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

    <!-- 添加或修改仓库合同对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="仓库名称" prop="cWarehouseId">
              <el-select v-model="form.cWarehouseId" placeholder="请选择仓库名称" style="width:300px">
                <el-option
                  v-for="item in depotNameOptions"
                  :key="item.id"
                  :label="item.wName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="到期时间" prop="cEndTime">
              <el-date-picker
                clearable
                size="small"
                style="width:300px"
                v-model="form.cEndTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择到期时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司名称" prop="cEnterpriseId">
              <el-select v-model="form.cEnterpriseId" placeholder="请选择公司名称" style="width:300px">
                <el-option
                  v-for="company in companyOptions"
                  :key="company.id"
                  :label="company.eName"
                  :value="company.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用途" prop="cPurpose">
              <el-input v-model="form.cPurpose" placeholder="请输入用途" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格" prop="cPrice">
              <el-input v-model="form.cPrice" placeholder="请输入价格" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否支付">
              <el-select v-model="form.cIsPay" placeholder="请选择" style="width:300px">
                <el-option
                  v-for="dict in eIsPayOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="定金" prop="cEarnest">
              <el-input v-model="form.cEarnest" placeholder="请输入定金" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="备注" prop="cRemarks">
          <el-input type="textarea" v-model="form.cRemarks" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listContract,
  getContract,
  delContract,
  addContract,
  updateContract,
  exportContract
} from "@/api/depot/contract";
import { depotList } from "@/api/depot/management";
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
      // 仓库合同表格数据
      contractList: [],
      // 仓库名称列表
      depotNameOptions: [],
      // 公司名称
      companyOptions: [],
      // 是否支付字典
      eIsPayOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        cWarehouseId: undefined,
        cEnterpriseId: undefined,
        cPrice: undefined,
        cEarnest: undefined,
        cPurpose: undefined,
        cWType: undefined,
        cWarehouseName: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
         cWarehouseId: [
          { required: true, trigger: "change", message: "仓库名称不能为空" }
        ],
        cEndTime: [
          { required: true, trigger: "change", message: "到期时间不能为空" }
        ],
        cEnterpriseId: [
          { required: true, trigger: "change", message: "公司名称不能为空" }
        ],
        cPrice: [
          { required: true, trigger: "change", message: "价格不能为空" }
        ],
         cEarnest: [
          { required: true, trigger: "change", message: "定金不能为空" }
        ],
        cPurpose:[
          {required: true, trigger: "change", message: "用途不能为空"}
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getdepotList();
    this.getlistData();
    this.getDicts("station_yes_no").then(response => {
      this.eIsPayOptions = response.data;
    });
  },
  methods: {
    /** 查询公司名称列表 */
    getlistData() {
      this.loading = true;
      listData().then(response => {
        this.companyOptions = response.rows;
      });
    },
    /** 仓库名称列表 */
    getdepotList() {
      depotList().then(response => {
        this.depotNameOptions = response.rows;
      });
    },

    /** 查询仓库合同列表 */
    getList() {
      this.loading = true;
      listContract(this.queryParams).then(response => {
        this.contractList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 公司名称翻译
    companyNameFormat(row, column) {
      var value = row.cEnterpriseId;
      var datas = this.companyOptions;
      var actions = [];
      Object.keys(datas).map(key => {
        if (datas[key].id == "" + value) {
          actions.push(datas[key].eName);
          return false;
        }
      });
      return actions.join("");
    },
    // 仓库名称翻译
    warehouseNameFormat(row, column) {
      var value = row.cWarehouseId;
      var datas = this.depotNameOptions;
      var actions = [];
      Object.keys(datas).map(key => {
        if (datas[key].id == "" + value) {
          actions.push(datas[key].wName);
          return false;
        }
      });
      return actions.join("");
    },
    // 是否支付翻译
    eIsPayFormat(row, column) {
      return this.selectDictLabel(this.eIsPayOptions, row.cIsPay);
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
        cWarehouseId: undefined,
        cEnterpriseId: undefined,
        cPrice: undefined,
        cEarnest: undefined,
        cPurpose: undefined,
        cEndTime: undefined,
        cIsPay: undefined,
        cRemarks: undefined,
        version: undefined,
        crtime: undefined,
        cruser: undefined,
        crusername: undefined,
        del: undefined,
        cWarehouseName: undefined
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
      this.form.cIsPay = "0";
      this.title = "添加仓库合同";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getContract(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改仓库合同";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateContract(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addContract(this.form).then(response => {
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
      this.$confirm(
        '是否确认删除仓库合同编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delContract(ids);
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
      this.$confirm("是否确认导出所有仓库合同数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportContract(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>