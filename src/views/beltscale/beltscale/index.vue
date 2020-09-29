<template>
  <div class="app-container">
    <el-row :gutter="0">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-col :span="4">
      <el-form-item label="品名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入品名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      </el-col>
      <el-col :span="1">
         <!-- 蒙文键盘 -->
        <el-popover placement="right" width="500" trigger="click">
          <SimpleKeyboard @onChange="onChange" :input="queryParams.name" />
          <el-button slot="reference" type="info" class="fa fa-keyboard-o" size="medium"></el-button>
        </el-popover>
      </el-col>
      <el-col :span="4">
      <el-form-item label="值班日期" prop="time">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model="queryParams.time"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择值班日期"
        ></el-date-picker>
      </el-form-item>
      </el-col>
      <el-form-item>
      </el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
    </el-form>
</el-row>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['beltscale:beltscale:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['beltscale:beltscale:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['beltscale:beltscale:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['beltscale:beltscale:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="beltscaleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="品名" align="center" prop="name" />
      <el-table-column label="班组" align="center" prop="team" />
      <el-table-column label="值班日期" align="center" prop="time" width="180"></el-table-column>
      <el-table-column label="重量" align="center" prop="weight" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['beltscale:beltscale:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['beltscale:beltscale:remove']"
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

    <!-- 添加或修改皮带秤对话框 -->
    <el-dialog :title="title" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="品名" prop="name">
          <el-input v-model="form.name" placeholder="请输入品名" size="mini" />
        </el-form-item>
        <el-form-item label="班组" prop="team">
          <el-input v-model="form.team" placeholder="请输入班组" size="mini" />
        </el-form-item>
        <el-form-item label="值班日期" prop="time">
          <el-date-picker
            clearable
            size="mini"
            v-model="form.time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择值班日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="重量" prop="weight" size="mini">
          <el-input v-model="form.weight" placeholder="请输入重量" />
        </el-form-item>
        <el-form-item label="所属企业" prop="weight" size="mini">
          <el-select v-model="form.enterpriseId" placeholder="请选择公司名称">
            <el-option
              v-for="company in companyOptions"
              :key="company.id"
              :label="company.eName"
              :value="company.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属仓库" prop="weight" size="mini">
          <el-select v-model="form.warehouseId" placeholder="请选择仓库名称">
            <el-option
              v-for="item in depotNameOptions"
              :key="item.id"
              :label="item.wName"
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
  </div>
</template>

<script>
import {
  listBeltscale,
  getBeltscale,
  delBeltscale,
  addBeltscale,
  updateBeltscale,
  exportBeltscale,
} from "@/api/beltscale/beltscale";
import { depotList } from "@/api/depot/management";
import { listData } from "@/api/enterprise/qualification";
import SimpleKeyboard from "@/components/SimpleKeyboard/SimpleKeyboard";
export default {
  name: "Beltscale",
  components: {
    SimpleKeyboard,
  },
  data() {
    return {
      open: false,
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
      // 皮带秤表格数据
      beltscaleList: [],
      // 弹出层标题
      title: "",
      // 仓库名称列表
      depotNameOptions: [],
      // 公司名称
      companyOptions: [],
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        time: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        time: [{ required: true, message: "请选择日期", trigger: "blur" }],
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        team: [{ required: true, message: "请输入", trigger: "blur" }],
        warehouseId: [{ required: true, message: "请选择", trigger: "blur" }],
        enterpriseId: [{ required: true, message: "请选择", trigger: "blur" }],
        weight: [{ required: true, message: "请输入", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getdepotList();
    this.getlistData();
    this.getList();
  },
  methods: {
    /** 查询公司名称列表 */
    getlistData() {
      this.loading = true;
      listData().then((response) => {
        this.companyOptions = response.rows;
      });
    },
    /** 仓库名称列表 */
    getdepotList() {
      depotList().then((response) => {
        this.depotNameOptions = response.rows;
      });
    },
    /** 查询皮带秤列表 */
    getList() {
      this.loading = true;
      listBeltscale(this.queryParams).then((response) => {
        this.beltscaleList = response.rows;
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
        name: undefined,
        team: undefined,
        time: undefined,
        weight: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加皮带秤";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getBeltscale(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改皮带秤";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateBeltscale(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addBeltscale(this.form).then((response) => {
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
      this.$confirm('是否确认删除皮带秤编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delBeltscale(ids);
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
      this.$confirm("是否确认导出所有皮带秤数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportBeltscale(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    onChange(input) {
      this.queryParams.name = input;
    },
  },
};
</script>
<style lang="css" scoped>
.el-select {
  width: 100%;
}
</style>
