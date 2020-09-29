<template>
  <div class="app-container">
    <!-- <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="车牌号" prop="plate">
        <el-input
          v-model="queryParams.plate"
          placeholder="请输入车牌号"
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
      <el-form-item label="运输方式" prop="shipCode">
        <el-input
          v-model="queryParams.shipCode"
          placeholder="请输入运输方式"
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
    </el-form>-->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="clearall"
          v-hasPermi="['waybill:head:clear']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          @click="submitHeadForm()"
          v-hasPermi="['waybill:head:add']"
        >暂存</el-button>
      </el-col>
    </el-row>
    <!-- 提运单表头 -->
    <el-form ref="form" :model="form" label-width="150px" size="mini">
      <el-row>
        <el-col :span="6">
          <el-form-item label="车牌号" prop="plate">
            <el-input v-model="form.plate" placeholder="请输入车牌号" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="承运单位" prop="carryingUnit">
            <el-input v-model="form.carryingUnit" placeholder="请输入承运单位" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="运输方式" prop="shipCode">
            <el-select v-model="form.shipCode" placeholder="请选择运输方式">
              <el-option
                v-for="dict in CancelOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="录入人" prop="operator">
            <el-input v-model="form.operator" placeholder="系统反填" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="申报状态" prop="decStatus">
            <el-select v-model="form.decStatus" placeholder="系统反填">
              <el-option
                v-for="dict in CtatusDeclear"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="进出场方向" prop="ieDirection">
            <el-select v-model="form.ieDirection" placeholder="系统反填">
              <el-option
                v-for="dict in IeDirectionDeclear"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入备注信息" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="clearBody"
          v-hasPermi="['container:container:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          @click="submitBodyForm"
          v-hasPermi="['container:container:edit']"
        >暂存</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['container:container:remove']"
        >删除</el-button>
      </el-col>-->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['container:container:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <!-- 集装箱列表 -->

    <el-table :data="containerList" height="260px" @cell-dblclick="doubleClick">
      <el-table-column label="箱号" align="center" prop="code" />
      <el-table-column label="尺寸类型" align="center" prop="sizeCode" />
      <el-table-column label="来源" align="center" prop="fromCode" />
      <el-table-column label="自重" align="center" prop="weight" />
    </el-table>
    <!-- <el-table v-loading="loading" :data="containerList">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="录入人" align="center" prop="id" />
      <el-table-column label="车牌号" align="center" prop="plate" />
      <el-table-column label="承运单位" align="center" prop="carryingUnit" />
      <el-table-column label="运输方式" align="center" prop="shipCode" />
      <el-table-column label="录入人" align="center" prop="operator" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['container:container:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['container:container:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>-->

    <!-- 小提煤单按钮 -->
    <div class="app-container">
      <el-form :model="smallform" ref="smallForm" label-width="140px" size="mini">
        <el-row>
          <el-col :span="6">
            <el-form-item label="箱号" prop="code">
              <el-input v-model="smallform.code" placeholder="请输入箱号" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="尺寸类型" prop="sizeCode">
              <el-input v-model="smallform.sizeCode" placeholder="请输入尺寸" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="来源" prop="fromCode">
              <el-input v-model="smallform.fromCode" placeholder="请输入来源" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="自重" prop="weight">
              <el-input v-model="smallform.weight" placeholder="请输入重量" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否在场" prop="status" v-if="smallform.status != null">
              <el-select v-model="smallform.status" placeholder disabled>
                <el-option
                  v-for="dict in IsPresent"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="进场时间" prop="inTime" v-if="smallform.inTime != null">
              <el-input v-model="smallform.inTime" placeholder disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出场时间" prop="outTime" v-if="smallform.outTime != null">
              <el-input v-model="smallform.outTime" placeholder disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="smallform.remark" placeholder="请输入备注信息" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />-->

    <!-- 添加或修改集装箱管理Head对话框 -->
    <!-- <el-dialog :title="title" :visible.sync="open" width="500px">
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
    </el-dialog>-->
  </div>
</template>

<script>
import {
  listContainer,
  getContainer,
  getdelContainerInfoBody,
  delContainer,
  addContainer,
  init,
  updateBody,
  addBody,
  getBody,
  updateContainer,
  exportContainer,
  getdelContainerInfo
} from "@/api/container/container";

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
      // 作废状态字典
      CancelOptions: [],
      // 申报状态字典
      CtatusDeclear: [],
      //进出场方向字典
      IeDirectionDeclear: [],
      //是否在场字典
      IsPresent: [],
      // 总条数
      total: 0,
      // 集装箱表格数据
      containerList: [],
      // 弹出层标题
      title: "",
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
        status: undefined,
        remark: undefined,
        inTime: undefined,
        outTime: undefined,
        decStatus: undefined,
        ieDirection: undefined
      },
      // 表单参数
      form: {},
      smallform: {},
      // 表单校验
      rules: {}
    };
  },
  created() {
    // this.getList();

    const { tableId } = this.$route.query;
    if (tableId) {
      this.id = tableId;
      // 获取表详细信息
      getdelContainerInfo(tableId).then(res => {
        this.form = res.data.info;

        this.containerList = res.data.rows;
      });
    } else {
      this.initialization();
    }

    /** 作废字典配置 */
    this.getDicts("station_transport_fashion").then(response => {
      this.CancelOptions = response.data;
    });

    /** 申报状态字典配置 */
    this.getDicts("declear_status").then(response => {
      this.CtatusDeclear = response.data;
    });
    /** 进出场方向字典配置 */
    this.getDicts("station_IO_flag").then(response => {
      this.IeDirectionDeclear = response.data;
    });
    /** 申报状态字典配置 */
    this.getDicts("is_present").then(response => {
      this.IsPresent = response.data;
    });
  },
  methods: {
    /** 查询集装箱管理Head列表 */
    getList() {
      this.loading = true;
      getdelContainerInfoBody(this.form.id).then(response => {
        this.form = response.data.info;
        this.containerList = response.data.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /**清空车辆信息 */
    clearall: function() {
      this.clearHead();
      this.clearBody();
      this.initialization();
      this.containerList = [];
    },
    // 清空车辆输入栏
    clearHead() {
      this.form = {
        plate: undefined,
        carryingUnit: undefined,
        shipCode: undefined,
        operator: undefined,
        decStatus: undefined,
        ieDirection: undefined,
        resetForm: undefined
      };
    },
    // 重置集装箱表体信息
    clearBody() {
      this.smallform = {
        code: undefined,
        sizeCode: undefined,
        fromCode: undefined,
        weight: undefined,
        status: undefined,
        remark: undefined,
        inTime: undefined,
        outTime: undefined
      };
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
      this.smallform = {
        headId: undefined,
        code: undefined,
        sizeCode: undefined,
        fromCode: undefined,
        weight: undefined,
        status: undefined,
        remark: undefined,
        inTime: undefined,
        outTime: undefined
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
      this.title = "添加集装箱管理Head";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getContainer(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改集装箱管理Head";
      });
    },
    /** 表头提交按钮 */
    submitHeadForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          addContainer(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess(response.msg);
              this.open = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },
    /** 表体提交按钮 */
    submitBodyForm: function() {
      this.$refs["smallForm"].validate(valid => {
        if (valid) {
          if (this.smallform.id != undefined) {
            updateBody(this.smallform).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.clearBody();
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addBody(this.smallform).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.clearBody();
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 行点击按钮 */
    doubleClick(row, column, cell, event) {
      if (row.id != undefined) {
        getBody(row.id).then(res => {
          if (res.code === 200) {
            this.smallform = res.data;
            this.resetForm("smallform");
          }
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除集装箱管理Head编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delContainer(ids);
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
      this.$confirm("是否确认导出所有集装箱管理Head数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportContainer(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    },
    /**页面初始化数据 */
    initialization() {
      init().then(response => {
        this.form = response.data;
        this.containerList = response.rows;
        this.queryParams.id = this.form.id;
        this.smallform.headId = this.form.id;
        this.queryParams.headId = this.form.id;
        this.form.ieDirection = "I";
      });
    }
  }
};
</script>