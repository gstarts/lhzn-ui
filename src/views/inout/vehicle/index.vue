<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="车牌号" prop="veLicenseNo">
        <el-input v-model="queryParams.veLicenseNo" size="mini"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="vehicleList">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="车牌号" align="center" prop="veLicenseNo" />
      <el-table-column label="进场时间" align="center" prop="veInTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.veInTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进场重量" align="center" prop="veInWeight"/>
      <el-table-column label="出场时间" align="center" prop="veOutTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.veOutTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出场重量" align="center" prop="veOutWeight" />

    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改进出场查询对话框 -->
  </div>
</template>

<script>
import {
  listVehicle,
  getVehicle,
  delVehicle,
  addVehicle,
  updateVehicle,
  exportVehicle
} from "@/api/inout/vehicle";
import { licenselist } from "@/api/vehicle/record";
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
      // 进出场查询表格数据
      vehicleList: [],
      //  车牌号列表
      vehiclelicenseOptions: [],
      // 车辆类型字典
      vehicleTypeOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        veLicenseNo: undefined,
        veType: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        areaId: [
          { required: true, message: "场站编号不能为空", trigger: "blur" }
        ],
        chnlNo: [
          { required: true, message: "通道编号不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_yes_no").then(response => {
      this.eIsMemberOptions = response.data;
    });
    this.getDicts("station_vehicle_type").then(response => {
      this.vehicleTypeOptions = response.data;
    });
    this.getvehiclelicenselist();
  },
  methods: {
    /** 查询车牌号列表 */
    getvehiclelicenselist() {
      licenselist(this.queryParams).then(response => {
        this.vehiclelicenseOptions = response.rows;
      });
    },
    /** 查询进出场查询列表 */
    getList() {
      this.loading = true;
      listVehicle(this.queryParams).then(response => {
        this.vehicleList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 进出标志翻译
    inoutFormat(row, column) {
      var str = "";
      if (row.iEFlag == "i") {
        str = "进场";
      } else {
        str = "出场";
      }
      return str;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        veLicenseNo: undefined,
        veType: undefined
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
      this.ids = selection.map(item => item.sessionId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加进出场查询";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const sessionId = row.sessionId || this.ids;
      getVehicle(sessionId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改进出场查询";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.sessionId != undefined) {
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
      const sessionIds = row.sessionId || this.ids;
      this.$confirm(
        '是否确认删除进出场查询编号为"' + sessionIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delVehicle(sessionIds);
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
      this.$confirm("是否确认导出所有进出场查询数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportVehicle(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>