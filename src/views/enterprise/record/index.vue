<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="公司名称" prop="eName">
        <el-input
          v-model="queryParams.eName"
          placeholder="请输入公司名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公司性质" prop="eType">
        <el-select v-model="queryParams.eType" placeholder="请选择公司性质" clearable size="small">
          <el-option
            v-for="dict in eEnterpriseTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!-- 暂时删除 -->
      <!-- <el-form-item label="备案时间" prop="eRegisterTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.eRegisterTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择注册时间">
        </el-date-picker>-
         <el-date-picker clearable size="small" style="width: 200px"
         
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择注册时间">
        </el-date-picker>
      </el-form-item>-->
      <el-form-item label="是否会员" prop="eIsMember">
        <el-select v-model="queryParams.eIsMember" placeholder="请选择是否会员" clearable size="small">
          <el-option
            v-for="dict in eIsMemberOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否货主" prop="eIsCargoOwner">
        <el-select v-model="queryParams.eIsCargoOwner" placeholder="请选择是否货主" clearable size="small">
          <el-option
            v-for="dict in eIsCargoOwnerOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否货代" prop="eIsForwarder">
        <el-select v-model="queryParams.eIsForwarder" placeholder="请选择是否货代" clearable size="small">
          <el-option
            v-for="dict in eIsForwarderOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
          v-hasPermi="['enterprise:record:add']"
        >新增</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['enterprise:record:remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange" :row-click="click">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="公司名称" align="center" prop="eName" />
      <el-table-column
        label="公司性质"
        align="center"
        prop="eType"
        :formatter="eIsEnterpriseTypeFormat"
      />
      <el-table-column label="是否会员" align="center" prop="eIsMember" :formatter="eIsMemberFormat" />
      <el-table-column
        label="是否货主"
        align="center"
        prop="eIsCargoOwner"
        :formatter="eIsCargoOwnerFormat"
      />
      <el-table-column
        label="是否货代"
        align="center"
        prop="eIsForwarder"
        :formatter="eIsForwarderFormat"
      />
      <el-table-column label="操作时间" align="center">
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
            v-hasPermi="['enterprise:record:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['enterprise:record:remove']"
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

    <!-- 添加或修改企业信息备案对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small">
        <el-row>
          <el-col :span="16">
            <el-form-item label="公司名称" prop="eName">
              <el-input v-model="form.eName" placeholder="请输入公司名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="公司性质" prop="eType">
              <el-select v-model="form.eType" placeholder="请选择公司性质" style="width:133.32px">
                <el-option
                  v-for="dict in eEnterpriseTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="16">
            <el-form-item label="英文名称" prop="eEname">
              <el-input v-model="form.eEname" placeholder="请输入公司英文名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="公司简称" prop="eAbbreviation">
              <el-input v-model="form.eAbbreviation" placeholder="请输入公司简称" />
            </el-form-item>
          </el-col>
          <el-col :sapn="24">
            <el-form-item label="公司地址" prop="eAddress">
              <el-input v-model="form.eAddress" placeholder="请输入公司地址" w />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="公司法人" prop="eLegalPerson">
              <el-input v-model="form.eLegalPerson" placeholder="请输入法人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="法人电话" prop="eLegalPersonPhone">
              <el-input v-model="form.eLegalPersonPhone" placeholder="请输入法人电话" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务联系人" prop="eBusinessPerson">
              <el-input v-model="form.eBusinessPerson" placeholder="请输入业务联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册时间" prop="eRegisterTime">
              <el-date-picker
                clearable
                style="width:133.32px"
                v-model="form.eRegisterTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择注册时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="营业范围" prop="eBusinessScope">
              <el-input v-model="form.eBusinessScope" placeholder="请输入营业范围" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务联系人电话" prop="eBusinessPersonPhone">
              <el-input v-model="form.eBusinessPersonPhone" placeholder="请输入业务联系人电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="海关编号" prop="eCustomsNo">
              <el-input v-model="form.eCustomsNo" placeholder="请输入海关编号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="组织编号" prop="eOrganizationNo">
              <el-input v-model="form.eOrganizationNo" placeholder="请输入组织编号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否会员">
              <el-select v-model="form.eIsMember" placeholder="请选择是否会员" style="width:133.32px">
                <el-option
                  v-for="dict in eIsMemberOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="是否货主">
              <el-select v-model="form.eIsCargoOwner" placeholder="请选择是否货主" style="width:133.32px">
                <el-option
                  v-for="dict in eIsCargoOwnerOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否货代">
              <el-select v-model="form.eIsForwarder" placeholder="请选择是否货代" style="width:133.32px">
                <el-option
                  v-for="dict in eIsForwarderOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否拖车">
              <el-select v-model="form.eIsTrailer" placeholder="请选择是否拖车" style="width:133.32px">
                <el-option
                  v-for="dict in eIsTrailerOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="备注">
              <el-input type="textarea" v-model="form.eRemarks" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
  listRecord,
  getRecord,
  delRecord,
  addRecord,
  updateRecord,
  exportRecord
} from "@/api/enterprise/record";

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
      // 企业信息备案表格数据
      recordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否会员字典
      eIsMemberOptions: [],
      // 是否货主字典
      eIsCargoOwnerOptions: [],
      // 是否货代字典
      eIsForwarderOptions: [],
      // 公司性质字典
      eEnterpriseTypeOptions: [],
      // 是否拖车字典
      eIsTrailerOptions: [],

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        eName: undefined,
        eType: undefined,
        eRegisterTime: undefined,
        eIsMember: undefined,
        eIsCargoOwner: undefined,
        eIsForwarder: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        eName: [
          { required: true, trigger: "change", message: "公司名称不能为空" }
        ],
        eType: [
          { required: true, trigger: "change", message: "公司性质不能为空" }
        ],
        eAbbreviation: [
          { required: true, trigger: "change", message: "公司简称不能为空" }
        ]
      }
    };
  },
  created() {
    this.getList();

    this.getDicts("station_yes_no").then(response => {
      this.eIsMemberOptions = response.data;
    });
    this.getDicts("station_yes_no").then(response => {
      this.eIsCargoOwnerOptions = response.data;
    });
    this.getDicts("station_yes_no").then(response => {
      this.eIsForwarderOptions = response.data;
    });
    this.getDicts("station_enterprise_type").then(response => {
      this.eEnterpriseTypeOptions = response.data;
    });
    this.getDicts("station_yes_no").then(response => {
      this.eIsTrailerOptions = response.data;
      console.log(this.eIsTrailerOptions);
    });
  },
  methods: {
    /** 查询企业信息备案列表 */
    getList() {
      this.loading = true;
      listRecord(this.queryParams).then(response => {
        this.recordList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    //
    click(row, column, event){
       
    },
    // 是否会员字典翻译
    eIsMemberFormat(row, column) {
      return this.selectDictLabel(this.eIsMemberOptions, row.eIsMember);
    },
    // 是否货主字典翻译
    eIsCargoOwnerFormat(row, column) {
      return this.selectDictLabel(this.eIsCargoOwnerOptions, row.eIsCargoOwner);
    },
    // 是否货代字典翻译
    eIsForwarderFormat(row, column) {
      return this.selectDictLabel(this.eIsForwarderOptions, row.eIsForwarder);
    },

    eIsEnterpriseTypeFormat(row, column) {
      return this.selectDictLabel(this.eEnterpriseTypeOptions, row.eType);
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
        eName: undefined,
        eType: undefined,
        eEname: undefined,
        eAbbreviation: undefined,
        eAddress: undefined,
        eLegalPerson: undefined,
        eLegalPersonPhone: undefined,
        eBusinessPerson: undefined,
        eBusinessPersonPhone: undefined,
        eRegisterTime: undefined,
        eBusinessScope: undefined,
        eCustomsNo: undefined,
        eOrganizationNo: undefined,
        eIsMember: undefined,
        eIsCargoOwner: undefined,
        eIsForwarder: undefined,
        eIsTrailer: undefined,
        eRemarks: undefined,
        version: undefined,
        crtime: undefined,
        cruser: undefined,
        crusername: undefined,
        del: undefined
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
      this.title = "添加企业信息备案";
      this.form.eIsCargoOwner = "0";
      this.form.eIsForwarder = "0";
      this.form.eIsMember = "0";
      this.form.eIsTrailer = "0";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getRecord(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改企业信息备案";
      });
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
      this.$confirm("是否确认删除企业信息备案的数据项?", "警告", {
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
      this.$confirm("是否确认导出所有企业信息备案数据项?", "警告", {
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