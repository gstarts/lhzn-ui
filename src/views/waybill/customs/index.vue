<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="70px">
      <el-form-item label="通关单号" prop="ccCustomsNumber">
        <el-input
          v-model="queryParams.ccCustomsNumber"
          placeholder="请输入通关单号"
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
          v-hasPermi="['waybill:customs:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['waybill:customs:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['waybill:customs:remove']"
        >删除</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload"
          size="mini"
          @click="handleImport"
          v-hasPermi="['waybill:customs:import']"
        >导入</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading"   :data="customsList" @selection-change="handleSelectionChange"  @sort-change="sortChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="通关单号" align="center" prop="ccCustomsNumber" />
      <el-table-column label="通关单批次号" align="center" prop="ccCustomsBatchNumber" />
      <el-table-column label="所属公司" align="center" prop="enterpriseInfo.eName" />
      <el-table-column label="重量(KG)" align="center" prop="ccCustomsWieght" />
      <el-table-column label="已使用重量(KG)" align="center" prop="useWieght" />
      <el-table-column label="剩余重量(KG)" align="center" prop="ccLastWieght" sortable="custom"   />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改通关单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="通关单号" prop="ccCustomsNumber">
          <el-input v-model="form.ccCustomsNumber" placeholder="请输入通关单号" />
        </el-form-item>
        <el-form-item label="通关单批次号" prop="ccCustomsBatchNumber">
          <el-input v-model="form.ccCustomsBatchNumber" placeholder="请输入通关单批次号" />
        </el-form-item>
        <el-form-item label="通关单重量(KG)" prop="ccCustomsWieght">
          <el-input v-model.number="form.ccCustomsWieght" placeholder="请输入通关单重量" />
        </el-form-item>
        <el-form-item label="所属公司" prop="ccCorporation">
          <el-select v-model="form.ccCorporation" placeholder="请选择公司" style="width:308px">
            <el-option
              v-for="item in companyNameOptions"
              :key="item.id"
              :label="item.eName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 文件导入 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?corporation=' + form.ccCorporation"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
        :data="form.ccCorporation"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将通关单文件拖到此处，或
          <em>点击上传</em>
        </div>

        <div class="el-upload__tip" slot="tip">
          
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>

        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
      <el-form ref="form" :model="form">
        <el-form-item label="所属公司">
          <el-select v-model="form.ccCorporation" placeholder="请选择公司">
            <el-option
              v-for="item in companyNameOptions"
              :key="item.id"
              :label="item.eName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  listCustoms,
  getCustoms,
  delCustoms,
  addCustoms,
  updateCustoms,
  exportCustoms,
  importTemplate
} from "@/api/waybill/customs";
import { listData } from "@/api/enterprise/qualification";
import { getToken } from "@/utils/auth";

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
      // 通关单表格数据
      customsList: [],
      // 公司名称列表
      companyNameOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ccCustomsNumber: undefined,
        ccCustomsBatchNumber: undefined,
        ccCustomsWieght: undefined,
        ccCorporation: undefined,
        order:undefined,
      },
      // 文件导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/waybill/customs/importData"
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        ccCustomsNumber: [
          { required: true, message: "请输入", trigger: "blur" }
        ],
        ccCustomsBatchNumber: [
          { required: true, message: "请输入", trigger: "blur" }
        ],
        ccCustomsWieght: [
          { required: true, message: "请输入", trigger: "blur" },
          { type: "number", message: "必须为数字值" }
        ],
        ccCorporation: [{ required: true, message: "请输入", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getList();
    this.getlistData();
  },
  methods: {
    /** 查询通关单列表 */
    getList() {
      this.loading = true;

      listCustoms(this.queryParams).then(response => {
        this.customsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 公司名称列表 */
    getlistData() {
      this.loading = true;
      listData().then(response => {
        this.companyNameOptions = response.rows;
      });
    },
    // 公司名称翻译
    corporationFormat(row, column) {
      return this.selectDictLabel(this.companyNameOptions, row.ccCorporation);
    },

    //排序
      sortChange(column, prop, order){

       
       this.queryParams.order=column.order;
       console.log(this.queryParams.order)
       this.getList()
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
        ccCustomsNumber: undefined,
        ccCustomsBatchNumber: undefined,
        ccCustomsWieght: undefined,
        ccCorporation: undefined,
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
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "通关单导入";
      this.upload.open = true;
      this.reset();
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
      this.title = "添加通关单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getCustoms(id).then(response => {
        this.form = response.data;
        this.form.ccCustomsWieght = parseInt(this.form.ccCustomsWieght)
        this.open = true;
        this.title = "修改通关单";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateCustoms(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addCustoms(this.form).then(response => {
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
      this.$confirm('是否确认删除通关单编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delCustoms(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },

    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then(response => {
        this.download(response.msg);
      });
    },

    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      // alert(this.form.ccCorporation)
      if (this.form.ccCorporation) {
        this.$refs.upload.submit();
      } else {
        this.$alert("请选择所属公司");
      }
    }
  }
};
</script>
