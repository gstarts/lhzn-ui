<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="车牌号" prop="gVehicleId">
        <el-select v-model="queryParams.gVehicleId" placeholder="请选择" clearable size="small">
          <el-option
            v-for="dict in vehiclelicenseOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请通过" prop="gStatus">
        <el-select v-model="queryParams.gStatus" placeholder="请选择是否通过" clearable size="small">
          <el-option
            v-for="dict in gStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="批次号" prop="gBatchNo">
        <el-input
          v-model="queryParams.gBatchNo"
          placeholder="请输入批次号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
            <el-form-item label="提运单号" prop="gDeliveryNo">
        <el-input
          v-model="queryParams.gDeliveryNo"
          placeholder="请输入提运单号"
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
    <el-table v-loading="loading" :data="goodsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="车牌号" align="center" prop="vehicle.vLicense" />
      <el-table-column label="批次号" align="center" prop="gBatchNo"/>
      <el-table-column label="提运单号" align="center" prop="gDeliveryNo" />
      <el-table-column label="货物名称" align="center" prop="gName" />
      <el-table-column label="货物重量" align="center" prop="gWeight" />
      <el-table-column
        label="货物所在地"
        align="center"
        prop="gWarehouseId"
        :formatter="warehouseNameFormat"
      />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.gStatus=='1'"
            size="mini"
            type="text"
            @click="handleStatus(scope.row)"
            v-hasPermi="['inout:goods:remove']"
          >撤销</el-button>
          <el-button
            v-if="scope.row.gStatus!='1'"
            size="mini"
            type="text"
            @click="handleStatus(scope.row)"
            v-hasPermi="['inout:goods:remove']"
          >申请通过</el-button>
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

    <!-- 添加或修改进出场货物对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="车牌号" prop="gVehicleId">
              <el-select v-model="form.gVehicleId" placeholder="请选择" style="width:290px">
                <el-option
                  v-for="dict in vehiclelicenseOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货物名称" prop="gName">
              <el-input v-model="form.gName" placeholder="请输入货物名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="批次号" prop="gBatchNo">
              <el-input v-model="form.gBatchNo" placeholder="请输入批次号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="提运单号" prop="gDeliveryNo">
              <el-input v-model="form.gDeliveryNo" placeholder="请输入提运单号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位">
              <el-input v-model="form.gUnit" placeholder="请输入单位" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="重量" prop="gWeight">
              <el-input v-model="form.gWeight" placeholder="请输入重量" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="体积" prop="gVolume">
              <el-input v-model="form.gVolume" placeholder="请输入体积" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数量" prop="gNumber">
              <el-input v-model="form.gNumber" placeholder="请输入货物数量" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货物所在地" prop="gWarehouseId">
              <el-select v-model="form.gWarehouseId" placeholder="请选择">
                <el-option
                  v-for="item in depotNameOptions"
                  :key="item.id"
                  :label="item.wName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货物状态" prop="gIEStatus">
              <el-select v-model="form.gIEStatus" placeholder="请选择">
                <el-option
                  v-for="dict in goodsStatusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24"> 
            <el-form-item label="备注">
              <el-input type="textarea" v-model="form.gRemarks" placeholder="请输入内容" />
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
  listGoods,
  getGoods,
  delGoods,
  addGoods,
  updateGoods,
  exportGoods,
  consentApply,
  cancellationApply
} from "@/api/inout/goods";
import { licenselist } from "@/api/vehicle/record";
import { depotList } from "@/api/depot/management";
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
      // 进出场货物表格数据
      goodsList: [],
      //  车牌号列表
      vehiclelicenseOptions: [],
      // 进出场类型
      goodsTypeOptions: [],
      // 仓库名称列表
      depotNameOptions: [],
      // 记录完成情况字典
      gStatusOptions: [],
      // 货物出入库状态
      goodsStatusOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        gName: undefined,
        gWarehouseId: undefined,
        gStatus:undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        gVehicleId: [
          { required: true, trigger: "change", message: "车牌号不能为空" }
        ],
        gName: [
          { required: true, trigger: "change", message: "货物名称不能为空" }
        ],
        gWeight: [
          { required: true, trigger: "change", message: "重量不能为空" }
        ],
        gVolume: [
          { required: true, trigger: "change", message: "体积不能为空" }
        ],
        gNumber: [
          { required: true, trigger: "change", message: "数量不能为空" }
        ],
        gWarehouseId: [
          { required: true, trigger: "change", message: "货物所在地不能为空" }
        ],
        gIEStatus: [
          { required: true, trigger: "change", message: "货物状态不能为空" }
        ]
      }
    };
  },
  created() {
    this.getvehiclelicenselist();
    this.getDicts("station_in_out").then(response => {
      this.goodsTypeOptions = response.data;
    });

    this.getDicts("station_goods_status").then(response => {
      this.goodsStatusOptions = response.data;
    });

    this.getDicts("station_status_type").then(response => {
      this.gStatusOptions = response.data;
    });
    this.getdepotList();
    this.getList();
  },
  methods: {
    /** 仓库名称列表 */
    getdepotList() {
      depotList().then(response => {
        this.depotNameOptions = response.rows;
      });
    },
    /** 查询车牌号列表 */
    getvehiclelicenselist() {
      licenselist(this.queryParams).then(response => {
        this.vehiclelicenseOptions = response.rows;
      });
    },
    /** 查询进出场列表 */
    getList() {
      this.loading = true;
      listGoods(this.queryParams).then(response => {
        this.goodsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    goodsStatusFormat(row, column) {
      return this.selectDictLabel(this.goodsStatusOptions, row.gIEStatus);
    },
    gStatusFormat(row, column) {
      return this.selectDictLabel(this.gStatusOptions, row.gStatus);
    },
    // 仓库名称翻译
    warehouseNameFormat(row, column) {
      var value = row.gWarehouseId;
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        gVehicleId: undefined,
        gName: undefined,
        gUnit: undefined,
        gWeight: undefined,
        gVolume: undefined,
        gNumber: undefined,
        gWarehouseId: undefined,
        gIEStatus: undefined,
        gRemarks: undefined,
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
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getGoods(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改进出场货物";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateGoods(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addGoods(this.form).then(response => {
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
        /** 撤销申请按钮操作 */
    handleStatus(row) {
      if (row.gStatus == 0) {
        const id = row.id || this.ids;
        this.$confirm("确认本条申请已通过？", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(function() {
            return consentApply(id);
          })
          .then(() => {
            this.getList();
            this.msgSuccess("申请成功");
          })
          .catch(function() {});
          return;
      }
      const id = row.id || this.ids;
      this.$confirm("确认撤销本条已通过申请？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return cancellationApply(id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("撤销申请成功");
        })
        .catch(function() {});
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      if (row.gStatus != 0) {
        alert(row.gStatus);
        this.msgSuccess(
          "该记录状态为" + row.gStatus == 1
            ? "进行中"
            : "已完成" + "不能进行撤销操作"
        );
        return;
      }
      const ids = row.id || this.ids;
      this.$confirm("确定要撤销吗？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delGoods(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("撤销成功");
        })
        .catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有进出场货物数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportGoods(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>