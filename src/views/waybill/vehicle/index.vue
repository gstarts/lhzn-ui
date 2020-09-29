<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="70px">
      <el-form-item label="车牌号码" prop="dvLicense">
        <el-input
          v-model="queryParams.dvLicense"
          placeholder="请输入车牌号码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['waybill:vehicle:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['waybill:vehicle:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['waybill:vehicle:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload"
          size="mini"
          @click="handleImport"
          v-hasPermi="['waybill:vehicle:import']"
        >导入</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="vehicleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="车牌号码" align="center" prop="dvLicense" />
      <el-table-column label="净重(KG)" align="center" prop="dvWeight" />
      <el-table-column label="载重(KG)" align="center" prop="dvLoad" />
      <el-table-column label="运输次数" align="center" prop="dvTransportNumber" />
      <el-table-column label="已完成次数" align="center" prop="dvOutTimes" />
      <el-table-column label="所属公司" align="center" prop="enterpriseInfo.eName" />
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改申报车辆对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="车牌号码" prop="dvLicense">
          <el-input v-model="form.dvLicense" placeholder="请输入车牌号码" />
        </el-form-item>
        <el-form-item label="净重(KG)" prop="dvWeight">
          <el-input v-model.number="form.dvWeight" placeholder="请输入净重" />
        </el-form-item>
        <el-form-item label="载重(KG)" prop="dvLoad">
          <el-input v-model.number="form.dvLoad" placeholder="请输入载重" />
        </el-form-item>
        <el-form-item label="运输次数" prop="dvTransportNumber">
          <el-input v-model.number="form.dvTransportNumber" placeholder="请输入运输次数" />
        </el-form-item>
        <el-form-item label="所属公司" >
          <el-select v-model="form.dvCorporation" placeholder="请选择公司" style="width:380px">
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
        :action="upload.url + '?corporation=' + form.dvCorporation+''"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
        :data="form.ccCorporation"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将申报车辆文件拖到此处，或
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
          <el-select v-model="form.dvCorporation" placeholder="请选择公司">
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
  listVehicle,
  getVehicle,
  delVehicle,
  addVehicle,
  updateVehicle,
  exportVehicle,
  importTemplate
} from "@/api/waybill/vehicle";
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
      // 申报车辆表格数据
      vehicleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 公司名称列表
      companyNameOptions: [],
      // 弹出层标题
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dvLicense: undefined,
        dvWeight: undefined,
        dvLoad: undefined,
        dvTransportNumber: undefined,
        dvCorporation: undefined
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
        url: process.env.VUE_APP_BASE_API + "/waybill/vehicle/importData"
      },
      // 表单参数
      form: {},
  
      // 表单校验
      rules: {
        dvLicense: [
          { required: true, message: "请输入", trigger: "blur" },
          { min: 7, max: 7, message: "请输入7位有效车牌号", trigger: "blur" }
        ],
        dvWeight: [
          { required: true, message: "请输入", trigger: "blur" },
          { type: "number", message: "请输入数字" }
        ],
        dvLoad: [
          { required: true, message: "请输入", trigger: "blur" },
          { type: "number", message: "请输入数字" }
        ],
        dvTransportNumber: [
          { required: true, message: "请输入", trigger: "blur" },
          { type: "number", message: "请输入数字" }
        ],
        dvCorporation: [{ required: true, message: "请选择", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getList();
    this.getlistData();
  },
  methods: {
    /** 公司名称列表 */
    getlistData() {
      this.loading = true;
      listData().then(response => {
        this.companyNameOptions = response.rows;
      });
    },
    /** 查询申报车辆列表 */
    getList() {
      this.loading = true;
      listVehicle(this.queryParams).then(response => {
        this.vehicleList = response.rows;
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
        dvLicense: undefined,
        dvWeight: undefined,
        dvLoad: undefined,
        dvTransportNumber: undefined,
        dvCorporation: undefined
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
      this.title = "添加申报车辆";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getVehicle(id).then(response => {
        this.form = response.data;
        this.form.dvCorporation=parseInt(this.form.dvCorporation);
        this.open = true;
        this.title = "修改申报车辆";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateVehicle(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addVehicle(this.form).then(response => {
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
        '是否确认删除申报车辆编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delVehicle(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "申报车辆导入";
      this.upload.open = true;
      this.reset();
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
    this.form.dvCorporation = parseInt((this.form.dvCorporation));
      // alert(this.form.ccCorporation)
 //     console.log(typeof(this.form.dvCorporation));
      if (this.form.dvCorporation) {
        this.$refs.upload.submit();
      } else {
        this.$alert("请选择所属公司");
      }
    }
  }
};
</script>