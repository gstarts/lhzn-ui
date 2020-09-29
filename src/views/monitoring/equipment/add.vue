<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--通道数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="chnlId"
            placeholder="请输入通道名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="chnlOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!-- 通道基本信息 -->
      <el-col :span="20" :xs="24" v-if="show">
        <el-table :data="chnlConfigList" @selection-change="handleSelectionChange">
          <el-table-column label="通道名称" align="center" prop="cChnlName" />
          <el-table-column
            label="通道类型"
            align="center"
            prop="cChnlType"
            :formatter="chnlTypeFormat"
          />
          <el-table-column
            label="车道方向"
            align="center"
            prop="cChnlDirection"
            :formatter="directionFormat"
          />
          <el-table-column label="通道状态停用/启用" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="handleChnlUpdate(scope.row)"
                v-hasPermi="['chnl:config:query']"
              >修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <!--设备数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <el-form-item label="设备状态" prop="equipmentStatus">
            <el-select
              v-model="queryParams.equipmentStatus"
              placeholder="设备状态"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
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
              v-if="chnlshow"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAddChnl"
              v-hasPermi="['chnl:config:add']"
            >新增通道</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-if="show"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAddEquipment"
              v-hasPermi="['monitor:device:add']"
            >新增设备</el-button>
          </el-col>
        </el-row>
        <el-table v-loading="loading" :data="chnlList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column label="通道名称" align="center" prop="chnlName" />
          <el-table-column
            label="设备名称"
            align="center"
            prop="equipmentType"
            :formatter="equipmenFormat"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="设备地址"
            align="center"
            prop="equipmentAddr"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="设备参数" align="center" prop="equipmentParm" />
          <el-table-column
            label="设备状态"
            align="center"
            prop="equipmentStatus"
            :formatter="statusFormat"
          />
          <el-table-column
            label="操作"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="handleEqmUpdate(scope.row)"
                v-hasPermi="['monitor:device:query']"
              >修改</el-button>
              <el-button
                type="warning"
                icon="el-icon-warning"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['monitor:device:rstatr']"
              >重启</el-button>
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
      </el-col>
    </el-row>
    <!-- 通道添加对话框 -->
    <el-dialog :title="title" :visible.sync="chnlopen" width="500px">
      <el-form ref="chnlform" :model="chnlform" :rules="chnlrules" label-width="80px">
        <el-form-item label="通道编号" prop="cChnlNo">
          <el-input v-model="chnlform.cChnlNo" placeholder="请输入通道编号" />
        </el-form-item>
        <el-form-item label="通道名称" prop="cChnlName">
          <el-input v-model="chnlform.cChnlName" placeholder="请输入通道名称" />
        </el-form-item>
        <el-form-item label="车道类型">
          <el-select v-model="chnlform.cChnlType" placeholder="请选择车道类型">
            <el-option
              v-for="dict in chnlTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车道方向">
          <el-select v-model="chnlform.cChnlDirection" placeholder="请选择方向">
            <el-option
              v-for="dict in vehIoOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="chnlform.status">
            <el-radio
              v-for="dict in chnlStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitChnlForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 设备添加对话框 -->
    <el-dialog :title="title" :visible.sync="eqmopen" width="1000px">
      <el-form ref="eqmform" :model="eqmform" :rules="eqmrules" label-width="90px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备地址" prop="equipmentAddr">
              <el-input v-model="eqmform.equipmentAddr" placeholder="请输入通道编号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备参数" prop="equipmentParm">
              <el-input v-model="eqmform.equipmentParm" placeholder="请输入通道名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备名称">
              <el-select v-model="eqmform.equipmentType" placeholder="请选择设备">
                <el-option
                  v-for="dict in equipmenOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 当选择为 地感线圈 和栏杆机 防跟车 时显示 -->
        <el-row
          v-if="eqmform.equipmentType=='7' || eqmform.equipmentType=='6' ||  eqmform.equipmentType=='10' "
        >
          <el-col :span="6">
            <el-form-item label="超时" prop="dwtimeout">
              <el-input v-model="eqmform.dwtimeout" placeholder="请设置设备超时时间" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备密码" prop="password">
              <el-input v-model="eqmform.password" placeholder="请输入设备密码" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 当选择为 车牌识别 -->
        <el-row v-if="eqmform.equipmentType=='1'">
          <el-col :span="8">
            <el-form-item label="设备账号" prop="veuser">
              <el-input v-model="eqmform.veuser" placeholder="请输入设备密码" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备密码" prop="vepwd">
              <el-input v-model="eqmform.vepwd" placeholder="请输入设备密码" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="等待时间" prop="vetimeout">
              <el-input v-model="eqmform.vetimeout" placeholder="请设置设备超时时间" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 当选择为 地秤时显示 -->
        <el-row v-if="eqmform.equipmentType=='4'">
          <el-col :span="8">
            <el-form-item label="设备等待时间" prop="wtwaittime">
              <el-input v-model="eqmform.wtwaittime" placeholder="请设置设备超时时间" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 当选择为 LED时显示 -->
        <el-row v-if="eqmform.equipmentType=='8' ||  eqmform.equipmentType=='9'">
          <el-col :span="12">
            <el-form-item label="LED第一行" prop="equipmentValue1">
              <el-input v-model="eqmform.equipmentValue1" placeholder="请设置显示信息" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="LED第二行" prop="equipmentValue2">
              <el-input v-model="eqmform.equipmentValue2" placeholder="请设置显示信息" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 当选择为 电子车牌时显示 -->
        <el-row v-if="eqmform.equipmentType=='2'">
          <el-col :span="12">
            <el-form-item label="HOSTIP" prop="hostip">
              <el-input v-model="eqmform.hostip" placeholder="输入IP地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="HOSTPORT" prop="hostport">
              <el-input v-model="eqmform.hostport" placeholder="请输入设备HOST参数" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态" prop="equipmentStatus">
          <el-radio-group v-model="eqmform.equipmentStatus">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submiteqmForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {
  chnllist,
  listEquipment,
  restart,
  Stationchnllist,
  updateeEqmConfig,
  addEqmConfig,
  getEqmInfo,
  updateEqmConfig
} from "@/api/monitoring/equipment";
import {
  getChnlConfig,
  changechnlStatus,
  addChnlConfig,
  updateChnlConfig
} from "@/api/monitoring/chnlConfig";
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
      // 用户表格数据
      chnlList: null,
      // 弹出层标题
      title: "",
      // 显示通道信息
      show: false,
      // 显示通道新增按钮
      chnlshow: false,
      chnlopen: false,
      eqmopen: false,
      // 通道信息
      chnlConfigList: [],
      // 通道树选项
      chnlOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 通道名称
      chnlId: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 设备状态数据字典
      statusOptions: [],
      // 性别状态字典
      equipmenOptions: [],
      // 通道类型字典
      chnlTypeOptions: [],
      // 车辆进出方向字典
      vehIoOptions: [],
      // 通道状态字典类型
      chnlStatusOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      // 通道表单参数
      chnlform: {},
      // 设备表单参数
      eqmform: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        equipmentStatus: undefined,
        chnlId: undefined,
        stationId: undefined
      },
      //中间参数
      tempParams: {
        chnlId: undefined,
        stationId: undefined
      },
      // 通道提交表单校验
      chnlrules: [],
      // 设备提交表单校验
      eqmrules: []
    };
  },
  watch: {
    // 根据名称筛选通道树
    chnlId(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getTreeselect();
    this.getDicts("chnl_equipment_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("chnl_equipment_type").then(response => {
      this.equipmenOptions = response.data;
    });
    this.getDicts("station_chnl_type").then(response => {
      this.chnlTypeOptions = response.data;
    });
    this.getDicts("sys_normal_disable").then(response => {
      this.chnlStatusOptions = response.data;
    });

    this.getDicts("station_IO_flag").then(response => {
      this.vehIoOptions = response.data;
    });
  },
  methods: {
    /** 查询设备列表 */
    getList() {
      this.loading = true;
      listEquipment(this.queryParams).then(response => {
        this.chnlList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询通道下拉树结构 */
    getTreeselect() {
      Stationchnllist().then(response => {
        this.chnlOptions = response.data;
      });
    },
    // 通道类型翻译
    chnlTypeFormat(row, column) {
      return this.selectDictLabel(this.chnlTypeOptions, row.cChnlType);
    },
    // 设备类型翻译
    equipmenFormat(row, column) {
      return this.selectDictLabel(this.equipmenOptions, row.equipmentType);
    },
    //设备状态
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.equipmentStatus);
    },
    // 车道方向翻译
    directionFormat(row, column) {
      return this.selectDictLabel(this.vehIoOptions, row.cChnlDirection);
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data, node) {
      console.log(data.id);
      // 判断是否选中的为LH
      if (data.id == -1) {
        this.show = false;
        this.chnlshow = false;
        this.queryParams.chnlId = undefined;
        this.queryParams.stationId = undefined;
        this.getList();
        return;
      }
      let parentData = node.childNodes.length;
      if (parentData == 0) {
        // 代表该节点为叶子节点，即为通道号
        this.queryParams.stationId = undefined;
        this.chnlshow = false;
        this.show = true;
        // 获取该通道的详细信息
        this.getchnlinfo(data.id);
        this.queryParams.chnlId = data.id;
        this.tempParams.chnlId = data.id;
      } else {
        // 清空参数中通道信息
        this.queryParams.chnlId = undefined;
        this.show = false;
        this.chnlshow = true;
        this.queryParams.stationId = data.id;
        this.tempParams.stationId = data.id;
      }
      this.getList();
    },
    // 通道信息
    getchnlinfo(id) {
      this.chnlConfigList = [];
      getChnlConfig(id).then(response => {
        if ((response.code = "200")) {
          this.show = true;
          var arr = [];
          arr.push(response.data);
          this.chnlConfigList = arr;
        }
      });
    },
    // 通道状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm('确认要"' + text + row.cChnlName + '"通道吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return changechnlStatus(row.id, row.status);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.eqmopen = false;
      this.chnlopen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        status: "0"
      };
      this.chnlform = {
        status: "1"
      };
      this.eqmform = {
        equipmentStatus: "0"
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
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
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增通道按钮操作 */
    handleAddChnl() {
      this.reset();
      this.chnlopen = true;
      this.title = "添加通道配置";
      this.chnlform.stationId = this.tempParams.stationId;
    },
    /** 新增设备按钮操作 */
    handleAddEquipment() {
      this.reset();
      this.eqmopen = true;
      this.title = "添加设备配置";
    },
    // 新增设备对话框确定按钮
    submiteqmForm() {
      this.$refs["eqmform"].validate(valid => {
        if (valid) {
          if (this.eqmform.id != undefined) {
            updateEqmConfig(this.eqmform).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.eqmopen = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            this.eqmform.chnlId = this.tempParams.chnlId;
            addEqmConfig(this.eqmform).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.eqmopen = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    // 新增通道对话框确定按钮
    submitChnlForm() {
      this.$refs["chnlform"].validate(valid => {
        if (valid) {
          if (this.chnlform.id != undefined) {
            updateChnlConfig(this.chnlform).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.chnlopen = false;
                this.getTreeselect();
                this.getchnlinfo(this.chnlform.id);
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            this.chnlform.stationId = this.tempParams.stationId;
            addChnlConfig(this.chnlform).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.chnlopen = false;
                this.getTreeselect();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    
    /** 设备修改按钮操作 */
    handleEqmUpdate(row) {
      this.reset();
      console.log(row.id);
      this.getList();
      getEqmInfo(row.id).then(response => {
        this.eqmform = response.data;
        this.eqmopen = true;
        this.title = "修改设备信息";
      });
    },

    /**通道配置修改 */
    handleChnlUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getChnlConfig(id).then(response => {
        this.chnlform = response.data;
        this.chnlopen = true;
        this.title = "修改通道配置";
      });
    },

    /** 重启按钮操作 */
    handleUpdate(row) {
      const equipmentid = row.id || this.ids;
      this.$confirm("是否确认重启设备", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return restart(equipmentid);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("操作成功");
        })
        .catch(function() {});
    }
  }
};
</script>