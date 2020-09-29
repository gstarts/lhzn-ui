<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="大提煤单号" prop="coalNumber">
        <el-input
          v-model="queryParams.coalNumber"
          placeholder="请输入大提煤单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车号" prop="plate">
        <el-input
          v-model="queryParams.plate"
          placeholder="请输入车号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="承运单位" prop="carryingUnit">
        <el-input
          v-model="queryParams.carryingUnit"
          placeholder="请输入承运单位"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否称重完成标示" prop="finished">
        <el-input
          v-model="queryParams.finished"
          placeholder="请输入是否称重完成标示"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="录入时间" prop="dateTime">
        <el-input
          v-model="queryParams.dateTime"
          placeholder="请输入录入时间"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="完成称重时间" prop="dateTimeFinished">
        <el-input
          v-model="queryParams.dateTimeFinished"
          placeholder="请输入完成称重时间"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="称重重量-实际" prop="weight">
        <el-input
          v-model="queryParams.weight"
          placeholder="请输入称重重量-实际"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="打印次数" prop="printTimes">
        <el-input
          v-model="queryParams.printTimes"
          placeholder="请输入打印次数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="作废标示" prop="spoilt">
        <el-input
          v-model="queryParams.spoilt"
          placeholder="请输入作废标示"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="司机姓名" prop="driver">
        <el-input
          v-model="queryParams.driver"
          placeholder="请输入司机姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="装载地点" prop="loadPlace">
        <el-input
          v-model="queryParams.loadPlace"
          placeholder="请输入装载地点"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="装载地点" prop="sn">
        <el-input
          v-model="queryParams.sn"
          placeholder="请输入装载地点"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input
          v-model="queryParams.remarks"
          placeholder="请输入备注"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="录入人" prop="operator">
        <el-input
          v-model="queryParams.operator"
          placeholder="请输入录入人"
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
          v-hasPermi="['coal:plate:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['coal:plate:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['coal:plate:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['coal:plate:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="plateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="录入人" align="center" prop="id" />
      <el-table-column label="大提煤单号" align="center" prop="coalNumber" />
      <el-table-column label="车号" align="center" prop="plate" />
      <el-table-column label="承运单位" align="center" prop="carryingUnit" />
      <el-table-column label="是否称重完成标示" align="center" prop="finished" />
      <el-table-column label="录入时间" align="center" prop="dateTime" />
      <el-table-column label="完成称重时间" align="center" prop="dateTimeFinished" />
      <el-table-column label="称重重量-实际" align="center" prop="weight" />
      <el-table-column label="打印次数" align="center" prop="printTimes" />
      <el-table-column label="作废标示" align="center" prop="spoilt" />
      <el-table-column label="司机姓名" align="center" prop="driver" />
      <el-table-column label="电话" align="center" prop="phone" />
      <el-table-column label="装载地点" align="center" prop="loadPlace" />
      <el-table-column label="装载地点" align="center" prop="sn" />
      <el-table-column label="备注" align="center" prop="remarks" />
      <el-table-column label="录入人" align="center" prop="operator" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['coal:plate:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['coal:plate:remove']"
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

    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="大提煤单号" prop="coalNumber">
          <el-input v-model="form.coalNumber" placeholder="请输入大提煤单号" />
        </el-form-item>
        <el-form-item label="车号" prop="plate">
          <el-input v-model="form.plate" placeholder="请输入车号" />
        </el-form-item>
        <el-form-item label="承运单位" prop="carryingUnit">
          <el-input v-model="form.carryingUnit" placeholder="请输入承运单位" />
        </el-form-item>
        <el-form-item label="是否称重完成标示" prop="finished">
          <el-input v-model="form.finished" placeholder="请输入是否称重完成标示" />
        </el-form-item>
        <el-form-item label="录入时间" prop="dateTime">
          <el-input v-model="form.dateTime" placeholder="请输入录入时间" />
        </el-form-item>
        <el-form-item label="完成称重时间" prop="dateTimeFinished">
          <el-input v-model="form.dateTimeFinished" placeholder="请输入完成称重时间" />
        </el-form-item>
        <el-form-item label="称重重量-实际" prop="weight">
          <el-input v-model="form.weight" placeholder="请输入称重重量-实际" />
        </el-form-item>
        <el-form-item label="打印次数" prop="printTimes">
          <el-input v-model="form.printTimes" placeholder="请输入打印次数" />
        </el-form-item>
        <el-form-item label="作废标示" prop="spoilt">
          <el-input v-model="form.spoilt" placeholder="请输入作废标示" />
        </el-form-item>
        <el-form-item label="司机姓名" prop="driver">
          <el-input v-model="form.driver" placeholder="请输入司机姓名" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="装载地点" prop="loadPlace">
          <el-input v-model="form.loadPlace" placeholder="请输入装载地点" />
        </el-form-item>
        <el-form-item label="装载地点" prop="sn">
          <el-input v-model="form.sn" placeholder="请输入装载地点" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" placeholder="请输入备注" />
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
import { listPlate, getPlate, delPlate, addPlate, updatePlate, exportPlate } from "@/api/coal/plate";

export default {
  name: "Plate",
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
      plateList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        coalNumber: undefined,
        plate: undefined,
        carryingUnit: undefined,
        finished: undefined,
        dateTime: undefined,
        dateTimeFinished: undefined,
        weight: undefined,
        printTimes: undefined,
        spoilt: undefined,
        driver: undefined,
        phone: undefined,
        loadPlace: undefined,
        sn: undefined,
        remarks: undefined,
        operator: undefined
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
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      listPlate(this.queryParams).then(response => {
        this.plateList = response.rows;
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
        coalNumber: undefined,
        plate: undefined,
        carryingUnit: undefined,
        finished: undefined,
        dateTime: undefined,
        dateTimeFinished: undefined,
        weight: undefined,
        printTimes: undefined,
        spoilt: undefined,
        driver: undefined,
        phone: undefined,
        loadPlace: undefined,
        sn: undefined,
        remarks: undefined,
        operator: undefined
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
      this.title = "添加【请填写功能名称】";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPlate(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改【请填写功能名称】";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updatePlate(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addPlate(this.form).then(response => {
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
          return delPlate(ids);
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
          return exportPlate(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>