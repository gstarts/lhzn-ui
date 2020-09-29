<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="公司名称" prop="cruser">
        <el-select
          v-model="queryParams.cruser"
          filterable
          placeholder="请选择公司"
          clearable
          size="small"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.id"
            :label="item.eName"
            :value="item.id"
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
          v-hasPermi="['enterprise:qualification:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['enterprise:qualification:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['enterprise:qualification:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['enterprise:qualification:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="qualificationList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="公司名称" align="center" prop="enterpriseInfo.eName" />
      <el-table-column label="资质名称" align="center" prop="qQualificationsNam" />
      <el-table-column label="证书编号" align="center" prop="qCertificateNo" />
      <el-table-column label="资质编号" align="center" prop="qQualificationsNo" />
      <el-table-column label="公司账号" align="center" prop="qEnterpriseAccount" />
      <el-table-column label="创建时间" align="center" prop="crtime" width="180">
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
            v-hasPermi="['enterprise:qualification:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['enterprise:qualification:remove']"
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

    <!-- 添加或修改企业资质管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="small">
        <el-form-item label="公司名称" prop="qEnterpriseInfoId">
          <el-select v-model="form.qEnterpriseInfoId" placeholder="请选择公司">
            <el-option
              v-for="item in typeOptions"
              :key="item.id"
              :label="item.eName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="公司账号" prop="qEnterpriseAccount">
          <el-input v-model="form.qEnterpriseAccount" placeholder="请输入公司账号" />
        </el-form-item>
        <el-form-item label="资质名称" prop="qQualificationsNam">
          <el-input v-model="form.qQualificationsNam" placeholder="请输入资质名称" />
        </el-form-item>
        <el-form-item label="资质编号" prop="qQualificationsNo">
          <el-input v-model="form.qQualificationsNo" placeholder="请输入资质编号" />
        </el-form-item>
        <el-form-item label="证书编号" prop="qCertificateNo">
          <el-input v-model="form.qCertificateNo" placeholder="请输入证书编号" />
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
  listData,
  listQualification,
  getQualification,
  delQualification,
  addQualification,
  updateQualification,
  exportQualification
} from "@/api/enterprise/qualification";

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
      // 企业资质管理表格数据
      qualificationList: [],
      // 企业公司名称
      qualificationOptions: [],
      // 类型数据字典
      typeOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        cruser: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        qEnterpriseInfoId: [
          { required: true, trigger: "change", message: "公司名称不能为空" }
        ],
        qEnterpriseAccount: [
          { required: true, trigger: "change", message: "公司账号不能为空" }
        ],
        qQualificationsNam: [
          { required: true, trigger: "change", message: "资质名称不能为空" }
        ],
        qQualificationsNo: [
          { required: true, trigger: "change", message: "资质编号不能为空" }
        ],
        qCertificateNo: [
          { required: true, trigger: "change", message: "证书编号不能为空" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getlistData();
  },
  methods: {
    /** 查询公司名称列表 */
    getlistData() {
      this.loading = true;
      listData().then(response => {
        this.typeOptions = response.rows;
        console.log(this.typeOptions);
      });
    },

    /** 查询企业资质管理列表 */
    getList() {
      this.loading = true;
      listQualification(this.queryParams).then(response => {
        this.qualificationList = response.rows;
        this.total = response.total;
        this.loading = false;
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
        id: undefined,
        qEnterpriseInfoId: undefined,
        qEnterpriseAccount: undefined,
        qQualificationsNam: undefined,
        qQualificationsNo: undefined,
        qCertificateNo: undefined,
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
      this.title = "添加企业资质管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getQualification(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改企业资质管理";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateQualification(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addQualification(this.form).then(response => {
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
        '是否确认删除企业资质管理编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delQualification(ids);
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
      this.$confirm("是否确认导出所有企业资质管理数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportQualification(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>