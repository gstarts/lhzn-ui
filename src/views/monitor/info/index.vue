<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="90px">
      <el-form-item label="场站名称" prop="stationName">
        <el-input
          v-model="queryParams.stationName"
          placeholder="请输入场站名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申报地海关" prop="customsmaster">
        <el-input
          v-model="queryParams.customsmaster"
          placeholder="请输入申报地海关"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="组织机构代码" prop="contractorcode">
        <el-input
          v-model="queryParams.contractorcode"
          placeholder="请输入组织机构代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="统一社会信用代码" prop="contractorcodescc">
        <el-input
          v-model="queryParams.contractorcodescc"
          placeholder="请输入统一社会信用代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="作业场所编号" prop="supvloctcode">
        <el-input
          v-model="queryParams.supvloctcode"
          placeholder="请输入作业场所编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="操作人ID" prop="opuserid">
        <el-input
          v-model="queryParams.opuserid"
          placeholder="请输入操作人ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="发送ID" prop="senderid">
        <el-input
          v-model="queryParams.senderid"
          placeholder="请输入发送ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="接收ID" prop="receiverid">
        <el-input
          v-model="queryParams.receiverid"
          placeholder="请输入接收ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="接口协议版本号" prop="version">
        <el-input
          v-model="queryParams.version"
          placeholder="请输入接口协议版本号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
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
          v-hasPermi="['monitor:info:add']"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['monitor:info:edit']"
        >修改</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['monitor:info:del']"
        >删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['monitor:info:export']"
        >导出</el-button>
      </el-col> -->
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="接口协议版本号" align="center" prop="id" /> -->
      <el-table-column label="场站名称" align="center" prop="stationName" />
      <el-table-column label="申报地海关" align="center" prop="customsmaster" />
      <el-table-column label="组织机构代码" align="center" prop="contractorcode" />
      <el-table-column label="统一社会信用代码" align="center" prop="contractorcodescc" />
      <el-table-column label="作业场所编号" align="center" prop="supvloctcode" />
      <el-table-column label="操作人ID" align="center" prop="opuserid" />
      <el-table-column label="发送ID" align="center" prop="senderid" />
      <el-table-column label="接收ID" align="center" prop="receiverid" />
      <el-table-column label="接口协议版本号" align="center" prop="version" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['monitor:info:update']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['monitor:info:del']"
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

    <!-- 添加或修改场站管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="场站名称" prop="stationName">
          <el-input v-model="form.stationName" placeholder="请输入场站名称" />
        </el-form-item>
        <el-form-item label="申报地海关" prop="customsmaster">
          <el-input v-model="form.customsmaster" placeholder="请输入申报地海关" />
        </el-form-item>
        <el-form-item label="组织机构代码" prop="contractorcode">
          <el-input v-model="form.contractorcode" placeholder="请输入组织机构代码" />
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="contractorcodescc">
          <el-input v-model="form.contractorcodescc" placeholder="请输入统一社会信用代码" />
        </el-form-item>
        <el-form-item label="作业场所编号" prop="supvloctcode">
          <el-input v-model="form.supvloctcode" placeholder="请输入作业场所编号" />
        </el-form-item>
        <el-form-item label="操作人ID" prop="opuserid">
          <el-input v-model="form.opuserid" placeholder="请输入操作人ID" />
        </el-form-item>
        <el-form-item label="发送ID" prop="senderid">
          <el-input v-model="form.senderid" placeholder="请输入发送ID" />
        </el-form-item>
        <el-form-item label="接收ID" prop="receiverid">
          <el-input v-model="form.receiverid" placeholder="请输入接收ID" />
        </el-form-item>
        <el-form-item label="接口协议版本号" prop="version">
          <el-input v-model="form.version" placeholder="请输入接口协议版本号" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <input type="hidden" name="Rate" id="Rate" value="" />
  </div>
</template>

<script>
import { listInfo, getInfo, delInfo, addInfo, updateInfo, exportInfo } from "@/api/monitor/info";

export default {
  name: "Info",
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
      infoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stationName: undefined,
        customsmaster: undefined,
        contractorcode: undefined,
        contractorcodescc: undefined,
        supvloctcode: undefined,
        // opuserid: undefined,
        // senderid: undefined,
        // receiverid: undefined,
        // version: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        stationName: [
          { required: true, trigger: "change", message: "场站名称不能为空" }
        ],
        customsmaster: [
          { required: true, trigger: "change", message: "申报地海关名称不能为空" }
        ],
        wMeasure: [
          { required: true, trigger: "change", message: "" }
        ],
        wAddr: [
          { required: true, trigger: "change", message: "" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows;
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
        stationName: undefined,
        customsmaster: undefined,
        contractorcode: undefined,
        contractorcodescc: undefined,
        supvloctcode: undefined,
        opuserid: undefined,
        senderid: undefined,
        receiverid: undefined,
        version: undefined
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加场站管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改场站管理";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addInfo(this.form).then(response => {
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
      this.$confirm('是否确认删除【请填写功能名称】编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有【请填写功能名称】数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>