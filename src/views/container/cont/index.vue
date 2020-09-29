<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="车牌号" prop="plate">
        <el-input
          v-model="queryParams.plate"
          placeholder="请输入车牌号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否在场" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态">
          <el-option
            v-for="dict in CancelOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue">
          </el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="录入时间" prop="inTime">
        <el-date-picker clearable size="small" style="width: 250px"
          v-model="dateRange"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00']">
        </el-date-picker>
        
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['container:container:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['container:container:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['container:container:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['container:container:export']"
        >导出</el-button>
      </el-col>
    </el-row> -->

    <el-table v-loading="loading" :data="containerList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="箱号" align="center" prop="code" />
      <el-table-column label="车牌号" align="center" prop="mhContainer.plate" />
      <el-table-column label="是否在场" align="center" prop="status" :formatter="eIsEnterpriseTypeFormat"/>
      <el-table-column label="承运单位" align="center" prop="mhContainer.carryingUnit" />
      <el-table-column label="进场时间" align="center" prop="inTime" >
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.inTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出场时间" align="center" prop="outTime" >
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.outTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['container:container:edit']"
            v-if="scope.row.mhContainer.decStatus != 1"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['container:container:remove']"
            v-if="scope.row.mhContainer.decStatus != 1 || scope.row.mhContainer.ieDirection == ''"
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

    <!-- 添加或修改集装箱管理Head对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="车牌号" prop="plate">
          <el-input v-model="form.plate" placeholder="请输入车牌号" />
        </el-form-item>
        <el-form-item label="承运单位" prop="carryingUnit">
          <el-input v-model="form.carryingUnit" placeholder="请输入承运单位" />
        </el-form-item>
        <el-form-item label="运输方式" prop="shipCode">
          <el-input v-model="form.shipCode" placeholder="请输入运输方式" />
        </el-form-item>
        <el-form-item label="录入人" prop="operator">
          <el-input v-model="form.operator" placeholder="请输入录入人" />
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
import { listContainer, getContainer, delContainer, addContainer, updateContainer, exportContainer } from "@/api/container/mdContainer";

export default {
  name: "Container",
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
      // 集装箱管理Head表格数据
      containerList: [],
      // 弹出层标题
      title: "",
      // 在场状态字典
      CancelOptions : [],
      // 日期范围
      dateRange:[],
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        plate: undefined,
        carryingUnit: undefined,
        shipCode: undefined,
        operator: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    /** 在场字典配置 */
    this.getDicts("is_present").then(response => {
      this.CancelOptions = response.data;
    });
  },
  methods: {
    /** 查询集装箱管理Head列表 */
    getList() {
      this.loading = true;
      listContainer(this.addDateRange(this.queryParams,this.dateRange)).then(response => {
        this.containerList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 在场字典翻译
    eIsEnterpriseTypeFormat(row, column) {
      return this.selectDictLabel(this.CancelOptions, row.status);
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
        plate: undefined,
        carryingUnit: undefined,
        shipCode: undefined,
        operator: undefined,
        remark: undefined
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
      this.dateRange = [];
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
      this.title = "添加集装箱管理Head";
    },
    // /** 修改按钮操作 */
    // handleUpdate(row) {
    //   this.reset();
    //   const id = row.id || this.ids
    //   getContainer(id).then(response => {
    //     this.form = response.data;
    //     this.open = true;
    //     this.title = "修改集装箱管理Head";
    //   });
    // },
    /**修改按钮 */
    handleUpdate(row) {
      this.reset();
      const id = row.headId || this.headId;
      this.$router.push({ path: "/contList/edit", query: { tableId: id } });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateContainer(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addContainer(this.form).then(response => {
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
      this.$confirm('是否确认删除集装箱管理Head编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delContainer(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有集装箱管理Head数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportContainer(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>